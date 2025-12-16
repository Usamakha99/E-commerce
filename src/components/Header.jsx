import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productService } from '../services/product.service';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/auth.service';
import CartSidebar from './CartSidebar';

const Header = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { isLoggedIn } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [showVendorsDropdown, setShowVendorsDropdown] = useState(false);
  const [showAboutDropdown, setShowAboutDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [dropdownTimeouts, setDropdownTimeouts] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 992);
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  
  // Calculate cart item count
  const cartItemCount = cart?.items?.length || 0;

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
      if (window.innerWidth >= 992) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
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

  // Handle search input change with live search
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length >= 2) {
      try {
        const response = await productService.getAllProducts();
        const products = Array.isArray(response) ? response : (response?.data || []);
        
        const filtered = products.filter(product => {
          const productName = (product.name || product.title || '').toLowerCase();
          const productShortDesc = (product.shortDescp || '').toLowerCase();
          const productSku = (product.sku || '').toString().toLowerCase();
          const searchLower = query.toLowerCase();
          
          return productName.includes(searchLower) || 
                 productShortDesc.includes(searchLower) || 
                 productSku.includes(searchLower);
        }).slice(0, 5); // Show max 5 results
        
        setSearchResults(filtered);
        setShowSearchDropdown(filtered.length > 0);
      } catch (error) {
        console.error('Error searching products:', error);
        setSearchResults([]);
        setShowSearchDropdown(false);
      }
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  };

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearchDropdown(false);
      setSearchResults([]);
    }
  };

  // Handle product selection from dropdown
  const handleProductSelect = (productId) => {
    navigate(`/product/${productId}`);
    setSearchQuery('');
    setShowSearchDropdown(false);
    setSearchResults([]);
  };

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
            gap: isMobile ? '10px' : '20px'
          }}>
            
            {/* Mobile Menu and Cart */}
            {isMobile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    zIndex: 1001
                  }}
                  aria-label="Toggle menu"
                >
                  <span style={{
                    width: '24px',
                    height: '2px',
                    backgroundColor: '#111A45',
                    display: 'block',
                    transition: 'all 0.3s',
                    transform: isMobileMenuOpen ? 'rotate(45deg) translateY(6px)' : 'none'
                  }}></span>
                  <span style={{
                    width: '24px',
                    height: '2px',
                    backgroundColor: '#111A45',
                    display: 'block',
                    transition: 'all 0.3s',
                    opacity: isMobileMenuOpen ? '0' : '1'
                  }}></span>
                  <span style={{
                    width: '24px',
                    height: '2px',
                    backgroundColor: '#111A45',
                    display: 'block',
                    transition: 'all 0.3s',
                    transform: isMobileMenuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none'
                  }}></span>
                </button>
              </div>
            )}
            
            {/* Left side - Logo and Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '120px', flex: '1' }}>
              {/* Logo */}
              <Link to="/" style={{ display: 'flex', alignItems:"center", textDecoration: 'none' }}>
                <img 
                  alt="V Cloud" 
                  src="/src/assets/V Cloud Logo final-01.svg" 
                  style={{ 
                    width: isMobile ? '120px' : '200px', 
                    position: 'relative',
                    right: isMobile ? '0' : '10px',
                    height: isMobile ? '30px' : '50px'
                  }} 
                />
              </Link>

              {/* Navigation - Desktop Only */}
              <nav style={{ display: isMobile ? 'none' : 'flex', alignItems: 'center', gap: '30px' }}>
              {/* Shop - No Dropdown */}
              <Link to="/shop" style={{
                color: '#111A45',
                textDecoration: 'none',
                fontSize: '16px',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: '600'
              }}>
                Shop
              </Link>

              {/* Marketplace - No Dropdown */}
              <Link to="/marketplace" style={{
                color: '#111A45',
                textDecoration: 'none',
                fontSize: '16px',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: '600'
              }}>
                AI Store 
              </Link>

              {/* Vendors Dropdown - COMMENTED OUT */}
              {/* <div 
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
              </div> */}

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

            {/* Right Side Actions */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: isMobile ? '10px' : '20px'
            }}>
              {/* Mobile Cart Icon */}
              {isMobile && (
                <Link 
                  to="/cart" 
                  style={{ 
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    padding: '5px'
                  }}
                >
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ color: '#111A45' }}
                  >
                    <path 
                      d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" 
                      fill="currentColor"
                    />
                  </svg>
                  {cartItemCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '0',
                      right: '-2px',
                      backgroundColor: '#df2020',
                      color: 'white',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '600',
                      fontFamily: 'Space Grotesk, sans-serif',
                      border: '2  px solid white',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Search - Right side */}
              <form 
                onSubmit={handleSearch}
                style={{ 
                  display: isMobile ? 'none' : 'flex', 
                  alignItems: 'center',
                  position: 'relative',
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
                value={searchQuery}
                onChange={handleSearchChange}
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
                  // Delay to allow click on dropdown items
                  setTimeout(() => {
                    e.target.parentElement.style.backgroundColor = '#f8f9fa';
                    e.target.parentElement.style.borderColor = 'transparent';
                    e.target.parentElement.style.boxShadow = 'none';
                    setShowSearchDropdown(false);
                  }, 200);
                }}
              />
              {/* Search Results Dropdown */}
              {showSearchDropdown && searchResults.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '600px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(17, 26, 69, 0.12)',
                  border: '1px solid #e0e0e0',
                  zIndex: 2000,
                  maxHeight: '500px',
                  overflowY: 'auto'
                }}>
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleProductSelect(product.id);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '14px 16px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f0f0f0',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                      }}
                    >
                      <img
                        src={product.image || '/src/assets/imgs/page/homepage1/imgsp1.png'}
                        alt={product.name || product.title}
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'contain',
                          borderRadius: '8px',
                          border: '1px solid #e0e0e0',
                          padding: '4px',
                          backgroundColor: '#fafafa'
                        }}
                        onError={(e) => { e.target.src = '/src/assets/imgs/page/homepage1/imgsp1.png'; }}
                      />
                      <div style={{ flex: 1, width: '100%', overflow: 'visible' }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'rgb(17, 26, 69)',
                          marginBottom: '4px',
                          lineHeight: '1.5',
                          wordWrap: 'break-word',
                          whiteSpace: 'normal',
                          overflow: 'visible'
                        }}>
                          {product.name || product.title}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#888',
                          fontWeight: '500'
                        }}>
                          SKU: {product.sku || 'N/A'} {product.brand?.title && `• ${product.brand.title}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form>

            {/* Right Side Actions - Sign In/Sign Up or Cart */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {!isLoggedIn ? (
                <>
                  {/* Sign In Button */}
                  <Link 
                    to="/login"
                    style={{
                      padding: '6px 14px',
                      backgroundColor: '#111A45',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '25px',
                      fontSize: '13px',
                      fontWeight: '600',
                      fontFamily: 'Space Grotesk, sans-serif',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#0D1433';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#111A45';
                    }}
                  >
                    Sign In
                  </Link>

                  {/* Sign Up Button */}
                  <Link 
                    to="/register"
                    style={{
                      padding: '6px 14px',
                      backgroundColor: 'transparent',
                      color: '#111A45',
                      textDecoration: 'none',
                      borderRadius: '25px',
                      fontSize: '13px',
                      fontWeight: '600',
                      fontFamily: 'Space Grotesk, sans-serif',
                      border: '1.5px solid #111A45',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#111A45';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#111A45';
                    }}
                  >
                    Sign Up
                  </Link>

                  {/* Cart Icon - When Not Logged In */}
                  <button 
                    onClick={() => setShowCartSidebar(true)}
                    style={{ 
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '5px',
                      transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <svg 
                      width="28" 
                      height="28" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ color: '#111A45' }}
                    >
                      <path 
                        d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" 
                        fill="currentColor"
                      />
                    </svg>
                    {cartItemCount > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-8px',
                        backgroundColor: '#df2020',
                        color: 'white',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: '600',
                        fontFamily: 'Space Grotesk, sans-serif',
                        border: '2px solid white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}>
                        {cartItemCount}
                      </span>
                    )}
                  </button>
                </>
              ) : (
                <>
                  {/* Cart Icon - When Logged In */}
                  <button 
                    onClick={() => setShowCartSidebar(true)}
                    style={{ 
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '5px',
                      transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <svg 
                      width="28" 
                      height="28" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ color: '#111A45' }}
                    >
                      <path 
                        d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" 
                        fill="currentColor"
                      />
                    </svg>
                    {cartItemCount > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-8px',
                        backgroundColor: '#df2020',
                        color: 'white',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: '600',
                        fontFamily: 'Space Grotesk, sans-serif',
                        border: '2px solid white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}>
                        {cartItemCount}
                      </span>
                    )}
                  </button>

                  {/* Logout Icon - When Logged In */}
                  <button 
                    onClick={() => {
                      authService.logout();
                    }}
                    title="Logout"
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '5px',
                      transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <svg 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ color: '#111A45' }}
                    >
                      <path 
                        d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.59L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" 
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999,
            animation: 'fadeIn 0.3s ease'
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: isMobileMenuOpen ? 0 : '-100%',
          width: '80%',
          maxWidth: '320px',
          height: '100vh',
          backgroundColor: 'white',
          zIndex: 1000,
          transition: 'left 0.3s ease',
          overflowY: 'auto',
          boxShadow: isMobileMenuOpen ? '2px 0 10px rgba(0,0,0,0.1)' : 'none'
        }}
      >
        <div style={{ padding: '20px' }}>
          {/* Close Button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#111A45',
              padding: '5px',
              width: '35px',
              height: '35px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>

          {/* Logo */}
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'block', marginBottom: '30px', marginTop: '10px' }}>
            <img 
              alt="V Cloud" 
              src="/src/assets/V Cloud Logo final-01.svg" 
              style={{ width: '150px', height: 'auto' }} 
            />
          </Link>

          {/* Search Bar in Mobile Menu */}
          <form 
            onSubmit={(e) => {
              handleSearch(e);
              setIsMobileMenuOpen(false);
            }}
            style={{ 
              marginBottom: '25px',
              position: 'relative'
            }}
          >
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={handleSearchChange}
              style={{
                width: '100%',
                padding: '12px 40px 12px 15px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'Space Grotesk, sans-serif',
                outline: 'none'
              }}
            />
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              style={{ 
                position: 'absolute', 
                right: '12px', 
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#888'
              }}
            >
              <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 19L14.65 14.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </form>

          {/* Mobile Navigation Links */}
          <nav>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <Link 
                  to="/shop" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: 'block',
                    padding: '12px 10px',
                    color: '#111A45',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    fontFamily: 'Space Grotesk, sans-serif',
                    borderBottom: '1px solid #f0f0f0'
                  }}
                >
                  Shop
                </Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link 
                  to="/marketplace" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: 'block',
                    padding: '12px 10px',
                    color: '#111A45',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    fontFamily: 'Space Grotesk, sans-serif',
                    borderBottom: '1px solid #f0f0f0'
                  }}
                >
                  Marketplace
                </Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link 
                  to="/about" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: 'block',
                    padding: '12px 10px',
                    color: '#111A45',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    fontFamily: 'Space Grotesk, sans-serif',
                    borderBottom: '1px solid #f0f0f0'
                  }}
                >
                  About
                </Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link 
                  to="/blog" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: 'block',
                    padding: '12px 10px',
                    color: '#111A45',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    fontFamily: 'Space Grotesk, sans-serif',
                    borderBottom: '1px solid #f0f0f0'
                  }}
                >
                  Blog
                </Link>
              </li>
            </ul>

            {/* Categories in Mobile */}
            {categories.length > 0 && (
              <div style={{ marginTop: '25px' }}>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#111A45',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  Categories
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {categories.slice(0, 6).map((category) => (
                    <li key={category.id} style={{ marginBottom: '4px' }}>
                      <Link 
                        to={`/shop?category=${category.id}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{
                          display: 'block',
                          padding: '10px',
                          color: '#666',
                          textDecoration: 'none',
                          fontSize: '14px',
                          fontFamily: 'Space Grotesk, sans-serif',
                          borderRadius: '6px'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        {category.name || category.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mobile Account Links */}
            <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '2px solid #f0f0f0' }}>
              <Link 
                to="/login" 
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  display: 'block',
                  padding: '12px 20px',
                  backgroundColor: '#111A45',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: '600',
                  fontFamily: 'Space Grotesk, sans-serif',
                  borderRadius: '8px',
                  textAlign: 'center',
                  marginBottom: '10px'
                }}
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  display: 'block',
                  padding: '12px 20px',
                  backgroundColor: 'transparent',
                  color: '#111A45',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: '600',
                  fontFamily: 'Space Grotesk, sans-serif',
                  borderRadius: '8px',
                  textAlign: 'center',
                  border: '2px solid #111A45'
                }}
              >
                Sign Up
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* Cart Sidebar Component */}
      <CartSidebar 
        isOpen={showCartSidebar}
        onClose={() => setShowCartSidebar(false)}
      />
    </>
  );
};

export default Header;