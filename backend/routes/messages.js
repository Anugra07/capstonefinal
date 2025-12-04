import express from 'express';
import { PrismaClient } from '@prisma/client';

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
            include: { user: { select: { id: true, name: true, email: true } } }
        });
        res.json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
