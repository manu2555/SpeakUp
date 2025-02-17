import { Request, Response } from 'express';
import Feedback from '../models/Feedback';
import { Op } from 'sequelize';

// @desc    Create new feedback
// @route   POST /api/feedback
// @access  Private
export const createFeedback = async (req: Request, res: Response) => {
  try {
    const { type, department, agency, subject, description } = req.body;
    const userId = (req as any).user.id;

    const feedback = await Feedback.create({
      type,
      department,
      agency,
      subject,
      description,
      userId,
      status: 'PENDING',
    });

    res.status(201).json({
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

// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Private
export const getFeedback = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;
    
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const where = userRole === 'admin' ? {} : { userId };

    if (req.query.type) {
      (where as any).type = req.query.type;
    }

    if (req.query.department) {
      (where as any).department = req.query.department;
    }

    if (req.query.status) {
      (where as any).status = req.query.status;
    }

    const feedback = await Feedback.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: ['user'],
    });

    res.json({
      success: true,
      count: feedback.count,
      data: feedback.rows,
      pagination: {
        page,
        pages: Math.ceil(feedback.count / limit),
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
export const getFeedbackById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    const where = {
      id: req.params.id,
      ...(userRole === 'user' && { userId }),
    };

    const feedback = await Feedback.findOne({
      where,
      include: ['user'],
    });

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
export const updateFeedbackStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    const feedback = await Feedback.findByPk(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
    }

    feedback.status = status;
    await feedback.save();

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