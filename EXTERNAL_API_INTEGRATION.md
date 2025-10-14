# External API Integration Guide

## ✅ YES! Your Frontend Works with ANY Backend API!

This e-commerce frontend can connect to **any REST API** from another project, regardless of the technology stack.

## 🔌 Quick Integration Steps

### **1. Update API URL**

Edit `.env` file in the project root:

```env
# Local backend on different port
VITE_API_BASE_URL=http://localhost:3000/api

# Backend on network
VITE_API_BASE_URL=http://192.168.1.100:8000/api

# Production backend
VITE_API_BASE_URL=https://api.yourbackend.com/api
```

**Important:** After changing `.env`, restart the dev server:
```bash
npm run dev
```

### **2. Enable CORS on Your Backend**

Your backend **MUST** allow requests from `http://localhost:5173`

<details>
<summary><strong>Node.js / Express</strong></summary>

```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for frontend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));

// Your routes
app.get('/api/products', (req, res) => {
  res.json({
    data: [
      { id: 1, name: 'Product 1', price: 99.99 }
    ]
  });
});

app.listen(5000, () => console.log('Server on port 5000'));
```

Install CORS: `npm install cors`
</details>

<details>
<summary><strong>Python / Flask</strong></summary>

```python
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS
CORS(app, origins=['http://localhost:5173'])

@app.route('/api/products', methods=['GET'])
def get_products():
    return jsonify({
        'data': [
            {'id': 1, 'name': 'Product 1', 'price': 99.99}
        ]
    })

if __name__ == '__main__':
    app.run(port=5000)
```

Install CORS: `pip install flask-cors`
</details>

<details>
<summary><strong>Python / Django</strong></summary>

```python
# settings.py
INSTALLED_APPS = [
    'corsheaders',
    # ... other apps
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # ... other middleware
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]

CORS_ALLOW_CREDENTIALS = True
```

Install: `pip install django-cors-headers`
</details>

<details>
<summary><strong>PHP / Laravel</strong></summary>

```php
// app/Http/Middleware/Cors.php
namespace App\Http\Middleware;

use Closure;

class Cors
{
    public function handle($request, Closure $next)
    {
        return $next($request)
            ->header('Access-Control-Allow-Origin', 'http://localhost:5173')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
}
```

Register in `app/Http/Kernel.php`
</details>

<details>
<summary><strong>PHP (Plain)</strong></summary>

```php
<?php
// At the top of your API file
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Your API logic
$products = [
    ['id' => 1, 'name' => 'Product 1', 'price' => 99.99]
];

echo json_encode(['data' => $products]);
?>
```
</details>

<details>
<summary><strong>Java / Spring Boot</strong></summary>

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowCredentials(true);
    }
}
```
</details>

<details>
<summary><strong>.NET / ASP.NET Core</strong></summary>

```csharp
// Program.cs or Startup.cs
public void ConfigureServices(IServiceCollection services)
{
    services.AddCors(options =>
    {
        options.AddPolicy("AllowFrontend",
            builder => builder
                .WithOrigins("http://localhost:5173")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials());
    });
}

public void Configure(IApplicationBuilder app)
{
    app.UseCors("AllowFrontend");
    // ... other middleware
}
```
</details>

### **3. Required API Endpoints**

At minimum, your backend needs:

#### **Products List** (Required)
```
GET /api/products
```

**Response Format (any of these work):**

Option 1 - Wrapped response:
```json
{
  "data": [
    {
      "id": 1,
      "name": "Product Name",
      "price": 99.99
    }
  ]
}
```

Option 2 - Direct array:
```json
[
  {
    "id": 1,
    "name": "Product Name",
    "price": 99.99
  }
]
```

Option 3 - Different structure (will be auto-mapped):
```json
{
  "products": [
    {
      "product_id": 1,
      "product_name": "Product Name",
      "product_price": 99.99
    }
  ]
}
```

#### **Single Product** (Required for product detail page)
```
GET /api/products/:id
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "name": "Product Name",
    "price": 99.99,
    "description": "Product description"
  }
}
```

#### **Cart Endpoints** (Optional)
```
GET    /api/cart           - Get cart items
POST   /api/cart/add       - Add to cart
PUT    /api/cart/:id       - Update cart item
DELETE /api/cart/:id       - Remove from cart
```

#### **Auth Endpoints** (Optional)
```
POST /api/auth/login      - User login
POST /api/auth/register   - User registration
```

## 🔄 Data Mapping

If your API returns different field names, the frontend will **automatically map** them using `src/utils/dataMapper.js`.

### Supported Field Variations:

| Frontend Expects | Your API Can Return |
|-----------------|-------------------|
| `id` | `id`, `_id`, `product_id` |
| `name` | `name`, `title`, `product_name` |
| `price` | `price`, `product_price` |
| `image` | `image`, `image_url`, `thumbnail` |
| `brand` | `brand`, `manufacturer` |

### Custom Mapping

If your API uses completely different field names, edit `src/utils/dataMapper.js`:

```javascript
export const mapProduct = (externalProduct) => {
  return {
    id: externalProduct.YOUR_ID_FIELD,
    name: externalProduct.YOUR_NAME_FIELD,
    price: externalProduct.YOUR_PRICE_FIELD,
    // ... customize as needed
  };
};
```

## 🧪 Testing Your Integration

### Step 1: Start Your Backend
```bash
# In your backend project directory
npm start
# or
python app.py
# or whatever command starts your backend
```

### Step 2: Start Frontend
```bash
# In this E-commerce directory
npm run dev
```

### Step 3: Check Connection
1. Open browser to `http://localhost:5173/`
2. Look for the API status banner:
   - ✅ **Green** = Connected successfully
   - ⚠️ **Yellow** = Backend not available

