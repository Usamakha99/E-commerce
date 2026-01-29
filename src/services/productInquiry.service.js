import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

export const productInquiryService = {
  // Create product inquiry
  createInquiry: async (inquiryData) => {
    try {
      const endpoint = API_ENDPOINTS.productInquiries.create;
      const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
      const fullURL = `${baseURL}${endpoint}`;
      
      console.log('=== Product Inquiry API Call ===');
      console.log('Base URL:', baseURL);
      console.log('Endpoint:', endpoint);
      console.log('Full URL:', fullURL);
      console.log('Inquiry data:', inquiryData);
      console.log('===============================');
      
      const response = await apiService.post(endpoint, inquiryData);
      console.log('✅ Inquiry created successfully:', response);
      return response.data || response;
    } catch (error) {
      console.error('❌ Error creating product inquiry:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method,
        headers: error.config?.headers
      });
      
      // Log the exact URL that was called
      if (error.config) {
        const attemptedURL = `${error.config.baseURL}${error.config.url}`;
        console.error('Attempted URL:', attemptedURL);
      }
      
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
      console.error('Error fetching product inquiries:', error);
      throw error;
    }
  },

  // Get inquiry by ID
  getInquiryById: async (id) => {
    try {
      const response = await apiService.get(API_ENDPOINTS.productInquiries.getById(id));
      return response.data || response;
    } catch (error) {
      console.error(`Error fetching product inquiry ${id}:`, error);
      throw error;
    }
  },
};

export default productInquiryService;

