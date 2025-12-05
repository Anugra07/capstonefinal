import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize the embedding model
const embeddingModel = genAI.getGenerativeModel({ model: "models/text-embedding-004" });

/**
 * Generate an embedding vector for a given text using Gemini
 * @param {string} text 
 * @returns {Promise<number[]>}
 */
export async function generateEmbedding(text) {
    try {
        const result = await embeddingModel.embedContent(text);
        const embedding = result.embedding;
        return embedding.values;
    } catch (error) {
        console.error("Error generating embedding:", error);
        return null;
    }
}

/**
 * Store an embedding in the database
 * @param {string} type - "CHAT", "JOURNAL", "DOC", "TASK"
 * @param {string} sourceId - ID of the source item
 * @param {string} content - Text content
 * @param {string} spaceId - Space ID
 */
export async function storeEmbedding(type, sourceId, content, spaceId) {
    try {
        const vector = await generateEmbedding(content);
        if (!vector) return;

        // Use raw query to insert vector data since Prisma doesn't fully support vector type yet
        await prisma.$executeRaw`
      INSERT INTO "Embedding" (id, content, vector, type, "sourceId", "spaceId", "createdAt")
      VALUES (gen_random_uuid(), ${content}, ${vector}::vector, ${type}, ${sourceId}, ${spaceId}, NOW())
    `;

        console.log(`Stored embedding for ${type} ${sourceId}`);
    } catch (error) {
        console.error("Error storing embedding:", error);
    }
}

/**
 * Search for relevant context using vector similarity
 * @param {string} query - User query
 * @param {string} spaceId - Space ID
 * @param {number} limit - Number of results to return
 * @returns {Promise<Array>}
 */
export async function searchContext(query, spaceId, limit = 10) {
    try {
        const vector = await generateEmbedding(query);
        if (!vector) return [];

        // Use raw query to find nearest neighbors using cosine distance (<=>)
        // Get more results to ensure we have diverse data types
        const results = await prisma.$queryRaw`
      SELECT id, content, type, "createdAt"
      FROM "Embedding"
      WHERE "spaceId" = ${spaceId}
      ORDER BY vector <=> ${vector}::vector
      LIMIT ${limit}
    `;

        return results;
    } catch (error) {
        console.error("Error searching context:", error);
        return [];
    }
}

export { genAI };
