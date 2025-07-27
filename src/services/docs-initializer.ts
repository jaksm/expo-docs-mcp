import { GitDownloader } from './git-downloader.js';
import { Vectorizer } from './vectorizer.js';
import { VersionManager } from './version-manager.js';

export class DocsInitializer {
  private verbose: boolean;

  constructor(verbose = false) {
    this.verbose = verbose;
  }

  /**
   * Initialize documentation for a specific version
   */
  async initializeVersion(version: string): Promise<void> {
    // Validate version format
    if (!VersionManager.isValidVersionFormat(version)) {
      throw new Error(`Invalid version format: ${version}. Use v53, v52, v51, or latest`);
    }

    console.log(`🚀 Initializing Expo documentation for version ${version}\n`);

    // Check if version already exists
    if (VersionManager.isVersionAvailable(version)) {
      console.log(`✅ Version ${version} is already initialized and ready to use.`);
      console.log(`📂 You can use search-expo-docs with version: ${version}`);
      return;
    }

    try {
      // Phase 1: Download with Git Sparse-Checkout
      console.log('\n📥 Phase 1: Download Documentation with Git');
      const gitDownloader = new GitDownloader(this.verbose);
      const downloadedFiles = await gitDownloader.downloadDocs(version);

      if (downloadedFiles.size === 0) {
        throw new Error(`No MDX files found for version ${version}`);
      }

      // Phase 2: Convert to Markdown (in memory)
      console.log('\n🔄 Phase 2: Convert to Markdown');
      const convertedFiles = await this.convertInMemory(downloadedFiles);

      // Phase 3: Vectorization
      console.log('\n🔗 Phase 3: Vectorization and Storage');
      const vectorizer = new Vectorizer(this.verbose);
      await vectorizer.vectorizeAndStore(convertedFiles, version);

      console.log(`\n🎉 Successfully initialized Expo documentation for version ${version}`);
      console.log(`📂 Vector database saved for version: ${version}`);

    } catch (error) {
      console.error(`\n❌ Failed to initialize version ${version}:`, error);
      throw error;
    }
  }

  /**
   * Convert MDX files to markdown in memory without saving to disk
   */
  private async convertInMemory(
    gitFiles: Map<string, import('./git-downloader.js').GitFile>
  ): Promise<Map<string, import('./git-downloader.js').GitFile>> {
    const convertedFiles = new Map();

    for (const [relativePath, gitFile] of gitFiles) {
      try {
        // Use the converter's internal conversion logic
        const convertedContent = await this.convertMdxContent(gitFile.content);
        
        convertedFiles.set(relativePath, {
          ...gitFile,
          content: convertedContent,
        });

        if (this.verbose) {
          console.log(`✅ Converted: ${relativePath}`);
        }
      } catch (error) {
        console.warn(`⚠️  Failed to convert ${relativePath}:`, error);
      }
    }

    console.log(`📊 Converted ${convertedFiles.size}/${gitFiles.size} files successfully`);
    return convertedFiles;
  }

  /**
   * Convert MDX content to Markdown (extracted from MdxConverter logic)
   */
  private async convertMdxContent(content: string): Promise<string> {
    // This mirrors the conversion logic from MdxConverter but returns content instead of saving
    const frontMatter = await import('front-matter');
    const { attributes, body } = frontMatter.default(content);

    // Apply MDX to Markdown conversion
    let markdown = this.convertMdxToMarkdown(body);

    // Reconstruct with frontmatter
    let output = '';
    const attrs = attributes as Record<string, any>;
    if (Object.keys(attrs).length > 0) {
      output += '---\n';
      for (const [key, value] of Object.entries(attrs)) {
        if (typeof value === 'string') {
          output += `${key}: ${value}\n`;
        } else if (Array.isArray(value)) {
          output += `${key}: [${value.map(v => `"${v}"`).join(', ')}]\n`;
        } else {
          output += `${key}: ${JSON.stringify(value)}\n`;
        }
      }
      output += '---\n\n';
    }
    output += markdown;

    return output;
  }

  /**
   * Convert MDX to Markdown (copied from MdxConverter)
   */
  private convertMdxToMarkdown(content: string): string {
    // Remove all import statements
    content = content.replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, '');
    content = content.replace(/^import\s+{[^}]+}\s+from\s+['"].*?['"];?\s*$/gm, '');
    
    // Convert Terminal components to bash code blocks
    content = content.replace(/<Terminal\s+cmd=\{(\[[^\]]+\])\}\s*\/>/g, (_, cmd) => {
      try {
        const commands = JSON.parse(cmd.replace(/'/g, '"'));
        return '```bash\n' + commands.join('\n') + '\n```';
      } catch {
        return '```bash\n# Terminal command\n```';
      }
    });
    
    // Convert other JSX components (keeping existing logic from MdxConverter)
    content = content.replace(/<SnackInline[^>]*>([\s\S]*?)<\/SnackInline>/g, (_, inner) => inner);
    content = content.replace(/<TabsGroup>([\s\S]*?)<\/TabsGroup>/g, '$1');
    content = content.replace(/<Tabs>([\s\S]*?)<\/Tabs>/g, '$1');
    content = content.replace(/<Tab\s+label=["']([^"']+)["']>([\s\S]*?)<\/Tab>/g, (_, label, inner) => {
      return `\n#### ${label}\n\n${inner}`;
    });
    content = content.replace(/<Collapsible\s+summary=\{<>([^<]+)<\/>\}>([\s\S]*?)<\/Collapsible>/g, (_, summary, inner) => {
      return `\n#### ${summary}\n\n${inner}`;
    });
    content = content.replace(/<Step\s+label=["'](\d+)["']>([\s\S]*?)<\/Step>/g, (_, num, inner) => {
      return `\n### Step ${num}\n\n${inner}`;
    });
    content = content.replace(/<BoxLink\s+([^>]+)\/>/g, (_, attrs) => {
      const title = attrs.match(/title=["']([^"']+)["']/)?.[1] || '';
      const desc = attrs.match(/description=["']([^"']+)["']/)?.[1] || '';
      const href = attrs.match(/href=["']([^"']+)["']/)?.[1] || '#';
      return `**${title}**\n${desc}\n[Learn more →](${href})`;
    });
    content = content.replace(/<CODE>([^<]+)<\/CODE>/g, '`$1`');
    
    // Remove remaining JSX components
    content = content.replace(/<[A-Z][^>]*\/>/g, '');
    content = content.replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, '');
    
    // Fix local links
    content = content.replace(/\]\(([^)]*)?\.mdx([^)]*?)\)/g, ']($1.md$2)');
    content = content.replace(/\]\(\.\/([^/#)]+)\/\)/g, '](./$1.md)');
    content = content.replace(/\]\(\.\/([^/#)]+)\/([^)]*)\)/g, '](./$1.md$2)');
    
    // Clean up extra newlines
    content = content.replace(/\n{3,}/g, '\n\n');
    
    return content.trim();
  }

}