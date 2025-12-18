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
      name: z.string().optional(),
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
        if (existing[0].status === "unsubscribed") {
          await db.update(subscribers)
            .set({ status: "active", confirmedAt: new Date() })
            .where(eq(subscribers.email, input.email));
          return { success: true, message: "נרשמת מחדש בהצלחה!" };
        }
        return { success: true, message: "כבר רשום לניוזלטר" };
      }
      
      await db.insert(subscribers).values({
        email: input.email,
        name: input.name || null,
        source: input.source || "website",
        unsubscribeToken,
        status: "active",
        confirmedAt: new Date(),
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
        .set({ status: "unsubscribed", unsubscribedAt: new Date() })
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
      .where(eq(subscribers.status, 'active'));
    return result[0]?.count || 0;
  }),

  // List all subscribers (admin only)
  list: protectedProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
      activeOnly: z.boolean().default(true),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return { items: [], total: 0, page: 1, limit: 20 };
      }
      
      const { page, limit, activeOnly } = input;
      const offset = (page - 1) * limit;
      
      const whereClause = activeOnly ? eq(subscribers.status, 'active') : undefined;
      
      const [items, totalResult] = await Promise.all([
        db.select()
          .from(subscribers)
          .where(whereClause)
          .orderBy(desc(subscribers.createdAt))
          .limit(limit)
          .offset(offset),
        db.select({ count: count() })
          .from(subscribers)
          .where(whereClause),
      ]);
      
      return {
        items,
        total: totalResult[0]?.count || 0,
        page,
        limit,
      };
    }),

  // Export subscribers (Admin)
  export: protectedProcedure
    .input(z.object({ format: z.enum(["csv", "xlsx"]) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return "";
      
      const items = await db.select().from(subscribers).orderBy(desc(subscribers.createdAt));
      
      const headers = ["ID", "תאריך", "אימייל", "שם", "סטטוס", "מקור"];
      const rows = items.map(item => [
        item.id,
        item.createdAt?.toISOString().split("T")[0] || "",
        item.email,
        item.name || "",
        item.status,
        item.source || "",
      ]);
      
      return [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    }),
});
