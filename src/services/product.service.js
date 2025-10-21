import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { mapProduct, mapProducts } from '../utils/dataMapper';

export const productService = {
  // Get all categories with subcategories
  getAllCategories: async () => {
    try {
      // Fetch categories
      console.log('Fetching categories from:', API_ENDPOINTS.categories.getAll);
      const categoriesResponse = await apiService.get(API_ENDPOINTS.categories.getAll);
      console.log('Categories API Response:', categoriesResponse);
      
      let categories = Array.isArray(categoriesResponse) ? categoriesResponse : (categoriesResponse?.data || []);
      
      // Fetch products to extract subcategories
      try {
        console.log('Fetching products to extract subcategories...');
        const productsResponse = await apiService.get('/products/imports?status=completed&page=1&limit=1000');
        console.log('Products Response for subcategories:', productsResponse);
        
        const products = productsResponse?.data || [];
        
        if (products.length > 0) {
          // Extract unique subcategories from products
          const subcategoriesMap = new Map();
          
          products.forEach(product => {
            if (product.subCategory && product.subCategory.parentId) {
              const subcat = product.subCategory;
              const key = `${subcat.id}`;
              
              if (!subcategoriesMap.has(key)) {
                subcategoriesMap.set(key, {
                  id: subcat.id,
                  title: subcat.title,
                  name: subcat.title,
                  parentId: subcat.parentId,
                  productCount: 1
                });
              } else {
                const existing = subcategoriesMap.get(key);
                existing.productCount++;
              }
            }
          });
          
          console.log('Extracted subcategories:', Array.from(subcategoriesMap.values()));
          
          // Instead of showing categories with subcategories, 
          // flatten and show subcategories directly as main categories
          const allSubcategories = Array.from(subcategoriesMap.values());
          
          // Convert subcategories to category format
          categories = allSubcategories.map(subcat => ({
            id: subcat.id,
            title: subcat.title,
            name: subcat.title,
            productCount: subcat.productCount,
            parentId: subcat.parentId
          }));
          
          console.log('Flattened categories (from subcategories):', categories);
        }
      } catch (productsError) {
        console.log('Could not fetch products for subcategories:', productsError.message);
      }
      
      return { data: categories };
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

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


