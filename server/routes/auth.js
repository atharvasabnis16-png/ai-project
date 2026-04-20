import express from 'express';
import { signup, login, updateProfile, getMe } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/register', signup);
router.post('/login', login);
router.put('/profile', auth, updateProfile);
router.get('/me', auth, getMe);

export default router;
