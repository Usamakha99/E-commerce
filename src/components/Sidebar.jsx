import React, { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { productService } from '../services/product.service';

const Sidebar = ({ onBrandFilter, selectedBrands = [], onCategoryFilter, selectedCategory = null }) => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  
  const CATEGORIES_TO_SHOW = 10; // Show first 10 categories

  // Fetch all products to extract unique brands
  const { products } = useProducts({ autoFetch: true });

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await productService.getAllCategories();
        console.log('Categories Response in Sidebar:', response);
        
        // Handle different response structures
        if (response) {
          if (Array.isArray(response)) {
            console.log('Categories are array:', response);
            console.log('First category structure:', response[0]);
            setCategories(response);
          } else if (response.data && Array.isArray(response.data)) {
            console.log('Categories in response.data:', response.data);
            console.log('First category structure:', response.data[0]);
            setCategories(response.data);
          } else if (response.categories && Array.isArray(response.categories)) {
            console.log('Categories in response.categories:', response.categories);
            console.log('First category structure:', response.categories[0]);
            setCategories(response.categories);
          } else {
            console.log('Unknown response structure:', response);
            console.log('Response keys:', Object.keys(response));
            setCategories([]);
          }
        } else {
          console.log('No response received');
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to empty array if API fails
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Extract unique brands from products
  useEffect(() => {
    if (products && products.length > 0) {
      const brandMap = new Map();
      
      products.forEach(product => {
        const brandName = product.brand?.title || 'Unknown';
        if (brandMap.has(brandName)) {
          brandMap.set(brandName, brandMap.get(brandName) + 1);
        } else {
          brandMap.set(brandName, 1);
        }
      });
      
      const brandsList = Array.from(brandMap.entries()).map(([name, count]) => ({
        name,
        count
      })).sort((a, b) => a.name.localeCompare(b.name));
      
      setBrands(brandsList);
    }
  }, [products]);

  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const handleBrandChange = (brandName, isChecked) => {
    if (onBrandFilter) {
      if (isChecked) {
        onBrandFilter([...selectedBrands, brandName]);
      } else {
        onBrandFilter(selectedBrands.filter(brand => brand !== brandName));
      }
    }
  };

  // Categories are now fetched from API and stored in state


  const productTags = [
    "Games", "Electronics", "Video", "Cellphone", "Indoor", "VGA Card",
    "USB", "Lightning", "Camera", "Window", "Air Vent", "Bedroom",
    "Laptop", "Dashboard", "Keyboard"
  ];

  return (
    <div className="col-lg-3 order-last order-lg-first">
      {/* Categories */}
      <div style={{marginBottom: '20px'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px'}}>
            <h6 style={{margin: 0, color: '#000', fontWeight: 'bold', fontSize: '16px', borderBottom: '3px solid #df2020', paddingBottom: '8px'}}>Product Categories</h6>
          {selectedCategory && (
            <button
              onClick={() => onCategoryFilter && onCategoryFilter(null)}
              title="Clear category filter"
              style={{
                backgroundColor: '#df2020',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0',
                transition: 'background-color 0.3s ease',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#c41a1a';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#df2020';
              }}
            >
              ✕
            </button>
          )}
        </div>
        
        {/* Active Category Filter Display */}
        {selectedCategory && (
          <div style={{ marginBottom: '10px', padding: '8px 12px', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #e9ecef' }}>
            <span style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>Active Filter:</span>
            <span style={{ fontSize: '12px', color: '#df2020', fontWeight: '600', marginLeft: '5px' }}>
              {categories.find(cat => cat.id === selectedCategory)?.name || categories.find(cat => cat.id === selectedCategory)?.title || 'Category'}
            </span>
          </div>
        )}
          {loadingCategories ? (
            <div className="text-center py-3">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Loading categories...</span>
              </div>
              <p className="small text-muted mt-2">Loading categories...</p>
            </div>
          ) : (
            <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
              {categories.length > 0 ? (
                <>
                  {/* Show first 10 categories or all if showAllCategories is true */}
                  {(showAllCategories ? categories : categories.slice(0, CATEGORIES_TO_SHOW)).map((category, index) => (
                    <li key={category.id || index} style={{marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <a 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (onCategoryFilter) {
                            onCategoryFilter(category.id);
                          }
                        }}
                        style={{
                          cursor: 'pointer',
                          fontWeight: 'normal',
                          color: selectedCategory === category.id ? '#000' : '#000',
                          textDecoration: 'underline',
                          fontSize: '1em',
                          flex: 1
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = '#000';
                          // Find the count span and add underline
                          const countSpan = e.target.parentElement.querySelector('.category-count');
                          if (countSpan) {
                            countSpan.style.textDecoration = 'underline';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = selectedCategory === category.id ? '#000' : '#000';
                          // Find the count span and remove underline
                          const countSpan = e.target.parentElement.querySelector('.category-count');
                          if (countSpan) {
                            countSpan.style.textDecoration = 'none';
                          }
                        }}
                      >
                        {category.name || category.title}
                      </a>
                      <span 
                        className="category-count"
                        style={{
                          color: '#000',
                          fontSize: '1em',
                          fontWeight: '600',
                          marginLeft: '10px',
                          textDecoration: 'none',
                          cursor: 'pointer'
                        }}>
                        {category.productCount || category.count || 0}
                      </span>
                    </li>
                  ))}
                  
                  {/* Show "See More" button if there are more than CATEGORIES_TO_SHOW */}
                  {categories.length > CATEGORIES_TO_SHOW && (
                    <li style={{marginTop: '10px'}}>
                      <a 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowAllCategories(!showAllCategories);
                        }}
                        style={{
                          color: '#000',
                          fontWeight: '500',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          fontSize: '1em'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = '#000';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = '#000';
                        }}
                      >
                        {showAllCategories ? '← See Less' : 'See More →'}
                      </a>
                    </li>
                  )}
                </>
              ) : (
                <li className="text-muted small">No categories found</li>
              )}
            </ul>
          )}
      </div>

      {/* Filters */}
      <div style={{marginBottom: '20px'}}>
          {/* Price Section - Commented Out */}
          {/* 
          <h6 className="   mt-10 mb-10" style={{color: '#000'}}>Price</h6>
          <div className="box-slider-range mt-20 mb-15">
            <div className="row mb-20">
              <div className="col-sm-12">
                <div id="slider-range"></div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <label className="lb-slider font-sm" style={{color: '#000'}}>Price Range:</label>
                <span className="min-value-money font-sm color-gray-1000">$0</span>
                <label className="lb-slider font-sm font-medium color-gray-1000"></label>-
                <span className="max-value-money font-sm font-medium color-gray-1000">$1000</span>
              </div>
              <div className="col-lg-12">
                <input className="form-control min-value" type="hidden" name="min-value" value="" />
                <input className="form-control max-value" type="hidden" name="max-value" value="" />
              </div>
            </div>
          </div>
          <ul className="list-checkbox">
            <li>
              <label className="cb-container">
                <input type="checkbox" defaultChecked />
                <span className="text-small" style={{color: '#000'}}>Free - $100</span>
                <span className="checkmark"></span>
              </label>
              <span className="number-item">145</span>
            </li>
            <li>
              <label className="cb-container">
                <input type="checkbox" />
                <span className="text-small" style={{color: '#000'}}>$100 - $200</span>
                <span className="checkmark"></span>
              </label>
              <span className="number-item">56</span>
            </li>
            <li>
              <label className="cb-container">
                <input type="checkbox" />
                <span className="text-small" style={{color: '#000'}}>$200 - $400</span>
                <span className="checkmark"></span>
              </label>
              <span className="number-item">23</span>
            </li>
            <li>
              <label className="cb-container">
                <input type="checkbox" />
                <span className="text-small" style={{color: '#000'}}>$400 - $600</span>
                <span className="checkmark"></span>
              </label>
              <span className="number-item">43</span>
            </li>
            <li>
              <label className="cb-container">
                <input type="checkbox" />
                <span className="text-small" style={{color: '#000'}}>$600 - $800</span>
                <span className="checkmark"></span>
              </label>
              <span className="number-item">65</span>
            </li>
            <li>
              <label className="cb-container">
                <input type="checkbox" />
                <span className="text-small" style={{color: '#000'}}>Over $1000</span>
                <span className="checkmark"></span>
              </label>
              <span className="number-item">56</span>
            </li>
          </ul>
          */}

            <h6 style={{margin: '20px 0 15px 0', color: '#000', fontWeight: 'bold', fontSize: '16px', borderBottom: '3px solid #df2020', paddingBottom: '8px', display: 'inline-block'}}>Brands</h6>
          
          {/* Active Brand Filter Display */}
          {selectedBrands.length > 0 && (
            <div style={{ marginBottom: '10px', padding: '8px 12px', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #e9ecef' }}>
              <span style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>Active Filter{selectedBrands.length > 1 ? 's' : ''}:</span>
              <span style={{ fontSize: '12px', color: '#df2020', fontWeight: '600', marginLeft: '5px' }}>
                {selectedBrands.join(', ')}
              </span>
            </div>
          )}
          {loadingBrands ? (
            <div className="text-center py-3">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Loading brands...</span>
              </div>
              <p className="small text-muted mt-2">Loading brands...</p>
            </div>
          ) : (
            <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
              {brands.length > 0 ? (
                brands.map((brand, index) => (
                  <li key={index} style={{marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <label className="cb-container" style={{flex: 1}}>
                      <input 
                        type="checkbox" 
                        checked={selectedBrands.includes(brand.name)}
                        onChange={(e) => handleBrandChange(brand.name, e.target.checked)}
                      />
                      <span 
                        className="text-small brand-name" 
                        style={{color: '#000', fontSize: '14px', textDecoration: 'underline'}}
                        onMouseEnter={(e) => {
                          // Find the count span and add underline
                          const countSpan = e.target.parentElement.parentElement.querySelector('.brand-count');
                          if (countSpan) {
                            countSpan.style.textDecoration = 'underline';
                          }
                        }}
                        onMouseLeave={(e) => {
                          // Find the count span and remove underline
                          const countSpan = e.target.parentElement.parentElement.querySelector('.brand-count');
                          if (countSpan) {
                            countSpan.style.textDecoration = 'none';
                          }
                        }}
                      >
                        {brand.name}
                      </span>
                      <span className="checkmark"></span>
                    </label>
                    <span 
                      className="number-item brand-count" 
                      style={{color: '#000', fontSize: '1em', fontWeight: '600', marginLeft: '10px', textDecoration: 'none'}}
                    >
                      {brand.count}
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-muted small">No brands found</li>
              )}
            </ul>
          )}
      </div>


      {/* Product Tags */}
      <div className="box-slider-item">
        <div className="head pb-10 border-brand-2">
          <h5 className="  " style={{color: '#000', fontSize: '16px'}}>Product Tags</h5>
        </div>
        <div className="content-slider mb-50">
          {productTags.map((tag, index) => (
            <a
              key={index}
              className="btn btn-border mr-5"
              href="/shop"
              style={{
                borderRadius: '20px',
                padding: '6px 14px',
                lineHeight: '1',
                display: 'inline-block',
                color: '#000',
                border: '1px solid #000',
                backgroundColor: 'transparent',
                marginBottom: '6px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
                e.currentTarget.style.color = '#000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#000';
              }}
              onClick={(e) => {
                e.preventDefault();
                // Add click effect
                e.currentTarget.style.backgroundColor = '#e0e0e0';
                setTimeout(() => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }, 150);
              }}
            >
              {tag}
            </a>
          ))}
        </div>
      </div>

      {/* Banner */}
      {/* <div className="banner-right h-500 text-center mb-30">
        <span className="text-no font-11">No.9</span>
        <h5 className="font-23 mt-20">Sensitive Touch<br className="d-none d-lg-block" />without fingerprint</h5>
        <p className="text-desc font-16 mt-15">Smooth handle and accurate click</p>
        <a href="/product">View Details</a>
      </div> */}
    </div>
  );
};

export default Sidebar;
