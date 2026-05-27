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

const URL = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const KEY = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

if (!URL || !KEY) {
  console.error('Supabase URL or Key not found in .env.local');
  process.exit(1);
}

async function countProducts() {
  try {
    // We use the count=exact header to get the total count without fetching all rows
    const res = await fetch(`${URL}/rest/v1/products?select=count`, {
      method: 'GET',
      headers: {
        'apikey': KEY,
        'Authorization': `Bearer ${KEY}`,
        'Range': '0-0', // Just get the count, no rows
        'Prefer': 'count=exact'
      }
    });

    // The count is returned in the Content-Range header: 0-0/42
    const contentRange = res.headers.get('content-range');
    if (contentRange) {
      const count = contentRange.split('/')[1];
      console.log(`TOTAL_PRODUCTS: ${count}`);
    } else {
      // If Content-Range is not available, maybe it's in the body for select=count
      const data = await res.json();
      console.log(`DATA: ${JSON.stringify(data[0])}`);
      console.log(`TOTAL_PRODUCTS: ${data[0].count}`);
    }
  } catch (e) {
    console.error('Error:', e.message);
  }
}

countProducts();
