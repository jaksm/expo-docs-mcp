# Expo Docs MCP

[![npm version](https://badge.fury.io/js/expo-docs-mcp.svg)](https://badge.fury.io/js/expo-docs-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Model Context Protocol (MCP) server that provides semantic search capabilities for Expo documentation. This server enables AI assistants to search and retrieve relevant Expo documentation using natural language queries.

## Features

- 🔍 **Semantic Search**: Advanced semantic search across Expo documentation
- 📚 **Version Support**: Supports multiple Expo SDK versions (v51, v52, v53, latest)
- ⚡ **Fast Retrieval**: Pre-indexed documentation for quick search results
- 🎯 **Relevance Scoring**: Configurable similarity thresholds for precise results
- 🔧 **Easy Integration**: Works with Claude Desktop, Claude Code, Cursor, and other MCP-compatible clients

## Prerequisites

- Node.js 18 or higher
- OpenAI API key (for embeddings)

## Installation

### Option 1: Smithery CLI (Recommended)

The easiest way to install this MCP server is using the Smithery CLI:

```bash
npx -y @smithery/cli install expo-docs-mcp --client claude
```

### Option 2: Claude Desktop Manual Setup

1. First, ensure you have the built server available:
```bash
git clone https://github.com/your-username/expo-docs-mcp.git
cd expo-docs-mcp
npm install
npm run build
```

2. Add to your Claude Desktop configuration file:

**On macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**On Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "expo-docs": {
      "command": "node",
      "args": ["/path/to/expo-docs-mcp/dist/mcp-server.js"],
      "env": {
        "OPENAI_API_KEY": "your-openai-api-key-here"
      }
    }
  }
}
```

### Option 3: Claude Code

1. Build the server:
```bash
git clone https://github.com/your-username/expo-docs-mcp.git
cd expo-docs-mcp
npm install
npm run build
```

2. Add to your Claude Code MCP configuration:
```bash
claude mcp add expo-docs node /path/to/expo-docs-mcp/dist/mcp-server.js
claude mcp config set expo-docs OPENAI_API_KEY=your-openai-api-key-here
```

### Option 4: Cursor

1. Install and build:
```bash
git clone https://github.com/your-username/expo-docs-mcp.git
cd expo-docs-mcp
npm install
npm run build
```

2. Add to your Cursor settings. In Cursor, go to Settings > Features > Model Context Protocol and add:
```json
{
  "expo-docs": {
    "command": "node",
    "args": ["/path/to/expo-docs-mcp/dist/mcp-server.js"],
    "env": {
      "OPENAI_API_KEY": "your-openai-api-key-here"
    }
  }
}
```

### Option 5: Local Development

```bash
git clone https://github.com/your-username/expo-docs-mcp.git
cd expo-docs-mcp
npm install

# Set your OpenAI API key
export OPENAI_API_KEY=your-openai-api-key-here

# Build the server
npm run build

# Run the server
npm start
```

## Configuration

### Environment Variables

- `OPENAI_API_KEY` (required): Your OpenAI API key for generating embeddings

### Tool Parameters

The server provides a `search-expo-docs` tool with the following parameters:

- `query` (required): The search query to find relevant Expo documentation
- `version` (required): Expo SDK version (e.g., "v53", "v52", "v51", "latest")
- `maxResults` (optional): Maximum number of results to return (default: 5, max: 10)
- `scoreThreshold` (optional): Minimum similarity score threshold (default: 0.0, max: 1.0)

## Usage Examples

Once configured, you can use natural language queries to search Expo documentation:

```
"How do I use Expo Router for navigation in v53?"
"Show me examples of using Expo Camera"
"What are the new features in Expo SDK 53?"
"How to configure push notifications with Expo?"
```

## Supported Expo Versions

- **v53** (latest): Latest Expo SDK with newest features
- **v52**: Previous stable release
- **v51**: Legacy support
- **latest**: Always points to the most recent version

## Development

### Building the Server

```bash
npm run build
```

### Running in Development Mode

```bash
npm run dev:server
```

### Testing Search Functionality

```bash
npm run search
```

### Indexing Documentation (for maintainers)

```bash
npm run index-docs
```

## Project Structure

```
├── src/
│   ├── mcp-server.ts       # Main MCP server implementation
│   ├── services/           # Core services
│   │   ├── semantic-search.ts  # Search functionality
│   │   └── version-manager.ts  # Version management
│   └── types.ts           # TypeScript definitions
├── data/                  # Pre-indexed documentation data
├── scripts/               # Build and utility scripts
└── dist/                  # Built server (generated)
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Troubleshooting

### Common Issues

1. **"OpenAI API key not found"**: Ensure `OPENAI_API_KEY` is set in your environment
2. **"Version not supported"**: Check that the version string matches supported versions (v51, v52, v53, latest)
3. **"No results found"**: Try adjusting the `scoreThreshold` parameter or use broader search terms

### Support

For issues and feature requests, please open an issue on [GitHub](https://github.com/your-username/expo-docs-mcp/issues).