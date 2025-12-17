import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { chofetzChaimContent } from "../../drizzle/schema";
import { like, or, sql, desc } from "drizzle-orm";
import { invokeLLM } from "../_core/llm";

export const chatbotRouter = router({
  // Search Chofetz Chaim content
  search: publicProcedure
    .input(z.object({
      query: z.string().min(1).max(500),
      limit: z.number().min(1).max(10).default(5),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      
      const { query, limit } = input;
      
      // Simple text search across multiple fields
      const results = await db
        .select()
        .from(chofetzChaimContent)
        .where(
          or(
            like(chofetzChaimContent.content, `%${query}%`),
            like(chofetzChaimContent.klal, `%${query}%`),
            like(chofetzChaimContent.seif, `%${query}%`)
          )
        )
        .limit(limit);
      
      return results;
    }),

  // Ask a question and get LLM response with context
  ask: publicProcedure
    .input(z.object({
      question: z.string().min(1).max(1000),
      conversationHistory: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }
      
      const { question, conversationHistory = [] } = input;
      
      // Search for relevant content
      const searchTerms = question
        .split(/\s+/)
        .filter(term => term.length > 2)
        .slice(0, 5); // Take top 5 keywords
      
      const conditions = searchTerms.map(term =>
        or(
          like(chofetzChaimContent.content, `%${term}%`),
          like(chofetzChaimContent.klal, `%${term}%`),
          like(chofetzChaimContent.seif, `%${term}%`)
        )
      );
      
      const relevantChunks = await db
        .select()
        .from(chofetzChaimContent)
        .where(or(...conditions))
        .limit(5);
      
      // Build context from relevant chunks
      const context = relevantChunks
        .map(chunk => {
          const parts = [];
          if (chunk.klal) parts.push(`כלל ${chunk.klal}`);
          if (chunk.seif) parts.push(`סעיף ${chunk.seif}`);
          parts.push(chunk.content);
          return parts.join(" - ");
        })
        .join("\n\n");
      
      // Build messages for LLM
      const messages = [
        {
          role: "system" as const,
          content: `אתה עוזר וירטואלי המתמחה בספר "חפץ חיים" על הלכות לשון הרע ורכילות.
          
תפקידך:
1. לענות על שאלות בעברית בצורה ברורה ומדויקת
2. להסתמך על המקורות שניתנו לך מהספר
3. לצטט את הכלל והסעיף הרלוונטיים
4. להסביר בשפה פשוטה וקלה להבנה
5. אם אין מספיק מידע, להגיד זאת בכנות

מקורות רלוונטיים:
${context}

אם המקורות לא מספיקים לענות על השאלה, אמור זאת בצורה ברורה.`,
        },
        ...conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: "user" as const,
          content: question,
        },
      ];
      
      // Get LLM response
      const response = await invokeLLM({ messages });
      
      const answer = response.choices[0]?.message?.content || "מצטער, לא הצלחתי לענות על השאלה.";
      
      return {
        answer,
        sources: relevantChunks.map(chunk => ({
          klal: chunk.klal,
          seif: chunk.seif,
          content: chunk.content.substring(0, 200) + (chunk.content.length > 200 ? "..." : ""),
        })),
      };
    }),

  // Get random Chofetz Chaim quote
  randomQuote: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return null;
    
    const [quote] = await db
      .select()
      .from(chofetzChaimContent)
      .orderBy(sql`RAND()`)
      .limit(1);
    
    return quote || null;
  }),

  // Get statistics
  stats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      return {
        totalChunks: 0,
        totalKlalim: 0,
        lashonHaraKlalim: 0,
        rechilusKlalim: 0,
      };
    }
    
    const [stats] = await db
      .select({
        totalChunks: sql<number>`COUNT(*)`,
        totalKlalim: sql<number>`COUNT(DISTINCT ${chofetzChaimContent.klal})`,
      })
      .from(chofetzChaimContent);
    
    return {
      totalChunks: Number(stats?.totalChunks || 0),
      totalKlalim: Number(stats?.totalKlalim || 0),
      lashonHaraKlalim: 10,
      rechilusKlalim: 9,
    };
  }),
});
