import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState('AI Agents & Tools');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('Relevance');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedDeliveryMethods, setSelectedDeliveryMethods] = useState([]);
  const [selectedPublishers, setSelectedPublishers] = useState([]);
  const [showCategories, setShowCategories] = useState(true);
  const [showDeliveryMethods, setShowDeliveryMethods] = useState(true);
  const [showPublishers, setShowPublishers] = useState(true);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update document title based on selected category
  useEffect(() => {
    const title = selectedCategory 
      ? `${selectedCategory} - AI Marketplace - VCloud Tech`
      : 'AI Marketplace - VCloud Tech';
    document.title = title;
  }, [selectedCategory]);

  // Mock data for categories
  const categories = [
    { name: 'Software Development', count: 602 },
    { name: 'Data Analysis', count: 447 },
    { name: 'Customer Experience', count: 0 },
    { name: 'Personalization', count: 226 },
    { name: 'AI Security', count: 178 },
    { name: 'Observability', count: 170 },
    { name: 'Customer Support', count: 160 },
    { name: 'Sales & Marketing', count: 137 },
    { name: 'Legal & Compliance', count: 123 },
    { name: 'IT Support', count: 113 },
    { name: 'Content Creation', count: 108 },
    { name: 'Finance & Accounting', count: 95 },
    { name: 'Research', count: 80 },
    { name: 'Procurement & Supply Chain', count: 63 },
    { name: 'Quality Assurance', count: 62 },
    { name: 'Scheduling & Coordination', count: 36 }
  ];

  const deliveryMethods = [
    { name: 'Professional Services', count: 1137 },
    { name: 'SaaS', count: 662 },
    { name: 'Amazon Machine Image', count: 179 },
    { name: 'API-Based Agents & Tools', count: 38 },
    { name: 'Container Image', count: 35 },
    { name: 'CloudFormation Template', count: 24 },
    { name: 'Helm Chart', count: 11 }
  ];

  const publishers = [
    { name: 'Flexa Cloud', count: 297 },
    { name: 'Deloitte Consulting LLP', count: 103 }
  ];

  // Mock products
  const products = [
    {
      id: 1,
      name: 'Okta Platform',
      provider: 'Okta, Inc',
      logo: '/src/assets/imgs/page/homepage1/imgsp1.png',
      awsReviews: 1,
      externalReviews: 999,
      rating: 5,
      freeTrial: true,
      description: 'Okta Workforce Identity delivers a unified identity security platform that protects customer environments before, during, and after authentication and with continuous assessment of user and session risk. By offering an integrated and multi-layer security approach that enables you to view, monitor...'
    },
    {
      id: 2,
      name: 'Auth0 Platform',
      provider: 'Okta, Inc',
      logo: '/src/assets/imgs/page/homepage1/imgsp1.png',
      awsReviews: 1,
      externalReviews: 236,
      rating: 1,
      freeTrial: true,
      description: 'Product Overview: Customer Identity Cloud makes it easy to add basic and advanced authentication and authorization capabilities to your applications. Built for consumer and SaaS apps in any industry, it allows you to add functionality like branded login flows, MFA, or Passkeys in a matter of days, no...'
    },
    {
      id: 3,
      name: 'JFrog Software Supply Chain Platform',
      provider: 'JFrog',
      logo: '/src/assets/imgs/page/homepage1/imgsp1.png',
      awsReviews: 0,
      externalReviews: 106,
      rating: 0,
      freeTrial: false,
      description: 'Trusted by millions of developers, engineers, architects, and security professionals at thousands of enterprises, including the majority of the Fortune 100, the cloud-native JFrog Software Supply Chain Platform is the single source of truth for all software packages, data, and ML models utilized...'
    }
  ];

  const handleDeliveryMethodToggle = (method) => {
    if (selectedDeliveryMethods.includes(method)) {
      setSelectedDeliveryMethods(selectedDeliveryMethods.filter(m => m !== method));
    } else {
      setSelectedDeliveryMethods([...selectedDeliveryMethods, method]);
    }
  };

  const handlePublisherToggle = (publisher) => {
    if (selectedPublishers.includes(publisher)) {
      setSelectedPublishers(selectedPublishers.filter(p => p !== publisher));
    } else {
      setSelectedPublishers([...selectedPublishers, publisher]);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} style={{ color: i < rating ? '#FFB800' : '#ddd', fontSize: '16px' }}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <main className="main" style={{ paddingTop: '60px', backgroundColor: 'white' }}>
      <div className="container-fluid" style={{ padding: isMobile ? '15px' : '20px 40px' }}>
        <div className="row">
          {/* Left Sidebar - Filters */}
          <div className="col-lg-3 order-first order-lg-first" style={{ paddingRight: isMobile ? '0' : '30px', marginBottom: isMobile ? '30px' : '0' }}>
            <div>
              {/* Refine Results Header */}
              <h6 style={{
                margin: 0,
                color: '#000',
                fontWeight: 'bold',
                fontSize: '16px',
                borderBottom: '3px solid #df2020',
                paddingBottom: '8px',
                marginBottom: '20px',
                display: 'inline-block'
              }}>
                Refine results
              </h6>

              {/* All Categories Link */}
              <div style={{ marginBottom: '15px' }}>
                <a href="#" style={{
                  color: '#000',
                  fontSize: '14px',
                  textDecoration: 'underline',
                  fontFamily: 'DM Sans, sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#000';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#000';
                }}
                >
                All categories
                </a>
              </div>

              {/* Selected Category */}
              <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#000',
                marginBottom: '15px',
                fontFamily: 'DM Sans, sans-serif',
                borderBottom: '3px solid #df2020',
                paddingBottom: '8px',
                display: 'inline-block'
              }}>
                {selectedCategory}
              </div>

              {/* Categories List */}
              <div style={{ marginBottom: '25px' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {categories.map((cat, index) => (
                    <li key={index} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <a href="#" style={{
                        color: '#000',
                        fontSize: '14px',
                        textDecoration: 'underline',
                        fontFamily: 'DM Sans, sans-serif',
                        flex: 1
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = '#000';
                        // Underline the count when hovering on category name
                        const countSpan = e.target.parentElement.querySelector('.category-count');
                        if (countSpan) countSpan.style.textDecoration = 'underline';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = '#000';
                        // Remove underline from count
                        const countSpan = e.target.parentElement.querySelector('.category-count');
                        if (countSpan) countSpan.style.textDecoration = 'none';
                      }}
                      >
                        {cat.name}
                      </a>
                      {cat.count > 0 && (
                        <span className="category-count" style={{
                          color: '#000',
                          fontSize: '14px',
                          fontWeight: '600',
                          marginLeft: '10px',
                          textDecoration: 'none',
                          transition: 'text-decoration 0.2s ease'
                        }}>
                          {cat.count}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Delivery Methods */}
              <div style={{ marginBottom: '25px' }}>
                <h6 
                  style={{
                    margin: 0,
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    borderBottom: '3px solid #df2020',
                    paddingBottom: '8px',
                    marginBottom: '15px',
                    display: 'inline-block',
                    cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif'
                  }}
                  onClick={() => setShowDeliveryMethods(!showDeliveryMethods)}
                >
                  Delivery methods
                </h6>
                {showDeliveryMethods && (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {deliveryMethods.map((method, index) => (
                      <li key={index} style={{ marginBottom: '1px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label className="cb-container" style={{ flex: 1 }}>
                          <input
                            type="checkbox"
                            checked={selectedDeliveryMethods.includes(method.name)}
                            onChange={() => handleDeliveryMethodToggle(method.name)}
                          />
                          <span className="text-small" style={{ color: '#000', fontSize: '14px', textDecoration: 'underline' }}>
                            {method.name}
                          </span>
                          <span className="checkmark"></span>
                        </label>
                        <span className="number-item" style={{ color: '#000', fontSize: '14px', fontWeight: '600', marginLeft: '10px' }}>
                          {method.count}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Publishers */}
              <div style={{ marginBottom: '25px' }}>
                <h6 
                  style={{
                    margin: 0,
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    borderBottom: '3px solid #df2020',
                    paddingBottom: '8px',
                    marginBottom: '15px',
                    display: 'inline-block',
                    cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif'
                  }}
                  onClick={() => setShowPublishers(!showPublishers)}
                >
                  Publisher
                </h6>
                {showPublishers && (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {publishers.map((publisher, index) => (
                      <li key={index} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label className="cb-container" style={{ flex: 1 }}>
                          <input
                            type="checkbox"
                            checked={selectedPublishers.includes(publisher.name)}
                            onChange={() => handlePublisherToggle(publisher.name)}
                          />
                          <span className="text-small" style={{ color: '#000', fontSize: '14px', textDecoration: 'underline' }}>
                            {publisher.name}
                          </span>
                          <span className="checkmark"></span>
                        </label>
                        <span className="number-item" style={{ color: '#000', fontSize: '14px', fontWeight: '600', marginLeft: '10px' }}>
                          {publisher.count}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Search Results */}
          <div className="col-lg-9">
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: isMobile ? '15px' : '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              {/* Search Results Header */}
              <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'center',
                marginBottom: '20px',
                paddingBottom: '15px',
                borderBottom: '1px solid #e7e7e7',
                gap: isMobile ? '15px' : '0'
              }}>
                <div>
                  <h4 style={{
                    fontSize: isMobile ? '18px' : '22px',
                    fontWeight: '600',
                    color: '#232F3E',
                    marginBottom: '5px',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    Search results
                  </h4>
                  <p style={{
                    fontSize: isMobile ? '12px' : '14px',
                    color: '#565959',
                    margin: 0,
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    {selectedCategory} (2,073 results) showing 1-20
                  </p>
                </div>

                {/* Pagination and Sort */}
                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '20px', flexWrap: 'wrap' }}>
                  {/* Pagination */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button style={{
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      color: '#232F3E',
                      fontSize: '18px'
                    }}>
                      ‹
                    </button>
                    <span style={{
                      padding: '4px 10px',
                      backgroundColor: '#F0F2F2',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      1
                    </span>
                    <button style={{
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      color: '#232F3E',
                      fontSize: '18px'
                    }}>
                      ›
                    </button>
                    <span style={{ color: '#565959', fontSize: '14px' }}>...</span>
                  </div>

                  {/* Sort Dropdown */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setShowSortDropdown(!showSortDropdown)}
                      style={{
                        padding: '8px 16px',
                        border: '1px solid #D5D9D9',
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontFamily: 'DM Sans, sans-serif',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      Sort By: {sortBy}
                      <span style={{ fontSize: '12px' }}>▾</span>
                    </button>
                    {showSortDropdown && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '4px',
                        backgroundColor: 'white',
                        border: '1px solid #D5D9D9',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        zIndex: 1000,
                        minWidth: '180px'
                      }}>
                        {['Relevance', 'Newest', 'Price: Low to High', 'Price: High to Low'].map((option) => (
                          <div
                            key={option}
                            onClick={() => {
                              setSortBy(option);
                              setShowSortDropdown(false);
                            }}
                            style={{
                              padding: '10px 16px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontFamily: 'DM Sans, sans-serif',
                              backgroundColor: sortBy === option ? '#F0F2F2' : 'white'
                            }}
                            onMouseEnter={(e) => {
                              if (sortBy !== option) e.target.style.backgroundColor = '#F7F8F8';
                            }}
                            onMouseLeave={(e) => {
                              if (sortBy !== option) e.target.style.backgroundColor = 'white';
                            }}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Products List */}
              <div>
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    style={{
                      display: 'flex',
                      gap: '20px',
                      paddingBottom: '20px',
                      marginBottom: '20px',
                      borderBottom: index < products.length - 1 ? '1px solid #e7e7e7' : 'none'
                    }}
                  >
                    {/* Product Logo */}
                    <div style={{
                      width: isMobile ? '60px' : '100px',
                      height: isMobile ? '60px' : '100px',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      padding: '10px'
                    }}>
                      <img
                        src={product.logo}
                        alt={product.name}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain'
                        }}
                        onError={(e) => { e.target.src = '/src/assets/imgs/page/homepage1/imgsp1.png'; }}
                      />
                    </div>

                    {/* Product Info */}
                    <div style={{ flex: 1 }}>
                      {/* Product Name */}
                      <Link
                        to={`/marketplace/${product.id}`}
                        style={{
                          fontSize: isMobile ? '16px' : '18px',
                          fontWeight: '600',
                          color: '#007185',
                          textDecoration: 'none',
                          fontFamily: 'DM Sans, sans-serif',
                          display: 'block',
                          marginBottom: '4px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = '#C7511F';
                          e.target.style.textDecoration = 'underline';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = '#007185';
                          e.target.style.textDecoration = 'none';
                        }}
                      >
                        {product.name}
                      </Link>

                      {/* Provider */}
                      <p style={{
                        fontSize: '13px',
                        color: '#565959',
                        margin: '0 0 8px 0',
                        fontFamily: 'DM Sans, sans-serif'
                      }}>
                        By {product.provider}
                      </p>

                      {/* Reviews */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        {product.rating > 0 && (
                          <div style={{ display: 'flex', gap: '2px' }}>
                            {renderStars(product.rating)}
                          </div>
                        )}
                        <div style={{
                          fontSize: '13px',
                          color: '#007185',
                          fontFamily: 'DM Sans, sans-serif'
                        }}>
                          {product.awsReviews > 0 && (
                            <a href="#" style={{ color: '#007185', textDecoration: 'none' }}>
                              {product.awsReviews} AWS review{product.awsReviews > 1 ? 's' : ''}
                            </a>
                          )}
                          {product.awsReviews > 0 && product.externalReviews > 0 && ' | '}
                          {product.externalReviews > 0 && (
                            <a href="#" style={{ color: '#007185', textDecoration: 'none' }}>
                              {product.externalReviews} external review{product.externalReviews > 1 ? 's' : ''}
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Free Trial Badge */}
                      {product.freeTrial && (
                        <div style={{ marginBottom: '10px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 10px',
                            backgroundColor: '#E8F5E9',
                            color: '#2E7D32',
                            fontSize: '12px',
                            fontWeight: '500',
                            borderRadius: '4px',
                            fontFamily: 'DM Sans, sans-serif'
                          }}>
                            <span>🌿</span>
                            Free Trial
                          </span>
                        </div>
                      )}

                      {/* Description */}
                      <p style={{
                        fontSize: isMobile ? '13px' : '14px',
                        color: '#0F1111',
                        lineHeight: '1.6',
                        margin: 0,
                        fontFamily: 'DM Sans, sans-serif'
                      }}>
                        {product.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Pagination */}
              <div style={{
                marginTop: '30px',
                paddingTop: '20px',
                borderTop: '1px solid #e7e7e7',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px'
              }}>
                <button style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: '#232F3E',
                  fontSize: '18px'
                }}>
                  ‹
                </button>
                <span style={{
                  padding: '6px 12px',
                  backgroundColor: '#F0F2F2',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: '500'
                }}>
                  1
                </span>
                <button style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: '#232F3E',
                  fontSize: '18px'
                }}>
                  ›
                </button>
                <span style={{ color: '#565959', fontSize: '14px' }}>...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Marketplace;

