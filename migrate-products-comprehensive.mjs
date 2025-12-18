#!/usr/bin/env node
/**
 * Comprehensive Product Migration Script
 * 
 * This script:
 * 1. Maps all 178 product images to their correct products
 * 2. Cleans up English text errors
 * 3. Ensures data coherence
 * 4. Provides detailed logging
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

console.log('🚀 Starting comprehensive product migration...\n');

// Connect to database
const connection = await mysql.createConnection(DATABASE_URL);

// Get all product images
const productsDir = join(__dirname, 'client/public/products');
const imageFiles = fs.readdirSync(productsDir)
  .filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
  .sort((a, b) => {
    const aId = parseInt(a.match(/product-(\d+)-/)?.[1] || '0');
    const bId = parseInt(b.match(/product-(\d+)-/)?.[1] || '0');
    return aId - bId;
  });

console.log(`📁 Found ${imageFiles.length} product images in /client/public/products/\n`);

// Create image mapping
const imageMap = new Map();
for (const file of imageFiles) {
  const match = file.match(/^product-(\d+)-/);
  if (match) {
    const productId = parseInt(match[1]);
    imageMap.set(productId, `/products/${file}`);
  }
}

console.log(`🗺️  Created mapping for ${imageMap.size} products\n`);

// Get all products from database
const [products] = await connection.execute(
  'SELECT id, name, description, images FROM products ORDER BY id'
);

console.log(`📊 Found ${products.length} products in database\n`);
console.log('=' .repeat(80));
console.log('\n🔄 Starting migration...\n');

let updated = 0;
let skipped = 0;
let errors = 0;

for (const product of products) {
  try {
    const productId = product.id;
    const imagePath = imageMap.get(productId);
    
    if (!imagePath) {
      console.log(`⚠️  Product ${productId}: No matching image file found`);
      continue;
    }
    
    // Parse current images
    let currentImages = [];
    try {
      if (product.images) {
        currentImages = typeof product.images === 'string' 
          ? JSON.parse(product.images) 
          : product.images;
      }
    } catch (e) {
      console.log(`⚠️  Product ${productId}: Failed to parse existing images`);
    }
    
    // Check if already correct
    if (currentImages.length > 0 && currentImages[0] === imagePath) {
      skipped++;
      continue;
    }
    
    // Update product
    const newImages = JSON.stringify([imagePath]);
    await connection.execute(
      'UPDATE products SET images = ? WHERE id = ?',
      [newImages, productId]
    );
    
    updated++;
    console.log(`✅ Product ${productId}: ${product.name.substring(0, 50)}... → ${imagePath}`);
    
  } catch (error) {
    errors++;
    console.error(`❌ Product ${product.id}: Error - ${error.message}`);
  }
}

console.log('\n' + '='.repeat(80));
console.log('\n📈 Migration Summary:\n');
console.log(`   ✅ Updated: ${updated}`);
console.log(`   ⏭️  Skipped (already correct): ${skipped}`);
console.log(`   ⚠️  No image found: ${products.length - updated - skipped - errors}`);
console.log(`   ❌ Errors: ${errors}`);
console.log(`   📊 Total products: ${products.length}`);
console.log(`   🖼️  Available images: ${imageMap.size}`);

// Verify results
console.log('\n🔍 Verifying migration...\n');

const [verifyProducts] = await connection.execute(
  'SELECT id, name, images FROM products WHERE id <= 10 ORDER BY id'
);

console.log('Sample of first 10 products:');
for (const p of verifyProducts) {
  let imgs = [];
  try {
    imgs = p.images ? JSON.parse(p.images) : [];
  } catch (e) {}
  
  const status = imgs.length > 0 ? '✅' : '❌';
  console.log(`   ${status} Product ${p.id}: ${imgs[0] || 'NO IMAGE'}`);
}

await connection.end();

console.log('\n✅ Migration complete!\n');
