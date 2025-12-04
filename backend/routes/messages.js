import express from 'express';
import { PrismaClient } from '@prisma/client';
import { storeEmbedding } from '../utils/ai.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get messages for a space
router.get('/:spaceId', async (req, res) => {
    const { spaceId } = req.params;
    try {
        const messages = await prisma.message.findMany({
            where: { spaceId },
            orderBy: { createdAt: 'asc' },
            include: { user: { select: { id: true, name: true, email: true } } }
        });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create message
router.post('/', async (req, res) => {
    const { spaceId, userId, content } = req.body;
    try {
        const message = await prisma.message.create({
            data: { spaceId, userId, content },
            include: { user: { select: { name: true, email: true } } }
        });

        // Store embedding asynchronously
        storeEmbedding('CHAT', message.id, content, spaceId);

        res.json(message);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create message' });
    }
});

// Delete message
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Delete associated embedding first
        await prisma.embedding.deleteMany({
            where: { sourceId: id, type: 'CHAT' }
        });

        // Delete the message
        await prisma.message.delete({
            where: { id }
        });

        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete message' });
    }
});

export default router;
