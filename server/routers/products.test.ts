import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";
import { getDb } from "../db";
import { products, productCategories } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@lashonhara.co.il",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("products router - E2E", () => {
  let testCategoryId: number;
  let testProductId: number;

  beforeAll(async () => {
    // Create test category
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const [category] = await db
      .insert(productCategories)      .values({
        name: "Test Category E2E",
        slug: `test-category-e2e-${Date.now()}`,
        description: "Test category for E2E tests",
        isActive: true,
        sortOrder: 999,
      })
      .$returningId();

    testCategoryId = category.id;

    // Create test product
    const [product] = await db
      .insert(products)
      .values({
        name: "Test Product E2E",
        description: "Test product for E2E tests",
        price: "99.99",
        categoryId: testCategoryId,
        images: JSON.stringify(["/test-image.jpg"]),
        stockQuantity: 50,
        isPublished: true,
        isFeatured: false,
      })
      .$returningId();

    testProductId = product.id;
  });

  describe("Public endpoints", () => {
    it("should list published products", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.products.list({
        page: 1,
        limit: 10,
      });

      expect(result).toHaveProperty("items");
      expect(result).toHaveProperty("total");
      expect(result).toHaveProperty("page", 1);
      expect(result).toHaveProperty("limit", 10);
      expect(Array.isArray(result.items)).toBe(true);
      expect(result.total).toBeGreaterThan(0);
    });

    it("should filter products by category", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.products.list({
        page: 1,
        limit: 10,
        categoryId: testCategoryId,
      });

      expect(result.items.length).toBeGreaterThan(0);
      expect(result.items[0]?.categoryId).toBe(testCategoryId);
    });

    it("should search products by name", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.products.list({
        page: 1,
        limit: 10,
        search: "Test Product",
      });

      expect(result.items.length).toBeGreaterThan(0);
      expect(result.items[0]?.name).toContain("Test");
    });

    it("should get product by id", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const product = await caller.products.getById({ id: testProductId });

      expect(product).toBeDefined();
      expect(product?.id).toBe(testProductId);
      expect(product?.name).toBe("Test Product E2E");
      expect(product?.price).toBe("99.99");
    });

    it("should return null for non-existent product", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const product = await caller.products.getById({ id: 999999 });

      expect(product).toBeNull();
    });

    it("should list featured products", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.products.list({
        page: 1,
        limit: 10,
        featured: true,
      });

      expect(result.items.every((p) => p.isFeatured)).toBe(true);
    });
  });

  describe("Admin endpoints", () => {
    it("should create new product (admin only)", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const newProduct = await caller.products.create({
        name: "New Test Product",
        description: "Created by admin",
        price: 149.99,
        categoryId: testCategoryId,
        images: ["https://example.com/new-test-image.jpg"],
        stockQuantity: 100,
        isPublished: true,
        isFeatured: false,
      });

      expect(newProduct).toHaveProperty("id");
      expect(newProduct.name).toBe("New Test Product");
      expect(newProduct.price).toBe("149.99");
    });

    it("should update existing product (admin only)", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const updated = await caller.products.update({
        id: testProductId,
        data: {
          name: "Updated Test Product",
          price: 199.99,
        },
      });

      expect(updated.name).toBe("Updated Test Product");
      expect(updated.price).toBe("199.99");
    });

    it("should delete product (admin only)", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      // Create a product to delete
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [toDelete] = await db
        .insert(products)
        .values({
          name: "Product to Delete",
          description: "Will be deleted",
          price: "50.00",
          categoryId: testCategoryId,
          images: JSON.stringify(["/delete-test.jpg"]),
          stockQuantity: 10,
          isPublished: true,
        })
        .$returningId();

      await caller.products.delete({ id: toDelete.id });

      // Verify deletion
      const deleted = await db
        .select()
        .from(products)
        .where(eq(products.id, toDelete.id));

      expect(deleted.length).toBe(0);
    });
  });

  describe("Product categories", () => {
    it("should list all active categories", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const categories = await caller.products.listCategories();

      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
      expect(categories.every((c) => c.isActive)).toBe(true);
    });

    it("should get category by id", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const category = await caller.products.getCategoryById({
        id: testCategoryId,
      });

      expect(category).toBeDefined();
      expect(category?.id).toBe(testCategoryId);
      expect(category?.name).toBe("Test Category E2E");
    });
  });

  describe("Stock management", () => {
    it("should show low stock products (admin)", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      // Create low stock product
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.insert(products).values({
        name: "Low Stock Product",
        description: "Only 2 left",
        price: "25.00",
        categoryId: testCategoryId,
        images: JSON.stringify(["/low-stock.jpg"]),
        stockQuantity: 2,
        lowStockThreshold: 5,
        isPublished: true,
      });

      const result = await caller.products.list({
        page: 1,
        limit: 50,
      });

      const lowStockProducts = result.items.filter(
        (p) => p.stockQuantity <= (p.lowStockThreshold || 5)
      );

      expect(lowStockProducts.length).toBeGreaterThan(0);
    });
  });

  describe("Price filtering", () => {
    it("should filter products by price range", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.products.list({
        page: 1,
        limit: 50,
        minPrice: 50,
        maxPrice: 150,
      });

      result.items.forEach((product) => {
        const price = parseFloat(product.price);
        expect(price).toBeGreaterThanOrEqual(50);
        expect(price).toBeLessThanOrEqual(150);
      });
    });
  });
});
