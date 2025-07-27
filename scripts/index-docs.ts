#!/usr/bin/env node

/**
 * Developer script to generate hnswlib files for bundling with the MCP
 * Usage: npm run index-docs <version>
 * Example: npm run index-docs latest
 * 
 * This script is for developers only - end users get pre-bundled files
 */

import { parseArgs } from 'node:util';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { LocalRepoReader } from '../src/services/local-repo-reader.js';
import { MdxConverter } from '../src/mdx-converter.js';
import { Vectorizer } from '../src/services/vectorizer.js';
import { VersionManager } from '../src/services/version-manager.js';

const HELP_TEXT = `
📚 Expo Docs Indexer - Generate hnswlib files for MCP bundling

Usage:
  npm run index-docs <version> [options]

Arguments:
  version              Expo SDK version (e.g., v53, v52, v51, latest)

Options:
  --output, -o         Output directory (default: ./data) [DEPRECATED - uses ./data automatically]
  --verbose, -v        Enable verbose logging
  --help, -h          Show this help message

Examples:
  npm run index-docs latest
  npm run index-docs v53 --verbose
  npm run index-docs v52 --output ./data

This script:
1. Reads MDX files from local expo-repo
2. Compiles them using Expo's Next.js build system  
3. Converts HTML to clean markdown
4. Uses intelligent token-based chunking
5. Generates .hnswlib files for bundling with the MCP server
`;

interface IndexOptions {
  version: string;
  outputDir: string;
  verbose: boolean;
}

function parseCliArgs(): IndexOptions {
  try {
    const { values, positionals } = parseArgs({
      options: {
        'output': { type: 'string', short: 'o' },
        'verbose': { type: 'boolean', short: 'v' },
        'help': { type: 'boolean', short: 'h' },
      },
      allowPositionals: true,
    });

    if (values.help) {
      console.log(HELP_TEXT);
      process.exit(0);
    }

    if (positionals.length < 1) {
      console.error('❌ Error: version argument is required');
      console.log(HELP_TEXT);
      process.exit(1);
    }

    const version = positionals[0];
    
    // Validate version format
    if (!version.match(/^(v\d+|latest)$/)) {
      console.error('❌ Error: Invalid version format. Use v53, v52, v51, or latest');
      process.exit(1);
    }

    return {
      version,
      outputDir: values.output || './data',
      verbose: Boolean(values.verbose),
    };
  } catch (error) {
    console.error('❌ Error parsing arguments:', error instanceof Error ? error.message : String(error));
    console.log(HELP_TEXT);
    process.exit(1);
  }
}

/**
 * Convert MDX content to Markdown (simplified version of DocsInitializer logic)
 */
