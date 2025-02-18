import { Request, Response } from 'express';
import { createFeedback, getFeedbacks, getFeedbackById, updateFeedbackStatus } from '../models/Feedback';

// @desc    Create new feedback
// @route   POST /api/feedback
// @access  Private
export const createFeedbackHandler = async (req: Request, res: Response) => {
  try {
    console.log('\n=== 🚀 Starting Feedback Creation ===');
    console.log('📝 Request body:', req.body);
    
    const { type, department, agency, subject, description } = req.body;
    const user_id = (req as any).user.id;

    // Validate input
    if (!type || !department || !agency || !subject || !description) {
      console.log('❌ Validation failed - missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    console.log('👤 Creating feedback for user:', user_id);
    const feedback = await createFeedback({
      type,
      department,
      agency,
      subject,
      description,
      user_id,
      status: 'PENDING',
    });

    console.log('✅ Feedback creation successful, sending response');
    res.status(201).json({
      success: true,
      data: feedback,
    });
    console.log('=== ✨ Feedback Creation Process Completed ===\n');
  } catch (err: any) {
    console.error('\n=== ❌ Feedback Creation Error ===');
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      code: err.code,
      details: err.details,
      stack: err.stack
    });
    
    res.status(500).json({
      success: false,
      message: 'Failed to create feedback',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Private
export const getFeedbacksHandler = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;
    
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const filters: any = {};
    
    if (userRole === 'user') {
      filters.user_id = userId;
    }

    if (req.query.type) {
      filters.type = req.query.type;
    }

    if (req.query.department) {
      filters.department = req.query.department;
    }

    if (req.query.status) {
      filters.status = req.query.status;
    }

    const feedbacks = await getFeedbacks(userRole === 'user' ? userId : undefined, filters);

    // Manual pagination since Supabase doesn't support offset pagination
    const paginatedFeedbacks = feedbacks.slice(offset, offset + limit);

    res.json({
      success: true,
      count: feedbacks.length,
      data: paginatedFeedbacks,
      pagination: {
        page,
        pages: Math.ceil(feedbacks.length / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc    Get single feedback
// @route   GET /api/feedback/:id
// @access  Private
export const getFeedbackByIdHandler = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    const feedback = await getFeedbackById(
      req.params.id,
      userRole === 'user' ? userId : undefined
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
    }

    res.json({
      success: true,
      data: feedback,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc    Update feedback status
// @route   PUT /api/feedback/:id
// @access  Private/Admin
export const updateFeedbackStatusHandler = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    const feedback = await updateFeedbackStatus(req.params.id, status);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
    }

    res.json({
      success: true,
      data: feedback,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
}; 