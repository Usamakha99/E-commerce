import React from 'react';

export default function MarketplaceResourcesSection({ product, isMobile, sectionShell }) {
  return (
    <>
          <section id="resources" style={sectionShell}>
              <h2 style={{
                fontSize: isMobile ? '18px' : '22px',
                fontWeight: '700',
                color: '#16191f',
                marginBottom: '16px',
                fontFamily: 'inherit',
                letterSpacing: '-0.01em'
              }}>
                Resources
              </h2>

              {/* Vendor Resources Card */}
              <div style={{
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                backgroundColor: 'white',
                overflow: 'hidden',
                boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
              }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 18px',
                    background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
                    borderBottom: '1px solid #e8ecf1',
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'linear-gradient(145deg, rgba(0, 113, 133, 0.12), rgba(0, 113, 133, 0.06))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                    aria-hidden
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.5 10.5L21 3m0 0h-6m6 0v6M8 21H4.8c-.84 0-1.26 0-1.59-.16a1.5 1.5 0 00-.66-.66C2.32 19.85 2 19.43 2 18.6V8.4c0-.84 0-1.26.16-1.59a1.5 1.5 0 01.66-.66C3.54 6 3.96 6 4.8 6h4.5M15 21v-4.8c0-.84 0-1.26-.16-1.59a1.5 1.5 0 00-.66-.66C13.46 14.32 13.04 14 12.2 14H8.4c-.84 0-1.26 0-1.59.16a1.5 1.5 0 00-.66.66C6 15.14 6 15.56 6 16.4V21" stroke="rgb(0, 113, 133)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#111827',
                      margin: 0,
                      fontFamily: 'inherit',
                      letterSpacing: '-0.01em',
                    }}>
                      Vendor resources
                    </h3>
                    <p style={{
                      margin: '2px 0 0 0',
                      fontSize: '12px',
                      color: '#64748b',
                      fontFamily: 'inherit',
                    }}>
                      Documentation and external links open in a new tab
                    </p>
                  </div>
                </div>

                {/* Links list */}
                <div style={{ padding: 0 }}>
                  {(() => {
                    let resourceLinksList = product.resourceLinks || [];

                    if (!resourceLinksList || resourceLinksList.length === 0) {
                      resourceLinksList = product.resources || [];
                    }

                    if (product.documentationUrl && !resourceLinksList.find(r => (r.url || r.link || r.href) === product.documentationUrl)) {
                      resourceLinksList.push({
                        title: 'Documentation',
                        url: product.documentationUrl,
                        name: 'Documentation',
                        link: product.documentationUrl
                      });
                    }

                    if (product.website && !resourceLinksList.find(r => (r.url || r.link || r.href) === product.website)) {
                      resourceLinksList.push({
                        title: 'Website',
                        url: product.website,
                        name: 'Website',
                        link: product.website
                      });
                    }

                    if (resourceLinksList.length > 0) {
                      return resourceLinksList.map((resource, index) => {
                        const resourceUrl = resource.url || resource.link || resource.href || (typeof resource === 'string' ? resource : '#');
                        const resourceTitle = resource.title || resource.name || resource.label || (typeof resource === 'string' ? resource : `Resource ${index + 1}`);
                        const isLast = index === resourceLinksList.length - 1;

                        return (
                          <a
                            key={index}
                            href={resourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '12px',
                              padding: '12px 18px',
                              textDecoration: 'none',
                              fontFamily: 'inherit',
                              fontSize: '13px',
                              fontWeight: '500',
                              color: 'rgb(0, 113, 133)',
                              borderBottom: isLast ? 'none' : '1px solid #f1f5f9',
                              transition: 'background-color 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#f8fafc';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <span style={{ color: 'rgb(0, 113, 133)', fontWeight: '500' }}>{resourceTitle}</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', color: 'rgb(0, 113, 133)', flexShrink: 0 }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <path d="M7 17L17 7M17 7H9M17 7v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                          </a>
                        );
                      });
                    }

                    return (
                      <p style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'inherit', margin: 0, padding: '18px' }}>
                        No resources available at this time.
                      </p>
                    );
                  })()}
                </div>
              </div>
          </section>

    </>
  );
}
