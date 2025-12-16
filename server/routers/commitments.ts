import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { commitments } from "../../drizzle/schema";
import { count, desc } from "drizzle-orm";

// Validation schema for creating a commitment
const createCommitmentSchema = z.object({
  name: z.string().min(2, "שם חייב להכיל לפחות 2 תווים").max(100),
  phone: z.string().min(9, "מספר טלפון לא תקין").max(15),
  email: z.string().email("כתובת אימייל לא תקינה").max(320),
  receiveUpdates: z.boolean().default(false),
});

export const commitmentsRouter = router({
  // Create a new commitment
  create: publicProcedure
    .input(createCommitmentSchema)
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      // Get IP and User Agent from request
      const ipAddress = ctx.req.headers["x-forwarded-for"] as string || 
                        ctx.req.socket.remoteAddress || 
                        null;
      const userAgent = ctx.req.headers["user-agent"] || null;

      const result = await db.insert(commitments).values({
        name: input.name,
        phone: input.phone,
        email: input.email,
        receiveUpdates: input.receiveUpdates,
        ipAddress: ipAddress?.split(",")[0]?.trim() || null,
        userAgent,
        source: "website",
      });

      return {
        success: true,
        id: result[0].insertId,
        message: "תודה על ההתחייבות! יחד ננקה את השיח",
      };
    }),

  // Get commitment statistics
  stats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      // Return default values if DB not available
      return {
        totalCommitments: 50000,
        todayCommitments: 0,
        weekCommitments: 0,
      };
    }

    const [totalResult] = await db.select({ count: count() }).from(commitments);
    
    // Add base count from previous system
    const baseCount = 50000;
    const totalCommitments = baseCount + (totalResult?.count || 0);

    return {
      totalCommitments,
      todayCommitments: 0, // TODO: Calculate today's count
      weekCommitments: 0,  // TODO: Calculate week's count
    };
  }),

  // Get recent commitments (for admin)
  recent: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(10),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return [];
      }

      const limit = input?.limit || 10;
      const result = await db
        .select({
          id: commitments.id,
          name: commitments.name,
          createdAt: commitments.createdAt,
          source: commitments.source,
        })
        .from(commitments)
        .orderBy(desc(commitments.createdAt))
        .limit(limit);

      return result;
    }),
});
