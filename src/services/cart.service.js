import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

// Use localStorage for testing (fallback if API fails)
const CART_STORAGE_KEY = 'vcloud_cart';
const SESSION_ID_KEY = 'vcloud_session_id';
const CART_ID_KEY = 'vcloud_cart_id';
const USE_DUMMY_DATA = false; // ✅ Backend API is ready!

// Helper to get or create session ID for guest users
const getSessionId = () => {
  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    // Generate a simple session ID
    sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
};

// Helper to get/set cart ID
const getCartId = () => localStorage.getItem(CART_ID_KEY);
const setCartId = (cartId) => localStorage.setItem(CART_ID_KEY, cartId);

// Helper functions for localStorage
const getCartFromStorage = () => {
  try {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    const parsed = cart ? JSON.parse(cart) : { items: [], total: 0 };
    console.log('📦 Getting Cart from localStorage:', parsed);
    return parsed;
  } catch (error) {
    console.error('Error reading cart from storage:', error);
    return { items: [], total: 0 };
  }
};

const saveCartToStorage = (cart) => {
  try {
    console.log('💾 Saving Cart to localStorage:', cart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    console.log('✅ Cart saved successfully!');
  } catch (error) {
    console.error('❌ Error saving cart to storage:', error);
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
      
      // ✅ For guest users, ALWAYS use localStorage
      // Check if user is logged in by checking for auth token
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        console.log('🔓 Guest user detected, using localStorage cart');
        const cart = getCartFromStorage();
        return { data: cart };
      }
      
      // ✅ For logged-in users, try backend API
      console.log('👤 Logged-in user, fetching from backend');
      const sessionId = getSessionId();
      const response = await apiService.get(`${API_ENDPOINTS.cart.get}?sessionId=${sessionId}`);
      
      // Store cartId for future operations
      if (response.data?.id || response.id) {
        setCartId(response.data?.id || response.id);
      }
      
      return response;
    } catch (error) {
      console.error('Error fetching cart:', error);
      console.log('🔄 Error details:', error.response?.data);
      
      // If any error (auth, userId null, network), fallback to localStorage
      console.warn('⚠️ Falling back to localStorage cart');
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
      
      // ✅ For guest users, ALWAYS use localStorage (skip backend API)
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        console.log('🔓 Guest user - Adding to localStorage cart');
        const cart = getCartFromStorage();
        
        // Check if item already exists
        const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
        
        if (existingItemIndex > -1) {
          cart.items[existingItemIndex].quantity += quantity;
        } else {
          const newItem = {
            id: Date.now(),
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
        
        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        console.log('💾 About to save cart to localStorage:', cart);
        saveCartToStorage(cart);
        console.log('✅ Returning localStorage cart data:', cart);
        return { data: cart, message: 'Product added to cart successfully!' };
      }
      
      // ✅ For logged-in users, use backend API
      console.log('👤 Logged-in user - Adding to backend cart');
      const sessionId = getSessionId();
      const response = await apiService.post(API_ENDPOINTS.cart.add, {
        productId,
        quantity,
        price: options.price || 0,
        sessionId,
        ...options,
      });
      
      // Store cartId for future operations
      if (response.data?.id || response.id) {
        setCartId(response.data?.id || response.id);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Error adding to cart (logged-in user backend error):', error);
      console.log('📊 Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      // For logged-in users, if backend fails, fallback to localStorage temporarily
      console.warn('⚠️ Backend error for logged-in user, using localStorage as fallback');
      const cart = getCartFromStorage();

      // Check if item already exists
      const existingItemIndex = cart.items.findIndex(item => item.productId === productId);

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        const newItem = {
          id: Date.now(),
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

      cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      console.log('💾 About to save cart to localStorage:', cart);
      saveCartToStorage(cart);
      console.log('✅ Returning localStorage cart data:', cart);
      return { data: cart, message: 'Product added to cart successfully! (Stored locally due to server error)' };
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
      
      // ✅ For guest users, ALWAYS use localStorage
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        console.log('🔓 Guest user - Updating localStorage cart');
        const cart = getCartFromStorage();
        const itemIndex = cart.items.findIndex(item => item.id === itemId);
        
        if (itemIndex > -1) {
          if (quantity <= 0) {
            cart.items.splice(itemIndex, 1);
          } else {
            cart.items[itemIndex].quantity = quantity;
          }
          cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          saveCartToStorage(cart);
          return { data: cart };
        }
        
        throw new Error('Item not found in cart');
      }
      
      // ✅ For logged-in users, try backend API
      console.log('👤 Logged-in user - Updating backend cart');
      const cartId = getCartId();
      if (!cartId) {
        throw new Error('Cart ID not found');
      }
      
      const response = await apiService.put(API_ENDPOINTS.cart.update(cartId), {
        itemId,
        quantity,
      });
      return response;
    } catch (error) {
      console.error('❌ Error updating cart item (logged-in user backend error):', error);
      
      // Fallback to localStorage
      console.warn('⚠️ Backend error, using localStorage as fallback');
      const cart = getCartFromStorage();
      const itemIndex = cart.items.findIndex(item => item.id === itemId);

      if (itemIndex > -1) {
        if (quantity <= 0) {
          cart.items.splice(itemIndex, 1);
        } else {
          cart.items[itemIndex].quantity = quantity;
        }

        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        saveCartToStorage(cart);
        return { data: cart };
      }

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
      
      // ✅ For guest users, ALWAYS use localStorage
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        console.log('🔓 Guest user - Removing from localStorage cart');
        const cart = getCartFromStorage();
        cart.items = cart.items.filter(item => item.id !== itemId);
        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        saveCartToStorage(cart);
        return { data: cart };
      }
      
      // ✅ For logged-in users, try backend API
      console.log('👤 Logged-in user - Removing from backend cart');
      const cartId = getCartId();
      if (!cartId) {
        throw new Error('Cart ID not found');
      }
      
      console.log('🗑️ Removing item from cart:', { cartId, itemId });
      
      // DELETE with itemId in request body
      const response = await apiService.delete(API_ENDPOINTS.cart.remove(cartId), {
        data: { itemId }
      });
      
      console.log('✅ Backend remove response:', response);
      return response;
    } catch (error) {
      console.error('❌ Error removing from cart:', error);

      // If user is not logged in or any error, fallback to localStorage
      console.warn('Falling back to localStorage for remove operation');
      const cart = getCartFromStorage();
      cart.items = cart.items.filter(item => item.id !== itemId);

      // Recalculate total
      cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      saveCartToStorage(cart);
      return { data: cart };
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

      // ✅ For guest users, ALWAYS use localStorage
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        console.log('🔓 Guest user - Clearing localStorage cart');
        const cart = { items: [], total: 0 };
        saveCartToStorage(cart);
        return { data: cart };
      }

      // ✅ For logged-in users, try backend API
      console.log('👤 Logged-in user - Clearing backend cart');
      const cartId = getCartId();
      if (!cartId) {
        throw new Error('Cart ID not found');
      }

      const response = await apiService.delete(API_ENDPOINTS.cart.clear(cartId));
      return response;
    } catch (error) {
      console.error('❌ Error clearing cart (logged-in user backend error):', error);

      // Fallback to localStorage
      console.warn('⚠️ Backend error, clearing localStorage as fallback');
      const cart = { items: [], total: 0 };
      saveCartToStorage(cart);
      return { data: cart };
    }
  },
};

export default cartService;


