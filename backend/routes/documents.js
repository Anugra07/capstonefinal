import express from 'express';
import { PrismaClient } from '@prisma/client';
import { storeEmbedding } from '../utils/ai.js';
import multer from 'multer';
import fs from 'fs/promises';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParseModule = require('pdf-parse');

// pdf-parse v2.4.5: PDFParse is a class
// Create a wrapper function that uses the class properly
const pdfParse = async (buffer, options = {}) => {
    // Create instance with the buffer
    const instance = new pdfParseModule.PDFParse({ data: buffer, ...options });
    // Call getText() method to extract text
    const textResult = await instance.getText();
    // Return in the format expected by the rest of the code
    return {
        text: textResult.text || '',
        numpages: textResult.total || 0,
        info: null,
        metadata: null
    };
};

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for file uploads
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        console.log('File filter - mimetype:', file.mimetype);
        console.log('File filter - originalname:', file.originalname);
        // Accept PDF files by MIME type or extension
        if (file.mimetype === 'application/pdf' || 
            file.mimetype === 'application/x-pdf' ||
            file.originalname.toLowerCase().endsWith('.pdf')) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed. Received: ' + file.mimetype));
        }
    }
});

// Get documents for a space with pagination
router.get('/:spaceId', async (req, res) => {
    const { spaceId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        // Get total count for pagination metadata
        const total = await prisma.document.count({
            where: { spaceId }
        });

        const documents = await prisma.document.findMany({
            where: { spaceId },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        });

        res.json({
            data: documents,
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
        res.status(500).json({ error: 'Failed to fetch documents' });
    }
});

// Upload PDF and extract text
router.post('/upload', (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: 'File too large. Maximum size is 10MB' });
            }
            return res.status(400).json({ error: 'Upload error: ' + err.message });
        }
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
}, async (req, res) => {
    try {
        console.log('Upload request received');
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
        
        if (!req.file) {
            console.error('No file in request');
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { spaceId } = req.body;
        console.log('SpaceId from body:', spaceId);
        
        if (!spaceId) {
            return res.status(400).json({ error: 'spaceId is required' });
        }

        // Read the uploaded PDF file
        const dataBuffer = await fs.readFile(req.file.path);

        // Extract text from PDF
        const pdfData = await pdfParse(dataBuffer);
        const extractedText = pdfData.text;

        // Clean up: delete the temporary file
        await fs.unlink(req.file.path);

        // Create document with extracted text
        const document = await prisma.document.create({
            data: {
                spaceId,
                title: req.file.originalname,
                summary: extractedText.substring(0, 5000) // Limit to 5000 chars for DB
            }
        });

        // Store embedding with extracted text
        const embeddingContent = `Document: ${req.file.originalname}\n\nContent:\n${extractedText.substring(0, 3000)}`;
        storeEmbedding('DOC', document.id, embeddingContent, spaceId);

        res.json({
            ...document,
            extractedLength: extractedText.length,
            message: 'PDF uploaded and text extracted successfully'
        });
    } catch (error) {
        console.error('PDF upload error:', error);
        console.error('Error stack:', error.stack);
        // Clean up file if it exists
        if (req.file?.path) {
            try {
                await fs.unlink(req.file.path);
            } catch (e) {
                // Ignore cleanup errors
            }
        }
        res.status(500).json({ 
            error: 'Failed to process PDF: ' + error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
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

// Update document
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, summary, url } = req.body;
    try {
        const document = await prisma.document.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(summary && { summary }),
                ...(url !== undefined && { url })
            }
        });

        // Update embedding if title or summary changed
        if (title || summary) {
            const updatedContent = `Document: ${document.title}\nSummary: ${document.summary || ''}`;
            // Delete old embedding and create new one
            await prisma.embedding.deleteMany({
                where: { sourceId: id, type: 'DOC' }
            });
            storeEmbedding('DOC', document.id, updatedContent, document.spaceId);
        }

        res.json(document);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update document' });
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
