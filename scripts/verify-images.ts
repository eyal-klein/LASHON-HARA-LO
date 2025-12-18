import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { products } from '../drizzle/schema.js';

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  const db = drizzle(connection);
  
  const allProducts = await db.select().from(products).orderBy(products.id);
  
  console.log(`\n📊 Total products: ${allProducts.length}\n`);
  
  let withImages = 0;
  let withoutImages = 0;
  
  console.log('First 20 products:');
  for (let i = 0; i < Math.min(20, allProducts.length); i++) {
    const p = allProducts[i];
    const imgs = p.images || [];
    const hasImage = imgs.length > 0 && imgs[0];
    
    if (hasImage) withImages++;
    else withoutImages++;
    
    const status = hasImage ? '✅' : '❌';
    const imgPath = imgs[0] || 'NO IMAGE';
    console.log(`${status} Product ${p.id}: ${imgPath}`);
  }
  
  // Count all
  for (const p of allProducts) {
    const imgs = p.images || [];
    if (imgs.length > 0 && imgs[0]) {
      withImages++;
    } else {
      withoutImages++;
    }
  }
  
  console.log(`\n📈 Summary:`);
  console.log(`   ✅ With images: ${withImages}`);
  console.log(`   ❌ Without images: ${withoutImages}`);
  console.log(`   📊 Total: ${allProducts.length}\n`);
  
  await connection.end();
}

main().catch(console.error);
