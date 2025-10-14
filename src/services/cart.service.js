import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

export const cartService = {
  // Get cart items
  getCart: async () => {
    try {
      return await apiService.get(API_ENDPOINTS.cart.get);
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1, options = {}) => {
    try {
      return await apiService.post(API_ENDPOINTS.cart.add, {
        productId,
        quantity,
        ...options,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  // Update cart item
  updateCartItem: async (itemId, quantity) => {
    try {
      return await apiService.put(API_ENDPOINTS.cart.update(itemId), {
        quantity,
      });
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    try {
      return await apiService.delete(API_ENDPOINTS.cart.remove(itemId));
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      return await apiService.delete(API_ENDPOINTS.cart.clear);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },
};

export default cartService;


