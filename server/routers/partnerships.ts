import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { partnerships } from "../../drizzle/schema";
import { notifyOwner } from "../_core/notification";
import { eq, desc, and, count } from "drizzle-orm";

// Partnership types
const partnershipTypes = ["ambassador", "financial", "school", "inspiration"] as const;

// Validation schema for partnership application
const createPartnershipSchema = z.object({
  type: z.enum(partnershipTypes),
  name: z.string().min(2, "שם חייב להכיל לפחות 2 תווים").max(100),
  email: z.string().email("כתובת אימייל לא תקינה").max(320),
  phone: z.string().min(9, "מספר טלפון לא תקין").max(15),
  organization: z.string().max(200).optional(),
  role: z.string().max(100).optional(),
  message: z.string().max(2000).optional(),
});

// Type labels for notifications
const typeLabels: Record<typeof partnershipTypes[number], string> = {
  ambassador: "שגריר",
  financial: "תמיכה כספית",
  school: "בית ספר",
  inspiration: "השראה",
};

export const partnershipsRouter = router({
  // Submit a partnership application (public)
  submit: publicProcedure
    .input(createPartnershipSchema)
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const [result] = await db.insert(partnerships).values({
        type: input.type,
        name: input.name,
        email: input.email,
        phone: input.phone,
        organization: input.organization || null,
        role: input.role || null,
        message: input.message || null,
        status: "pending",
      }).$returningId();

      // Notify owner about new partnership application
      const typeLabel = typeLabels[input.type];
      await notifyOwner({
        title: `בקשת שותפות חדשה - ${typeLabel}`,
        content: `שם: ${input.name}\nסוג: ${typeLabel}\nאימייל: ${input.email}\nטלפון: ${input.phone}${input.organization ? `\nארגון: ${input.organization}` : ''}${input.message ? `\n\nהודעה: ${input.message.substring(0, 200)}` : ''}`,
      });

      return {
        success: true,
        id: result.id,
        message: "הבקשה נשלחה בהצלחה! ניצור איתך קשר בהקדם",
      };
    }),

  // Get partnership type info (public)
  types: publicProcedure.query(() => {
    return [
      {
        type: "ambassador",
        title: "שגרירים",
        description: "אני רוצה להיות בנבחרת השגרירים, לעזור בחלוקות ולנקות את השיח ברשת",
        icon: "Users",
        color: "bg-blue-500",
      },
      {
        type: "financial",
        title: "תמיכה כספית",
        description: "אני רוצה לתמוך כספית ולסייע בהפצת המסר בבתי ספר",
        icon: "Heart",
        color: "bg-pink-500",
      },
      {
        type: "school",
        title: "בית ספר",
        description: "אני נציג של בית הספר ורוצה לאמץ תוכנית חינוכית",
        icon: "School",
        color: "bg-green-500",
      },
      {
        type: "inspiration",
        title: "השראה",
        description: "אני רוצה להפיץ השראה באמצעות הסיפור שלי",
        icon: "Sparkles",
        color: "bg-purple-500",
      },
    ];
  }),

  // List partnership applications with pagination (admin only)
  list: protectedProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(50).default(20),
      type: z.enum(partnershipTypes).optional(),
      status: z.enum(["pending", "reviewing", "approved", "rejected"]).optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { items: [], total: 0, page: 1, limit: 20 };
      
      const { page, limit, type, status } = input;
      const offset = (page - 1) * limit;
      
      // Build where conditions
      const conditions = [];
      
      if (type) {
        conditions.push(eq(partnerships.type, type));
      }
      
      if (status) {
        conditions.push(eq(partnerships.status, status));
      }
      
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      
      const [items, totalResult] = await Promise.all([
        db.select()
          .from(partnerships)
          .where(whereClause)
          .orderBy(desc(partnerships.createdAt))
          .limit(limit)
          .offset(offset),
        db.select({ count: count() })
          .from(partnerships)
          .where(whereClause),
      ]);
      
      return {
        items,
        total: totalResult[0]?.count || 0,
        page,
        limit,
      };
    }),

  // Get pending count (admin only)
  getPendingCount: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) return 0;
    
    const result = await db.select({ count: count() })
      .from(partnerships)
      .where(eq(partnerships.status, "pending"));
    
    return result[0]?.count || 0;
  }),

  // Update partnership status (admin only)
  updateStatus: protectedProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["pending", "reviewing", "approved", "rejected"]),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db.update(partnerships)
        .set({
          status: input.status,
          ...(input.notes && { notes: input.notes }),
        })
        .where(eq(partnerships.id, input.id));
      
      const [updated] = await db.select()
        .from(partnerships)
        .where(eq(partnerships.id, input.id))
        .limit(1);
      
      return updated!;
    }),

  // Delete partnership (admin only)
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db.delete(partnerships).where(eq(partnerships.id, input.id));
      
      return { success: true };
    }),
});
