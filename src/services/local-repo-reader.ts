import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import type { GitFile } from './git-downloader.js';

export class LocalRepoReader {
  private verbose: boolean;
  private repoPath: string;

  constructor(verbose = false) {
    this.verbose = verbose;
    this.repoPath = join(process.cwd(), 'expo-repo');
  }

  /**
   * Read MDX files from local expo repository
   */
  async readMDXFiles(version: string): Promise<Map<string, GitFile>> {
    if (!existsSync(this.repoPath)) {
      throw new Error(`Expo repository not found at ${this.repoPath}. Please run 'git clone https://github.com/expo/expo.git expo-repo' first.`);
    }

    // Ensure we're on the correct branch
    await this.checkoutVersion(version);

    const docsPath = join(this.repoPath, 'docs', 'pages');
    
    if (!existsSync(docsPath)) {
      throw new Error(`docs/pages directory not found in repository for version ${version}`);
    }

    const mdxFiles = await this.findMdxFiles(docsPath);
    console.log(`✅ Found ${mdxFiles.size} MDX files in local repository`);

    return mdxFiles;
  }

  /**
   * Switch to the correct git branch/version
   */
  private async checkoutVersion(version: string): Promise<void> {
    const { execFile } = await import('node:child_process');
    const { promisify } = await import('node:util');
    const execFileAsync = promisify(execFile);

    try {
      if (this.verbose) {
        console.log(`🔄 Switching to version ${version}...`);
      }

      // First, fetch latest changes
      await execFileAsync('git', ['fetch'], { cwd: this.repoPath });

      // Determine the correct branch
      const branch = this.getVersionBranch(version);
      
      if (this.verbose) {
        console.log(`📦 Checking out branch: ${branch}`);
      }

      // Checkout the branch
      await execFileAsync('git', ['checkout', branch], { cwd: this.repoPath });

      // Pull latest changes
      await execFileAsync('git', ['pull'], { cwd: this.repoPath });

    } catch (error) {
      if (version === 'latest') {
        console.warn('⚠️  Failed to update repository, using existing state');
      } else {
        throw new Error(`Failed to checkout version ${version}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Get the appropriate branch for a version
   */
  private getVersionBranch(version: string): string {
    if (version === 'latest') {
      return 'main';
    }
    
    // For versioned releases, try sdk-XX format
    if (version.startsWith('v')) {
      const versionNumber = version.slice(1);
      return `sdk-${versionNumber}`;
    }
    
    return version;
  }

  /**
   * Recursively find all .mdx files in a directory
   */
  private async findMdxFiles(dir: string, basePath: string = ''): Promise<Map<string, GitFile>> {
    const mdxFiles = new Map<string, GitFile>();
    
    try {
      const entries = await readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        const relativePath = basePath ? join(basePath, entry.name) : entry.name;
        
        if (entry.isDirectory()) {
          // Skip certain directories that are not relevant
          if (['node_modules', '.git', '.next', 'out', 'dist'].includes(entry.name)) {
            continue;
          }
          
          const subFiles = await this.findMdxFiles(fullPath, relativePath);
          for (const [path, file] of subFiles) {
            mdxFiles.set(path, file);
          }
        } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
          try {
            const content = await readFile(fullPath, 'utf-8');
            
            mdxFiles.set(relativePath, {
              path: fullPath,
              content,
              relativePath,
            });

            if (this.verbose) {
              console.log(`📄 Loaded: ${relativePath}`);
            }
          } catch (error) {
            console.warn(`⚠️  Failed to read ${fullPath}:`, error);
          }
        }
      }
    } catch (error) {
      console.warn(`⚠️  Failed to read directory ${dir}:`, error);
    }

    return mdxFiles;
  }

  /**
   * Get repository status
   */
  async getRepoStatus(): Promise<{ branch: string; lastCommit: string; isClean: boolean }> {
    const { execFile } = await import('node:child_process');
    const { promisify } = await import('node:util');
    const execFileAsync = promisify(execFile);

    try {
      const [branchResult, commitResult, statusResult] = await Promise.all([
        execFileAsync('git', ['branch', '--show-current'], { cwd: this.repoPath }),
        execFileAsync('git', ['log', '-1', '--pretty=format:%h %s'], { cwd: this.repoPath }),
        execFileAsync('git', ['status', '--porcelain'], { cwd: this.repoPath }),
      ]);

      return {
        branch: branchResult.stdout.trim(),
        lastCommit: commitResult.stdout.trim(),
        isClean: statusResult.stdout.trim() === '',
      };
    } catch (error) {
      throw new Error(`Failed to get repository status: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}