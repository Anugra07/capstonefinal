import express from 'express';
import { PrismaClient } from '@prisma/client';
import { storeEmbedding } from '../utils/ai.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get messages for a space with pagination
router.get('/:spaceId', async (req, res) => {
    const { spaceId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    try {
        // Get total count for pagination metadata
        const total = await prisma.message.count({
            where: { spaceId }
        });

        const messages = await prisma.message.findMany({
            where: { spaceId },
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { id: true, name: true, email: true } } },
            skip,
            take: limit
        });

        res.json({
            data: messages,
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

// Create message
router.post('/', async (req, res) => {
    const { spaceId, userId, content } = req.body;
    try {
        if (!spaceId || !userId || !content) {
            return res.status(400).json({ error: 'spaceId, userId, and content are required' });
        }

        const message = await prisma.message.create({
            data: { spaceId, userId, content },
            include: { user: { select: { id: true, name: true, email: true } } }
        });

        // Store embedding asynchronously
        storeEmbedding('CHAT', message.id, content, spaceId);

        res.json(message);
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: 'Failed to create message: ' + error.message });
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
