import express from 'express';
import auth from '../middleware/auth.js';
import { 
  getMeetings, 
  scheduleMeeting,
  markAttendance
} from '../controllers/meetingController.js';

const router = express.Router();
router.use(auth);
router.get('/', getMeetings);
router.post('/schedule', scheduleMeeting);
router.put('/attendance', markAttendance);
export default router;
