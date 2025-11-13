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
    overview: 'Okta Workforce Identity delivers a unified identity security platform that protects customer environments before, during, and after authentication and with continuous assessment of user and session risk. By offering an integrated and multi-layer security approach that enables you to view, monitor, and respond to threats in real-time, Okta helps you protect your workforce and your business,Okta Workforce Identity delivers a unified identity security platform that protects customer environments before, during, and after authentication and with continuous assessment of user and session risk. By offering an integrated and multi-layer security approach that enables you to view, monitor, and respond to threats in real-time, Okta helps you protect your workforce and your business,Okta Workforce Identity delivers a unified identity security platform that protects customer environments before, during, and after authentication and with continuous assessment of user and session risk. By offering an integrated and multi-layer security approach that enables you to view, monitor, and respond to threats in real-time, Okta helps you protect your workforce and your business.',
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

  // Update document title when product loads
  useEffect(() => {
    if (product) {
      document.title = `${product.name} - AI Marketplace - VCloud Tech`;
    }
  }, [product]);

  // Scroll Spy: Update active tab based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = tabs.map(tab => ({
        id: tab.toLowerCase().replace(' ', '-'),
        element: document.getElementById(tab.toLowerCase().replace(' ', '-'))
      }));

      const scrollPosition = window.scrollY + 200; // Offset for better detection

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element && section.element.offsetTop <= scrollPosition) {
          setActiveTab(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle tab click - scroll to section
  const handleTabClick = (tab) => {
    const sectionId = tab.toLowerCase().replace(' ', '-');
    const element = document.getElementById(sectionId);
    
    if (element) {
      const offsetTop = element.offsetTop - 100; // Offset for header
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    
    setActiveTab(sectionId);
  };

  const tabs = [
    'Overview',
    'Features',
    'Resources',
    'Support',
    'Product comparison',
    'Pricing'
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
    <main className="main" style={{ paddingTop: '70px', backgroundColor: 'white' }}>
      <div className="container-fluid" style={{ padding: isMobile ? '0 15px' : '0 40px' }}>
        {/* Product Header - Design 1: Clean & Professional */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: isMobile ? '20px' : '35px',
          marginBottom: '25px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          border: '1px solid #E5E7EB'
        }}>
          <div className="row">
            {/* Left - Product Info */}
            <div className="col-lg-8">
              <div style={{ display: 'flex', gap: isMobile ? '15px' : '25px', alignItems: 'flex-start' }}>
                {/* Logo - Clean Gray Box */}
                <div style={{
                  width: isMobile ? '70px' : '95px',
                  height: isMobile ? '70px' : '95px',
                  flexShrink: 0,
                  backgroundColor: '#F3F4F6',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px',
                  border: '2px solid #E5E7EB'
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
                    <h1 style={{
                    fontSize: isMobile ? '22px' : '30px',
                    fontWeight: '700',
                    color: '#16191f',
                    margin: '0 0 16px 0',
                    fontFamily: 'inherit',
                    lineHeight: '1.2'
                    }}>
                      {product.name}
                    </h1>

                  {/* Badges - Soft Colors */}
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '6px 14px',
                      backgroundColor: '#FEF3F2',
                      border: '1px solid #FEE2E2',
                      borderRadius: '6px',
                      fontSize: '13px',
                      color: '#991B1B',
                      fontWeight: '600',
                      fontFamily: 'inherit'
                    }}>
                      ☁️ Deployed on AWS
                    </span>
                    <span style={{
                      padding: '6px 14px',
                      backgroundColor: '#F0FDF4',
                      border: '1px solid #DCFCE7',
                      borderRadius: '6px',
                      fontSize: '13px',
                      color: '#166534',
                      fontWeight: '600',
                      fontFamily: 'inherit'
                    }}>
                      🎁 Free Trial
                    </span>
                    <span style={{
                      padding: '6px 14px',
                      backgroundColor: '#FEF9C3',
                      border: '1px solid #FEF08A',
                      borderRadius: '6px',
                      fontSize: '13px',
                      color: '#854D0E',
                      fontWeight: '600',
                      fontFamily: 'inherit'
                    }}>
                      ⚡ AWS Free Tier
                    </span>
                  </div>

                  {/* Description */}
                  <p style={{
                    fontSize: '15px',
                    fontWeight: '400',
                    color: '#16191f',
                    lineHeight: '1.7',
                    margin: '0 0 14px 0',
                    fontFamily: 'inherit'
                  }}>
                    {product.shortDescription}
                  </p>

                  {/* Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '3px' }}>
                      {renderStars(product.rating)}
                    </div>
                    <span style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#16191f',
                      fontFamily: 'inherit'
                    }}>
                      {product.rating}
                    </span>
                    <span style={{
                      fontSize: '14px',
                      color: '#16191f',
                      fontFamily: 'inherit'
                    }}>
                      ({product.awsReviews + product.externalReviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Action Buttons */}
            <div className="col-lg-4" style={{ marginTop: isTablet ? '25px' : '0' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <button style={{
                  padding: '14px 28px',
                  backgroundColor: '#111A45',
                  border: 'none',
                  borderRadius: '25px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: 'white',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(17, 26, 69, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#0D1433';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(17, 26, 69, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#111A45';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(17, 26, 69, 0.2)';
                }}
                >
                  View Purchase Options
                </button>

                <button style={{
                  padding: '14px 28px',
                  backgroundColor: 'white',
                  border: '2px solid #111A45',
                  borderRadius: '25px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#16191f',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#111A45';
                  e.target.style.color = 'white';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.color = '#16191f';
                  e.target.style.transform = 'translateY(0)';
                }}
                >
                  Try for Free
                </button>

                <button style={{
                  padding: '14px 28px',
                  backgroundColor: 'white',
                  border: '2px solid #6B7280',
                  borderRadius: '25px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#16191f',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#111A45';
                  e.target.style.color = '#16191f';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#6B7280';
                  e.target.style.color = '#16191f';
                  e.target.style.transform = 'translateY(0)';
                }}
                >
                  Request Demo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation - Button/Pills Style - STICKY */}
        <div style={{
          position: 'sticky',
          top: '70px',
          zIndex: 100,
          backgroundColor: '#F9FAFB',
          borderRadius: '12px',
          padding: '12px 20px',
          marginBottom: '25px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          overflowX: 'auto',
          scrollbarWidth: 'thin'
        }}>
          <div style={{
            display: 'flex',
            gap: '10px',
            flexWrap: isMobile ? 'nowrap' : 'wrap'
          }}>
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.toLowerCase().replace(' ', '-');
              return (
                <button
                  key={index}
                  onClick={() => handleTabClick(tab)}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    backgroundColor: isActive ? '#111A45' : 'white',
                    color: isActive ? 'white' : '#16191f',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: '600',
                    fontFamily: 'inherit',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.3s ease',
                    boxShadow: isActive ? '0 4px 12px rgba(17, 26, 69, 0.3)' : '0 1px 3px rgba(0,0,0,0.08)',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = '#E5E7EB';
                      e.target.style.color = '#16191f';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.color = '#16191f';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
                    }
                  }}
                >
                  {tab}
                  {tab === 'Product comparison' && (
                    <span style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      backgroundColor: '#df2020',
                      color: 'white',
                      fontSize: '9px',
                      padding: '3px 6px',
                      borderRadius: '10px',
                      fontWeight: '700',
                      boxShadow: '0 2px 6px rgba(223, 32, 32, 0.4)'
                    }}>
                      NEW
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Container - All Sections Visible for Scroll */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: isMobile ? '25px' : '35px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          border: '1px solid #E5E7EB'
        }}>
          {/* Overview Section */}
          <div id="overview" style={{ scrollMarginTop: '120px' }}>
              <h2 style={{
                fontSize: isMobile ? '20px' : '24px',
                fontWeight: '600',
                color: '#16191f',
                marginBottom: '20px',
                fontFamily: 'inherit'
              }}>
                Overview
              </h2>

              <div className="row" style={{ alignItems: isTablet ? 'flex-start' : 'stretch' }}>
                {/* Left Column - Video - COMMENTED OUT */}
                {/* <div className="col-lg-6" style={{ display: 'flex', flexDirection: 'column', marginBottom: isTablet ? '20px' : '0' }}>
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
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)'
                  }}></div>
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
                  <div style={{
                    position: 'absolute',
                    top: isMobile ? '16px' : '24px',
                    left: isMobile ? '16px' : '24px',
                    color: 'white',
                    fontSize: isMobile ? '18px' : '28px',
                    fontWeight: '700',
                    textShadow: '0 3px 6px rgba(0,0,0,0.6)',
                      fontFamily: 'inherit'
                  }}>
                    What is Okta?
                  </div>
                </div>
                <p style={{
                  fontSize: '14px',
                    color: '#16191f',
                  marginBottom: '0',
                    fontFamily: 'inherit',
                    fontWeight: '400',
                  fontStyle: 'italic'
                }}>
                  Product video
                </p>
                </div> */}

              {/* Highlights Column */}
              <div className="col-lg-6" style={{ marginBottom: isMobile ? '20px' : '0' }}>
                <div style={{
                  border: '1px solid #D5D9D9',
                  borderRadius: '8px',
                  padding: '24px',
                  backgroundColor: 'white',
                  height: '100%',
                  overflow: 'hidden'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#16191f',
                    marginBottom: '16px',
                    fontFamily: 'inherit'
                  }}>
                    ✨ Key Highlights
                  </h3>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                  }}>
                    {product.highlights.map((highlight, index) => (
                      <li key={index} style={{
                        fontSize: '15px',
                        color: '#16191f',
                        lineHeight: '1.7',
                        marginBottom: '15px',
                        paddingLeft: '25px',
                        position: 'relative',
                        fontFamily: 'inherit'
                      }}>
                        <span style={{
                          position: 'absolute',
                          left: 0,
                          top: '8px',
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#111A45',
                          borderRadius: '50%'
                        }}></span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
                </div>

              {/* Details Column */}
              <div className="col-lg-6">
                <div style={{
                  border: '1px solid #D5D9D9',
                  borderRadius: '8px',
                  padding: '24px',
                  backgroundColor: 'white',
                  height: '100%',
                  overflow: 'hidden'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#16191f',
                    marginBottom: '16px',
                    fontFamily: 'inherit'
                  }}>
                    Details
                  </h3>

                  {/* Row 1: Sold by & Categories */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
                    {/* Sold by */}
                    <div>
                      <div style={{
                        fontSize: '14px',
                        color: '#16191f',
                        fontFamily: 'inherit',
                        fontWeight: '600',
                        marginBottom: '8px'
                      }}>
                        Sold by
                      </div>
                      <div style={{
                        fontSize: '15px',
                        color: '#16191f',
                        fontFamily: 'inherit',
                        fontWeight: '600'
                      }}>
                        {product.seller}
                      </div>
                    </div>

                    {/* Categories */}
                    <div>
                      <div style={{
                        fontSize: '13px',
                        color: '#16191f',
                        marginBottom: '6px',
                        fontFamily: 'inherit',
                        fontWeight: '400'
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
                              fontFamily: 'inherit',
                              fontWeight: '400',
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
                        color: '#16191f',
                        fontFamily: 'inherit',
                        fontWeight: '400',
                        marginBottom: '6px'
                      }}>
                        Delivery method
                      </div>
                      <span style={{
                        fontSize: '14px',
                        color: '#16191f',
                        fontFamily: 'inherit',
                        fontWeight: '400',
                        borderBottom: '1px dotted #16191f',
                        display: 'inline-block'
                      }}>
                        Software as a Service (SaaS)
                      </span>
                    </div>

                    {/* Deployed on AWS */}
                    <div>
                      <div style={{
                        fontSize: '13px',
                        color: '#16191f',
                        fontFamily: 'inherit',
                        fontWeight: '400',
                        marginBottom: '6px'
                      }}>
                        Deployed on AWS
                      </div>
                      <span style={{
                        fontSize: '14px',
                        color: '#16191f',
                        fontFamily: 'inherit',
                        fontWeight: '400',
                        borderBottom: '1px dotted #16191f',
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
                  border: '1px solid #D5D9D9',
                  borderRadius: '8px',
                  padding: '24px',
                  backgroundColor: 'white',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    fontSize: '15px',
                    color: '#16191f',
                    lineHeight: '1.8',
                    fontFamily: 'inherit',
                    maxHeight: isDescriptionExpanded ? 'none' : '120px',
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease'
                  }}>
                    <p style={{ margin: 0 }}>{product.overview}</p>
                  </div>

                  {/* See More/Less Button - Modern & Spicy */}
                  {product.overview && product.overview.length > 200 && (
                    <div style={{
                      marginTop: '20px',
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      <button
                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                        style={{
                          background: isDescriptionExpanded 
                            ? '#111A45'
                            : 'rgba(17, 26, 69, 0.08)',
                          border: '1px solid transparent',
                          backgroundClip: 'padding-box',
                          color: isDescriptionExpanded ? 'white' : '#111A45',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          padding: '8px 20px',
                          borderRadius: '20px',
                          transition: 'all 0.3s ease',
                          boxShadow: isDescriptionExpanded 
                            ? '0 4px 15px rgba(17, 26, 69, 0.25)' 
                            : '0 2px 8px rgba(0,0,0,0.06)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 6px 20px rgba(17, 26, 69, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          if (isDescriptionExpanded) {
                            e.target.style.boxShadow = '0 4px 15px rgba(17, 26, 69, 0.25)';
                          } else {
                            e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                          }
                        }}
                      >
                        {isDescriptionExpanded ? (
                          <>
                            Show less
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </>
                        ) : (
                          <>
                            Show more
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div id="features" style={{ scrollMarginTop: '120px', marginTop: '40px' }}>
              <h2 style={{
                fontSize: isMobile ? '20px' : '24px',
                fontWeight: '600',
                color: '#16191f',
                marginBottom: '30px',
                fontFamily: 'inherit'
              }}>
                ⚡ Features and Programs
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
                  }}
                  >
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#16191f',
                      marginBottom: '16px',
                      fontFamily: 'inherit'
                    }}>
                      Trust Center
                    </h3>

                    <p style={{
                      fontSize: '14px',
                      color: '#16191f',
                      lineHeight: '1.6',
                      marginBottom: '16px',
                      fontFamily: 'inherit'
                    }}>
                      Access real-time vendor security and compliance information through their Trust Center powered by Drata. Review certifications and security standards before purchase.
                    </p>

                    {/* Button */}
                    <button style={{
                      padding: '12px 24px',
                      backgroundColor: '#111A45',
                      border: 'none',
                      borderRadius: '25px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'white',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(17, 26, 69, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#0D1433';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(17, 26, 69, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#111A45';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 8px rgba(17, 26, 69, 0.2)';
                    }}
                    >
                      View Trust Center →
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
                  }}
                  >
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#16191f',
                      marginBottom: '16px',
                      fontFamily: 'inherit'
                    }}>
                      Buyer Guide
                    </h3>

                    {/* Description */}
                    <p style={{
                      fontSize: '15px',
                      color: '#16191f',
                      lineHeight: '1.7',
                      marginBottom: '20px',
                      fontFamily: 'inherit'
                    }}>
                      Gain valuable insights from real users who purchased this product, powered by PeerSpot.
                    </p>

                    {/* Preview Image */}
                    <div style={{
                      marginBottom: '24px',
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      padding: '24px',
                      minHeight: '150px',
                      border: '1px solid #E5E7EB'
                    }}>
                      <div style={{ position: 'relative', display: 'flex', gap: '12px' }}>
                        {/* Document preview illustration */}
                        <div style={{
                          width: '70px',
                          height: '90px',
                          backgroundColor: '#111A45',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '28px',
                          boxShadow: '0 4px 10px rgba(17, 26, 69, 0.2)'
                        }}>
                          📄
                        </div>
                        <div style={{
                          width: '70px',
                          height: '90px',
                          backgroundColor: 'white',
                          border: '2px solid #E5E7EB',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '28px'
                        }}>
                          📊
                        </div>
                        <div style={{
                          width: '70px',
                          height: '90px',
                          backgroundColor: 'white',
                          border: '2px solid #E5E7EB',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '28px'
                        }}>
                          📈
                        </div>
                      </div>
                    </div>

                    {/* Button */}
                    <button style={{
                      padding: '12px 24px',
                      backgroundColor: 'white',
                      border: '2px solid #111A45',
                      borderRadius: '25px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#16191f',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#111A45';
                      e.target.style.color = 'white';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.color = '#16191f';
                      e.target.style.transform = 'translateY(0)';
                    }}
                    >
                      Get the Buyer Guide →
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
                  }}
                  >
                    {/* Title with Icon */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      marginBottom: '18px'
                    }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        backgroundColor: '#FEF9C3',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        boxShadow: '0 2px 8px rgba(234, 179, 8, 0.2)'
                      }}>
                        💳
                      </div>
                    <h3 style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#16191f',
                        margin: 0,
                        fontFamily: 'inherit'
                      }}>
                        Financing Options
                    </h3>
                    </div>

                    {/* Description */}
                    <p style={{
                      fontSize: '15px',
                      color: '#16191f',
                      lineHeight: '1.7',
                      marginBottom: '20px',
                      fontFamily: 'inherit'
                    }}>
                      AWS Marketplace now accepts line of credit payments through the PNC Vendor Finance program. This program is available to select AWS customers in the US, excluding NV, NC, ND, TN, & VT.
                    </p>

                    {/* PNC Logo */}
                    <div style={{
                      marginBottom: '24px',
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '24px',
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      border: '1px solid #E5E7EB'
                    }}>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#16191f',
                        fontFamily: 'Arial, sans-serif',
                        letterSpacing: '1.5px',
                        textAlign: 'center'
                      }}>
                        PNC<br/>
                        <span style={{ fontSize: '14px', color: '#16191f' }}>VENDOR FINANCE</span>
                      </div>
                    </div>

                    {/* Button */}
                    <button style={{
                      padding: '12px 24px',
                      backgroundColor: 'white',
                      border: '2px solid #6B7280',
                      borderRadius: '25px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#16191f',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                      e.target.style.borderColor = '#111A45';
                      e.target.style.color = '#16191f';
                      e.target.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                      e.target.style.borderColor = '#6B7280';
                      e.target.style.color = '#16191f';
                      e.target.style.transform = 'translateY(0)';
                    }}
                    >
                      View Financing Details →
                  </button>
                </div>
                </div>
                </div>
                  </div>

          {/* Resources Section */}
          <div id="resources" style={{ scrollMarginTop: '120px', marginTop: '40px' }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#16191f',
                marginBottom: '30px',
                fontFamily: 'inherit'
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
                    color: '#16191f',
                    margin: 0,
                    fontFamily: 'inherit'
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
                      fontFamily: 'inherit'
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
                      fontWeight: '400',
                      color: '#16191f',
                      fontFamily: 'inherit',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#007185'}
                    onMouseLeave={(e) => e.target.style.color = '#16191f'}
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
                        fontFamily: 'inherit',
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
                        fontFamily: 'inherit',
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

          {/* Support Section */}
          <div id="support" style={{ scrollMarginTop: '120px', marginTop: '40px' }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#16191f',
                marginBottom: '30px',
                fontFamily: 'inherit'
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
                      color: '#16191f',
                      marginBottom: '16px',
                      fontFamily: 'inherit'
                    }}>
                      Vendor support
                    </h3>

                    <p style={{
                      fontSize: '14px',
                      color: '#16191f',
                      lineHeight: '1.6',
                      marginBottom: '16px',
                      fontFamily: 'inherit'
                    }}>
                      Through our expert teams and robust digital resources, we ensure you can always access urgent and proactive support, whenever and however you need it, anywhere in the world. Access the Okta Community to get help, engage with us and your peers, submit product requests, and access the key resources you need to drive success. We offer support packages that are aligned to your requirements to give you the power of choice.
                    </p>

                    <div style={{
                      fontSize: '14px',
                      color: '#16191f',
                      lineHeight: '1.6',
                      fontFamily: 'inherit'
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
                      color: '#16191f',
                      marginBottom: '16px',
                      fontFamily: 'inherit'
                    }}>
                      AWS infrastructure support
                    </h3>

                    <p style={{
                      fontSize: '14px',
                      color: '#16191f',
                      lineHeight: '1.6',
                      marginBottom: '20px',
                      fontFamily: 'inherit',
                      flex: 1
                    }}>
                      AWS Support is a one-on-one, fast-response support channel that is staffed 24x7x365 with experienced and technical support engineers. The service helps customers of all sizes and technical abilities to successfully utilize the products and features provided by Amazon Web Services.
                    </p>

                    <button style={{
                      padding: '10px 24px',
                      backgroundColor: 'white',
                      border: '1px solid #007185',
                      borderRadius: '25px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#007185',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
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

          {/* Product Comparison Section */}
          <div id="product-comparison" style={{ scrollMarginTop: '120px', marginTop: '40px' }}>
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
                    color: '#16191f',
                    margin: '0 0 4px 0',
                    fontFamily: 'inherit'
                  }}>
                    Product comparison
                  </h2>
                  <p style={{
                    fontSize: '13px',
                    color: '#16191f',
                    margin: 0,
                    fontFamily: 'inherit'
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
                    fontWeight: '400',
                    color: '#16191f',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
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
                    fontWeight: '400',
                    color: '#16191f',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
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
                          color: '#16191f',
                          fontFamily: 'inherit'
                        }}>
                          Okta Platform
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#16191f',
                          fontFamily: 'inherit'
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
                          color: '#16191f',
                          fontFamily: 'inherit'
                        }}>
                          OneLogin Workforce Identity
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#16191f',
                          fontFamily: 'inherit'
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
                          color: '#16191f',
                          fontFamily: 'inherit'
                        }}>
                          CyberArk Workforce Identity
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#16191f',
                          fontFamily: 'inherit'
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
                    color: '#16191f',
                    fontFamily: 'inherit'
                  }}>
                    Accolades
                  </div>
                  <div style={{ padding: '20px', borderLeft: '1px solid #D5D9D9' }}>
                    <div style={{
                      fontSize: '13px',
                      color: '#16191f',
                      fontFamily: 'inherit'
                    }}>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>Top 10</div>
                      <div style={{ color: '#16191f' }}>in Infrastructure as Code, Application Development, Security</div>
                    </div>
                  </div>
                  <div style={{ padding: '20px', borderLeft: '1px solid #D5D9D9' }}>
                    <div style={{
                      fontSize: '13px',
                      color: '#16191f',
                      fontFamily: 'inherit'
                    }}>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>Top 100</div>
                      <div style={{ color: '#16191f' }}>in Applications</div>
                    </div>
                  </div>
                  <div style={{ padding: '20px', borderLeft: '1px solid #D5D9D9' }}>
                    <div style={{
                      fontSize: '13px',
                      color: '#16191f',
                      fontFamily: 'inherit'
                    }}>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>Top 100</div>
                      <div style={{ color: '#16191f' }}>in Security</div>
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
                    color: '#16191f',
                    fontFamily: 'inherit'
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
                      color: '#16191f',
                      fontFamily: 'inherit',
                      marginBottom: '8px'
                    }}>
                      Sentiment is AI generated from actual customer reviews on G2 and G2.
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: '#16191f' }}>
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
                    fontWeight: '400',
                    fontSize: '13px',
                    color: '#16191f',
                    fontFamily: 'inherit'
                  }}>
                    Reviews
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9', fontSize: '13px', fontFamily: 'inherit' }}>500 reviews</div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9', fontSize: '13px', fontFamily: 'inherit' }}>8 reviews</div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9', fontSize: '13px', fontFamily: 'inherit' }}>108 reviews</div>
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
                    fontWeight: '400',
                    fontSize: '13px',
                    color: '#16191f',
                    fontFamily: 'inherit'
                  }}>
                    Functionality
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9' }}>
                    <div style={{ fontSize: '13px', marginBottom: '6px', fontFamily: 'inherit' }}>Positive</div>
                    <div style={{ height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '85%', height: '100%', backgroundColor: '#4CAF50' }}></div>
                    </div>
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9' }}>
                    <div style={{ fontSize: '13px', marginBottom: '6px', fontFamily: 'inherit' }}>Positive</div>
                    <div style={{ height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '80%', height: '100%', backgroundColor: '#4CAF50' }}></div>
                    </div>
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9' }}>
                    <div style={{ fontSize: '13px', marginBottom: '6px', fontFamily: 'inherit' }}>Positive</div>
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
                    fontWeight: '400',
                    fontSize: '13px',
                    color: '#16191f',
                    fontFamily: 'inherit'
                  }}>
                    Ease of use
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9' }}>
                    <div style={{ fontSize: '13px', marginBottom: '6px', fontFamily: 'inherit' }}>Positive</div>
                    <div style={{ height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '78%', height: '100%', backgroundColor: '#4CAF50' }}></div>
                    </div>
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9' }}>
                    <div style={{ fontSize: '13px', marginBottom: '6px', fontFamily: 'inherit' }}>Positive</div>
                    <div style={{ height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '75%', height: '100%', backgroundColor: '#4CAF50' }}></div>
                    </div>
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9' }}>
                    <div style={{ fontSize: '13px', marginBottom: '6px', fontFamily: 'inherit' }}>Positive</div>
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
                    fontWeight: '400',
                    fontSize: '13px',
                    color: '#16191f',
                    fontFamily: 'inherit'
                  }}>
                    Customer service
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9' }}>
                    <div style={{ fontSize: '13px', marginBottom: '6px', fontFamily: 'inherit' }}>Mixed</div>
                    <div style={{ height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                      <div style={{ width: '45%', height: '100%', backgroundColor: '#4CAF50' }}></div>
                      <div style={{ width: '35%', height: '100%', backgroundColor: '#FFC107' }}></div>
                      <div style={{ width: '20%', height: '100%', backgroundColor: '#F44336' }}></div>
                    </div>
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9' }}>
                    <div style={{ fontSize: '13px', marginBottom: '6px', fontFamily: 'inherit' }}>Mixed</div>
                    <div style={{ height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                      <div style={{ width: '40%', height: '100%', backgroundColor: '#4CAF50' }}></div>
                      <div style={{ width: '40%', height: '100%', backgroundColor: '#FFC107' }}></div>
                      <div style={{ width: '20%', height: '100%', backgroundColor: '#F44336' }}></div>
                    </div>
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9' }}>
                    <div style={{ fontSize: '13px', marginBottom: '6px', fontFamily: 'inherit' }}>Positive</div>
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
                    fontWeight: '400',
                    fontSize: '13px',
                    color: '#16191f',
                    fontFamily: 'inherit'
                  }}>
                    Cost effectiveness
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9' }}>
                    <div style={{ fontSize: '13px', marginBottom: '6px', fontFamily: 'inherit' }}>Negative</div>
                    <div style={{ height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                      <div style={{ width: '25%', height: '100%', backgroundColor: '#4CAF50' }}></div>
                      <div style={{ width: '25%', height: '100%', backgroundColor: '#FFC107' }}></div>
                      <div style={{ width: '50%', height: '100%', backgroundColor: '#F44336' }}></div>
                    </div>
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9' }}>
                    <div style={{ fontSize: '13px', color: '#16191f', fontFamily: 'inherit' }}>Insufficient data</div>
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9' }}>
                    <div style={{ fontSize: '13px', marginBottom: '6px', fontFamily: 'inherit' }}>Mixed</div>
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
                    color: '#16191f',
                    fontFamily: 'inherit'
                  }}>
                    Overview
                    <div style={{
                      fontSize: '11px',
                      fontWeight: '400',
                      color: '#16191f',
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
                    fontWeight: '400',
                    fontSize: '13px',
                    color: '#16191f',
                    fontFamily: 'inherit'
                  }}>
                    Identity Management
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9', fontSize: '13px', color: '#16191f', lineHeight: '1.5', fontFamily: 'inherit' }}>
                    Unified identity security platform with comprehensive user lifecycle management across applications and devices.
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9', fontSize: '13px', color: '#16191f', lineHeight: '1.5', fontFamily: 'inherit' }}>
                    —
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9', fontSize: '13px', color: '#16191f', lineHeight: '1.5', fontFamily: 'inherit' }}>
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
                    fontWeight: '400',
                    fontSize: '13px',
                    color: '#16191f',
                    fontFamily: 'inherit'
                  }}>
                    Authentication Mechanism
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9', fontSize: '13px', color: '#16191f', lineHeight: '1.5', fontFamily: 'inherit' }}>
                    Adaptive multi-factor authentication with intelligent, phishing-resistant capabilities.
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9', fontSize: '13px', color: '#16191f', lineHeight: '1.5', fontFamily: 'inherit' }}>
                    —
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9', fontSize: '13px', color: '#16191f', lineHeight: '1.5', fontFamily: 'inherit' }}>
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
                    color: '#16191f',
                    fontFamily: 'inherit'
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
                    fontWeight: '400',
                    fontSize: '13px',
                    color: '#16191f',
                    fontFamily: 'inherit'
                  }}>
                    Standard contract
                  </div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9', fontSize: '13px', fontFamily: 'inherit' }}>No</div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9', fontSize: '13px', fontFamily: 'inherit' }}>No</div>
                  <div style={{ padding: '16px 20px', borderLeft: '1px solid #D5D9D9', fontSize: '13px', fontFamily: 'inherit' }}>No</div>
                </div>
              </div>

              {/* Show Less Link */}
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <a href="#" style={{
                  fontSize: '14px',
                  color: '#007185',
                  textDecoration: 'none',
                  fontFamily: 'inherit'
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

          {/* Pricing Section */}
          <div id="pricing" style={{ scrollMarginTop: '120px', marginTop: '40px' }}>
              <h2 style={{
                fontSize: isMobile ? '20px' : '24px',
                fontWeight: '600',
                color: '#16191f',
                marginBottom: '30px',
                fontFamily: 'inherit'
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
                    color: '#16191f',
                    marginBottom: '8px',
                    fontFamily: 'inherit'
                  }}>
                    Free trial
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#16191f',
                    margin: 0,
                    fontFamily: 'inherit'
                  }}>
                    Try this product free according to the free trial terms set by the vendor.
                  </p>
                </div>
                <button style={{
                  padding: '10px 24px',
                  backgroundColor: 'white',
                  border: '1px solid #007185',
                  borderRadius: '25px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#007185',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
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
                        color: '#16191f',
                        margin: 0,
                        fontFamily: 'inherit'
                      }}>
                        Okta Platform
                      </h3>
                      <a href="#" style={{
                        fontSize: '13px',
                        color: '#007185',
                        textDecoration: 'none',
                        fontFamily: 'inherit'
                      }}>
                        Info
                      </a>
                    </div>

                    <p style={{
                      fontSize: '14px',
                      color: '#16191f',
                      lineHeight: '1.6',
                      marginBottom: '12px',
                      fontFamily: 'inherit'
                    }}>
                      Pricing is based on the duration and terms of your contract with the vendor. This entitles you to a specified quantity of use for the contract duration. If you choose not to renew or replace your contract before it ends, access to these entitlements will expire.
                    </p>

                    <p style={{
                      fontSize: '14px',
                      color: '#16191f',
                      lineHeight: '1.6',
                      margin: 0,
                      fontFamily: 'inherit'
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
                    borderRadius: '25px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#007185',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
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
                        fontWeight: '400',
                        color: index === 0 ? '#007185' : '#16191f',
                        fontFamily: 'inherit',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (index !== 0) e.target.style.color = '#007185';
                      }}
                      onMouseLeave={(e) => {
                        if (index !== 0) e.target.style.color = '#16191f';
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
                    color: '#16191f',
                    margin: 0,
                    fontFamily: 'inherit'
                  }}>
                    12-month contract (2)
                  </h4>
                  <a href="#" style={{
                    fontSize: '13px',
                    color: '#007185',
                    textDecoration: 'none',
                    fontFamily: 'inherit'
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
                    color: '#16191f',
                    fontFamily: 'inherit',
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
                        color: '#16191f',
                        fontFamily: 'inherit',
                        backgroundColor: 'white',
                        minWidth: isMobile ? '470px' : 'auto'
                      }}
                    >
                      <div style={{ fontWeight: '400' }}>{row.dimension}</div>
                      <div style={{ color: '#16191f' }}>{row.description}</div>
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
                  color: '#16191f',
                  marginBottom: '12px',
                  fontFamily: 'inherit'
                }}>
                  Vendor refund policy
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#16191f',
                  lineHeight: '1.6',
                  margin: 0,
                  fontFamily: 'inherit'
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
                    color: '#16191f',
                    marginBottom: '8px',
                    fontFamily: 'inherit'
                  }}>
                    Custom pricing options
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#16191f',
                    margin: 0,
                    fontFamily: 'inherit'
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
                  fontFamily: 'inherit',
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

          {/* Add more tab content as needed */}
        </div>
      </div>
    </main>
  );
};

export default MarketplaceProductDetail;

