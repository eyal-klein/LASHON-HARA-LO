/**
 * Scrape ALL actual products from each category
 * Goes into each category and downloads all product images and details
 */

import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://lashonhara.co.il';
const OUTPUT_DIR = path.join(__dirname, '../data/original-site');
const PRODUCTS_DIR = path.join(OUTPUT_DIR, 'products');

// Ensure directories exist
await fs.mkdir(PRODUCTS_DIR, { recursive: true });

// Download image from URL
async function downloadImage(url, filepath) {
  try {
    const response = await fetch(url);
    if (!response.ok) return false;
    
    const buffer = await response.arrayBuffer();
    await fs.writeFile(filepath, Buffer.from(buffer));
    return true;
  } catch (error) {
    return false;
  }
}

// Categories to scrape (from previous scrape)
const categories = [
  { name: "'צמידי הניצחון'", url: "https://lashonhara.co.il/product-category/%d7%a6%d7%9e%d7%99%d7%93%d7%99-%d7%a2%d7%9d-%d7%99%d7%a9%d7%a8%d7%90%d7%9c/" },
  { name: "צמידי סיליקון", url: "https://lashonhara.co.il/product-category/120150/" },
  { name: "צמידים בציפוי זהב וכסף", url: "https://lashonhara.co.il/product-category/206080/" },
  { name: "חולצות ופריטי לבוש", url: "https://lashonhara.co.il/product-category/99975/" },
  { name: "מוצרים מיוחדים ומדליקים", url: "https://lashonhara.co.il/product-category/%d7%9e%d7%95%d7%a6%d7%a8%d7%99%d7%9d-%d7%9e%d7%99%d7%95%d7%97%d7%93%d7%99%d7%9d-%d7%95%d7%9e%d7%93%d7%9c%d7%99%d7%a7%d7%99%d7%9d/" },
  { name: "טבעות", url: "https://lashonhara.co.il/product-category/%d7%98%d7%91%d7%a2%d7%95%d7%aa/" },
  { name: "מחזיקי מפתחות", url: "https://lashonhara.co.il/product-category/%d7%9e%d7%97%d7%96%d7%99%d7%a7%d7%99-%d7%9e%d7%a4%d7%aa%d7%97%d7%95%d7%aa/" },
  { name: "מוצרים לילדים ולבית הספר", url: "https://lashonhara.co.il/product-category/%d7%9e%d7%95%d7%a6%d7%a8%d7%99%d7%9d-%d7%9c%d7%99%d7%9c%d7%93%d7%99%d7%9d-%d7%95%d7%9c%d7%91%d7%99%d7%aa-%d7%94%d7%a1%d7%a4%d7%a8/" },
  { name: "מוצרי ספורט", url: "https://lashonhara.co.il/product-category/%d7%9e%d7%95%d7%a6%d7%a8%d7%99-%d7%a1%d7%a4%d7%95%d7%a8%d7%98/" },
  { name: "מדבקות, סטיקרים ומוצרים לרכב", url: "https://lashonhara.co.il/product-category/%d7%9e%d7%93%d7%91%d7%a7%d7%95%d7%aa-%d7%a1%d7%98%d7%99%d7%a7%d7%a8%d7%99%d7%9d-%d7%95%d7%9e%d7%95%d7%a6%d7%a8%d7%99%d7%9d-%d7%9c%d7%a8%d7%9b%d7%91/" },
];

async function scrapeCategory(page, category, allProducts) {
  console.log(`\n📦 Scraping category: ${category.name}`);
  
  try {
    await page.goto(category.url, { waitUntil: 'networkidle2', timeout: 60000 });
    
    // Wait for products to load
    await page.waitForSelector('.products, .product, article.product', { timeout: 10000 }).catch(() => {});
    
    // Scroll to load all products (lazy loading)
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
    
    // Extract all products on page
    const products = await page.evaluate(() => {
      const productElements = document.querySelectorAll('.product, .type-product, article.product');
      const results = [];
      
      productElements.forEach(el => {
        // Skip if this is a category, not a product
        const link = el.querySelector('a');
        if (link && link.href.includes('/product-category/')) return;
        
        const nameEl = el.querySelector('.woocommerce-loop-product__title, h2, h3, .product-title, .product_title');
        const priceEl = el.querySelector('.price, .amount, .woocommerce-Price-amount');
        const imageEl = el.querySelector('img');
        
        const name = nameEl?.textContent?.trim();
        const price = priceEl?.textContent?.trim();
        const imageUrl = imageEl?.src || imageEl?.getAttribute('data-src') || imageEl?.getAttribute('data-lazy-src');
        const productLink = link?.href;
        
        if (name && imageUrl && productLink && !productLink.includes('/product-category/')) {
          results.push({
            name,
            price,
            imageUrl,
            link: productLink,
            category: ''  // Will be filled by caller
          });
        }
      });
      
      return results;
    });
    
    console.log(`  Found ${products.length} products`);
    
    // Download images and add to allProducts
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.category = category.name;
      
      const productId = allProducts.length + 1;
      const imageFilename = `product-${productId}-${product.name.replace(/[^a-zA-Z0-9א-ת]/g, '-').substring(0, 50)}.jpg`;
      const imagePath = path.join(PRODUCTS_DIR, imageFilename);
      
      const downloaded = await downloadImage(product.imageUrl, imagePath);
      if (downloaded) {
        product.localImage = imageFilename;
        console.log(`  ✅ ${product.name} - ${product.price || 'לא צוין מחיר'}`);
      } else {
        console.log(`  ⚠️  ${product.name} - failed to download image`);
      }
      
      allProducts.push(product);
    }
    
  } catch (error) {
    console.error(`  ❌ Error scraping category ${category.name}: ${error.message}`);
  }
}

async function main() {
  console.log('🚀 Starting comprehensive product scrape\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
  
  const allProducts = [];
  
  try {
    // Scrape each category
    for (const category of categories) {
      await scrapeCategory(page, category, allProducts);
      // Small delay between categories
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Save all products
    await fs.writeFile(
      path.join(OUTPUT_DIR, 'all-products.json'),
      JSON.stringify(allProducts, null, 2),
      'utf-8'
    );
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SCRAPING SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Total products scraped: ${allProducts.length}`);
    console.log(`✅ Categories processed: ${categories.length}`);
    console.log(`✅ Images downloaded: ${allProducts.filter(p => p.localImage).length}`);
    console.log('='.repeat(60));
    console.log(`\n📁 All data saved to: ${OUTPUT_DIR}/all-products.json`);
    
  } catch (error) {
    console.error('❌ Error during scraping:', error);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
