import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://eedcqmvioeaypcejwlfc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlZGNxbXZpb2VheXBjZWp3bGZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNTU0MDAsImV4cCI6MjA4ODkzMTQwMH0.i590IPlnQCzz2wFssacTEQZgSV3NoCAmaMGVxULL1wg';

async function test() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  console.log('Attempting login...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'ebai@strat.com',
    password: '20060ntima'
  });

  if (authError) {
    console.error('Login failed:', authError.message);
    return;
  }

  console.log('Login successful. UID:', authData.user.id);
  
  console.log('Fetching profile...');
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .single();

  if (profileError) {
    console.error('Profile fetch failed:', profileError);
  } else {
    console.log('Profile:', profile);
  }

  console.log('Fetching products...');
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*');

  if (productsError) {
    console.error('Products fetch failed:', productsError);
  } else {
    console.log('Products found:', products.length);
  }
}

test();
