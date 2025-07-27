#!/usr/bin/env node

/**
 * Test script for local search functionality
 * Usage: npm run search "query here" [-- --version=latest --max-results=5 --score-threshold=0.0]
 * 
 * This script simulates the MCP search-expo-docs tool for local testing
 */

import { parseArgs } from 'node:util';
import { SemanticSearch, SearchOptions } from '../src/services/semantic-search.js';
import { VersionManager } from '../src/services/version-manager.js';

const HELP_TEXT = `
🔍 Expo Docs Search Test - Local search functionality testing

Usage:
  npm run search "query here" [-- options]

Arguments:
  query                Search query (required)

Options:
  --version, -v        Expo SDK version (default: latest)
  --max-results, -m    Maximum results to return (default: 5, max: 10)
  --score-threshold, -s Minimum similarity score (default: 0.0, range: 0.0-1.0)
  --help, -h          Show this help message

Examples:
  npm run search "expo router navigation"
  npm run search "camera permissions" -- --version=v53
  npm run search "push notifications" -- --max-results=3
  npm run search "file system" -- --version=latest --score-threshold=0.5

Note: Requires OPENAI_API_KEY environment variable to be set.
`;

interface SearchTestOptions {
  query: string;
  version: string;
  maxResults: number;
  scoreThreshold: number;
}

function parseCliArgs(): SearchTestOptions {
  try {
    const { values, positionals } = parseArgs({
      options: {
        'version': { type: 'string', short: 'v' },
        'max-results': { type: 'string', short: 'm' },
        'score-threshold': { type: 'string', short: 's' },
        'help': { type: 'boolean', short: 'h' },
      },
      allowPositionals: true,
    });

    if (values.help) {
      console.log(HELP_TEXT);
      process.exit(0);
    }

    if (positionals.length < 1) {
      console.error('❌ Error: search query is required');
      console.log(HELP_TEXT);
      process.exit(1);
    }

    const query = positionals.join(' ').trim();
    if (!query) {
      console.error('❌ Error: search query cannot be empty');
      process.exit(1);
    }

    const version = values.version || 'latest';
    const maxResults = values['max-results'] ? parseInt(values['max-results']) : 5;
    const scoreThreshold = values['score-threshold'] ? parseFloat(values['score-threshold']) : 0.0;

    // Validate version format
    if (!VersionManager.isValidVersionFormat(version)) {
      console.error(`❌ Error: Invalid version format: ${version}. Use v53, v52, v51, or latest`);
      process.exit(1);
    }

    // Validate maxResults
    if (isNaN(maxResults) || maxResults < 1 || maxResults > 10) {
      console.error('❌ Error: max-results must be a number between 1 and 10');
      process.exit(1);
    }

    // Validate scoreThreshold
    if (isNaN(scoreThreshold) || scoreThreshold < 0.0 || scoreThreshold > 1.0) {
      console.error('❌ Error: score-threshold must be a number between 0.0 and 1.0');
      process.exit(1);
    }

    return {
      query,
      version,
      maxResults,
      scoreThreshold,
    };
  } catch (error) {
    console.error('❌ Error parsing arguments:', error instanceof Error ? error.message : String(error));
    console.log(HELP_TEXT);
    process.exit(1);
  }
}

function formatSearchResults(
  query: string,
  version: string,
  results: Awaited<ReturnType<typeof SemanticSearch.searchVersion>>
): void {
  console.log(`\n🔍 Search Results for "${query}" in Expo SDK ${version}:\n`);

  if (results.length === 0) {
    console.log(`❌ No documentation found for query "${query}" in Expo SDK ${version}.

Try:
- Using different search terms
- Checking if you're using the correct Expo SDK version
- Being more specific or more general with your query
`);
    return;
  }

  console.log(`Found ${results.length} documentation ${results.length === 1 ? 'result' : 'results'}:\n`);

  results.forEach((result, index) => {
    const rank = index + 1;
    const title = result.metadata.title || result.metadata.relativePath;
    const score = Math.round(result.score * 1000) / 1000; // Round to 3 decimal places
    
    // Truncate content if too long
    const content = result.content.length > 2000 
      ? result.content.slice(0, 2000) + '...\n\n[Content truncated. See file path for complete documentation.]'
      : result.content;

    console.log(`## ${rank}. ${title}`);
    console.log(`**File:** ${result.metadata.relativePath}`);
    console.log(`**Relevance:** ${score}`);
    console.log('');
    console.log(content);
    console.log('\n---\n');
  });
}

async function main(): Promise<void> {
  const options = parseCliArgs();
  
  console.log('🔍 Expo Docs Search Test');
  console.log(`Query: "${options.query}"`);
  console.log(`Version: ${options.version}`);
  console.log(`Max Results: ${options.maxResults}`);
  console.log(`Score Threshold: ${options.scoreThreshold}`);

  // Check for OpenAI API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('\n❌ Error: OPENAI_API_KEY environment variable is required');
    console.error('Please set your OpenAI API key to perform searches');
    process.exit(1);
  }

  try {
    // Check if version is available
    const availableVersions = await VersionManager.getAvailableVersions();
    if (!VersionManager.isVersionAvailable(options.version)) {
      console.error(`\n❌ Error: Expo SDK ${options.version} documentation is not available.`);
      if (availableVersions.length > 0) {
        console.error(`Available versions: ${availableVersions.join(', ')}`);
      } else {
        console.error('No documentation versions are currently available.');
        console.error('Run: npm run index-docs latest');
      }
      process.exit(1);
    }

    // Perform search
    const searchOptions: SearchOptions = {
      maxResults: options.maxResults,
      scoreThreshold: options.scoreThreshold,
    };

    console.log('\n🔄 Searching...');
    const results = await SemanticSearch.searchVersion(options.query, options.version, searchOptions);
    
    // Format and display results
    formatSearchResults(options.query, options.version, results);

  } catch (error) {
    console.error('\n❌ Search failed:', error instanceof Error ? error.message : String(error));
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