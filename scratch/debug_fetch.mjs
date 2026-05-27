const URL = 'https://sleoactimqqiorkswbqi.supabase.co/rest/v1/products?select=*&limit=1';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsZW9hY3RpbXFxaW9ya3N3YnFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTkzNTgsImV4cCI6MjA5MDM3NTM1OH0.ACbvrD6a6JOY6kMNJRxE0EBw2zEIpwJRli2zseVKgaU';

async function test() {
  try {
    const res = await fetch(URL, {
      headers: {
        'apikey': KEY,
        'Authorization': `Bearer ${KEY}`,
        'Prefer': 'count=exact'
      }
    });
    console.log('Status:', res.status);
    console.log('Headers:', JSON.stringify([...res.headers.entries()]));
    const data = await res.json();
    console.log('Data Length:', data.length);
    const countHeader = res.headers.get('content-range');
    console.log('Content-Range:', countHeader);
  } catch (e) {
    console.error('Error Details:', e);
  }
}

test();
