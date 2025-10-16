import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { mapProduct, mapProducts } from '../utils/dataMapper';

export const productService = {
  // Get all products with optional filters
  getAllProducts: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString 
        ? `${API_ENDPOINTS.products.getAll}?${queryString}` 
        : API_ENDPOINTS.products.getAll;
      
      const response = await apiService.get(url);
      
      // Handle null/undefined response
      if (!response) {
        return { data: [], pagination: null };
      }
      
      // YOUR API returns direct array with Count field
      // Extract the array (everything except Count)
      let products = [];
      
      if (Array.isArray(response)) {
        // Direct array
        products = response;
      } else if (response.data) {
        // Wrapped in data field
        products = response.data;
      } else if (typeof response === 'object') {
        // Object with array items (filter out Count and other non-product fields)
        products = Object.values(response).filter(item => 
          item && typeof item === 'object' && item.id
        );
      }
      
      // Map to standardized format
      const mappedProducts = Array.isArray(products) ? mapProducts(products) : [];
      
      return {
        data: mappedProducts,
        pagination: {
          total: response.Count || mappedProducts.length,
          page: 1,
          limit: params.limit || 30
        }
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get single product by ID
  getProductById: async (id) => {
    try {
      const response = await apiService.get(API_ENDPOINTS.products.getById(id));
      
      // Handle null/undefined response
      if (!response) {
        return { data: null };
      }
      
      let product = null;
      
      // Check if response is an array (backend returns all products)
      if (Array.isArray(response)) {
        // Find the specific product by ID
        product = response.find(p => p.id == id);
      } 
      // Check if response.data is an array
      else if (response.data && Array.isArray(response.data)) {
        product = response.data.find(p => p.id == id);
      }
      // Single product in response.data
      else if (response.data) {
        product = response.data;
      } 
      // Direct product object
      else if (response.id) {
        product = response;
      } 
      // Product in response.product
      else if (response.product) {
        product = response.product;
      }
      
      // Map to standardized format
      const mappedProduct = product ? mapProduct(product) : null;
      
      return {
        data: mappedProduct
      };
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  // Search products
  searchProducts: async (searchTerm, filters = {}) => {
    try {
      const params = { q: searchTerm, ...filters };
      const queryString = new URLSearchParams(params).toString();
      return await apiService.get(`${API_ENDPOINTS.products.search}?${queryString}`);
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  // Filter products
  filterProducts: async (filters) => {
    try {
      return await apiService.post(API_ENDPOINTS.products.filter, filters);
    } catch (error) {
      console.error('Error filtering products:', error);
      throw error;
    }
  },

  // Get product categories
  getCategories: async () => {
    try {
      return await apiService.get(API_ENDPOINTS.products.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get product reviews
  getProductReviews: async (productId) => {
    try {
      return await apiService.get(API_ENDPOINTS.reviews.getByProduct(productId));
    } catch (error) {
      console.error(`Error fetching reviews for product ${productId}:`, error);
      throw error;
    }
  },
};

export default productService;


