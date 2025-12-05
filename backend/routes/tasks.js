import express from 'express';
import { PrismaClient } from '@prisma/client';
import { storeEmbedding } from '../utils/ai.js';

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
    const { spaceId, title, category, userId, description } = req.body;
    
    if (!spaceId || !title) {
        return res.status(400).json({ error: 'spaceId and title are required' });
    }
    
    try {
        const task = await prisma.task.create({
            data: {
                spaceId,
                title,
                category: category || null,
                userId: userId || null,
                description: description || null,
                status: 'TODO'
            }
        });

        // Store embedding asynchronously
        const taskContent = `Task: ${title}${category ? ` | Category: ${category}` : ''}${description ? ` | Description: ${description}` : ''} | Status: ${task.status}`;
        storeEmbedding('TASK', task.id, taskContent, spaceId);

        res.json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task: ' + error.message });
    }
});

// Update task status
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { status, title, category, description } = req.body;
    try {
        const task = await prisma.task.update({
            where: { id },
            data: {
                ...(status && { status }),
                ...(title && { title }),
                ...(category && { category }),
                ...(description && { description })
            }
        });

        // Update embedding if task content changed
        if (status || title || category || description) {
            const taskContent = `Task: ${task.title}${task.category ? ` | Category: ${task.category}` : ''}${task.description ? ` | Description: ${task.description}` : ''} | Status: ${task.status}`;
            // Delete old embedding and create new one
            await prisma.embedding.deleteMany({
                where: { sourceId: id, type: 'TASK' }
            });
            storeEmbedding('TASK', task.id, taskContent, task.spaceId);
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Delete task
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Delete associated embedding first
        await prisma.embedding.deleteMany({
            where: { sourceId: id, type: 'TASK' }
        });

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
