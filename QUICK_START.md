# Quick Start Guide

## ✅ What Was Fixed

Your frontend was stopping/crashing because it was trying to connect to the backend API immediately on load, but the backend wasn't running. I've fixed this by:

1. **Better Error Handling** - The app now gracefully handles API failures
2. **API Status Indicator** - You can see if your backend is connected
3. **Fallback Data** - Demo products display when API is unavailable
4. **Prevented Auto-Fetch** - Cart won't try to load on startup

## 🚀 How to Use

### Option 1: With Backend API (Recommended)

1. **Start your backend server** on `http://localhost:5000`:
   ```bash
   # In your backend project directory
   npm start
   # or
   python app.py
   # or whatever command runs your backend
   ```

2. **Start the frontend** (in this directory):
   ```bash
   npm run dev
   ```

3. **Open browser** at `http://localhost:5173/`
   - You should see a **green "✅ API Connected!"** message
   - Products will load from your backend API

### Option 2: Without Backend (Development Mode)

1. **Just start the frontend**:
   ```bash
   npm run dev
   ```

2. **Open browser** at `http://localhost:5173/`
   - You'll see a **yellow "⚠️ API Not Available"** message
   - Demo products will display
   - Everything works, but data is static

## 📊 What You'll See

### When Backend is Running:
```
✅ API Connected! Loading data from: http://localhost:5000/api
```
- Real products from your database
- Cart operations work
- All CRUD operations functional

### When Backend is NOT Running:
```
⚠️ API Not Available
Backend API at http://localhost:5000/api is not responding.
Using demo data for display. Start your backend server to see live data.
```
- Demo/fallback products display
- App still works for UI testing
- No crashes or errors

## 🔧 Configuration

The API URL is configured in `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Change this if your backend runs on a different port:
- `http://localhost:3000/api`
- `http://localhost:8000/api`
- `https://your-api.com/api`

**Remember:** After changing `.env`, restart the dev server!

## 📝 API Endpoints Expected

Your backend should have these endpoints:

- `GET /api/products` - List all products
- `GET /api/products/:id` - Get single product
- `GET /api/cart` - Get cart items
- `POST /api/cart/add` - Add to cart
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

See `API_INTEGRATION_GUIDE.md` for complete endpoint documentation.

## 🐛 Troubleshooting

### Frontend loads but shows "API Not Available"
- ✅ This is normal if backend isn't running
- ✅ Start your backend server
- ✅ Check backend is on `http://localhost:5000`

### "CORS Error" in console
Your backend needs CORS enabled:
```javascript
// Express.js example
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173'
}));
```

### Products not loading from API
1. Check backend is running: `http://localhost:5000/api/products`
2. Open browser DevTools → Network tab
3. Look for failed requests
4. Check backend logs for errors

## 🎉 You're Ready!

Your app now:
- ✅ Won't crash if backend is offline
- ✅ Shows clear API connection status
- ✅ Works in development mode without backend
- ✅ Automatically connects when backend is available
- ✅ Handles errors gracefully

**Start developing!** 🚀

