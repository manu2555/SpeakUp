import { createClient } from '@supabase/supabase-js';

// Check for required environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase configuration:');
  console.error('SUPABASE_URL:', process.env.SUPABASE_URL ? '✓ Present' : '✗ Missing');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✓ Present' : '✗ Missing');
  throw new Error('Missing Supabase configuration. Please check your environment variables.');
}

// Create Supabase admin client
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Test the connection and log the result
supabaseAdmin.from('users').select('count', { count: 'exact', head: true })
  .then(({ count, error }) => {
    if (error) {
      console.error('❌ Supabase connection test failed:', error.message);
    } else {
      console.log('✅ Supabase connection test successful');
      console.log(`📊 Users table count: ${count}`);
    }
  })
  .catch(err => {
    console.error('❌ Supabase connection test failed:', err.message);
  }); 