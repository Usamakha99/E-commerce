import { useState, useEffect } from 'react';
import { productService } from '../services/product.service';

/**
 * Custom hook for fetching a single product
 * @param {string|number} productId - The ID of the product to fetch
 * @param {boolean} autoFetch - Whether to fetch automatically on mount
 * @returns {Object} - Product data and utility functions
 */
export const useProduct = (productId, autoFetch = true) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProduct = async (id = productId) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await productService.getProductById(id);
      
      // Handle different response structures
      if (response.data) {
        setProduct(response.data);
      } else {
        setProduct(response);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && productId) {
      fetchProduct().catch(err => {
        // Silently handle error - fallback data will be used
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, autoFetch]);

  return {
    product,
    loading,
    error,
    fetchProduct,
    refetch: fetchProduct,
  };
};

export default useProduct;


