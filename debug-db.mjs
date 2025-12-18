import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Check product 25 (first one that should have been updated)
const [rows] = await conn.execute('SELECT id, name, images FROM products WHERE id = 30001');
console.log('Product 30001:');
console.log(JSON.stringify(rows, null, 2));

// Check if the UPDATE actually worked
const [rows2] = await conn.execute('SELECT id, images FROM products WHERE id IN (30001, 30002, 30003) ORDER BY id');
console.log('\nProducts 30001-30003:');
for (const r of rows2) {
  console.log(`ID ${r.id}: ${r.images}`);
}

await conn.end();
