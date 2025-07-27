# Smithery Deployment Guide

This guide covers how to deploy the Expo Docs MCP Server to Smithery.ai.

## Prerequisites

- GitHub repository with your MCP server code
- Smithery.ai account (sign up at https://smithery.ai)
- OpenAI API key (for semantic search functionality)

## Configuration Files

Your repository should include these key files:

### 1. smithery.yaml
```yaml
runtime: "typescript"
```

### 2. package.json
Must include:
- `main` field pointing to built server
- `bin` field for CLI execution
- Proper dependencies and build scripts

### 3. Built Files
The `dist/` directory should contain:
- `mcp-server.js` - The compiled server
- `node_modules/` - External dependencies (hnswlib-node)
- `latest/` - Pre-indexed documentation data

## Deployment Steps

### 1. Prepare Repository
Ensure your code is pushed to GitHub with all necessary files:
```bash
npm run build  # Build the project
git add .
git commit -m "Prepare for Smithery deployment"
git push origin main
```

### 2. Connect to Smithery
1. Visit https://smithery.ai
2. Sign in with your GitHub account
3. Click "Deploy Server" or navigate to the deployment section
4. Connect your GitHub repository

### 3. Configure Server
1. Select your repository (`expo-docs-mcp`)
2. Ensure the branch is set to `main`
3. Smithery will automatically detect the `smithery.yaml` configuration

### 4. Set Environment Variables
In the Smithery dashboard, add:
- `OPENAI_API_KEY`: Your OpenAI API key for embeddings

### 5. Deploy
1. Click "Deploy" in the Smithery dashboard
2. Monitor the build logs for any issues
3. Once deployed, your server will be available at: `server.smithery.ai/your-username/expo-docs-mcp`

## Testing Deployment

After deployment, test your server using the Smithery playground:

1. Navigate to your server page on Smithery
2. Click "Playground" or "Test"
3. Try a sample query:
```json
{
  "name": "search-expo-docs", 
  "arguments": {
    "query": "camera permissions",
    "version": "v53",
    "maxResults": 3
  }
}
```

## Using the Deployed Server

### With Claude Desktop
Install via Smithery CLI:
```bash
npx -y @smithery/cli install your-username/expo-docs-mcp --client claude
```

### Manual Configuration
Add to your Claude Desktop config:
```json
{
  "mcpServers": {
    "expo-docs": {
      "command": "npx",
      "args": ["-y", "@smithery/cli", "connect", "server.smithery.ai/your-username/expo-docs-mcp"],
      "env": {
        "OPENAI_API_KEY": "your_openai_api_key"
      }
    }
  }
}
```

## Troubleshooting

### Build Failures
- Ensure all dependencies are in `package.json`
- Check that `npm run build` works locally
- Verify `smithery.yaml` is in the repository root

### Runtime Errors
- Check environment variables are set correctly
- Ensure OpenAI API key is valid
- Verify the data files are included in the build

### Connection Issues
- Restart your MCP client (Claude Desktop, etc.)
- Check the server status in Smithery dashboard
- Verify the connection URL is correct

## Best Practices

1. **Version Control**: Keep your repository clean and well-organized
2. **Environment Variables**: Never commit API keys to your repository
3. **Testing**: Test locally before deploying
4. **Documentation**: Keep your README.md updated with usage instructions
5. **Monitoring**: Check Smithery dashboard for deployment status and logs

## Support

- Smithery Documentation: https://smithery.ai/docs
- Smithery Discord: Join their community for support
- GitHub Issues: Report issues in your repository

## Next Steps

After successful deployment:
1. Share your MCP server with the community
2. Add usage examples to your README
3. Consider adding more search tools or features
4. Monitor usage and performance through Smithery dashboard 