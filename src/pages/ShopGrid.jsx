import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Sidebar from '../components/Sidebar';
import ApiStatus from '../components/ApiStatus';
import { useProducts } from '../hooks/useProducts';
import { productService } from '../services/product.service';
import { productTagsService } from '../services/productTags.service';
import { useAuth } from '../hooks/useAuth';

const ShopGrid = () => {
  const [viewType, setViewType] = useState('grid');
  const [sortBy, setSortBy] = useState('latest');
  const [showPerPage, setShowPerPage] = useState(20); // 20 products per page
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showItemsDropdown, setShowItemsDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [productTags, setProductTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [productTagsMap, setProductTagsMap] = useState({}); // Map productId -> tags
  
  // ✅ Check if user is logged in (reactive to auth changes)
  const { isLoggedIn } = useAuth();

  // Fetch ALL products from API once
  const { products: allProducts, loading, error, fetchProducts } = useProducts({
    filters: {
      sort: sortBy
    },
    autoFetch: true,
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Update document title based on search/category
  useEffect(() => {
    let title = 'Shop';
    
    if (searchQuery) {
      title = `Search: ${searchQuery} - VCloud Tech`;
    } else if (selectedCategoryName) {
      title = `${selectedCategoryName} - Shop - VCloud Tech`;
    } else {
      title = 'Shop - VCloud Tech';
    }
    
    document.title = title;
  }, [searchQuery, selectedCategoryName]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productService.getAllCategories();
        const cats = Array.isArray(response) ? response : (response?.data || []);
        setCategories(cats);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch product tags and build product-tag mapping
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await productTagsService.getAllTags({ isActive: true });
        setProductTags(tags);
        
        // Build a map of product IDs to their tags
        // Handle different API response structures
        const tagsMap = {};
        
        tags.forEach(tag => {
          // Check if tag has products array (could be product IDs or product objects)
          if (tag.products && Array.isArray(tag.products)) {
            tag.products.forEach(product => {
              // Handle both product ID (number) and product object with id
              const productId = typeof product === 'number' ? product : (product?.id || product?.productId);
              if (productId) {
                if (!tagsMap[productId]) {
                  tagsMap[productId] = [];
                }
                tagsMap[productId].push(tag);
              }
            });
          }
        });
        
        setProductTagsMap(tagsMap);
      } catch (error) {
        console.error('Error fetching product tags:', error);
        setProductTags([]);
        setProductTagsMap({});
      }
    };
    fetchTags();
  }, []);

  // Handle URL parameters for category filtering and search
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const searchParam = urlParams.get('search');

    if (categoryParam) {
      const categoryId = parseInt(categoryParam);
      if (!isNaN(categoryId)) {
        setSelectedCategory(categoryId);
      }
    }

    if (searchParam) {
      setSearchQuery(searchParam);
    } else {
      setSearchQuery('');
    }
  }, [window.location.search]);

  // Update selected category name when category changes
  useEffect(() => {
    if (selectedCategory && categories.length > 0) {
      const category = categories.find(cat => cat.id === selectedCategory);
      if (category) {
        setSelectedCategoryName(category.name || category.title || '');
      }
    } else {
      setSelectedCategoryName('');
    }
  }, [selectedCategory, categories]);

  // CLIENT-SIDE FILTERING AND PAGINATION: Filter by search, category and brands then sort and paginate
  const filteredProducts = allProducts ? allProducts.filter(product => {
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const productName = (product.name || product.title || '').toLowerCase();
      const productShortDesc = (product.shortDescp || '').toLowerCase();
      const productSku = (product.sku || '').toString().toLowerCase();
      
      if (!productName.includes(query) && !productShortDesc.includes(query) && !productSku.includes(query)) {
        return false;
      }
    }

    // Filter by category (using subCategoryId since we're showing subcategories)
    if (selectedCategory !== null) {
      if (product.subCategoryId !== selectedCategory) return false;
    }

    // Filter by brands - only apply if brands are selected
    if (selectedBrands.length > 0) {
      const productBrand = product.brand?.title || 'Unknown';
      if (!selectedBrands.includes(productBrand)) return false;
    }

    // Filter by tags - only apply if tags are selected
    if (selectedTags.length > 0) {
      const productTags = productTagsMap[product.id] || [];
      const productTagIds = productTags.map(tag => tag.id);
      const hasSelectedTag = selectedTags.some(tagId => productTagIds.includes(tagId));
      if (!hasSelectedTag) return false;
    }

    // If we reach here, the product matches all applied filters
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        // Try createdAt/updatedAt first, then fallback to ID (higher ID = newer)
        if (a.createdAt || a.updatedAt || b.createdAt || b.updatedAt) {
          return new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0);
        }
        // Fallback: Sort by ID descending (higher ID = newer product)
        return (b.id || 0) - (a.id || 0);
      
      case 'oldest':
        // Try createdAt/updatedAt first, then fallback to ID (lower ID = older)
        if (a.createdAt || a.updatedAt || b.createdAt || b.updatedAt) {
          return new Date(a.createdAt || a.updatedAt || 0) - new Date(b.createdAt || b.updatedAt || 0);
        }
        // Fallback: Sort by ID ascending (lower ID = older product)
        return (a.id || 0) - (b.id || 0);
      
      case 'price-low':
        return (a.price || 0) - (b.price || 0);
      
      case 'price-high':
        return (b.price || 0) - (a.price || 0);
      
      default:
        return 0;
    }
  }) : [];

  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / showPerPage);
  const startIndex = (currentPage - 1) * showPerPage;
  const endIndex = startIndex + showPerPage;
  const products = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when sort changes
  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [sortBy]);

  // Reset to page 1 when changing items per page
  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [showPerPage]);

  // Reset to page 1 when brand filter changes
  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedBrands]);

  // Reset to page 1 when tag filter changes
  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedTags]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking on dropdown button or dropdown menu
      const clickedDropdown = event.target.closest('.dropdown');
      const clickedButton = event.target.closest('.dropdown-toggle');

      if (!clickedDropdown && !clickedButton) {
        setShowSortDropdown(false);
        setShowItemsDropdown(false);
      }
    };

    // Add small delay to prevent immediate closing
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showSortDropdown, showItemsDropdown]);


  // Handler for changing products per page
  const handleShowPerPage = (count) => {
    setShowPerPage(count);
    setCurrentPage(1);
  };

  // Handler for page navigation
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler for brand filter changes
  const handleBrandFilter = (brands) => {
    setSelectedBrands(brands);
  };

  // Handler for category filter changes
  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to page 1 when category changes
  };

  // Handler for tag filter changes
  const handleTagFilter = (tagId) => {
    setSelectedTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };

  // Handler to clear all tags
  const handleClearAllTags = () => {
    setSelectedTags([]);
    setCurrentPage(1);
  };

  // Handler to clear all filters
  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedBrands([]);
    setSelectedTags([]);
    setCurrentPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = selectedCategory !== null || selectedBrands.length > 0 || selectedTags.length > 0;


  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
      }
    }

    return pages;
  };

  return (
    <main className="main" style={{ paddingTop: '60px' }}>


      {/* Main Content */}
      <div className="section-box shop-template mt-30">
        <div className="container">
          {/* API Status Indicator */}
            <div className="row mb-3">
              <div className="col-12">
                <ApiStatus />
              </div>
            </div>

          <div className="row">
            <div className="col-lg-9 order-first order-lg-last">
              {/* Filters and Sort */}
              <div className="box-filters mt-0 pb-5 border-bottom">
                <div className="row">
                                     <div className="col-xl-10 col-lg-9 mb-10 text-lg-end text-center">
                     <span className="font-sm  font-medium border-1-right span">
                       Showing: {startIndex + 1}-{Math.min(endIndex, totalProducts)} of {totalProducts} results
                     </span>
                    <div className="d-inline-block">
                      <span className="font-sm font-medium">Sort by :</span>
                      <div className="dropdown dropdown-sort border-1-right" style={{ position: 'relative' }}>
                        <button
                          className="btn dropdown-toggle font-sm   font-medium"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowSortDropdown(!showSortDropdown);
                            setShowItemsDropdown(false);
                          }}
                        >
                          {sortBy === 'latest' ? 'Latest products' :
                            sortBy === 'oldest' ? 'Oldest products' :
                              sortBy === 'price-low' ? 'Price: Low to High' :
                                sortBy === 'price-high' ? 'Price: High to Low' : 'Latest products'}
                        </button>
                        {showSortDropdown && (
                          <ul className="dropdown-menu dropdown-menu-light show" style={{ display: 'block', position: 'absolute', zIndex: 1000 }}>
                            <li>
                              <a
                                className={`dropdown-item ${sortBy === 'latest' ? 'active' : ''}`}
                                href="#"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSortBy('latest'); setShowSortDropdown(false); }}
                                style={sortBy === 'latest' ? { backgroundColor: 'rgb(17, 26, 69)', color: '#fff' } : { color: 'rgb(17, 26, 69)' }}
                                onMouseEnter={(e) => { if (sortBy !== 'latest') { e.currentTarget.style.backgroundColor = 'rgba(17, 26, 69, 0.08)'; } }}
                                onMouseLeave={(e) => { if (sortBy !== 'latest') { e.currentTarget.style.backgroundColor = 'transparent'; } }}
                              >
                                Latest products
                              </a>
                            </li>
                            <li>
                              <a
                                className={`dropdown-item ${sortBy === 'oldest' ? 'active' : ''}`}
                                href="#"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSortBy('oldest'); setShowSortDropdown(false); }}
                                style={sortBy === 'oldest' ? { backgroundColor: 'rgb(17, 26, 69)', color: '#fff' } : { color: 'rgb(17, 26, 69)' }}
                                onMouseEnter={(e) => { if (sortBy !== 'oldest') { e.currentTarget.style.backgroundColor = 'rgba(17, 26, 69, 0.08)'; } }}
                                onMouseLeave={(e) => { if (sortBy !== 'oldest') { e.currentTarget.style.backgroundColor = 'transparent'; } }}
                              >
                                Oldest products
                              </a>
                            </li>
                            <li>
                              <a
                                className={`dropdown-item ${sortBy === 'price-low' ? 'active' : ''}`}
                                href="#"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSortBy('price-low'); setShowSortDropdown(false); }}
                                style={sortBy === 'price-low' ? { backgroundColor: 'rgb(17, 26, 69)', color: '#fff' } : { color: 'rgb(17, 26, 69)' }}
                                onMouseEnter={(e) => { if (sortBy !== 'price-low') { e.currentTarget.style.backgroundColor = 'rgba(17, 26, 69, 0.08)'; } }}
                                onMouseLeave={(e) => { if (sortBy !== 'price-low') { e.currentTarget.style.backgroundColor = 'transparent'; } }}
                              >
                                Price: Low to High
                              </a>
                            </li>
                            <li>
                              <a
                                className={`dropdown-item ${sortBy === 'price-high' ? 'active' : ''}`}
                                href="#"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSortBy('price-high'); setShowSortDropdown(false); }}
                                style={sortBy === 'price-high' ? { backgroundColor: 'rgb(17, 26, 69)', color: '#fff' } : { color: 'rgb(17, 26, 69)' }}
                                onMouseEnter={(e) => { if (sortBy !== 'price-high') { e.currentTarget.style.backgroundColor = 'rgba(17, 26, 69, 0.08)'; } }}
                                onMouseLeave={(e) => { if (sortBy !== 'price-high') { e.currentTarget.style.backgroundColor = 'transparent'; } }}
                              >
                                Price: High to Low
                              </a>
                            </li>
                          </ul>
                        )}
                      </div>
                    </div>
                    <div className="d-inline-block">
                      <span className="font-sm font-medium">Show :</span>
                      <div className="dropdown dropdown-sort border-1-right" style={{ position: 'relative' }}>
                        <button
                          className="btn dropdown-toggle font-sm   font-medium"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowItemsDropdown(!showItemsDropdown);
                            setShowSortDropdown(false);
                          }}
                        >
                          <span>{showPerPage} items</span>
                        </button>
                        {showItemsDropdown && (
                          <ul className="dropdown-menu dropdown-menu-light show" style={{ display: 'block', position: 'absolute', zIndex: 1000 }}>
                            <li>
                              <a
                                className={`dropdown-item ${showPerPage === 20 ? 'active' : ''}`}
                                href="#"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleShowPerPage(20); setShowItemsDropdown(false); }}
                                style={showPerPage === 20 ? { backgroundColor: 'rgb(17, 26, 69)', color: '#fff' } : { color: 'rgb(17, 26, 69)' }}
                                onMouseEnter={(e) => { if (showPerPage !== 20) { e.currentTarget.style.backgroundColor = 'rgba(17, 26, 69, 0.08)'; } }}
                                onMouseLeave={(e) => { if (showPerPage !== 20) { e.currentTarget.style.backgroundColor = 'transparent'; } }}
                              >
                                20 items
                              </a>
                            </li>
                            <li>
                              <a
                                className={`dropdown-item ${showPerPage === 30 ? 'active' : ''}`}
                                href="#"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleShowPerPage(30); setShowItemsDropdown(false); }}
                                style={showPerPage === 30 ? { backgroundColor: 'rgb(17, 26, 69)', color: '#fff' } : { color: 'rgb(17, 26, 69)' }}
                                onMouseEnter={(e) => { if (showPerPage !== 30) { e.currentTarget.style.backgroundColor = 'rgba(17, 26, 69, 0.08)'; } }}
                                onMouseLeave={(e) => { if (showPerPage !== 30) { e.currentTarget.style.backgroundColor = 'transparent'; } }}
                              >
                                30 items
                              </a>
                            </li>
                            <li>
                              <a
                                className={`dropdown-item ${showPerPage === 50 ? 'active' : ''}`}
                                href="#"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleShowPerPage(50); setShowItemsDropdown(false); }}
                                style={showPerPage === 50 ? { backgroundColor: 'rgb(17, 26, 69)', color: '#fff' } : { color: 'rgb(17, 26, 69)' }}
                                onMouseEnter={(e) => { if (showPerPage !== 50) { e.currentTarget.style.backgroundColor = 'rgba(17, 26, 69, 0.08)'; } }}
                                onMouseLeave={(e) => { if (showPerPage !== 50) { e.currentTarget.style.backgroundColor = 'transparent'; } }}
                              >
                                50 items
                              </a>
                            </li>
                            <li>
                              <a
                                className={`dropdown-item ${showPerPage === 100 ? 'active' : ''}`}
                                href="#"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleShowPerPage(100); setShowItemsDropdown(false); }}
                                style={showPerPage === 100 ? { backgroundColor: 'rgb(17, 26, 69)', color: '#fff' } : { color: 'rgb(17, 26, 69)' }}
                                onMouseEnter={(e) => { if (showPerPage !== 100) { e.currentTarget.style.backgroundColor = 'rgba(17, 26, 69, 0.08)'; } }}
                                onMouseLeave={(e) => { if (showPerPage !== 100) { e.currentTarget.style.backgroundColor = 'transparent'; } }}
                              >
                                100 items
                              </a>
                            </li>
                          </ul>
                        )}
                      </div>
                    </div>
                    <div className="d-inline-block">
                      <a className={`view-type-grid mr-5 ${viewType === 'grid' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); setViewType('grid'); }}></a>
                      <a className={`view-type-list ${viewType === 'list' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); setViewType('list'); }}></a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className={`row mt-20 ${viewType === 'list' ? 'list-view' : 'grid-view'}`}>
                {loading && (
                  <div className="col-12 text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading products from API...</p>
                  </div>
                )}

                {!loading && (!products || products.length === 0) && (
                  <div className="col-12 text-center py-5">
                    <div className="alert alert-info" role="alert">
                      <h4 className="alert-heading">No Products Available</h4>
                      <p className="mb-0">
                        {error ? (
                          <>
                            <strong>API Error:</strong> {error}
                            <br />
                            <small>Please make sure your backend API is running on http://localhost:5000</small>
                          </>
                        ) : (
                          <>
                            No products found in the database.
                            <br />
                            <small>Check your backend API to ensure products are available.</small>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                )}


                {!loading && products && products.map((product, index) => (
                  <React.Fragment key={product.id}>
                    <div className={viewType === 'list' ? 'col-12 mb-20' : 'col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mb-20'}>
                      <div className="product-card" style={{
                        border: '1px solid #b0b0b0',
                        borderRadius: '0',
                        padding: '15px',
                        backgroundColor: '#fff',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
                        transition: 'box-shadow 0.3s ease'
                      }}>
                        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <div className="text-center mb-2" style={{ position: 'relative' }}>
                            {/* Product Tags Badges */}
                            {productTagsMap[product.id] && productTagsMap[product.id].length > 0 && (
                              <div style={{
                                position: 'absolute',
                                top: '8px',
                                left: '8px',
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '4px',
                                zIndex: 10
                              }}>
                                {productTagsMap[product.id].slice(0, 2).map((tag) => (
                                  <span
                                    key={tag.id}
                                    style={{
                                      backgroundColor: tag.color || '#df2020',
                                      color: '#fff',
                                      fontSize: '10px',
                                      fontWeight: '600',
                                      padding: '3px 8px',
                                      borderRadius: '12px',
                                      display: 'inline-block',
                                      fontFamily: 'DM Sans, sans-serif'
                                    }}
                                  >
                                    {tag.name}
                                  </span>
                                ))}
                              </div>
                            )}
                            <img
                              src={product.image}
                              alt={product.name}
                              style={{
                                width: '100%',
                                height: '150px',
                                objectFit: 'contain',
                                marginBottom: '10px'
                              }}
                              onError={(e) => { e.target.src = '/src/assets/imgs/page/homepage1/imgsp1.png' }}
                            />
                          </div>

                          <div className="text-center">
                            <h6 className="mb-1" style={{
                              fontSize: '13px',
                              fontWeight: '500',
                              color: '#000',
                              lineHeight: '1.3',
                              minHeight: '32px',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              <Link
                                to={`/product/${product.id}`}
                                style={{
                                  color: '#000',
                                  textDecoration: 'none',
                                  transition: 'color 0.3s ease, text-decoration 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.color = 'black';
                                  e.target.style.textDecoration = 'underline';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.color = '#000';
                                  e.target.style.textDecoration = 'none';
                                }}
                              >
                                {product.shortDescp || product.name}
                              </Link>
                            </h6>

                            <div className="mb-1">
                              <span style={{ fontSize: '11px', color: '#666' }}>
                                {product.brand?.title || 'N/A'}
                              </span>
                            </div>

                            <div className="mb-1 d-flex justify-content-between">
                              <span style={{ fontSize: '11px', color: '#666', fontWeight: '600' }}>
                                SKU: {product.sku || product.id}
                              </span>
                              <span style={{ fontSize: '11px', color: '#666', fontWeight: '600' }}>
                                UPC: {product.upc?.title || 'N/A'}
                              </span>
                            </div>

                            <div style={{ marginTop: '16px', marginBottom: '8px' }}>
                              {isLoggedIn ? (
                                // ✅ Show Price for Logged In Users
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                  <span style={{ 
                                    fontSize: '16px', 
                                    fontWeight: '700', 
                                    color: '#111A45' 
                                  }}>
                                    ${product.price || '0.00'}
                                  </span>
                                  {product.originalPrice && (
                                    <span style={{ 
                                      fontSize: '13px', 
                                      fontWeight: '400', 
                                      color: '#999', 
                                      textDecoration: 'line-through' 
                                    }}>
                                      ${product.originalPrice}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                // ❌ Show Sign In Message for Guests
                                <span style={{ fontSize: '11px', fontWeight: '500', color: '#000' }}>
                                  <Link
                                    to="/login"
                                    onClick={(e) => e.stopPropagation()}
                                    style={{
                                      color: '#111A45',
                                      textDecoration: 'underline',
                                      fontWeight: '600'
                                    }}
                                  >
                                    Sign In
                                  </Link>
                                  {' '}to see pricing
                                </span>
                              )}
                            </div>

                            <div className="d-flex justify-content-center align-items-center mt-2">
                              <span style={{ 
                                fontSize: '11px', 
                                color: '#6B7280',
                                fontWeight: '400',
                                fontFamily: 'DM Sans, sans-serif'
                              }}>
                                In Stock
                              </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>


              <div className='mt-40'></div>


              {/* Pagination */}
              {totalPages > 1 && (
                <nav>
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <a
                        className="page-link page-prev"
                        href="#"
                        onClick={(e) => { e.preventDefault(); if (currentPage > 1) handlePageChange(currentPage - 1); }}
                        aria-label="Previous"
                      ></a>
                    </li>

                    {getPageNumbers().map(pageNum => (
                      <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                        <a
                          className="page-link"
                          href="#"
                          onClick={(e) => { e.preventDefault(); handlePageChange(pageNum); }}
                          style={currentPage === pageNum ? { backgroundColor: '#df2020', borderColor: '#df2020', color: '#fff' } : {}}
                        >
                          {pageNum}
                        </a>
                      </li>
                    ))}

                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <a
                        className="page-link page-next"
                        href="#"
                        onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) handlePageChange(currentPage + 1); }}
                        aria-label="Next"
                      ></a>
                    </li>
                  </ul>
                </nav>
              )}
            </div>

            {/* Sidebar */}
            <Sidebar
              onBrandFilter={handleBrandFilter}
              selectedBrands={selectedBrands}
              onCategoryFilter={handleCategoryFilter}
              selectedCategory={selectedCategory}
              onTagFilter={handleTagFilter}
              onClearAllTags={handleClearAllTags}
              selectedTags={selectedTags}
              productTags={productTags}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ShopGrid;
