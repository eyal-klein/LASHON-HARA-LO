import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { galleryItems } from "../../drizzle/schema";
import { eq, desc, and, count } from "drizzle-orm";

export const galleryRouter = router({
  // List gallery items (public)
  list: publicProcedure
    .input(z.object({
      category: z.enum(["ambassador", "event", "campaign", "media", "other"]).optional(),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      
      if (input.category) {
        return await db.select()
          .from(galleryItems)
          .where(and(
            eq(galleryItems.isPublished, true),
            eq(galleryItems.category, input.category)
          ))
          .orderBy(desc(galleryItems.sortOrder), desc(galleryItems.createdAt))
          .limit(input.limit)
          .offset(input.offset);
      }
      
      return await db.select()
        .from(galleryItems)
        .where(eq(galleryItems.isPublished, true))
        .orderBy(desc(galleryItems.sortOrder), desc(galleryItems.createdAt))
        .limit(input.limit)
        .offset(input.offset);
    }),

  // Get single gallery item
  get: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      
      const items = await db.select()
        .from(galleryItems)
        .where(eq(galleryItems.id, input.id))
        .limit(1);
      return items[0] || null;
    }),

  // Get gallery categories with counts
  categories: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    
    const categories = ["ambassador", "event", "campaign", "media", "other"];
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
      title: z.string().min(1),
      description: z.string().optional(),
      category: z.enum(["ambassador", "event", "campaign", "media", "other"]),
      imageUrl: z.string().url(),
      thumbnailUrl: z.string().url().optional(),
      videoUrl: z.string().url().optional(),
      eventDate: z.date().optional(),
      location: z.string().optional(),
      tags: z.array(z.string()).optional(),
      sortOrder: z.number().default(0),
      isPublished: z.boolean().default(true),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const result = await db.insert(galleryItems).values({
        ...input,
        tags: input.tags ? JSON.stringify(input.tags) : null,
        createdBy: ctx.user.id,
      });
      
      return { success: true, id: result[0].insertId };
    }),

  // Update gallery item (admin only)
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      category: z.enum(["ambassador", "event", "campaign", "media", "other"]).optional(),
      imageUrl: z.string().url().optional(),
      thumbnailUrl: z.string().url().optional(),
      videoUrl: z.string().url().optional(),
      eventDate: z.date().optional(),
      location: z.string().optional(),
      tags: z.array(z.string()).optional(),
      sortOrder: z.number().optional(),
      isPublished: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const { id, tags, ...data } = input;
      await db.update(galleryItems)
        .set({
          ...data,
          tags: tags ? JSON.stringify(tags) : undefined,
          updatedAt: new Date(),
        })
        .where(eq(galleryItems.id, id));
      
      return { success: true };
    }),

  // Delete gallery item (admin only)
  deleteItem: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db.delete(galleryItems).where(eq(galleryItems.id, input.id));
      return { success: true };
    }),
});
