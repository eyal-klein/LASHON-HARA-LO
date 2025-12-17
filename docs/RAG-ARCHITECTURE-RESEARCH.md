# RAG Architecture Research - Chofetz Chaim Chatbot

**Date**: December 16, 2024  
**Purpose**: Choose best RAG architecture for our stack (Node.js 22, tRPC, Drizzle, Manus LLM)

---

## Executive Summary

After researching RAG best practices, I recommend a **simple, production-ready approach** that leverages our existing stack without adding complex dependencies:

**Recommended Architecture**:
- ✅ **Embeddings**: Manus LLM API (already available, no setup needed)
- ✅ **Storage**: MySQL JSON column (no separate vector DB needed)
- ✅ **Search**: Cosine similarity in JavaScript (simple, fast)
- ✅ **Chunking**: Semantic (by כלל + סעיף)
- ✅ **Context**: Top 3-5 relevant chunks

**Why this approach?**
1. **Zero additional infrastructure** - uses what we have
2. **Fast development** - 1-2 days vs 1-2 weeks
3. **Good enough accuracy** - for ~200 chunks, in-memory search is fine
4. **Easy to upgrade** - can add pgvector later if needed

---

## 1. RAG Architecture Options

### Option A: Simple RAG (Recommended ⭐)

```
User Query
    ↓
Generate Embedding (Manus LLM)
    ↓
Cosine Similarity Search (in MySQL or JS)
    ↓
Retrieve Top 3-5 Chunks
    ↓
Build Prompt with Context
    ↓
LLM Response (Manus LLM)
```

**Pros**:
- Simple to implement (1-2 days)
- No external dependencies
- Fast for small datasets (<10K chunks)
- Easy to debug and maintain

**Cons**:
- Not optimal for huge datasets (>100K chunks)
- No advanced features (hybrid search, reranking)

**Best for**: Our use case (Chofetz Chaim ~200-500 chunks)

---

### Option B: Vector Database RAG

```
User Query
    ↓
Generate Embedding
    ↓
Vector DB Search (pgvector/AlloyDB)
    ↓
Retrieve + Rerank
    ↓
LLM Response
```

**Pros**:
- Scales to millions of chunks
- Advanced search (hybrid, filters)
- Production-grade

**Cons**:
- Requires AlloyDB or pgvector setup
- More complex (3-5 days)
- Overkill for small datasets

**Best for**: Large-scale applications (>10K chunks)

---

### Option C: LangChain RAG

```
LangChain
    ↓
Document Loaders
    ↓
Text Splitters
    ↓
Vector Store
    ↓
Retrieval Chain
```

**Pros**:
- Batteries included
- Many integrations

**Cons**:
- Heavy dependency (~50MB)
- Black box behavior
- Harder to customize

**Not recommended**: We want full control

---

## 2. Embedding Strategy

### Manus LLM API (Recommended ⭐)

```typescript
import { invokeLLM } from './server/_core/llm';

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await invokeLLM({
    model: 'text-embedding-3-small', // or whatever Manus supports
    input: text,
  });
  
  return response.data[0].embedding; // 1536-dimensional vector
}
```

**Pros**:
- Already available (no setup)
- Free (included in Manus)
- Fast (API call)

**Cons**:
- Requires internet (not offline)

---

### Alternative: Vertex AI Embeddings

**Pros**:
- Google Cloud native
- Scalable

**Cons**:
- Requires GCP setup
- Costs money (~$0.0001/1K tokens)
- More complex

**Not recommended**: Manus LLM is simpler

---

## 3. Storage Strategy

### Option A: MySQL JSON Column (Recommended ⭐)

```typescript
export const chofetzChaimContent = mysqlTable("chofetz_chaim_content", {
  id: int("id").primaryKey(),
  content: text("content"),
  embedding: json("embedding").$type<number[]>(), // Store as JSON array
});
```

**Search**:
```typescript
// Load all embeddings into memory (fast for <10K)
const allContent = await db.select().from(chofetzChaimContent);

// Compute cosine similarity in JS
const results = allContent
  .map(item => ({
    ...item,
    score: cosineSimilarity(queryEmbedding, item.embedding),
  }))
  .sort((a, b) => b.score - a.score)
  .slice(0, 5);
```

