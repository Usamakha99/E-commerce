import React from 'react';

export default function MarketplaceProductComparisonSection({
  product,
  agent,
  isMobile,
  sectionShell,
}) {
  return (
    <>
          <section id="product-comparison" style={sectionShell}>
              {/* Header */}
              <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'center',
                marginBottom: '16px',
                gap: isMobile ? '12px' : '0',
                paddingBottom: '12px',
                borderBottom: '2px solid rgb(0, 113, 133)',
                borderImage: 'linear-gradient(90deg, rgb(0, 113, 133) 0%, rgba(0, 113, 133, 0.4) 100%) 1'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    background: 'linear-gradient(145deg, rgb(0, 113, 133), #005f73)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0, 113, 133, 0.35)'
                  }}>
                    <span style={{ fontSize: '24px' }}>⚖️</span>
                  </div>
                  <div>
                    <h2 style={{
                      fontSize: isMobile ? '18px' : '22px',
                      fontWeight: '800',
                      color: '#0f172a',
                      margin: '0 0 6px 0',
                      fontFamily: 'inherit',
                      letterSpacing: '-0.02em'
                    }}>
                      Product comparison
                    </h2>
                    <p style={{
                      fontSize: '13px',
                      color: '#64748b',
                      margin: 0,
                      fontFamily: 'inherit',
                      fontWeight: '500'
                    }}>
                      {product.updatedWeekly ? 'Updated weekly' : product.comparisonTitle || 'Compare this product with similar alternatives'}
                    </p>
                  </div>
                </div>
                {product.comparisonProducts && product.comparisonProducts.length > 0 && (
                  <div style={{
                    padding: '8px 14px',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(0, 113, 133, 0.1)',
                    color: 'rgb(0, 113, 133)',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    {product.comparisonProducts.length + 1} products
                  </div>
                )}
              </div>

              {/* Show message if no comparison data available */}
              {(!product.comparisonProducts || product.comparisonProducts.length === 0) && (!product.comparisonDataRows || product.comparisonDataRows.length === 0) ? (
                <div style={{
                    border: '1px solid rgba(0, 113, 133, 0.2)',
                    borderRadius: '8px',
                    padding: '48px 32px',
                    backgroundColor: 'white',
                    textAlign: 'center',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
                }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>📊</div>
                  <p style={{
                    fontSize: '13px',
                    color: '#64748b',
                    fontFamily: 'inherit',
                    margin: 0,
                    fontWeight: '500'
                  }}>
                    Product comparison data is not available at this time.
                  </p>
                </div>
              ) : product.comparisonDataRows && product.comparisonDataRows.length > 0 ? (
              (() => {
                const rows = product.comparisonDataRows;
                const compProducts = product.comparisonProducts || [];
                const catDescs = product.comparisonCategoryDescriptions || {};
                const grouped = {};
                rows.forEach((r) => {
                  const c = r.category || 'General';
                  if (!grouped[c]) grouped[c] = [];
                  grouped[c].push(r);
                });
                const nCols = compProducts.length;
                const gridCols = isMobile ? `150px repeat(${nCols + 1}, 200px)` : `250px repeat(${nCols + 1}, 1fr)`;
                const minW = isMobile ? 150 + (nCols + 1) * 200 : 'auto';
                const getSentiment = (v) => (v != null && typeof v === 'string' ? (v.toLowerCase().includes('positive') ? 'positive' : v.toLowerCase().includes('mixed') ? 'mixed' : v.toLowerCase().includes('negative') ? 'negative' : null) : null);
                const renderCell = (val) => {
                  const text = val != null ? String(val).trim() : '—';
                  const s = getSentiment(text);
                  if (s) {
                    const w = s === 'positive' ? 85 : s === 'mixed' ? 50 : 20;
                    const color = s === 'positive' ? '#10b981' : s === 'mixed' ? '#6B7280' : '#EF4444';
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{s === 'positive' ? '↑' : '↓'} {text}</span>
                        <div style={{ height: 6, background: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${w}%`, height: '100%', background: color, borderRadius: 3 }} />
                        </div>
                      </div>
                    );
                  }
                  return <span style={{ fontSize: 14 }}>{text || '—'}</span>;
                };
                return (
                  <div style={{ 
                    border: '1px solid rgba(0, 113, 133, 0.2)', 
                    borderRadius: '8px', 
                    backgroundColor: 'white', 
                    overflow: isMobile ? 'auto' : 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: gridCols, borderBottom: '2px solid rgb(0, 113, 133)', backgroundColor: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%)', minWidth: minW, background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
                      <div style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 20, filter: 'grayscale(0)' }}>📊</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#0c4a6e' }}>Compare</span>
                      </div>
                      <div style={{ padding: 20, borderLeft: '1px solid rgba(0, 113, 133, 0.2)', backgroundColor: '#fff', borderRight: '2px solid rgb(0, 113, 133)', boxShadow: 'inset 0 0 0 1px rgba(0, 113, 133, 0.15)' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#0c4a6e', marginBottom: 4 }}>This product</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>by {agent?.provider || product?.seller || '—'}</div>
                      </div>
                      {compProducts.map((p, idx) => (
                        <div key={p.id || idx} style={{ padding: 20, borderLeft: '1px solid rgba(0, 113, 133, 0.15)', backgroundColor: idx % 2 === 0 ? '#fafafa' : '#f8fafc' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            {p.logoUrl ? <img src={p.logoUrl} alt="" style={{ width: 50, height: 50, objectFit: 'contain', borderRadius: 10 }} /> : <div style={{ width: 50, height: 50, background: 'linear-gradient(145deg, #0ea5e9, #0284c7)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#fff', fontWeight: 'bold', boxShadow: '0 2px 8px rgba(14, 165, 233, 0.3)' }}>{p.icon || (p.provider || p.name || '?').substring(0, 2).toUpperCase()}</div>}
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{p.name || p.product_name || p.title || `Product ${idx + 1}`}</div>
                              <div style={{ fontSize: 12, color: '#64748b' }}>by {p.provider || p.brand || '—'}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {Object.entries(grouped).map(([cat, catRows]) => (
                      <React.Fragment key={cat}>
                        <div style={{ display: 'grid', gridTemplateColumns: gridCols, minWidth: minW, borderBottom: '1px solid #e2e8f0', backgroundColor: '#f1f5f9', padding: '14px 20px' }}>
                          <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>{cat}</div>
                          <div style={{ borderLeft: '1px solid rgba(0, 113, 133, 0.15)', fontSize: 13, color: '#64748b', paddingLeft: 20 }}>{catDescs[cat] || ''}</div>
                          {compProducts.map((_, i) => <div key={i} style={{ borderLeft: '1px solid rgba(0, 113, 133, 0.15)' }} />)}
                        </div>
                        {catRows.map((row) => (
                          <div key={row.id || row.feature} style={{ display: 'grid', gridTemplateColumns: gridCols, minWidth: minW, borderBottom: '1px solid #e2e8f0', backgroundColor: '#fafafa' }}>
                            <div style={{ padding: '16px 20px', fontWeight: 600, fontSize: 13, color: '#334155' }}>{row.feature || '—'}</div>
                            <div style={{ padding: '16px 20px', borderLeft: '1px solid rgba(0, 113, 133, 0.15)', backgroundColor: '#fff' }}>{renderCell(row.values?.thisProduct)}</div>
                            {compProducts.map((p) => (
                              <div key={p.id} style={{ padding: '16px 20px', borderLeft: '1px solid rgba(0, 113, 133, 0.15)' }}>{renderCell(row.values?.[`product_${p.id}`] ?? row.values?.[p.id])}</div>
                            ))}
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                );
              })()
              ) : (
              /* Comparison Table - Display actual products from API (legacy) – uniquely styled */
              <div style={{
                border: '1px solid rgba(0, 113, 133, 0.2)',
                borderRadius: '8px',
                backgroundColor: 'white',
                overflow: isMobile ? 'auto' : 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
              }}>
                {/* Product Headers */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile 
                    ? `150px repeat(${product.comparisonProducts.length}, 200px)` 
                    : `250px repeat(${product.comparisonProducts.length}, 1fr)`,
                  borderBottom: '2px solid rgb(0, 113, 133)',
                  background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%)',
                  minWidth: isMobile ? `${150 + (product.comparisonProducts.length * 200)}px` : 'auto'
                }}>
                    <div style={{
                    padding: '20px',
                      display: 'flex',
                      alignItems: 'center',
                    gap: '10px'
                  }}>
                    <span style={{ fontSize: '20px' }}>📊</span>
                    <span style={{ 
                          fontSize: '13px',
                          fontWeight: '700',
                          color: '#0c4a6e',
                          fontFamily: 'inherit'
                    }}>Compare</span>
                        </div>
                  {/* Dynamic Product Headers from API */}
                  {product.comparisonProducts.map((compProduct, index) => {
                    const brandInitials = (compProduct.provider || compProduct.product_name || compProduct.name || 'N/A').substring(0, 2).toUpperCase();
                    const brandGradients = [
                      'linear-gradient(145deg, #0f172a, #1e293b)',
                      'linear-gradient(145deg, #0ea5e9, #0284c7)',
                      'linear-gradient(145deg, #dc2626, #b91c1c)',
                      'linear-gradient(145deg, #059669, #047857)',
                      'linear-gradient(145deg, #d97706, #b45309)',
                      'linear-gradient(145deg, #7c3aed, #6d28d9)',
                      'linear-gradient(145deg, #db2777, #be185d)'
                    ];
                    const gradient = brandGradients[index % brandGradients.length];
                    
                    return (
                      <div key={index} style={{ 
                        padding: '20px', 
                        borderLeft: '1px solid rgba(0, 113, 133, 0.2)',
                        backgroundColor: index === 0 ? '#fff' : (index % 2 === 0 ? '#fafafa' : '#f8fafc'),
                        position: 'relative',
                        ...(index === 0 && { borderRight: '2px solid rgb(0, 113, 133)', boxShadow: 'inset 0 0 0 1px rgba(0, 113, 133, 0.12)' })
                      }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '8px'
                    }}>
                      <div style={{
                            width: '52px',
                            height: '52px',
                            background: gradient,
                            borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                            fontSize: '13px',
                            color: '#fff',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            border: '2px solid rgba(255,255,255,0.9)'
                          }}>
                            {brandInitials}
                      </div>
                          <div style={{ flex: 1 }}>
                        <div style={{
                              fontSize: '13px',
                              fontWeight: '700',
                          color: '#0f172a',
                              fontFamily: 'inherit',
                              marginBottom: '4px'
                        }}>
                              {compProduct.product_name || compProduct.model || compProduct.name || compProduct.title || `Product ${index + 1}`}
                        </div>
                        <div style={{
                          fontSize: '12px',
                              color: '#64748b',
                          fontFamily: 'inherit'
                        }}>
                              by {compProduct.brand || compProduct.provider || compProduct.seller || 'Unknown'}
                        </div>
                      </div>
                    </div>
                  </div>
                    );
                  })}
                </div>

                {/* Price Row */}
                {(() => {
                  // Find best (lowest) price - use pricing_model or price field
                  const prices = product.comparisonProducts.map(p => {
                    // Try to extract numeric price from pricing_model or use price field
                    if (p.pricing_model) {
                      const priceMatch = p.pricing_model.match(/\$?(\d+(?:\.\d+)?)/);
                      return priceMatch ? parseFloat(priceMatch[1]) : null;
                    }
                    return p.price != null && !isNaN(p.price) ? p.price : null;
                  }).filter(p => p != null);
                  const bestPrice = prices.length > 0 ? Math.min(...prices) : null;
                  
                    return (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile 
                        ? `150px repeat(${product.comparisonProducts.length}, 200px)` 
                        : `250px repeat(${product.comparisonProducts.length}, 1fr)`,
                      minWidth: isMobile ? `${150 + (product.comparisonProducts.length * 200)}px` : 'auto',
                      borderBottom: '1px solid #e2e8f0',
                      backgroundColor: '#fafafa'
                    }}>
                      <div style={{
                        padding: '16px 20px',
                        fontWeight: '600',
                        fontSize: '13px',
                        color: '#0f172a',
                        fontFamily: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span style={{ fontSize: '13px' }}>💰</span>
                        <span>Price</span>
                      </div>
                      {product.comparisonProducts.map((compProduct, index) => {
                        // Get price for comparison (extract from pricing_model or use price field)
                        let displayPrice = null;
                        let priceValue = null;

                        if (compProduct.pricing_model) {
                          displayPrice = compProduct.pricing_model;
                          const priceMatch = compProduct.pricing_model.match(/\$?(\d+(?:\.\d+)?)/);
                          priceValue = priceMatch ? parseFloat(priceMatch[1]) : null;
                        } else if (compProduct.price) {
                          displayPrice = `${compProduct.currency || 'USD'} ${compProduct.price}`;
                          priceValue = compProduct.price;
                        }

                        const isBestPrice = bestPrice && priceValue === bestPrice;

                        return (
                          <div key={index} style={{
                            padding: '16px 20px',
                            borderLeft: '1px solid rgba(0, 113, 133, 0.15)',
                          fontSize: '13px',
                            fontFamily: 'inherit',
                            backgroundColor: isBestPrice ? '#ecfdf5' : 'white',
                            position: 'relative'
                          }}>
                        <div style={{
                              fontWeight: isBestPrice ? '700' : '500',
                              color: isBestPrice ? '#059669' : '#0f172a',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              {displayPrice ? (
                                <>
                                  <span>{displayPrice}</span>
                                  {isBestPrice && (
                                    <span style={{
                                      fontSize: '10px',
                                      backgroundColor: '#059669',
                                      color: 'white',
                                      padding: '2px 8px',
                                      borderRadius: '10px',
                                      fontWeight: '600'
                                    }}>Best value</span>
                                  )}
                                </>
                              ) : (
                                <span style={{ color: '#94a3b8' }}>N/A</span>
                              )}
                        </div>
                      </div>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* Brand Row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile 
                    ? `150px repeat(${product.comparisonProducts.length}, 200px)` 
                    : `250px repeat(${product.comparisonProducts.length}, 1fr)`,
                  minWidth: isMobile ? `${150 + (product.comparisonProducts.length * 200)}px` : 'auto',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    padding: '16px 20px',
                    fontWeight: '600',
                    fontSize: '13px',
                    color: '#0f172a',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '13px' }}>🏷️</span>
                    <span>Brand</span>
                  </div>
                  {product.comparisonProducts.map((compProduct, index) => (
                    <div key={index} style={{ 
                      padding: '16px 20px', 
                      borderLeft: '1px solid rgba(0, 113, 133, 0.15)', 
                      fontSize: '13px', 
                      fontFamily: 'inherit',
                      backgroundColor: index % 2 === 0 ? 'white' : '#f8fafc'
                    }}>
                      <span style={{
                        fontWeight: '600',
                        color: '#334155'
                      }}>
                        {compProduct.provider || compProduct.brand || 'N/A'}
                      </span>
                    </div>
                  ))}
                  </div>

                {/* Free Trial Row */}
                    <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile
                    ? `150px repeat(${product.comparisonProducts.length}, 200px)`
                    : `250px repeat(${product.comparisonProducts.length}, 1fr)`,
                  minWidth: isMobile ? `${150 + (product.comparisonProducts.length * 200)}px` : 'auto',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                    <div style={{
                    padding: '16px 20px',
                    fontWeight: '600',
                    fontSize: '13px',
                      color: '#0f172a',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                    }}>
                    <span style={{ fontSize: '13px' }}>🎁</span>
                    <span>Free Trial</span>
                    </div>
                  {product.comparisonProducts.map((compProduct, index) => (
                    <div key={index} style={{ 
                      padding: '16px 20px', 
                      borderLeft: '1px solid rgba(0, 113, 133, 0.15)', 
                      fontSize: '13px', 
                      fontFamily: 'inherit',
                      backgroundColor: index % 2 === 0 ? 'white' : '#f8fafc'
                    }}>
                      <span style={{
                        fontWeight: '600',
                        color: '#0f172a'
                      }}>
                        {compProduct.free_trial || 'N/A'}
                      </span>
                  </div>
                  ))}
                </div>

                {/* Additional comparison rows – always visible (show more/less removed) */}
                <>
                {/* Display Row */}
                {product.comparisonProducts.some(p => p.display) && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile 
                    ? `150px repeat(${product.comparisonProducts.length}, 200px)` 
                    : `250px repeat(${product.comparisonProducts.length}, 1fr)`,
                  minWidth: isMobile ? `${150 + (product.comparisonProducts.length * 200)}px` : 'auto',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    padding: '16px 20px',
                    fontWeight: '600',
                    fontSize: '13px',
                    color: '#16191f',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '13px' }}>📺</span>
                    <span>Display</span>
                  </div>
                  {product.comparisonProducts.map((compProduct, index) => (
                    <div key={index} style={{ 
                      padding: '16px 20px', 
                      borderLeft: '1px solid rgba(0, 113, 133, 0.15)', 
                      fontSize: '13px', 
                      fontFamily: 'inherit',
                      backgroundColor: index % 2 === 0 ? 'white' : '#FAFAFA'
                    }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        backgroundColor: compProduct.display ? '#EFF6FF' : 'transparent',
                        borderRadius: '6px',
                        color: compProduct.display ? '#1E40AF' : '#9CA3AF',
                        fontWeight: compProduct.display ? '500' : '400'
                      }}>
                        {compProduct.display || '—'}
                    </div>
                      </div>
                  ))}
                      </div>
                )}

                {/* Processor Row */}
                {product.comparisonProducts.some(p => p.processor) && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile 
                    ? `150px repeat(${product.comparisonProducts.length}, 200px)` 
                    : `250px repeat(${product.comparisonProducts.length}, 1fr)`,
                  minWidth: isMobile ? `${150 + (product.comparisonProducts.length * 200)}px` : 'auto',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    padding: '16px 20px',
                    fontWeight: '600',
                    fontSize: '13px',
                    color: '#16191f',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '13px' }}>⚡</span>
                    <span>Processor</span>
                  </div>
                  {product.comparisonProducts.map((compProduct, index) => (
                    <div key={index} style={{ 
                      padding: '16px 20px', 
                      borderLeft: '1px solid rgba(0, 113, 133, 0.15)', 
                      fontSize: '13px', 
                      fontFamily: 'inherit',
                      backgroundColor: index % 2 === 0 ? 'white' : '#FAFAFA'
                }}>
                  <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        backgroundColor: compProduct.processor ? '#FEF3C7' : 'transparent',
                        borderRadius: '6px',
                        color: compProduct.processor ? '#92400E' : '#9CA3AF',
                        fontWeight: compProduct.processor ? '500' : '400'
                      }}>
                        {compProduct.processor || '—'}
                  </div>
                    </div>
                  ))}
                  </div>
                )}

                {/* RAM Row */}
                {product.comparisonProducts.some(p => p.ram) && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile 
                    ? `150px repeat(${product.comparisonProducts.length}, 200px)` 
                    : `250px repeat(${product.comparisonProducts.length}, 1fr)`,
                  minWidth: isMobile ? `${150 + (product.comparisonProducts.length * 200)}px` : 'auto',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    padding: '16px 20px',
                    fontWeight: '600',
                    fontSize: '13px',
                    color: '#16191f',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '13px' }}>💾</span>
                    <span>RAM</span>
                  </div>
                  {product.comparisonProducts.map((compProduct, index) => {
                    // Extract RAM size for comparison
                    const ramSize = compProduct.ram ? parseInt(compProduct.ram) : 0;
                    const maxRam = Math.max(...product.comparisonProducts.map(p => parseInt(p.ram) || 0));
                    const ramPercentage = maxRam > 0 ? (ramSize / maxRam) * 100 : 0;
                    
                    return (
                      <div key={index} style={{ 
                        padding: '16px 20px', 
                        borderLeft: '1px solid rgba(0, 113, 133, 0.15)', 
                        fontSize: '13px', 
                        fontFamily: 'inherit',
                        backgroundColor: index % 2 === 0 ? 'white' : '#FAFAFA'
                      }}>
                        <div style={{ marginBottom: '6px', fontWeight: '600', color: '#16191f' }}>
                          {compProduct.ram || '—'}
                    </div>
                        {compProduct.ram && ramSize > 0 && (
                          <div style={{
                            width: '100%',
                            height: '6px',
                            backgroundColor: '#E5E7EB',
                            borderRadius: '3px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${ramPercentage}%`,
                              height: '100%',
                              backgroundColor: '#3B82F6',
                              borderRadius: '3px',
                              transition: 'width 0.3s ease'
                            }}></div>
                  </div>
                        )}
                    </div>
                    );
                  })}
                  </div>
                )}

                {/* Storage Row */}
                {product.comparisonProducts.some(p => p.storage) && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile 
                    ? `150px repeat(${product.comparisonProducts.length}, 200px)` 
                    : `250px repeat(${product.comparisonProducts.length}, 1fr)`,
                  minWidth: isMobile ? `${150 + (product.comparisonProducts.length * 200)}px` : 'auto',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    padding: '16px 20px',
                    fontWeight: '600',
                    fontSize: '13px',
                    color: '#16191f',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '13px' }}>💿</span>
                    <span>Storage</span>
                  </div>
                  {product.comparisonProducts.map((compProduct, index) => {
                    // Extract storage size for comparison
                    const storageSize = compProduct.storage ? parseInt(compProduct.storage) : 0;
                    const maxStorage = Math.max(...product.comparisonProducts.map(p => parseInt(p.storage) || 0));
                    const storagePercentage = maxStorage > 0 ? (storageSize / maxStorage) * 100 : 0;
                    
                    return (
                      <div key={index} style={{ 
                        padding: '16px 20px', 
                        borderLeft: '1px solid rgba(0, 113, 133, 0.15)', 
                        fontSize: '13px', 
                        fontFamily: 'inherit',
                        backgroundColor: index % 2 === 0 ? 'white' : '#FAFAFA'
                      }}>
                        <div style={{ marginBottom: '6px', fontWeight: '600', color: '#16191f' }}>
                          {compProduct.storage || '—'}
                    </div>
                        {compProduct.storage && storageSize > 0 && (
                          <div style={{
                            width: '100%',
                            height: '6px',
                            backgroundColor: '#E5E7EB',
                            borderRadius: '3px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${storagePercentage}%`,
                              height: '100%',
                              backgroundColor: '#8B5CF6',
                              borderRadius: '3px',
                              transition: 'width 0.3s ease'
                            }}></div>
                  </div>
                        )}
                    </div>
                    );
                  })}
                  </div>
                )}

                {/* Battery Row */}
                {product.comparisonProducts.some(p => p.battery) && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile 
                    ? `150px repeat(${product.comparisonProducts.length}, 200px)` 
                    : `250px repeat(${product.comparisonProducts.length}, 1fr)`,
                  minWidth: isMobile ? `${150 + (product.comparisonProducts.length * 200)}px` : 'auto',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    padding: '16px 20px',
                    fontWeight: '600',
                    fontSize: '13px',
                    color: '#16191f',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '13px' }}>🔋</span>
                    <span>Battery</span>
                  </div>
                  {product.comparisonProducts.map((compProduct, index) => {
                    // Extract battery capacity for comparison
                    const batterySize = compProduct.battery ? parseInt(compProduct.battery) : 0;
                    const maxBattery = Math.max(...product.comparisonProducts.map(p => parseInt(p.battery) || 0));
                    const batteryPercentage = maxBattery > 0 ? (batterySize / maxBattery) * 100 : 0;
                    
                    return (
                      <div key={index} style={{ 
                        padding: '16px 20px', 
                        borderLeft: '1px solid rgba(0, 113, 133, 0.15)', 
                        fontSize: '13px', 
                        fontFamily: 'inherit',
                        backgroundColor: index % 2 === 0 ? 'white' : '#FAFAFA'
                      }}>
                        <div style={{ marginBottom: '6px', fontWeight: '600', color: '#16191f' }}>
                          {compProduct.battery || '—'}
                    </div>
                        {compProduct.battery && batterySize > 0 && (
                          <div style={{
                            width: '100%',
                            height: '6px',
                            backgroundColor: '#E5E7EB',
                            borderRadius: '3px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${batteryPercentage}%`,
                              height: '100%',
                              backgroundColor: batteryPercentage >= 80 ? '#10b981' : batteryPercentage >= 60 ? '#F59E0B' : '#EF4444',
                              borderRadius: '3px',
                              transition: 'width 0.3s ease'
                            }}></div>
                  </div>
                        )}
                  </div>
                    );
                  })}
                    </div>
                )}

                {/* Camera Row */}
                {product.comparisonProducts.some(p => p.camera) && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile 
                    ? `150px repeat(${product.comparisonProducts.length}, 200px)` 
                    : `250px repeat(${product.comparisonProducts.length}, 1fr)`,
                  minWidth: isMobile ? `${150 + (product.comparisonProducts.length * 200)}px` : 'auto',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    padding: '16px 20px',
                    fontWeight: '600',
                    fontSize: '13px',
                    color: '#16191f',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '13px' }}>📷</span>
                    <span>Camera</span>
                  </div>
                  {product.comparisonProducts.map((compProduct, index) => {
                    const camera = compProduct.camera;
                    const cameraText = typeof camera === 'object' 
                      ? `Rear: ${camera.rear || 'N/A'}, Front: ${camera.front || 'N/A'}`
                      : (camera || '—');
                    return (
                      <div key={index} style={{ 
                        padding: '16px 20px', 
                        borderLeft: '1px solid rgba(0, 113, 133, 0.15)', 
                        fontSize: '13px', 
                        fontFamily: 'inherit',
                        backgroundColor: index % 2 === 0 ? 'white' : '#FAFAFA',
                        lineHeight: '1.6'
                      }}>
                    <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          backgroundColor: camera ? '#FCE7F3' : 'transparent',
                          borderRadius: '6px',
                          color: camera ? '#9F1239' : '#9CA3AF',
                          fontWeight: camera ? '500' : '400'
                        }}>
                          <span style={{ fontSize: '13px' }}>📸</span>
                          <span>{cameraText}</span>
                    </div>
                  </div>
                    );
                  })}
                </div>
                )}

                {/* OS Row */}
                {product.comparisonProducts.some(p => p.os) && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile 
                    ? `150px repeat(${product.comparisonProducts.length}, 200px)` 
                    : `250px repeat(${product.comparisonProducts.length}, 1fr)`,
                  minWidth: isMobile ? `${150 + (product.comparisonProducts.length * 200)}px` : 'auto',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    padding: '16px 20px',
                    fontWeight: '600',
                    fontSize: '13px',
                    color: '#16191f',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '13px' }}>🖥️</span>
                    <span>OS</span>
                  </div>
                  {product.comparisonProducts.map((compProduct, index) => (
                    <div key={index} style={{ 
                      padding: '16px 20px', 
                      borderLeft: '1px solid rgba(0, 113, 133, 0.15)', 
                      fontSize: '13px', 
                      fontFamily: 'inherit',
                      backgroundColor: index % 2 === 0 ? 'white' : '#FAFAFA'
                    }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        backgroundColor: compProduct.os ? '#E0E7FF' : 'transparent',
                        borderRadius: '6px',
                        color: compProduct.os ? '#3730A3' : '#9CA3AF',
                        fontWeight: compProduct.os ? '600' : '400'
                      }}>
                        {compProduct.os || '—'}
                  </div>
                  </div>
                  ))}
                  </div>
                )}

                {/* Rating Row */}
                {product.comparisonProducts.some(p => p.rating) && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile 
                    ? `150px repeat(${product.comparisonProducts.length}, 200px)` 
                    : `250px repeat(${product.comparisonProducts.length}, 1fr)`,
                  minWidth: isMobile ? `${150 + (product.comparisonProducts.length * 200)}px` : 'auto',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    padding: '16px 20px',
                    fontWeight: '600',
                    fontSize: '13px',
                    color: '#16191f',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '13px' }}>⭐</span>
                    <span>Rating</span>
                  </div>
                  {product.comparisonProducts.map((compProduct, index) => {
                    const rating = compProduct.rating || 0;
                    const maxRating = Math.max(...product.comparisonProducts.map(p => p.rating || 0), 5);
                    const ratingPercentage = maxRating > 0 ? (rating / maxRating) * 100 : 0;
                    const isBestRating = rating === maxRating && rating > 0;
                    
                    return (
                      <div key={index} style={{ 
                        padding: '16px 20px', 
                        borderLeft: '1px solid rgba(0, 113, 133, 0.15)', 
                        fontSize: '13px', 
                        fontFamily: 'inherit',
                        backgroundColor: isBestRating ? '#FEF3C7' : (index % 2 === 0 ? 'white' : '#FAFAFA')
                      }}>
                <div style={{
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          marginBottom: '8px'
                }}>
                  <div style={{
                            fontSize: '13px',
                            color: rating >= 4.5 ? '#F59E0B' : rating >= 4 ? '#FBBF24' : rating >= 3 ? '#FCD34D' : '#9CA3AF',
                            display: 'flex',
                            gap: '2px'
                          }}>
                            {[...Array(5)].map((_, i) => (
                              <span key={i} style={{
                                color: i < Math.round(rating) ? (rating >= 4.5 ? '#F59E0B' : rating >= 4 ? '#FBBF24' : '#FCD34D') : '#E5E7EB'
                              }}>★</span>
                            ))}
                  </div>
                          <span style={{
                            fontWeight: '700',
                            color: rating >= 4.5 ? '#F59E0B' : '#16191f',
                            fontSize: '13px'
                          }}>
                            {rating > 0 ? rating.toFixed(1) : '—'}
                          </span>
                          {isBestRating && (
                            <span style={{
                              fontSize: '10px',
                              backgroundColor: '#F59E0B',
                              color: 'white',
                              padding: '2px 6px',
                              borderRadius: '10px',
                              fontWeight: '600'
                            }}>Top</span>
                          )}
                </div>
                        {rating > 0 && (
                <div style={{
                            width: '100%',
                            height: '8px',
                            backgroundColor: '#E5E7EB',
                            borderRadius: '4px',
                            overflow: 'hidden'
                }}>
                  <div style={{
                              width: `${ratingPercentage}%`,
                              height: '100%',
                              backgroundColor: rating >= 4.5 ? '#10b981' : rating >= 4 ? '#F59E0B' : rating >= 3 ? '#FCD34D' : '#EF4444',
                              borderRadius: '4px',
                              transition: 'width 0.3s ease'
                            }}></div>
                  </div>
                        )}
                </div>
                    );
                  })}
              </div>
                )}
                </>
              </div>
              )}

              {/* Show Less/More – removed for now; comparison rows always visible
              <div style={{ marginTop: '24px', textAlign: 'center', padding: '20px 0' }}>
                <button onClick={() => setIsComparisonExpanded(!isComparisonExpanded)} ...>
                  {isComparisonExpanded ? 'Show less' : 'Show more'}
                </button>
              </div>
              */}
          </section>
    </>
  );
}
