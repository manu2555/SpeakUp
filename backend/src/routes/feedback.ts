import express from 'express';
import { protect } from '../middleware/auth';
import {
  createFeedbackHandler,
  getFeedbacksHandler,
  getFeedbackByIdHandler,
  updateFeedbackHandler,
  uploadFeedbackFiles
} from '../controllers/feedback';

const router = express.Router();

// Apply protection middleware to all routes
router.use(protect);

// Create new feedback with file upload
router.post('/', uploadFeedbackFiles, createFeedbackHandler);

// Get all feedbacks
router.get('/', getFeedbacksHandler);

// Get single feedback
router.get('/:id', getFeedbackByIdHandler);

// Update feedback
router.put('/:id', uploadFeedbackFiles, updateFeedbackHandler);

export default router;