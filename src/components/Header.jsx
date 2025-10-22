import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/product.service';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [showShopDropdown, setShowShopDropdown] = useState(false);
  const [showVendorsDropdown, setShowVendorsDropdown] = useState(false);
  const [showAboutDropdown, setShowAboutDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [languageData, setLanguageData] = useState({
    English: { flag: '/src/assets/imgs/template/en.svg', name: 'English' },
    Français: { flag: '/src/assets/imgs/template/flag-fr.svg', name: 'Français' },
    Español: { flag: '/src/assets/imgs/template/flag-es.svg', name: 'Español' },
    Português: { flag: '/src/assets/imgs/template/flag-pt.svg', name: 'Português' },
    '中国人': { flag: '/src/assets/imgs/template/flag-cn.svg', name: '中国人' }
  });

  // Handle language change
  const handleLanguageChange = (language) => {
    console.log('Changing language from', selectedLanguage, 'to', language);
    setSelectedLanguage(language);
    setShowLanguageDropdown(false);
    
    // You can add more language change logic here
    // For example: change document language, update translations, etc.
    console.log('Language changed to:', language);
    
    // Example: Change document language attribute
    document.documentElement.lang = language === 'English' ? 'en' : 
                                   language === 'Français' ? 'fr' : 
                                   language === 'Español' ? 'es' : 
                                   language === 'Português' ? 'pt' : 'zh';
  };

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await productService.getAllCategories();
        console.log('Categories fetched for header:', response);
        setCategories(response?.data || []);
      } catch (error) {
        console.error('Error fetching categories for header:', error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown')) {
        setShowLanguageDropdown(false);
        setShowCurrencyDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Simple Header */}
      <header style={{ 
        backgroundColor: 'white', 
        padding: '5px 0',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <div className="container">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between'
          }}>
            
            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems:"center", textDecoration: 'none' }}>
              <img 
                alt="V Cloud" 
                src="/src/assets/V Cloud Logo final-01.svg" 
                style={{ 
                  width: '200px', 
                  height: '70px'
                }} 
              />
            </Link>

            {/* Navigation */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
              {/* Shop Dropdown */}
              <div 
                style={{ position: 'relative' }}
                onMouseEnter={() => setShowShopDropdown(true)}
                onMouseLeave={() => setShowShopDropdown(false)}
              >
                <Link to="/shop" style={{
                  color: '#333',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontFamily: 'DM Sans, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  Shop
                  <span style={{ fontSize: '12px' }}>▼</span>
                </Link>
                {showShopDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    padding: '10px 0',
                    minWidth: '300px',
                    zIndex: 1000
                  }}>
                    {loadingCategories ? (
                      <div style={{ padding: '8px 15px', color: '#666', fontSize: '14px' }}>Loading categories...</div>
                    ) : categories.length > 0 ? (
                      categories.slice(0, 8).map((category, index) => (
                        <div key={category.id || index} style={{ position: 'relative' }}>
                          <Link 
                            to={`/shop?category=${category.id}`}
                            style={{ 
                              display: 'block', 
                              padding: '8px 15px', 
                              color: '#333', 
                              textDecoration: 'none', 
                              fontSize: '14px',
                              borderBottom: '1px solid #f0f0f0'
                            }}
                          >
                            {category.name || category.title}
                            <span style={{ 
                              float: 'right', 
                              fontSize: '12px', 
                              color: '#666',
                              marginLeft: '10px'
                            }}>
                              ({category.productCount || category.count || 0})
                            </span>
                          </Link>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '8px 15px', color: '#666', fontSize: '14px' }}>No categories found</div>
                    )}
                  </div>
                )}
              </div>

              {/* Vendors Dropdown */}
              <div 
                style={{ position: 'relative' }}
                onMouseEnter={() => setShowVendorsDropdown(true)}
                onMouseLeave={() => setShowVendorsDropdown(false)}
              >
                <a href="/vendors" style={{
                  color: '#333',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontFamily: 'DM Sans, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  Vendors
                  <span style={{ fontSize: '12px' }}>▼</span>
                </a>
                {showVendorsDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    padding: '10px 0',
                    minWidth: '180px',
                    zIndex: 1000
                  }}>
                    <a href="/vendors" style={{ display: 'block', padding: '8px 15px', color: '#333', textDecoration: 'none', fontSize: '14px' }}>Vendors Listing</a>
                    <a href="/vendor" style={{ display: 'block', padding: '8px 15px', color: '#333', textDecoration: 'none', fontSize: '14px' }}>Vendor Single</a>
                    <a href="/vendor-dashboard" style={{ display: 'block', padding: '8px 15px', color: '#333', textDecoration: 'none', fontSize: '14px' }}>Vendor Dashboard</a>
                  </div>
                )}
                        </div>

              {/* About Dropdown */}
              <div 
                style={{ position: 'relative' }}
                onMouseEnter={() => setShowAboutDropdown(true)}
                onMouseLeave={() => setShowAboutDropdown(false)}
              >
                <a href="/about" style={{
                  color: '#333',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontFamily: 'DM Sans, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  About
                  <span style={{ fontSize: '12px' }}>▼</span>
                </a>
                {showAboutDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    padding: '10px 0',
                    minWidth: '160px',
                    zIndex: 1000
                  }}>
                    <a href="/about" style={{ display: 'block', padding: '8px 15px', color: '#333', textDecoration: 'none', fontSize: '14px' }}>About Us</a>
                    <a href="/careers" style={{ display: 'block', padding: '8px 15px', color: '#333', textDecoration: 'none', fontSize: '14px' }}>Careers</a>
                    <a href="/contact" style={{ display: 'block', padding: '8px 15px', color: '#333', textDecoration: 'none', fontSize: '14px' }}>Contact</a>
                    <a href="/team" style={{ display: 'block', padding: '8px 15px', color: '#333', textDecoration: 'none', fontSize: '14px' }}>Our Team</a>
                  </div>
                )}
                </div>

              {/* Blog - No Dropdown */}
              <a href="https://blog.vcloudtech.com/" style={{
                color: '#333',
                textDecoration: 'none',
                fontSize: '16px',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                Blog
              </a>
            </nav>

            {/* Search and Cart */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <input 
                type="text" 
                placeholder="Search..." 
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  width: '200px'
                }}
              />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '8px 12px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                <span>🛒</span>
                <span style={{ fontSize: '14px' }}>Cart (2)</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <div className={`mobile-header-active mobile-header-wrapper-style perfect-scrollbar ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-header-wrapper-inner">
          <div className="mobile-header-content-area">
            <div className="mobile-logo">
              <a className="d-flex" href="/">
                <img alt="V Cloud" src="/src/assets/V Cloud Logo final-01.svg" style={{width: '280px', height: 'auto', maxWidth: '100%'}} />
              </a>
            </div>
            <div className="perfect-scroll">
              <div className="mobile-menu-wrap mobile-header-border">
                <nav className="mt-15">
                  <ul className="mobile-menu font-heading">
                    <li className="has-children">
                      <a className="active" href="/">Home</a>
                      <ul className="sub-menu">
                        <li><a href="/">Homepage - 1</a></li>
                        <li><a href="/">Homepage - 2</a></li>
                        <li><a href="/">Homepage - 3</a></li>
                        <li><a href="/">Homepage - 4</a></li>
                        <li><a href="/">Homepage - 5</a></li>
                        <li><a href="/">Homepage - 6</a></li>
                        <li><a href="/">Homepage - 7</a></li>
                        <li><a href="/">Homepage - 8</a></li>
                        <li><a href="/">Homepage - 9</a></li>
                        <li><a href="/">Homepage - 10</a></li>
                      </ul>
                    </li>
                    <li className="has-children">
                      <a href="/shop">Shop</a>
                      <ul className="sub-menu">
                        <li><a href="/shop">Shop Grid</a></li>
                        <li><a href="/shop">Shop Grid 2</a></li>
                        <li><a href="/shop">Shop List</a></li>
                        <li><a href="/shop">Shop List 2</a></li>
                        <li><a href="/shop">Shop Fullwidth</a></li>
                        <li><a href="/product">Single Product</a></li>
                        <li><a href="/product">Single Product 2</a></li>
                        <li><a href="/product">Single Product 3</a></li>
                        <li><a href="/product">Single Product 4</a></li>
                        <li><a href="/cart">Shop Cart</a></li>
                        <li><a href="/checkout">Shop Checkout</a></li>
                        <li><a href="/compare">Shop Compare</a></li>
                        <li><a href="/wishlist">Shop Wishlist</a></li>
                      </ul>
                    </li>
                    <li className="has-children">
                      <a href="/vendors">Vendors</a>
                      <ul className="sub-menu">
                        <li><a href="/vendors">Vendors Listing</a></li>
                        <li><a href="/vendor">Vendor Single</a></li>
                      </ul>
                    </li>
                    <li className="has-children">
                      <a href="#">Pages</a>
                      <ul className="sub-menu">
                        <li><a href="/about">About Us</a></li>
                        <li><a href="/careers">Careers</a></li>
                        <li><a href="/terms">Term and Condition</a></li>
                        <li><a href="/register">Register</a></li>
                        <li><a href="/login">Login</a></li>
                        <li><a href="/404">Error 404</a></li>
                      </ul>
                    </li>
                    <li>
                      <a href="/blog">Blog</a>
                    </li>
                  </ul>
                </nav>
              </div>
              <div className="mobile-account">
                <div className="mobile-header-top">
                  <div className="user-account">
                    <a href="/account">
                      <img src="/src/assets/imgs/template/ava_1.png" alt="Ecom" />
                    </a>
                    <div className="content">
                      <h6 className="user-name">Hello<span className="text-brand"> Steven !</span></h6>
                      <p className="font-xs text-muted">You have 3 new messages</p>
                    </div>
                  </div>
                </div>
                <ul className="mobile-menu">
                  <li><a href="/account">My Account</a></li>
                  <li><a href="/orders">Order Tracking</a></li>
                  <li><a href="/orders">My Orders</a></li>
                  <li><a href="/wishlist">My Wishlist</a></li>
                  <li><a href="/settings">Setting</a></li>
                  <li><a href="/login">Sign out</a></li>
                </ul>
              </div>
              <div className="mobile-banner">
                <div className="bg-5 block-iphone">
                  <span className="color-brand-3 font-sm-lh32">Starting from $899</span>
                  <h3 className="font-xl mb-10">iPhone 12 Pro 128Gb</h3>
                  <p className="font-base color-brand-3 mb-10">Special Sale</p>
                  <a className="btn btn-arrow" href="/shop">learn more</a>
                </div>
              </div>
              <div className="site-copyright color-gray-400 mt-30">
                Copyright 2022 &copy; Ecom - Marketplace Template.<br />
                Designed by<a href="http://alithemes.com" target="_blank" rel="noopener noreferrer">&nbsp; AliThemes</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;