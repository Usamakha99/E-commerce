# 🔧 Backend Code for Your CRM

## ⚠️ Current Issue
```
Error: 404 Not Found
Endpoint: POST /api/auth/register
```

**Problem:** Backend mein yeh endpoint exist nahi karta  
**Solution:** Neeche diye gaye code ko apne backend mein add karo

---

## 📝 Step 1: Install Required Packages

Apne CRM backend folder mein:

```bash
npm install bcryptjs jsonwebtoken
```

---

## 🔐 Step 2: Add to Your Backend .env File

```env
# JWT Secret (koi bhi random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Token Expiry
JWT_EXPIRES_IN=7d
```

---

## 📁 Step 3: Add Auth Routes to Your Backend

### Option A: Add Directly to Main Server File

Apni `server.js` ya `app.js` mein yeh code add karo:

```javascript
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ============================================
// REGISTER ENDPOINT
// ============================================
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, username, password, phone } = req.body;

    // Validation
    if (!name || !email || !username || !password) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided',
        errors: {
          name: !name ? 'Name is required' : undefined,
          email: !email ? 'Email is required' : undefined,
          username: !username ? 'Username is required' : undefined,
          password: !password ? 'Password is required' : undefined
        }
      });
    }

    // Email validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
        errors: { email: 'Email is invalid' }
      });
    }

    // Password length check
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password too short',
        errors: { password: 'Password must be at least 8 characters' }
      });
    }

    // Check if email already exists
    // REPLACE THIS WITH YOUR DATABASE QUERY
    // Example with Mongoose:
    // const existingUser = await User.findOne({ email });
    
    // For now, using placeholder:
    const existingUser = null; // Replace with your DB query
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
        errors: { email: 'This email is already in use' }
      });
    }

    // Check if username already exists
    // REPLACE THIS WITH YOUR DATABASE QUERY
    const existingUsername = null; // Replace with your DB query
    
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username already taken',
        errors: { username: 'This username is not available' }
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user object
    const newUser = {
      name,
      email,
      username,
      password: hashedPassword,
      phone: phone || null,
      createdAt: new Date()
    };

    // Save to database
    // REPLACE THIS WITH YOUR DATABASE SAVE
    // Example with Mongoose:
    // const user = await User.create(newUser);
    
    // For now, creating mock user:
    const savedUser = {
      id: Date.now().toString(),
      ...newUser,
      password: undefined // Don't send password back
    };

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: savedUser.id,
        email: savedUser.email,
        username: savedUser.username
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Success response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token: token,
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        username: savedUser.username,
        phone: savedUser.phone
      }
    });

    console.log('✅ New user registered:', savedUser.email);

  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// ============================================
// LOGIN ENDPOINT
// ============================================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
        errors: {
          email: !email ? 'Email is required' : undefined,
          password: !password ? 'Password is required' : undefined
        }
      });
    }

    // Find user by email
    // REPLACE THIS WITH YOUR DATABASE QUERY
    // Example with Mongoose:
    // const user = await User.findOne({ email }).select('+password');
    
    // For now, using placeholder:
    const user = null; // Replace with your DB query
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        error: 'Email or password is incorrect'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        error: 'Email or password is incorrect'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id || user._id,
        email: user.email,
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Success response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: token,
      user: {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        phone: user.phone
      }
    });

    console.log('✅ User logged in:', user.email);

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});
```

---

### Option B: Create Separate Auth Routes File (Better Organization)

**Create:** `routes/auth.js`

```javascript
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
  // ... Same code as above
});

// Login
router.post('/login', async (req, res) => {
  // ... Same code as above
});

module.exports = router;
```

**Then in your main server file:**

```javascript
const authRoutes = require('./routes/auth');

// Use auth routes
app.use('/api/auth', authRoutes);
```

---

## 🗄️ Step 4: Database Integration

Replace the placeholder database queries with your actual DB:

### If Using MongoDB/Mongoose:

```javascript
const User = require('./models/User'); // Your User model

// Check existing email
const existingUser = await User.findOne({ email });

// Check existing username
const existingUsername = await User.findOne({ username });

// Save new user
const user = await User.create(newUser);

// Find user for login
const user = await User.findOne({ email }).select('+password');
```

