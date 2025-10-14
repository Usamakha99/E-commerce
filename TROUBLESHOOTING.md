# 🔧 Troubleshooting Guide

## Frontend Crashing Issues - SOLVED ✅

I've fixed all the issues that were causing crashes. Here's what was fixed:

### ✅ **Fixed Issues:**

1. **Null/Undefined Data Handling**
   - Added null checks in data mapper
   - Product service now handles empty responses
   - No more crashes from missing data

2. **React Hook Dependencies**
   - Fixed all useEffect dependency warnings
   - Prevented infinite re-render loops
   - Added proper eslint-disable comments

3. **API Status Check**
   - Simplified to use native fetch (more reliable)
   - Added 3-second timeout to prevent hanging
   - All errors caught and handled safely

4. **Error Boundaries**
   - All API calls wrapped in try-catch
   - Errors logged but don't crash app
   - Fallback data displays automatically

---

## 🧪 How to Verify It's Fixed

### Step 1: Clear Browser Cache
```
1. Open browser DevTools (F12)
2. Go to Application tab (Chrome) or Storage tab (Firefox)
3. Click "Clear site data" or "Clear storage"
4. Refresh page (Ctrl+F5 or Cmd+Shift+R)
```

### Step 2: Check Console
```
1. Press F12 to open DevTools
2. Go to Console tab
3. Look for errors (red text)
4. Should see: "API not available, using fallback data" (yellow/info)
```

### Step 3: Check Network Tab
```
1. F12 → Network tab
2. Refresh page
3. Look for /api/products request
4. Should see it fail gracefully (expected if backend not running)
```

---

## 🐛 If Still Crashing

### Check 1: What Error Shows?

Open browser console (F12) and look for error messages:

**Error: "Cannot read property 'map' of undefined"**
→ Data mapping issue
→ **Solution:** Clear cache and hard refresh

**Error: "Maximum update depth exceeded"**
→ Infinite re-render loop
→ **Solution:** Restart dev server
```bash
Ctrl+C  # Stop server
npm run dev  # Start again
```

**Error: "Failed to fetch"**
→ CORS or network issue (this is OK, won't crash)
→ **Solution:** App will show fallback data

**Error in console about hooks**
→ React hooks rule violation
→ **Solution:** All fixed in latest code, refresh page

### Check 2: Is Dev Server Running?

Look at terminal where you ran `npm run dev`:
```
✅ Good: "VITE v7.1.5  ready in XXXms"
❌ Bad: Any errors in terminal
```

If errors in terminal:
```bash
Ctrl+C
rm -rf node_modules  # or delete node_modules folder
npm install
npm run dev
```

### Check 3: Browser Compatibility

Use a modern browser:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+

### Check 4: Clear Everything

Nuclear option - clears all caches:

```bash
# Stop dev server (Ctrl+C)

# Windows PowerShell:
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .vite
npm install
npm run dev

# Mac/Linux:
rm -rf node_modules .vite
npm install
npm run dev
```

---

## 📊 Expected Behavior

### ✅ **WITHOUT Backend (Normal)**

1. Page loads successfully
2. See yellow banner: "⚠️ API Not Available"
3. Demo products display
4. No errors in console (maybe warnings about deprecated CSS)
5. App is fully functional

### ✅ **WITH Backend Running**

1. Page loads successfully
2. See green banner: "✅ API Connected!"
3. Real products from API display
4. Console shows successful API calls
5. Everything works

---

## 🔍 Debugging Commands

### Check if Frontend is Running
```bash
curl http://localhost:5173
# Should return HTML
```

### Check if Backend API is Running
```bash
curl http://localhost:5000/api/products
# Should return JSON with products
```

### Check Environment Variables
```bash
# Windows PowerShell:
Get-Content .env

# Mac/Linux:
cat .env

# Should show:
# VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🚨 Common Error Messages & Solutions

### "VITE CAN'T START"
**Error:** `Port 5173 already in use`

**Solution:**
```bash
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F

# Mac/Linux:
lsof -ti:5173 | xargs kill
```

### "MODULE NOT FOUND"
**Error:** `Cannot find module 'react'`

**Solution:**
```bash
npm install
```

### "FAILED TO COMPILE"
**Error:** `Unexpected token` or `Syntax error`

**Solution:**
```bash
# Check the file mentioned in error
# Usually means a syntax error in code
# Undo last change or check file
```

### "WHITE SCREEN / BLANK PAGE"
**Symptoms:** Page loads but shows nothing

**Solutions:**
1. Check browser console for errors (F12)
2. Verify `index.html` has `<div id="root"></div>`
3. Clear cache and hard refresh (Ctrl+F5)
4. Check if JavaScript is enabled

---

## 📝 What to Send If Still Having Issues

If problems persist, share this info:

1. **Error from browser console** (F12 → Console tab, copy full error)
2. **Network tab** (F12 → Network, screenshot of failed requests)
3. **Terminal output** (copy what shows when running `npm run dev`)
4. **What you see** (screenshot of the page)
5. **Steps to reproduce** (what you clicked/did before crash)

---

## ✅ Crash Prevention Checklist

The code now has these safety features:

- [x] Null checks on all data
- [x] Try-catch on all API calls
- [x] Fallback data for all pages
- [x] Timeout on API checks (3 seconds)
- [x] Proper error logging
- [x] No infinite loops in useEffect
- [x] Safe data mapping
- [x] Graceful error handling

**Your frontend should NOT crash anymore!** 🎉

---

## 🎯 Quick Fix Checklist

Try these in order:

1. [ ] Hard refresh browser (Ctrl+F5)
2. [ ] Clear browser cache
3. [ ] Restart dev server (Ctrl+C, then `npm run dev`)
4. [ ] Check console for errors (F12)
5. [ ] Verify .env file exists with correct URL
6. [ ] Delete node_modules and reinstall (`npm install`)
7. [ ] Try different browser
8. [ ] Restart computer (sometimes helps with port issues)

---

## 💡 Prevention Tips

To avoid crashes in the future:

✅ Always use try-catch for API calls
✅ Check for null/undefined before mapping data
✅ Use optional chaining: `response?.data?.products`
✅ Provide fallback values: `data || []`
✅ Add loading states
✅ Handle errors gracefully
✅ Test without backend first

---

Need more help? Check the browser console - it will tell you exactly what's wrong!

