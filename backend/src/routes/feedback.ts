import express from 'express';
import {
  createFeedback,
  getFeedback,
  getFeedbackById,
  updateFeedbackStatus,
} from '../controllers/feedback';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect); // Protect all routes

router
  .route('/')
  .post(createFeedback)
  .get(getFeedback);

router
  .route('/:id')
  .get(getFeedbackById)
  .put(authorize('admin'), updateFeedbackStatus);

export default router; 