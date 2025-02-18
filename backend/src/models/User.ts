import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { supabaseAdmin } from '../config/database';

// Set up bcrypt to use node's crypto module
bcrypt.setRandomFallback((len: number) => {
  const buf = crypto.randomBytes(len);
  return Array.from(buf);
});

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  created_at?: string;
  updated_at?: string;
}

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
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