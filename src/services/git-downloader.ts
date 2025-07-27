import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, rm, readdir, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { existsSync } from 'node:fs';

const execFileAsync = promisify(execFile);

export interface GitFile {
  path: string;
  content: string;
  relativePath: string;
}

export class GitDownloader {
  private verbose: boolean;

  constructor(verbose = false) {
    this.verbose = verbose;
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

  /**
   * Download Expo docs using git sparse-checkout
   */
  async downloadDocs(version: string): Promise<Map<string, GitFile>> {
    const ref = this.getVersionRef(version);
    const repoUrl = 'https://github.com/expo/expo.git';
    
    // Create temporary directory
    const tempDir = await mkdtemp(join(tmpdir(), 'expo-git-'));
    
    if (this.verbose) {
      console.log(`📁 Using temporary git directory: ${tempDir}`);
    }

    try {
      // Initialize git repository
      await execFileAsync('git', ['init'], { cwd: tempDir });
      
      // Add remote
      await execFileAsync('git', ['remote', 'add', 'origin', repoUrl], { cwd: tempDir });
      
      // Enable sparse-checkout
      await execFileAsync('git', ['config', 'core.sparseCheckout', 'true'], { cwd: tempDir });
      
      // Set sparse-checkout pattern
      const sparseCheckoutFile = join(tempDir, '.git', 'info', 'sparse-checkout');
      await import('node:fs/promises').then(fs => 
        fs.writeFile(sparseCheckoutFile, 'docs/pages/\n', 'utf-8')
      );
      
      if (this.verbose) {
        console.log(`🔍 Fetching ${ref} branch with sparse-checkout for docs/pages/...`);
      }

      // Fetch and checkout the specific branch with depth=1 for efficiency
      try {
        await execFileAsync('git', ['fetch', '--depth=1', 'origin', ref], { cwd: tempDir });
        await execFileAsync('git', ['checkout', ref], { cwd: tempDir });
      } catch (error) {
        // If specific branch doesn't exist, try main
        if (version !== 'latest') {
          console.warn(`⚠️  Branch '${ref}' not found, trying main branch for version ${version}`);
          await execFileAsync('git', ['fetch', '--depth=1', 'origin', 'main'], { cwd: tempDir });
          await execFileAsync('git', ['checkout', 'main'], { cwd: tempDir });
        } else {
          throw error;
        }
      }

      // Read all MDX files from docs/pages
      const docsPath = join(tempDir, 'docs', 'pages');
      
      if (!existsSync(docsPath)) {
        throw new Error(`docs/pages directory not found in repository for version ${version}`);
      }

      const mdxFiles = await this.findMdxFiles(docsPath);
      console.log(`✅ Found ${mdxFiles.length} MDX files in repository`);

      // Read file contents
      const results = new Map<string, GitFile>();
      
      for (const filePath of mdxFiles) {
        try {
          const content = await readFile(filePath, 'utf-8');
          const relativePath = relative(docsPath, filePath);
          
          results.set(relativePath, {
            path: filePath,
            content,
            relativePath,
          });

          if (this.verbose) {
            console.log(`📄 Loaded: ${relativePath}`);
          }
        } catch (error) {
          console.warn(`⚠️  Failed to read ${filePath}:`, error);
        }
      }

      console.log(`📦 Successfully loaded ${results.size} MDX files`);
      return results;

    } finally {
      // Cleanup temporary directory
      try {
        await rm(tempDir, { recursive: true, force: true });
        if (this.verbose) {
          console.log(`🧹 Cleaned up git directory: ${tempDir}`);
        }
      } catch (cleanupError) {
        console.warn('Warning: Failed to cleanup git directory:', cleanupError);
      }
    }
  }

  /**
   * Recursively find all .mdx files in a directory
   */
  private async findMdxFiles(dir: string): Promise<string[]> {
    const mdxFiles: string[] = [];
    
    const processDirectory = async (currentDir: string): Promise<void> => {
      try {
        const entries = await readdir(currentDir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = join(currentDir, entry.name);
          
          if (entry.isDirectory()) {
            await processDirectory(fullPath);
          } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
            mdxFiles.push(fullPath);
          }
        }
      } catch (error) {
        console.warn(`⚠️  Failed to read directory ${currentDir}:`, error);
      }
    };

    await processDirectory(dir);
    return mdxFiles;
  }
}