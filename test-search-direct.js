import { readFile } from 'fs/promises';
import { join } from 'path';

// Simple test to check if we can read the vector database files
async function testVectorData() {
  try {
    const vectorPath = '/Users/jaksm/expo-docs-mcp/dist/latest/vector';
    
    // Check if args.json exists (contains search configuration)
    const argsPath = join(vectorPath, 'args.json');
    const args = JSON.parse(await readFile(argsPath, 'utf8'));
    console.log('Vector database configuration:', args);
    
    // Check if docstore.json exists (contains document metadata)
    const docstorePath = join(vectorPath, 'docstore.json');
    const docstore = JSON.parse(await readFile(docstorePath, 'utf8'));
    const docIds = Object.keys(docstore);
    console.log(`Found ${docIds.length} documents in vector store`);
    
    // Sample a few documents to check quality
    console.log('\nSample documents:');
    docIds.slice(0, 3).forEach(id => {
      const doc = docstore[id];
      console.log(`- ${doc.metadata?.source || 'Unknown source'}: "${doc.pageContent?.substring(0, 100)}..."`);
    });
    
  } catch (error) {
    console.error('Error reading vector data:', error.message);
  }
}

testVectorData();