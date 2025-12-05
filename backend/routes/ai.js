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
        // 1. Search for relevant context - get more results for comprehensive access
        const contextResults = await searchContext(query, spaceId, 15);

        // Group context by type for better organization
        const contextByType = {
            CHAT: [],
            JOURNAL: [],
            DOC: [],
            TASK: []
        };

        contextResults.forEach(item => {
            if (contextByType[item.type]) {
                contextByType[item.type].push(item);
            }
        });

        // Format context for the prompt with better organization
        const formatContextSection = (type, items, label) => {
            if (items.length === 0) return '';
            return `\n${label}:\n${items.map(item => {
                const date = new Date(item.createdAt).toLocaleDateString();
                return `  [${date}] ${item.content}`;
            }).join('\n')}`;
        };

        const contextText = `
${formatContextSection('CHAT', contextByType.CHAT, 'TEAM CHAT MESSAGES')}
${formatContextSection('JOURNAL', contextByType.JOURNAL, 'JOURNAL ENTRIES')}
${formatContextSection('DOC', contextByType.DOC, 'DOCUMENTS')}
${formatContextSection('TASK', contextByType.TASK, 'TASKS')}
`.trim();

        // 2. Construct the prompt
        const prompt = `
You are the AI Co-founder for a startup. Your role is to provide strategic advice, track progress, and help the founders grow.
You have COMPLETE ACCESS to all team data including:
- Team chat messages (real-time discussions and conversations)
- Journal entries (founder reflections, updates, and thoughts)
- Documents (plans, research, notes, summaries)
- Tasks (to-do items, milestones, progress tracking with status, categories, and descriptions)

CONTEXT FROM TEAM DATA:
${contextText || 'No specific context found, but you have access to all team data.'}

USER QUERY:
${query}

INSTRUCTIONS:
- Use the provided context to answer the user's query accurately and comprehensively.
- Reference specific data types (chat messages, journal entries, documents, tasks) when relevant.
- If the context doesn't contain the answer, use your general startup knowledge but mention that you don't have specific data on it.
- Be encouraging, professional, and concise.
- Suggest actionable next steps if appropriate.
- When discussing tasks, mention their status (TODO, IN_PROGRESS, DONE) and categories.
- When discussing journal entries, reference the dates and key insights.
- When discussing documents, reference their titles and summaries.
- When discussing chat messages, reference the conversations and key points discussed.
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
