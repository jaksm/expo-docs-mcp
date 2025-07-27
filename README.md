# Expo Docs MCP Server

MCP server for semantic search of pre-indexed Expo documentation. Search through Expo SDK documentation using AI-powered semantic search with version-specific results.

## Features

- 🔍 **Semantic Search**: AI-powered search through Expo documentation
- 📚 **Version-Specific**: Search across different Expo SDK versions (v51, v52, v53, latest)
- ⚡ **Fast Results**: Pre-indexed documentation with HNSW vector search
- 🎯 **Relevant Results**: Similarity scoring and configurable result limits

## Tools

### search-expo-docs

Search Expo documentation using semantic search.

**Parameters:**
- `query` (string, required): The search query to find relevant Expo documentation
- `version` (string, required): Expo SDK version (v53, v52, v51, or latest)
- `maxResults` (number, optional): Maximum number of results to return (1-10, default: 5)
- `scoreThreshold` (number, optional): Minimum similarity score threshold (0.0-1.0, default: 0.0)

**Example:**
```json
{
  "name": "search-expo-docs",
  "arguments": {
    "query": "how to use camera in expo",
    "version": "v53",
    "maxResults": 3
  }
}
```

## Installation

### Via Smithery (Recommended)

Install directly using the Smithery CLI:

```bash
npx -y @smithery/cli install expo-docs-mcp --client claude
```

### Manual Installation for Claude Desktop

1. Add to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "expo-docs": {
      "command": "npx",
      "args": ["-y", "expo-docs-mcp"],
      "env": {
        "OPENAI_API_KEY": "your_openai_api_key_here"
      }
    }
  }
}
```

2. Restart Claude Desktop

## Environment Variables

- `OPENAI_API_KEY`: Required for semantic search functionality

## Development

```bash
# Clone the repository
git clone https://github.com/jaksm/expo-docs-mcp.git
cd expo-docs-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Run the server
npm start

# Development mode
npm run dev:server
```

## Available Versions

- `latest`: Most recent Expo SDK documentation
- `v53`: Expo SDK 53
- `v52`: Expo SDK 52  
- `v51`: Expo SDK 51

## Usage Examples

Search for camera-related documentation:
```
Query: "camera permissions and usage"
Version: "v53"
```

Find navigation information:
```
Query: "react navigation setup and routing"
Version: "latest"
```

Look up build configuration:
```
Query: "eas build configuration for iOS"
Version: "v52"
```

## Architecture

- **Semantic Search**: Uses OpenAI embeddings with HNSW indexing
- **Version Management**: Separate indexes for each Expo SDK version
- **Pre-processed Data**: Documentation is pre-indexed for fast retrieval
- **MCP Protocol**: Standard Model Context Protocol implementation

## License

MIT

## Contributing

Contributions welcome! Please read the contributing guidelines and submit pull requests to the main branch.