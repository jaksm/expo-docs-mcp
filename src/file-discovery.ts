import { GitHubClient } from './github-client.js';
import type { GitHubTreeItem } from './types.js';

export class FileDiscovery {
  private client: GitHubClient;

  constructor() {
    this.client = new GitHubClient();
  }

  /**
   * Check if a file path should be skipped based on version filtering
   */
  private shouldSkipVersionedFile(path: string): boolean {
    // Skip old version directories (v51.0.0, v52.0.0, v53.0.0) but keep unversioned
    return /versions\/v(51|52|53)\./.test(path);
  }

  /**
   * Check if a file is an MDX file in the docs/pages directory
   */
  private isMdxFile(item: GitHubTreeItem): boolean {
    return (
      item.type === 'blob' &&
      item.path.startsWith('docs/pages/') &&
      item.path.endsWith('.mdx')
    );
  }

  /**
   * Discover all relevant MDX files using GitHub Trees API for a specific version
   */
  async discoverMdxFiles(version = 'latest'): Promise<GitHubTreeItem[]> {
    console.log(`🔍 Discovering MDX files from GitHub for version ${version}...`);
    
    const treeResponse = await this.client.getRepositoryTree(version);
    
    if (treeResponse.truncated) {
      console.warn('⚠️  Repository tree was truncated. Some files may be missing.');
    }

    const mdxFiles = treeResponse.tree
      .filter(item => this.isMdxFile(item))
      .filter(item => !this.shouldSkipVersionedFile(item.path));

    console.log(`✅ Found ${mdxFiles.length} MDX files to download for version ${version}`);
    
    // For versioned requests, we don't skip versioned files as we want that specific version
    if (version === 'latest') {
      const skippedVersions = treeResponse.tree
        .filter(item => this.isMdxFile(item))
        .filter(item => this.shouldSkipVersionedFile(item.path))
        .length;
      
      if (skippedVersions > 0) {
        console.log(`📝 Skipped ${skippedVersions} files from old versions (v51, v52, v53)`);
      }
    }

    return mdxFiles;
  }
}