# ✅ API Integration Checklist

## Quick Setup (5 Minutes)

### 1️⃣ Update API URL
Edit `.env` file:
```env
VITE_API_BASE_URL=http://localhost:YOUR_PORT/api
```
Replace `YOUR_PORT` with your backend's port (e.g., 3000, 5000, 8000)

### 2️⃣ Enable CORS on Your Backend
Add this to your backend:

**Node.js:**
```javascript
app.use(cors({ origin: 'http://localhost:5173' }));
```

**Python:**
```python
CORS(app, origins=['http://localhost:5173'])
```

**PHP:**
```php
header("Access-Control-Allow-Origin: http://localhost:5173");
```

### 3️⃣ Start Both Servers
```bash
# Terminal 1 - Your Backend
cd your-backend-project
npm start  # or python app.py, php -S localhost:5000, etc.

# Terminal 2 - This Frontend
cd E-commerce
npm run dev
```

### 4️⃣ Verify Connection
Open browser → `http://localhost:5173/`

✅ **Green banner** = Working!  
⚠️ **Yellow banner** = Backend not connected

---

## Minimum API Requirements

Your backend needs **just 1 endpoint** to start:

```
GET /api/products
```

Returns:
```json
{
  "data": [
    { "id": 1, "name": "Product", "price": 99 }
  ]
}
```

OR just an array:
```json
[
  { "id": 1, "name": "Product", "price": 99 }
]
```

---

## Field Name Flexibility

Your API can use **any field names**! These are automatically mapped:

| You can use | Will map to |
|------------|-------------|
| `product_id`, `_id` | `id` |
| `title`, `product_name` | `name` |
| `product_price` | `price` |
| `image_url`, `thumbnail` | `image` |

---

## 🔍 Troubleshooting

**CORS Error?**
→ Enable CORS on backend (see step 2)

**API Not Available?**
→ Check backend is running on correct port

**Data not showing?**
→ Check browser console (F12) for errors

---

## 📚 Full Documentation

- `EXTERNAL_API_INTEGRATION.md` - Complete integration guide
- `API_INTEGRATION_GUIDE.md` - All endpoints and formats
- `QUICK_START.md` - How to use this frontend

---

## ✨ That's It!

Your frontend works with **ANY backend API** - just configure the URL and enable CORS!

