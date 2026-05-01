/** Shared layout surfaces — keep in sync with MarketplaceProductDetail styling. */

export function getSectionShell(isMobile) {
  return {
    position: 'relative',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: isMobile ? '16px 14px 18px' : '18px 20px 20px',
    marginBottom: isMobile ? '12px' : '14px',
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05), 0 0 0 1px rgba(15, 23, 42, 0.04)',
    border: '1px solid #e2e8f0',
    borderLeft: '3px solid #df2020',
    scrollMarginTop: '100px',
  };
}

export function getHeroShell(isMobile) {
  return {
    position: 'relative',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: isMobile ? '16px 16px 0' : '22px 24px 0',
    marginBottom: isMobile ? '8px' : '10px',
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05), 0 0 0 1px rgba(15, 23, 42, 0.04)',
    border: '1px solid #e2e8f0',
    borderLeft: '3px solid #111A45',
  };
}

export function getTabsStripInHero(isMobile) {
  return {
    marginTop: isMobile ? '10px' : '14px',
    paddingTop: isMobile ? '10px' : '12px',
    paddingBottom: isMobile ? '10px' : '12px',
    borderTop: '1px solid #eef2f7',
    overflowX: 'auto',
    scrollbarWidth: 'thin',
  };
}
