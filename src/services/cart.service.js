import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

// Use localStorage for testing (fallback if API fails)
const CART_STORAGE_KEY = 'vcloud_cart';
const USE_DUMMY_DATA = true; // Set to false when backend is ready

// Helper functions for localStorage
const getCartFromStorage = () => {
  try {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : { items: [], total: 0 };
  } catch (error) {
    console.error('Error reading cart from storage:', error);
    return { items: [], total: 0 };
  }
};

const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};

export const cartService = {
  // Get cart items
  getCart: async () => {
    try {
      if (USE_DUMMY_DATA) {
        // Use localStorage for testing
        const cart = getCartFromStorage();
        return { data: cart };
      }
      return await apiService.get(API_ENDPOINTS.cart.get);
    } catch (error) {
      console.error('Error fetching cart:', error);
      // Fallback to localStorage
      const cart = getCartFromStorage();
      return { data: cart };
    }
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1, options = {}) => {
    try {
      if (USE_DUMMY_DATA) {
        // Use localStorage for testing
        const cart = getCartFromStorage();
        
        // Check if item already exists
        const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
        
        if (existingItemIndex > -1) {
          // Update quantity if item exists
          cart.items[existingItemIndex].quantity += quantity;
        } else {
          // Add new item
          const newItem = {
            id: Date.now(), // Simple ID for testing
            productId,
            quantity,
            name: options.name || 'Product',
            price: options.price || 0,
            image: options.image || '',
            sku: options.sku || 'N/A',
            ...options
          };
          cart.items.push(newItem);
        }
        
        // Calculate total
        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        saveCartToStorage(cart);
        return { data: cart, message: 'Product added to cart successfully!' };
      }
      
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
      if (USE_DUMMY_DATA) {
        const cart = getCartFromStorage();
        const itemIndex = cart.items.findIndex(item => item.id === itemId);
        
        if (itemIndex > -1) {
          if (quantity <= 0) {
            // Remove item if quantity is 0
            cart.items.splice(itemIndex, 1);
          } else {
            cart.items[itemIndex].quantity = quantity;
          }
          
          // Recalculate total
          cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          
          saveCartToStorage(cart);
          return { data: cart };
        }
        
        throw new Error('Item not found in cart');
      }
      
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
      if (USE_DUMMY_DATA) {
        const cart = getCartFromStorage();
        cart.items = cart.items.filter(item => item.id !== itemId);
        
        // Recalculate total
        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        saveCartToStorage(cart);
        return { data: cart };
      }
      
      return await apiService.delete(API_ENDPOINTS.cart.remove(itemId));
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      if (USE_DUMMY_DATA) {
        const cart = { items: [], total: 0 };
        saveCartToStorage(cart);
        return { data: cart };
      }
      
      return await apiService.delete(API_ENDPOINTS.cart.clear);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },
};

export default cartService;


