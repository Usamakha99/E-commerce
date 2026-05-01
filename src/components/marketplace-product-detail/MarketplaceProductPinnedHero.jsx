import React from 'react';

export default function MarketplaceProductPinnedHero({
  product,
  isMobile,
  isTablet,
  headerClearance,
  productBarPinned,
  setShowInquiryModal,
  renderMarketplaceTabs,
  renderStars,
  heroShortDescriptionRef,
  isShortDescriptionExpanded,
  setIsShortDescriptionExpanded,
  heroShortDescriptionNeedsToggle,
  renderTextWithLinks,
  heroShell,
  tabsStripInHero,
}) {
  return (
    <>
        {/* AWS-style: scrolled = compact fixed bar (logo + title + primary CTA + tabs) */}
        {productBarPinned && (
          <div
            role="region"
            aria-label="Product"
            style={{
              position: 'fixed',
              top: headerClearance,
              left: 0,
              right: 0,
              zIndex: 98,
              background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 55%, #ffffff 100%)',
              borderBottom: '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(15, 26, 69, 0.12)',
              borderLeft: '4px solid #111A45',
            }}
          >
            <div className="container-fluid" style={{ padding: isMobile ? '12px 15px 10px' : '14px 40px 12px', maxWidth: '100%' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 14,
                marginBottom: 10,
              }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
                  <div style={{
                    width: isMobile ? '40px' : '46px',
                    height: isMobile ? '40px' : '46px',
                    flexShrink: 0,
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '7px',
                    border: '1px solid rgba(17, 26, 69, 0.12)',
                    boxShadow: '0 2px 10px rgba(17, 26, 69, 0.12)',
                  }}
                  >
                    <img src={product.logo} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                  <h2
                    title={product.name}
                    style={{
                      margin: 0,
                      fontSize: isMobile ? '14px' : '16px',
                      fontWeight: '700',
                      color: '#111A45',
                      fontFamily: 'inherit',
                      lineHeight: 1.3,
                      letterSpacing: '-0.03em',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {product.name}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInquiryModal(true)}
                  style={{
                    flexShrink: 0,
                    padding: isMobile ? '9px 16px' : '10px 22px',
                    background: 'linear-gradient(180deg, #ffb84d 0%, #FF9900 100%)',
                    border: 'none',
                    borderRadius: '22px',
                    fontSize: isMobile ? '12px' : '13px',
                    fontWeight: '600',
                    color: '#111',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    boxShadow: '0 2px 8px rgba(255, 153, 0, 0.45)',
                  }}
                >
                  Request private offer
                </button>
              </div>
              <div style={{ paddingTop: 2, paddingBottom: 2 }}>
                {renderMarketplaceTabs(true, true)}
              </div>
            </div>
          </div>
        )}

        {/* Product Header — full layout at page top (AWS prodview unscrolled) */}
        <div style={heroShell}>
          <div className="row">
            <div className="col-lg-8">
              <div style={{ display: 'flex', gap: isMobile ? '15px' : '25px', alignItems: 'flex-start' }}>
                <div style={{
                  width: isMobile ? '72px' : '96px',
                  height: isMobile ? '72px' : '96px',
                  flexShrink: 0,
                  backgroundColor: '#F9FAFB',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '14px',
                  border: '1px solid #E5E7EB'
                }}>
                  <img src={product.logo} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h1 style={{ fontSize: isMobile ? '18px' : '24px', fontWeight: '700', color: '#16191f', margin: '0 0 10px 0', fontFamily: 'inherit', lineHeight: '1.3', letterSpacing: '-0.02em' }}>
                    {product.name}
                  </h1>
                  <div style={{ fontSize: '13px', color: '#545b64', marginBottom: '10px', fontFamily: 'inherit' }}>
                    Sold by:{' '}
                    <span style={{ color: '#0073bb' }}>{product.seller}</span>
                  </div>
                  {product.deployedOnAWS && (
                    <div style={{ marginBottom: '10px' }}>
                      <span style={{
                        display: 'inline-block',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#232f3e',
                        border: '1px solid #d5dbdb',
                        borderRadius: '4px',
                        padding: '3px 10px',
                        backgroundColor: '#fafafa',
                        fontFamily: 'inherit',
                      }}
                      >
                        Deployed on AWS
                      </span>
                    </div>
                  )}
                  {(product.rating > 0 || product.externalReviews > 0) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '12px', flexWrap: 'wrap' }}>
                      {product.rating > 0 && <span style={{ display: 'flex', alignItems: 'center' }}>{renderStars(product.rating)}</span>}
                      {product.externalReviews > 0 && (
                        <span style={{ fontSize: '13px', color: '#545b64', fontFamily: 'inherit' }}>
                          ({product.externalReviews})
                        </span>
                      )}
                    </div>
                  )}
                  <div
                    ref={heroShortDescriptionRef}
                    style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#000000',
                    lineHeight: '1.7',
                    margin: '0 0 8px 0',
                    fontFamily: 'inherit',
                    display: '-webkit-box',
                    WebkitLineClamp: isShortDescriptionExpanded ? 'none' : 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    transition: 'opacity 0.2s ease'
                  }}
                  >
                    <p style={{ margin: 0 }}>{renderTextWithLinks(product.shortDescription)}</p>
                  </div>
                  {product.shortDescription?.trim() && heroShortDescriptionNeedsToggle && (
                    <button
                      type="button"
                      onClick={() => setIsShortDescriptionExpanded(!isShortDescriptionExpanded)}
                      style={{ fontSize: '13px', fontWeight: '400', color: 'rgb(0, 113, 133)', backgroundColor: 'transparent', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'none', marginTop: '4px', marginBottom: '0', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; e.currentTarget.style.color = 'rgb(0, 95, 115)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; e.currentTarget.style.color = 'rgb(0, 113, 133)'; }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                        <rect width="16" height="16" rx="2" fill="rgb(0, 113, 133)" />
                        {isShortDescriptionExpanded ? <line x1="4" y1="8" x2="12" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round" /> : <path d="M8 4V12M4 8H12" stroke="white" strokeWidth="2" strokeLinecap="round" />}
                      </svg>
                      <span>{isShortDescriptionExpanded ? 'Show less' : 'Show more'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-4" style={{ marginTop: isTablet ? '25px' : 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button type="button" style={{ padding: '14px 28px', backgroundColor: '#111A45', border: 'none', borderRadius: '25px', fontSize: '14px', fontWeight: '600', color: 'white', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.3s ease', boxShadow: '0 2px 8px rgba(17, 26, 69, 0.2)' }} onMouseEnter={(e) => { e.target.style.backgroundColor = '#0D1433'; e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 4px 12px rgba(17, 26, 69, 0.3)'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = '#111A45'; e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 2px 8px rgba(17, 26, 69, 0.2)'; }} onClick={() => setShowInquiryModal(true)}>View Purchase Options</button>
                <button type="button" style={{ padding: '14px 28px', backgroundColor: 'white', border: '2px solid #6B7280', borderRadius: '25px', fontSize: '14px', fontWeight: '600', color: '#16191f', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.target.style.borderColor = '#111A45'; e.target.style.color = '#16191f'; e.target.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.target.style.borderColor = '#6B7280'; e.target.style.color = '#16191f'; e.target.style.transform = 'translateY(0)'; }} onClick={() => setShowInquiryModal(true)}>Request Demo</button>
              </div>
            </div>
          </div>

          {!productBarPinned && (
            <div style={tabsStripInHero}>
              {renderMarketplaceTabs(false)}
            </div>
          )}
        </div>
    </>
  );
}
