import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { galleryItems } from "../../drizzle/schema";
import { eq, desc, and, count, asc } from "drizzle-orm";

export const galleryRouter = router({
  // List gallery items with pagination (public)
  list: publicProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(50).default(20),
      category: z.enum(["ambassadors", "events", "schools", "partners", "campaigns", "workshops"]).optional(),
      featured: z.boolean().optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { items: [], total: 0, page: 1, limit: 20 };
      
      const { page, limit, category, featured } = input;
      const offset = (page - 1) * limit;
      
      // Build where conditions
      const conditions = [eq(galleryItems.isPublished, true)];
      
      if (category) {
        conditions.push(eq(galleryItems.category, category));
      }
      
      if (featured) {
        conditions.push(eq(galleryItems.isFeatured, true));
      }
      
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      
      const [items, totalResult] = await Promise.all([
        db.select()
          .from(galleryItems)
          .where(whereClause)
          .orderBy(asc(galleryItems.sortOrder), desc(galleryItems.createdAt))
          .limit(limit)
          .offset(offset),
        db.select({ count: count() })
          .from(galleryItems)
          .where(whereClause),
      ]);
      
      return {
        items,
        total: totalResult[0]?.count || 0,
        page,
        limit,
      };
    }),

  // Get gallery item by ID (public)
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      
      const items = await db.select()
        .from(galleryItems)
        .where(and(
          eq(galleryItems.id, input.id),
          eq(galleryItems.isPublished, true)
        ))
        .limit(1);
      
      // Increment view count
      if (items[0]) {
        await db.update(galleryItems)
          .set({ viewCount: items[0].viewCount + 1 })
          .where(eq(galleryItems.id, input.id));
      }
      
      return items[0] || null;
    }),

  // Get gallery categories with counts (public)
  categories: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    
    const categories = ["ambassadors", "events", "schools", "partners", "campaigns", "workshops"] as const;
    const results = await Promise.all(
      categories.map(async (cat) => {
        const result = await db.select({ count: count() })
          .from(galleryItems)
          .where(and(
            eq(galleryItems.category, cat),
            eq(galleryItems.isPublished, true)
          ));
        return { category: cat, count: result[0]?.count || 0 };
      })
    );
    return results.filter(r => r.count > 0);
  }),

  // Create gallery item (admin only)
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1).max(200),
      description: z.string().optional(),
      imageUrl: z.string().url(),
      thumbnailUrl: z.string().url().optional(),
      category: z.enum(["ambassadors", "events", "schools", "partners", "campaigns", "workshops"]),
      personName: z.string().max(100).optional(),
      personRole: z.string().max(100).optional(),
      eventDate: z.date().optional(),
      location: z.string().max(200).optional(),
      isPublished: z.boolean().default(true),
      isFeatured: z.boolean().default(false),
      sortOrder: z.number().int().default(0),
      metadata: z.record(z.any()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const [result] = await db.insert(galleryItems).values({
        ...input,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
        createdBy: ctx.user?.id || null,
      }).$returningId();
      
      const [created] = await db.select()
        .from(galleryItems)
        .where(eq(galleryItems.id, result.id))
        .limit(1);
      
      return created!;
    }),

  // Update gallery item (admin only)
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().min(1).max(200).optional(),
      description: z.string().optional(),
      imageUrl: z.string().url().optional(),
      thumbnailUrl: z.string().url().optional(),
      category: z.enum(["ambassadors", "events", "schools", "partners", "campaigns", "workshops"]).optional(),
      personName: z.string().max(100).optional(),
      personRole: z.string().max(100).optional(),
      eventDate: z.date().optional(),
      location: z.string().max(200).optional(),
      isPublished: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      sortOrder: z.number().int().optional(),
      metadata: z.record(z.any()).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const { id, metadata, ...data } = input;
      
      await db.update(galleryItems)
        .set({
          ...data,
          ...(metadata && { metadata: JSON.stringify(metadata) }),
        })
        .where(eq(galleryItems.id, id));
      
      const [updated] = await db.select()
        .from(galleryItems)
        .where(eq(galleryItems.id, id))
        .limit(1);
      
      return updated!;
    }),

  // Delete gallery item (admin only)
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db.delete(galleryItems).where(eq(galleryItems.id, input.id));
      
      return { success: true };
    }),
});
