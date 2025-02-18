import express from 'express';
import {
  createFeedbackHandler,
  getFeedbacksHandler,
  getFeedbackByIdHandler,
  updateFeedbackStatusHandler,
} from '../controllers/feedback';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect); // Protect all routes

router
  .route('/')
  .post(createFeedbackHandler)
  .get(getFeedbacksHandler);

router
  .route('/:id')
  .get(getFeedbackByIdHandler)
  .put(authorize('admin'), updateFeedbackStatusHandler);

export default router;