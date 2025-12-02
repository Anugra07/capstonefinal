import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Create a new space
router.post('/', async (req, res) => {
    const { name, description, problemStatement, userId } = req.body;
    try {
        const space = await prisma.space.create({
            data: {
                name,
                description,
                problemStatement,
                members: {
                    create: {
                        userId,
                        role: 'OWNER'
                    }
                }
            }
        });
        res.json(space);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Join a space
router.post('/join', async (req, res) => {
    const { inviteToken, userId } = req.body;
    try {
        const space = await prisma.space.findUnique({
            where: { inviteToken }
        });

        if (!space) {
            return res.status(404).json({ error: 'Space not found' });
        }

        const member = await prisma.spaceMember.create({
            data: {
                userId,
                spaceId: space.id,
                role: 'MEMBER'
            }
        });

        res.json({ space, member });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get space details
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const space = await prisma.space.findUnique({
            where: { id },
            include: {
                members: { include: { user: true } },
                journalEntries: { take: 5, orderBy: { createdAt: 'desc' } },
                tasks: true,
                documents: true
            }
        });
        res.json(space);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
