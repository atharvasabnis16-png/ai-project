import express from 'express';
import { getMeetings, createMeeting, analyzeMeeting } from '../controllers/meetingController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth); // Protect all meeting routes

router.get('/', getMeetings);
router.post('/', createMeeting);
router.post('/:id/analyze', analyzeMeeting);

export default router;