### If Using MySQL/PostgreSQL:

```javascript
const db = require('./db'); // Your DB connection

// Check existing email
const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
const existingUser = existingUsers[0];

// Check existing username
const [existingUsernames] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
const existingUsername = existingUsernames[0];

// Save new user
const [result] = await db.query(
  'INSERT INTO users (name, email, username, password, phone) VALUES (?, ?, ?, ?, ?)',
  [name, email, username, hashedPassword, phone]
);

// Find user for login
const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
const user = users[0];
```

---

## ✅ Step 5: Test Backend

### Test Register:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Backend Test",
    "email": "backendtest@test.com",
    "username": "backendtest",
    "password": "Test@1234"
  }'
```

**Expected:** Status 201 with token

### Test Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "backendtest@test.com",
    "password": "Test@1234"
  }'
```

**Expected:** Status 200 with token

---

## 🎯 Quick Copy-Paste Code

### Minimal Working Register Endpoint:

```javascript
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    
    // Basic validation
    if (!name || !email || !username || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // TODO: Check if email exists in your database
    // TODO: Check if username exists in your database
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // TODO: Save user to your database
    // const user = await YourDB.createUser({...});
    
    // Generate token
    const token = jwt.sign(
      { email, username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    // Return success
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token: token,
      user: { name, email, username }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
```

### Minimal Working Login Endpoint:

```javascript
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // TODO: Find user in your database
    // const user = await YourDB.findUserByEmail(email);
    
    // For testing (REMOVE THIS):
    const user = { 
      email: 'test@test.com', 
      password: await bcrypt.hash('Test@1234', 10),
      name: 'Test User'
    };
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Generate token
    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    // Return success
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: token,
      user: { name: user.name, email: user.email }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
```

---

## 🚀 Quick Integration Steps

### 1. Open Your Backend Main File
```bash
# Usually one of these:
server.js
app.js
index.js
src/server.js
```

### 2. Add These Lines at Top
```javascript
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
```

### 3. Add the Two Endpoints
- Copy register endpoint code
- Copy login endpoint code
- Paste before your `app.listen()`

### 4. Replace Database Placeholders
```javascript
// Find this comment:
// TODO: Check if email exists in your database

// Replace with your actual DB query:
const existingUser = await User.findOne({ email });
// OR
const existingUser = await db.query('SELECT * FROM users WHERE email = ?', [email]);
```

### 5. Restart Backend
```bash
# Stop: Ctrl+C
# Start:
npm start
```

---

## ✅ Verify Endpoints Exist

```bash
# Should return validation error (not 404)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{}'
```

**If you get 404:** Endpoint not added yet  
**If you get 400:** Endpoint exists! ✅

---

## 📋 Complete Example for Express Backend

```javascript
// server.js or app.js

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// ============================================
// AUTH ROUTES
// ============================================

// Register
app.post('/api/auth/register', async (req, res) => {
  // ... (Use code from above)
});

// Login
app.post('/api/auth/login', async (req, res) => {
  // ... (Use code from above)
});

// ============================================
// YOUR EXISTING ROUTES
// ============================================
// ... your existing product routes, etc.

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
```

---

## 🎯 What Frontend is Already Sending

### Register Request:
```javascript
POST http://localhost:5000/api/auth/register

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "Test@1234",
  "phone": "+1234567890"
}
```

### Login Request:
```javascript
POST http://localhost:5000/api/auth/login

Body:
{
  "email": "john@example.com",
  "password": "Test@1234"
}
```

**Your backend just needs to handle these!** ✅

---

## 🧪 Testing After Adding Code

### Test 1:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","username":"test","password":"Test@1234"}'
```

**Expected:** 201 status with token

### Test 2:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test@1234"}'
```

**Expected:** 200 status with token

---

## 📞 Need Help?

**Tell me:**
1. What database are you using? (MongoDB, MySQL, PostgreSQL, etc.)
2. Do you already have a User model/table?
3. Is JWT configured in your backend?

**I'll give you exact code for your setup!** 🚀

---

**Add this code to your backend and test!** ✅