### Step 4: Debug Issues
1. Open Browser DevTools (F12)
2. Go to **Console** tab - check for errors
3. Go to **Network** tab - see actual API requests
4. Check response data format

## 🔧 Common Issues & Solutions

### ❌ CORS Error
```
Access to fetch at 'http://localhost:5000/api/products' from origin 
'http://localhost:5173' has been blocked by CORS policy
```

**Solution:** Enable CORS on your backend (see examples above)

---

### ❌ Network Error / API Not Available
```
⚠️ API Not Available
```

**Solutions:**
1. Check backend is running
2. Verify correct port in `.env`
3. Test API directly: `http://localhost:5000/api/products`
4. Check firewall settings

---

### ❌ Data Not Displaying
Products load but don't show correctly.

**Solutions:**
1. Check browser console for mapping errors
2. Compare your API response to expected format
3. Update `src/utils/dataMapper.js` to match your fields
4. Check response in Network tab of DevTools

---

### ❌ Images Not Loading
Products show but images broken.

**Solutions:**
1. Use full URLs in image fields: `https://example.com/image.jpg`
2. Or configure backend to serve static files
3. Check CORS for image hosting domain

## 📊 Example Backend Implementations

### Minimal Node.js API (Express)

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Sample data
const products = [
  { id: 1, name: 'Laptop', price: 999.99, brand: 'Dell' },
  { id: 2, name: 'Mouse', price: 29.99, brand: 'Logitech' },
  { id: 3, name: 'Keyboard', price: 79.99, brand: 'Corsair' }
];

// Get all products
app.get('/api/products', (req, res) => {
  res.json({ data: products });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  res.json({ data: product });
});

app.listen(5000, () => console.log('API running on http://localhost:5000'));
```

Save as `server.js`, install dependencies, and run:
```bash
npm init -y
npm install express cors
node server.js
```

### Minimal Python API (Flask)

```python
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['http://localhost:5173'])

products = [
    {'id': 1, 'name': 'Laptop', 'price': 999.99, 'brand': 'Dell'},
    {'id': 2, 'name': 'Mouse', 'price': 29.99, 'brand': 'Logitech'},
    {'id': 3, 'name': 'Keyboard', 'price': 79.99, 'brand': 'Corsair'}
]

@app.route('/api/products', methods=['GET'])
def get_products():
    return jsonify({'data': products})

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = next((p for p in products if p['id'] == product_id), None)
    return jsonify({'data': product})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
```

Install dependencies and run:
```bash
pip install flask flask-cors
python app.py
```

## ✅ Checklist

Before integrating your API, make sure:

- [ ] Backend is running and accessible
- [ ] CORS is enabled for `http://localhost:5173`
- [ ] `/api/products` endpoint returns products (array or object with data field)
- [ ] `/api/products/:id` endpoint returns single product
- [ ] `.env` file has correct `VITE_API_BASE_URL`
- [ ] Development server restarted after `.env` changes
- [ ] Response contains at minimum: `id`, `name`, `price`

## 🎉 You're Ready!

Your frontend will now:
- ✅ Connect to your backend API automatically
- ✅ Show green status when connected
- ✅ Map different field names automatically
- ✅ Handle errors gracefully
- ✅ Work with any backend technology

**Need help?** Check the browser console and network tab for detailed error messages!

