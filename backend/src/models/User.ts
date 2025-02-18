import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { supabaseAdmin } from '../lib/supabase';

// Set up bcrypt to use node's crypto module
bcrypt.setRandomFallback((len: number) => {
  const buf = crypto.randomBytes(len);
  return Array.from(buf);
});

export interface User {
  id: string;
  name: string;
  email: string;
  password: string | null;
  role: 'user' | 'admin';
  email_verified: boolean;
  verification_token: string | null;
  verification_token_expires: Date | null;
  created_at?: string;
  updated_at?: string;
}

export const comparePassword = async (password: string, hashedPassword: string | null): Promise<boolean> => {
  if (!hashedPassword) {
    return false;
  }
  return bcrypt.compare(password, hashedPassword);
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const createUser = async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User | null> => {
  try {
    console.log('\n=== 👤 Creating User ===');
    console.log('Input data:', { 
      name: userData.name, 
      email: userData.email, 
      role: userData.role,
      password: '[REDACTED]' 
    });
    
    if (!userData.password) {
      throw new Error('Password is required for creating a user');
    }

    // Hash password for database storage
    console.log('🔒 Hashing password...');
    const hashedPassword = await hashPassword(userData.password);
    console.log('✅ Password hashed successfully');
    
    // Create the user profile in the users table
    console.log('💾 Attempting to insert user into database...');
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([
        { 
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: userData.role || 'user'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('❌ Database error during user creation:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    if (!data) {
      console.error('❌ No data returned from user creation');
      throw new Error('Failed to create user - no data returned');
    }

    console.log('✅ User created successfully:', {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role
    });
    console.log('=== ✨ User Creation Complete ===\n');
    return data;
  } catch (err) {
    console.error('\n=== ❌ Create User Error ===');
    console.error('Error details:', err);
    if (err instanceof Error) {
      console.error('Stack trace:', err.stack);
    }
    throw err;
  }
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    return null;
  }

  return data;
};

export const findUserById = async (id: string): Promise<User | null> => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return null;
  }

  return data;
};

export const updateUser = async (id: string, updateData: Partial<User>): Promise<User | null> => {
  if (updateData.password) {
    updateData.password = await hashPassword(updateData.password);
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const generateVerificationToken = (): { token: string; expires: Date } => {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date();
  expires.setHours(expires.getHours() + 24); // Token expires in 24 hours
  return { token, expires };
};

export const createUnverifiedUser = async (userData: { name: string; email: string }): Promise<User | null> => {
  try {
    console.log('\n=== 👤 Creating Unverified User ===');
    const { token, expires } = generateVerificationToken();
    
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([{ 
        name: userData.name,
        email: userData.email,
        password: null,
        role: 'user',
        email_verified: false,
        verification_token: token,
        verification_token_expires: expires.toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('❌ Database error during user creation:', error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Error creating unverified user:', err);
    throw err;
  }
};

export const verifyEmail = async (token: string): Promise<User | null> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('verification_token', token)
      .single();

    if (error || !data) {
      return null;
    }

    if (new Date(data.verification_token_expires) < new Date()) {
      return null;
    }

    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        email_verified: true,
        verification_token: null,
        verification_token_expires: null
      })
      .eq('id', data.id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return updatedUser;
  } catch (err) {
    console.error('Error verifying email:', err);
    throw err;
  }
};

export const setUserPassword = async (userId: string, password: string): Promise<User | null> => {
  try {
    const hashedPassword = await hashPassword(password);
    
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({
        password: hashedPassword
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Error setting user password:', err);
    throw err;
  }
}; 