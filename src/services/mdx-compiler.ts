import { spawn } from 'node:child_process';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import TurndownService from 'turndown';
import type { GitFile } from './git-downloader.js';

export interface CompiledFile {
  path: string;
  content: string;
  relativePath: string;
  html?: string;
}

export class MDXCompiler {
  private verbose: boolean;
  private turndownService: TurndownService;

  constructor(verbose = false) {
    this.verbose = verbose;
    
    // Configure Turndown for better markdown conversion
    this.turndownService = new TurndownService({
      headingStyle: 'atx',
      hr: '---',
      bulletListMarker: '-',
      codeBlockStyle: 'fenced',
      fence: '```',
    });
    
    // Add custom rules for better conversion
    this.addTurndownRules();
  }

  private addTurndownRules(): void {
    // Preserve code blocks with language info
    this.turndownService.addRule('codeBlocks', {
      filter: ['pre'],
      replacement: (content, node) => {
        const codeElement = node.querySelector('code');
        if (!codeElement) return '```\n' + content + '\n```';
        
        const className = codeElement.className || '';
        const languageMatch = className.match(/language-(\w+)/);
        const language = languageMatch ? languageMatch[1] : '';
        
        return '```' + language + '\n' + codeElement.textContent + '\n```';
      }
    });

    // Handle inline code
    this.turndownService.addRule('inlineCode', {
      filter: ['code'],
      replacement: (content) => {
        return '`' + content + '`';
      }
    });

    // Remove script and style tags
    this.turndownService.addRule('removeScripts', {
      filter: ['script', 'style', 'noscript'],
      replacement: () => ''
    });

    // Convert tables properly
    this.turndownService.addRule('tables', {
      filter: 'table',
      replacement: (content, node) => {
        // Let turndown handle table conversion
        return (this.turndownService as any).defaultRules.table.replacement.call(this, content, node);
      }
    });
  }

  /**
   * Compile MDX files using Expo's Next.js build system
   */
  async compileMDXFiles(mdxFiles: Map<string, GitFile>, _version: string): Promise<Map<string, CompiledFile>> {
    const tempDir = join(process.cwd(), '.temp-expo-build');
    const compiledFiles = new Map<string, CompiledFile>();

    try {
      // Setup temporary build environment
      await this.setupTempBuildEnv(tempDir, mdxFiles);
      
      // Run Next.js build to compile MDX
      await this.runNextBuild(tempDir);
      
      // Extract compiled HTML from build output
      const htmlFiles = await this.extractCompiledHTML(tempDir);
      
      // Convert HTML to clean markdown
      for (const [relativePath, htmlContent] of htmlFiles) {
        const cleanMarkdown = this.convertHTMLToMarkdown(htmlContent);
        const originalFile = mdxFiles.get(relativePath.replace('.html', '.mdx'));
        
        if (originalFile) {
          compiledFiles.set(relativePath.replace('.html', '.md'), {
            path: originalFile.path,
            content: cleanMarkdown,
            relativePath: relativePath.replace('.html', '.md'),
            html: htmlContent,
          });
        }
      }

      return compiledFiles;

    } finally {
      // Cleanup temp directory
      if (existsSync(tempDir)) {
        await rm(tempDir, { recursive: true, force: true });
        if (this.verbose) {
          console.log(`🧹 Cleaned up temp directory: ${tempDir}`);
        }
      }
    }
  }

  /**
   * Setup temporary build environment with Expo's dependencies
   */
  private async setupTempBuildEnv(tempDir: string, mdxFiles: Map<string, GitFile>): Promise<void> {
    if (this.verbose) {
      console.log(`📁 Setting up temp build environment: ${tempDir}`);
    }

    // Create temp directory
    await mkdir(tempDir, { recursive: true });

    // Copy essential Expo docs files
    const expoDocsPath = join(process.cwd(), 'expo-repo', 'docs');
    
    // Copy package.json and essential config files
    await this.copyFile(join(expoDocsPath, 'package.json'), join(tempDir, 'package.json'));
    await this.copyFile(join(expoDocsPath, 'next.config.ts'), join(tempDir, 'next.config.ts'));
    await this.copyFile(join(expoDocsPath, 'tsconfig.json'), join(tempDir, 'tsconfig.json'));
    
    // Copy essential directories
    await this.copyDirectory(join(expoDocsPath, 'components'), join(tempDir, 'components'));
    await this.copyDirectory(join(expoDocsPath, 'ui'), join(tempDir, 'ui'));
    await this.copyDirectory(join(expoDocsPath, 'common'), join(tempDir, 'common'));
    await this.copyDirectory(join(expoDocsPath, 'providers'), join(tempDir, 'providers'));
    await this.copyDirectory(join(expoDocsPath, 'mdx-plugins'), join(tempDir, 'mdx-plugins'));
    await this.copyDirectory(join(expoDocsPath, 'constants'), join(tempDir, 'constants'));
    await this.copyDirectory(join(expoDocsPath, 'public'), join(tempDir, 'public'));
    await this.copyDirectory(join(expoDocsPath, 'styles'), join(tempDir, 'styles'));

    // Create pages directory and copy MDX files
    const pagesDir = join(tempDir, 'pages');
    await mkdir(pagesDir, { recursive: true });
    
    // Copy _app.tsx and other essential page files
    await this.copyFile(join(expoDocsPath, 'pages', '_app.tsx'), join(pagesDir, '_app.tsx'));
    await this.copyFile(join(expoDocsPath, 'pages', '_document.tsx'), join(pagesDir, '_document.tsx'));

    // Copy MDX files to pages directory
    for (const [relativePath, gitFile] of mdxFiles) {
      const targetPath = join(pagesDir, relativePath);
      const targetDir = dirname(targetPath);
      
      if (!existsSync(targetDir)) {
        await mkdir(targetDir, { recursive: true });
      }
      
      await writeFile(targetPath, gitFile.content, 'utf-8');
    }

    if (this.verbose) {
      console.log(`📄 Copied ${mdxFiles.size} MDX files to temp build environment`);
    }
  }

