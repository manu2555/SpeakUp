import 'cross-fetch/polyfill';
import { supabaseAdmin } from './config/database';

async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');

    // Try to create a test table
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(1);

    if (error) {
      throw error;
    }

    console.log('Successfully connected to Supabase!');
    console.log('Users table exists and is accessible');
    console.log('Data:', data);

    // Test RLS policies
    const { data: rlsData, error: rlsError } = await supabaseAdmin
      .rpc('get_auth_policies');

    if (rlsError) {
      console.log('Could not check RLS policies:', rlsError.message);
    } else {
      console.log('RLS Policies:', rlsData);
    }

  } catch (error) {
    console.error('Error connecting to Supabase:', error);
  }
}

testSupabaseConnection(); 