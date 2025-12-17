import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { contactMessages } from "../../drizzle/schema";
import { notifyOwner } from "../_core/notification";

// Validation schema for contact form
const createContactSchema = z.object({
  name: z.string().min(2, "שם חייב להכיל לפחות 2 תווים").max(100),
  email: z.string().email("כתובת אימייל לא תקינה").max(320),
  phone: z.string().max(15).optional(),
  subject: z.string().min(2, "נושא חייב להכיל לפחות 2 תווים").max(200),
  message: z.string().min(10, "הודעה חייבת להכיל לפחות 10 תווים").max(5000),
});

export const contactRouter = router({
  // Submit a contact form
  submit: publicProcedure
    .input(createContactSchema)
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const result = await db.insert(contactMessages).values({
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        subject: input.subject,
        message: input.message,
        priority: "normal",
      });

      // Notify owner about new contact message
      await notifyOwner({
        title: `הודעה חדשה מ-${input.name}`,
        content: `נושא: ${input.subject}\n\nהודעה: ${input.message.substring(0, 200)}${input.message.length > 200 ? '...' : ''}\n\nאימייל: ${input.email}${input.phone ? `\nטלפון: ${input.phone}` : ''}`,
      });

      return {
        success: true,
        id: result[0].insertId,
        message: "ההודעה נשלחה בהצלחה! ניצור איתך קשר בהקדם",
      };
    }),
});
