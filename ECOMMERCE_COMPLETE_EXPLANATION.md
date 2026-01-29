# 🛒 Complete E-Commerce Website Explanation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [API Integration](#api-integration)
4. [Frontend Structure](#frontend-structure)
5. [Product Management](#product-management)
6. [Shopping Cart System](#shopping-cart-system)
7. [Checkout & Payment](#checkout--payment)
8. [User Authentication](#user-authentication)
9. [Data Flow](#data-flow)
10. [Key Features](#key-features)

---

## 🎯 Overview

This is a **modern, full-stack e-commerce platform** built with:
- **Frontend**: React 19.1.1 + Vite 7.1.2
- **Backend API**: Express.js (Port 5000)
- **Proxy Server**: Express.js (Port 3005)
- **Payment**: Stripe Integration
- **External API**: FTP Products API (for product data)

The website allows users to:
- Browse products from multiple distributors (Ingram, Synnex, DNH, ASI, Arrow, etc.)
- Search and filter products
- Add items to shopping cart
- Complete secure checkout with Stripe
- View order history
- Manage account

---

## 🏗️ Architecture

### **3-Tier Architecture with Proxy**

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React/Vite)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Components  │  │   Services   │  │     Config   │      │
│  │   (Pages)    │→ │  (product,   │→ │  (api.config)│      │
│  │              │  │   cart,      │  │              │      │
│  │              │  │   payment)   │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└──────────────────────────────┼───────────────────────────────┘
                               │
                               │ HTTP Requests (/api/*)
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              Proxy Server (server.js)                       │
│                    Port: 3005                                │
│                                                              │
│  • Proxies /api/* → Backend API (Port 5000)                │
│  • Proxies /uploads/* → Backend                            │
│  • Serves static files from /dist                           │
│  • Handles React Router (SPA routing)                       │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               │ Proxy Request
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend API Server                              │
│                    Port: 5000                                │
│                                                              │
│  • Express.js REST API                                      │
│  • Database (MongoDB/PostgreSQL)                            │
│  • Business logic & data processing                         │
│  • Returns JSON responses                                   │
└─────────────────────────────────────────────────────────────┘
```

### **Why Proxy Server?**
1. **Avoids CORS Issues**: Browser security prevents direct API calls from different origins
2. **Same-Origin Requests**: All requests appear to come from same domain
3. **Single Entry Point**: Only Port 3005 needs to be exposed
4. **SPA Routing**: Handles React Router client-side routing

---

## 🔌 API Integration

### **1. FTP Products API**

The website integrates with an **FTP Products API** that provides product data from multiple distributors:

#### **Authentication Flow:**
```javascript
// Step 1: Login to get API token
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Response:
{
  "success": true,
  "token": "1|abcdefghijklmnop...",
  "user": { "id": 1, "name": "John Doe", "email": "user@example.com" }
}
```

#### **Product Fetching:**
```javascript
// Get all products with filters
GET /api/ftp-products?page=1&per_page=50&search=laptop&distributor=ingram

// Query Parameters:
- page: Page number (default: 1)
- per_page: Items per page (default: 50, max: 200)
- search: General search term
- search_field: Specific field (internal_sku, mfr_sku, vendor_name, etc.)
- search_value: Value to search for
- sort_by: Field to sort by (id, msrp, cogs, etc.)
- sort_direction: asc or desc
- distributor: Filter by distributor (ingram, synnex, dnh, etc.)
- include_icecat: Include Icecat product data (true/false)
```

#### **Supported Distributors:**
- Ingram
- Synnex
- DNH
- ASI
- Arrow
- Scansource
- 888VoIP
- Wholesale House
- Manual distributors

#### **Product Data Structure:**
```javascript
{
  "id": 123,
  "internal_sku": "SKU123",
  "mfr_sku": "MFR-SKU-123",
  "vendor_name": "DELL",
  "description": "Product description",
  "msrp": 99.99,        // Manufacturer Suggested Retail Price
  "cogs": 75.00,        // Cost of Goods Sold
  "weight": 2.5,
  "upc": "123456789012",
  "stock": 100,
  "distributor": "Ingram",
  "table_name": "ingram_tech_ftps",
  "icecat": {...},      // Optional Icecat product data
  "created_at": "2025-01-27T10:00:00.000000Z",
  "updated_at": "2025-01-27T10:00:00.000000Z"
}
```

### **2. Internal Backend API**

The website also uses its own backend API for:
- User authentication (`/api/users/login`, `/api/users/register`)
- Shopping cart (`/api/carts`)
- Orders (`/api/orders`)
- Payments (`/api/payments/create-intent`)
- Product inquiries (`/api/productinquiries`)
- AI Agents (`/api/aiagents`)

---

## 🎨 Frontend Structure

### **File Organization:**

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Navigation with cart icon
│   ├── CartSidebar.jsx # Shopping cart sidebar
│   ├── ProductCard.jsx # Product display card
│   ├── Footer.jsx      # Footer component
│   └── ...
│
├── pages/              # Page components (routes)
│   ├── ShopGrid.jsx   # Main shop page (product listing)
│   ├── ProductDetail.jsx # Product details page
│   ├── Cart.jsx        # Shopping cart page
│   ├── Checkout.jsx    # Stripe checkout page
│   ├── PaymentSuccess.jsx # Payment success page
│   ├── Marketplace.jsx # AI Agents marketplace
│   └── ...
│
├── services/           # API service layer
│   ├── api.service.js  # Base Axios client
│   ├── product.service.js # Product API calls
│   ├── cart.service.js # Cart API calls
│   ├── payment.service.js # Stripe payment service
│   ├── order.service.js # Order API calls
│   └── ...
│
├── context/            # React Context (global state)
│   └── CartContext.jsx # Global cart state management
│
├── hooks/              # Custom React hooks
│   ├── useCart.js      # Cart operations hook
│   ├── useProducts.js  # Product fetching hook
│   ├── useAuth.js      # Authentication hook
│   └── ...
│
├── config/             # Configuration files
│   ├── api.config.js   # API endpoints configuration
│   └── stripe.config.js # Stripe configuration
│
└── utils/              # Utility functions
    └── dataMapper.js    # Maps API data to internal format
```

### **Service Layer Pattern**

Each feature has a dedicated service file that handles API communication:

```javascript
// Example: product.service.js
export const productService = {
  getAllProducts: async (params = {}) => {
    const response = await apiService.get('/products', { params });
    return mapProducts(response.data); // Transform to internal format
  },
  
  getProductById: async (id) => {
    const response = await apiService.get(`/products?id=${id}`);
    return mapProduct(response.data);
  }
};
```

**Benefits:**
- ✅ Clean separation of concerns
- ✅ Reusable API methods
- ✅ Centralized error handling
- ✅ Easy to test and maintain

---

## 📦 Product Management

### **1. Product Fetching Flow**

```javascript
// 1. Component calls hook
const { products, loading, error } = useProducts({ autoFetch: true });

// 2. Hook calls service
const response = await productService.getAllProducts({ page: 1, limit: 1000 });

// 3. Service calls API
const response = await apiService.get('/products/imports?status=completed&page=1&limit=1000');

// 4. API Service makes HTTP request
GET /api/products/imports?status=completed&page=1&limit=1000
Headers: { Authorization: "Bearer TOKEN" }

// 5. Proxy forwards to backend
http://127.0.0.1:5000/api/products/imports?status=completed&page=1&limit=1000

// 6. Backend queries database and returns JSON
// 7. Response flows back through the chain
// 8. Data is mapped to internal format
// 9. Component updates UI
```

### **2. Product Data Mapping**

The `dataMapper.js` utility transforms external API data to a standardized internal format:

```javascript
// External API format (varies by source)
{
  id: 123,
  shortDescp: "Dell Laptop",
  price: "99.99",
  brand: { title: "DELL" },
  galleries: [{ pic500x500: "https://..." }]
}

// ↓ Mapped to internal format ↓

{
  id: 123,
  name: "Dell Laptop",
  price: 99.99,
  brand: { title: "DELL" },
  image: "https://...",
  sku: "...",
  stock: 100
}
```

### **3. Product Display (ShopGrid.jsx)**

**Features:**
- **Grid/List View Toggle**: Switch between grid and list layouts
- **Sorting**: Latest, Oldest, Price Low to High, Price High to Low
- **Pagination**: Client-side pagination (20, 30, 50, 100 items per page)
- **Filtering**: 
  - Search by name, description, SKU
  - Filter by category
  - Filter by brand
  - Filter by product tags
- **Price Visibility**: 
  - Logged-in users see prices
  - Guests see "Sign In to see pricing"

**Client-Side Filtering:**
```javascript
// All products fetched once, then filtered client-side
const filteredProducts = allProducts.filter(product => {
  // Search filter
  if (searchQuery && !product.name.includes(searchQuery)) return false;
  
  // Category filter
  if (selectedCategory && product.subCategoryId !== selectedCategory) return false;
  
  // Brand filter
  if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand?.title)) return false;
  
  // Tag filter
  if (selectedTags.length > 0 && !hasSelectedTag) return false;
  
  return true;
}).sort((a, b) => {
  // Sorting logic
});
```

### **4. Product Detail Page**

Shows:
- Product images (from galleries or uploaded images)
- Full description
- Specifications
- Price (for logged-in users)
- Add to cart button
- Product inquiry form
- Related products

---

## 🛒 Shopping Cart System

### **1. Cart Context (Global State)**

```javascript
// CartContext.jsx provides global cart state
const { cart, addToCart, updateCartItem, removeFromCart, clearCart } = useCart();
```

**Cart State Structure:**
```javascript
{
  items: [
    {
      id: "item-123",
      productId: 456,
      name: "Dell Laptop",
      price: 99.99,
      quantity: 2,
      image: "https://...",
      subtotal: 199.98
    }
  ],
  total: 199.98,
  itemCount: 2
}
```

### **2. Cart Operations**

#### **Add to Cart:**
```javascript
// 1. User clicks "Add to Cart" button
await addToCart(productId, quantity, options);

// 2. CartContext calls cartService
const response = await cartService.addToCart(productId, quantity);

// 3. Service makes API call
POST /api/carts/add
Body: { productId, quantity, options }

// 4. Backend adds item to cart (or updates quantity if exists)
// 5. Returns updated cart
// 6. CartContext updates global state
// 7. UI updates (cart icon badge, cart sidebar)
```

#### **Update Cart Item:**
```javascript
await updateCartItem(itemId, newQuantity);
// Updates quantity of existing cart item
```

#### **Remove from Cart:**
```javascript
await removeFromCart(itemId);
// Removes item from cart
```

#### **Clear Cart:**
```javascript
await clearCart();
// Removes all items from cart
```

### **3. Cart Persistence**

**Dual Storage Strategy:**
1. **Backend API** (Primary): Cart stored in database, synced across devices
2. **LocalStorage** (Fallback): If API fails, cart stored locally in browser

```javascript
// cart.service.js handles fallback
try {
  // Try API first
  const response = await apiService.post('/carts/add', data);
  return response;
} catch (error) {
  // Fallback to localStorage
  const localCart = JSON.parse(localStorage.getItem('vcloud_cart') || '{"items":[],"total":0}');
  // Add item to local cart
  localCart.items.push(newItem);
  localStorage.setItem('vcloud_cart', JSON.stringify(localCart));
  return { data: localCart };
}
```

### **4. Cart Sidebar**

- Slides in from right when cart icon clicked
- Shows all cart items with images, names, prices
- Quantity controls (increase/decrease)
- Remove item button
- Subtotal and total
- "Checkout" button

---

## 💳 Checkout & Payment

### **1. Checkout Flow**

```javascript
// 1. User clicks "Checkout" button
navigate('/checkout');

// 2. Checkout page loads
// 3. Validates cart is not empty
if (!cart?.items?.length) {
  navigate('/cart');
  return;
}

// 4. Creates Stripe Payment Intent
const response = await paymentService.createPaymentIntent({
  amount: Math.round(cartTotal * 100), // Convert to cents
  currency: 'usd',
  items: cart.items
});

// 5. Gets clientSecret from backend
setClientSecret(response.clientSecret);

// 6. Renders Stripe Elements (payment form)
<Elements stripe={stripePromise} options={{ clientSecret }}>
  <CheckoutForm />
</Elements>
```

### **2. Stripe Integration**

**Frontend (Checkout.jsx):**
```javascript
// Load Stripe
const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);

// Payment form with Stripe Elements
<PaymentElement /> // Card input, billing details, etc.

// Submit payment
const { error, paymentIntent } = await stripe.confirmPayment({
  elements,
  confirmParams: {
    return_url: `${window.location.origin}/payment-success`
  }
});
```

**Backend API:**
```javascript
// Create Payment Intent
POST /api/payments/create-intent
Body: {
  amount: 19998, // in cents
  currency: "usd",
  items: [...]
}

// Response:
{
  clientSecret: "pi_xxx_secret_xxx"
}
```

### **3. Payment Success Flow**

```javascript
// 1. Stripe redirects to /payment-success?payment_intent=pi_xxx
// 2. PaymentSuccess page loads
// 3. Verifies payment with backend
const paymentIntent = await paymentService.getPaymentStatus(paymentIntentId);

// 4. Creates order in database
await orderService.createOrder({
  paymentIntentId: paymentIntent.id,
  items: cart.items,
  total: cartTotal,
  status: 'completed'
});

// 5. Clears cart
await clearCart();

// 6. Shows success message with order details
```

### **4. Payment Cancel**

If user cancels payment:
- Redirects to `/payment-cancel`
- Shows cancel message
- Cart remains intact (user can try again)

---

## 🔐 User Authentication

### **1. Authentication Flow**

```javascript
// 1. User enters email/password
// 2. Login page calls authService
const response = await authService.login({ email, password });

// 3. Backend validates credentials
POST /api/users/login
Body: { email, password }

// 4. Backend returns JWT token
{
  success: true,
  token: "eyJhbGciOiJIUzI1NiIs...",
  user: { id: 1, name: "John Doe", email: "user@example.com" }
}

// 5. Token stored in localStorage
localStorage.setItem('authToken', response.token);

// 6. Token automatically added to all API requests
// (via api.service.js request interceptor)
```

### **2. Token Management**

**Automatic Token Injection:**
```javascript
// api.service.js - Request Interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Token Validation:**
- Backend validates token on protected routes
- If token invalid/expired → 401 Unauthorized
- Frontend removes token and redirects to login

### **3. Protected Routes**

```javascript
// Check if user is logged in
const { isLoggedIn } = useAuth();

// Show/hide content based on auth status
{isLoggedIn ? (
  <div>Price: ${product.price}</div>
) : (
  <div>Sign In to see pricing</div>
)}
```

---

## 🔄 Data Flow

### **Complete Request Flow Example: Adding Product to Cart**

```
1. User clicks "Add to Cart" button
   ↓
2. ProductCard.jsx calls: addToCart(productId, 1)
   ↓
3. CartContext.addToCart() called
   ↓
4. cartService.addToCart(productId, quantity) called
   ↓
5. apiService.post('/carts/add', { productId, quantity }) called
   ↓
6. Axios makes HTTP request:
   POST /api/carts/add
   Headers: { Authorization: "Bearer TOKEN" }
   Body: { productId: 123, quantity: 1 }
   ↓
7. Proxy Server (Port 3005) intercepts /api/* request
   ↓
8. Proxy forwards to Backend API (Port 5000):
   POST http://127.0.0.1:5000/api/carts/add
   ↓
9. Backend API:
   - Validates token
   - Finds or creates user's cart
   - Adds product to cart (or updates quantity)
   - Calculates new total
   - Saves to database
   ↓
10. Backend returns JSON:
    {
      success: true,
      data: {
        items: [...],
        total: 99.99
      }
    }
    ↓
11. Response flows back through proxy
    ↓
12. apiService returns response.data
    ↓
13. cartService returns response
    ↓
14. CartContext updates state: setCart(response.data)
    ↓
15. UI updates:
    - Cart icon badge shows new count
    - Cart sidebar shows new item
    - Success message displayed
```

---

## ✨ Key Features

### **1. Product Features**
- ✅ Multi-distributor product catalog
- ✅ Advanced search and filtering
- ✅ Category and brand filtering
- ✅ Product tags system
- ✅ Grid/List view toggle
- ✅ Sorting (latest, oldest, price)
- ✅ Pagination
- ✅ Product detail pages with images
- ✅ Product inquiry form
- ✅ Price visibility control (logged-in only)

### **2. Shopping Cart Features**
- ✅ Add/remove items
- ✅ Update quantities
- ✅ Real-time cart updates
- ✅ Cart sidebar
- ✅ Persistent cart (backend + localStorage fallback)
- ✅ Cart total calculation

### **3. Checkout Features**
- ✅ Secure Stripe payment integration
- ✅ Beautiful checkout UI
- ✅ Payment form with Stripe Elements
- ✅ Order creation after payment
- ✅ Payment success/cancel pages
- ✅ Order history

### **4. User Features**
- ✅ User registration
- ✅ User login/logout
- ✅ JWT token authentication
- ✅ Protected routes
- ✅ User profile management

### **5. Marketplace Features**
- ✅ AI Agents marketplace
- ✅ Category filtering
- ✅ Publisher filtering
- ✅ Delivery method filtering
- ✅ Search functionality

### **6. Technical Features**
- ✅ Proxy server (CORS handling)
- ✅ Service layer architecture
- ✅ Data mapping utilities
- ✅ Error handling
- ✅ Loading states
- ✅ Responsive design
- ✅ React Context for global state
- ✅ Custom hooks

---

## 🚀 How to Use

### **1. Start Backend API**
```bash
cd backend
npm install
npm start
# Backend runs on http://localhost:5000
```

### **2. Start Proxy Server**
```bash
# In project root
node server.js
# Proxy runs on http://199.188.207.24:3005
```

### **3. Start Frontend (Development)**
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

### **4. Production Build**
```bash
npm run build
# Serves static files from /dist
# Proxy server handles routing
```

---

## 📝 Configuration

### **Environment Variables (.env)**
```env
# Frontend
VITE_API_BASE_URL=/api                    # Use proxy (recommended)
# OR
VITE_API_BASE_URL=http://localhost:5000/api  # Direct connection

VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Backend (separate .env file)
PORT=5000
STRIPE_SECRET_KEY=sk_test_...
FRONTEND_URL=http://localhost:5173
```

### **API Configuration (api.config.js)**
```javascript
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' }
};

export const API_ENDPOINTS = {
  products: { getAll: '/products', getById: (id) => `/products?id=${id}` },
  cart: { get: '/carts', add: '/carts/add' },
  orders: { create: '/orders', getAll: '/orders' },
  payments: { createIntent: '/payments/create-intent' },
  // ... more endpoints
};
```

---

## 🎯 Summary

This e-commerce website is a **comprehensive, production-ready platform** with:

1. **Modern Architecture**: 3-tier with proxy server
2. **External API Integration**: FTP Products API for product data
3. **Service Layer**: Clean, maintainable code structure
4. **Global State Management**: React Context for cart
5. **Secure Payments**: Stripe integration
6. **User Authentication**: JWT token-based
7. **Data Mapping**: Flexible data transformation
8. **Error Handling**: Graceful fallbacks (localStorage for cart)
9. **Responsive Design**: Works on all devices
10. **Developer Experience**: Well-organized, documented code

The system is designed to be **scalable**, **maintainable**, and **user-friendly**, with proper separation of concerns and best practices throughout.

---

**Built with ❤️ for V Cloud Tech**
