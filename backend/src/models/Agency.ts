import { supabaseAdmin } from '../lib/supabase';

export interface Agency {
  id: string;
  code: string;
  name: string;
  department: string;
  customer_care_email: string;
  created_at?: string;
  updated_at?: string;
}

export const getAgencies = async (department?: string): Promise<Agency[]> => {
  try {
    let query = supabaseAdmin
      .from('agencies')
      .select('*')
      .order('name');

    if (department) {
      query = query.eq('department', department);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching agencies:', error);
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('Error in getAgencies:', err);
    throw err;
  }
};

export const getAgencyByCode = async (code: string): Promise<Agency | null> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('agencies')
      .select('*')
      .eq('code', code)
      .single();

    if (error) {
      console.error('Error fetching agency:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error in getAgencyByCode:', err);
    throw err;
  }
}; 