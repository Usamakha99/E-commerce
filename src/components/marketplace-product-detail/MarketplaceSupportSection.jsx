import React from 'react';

export default function MarketplaceSupportSection({ product, isMobile, sectionShell }) {
  return (
    <>
          <section id="support" style={sectionShell}>
              <h2 style={{
                fontSize: isMobile ? '18px' : '22px',
                fontWeight: '700',
                color: '#16191f',
                marginBottom: '16px',
                fontFamily: 'inherit',
                letterSpacing: '-0.01em'
              }}>
                Support
              </h2>

              <div className="row">
                {/* Vendor Support Card */}
                <div className="col-lg-6 mb-3">
                  <div style={{
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '18px',
                    backgroundColor: 'white',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <h3 style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#16191f',
                      marginBottom: '16px',
                      fontFamily: 'inherit'
                    }}>
                      {product.supportTitle || 'Vendor support'}
                    </h3>

                    <p style={{
                      fontSize: '13px',
                      color: '#374151',
                      lineHeight: '1.7',
                      marginBottom: '20px',
                      fontFamily: 'inherit'
                    }}>
                      {product.supportDescription || 'Contact the vendor for support inquiries and assistance.'}
                    </p>

                    <div style={{
                      fontSize: '13px',
                      color: '#16191f',
                      lineHeight: '1.6',
                      fontFamily: 'inherit'
                    }}>
                      {product.supportUrl && (
                      <p style={{ marginBottom: '12px' }}>
                        For additional information please visit{' '}
                        <a
                            href={product.supportUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                              color: 'rgb(0, 113, 133)',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          onMouseEnter={(e) => {
                              e.target.style.color = 'rgb(0, 95, 115)';
                            e.target.style.textDecoration = 'underline';
                          }}
                          onMouseLeave={(e) => {
                              e.target.style.color = 'rgb(0, 113, 133)';
                            e.target.style.textDecoration = 'none';
                          }}
                        >
                            {product.supportUrl}
                          <span style={{ fontSize: '12px' }}>🔗</span>
                        </a>.
                      </p>
                      )}

                      {product.supportEmail && (
                        <p style={{ margin: product.supportUrl ? 0 : '0 0 12px 0' }}>
                        You can also email{' '}
                        <a
                            href={`mailto:${product.supportEmail}`}
                          style={{
                              color: 'rgb(0, 113, 133)',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          onMouseEnter={(e) => {
                              e.target.style.color = 'rgb(0, 95, 115)';
                            e.target.style.textDecoration = 'underline';
                          }}
                          onMouseLeave={(e) => {
                              e.target.style.color = 'rgb(0, 113, 133)';
                            e.target.style.textDecoration = 'none';
                          }}
                        >
                            {product.supportEmail}
                          <span style={{ fontSize: '12px' }}>🔗</span>
                        </a>.
                      </p>
                      )}

                      {product.supportPhone && (
                        <p style={{ margin: 0 }}>
                          Call us at{' '}
                          <a
                            href={`tel:${product.supportPhone}`}
                            style={{
                              color: 'rgb(0, 113, 133)',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.color = 'rgb(0, 95, 115)';
                              e.target.style.textDecoration = 'underline';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.color = 'rgb(0, 113, 133)';
                              e.target.style.textDecoration = 'none';
                            }}
                          >
                            {product.supportPhone}
                            <span style={{ fontSize: '12px' }}>🔗</span>
                          </a>.
                        </p>
                      )}

                      {!product.supportUrl && !product.supportEmail && !product.supportPhone && (
                        <p style={{ margin: 0, color: '#6B7280' }}>
                          No support contact information available.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* AWS Infrastructure Support Card - Show if awsSupport data exists in API */}
                {((product.supportData?.awsSupport) || product.awsSupportTitle || product.awsSupportDescription || product.awsSupportUrl || product.deployedOnAWS) && (
                <div className="col-lg-6 mb-3">
                  <div style={{
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '18px',
                    backgroundColor: 'white',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <h3 style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#16191f',
                      marginBottom: '16px',
                      fontFamily: 'inherit'
                    }}>
                      {product.awsSupportTitle || 'AWS infrastructure support'}
                    </h3>

                    <p style={{
                      fontSize: '13px',
                      color: '#374151',
                      lineHeight: '1.7',
                      marginBottom: '20px',
                      fontFamily: 'inherit',
                      flex: 1
                    }}>
                      {product.awsSupportDescription || 'AWS Support is a one-on-one, fast-response support channel that is staffed 24x7x365 with experienced and technical support engineers. The service helps customers of all sizes and technical abilities to successfully utilize the products and features provided by Amazon Web Services.'}
                    </p>

                    {product.awsSupportUrl ? (
                      <a
                        href={product.awsSupportUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                      padding: '10px 24px',
                      backgroundColor: 'white',
                          border: '1px solid rgb(0, 113, 133)',
                      borderRadius: '25px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'rgb(0, 113, 133)',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'background-color 0.2s',
                          display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                          alignSelf: 'flex-start',
                          textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#F0F8FF'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
                      {product.awsSupportButtonText || 'Get support'}
                      <span style={{ fontSize: '12px' }}>🔗</span>
                      </a>
                    ) : (
                      <a
                        href="https://aws.amazon.com/support/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '10px 24px',
                          backgroundColor: 'white',
                          border: '1px solid rgb(0, 113, 133)',
                          borderRadius: '25px',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: 'rgb(0, 113, 133)',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          transition: 'background-color 0.2s',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          alignSelf: 'flex-start',
                          textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#F0F8FF'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                      >
                        {product.awsSupportButtonText || 'Get support'}
                        <span style={{ fontSize: '12px' }}>🔗</span>
                      </a>
                    )}
                  </div>
                </div>
                )}
              </div>
          </section>
    </>
  );
}
