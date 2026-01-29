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
      setCart({ items: [], total: 0 });
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
        setCart(response.data);
      }
      
      return response;
    } catch (err) {
      setError(err.message || 'Failed to add to cart');
      const localCart = JSON.parse(localStorage.getItem('vcloud_cart') || '{"items":[],"total":0}');
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
      
      if (response.data) {
        setCart(response.data);
      } else {
        await fetchCart();
      }
      
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update cart item');
      
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
      
      if (response.data) {
        setCart(response.data);
      } else {
        await fetchCart();
      }
      
      return response;
    } catch (err) {
      setError(err.message || 'Failed to remove from cart');
      
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
      
      setCart({ items: [], total: 0 });
      return response;
    } catch (err) {
      setError(err.message || 'Failed to clear cart');
      
      // Clear localStorage anyway
      setCart({ items: [], total: 0 });
      localStorage.setItem('vcloud_cart', JSON.stringify({ items: [], total: 0 }));
      
      return { data: { items: [], total: 0 } };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

