#!/usr/bin/env node

import { parseArgs } from 'node:util';
import { DocsInitializer } from './services/docs-initializer.js';

const HELP_TEXT = `
📚 Expo Docs MCP - Initialize Expo documentation for semantic search

Usage:
  expo-docs-mcp init <version> [options]

Arguments:
  version              Expo SDK version (e.g., v53, v52, v51, latest)

Options:
  --verbose, -v        Enable verbose logging
  --help, -h          Show this help message

Examples:
  expo-docs-mcp init v53
  expo-docs-mcp init latest --verbose
  expo-docs-mcp init v52 -v

Popular Expo SDK versions:
  v53 (latest)
  v52
  v51
`;

interface CliOptions {
  version: string;
  verbose: boolean;
}

function parseCliArgs(): CliOptions {
  try {
    const { values, positionals } = parseArgs({
      options: {
        'verbose': { type: 'boolean', short: 'v' },
        'help': { type: 'boolean', short: 'h' },
      },
      allowPositionals: true,
    });

    if (values.help) {
      console.log(HELP_TEXT);
      process.exit(0);
    }

    if (positionals.length < 2 || positionals[0] !== 'init' || !positionals[1]) {
      console.error('❌ Error: version argument is required');
      console.log(HELP_TEXT);
      process.exit(1);
    }

    const version = positionals[1];
    
    // Validate version format
    if (!version.match(/^(v\d+|latest)$/)) {
      console.error('❌ Error: Invalid version format. Use v53, v52, v51, or latest');
      process.exit(1);
    }

    return {
      version,
      verbose: Boolean(values.verbose),
    };
  } catch (error) {
    console.error('❌ Error parsing arguments:', error instanceof Error ? error.message : String(error));
    console.log(HELP_TEXT);
    process.exit(1);
  }
}

async function main(): Promise<void> {
  const options = parseCliArgs();
  
  console.log('🚀 Expo Docs MCP - Initializing documentation\n');

  if (options.verbose) {
    console.log('🔧 Configuration:');
    console.log(`   Version: ${options.version}`);
    console.log(`   Verbose mode: ${options.verbose}\n`);
  }

  try {
    const initializer = new DocsInitializer(options.verbose);
    await initializer.initializeVersion(options.version);

    console.log('\n🎉 Success! Expo documentation has been initialized and vectorized.');
    console.log(`📂 You can now use search-expo-docs with version: ${options.version}`);

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