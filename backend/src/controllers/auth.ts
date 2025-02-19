import { Request, Response } from 'express';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { 
  createUnverifiedUser, 
  findUserByEmail, 
  findUserById, 
  comparePassword, 
  verifyEmail as verifyUserEmail,
  setUserPassword
} from '../models/User';
import { sendVerificationEmail } from '../services/email';
import { supabaseAdmin } from '../lib/supabase';

// Helper function for JWT signing
const signToken = (payload: { id: string }): string => {
  const secret = process.env.JWT_SECRET || 'fallback-secret-key';
  const options: SignOptions = {
    expiresIn: '24h' // Using a fixed value for now to ensure it works
  };
  return jwt.sign(payload, secret, options);
};

// @desc    Start registration process
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  try {
    console.log('\n=== 🚀 Starting Registration Process ===');
    console.log('📝 Request body:', { ...req.body, password: '[REDACTED]' });
    
    const { name, email } = req.body;

    // Validate input
    if (!name || !email) {
      console.log('❌ Validation failed - missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Please provide name and email',
      });
    }

    // Check if user exists
    console.log('🔍 Checking for existing user with email:', email);
    const userExists = await findUserByEmail(email);
    if (userExists) {
      console.log('❌ User already exists with email:', email);
      return res.status(400).json({
        success: false,
        message: 'This email is already registered',
      });
    }

    // Create unverified user
    console.log('👤 Creating unverified user...');
    const user = await createUnverifiedUser({ name, email });

    if (!user) {
      console.error('❌ User creation failed - returned null');
      throw new Error('Failed to create user');
    }

    // Send verification email
    try {
      console.log('📧 Attempting to send verification email...');
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${user.verification_token}`;
      await sendVerificationEmail(email, name, verificationUrl);
      console.log('✅ Verification email sent successfully');
    } catch (emailError: any) {
      console.error('❌ Failed to send verification email:', emailError);
      
      // Delete the unverified user since email failed
      try {
        await supabaseAdmin
          .from('users')
          .delete()
          .eq('id', user.id);
      } catch (deleteError) {
        console.error('Failed to delete user after email error:', deleteError);
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again.',
        details: process.env.NODE_ENV === 'development' ? emailError.message : undefined
      });
    }

    // Send response
    console.log('✅ Registration initiated, verification email sent');
    res.status(201).json({
      success: true,
      message: 'Registration initiated. Please check your email to verify your account.',
    });
    console.log('=== ✨ Registration Process Initiated ===\n');
  } catch (err: any) {
    console.error('\n=== ❌ Registration Error ===');
    console.error('Error details:', err);
    
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Verify email and get user details
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    
    const user = await verifyUserEmail(token);
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Email verification error:', err);
    res.status(500).json({
      success: false,
      message: 'Email verification failed',
    });
  }
};

// @desc    Set password for verified email
// @route   POST /api/auth/set-password
// @access  Public
export const setPassword = async (req: Request, res: Response) => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide userId and password',
      });
    }

    const user = await setUserPassword(userId, password);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Failed to set password',
      });
    }

    // Generate token for automatic login
    const token = signToken({ id: user.id });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Set password error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to set password',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check if user exists
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = signToken({ id: user.id });

    // Set token in response header
    res.setHeader('Authorization', `Bearer ${token}`);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await findUserById((req as any).user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
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

// @desc    Get total user count
// @route   GET /api/auth/total-users
// @access  Public
export const getTotalUsers = async (req: Request, res: Response) => {
  try {
    const { count, error } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      count: count || 0
    });
  } catch (err) {
    console.error('Error getting total users:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to get total users count'
    });
  }
}; 