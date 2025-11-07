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
      
      if (response.data) {
        setCart(response.data);
      } else {
        setCart(response);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch cart');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await cartService.addToCart(productId, quantity, options);
      
      if (response.data) {
        // Immediately update cart state
        setCart(response.data);
      }
      
      return response;
    } catch (err) {
      setError(err.message || 'Failed to add to cart');
      console.error('Error adding to cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await cartService.updateCartItem(itemId, quantity);
      
      if (response.data) {
        setCart(response.data);
      } else {
        await fetchCart();
      }
      
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update cart item');
      console.error('Error updating cart item:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await cartService.removeFromCart(itemId);
      
      if (response.data) {
        setCart(response.data);
      } else {
        await fetchCart();
      }
      
      return response;
    } catch (err) {
      setError(err.message || 'Failed to remove from cart');
      console.error('Error removing from cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await cartService.clearCart();
      setCart({ items: [], total: 0 });
    } catch (err) {
      setError(err.message || 'Failed to clear cart');
      console.error('Error clearing cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch cart on initial load
    fetchCart();
  }, []);

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

