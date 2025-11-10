/**
 * Backend API Tester
 * 
 * This script tests your backend Register and Login APIs
 * Run: node test-backend-api.js
 */

const API_BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  name: 'API Test User',
  email: `apitest${Date.now()}@example.com`, // Unique email
  username: `apitest${Date.now()}`,
  password: 'Test@1234',
  phone: '+1234567890'
};

console.log('\n🧪 Testing Backend APIs...\n');
console.log('━'.repeat(60));

// Test 1: Register API
async function testRegister() {
  console.log('\n📝 Test 1: Register API');
  console.log('Endpoint: POST /api/users/register');
  console.log('Data:', JSON.stringify({
    name: testUser.name,
    email: testUser.email,
    username: testUser.username,
    password: '********'
  }, null, 2));

  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });

    const data = await response.json();

    console.log('\n✅ Status:', response.status);
    console.log('📦 Response:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ Register API is WORKING!');
      return { success: true, data, token: data.token || data.data?.token };
    } else {
      console.log('\n⚠️ Register failed but API responded');
      console.log('💡 This might be normal if email already exists');
      return { success: false, data };
    }

  } catch (error) {
    console.log('\n❌ Register API FAILED');
    console.log('Error:', error.message);
    return { success: false, error: error.message };
  }
}

// Test 2: Login API
async function testLogin(email, password) {
  console.log('\n\n🔐 Test 2: Login API');
  console.log('Endpoint: POST /api/users/login');
  console.log('Data:', JSON.stringify({
    email: email,
    password: '********'
  }, null, 2));

  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const data = await response.json();

    console.log('\n✅ Status:', response.status);
    console.log('📦 Response:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ Login API is WORKING!');
      return { success: true, data };
    } else {
      console.log('\n⚠️ Login failed');
      return { success: false, data };
    }

  } catch (error) {
    console.log('\n❌ Login API FAILED');
    console.log('Error:', error.message);
    return { success: false, error: error.message };
  }
}

// Test 3: Check Backend Health
async function testHealth() {
  console.log('\n💚 Test 0: Backend Health Check');
  console.log('Checking: http://localhost:5000');

  try {
    const response = await fetch('http://localhost:5000/api/health');
    const data = await response.json();
    
    console.log('✅ Backend is RUNNING!');
    console.log('Response:', JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.log('❌ Backend is NOT RUNNING!');
    console.log('Error:', error.message);
    console.log('\n💡 Start your backend first:');
    console.log('   cd your-backend');
    console.log('   npm start');
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('\n🚀 Backend API Test Suite');
  console.log('Testing: http://localhost:5000/api\n');
  console.log('━'.repeat(60));

  // Check if backend is running
  const isHealthy = await testHealth();
  if (!isHealthy) {
    console.log('\n❌ Cannot continue - Backend is not running!');
    console.log('━'.repeat(60));
    return;
  }

  console.log('\n━'.repeat(60));

  // Test Register
  const registerResult = await testRegister();
  
  console.log('\n━'.repeat(60));

  // Test Login (if register succeeded)
  if (registerResult.success) {
    await testLogin(testUser.email, testUser.password);
  } else {
    console.log('\n⏭️ Skipping login test (register failed)');
    console.log('💡 Try manually logging in with existing credentials');
  }

  console.log('\n━'.repeat(60));
  console.log('\n📊 Test Summary:\n');

  // Frontend Compatibility Check
  console.log('🔍 Frontend Compatibility:');
  
  if (registerResult.data) {
    console.log('\n📝 Register Response Fields:');
    console.log('Fields found:', Object.keys(registerResult.data).join(', '));
    
    const hasToken = registerResult.data.token || registerResult.data.data?.token;
    const hasUser = registerResult.data.user || registerResult.data.data?.user;
    
    console.log('\n✅ Has token?', hasToken ? 'YES' : 'NO');
    console.log('✅ Has user data?', hasUser ? 'YES' : 'NO');
    
    if (hasToken && hasUser) {
      console.log('\n🎉 PERFECT! Frontend is 100% compatible!');
    } else if (hasToken) {
      console.log('\n⚠️ Token found but no user data');
      console.log('💡 Frontend will work but user info won\'t display');
    } else {
      console.log('\n⚠️ Response format might need frontend adjustment');
    }
  }

  console.log('\n━'.repeat(60));
  console.log('\n✅ Testing Complete!');
  console.log('\n📋 Next Steps:');
  console.log('1. Review the responses above');
  console.log('2. Check if any errors occurred');
  console.log('3. Test frontend with: npm run dev');
  console.log('4. Navigate to /register and /login');
  console.log('\n━'.repeat(60));
}

// Run the tests
runTests().catch(error => {
  console.error('\n❌ Test suite failed:', error);
  process.exit(1);
});

