import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { activities } from "../../drizzle/schema";
import { eq, desc, and, gte, count, like } from "drizzle-orm";

export const activitiesRouter = router({
  // List activities with pagination (public)
  list: publicProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(50).default(20),
      type: z.enum(["distribution", "workshop", "exhibition", "campaign", "event", "school_program"]).optional(),
      upcoming: z.boolean().optional(),
      featured: z.boolean().optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { items: [], total: 0, page: 1, limit: 20 };
      
      const { page, limit, type, upcoming, featured } = input;
      const offset = (page - 1) * limit;
      
      // Build where conditions
      const conditions = [eq(activities.isPublished, true)];
      
      if (type) {
        conditions.push(eq(activities.type, type));
      }
      
      if (upcoming) {
        conditions.push(gte(activities.date, new Date()));
      }
      
      if (featured) {
        conditions.push(eq(activities.isFeatured, true));
      }
      
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      
      const [items, totalResult] = await Promise.all([
        db.select()
          .from(activities)
          .where(whereClause)
          .orderBy(desc(activities.date))
          .limit(limit)
          .offset(offset),
        db.select({ count: count() })
          .from(activities)
          .where(whereClause),
      ]);
      
      return {
        items,
        total: totalResult[0]?.count || 0,
        page,
        limit,
      };
    }),

  // Get activity by ID (public)
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      
      const items = await db.select()
        .from(activities)
        .where(and(
          eq(activities.id, input.id),
          eq(activities.isPublished, true)
        ))
        .limit(1);
      
      return items[0] || null;
    }),

  // Get activity by slug (public)
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      
      const items = await db.select()
        .from(activities)
        .where(and(
          eq(activities.slug, input.slug),
          eq(activities.isPublished, true)
        ))
        .limit(1);
      
      return items[0] || null;
    }),

  // Get upcoming activities count (public)
  upcomingCount: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return 0;
    
    const result = await db.select({ count: count() })
      .from(activities)
      .where(and(
        eq(activities.isPublished, true),
        gte(activities.date, new Date())
      ));
    
    return result[0]?.count || 0;
  }),

  // Create activity (admin only)
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1).max(200),
      slug: z.string().min(1).max(200),
      description: z.string(),
      shortDescription: z.string().max(300).optional(),
      type: z.enum(["distribution", "workshop", "exhibition", "campaign", "event", "school_program"]),
      imageUrl: z.string().url().optional(),
      galleryImages: z.array(z.string().url()).optional(),
      date: z.date().optional(),
      endDate: z.date().optional(),
      location: z.string().max(200).optional(),
      participantCount: z.number().int().optional(),
      isPublished: z.boolean().default(true),
      isFeatured: z.boolean().default(false),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const [result] = await db.insert(activities).values({
        ...input,
        galleryImages: input.galleryImages ? JSON.stringify(input.galleryImages) : null,
        createdBy: ctx.user?.id || null,
      }).$returningId();
      
      const [created] = await db.select()
        .from(activities)
        .where(eq(activities.id, result.id))
        .limit(1);
      
      return created!;
    }),

  // Update activity (admin only)
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().min(1).max(200).optional(),
      slug: z.string().min(1).max(200).optional(),
      description: z.string().optional(),
      shortDescription: z.string().max(300).optional(),
      type: z.enum(["distribution", "workshop", "exhibition", "campaign", "event", "school_program"]).optional(),
      imageUrl: z.string().url().optional(),
      galleryImages: z.array(z.string().url()).optional(),
      date: z.date().optional(),
      endDate: z.date().optional(),
      location: z.string().max(200).optional(),
      participantCount: z.number().int().optional(),
      isPublished: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const { id, galleryImages, ...data } = input;
      
      await db.update(activities)
        .set({
          ...data,
          ...(galleryImages && { galleryImages: JSON.stringify(galleryImages) }),
        })
        .where(eq(activities.id, id));
      
      const [updated] = await db.select()
        .from(activities)
        .where(eq(activities.id, id))
        .limit(1);
      
      return updated!;
    }),

  // Delete activity (admin only)
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db.delete(activities).where(eq(activities.id, input.id));
      
      return { success: true };
    }),
});
