import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const getEnvVar = (name) => {
  const match = envContent.match(new RegExp(`${name}=(.*)`));
  return match ? match[1].trim() : null;
};

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

console.log('URL:', supabaseUrl);
// Don't log the full key for security, just the start
console.log('Key Start:', supabaseAnonKey?.substring(0, 10));

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testing connection...');
  try {
    const { data, error, status, statusText } = await supabase
      .from('products')
      .select('id, name')
      .limit(1);

    if (error) {
      console.error('Supabase Error:', JSON.stringify(error, null, 2));
      console.error('Status:', status, statusText);
    } else {
      console.log('Success! Data:', data);
    }
  } catch (err) {
    console.error('Unexpected Catch Error:', err.message);
  }
}

testConnection();
