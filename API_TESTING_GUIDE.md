# 🧪 API Testing Guide - Login & Register

## 📋 Quick Backend API Verification

### Step 1: Test Register API

**Endpoint**: `POST http://localhost:5000/api/users/register`

**Test with cURL:**
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "username": "testuser",
    "password": "Test@1234",
    "phone": "+1234567890"
  }'
```

**Expected Success Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "name": "Test User",
    "email": "test@example.com",
    "username": "testuser"
  }
}
```

**Common Error Response:**
```json
{
  "success": false,
  "message": "Email already exists",
  "errors": {
    "email": "This email is already registered"
  }
}
```

---

### Step 2: Test Login API

**Endpoint**: `POST http://localhost:5000/api/users/login`

**Test with cURL:**
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234"
  }'
```

**Expected Success Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

**Error Response (Invalid Credentials):**
```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": "Email or password is incorrect"
}
```

---

## 🔍 What Your Backend Should Have

### Register Endpoint Requirements:
```javascript
POST /api/users/register

Required Fields:
- name (string)
- email (string, unique)
- username (string, unique)
- password (string, min 8 chars)

Optional Fields:
- phone (string)

Response Fields:
- success (boolean)
- message (string)
- token (string) - JWT token
- user (object) - User data without password
```

### Login Endpoint Requirements:
```javascript
POST /api/users/login

Required Fields:
- email (string)
- password (string)

Response Fields:
- success (boolean)
- message (string)
- token (string) - JWT token
- user (object) - User data without password
```

---

## ✅ Frontend is Already Configured For:

### Register Page Sends:
```javascript
{
  name: "John Doe",
  email: "john@example.com",
  username: "johndoe123",
  password: "SecurePass123!",
  phone: "+1234567890" // Optional
}
```

### Login Page Sends:
```javascript
{
  email: "john@example.com",
  password: "SecurePass123!"
}
```

---

## 🧪 Testing Checklist

### Backend Testing (Do First):

#### Test 1: Health Check
```bash
curl http://localhost:5000/api/health
```
**Expected**: Server is running message

#### Test 2: Register New User
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test User",
    "email": "apitest@example.com",
    "username": "apitest",
    "password": "Test@1234"
  }'
```
**Expected**: Success response with token

#### Test 3: Register Duplicate (Should Fail)
```bash
# Use same email as Test 2
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test User",
    "email": "apitest@example.com",
    "username": "apitest2",
    "password": "Test@1234"
  }'
```
**Expected**: Error - Email already exists

#### Test 4: Login with Registered User
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "apitest@example.com",
    "password": "Test@1234"
  }'
```
**Expected**: Success response with token

#### Test 5: Login with Wrong Password
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "apitest@example.com",
    "password": "WrongPassword"
  }'
```
**Expected**: Error - Invalid credentials

---

### Frontend Testing (After Backend Works):

#### Test 1: Register Flow
1. Start frontend: `npm run dev`
2. Open: `http://localhost:5173/register`
3. Fill form:
   - Name: Frontend Test
   - Username: fronttest
   - Email: fronttest@example.com
   - Password: Test@1234
   - Confirm: Test@1234
4. Click "Create Account"
5. **Expected**: Success message + redirect

#### Test 2: Login Flow
1. Open: `http://localhost:5173/login`
2. Fill form:
   - Email: fronttest@example.com
   - Password: Test@1234
3. Click "Sign In"
4. **Expected**: Success message + redirect to home

#### Test 3: Login with Wrong Credentials
1. Open: `http://localhost:5173/login`
2. Fill form:
   - Email: fronttest@example.com
   - Password: WrongPassword
3. Click "Sign In"
4. **Expected**: Red error message

---

## 🔧 Common Backend Response Formats

### Option 1: With "data" wrapper
```json
{
  "success": true,
  "data": {
    "token": "...",
    "user": {...}
  }
}
```

### Option 2: Direct format (Currently supported)
```json
{
  "success": true,
  "token": "...",
  "user": {...}
}
```

### Option 3: Simple format
```json
{
  "token": "...",
  "user": {...}
}
```

