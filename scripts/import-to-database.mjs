/**
 * Import all scraped content from original site to database
 * - Products with images and prices
 * - Categories
 * - Gallery images
 * - About page content
 */

import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
});

async function importProducts() {
  console.log('\n📦 Importing products...\n');
  
  // Read products JSON
  const productsJson = await fs.readFile(
    path.join(__dirname, '../data/original-site/all-products.json'),
    'utf-8'
  );
  const products = JSON.parse(productsJson);
  
  console.log(`Found ${products.length} products to import`);
  
  // Get or create categories
  const categoryMap = new Map();
  const uniqueCategories = [...new Set(products.map(p => p.category))];
  
  console.log(`Creating ${uniqueCategories.length} categories...`);
  
  for (const categoryName of uniqueCategories) {
    const [rows] = await pool.query(
      'SELECT id FROM product_categories WHERE name = ?',
      [categoryName]
    );
    
    if (rows.length > 0) {
      categoryMap.set(categoryName, rows[0].id);
    } else {
      const slug = categoryName
        .replace(/[^a-zA-Z0-9א-ת\s]/g, '')
        .replace(/\s+/g, '-')
        .toLowerCase();
      
      const [result] = await pool.query(
        'INSERT INTO product_categories (name, slug, description, isActive, sortOrder) VALUES (?, ?, ?, ?, ?)',
        [
          categoryName,
          slug,
          `קטגוריית ${categoryName}`,
          true,
          0
        ]
      );
      categoryMap.set(categoryName, result.insertId);
      console.log(`  ✅ Created category: ${categoryName}`);
    }
  }
  
  // Import products
  let imported = 0;
  let skipped = 0;
  
  for (const product of products) {
    try {
      // Parse price
      let price = 0;
      if (product.price) {
        const priceMatch = product.price.match(/(\d+\.?\d*)/);
        if (priceMatch) {
          price = parseFloat(priceMatch[1]);
        }
      }
      
      const categoryId = categoryMap.get(product.category);
      const imageUrl = product.localImage ? `/products/${product.localImage}` : null;
      
      // Prepare images array
      const images = imageUrl ? [imageUrl] : [];
      
      // Check if product already exists
      const [existing] = await pool.query(
        'SELECT id FROM products WHERE name = ?',
        [product.name]
      );
      
      if (existing.length > 0) {
        // Update existing product
        await pool.query(
          'UPDATE products SET price = ?, categoryId = ?, images = ?, description = ? WHERE id = ?',
          [price, categoryId, JSON.stringify(images), product.name, existing[0].id]
        );
        skipped++;
      } else {
        // Insert new product
        await pool.query(
          'INSERT INTO products (name, description, price, categoryId, images, stockQuantity, isPublished) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            product.name,
            product.name, // Use name as description for now
            price,
            categoryId,
            JSON.stringify(images),
            100, // Default stock
            true
          ]
        );
        imported++;
      }
      
      if ((imported + skipped) % 20 === 0) {
        console.log(`  Progress: ${imported + skipped}/${products.length}`);
      }
    } catch (error) {
      console.error(`  ❌ Error importing product ${product.name}:`, error.message);
    }
  }
  
  console.log(`\n✅ Products import complete:`);
  console.log(`   - New products: ${imported}`);
  console.log(`   - Updated products: ${skipped}`);
  console.log(`   - Total: ${imported + skipped}`);
}

async function importGalleryImages() {
  console.log('\n🖼️  Importing gallery images...\n');
  
  const galleryDir = path.join(__dirname, '../client/public/gallery');
  const files = await fs.readdir(galleryDir);
  const imageFiles = files.filter(f => f.endsWith('.jpg'));
  
  console.log(`Found ${imageFiles.length} gallery images`);
  
  let imported = 0;
  
  for (const file of imageFiles) {
    try {
      const imageUrl = `/gallery/${file}`;
      const title = file.replace('.jpg', '').replace('gallery-', 'תמונה ');
      
      // Check if already exists
      const [existing] = await pool.query(
        'SELECT id FROM gallery_items WHERE imageUrl = ?',
        [imageUrl]
      );
      
      if (existing.length === 0) {
        await pool.query(
          'INSERT INTO gallery_items (title, description, imageUrl, category, isPublished) VALUES (?, ?, ?, ?, ?)',
          [title, 'תמונה מהגלריה המקורית', imageUrl, 'campaigns', true]
        );
        imported++;
      }
    } catch (error) {
      console.error(`  ❌ Error importing ${file}:`, error.message);
    }
  }
  
  console.log(`✅ Gallery images import complete: ${imported} new images`);
}

async function importAboutContent() {
  console.log('\n📖 Importing About page content...\n');
  
  const aboutText = await fs.readFile(
    path.join(__dirname, '../data/original-site/about.txt'),
    'utf-8'
  );
  
  // Extract sections
  const sections = {
    mission: aboutText.substring(
      aboutText.indexOf('המשימה שלנו'),
      aboutText.indexOf('דבר המייסד')
    ).trim(),
    founder: aboutText.substring(
      aboutText.indexOf('דבר המייסד'),
      aboutText.indexOf('מה זה לשון הרע?')
    ).trim(),
    definition: aboutText.substring(
      aboutText.indexOf('מה זה לשון הרע?'),
      aboutText.indexOf('מה עושים כשנתקלים בלשון הרע?')
    ).trim(),
    help: aboutText.substring(
      aboutText.indexOf('מה עושים כשנתקלים בלשון הרע?')
    ).trim()
  };
  
  // Store in content table (CMS)
  const sectionTitles = {
    mission: 'המשימה שלנו',
    founder: 'דבר המייסד',
    definition: 'מה זה לשון הרע?',
    help: 'מה עושים כשנתקלים בלשון הרע?'
  };
  
  for (const [key, content] of Object.entries(sections)) {
    try {
      const contentKey = `about_${key}`;
      const [existing] = await pool.query(
        'SELECT id FROM content WHERE `key` = ?',
        [contentKey]
      );
      
      if (existing.length > 0) {
        await pool.query(
          'UPDATE content SET content = ?, title = ? WHERE `key` = ?',
          [content, sectionTitles[key], contentKey]
        );
      } else {
        await pool.query(
          'INSERT INTO content (`key`, section, title, content, isPublished) VALUES (?, ?, ?, ?, ?)',
          [contentKey, 'about', sectionTitles[key], content, true]
        );
      }
      
      console.log(`  ✅ Imported section: ${key} (${content.length} chars)`);
    } catch (error) {
      console.error(`  ❌ Error importing ${key}:`, error.message);
    }
  }
  
  console.log(`✅ About content import complete`);
}

async function main() {
  console.log('🚀 Starting database import\n');
  console.log('=' .repeat(60));
  
  try {
    await importProducts();
    await importGalleryImages();
    await importAboutContent();
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 IMPORT SUMMARY');
    console.log('='.repeat(60));
    console.log('✅ All content imported successfully!');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Error during import:', error);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);
