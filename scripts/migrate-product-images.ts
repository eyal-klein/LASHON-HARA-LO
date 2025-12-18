/**
 * Professional Product Image Migration Script
 * Uses Drizzle ORM with proper transactions and error handling
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { products } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('🚀 Professional Product Image Migration\n');
  console.log('=' .repeat(80));
  
  // Database connection
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL not found');
  }
  
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);
  
  console.log('✅ Connected to database\n');
  
  // Load all product images
  const productsDir = path.join(__dirname, '../client/public/products');
  const imageFiles = fs.readdirSync(productsDir)
    .filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
    .map(f => {
      const match = f.match(/^product-(\d+)-/);
      return {
        filename: f,
        sequenceId: match ? parseInt(match[1]) : 99999,
        path: `/products/${f}`
      };
    })
    .sort((a, b) => a.sequenceId - b.sequenceId);
  
  console.log(`📁 Found ${imageFiles.length} product images\n`);
  
  // Get all products
  const allProducts = await db.select().from(products).orderBy(products.id);
  console.log(`📊 Found ${allProducts.length} products in database\n`);
  
  const maxToUpdate = Math.min(imageFiles.length, allProducts.length);
  console.log(`🔗 Will map ${maxToUpdate} images to products\n`);
  console.log('=' .repeat(80));
  console.log('\n🔄 Starting migration with transactions...\n');
  
  let updated = 0;
  let skipped = 0;
  let errors = 0;
  
  // Process in batches with transactions
  const BATCH_SIZE = 10;
  
  for (let i = 0; i < maxToUpdate; i += BATCH_SIZE) {
    const batchEnd = Math.min(i + BATCH_SIZE, maxToUpdate);
    
    try {
      // Start transaction
      await connection.beginTransaction();
      
      for (let j = i; j < batchEnd; j++) {
        const product = allProducts[j];
        const imageFile = imageFiles[j];
        
        // Check current images
        const currentImages = product.images || [];
        
        // Skip if already correct
        if (currentImages.length > 0 && currentImages[0] === imageFile.path) {
          skipped++;
          continue;
        }
        
        // Update with Drizzle
        await db.update(products)
          .set({ images: [imageFile.path] })
          .where(eq(products.id, product.id));
        
        updated++;
        
        if (updated <= 10 || updated % 20 === 0) {
          console.log(`✅ [${j+1}/${maxToUpdate}] Product ${product.id}: ${imageFile.filename.substring(0, 60)}`);
        }
      }
      
      // Commit transaction
      await connection.commit();
      console.log(`📦 Batch ${Math.floor(i/BATCH_SIZE) + 1} committed (${i+1}-${batchEnd})`);
      
    } catch (error) {
      // Rollback on error
      await connection.rollback();
      console.error(`❌ Batch ${Math.floor(i/BATCH_SIZE) + 1} failed, rolled back: ${error.message}`);
      errors += (batchEnd - i);
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('\n📈 Migration Summary:\n');
  console.log(`   ✅ Updated: ${updated}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`   📊 Total: ${maxToUpdate}`);
  
  // Verify
  console.log('\n🔍 Verifying...\n');
  
  const verifyProducts = await db.select().from(products).orderBy(products.id).limit(10);
  
  console.log('First 10 products:');
  for (const p of verifyProducts) {
    const imgs = p.images || [];
    const status = imgs.length > 0 ? '✅' : '❌';
    const imgName = imgs[0] ? imgs[0].split('/').pop()?.substring(0, 50) : 'NO IMAGE';
    console.log(`   ${status} Product ${p.id}: ${imgName}`);
  }
  
  // Count total with images
  const productsWithImages = await db.select().from(products);
  const withImagesCount = productsWithImages.filter(p => p.images && p.images.length > 0 && p.images[0]).length;
  
  console.log(`\n📊 Total products with images: ${withImagesCount} / ${allProducts.length}`);
  
  await connection.end();
  console.log('\n✅ Migration complete!\n');
}

main().catch(console.error);
