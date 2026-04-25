import express from 'express';
import { getNotifications, markAsRead } from '../controllers/notificationController.js';
import auth from '../middleware/auth.js';

const router = express.Router();
router.use(auth);
router.get('/', getNotifications);
router.put('/read/:teamId', markAsRead);

export default router;
