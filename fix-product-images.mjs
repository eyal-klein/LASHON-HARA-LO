import mysql from 'mysql2/promise';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get DATABASE_URL from environment
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not found in environment');
  process.exit(1);
}

// Create connection
const connection = await mysql.createConnection(DATABASE_URL);

console.log('🔍 Scanning product images in /client/public/products...');

// Get all product image files
const productsDir = join(__dirname, 'client/public/products');
const imageFiles = fs.readdirSync(productsDir)
  .filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
  .sort();

console.log(`Found ${imageFiles.length} product images`);

// Get all products from DB
const [allProducts] = await connection.execute('SELECT id, name, images FROM products ORDER BY id');
console.log(`Found ${allProducts.length} products in database`);

let updated = 0;
let skipped = 0;

for (const product of allProducts) {
  // Find matching image file by product ID
  const matchingImage = imageFiles.find(f => f.startsWith(`product-${product.id}-`));
  
  if (matchingImage) {
    const imagePath = `/products/${matchingImage}`;
    
    // Parse current images (stored as JSON string)
    let currentImages = [];
    try {
      currentImages = product.images ? JSON.parse(product.images) : [];
    } catch (e) {
      currentImages = [];
    }
    
    // Check if image already set correctly
    if (currentImages.length > 0 && currentImages[0] === imagePath) {
      console.log(`✓ Product ${product.id} already has correct image: ${imagePath}`);
      skipped++;
      continue;
    }
    
    // Update product with image path
    const newImages = JSON.stringify([imagePath]);
    await connection.execute(
      'UPDATE products SET images = ? WHERE id = ?',
      [newImages, product.id]
    );
    
    console.log(`✅ Updated product ${product.id} (${product.name}) with image: ${imagePath}`);
    updated++;
  } else {
    console.log(`⚠️  No image found for product ${product.id} (${product.name})`);
  }
}

console.log(`\n📊 Summary:`);
console.log(`   Updated: ${updated}`);
console.log(`   Skipped: ${skipped}`);
console.log(`   Total products: ${allProducts.length}`);

await connection.end();
console.log('\n✅ Done!');
