import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

export const productTagsService = {
  // Get all product tags
  getAllTags: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString 
        ? `${API_ENDPOINTS.productTags.getAll}?${queryString}` 
        : API_ENDPOINTS.productTags.getAll;
      
      const response = await apiService.get(url);
      return Array.isArray(response) ? response : (response?.data || []);
    } catch (error) {
      throw error;
    }
  },

  // Get a single tag by ID
  getTagById: async (id) => {
    try {
      const response = await apiService.get(API_ENDPOINTS.productTags.getById(id));
      return response?.data || response;
    } catch (error) {
      throw error;
    }
  },

  // Create a new tag
  createTag: async (tagData) => {
    try {
      const response = await apiService.post(API_ENDPOINTS.productTags.create, tagData);
      return response?.data || response;
    } catch (error) {
      throw error;
    }
  },

  // Update a tag
  updateTag: async (id, tagData) => {
    try {
      const response = await apiService.put(API_ENDPOINTS.productTags.update(id), tagData);
      return response?.data || response;
    } catch (error) {
      throw error;
    }
  },

  // Delete a tag
  deleteTag: async (id) => {
    try {
      const response = await apiService.delete(API_ENDPOINTS.productTags.delete(id));
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Add products to a tag
  addProductsToTag: async (tagId, productIds) => {
    try {
      const response = await apiService.post(
        API_ENDPOINTS.productTags.addProducts(tagId),
        { productIds }
      );
      return response?.data || response;
    } catch (error) {
      throw error;
    }
  },

  // Get tags for a specific product (if your API supports it)
  getTagsByProduct: async (productId) => {
    try {
      // This assumes your API might have an endpoint like /producttags?productId=1
      // Adjust based on your actual API structure
      const response = await apiService.get(`${API_ENDPOINTS.productTags.getAll}?productId=${productId}`);
      return Array.isArray(response) ? response : (response?.data || []);
    } catch (error) {
      return []; // Return empty array on error
    }
  },
};

export default productTagsService;

