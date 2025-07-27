#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { SemanticSearch, SearchOptions } from './services/semantic-search.js';
import { VersionManager } from './services/version-manager.js';

const server = new Server(
  {
    name: 'expo-docs-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'search-expo-docs',
        description: 'Search Expo documentation using semantic search. Requires the version to match your project\'s Expo SDK version.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'The search query to find relevant Expo documentation',
            },
            version: {
              type: 'string',
              description: 'Required: Expo SDK version (e.g., v53, v52, v51, latest). Must match your project\'s Expo version.',
              pattern: '^(v\\d+|latest)$',
            },
            maxResults: {
              type: 'number',
              description: 'Maximum number of results to return (default: 5)',
              minimum: 1,
              maximum: 10,
              default: 5,
            },
            scoreThreshold: {
              type: 'number',
              description: 'Minimum similarity score threshold (default: 0.0)',
              minimum: 0.0,
              maximum: 1.0,
              default: 0.0,
            },
          },
          required: ['query', 'version'],
        },
      },
      {
        name: 'get-instructions',
        description: 'Get comprehensive instructions on how to use the Expo Docs MCP server, including available versions, search parameters, and usage examples.',
        inputSchema: {
          type: 'object',
          properties: {},
          additionalProperties: false,
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'search-expo-docs') {
    try {
      const { query, version, maxResults = 5, scoreThreshold = 0.0 } = args as {
        query: string;
        version: string;
        maxResults?: number;
        scoreThreshold?: number;
      };

      // Validate required parameters
      if (!query || typeof query !== 'string') {
        throw new McpError(ErrorCode.InvalidParams, 'query parameter is required and must be a string');
      }

      if (!version || typeof version !== 'string') {
        throw new McpError(ErrorCode.InvalidParams, 'version parameter is required and must be a string (e.g., v53, v52, v51, latest)');
      }

      // Validate version format
      if (!VersionManager.isValidVersionFormat(version)) {
        throw new McpError(ErrorCode.InvalidParams, `Invalid version format: ${version}. Use v53, v52, v51, or latest`);
      }

      // Check if version is available
      if (!VersionManager.isVersionAvailable(version)) {
        const errorMessage = await VersionManager.getMissingVersionError(version);
        throw new McpError(ErrorCode.InvalidParams, errorMessage);
      }

      // Validate optional parameters
      if (maxResults !== undefined && (typeof maxResults !== 'number' || maxResults < 1 || maxResults > 10)) {
        throw new McpError(ErrorCode.InvalidParams, 'maxResults must be a number between 1 and 10');
      }

      if (scoreThreshold !== undefined && (typeof scoreThreshold !== 'number' || scoreThreshold < 0 || scoreThreshold > 1)) {
        throw new McpError(ErrorCode.InvalidParams, 'scoreThreshold must be a number between 0.0 and 1.0');
      }

      // Perform search
      const searchOptions: SearchOptions = {
        maxResults,
        scoreThreshold,
      };

      const results = await SemanticSearch.searchVersion(query, version, searchOptions);

      // Format results for the AI
      const formattedResults = results.map((result, index) => {
        return {
          rank: index + 1,
          title: result.metadata.title || result.metadata.relativePath,
          filePath: result.metadata.relativePath,
          score: Math.round(result.score * 1000) / 1000, // Round to 3 decimal places
          content: result.content.length > 2000 
            ? result.content.slice(0, 2000) + '...\n\n[Content truncated. Use the file path for complete documentation.]'
            : result.content,
        };
      });

      if (results.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `No documentation found for query "${query}" in Expo SDK ${version}.\n\nTry:\n- Using different search terms\n- Checking if you're using the correct Expo SDK version\n- Being more specific or more general with your query`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: `Found ${results.length} documentation ${results.length === 1 ? 'result' : 'results'} for "${query}" in Expo SDK ${version}:\n\n${
              formattedResults.map(result => 
                `## ${result.rank}. ${result.title}\n` +
                `**File:** ${result.filePath}\n` +
                `**Relevance:** ${result.score}\n\n` +
                `${result.content}\n\n---\n`
              ).join('')
            }`,
          },
        ],
      };

    } catch (error) {
      // Re-throw McpError as-is
      if (error instanceof McpError) {
        throw error;
      }

      // Handle other errors
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Check if it's a missing version error
      if (errorMessage.includes('not found locally')) {
        throw new McpError(ErrorCode.InvalidParams, errorMessage);
      }

      // Check if it's an OpenAI API key error
      if (errorMessage.includes('OPENAI_API_KEY')) {
        throw new McpError(ErrorCode.InvalidParams, 'OpenAI API key is required. Please set the OPENAI_API_KEY environment variable.');
      }

      throw new McpError(ErrorCode.InternalError, `Search failed: ${errorMessage}`);
    }
  }

  if (name === 'get-instructions') {
    try {
      const availableVersions = await VersionManager.getAvailableVersions();
      
      const instructions = `# Expo Docs MCP Server - Usage Instructions

## Overview
This MCP server provides semantic search capabilities for Expo SDK documentation. It uses AI-powered embeddings to find relevant documentation based on your queries.

## Available Tools

### 1. search-expo-docs
Search through Expo documentation with semantic understanding.

**Parameters:**
- \`query\` (required): Your search question or keywords
- \`version\` (required): Expo SDK version (${availableVersions.length > 0 ? availableVersions.join(', ') : 'latest'})
- \`maxResults\` (optional): Number of results to return (1-10, default: 5)
- \`scoreThreshold\` (optional): Minimum relevance score (0.0-1.0, default: 0.0)

**Example:**
\`\`\`json
{
  "query": "how to implement push notifications",
  "version": "latest",
  "maxResults": 3,
  "scoreThreshold": 0.5
}
\`\`\`

### 2. get-instructions
Returns these usage instructions (no parameters needed).

## Available Versions
${availableVersions.length > 0 ? availableVersions.map(v => `- ${v}`).join('\n') : 'No versions currently available. Please check deployment configuration.'}

## Usage Tips

1. **Be specific**: Instead of "navigation", try "how to implement tab navigation with React Navigation"
2. **Include context**: "expo-camera permissions setup" vs just "camera"
3. **Use natural language**: "How do I handle app state changes?" works better than "app state"
4. **Version matters**: Always specify the correct Expo SDK version for your project

## Common Queries

- "how to implement push notifications"
- "expo-camera setup and permissions"
- "configuring deep linking"
- "building for production"
- "expo modules development"
- "handling app updates"

## Troubleshooting

- **No results found**: Try broader terms or check if you're using the correct version
- **Low relevance scores**: Be more specific with your query
- **Version not available**: Use one of the available versions listed above

## Support

For issues with this MCP server, visit: https://github.com/jaksm/expo-docs-mcp`;

      return {
        content: [
          {
            type: 'text',
            text: instructions,
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new McpError(ErrorCode.InternalError, `Failed to generate instructions: ${errorMessage}`);
    }
  }

  throw new McpError(ErrorCode.MethodNotFound, `Tool not found: ${name}`);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Log server start to stderr so it doesn't interfere with the MCP protocol
  console.error('Expo Docs MCP Server started');
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});