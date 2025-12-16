import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { subscribers } from "../../drizzle/schema";
import { eq, desc, count } from "drizzle-orm";
import { nanoid } from "nanoid";

export const subscribersRouter = router({
  // Subscribe to newsletter
  subscribe: publicProcedure
    .input(z.object({
      email: z.string().email(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      source: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }
      
      const unsubscribeToken = nanoid(32);
      
      // Check if already subscribed
      const existing = await db.select()
        .from(subscribers)
        .where(eq(subscribers.email, input.email))
        .limit(1);
      
      if (existing.length > 0) {
        // Reactivate if unsubscribed
        if (!existing[0].isActive) {
          await db.update(subscribers)
            .set({ isActive: true, updatedAt: new Date() })
            .where(eq(subscribers.email, input.email));
          return { success: true, message: "נרשמת מחדש בהצלחה!" };
        }
        return { success: true, message: "כבר רשום לניוזלטר" };
      }
      
      await db.insert(subscribers).values({
        email: input.email,
        firstName: input.firstName || null,
        lastName: input.lastName || null,
        source: input.source || "website",
        unsubscribeToken,
        isActive: true,
      });
      
      return { success: true, message: "נרשמת בהצלחה לניוזלטר!" };
    }),

  // Unsubscribe from newsletter
  unsubscribe: publicProcedure
    .input(z.object({
      token: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }
      
      await db.update(subscribers)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(subscribers.unsubscribeToken, input.token));
      
      return { success: true, message: "הוסרת מרשימת התפוצה" };
    }),

  // Get subscriber count (public)
  count: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      return 0;
    }
    
    const result = await db.select({ count: count() })
      .from(subscribers)
      .where(eq(subscribers.isActive, true));
    return result[0]?.count || 0;
  }),

  // List all subscribers (admin only)
  list: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
      activeOnly: z.boolean().default(true),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return [];
      }
      
      if (input.activeOnly) {
        return await db.select()
          .from(subscribers)
          .where(eq(subscribers.isActive, true))
          .orderBy(desc(subscribers.createdAt))
          .limit(input.limit)
          .offset(input.offset);
      }
      
      return await db.select()
        .from(subscribers)
        .orderBy(desc(subscribers.createdAt))
        .limit(input.limit)
        .offset(input.offset);
    }),
});