**Our frontend supports all three!** ✅

---

## 🐛 Troubleshooting

### Issue: "Network Error" in Frontend

**Check:**
1. Is backend running?
   ```bash
   curl http://localhost:5000/api/health
   ```

2. CORS enabled in backend?
   ```javascript
   app.use(cors({
     origin: 'http://localhost:5173',
     credentials: true
   }));
   ```

3. Correct endpoint URL?
   - Backend should be: `http://localhost:5000`
   - Frontend expects: `http://localhost:5000/api/users/register`

---

### Issue: "400 Bad Request"

**Check:**
1. Request body format correct?
2. All required fields sent?
3. Check backend console for validation errors

**Frontend Console:**
```javascript
// Open browser console (F12)
// Look for request in Network tab
// Check Request Payload
```

---

### Issue: "500 Internal Server Error"

**Check:**
1. Backend console for error logs
2. Database connection working?
3. Password hashing configured?
4. JWT secret set in backend .env?

---

## 📝 What Backend Needs

### 1. Environment Variables (.env)
```env
PORT=5000
JWT_SECRET=your_secret_key_here
DATABASE_URL=your_database_url
FRONTEND_URL=http://localhost:5173
```

### 2. CORS Configuration
```javascript
const cors = require('cors');
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

### 3. JSON Parser
```javascript
app.use(express.json());
```

### 4. Password Hashing
```javascript
const bcrypt = require('bcryptjs');

// Before saving
const hashedPassword = await bcrypt.hash(password, 10);

// When logging in
const isValid = await bcrypt.compare(password, user.password);
```

### 5. JWT Token Generation
```javascript
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
```

---

## 🎯 Complete Testing Flow

### Step-by-Step:

1. **Start Backend**
   ```bash
   cd your-backend
   npm start
   ```

2. **Test Backend with cURL** (all tests above)
   - If all pass ✅ → Backend is ready
   - If any fail ❌ → Fix backend first

3. **Start Frontend**
   ```bash
   cd E-commerce
   npm run dev
   ```

4. **Test Registration**
   - Open: `http://localhost:5173/register`
   - Register new user
   - Check success

5. **Test Login**
   - Open: `http://localhost:5173/login`
   - Login with registered user
   - Check success + redirect

6. **Check Browser Console (F12)**
   - No red errors? ✅ Working
   - See errors? 👇 Check below

---

## 📊 Success Indicators

### Backend Working If:
- ✅ cURL commands return JSON
- ✅ No 500 errors
- ✅ Token is generated
- ✅ User saved in database
- ✅ CORS headers present

### Frontend Working If:
- ✅ Forms submit without errors
- ✅ Success messages show
- ✅ Redirect after success
- ✅ Errors show when expected
- ✅ Token saved in localStorage

---

## 🔐 Security Checklist

Backend Should Have:
- [ ] Password hashing (bcrypt)
- [ ] JWT token generation
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] Rate limiting
- [ ] HTTPS in production
- [ ] Environment variables for secrets

---

## 📞 Quick Debug Commands

**Check if backend is running:**
```bash
curl http://localhost:5000
```

**Check specific endpoint:**
```bash
curl http://localhost:5000/api/users/register
```

**Test with Postman:**
1. Create POST request
2. URL: `http://localhost:5000/api/users/register`
3. Body: JSON with user data
4. Send and check response

**Check browser console:**
1. Open page (F12)
2. Go to Console tab
3. Look for errors
4. Go to Network tab
5. Submit form
6. Check request/response

---

## ✅ Ready to Test?

### Quick Start:
1. ✅ Backend running on port 5000
2. ✅ Frontend running on port 5173
3. ✅ Both terminals open
4. ✅ Browser console open (F12)
5. ✅ Ready to test!

### Test Order:
1. Backend cURL tests (ensure backend works)
2. Frontend register (create new user)
3. Frontend login (login with created user)
4. Check console for any errors
5. Verify token in localStorage

---

**All commands and formats are ready!** 🚀
**Just run the tests and let me know what happens!** 😊

