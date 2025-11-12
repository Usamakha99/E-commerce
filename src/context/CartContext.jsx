import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cart.service';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await cartService.getCart();
      
      console.log('🛒 CartContext - Fetch Cart Response:', response);
      
      if (response.data) {
        setCart(response.data);
      } else {
        setCart(response);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch cart');
      console.error('Error fetching cart:', err);
      // Don't throw - use empty cart as fallback
      setCart({ items: [], total: 0 });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('➕ CartContext - Adding to cart:', { productId, quantity, options });
      const response = await cartService.addToCart(productId, quantity, options);
      
      console.log('🛒 CartContext - Add to Cart Response:', response);
      
      if (response.data) {
        // Immediately update cart state
        console.log('✅ Updating cart state with:', response.data);
        setCart(response.data);
      }
      
      return response;
    } catch (err) {
      console.error('❌ CartContext - Error adding to cart:', err);
      setError(err.message || 'Failed to add to cart');
      
      // IMPORTANT: cart.service.js already handles localStorage fallback
      // So this catch block should rarely execute
      // But if it does, sync from localStorage
      console.warn('⚠️ Syncing cart from localStorage after error');
      const localCart = JSON.parse(localStorage.getItem('vcloud_cart') || '{"items":[],"total":0}');
      console.log('📦 LocalStorage cart:', localCart);
      setCart(localCart);
      
      return { data: localCart, message: 'Product added to cart (stored locally)' };
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await cartService.updateCartItem(itemId, quantity);
      
      console.log('🛒 CartContext - Update Item Response:', response);
      
      if (response.data) {
        setCart(response.data);
      } else {
        await fetchCart();
      }
      
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update cart item');
      console.error('Error updating cart item:', err);
      
      // Update from localStorage
      const localCart = JSON.parse(localStorage.getItem('vcloud_cart') || '{"items":[],"total":0}');
      setCart(localCart);
      
      return { data: localCart };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await cartService.removeFromCart(itemId);
      
      console.log('🛒 CartContext - Remove Item Response:', response);
      
      if (response.data) {
        setCart(response.data);
      } else {
        await fetchCart();
      }
      
      return response;
    } catch (err) {
      setError(err.message || 'Failed to remove from cart');
      console.error('Error removing from cart:', err);
      
      // Update from localStorage
      const localCart = JSON.parse(localStorage.getItem('vcloud_cart') || '{"items":[],"total":0}');
      setCart(localCart);
      
      return { data: localCart };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await cartService.clearCart();
      
      console.log('🛒 CartContext - Clear Cart Response:', response);
      
      setCart({ items: [], total: 0 });
      return response;
    } catch (err) {
      setError(err.message || 'Failed to clear cart');
      console.error('Error clearing cart:', err);
      
      // Clear localStorage anyway
      setCart({ items: [], total: 0 });
      localStorage.setItem('vcloud_cart', JSON.stringify({ items: [], total: 0 }));
      
      return { data: { items: [], total: 0 } };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch cart on initial load
    console.log('🚀 CartContext Mounted - Fetching cart...');
    fetchCart();
  }, []);

  // Debug: Log cart state changes
  useEffect(() => {
    console.log('🔄 Cart State Changed:', {
      itemCount: cart?.items?.length || 0,
      total: cart?.total || 0,
      items: cart?.items
    });
  }, [cart]);

  const value = {
    cart,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refetch: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

