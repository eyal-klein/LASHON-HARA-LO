import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { content } from "../../drizzle/schema";
import { getDb } from "../db";
import { eq } from "drizzle-orm";

export const contentRouter = router({
  // Get all content sections
  list: publicProcedure.query(async () => {
    const db = await getDb();
    return await db.select().from(content).orderBy(content.createdAt);
  }),

  // Get content by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const [result] = await db
        .select()
        .from(content)
        .where(eq(content.slug, input.slug))
        .limit(1);
      return result;
    }),
});
