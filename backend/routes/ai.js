import express from 'express';
import { searchContext, genAI } from '../utils/ai.js';

const router = express.Router();

// Chat with AI Co-founder
router.post('/chat', async (req, res) => {
    const { spaceId, query } = req.body;

    if (!spaceId || !query) {
        return res.status(400).json({ error: 'Missing spaceId or query' });
    }

    try {
        // 1. Search for relevant context
        const contextResults = await searchContext(query, spaceId);

        // Format context for the prompt
        const contextText = contextResults.map(item => {
            const date = new Date(item.createdAt).toLocaleDateString();
            return `[${item.type} - ${date}]: ${item.content}`;
        }).join('\n\n');

        // 2. Construct the prompt
        const prompt = `
You are the AI Co-founder for a startup. Your role is to provide strategic advice, track progress, and help the founders grow.
You have access to the team's history (chats, journals, documents).

CONTEXT FROM TEAM HISTORY:
${contextText}

USER QUERY:
${query}

INSTRUCTIONS:
- Use the provided context to answer the user's query accurately.
- If the context doesn't contain the answer, use your general startup knowledge but mention that you don't have specific data on it.
- Be encouraging, professional, and concise.
- Suggest actionable next steps if appropriate.
`;

        // 3. Call Gemini Model
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        res.json({ answer: text, context: contextResults });
    } catch (error) {
        console.error('AI Chat Error:', error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
});

export default router;
