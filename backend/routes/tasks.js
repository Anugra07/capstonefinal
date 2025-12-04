import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get tasks for a space
router.get('/:spaceId', async (req, res) => {
    const { spaceId } = req.params;
    try {
        const tasks = await prisma.task.findMany({
            where: { spaceId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create task
router.post('/', async (req, res) => {
    const { spaceId, title, category, userId } = req.body;
    try {
        const task = await prisma.task.create({
            data: {
                spaceId,
                title,
                category,
                userId,
                status: 'TODO'
            }
        });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete task
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.task.delete({
            where: { id }
        });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

// Mock AI Generate Tasks
router.post('/generate', async (req, res) => {
    const { spaceId } = req.body;
    // Mock AI generation
    const newTasks = [
        { title: "Conduct 5 user interviews", category: "Validation" },
        { title: "Define MVP scope", category: "Product" }
    ];

    // Ideally we would save these to DB here or return them for user approval
    res.json(newTasks);
});

export default router;
