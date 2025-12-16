import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { activities } from "../../drizzle/schema";
import { eq, desc, and, gte, count } from "drizzle-orm";

export const activitiesRouter = router({
  // List activities (public)
  list: publicProcedure
    .input(z.object({
      activityType: z.enum(["workshop", "distribution", "lecture", "campaign", "event", "other"]).optional(),
      upcoming: z.boolean().optional(),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      
      if (input.activityType && input.upcoming) {
        return await db.select()
          .from(activities)
          .where(and(
            eq(activities.isPublished, true),
            eq(activities.activityType, input.activityType),
            gte(activities.startDate, new Date())
          ))
          .orderBy(desc(activities.startDate))
          .limit(input.limit)
          .offset(input.offset);
      }
      
      if (input.activityType) {
        return await db.select()
          .from(activities)
          .where(and(
            eq(activities.isPublished, true),
            eq(activities.activityType, input.activityType)
          ))
          .orderBy(desc(activities.startDate))
          .limit(input.limit)
          .offset(input.offset);
      }
      
      if (input.upcoming) {
        return await db.select()
          .from(activities)
          .where(and(
            eq(activities.isPublished, true),
            gte(activities.startDate, new Date())
          ))
          .orderBy(desc(activities.startDate))
          .limit(input.limit)
          .offset(input.offset);
      }
      
      return await db.select()
        .from(activities)
        .where(eq(activities.isPublished, true))
        .orderBy(desc(activities.startDate))
        .limit(input.limit)
        .offset(input.offset);
    }),

  // Get single activity
  get: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      
      const items = await db.select()
        .from(activities)
        .where(eq(activities.id, input.id))
        .limit(1);
      return items[0] || null;
    }),

  // Get upcoming activities count
  upcomingCount: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return 0;
    
    const result = await db.select({ count: count() })
      .from(activities)
      .where(and(
        eq(activities.isPublished, true),
        gte(activities.startDate, new Date())
      ));
    return result[0]?.count || 0;
  }),

  // Create activity (admin only)
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      activityType: z.enum(["workshop", "distribution", "lecture", "campaign", "event", "other"]),
      startDate: z.date(),
      endDate: z.date().optional(),
      location: z.string().optional(),
      address: z.string().optional(),
      maxParticipants: z.number().optional(),
      imageUrl: z.string().url().optional(),
      registrationUrl: z.string().url().optional(),
      isPublished: z.boolean().default(true),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const result = await db.insert(activities).values({
        ...input,
        currentParticipants: 0,
        createdBy: ctx.user.id,
      });
      
      return { success: true, id: result[0].insertId };
    }),

  // Update activity (admin only)
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      activityType: z.enum(["workshop", "distribution", "lecture", "campaign", "event", "other"]).optional(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      location: z.string().optional(),
      address: z.string().optional(),
      maxParticipants: z.number().optional(),
      imageUrl: z.string().url().optional(),
      registrationUrl: z.string().url().optional(),
      isPublished: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const { id, ...data } = input;
      await db.update(activities)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(activities.id, id));
      
      return { success: true };
    }),

  // Delete activity (admin only)
  deleteActivity: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db.delete(activities).where(eq(activities.id, input.id));
      return { success: true };
    }),
});
