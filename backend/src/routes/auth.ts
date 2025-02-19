import express from 'express';
import { register, login, getMe, verifyEmail, setPassword, getTotalUsers } from '../controllers/auth';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.get('/verify-email/:token', verifyEmail);
router.post('/set-password', setPassword);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/total-users', getTotalUsers);

export default router; 