function convertMdxToMarkdown(content: string): string {
  // Remove all import statements
  content = content.replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, '');
  content = content.replace(/^import\s+{[^}]+}\s+from\s+['"].*?['"];?\s*$/gm, '');
  
  // Remove MDX comments
  content = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  
  // Remove info/end comment blocks
  content = content.replace(/\/\*\s*@info[\s\S]*?\*\//g, '');
  content = content.replace(/\/\*\s*@end[\s\S]*?\*\//g, '');
  
  // Convert Terminal components to bash code blocks
  content = content.replace(/<Terminal\s+cmd=\{(\[[^\]]+\])\}\s*\/>/g, (_, cmd) => {
    try {
      const commands = JSON.parse(cmd.replace(/'/g, '"'));
      return '```bash\n' + commands.join('\n') + '\n```';
    } catch {
      return '```bash\n# Terminal command\n```';
    }
  });
  
  // Convert APIBox components
  content = content.replace(/<APIBox[^>]*header=["']([^"']+)["'][^>]*>([\s\S]*?)<\/APIBox>/g, (_, header, inner) => {
    return `\n### ${header}\n\n${inner}`;
  });
  
  // Convert WhySDKCard components
  content = content.replace(/<WhySDKCard[^>]*title=["']([^"']+)["'][^>]*description=["']([^"']+)["'][^>]*\/>/g, (_, title, desc) => {
    return `\n**${title}**\n${desc}\n`;
  });
  
  // Convert other JSX components
  content = content.replace(/<SnackInline[^>]*>([\s\S]*?)<\/SnackInline>/g, (_, inner) => inner);
  content = content.replace(/<TabsGroup>([\s\S]*?)<\/TabsGroup>/g, '$1');
  content = content.replace(/<Tabs>([\s\S]*?)<\/Tabs>/g, '$1');
  content = content.replace(/<Tab\s+label=["']([^"']+)["']>([\s\S]*?)<\/Tab>/g, (_, label, inner) => {
    return `\n#### ${label}\n\n${inner}`;
  });
  content = content.replace(/<Collapsible\s+summary=\{<>([^<]+)<\/>\}>([\s\S]*?)<\/Collapsible>/g, (_, summary, inner) => {
    return `\n#### ${summary}\n\n${inner}`;
  });
  content = content.replace(/<Collapsible\s+summary=["']([^"']+)["']>([\s\S]*?)<\/Collapsible>/g, (_, summary, inner) => {
    return `\n#### ${summary}\n\n${inner}`;
  });
  content = content.replace(/<Step\s+label=["'](\d+)["']>([\s\S]*?)<\/Step>/g, (_, num, inner) => {
    return `\n### Step ${num}\n\n${inner}`;
  });
  content = content.replace(/<BoxLink\s+([^>]+)\/>/g, (_, attrs) => {
    const title = attrs.match(/title=["']([^"']+)["']/)?.[1] || '';
    const desc = attrs.match(/description=["']([^"']+)["']/)?.[1] || '';
    const href = attrs.match(/href=["']([^"']+)["']/)?.[1] || '#';
    return `\n**${title}**\n${desc}\n[Learn more →](${href})\n`;
  });
  content = content.replace(/<CODE>([^<]+)<\/CODE>/g, '`$1`');
  content = content.replace(/<WHATHAPPENED>([^<]+)<\/WHATHAPPENED>/g, '**What happened:** $1');
  content = content.replace(/<Link\s+href=["']([^"']+)["']>([^<]+)<\/Link>/g, '[$2]($1)');
  
  // Remove self-closing JSX components
  content = content.replace(/<[A-Z][A-Za-z0-9]*[^>]*\/>/g, '');
  
  // Remove remaining JSX components (more aggressive)
  content = content.replace(/<[A-Z][A-Za-z0-9]*[^>]*>[\s\S]*?<\/[A-Z][A-Za-z0-9]*>/g, '');
  
  // Remove JSX fragments
  content = content.replace(/<>\s*/g, '');
  content = content.replace(/\s*<\/>/g, '');
  
  // Remove inline JSX expressions
  content = content.replace(/\{[^}]+\}/g, '');
  
  // Fix local links
  content = content.replace(/\]\(([^)]*)?\.mdx([^)]*?)\)/g, ']($1.md$2)');
  content = content.replace(/\]\(\.\/([^/#)]+)\/\)/g, '](./$1.md)');
  content = content.replace(/\]\(\.\/([^/#)]+)\/([^)]*)\)/g, '](./$1.md$2)');
  
  // Clean up extra newlines
  content = content.replace(/\n{3,}/g, '\n\n');
  
  // Remove prettier-ignore comments
  content = content.replace(/\{\/\*\s*prettier-ignore\s*\*\/\}/g, '');
  
  return content.trim();
}

async function saveCompiledFilesToDisk(
  compiledFiles: Map<string, import('../src/types.js').CompiledFile>,
  version: string
): Promise<void> {
  const mdCacheDir = VersionManager.getVersionMdPath(version);
  let savedCount = 0;
  let failedCount = 0;

  // Ensure MD cache directory exists
  if (!existsSync(mdCacheDir)) {
    await mkdir(mdCacheDir, { recursive: true });
    console.log(`📁 Created MD cache directory: ${mdCacheDir}`);
  }

  for (const [relativePath, compiledFile] of compiledFiles) {
    try {
      // Use the compiled file's relative path (which should have .md extension)
      const fullPath = join(mdCacheDir, compiledFile.relativePath);
      
      // Ensure directory exists
      const dir = dirname(fullPath);
      if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
      }

      // Write compiled markdown to disk
      await writeFile(fullPath, compiledFile.content, 'utf-8');
      savedCount++;
    } catch (error) {
      console.warn(`⚠️  Failed to save ${compiledFile.relativePath}:`, error);
      failedCount++;
    }
  }

  console.log(`📊 Saved ${savedCount} compiled MD files, ${failedCount} failed`);
}

async function loadCompiledFilesFromDisk(
  version: string
): Promise<Map<string, import('../src/types.js').CompiledFile>> {
  const mdCacheDir = VersionManager.getVersionMdPath(version);
  const files = new Map<string, import('../src/types.js').CompiledFile>();
  
  async function processDirectory(dir: string, basePath: string = ''): Promise<void> {
    const { readdir } = await import('node:fs/promises');
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      const relativePath = basePath ? join(basePath, entry.name) : entry.name;
      
      if (entry.isDirectory()) {
        await processDirectory(fullPath, relativePath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        const content = await readFile(fullPath, 'utf-8');
        files.set(relativePath, {
          path: fullPath,
          content,
          relativePath,
        });
      }
    }
  }
  
  await processDirectory(mdCacheDir);
  return files;
}

async function main(): Promise<void> {
  const options = parseCliArgs();
  
  console.log('🔧 Expo Docs Indexer - Generating hnswlib files for bundling\n');

  if (options.verbose) {
    console.log('🔧 Configuration:');
    console.log(`   Version: ${options.version}`);
    console.log(`   Output directory: ${options.outputDir}`);
    console.log(`   Verbose mode: ${options.verbose}\n`);
  }

  // Check for OpenAI API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY environment variable is required');
    console.error('Please set your OpenAI API key to generate embeddings');
    process.exit(1);
  }

  try {
    // Ensure output directory exists
    if (!existsSync(options.outputDir)) {
      await mkdir(options.outputDir, { recursive: true });
      console.log(`📁 Created output directory: ${options.outputDir}`);
    }

    let compiledFiles: Map<string, import('../src/types.js').CompiledFile>;
    
    // Check if MD cache already exists
    if (VersionManager.isMdCacheAvailable(options.version)) {
      console.log('📚 Found existing MD cache, skipping compilation');
      console.log('💡 To re-compile, delete the MD cache directory');
      
      // Phase 1: Load from cache
      console.log('\n📥 Phase 1: Load from MD Cache');
      compiledFiles = await loadCompiledFilesFromDisk(options.version);
      console.log(`📊 Loaded ${compiledFiles.size} compiled MD files from cache`);
    } else {
      // Phase 1: Read MDX files from local repository
      console.log('📥 Phase 1: Read MDX Files from Local Repository');
      const repoReader = new LocalRepoReader(options.verbose);
      const mdxFiles = await repoReader.readMDXFiles(options.version);

      if (mdxFiles.size === 0) {
        throw new Error(`No MDX files found for version ${options.version}`);
      }

      // Phase 2: Convert MDX to Markdown using simple converter
      console.log('\n🏗️  Phase 2: Convert MDX to Markdown');
      const mdxConverter = new MdxConverter(options.verbose);
      compiledFiles = await mdxConverter.convertFiles(mdxFiles, options.version);
      
      // Phase 3: Save compiled files to cache
      console.log('\n💾 Phase 3: Cache Compiled Files');
      await saveCompiledFilesToDisk(compiledFiles, options.version);
      console.log(`📊 Cached ${compiledFiles.size} compiled MD files for future use`);
    }

    // Phase 4: Vectorization with intelligent chunking
    console.log('\n🔗 Phase 4: Vectorization and Storage with Token-Based Chunking');
    const vectorizer = new Vectorizer(options.verbose);
    
    await vectorizer.vectorizeAndStore(compiledFiles, options.version);

    console.log(`\n🎉 Successfully generated hnswlib file for version ${options.version}`);
    console.log(`📂 Vector store: ${VersionManager.getVersionDbPath(options.version)}`);
    console.log(`📂 MD cache: ${VersionManager.getVersionMdPath(options.version)}`);
    console.log('\n📦 This file is ready to be bundled with the MCP server distribution.');

  } catch (error) {
    console.error('\n❌ Fatal error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Handle unhandled rejections and exceptions
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
  process.exit(1);
});

// Graceful shutdown on SIGINT (Ctrl+C)
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

// Run the main function
main().catch((error) => {
  console.error('❌ Main function error:', error);
  process.exit(1);
});