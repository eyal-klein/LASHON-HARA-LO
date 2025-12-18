import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await connection.execute('SELECT id, name, images FROM products WHERE id IN (1,2,3,4,5)');
console.log(JSON.stringify(rows, null, 2));
await conn.end();
