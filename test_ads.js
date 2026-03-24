// Native fetch used
async function test() {
  const loginRes = await fetch('http://127.0.0.1:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'testfree@example.com', password: 'password123' })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;
  console.log('Got token:', token ? 'YES' : 'NO');

  try {
    const res = await fetch('http://127.0.0.1:5000/api/ads', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: "Test Ad",
        description: "Test description",
        adType: "post",
        durationDays: 7
      })
    });
    
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response:', text);
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}

test();
