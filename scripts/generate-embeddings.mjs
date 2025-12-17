/**
 * Generate embeddings for all Chofetz Chaim chunks using Manus LLM API
 * Uses text-embedding-3-small model for semantic search
 */

import mysql from 'mysql2/promise';

const MANUS_API_URL = process.env.BUILT_IN_FORGE_API_URL;
const MANUS_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;

if (!MANUS_API_URL || !MANUS_API_KEY) {
  console.error('❌ Missing MANUS API credentials');
  process.exit(1);
}

// Database connection
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
});

// Generate embedding for text using Manus LLM API
async function generateEmbedding(text) {
  // Use Forge API endpoint like in server/_core/llm.ts
  const apiUrl = MANUS_API_URL && MANUS_API_URL.trim().length > 0
    ? `${MANUS_API_URL.replace(/\/$/, '')}/v1/embeddings`
    : 'https://forge.manus.im/v1/embeddings';
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MANUS_API_KEY}`,
    },
    body: JSON.stringify({
      input: text,
      model: 'text-embedding-3-small',
    }),
  });

  if (!response.ok) {
    throw new Error(`Embedding API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

// Cosine similarity for vector comparison
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function main() {
  console.log('🚀 Starting embeddings generation...\n');
  
  // Get all chunks without embeddings
  const [rows] = await pool.query(
    'SELECT id, content FROM chofetz_chaim_content WHERE embedding IS NULL ORDER BY id'
  );
  
  console.log(`📊 Found ${rows.length} chunks to process\n`);
  
  let processed = 0;
  let errors = 0;
  
  for (const row of rows) {
    try {
      process.stdout.write(`  Processing chunk ${row.id}...`);
      
      // Generate embedding
      const embedding = await generateEmbedding(row.content);
      
      // Save to database
      await pool.query(
        'UPDATE chofetz_chaim_content SET embedding = ? WHERE id = ?',
        [JSON.stringify(embedding), row.id]
      );
      
      processed++;
      console.log(` ✅ (${processed}/${rows.length})`);
      
      // Rate limiting - wait 100ms between requests
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      errors++;
      console.log(` ❌ Error: ${error.message}`);
    }
  }
  
  console.log(`\n✅ Embeddings generation complete!`);
  console.log(`   - Processed: ${processed} chunks`);
  console.log(`   - Errors: ${errors} chunks`);
  console.log(`   - Success rate: ${((processed / rows.length) * 100).toFixed(1)}%`);
  
  // Test similarity search
  console.log(`\n🔍 Testing semantic search...`);
  const testQuery = 'מה זה לשון הרע?';
  console.log(`   Query: "${testQuery}"`);
  
  const queryEmbedding = await generateEmbedding(testQuery);
  
  // Get all embeddings for comparison
  const [allChunks] = await pool.query(
    'SELECT id, section, klal, seif, content, embedding FROM chofetz_chaim_content WHERE embedding IS NOT NULL LIMIT 100'
  );
  
  // Calculate similarities
  const results = allChunks.map(chunk => ({
    ...chunk,
    embedding: JSON.parse(chunk.embedding),
    similarity: cosineSimilarity(queryEmbedding, JSON.parse(chunk.embedding))
  }));
  
  // Sort by similarity
  results.sort((a, b) => b.similarity - a.similarity);
  
  // Show top 3 results
  console.log(`\n   Top 3 results:`);
  for (let i = 0; i < 3 && i < results.length; i++) {
    const r = results[i];
    console.log(`   ${i + 1}. ${r.section} ${r.klal}:${r.seif} - Similarity: ${r.similarity.toFixed(4)}`);
    console.log(`      "${r.content.substring(0, 100)}..."`);
  }
  
  await pool.end();
}

main().catch(console.error);
