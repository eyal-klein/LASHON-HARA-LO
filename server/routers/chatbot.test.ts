import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "../routers";
import type { Context } from "../_core/context";

// Helper to create test context
const createPublicContext = (): Context => ({
  user: null,
  req: {} as any,
  res: {} as any,
});

describe("chatbot router - E2E", () => {
  describe("Search functionality", () => {
    it("should search Chofetz Chaim content", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const results = await caller.chatbot.search({
        query: "לשון הרע",
        limit: 5,
      });

      expect(Array.isArray(results)).toBe(true);
      // Should find content about lashon hara
      if (results.length > 0) {
        expect(results[0]).toHaveProperty("content");
        expect(results[0]).toHaveProperty("klal");
      }
    });

    it("should limit search results", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const results = await caller.chatbot.search({
        query: "לשון",
        limit: 3,
      });

      expect(results.length).toBeLessThanOrEqual(3);
    });
  });

  describe("Ask functionality", () => {
    it("should answer question with LLM", { timeout: 30000 }, async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const response = await caller.chatbot.ask({
        question: "מה זה לשון הרע?",
      });

      expect(response).toHaveProperty("answer");
      expect(response).toHaveProperty("sources");
      expect(typeof response.answer).toBe("string");
      expect(response.answer.length).toBeGreaterThan(0);
      expect(Array.isArray(response.sources)).toBe(true);
    });

    it("should include conversation history", { timeout: 30000 }, async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const response = await caller.chatbot.ask({
        question: "ומה עם רכילות?",
        conversationHistory: [
          { role: "user", content: "מה זה לשון הרע?" },
          { role: "assistant", content: "לשון הרע היא דיבור שלילי על אדם אחר..." },
        ],
      });

      expect(response).toHaveProperty("answer");
      expect(response.answer.length).toBeGreaterThan(0);
    });

    it("should provide sources", { timeout: 30000 }, async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const response = await caller.chatbot.ask({
        question: "מה אסור לספר?",
      });

      expect(Array.isArray(response.sources)).toBe(true);
      if (response.sources.length > 0) {
        expect(response.sources[0]).toHaveProperty("klal");
        expect(response.sources[0]).toHaveProperty("content");
      }
    });
  });

  describe("Random quote", () => {
    it("should return random quote", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const quote = await caller.chatbot.randomQuote();

      if (quote) {
        expect(quote).toHaveProperty("content");
        expect(quote).toHaveProperty("klal");
      }
    });
  });

  describe("Statistics", () => {
    it("should return stats", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const stats = await caller.chatbot.stats();

      expect(stats).toHaveProperty("totalChunks");
      expect(stats).toHaveProperty("totalKlalim");
      expect(stats).toHaveProperty("lashonHaraKlalim");
      expect(stats).toHaveProperty("rechilusKlalim");
      expect(stats.lashonHaraKlalim).toBe(10);
      expect(stats.rechilusKlalim).toBe(9);
    });
  });
});
