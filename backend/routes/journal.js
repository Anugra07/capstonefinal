import express from 'express';
import { PrismaClient } from '@prisma/client';
import { storeEmbedding } from '../utils/ai.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get entries for a space with pagination
router.get('/:spaceId', async (req, res) => {
    const { spaceId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        // Get total count for pagination metadata
        const total = await prisma.journalEntry.count({
            where: { spaceId }
        });

        const entries = await prisma.journalEntry.findMany({
            where: { spaceId },
            orderBy: { createdAt: 'desc' },
            include: { user: true },
            skip,
            take: limit
        });

        res.json({
            data: entries,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        });
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

        // Store embedding asynchronously
        storeEmbedding('JOURNAL', entry.id, `${title}\n${content}`, spaceId);

        res.json(entry);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create journal entry' });
    }
});

// Update journal entry
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        const entry = await prisma.journalEntry.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(content && { content })
            }
        });

        // Update embedding if title or content changed
        if (title || content) {
            const updatedContent = `${entry.title}\n${entry.content}`;
            // Delete old embedding and create new one
            await prisma.embedding.deleteMany({
                where: { sourceId: id, type: 'JOURNAL' }
            });
            storeEmbedding('JOURNAL', entry.id, updatedContent, entry.spaceId);
        }

        res.json(entry);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update journal entry' });
    }
});

// Delete entry
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Delete associated embedding first
        await prisma.embedding.deleteMany({
            where: { sourceId: id, type: 'JOURNAL' }
        });

        // Delete the journal entry
        await prisma.journalEntry.delete({
            where: { id }
        });

        res.json({ message: 'Journal entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete journal entry' });
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
