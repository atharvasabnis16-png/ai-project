import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/auth.js';
import teamRoutes from './routes/teams.js';
import taskRoutes from './routes/tasks.js';
import workspaceRoutes from './routes/workspace.js';
import meetingRoutes from './routes/meetings.js';
import aiRoutes from './routes/ai.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Initialize express
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://ai-project-wheat-eta.vercel.app'
  ],
  credentials: true
}));
app.use(helmet({
    contentSecurityPolicy: false // Disable CSP for easier development
}));
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/workspace', workspaceRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/ai', aiRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'AI-Powered Collaborative Project Intelligence API' });
});

// Error Handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🤖 AI Mode: ${process.env.USE_MOCK_AI === 'true' ? 'MOCK' : 'REAL (Claude)'}`);
});
