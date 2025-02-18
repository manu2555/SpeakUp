import { Request, Response } from 'express';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { createUser, findUserByEmail, findUserById, comparePassword } from '../models/User';

// Helper function for JWT signing
const signToken = (payload: { id: string }): string => {
  const secret = process.env.JWT_SECRET || 'fallback-secret-key';
  const options: SignOptions = {
    expiresIn: '24h' // Using a fixed value for now to ensure it works
  };
  return jwt.sign(payload, secret, options);
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  try {
    console.log('\n=== 🚀 Starting Registration Process ===');
    console.log('📝 Request body:', { ...req.body, password: '[REDACTED]' });
    
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      console.log('❌ Validation failed - missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if user exists
    console.log('🔍 Checking for existing user with email:', email);
    const userExists = await findUserByEmail(email);
    if (userExists) {
      console.log('❌ User already exists with email:', email);
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Create user
    console.log('👤 Attempting to create new user...');
    const user = await createUser({
      name,
      email,
      password,
      role: 'user',
    });

    if (!user) {
      console.error('❌ User creation failed - returned null');
      throw new Error('Failed to create user');
    }

    // Generate token
    console.log('🔑 Generating JWT token for user:', user.id);
    const token = signToken({ id: user.id });

    // Send response
    console.log('✅ Registration successful, sending response');
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
    console.log('=== ✨ Registration Process Completed ===\n');
  } catch (err: any) {
    console.error('\n=== ❌ Registration Error ===');
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      code: err.code,
      details: err.details,
      stack: err.stack
    });
    
    // Send appropriate error response
    if (err.code === '23505') { // Unique violation
      console.log('❌ Duplicate email detected');
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }
    
    console.error('❌ Sending 500 error response');
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
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