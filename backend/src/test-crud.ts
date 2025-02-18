import { supabaseAdmin } from './lib/supabase';

async function testCRUDOperations() {
  console.log('🔍 Starting CRUD operations test...\n');

  try {
    // Test CREATE
    console.log('Testing CREATE operation...');
    const { data: createData, error: createError } = await supabaseAdmin
      .from('users')
      .insert([
        {
          name: 'Test User',
          email: 'test@example.com',
          password: 'hashedpassword123',
          role: 'user'
        }
      ])
      .select();

    if (createError) throw createError;
    console.log('✅ CREATE successful:', createData);
    
    const userId = createData[0].id;

    // Test READ
    console.log('\nTesting READ operation...');
    const { data: readData, error: readError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (readError) throw readError;
    console.log('✅ READ successful:', readData);

    // Test UPDATE
    console.log('\nTesting UPDATE operation...');
    const { data: updateData, error: updateError } = await supabaseAdmin
      .from('users')
      .update({ name: 'Updated Test User' })
      .eq('id', userId)
      .select();

    if (updateError) throw updateError;
    console.log('✅ UPDATE successful:', updateData);

    // Test DELETE
    console.log('\nTesting DELETE operation...');
    const { error: deleteError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId);

    if (deleteError) throw deleteError;
    console.log('✅ DELETE successful');

    console.log('\n✨ All CRUD operations completed successfully!');

  } catch (error) {
    console.error('\n❌ CRUD test failed:', error);
  }
}

testCRUDOperations(); 