# 🔌 Backend API Architecture Explanation

## Overview

Your E-commerce project uses a **3-tier architecture** with a **proxy server** setup:

```
Frontend (React) → Proxy Server (server.js) → Backend API (Port 5000)
```

---

## 📐 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React/Vite)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Components  │  │   Services   │  │     Config   │      │
│  │   (Pages)    │→ │  (aiAgent,   │→ │  (api.config)│      │
│  │              │  │   product)   │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                              │                               │
└──────────────────────────────┼───────────────────────────────┘
                               │
                               │ HTTP Requests
                               │ (Axios)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              Proxy Server (server.js)                        │
│                    Port: 3005 (default)                      │
│                                                              │
│  • Proxies /api/* requests to backend                       │
│  • Proxies /uploads/* to backend                            │
│  • Serves static files from /dist                           │
│  • Handles React Router (SPA routing)                       │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               │ Proxy Request
                               │ http://127.0.0.1:5000/api
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend API Server                              │
│                    Port: 5000                                │
│                                                              │
│  • Express.js REST API                                      │
│  • Database connections (MongoDB/PostgreSQL/etc)            │
│  • Business logic & data processing                         │
│  • Returns JSON responses                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗂️ File Structure

```
E-commerce/
├── server.js                    # ⭐ Proxy server (Port 3005)
├── src/
│   ├── config/
│   │   └── api.config.js       # API base URL & endpoints config
│   ├── services/
│   │   ├── api.service.js      # Axios client with interceptors
│   │   ├── aiAgent.service.js  # AI Agents API calls
│   │   ├── product.service.js  # Products API calls
│   │   └── ... (other services)
│   └── pages/
│       ├── Marketplace.jsx     # Uses aiAgentService
│       └── ... (other pages)
└── backend/                     # ⭐ Actual backend (separate project)
    └── server.js               # Express API server (Port 5000)
```

---

## 🔄 Request Flow (Step by Step)

### Example: Fetching AI Agents

#### **1. Frontend Component** (`Marketplace.jsx`)
```javascript
import { aiAgentService } from '../services/aiAgent.service';

// Component makes API call
const response = await aiAgentService.getAllAgents({
  page: 1,
  limit: 10,
  categoryId: '123'
});
```

#### **2. Service Layer** (`aiAgent.service.js`)
```javascript
// Service constructs the API endpoint
const url = `${API_ENDPOINTS.aiAgents.getAll}?${queryParams}`;
// URL becomes: "/aiagents?page=1&limit=10&categoryId=123"

// Calls apiService
return await apiService.get(url);
```

#### **3. API Service** (`api.service.js`)
```javascript
// Axios client with baseURL from config
const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,  // "/api" or "http://localhost:5000/api"
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor adds auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Makes HTTP GET request
GET /api/aiagents?page=1&limit=10&categoryId=123
```

#### **4. Proxy Server** (`server.js`)
```javascript
// Intercepts /api/* requests
app.use('/api', createProxyMiddleware({
  target: 'http://127.0.0.1:5000',  // Backend server
  changeOrigin: true,
  pathRewrite: (path) => `/api${path}`
}));

// Forwards to: http://127.0.0.1:5000/api/aiagents?page=1&limit=10&categoryId=123
```

#### **5. Backend API** (Port 5000)
```javascript
// Express server handles the request
app.get('/api/aiagents', async (req, res) => {
  const { page, limit, categoryId } = req.query;
  
  // Query database
  const agents = await db.agents.find({ categoryId, ... });
  
  // Return JSON response
  res.json({
    success: true,
    data: agents,
    total: agents.length
  });
});
```

#### **6. Response Flow (Reverse)**
```
Backend → Proxy → Frontend
JSON Response → apiService → Service → Component → UI Update
```

---

## 🔧 Configuration Files

### **1. API Config** (`src/config/api.config.js`)
```javascript
export const API_CONFIG = {
  // Base URL for all API requests
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  // Options:
  // - '/api' → Uses proxy server (recommended)
  // - 'http://localhost:5000/api' → Direct connection
  // - 'http://YOUR_VPS_IP:5000/api' → Production direct
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' }
};

// All API endpoints defined here
export const API_ENDPOINTS = {
  aiAgents: {
    getAll: '/aiagents',
    getById: (id) => `/aiagents/${id}`,
    // ...
  },
  // ... other endpoints
};
```

**Why this matters:**
- ✅ Centralized endpoint management
- ✅ Easy to update URLs in one place
- ✅ Environment-specific configuration (dev vs production)

### **2. Proxy Server** (`server.js`)
```javascript
const API_TARGET = process.env.API_TARGET || 'http://127.0.0.1:5000';

// Proxy configuration
app.use('/api', createProxyMiddleware({
  target: API_TARGET,        // Backend server URL
  changeOrigin: true,        // Changes origin header
  pathRewrite: (path) => `/api${path}`  // Adds /api prefix
}));

// Also serves static files
app.use(express.static(join(__dirname, 'dist')));
```

**Why proxy server?**
- ✅ Avoids CORS issues
- ✅ Same-origin requests (browser security)
- ✅ Single server to expose (Port 3005)
- ✅ Handles React Router (SPA routing)

---

## 🎯 Service Layer Pattern

Each feature has its own service file:

### **Example: AI Agents Service** (`aiAgent.service.js`)
```javascript
import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

export const aiAgentService = {
  // Get all agents with pagination
  getAllAgents: async (params = {}) => {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 20,
      categoryId: params.categoryId || null
    });
    
    const url = `${API_ENDPOINTS.aiAgents.getAll}?${queryParams}`;
    return await apiService.get(url);
  },

  // Get single agent by ID
  getAgentById: async (id) => {
    return await apiService.get(API_ENDPOINTS.aiAgents.getById(id));
  },

  // Create new agent
  createAgent: async (agentData) => {
    return await apiService.post(API_ENDPOINTS.aiAgents.create, agentData);
  }
};
```

**Benefits:**
- ✅ Clean separation of concerns
- ✅ Reusable API methods
- ✅ Centralized error handling
- ✅ Easy to test

---

## 🔐 Authentication Flow

### **1. Login Process**
```javascript
// User logs in
const response = await authService.login({ email, password });

// Backend returns token
// { token: "eyJhbGciOiJIUzI1NiIs..." }

// Save token in localStorage
localStorage.setItem('authToken', response.token);
```

### **2. Automatic Token Injection**
```javascript
// api.service.js - Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    // Automatically adds token to every request
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### **3. Token Validation**
```javascript
// Backend validates token on protected routes
app.get('/api/profile', authenticateToken, (req, res) => {
  // Token validated, return user data
  res.json({ user: req.user });
});
```

---

## 🌐 Environment Configuration

### **Development** (Localhost)
```env
# .env file
VITE_API_BASE_URL=/api

# Backend runs on Port 5000
# Proxy server runs on Port 3005
# Frontend runs on Port 5173 (Vite dev server)
```

### **Production** (VPS Server)
```env
# .env file
VITE_API_BASE_URL=/api
# OR direct connection:
# VITE_API_BASE_URL=http://YOUR_VPS_IP:5000/api

# PM2 runs:
# - Proxy server on Port 3005
# - Backend API on Port 5000
```

---

## 📡 API Endpoints Summary

Your project uses these main API endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/aiagents` | GET | Get all AI agents (with pagination/filters) |
| `/api/aiagents/:id` | GET | Get single AI agent by ID |
| `/api/aiagents` | POST | Create new AI agent |
| `/api/aiagents/:id` | PUT | Update AI agent |
| `/api/aiagents/:id` | DELETE | Delete AI agent |
| `/api/aiagents/categories/counts` | GET | Get categories with counts |
| `/api/products` | GET | Get all products |
| `/api/products/:id` | GET | **Single product by ID** – detail page pehle yahi try karta hai; agar 404 to `GET /api/products?id=X` use hota hai. Agar `?id=X` sirf page 1 return kare to page 2+ ke products ka detail nahi dikhega, isliye `GET /api/products/:id` implement karein. |
| `/api/productinquiries` | POST | Create product inquiry |

### **Shop category/brand filter (GET /api/products)**

For the Shop page category and brand filters to work for **every** category (not just some):

1. **Filter by category id in both fields**  
   The frontend sends the same category id in multiple query params: `categoryId`, `category_id`, `subCategoryId`, `subcategoryId`, `subcategory_id`.  
   **Backend should filter products where**  
   `(subCategoryId = :id OR categoryId = :id)`  
   so that:
   - Clicks on a **subcategory** (e.g. “Mice”) return products whose `subCategoryId` (or `categoryId`) equals that id.
   - Clicks on a **parent category** (e.g. “Electronics”) return products whose `categoryId` equals that id, or whose `subCategoryId` is a child of it (if you store parent id on products, match `categoryId`; if you only have subcategory ids, you may need to resolve parent → children and filter by those subcategory ids).
   If the backend only filters by `subCategoryId`, then categories that use `categoryId` on products will show no results (“some work, some don’t”).

2. **Include category on each product**  
   Each product in the list response should have one of:
   - `subCategoryId` (number or string), or  
   - `subCategory` with `id` (e.g. `subCategory: { id: 123, title: "Networking Cables" }`), or  
   - `categoryId` if that is your subcategory/leaf category id.

3. **Optional: support other query params**  
   The frontend also sends `brandId`, `subCategoryName`/`category` (for title). Return filtered `total` and pagination so “page 2” stays in the same category.

| `/api/carts` | GET/POST | Cart operations |
| `/api/orders` | GET/POST | Order operations |
| `/api/users/login` | POST | User authentication |
| `/api/payments/create-intent` | POST | Stripe payment intent |

---

## 🛠️ How to Start the Backend

### **1. Start Backend API** (Port 5000)
```bash
# Navigate to backend folder
cd backend

# Install dependencies (if not done)
npm install

# Start backend server
npm start
# OR
node server.js

# Backend runs on: http://localhost:5000
```

### **2. Start Proxy Server** (Port 3005)
```bash
# In project root
node server.js

# Proxy runs on: http://199.188.207.24:3005
# Proxies /api/* to http://127.0.0.1:5000
```

### **3. Start Frontend** (Development)
```bash
npm run dev

# Frontend runs on: http://localhost:5173
# Makes API calls to /api (which proxy handles)
```

### **4. Production (PM2)**
```bash
# Start backend
pm2 start backend/server.js --name "backend-api"

# Start proxy
pm2 start server.js --name "proxy-server"

# Build frontend
npm run build

# Serve static files (proxy already handles this)
```

---

## 🔍 How Components Use the API

### **Example: Marketplace.jsx**
```javascript
import { aiAgentService } from '../services/aiAgent.service';

function Marketplace() {
  const [agents, setAgents] = useState([]);
  
  useEffect(() => {
    // Fetch agents when component mounts
    const fetchAgents = async () => {
      try {
        const response = await aiAgentService.getAllAgents({
          page: 1,
          limit: 10
        });
        
        // Handle response
        if (response.data) {
          setAgents(response.data);
        } else {
          setAgents(response);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    fetchAgents();
  }, []);
  
  return (
    <div>
      {agents.map(agent => (
        <div key={agent.id}>{agent.name}</div>
      ))}
    </div>
  );
}
```

---

## 🐛 Debugging & Troubleshooting

### **Check if Backend is Running**
```bash
# Test backend health
curl http://localhost:5000/api/health

# Test proxy
curl http://199.188.207.24:3005/api/health
```

### **Check API Calls in Browser**
1. Open DevTools (F12)
2. Go to **Network** tab
3. Filter by **XHR** or **Fetch**
4. See all API requests/responses

### **Common Issues**

#### **Issue 1: CORS Error**
```
Access to fetch at 'http://localhost:5000/api/...' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Solution:** Use proxy server or configure CORS on backend

#### **Issue 2: 404 Not Found**
```
GET http://199.188.207.24:3005/api/aiagents 404 (Not Found)
```

**Solution:** 
- Check backend is running on Port 5000
- Check proxy server is running on Port 3005
- Verify endpoint path in `api.config.js`

#### **Issue 3: Network Error**
```
Network Error: ERR_CONNECTION_REFUSED
```

**Solution:**
- Backend server not running
- Wrong port number
- Firewall blocking connection

---

## 📚 Key Concepts

### **1. RESTful API**
- **GET**: Retrieve data (no side effects)
- **POST**: Create new resource
- **PUT**: Update entire resource
- **PATCH**: Partial update
- **DELETE**: Remove resource

### **2. Axios Interceptors**
- **Request Interceptor**: Adds auth token before sending
- **Response Interceptor**: Handles errors globally

### **3. Service Layer Pattern**
- Each feature has dedicated service file
- Services call `apiService` (Axios wrapper)
- Components call services (not API directly)

### **4. Proxy Pattern**
- Frontend → Proxy → Backend
- Simplifies CORS and security
- Single entry point for production

---

## 🎓 Summary

1. **Frontend** (React components) calls **Services** (aiAgent.service.js)
2. **Services** use **API Service** (api.service.js) with Axios
3. **API Service** makes HTTP requests to `/api/*` endpoints
4. **Proxy Server** (server.js) intercepts and forwards to **Backend** (Port 5000)
5. **Backend** processes request, queries database, returns JSON
6. **Response** flows back through the same chain to update UI

**Key Benefits:**
- ✅ Separation of concerns
- ✅ Reusable service methods
- ✅ Centralized configuration
- ✅ Easy to maintain and test

---

## 📞 Need Help?

- Check backend logs: `pm2 logs backend-api`
- Check proxy logs: `pm2 logs proxy-server`
- Verify environment variables: `cat .env`
- Test endpoints directly: `curl http://localhost:5000/api/health`

