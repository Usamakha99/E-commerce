import { useState, useEffect } from 'react';
import { productService } from '../services/product.service';

/**
 * Custom hook for fetching and managing products
 * @param {Object} options - Options for fetching products
 * @param {Object} options.filters - Filter parameters
 * @param {boolean} options.autoFetch - Whether to fetch automatically on mount
 * @returns {Object} - Products data and utility functions
 */
export const useProducts = (options = {}) => {
  const { filters = {}, autoFetch = true } = options;
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 30,
    total: 0,
    totalPages: 0,
  });

  const fetchProducts = async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productService.getAllProducts({
        ...filters,
        ...params,
      });
      
      // Handle different response structures
      if (response.data) {
        setProducts(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else if (Array.isArray(response)) {
        setProducts(response);
      } else {
        setProducts([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (searchTerm) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productService.searchProducts(searchTerm, filters);
      
      if (response.data) {
        setProducts(response.data);
      } else if (Array.isArray(response)) {
        setProducts(response);
      } else {
        setProducts([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to search products');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = async (newFilters) => {
    await fetchProducts(newFilters);
  };

  useEffect(() => {
    if (autoFetch) {
      // Shop page expects "all products" and does client-side pagination/filtering.
      // Default to a large limit unless caller overrides.
      fetchProducts({ limit: 1000 }).catch(() => {
        // Silently handle error - fallback data will be used
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    searchProducts,
    filterProducts,
    refetch: fetchProducts,
  };
};

export default useProducts;


