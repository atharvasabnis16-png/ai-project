import express from 'express';
import { createTeam, joinTeam, getMyTeam, leaveTeam, getTeam, getTeamStats } from '../controllers/teamController.js';
import auth from '../middleware/auth.js';
import Team from '../models/Team.js';

const router = express.Router();

router.use(auth); // Protect all team routes

router.post('/create', createTeam);
router.post('/join', joinTeam);
router.get('/my-team', getMyTeam);
router.post('/leave', leaveTeam);
router.get('/:id', getTeam);
router.get('/:id/stats', getTeamStats);

// Temporary cleanup route to drop old inviteCode index
router.delete('/fix-indexes', async (req, res) => {
  try {
    await Team.collection.dropIndex('inviteCode_1');
    res.json({ success: true, message: 'Index dropped' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

export default router;
