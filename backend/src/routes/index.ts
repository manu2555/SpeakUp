import express from 'express';
import authRoutes from './auth';
import feedbackRoutes from './feedback';
import agencyRoutes from './agencies';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/agencies', agencyRoutes);

export default router; 