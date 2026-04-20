import express from 'express';
import { createTeam, joinTeam, getTeam, getTeamStats } from '../controllers/teamController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth); // Protect all team routes

router.post('/', createTeam);
router.post('/join', joinTeam);
router.get('/:id', getTeam);
router.get('/:id/stats', getTeamStats);

export default router;
