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
  const [dropdownTimeouts, setDropdownTimeouts] = useState({});
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
        borderBottom: '1px solid #e0e0e0',
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        zIndex: '1000',
        width: '100%'
      }}>
        <div className="container">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            width: '100%',
            gap: '20px'
          }}>
            
            {/* Left side - Logo and Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '120px', flex: '1' }}>
              {/* Logo */}
              <Link to="/" style={{ display: 'flex', alignItems:"center", textDecoration: 'none' }}>
                <img 
                  alt="V Cloud" 
                  src="/src/assets/V Cloud Logo final-01.svg" 
                  style={{ 
                    width: '200px', 
                    position: 'relative',
                    right: '10px',
                    height: '50px'
                  }} 
                />
              </Link>

              {/* Navigation */}
              <nav style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
              {/* Shop Dropdown */}
              <div 
                style={{ position: 'relative' }}
                onMouseEnter={() => {
                  clearTimeout(dropdownTimeouts.shop);
                  setShowShopDropdown(true);
                }}
                onMouseLeave={() => {
                  const timeout = setTimeout(() => {
                    setShowShopDropdown(false);
                  }, 200);
                  setDropdownTimeouts(prev => ({ ...prev, shop: timeout }));
                }}
              >
                <Link to="/shop" style={{
                  color: '#111A45',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontFamily: 'Space Grotesk, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontWeight: '600'
                }}>
                  Shop
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="#111A45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                {showShopDropdown && (
                  <div 
                    onMouseEnter={() => clearTimeout(dropdownTimeouts.shop)}
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      left: '0',
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(17, 26, 69, 0.12)',
                      padding: '12px 0',
                      minWidth: '320px',
                      zIndex: 1000,
                      marginTop: '4px'
                    }}
                  >
                    {loadingCategories ? (
                      <div style={{ padding: '12px 20px', color: '#666', fontSize: '14px' }}>Loading categories...</div>
                    ) : categories.length > 0 ? (
                      categories.slice(0, 8).map((category, index) => (
                        <div key={category.id || index} style={{ position: 'relative' }}>
                          <Link 
                            to={`/shop?category=${category.id}`}
                            style={{ 
                              display: 'block', 
                              padding: '12px 20px', 
                              color: '#111A45', 
                              textDecoration: 'none', 
                              fontSize: '14px',
                              fontFamily: 'Space Grotesk, sans-serif',
                              fontWeight: '500',
                              transition: 'all 0.2s ease',
                              borderBottom: index < categories.slice(0, 8).length - 1 ? '1px solid #f0f0f0' : 'none'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = '#f8f9fa';
                              e.target.style.color = '#111A45';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = 'transparent';
                              e.target.style.color = '#111A45';
                            }}
                          >
                            {category.name || category.title}
                            <span style={{ 
                              float: 'right', 
                              fontSize: '12px', 
                              color: '#888',
                              marginLeft: '10px',
                              fontWeight: '400'
                            }}>
                              ({category.productCount || category.count || 0})
                            </span>
                          </Link>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '12px 20px', color: '#666', fontSize: '14px' }}>No categories found</div>
                    )}
                  </div>
                )}
              </div>

              {/* Vendors Dropdown */}
              <div 
                style={{ position: 'relative' }}
                onMouseEnter={() => {
                  clearTimeout(dropdownTimeouts.vendors);
                  setShowVendorsDropdown(true);
                }}
                onMouseLeave={() => {
                  const timeout = setTimeout(() => {
                    setShowVendorsDropdown(false);
                  }, 200);
                  setDropdownTimeouts(prev => ({ ...prev, vendors: timeout }));
                }}
              >
                 <a href="/vendors" style={{
                   color: '#111A45',
                   textDecoration: 'none',
                   fontSize: '16px',
                   fontFamily: 'Space Grotesk, sans-serif',
                   display: 'flex',
                   alignItems: 'center',
                   gap: '5px',
                   fontWeight: '600'
                 }}>
                   Vendors
                   <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M1 1L5 5L9 1" stroke="#111A45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                   </svg>
                 </a>
                {showVendorsDropdown && (
                  <div 
                    onMouseEnter={() => clearTimeout(dropdownTimeouts.vendors)}
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      left: '0',
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(17, 26, 69, 0.12)',
                      padding: '12px 0',
                      minWidth: '220px',
                      zIndex: 1000,
                      marginTop: '4px'
                    }}
                  >
                    <a href="/vendors" style={{ 
                      display: 'block', 
                      padding: '12px 20px', 
                      color: '#111A45', 
                      textDecoration: 'none', 
                      fontSize: '14px',
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      borderBottom: '1px solid #f0f0f0'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f8f9fa';
                      e.target.style.color = '#111A45';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#111A45';
                    }}
                    >Vendors Listing</a>
                    <a href="/vendor" style={{ 
                      display: 'block', 
                      padding: '12px 20px', 
                      color: '#111A45', 
                      textDecoration: 'none', 
                      fontSize: '14px',
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      borderBottom: '1px solid #f0f0f0'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f8f9fa';
                      e.target.style.color = '#111A45';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#111A45';
                    }}
                    >Vendor Single</a>
                    <a href="/vendor-dashboard" style={{ 
                      display: 'block', 
                      padding: '12px 20px', 
                      color: '#111A45', 
                      textDecoration: 'none', 
                      fontSize: '14px',
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontWeight: '500',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f8f9fa';
                      e.target.style.color = '#111A45';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#111A45';
                    }}
                    >Vendor Dashboard</a>
                  </div>
                )}
              </div>

              {/* About Dropdown */}
              <div 
                style={{ position: 'relative' }}
                onMouseEnter={() => {
                  clearTimeout(dropdownTimeouts.about);
                  setShowAboutDropdown(true);
                }}
                onMouseLeave={() => {
                  const timeout = setTimeout(() => {
                    setShowAboutDropdown(false);
                  }, 200);
                  setDropdownTimeouts(prev => ({ ...prev, about: timeout }));
                }}
              >
                <a href="/about" style={{
                  color: '#111A45',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontFamily: 'Space Grotesk, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontWeight: '600'
                }}>
                  About
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="#111A45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                {showAboutDropdown && (
                  <div 
                    onMouseEnter={() => clearTimeout(dropdownTimeouts.about)}
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      left: '0',
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(17, 26, 69, 0.12)',
                      padding: '12px 0',
                      minWidth: '200px',
                      zIndex: 1000,
                      marginTop: '4px'
                    }}
                  >
                    <a href="/about" style={{ 
                      display: 'block', 
                      padding: '12px 20px', 
                      color: '#111A45', 
                      textDecoration: 'none', 
                      fontSize: '14px',
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      borderBottom: '1px solid #f0f0f0'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f8f9fa';
                      e.target.style.color = '#111A45';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#111A45';
                    }}
                    >About Us</a>
                    <a href="/careers" style={{ 
                      display: 'block', 
                      padding: '12px 20px', 
                      color: '#111A45', 
                      textDecoration: 'none', 
                      fontSize: '14px',
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      borderBottom: '1px solid #f0f0f0'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f8f9fa';
                      e.target.style.color = '#111A45';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#111A45';
                    }}
                    >Careers</a>
                    <a href="/contact" style={{ 
                      display: 'block', 
                      padding: '12px 20px', 
                      color: '#111A45', 
                      textDecoration: 'none', 
                      fontSize: '14px',
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      borderBottom: '1px solid #f0f0f0'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f8f9fa';
                      e.target.style.color = '#111A45';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#111A45';
                    }}
                    >Contact</a>
                    <a href="/team" style={{ 
                      display: 'block', 
                      padding: '12px 20px', 
                      color: '#111A45', 
                      textDecoration: 'none', 
                      fontSize: '14px',
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontWeight: '500',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f8f9fa';
                      e.target.style.color = '#111A45';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#111A45';
                    }}
                    >Our Team</a>
                  </div>
                )}
                </div>

              {/* Blog - No Dropdown */}
              <a href="https://blog.vcloudtech.com/" style={{
                color: '#111A45',
                textDecoration: 'none',
                fontSize: '16px',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: '600'
              }}>
                Blog
              </a>
            </nav>
            </div>

            {/* Search - Right side */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              position: 'relative',
              left: '100px',
              backgroundColor: '#f8f9fa',
              borderRadius: '25px',
              padding: '0',
              border: '2px solid transparent',
              transition: 'all 0.3s ease',
              width: '240px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fff';
              e.currentTarget.style.borderColor = '#111A45';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(17, 26, 69, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f8f9fa';
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 20 20" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ 
                  position: 'absolute', 
                  left: '16px', 
                  pointerEvents: 'none',
                  color: '#888'
                }}
              >
                <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 19L14.65 14.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input 
                type="text" 
                placeholder="Search products..." 
                style={{
                  padding: '12px 16px 12px 48px',
                  border: 'none',
                  borderRadius: '25px',
                  fontSize: '14px',
                  width: '100%',
                  fontFamily: 'Space Grotesk, sans-serif',
                  backgroundColor: 'transparent',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  color: '#111A45'
                }}
                onFocus={(e) => {
                  e.target.parentElement.style.backgroundColor = '#fff';
                  e.target.parentElement.style.borderColor = '#111A45';
                  e.target.parentElement.style.boxShadow = '0 4px 12px rgba(17, 26, 69, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.parentElement.style.backgroundColor = '#f8f9fa';
                  e.target.parentElement.style.borderColor = 'transparent';
                  e.target.parentElement.style.boxShadow = 'none';
                }}
              />
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