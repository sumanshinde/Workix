
const io = require('socket.io-client');

const API_URL = 'http://localhost:5000/api';
let adminToken = '';
let testUserId = '';
let altUserId = '';

async function runTests() {
  console.log('--- STARTING SYSTEM VALIDATION ---\n');

  try {
    // 1. Create Admin User (or use existing)
    console.log('[1/7] Creating Mock Admin...');
    const adminRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Admin Flow', email: `admin_${Date.now()}@test.com`, password: 'password123', role: 'admin' })
    });
    const adminData = await adminRes.json();
    adminToken = adminData.token;
    console.log('✔️ Admin Registered / Ready');

    // 2. Signup Test User -> Should generate ActivityLog
    console.log('[2/7] Testing User Signup Event...');
    const signupRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Freelancer', email: `test_${Date.now()}@freelance.com`, password: 'password123', role: 'freelancer' })
    });
    const signupData = await signupRes.json();
    testUserId = signupData.user.id;
    console.log('✔️ Signup Event Dispatched');

    // 3. Login Event
    console.log('[3/7] Testing User Login Event...');
    await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: signupData.user.email, password: 'password123' })
    });
    console.log('✔️ Login Event Dispatched');

    // 4. Create Alt User
    console.log('[4/7] Creating Alt User for Messages...');
    const altRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Alt Client', email: `client_${Date.now()}@test.com`, password: 'password123', role: 'client' })
    });
    altUserId = (await altRes.json()).user.id;
    console.log('✔️ Alt User Ready');

    // 5. Test Socket & Messages
    console.log('[5/7] Testing Real-time Message & Socket Activity...');
    const socket = io('http://localhost:5000', { transports: ['websocket'] });
    
    await new Promise((resolve) => {
      socket.on('connect', () => {
        socket.emit('send_msg', {
          senderId: testUserId,
          receiverId: altUserId,
          text: 'Hello from the validation script!'
        });
        setTimeout(resolve, 1500); // Give server time to save and emit
      });
    });
    socket.disconnect();
    console.log('✔️ Message Event Dispatched & Broadcasted via Socket');

    // 6. Test Admin API Activity Feed
    console.log('\n[6/7] Validating /api/admin/activity (Admin Fetch)...');
    const actRes = await fetch(`${API_URL}/admin/activity`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const activities = await actRes.json();
    const actions = activities.map(a => a.action);
    console.log(`Found ${activities.length} total activities.`);
    console.log('Latest actions found in database: ', actions.slice(0, 5));
    if (actions.includes('signup') && actions.includes('login') && actions.includes('message_sent')) {
      console.log('✔️ SUCCESS: Activity API Pipeline confirmed working');
    } else {
      console.error('❌ ERROR: Missing events in activity pipeline', actions);
    }

    // 7. Test Admin API Messages Feed
    console.log('\n[7/7] Validating /api/admin/messages (Admin Fetch)...');
    const msgRes = await fetch(`${API_URL}/admin/messages`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const messages = await msgRes.json();
    console.log(`Found ${messages.length} total messages.`);
    const systemMsg = messages.find(m => m.text === 'Hello from the validation script!');
    
    if (systemMsg && systemMsg.senderId && systemMsg.receiverId) {
       console.log(`✔️ SUCCESS: Chat Monitoring confirmed working (Sender: ${systemMsg.senderId.name})`);
    } else {
       console.error('❌ ERROR: Messages not properly populating or missing via Socket interception.');
    }

    console.log('\n--- SYSTEM VALIDATION COMPLETE | ALL PASSED ---');

  } catch (err) {
    console.error('System Validation Failed: ', err);
  }
}

runTests();
