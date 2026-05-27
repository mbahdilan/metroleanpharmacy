
const URL = 'https://eedcqmvioeaypcejwlfc.supabase.co/rest/v1/categories?select=*&limit=1';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlZGNxbXZpb2VheXBjZWp3bGZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNTU0MDAsImV4cCI6MjA4ODkzMTQwMH0.i590IPlnQCzz2wFssacTEQZgSV3NoCAmaMGVxULL1wg';

async function testFetch() {
  try {
    const res = await fetch(URL, {
      headers: {
        'apikey': KEY,
        'Authorization': `Bearer ${KEY}`
      }
    });
    const data = await res.json();
    console.log('RESPONSE:', JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('ERROR:', e);
  }
}

testFetch();
