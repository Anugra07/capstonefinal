# How RAG (Retrieval Augmented Generation) and Chat Work

## 🧠 RAG System Overview

Your application uses **RAG (Retrieval Augmented Generation)** to give the AI Co-founder access to all your team's data. Here's how it works:

### 1. **Data Ingestion & Embedding Storage** 📥

When data is created in your app, it's automatically converted into **vector embeddings** and stored:

#### **When Embeddings Are Created:**

1. **Chat Messages** (`backend/routes/messages.js`)
   - When a user sends a message → Content is stored as embedding
   - Type: `CHAT`
   - Content: The message text

2. **Journal Entries** (`backend/routes/journal.js`)
   - When a journal entry is created/updated → Title + content stored
   - Type: `JOURNAL`
   - Content: `"${title}\n${content}"`

3. **Documents** (`backend/routes/documents.js`)
   - When a document is uploaded/created/updated → Title + summary stored
   - Type: `DOC`
   - Content: `"Document: ${title}\nSummary: ${summary}"`

4. **Tasks** (`backend/routes/tasks.js`)
   - When a task is created/updated → Full task details stored
   - Type: `TASK`
   - Content: `"Task: ${title} | Category: ${category} | Description: ${description} | Status: ${status}"`

#### **How Embeddings Are Generated:**

```javascript
// backend/utils/ai.js
async function generateEmbedding(text) {
    // Uses Google Gemini's text-embedding-004 model
    // Converts text → 768-dimensional vector
    const result = await embeddingModel.embedContent(text);
    return result.embedding.values; // Returns array of 768 numbers
}
```

#### **How Embeddings Are Stored:**

```javascript
// Stored in PostgreSQL with pgvector extension
// Vector type: vector(768)
await prisma.$executeRaw`
    INSERT INTO "Embedding" (id, content, vector, type, "sourceId", "spaceId", "createdAt")
    VALUES (gen_random_uuid(), ${content}, ${vector}::vector, ${type}, ${sourceId}, ${spaceId}, NOW())
`;
```

---

### 2. **Context Retrieval (RAG Query)** 🔍

When a user asks a question in chat:

#### **Step 1: Query Embedding**
```javascript
// User query: "What tasks are pending?"
const queryVector = await generateEmbedding("What tasks are pending?");
```

#### **Step 2: Vector Similarity Search**
```sql
-- PostgreSQL pgvector cosine distance search
SELECT id, content, type, "createdAt"
FROM "Embedding"
WHERE "spaceId" = ${spaceId}
ORDER BY vector <=> ${queryVector}::vector  -- <=> is cosine distance operator
LIMIT 15  -- Get top 15 most similar results
```

This finds the **15 most semantically similar** pieces of data to the user's question.

#### **Step 3: Context Organization**
```javascript
// Groups results by type for better organization
const contextByType = {
    CHAT: [...],      // Relevant chat messages
    JOURNAL: [...],    // Relevant journal entries
    DOC: [...],       // Relevant documents
    TASK: [...]       // Relevant tasks
};
```

---

### 3. **AI Response Generation** 🤖

#### **Step 1: Build Context String**
```javascript
const contextText = `
TEAM CHAT MESSAGES:
  [12/04/2025] We discussed the MVP features...
  [12/05/2025] Need to finish authentication...

JOURNAL ENTRIES:
  [12/03/2025] Today we validated our idea...

DOCUMENTS:
  [12/01/2025] Document: Product Requirements...

TASKS:
  [12/05/2025] Task: Build login page | Status: TODO
`;
```

#### **Step 2: Create AI Prompt**
```javascript
const prompt = `
You are the AI Co-founder for a startup.
You have COMPLETE ACCESS to all team data including:
- Team chat messages
- Journal entries
- Documents
- Tasks

CONTEXT FROM TEAM DATA:
${contextText}

USER QUERY:
${query}

INSTRUCTIONS:
- Use the provided context to answer accurately
- Reference specific data types when relevant
- Be encouraging, professional, and concise
- Suggest actionable next steps
`;
```

#### **Step 3: Generate Response**
```javascript
// Uses Gemini 2.0 Flash model
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const result = await model.generateContent(prompt);
const answer = result.response.text();
```

---

## 💬 Chat Flow Diagram

```
User Types Question
        ↓
Frontend: CoFounderChat.jsx
        ↓
POST /api/ai/chat
{ spaceId, query }
        ↓
Backend: routes/ai.js
        ↓
┌─────────────────────────────────────┐
│  1. Generate query embedding        │
│  2. Search similar vectors (RAG)     │
│  3. Group context by type           │
│  4. Format context for prompt       │
│  5. Call Gemini API                  │
│  6. Return answer + context         │
└─────────────────────────────────────┘
        ↓
Frontend displays answer
+ Shows context sources used
```

---

## 🔑 Key Features

### **1. Semantic Search**
- Uses **cosine similarity** (not keyword matching)
- Finds conceptually similar content, even with different words
- Example: Query "pending work" finds tasks with status "TODO"

### **2. Multi-Type Context**
- Retrieves from **4 data types** simultaneously
- Ensures comprehensive answers
- Groups results for better organization

### **3. Space-Scoped**
- All embeddings are **space-specific**
- AI only sees data from the current space
- Privacy and context isolation

### **4. Real-Time Updates**
- New data automatically creates embeddings
- AI has access to latest information
- No manual indexing needed

---

## 📊 Database Schema

```prisma
model Embedding {
  id        String   @id @default(uuid())
  content   String                    // Original text content
  vector    Unsupported("vector(768)") // 768-dimensional vector
  type      String                     // "CHAT", "JOURNAL", "DOC", "TASK"
  sourceId  String                     // ID of original item
  spaceId   String                     // Space context
  createdAt DateTime @default(now())
}
```

---

## 🎯 Example Flow

### **User Creates Task:**
```
1. User creates task: "Build login page"
2. Backend stores task in database
3. storeEmbedding() called:
   - Content: "Task: Build login page | Status: TODO"
   - Generates 768-dim vector
   - Stores in Embedding table
```

### **User Asks Question:**
```
1. User: "What tasks do we have?"
2. System generates embedding for query
3. Searches for similar vectors
4. Finds: "Task: Build login page | Status: TODO"
5. Includes in context
6. AI responds: "You have 1 task: 'Build login page' (Status: TODO)"
```

---

## 🚀 Performance Optimizations

1. **Limit Results**: Retrieves top 15 most relevant (not all data)
2. **Async Embedding**: Embedding storage doesn't block API responses
3. **Vector Indexing**: PostgreSQL pgvector extension optimizes similarity search
4. **Type Grouping**: Organizes context efficiently for AI processing

---

## 🔧 Configuration

- **Embedding Model**: `text-embedding-004` (Google Gemini)
- **LLM Model**: `gemini-2.0-flash` (Google Gemini)
- **Vector Dimension**: 768
- **Context Limit**: 15 results
- **Database**: PostgreSQL with pgvector extension

---

## ✅ Current Status

✅ **Working:**
- Embedding generation and storage
- Vector similarity search
- Multi-type context retrieval
- AI chat with RAG
- Real-time data ingestion

✅ **Data Types Supported:**
- Chat messages
- Journal entries
- Documents
- Tasks

---

## 🐛 Debugging

To see what context is being retrieved:
- Check `data.context` in chat response
- Frontend displays first 3 context sources
- Backend logs embedding storage: `"Stored embedding for TYPE sourceId"`

