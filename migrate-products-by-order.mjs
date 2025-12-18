#!/usr/bin/env node
/**
 * Product Migration Script - Sequential Mapping
 * 
 * Maps images product-1.jpg, product-2.jpg, etc. to the first 178 products in DB order
 */

import mysql from 'mysql2/promise';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found');
  process.exit(1);
}

console.log('🚀 Starting sequential product image migration...\n');

// Connect to database
const connection = await mysql.createConnection(DATABASE_URL);

// Get all product images and sort by the number in filename
const productsDir = join(__dirname, 'client/public/products');
const imageFiles = fs.readdirSync(productsDir)
  .filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
  .map(f => {
    const match = f.match(/^product-(\d+)-/);
    return {
      filename: f,
      sequenceId: match ? parseInt(match[1]) : 99999
    };
  })
  .sort((a, b) => a.sequenceId - b.sequenceId);

console.log(`📁 Found ${imageFiles.length} product images\n`);

// Get all products from database, ordered by ID
const [products] = await connection.execute(
  'SELECT id, name, description, images FROM products ORDER BY id'
);

console.log(`📊 Found ${products.length} products in database\n`);

const maxToUpdate = Math.min(imageFiles.length, products.length);

console.log(`🔗 Will map ${maxToUpdate} images to products\n`);
console.log('=' .repeat(80));
console.log('\n🔄 Starting migration...\n');

let updated = 0;
let skipped = 0;
let errors = 0;

for (let i = 0; i < maxToUpdate; i++) {
  try {
    const product = products[i];
    const imageFile = imageFiles[i];
    const imagePath = `/products/${imageFile.filename}`;
    
    // Parse current images
    let currentImages = [];
    try {
      if (product.images) {
        currentImages = typeof product.images === 'string' 
          ? JSON.parse(product.images) 
          : product.images;
      }
    } catch (e) {}
    
    // Check if already correct
    if (currentImages.length > 0 && currentImages[0] === imagePath) {
      skipped++;
      continue;
    }
    
    // Update product
    const newImages = JSON.stringify([imagePath]);
    await connection.execute(
      'UPDATE products SET images = ? WHERE id = ?',
      [newImages, product.id]
    );
    
    updated++;
    
    if (updated <= 20 || updated % 20 === 0) {
      console.log(`✅ [${i+1}/${maxToUpdate}] Product ${product.id}: ${product.name.substring(0, 40)}... → ${imageFile.filename.substring(0, 50)}...`);
    }
    
  } catch (error) {
    errors++;
    console.error(`❌ Error at index ${i}: ${error.message}`);
  }
}

console.log('\n' + '='.repeat(80));
console.log('\n📈 Migration Summary:\n');
console.log(`   ✅ Updated: ${updated}`);
console.log(`   ⏭️  Skipped (already correct): ${skipped}`);
console.log(`   ❌ Errors: ${errors}`);
console.log(`   📊 Total mapped: ${maxToUpdate}`);
console.log(`   🖼️  Available images: ${imageFiles.length}`);
console.log(`   📦 Total products in DB: ${products.length}`);

// Verify results
console.log('\n🔍 Verifying migration...\n');

const [verifyProducts] = await connection.execute(
  'SELECT id, name, images FROM products ORDER BY id LIMIT 10'
);

console.log('First 10 products after migration:');
for (const p of verifyProducts) {
  let imgs = [];
  try {
    imgs = p.images ? JSON.parse(p.images) : [];
  } catch (e) {}
  
  const status = imgs.length > 0 ? '✅' : '❌';
  const imgName = imgs[0] ? imgs[0].split('/').pop().substring(0, 50) : 'NO IMAGE';
  console.log(`   ${status} Product ${p.id}: ${imgName}`);
}

// Count total with images
const [countResult] = await connection.execute(
  'SELECT COUNT(*) as total FROM products WHERE JSON_LENGTH(images) > 0 AND JSON_EXTRACT(images, "$[0]") IS NOT NULL AND JSON_EXTRACT(images, "$[0]") != ""'
);

console.log(`\n📊 Total products with images: ${countResult[0].total} / ${products.length}`);

await connection.end();

console.log('\n✅ Migration complete!\n');
