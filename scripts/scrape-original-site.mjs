/**
 * Scrape ALL content from original lashonhara.co.il website
 * - Product images, names, prices, descriptions
 * - Homepage content
 * - Gallery images
 * - All text content
 */

import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://lashonhara.co.il';
const OUTPUT_DIR = path.join(__dirname, '../data/original-site');
const IMAGES_DIR = path.join(OUTPUT_DIR, 'images');
const PRODUCTS_DIR = path.join(IMAGES_DIR, 'products');

// Ensure directories exist
await fs.mkdir(OUTPUT_DIR, { recursive: true });
await fs.mkdir(IMAGES_DIR, { recursive: true });
await fs.mkdir(PRODUCTS_DIR, { recursive: true });

// Download image from URL
async function downloadImage(url, filepath) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);
    
    const buffer = await response.arrayBuffer();
    await fs.writeFile(filepath, Buffer.from(buffer));
    return true;
  } catch (error) {
    console.error(`  ❌ Failed to download ${url}: ${error.message}`);
    return false;
  }
}

async function scrapeProducts(page) {
  console.log('\n🛍️  Scraping products from WooCommerce shop...\n');
  
  const products = [];
  
  // Navigate to shop page
  await page.goto(`${BASE_URL}/shop/`, { waitUntil: 'networkidle2', timeout: 60000 });
  
  // Try to get all products via WooCommerce JSON
  try {
    // Check if there's a products JSON endpoint
    const productsJson = await page.evaluate(() => {
      // Try to find WooCommerce data in page
      return window.wc_add_to_cart_params || window.woocommerce_params || null;
    });
    
    console.log('WooCommerce data:', productsJson ? 'Found' : 'Not found');
  } catch (e) {
    console.log('No WooCommerce JSON data available');
  }
  
  // Scrape product grid
  const productElements = await page.$$('.product, .type-product, article.product');
  console.log(`Found ${productElements.length} product elements on page`);
  
  for (const productEl of productElements) {
    try {
      const product = await productEl.evaluate(el => {
        const nameEl = el.querySelector('.woocommerce-loop-product__title, h2, h3, .product-title');
        const priceEl = el.querySelector('.price, .amount, .woocommerce-Price-amount');
        const imageEl = el.querySelector('img');
        const linkEl = el.querySelector('a');
        
        return {
          name: nameEl?.textContent?.trim() || '',
          price: priceEl?.textContent?.trim() || '',
          imageUrl: imageEl?.src || imageEl?.getAttribute('data-src') || '',
          link: linkEl?.href || '',
        };
      });
      
      if (product.name && product.imageUrl) {
        products.push(product);
        console.log(`  ✅ ${product.name} - ${product.price}`);
        
        // Download product image
        if (product.imageUrl) {
          const imageFilename = `product-${products.length}-${product.name.replace(/[^a-zA-Z0-9א-ת]/g, '-').substring(0, 50)}.jpg`;
          const imagePath = path.join(PRODUCTS_DIR, imageFilename);
          const downloaded = await downloadImage(product.imageUrl, imagePath);
          if (downloaded) {
            product.localImage = imageFilename;
          }
        }
      }
    } catch (error) {
      console.error(`  ❌ Error scraping product: ${error.message}`);
    }
  }
  
  // Save products data
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'products.json'),
    JSON.stringify(products, null, 2),
    'utf-8'
  );
  
  console.log(`\n✅ Scraped ${products.length} products`);
  return products;
}

async function scrapeHomepage(page) {
  console.log('\n🏠 Scraping homepage content...\n');
  
  await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 60000 });
  
  const homeContent = await page.evaluate(() => {
    return {
      title: document.title,
      headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => ({
        tag: h.tagName,
        text: h.textContent.trim()
      })),
      paragraphs: Array.from(document.querySelectorAll('p')).map(p => p.textContent.trim()).filter(t => t.length > 20),
      images: Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.src,
        alt: img.alt
      })),
      links: Array.from(document.querySelectorAll('a')).map(a => ({
        text: a.textContent.trim(),
        href: a.href
      })).filter(l => l.text.length > 0)
    };
  });
  
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'homepage.json'),
    JSON.stringify(homeContent, null, 2),
    'utf-8'
  );
  
  console.log(`✅ Scraped homepage: ${homeContent.headings.length} headings, ${homeContent.paragraphs.length} paragraphs, ${homeContent.images.length} images`);
  
  return homeContent;
}

async function scrapeAboutPage(page) {
  console.log('\n📖 Scraping About page...\n');
  
  try {
    await page.goto(`${BASE_URL}/about/`, { waitUntil: 'networkidle2', timeout: 60000 });
    
    const aboutContent = await page.evaluate(() => {
      return {
        title: document.title,
        content: document.querySelector('main, article, .content, .entry-content')?.innerText || document.body.innerText
      };
    });
    
    await fs.writeFile(
      path.join(OUTPUT_DIR, 'about.txt'),
      aboutContent.content,
      'utf-8'
    );
    
    console.log(`✅ Scraped About page (${aboutContent.content.length} characters)`);
    return aboutContent;
  } catch (error) {
    console.log(`⚠️  About page not found or error: ${error.message}`);
    return null;
  }
}

async function scrapeGallery(page) {
  console.log('\n🖼️  Scraping gallery images...\n');
  
  try {
    await page.goto(`${BASE_URL}/gallery/`, { waitUntil: 'networkidle2', timeout: 60000 });
    
    const galleryImages = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img, .gallery-item img, .wp-block-gallery img')).map(img => ({
        src: img.src || img.getAttribute('data-src'),
        alt: img.alt,
        title: img.title
      }));
    });
    
    console.log(`Found ${galleryImages.length} gallery images`);
    
    let downloaded = 0;
    for (let i = 0; i < galleryImages.length; i++) {
      const img = galleryImages[i];
      if (img.src) {
        const filename = `gallery-${i + 1}.jpg`;
        const filepath = path.join(IMAGES_DIR, filename);
        const success = await downloadImage(img.src, filepath);
        if (success) {
          downloaded++;
          console.log(`  ✅ Downloaded ${filename}`);
        }
      }
    }
    
    console.log(`✅ Downloaded ${downloaded}/${galleryImages.length} gallery images`);
    return galleryImages;
  } catch (error) {
    console.log(`⚠️  Gallery page not found or error: ${error.message}`);
    return [];
  }
}

async function main() {
  console.log('🚀 Starting comprehensive scrape of lashonhara.co.il\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Set user agent to avoid blocking
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
  
  try {
    // Scrape all sections
    const products = await scrapeProducts(page);
    const homepage = await scrapeHomepage(page);
    const about = await scrapeAboutPage(page);
    const gallery = await scrapeGallery(page);
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SCRAPING SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Products: ${products.length}`);
    console.log(`✅ Homepage sections: ${homepage.headings.length}`);
    console.log(`✅ About page: ${about ? 'Yes' : 'No'}`);
    console.log(`✅ Gallery images: ${gallery.length}`);
    console.log('='.repeat(60));
    console.log(`\n📁 All data saved to: ${OUTPUT_DIR}`);
    
  } catch (error) {
    console.error('❌ Error during scraping:', error);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
