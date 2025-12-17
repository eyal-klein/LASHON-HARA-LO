import { beforeAll } from "vitest";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { users } from "./drizzle/schema";

beforeAll(async () => {
  // Create test admin user for foreign key constraints
  const connection = await mysql.createConnection(
    process.env.DATABASE_URL || "mysql://root:testpassword@localhost:3306/testdb"
  );
  
  const db = drizzle(connection);
  
  try {
    // Insert test admin user with ID=1
    await db.insert(users).values({
      id: 1,
      openId: "test-admin-openid",
      name: "Test Admin",
      email: "admin@test.com",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    }).onDuplicateKeyUpdate({ set: { id: 1 } });
    
    console.log("[Vitest Setup] Test admin user created");
  } catch (error) {
    // Ignore duplicate key errors
    if (!(error as any).message?.includes("Duplicate entry")) {
      console.error("[Vitest Setup] Error creating test user:", error);
    }
  } finally {
    await connection.end();
  }
});
