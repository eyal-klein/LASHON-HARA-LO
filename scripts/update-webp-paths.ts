import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { products } from "../drizzle/schema";
import { sql } from "drizzle-orm";

const DATABASE_URL = process.env.DATABASE_URL!;

async function updateWebPPaths() {
  console.log("🔄 Updating product image paths to WebP format...\n");
  
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);
  
  try {
    // Update all image paths: replace .jpg/.jpeg/.png with .webp
    const result = await db.execute(sql`
      UPDATE products 
      SET images = JSON_REPLACE(
        images,
        '$[0]',
        REPLACE(REPLACE(REPLACE(
          JSON_UNQUOTE(JSON_EXTRACT(images, '$[0]')),
          '.jpg', '.webp'
        ), '.jpeg', '.webp'), '.png', '.webp')
      )
      WHERE JSON_UNQUOTE(JSON_EXTRACT(images, '$[0]')) LIKE '%.jpg'
         OR JSON_UNQUOTE(JSON_EXTRACT(images, '$[0]')) LIKE '%.jpeg'
         OR JSON_UNQUOTE(JSON_EXTRACT(images, '$[0]')) LIKE '%.png'
    `);
    
    console.log(`✅ Updated ${(result as any)[0].affectedRows} products with WebP paths`);
    
    // Verify
    const sample = await db.select().from(products).limit(10);
    console.log("\n📋 Sample products:");
    sample.forEach((p, i) => {
      const images = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
      console.log(`   ${i + 1}. ${p.name}: ${images[0]}`);
    });
    
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  } finally {
    await connection.end();
  }
}

updateWebPPaths()
  .then(() => {
    console.log("\n✅ WebP path update completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ WebP path update failed:", error);
    process.exit(1);
  });
