import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

export const wishlistService = {
  // Get all wishlist items
  getWishlist: async () => {
    try {
      return await apiService.get(API_ENDPOINTS.wishlist.getAll);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      throw error;
    }
  },

  // Add item to wishlist
  addToWishlist: async (productId) => {
    try {
      return await apiService.post(API_ENDPOINTS.wishlist.add, {
        productId,
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  },

  // Remove item from wishlist
  removeFromWishlist: async (itemId) => {
    try {
      return await apiService.delete(API_ENDPOINTS.wishlist.remove(itemId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  },

  // Check if item is in wishlist
  isInWishlist: async (productId) => {
    try {
      const wishlist = await wishlistService.getWishlist();
      return wishlist.items.some(item => item.productId === productId);
    } catch (error) {
      console.error('Error checking wishlist:', error);
      return false;
    }
  },
};

export default wishlistService;


