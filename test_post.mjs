
const URL = 'https://eedcqmvioeaypcejwlfc.supabase.co/rest/v1/products';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlZGNxbXZpb2VheXBjZWp3bGZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNTU0MDAsImV4cCI6MjA4ODkzMTQwMH0.i590IPlnQCzz2wFssacTEQZgSV3NoCAmaMGVxULL1wg';

async function testPost() {
  try {
    const res = await fetch(URL, {
      method: 'POST',
      headers: {
        'apikey': KEY,
        'Authorization': `Bearer ${KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        name: 'Schema Test',
        slug: 'schema-test-' + Date.now(),
        price: 10,
        dosage_form: 'Solid' 
      })
    });
    if (res.status === 201 || res.status === 200 || res.status === 204) {
        console.log('SUCCESS: Column exists!');
    } else {
        const data = await res.json();
        console.log('FAILURE:', res.status, JSON.stringify(data, null, 2));
    }
  } catch (e) {
    console.error('ERROR:', e);
  }
}

testPost();
