# Backend API Integration Guide

This guide explains how to integrate your backend API with this e-commerce frontend project.

## 🚀 Quick Start

### Step 1: Install Dependencies

The required dependencies have already been installed:
- `axios` - for making HTTP requests

### Step 2: Configure Your API URL

1. Create a `.env` file in the root directory:
   ```bash
   # Copy the example file
   cp .env.example .env
   ```

2. Edit `.env` and set your backend API URL:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

   Replace `http://localhost:5000/api` with your actual backend URL.

### Step 3: Restart Development Server

After creating/updating the `.env` file:
```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── config/
│   └── api.config.js          # API configuration and endpoints
├── services/
│   ├── api.service.js         # Base API service with interceptors
│   ├── product.service.js     # Product-related API calls
│   ├── cart.service.js        # Shopping cart API calls
│   ├── auth.service.js        # Authentication API calls
│   ├── order.service.js       # Order management API calls
│   └── wishlist.service.js    # Wishlist API calls
├── hooks/
│   ├── useProducts.js         # Hook for fetching products
│   ├── useProduct.js          # Hook for fetching single product
│   └── useCart.js             # Hook for cart management
└── pages/
    ├── ShopGrid.jsx           # Updated to use API
    └── ProductDetail.jsx      # Updated to use API
```

## 🔧 API Configuration

### Base Configuration (`src/config/api.config.js`)

The API configuration includes:
- Base URL from environment variable
- Timeout settings (30 seconds)
- Default headers
- Endpoint definitions

### Available Endpoints

```javascript
// Products
GET    /products                    // Get all products
GET    /products/:id                // Get single product
GET    /products/search?q=term      // Search products
POST   /products/filter             // Filter products
GET    /products/categories         // Get categories

// Cart
GET    /cart                        // Get cart
POST   /cart/add                    // Add to cart
PUT    /cart/:id                    // Update cart item
DELETE /cart/:id                    // Remove from cart
DELETE /cart/clear                  // Clear cart

// Orders
POST   /orders                      // Create order
GET    /orders                      // Get all orders
GET    /orders/:id                  // Get single order
POST   /orders/:id/cancel           // Cancel order

// Authentication
POST   /auth/login                  // Login
POST   /auth/register               // Register
GET    /users/profile               // Get profile
PUT    /users/profile               // Update profile

// Wishlist
GET    /wishlist                    // Get wishlist
POST   /wishlist/add                // Add to wishlist
DELETE /wishlist/:id                // Remove from wishlist

// Reviews
GET    /products/:id/reviews        // Get product reviews
POST   /reviews                     // Create review
PUT    /reviews/:id                 // Update review
DELETE /reviews/:id                 // Delete review
```

## 💡 Usage Examples

### Using Services Directly

```javascript
import { productService } from './services/product.service';

// Get all products
const products = await productService.getAllProducts();

// Get products with filters
const filteredProducts = await productService.getAllProducts({
  category: 'electronics',
  minPrice: 100,
  maxPrice: 500,
  page: 1,
  limit: 20
});

// Get single product
const product = await productService.getProductById(123);

// Search products
const searchResults = await productService.searchProducts('laptop');
```

### Using Custom Hooks (Recommended)

```javascript
import { useProducts } from './hooks/useProducts';

function ProductList() {
  const { products, loading, error, fetchProducts } = useProducts({
    filters: { category: 'electronics' },
    autoFetch: true
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Shopping Cart

```javascript
import { useCart } from './hooks/useCart';

