import axios from 'axios';

// FTP API Configuration
// Use proxy path to avoid CORS issues
const FTP_API_CONFIG = {
  baseURL: import.meta.env.VITE_FTP_API_BASE_URL || '/ftp-api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Create separate axios instance for FTP API
const ftpApiClient = axios.create(FTP_API_CONFIG);

// Request interceptor - Add auth token if available
ftpApiClient.interceptors.request.use(
  (config) => {
    // Get FTP API token from localStorage
    const ftpToken = localStorage.getItem('ftpApiToken');
    if (ftpToken) {
      config.headers.Authorization = `Bearer ${ftpToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
ftpApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // If 401 Unauthorized, try to re-authenticate
    if (error.response?.status === 401) {
      try {
        const newToken = await ftpProductService.authenticate();
        if (newToken) {
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return ftpApiClient.request(error.config);
        }
      } catch (_authError) {
      }
    }
    return Promise.reject(error);
  }
);

export const ftpProductService = {
  /**
   * Authenticate with FTP API and get token
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<string>} - API token
   */
  authenticate: async (email = null, password = null) => {
    try {
      // Use provided credentials or get from env
      const loginEmail = email || import.meta.env.VITE_FTP_API_EMAIL;
      const loginPassword = password || import.meta.env.VITE_FTP_API_PASSWORD;

      if (!loginEmail || !loginPassword) {
        throw new Error('FTP API credentials not configured. Please set VITE_FTP_API_EMAIL and VITE_FTP_API_PASSWORD in .env file.');
      }

      const response = await ftpApiClient.post('/auth/login', {
        email: loginEmail,
        password: loginPassword,
      });

      if (response.data?.success && response.data?.token) {
        // Store token in localStorage
        localStorage.setItem('ftpApiToken', response.data.token);
        return response.data.token;
      } else {
        throw new Error('Authentication failed: Invalid response');
      }
    } catch (error) {
      localStorage.removeItem('ftpApiToken');
      throw error;
    }
  },

  /**
   * Get all FTP products with optional filters
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.per_page - Items per page (default: 50, max: 200)
   * @param {string} params.search - General search term
   * @param {string} params.search_field - Specific field to search (internal_sku, mfr_sku, vendor_name, description, upc)
   * @param {string} params.search_value - Value to search for
   * @param {string} params.sort_by - Field to sort by (id, internal_sku, mfr_sku, vendor_name, description, msrp, cogs, weight, upc, stock, created_at, updated_at)
   * @param {string} params.sort_direction - Sort direction (asc, desc)
   * @param {string|Array} params.distributor - Filter by distributor(s)
   * @param {boolean} params.include_icecat - Include Icecat product data (slower)
   * @returns {Promise<Object>} - Products response with data and meta
   */
  getAllProducts: async (params = {}) => {
    try {
      // Ensure authenticated
      let token = localStorage.getItem('ftpApiToken');
      if (!token) {
        token = await ftpProductService.authenticate();
      }

      // Build query string
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.per_page) queryParams.append('per_page', params.per_page);
      if (params.search) queryParams.append('search', params.search);
      if (params.search_field) queryParams.append('search_field', params.search_field);
      if (params.search_value) queryParams.append('search_value', params.search_value);
      if (params.sort_by) queryParams.append('sort_by', params.sort_by);
      if (params.sort_direction) queryParams.append('sort_direction', params.sort_direction);
      if (params.distributor) {
        if (Array.isArray(params.distributor)) {
          params.distributor.forEach(d => queryParams.append('distributor[]', d));
        } else {
          queryParams.append('distributor', params.distributor);
        }
      }
      if (params.include_icecat !== undefined) {
        queryParams.append('include_icecat', params.include_icecat ? 'true' : 'false');
      }

      const queryString = queryParams.toString();
      const url = `/ftp-products${queryString ? `?${queryString}` : ''}`;

      const response = await ftpApiClient.get(url);

      return {
        success: response.data?.success || true,
        data: response.data?.data || [],
        meta: response.data?.meta || {},
        filters: response.data?.filters || {},
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get single FTP product by ID
   * @param {number} id - Product ID
   * @param {string} table_name - Optional table name (if known)
   * @returns {Promise<Object>} - Product data
   */
  getProductById: async (id, table_name = null) => {
    try {
      // Ensure authenticated
      let token = localStorage.getItem('ftpApiToken');
      if (!token) {
        token = await ftpProductService.authenticate();
      }

      const queryParams = new URLSearchParams();
      if (table_name) {
        queryParams.append('table_name', table_name);
      }

      const queryString = queryParams.toString();
      const url = `/ftp-products/${id}${queryString ? `?${queryString}` : ''}`;

      const response = await ftpApiClient.get(url);

      return {
        success: response.data?.success || true,
        data: response.data?.data || null,
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Search FTP products
   * @param {string} searchTerm - Search term
   * @param {Object} options - Additional search options
   * @returns {Promise<Object>} - Search results
   */
  searchProducts: async (searchTerm, options = {}) => {
    return await ftpProductService.getAllProducts({
      search: searchTerm,
      ...options,
    });
  },

  /**
   * Get products by distributor
   * @param {string|Array} distributor - Distributor name(s)
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} - Products from specified distributor(s)
   */
  getProductsByDistributor: async (distributor, options = {}) => {
    return await ftpProductService.getAllProducts({
      distributor,
      ...options,
    });
  },
};

export default ftpProductService;
