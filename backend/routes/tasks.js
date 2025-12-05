import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get tasks for a space with pagination
router.get('/:spaceId', async (req, res) => {
    const { spaceId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    try {
        // Get total count for pagination metadata
        const total = await prisma.task.count({
            where: { spaceId }
        });

        const tasks = await prisma.task.findMany({
            where: { spaceId },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        });

        res.json({
            data: tasks,
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

// Update task status
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { status, title, category } = req.body;
    try {
        const task = await prisma.task.update({
            where: { id },
            data: {
                ...(status && { status }),
                ...(title && { title }),
                ...(category && { category })
            }
        });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
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