  /**
   * Run Next.js build process
   */
  private async runNextBuild(tempDir: string): Promise<void> {
    if (this.verbose) {
      console.log('🔧 Installing dependencies in temp environment...');
    }

    // Install dependencies
    await this.runCommand('npm', ['install'], tempDir);

    if (this.verbose) {
      console.log('🏗️ Running Next.js build...');
    }

    // Run Next.js build
    await this.runCommand('npm', ['run', 'build'], tempDir);
  }

  /**
   * Extract compiled HTML from Next.js build output
   */
  private async extractCompiledHTML(tempDir: string): Promise<Map<string, string>> {
    const htmlFiles = new Map<string, string>();
    const outDir = join(tempDir, 'out');

    if (!existsSync(outDir)) {
      throw new Error('Next.js build output directory not found');
    }

    // Recursively find all HTML files in the out directory
    await this.findHTMLFiles(outDir, '', htmlFiles);

    if (this.verbose) {
      console.log(`📄 Found ${htmlFiles.size} compiled HTML files`);
    }

    return htmlFiles;
  }

  /**
   * Recursively find HTML files
   */
  private async findHTMLFiles(dir: string, relativePath: string, htmlFiles: Map<string, string>): Promise<void> {
    const { readdir } = await import('node:fs/promises');
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      const entryRelativePath = relativePath ? join(relativePath, entry.name) : entry.name;

      if (entry.isDirectory()) {
        await this.findHTMLFiles(fullPath, entryRelativePath, htmlFiles);
      } else if (entry.isFile() && entry.name.endsWith('.html')) {
        const content = await readFile(fullPath, 'utf-8');
        htmlFiles.set(entryRelativePath, content);
      }
    }
  }

  /**
   * Convert HTML to clean markdown
   */
  private convertHTMLToMarkdown(html: string): string {
    // Extract main content from Next.js HTML structure
    const contentMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
    const mainContent = contentMatch ? contentMatch[1] : html;

    // Convert to markdown
    let markdown = this.turndownService.turndown(mainContent || '');

    // Clean up the markdown
    markdown = this.cleanupMarkdown(markdown);

    return markdown;
  }

  /**
   * Clean up markdown output
   */
  private cleanupMarkdown(markdown: string): string {
    // Remove excessive newlines
    markdown = markdown.replace(/\n{3,}/g, '\n\n');
    
    // Fix code block spacing
    markdown = markdown.replace(/```(\w+)?\n\n+/g, '```$1\n');
    markdown = markdown.replace(/\n\n+```/g, '\n```');
    
    // Remove empty headings
    markdown = markdown.replace(/^#+\s*$/gm, '');
    
    // Clean up list formatting
    markdown = markdown.replace(/^(\s*[-*+])\s+$/gm, '');
    
    // Remove HTML comments
    markdown = markdown.replace(/<!--[\s\S]*?-->/g, '');
    
    // Trim whitespace
    markdown = markdown.trim();

    return markdown;
  }

  /**
   * Helper to run shell commands
   */
  private async runCommand(command: string, args: string[], cwd: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const childProcess = spawn(command, args, { 
        cwd, 
        stdio: this.verbose ? 'inherit' : 'pipe',
        env: { ...process.env, NODE_ENV: 'production' }
      });

      childProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Command failed with exit code ${code}: ${command} ${args.join(' ')}`));
        }
      });

      childProcess.on('error', reject);
    });
  }

  /**
   * Helper to copy files
   */
  private async copyFile(src: string, dest: string): Promise<void> {
    if (existsSync(src)) {
      const content = await readFile(src);
      const destDir = dirname(dest);
      if (!existsSync(destDir)) {
        await mkdir(destDir, { recursive: true });
      }
      await writeFile(dest, content);
    }
  }

  /**
   * Helper to copy directories recursively
   */
  private async copyDirectory(src: string, dest: string): Promise<void> {
    if (!existsSync(src)) return;

    await mkdir(dest, { recursive: true });
    const { readdir } = await import('node:fs/promises');
    const entries = await readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = join(src, entry.name);
      const destPath = join(dest, entry.name);

      if (entry.isDirectory()) {
        await this.copyDirectory(srcPath, destPath);
      } else {
        await this.copyFile(srcPath, destPath);
      }
    }
  }
}