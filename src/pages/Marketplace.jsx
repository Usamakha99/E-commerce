import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { aiAgentService } from '../services/aiAgent.service';

const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState('AI Agents & Tools');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('Relevance');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedDeliveryMethods, setSelectedDeliveryMethods] = useState([]);
  const [selectedPublishers, setSelectedPublishers] = useState([]);
  const [showCategories, setShowCategories] = useState(true);
  const [showDeliveryMethods, setShowDeliveryMethods] = useState(true);
  const [showPublishers, setShowPublishers] = useState(true);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);
  
  // AI Agents API state
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalAgents, setTotalAgents] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update document title based on selected category
  useEffect(() => {
    const title = selectedCategory 
      ? `${selectedCategory} - AI Marketplace - VCloud Tech`
      : 'AI Marketplace - VCloud Tech';
    document.title = title;
  }, [selectedCategory]);

  // Fetch AI agents from API
  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      setError(null);
      try {
        // Map category name to categoryId (you may need to adjust this based on your category structure)
        // For now, using categoryId=1 as shown in the user's example
        const categoryId = 1; // You can map this based on selectedCategory if needed
        
        const response = await aiAgentService.getAllAgents({
          page: currentPage,
          limit: 20,
          categoryId: categoryId,
        });
        
        // Debug: Log API response structure
        console.log('==========================================');
        console.log('🔍 MARKETPLACE API RESPONSE:');
        console.log('==========================================');
        console.log('Full Response:', response);
        console.log('Response Type:', typeof response);
        console.log('Is Array:', Array.isArray(response));
        console.log('Has success:', response?.success);
        console.log('Has data:', !!response?.data);
        console.log('Has pagination:', !!response?.pagination);
        console.log('==========================================');
        
        // Handle API response structure according to documentation:
        // Expected: { success: true, data: [...], pagination: {...} }
        let agentsList = [];
        let total = 0;
        
        if (response && typeof response === 'object') {
          // Check for { success: true, data: [...], pagination: {...} } format
          if (response.success === true && Array.isArray(response.data)) {
            agentsList = response.data;
            total = response.pagination?.total || response.pagination?.totalCount || response.data.length;
            console.log('✅ Response format: { success: true, data: [...], pagination: {...} }');
          } 
          // Check for { data: [...], pagination: {...} } format
          else if (Array.isArray(response.data) && response.pagination) {
            agentsList = response.data;
            total = response.pagination.total || response.pagination.totalCount || response.data.length;
            console.log('✅ Response format: { data: [...], pagination: {...} }');
          }
          // Check for direct array response
          else if (Array.isArray(response)) {
            agentsList = response;
            total = response.length;
            console.log('✅ Response format: direct array');
          }
          // Check for { data: [...] } format
          else if (Array.isArray(response.data)) {
            agentsList = response.data;
            total = response.total || response.count || response.data.length;
            console.log('✅ Response format: { data: [...] }');
          }
        }
        
        console.log(`✅ Extracted ${agentsList.length} agents, Total: ${total}`);
        
        setAgents(agentsList);
        setTotalAgents(total);
      } catch (err) {
        console.error('Error fetching AI agents:', err);
        setError(err.message || 'Failed to fetch AI agents');
        // Fallback to empty array on error
        setAgents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [currentPage, selectedCategory]); // Re-fetch when page or category changes

  // Mock data for categories
  const categories = [
    { name: 'Software Development', count: 602 },
    { name: 'Data Analysis', count: 447 },
    { name: 'Customer Experience', count: 0 },
    { name: 'Personalization', count: 226 },
    { name: 'AI Security', count: 178 },
    { name: 'Observability', count: 170 },
    { name: 'Customer Support', count: 160 },
    { name: 'Sales & Marketing', count: 137 },
    { name: 'Legal & Compliance', count: 123 },
    { name: 'IT Support', count: 113 },
    { name: 'Content Creation', count: 108 },
    { name: 'Finance & Accounting', count: 95 },
    { name: 'Research', count: 80 },
    { name: 'Procurement & Supply Chain', count: 63 },
    { name: 'Quality Assurance', count: 62 },
    { name: 'Scheduling & Coordination', count: 36 }
  ];

  const deliveryMethods = [
    { name: 'Professional Services', count: 1137 },
    { name: 'SaaS', count: 662 },
    { name: 'Amazon Machine Image', count: 179 },
    { name: 'API-Based Agents & Tools', count: 38 },
    { name: 'Container Image', count: 35 },
    { name: 'CloudFormation Template', count: 24 },
    { name: 'Helm Chart', count: 11 }
  ];

  const publishers = [
    { name: 'Flexa Cloud', count: 297 },
    { name: 'Deloitte Consulting LLP', count: 103 }
  ];

  // Map API agents to product format for display
  // Use API agents if available, otherwise fallback to empty array
  const products = agents.length > 0 
    ? agents.map(agent => ({
        id: agent.id,
        name: agent.name || 'Unnamed Agent',
        provider: agent.provider || agent.seller || 'Unknown Provider',
        logo: agent.logo || agent.image || '/src/assets/imgs/page/homepage1/imgsp1.png',
        awsReviews: agent.awsReviews || 0,
        externalReviews: agent.externalReviews || agent.reviews || 0,
        rating: agent.rating || 0,
        freeTrial: agent.freeTrial || false,
        description: agent.description || agent.shortDescription || 'No description available.'
      }))
    : [];

  const handleDeliveryMethodToggle = (method) => {
    if (selectedDeliveryMethods.includes(method)) {
      setSelectedDeliveryMethods(selectedDeliveryMethods.filter(m => m !== method));
    } else {
      setSelectedDeliveryMethods([...selectedDeliveryMethods, method]);
    }
  };

  const handlePublisherToggle = (publisher) => {
    if (selectedPublishers.includes(publisher)) {
      setSelectedPublishers(selectedPublishers.filter(p => p !== publisher));
    } else {
      setSelectedPublishers([...selectedPublishers, publisher]);
    }
  };

  return (
    <main className="main" style={{ paddingTop: '60px', backgroundColor: 'white' }}>
      <div className="container-fluid" style={{ padding: isMobile ? '15px' : '20px 40px' }}>
        <div className="row">
          {/* Left Sidebar - Filters */}
          <div className="col-lg-3 order-first order-lg-first" style={{ paddingRight: isMobile ? '0' : '30px', marginBottom: isMobile ? '30px' : '0' }}>
            <div>
              {/* Refine Results Header */}
              <h6 style={{
                margin: 0,
                color: '#000',
                fontWeight: 'bold',
                fontSize: '16px',
                borderBottom: '3px solid #df2020',
                paddingBottom: '8px',
                marginBottom: '20px',
                display: 'inline-block'
              }}>
                Refine results
              </h6>

              {/* All Categories Link */}
              <div style={{ marginBottom: '15px' }}>
                <a href="#" style={{
                  color: '#000',
                  fontSize: '14px',
                  textDecoration: 'underline',
                  fontFamily: 'DM Sans, sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#000';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#000';
                }}
                >
                All categories
                </a>
              </div>

              {/* Selected Category */}
              <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#000',
                marginBottom: '15px',
                fontFamily: 'DM Sans, sans-serif',
                borderBottom: '3px solid #df2020',
                paddingBottom: '8px',
                display: 'inline-block'
              }}>
                {selectedCategory}
              </div>

              {/* Categories List */}
              <div style={{ marginBottom: '25px' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {categories.map((cat, index) => (
                    <li key={index} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <a href="#" style={{
                        color: '#000',
                        fontSize: '14px',
                        textDecoration: 'underline',
                        fontFamily: 'DM Sans, sans-serif',
                        flex: 1
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = '#000';
                        // Underline the count when hovering on category name
                        const countSpan = e.target.parentElement.querySelector('.category-count');
                        if (countSpan) countSpan.style.textDecoration = 'underline';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = '#000';
                        // Remove underline from count
                        const countSpan = e.target.parentElement.querySelector('.category-count');
                        if (countSpan) countSpan.style.textDecoration = 'none';
                      }}
                      >
                        {cat.name}
                      </a>
                      {cat.count > 0 && (
                        <span className="category-count" style={{
                          color: '#000',
                          fontSize: '14px',
                          fontWeight: '600',
                          marginLeft: '10px',
                          textDecoration: 'none',
                          transition: 'text-decoration 0.2s ease'
                        }}>
                          {cat.count}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Delivery Methods */}
              <div style={{ marginBottom: '25px' }}>
                <h6 
                  style={{
                    margin: 0,
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    borderBottom: '3px solid #df2020',
                    paddingBottom: '8px',
                    marginBottom: '15px',
                    display: 'inline-block',
                    cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif'
                  }}
                  onClick={() => setShowDeliveryMethods(!showDeliveryMethods)}
                >
                  Delivery methods
                </h6>
                {showDeliveryMethods && (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {deliveryMethods.map((method, index) => (
                      <li key={index} style={{ marginBottom: '1px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label className="cb-container" style={{ flex: 1 }}>
                          <input
                            type="checkbox"
                            checked={selectedDeliveryMethods.includes(method.name)}
                            onChange={() => handleDeliveryMethodToggle(method.name)}
                          />
                          <span className="text-small" style={{ color: '#000', fontSize: '14px', textDecoration: 'underline' }}>
                            {method.name}
                          </span>
                          <span className="checkmark"></span>
                        </label>
                        <span className="number-item" style={{ color: '#000', fontSize: '14px', fontWeight: '600', marginLeft: '10px' }}>
                          {method.count}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Publishers */}
              <div style={{ marginBottom: '25px' }}>
                <h6 
                  style={{
                    margin: 0,
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    borderBottom: '3px solid #df2020',
                    paddingBottom: '8px',
                    marginBottom: '15px',
                    display: 'inline-block',
                    cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif'
                  }}
                  onClick={() => setShowPublishers(!showPublishers)}
                >
                  Publisher
                </h6>
                {showPublishers && (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {publishers.map((publisher, index) => (
                      <li key={index} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label className="cb-container" style={{ flex: 1 }}>
                          <input
                            type="checkbox"
                            checked={selectedPublishers.includes(publisher.name)}
                            onChange={() => handlePublisherToggle(publisher.name)}
                          />
                          <span className="text-small" style={{ color: '#000', fontSize: '14px', textDecoration: 'underline' }}>
                            {publisher.name}
                          </span>
                          <span className="checkmark"></span>
                        </label>
                        <span className="number-item" style={{ color: '#000', fontSize: '14px', fontWeight: '600', marginLeft: '10px' }}>
                          {publisher.count}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Search Results */}
          <div className="col-lg-9">
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: isMobile ? '15px' : '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              {/* Search Results Header */}
              <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'center',
                marginBottom: '20px',
                paddingBottom: '15px',
                borderBottom: '1px solid #e7e7e7',
                gap: isMobile ? '15px' : '0'
              }}>
                <div>
                  <h4 style={{
                    fontSize: isMobile ? '18px' : '22px',
                    fontWeight: '600',
                    color: '#232F3E',
                    marginBottom: '5px',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    Search results
                  </h4>
                  <p style={{
                    fontSize: isMobile ? '12px' : '14px',
                    color: '#565959',
                    margin: 0,
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    {selectedCategory} ({loading ? 'Loading...' : `${totalAgents || 0} results`}) showing {products.length > 0 ? `1-${products.length}` : '0'}
                  </p>
                </div>

                {/* Pagination and Sort */}
                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '20px', flexWrap: 'wrap' }}>
                  {/* Pagination */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button style={{
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      color: '#232F3E',
                      fontSize: '18px'
                    }}>
                      ‹
                    </button>
                    <span style={{
                      padding: '4px 10px',
                      backgroundColor: '#F0F2F2',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      1
                    </span>
                    <button style={{
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      color: '#232F3E',
                      fontSize: '18px'
                    }}>
                      ›
                    </button>
                    <span style={{ color: '#565959', fontSize: '14px' }}>...</span>
                  </div>

                  {/* Sort Dropdown */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setShowSortDropdown(!showSortDropdown)}
                      style={{
                        padding: '8px 16px',
                        border: '1px solid #D5D9D9',
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontFamily: 'DM Sans, sans-serif',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      Sort By: {sortBy}
                      <span style={{ fontSize: '12px' }}>▾</span>
                    </button>
                    {showSortDropdown && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '4px',
                        backgroundColor: 'white',
                        border: '1px solid #D5D9D9',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        zIndex: 1000,
                        minWidth: '180px'
                      }}>
                        {['Relevance', 'Newest', 'Price: Low to High', 'Price: High to Low'].map((option) => (
                          <div
                            key={option}
                            onClick={() => {
                              setSortBy(option);
                              setShowSortDropdown(false);
                            }}
                            style={{
                              padding: '10px 16px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontFamily: 'DM Sans, sans-serif',
                              backgroundColor: sortBy === option ? '#F0F2F2' : 'white'
                            }}
                            onMouseEnter={(e) => {
                              if (sortBy !== option) e.target.style.backgroundColor = '#F7F8F8';
                            }}
                            onMouseLeave={(e) => {
                              if (sortBy !== option) e.target.style.backgroundColor = 'white';
                            }}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Products List */}
              <div>
                {loading && (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#565959' }}>
                    Loading AI agents...
                  </div>
                )}
                
                {error && !loading && (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '40px', 
                    color: '#df2020',
                    backgroundColor: '#fff5f5',
                    borderRadius: '8px',
                    marginBottom: '20px'
                  }}>
                    <p style={{ margin: 0, fontWeight: '600' }}>Error loading agents</p>
                    <p style={{ margin: '10px 0 0 0', fontSize: '14px' }}>{error}</p>
                  </div>
                )}
                
                {!loading && !error && products.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#565959' }}>
                    No AI agents found.
                  </div>
                )}
                
                {!loading && products.map((product, index) => (
                  <div
                    key={product.id}
                    style={{
                      display: 'flex',
                      gap: '20px',
                      paddingBottom: '20px',
                      marginBottom: '20px',
                      borderBottom: index < products.length - 1 ? '1px solid #e7e7e7' : 'none'
                    }}
                  >
                    {/* Product Logo */}
                    <div style={{
                      width: isMobile ? '60px' : '100px',
                      height: isMobile ? '60px' : '100px',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      padding: '10px'
                    }}>
                      <img
                        src={product.logo}
                        alt={product.name}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain'
                        }}
                        onError={(e) => { e.target.src = '/src/assets/imgs/page/homepage1/imgsp1.png'; }}
                      />
                    </div>

                    {/* Product Info */}
                    <div style={{ flex: 1 }}>
                      {/* Product Name */}
                      <Link
                        to={`/marketplace/${product.id}`}
                        style={{
                          fontSize: isMobile ? '16px' : '18px',
                          fontWeight: '600',
                          color: '#007185',
                          textDecoration: 'none',
                          fontFamily: 'DM Sans, sans-serif',
                          display: 'block',
                          marginBottom: '4px',
                          transition: 'color 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = '#df2020';
                          e.target.style.textDecoration = 'underline';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = '#007185';
                          e.target.style.textDecoration = 'none';
                        }}
                      >
                        {product.name}
                      </Link>

                      {/* Description */}
                      <p style={{
                        fontSize: isMobile ? '13px' : '14px',
                        color: '#0F1111',
                        lineHeight: '1.6',
                        margin: 0,
                        fontFamily: 'DM Sans, sans-serif'
                      }}>
                        {product.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Pagination */}
              <div style={{
                marginTop: '30px',
                paddingTop: '20px',
                borderTop: '1px solid #e7e7e7',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px'
              }}>
                <button style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: '#232F3E',
                  fontSize: '18px'
                }}>
                  ‹
                </button>
                <span style={{
                  padding: '6px 12px',
                  backgroundColor: '#F0F2F2',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: '500'
                }}>
                  1
                </span>
                <button style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: '#232F3E',
                  fontSize: '18px'
                }}>
                  ›
                </button>
                <span style={{ color: '#565959', fontSize: '14px' }}>...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Marketplace;

