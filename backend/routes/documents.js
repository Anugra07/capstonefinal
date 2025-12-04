import express from 'express';
import { PrismaClient } from '@prisma/client';
import { storeEmbedding } from '../utils/ai.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get documents for a space
router.get('/:spaceId', async (req, res) => {
    const { spaceId } = req.params;
    try {
        const documents = await prisma.document.findMany({
            where: { spaceId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch documents' });
    }
});

// Create a new document (Mock upload)
router.post('/', async (req, res) => {
    const { spaceId, title, url, summary } = req.body;

    try {
        const document = await prisma.document.create({
            data: {
                spaceId,
                title,
                url,
                summary
            }
        });

        // Store embedding asynchronously
        // We embed the title and summary for context
        storeEmbedding('DOC', document.id, `Document: ${title}\nSummary: ${summary}`, spaceId);

        res.json(document);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create document' });
    }
});

// Delete document
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Delete associated embedding first
        await prisma.embedding.deleteMany({
            where: { sourceId: id, type: 'DOC' }
        });

        // Delete the document
        await prisma.document.delete({
            where: { id }
        });

        res.json({ message: 'Document deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete document' });
    }
});

export default router;
