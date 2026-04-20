import express from 'express';
import { generateResearch, generatePPT, summarizeNotes, extractActionPoints, clusterIdeas } from '../controllers/aiController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth); // Protect all AI assistant routes

router.post('/research', generateResearch);
router.post('/ppt', generatePPT);
router.post('/summarize', summarizeNotes);
router.post('/action-points', extractActionPoints);
router.post('/cluster', clusterIdeas);

export default router;
