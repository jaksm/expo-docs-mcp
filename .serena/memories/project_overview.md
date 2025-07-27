# Expo Docs MCP Project Overview

## Purpose
This is an MCP (Model Context Protocol) server for semantic search of pre-indexed Expo documentation. It provides intelligent search capabilities over Expo SDK documentation using vector embeddings.

## Tech Stack
- **Language**: TypeScript
- **Runtime**: Node.js 
- **Key Dependencies**: 
  - `@modelcontextprotocol/sdk` - MCP server framework
  - `@langchain/openai` - OpenAI embeddings
  - `@langchain/textsplitters` - Token-based text chunking
  - `@langchain/community` - Vector stores (HNSWLib)
  - `mdx-to-md` - MDX to Markdown conversion

## Architecture
- **MCP Server** (`src/mcp-server.ts`) - Main server handling search requests
- **Services Directory** (`src/services/`) - Core functionality:
  - `semantic-search.ts` - Vector-based document search
  - `vectorizer.ts` - Document chunking and embedding
  - `mdx-compiler.ts` - MDX to Markdown conversion
  - `version-manager.ts` - Multi-version documentation handling
  - `local-repo-reader.ts` - Local Expo repo file reading

## Current Issue
Working on fixing MDX to Markdown conversion that's corrupting code blocks. The goal is to preserve complete TypeScript/JavaScript code examples during conversion from Expo's MDX files to searchable markdown.