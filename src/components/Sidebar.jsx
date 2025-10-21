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

  const bestSellerProducts = [
    {
      id: 1,
      name: "HP Slim Desktop, Intel Celeron J4025, 4GB RAM",
      image: "/src/assets/imgs/page/homepage2/camera.png",
      price: 150,
      originalPrice: 187,
      discount: "-17%",
      rating: 5,
      reviews: 65
    },
    {
      id: 2,
      name: "Class 4K UHD (2160P) LED Roku Smart TV HDR",
      image: "/src/assets/imgs/page/homepage2/clock.png",
      price: 2900,
      originalPrice: 3200,
      rating: 5,
      reviews: 65
    },
    {
      id: 3,
      name: "HP 11.6\" Chromebook, AMD A4, 4GB RAM, 32GB Storage",
      image: "/src/assets/imgs/page/homepage2/airpod.png",
      price: 160,
      originalPrice: 168,
      rating: 5,
      reviews: 65
    },
    {
      id: 4,
      name: "LG 65\" Class 4K UHD Smart TV OLED A1 Series",
      image: "/src/assets/imgs/page/homepage2/cat-img-7.png",
      price: 325,
      originalPrice: 392,
      rating: 5,
      reviews: 65
    }
  ];

  const productTags = [
    "Games", "Electronics", "Video", "Cellphone", "Indoor", "VGA Card",
    "USB", "Lightning", "Camera", "Window", "Air Vent", "Bedroom",
    "Laptop", "Dashboard", "Keyboard"
  ];

  return (
    <div className="col-lg-3 order-last order-lg-first">
      {/* Categories */}
      <div className="sidebar-border mb-0">
        <div className="sidebar-head" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <h6 className="  " style={{margin: 0, color: '#000'}}>Product Categories</h6>
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
        <div className="sidebar-content">
          {loadingCategories ? (
            <div className="text-center py-3">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Loading categories...</span>
              </div>
              <p className="small text-muted mt-2">Loading categories...</p>
            </div>
          ) : (
            <ul className="list-nav-arrow">
              {categories.length > 0 ? (
                <>
                  {/* Show first 10 categories or all if showAllCategories is true */}
                  {(showAllCategories ? categories : categories.slice(0, CATEGORIES_TO_SHOW)).map((category, index) => (
                    <li key={category.id || index}>
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
                          fontWeight: selectedCategory === category.id ? 'bold' : 'normal',
                          color: selectedCategory === category.id ? '#df2020' : '#000'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = '#df2020';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = selectedCategory === category.id ? '#df2020' : '#000';
                        }}
                      >
                        {category.name || category.title}
                        <span className="number">{category.productCount || category.count || 0}</span>
                      </a>
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
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = '#df2020';
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
      </div>

      {/* Filters */}
      <div className="sidebar-border mb-40">
        <div className="sidebar-head">
          <h6 className="  ">Products Filter</h6>
        </div>
        <div className="sidebar-content">
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

          <h6 className="   mt-20 mb-10">Brands</h6>
          {loadingBrands ? (
            <div className="text-center py-3">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Loading brands...</span>
              </div>
              <p className="small text-muted mt-2">Loading brands...</p>
            </div>
          ) : (
            <ul className="list-checkbox">
              {brands.length > 0 ? (
                brands.map((brand, index) => (
                  <li key={index}>
                    <label className="cb-container">
                      <input 
                        type="checkbox" 
                        checked={selectedBrands.includes(brand.name)}
                        onChange={(e) => handleBrandChange(brand.name, e.target.checked)}
                      />
                      <span className="text-small" style={{color: '#000'}}>{brand.name}</span>
                      <span className="checkmark"></span>
                    </label>
                    <span className="number-item">{brand.count}</span>
                  </li>
                ))
              ) : (
                <li className="text-muted small">No brands found</li>
              )}
            </ul>
          )}
          {/* <a className="btn btn-filter font-sm color-brand-3 font-medium mt-10" href="#ModalFiltersForm" data-bs-toggle="modal">
            More Fillters
          </a> */}
        </div>
      </div>

      {/* Best Seller */}
      <div className="box-slider-item mb-30">
        <div className="head pb-15 border-brand-2">
          <h5 className="  " style={{color: '#000'}}>Best seller</h5>
        </div>
        <div className="content-slider">
          <div className="box-swiper slide-shop">
            <div className="swiper-container swiper-best-seller">
              <div className="swiper-wrapper pt-5">
                <div className="swiper-slide">
          {bestSellerProducts.map((product) => (
                    <div key={product.id} className="card-grid-style-2 card-grid-none-border border-bottom mb-10">
                      <div className="image-box">
                        {product.discount && <span className="label bg-brand-2">{product.discount}</span>}
                        <a href="/product">
                          <img src={product.image} alt="Ecom" />
                        </a>
              </div>
                      <div className="info-right">
                        <a className="color-brand-3 font-xs-bold" href="/product">{product.name}</a>
                        
                        <div className="price-info">
                          <strong className="font-md-bold color-brand-3 price-main">${product.price}</strong>
                          <span className="color-gray-500 font-sm price-line">${product.originalPrice}</span>
                </div>
              </div>
            </div>
          ))}
                </div>
              </div>
            </div>
            <div className="swiper-button-next swiper-button-next-style-2 swiper-button-next-bestseller"></div>
            <div className="swiper-button-prev swiper-button-prev-style-2 swiper-button-prev-bestseller"></div>
          </div>
        </div>
      </div>

      {/* Product Tags */}
      <div className="box-slider-item">
        <div className="head pb-15 border-brand-2">
          <h5 className="  " style={{color: '#000'}}>Product Tags</h5>
        </div>
        <div className="content-slider mb-50">
          {productTags.map((tag, index) => (
            <a key={index} className="btn btn-border mr-5" href="/shop">
              {tag}
            </a>
          ))}
        </div>
      </div>

      {/* Banner */}
      <div className="banner-right h-500 text-center mb-30">
        <span className="text-no font-11">No.9</span>
        <h5 className="font-23 mt-20">Sensitive Touch<br className="d-none d-lg-block" />without fingerprint</h5>
        <p className="text-desc font-16 mt-15">Smooth handle and accurate click</p>
        <a href="/product">View Details</a>
      </div>
    </div>
  );
};

export default Sidebar;
