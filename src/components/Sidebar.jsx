import React, { useState, useEffect } from 'react';
import { productService } from '../services/product.service';

const Sidebar = ({ onBrandFilter, selectedBrands = [], onCategoryFilter, selectedCategory = null, onTagFilter, onClearAllTags, selectedTags = [], productTags = [] }) => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  // Fetch all categories (with subcategories) from API – lightweight, no full product list
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await productService.getAllCategories();
        const list = response?.data ?? (Array.isArray(response) ? response : []);
        setCategories(Array.isArray(list) ? list : []);
      } catch (_error) {
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch all brands from API (GET /brands or lightweight product sampling) – not just current page
  useEffect(() => {
    const fetchBrands = async () => {
      setLoadingBrands(true);
      try {
        const response = await productService.getAllBrands();
        const list = response?.data ?? (Array.isArray(response) ? response : []);
        setBrands(Array.isArray(list) ? list : []);
      } catch (_error) {
        setBrands([]);
      } finally {
        setLoadingBrands(false);
      }
    };
    fetchBrands();
  }, []);

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


  // productTags are now passed as props from ShopGrid

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
            <div
              style={{
                maxHeight: '280px',
                overflowY: 'auto',
                overflowX: 'hidden',
                paddingRight: '4px',
                marginRight: '-4px',
              }}
              className="sidebar-categories-scroll"
            >
              <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                {(() => {
                // Flatten: show parent categories and their subcategories (children)
                const flatList = [];
                categories.forEach((cat) => {
                  flatList.push({ ...cat, isSub: false });
                  (cat.children || []).forEach((sub) => {
                    flatList.push({ ...sub, isSub: true, parentId: cat.id });
                  });
                });
                const displayList = flatList.length > 0 ? flatList : categories;
                return displayList.length > 0 ? (
                  <>
                    {displayList.map((category, index) => (
                      <li
                        key={category.id != null ? category.id : index}
                        style={{
                          marginBottom: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingLeft: category.isSub ? '16px' : 0,
                        }}
                      >
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (onCategoryFilter) onCategoryFilter(category.id);
                          }}
                          style={{
                            cursor: 'pointer',
                            fontWeight: 'normal',
                            color: selectedCategory === category.id ? '#df2020' : '#000',
                            textDecoration: 'underline',
                            fontSize: category.isSub ? '0.9em' : '1em',
                            flex: 1,
                          }}
                        >
                          {category.name || category.title}
                        </a>
                        <span className="category-count" style={{ color: '#000', fontSize: '1em', fontWeight: '600', marginLeft: '10px' }}>
                          {category.productCount ?? category.count ?? 0}
                        </span>
                      </li>
                    ))}
                  </>
                ) : (
                  <li className="text-muted small">No categories found</li>
                );
              })()}
              </ul>
            </div>
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
            <div
              style={{
                maxHeight: '280px',
                overflowY: 'auto',
                overflowX: 'hidden',
                paddingRight: '4px',
                marginRight: '-4px',
              }}
              className="sidebar-brands-scroll"
            >
              <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                {brands.length > 0 ? (
                  <>
                    {brands.map((brand, index) => (
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
                              const countSpan = e.target.parentElement.parentElement.querySelector('.brand-count');
                              if (countSpan) countSpan.style.textDecoration = 'underline';
                            }}
                            onMouseLeave={(e) => {
                              const countSpan = e.target.parentElement.parentElement.querySelector('.brand-count');
                              if (countSpan) countSpan.style.textDecoration = 'none';
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
                    ))}
                  </>
                ) : (
                  <li className="text-muted small">No brands found</li>
                )}
              </ul>
            </div>
          )}
      </div>


      {/* Product Tags */}
      {productTags.length > 0 && (
        <div className="box-slider-item" style={{marginBottom: '20px'}}>
         <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px'}}>
            <h5 className="" style={{color: '#000', fontSize: '16px', fontWeight: 'bold', borderBottom: '3px solid #df2020', paddingBottom: '8px', display: 'inline-block'}}>Product Tags</h5>
            {selectedTags.length > 0 && (
              <button
                onClick={() => {
                  if (onClearAllTags) {
                    onClearAllTags();
                  }
                }}
                title="Clear all tag filters"
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
          {/* Active Tag Filter Display */}
          {selectedTags.length > 0 && (
            <div style={{ marginBottom: '10px', padding: '8px 12px', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #e9ecef' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>Active Filter{selectedTags.length > 1 ? 's' : ''}:</span>
                {productTags.filter(tag => selectedTags.includes(tag.id)).map(tag => (
                  <span 
                    key={tag.id}
                    style={{ 
                      fontSize: '12px', 
                      color: '#df2020', 
                      fontWeight: '600',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 6px',
                      backgroundColor: '#fff',
                      borderRadius: '4px',
                      border: '1px solid #df2020'
                    }}
                  >
                    {tag.name}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onTagFilter) {
                          onTagFilter(tag.id);
                        }
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#df2020',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        padding: '0',
                        marginLeft: '4px',
                        lineHeight: '1',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = '#c41a1a';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = '#df2020';
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="content-slider mb-50">
            {productTags.map((tag) => (
              <a
                key={tag.id}
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
                  if (onTagFilter) {
                    onTagFilter(tag.id);
                  }
                }}
              >
                {tag.name}
              </a>
            ))}
          </div>
        </div>
      )}

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
