import { GitHubClient } from './github-client.js';
import type { GitHubTreeItem, MdxFile, ProgressInfo } from './types.js';

export class ParallelDownloader {
  private client: GitHubClient;
  private batchSize: number;
  private verbose: boolean;

  constructor(batchSize = 10, verbose = false) {
    this.client = new GitHubClient();
    this.batchSize = batchSize;
    this.verbose = verbose;
  }

  /**
   * Create chunks of an array for batch processing
   */
  private chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Convert GitHub path to relative path for output
   */
  private getRelativePath(githubPath: string): string {
    // Remove 'docs/pages/' prefix to get relative path
    return githubPath.replace(/^docs\/pages\//, '');
  }

  /**
   * Download a single file
   */
  private async downloadFile(item: GitHubTreeItem): Promise<MdxFile> {
    try {
      const blob = await this.client.getBlobContent(item.sha);
      const content = this.client.decodeContent(blob);
      const relativePath = this.getRelativePath(item.path);

      if (this.verbose) {
        console.log(`📄 Downloaded: ${relativePath}`);
      }

      return {
        path: item.path,
        sha: item.sha,
        content,
        relativePath,
      };
    } catch (error) {
      throw new Error(`Failed to download ${item.path}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Download files in parallel batches
   */
  async downloadFiles(files: GitHubTreeItem[]): Promise<Map<string, MdxFile>> {
    console.log(`📥 Downloading ${files.length} files in batches of ${this.batchSize}...`);
    
    const results = new Map<string, MdxFile>();
    const batches = this.chunk(files, this.batchSize);
    let processedCount = 0;

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i]!;
      
      try {
        // Download batch in parallel
        const promises = batch.map(file => this.downloadFile(file));
        const batchResults = await Promise.all(promises);

        // Store results
        for (const mdxFile of batchResults) {
          results.set(mdxFile.relativePath, mdxFile);
        }

        processedCount += batch.length;

        // Progress reporting
        const progress: ProgressInfo = {
          current: processedCount,
          total: files.length,
          phase: 'download',
          message: `Downloaded batch ${i + 1}/${batches.length}`,
        };

        console.log(`📊 Progress: ${progress.current}/${progress.total} files (${Math.round((progress.current / progress.total) * 100)}%)`);

        // Rate limiting: small delay between batches
        if (i < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }

      } catch (error) {
        console.error(`❌ Error processing batch ${i + 1}:`, error);
        throw error;
      }
    }

    console.log(`✅ Successfully downloaded ${results.size} files`);
    return results;
  }
}