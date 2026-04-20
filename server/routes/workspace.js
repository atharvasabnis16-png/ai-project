import express from 'express';
import { getNotes, updateNotes, summarizeNotes, extractActionPoints, clusterIdeas } from '../controllers/workspaceController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth); // Protect all workspace routes

router.get('/notes', getNotes);
router.put('/notes', updateNotes);

export default router;
