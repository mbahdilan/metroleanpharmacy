
const URL = 'https://eedcqmvioeaypcejwlfc.supabase.co/rest/v1/products?select=*&limit=1';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlZGNxbXZpb2VheXBjZWp3bGZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxMzMwNjYsImV4cCI6MjA1ODcwOTA2Nn0.6SizqQ6-Wq-7WvW5_p_C_z7X5A4U_y5F9S9U_y5F9S9';

async function test() {
  try {
    const res = await fetch(URL, {
      headers: {
        'apikey': KEY,
        'Authorization': `Bearer ${KEY}`
      }
    });
    const data = await res.json();
    if (data.length > 0) {
      console.log('COLUMNS:', Object.keys(data[0]));
    } else {
      console.log('NO_DATA');
    }
  } catch (e) {
    console.error(e);
  }
}

test();