**Pros**:
- No additional infrastructure
- Fast for small datasets
- Easy to implement

**Cons**:
- Loads all data into memory
- Not optimal for >10K chunks

**Best for**: Our use case (~200-500 chunks)

---

### Option B: pgvector Extension

```sql
CREATE EXTENSION vector;

CREATE TABLE chofetz_chaim_content (
  id SERIAL PRIMARY KEY,
  content TEXT,
  embedding vector(1536)
);

CREATE INDEX ON chofetz_chaim_content USING ivfflat (embedding vector_cosine_ops);
```

**Search**:
```sql
SELECT * FROM chofetz_chaim_content
ORDER BY embedding <=> $1
LIMIT 5;
```

**Pros**:
- Optimized for vector search
- Scales to millions

**Cons**:
- Requires PostgreSQL (we use MySQL)
- Or requires AlloyDB (expensive)

**Not recommended**: Overkill for our scale

---

## 4. Chunking Strategy

### Semantic Chunking (Recommended ⭐)

**Strategy**: Chunk by natural boundaries (כלל + סעיף)

```typescript
interface Chunk {
  id: string;
  book: 'chofetz_chaim' | 'shmirat_halashon';
  section: 'lashon_hara' | 'rechilut';
  klal: number;        // 1-10
  seif: number;        // 1-20
  content: string;     // Full text of this seif
  embedding: number[]; // 1536-dim vector
}
```

**Example**:
- Chunk 1: כלל א' סעיף א' (full text)
- Chunk 2: כלל א' סעיף ב' (full text)
- Chunk 3: כלל א' באר מים חיים סעיף א' (commentary)

**Pros**:
- Preserves semantic meaning
- Natural boundaries
- Easy to cite sources

**Cons**:
- Variable chunk sizes

**Best for**: Structured religious texts

---

### Fixed-Size Chunking

**Strategy**: Split by character count (e.g., 500 chars)

**Pros**:
- Uniform size
- Simple

**Cons**:
- Breaks semantic units
- Hard to cite sources

**Not recommended**: Loses structure

---

## 5. Context Window Strategy

### Top-K Retrieval (Recommended ⭐)

```typescript
const TOP_K = 5; // Retrieve top 5 most relevant chunks

const context = topChunks
  .map(chunk => `
[${chunk.klal}:${chunk.seif}]
${chunk.content}
  `)
  .join('\n\n');

const prompt = `
אתה מומחה להלכות לשון הרע על פי ספר חפץ חיים.
ענה על השאלה הבאה בהתבסס על המקורות שלהלן בלבד.
ציין תמיד את המקור (כלל, סעיף).

מקורות:
${context}

שאלה: ${userQuestion}

תשובה:
`;
```

**Pros**:
- Simple and effective
- Fits in context window
- Cites sources

**Cons**:
- May miss relevant chunks

**Best for**: Most use cases

---

### Hybrid Search

**Strategy**: Combine semantic + keyword search

**Pros**:
- More accurate

**Cons**:
- More complex

**Not recommended**: Simple is better for v1

---

## 6. Recommended Architecture

### Stack

```
Frontend (React)
    ↓
tRPC API
    ↓
Embedding Generation (Manus LLM)
    ↓
Cosine Similarity Search (JavaScript)
    ↓
Context Building
    ↓
LLM Response (Manus LLM)
    ↓
Stream to Frontend
```

### Database Schema

```typescript
export const chofetzChaimContent = mysqlTable("chofetz_chaim_content", {
  id: int("id").primaryKey(),
  book: mysqlEnum("book", ["chofetz_chaim", "shmirat_halashon"]),
  section: mysqlEnum("section", ["lashon_hara", "rechilut"]),
  klal: int("klal"),
  seif: int("seif"),
  title: varchar("title", { length: 300 }),
  content: text("content"),
  embedding: json("embedding").$type<number[]>(),
  createdAt: timestamp("createdAt").defaultNow(),
});
```

