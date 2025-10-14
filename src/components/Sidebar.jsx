import React, { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';

const Sidebar = ({ onBrandFilter, selectedBrands = [] }) => {
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(false);

  // Fetch all products to extract unique brands
  const { products } = useProducts({ autoFetch: true });

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

  const categories = [
    { 
      name: "Computers & Laptop", 
      count: 9, 
      hasSubcategories: true,
      subcategories: [
        { name: "ASUS", count: 15 },
        { name: "HP", count: 23 },
        { name: "Dell", count: 18 },
        { name: "Lenovo", count: 12 },
        { name: "Acer", count: 8 }
      ]
    },
    { 
      name: "Electric accessories", 
      count: 12,
      hasSubcategories: true,
      subcategories: [
        { name: "Power Banks", count: 25 },
        { name: "Chargers", count: 18 },
        { name: "Cables", count: 32 },
        { name: "Adapters", count: 14 }
      ]
    },
    { 
      name: "Mainboard & CPU", 
      count: 24,
      hasSubcategories: true,
      subcategories: [
        { name: "Intel", count: 35 },
        { name: "AMD", count: 28 },
        { name: "ASUS Motherboards", count: 22 },
        { name: "MSI Motherboards", count: 16 }
      ]
    },
    { 
      name: "Bluetooth devices", 
      count: 34,
      hasSubcategories: true,
      subcategories: [
        { name: "Headphones", count: 45 },
        { name: "Speakers", count: 28 },
        { name: "Earbuds", count: 32 },
        { name: "Keyboards", count: 18 }
      ]
    },
    { 
      name: "Mouse & Keyboard", 
      count: 65,
      hasSubcategories: true,
      subcategories: [
        { name: "Gaming Mouse", count: 42 },
        { name: "Wireless Mouse", count: 38 },
        { name: "Mechanical Keyboard", count: 29 },
        { name: "Wireless Keyboard", count: 25 }
      ]
    },
    { 
      name: "Wired Headphone", 
      count: 15,
      hasSubcategories: true,
      subcategories: [
        { name: "Gaming Headphones", count: 22 },
        { name: "Studio Headphones", count: 18 },
        { name: "Noise Cancelling", count: 25 },
        { name: "Budget Headphones", count: 31 }
      ]
    },
    { 
      name: "Gaming Gadgets", 
      count: 76,
      hasSubcategories: true,
      subcategories: [
        { name: "Gaming Controllers", count: 42 },
        { name: "Gaming Mouse", count: 38 },
        { name: "Gaming Keyboard", count: 29 },
        { name: "Gaming Headsets", count: 35 },
        { name: "Gaming Chairs", count: 18 }
      ]
    },
    { 
      name: "Smart Watches", 
      count: 89,
      hasSubcategories: true,
      subcategories: [
        { name: "Apple Watch", count: 45 },
        { name: "Samsung Galaxy Watch", count: 38 },
        { name: "Fitbit", count: 32 },
        { name: "Garmin", count: 28 },
        { name: "Xiaomi Mi Band", count: 25 }
      ]
    },
    { 
      name: "Cell Phones", 
      count: 23,
      hasSubcategories: true,
      subcategories: [
        { name: "iPhone", count: 35 },
        { name: "Samsung Galaxy", count: 42 },
        { name: "Google Pixel", count: 18 },
        { name: "OnePlus", count: 22 },
        { name: "Xiaomi", count: 28 }
      ]
    },
    { 
      name: "Headphones", 
      count: 98,
      hasSubcategories: true,
      subcategories: [
        { name: "Wireless Headphones", count: 52 },
        { name: "True Wireless Earbuds", count: 68 },
        { name: "Over-Ear Headphones", count: 38 },
        { name: "On-Ear Headphones", count: 25 },
        { name: "Sports Headphones", count: 31 }
      ]
    }
  ];

  const moreCategories = [
    { name: "Home theater", count: 98 },
    { name: "Cameras & drones", count: 124 },
    { name: "PC gaming", count: 56 },
    { name: "Smart home", count: 87 },
    { name: "Networking", count: 36 }
  ];

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
        <div className="sidebar-head">
          <h6 className="color-gray-900">Product Categories</h6>
        </div>
        <div className="sidebar-content">
          <ul className="list-nav-arrow">
            {categories.map((category, index) => (
            <li key={index}>
              {category.hasSubcategories ? (
                <div>
                  <a 
                    href="/shop"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleCategory(category.name);
                    }}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#df2020';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '';
                    }}
                  >
                    {category.name}
                    <span className="number">{category.count}</span>
                    <span className="arrow" style={{ 
                      float: 'right', 
                      transform: expandedCategories[category.name] ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease'
                    }}>
                      ▶
                    </span>
                  </a>
                  {expandedCategories[category.name] && (
                    <ul className="subcategories" style={{ marginLeft: '20px', marginTop: '5px' }}>
                      {category.subcategories.map((subcategory, subIndex) => (
                        <li key={subIndex}>
                          <a href="/shop"
                            onMouseEnter={(e) => {
                              e.target.style.color = '#df2020';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.color = '';
                            }}
                          >
                            {subcategory.name}
                            <span className="number">{subcategory.count}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <a href="/shop"
                  onMouseEnter={(e) => {
                    e.target.style.color = '#df2020';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '';
                  }}
                >
                  {category.name}
                  <span className="number">{category.count}</span>
                </a>
              )}
            </li>
          ))}
        </ul>
          <div>
            <div className={`collapse ${showMoreCategories ? 'show' : ''}`} id="moreMenu">
              <ul className="list-nav-arrow">
                {moreCategories.map((category, index) => (
                  <li key={index}>
                    <a href="/shop"
                      onMouseEnter={(e) => {
                        e.target.style.color = '#df2020';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = '';
                      }}
                    >
                      {category.name}
                      <span className="number">{category.count}</span>
                    </a>
            </li>
          ))}
        </ul>
      </div>
            <a 
              className="link-see-more mt-5" 
              onClick={() => setShowMoreCategories(!showMoreCategories)}
              role="button"
            >
              {showMoreCategories ? 'See Less' : 'See More'}
            </a>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sidebar-border mb-40">
        <div className="sidebar-head">
          <h6 className="color-gray-900">Products Filter</h6>
        </div>
        <div className="sidebar-content">
          <h6 className="color-gray-900 mt-10 mb-10">Price</h6>
          <div className="box-slider-range mt-20 mb-15">
            <div className="row mb-20">
              <div className="col-sm-12">
                <div id="slider-range"></div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <label className="lb-slider font-sm color-gray-500">Price Range:</label>
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
                <span className="text-small">Free - $100</span>
                <span className="checkmark"></span>
              </label>
              <span className="number-item">145</span>
            </li>
            <li>
              <label className="cb-container">
                <input type="checkbox" />
                <span className="text-small">$100 - $200</span>
                <span className="checkmark"></span>
              </label>
              <span className="number-item">56</span>
            </li>
            <li>
              <label className="cb-container">
                <input type="checkbox" />
                <span className="text-small">$200 - $400</span>
                <span className="checkmark"></span>
              </label>
              <span className="number-item">23</span>
            </li>
            <li>
              <label className="cb-container">
                <input type="checkbox" />
                <span className="text-small">$400 - $600</span>
                <span className="checkmark"></span>
              </label>
              <span className="number-item">43</span>
            </li>
            <li>
              <label className="cb-container">
                <input type="checkbox" />
                <span className="text-small">$600 - $800</span>
                <span className="checkmark"></span>
              </label>
              <span className="number-item">65</span>
            </li>
            <li>
              <label className="cb-container">
                <input type="checkbox" />
                <span className="text-small">Over $1000</span>
                <span className="checkmark"></span>
              </label>
              <span className="number-item">56</span>
            </li>
          </ul>

          <h6 className="color-gray-900 mt-20 mb-10">Brands</h6>
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
                      <span className="text-small">{brand.name}</span>
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
          <h5 className="color-gray-900">Best seller</h5>
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
          <h5 className="color-gray-900">Product Tags</h5>
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
