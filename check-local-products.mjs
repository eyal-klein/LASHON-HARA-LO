import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { products } from "./drizzle/schema.js";

const DATABASE_URL = process.env.DATABASE_URL;
const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection);

const allProducts = await db.select().from(products).limit(10);
console.log("First 10 products in local DB:");
allProducts.forEach((p, i) => {
  console.log(`${i + 1}. ${p.name} - ${p.price}₪`);
});

await connection.end();
