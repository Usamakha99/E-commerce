// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 60000, // 60 seconds - allow time for large product lists (4000+ items)
  headers: {
    'Content-Type': 'application/json',
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  // Products
  products: {
    getAll: '/products',
    getById: (id) => `/products?id=${id}`, // Your backend uses query params, not path params
    search: '/products/search',
    filter: '/products/filter',
    categories: '/products/categories',
  },
  
  // Categories
  categories: {
    getAll: '/categories',
    getAllWithSubcategories: '/categories?includeSubcategories=true',
    getById: (id) => `/categories/${id}`,
  },
  
  // Cart
  cart: {
    get: '/carts',
    add: '/carts/add',
    update: (cartId) => `/carts/${cartId}/items`,      // PUT /:cartId/items
    remove: (cartId) => `/carts/${cartId}/items`,      // DELETE /:cartId/items
    clear: (cartId) => `/carts/${cartId}/clear`,       // DELETE /:cartId/clear
    merge: '/carts/merge',
  },
  
  // Orders
  orders: {
    create: '/orders',
    getAll: '/orders',
    getById: (id) => `/orders/${id}`,
    cancel: (id) => `/orders/${id}/cancel`,
  },
  
  // Users / Auth
  users: {
    login: '/users/login',
    register: '/users/register',
    profile: '/users/profile',
    updateProfile: '/users/profile',
  },
  
  // Wishlist
  wishlist: {
    getAll: '/wishlist',
    add: '/wishlist/add',
    remove: (id) => `/wishlist/${id}`,
  },
  
  // Reviews
  reviews: {
    getByProduct: (productId) => `/products/${productId}/reviews`,
    create: '/reviews',
    update: (id) => `/reviews/${id}`,
    delete: (id) => `/reviews/${id}`,
  },
  
  // Payments (Stripe)
  payments: {
    createIntent: '/payments/create-intent',
    confirm: (id) => `/payments/confirm/${id}`,
    status: (id) => `/payments/status/${id}`,
  },
};

export default API_CONFIG;


