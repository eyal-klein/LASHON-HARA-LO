import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { chofetzChaimContent, chofetzChaimCommentary, chofetzChaimTopics, ragConversations } from "../../drizzle/schema";
import { eq, desc, like } from "drizzle-orm";
import { invokeLLM } from "../_core/llm";

export const chofetzChaimRouter = router({
  // List topics
  topics: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    
    return await db.select()
      .from(chofetzChaimTopics)
      .orderBy(chofetzChaimTopics.sortOrder);
  }),

  // List content by topic
  listByTopic: publicProcedure
    .input(z.object({
      topicId: z.number(),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      
      return await db.select()
        .from(chofetzChaimContent)
        .where(eq(chofetzChaimContent.topicId, input.topicId))
        .orderBy(chofetzChaimContent.sectionNumber)
        .limit(input.limit)
        .offset(input.offset);
    }),

  // Get single content with commentaries
  getContent: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      
      const content = await db.select()
        .from(chofetzChaimContent)
        .where(eq(chofetzChaimContent.id, input.id))
        .limit(1);
      
      if (!content[0]) return null;
      
      const commentaries = await db.select()
        .from(chofetzChaimCommentary)
        .where(eq(chofetzChaimCommentary.contentId, input.id));
      
      return { ...content[0], commentaries };
    }),

  // Search content
  searchContent: publicProcedure
    .input(z.object({
      query: z.string().min(2),
      limit: z.number().min(1).max(50).default(10),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      
      return await db.select()
        .from(chofetzChaimContent)
        .where(like(chofetzChaimContent.hebrewText, `%${input.query}%`))
        .limit(input.limit);
    }),

  // AI-powered Q&A
  askQuestion: publicProcedure
    .input(z.object({
      question: z.string().min(5).max(500),
      conversationId: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      
      // Search for relevant content
      let relevantContent: any[] = [];
      if (db) {
        relevantContent = await db.select()
          .from(chofetzChaimContent)
          .where(like(chofetzChaimContent.hebrewText, `%${input.question.split(" ")[0]}%`))
          .limit(5);
      }
      
      // Build context from relevant content
      const context = relevantContent
        .map(c => `${c.hebrewText}\n${c.englishTranslation || ""}`)
        .join("\n\n---\n\n");
      
      // Call LLM for answer
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `אתה מומחה להלכות לשון הרע לפי ספר חפץ חיים. 
ענה על שאלות בעברית בצורה ברורה ומכבדת.
השתמש במקורות הבאים לתשובתך:

${context || "אין מקורות זמינים כרגע."}

אם אין לך מספיק מידע, אמור זאת בכנות.`
          },
          {
            role: "user",
            content: input.question
          }
        ]
      });
      
      const answer = response.choices[0]?.message?.content || "מצטער, לא הצלחתי למצוא תשובה מתאימה.";
      
      // Save conversation if db available
      const conversationId = input.conversationId || `conv_${Date.now()}`;
      if (db) {
        await db.insert(ragConversations).values({
          conversationId,
          question: input.question,
          answer,
          sourcesUsed: JSON.stringify(relevantContent.map(c => c.id)),
        });
      }
      
      return {
        answer,
        conversationId,
        sources: relevantContent.map(c => ({
          id: c.id,
          section: c.sectionNumber,
          preview: c.hebrewText?.substring(0, 100) + "..."
        }))
      };
    }),

  // Chat endpoint for RAG chatbot
  chat: publicProcedure
    .input(z.object({
      question: z.string().min(1).max(1000),
      conversationHistory: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string()
      })).optional().default([]),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      
      // Search for relevant content based on keywords
      let relevantContent: any[] = [];
      if (db) {
        const keywords = input.question.split(" ").filter(w => w.length > 2).slice(0, 3);
        for (const keyword of keywords) {
          const results = await db.select()
            .from(chofetzChaimContent)
            .where(like(chofetzChaimContent.hebrewText, `%${keyword}%`))
            .limit(3);
          relevantContent.push(...results);
        }
        // Remove duplicates
        relevantContent = relevantContent.filter((v, i, a) => 
          a.findIndex(t => t.id === v.id) === i
        ).slice(0, 5);
      }
      
      // Build context from relevant content
      const context = relevantContent.length > 0
        ? relevantContent.map(c => `${c.hebrewText}\n${c.englishTranslation || ""}`).join("\n\n---\n\n")
        : "";
      
      // Build conversation history
      const historyMessages = input.conversationHistory.map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content
      }));
      
      // Call LLM for answer
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `אתה מומחה להלכות לשון הרע ושמירת הלשון לפי ספרי החפץ חיים.
תפקידך לענות על שאלות בנושא לשון הרע, רכילות ושמירת הלשון.
ענה בעברית, בצורה ברורה, מכבדת ומפורטת.
כשרלוונטי, ציין מקורות מספרי החפץ חיים.
אם אינך בטוח בתשובה, אמור זאת בכנות.

${context ? `מקורות רלוונטיים:\n${context}` : ""}`
          },
          ...historyMessages,
          {
            role: "user",
            content: input.question
          }
        ]
      });
      
      const answer = response.choices[0]?.message?.content || "מצטער, לא הצלחתי למצוא תשובה מתאימה. אנא נסה לנסח את השאלה אחרת.";
      
      return {
        answer,
        sources: relevantContent.map(c => ({
          id: c.id,
          section: c.sectionNumber,
          preview: c.hebrewText?.substring(0, 100) + "..."
        }))
      };
    }),

  // Admin: Create content
  createContent: protectedProcedure
    .input(z.object({
      topicId: z.number(),
      sectionNumber: z.string(),
      hebrewText: z.string(),
      englishTranslation: z.string().optional(),
      summary: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const result = await db.insert(chofetzChaimContent).values(input);
      return { success: true, id: result[0].insertId };
    }),

  // Admin: Create topic
  createTopic: protectedProcedure
    .input(z.object({
      name: z.string(),
      hebrewName: z.string(),
      description: z.string().optional(),
      sortOrder: z.number().default(0),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const result = await db.insert(chofetzChaimTopics).values(input);
      return { success: true, id: result[0].insertId };
    }),
});
