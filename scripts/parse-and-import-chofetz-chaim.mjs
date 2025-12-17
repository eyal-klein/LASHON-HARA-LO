/**
 * Parse HTML from scraped Chofetz Chaim and import to database
 * Extracts clean text, creates chunks, and saves to chofetz_chaim_content table
 */

import fs from 'fs/promises';
import { JSDOM } from 'jsdom';
import mysql from 'mysql2/promise';

const DATA_FILE = './data/chofetz-chaim/chofetz-chaim-raw.json';

// Database connection from environment
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
});

// Extract clean text from HTML
function extractText(html) {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  
  // Remove navigation and metadata
  const navs = doc.querySelectorAll('div[style*="border"]');
  navs.forEach(nav => nav.remove());
  
  // HTML comments are already removed by JSDOM parser
  
  // Get main content
  const mainDiv = doc.querySelector('.mw-parser-output');
  if (!mainDiv) return '';
  
  // Extract text, preserving structure
  let text = mainDiv.textContent || '';
  
  // Clean up whitespace
  text = text
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Multiple newlines to double
    .replace(/[ \t]+/g, ' ') // Multiple spaces to single
    .trim();
  
  return text;
}

// Split text into chunks for RAG (max 1000 chars with overlap)
function createChunks(text, maxChars = 1000, overlap = 200) {
  const chunks = [];
  const paragraphs = text.split('\n\n');
  
  let currentChunk = '';
  
  for (const para of paragraphs) {
    if (currentChunk.length + para.length > maxChars && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      // Overlap: keep last part of previous chunk
      const words = currentChunk.split(' ');
      const overlapWords = words.slice(-Math.floor(overlap / 5));
      currentChunk = overlapWords.join(' ') + '\n\n' + para;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + para;
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

async function main() {
  console.log('🚀 Starting Chofetz Chaim parser and importer...\n');
  
  // Read scraped data
  const rawData = JSON.parse(await fs.readFile(DATA_FILE, 'utf-8'));
  
  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await pool.query('DELETE FROM chofetz_chaim_content');
  
  let totalChunks = 0;
  let totalSeifim = 0;
  
  // Process Lashon Hara
  console.log('\n📖 Processing הלכות לשון הרע...');
  for (const klal of rawData.lashon_hara) {
    const klalNum = klal.title.replace('כלל ', '');
    
    for (const seif of klal.seifim) {
      totalSeifim++;
      const text = extractText(seif.content);
      
      if (!text || text.length < 50) {
        console.log(`  ⚠️  Skipping ${klalNum}:${seif.seifLetter} - too short`);
        continue;
      }
      
      const chunks = createChunks(text);
      
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        
        await pool.query(
          `INSERT INTO chofetz_chaim_content 
           (section, klal, seif, chunk_index, content, source_url, created_at) 
           VALUES (?, ?, ?, ?, ?, ?, NOW())`,
          ['lashon_hara', klalNum, seif.seifLetter, i, chunk, seif.url]
        );
        
        totalChunks++;
      }
      
      process.stdout.write(`  ✅ ${klalNum}:${seif.seifLetter} (${chunks.length} chunks)\n`);
    }
  }
  
  // Process Rechilut
  console.log('\n📖 Processing הלכות רכילות...');
  for (const klal of rawData.rechilut) {
    const klalNum = klal.title.replace('כלל ', '');
    
    for (const seif of klal.seifim) {
      totalSeifim++;
      const text = extractText(seif.content);
      
      if (!text || text.length < 50) {
        console.log(`  ⚠️  Skipping ${klalNum}:${seif.seifLetter} - too short`);
        continue;
      }
      
      const chunks = createChunks(text);
      
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        
        await pool.query(
          `INSERT INTO chofetz_chaim_content 
           (section, klal, seif, chunk_index, content, source_url, created_at) 
           VALUES (?, ?, ?, ?, ?, ?, NOW())`,
          ['rechilut', klalNum, seif.seifLetter, i, chunk, seif.url]
        );
        
        totalChunks++;
      }
      
      process.stdout.write(`  ✅ ${klalNum}:${seif.seifLetter} (${chunks.length} chunks)\n`);
    }
  }
  
  console.log(`\n✅ Import complete!`);
  console.log(`   - Processed ${totalSeifim} seifim`);
  console.log(`   - Created ${totalChunks} chunks`);
  console.log(`   - Average ${(totalChunks / totalSeifim).toFixed(1)} chunks per seif`);
  
  await pool.end();
}

main().catch(console.error);
