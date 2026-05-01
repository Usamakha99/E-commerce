import React from 'react';

export default function MarketplaceFeaturesSection({
  product,
  agent,
  isMobile,
  sectionShell,
}) {
  return (
    <>
          <section id="features" style={sectionShell}>
              <h2 style={{
                fontSize: isMobile ? '18px' : '22px',
                fontWeight: '700',
                color: '#16191f',
                marginBottom: '16px',
                fontFamily: 'inherit',
                letterSpacing: '-0.01em'
              }}>
                Features and Programs
              </h2>

              {/* Features Cards Grid */}
              <div className="row">
                {/* Features Description - Only show if it's NOT overview data */}
                {product.featuresDescription && 
                 product.featuresDescription !== product.overview && 
                 product.featuresDescription !== agent?.overview && (
                  <div className="col-12 mb-3">
                    <div style={{
                      border: '1px solid #D5D9D9',
                      borderRadius: '8px',
                      padding: '18px',
                      backgroundColor: 'white'
                    }}>
                      {product.featuresTitle && (
                        <h3 style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#16191f',
                          marginBottom: '12px',
                          fontFamily: 'inherit'
                        }}>
                          {product.featuresTitle}
                        </h3>
                      )}
                      <p style={{
                        fontSize: '13px',
                        color: '#16191f',
                        lineHeight: '1.6',
                        fontFamily: 'inherit',
                        margin: 0
                      }}>
                        {product.featuresDescription}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Features List - Show if features array exists */}
                {product.features && Array.isArray(product.features) && product.features.length > 0 && (
                  <div className="col-12 mb-3">
                    <div style={{
                      border: '1px solid #D5D9D9',
                      borderRadius: '8px',
                      padding: '18px',
                      backgroundColor: 'white'
                    }}>
                      <h3 style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#16191f',
                        marginBottom: '16px',
                        fontFamily: 'inherit'
                      }}>
                        Features
                      </h3>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                      }}>
                        {product.features.map((feature, index) => (
                          <li key={index} style={{
                            padding: '8px 0',
                            borderBottom: index < product.features.length - 1 ? '1px solid #E5E7EB' : 'none',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px'
                          }}>
                            <span style={{
                              color: '#10b981',
                              fontSize: '13px',
                              fontWeight: 'bold',
                              marginTop: '2px'
                            }}>✓</span>
                            <span style={{
                              fontSize: '13px',
                              color: '#16191f',
                              fontFamily: 'inherit',
                              lineHeight: '1.6'
                            }}>
                              {typeof feature === 'string' ? feature : feature.name || feature.title || feature.description || feature.text || JSON.stringify(feature)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                {/* Programs List - Show if programs array exists */}
                {product.programs && Array.isArray(product.programs) && product.programs.length > 0 && (
                  <div className="col-12 mb-3">
                    <div style={{
                      border: '1px solid #D5D9D9',
                      borderRadius: '8px',
                      padding: '18px',
                      backgroundColor: 'white'
                    }}>
                      <h3 style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#16191f',
                        marginBottom: '16px',
                        fontFamily: 'inherit'
                      }}>
                        Programs
                      </h3>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                      }}>
                        {product.programs.map((program, index) => (
                          <li key={index} style={{
                            padding: '8px 0',
                            borderBottom: index < product.programs.length - 1 ? '1px solid #E5E7EB' : 'none',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px'
                          }}>
                            <span style={{
                              color: 'rgb(0, 113, 133)',
                              fontSize: '13px',
                              fontWeight: 'bold',
                              marginTop: '2px'
                            }}>📋</span>
                            <span style={{
                              fontSize: '13px',
                              color: '#16191f',
                              fontFamily: 'inherit',
                              lineHeight: '1.6'
                            }}>
                              {typeof program === 'string' ? program : program.name || program.title || program.description || program.text || JSON.stringify(program)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                {/* Trust Center Card - Only show if URL exists */}
                {product.trustCenterUrl && (
                <div className="col-lg-6 mb-3">
                  <div style={{
                    border: '1px solid #D5D9D9',
                    borderRadius: '8px',
                    padding: '18px',
                    height: '100%',
                    backgroundColor: 'white',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  >
                    <h3 style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#16191f',
                      marginBottom: '16px',
                      fontFamily: 'inherit'
                    }}>
                      Trust Center
                    </h3>

                    <p style={{
                      fontSize: '13px',
                      color: '#16191f',
                      lineHeight: '1.6',
                      marginBottom: '16px',
                      fontFamily: 'inherit'
                    }}>
                      Access real-time vendor security and compliance information through their Trust Center. Review certifications and security standards before purchase.
                    </p>

                    {/* Button */}
                    <a
                      href={product.trustCenterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                      padding: '12px 24px',
                      backgroundColor: '#111A45',
                      border: 'none',
                      borderRadius: '25px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'white',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(17, 26, 69, 0.2)',
                        textDecoration: 'none',
                        display: 'inline-block',
                        textAlign: 'center',
                        width: 'fit-content'
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
                    </a>
                  </div>
                </div>
                )}

                {/* Buyer Guide Card - Show if buyerGuide object exists */}
                {product.buyerGuide && (
                <div className="col-lg-6 mb-3">
                  <div style={{
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '18px',
                    height: '100%',
                    backgroundColor: 'white',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  >
                    <h3 style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#16191f',
                      marginBottom: '16px',
                      fontFamily: 'inherit'
                    }}>
                      {product.buyerGuide.title || 'Buyer Guide'}
                    </h3>

                    {/* Description */}
                    <p style={{
                      fontSize: '13px',
                      color: '#374151',
                      lineHeight: '1.7',
                      marginBottom: '20px',
                      fontFamily: 'inherit'
                    }}>
                      {product.buyerGuide.description || 'Gain valuable insights from real users who purchased this product.'}
                    </p>

                    {/* Button */}
                    <a
                      href={product.buyerGuide.buttonLink || product.buyerGuideUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                      padding: '12px 24px',
                      backgroundColor: 'white',
                      border: '2px solid #111A45',
                      borderRadius: '25px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#16191f',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                        transition: 'all 0.3s ease',
                        textDecoration: 'none',
                        display: 'inline-block',
                        textAlign: 'center',
                        width: 'fit-content'
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
                      {product.buyerGuide.buttonText || 'Get the Buyer Guide'} →
                    </a>
                  </div>
                </div>
                )}

                {/* Show message if no features available */}
                {!product.trustCenter && 
                 !product.buyerGuide && 
                 (!product.features || !Array.isArray(product.features) || product.features.length === 0) &&
                 (!product.programs || !Array.isArray(product.programs) || product.programs.length === 0) &&
                 (!product.featuresData || Object.keys(product.featuresData).length === 0) && (
                  <div className="col-12">
                    <p style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'inherit', textAlign: 'center', padding: '40px' }}>
                      No features and programs available at this time.
                    </p>
                  </div>
                )}
              </div>
          </section>
    </>
  );
}
