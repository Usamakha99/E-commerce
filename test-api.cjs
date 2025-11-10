// Simple API Tester for Windows
// Run: node test-api.cjs

const http = require('http');

console.log('\n🧪 Testing Backend API...\n');

// Test data
const testData = JSON.stringify({
  name: 'Test User',
  email: 'test@test.com',
  username: 'testuser',
  password: 'Test@1234'
});

// Options for HTTP request
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/users/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': testData.length
  }
};

// Make request
const req = http.request(options, (res) => {
  console.log(`📊 Status Code: ${res.statusCode}\n`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📥 Response:');
    console.log(data);
    console.log('\n');
    
    if (res.statusCode === 404) {
      console.log('❌ 404 Error - Route NOT registered in backend!');
      console.log('\n📝 SOLUTION: Add this to your server.js:');
      console.log('━'.repeat(60));
      console.log('\ntry {');
      console.log('  const userRoutes = require("./routes/userRoutes");');
      console.log('  app.use("/api/users", userRoutes);');
      console.log('  console.log("✅ User routes registered");');
      console.log('} catch (error) {');
      console.log('  console.error("❌ Error:", error.message);');
      console.log('}');
      console.log('\n' + '━'.repeat(60));
      console.log('\nAdd this AFTER analytics routes (around line 120)');
      console.log('Then restart backend: npm start\n');
    } else if (res.statusCode === 200 || res.statusCode === 201) {
      console.log('✅ SUCCESS! Route is working!');
    } else if (res.statusCode === 400) {
      console.log('⚠️ Route exists but validation error (this is OK!)');
      console.log('✅ Route is registered correctly!');
    } else {
      console.log(`⚠️ Got response with status ${res.statusCode}`);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Connection Error:', error.message);
  console.log('\n💡 Make sure backend is running on port 5000!');
  console.log('   cd your-backend');
  console.log('   npm start\n');
});

req.write(testData);
req.end();

