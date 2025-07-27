import { OpenAIEmbeddings } from '@langchain/openai';
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { Document } from '@langchain/core/documents';
import { TokenTextSplitter, MarkdownTextSplitter } from '@langchain/textsplitters';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname } from 'node:path';
import frontMatter from 'front-matter';
import type { CompiledFile } from './mdx-compiler.js';
import { VersionManager } from './version-manager.js';

interface DocumentMetadata {
  filePath: string;
  title?: string;
  section?: string;
  version: string;
  relativePath: string;
  chunkIndex: number;
}

export class Vectorizer {
  private embeddings: OpenAIEmbeddings;
  private tokenSplitter: TokenTextSplitter;
  private markdownSplitter: MarkdownTextSplitter;
  private verbose: boolean;
  private readonly MAX_TOKENS = 2000;
  private readonly OVERLAP_TOKENS = 200;

  constructor(verbose = false) {
    this.verbose = verbose;
    
    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required for vectorization');
    }

    this.embeddings = new OpenAIEmbeddings({
      modelName: 'text-embedding-3-large',
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    // Initialize token-based splitter for accurate 2000-token chunks
    this.tokenSplitter = new TokenTextSplitter({
      chunkSize: this.MAX_TOKENS,
      chunkOverlap: this.OVERLAP_TOKENS,
      encodingName: "cl100k_base", // GPT-4 encoding for accurate token counting
    });

    // Initialize markdown-aware splitter for structure preservation
    this.markdownSplitter = new MarkdownTextSplitter({
      chunkSize: this.MAX_TOKENS,
      chunkOverlap: this.OVERLAP_TOKENS,
    });
  }

  /**
   * Extract title from frontmatter or content
   */
  private extractTitle(content: string): string | undefined {
    try {
      const { attributes } = frontMatter(content);
      const attrs = attributes as Record<string, any>;
      
      return attrs.title || attrs.heading || undefined;
    } catch {
      // Fallback: try to find first H1 heading
      const h1Match = content.match(/^#\s+(.+)$/m);
      return h1Match?.[1]?.trim();
    }
  }

  /**
   * Split content using token-based chunking with markdown structure preservation
   */
  private async chunkContent(content: string, title: string): Promise<Array<{ section: string; content: string }>> {
    if (this.verbose) {
      console.log(`📄 Processing document for chunking: ${title}`);
    }
    
    try {
      // Try markdown-aware splitting first (preserves structure)
      const chunks = await this.markdownSplitter.splitText(content);
      
      if (this.verbose) {
        console.log(`✅ Markdown splitting successful: ${chunks.length} chunks for ${title}`);
      }
      
      return this.formatChunks(chunks, title);
    } catch (error) {
      if (this.verbose) {
        console.log(`⚠️  Markdown splitting failed for ${title}, falling back to token splitting:`, error);
      }
      
      // Fallback to token-based splitting
      const chunks = await this.tokenSplitter.splitText(content);
      
      if (this.verbose) {
        console.log(`✅ Token splitting successful: ${chunks.length} chunks for ${title}`);
      }
      
      return this.formatChunks(chunks, title);
    }
  }

  /**
   * Format chunks with section names and validate content
   */
  private formatChunks(chunks: string[], title: string): Array<{ section: string; content: string }> {
    return chunks.map((chunk, index) => {
      const trimmedChunk = chunk.trim();
      
      // Try to extract section name from chunk content
      const headerMatch = trimmedChunk.match(/^#{1,6}\s+(.+)$/m);
      const sectionName = headerMatch?.[1]?.trim() ?? `${title} (Part ${index + 1})`;
      
      if (this.verbose && index === 0) {
        console.log(`📊 First chunk token estimate: ~${Math.ceil(trimmedChunk.length / 4)} tokens`);
      }
      
      return {
        section: sectionName,
        content: trimmedChunk
      };
    });
  }

  /**
   * Convert compiled files to LangChain Documents with intelligent chunking
   */
  private async convertToDocuments(compiledFiles: Map<string, CompiledFile>, version: string): Promise<Document[]> {
    const documents: Document[] = [];

    for (const [relativePath, compiledFile] of compiledFiles) {
      try {
        let body: string;
        let title: string | undefined;

        // For compiled files, content is already clean markdown
        body = compiledFile.content;
        title = this.extractTitle(compiledFile.content);

        // Skip empty documents
        if (!body.trim()) {
          console.warn(`⚠️  Skipping empty document: ${relativePath}`);
          continue;
        }

        // Split content using token-based chunking with markdown structure preservation
        const chunks = await this.chunkContent(body, title || 'Document');

        // Create a document for each chunk
        chunks.forEach((chunk, index) => {
          const metadata: DocumentMetadata = {
            filePath: compiledFile.path,
            relativePath,
            version,
            chunkIndex: index,
            section: chunk.section,
            ...(title && { title }),
          };

          const document = new Document({
            pageContent: chunk.content,
            metadata,
          });

          documents.push(document);
        });

        if (this.verbose) {
          const stats = this.getChunkingStats(chunks);
          console.log(`📄 Prepared ${chunks.length} chunks for: ${relativePath}${title ? ` (${title})` : ''}`);
          console.log(`📊 Chunk stats - Avg: ${stats.avgTokens} tokens, Max: ${stats.maxTokens} tokens`);
        }
      } catch (error) {
        console.warn(`⚠️  Failed to process ${relativePath}:`, error instanceof Error ? error.message : String(error));
      }
    }

    return documents;
  }

  /**
   * Get statistics about the chunking process
   */
  private getChunkingStats(chunks: Array<{ section: string; content: string }>): { totalChunks: number; avgTokens: number; maxTokens: number } {
    const tokenCounts = chunks.map(chunk => Math.ceil(chunk.content.length / 4)); // Rough estimate
    return {
      totalChunks: chunks.length,
      avgTokens: Math.round(tokenCounts.reduce((sum, count) => sum + count, 0) / chunks.length),
      maxTokens: Math.max(...tokenCounts)
    };
  }

  /**
   * Vectorize and store documents using HNSWlib
   */
  async vectorizeAndStore(compiledFiles: Map<string, CompiledFile>, version: string): Promise<void> {
    console.log(`🔄 Vectorizing ${compiledFiles.size} compiled documents for version ${version}...`);

    if (compiledFiles.size === 0) {
      throw new Error('No documents to vectorize');
    }

    // Convert to LangChain Documents with token-based chunking
    const documents = await this.convertToDocuments(compiledFiles, version);
    console.log(`📝 Converted ${compiledFiles.size} files to ${documents.length} document chunks`);
    
    if (this.verbose && documents.length > 0) {
      const avgChunksPerFile = Math.round(documents.length / compiledFiles.size);
      console.log(`📈 Average chunks per file: ${avgChunksPerFile}`);
      console.log(`🎯 Target: ${this.MAX_TOKENS} tokens per chunk with ${this.OVERLAP_TOKENS} token overlap`);
    }

    if (documents.length === 0) {
      throw new Error('No valid documents after conversion');
    }

    // Create HNSWlib vector store
    console.log('🔗 Creating embeddings and vector store...');
    const vectorStore = await HNSWLib.fromDocuments(documents, this.embeddings);

    // Ensure storage directory exists
    const storageDir = VersionManager.getStorageDir();
    if (!existsSync(storageDir)) {
      await mkdir(storageDir, { recursive: true });
      console.log(`📁 Created storage directory: ${storageDir}`);
    }

    // Save to version-specific file
    const dbPath = VersionManager.getVersionDbPath(version);
    const dbDir = dirname(dbPath);
    
    if (!existsSync(dbDir)) {
      await mkdir(dbDir, { recursive: true });
    }

    await vectorStore.save(dbPath);
    console.log(`💾 Saved vector database: ${dbPath}`);

    // Verify the save was successful
    if (!existsSync(dbPath)) {
      throw new Error(`Failed to save vector database to ${dbPath}`);
    }

    console.log(`✅ Successfully vectorized and stored ${documents.length} documents for version ${version}`);
  }

  /**
   * Load an existing vector store for a version
   */
  static async loadVectorStore(version: string): Promise<HNSWLib> {
    if (!VersionManager.isVersionAvailable(version)) {
      throw new Error(await VersionManager.getMissingVersionError(version));
    }

    const dbPath = VersionManager.getVersionDbPath(version);
    const openAIApiKey = process.env.OPENAI_API_KEY;
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    const embeddings = new OpenAIEmbeddings({
      modelName: 'text-embedding-3-large',
      openAIApiKey,
    });

    return await HNSWLib.load(dbPath, embeddings);
  }
}