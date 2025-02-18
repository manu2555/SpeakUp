import { supabaseAdmin } from '../config/database';

export interface Feedback {
  id: string;
  type: 'COMPLAINT' | 'SUGGESTION' | 'ENQUIRE';
  department: string;
  agency: string;
  subject: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export const createFeedback = async (feedbackData: Omit<Feedback, 'id' | 'created_at' | 'updated_at'>): Promise<Feedback | null> => {
  try {
    console.log('\n=== 📝 Creating Feedback ===');
    console.log('Input data:', feedbackData);

    const { data, error } = await supabaseAdmin
      .from('feedbacks')
      .insert([{
        ...feedbackData,
        status: feedbackData.status || 'PENDING'
      }])
      .select()
      .single();

    if (error) {
      console.error('❌ Database error during feedback creation:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    if (!data) {
      console.error('❌ No data returned from feedback creation');
      throw new Error('Failed to create feedback - no data returned');
    }

    console.log('✅ Feedback created successfully:', data);
    console.log('=== ✨ Feedback Creation Complete ===\n');
    return data;
  } catch (err) {
    console.error('\n=== ❌ Create Feedback Error ===');
    console.error('Error details:', err);
    if (err instanceof Error) {
      console.error('Stack trace:', err.stack);
    }
    throw err;
  }
};

export const getFeedbacks = async (userId?: string, filters: Partial<Feedback> = {}): Promise<Feedback[]> => {
  let query = supabaseAdmin
    .from('feedbacks')
    .select(`
      *,
      users (
        id,
        name,
        email
      )
    `);

  if (userId) {
    query = query.eq('user_id', userId);
  }

  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      query = query.eq(key, value);
    }
  });

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};

export const getFeedbackById = async (id: string, userId?: string): Promise<Feedback | null> => {
  let query = supabaseAdmin
    .from('feedbacks')
    .select(`
      *,
      users (
        id,
        name,
        email
      )
    `)
    .eq('id', id);

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query.single();

  if (error) {
    return null;
  }

  return data;
};

export const updateFeedbackStatus = async (id: string, status: Feedback['status']): Promise<Feedback | null> => {
  const { data, error } = await supabaseAdmin
    .from('feedbacks')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}; 