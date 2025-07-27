#!/usr/bin/env node

import { parseArgs } from 'node:util';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';

import { FileDiscovery } from './file-discovery.js';
import { ParallelDownloader } from './parallel-downloader.js';
import { MdxConverter } from './mdx-converter.js';
import type { CliOptions } from './types.js';

const HELP_TEXT = `
📚 Expo Docs MCP - Download and convert Expo documentation

Usage:
  expo-docs-mcp --out-dir <directory> [options]

Options:
  --out-dir, -o     Output directory for converted markdown files (required)
  --batch-size, -b  Number of files to download in parallel (default: 10)
  --verbose, -v     Enable verbose logging
  --help, -h        Show this help message

Examples:
  expo-docs-mcp --out-dir ./expo-docs
  expo-docs-mcp --out-dir ~/Documents/expo-docs --batch-size 5 --verbose
`;

function parseCliArgs(): CliOptions {
  try {
    const { values } = parseArgs({
      options: {
        'out-dir': { type: 'string', short: 'o' },
        'batch-size': { type: 'string', short: 'b' },
        'verbose': { type: 'boolean', short: 'v' },
        'help': { type: 'boolean', short: 'h' },
      },
      allowPositionals: false,
    });

    if (values.help) {
      console.log(HELP_TEXT);
      process.exit(0);
    }

    if (!values['out-dir']) {
      console.error('❌ Error: --out-dir is required');
      console.log(HELP_TEXT);
      process.exit(1);
    }

    const batchSize = values['batch-size'] ? parseInt(values['batch-size'], 10) : 10;
    if (isNaN(batchSize) || batchSize < 1 || batchSize > 50) {
      console.error('❌ Error: --batch-size must be a number between 1 and 50');
      process.exit(1);
    }

    return {
      outDir: resolve(values['out-dir']),
      batchSize,
      verbose: Boolean(values.verbose),
    };
  } catch (error) {
    console.error('❌ Error parsing arguments:', error instanceof Error ? error.message : String(error));
    console.log(HELP_TEXT);
    process.exit(1);
  }
}

async function ensureOutputDirectory(outDir: string): Promise<void> {
  try {
    if (!existsSync(outDir)) {
      await mkdir(outDir, { recursive: true });
      console.log(`📁 Created output directory: ${outDir}`);
    } else {
      console.log(`📁 Using existing output directory: ${outDir}`);
    }
  } catch (error) {
    throw new Error(`Failed to create output directory: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function main(): Promise<void> {
  console.log('🚀 Expo Docs MCP - Starting documentation download and conversion\n');

  const options = parseCliArgs();

  if (options.verbose) {
    console.log('🔧 Configuration:');
    console.log(`   Output directory: ${options.outDir}`);
    console.log(`   Batch size: ${options.batchSize}`);
    console.log(`   Verbose mode: ${options.verbose}\n`);
  }

  try {
    // Ensure output directory exists
    await ensureOutputDirectory(options.outDir);

    // Phase 1: Discover files
    console.log('📋 Phase 1: File Discovery');
    const discovery = new FileDiscovery();
    const mdxFiles = await discovery.discoverMdxFiles();

    if (mdxFiles.length === 0) {
      console.log('⚠️  No MDX files found to process');
      return;
    }

    // Phase 2: Download files
    console.log('\n📥 Phase 2: Download Files');
    const downloader = new ParallelDownloader(options.batchSize, options.verbose);
    const downloadedFiles = await downloader.downloadFiles(mdxFiles);

    // Phase 3: Convert to markdown
    console.log('\n🔄 Phase 3: Convert to Markdown');
    const converter = new MdxConverter(options.verbose);
    await converter.convertFiles(downloadedFiles, options.outDir);

    console.log('\n🎉 Success! Expo documentation has been downloaded and converted.');
    console.log(`📂 Output location: ${options.outDir}`);

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