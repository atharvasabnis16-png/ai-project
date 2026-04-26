import express from 'express';
import auth from '../middleware/auth.js';
import { getReports } from '../controllers/reportController.js';
const router = express.Router();
router.use(auth);
router.get('/', getReports);
export default router;
