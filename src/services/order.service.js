import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

export const orderService = {
  // Create new order
  createOrder: async (orderData) => {
    try {
      return await apiService.post(API_ENDPOINTS.orders.create, orderData);
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Get all orders for current user
  getAllOrders: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString 
        ? `${API_ENDPOINTS.orders.getAll}?${queryString}` 
        : API_ENDPOINTS.orders.getAll;
      
      return await apiService.get(url);
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Get single order by ID
  getOrderById: async (id) => {
    try {
      return await apiService.get(API_ENDPOINTS.orders.getById(id));
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      throw error;
    }
  },

  // Cancel order
  cancelOrder: async (id) => {
    try {
      return await apiService.post(API_ENDPOINTS.orders.cancel(id));
    } catch (error) {
      console.error(`Error canceling order ${id}:`, error);
      throw error;
    }
  },
};

export default orderService;


