import { Request, Response } from 'express';
import { createFeedback, getFeedbacks, getFeedbackById, updateFeedbackStatus } from '../models/Feedback';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { supabaseAdmin } from '../lib/supabase';

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

// @desc    Update feedback
// @route   PUT /api/feedback/:id
// @access  Private
export const updateFeedbackHandler = async (req: Request, res: Response) => {
  try {
    console.log('\n=== 🔄 Starting Feedback Update ===');
    console.log('📝 Request body:', req.body);
    console.log('📎 Files:', req.files);
    
    const { id } = req.params;
    const { type, department, agency, subject, description } = req.body;
    const userId = (req as any).user.id;

    // Get existing feedback
    const existingFeedback = await getFeedbackById(id, userId);
    
    if (!existingFeedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
    }

    // Handle file uploads
    let filePaths: string[] = [];
    if (req.files && Array.isArray(req.files) && (req.files as Express.Multer.File[]).length > 0) {
      console.log(`Processing ${(req.files as Express.Multer.File[]).length} new uploaded files`);
      filePaths = (req.files as Express.Multer.File[]).map(file => file.filename);
    }

    // Keep existing files that weren't removed
    const existingFiles = req.body.existing_files ? JSON.parse(req.body.existing_files) : [];
    filePaths = [...existingFiles, ...filePaths];

    // Update feedback data
    const feedbackData = {
      type: type || existingFeedback.type,
      department: department || existingFeedback.department,
      agency: agency || existingFeedback.agency,
      subject: subject || existingFeedback.subject,
      description: description || existingFeedback.description,
      user_id: userId,
      status: existingFeedback.status,
      file_paths: filePaths
    };

    const { data, error } = await supabaseAdmin
      .from('feedbacks')
      .update(feedbackData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Failed to update feedback');
    }

    console.log('✅ Feedback update successful:', {
      id: data.id,
      file_paths: data.file_paths
    });

    res.json({
      success: true,
      data: data,
    });
    console.log('=== ✨ Feedback Update Process Completed ===\n');
  } catch (err: any) {
    console.error('\n=== ❌ Feedback Update Error ===');
    console.error('Error details:', err);
    
    // Clean up any newly uploaded files if update fails
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
      message: 'Failed to update feedback',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
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

    // Get existing feedback to check ownership and get file paths
    const existingFeedback = await getFeedbackById(id, userId);
    
    if (!existingFeedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
    }

    // Delete from database
    const { error } = await supabaseAdmin
      .from('feedbacks')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    // Delete associated files if they exist
    if (existingFeedback.file_paths && existingFeedback.file_paths.length > 0) {
      console.log('Deleting associated files:', existingFeedback.file_paths);
      existingFeedback.file_paths.forEach(filePath => {
        const fullPath = path.join(uploadsDir, filePath);
        try {
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log(`Deleted file: ${fullPath}`);
          }
        } catch (err) {
          console.error(`Failed to delete file ${fullPath}:`, err);
        }
      });
    }

    console.log('✅ Feedback deletion successful');
    console.log('=== ✨ Feedback Deletion Complete ===\n');

    res.json({
      success: true,
      message: 'Feedback deleted successfully',
    });
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