import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { products, productCategories } from "../drizzle/schema";
import * as fs from "fs";

const DATABASE_URL = process.env.DATABASE_URL!;
const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection);

console.log("📦 Exporting products from local DB...");

// Export all products
const allProducts = await db.select().from(products);
console.log(`✅ Found ${allProducts.length} products`);

// Export all categories
const allCategories = await db.select().from(productCategories);
console.log(`✅ Found ${allCategories.length} categories`);

// Save to JSON
const exportData = {
  categories: allCategories,
  products: allProducts,
  exportedAt: new Date().toISOString(),
  totalProducts: allProducts.length,
  totalCategories: allCategories.length
};

fs.writeFileSync(
  "/home/ubuntu/lashonhara-v2/scripts/products-export.json",
  JSON.stringify(exportData, null, 2)
);

console.log("✅ Exported to scripts/products-export.json");
console.log("\nFirst 5 products:");
allProducts.slice(0, 5).forEach((p, i) => {
  console.log(`${i + 1}. ${p.name} - ${p.price}₪ - Category: ${p.categoryId}`);
});

await connection.end();