### Cosine Similarity Function

```typescript
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}
```

### RAG Endpoint

```typescript
export const chofetzChaimRouter = router({
  ask: publicProcedure
    .input(z.object({
      question: z.string(),
      conversationId: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      // 1. Generate embedding for question
      const questionEmbedding = await generateEmbedding(input.question);
      
      // 2. Search for relevant chunks
      const allContent = await db.select().from(chofetzChaimContent);
      const topChunks = allContent
        .map(chunk => ({
          ...chunk,
          score: cosineSimilarity(questionEmbedding, chunk.embedding),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
      
      // 3. Build context
      const context = topChunks
        .map(c => `[כלל ${c.klal} סעיף ${c.seif}]\n${c.content}`)
        .join('\n\n');
      
      // 4. Generate response
      const response = await invokeLLM({
        messages: [
          {
            role: 'system',
            content: 'אתה מומחה להלכות לשון הרע על פי ספר חפץ חיים...',
          },
          {
            role: 'user',
            content: `מקורות:\n${context}\n\nשאלה: ${input.question}`,
          },
        ],
      });
      
      return {
        answer: response.choices[0].message.content,
        sources: topChunks.map(c => ({
          klal: c.klal,
          seif: c.seif,
          title: c.title,
        })),
      };
    }),
});
```

---

## 7. Implementation Plan

### Day 1: Scraping & Parsing (4-6 hours)
1. ✅ Scrape Wikisource using MediaWiki API
2. ✅ Parse HTML structure (כללים, סעיפים)
3. ✅ Extract clean text
4. ✅ Save to JSON files

### Day 2: Database Population (3-4 hours)
1. ✅ Populate chofetz_chaim_content table
2. ✅ Generate embeddings for all chunks
3. ✅ Store embeddings in JSON column
4. ✅ Verify data integrity

### Day 3: RAG Implementation (4-6 hours)
1. ✅ Implement cosine similarity function
2. ✅ Build RAG endpoint
3. ✅ Test with sample questions
4. ✅ Optimize performance

### Day 4: UI & Testing (3-4 hours)
1. ✅ Build chat UI component
2. ✅ Add streaming support
3. ✅ Write tests
4. ✅ Deploy to production

**Total**: 14-20 hours (2-3 days)

---

## 8. Cost Estimation

### Embeddings Generation (One-time)
- ~500 chunks × 200 tokens/chunk = 100K tokens
- Cost: Free (Manus LLM)

### Query Embeddings (Ongoing)
- ~100 queries/day × 20 tokens/query = 2K tokens/day
- Cost: Free (Manus LLM)

### LLM Responses (Ongoing)
- ~100 queries/day × 500 tokens/response = 50K tokens/day
- Cost: Free (Manus LLM)

**Total Monthly Cost**: $0 (using Manus LLM)

---

## 9. Performance Expectations

### Search Speed
- In-memory cosine similarity: **<50ms** for 500 chunks
- Embedding generation: **~200ms** per query
- LLM response: **~2-5s** per query

**Total latency**: **~3-6s** per query (acceptable for chatbot)

### Accuracy
- Expected: **80-90%** relevant chunks in top-5
- Good enough for v1, can improve with:
  - Better chunking
  - Reranking
  - Hybrid search

---

## 10. Future Improvements (v2)

If we need better performance/accuracy:

1. **Add pgvector** (if we migrate to PostgreSQL)
2. **Hybrid search** (semantic + keyword)
3. **Reranking** (use LLM to rerank top-20 → top-5)
4. **Fine-tuned embeddings** (train on Chofetz Chaim)
5. **Conversation memory** (remember previous questions)

---

## Conclusion

**Recommended Approach**: Simple RAG with Manus LLM

**Why**:
- ✅ Fast to implement (2-3 days)
- ✅ Zero additional cost
- ✅ Good enough accuracy
- ✅ Easy to maintain
- ✅ Can upgrade later if needed

**Next Steps**:
1. Scrape Wikisource content
2. Populate database with embeddings
3. Build RAG endpoint
4. Test and deploy

Let's build it! 🚀
