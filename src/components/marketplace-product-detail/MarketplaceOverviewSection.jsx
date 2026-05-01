import React from 'react';

export default function MarketplaceOverviewSection({
  product,
  agent,
  categories,
  isMobile,
  isTablet,
  sectionShell,
  isDescriptionExpanded,
  setIsDescriptionExpanded,
  renderTextWithLinks,
}) {
  return (
    <>
          <section id="overview" style={sectionShell}>
              <h2 style={{
                fontSize: isMobile ? '18px' : '22px',
                fontWeight: '700',
                color: '#16191f',
                marginBottom: '16px',
                fontFamily: 'inherit',
                letterSpacing: '-0.01em'
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
                  borderRadius: '8px',
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
                    fontSize: '30px',
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
                    fontSize: isMobile ? '15px' : '22px',
                    fontWeight: '700',
                    textShadow: '0 3px 6px rgba(0,0,0,0.6)',
                      fontFamily: 'inherit'
                  }}>
                    What is Okta?
                  </div>
                </div>
                <p style={{
                  fontSize: '13px',
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
              <div className="col-lg-6" style={{ marginBottom: isMobile ? '16px' : '0' }}>
                <div style={{
                  borderRadius: '8px',
                  padding: '18px',
                  background: 'linear-gradient(165deg, #f8fafc 0%, #f1f5f9 100%)',
                  height: '100%',
                  overflow: 'hidden',
                  border: '1px solid rgba(226, 232, 240, 0.85)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)'
                }}>
                  <h3 style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#16191f',
                    marginBottom: '12px',
                    fontFamily: 'inherit'
                  }}>
                    Key Highlights
                  </h3>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                  }}>
                    {(() => {
                      // Handle highlights - convert string to array if needed
                      let highlightsList = product.highlights;
                      if (typeof highlightsList === 'string') {
                        // Try to parse if it's JSON string
                        try {
                          highlightsList = JSON.parse(highlightsList);
                        } catch {
                          // If not JSON, split by comma or newline
                          highlightsList = highlightsList.split(/\n|,|;/).filter(h => h.trim());
                        }
                      }
                      if (!Array.isArray(highlightsList)) {
                        highlightsList = [];
                      }
                      
                      return highlightsList.length > 0 ? (
                        highlightsList.map((highlight, index) => (
                      <li key={index} style={{
                        fontSize: '13px',
                        color: '#16191f',
                        lineHeight: '1.7',
                        marginBottom: '10px',
                        paddingLeft: '22px',
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
                            {typeof highlight === 'string' ? highlight : (highlight.text || highlight.title || String(highlight))}
                      </li>
                        ))
                      ) : (
                        <li style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'inherit' }}>
                          No highlights available.
                        </li>
                      );
                    })()}
                  </ul>
                </div>
                </div>

              {/* Details Column */}
              <div className="col-lg-6">
                <div style={{
                  border: '1px solid #e8edf2',
                  borderRadius: '8px',
                  padding: isMobile ? '18px' : '20px',
                  backgroundColor: '#fcfdfe',
                  height: '100%',
                  overflow: 'hidden',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.8) inset'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#16191f',
                    marginBottom: '16px',
                    fontFamily: 'inherit',
                    letterSpacing: '-0.01em'
                  }}>
                    Details
                  </h3>

                  <div style={{ lineHeight: '1.8' }}>
                    {/* Sold by */}
                    <div style={{
                      padding: '18px 0',
                      marginBottom: '20px',
                      borderBottom: '1px solid #e2e8f0'
                    }}>
                      <span style={{
                        fontSize: '13px',
                        color: '#6B7280',
                        fontFamily: 'inherit',
                        fontWeight: '500',
                        display: 'inline-block',
                        width: '130px',
                        verticalAlign: 'top'
                      }}>
                        Sold by:
                      </span>
                      <span style={{
                        fontSize: '13px',
                        color: '#16191f',
                        fontFamily: 'inherit',
                        fontWeight: '600'
                      }}>
                        {product.seller}
                      </span>
                    </div>

                    {/* Categories */}
                    <div style={{
                      padding: '18px 0',
                      marginBottom: '20px',
                      borderBottom: '1px solid #e2e8f0'
                    }}>
                      <span style={{
                        fontSize: '13px',
                        color: '#6B7280',
                        fontFamily: 'inherit',
                        fontWeight: '500',
                        display: 'inline-block',
                        width: '130px',
                        verticalAlign: 'top'
                      }}>
                        Categories:
                      </span>
                      <span style={{
                        fontSize: '13px',
                        color: '#16191f',
                        fontFamily: 'inherit',
                        fontWeight: '400'
                      }}>
                        {(() => {
                          // Find the matching category from fetched categories
                          const agentCategories = agent?.categories || [];
                          const displayCategories = agentCategories.length > 0 ? agentCategories : categories;

                          const safeCats = (displayCategories || []).filter(Boolean);
                          return safeCats.length > 0 ? (
                            safeCats.map((cat, index) => {
                              const categoryId = cat.id || cat.categoryId;
                              const categoryName = cat.name || cat.title || cat.slug || `Category ${categoryId}`;
                              const categorySlug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-') || categoryId;

                              return (
                                <a
                                  key={categoryId || index}
                                  href={`/marketplace?category=${categorySlug}`}
                                  style={{
                                    fontSize: '13px',
                                    color: 'rgb(0, 113, 133)',
                                    textDecoration: 'none',
                                    fontFamily: 'inherit',
                                    fontWeight: '600',
                                    marginRight: '12px'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.target.style.textDecoration = 'underline';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.target.style.textDecoration = 'none';
                                  }}
                                >
                                  {categoryName}
                                </a>
                              );
                            })
                          ) : (
                            <span style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'inherit' }}>Loading categories...</span>
                          );
                        })()}
                      </span>
                    </div>

                    {/* Delivery method */}
                    <div style={{
                      padding: '18px 0',
                      marginBottom: '20px',
                      borderBottom: '1px solid #e2e8f0'
                    }}>
                      <span style={{
                        fontSize: '13px',
                        color: '#6B7280',
                        fontFamily: 'inherit',
                        fontWeight: '500',
                        display: 'inline-block',
                        width: '130px',
                        verticalAlign: 'top'
                      }}>
                        Delivery method:
                      </span>
                      <span style={{
                        fontSize: '13px',
                        color: '#16191f',
                        fontFamily: 'inherit',
                        fontWeight: '600'
                      }}>
                        {typeof product.deliveryMethod === 'object' && product.deliveryMethod !== null
                          ? (product.deliveryMethod.name || product.deliveryMethod.label || 'Not specified')
                          : (product.deliveryMethod ?? 'Not specified')}
                      </span>
                    </div>

                    {/* Deployed on AWS */}
                    <div style={{
                      padding: '18px 0'
                    }}>
                      <span style={{
                        fontSize: '13px',
                        color: '#6B7280',
                        fontFamily: 'inherit',
                        fontWeight: '500',
                        display: 'inline-block',
                        width: '130px',
                        verticalAlign: 'top'
                      }}>
                        Deployed on AWS:
                      </span>
                      <span style={{
                        fontSize: '13px',
                        color: '#16191f',
                        fontFamily: 'inherit',
                        fontWeight: '600'
                      }}>
                        Yes
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Width Description Section */}
            <div className="row" style={{ marginTop: '10px', marginBottom: 0 }}>
              <div className="col-12" style={{ paddingBottom: 0 }}>
                <div style={{
                  border: '1px solid #D5D9D9',
                  borderRadius: '8px',
                  padding: '18px',
                  paddingBottom: '14px',
                  backgroundColor: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  marginBottom: 0,
                }}>
                  <div style={{
                    fontSize: '13px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'inherit',
                    maxHeight: isDescriptionExpanded ? 'none' : '120px',
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease'
                  }}>
                    <p style={{ margin: 0, fontSize: '13px', color: '#000000' }}>{renderTextWithLinks(product.overview)}</p>
                  </div>

                  {/* See More/Less Button - Modern & Spicy */}
                  {product.overview && product.overview.length > 200 && (
                    <div style={{
                      marginTop: '12px',
                      marginBottom: 0,
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      <button
                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                        style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#007185',
                          backgroundColor: 'transparent',
                          border: '2px solid rgb(0, 113, 133)',
                          borderRadius: '25px',
                          padding: '12px 28px',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow: 'none',
                          minWidth: '150px',
                          whiteSpace: 'nowrap',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#E6F4F7';
                          e.currentTarget.style.color = '#007185';
                          e.currentTarget.style.borderColor = '#007185';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 113, 133, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#007185';
                          e.currentTarget.style.borderColor = '#007185';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <span style={{ position: 'relative', zIndex: 1 }}>
                          {isDescriptionExpanded ? 'Show less' : 'Show more'}
                        </span>
                        <svg 
                          width="18" 
                          height="18" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                          style={{
                            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: isDescriptionExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            position: 'relative',
                            zIndex: 1
                        }}
                      >
                        {isDescriptionExpanded ? (
                            <path 
                              d="M18 15L12 9L6 15" 
                              stroke="currentColor" 
                              strokeWidth="2.5" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            />
                          ) : (
                            <path 
                              d="M6 9L12 15L18 9" 
                              stroke="currentColor" 
                              strokeWidth="2.5" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            />
                          )}
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
    </>
  );
}
