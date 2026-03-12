import React from 'react';

/**
 * Product header for Marketplace Product Detail: logo, title, short description (with show more/less), action buttons.
 */
const MarketplaceProductDetailHeader = ({
  product,
  isMobile,
  isTablet,
  isShortDescriptionExpanded,
  onShortDescriptionToggle,
  renderTextWithLinks,
  onOpenInquiryModal,
}) => {
  if (!product) return null;

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: isMobile ? '24px' : '40px',
      marginBottom: '32px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      border: '1px solid #E5E7EB',
    }}>
      <div className="row">
        <div className="col-lg-8">
          <div style={{ display: 'flex', gap: isMobile ? '15px' : '25px', alignItems: 'flex-start' }}>
            <div style={{
              width: isMobile ? '72px' : '96px',
              height: isMobile ? '72px' : '96px',
              flexShrink: 0,
              backgroundColor: '#F9FAFB',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '14px',
              border: '1px solid #E5E7EB',
            }}>
              <img
                src={product.logo}
                alt={product.name}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{
                fontSize: isMobile ? '24px' : '32px',
                fontWeight: '700',
                color: '#16191f',
                margin: '0 0 20px 0',
                fontFamily: 'inherit',
                lineHeight: '1.3',
                letterSpacing: '-0.02em',
              }}>
                {product.name}
              </h1>
              <div style={{
                fontSize: '15px',
                fontWeight: '500',
                color: '#000000',
                lineHeight: '1.7',
                margin: '0 0 16px 0',
                fontFamily: 'inherit',
                display: '-webkit-box',
                WebkitLineClamp: isShortDescriptionExpanded ? 'none' : 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxHeight: isShortDescriptionExpanded ? 'none' : '51px',
                transition: 'max-height 0.3s ease',
              }}>
                <p style={{ margin: 0 }}>{renderTextWithLinks(product.shortDescription)}</p>
              </div>
              {product.shortDescription && product.shortDescription.length > 100 && (
                <button
                  type="button"
                  onClick={onShortDescriptionToggle}
                  style={{
                    fontSize: '14px',
                    fontWeight: '400',
                    color: 'rgb(0, 113, 133)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textDecoration: 'none',
                    marginTop: '8px',
                    marginBottom: '14px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textDecoration = 'underline';
                    e.currentTarget.style.color = 'rgb(0, 95, 115)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textDecoration = 'none';
                    e.currentTarget.style.color = 'rgb(0, 113, 133)';
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                    <rect width="16" height="16" rx="2" fill="rgb(0, 113, 133)" />
                    {isShortDescriptionExpanded ? (
                      <line x1="4" y1="8" x2="12" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    ) : (
                      <path d="M8 4V12M4 8H12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    )}
                  </svg>
                  <span>{isShortDescriptionExpanded ? 'Show less' : 'Show more'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-4" style={{ marginTop: isTablet ? '25px' : 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              type="button"
              style={{
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
                boxShadow: '0 2px 8px rgba(17, 26, 69, 0.2)',
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
              onClick={onOpenInquiryModal}
            >
              View Purchase Options
            </button>
            <button
              type="button"
              style={{
                padding: '14px 28px',
                backgroundColor: 'white',
                border: '2px solid #111A45',
                borderRadius: '25px',
                fontSize: '15px',
                fontWeight: '600',
                color: '#16191f',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.3s ease',
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
              onClick={onOpenInquiryModal}
            >
              Try for Free
            </button>
            <button
              type="button"
              style={{
                padding: '14px 28px',
                backgroundColor: 'white',
                border: '2px solid #6B7280',
                borderRadius: '25px',
                fontSize: '15px',
                fontWeight: '600',
                color: '#16191f',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.3s ease',
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
              onClick={onOpenInquiryModal}
            >
              Request Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceProductDetailHeader;
