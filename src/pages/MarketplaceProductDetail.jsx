import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const MarketplaceProductDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(typeof window !== 'undefined' && window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth < 992);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mock product data
  const product = {
    id: 1,
    name: 'Okta Platform',
    logo: '/src/assets/imgs/page/homepage1/imgsp1.png',
    seller: 'Okta, Inc',
    rating: 4.5,
    awsReviews: 1,
    externalReviews: 999,
    badges: ['Deployed on AWS', 'Free Trial', 'AWS Free Tier'],
    shortDescription: 'Secure your employees, contractors, and partners - wherever they are. Covers every part of the Identity lifecycle, from governance, to access, to privileged controls.',
    videoThumbnail: '/src/assets/imgs/page/homepage1/imgsp1.png',
    overview: 'Okta Workforce Identity delivers a unified identity security platform that protects customer environments before, during, and after authentication and with continuous assessment of user and session risk. By offering an integrated and multi-layer security approach that enables you to view, monitor, and respond to threats in real-time, Okta helps you protect your workforce and your business.',
    highlights: [
      'Turn Identity into a business advantage: Empower your people, protect your organization, and accelerate your business with an Identity-first security solution built for todays dynamic workforce.',
      'Build the tech ecosystem of your choice: Never again worry about building or maintaining your SSO integrations. Okta takes care of that with the largest network of over 7000 pre-built cloud and on-prem apps available, so you can build the tech ecosystem you need, and set up access immediately.',
      'Okta Workforce Identity Suites: Mature your identity security with the Okta Workforce Identity Suites, solution-based packages. These suites provide paths to mature your identity posture, in phases - without the complexity of selecting individual tools.'
    ],
    breadcrumbs: [
      { name: 'AWS Marketplace', url: '/marketplace' },
      { name: 'Security', url: '/marketplace' },
      { name: 'Software as a Service (SaaS)', url: '/marketplace' },
      { name: 'Okta Platform', url: '#' }
    ]
  };

  const tabs = [
    'Overview',
    'Features',
    'Pricing',
    'Legal',
    'Usage',
    'Resources',
    'Support',
    'Product comparison'
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} style={{ color: '#FFB800', fontSize: '18px' }}>★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} style={{ color: '#FFB800', fontSize: '18px' }}>⯨</span>);
      } else {
        stars.push(<span key={i} style={{ color: '#ddd', fontSize: '18px' }}>★</span>);
      }
    }
    return stars;
  };

  return (
    <main className="main" style={{ paddingTop: '60px', backgroundColor: 'white' }}>
      <div className="container-fluid" style={{ padding: isMobile ? '0 15px' : '0 40px' }}>
        {/* Product Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: isMobile ? '15px' : '24px',
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div className="row">
            {/* Left - Product Info */}
            <div className="col-lg-8">
              <div style={{ display: 'flex', gap: isMobile ? '12px' : '20px', alignItems: 'flex-start' }}>
                {/* Logo */}
                <div style={{
                  width: isMobile ? '60px' : '80px',
                  height: isMobile ? '60px' : '80px',
                  flexShrink: 0,
                  backgroundColor: '#000',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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
                  />
                </div>

                {/* Product Info */}
                <div style={{ flex: 1 }}>
                  {/* Title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <h1 style={{
                      fontSize: isMobile ? '20px' : '28px',
                      fontWeight: '600',
                      color: '#0F1111',
                      margin: 0,
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      {product.name}
                    </h1>
                    <a href="#" style={{
                      fontSize: '13px',
                      color: '#007185',
                      textDecoration: 'none',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      Info
                    </a>
                  </div>

                  {/* Seller */}
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{
                      fontSize: '14px',
                      color: '#565959',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      Sold by:{' '}
                    </span>
                    <a href="#" style={{
                      fontSize: '14px',
                      color: '#007185',
                      textDecoration: 'none',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      {product.seller}
                    </a>
                    <span style={{ marginLeft: '5px', fontSize: '12px', color: '#007185' }}>🔗</span>
                  </div>

                  {/* Badges */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '4px 10px',
                      border: '2px solid rgb(201, 75, 159)',
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: '#000',
                      fontWeight: '500',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      Deployed on AWS
                    </span>
                    <span style={{
                      padding: '4px 10px',
                      border: '2px solid rgb(82, 143, 86)',
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: '#000',
                      fontWeight: '500',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      Free Trial
                    </span>
                    <span style={{
                      padding: '4px 10px',
                      border: '2px solid rgb(164, 184, 55)',
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: '#000',
                      fontWeight: '500',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      AWS Free Tier
                    </span>
                  </div>

                  {/* Short Description */}
                  <p style={{
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: '500',
                    color: '#0f141a',
                    lineHeight: '1.6',
                    margin: '0 0 12px 0',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    {product.shortDescription}
                  </p>

                  {/* Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {renderStars(product.rating)}
                    </div>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#0F1111',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      {product.rating}
                    </span>
                    <span style={{
                      fontSize: '13px',
                      color: '#007185',
                      fontFamily: 'DM Sans, sans-serif',
                      fontWeight: '600'
                    }}>
                      ({product.awsReviews}) {product.awsReviews} AWS review{product.awsReviews > 1 ? 's' : ''} |{' '}
                      {product.externalReviews} external review{product.externalReviews > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Action Buttons */}
            <div className="col-lg-4" style={{ marginTop: isTablet ? '20px' : '0' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <button style={{
                  padding: '12px 24px',
                  backgroundColor: '#FF9900',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#0F1111',
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#FA8900'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#FF9900'}
                >
                  View purchase options
                </button>

                <button style={{
                  padding: '12px 24px',
                  backgroundColor: 'white',
                  border: '1px solid #007185',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#007185',
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#F0F8FF'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                >
                  Try for free
                </button>

                <button style={{
                  padding: '12px 24px',
                  backgroundColor: 'white',
                  border: '1px solid #007185',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#007185',
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'background-color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#F0F8FF'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                >
                  Request private offer
                  <span style={{ fontSize: '12px' }}>🔗</span>
                </button>

                <button style={{
                  padding: '12px 24px',
                  backgroundColor: 'white',
                  border: '1px solid #007185',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#007185',
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'background-color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#F0F8FF'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                >
                  Request demo
                  <span style={{ fontSize: '12px' }}>🔗</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px 8px 0 0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            borderBottom: '1px solid #e7e7e7',
            position: 'relative',
            overflowX: 'auto',
            scrollbarWidth: 'thin'
          }}>
            {/* Left Arrow */}
            <button style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: '10px',
              color: '#232F3E',
              fontSize: '18px'
            }}>
              ‹
            </button>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0' }}>
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
                  style={{
                    padding: '16px 20px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: activeTab === tab.toLowerCase().replace(' ', '-') ? '#007185' : '#0F1111',
                    borderBottom: activeTab === tab.toLowerCase().replace(' ', '-') ? '3px solid #007185' : '3px solid transparent',
                    transition: 'all 0.2s',
                    fontFamily: 'DM Sans, sans-serif',
                    whiteSpace: 'nowrap',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab.toLowerCase().replace(' ', '-')) {
                      e.target.style.color = '#007185';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab.toLowerCase().replace(' ', '-')) {
                      e.target.style.color = '#0F1111';
                    }
                  }}
                >
                  {tab}
                  {tab === 'Product comparison' && (
                    <span style={{
                      position: 'absolute',
                      top: '8px',
                      right: '2px',
                      backgroundColor: '#007185',
                      color: 'white',
                      fontSize: '9px',
                      padding: '2px 4px',
                      borderRadius: '3px',
                      fontWeight: '600'
                    }}>
                      New
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Right Arrow */}
            <button style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: '10px',
              color: '#232F3E',
              fontSize: '18px'
            }}>
              ›
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0 0 8px 8px',
          padding: isMobile ? '15px' : '30px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          {activeTab === 'overview' && (
            <div>
              <h2 style={{
                fontSize: isMobile ? '20px' : '24px',
                fontWeight: '600',
                color: '#0F1111',
                marginBottom: '20px',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                Overview
              </h2>

              <div className="row" style={{ alignItems: isTablet ? 'flex-start' : 'stretch' }}>
                {/* Left Column - Video */}
                <div className="col-lg-6" style={{ display: 'flex', flexDirection: 'column', marginBottom: isTablet ? '20px' : '0' }}>
                  {/* Product Video */}
                <div style={{
                  position: 'relative',
                  width: isMobile ? '100%' : '85%',
                  paddingBottom: isMobile ? '56%' : '48%',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  marginBottom: '12px',
                  cursor: 'pointer',
                  border: '2px solid #e0e0e0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  flex: isTablet ? 'none' : 1
                }}>
                  <img
                    src={product.videoThumbnail}
                    alt="Product Video"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => { e.target.src = '/src/assets/imgs/page/homepage1/imgsp1.png'; }}
                  />
                  {/* Gradient Overlay */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)'
                  }}></div>
                  {/* Play Button Overlay */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90px',
                    height: '90px',
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '36px',
                    color: '#007185',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,1)';
                    e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.95)';
                    e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
                  }}
                  >
                    ▶
                  </div>
                  {/* Video Title Overlay */}
                  <div style={{
                    position: 'absolute',
                    top: isMobile ? '16px' : '24px',
                    left: isMobile ? '16px' : '24px',
                    color: 'white',
                    fontSize: isMobile ? '18px' : '28px',
                    fontWeight: '700',
                    textShadow: '0 3px 6px rgba(0,0,0,0.6)',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    What is Okta?
                  </div>
                </div>

                {/* Product Video Label */}
                <p style={{
                  fontSize: '14px',
                  color: '#565959',
                  marginBottom: '0',
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: '500',
                  fontStyle: 'italic'
                }}>
                  Product video
                </p>
              </div>

              {/* Right Column - Highlights and Details */}
              <div className="col-lg-6" style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Highlights */}
                <div style={{
                  flex: 1,
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  padding: '20px',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  marginBottom: '12px'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#0F1111',
                    marginBottom: '15px',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    Highlights
                  </h3>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    flex: 1
                  }}>
                    {product.highlights.map((highlight, index) => (
                      <li key={index} style={{
                        fontSize: '14px',
                        color: '#0F1111',
                        lineHeight: '1.6',
                        marginBottom: '12px',
                        paddingLeft: '20px',
                        position: 'relative',
                        fontFamily: 'DM Sans, sans-serif'
                      }}>
                        <span style={{
                          position: 'absolute',
                          left: 0,
                          top: '6px',
                          width: '6px',
                          height: '6px',
                          backgroundColor: '#0F1111',
                          borderRadius: '50%'
                        }}></span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Details */}
                <div style={{
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  padding: '18px',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#0F1111',
                    marginBottom: '14px',
                    fontFamily: 'DM Sans, sans-serif',
                    paddingBottom: '10px',
                    borderBottom: '2px solid #f0f0f0'
                  }}>
                    Details
                  </h3>

                  {/* Row 1: Sold by & Categories */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                    {/* Sold by */}
                    <div>
                      <div style={{
                        fontSize: '13px',
                        color: '#565959',
                        fontFamily: 'DM Sans, sans-serif',
                        fontWeight: '500',
                        marginBottom: '6px'
                      }}>
                        Sold by
                      </div>
                      <a href="#" style={{
                        fontSize: '14px',
                        color: '#007185',
                        textDecoration: 'none',
                        fontFamily: 'DM Sans, sans-serif',
                        fontWeight: '500',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
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
                        {product.seller}
                        <span style={{ fontSize: '11px' }}>🔗</span>
                      </a>
                    </div>

                    {/* Categories */}
                    <div>
                      <div style={{
                        fontSize: '13px',
                        color: '#565959',
                        marginBottom: '6px',
                        fontFamily: 'DM Sans, sans-serif',
                        fontWeight: '500'
                      }}>
                        Categories
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {['Security', 'Application Development', 'IT Support'].map((category, index) => (
                          <a
                            key={index}
                            href="#"
                            style={{
                              fontSize: '14px',
                              color: '#007185',
                              textDecoration: 'none',
                              fontFamily: 'DM Sans, sans-serif',
                              fontWeight: '500',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              width: 'fit-content'
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
                            {category}
                            <span style={{ fontSize: '11px' }}>🔗</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Delivery method & Deployed on AWS */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {/* Delivery method */}
                    <div>
                      <div style={{
                        fontSize: '13px',
                        color: '#565959',
                        fontFamily: 'DM Sans, sans-serif',
                        fontWeight: '500',
                        marginBottom: '6px'
                      }}>
                        Delivery method
                      </div>
                      <span style={{
                        fontSize: '14px',
                        color: '#0F1111',
                        fontFamily: 'DM Sans, sans-serif',
                        fontWeight: '500',
                        borderBottom: '1px dotted #565959',
                        display: 'inline-block'
                      }}>
                        Software as a Service (SaaS)
                      </span>
                    </div>

                    {/* Deployed on AWS */}
                    <div>
                      <div style={{
                        fontSize: '13px',
                        color: '#565959',
                        fontFamily: 'DM Sans, sans-serif',
                        fontWeight: '500',
                        marginBottom: '6px'
                      }}>
                        Deployed on AWS
                      </div>
                      <span style={{
                        fontSize: '14px',
                        color: '#0F1111',
                        fontFamily: 'DM Sans, sans-serif',
                        fontWeight: '500',
                        borderBottom: '1px dotted #565959',
                        display: 'inline-block'
                      }}>
                        Yes
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Width Description Section */}
            <div className="row mt-4">
              <div className="col-12">
                <div style={{
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  padding: isMobile ? '15px' : '20px',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  position: 'relative'
                }}>
                  <div style={{
                    fontSize: '14px',
                    color: '#0F1111',
                    lineHeight: '1.8',
                    fontFamily: 'DM Sans, sans-serif',
                    maxHeight: isDescriptionExpanded ? 'none' : '120px',
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease'
                  }}>
                    <p style={{ margin: 0 }}>{product.overview}</p>
                  </div>

                  {/* See More/Less Button */}
                  {product.overview && product.overview.length > 200 && (
                    <div style={{
                      marginTop: '12px',
                      paddingTop: '12px',
                      borderTop: '1px solid #e7e7e7'
                    }}>
                      <button
                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#007185',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontFamily: 'DM Sans, sans-serif',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: 0
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
                        {isDescriptionExpanded ? 'See less' : 'See more'}
                        <span style={{ fontSize: '12px' }}>
                          {isDescriptionExpanded ? '▲' : '▼'}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          )}

          {activeTab === 'features' && (
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#0F1111',
                marginBottom: '30px',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                Features and programs
              </h2>

              {/* Features Cards Grid */}
              <div className="row">
                {/* Trust Center Card */}
                <div className="col-lg-6 mb-4">
                  <div style={{
                    border: '1px solid #D5D9D9',
                    borderRadius: '8px',
                    padding: '24px',
                    height: '100%',
                    backgroundColor: 'white',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    {/* Title with Icon */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '16px'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#E8F5E9',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px'
                      }}>
                        🛡️
                      </div>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#0F1111',
                        margin: 0,
                        fontFamily: 'DM Sans, sans-serif'
                      }}>
                        Trust Center
                      </h3>
                    </div>

                    {/* Description */}
                    <p style={{
                      fontSize: '14px',
                      color: '#0F1111',
                      lineHeight: '1.6',
                      marginBottom: '20px',
                      fontFamily: 'DM Sans, sans-serif',
                      flex: 1
                    }}>
                      Access real-time vendor security and compliance information through their Trust Center powered by Drata. Review certifications and security standards before purchase.
                    </p>

                    {/* Button */}
                    <button style={{
                      padding: '10px 20px',
                      backgroundColor: 'white',
                      border: '1px solid #007185',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#007185',
                      cursor: 'pointer',
                      fontFamily: 'DM Sans, sans-serif',
                      transition: 'background-color 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#F0F8FF'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
                      View Trust Center
                      <span style={{ fontSize: '12px' }}>🔗</span>
                    </button>
                  </div>
                </div>

                {/* Buyer Guide Card */}
                <div className="col-lg-6 mb-4">
                  <div style={{
                    border: '1px solid #D5D9D9',
                    borderRadius: '8px',
                    padding: '24px',
                    height: '100%',
                    backgroundColor: 'white',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    {/* Title */}
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#0F1111',
                      marginBottom: '16px',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      Buyer guide
                    </h3>

                    {/* Description */}
                    <p style={{
                      fontSize: '14px',
                      color: '#0F1111',
                      lineHeight: '1.6',
                      marginBottom: '20px',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      Gain valuable insights from real users who purchased this product, powered by PeerSpot.
                    </p>

                    {/* Preview Image */}
                    <div style={{
                      marginBottom: '20px',
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#F7F8F8',
                      borderRadius: '8px',
                      padding: '20px',
                      minHeight: '150px'
                    }}>
                      <div style={{ position: 'relative', display: 'flex', gap: '10px' }}>
                        {/* Document preview illustration */}
                        <div style={{
                          width: '80px',
                          height: '100px',
                          backgroundColor: '#232F3E',
                          borderRadius: '4px',
                          padding: '10px',
                          color: 'white',
                          fontSize: '8px',
                          lineHeight: '1.2'
                        }}>
                          📄 Document
                        </div>
                        <div style={{
                          width: '80px',
                          height: '100px',
                          backgroundColor: 'white',
                          border: '1px solid #D5D9D9',
                          borderRadius: '4px',
                          padding: '10px',
                          fontSize: '8px',
                          lineHeight: '1.2'
                        }}>
                          📊 Charts
                        </div>
                        <div style={{
                          width: '80px',
                          height: '100px',
                          backgroundColor: 'white',
                          border: '1px solid #D5D9D9',
                          borderRadius: '4px',
                          padding: '10px',
                          fontSize: '8px',
                          lineHeight: '1.2'
                        }}>
                          📈 Data
                        </div>
                      </div>
                    </div>

                    {/* Button */}
                    <button style={{
                      padding: '10px 20px',
                      backgroundColor: 'white',
                      border: '1px solid #007185',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#007185',
                      cursor: 'pointer',
                      fontFamily: 'DM Sans, sans-serif',
                      transition: 'background-color 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#F0F8FF'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
                      Get the buyer guide
                      <span style={{ fontSize: '12px' }}>🔗</span>
                    </button>
                  </div>
                </div>

                {/* Financing Card */}
                <div className="col-lg-6 mb-4">
                  <div style={{
                    border: '1px solid #D5D9D9',
                    borderRadius: '8px',
                    padding: '24px',
                    height: '100%',
                    backgroundColor: 'white',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    {/* Title */}
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#0F1111',
                      marginBottom: '16px',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      Financing for AWS Marketplace purchases
                    </h3>

                    {/* Description */}
                    <p style={{
                      fontSize: '14px',
                      color: '#0F1111',
                      lineHeight: '1.6',
                      marginBottom: '20px',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      AWS Marketplace now accepts line of credit payments through the PNC Vendor Finance program. This program is available to select AWS customers in the US, excluding NV, NC, ND, TN, & VT.
                    </p>

                    {/* PNC Logo */}
                    <div style={{
                      marginBottom: '20px',
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      padding: '20px',
                      backgroundColor: '#F7F8F8',
                      borderRadius: '8px'
                    }}>
                      <div style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#0F1111',
                        fontFamily: 'Arial, sans-serif',
                        letterSpacing: '1px'
                      }}>
                        PNC | VENDOR FINANCE
                      </div>
                    </div>

                    {/* Button */}
                    <button style={{
                      padding: '10px 20px',
                      backgroundColor: 'white',
                      border: '1px solid #007185',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#007185',
                      cursor: 'pointer',
                      fontFamily: 'DM Sans, sans-serif',
                      transition: 'background-color 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#F0F8FF'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
                      View financing details
                      <span style={{ fontSize: '12px' }}>🔗</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div>
              <h2 style={{
                fontSize: isMobile ? '20px' : '24px',
                fontWeight: '600',
                color: '#0F1111',
                marginBottom: '30px',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                Pricing
              </h2>

              {/* Free Trial Section */}
              <div style={{
                border: '1px solid #D5D9D9',
                borderRadius: '8px',
                padding: isMobile ? '15px' : '20px',
                marginBottom: '20px',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'center',
                gap: isMobile ? '15px' : '0',
                backgroundColor: 'white'
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#0F1111',
                    marginBottom: '8px',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    Free trial
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#0F1111',
                    margin: 0,
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    Try this product free according to the free trial terms set by the vendor.
                  </p>
                </div>
                <button style={{
                  padding: '10px 24px',
                  backgroundColor: 'white',
                  border: '1px solid #007185',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#007185',
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'background-color 0.2s',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#F0F8FF'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                >
                  Try for free
                </button>
              </div>

              {/* Okta Platform Pricing Section */}
              <div style={{
                border: '1px solid #D5D9D9',
                borderRadius: '8px',
                padding: '24px',
                marginBottom: '20px',
                backgroundColor: 'white'
              }}>
                {/* Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '20px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <h3 style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#0F1111',
                        margin: 0,
                        fontFamily: 'DM Sans, sans-serif'
                      }}>
                        Okta Platform
                      </h3>
                      <a href="#" style={{
                        fontSize: '13px',
                        color: '#007185',
                        textDecoration: 'none',
                        fontFamily: 'DM Sans, sans-serif'
                      }}>
                        Info
                      </a>
                    </div>

                    <p style={{
                      fontSize: '14px',
                      color: '#0F1111',
                      lineHeight: '1.6',
                      marginBottom: '12px',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      Pricing is based on the duration and terms of your contract with the vendor. This entitles you to a specified quantity of use for the contract duration. If you choose not to renew or replace your contract before it ends, access to these entitlements will expire.
                    </p>

                    <p style={{
                      fontSize: '14px',
                      color: '#0F1111',
                      lineHeight: '1.6',
                      margin: 0,
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      Additional AWS infrastructure costs may apply. Use the{' '}
                      <a href="#" style={{
                        color: '#007185',
                        textDecoration: 'none'
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
                        AWS Pricing Calculator
                      </a>
                      {' '}to estimate your infrastructure costs.
                    </p>
                  </div>

                  <button style={{
                    padding: '10px 24px',
                    backgroundColor: 'white',
                    border: '1px solid #007185',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#007185',
                    cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif',
                    transition: 'background-color 0.2s',
                    whiteSpace: 'nowrap',
                    marginLeft: '20px'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#F0F8FF'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  >
                    View purchase options
                  </button>
                </div>

                {/* Contract Duration Tabs */}
                <div style={{
                  display: 'flex',
                  gap: '0',
                  borderBottom: '1px solid #D5D9D9',
                  marginBottom: '20px'
                }}>
                  {[
                    { duration: '12-month contract', discount: '' },
                    { duration: '24-month contract', discount: 'save up to 2%' },
                    { duration: '36-month contract', discount: 'save up to 4%' }
                  ].map((option, index) => (
                    <button
                      key={index}
                      style={{
                        padding: '12px 20px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        borderBottom: index === 0 ? '3px solid #007185' : '3px solid transparent',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: index === 0 ? '#007185' : '#0F1111',
                        fontFamily: 'DM Sans, sans-serif',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (index !== 0) e.target.style.color = '#007185';
                      }}
                      onMouseLeave={(e) => {
                        if (index !== 0) e.target.style.color = '#0F1111';
                      }}
                    >
                      {option.duration}
                      {option.discount && (
                        <span style={{
                          marginLeft: '6px',
                          color: '#067D62',
                          fontWeight: '600'
                        }}>
                          - {option.discount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Pricing Table Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '16px'
                }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0F1111',
                    margin: 0,
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    12-month contract (2)
                  </h4>
                  <a href="#" style={{
                    fontSize: '13px',
                    color: '#007185',
                    textDecoration: 'none',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    Info
                  </a>
                </div>

                {/* Pricing Table */}
                <div style={{
                  border: '1px solid #D5D9D9',
                  borderRadius: '8px',
                  overflow: isMobile ? 'auto' : 'hidden'
                }}>
                  {/* Table Header */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '150px 200px 120px' : '2fr 3fr 1.5fr',
                    backgroundColor: '#F7F8F8',
                    padding: isMobile ? '10px 12px' : '12px 16px',
                    borderBottom: '1px solid #D5D9D9',
                    fontWeight: '600',
                    fontSize: isMobile ? '12px' : '14px',
                    color: '#0F1111',
                    fontFamily: 'DM Sans, sans-serif',
                    minWidth: isMobile ? '470px' : 'auto'
                  }}>
                    <div>Dimension</div>
                    <div>Description</div>
                    <div>Cost/12 months</div>
                  </div>

                  {/* Table Rows */}
                  {[
                    {
                      dimension: 'Starter - 100 users',
                      description: 'Starting your Identity journey? Put a strong foundation in place.',
                      cost: '$7,200.00'
                    },
                    {
                      dimension: 'Essentials - 1,000 users',
                      description: 'Want to keep Identity at pace with growth? Get more must-haves',
                      cost: '$204,000.00'
                    }
                  ].map((row, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '150px 200px 120px' : '2fr 3fr 1.5fr',
                        padding: isMobile ? '12px' : '16px',
                        borderBottom: index < 1 ? '1px solid #D5D9D9' : 'none',
                        fontSize: isMobile ? '12px' : '14px',
                        color: '#0F1111',
                        fontFamily: 'DM Sans, sans-serif',
                        backgroundColor: 'white',
                        minWidth: isMobile ? '470px' : 'auto'
                      }}
                    >
                      <div style={{ fontWeight: '500' }}>{row.dimension}</div>
                      <div style={{ color: '#565959' }}>{row.description}</div>
                      <div style={{ fontWeight: '600' }}>{row.cost}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vendor Refund Policy Section */}
              <div style={{
                border: '1px solid #D5D9D9',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '20px',
                backgroundColor: 'white'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#0F1111',
                  marginBottom: '12px',
                  fontFamily: 'DM Sans, sans-serif'
                }}>
                  Vendor refund policy
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#0F1111',
                  lineHeight: '1.6',
                  margin: 0,
                  fontFamily: 'DM Sans, sans-serif'
                }}>
                  All orders are non-cancellable and all fees and other amounts that you pay are non-refundable. If you have purchased a multi-year subscription, you agree to pay the annual fees due for each year of the multi-year subscription term.
                </p>
              </div>

              {/* Custom Pricing Options Section */}
              <div style={{
                border: '1px solid #D5D9D9',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#0F1111',
                    marginBottom: '8px',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    Custom pricing options
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#0F1111',
                    margin: 0,
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    Request a private offer to receive a custom quote.
                  </p>
                </div>
                <button style={{
                  padding: '10px 24px',
                  backgroundColor: 'white',
                  border: '1px solid #007185',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#007185',
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'background-color 0.2s',
                  whiteSpace: 'nowrap',
                  marginLeft: '20px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#F0F8FF'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                >
                  Request private offer
                </button>
              </div>
            </div>
          )}

          {activeTab === 'legal' && (
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#0F1111',
                marginBottom: '30px',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                Legal
              </h2>

              {/* Vendor Terms and Conditions */}
              <div style={{
                border: '1px solid #D5D9D9',
                borderRadius: '8px',
                padding: '24px',
                marginBottom: '20px',
                backgroundColor: 'white'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#0F1111',
                  marginBottom: '12px',
                  fontFamily: 'DM Sans, sans-serif'
                }}>
                  Vendor terms and conditions
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#0F1111',
                  lineHeight: '1.6',
                  margin: 0,
                  fontFamily: 'DM Sans, sans-serif'
                }}>
                  Upon subscribing to this product, you must acknowledge and agree to the terms and conditions outlined in the vendor's{' '}
                  <a href="#" style={{
                    color: '#007185',
                    textDecoration: 'none'
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
                    End User License Agreement (EULA)
                  </a>
                  <span style={{ marginLeft: '4px', fontSize: '12px', color: '#007185' }}>🔗</span>.
                </p>
              </div>

              {/* Content Disclaimer */}
              <div style={{
                border: '1px solid #D5D9D9',
                borderRadius: '8px',
                padding: '24px',
                backgroundColor: 'white'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#0F1111',
                  marginBottom: '12px',
                  fontFamily: 'DM Sans, sans-serif'
                }}>
                  Content disclaimer
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#0F1111',
                  lineHeight: '1.6',
                  margin: 0,
                  fontFamily: 'DM Sans, sans-serif'
                }}>
                  Vendors are responsible for their product descriptions and other product content. AWS does not warrant that vendors' product descriptions or other product content are accurate, complete, reliable, current, or error-free.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'usage' && (
            <div>
              {/* Header with Request Demo Button */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#0F1111',
                    margin: 0,
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    Usage information
                  </h2>
                  <a href="#" style={{
                    fontSize: '13px',
                    color: '#007185',
                    textDecoration: 'none',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    Info
                  </a>
                </div>

                <button style={{
                  padding: '10px 24px',
                  backgroundColor: 'white',
                  border: '1px solid #007185',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#007185',
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'background-color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#F0F8FF'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                >
                  Request demo
                  <span style={{ fontSize: '12px' }}>🔗</span>
                </button>
              </div>

              {/* Delivery Details Card */}
              <div style={{
                border: '1px solid #D5D9D9',
                borderRadius: '8px',
                padding: '24px',
                backgroundColor: 'white'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#0F1111',
                  marginBottom: '16px',
                  fontFamily: 'DM Sans, sans-serif'
                }}>
                  Delivery details
                </h3>

                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#0F1111',
                  marginBottom: '12px',
                  fontFamily: 'DM Sans, sans-serif'
                }}>
                  Software as a Service (SaaS)
                </h4>

                <p style={{
                  fontSize: '14px',
                  color: '#0F1111',
                  lineHeight: '1.6',
                  margin: 0,
                  fontFamily: 'DM Sans, sans-serif'
                }}>
                  SaaS delivers cloud-based software applications directly to customers over the internet. You can access these applications through a subscription model. You will pay recurring monthly usage fees through your AWS bill, while AWS handles deployment and infrastructure management, ensuring scalability, reliability, and seamless integration with other AWS services.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#0F1111',
                marginBottom: '30px',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                Resources
              </h2>

              {/* Vendor Resources Card */}
              <div style={{
                border: '1px solid #D5D9D9',
                borderRadius: '8px',
                backgroundColor: 'white',
                overflow: 'hidden'
              }}>
                {/* Card Title */}
                <div style={{
                  padding: '20px 24px',
                  borderBottom: '1px solid #D5D9D9'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#0F1111',
                    margin: 0,
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    Vendor resources
                  </h3>
                </div>

                {/* Tabs */}
                <div style={{
                  display: 'flex',
                  borderBottom: '1px solid #D5D9D9',
                  padding: '0 24px'
                }}>
                  <button
                    style={{
                      padding: '12px 0',
                      marginRight: '24px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      borderBottom: '3px solid #007185',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#007185',
                      fontFamily: 'DM Sans, sans-serif'
                    }}
                  >
                    Links
                  </button>
                  <span style={{
                    borderLeft: '1px solid #D5D9D9',
                    height: '40px',
                    alignSelf: 'center'
                  }}></span>
                  <button
                    style={{
                      padding: '12px 0',
                      marginLeft: '24px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      borderBottom: '3px solid transparent',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#0F1111',
                      fontFamily: 'DM Sans, sans-serif',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#007185'}
                    onMouseLeave={(e) => e.target.style.color = '#0F1111'}
                  >
                    Videos
                  </button>
                </div>

                {/* Links Content */}
                <div style={{ padding: '24px' }}>
                  {/* Link 1 */}
                  <div style={{ marginBottom: '16px' }}>
                    <a
                      href="#"
                      style={{
                        fontSize: '14px',
                        color: '#007185',
                        textDecoration: 'none',
                        fontFamily: 'DM Sans, sans-serif',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
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
                      Customer Success Data Sheet
                      <span style={{ fontSize: '12px' }}>🔗</span>
                    </a>
                  </div>

                  {/* Link 2 */}
                  <div>
                    <a
                      href="#"
                      style={{
                        fontSize: '14px',
                        color: '#007185',
                        textDecoration: 'none',
                        fontFamily: 'DM Sans, sans-serif',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
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
                      Okta Community Support
                      <span style={{ fontSize: '12px' }}>🔗</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#0F1111',
                marginBottom: '30px',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                Support
              </h2>

              <div className="row">
                {/* Vendor Support Card */}
                <div className="col-lg-6 mb-4">
                  <div style={{
                    border: '1px solid #D5D9D9',
                    borderRadius: '8px',
                    padding: '24px',
                    backgroundColor: 'white',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#0F1111',
                      marginBottom: '16px',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      Vendor support
                    </h3>

                    <p style={{
                      fontSize: '14px',
                      color: '#0F1111',
                      lineHeight: '1.6',
                      marginBottom: '16px',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      Through our expert teams and robust digital resources, we ensure you can always access urgent and proactive support, whenever and however you need it, anywhere in the world. Access the Okta Community to get help, engage with us and your peers, submit product requests, and access the key resources you need to drive success. We offer support packages that are aligned to your requirements to give you the power of choice.
                    </p>

                    <div style={{
                      fontSize: '14px',
                      color: '#0F1111',
                      lineHeight: '1.6',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      <p style={{ marginBottom: '12px' }}>
                        For additional information please visit{' '}
                        <a
                          href="https://support.okta.com/help"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#007185',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
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
                          https://support.okta.com/help
                          <span style={{ fontSize: '12px' }}>🔗</span>
                        </a>.
                      </p>

                      <p style={{ margin: 0 }}>
                        You can also email{' '}
                        <a
                          href="mailto:support@okta.com"
                          style={{
                            color: '#007185',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
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
                          support@okta.com
                          <span style={{ fontSize: '12px' }}>🔗</span>
                        </a>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* AWS Infrastructure Support Card */}
                <div className="col-lg-6 mb-4">
                  <div style={{
                    border: '1px solid #D5D9D9',
                    borderRadius: '8px',
                    padding: '24px',
                    backgroundColor: 'white',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#0F1111',
                      marginBottom: '16px',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      AWS infrastructure support
                    </h3>

                    <p style={{
                      fontSize: '14px',
                      color: '#0F1111',
                      lineHeight: '1.6',
                      marginBottom: '20px',
                      fontFamily: 'DM Sans, sans-serif',
                      flex: 1
                    }}>
                      AWS Support is a one-on-one, fast-response support channel that is staffed 24x7x365 with experienced and technical support engineers. The service helps customers of all sizes and technical abilities to successfully utilize the products and features provided by Amazon Web Services.
                    </p>

                    <button style={{
                      padding: '10px 24px',
                      backgroundColor: 'white',
                      border: '1px solid #007185',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#007185',
                      cursor: 'pointer',
                      fontFamily: 'DM Sans, sans-serif',
                      transition: 'background-color 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      alignSelf: 'flex-start'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#F0F8FF'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
                      Get support
                      <span style={{ fontSize: '12px' }}>🔗</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'product-comparison' && (
            <div>
              {/* Header with Buttons */}
              <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'center',
                marginBottom: '30px',
                gap: isMobile ? '15px' : '0'
              }}>
                <div>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#0F1111',
                    margin: '0 0 4px 0',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    Product comparison
                  </h2>
                  <p style={{
                    fontSize: '13px',
                    color: '#565959',
                    margin: 0,
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    Updated weekly
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button style={{
                    padding: '8px 16px',
                    backgroundColor: 'white',
                    border: '1px solid #D5D9D9',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#0F1111',
                    cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#F7F8F8'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  >
                    Edit products
                  </button>

                  <button style={{
                    padding: '8px 16px',
                    backgroundColor: 'white',
                    border: '1px solid #D5D9D9',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#0F1111',
                    cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#F7F8F8'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  >
                    Download CSV
                  </button>
                </div>
              </div>

              {/* Comparison Table */}
              <div style={{
                border: '1px solid #D5D9D9',
                borderRadius: '8px',
                backgroundColor: 'white',
                overflow: isMobile ? 'auto' : 'hidden'
              }}>
                {/* Product Headers */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '150px 200px 200px 200px' : '250px 1fr 1fr 1fr',
                  borderBottom: '1px solid #D5D9D9',
                  backgroundColor: '#F7F8F8',
                  minWidth: isMobile ? '750px' : 'auto'
                }}>
                  <div style={{ padding: '20px' }}></div>
                  {/* Product 1 */}
                  <div style={{ padding: '20px', borderLeft: '1px solid #D5D9D9' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '8px'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#000',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        color: 'white'
                      }}>
                        okta
                      </div>
                      <div>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#0F1111',
                          fontFamily: 'DM Sans, sans-serif'
                        }}>
                          Okta Platform
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#565959',
                          fontFamily: 'DM Sans, sans-serif'
                        }}>
                          by Okta, Inc.
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Product 2 */}
                  <div style={{ padding: '20px', borderLeft: '1px solid #D5D9D9' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '8px'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#4A90E2',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        color: 'white'
                      }}>
                        1L
                      </div>
                      <div>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#0F1111',
                          fontFamily: 'DM Sans, sans-serif'
                        }}>
                          OneLogin Workforce Identity
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#565959',
                          fontFamily: 'DM Sans, sans-serif'
                        }}>
                          by OneLogin
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Product 3 */}
                  <div style={{ padding: '20px', borderLeft: '1px solid #D5D9D9' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '8px'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#E53935',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        color: 'white'
                      }}>
                        CA
                      </div>
                      <div>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#0F1111',
                          fontFamily: 'DM Sans, sans-serif'
                        }}>
                          CyberArk Workforce Identity
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#565959',
                          fontFamily: 'DM Sans, sans-serif'
                        }}>
                          by CyberArk
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accolades Section */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '150px 200px 200px 200px' : '250px 1fr 1fr 1fr',
                  minWidth: isMobile ? '750px' : 'auto',
                  borderBottom: '1px solid #D5D9D9'
                }}>
                  <div style={{
                    padding: '20px',
                    backgroundColor: '#F7F8F8',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#0F1111',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    Accolades
                  </div>
                  <div style={{ padding: '20px', borderLeft: '1px solid #D5D9D9' }}>
                    <div style={{
                      fontSize: '13px',
                      color: '#0F1111',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>Top 10</div>
                      <div style={{ color: '#565959' }}>in Infrastructure as Code, Application Development, Security</div>
                    </div>
                  </div>
                  <div style={{ padding: '20px', borderLeft: '1px solid #D5D9D9' }}>
                    <div style={{
                      fontSize: '13px',
                      color: '#0F1111',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>Top 100</div>
                      <div style={{ color: '#565959' }}>in Applications</div>
                    </div>
                  </div>
                  <div style={{ padding: '20px', borderLeft: '1px solid #D5D9D9' }}>
                    <div style={{
                      fontSize: '13px',
                      color: '#0F1111',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>Top 100</div>
                      <div style={{ color: '#565959' }}>in Security</div>
                    </div>
                  </div>
                </div>

                {/* Customer Reviews Section Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '150px 200px 200px 200px' : '250px 1fr 1fr 1fr',
                  minWidth: isMobile ? '750px' : 'auto',
                  borderBottom: '1px solid #D5D9D9',
                  backgroundColor: '#F7F8F8'
                }}>
                  <div style={{
                    padding: '20px',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#0F1111',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    Customer reviews
                  </div>
                  <div style={{ padding: '20px', borderLeft: '1px solid #D5D9D9' }} colSpan="3"></div>
                </div>

                {/* Sentiment Note */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '150px 1fr' : '250px 1fr',
                  minWidth: isMobile ? '750px' : 'auto',
                  borderBottom: '1px solid #D5D9D9',
                  backgroundColor: 'white'
                }}>
                  <div style={{ padding: '12px 20px' }}>
                    <div style={{
                      fontSize: '12px',
                      color: '#565959',
                      fontFamily: 'DM Sans, sans-serif',
                      marginBottom: '8px'
                    }}>
                      Sentiment is AI generated from actual customer reviews on G2 and G2.
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: '#565959' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '12px', height: '12px', backgroundColor: '#4CAF50', borderRadius: '2px', display: 'inline-block' }}></span>
                        Positive review
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '12px', height: '12px', backgroundColor: '#FFC107', borderRadius: '2px', display: 'inline-block' }}></span>
                        Mixed review
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '12px', height: '12px', backgroundColor: '#F44336', borderRadius: '2px', display: 'inline-block' }}></span>
                        Negative review
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '12px 20px', borderLeft: '1px solid #D5D9D9' }}></div>
                </div>

                {/* Reviews Count */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '150px 200px 200px 200px' : '250px 1fr 1fr 1fr',
                  minWidth: isMobile ? '750px' : 'auto',
                  borderBottom: '1px solid #D5D9D9'
                }}>
                  <div style={{
                    padding: '16px 20px',
                    fontWeight: '500',
                    fontSize: '13px',
                    color: '#0F1111',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    Reviews
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>500 reviews</div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>8 reviews</div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>108 reviews</div>
                </div>

                {/* Functionality */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '150px 200px 200px 200px' : '250px 1fr 1fr 1fr',
                  minWidth: isMobile ? '750px' : 'auto',
                  borderBottom: '1px solid #D5D9D9'
                }}>
                  <div style={{
                    padding: '16px 20px',
                    fontWeight: '500',
                    fontSize: '13px',
                    color: '#0F1111',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    Functionality
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9' }}>
                    <div style={{ fontSize: '13px', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>Positive</div>
                    <div style={{ height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '85%', height: '100%', backgroundColor: '#4CAF50' }}></div>
                    </div>
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9' }}>
                    <div style={{ fontSize: '13px', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>Positive</div>
                    <div style={{ height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '80%', height: '100%', backgroundColor: '#4CAF50' }}></div>
                    </div>
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9' }}>
                    <div style={{ fontSize: '13px', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>Positive</div>
                    <div style={{ height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '82%', height: '100%', backgroundColor: '#4CAF50' }}></div>
                    </div>
                  </div>
                </div>

                {/* Ease of use */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '150px 200px 200px 200px' : '250px 1fr 1fr 1fr',
                  minWidth: isMobile ? '750px' : 'auto',
                  borderBottom: '1px solid #D5D9D9'
                }}>
                  <div style={{
                    padding: '16px 20px',
                    fontWeight: '500',
                    fontSize: '13px',
                    color: '#0F1111',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    Ease of use
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9' }}>
                    <div style={{ fontSize: '13px', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>Positive</div>
                    <div style={{ height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '78%', height: '100%', backgroundColor: '#4CAF50' }}></div>
                    </div>
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9' }}>
                    <div style={{ fontSize: '13px', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>Positive</div>
                    <div style={{ height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '75%', height: '100%', backgroundColor: '#4CAF50' }}></div>
                    </div>
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9' }}>
                    <div style={{ fontSize: '13px', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>Positive</div>
                    <div style={{ height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '80%', height: '100%', backgroundColor: '#4CAF50' }}></div>
                    </div>
                  </div>
                </div>

                {/* Customer service */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '150px 200px 200px 200px' : '250px 1fr 1fr 1fr',
                  minWidth: isMobile ? '750px' : 'auto',
                  borderBottom: '1px solid #D5D9D9'
                }}>
                  <div style={{
                    padding: '16px 20px',
                    fontWeight: '500',
                    fontSize: '13px',
                    color: '#0F1111',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    Customer service
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9' }}>
                    <div style={{ fontSize: '13px', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>Mixed</div>
                    <div style={{ height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                      <div style={{ width: '45%', height: '100%', backgroundColor: '#4CAF50' }}></div>
                      <div style={{ width: '35%', height: '100%', backgroundColor: '#FFC107' }}></div>
                      <div style={{ width: '20%', height: '100%', backgroundColor: '#F44336' }}></div>
                    </div>
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9' }}>
                    <div style={{ fontSize: '13px', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>Mixed</div>
                    <div style={{ height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                      <div style={{ width: '40%', height: '100%', backgroundColor: '#4CAF50' }}></div>
                      <div style={{ width: '40%', height: '100%', backgroundColor: '#FFC107' }}></div>
                      <div style={{ width: '20%', height: '100%', backgroundColor: '#F44336' }}></div>
                    </div>
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9' }}>
                    <div style={{ fontSize: '13px', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>Positive</div>
                    <div style={{ height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '77%', height: '100%', backgroundColor: '#4CAF50' }}></div>
                    </div>
                  </div>
                </div>

                {/* Cost effectiveness */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '150px 200px 200px 200px' : '250px 1fr 1fr 1fr',
                  minWidth: isMobile ? '750px' : 'auto',
                  borderBottom: '1px solid #D5D9D9'
                }}>
                  <div style={{
                    padding: '16px 20px',
                    fontWeight: '500',
                    fontSize: '13px',
                    color: '#0F1111',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    Cost effectiveness
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9' }}>
                    <div style={{ fontSize: '13px', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>Negative</div>
                    <div style={{ height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                      <div style={{ width: '25%', height: '100%', backgroundColor: '#4CAF50' }}></div>
                      <div style={{ width: '25%', height: '100%', backgroundColor: '#FFC107' }}></div>
                      <div style={{ width: '50%', height: '100%', backgroundColor: '#F44336' }}></div>
                    </div>
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9' }}>
                    <div style={{ fontSize: '13px', color: '#565959', fontFamily: 'DM Sans, sans-serif' }}>Insufficient data</div>
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9' }}>
                    <div style={{ fontSize: '13px', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>Mixed</div>
                    <div style={{ height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                      <div style={{ width: '40%', height: '100%', backgroundColor: '#4CAF50' }}></div>
                      <div style={{ width: '35%', height: '100%', backgroundColor: '#FFC107' }}></div>
                      <div style={{ width: '25%', height: '100%', backgroundColor: '#F44336' }}></div>
                    </div>
                  </div>
                </div>

                {/* Overview Section Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '150px 200px 200px 200px' : '250px 1fr 1fr 1fr',
                  minWidth: isMobile ? '750px' : 'auto',
                  borderBottom: '1px solid #D5D9D9',
                  backgroundColor: '#F7F8F8'
                }}>
                  <div style={{
                    padding: '20px',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#0F1111',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    Overview
                    <div style={{
                      fontSize: '11px',
                      fontWeight: '400',
                      color: '#565959',
                      marginTop: '4px'
                    }}>
                      AI generated from product descriptions
                    </div>
                  </div>
                  <div style={{ padding: '20px', borderLeft: '1px solid #D5D9D9' }} colSpan="3"></div>
                </div>

                {/* Overview Details - Identity Management */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '150px 200px 200px 200px' : '250px 1fr 1fr 1fr',
                  minWidth: isMobile ? '750px' : 'auto',
                  borderBottom: '1px solid #D5D9D9'
                }}>
                  <div style={{
                    padding: '16px 20px',
                    fontWeight: '500',
                    fontSize: '13px',
                    color: '#0F1111',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    Identity Management
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9', fontSize: '13px', color: '#0F1111', lineHeight: '1.5', fontFamily: 'DM Sans, sans-serif' }}>
                    Unified identity security platform with comprehensive user lifecycle management across applications and devices.
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9', fontSize: '13px', color: '#0F1111', lineHeight: '1.5', fontFamily: 'DM Sans, sans-serif' }}>
                    —
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9', fontSize: '13px', color: '#0F1111', lineHeight: '1.5', fontFamily: 'DM Sans, sans-serif' }}>
                    —
                  </div>
                </div>

                {/* Authentication Mechanism */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '150px 200px 200px 200px' : '250px 1fr 1fr 1fr',
                  minWidth: isMobile ? '750px' : 'auto',
                  borderBottom: '1px solid #D5D9D9'
                }}>
                  <div style={{
                    padding: '16px 20px',
                    fontWeight: '500',
                    fontSize: '13px',
                    color: '#0F1111',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    Authentication Mechanism
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9', fontSize: '13px', color: '#0F1111', lineHeight: '1.5', fontFamily: 'DM Sans, sans-serif' }}>
                    Adaptive multi-factor authentication with intelligent, phishing-resistant capabilities.
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9', fontSize: '13px', color: '#0F1111', lineHeight: '1.5', fontFamily: 'DM Sans, sans-serif' }}>
                    —
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9', fontSize: '13px', color: '#0F1111', lineHeight: '1.5', fontFamily: 'DM Sans, sans-serif' }}>
                    —
                  </div>
                </div>

                {/* More rows can be added here following the same pattern */}

                {/* Contract Section Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '150px 200px 200px 200px' : '250px 1fr 1fr 1fr',
                  minWidth: isMobile ? '750px' : 'auto',
                  borderBottom: '1px solid #D5D9D9',
                  backgroundColor: '#F7F8F8'
                }}>
                  <div style={{
                    padding: '20px',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#0F1111',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    Contract
                  </div>
                  <div style={{ padding: '20px', borderLeft: '1px solid #D5D9D9' }} colSpan="3"></div>
                </div>

                {/* Standard contract */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '250px 1fr 1fr 1fr'
                }}>
                  <div style={{
                    padding: '16px 20px',
                    fontWeight: '500',
                    fontSize: '13px',
                    color: '#0F1111',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    Standard contract
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>No</div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>No</div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>No</div>
                </div>
              </div>

              {/* Show Less Link */}
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <a href="#" style={{
                  fontSize: '14px',
                  color: '#007185',
                  textDecoration: 'none',
                  fontFamily: 'DM Sans, sans-serif'
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
                  Show less
                </a>
              </div>
            </div>
          )}

          {/* Add more tab content as needed */}
        </div>
      </div>
    </main>
  );
};

export default MarketplaceProductDetail;

