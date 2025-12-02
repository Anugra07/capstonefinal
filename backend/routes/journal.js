import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get entries for a space
router.get('/:spaceId', async (req, res) => {
    const { spaceId } = req.params;
    try {
        const entries = await prisma.journalEntry.findMany({
            where: { spaceId },
            orderBy: { createdAt: 'desc' },
            include: { user: true }
        });
        res.json(entries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create entry
router.post('/', async (req, res) => {
    const { spaceId, userId, title, content } = req.body;
    try {
        const entry = await prisma.journalEntry.create({
            data: {
                spaceId,
                userId,
                title,
                content
            }
        });
        res.json(entry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mock AI Analysis
router.post('/analyze', async (req, res) => {
    const { entryId } = req.body;
    // In a real app, this would call OpenAI
    res.json({
        summary: "This entry shows good progress on validation.",
        sentiment: "Positive",
        nextSteps: ["Schedule 5 more interviews", "Refine value prop"]
    });
});

export default router;
