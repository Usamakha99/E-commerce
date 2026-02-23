// API Configuration
export const API_CONFIG = {
  // Prefer same-origin proxy to avoid CORS / Private Network Access issues in browsers.
  // You can still override with VITE_API_BASE_URL (e.g. http://199.188.207.24:5000/api)
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
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
    getCount: '/products/count',
  },
  
  // Categories
  categories: {
    list: '/categories/list',
    getAll: '/categories',
    getAllWithSubcategories: '/categories?includeSubcategories=true',
    getById: (id) => `/categories/${id}`,
    getCount: '/categories/count',
  },

  // Subcategories (children of categories)
  subcategories: {
    list: '/subcategories/list',
    getById: (id) => `/subcategories/${id}`,
  },

  // Brands (list all for sidebar without loading all products)
  brands: {
    getAll: '/brands',
    getCount: '/brands/count',
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
  
  // Product Tags
  productTags: {
    getAll: '/producttags',
    getById: (id) => `/producttags/${id}`,
    create: '/producttags',
    update: (id) => `/producttags/${id}`,
    delete: (id) => `/producttags/${id}`,
    addProducts: (id) => `/producttags/${id}/products`,
  },
  
  // Product Inquiries
  productInquiries: {
    create: '/productinquiries', // Try: '/product-inquiries' or '/inquiries' if 404
    getAll: '/productinquiries',
    getById: (id) => `/productinquiries/${id}`,
  },
  
  // AI Agents
  aiAgents: {
    getAll: '/aiagents',
    getById: (id) => `/aiagents/${id}`,
    create: '/aiagents',
    update: (id) => `/aiagents/${id}`,
    delete: (id) => `/aiagents/${id}`,
    categoriesWithCounts: '/aiagents/categories/counts',
  },
  
  // FTP Products API
  ftpProducts: {
    login: '/auth/login',
    getAll: '/ftp-products',
    getById: (id) => `/ftp-products/${id}`,
  },
};

export default API_CONFIG;


