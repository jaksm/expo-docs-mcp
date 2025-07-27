import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { Vectorizer } from './vectorizer.js';
import { VersionManager } from './version-manager.js';

export interface SearchResult {
  content: string;
  metadata: {
    filePath: string;
    relativePath: string;
    title?: string;
    version: string;
  };
  score: number;
}

export interface SearchOptions {
  maxResults?: number;
  scoreThreshold?: number;
}

export class SemanticSearch {
  private vectorStore: HNSWLib | null = null;
  private currentVersion: string | null = null;

  /**
   * Load vector store for a specific version
   */
  async loadVersion(version: string): Promise<void> {
    if (!VersionManager.isValidVersionFormat(version)) {
      throw new Error(`Invalid version format: ${version}. Use v53, v52, v51, or latest`);
    }

    if (!VersionManager.isVersionAvailable(version)) {
      throw new Error(await VersionManager.getMissingVersionError(version));
    }

    // Only reload if it's a different version
    if (this.currentVersion !== version) {
      try {
        this.vectorStore = await Vectorizer.loadVectorStore(version);
        this.currentVersion = version;
      } catch (error) {
        throw new Error(`Failed to load vector store for version ${version}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Search for documents matching a query
   */
  async search(query: string, version: string, options: SearchOptions = {}): Promise<SearchResult[]> {
    if (!query.trim()) {
      throw new Error('Search query cannot be empty');
    }

    const { maxResults = 5, scoreThreshold = 0.0 } = options;

    // Load the vector store for the requested version
    await this.loadVersion(version);

    if (!this.vectorStore) {
      throw new Error(`Vector store not loaded for version ${version}`);
    }

    try {
      // Perform similarity search with scores
      const results = await this.vectorStore.similaritySearchWithScore(query, maxResults);

      // Filter by score threshold and format results
      const searchResults: SearchResult[] = results
        .filter(([_, score]) => score >= scoreThreshold)
        .map(([document, score]) => {
          const metadata = document.metadata as any;
          return {
            content: document.pageContent,
            metadata: {
              filePath: metadata.filePath || '',
              relativePath: metadata.relativePath || '',
              title: metadata.title,
              version: metadata.version || version,
            },
            score,
          };
        });

      return searchResults;
    } catch (error) {
      throw new Error(`Search failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get available versions with search statistics
   */
  static async getVersionStats(): Promise<Array<{ version: string; available: boolean }>> {
    const availableVersions = await VersionManager.getAvailableVersions();
    const commonVersions = ['latest', 'v53', 'v52', 'v51'];
    
    return commonVersions.map(version => ({
      version,
      available: availableVersions.includes(version),
    }));
  }

  /**
   * Static method to perform a one-off search
   */
  static async searchVersion(query: string, version: string, options: SearchOptions = {}): Promise<SearchResult[]> {
    const searcher = new SemanticSearch();
    return searcher.search(query, version, options);
  }
}