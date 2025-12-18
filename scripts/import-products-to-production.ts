import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { products, productCategories } from "../drizzle/schema";
import * as fs from "fs";
import { eq } from "drizzle-orm";

const PRODUCTION_DATABASE_URL = process.env.PRODUCTION_DATABASE_URL!;
const connection = await mysql.createConnection(PRODUCTION_DATABASE_URL);
const db = drizzle(connection);

console.log("📦 Importing products to production DB...");

// Read exported data
const exportData = JSON.parse(
  fs.readFileSync("/home/ubuntu/lashonhara-v2/scripts/products-export.json", "utf-8")
);

console.log(`📊 Found ${exportData.products.length} products and ${exportData.categories.length} categories`);

// Step 1: Delete all existing products
console.log("\n🗑️  Deleting existing products...");
await db.delete(products);
console.log("✅ Deleted all existing products");

// Step 2: Delete all existing categories
console.log("\n🗑️  Deleting existing categories...");
await db.delete(productCategories);
console.log("✅ Deleted all existing categories");

// Step 3: Import categories with ID mapping
console.log("\n📥 Importing categories...");
const categoryIdMap: Record<number, number> = {};
for (const category of exportData.categories) {
  const { id: oldId, createdAt, updatedAt, ...categoryData } = category;
  const [result] = await db.insert(productCategories).values(categoryData);
  const newId = Number(result.insertId);
  categoryIdMap[oldId] = newId;
}
console.log(`✅ Imported ${exportData.categories.length} categories`);
console.log(`   Category ID mapping:`, categoryIdMap);

// Step 4: Import products with mapped category IDs
console.log("\n📥 Importing products...");
let imported = 0;
for (const product of exportData.products) {
  const { id, createdAt, updatedAt, categoryId, ...productData } = product;
  // Map old category ID to new category ID
  const newCategoryId = categoryId ? categoryIdMap[categoryId] : null;
  if (categoryId && !newCategoryId) {
    console.warn(`   Warning: Product "${product.name}" has invalid categoryId=${categoryId}`);
  }
  await db.insert(products).values({
    ...productData,
    categoryId: newCategoryId,
  });
  imported++;
  if (imported % 20 === 0) {
    console.log(`   Progress: ${imported}/${exportData.products.length}`);
  }
}
console.log(`✅ Imported ${imported} products`);

// Step 5: Verify
console.log("\n🔍 Verifying import...");
const productCount = await db.select().from(products);
const categoryCount = await db.select().from(productCategories);
console.log(`✅ Products in DB: ${productCount.length}`);
console.log(`✅ Categories in DB: ${categoryCount.length}`);

console.log("\n✨ First 5 products:");
productCount.slice(0, 5).forEach((p, i) => {
  console.log(`${i + 1}. ${p.name} - ${p.price}₪`);
});

await connection.end();
console.log("\n✅ Import completed successfully!");
