import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { existsSync } from 'node:fs';
import frontMatter from 'front-matter';
import type { MdxFile, ConversionResult, CompiledFile } from './types.js';

export class MdxConverter {
  private verbose: boolean;

  constructor(verbose = false) {
    this.verbose = verbose;
  }

  /**
   * Fix local links in markdown content
   */
  private fixLocalLinks(content: string): string {
    // Convert .mdx extensions to .md
    content = content.replace(/\]\(([^)]*)?\.mdx([^)]*?)\)/g, ']($1.md$2)');
    
    // Convert directory-only links to file links (e.g., ./audio/ -> ./audio.md)
    content = content.replace(/\]\(\.\/([^/#)]+)\/\)/g, '](./$1.md)');
    
    // Handle directory links with fragments (e.g., ./audio/#section -> ./audio.md#section)
    content = content.replace(/\]\(\.\/([^/#)]+)\/([^)]*)\)/g, '](./$1.md$2)');
    
    return content;
  }

  /**
   * Convert MDX content to Markdown
   */
  private convertMdxToMarkdown(content: string): string {
    let markdown = content;
    
    // Remove import statements
    markdown = markdown.replace(/^import\s+.*?from\s+['"][^'"]*['"];?\s*$/gm, '');
    markdown = markdown.replace(/^import\s+['"][^'"]*['"];?\s*$/gm, '');
    
    // Remove JSX components but preserve their content
    // Handle self-closing components: <Component />
    markdown = markdown.replace(/<([A-Z][a-zA-Z0-9]*)[^>]*\/>/g, '');
    
    // Handle component with content: <Component>content</Component>
    markdown = markdown.replace(/<([A-Z][a-zA-Z0-9]*)[^>]*>([\s\S]*?)<\/\1>/g, '$2');
    
    // Remove export statements
    markdown = markdown.replace(/^export\s+.*?;?\s*$/gm, '');
    
    // Fix local links
    markdown = this.fixLocalLinks(markdown);
    
    // Clean up extra newlines
    markdown = markdown.replace(/\n{3,}/g, '\n\n');
    
    return markdown.trim();
  }

  /**
   * Process a single MDX file
   */
  private async processMdxFile(mdxFile: MdxFile, outputDir: string): Promise<ConversionResult> {
    try {
      // Extract frontmatter
      const { attributes, body } = frontMatter(mdxFile.content);
      
      // Convert MDX to Markdown
      const markdown = this.convertMdxToMarkdown(body);
      
      // Reconstruct the document with frontmatter
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
      
      // Determine output path
      const outputPath = join(outputDir, mdxFile.relativePath.replace(/\.mdx$/, '.md'));
      
      // Ensure output directory exists
      const outputDirPath = dirname(outputPath);
      if (!existsSync(outputDirPath)) {
        await mkdir(outputDirPath, { recursive: true });
      }
      
      // Write the converted file
      await writeFile(outputPath, output, 'utf-8');
      
      if (this.verbose) {
        console.log(`✅ Converted: ${mdxFile.relativePath}`);
      }
      
      // Create compiled file object
      const compiledFile: CompiledFile = {
        path: outputPath,
        content: output,
        relativePath: mdxFile.relativePath.replace(/\.mdx$/, '.md')
      };
      
      return { success: true, path: outputPath, compiledFile };
    } catch (error) {
      return { 
        success: false, 
        path: mdxFile.relativePath, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Convert all MDX files to Markdown
   */
  async convertFiles(mdxFiles: Map<string, MdxFile>, outputDir: string): Promise<Map<string, CompiledFile>> {
    console.log(`🔄 Converting ${mdxFiles.size} MDX files to Markdown...`);
    
    let successCount = 0;
    let errorCount = 0;
    const errors: ConversionResult[] = [];
    const compiledFiles = new Map<string, CompiledFile>();
    
    // Process files sequentially to avoid overwhelming the filesystem
    for (const [relativePath, mdxFile] of mdxFiles) {
      const result = await this.processMdxFile(mdxFile, outputDir);
      
      if (result.success && result.compiledFile) {
        successCount++;
        compiledFiles.set(relativePath, result.compiledFile);
      } else {
        errorCount++;
        errors.push(result);
        console.error(`❌ Failed to convert ${relativePath}: ${result.error}`);
      }
    }
    
    // Summary
    console.log(`\n📊 Conversion Summary:`);
    console.log(`✅ Successfully converted: ${successCount} files`);
    console.log(`❌ Failed conversions: ${errorCount} files`);
    
    if (errors.length > 0) {
      console.log('\n❌ Conversion Errors:');
      errors.slice(0, 5).forEach(({ path, error }) => {
        console.log(`   - ${path}: ${error}`);
      });
      if (errors.length > 5) {
        console.log(`   ... and ${errors.length - 5} more errors`);
      }
    }
    
    if (errorCount > 0) {
      throw new Error(`Conversion failed for ${errorCount} files`);
    }
    
    return compiledFiles;
  }
}