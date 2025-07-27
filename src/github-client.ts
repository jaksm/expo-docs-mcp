import type { GitHubTreeResponse, GitHubBlobResponse } from './types.js';

export class GitHubClient {
  private static readonly BASE_URL = 'https://api.github.com';
  private static readonly REPO = 'expo/expo';

  private async makeRequest<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'expo-docs-mcp/1.0.0',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Get the appropriate branch/ref for a given version
   */
  private getVersionRef(version: string): string {
    if (version === 'latest') {
      return 'main';
    }
    
    // For versioned releases, try sdk-XX format first
    if (version.startsWith('v')) {
      const versionNumber = version.slice(1);
      return `sdk-${versionNumber}`;
    }
    
    return version;
  }

  async getRepositoryTree(version = 'latest'): Promise<GitHubTreeResponse> {
    const ref = this.getVersionRef(version);
    const url = `${GitHubClient.BASE_URL}/repos/${GitHubClient.REPO}/git/trees/${ref}?recursive=1`;
    
    try {
      return this.makeRequest<GitHubTreeResponse>(url);
    } catch (error) {
      // If sdk-XX branch doesn't exist, try main branch
      if (version !== 'latest' && error instanceof Error && error.message.includes('404')) {
        console.warn(`⚠️  Branch '${ref}' not found, trying main branch for version ${version}`);
        const mainUrl = `${GitHubClient.BASE_URL}/repos/${GitHubClient.REPO}/git/trees/main?recursive=1`;
        return this.makeRequest<GitHubTreeResponse>(mainUrl);
      }
      throw error;
    }
  }

  async getBlobContent(sha: string): Promise<GitHubBlobResponse> {
    const url = `${GitHubClient.BASE_URL}/repos/${GitHubClient.REPO}/git/blobs/${sha}`;
    return this.makeRequest<GitHubBlobResponse>(url);
  }

  decodeContent(blob: GitHubBlobResponse): string {
    if (blob.encoding === 'base64') {
      return Buffer.from(blob.content, 'base64').toString('utf-8');
    }
    return blob.content;
  }
}