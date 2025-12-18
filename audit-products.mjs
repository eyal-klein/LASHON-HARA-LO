import mysql from 'mysql2/promise';
import fs from 'fs';

const DATABASE_URL = process.env.DATABASE_URL;
const connection = await mysql.createConnection(DATABASE_URL);

console.log('📊 Auditing all products...\n');

const [products] = await connection.execute(
  'SELECT id, name, description, price, images, sku, isPublished, isFeatured FROM products ORDER BY id'
);

console.log(`Total products: ${products.length}\n`);

// Analyze issues
let noImages = 0;
let hasEnglishGibberish = 0;
let hasImages = 0;

const issues = [];

for (const p of products) {
  const productIssues = [];
  
  // Check images
  let imgs = [];
  try {
    imgs = p.images ? JSON.parse(p.images) : [];
  } catch (e) {}
  
  if (imgs.length === 0 || !imgs[0]) {
    noImages++;
    productIssues.push('NO_IMAGE');
  } else {
    hasImages++;
  }
  
  // Check for English gibberish in name
  if (p.name && /[A-Z]{3,}|[a-z]{10,}/.test(p.name)) {
    hasEnglishGibberish++;
    productIssues.push('ENGLISH_TEXT');
  }
  
  if (productIssues.length > 0) {
    issues.push({
      id: p.id,
      name: p.name,
      images: imgs,
      issues: productIssues
    });
  }
}

console.log('📈 Statistics:');
console.log(`   Products with images: ${hasImages}`);
console.log(`   Products without images: ${noImages}`);
console.log(`   Products with English text issues: ${hasEnglishGibberish}`);
console.log(`\n📋 Products with issues: ${issues.length}\n`);

// Save detailed report
fs.writeFileSync(
  'product-audit-report.json',
  JSON.stringify({ statistics: { total: products.length, hasImages, noImages, hasEnglishGibberish }, issues }, null, 2)
);

console.log('✅ Audit report saved to: product-audit-report.json');

await connection.end();
