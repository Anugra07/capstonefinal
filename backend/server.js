import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import spacesRoutes from './routes/spaces.js';
import journalRoutes from './routes/journal.js';
import tasksRoutes from './routes/tasks.js';
import messagesRoutes from './routes/messages.js';
import documentsRoutes from './routes/documents.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// CORS: explicitly allow Vercel domains and handle preflight
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://capstonefinal-lilac.vercel.app',
  'https://capstonefinal-egpquqn9x-anugra07s-projects.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow no-origin (e.g., curl, server-to-server) and any whitelisted origins
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/spaces', spacesRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
