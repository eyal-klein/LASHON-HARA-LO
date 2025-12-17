import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read raw data
const rawData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/chofetz-chaim/chofetz-chaim-raw.json'), 'utf8')
);

// Helper to clean HTML and extract text
function cleanHTML(html) {
  if (!html) return '';
  
  // Remove HTML tags but keep structure
  let text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#160;/g, ' ')
    // Clean up extra whitespace
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
  
  return text;
}

// Parse sections into chunks
const chunks = [];
let chunkId = 1;

function processKlal(klal, type) {
  const { title, seifim } = klal;
  
  if (!seifim || seifim.length === 0) {
    console.log(`Warning: No seifim for ${title}`);
    return;
  }
  
  seifim.forEach(seif => {
    const { seifLetter, content } = seif;
    const cleanText = cleanHTML(content);
    
    if (cleanText.length < 50) {
      console.log(`Warning: Short content for ${title} סעיף ${seifLetter}: ${cleanText.length} chars`);
      return;
    }
    
    // Split into smaller chunks if too long (max 1500 chars per chunk)
    const maxChunkSize = 1500;
    
    if (cleanText.length <= maxChunkSize) {
      chunks.push({
        id: chunkId++,
        type, // 'lashon_hara' or 'rechilut'
        klal: title,
        seif: seifLetter,
        title: `${title} - סעיף ${seifLetter}`,
        content: cleanText,
        char_count: cleanText.length,
        word_count: cleanText.split(/\s+/).length
      });
    } else {
      // Split by paragraphs
      const paragraphs = cleanText.split('\n\n');
      let currentChunk = '';
      let partNumber = 1;
      
      for (const para of paragraphs) {
        if (currentChunk.length + para.length > maxChunkSize && currentChunk.length > 0) {
          // Save current chunk
          chunks.push({
            id: chunkId++,
            type,
            klal: title,
            seif: seifLetter,
            title: `${title} - סעיף ${seifLetter} (חלק ${partNumber})`,
            content: currentChunk.trim(),
            char_count: currentChunk.length,
            word_count: currentChunk.split(/\s+/).length
          });
          currentChunk = para;
          partNumber++;
        } else {
          currentChunk += (currentChunk ? '\n\n' : '') + para;
        }
      }
      
      // Save last chunk
      if (currentChunk.length > 0) {
        chunks.push({
          id: chunkId++,
          type,
          klal: title,
          seif: seifLetter,
          title: partNumber > 1 ? `${title} - סעיף ${seifLetter} (חלק ${partNumber})` : `${title} - סעיף ${seifLetter}`,
          content: currentChunk.trim(),
          char_count: currentChunk.length,
          word_count: currentChunk.split(/\s+/).length
        });
      }
    }
  });
}

// Process all sections
console.log('Processing Lashon Hara sections...');
rawData.lashon_hara.forEach(klal => processKlal(klal, 'lashon_hara'));

console.log('Processing Rechilut sections...');
rawData.rechilut.forEach(klal => processKlal(klal, 'rechilut'));

// Save parsed chunks
const outputPath = path.join(__dirname, '../data/chofetz-chaim/chofetz-chaim-chunks.json');
fs.writeFileSync(outputPath, JSON.stringify(chunks, null, 2), 'utf8');

// Print statistics
console.log('\n=== Parsing Complete ===');
console.log(`Total chunks: ${chunks.length}`);
console.log(`Average chunk size: ${Math.round(chunks.reduce((sum, c) => sum + c.char_count, 0) / chunks.length)} chars`);
console.log(`Total words: ${chunks.reduce((sum, c) => sum + c.word_count, 0)}`);
console.log(`Output: ${outputPath}`);

// Show sample
console.log('\n=== Sample Chunk ===');
console.log(JSON.stringify(chunks[0], null, 2));
