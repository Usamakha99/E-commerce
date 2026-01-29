import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

export const productInquiryService = {
  // Create product inquiry
  createInquiry: async (inquiryData) => {
    try {
      const endpoint = API_ENDPOINTS.productInquiries.create;
      const response = await apiService.post(endpoint, inquiryData);
      return response.data || response;
    } catch (error) {
      throw error;
    }
  },

  // Get all inquiries
  getAllInquiries: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString
        ? `${API_ENDPOINTS.productInquiries.getAll}?${queryString}`
        : API_ENDPOINTS.productInquiries.getAll;
      const response = await apiService.get(url);
      return response.data || response;
    } catch (error) {
      throw error;
    }
  },

  // Get inquiry by ID
  getInquiryById: async (id) => {
    try {
      const response = await apiService.get(API_ENDPOINTS.productInquiries.getById(id));
      return response.data || response;
    } catch (error) {
      throw error;
    }
  },
};

export default productInquiryService;

