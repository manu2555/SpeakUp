import express from 'express';
import authRoutes from './auth';
import feedbackRoutes from './feedback';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/feedback', feedbackRoutes);

export default router; 