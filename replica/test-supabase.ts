import { supabase } from '../src/utils/supabase.ts';

async function testSupabase() {
  console.log('Testing Supabase connectivity...');
  
  // Test 1: Fetch characters (Public Read)
  const { data: chars, error: charError } = await supabase.from('characters').select('*').limit(1);
  if (charError) {
    console.error('Test 1 Failed: Characters fetch error:', charError.message);
  } else {
    console.log('Test 1 Passed: Characters fetch successful', chars);
  }

  // Test 2: RLS Check (Attempt insert into progress without auth)
  const { error: rlsError } = await supabase.from('user_lesson_progress').insert({
    node_id: '00000000-0000-0000-0000-000000000000',
    status: 'completed'
  });
  
  if (rlsError) {
    console.log('Test 2 Passed: RLS blocked unauthorized insert:', rlsError.message);
  } else {
    console.error('Test 2 Failed: RLS failed to block unauthorized insert');
  }
}

testSupabase();
