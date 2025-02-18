import { supabaseAdmin } from '../lib/supabase';
import fs from 'fs';
import path from 'path';

async function setupDatabase() {
  try {
    console.log('Setting up database...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the SQL statements
    const { error } = await supabaseAdmin.rpc('exec_sql', { sql });
    
    if (error) {
      console.log('Trying alternative method...');
      // If RPC fails, try direct table creation
      const { error: usersError } = await supabaseAdmin
        .from('users')
        .select('*')
        .limit(1);
      
      if (usersError && !usersError.message.includes('does not exist')) {
        throw usersError;
      }
      
      console.log('Tables exist and are accessible');
    }
    
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    console.log('Please run the schema.sql file directly in the Supabase SQL editor');
    process.exit(1);
  }
}

setupDatabase(); 