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

### Claude Code Installation

For Claude Code, you can use the built-in MCP configuration:

1. **Via Smithery CLI** (Recommended):
```bash
npx -y @smithery/cli install expo-docs-mcp --client claude-code
```

2. **Manual Configuration**:
```bash
# Add the MCP server to Claude Code
claude mcp add expo-docs npx -y expo-docs-mcp

# Set the OpenAI API key
claude mcp config set expo-docs OPENAI_API_KEY=your_openai_api_key_here

# Verify the configuration
claude mcp list
```

3. **Alternative Local Build Method**:
```bash
# Clone and build locally
git clone https://github.com/jaksm/expo-docs-mcp.git
cd expo-docs-mcp
npm install
npm run build

# Add to Claude Code
claude mcp add expo-docs node ./dist/mcp-server.js
claude mcp config set expo-docs OPENAI_API_KEY=your_openai_api_key_here
```

## Environment Variables

- `OPENAI_API_KEY`: Required for generating text embeddings during search queries. The server uses OpenAI's text-embedding-3-large model to convert your search queries into vectors that can be matched against the pre-indexed Expo documentation vectors.

## Development

```bash
# Clone the repository
git clone https://github.com/jaksm/expo-docs-mcp.git
cd expo-docs-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Test the MCP server connection
npm run test:mcp

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

### In Claude Desktop or Claude Code

Once installed, you can ask questions about Expo documentation directly:

**Camera-related queries:**
```
How do I request camera permissions in Expo v53?
```

**Navigation setup:**
```
Show me how to set up React Navigation with Expo Router in the latest version
```

**Build configuration:**
```
What are the EAS build configuration options for iOS in Expo v52?
```

**SDK-specific features:**
```
What are the new features in Expo SDK 53?
```

### Direct Tool Usage

If calling the tool directly, use this format:

```json
{
  "name": "search-expo-docs",
  "arguments": {
    "query": "camera permissions and usage",
    "version": "v53",
    "maxResults": 3,
    "scoreThreshold": 0.1
  }
}
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