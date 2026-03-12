import React from 'react';

const TABS = [
  'Overview',
  'Features',
  'Resources',
  'Support',
  'Product comparison',
  'How to buy',
];

/**
 * Sticky tab navigation for Marketplace Product Detail. Scrolls to section on click.
 */
const MarketplaceTabsNav = ({ activeTab, onTabClick, isMobile }) => (
  <div style={{
    position: 'sticky',
    top: '70px',
    zIndex: 100,
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '8px',
    marginBottom: '32px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    border: '1px solid #E5E7EB',
    overflowX: 'auto',
    scrollbarWidth: 'thin',
  }}>
    <div style={{
      display: 'flex',
      gap: '8px',
      flexWrap: isMobile ? 'nowrap' : 'wrap',
    }}>
      {TABS.map((tab, index) => {
        const tabId = tab.toLowerCase().replace(/\s+/g, '-');
        const isActive = activeTab === tabId;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onTabClick(tab)}
            style={{
              padding: '10px 20px',
              border: 'none',
              backgroundColor: isActive ? '#df2020' : 'transparent',
              color: isActive ? 'white' : '#6B7280',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: isActive ? '600' : '500',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.target.style.backgroundColor = '#F3F4F6';
                e.target.style.color = '#16191f';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#6B7280';
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
                boxShadow: '0 2px 6px rgba(223, 32, 32, 0.4)',
              }}>
                NEW
              </span>
            )}
          </button>
        );
      })}
    </div>
  </div>
);

export default MarketplaceTabsNav;
export { TABS };
