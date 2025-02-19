import { Request, Response } from 'express';
import { createFeedback, getFeedbacks, getFeedbackById, updateFeedbackStatus, deleteFeedback } from '../models/Feedback';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Define allowed file types
const allowedTypes = /jpeg|jpg|png|pdf/;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and original extension
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg, .jpeg and .pdf files are allowed'));
  }
});

// Export the multer middleware
export const uploadFeedbackFiles = upload.array('files', 5); // Max 5 files

// @desc    Create new feedback
// @route   POST /api/feedback
// @access  Private
export const createFeedbackHandler = async (req: Request, res: Response) => {
  try {
    console.log('\n=== 🚀 Starting Feedback Creation ===');
    console.log('📝 Request body:', req.body);
    console.log('📎 Files:', req.files);
    
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

    // Handle file uploads
    let filePaths: string[] = [];
    if (req.files && Array.isArray(req.files) && (req.files as Express.Multer.File[]).length > 0) {
      console.log(`Processing ${(req.files as Express.Multer.File[]).length} uploaded files`);
      filePaths = (req.files as Express.Multer.File[]).map(file => {
        console.log('Processing file:', {
          originalName: file.originalname,
          filename: file.filename,
          path: file.path,
          size: file.size,
          mimetype: file.mimetype
        });
        // Store only the filename
        return file.filename;
      });
      console.log('Processed file paths:', filePaths);
    }

    // Create feedback data with file paths
    const feedbackData = {
      type,
      department,
      agency,
      subject,
      description,
      user_id,
      status: 'PENDING' as const,
      file_paths: filePaths
    };

    console.log('📁 Creating feedback with data:', {
      ...feedbackData,
      file_paths_length: feedbackData.file_paths.length
    });

    const feedback = await createFeedback(feedbackData);

    if (!feedback) {
      throw new Error('Failed to create feedback');
    }

    console.log('✅ Feedback creation successful:', {
      id: feedback.id,
      file_paths: feedback.file_paths
    });

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
    
    // Clean up uploaded files if feedback creation fails
    if (req.files && Array.isArray(req.files)) {
      (req.files as Express.Multer.File[]).forEach(file => {
        try {
          fs.unlinkSync(file.path);
          console.log(`Cleaned up file: ${file.path}`);
        } catch (cleanupErr) {
          console.error(`Failed to clean up file ${file.path}:`, cleanupErr);
        }
      });
    }

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

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private
export const deleteFeedbackHandler = async (req: Request, res: Response) => {
  try {
    console.log('\n=== 🗑️ Starting Feedback Deletion ===');
    const { id } = req.params;
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    // Check if feedback exists and belongs to user
    const feedback = await getFeedbackById(id, userRole === 'user' ? userId : undefined);

    if (!feedback) {
      console.log('❌ Feedback not found or unauthorized');
      return res.status(404).json({
        success: false,
        message: 'Feedback not found or unauthorized',
      });
    }

    // Delete associated files if they exist
    if (feedback.file_paths && feedback.file_paths.length > 0) {
      console.log('🗑️ Deleting associated files...');
      feedback.file_paths.forEach(filePath => {
        const fullPath = path.join(__dirname, '../../uploads', filePath);
        try {
          fs.unlinkSync(fullPath);
          console.log(`✅ Deleted file: ${filePath}`);
        } catch (err) {
          console.error(`❌ Failed to delete file ${filePath}:`, err);
        }
      });
    }

    // Delete the feedback
    const deleted = await deleteFeedback(id);

    if (!deleted) {
      throw new Error('Failed to delete feedback');
    }

    console.log('✅ Feedback deletion successful');
    res.json({
      success: true,
      message: 'Feedback deleted successfully',
    });
    console.log('=== ✨ Feedback Deletion Process Completed ===\n');
  } catch (err: any) {
    console.error('\n=== ❌ Feedback Deletion Error ===');
    console.error('Error details:', err);
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete feedback',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}; 