import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { products } from "../../drizzle/schema";
import { eq, desc, and, like, gte, lte, count, sql } from "drizzle-orm";

const ProductInput = z.object({
  name: z.string().min(1).max(200),
  description: z.string(),
  price: z.number().min(0),
  compareAtPrice: z.number().min(0).optional(),
  sku: z.string().max(100).optional(),
  barcode: z.string().max(100).optional(),
  category: z.enum(["books", "bracelets", "stickers", "posters", "other"]),
  images: z.array(z.string().url()).min(1),
  stockQuantity: z.number().min(0).default(0),
  lowStockThreshold: z.number().min(0).default(5),
  weight: z.number().min(0).optional(),
  dimensions: z.string().max(100).optional(),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  tags: z.string().optional(),
});

export const productsRouter = router({
  // Public: List published products
  list: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(12),
        category: z.enum(["books", "bracelets", "stickers", "posters", "other"]).optional(),
        search: z.string().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        inStock: z.boolean().optional(),
        featured: z.boolean().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return { items: [], total: 0, page: 1, limit: 12 };
      }

      const { page, limit, category, search, minPrice, maxPrice, inStock, featured } = input;
      const offset = (page - 1) * limit;

      let conditions = [eq(products.isPublished, true)];
      if (category) {
        conditions.push(eq(products.category, category));
      }
      if (search) {
        conditions.push(like(products.name, `%${search}%`));
      }
      if (minPrice !== undefined) {
        conditions.push(gte(products.price, minPrice));
      }
      if (maxPrice !== undefined) {
        conditions.push(lte(products.price, maxPrice));
      }
      if (inStock) {
        conditions.push(sql`${products.stockQuantity} > 0`);
      }
      if (featured) {
        conditions.push(eq(products.isFeatured, true));
      }

      const whereClause = and(...conditions);

      const [items, totalResult] = await Promise.all([
        db
          .select()
          .from(products)
          .where(whereClause)
          .orderBy(desc(products.createdAt))
          .limit(limit)
          .offset(offset),
        db.select({ count: count() }).from(products).where(whereClause),
      ]);

      return {
        items,
        total: totalResult[0]?.count || 0,
        page,
        limit,
      };
    }),

  // Public: Get single product
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return null;
      }

      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, input.id));

      return product || null;
    }),

  // Public: Get featured products
  featured: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(6) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return [];
      }

      const items = await db
        .select()
        .from(products)
        .where(
          and(
            eq(products.isPublished, true),
            eq(products.isFeatured, true)
          )
        )
        .orderBy(desc(products.createdAt))
        .limit(input.limit);

      return items;
    }),

  // Admin: Create product
  create: protectedProcedure
    .input(ProductInput)
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const result = await db.insert(products).values({
        ...input,
        images: JSON.stringify(input.images),
      });

      return {
        id: result[0].insertId,
        success: true,
      };
    }),

  // Admin: Update product
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: ProductInput.partial(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const updateData = { ...input.data };
      if (input.data.images) {
        updateData.images = JSON.stringify(input.data.images) as any;
      }

      await db
        .update(products)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(products.id, input.id));

      const [updated] = await db
        .select()
        .from(products)
        .where(eq(products.id, input.id));

      return updated;
    }),

  // Admin: Delete product
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      await db.delete(products).where(eq(products.id, input.id));

      return { success: true };
    }),

  // Admin: List all products (including unpublished)
  listAll: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
        category: z.enum(["books", "bracelets", "stickers", "posters", "other"]).optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return { items: [], total: 0, page: 1, limit: 20 };
      }

      const { page, limit, category } = input;
      const offset = (page - 1) * limit;

      const whereClause = category ? eq(products.category, category) : undefined;

      const [items, totalResult] = await Promise.all([
        db
          .select()
          .from(products)
          .where(whereClause)
          .orderBy(desc(products.createdAt))
          .limit(limit)
          .offset(offset),
        db.select({ count: count() }).from(products).where(whereClause),
      ]);

      return {
        items,
        total: totalResult[0]?.count || 0,
        page,
        limit,
      };
    }),

  // Admin: Update stock quantity
  updateStock: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        quantity: z.number().min(0),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      await db
        .update(products)
        .set({ stockQuantity: input.quantity, updatedAt: new Date() })
        .where(eq(products.id, input.id));

      const [updated] = await db
        .select()
        .from(products)
        .where(eq(products.id, input.id));

      return updated;
    }),

  // Admin: Get inventory statistics
  getInventoryStats: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      return {
        totalProducts: 0,
        publishedProducts: 0,
        lowStockProducts: 0,
        outOfStockProducts: 0,
        totalValue: 0,
      };
    }

    const [stats] = await db
      .select({
        totalProducts: count(),
        publishedProducts: sql<number>`SUM(CASE WHEN ${products.isPublished} = 1 THEN 1 ELSE 0 END)`,
        lowStockProducts: sql<number>`SUM(CASE WHEN ${products.stockQuantity} > 0 AND ${products.stockQuantity} <= ${products.lowStockThreshold} THEN 1 ELSE 0 END)`,
        outOfStockProducts: sql<number>`SUM(CASE WHEN ${products.stockQuantity} = 0 THEN 1 ELSE 0 END)`,
        totalValue: sql<number>`COALESCE(SUM(${products.price} * ${products.stockQuantity}), 0)`,
      })
      .from(products);

    return {
      totalProducts: Number(stats?.totalProducts || 0),
      publishedProducts: Number(stats?.publishedProducts || 0),
      lowStockProducts: Number(stats?.lowStockProducts || 0),
      outOfStockProducts: Number(stats?.outOfStockProducts || 0),
      totalValue: Number(stats?.totalValue || 0),
    };
  }),

  // Admin: Get low stock products
  getLowStock: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      return [];
    }

    const items = await db
      .select()
      .from(products)
      .where(
        and(
          sql`${products.stockQuantity} > 0`,
          sql`${products.stockQuantity} <= ${products.lowStockThreshold}`
        )
      )
      .orderBy(products.stockQuantity);

    return items;
  }),
});
