#!/usr/bin/env node

/**
 * Simple test script to verify MCP server is working correctly
 * This can be used to test the server before connecting it to Claude clients
 */

import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SERVER_PATH = join(__dirname, '..', 'dist', 'mcp-server.js');

console.log('🧪 Testing Expo Docs MCP Server Connection...\n');

// Test message to send to the server
const testMessage = {
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/list',
  params: {}
};

// Spawn the MCP server process
const serverProcess = spawn('node', [SERVER_PATH], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let responseData = '';

// Set up timeout
const timeout = setTimeout(() => {
  console.log('❌ Test timed out after 10 seconds');
  serverProcess.kill();
  process.exit(1);
}, 10000);

// Handle server output
serverProcess.stdout.on('data', (data) => {
  responseData += data.toString();
  
  // Look for JSON response
  try {
    const lines = responseData.split('\n');
    for (const line of lines) {
      if (line.trim().startsWith('{')) {
        const response = JSON.parse(line.trim());
        
        if (response.result && response.result.tools) {
          clearTimeout(timeout);
          console.log('✅ MCP Server is responding correctly!');
          console.log(`📋 Found ${response.result.tools.length} tools:`);
          
          response.result.tools.forEach((tool, index) => {
            console.log(`   ${index + 1}. ${tool.name}: ${tool.description}`);
          });
          
          console.log('\n🎉 Server test completed successfully!');
          console.log('\n💡 Next steps:');
          console.log('   - Deploy to Smithery using the DEPLOYMENT.md guide');
          console.log('   - Install in Claude Desktop or Claude Code');
          console.log('   - Start asking questions about Expo documentation!');
          
          serverProcess.kill();
          process.exit(0);
        }
      }
    }
  } catch (err) {
    // Continue waiting for valid JSON
  }
});

// Handle server errors
serverProcess.stderr.on('data', (data) => {
  const errorMsg = data.toString();
  if (!errorMsg.includes('Expo Docs MCP Server started')) {
    console.log('⚠️  Server stderr:', errorMsg);
  }
});

// Handle server exit
serverProcess.on('close', (code) => {
  clearTimeout(timeout);
  if (code !== 0) {
    console.log(`❌ Server exited with code ${code}`);
    process.exit(1);
  }
});

// Send test message to server
setTimeout(() => {
  console.log('📤 Sending test message to server...');
  serverProcess.stdin.write(JSON.stringify(testMessage) + '\n');
}, 1000);

// Handle script interruption
process.on('SIGINT', () => {
  console.log('\n🛑 Test interrupted by user');
  clearTimeout(timeout);
  serverProcess.kill();
  process.exit(0);
}); 