function AddToCartButton({ productId }) {
  const { addToCart, loading } = useCart();

  const handleClick = async () => {
    try {
      await addToCart(productId, 1);
      alert('Added to cart!');
    } catch (error) {
      alert('Failed to add to cart');
    }
  };

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

### Authentication

```javascript
import { authService } from './services/auth.service';

// Login
const login = async (email, password) => {
  try {
    const response = await authService.login(email, password);
    console.log('Logged in:', response.user);
  } catch (error) {
    console.error('Login failed:', error);
  }
};

// Check if authenticated
const isLoggedIn = authService.isAuthenticated();

// Get current user
const user = authService.getCurrentUser();

// Logout
authService.logout();
```

## 📊 Expected API Response Format

### Products List Response
```json
{
  "data": [
    {
      "id": 1,
      "name": "Product Name",
      "price": 99.99,
      "originalPrice": 129.99,
      "discount": 23,
      "brand": "Brand Name",
      "image": "https://example.com/image.jpg",
      "rating": 4.5,
      "reviews": 123,
      "features": ["Feature 1", "Feature 2"]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 30,
    "total": 150,
    "totalPages": 5
  }
}
```

### Single Product Response
```json
{
  "data": {
    "id": 1,
    "name": "Product Name",
    "price": 99.99,
    "originalPrice": 129.99,
    "discount": 23,
    "brand": "Brand Name",
    "sku": "SKU12345",
    "upc": "123456789012",
    "description": "Product description",
    "features": ["Feature 1", "Feature 2"],
    "images": ["url1.jpg", "url2.jpg"],
    "category": "Electronics",
    "stock": 50
  }
}
```

### Cart Response
```json
{
  "data": {
    "items": [
      {
        "id": 1,
        "productId": 123,
        "name": "Product Name",
        "price": 99.99,
        "quantity": 2,
        "subtotal": 199.98
      }
    ],
    "total": 199.98,
    "itemCount": 2
  }
}
```

## 🔐 Authentication

The API service automatically handles authentication:
- Stores JWT token in localStorage
- Adds Authorization header to all requests
- Redirects to login on 401 errors
- Clears token on logout

## ⚠️ Error Handling

The API service includes global error handling:
- 401: Unauthorized - clears token and redirects to login
- 403: Forbidden - logs error
- 404: Not Found - logs error
- 500: Server Error - logs error

All errors are caught and logged. You can handle specific errors in your components:

```javascript
try {
  await productService.getProductById(123);
} catch (error) {
  if (error.response?.status === 404) {
    // Handle product not found
  } else {
    // Handle other errors
  }
}
```

## 🎯 Fallback Mode

The application includes fallback data for development:
- If the API is unavailable, demo data is displayed
- A warning message indicates when fallback data is being used
- This allows frontend development without a working backend

## 🔄 Customizing API Endpoints

To customize API endpoints, edit `src/config/api.config.js`:

```javascript
export const API_ENDPOINTS = {
  products: {
    getAll: '/api/v2/products',  // Change endpoint path
    getById: (id) => `/api/v2/products/${id}`,
    // ... other endpoints
  },
};
```

## 📝 Adding New API Services

1. Create a new service file in `src/services/`:
   ```javascript
   // src/services/category.service.js
   import { apiService } from './api.service';
   import { API_ENDPOINTS } from '../config/api.config';

   export const categoryService = {
     getAll: async () => {
       return await apiService.get(API_ENDPOINTS.categories.getAll);
     },
   };
   ```

2. Add endpoints to `src/config/api.config.js`:
   ```javascript
   export const API_ENDPOINTS = {
     // ... existing endpoints
     categories: {
       getAll: '/categories',
       getById: (id) => `/categories/${id}`,
     },
   };
   ```

3. Create a custom hook if needed:
   ```javascript
   // src/hooks/useCategories.js
   import { useState, useEffect } from 'react';
   import { categoryService } from '../services/category.service';

   export const useCategories = () => {
     const [categories, setCategories] = useState([]);
     const [loading, setLoading] = useState(false);

     useEffect(() => {
       const fetchCategories = async () => {
         setLoading(true);
         const data = await categoryService.getAll();
         setCategories(data);
         setLoading(false);
       };
       fetchCategories();
     }, []);

     return { categories, loading };
   };
   ```

## 🐛 Troubleshooting

### API calls not working
1. Check `.env` file exists and has correct URL
2. Restart development server after changing `.env`
3. Check browser console for CORS errors
4. Verify backend is running and accessible

### CORS Issues
If you see CORS errors, your backend needs to allow requests from `http://localhost:5173`:
```javascript
// Backend example (Express.js)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Authentication not persisting
- Check localStorage in browser DevTools
- Ensure token is being returned from login endpoint
- Verify token format matches what backend expects

## 📞 Support

For more help:
1. Check the code comments in service files
2. Review the React DevTools for state/props
3. Check browser Network tab for API call details
4. Review backend API documentation for expected request/response formats

## 🎉 You're Ready!

Your frontend is now integrated with the backend API. The application will:
- ✅ Automatically fetch products from your API
- ✅ Handle authentication with JWT tokens
- ✅ Manage shopping cart state
- ✅ Display loading states
- ✅ Show fallback data if API is unavailable
- ✅ Handle errors gracefully

Start your development server and test the integration!

