import React from 'react';

export default function MarketplacePricingSection({
  product,
  isMobile,
  setShowInquiryModal,
  sectionShell,
}) {
  return (
    <>
          <section id="how-to-buy" style={sectionShell}>
              <h2 style={{
                fontSize: isMobile ? '18px' : '22px',
                fontWeight: '600',
                color: '#16191f',
                marginBottom: '18px',
                fontFamily: 'inherit'
              }}>
                Pricing
              </h2>

              {/* Free Trial Section - Only show if free trial is available */}
              {product.freeTrial && (
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
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#16191f',
                    marginBottom: '8px',
                    fontFamily: 'inherit'
                  }}>
                    Free trial
                  </h3>
                  <p style={{
                    fontSize: '13px',
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
                  fontSize: '13px',
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
              )}

              {/* Okta Platform Pricing Section */}
              <div style={{
                border: '1px solid #D5D9D9',
                borderRadius: '8px',
                padding: '18px',
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
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#16191f',
                        margin: 0,
                        fontFamily: 'inherit'
                      }}>
                        {product.name}
                      </h3>
                      <a href="#" style={{
                        fontSize: '13px',
                        color: 'rgb(0, 113, 133)',
                        textDecoration: 'none',
                        fontFamily: 'inherit'
                      }}>
                        Info
                      </a>
                    </div>

                    <p style={{
                      fontSize: '13px',
                      color: '#16191f',
                      lineHeight: '1.6',
                      marginBottom: '12px',
                      fontFamily: 'inherit'
                    }}>
                      Pricing is based on the duration and terms of your contract with the vendor. This entitles you to a specified quantity of use for the contract duration. If you choose not to renew or replace your contract before it ends, access to these entitlements will expire.
                    </p>

                    <p style={{
                      fontSize: '13px',
                      color: '#16191f',
                      lineHeight: '1.6',
                      margin: 0,
                      fontFamily: 'inherit'
                    }}>
                      Additional AWS infrastructure costs may apply. Use the{' '}
                      <a href="#" style={{
                        color: 'rgb(0, 113, 133)',
                        textDecoration: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = 'rgb(0, 113, 133)';
                        e.target.style.textDecoration = 'underline';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'rgb(0, 113, 133)';
                        e.target.style.textDecoration = 'none';
                      }}
                      >
                        AWS Pricing Calculator
                      </a>
                      {' '}to estimate your infrastructure costs.
                    </p>
                  </div>

                  <button
                    type="button"
                    style={{
                    padding: '10px 24px',
                    backgroundColor: 'white',
                    border: '1px solid #007185',
                    borderRadius: '25px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#007185',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'background-color 0.2s',
                    whiteSpace: 'nowrap',
                    marginLeft: '20px'
                  }}
                  onClick={() => setShowInquiryModal(true)}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#F0F8FF'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  >
                    View purchase options
                  </button>
                </div>

                {/* Pricing Table Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '16px'
                }}>
                  <h4 style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#16191f',
                    margin: 0,
                    fontFamily: 'inherit'
                  }}>
                    12-month contract (2)
                  </h4>
                  <a href="#" style={{
                    fontSize: '13px',
                    color: 'rgb(0, 113, 133)',
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
                    <div>Where to buy</div>
                    <div>Description</div>
                    <div>Cost/12 months</div>
                  </div>

                  {/* Table Rows - Hardcoded frontend data */}
                  {[
                    {
                      whereToBuy: 'Buy on PIMS',
                      description: 'Starting your Identity journey? Put a strong foundation in place.',
                      cost: 'Request a Quote'
                    },
                    {
                      whereToBuy: 'Buy on AWS',
                      description: 'Want to keep Identity at pace with growth? Get more must-haves',
                      cost: 'Request a Quote'
                    },
                    {
                      whereToBuy: 'Buy on Microsoft Azure',
                      description: 'Want to keep Identity at pace with growth? Get more must-haves',
                      cost: 'Request a Quote'
                    }
                  ].map((row, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '150px 200px 120px' : '2fr 3fr 1.5fr',
                        padding: isMobile ? '12px' : '16px',
                        borderBottom: index < 2 ? '1px solid #D5D9D9' : 'none',
                        fontSize: isMobile ? '12px' : '14px',
                        color: '#16191f',
                        fontFamily: 'inherit',
                        backgroundColor: 'white',
                        minWidth: isMobile ? '470px' : 'auto'
                      }}
                    >
                      <div style={{ fontWeight: '400' }}>{row.whereToBuy}</div>
                      <div style={{ color: '#16191f' }}>{row.description}</div>
                      <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                        {row.cost === 'Request a Quote' ? (
                          <button
                            type="button"
                            style={{
                              padding: '8px 16px',
                              backgroundColor: 'white',
                              border: '1px solid rgb(0, 113, 133)',
                              borderRadius: '25px',
                              fontSize: '13px',
                              fontWeight: '600',
                              color: 'rgb(0, 113, 133)',
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                              transition: 'background-color 0.2s',
                              whiteSpace: 'nowrap'
                            }}
                            onClick={() => setShowInquiryModal(true)}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = '#F0F8FF';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = 'white';
                            }}
                          >
                            Request a Quote
                          </button>
                        ) : row.cost === 'Request Private Offer' ? (
                          <button
                            type="button"
                            style={{
                              padding: '8px 16px',
                              backgroundColor: 'white',
                              border: '1px solid rgb(0, 113, 133)',
                              borderRadius: '25px',
                              fontSize: '13px',
                              fontWeight: '600',
                              color: 'rgb(0, 113, 133)',
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                              transition: 'background-color 0.2s',
                              whiteSpace: 'nowrap'
                            }}
                            onClick={() => setShowInquiryModal(true)}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = '#F0F8FF';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = 'white';
                            }}
                          >
                            Request Private Offer
                          </button>
                        ) : row.cost === 'Request Pricing' ? (
                          <button
                            type="button"
                            style={{
                              padding: '8px 16px',
                              backgroundColor: 'white',
                              border: '1px solid rgb(0, 113, 133)',
                              borderRadius: '25px',
                              fontSize: '13px',
                              fontWeight: '600',
                              color: 'rgb(0, 113, 133)',
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                              transition: 'background-color 0.2s',
                              whiteSpace: 'nowrap'
                            }}
                            onClick={() => setShowInquiryModal(true)}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = '#F0F8FF';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = 'white';
                            }}
                          >
                            Request Pricing
                          </button>
                        ) : (
                          row.cost
                        )}
                      </div>
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
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#16191f',
                  marginBottom: '12px',
                  fontFamily: 'inherit'
                }}>
                  Vendor Refund Policy
                </h3>
                <p style={{
                  fontSize: '13px',
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
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#16191f',
                    marginBottom: '8px',
                    fontFamily: 'inherit'
                  }}>
                    Custom Pricing Options
                  </h3>
                  <p style={{
                    fontSize: '13px',
                    color: '#16191f',
                    margin: 0,
                    fontFamily: 'inherit'
                  }}>
                    Request a private offer to receive a custom quote.
                  </p>
                </div>
                <button
                  type="button"
                  style={{
                  padding: '10px 24px',
                  backgroundColor: 'white',
                  border: '1px solid #007185',
                  borderRadius: '25px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#007185',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'background-color 0.2s',
                  whiteSpace: 'nowrap',
                  marginLeft: '20px'
                }}
                onClick={() => setShowInquiryModal(true)}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#F0F8FF';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                }}
                >
                  Request private offer
                </button>
              </div>
          </section>
    </>
  );
}
