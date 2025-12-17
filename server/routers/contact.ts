import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { contactMessages } from "../../drizzle/schema";
import { notifyOwner } from "../_core/notification";
import { eq, desc, and, count } from "drizzle-orm";

// Validation schema for contact form
const createContactSchema = z.object({
  name: z.string().min(2, "שם חייב להכיל לפחות 2 תווים").max(100),
  email: z.string().email("כתובת אימייל לא תקינה").max(320),
  phone: z.string().max(15).optional(),
  subject: z.string().min(2, "נושא חייב להכיל לפחות 2 תווים").max(200),
  message: z.string().min(10, "הודעה חייבת להכיל לפחות 10 תווים").max(5000),
  priority: z.enum(["low", "normal", "high"]).default("normal").optional(),
});

export const contactRouter = router({
  // Submit a contact form (public)
  submit: publicProcedure
    .input(createContactSchema)
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const [result] = await db.insert(contactMessages).values({
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        subject: input.subject,
        message: input.message,
        priority: input.priority || "normal",
      }).$returningId();

      // Notify owner about new contact message
      await notifyOwner({
        title: `הודעה חדשה מ-${input.name}`,
        content: `נושא: ${input.subject}\n\nהודעה: ${input.message.substring(0, 200)}${input.message.length > 200 ? '...' : ''}\n\nאימייל: ${input.email}${input.phone ? `\nטלפון: ${input.phone}` : ''}`,
      });

      return {
        success: true,
        id: result.id,
        message: "ההודעה נשלחה בהצלחה! ניצור איתך קשר בהקדם",
      };
    }),

  // List contact messages with pagination (admin only)
  list: protectedProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(50).default(20),
      unreadOnly: z.boolean().default(false),
      priority: z.enum(["low", "normal", "high"]).optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { items: [], total: 0, page: 1, limit: 20 };
      
      const { page, limit, unreadOnly, priority } = input;
      const offset = (page - 1) * limit;
      
      // Build where conditions
      const conditions = [eq(contactMessages.isArchived, false)];
      
      if (unreadOnly) {
        conditions.push(eq(contactMessages.isRead, false));
      }
      
      if (priority) {
        conditions.push(eq(contactMessages.priority, priority));
      }
      
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      
      const [items, totalResult] = await Promise.all([
        db.select()
          .from(contactMessages)
          .where(whereClause)
          .orderBy(desc(contactMessages.createdAt))
          .limit(limit)
          .offset(offset),
        db.select({ count: count() })
          .from(contactMessages)
          .where(whereClause),
      ]);
      
      return {
        items,
        total: totalResult[0]?.count || 0,
        page,
        limit,
      };
    }),

  // Get unread count (admin only)
  getUnreadCount: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) return 0;
    
    const result = await db.select({ count: count() })
      .from(contactMessages)
      .where(and(
        eq(contactMessages.isRead, false),
        eq(contactMessages.isArchived, false)
      ));
    
    return result[0]?.count || 0;
  }),

  // Mark message as read (admin only)
  markAsRead: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db.update(contactMessages)
        .set({
          isRead: true,
          readAt: new Date(),
        })
        .where(eq(contactMessages.id, input.id));
      
      const [updated] = await db.select()
        .from(contactMessages)
        .where(eq(contactMessages.id, input.id))
        .limit(1);
      
      return updated!;
    }),

  // Archive message (admin only)
  archive: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db.update(contactMessages)
        .set({ isArchived: true })
        .where(eq(contactMessages.id, input.id));
      
      const [updated] = await db.select()
        .from(contactMessages)
        .where(eq(contactMessages.id, input.id))
        .limit(1);
      
      return updated!;
    }),

  // Delete message (admin only)
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db.delete(contactMessages).where(eq(contactMessages.id, input.id));
      
      return { success: true };
    }),
});
