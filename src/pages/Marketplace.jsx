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
  const [expandedDescriptions, setExpandedDescriptions] = useState(new Set());
  
  // AI Agents API state
  const [agents, setAgents] = useState([]);
  const [allAgents, setAllAgents] = useState([]); // All agents for filter counts
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalAgents, setTotalAgents] = useState(0);
  
  // Filter data from API
  const [categories, setCategories] = useState([]);
  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(false);

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

  // Categories will be extracted from AI agents API response

  // Fetch categories with counts from dedicated API endpoint
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingFilters(true);
      try {
        // Fetch categories with counts from dedicated endpoint
        const categoriesResponse = await aiAgentService.getCategoriesWithCounts();
        
        // Log full API response
        console.log('==========================================');
        console.log('🔍 CATEGORIES WITH COUNTS API RESPONSE:');
        console.log('==========================================');
        console.log('Full Response:', JSON.stringify(categoriesResponse, null, 2));
        console.log('==========================================');
        
        let categoriesList = [];
        
        // Handle different response structures
        if (categoriesResponse && typeof categoriesResponse === 'object') {
          if (Array.isArray(categoriesResponse)) {
            categoriesList = categoriesResponse;
            console.log('✅ Categories are direct array:', categoriesList);
          } else if (categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
            categoriesList = categoriesResponse.data;
            console.log('✅ Categories found in response.data:', categoriesList);
          } else if (categoriesResponse.categories && Array.isArray(categoriesResponse.categories)) {
            categoriesList = categoriesResponse.categories;
            console.log('✅ Categories found in response.categories:', categoriesList);
          } else if (categoriesResponse.success && categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
            categoriesList = categoriesResponse.data;
            console.log('✅ Categories found in response.success.data:', categoriesList);
          } else if (categoriesResponse.result && Array.isArray(categoriesResponse.result)) {
            categoriesList = categoriesResponse.result;
            console.log('✅ Categories found in response.result:', categoriesList);
          }
        }
        
        // Map categories to format
        let mappedCategories = categoriesList.map(cat => ({
          id: cat.id || cat.categoryId || cat._id || String(Math.random()),
          name: cat.name || cat.categoryName || cat.title || cat.label || 'Unnamed Category',
          count: cat.count || cat.agentCount || cat.totalCount || cat.total || 0
        }));
        
        // If API returned success but empty data, keep UX working with a safe fallback.
        if (!mappedCategories || mappedCategories.length === 0) {
          mappedCategories = [{
            id: 'ai-agents-tools',
            name: 'AI Agents & Tools',
            count: 0
          }];
        }
        
        // Remove "AI Agents & Tools" from the list since it's already shown as the selected category heading
        mappedCategories = mappedCategories.filter(cat => {
          const catName = cat.name?.toLowerCase() || '';
          return !catName.includes('ai agents') && !catName.includes('ai agents & tools');
        });
        
        // Sort by count descending
        mappedCategories.sort((a, b) => b.count - a.count);
        
        console.log('📋 Final Categories (AI Agents & Tools removed from list):', mappedCategories);
        
        setCategories(mappedCategories);
      } catch (err) {
        console.error('Error fetching categories with counts:', err);
        // Fallback: set empty array or default category
        setCategories([{
          id: 'ai-agents-tools',
          name: 'AI Agents & Tools',
          count: 0
        }]);
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch all agents for filter counts (delivery methods and publishers)
  useEffect(() => {
    const fetchAllAgentsForFilters = async () => {
      try {
        const response = await aiAgentService.getAllAgents({
          page: 1,
          limit: 1000, // Fetch large number to get all agents for counts
        });
        
        let agentsList = [];
        
        if (response && typeof response === 'object') {
          // Extract agents list
          if (response.success === true && Array.isArray(response.data)) {
            agentsList = response.data;
          } else if (Array.isArray(response.data)) {
            agentsList = response.data;
          } else if (Array.isArray(response)) {
            agentsList = response;
          } else if (response.result && Array.isArray(response.result)) {
            agentsList = response.result;
          } else if (response.result?.data && Array.isArray(response.result.data)) {
            agentsList = response.result.data;
          }
        }
        
        setAllAgents(agentsList);
        
        // Calculate delivery methods counts
        const deliveryMethodCounts = {};
        agentsList.forEach(agent => {
          let method = 'Unknown';
          if (agent.deliveryMethod) {
            if (typeof agent.deliveryMethod === 'object' && agent.deliveryMethod.name) {
              method = agent.deliveryMethod.name;
            } else if (typeof agent.deliveryMethod === 'string') {
              method = agent.deliveryMethod;
            }
          } else if (agent.deliveryType) {
            method = agent.deliveryType;
          } else if (agent.delivery) {
            method = agent.delivery;
          }
          deliveryMethodCounts[method] = (deliveryMethodCounts[method] || 0) + 1;
        });
        
        const deliveryMethodsList = Object.entries(deliveryMethodCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);
        
        setDeliveryMethods(deliveryMethodsList);
        
        // Calculate publishers counts
        const publisherCounts = {};
        agentsList.forEach(agent => {
          let publisher = 'Unknown';
          if (agent.provider) {
            publisher = agent.provider;
          } else if (agent.seller) {
            publisher = agent.seller;
          } else if (agent.publisher) {
            if (typeof agent.publisher === 'object' && agent.publisher.name) {
              publisher = agent.publisher.name;
            } else if (typeof agent.publisher === 'string') {
              publisher = agent.publisher;
            }
          }
          publisherCounts[publisher] = (publisherCounts[publisher] || 0) + 1;
        });
        
        const publishersList = Object.entries(publisherCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);
        
        setPublishers(publishersList);
        
      } catch (err) {
        console.error('Error fetching all agents for filters:', err);
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchAllAgentsForFilters();
  }, []);

  // Fetch AI agents from API (paginated)
  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      setError(null);
      try {
        // Only apply categoryId filter if we can confidently map it from the loaded categories list.
        // Default "AI Agents & Tools" should show ALL agents (no category filter).
        let categoryId = null;
        const normalizedSelected = (selectedCategory || '').toLowerCase().trim();
        if (normalizedSelected && normalizedSelected !== 'ai agents & tools') {
          const match = (categories || []).find((c) => (c?.name || '').toLowerCase().trim() === normalizedSelected);
          if (match?.id) categoryId = match.id;
        }
        
        const response = await aiAgentService.getAllAgents({
          page: currentPage,
          limit: 10,
          ...(categoryId ? { categoryId } : {}),
        });
        
        // Log full API response
        console.log('==========================================');
        console.log('🔍 MARKETPLACE API RESPONSE:');
        console.log('==========================================');
        console.log('Full Response:', JSON.stringify(response, null, 2));
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
          } 
          // Check for { data: [...], pagination: {...} } format
          else if (Array.isArray(response.data) && response.pagination) {
            agentsList = response.data;
            total = response.pagination.total || response.pagination.totalCount || response.data.length;
          }
          // Check for direct array response
          else if (Array.isArray(response)) {
            agentsList = response;
            total = response.length;
          }
          // Check for { data: [...] } format
          else if (Array.isArray(response.data)) {
            agentsList = response.data;
            total = response.total || response.count || response.data.length;
          }
        }
        
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
  }, [currentPage, selectedCategory, categories]); // Re-fetch when page or category changes

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Reset to page 1 when sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy]);

  // Map API agents to product format for display and apply sorting
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
        description: agent.description || agent.shortDescription || 'No description available.',
        createdAt: agent.createdAt || agent.created_at || null,
        updatedAt: agent.updatedAt || agent.updated_at || null,
        price: agent.price || 0
      }))
        .sort((a, b) => {
          switch (sortBy) {
            case 'Relevance':
              // Default order (as returned from API)
              return 0;
            case 'Newest':
              // Sort by createdAt/updatedAt descending, fallback to ID
              if (a.createdAt || a.updatedAt || b.createdAt || b.updatedAt) {
                return new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0);
              }
              return (b.id || 0) - (a.id || 0);
            case 'Price: Low to High':
              return (a.price || 0) - (b.price || 0);
            case 'Price: High to Low':
              return (b.price || 0) - (a.price || 0);
            default:
              return 0;
          }
        })
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
                {loadingFilters ? (
                  <div style={{ color: '#565959', fontSize: '14px', padding: '10px 0' }}>Loading categories...</div>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {categories.length === 0 ? (
                      <li style={{ color: '#565959', fontSize: '14px', padding: '10px 0' }}>No categories available</li>
                    ) : (
                      categories.map((cat) => (
                        <li key={cat.id || cat.name} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                      ))
                    )}
                  </ul>
                )}
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
                    {loadingFilters ? (
                      <li style={{ color: '#565959', fontSize: '14px', padding: '10px 0' }}>Loading delivery methods...</li>
                    ) : deliveryMethods.length === 0 ? (
                      <li style={{ color: '#565959', fontSize: '14px', padding: '10px 0' }}>No delivery methods available</li>
                    ) : (
                      deliveryMethods.map((method) => (
                        <li key={method.name} style={{ marginBottom: '1px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                      ))
                    )}
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
                    {loadingFilters ? (
                      <li style={{ color: '#565959', fontSize: '14px', padding: '10px 0' }}>Loading publishers...</li>
                    ) : publishers.length === 0 ? (
                      <li style={{ color: '#565959', fontSize: '14px', padding: '10px 0' }}>No publishers available</li>
                    ) : (
                      publishers.map((publisher) => (
                        <li key={publisher.name} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                      ))
                    )}
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
                    {selectedCategory} ({loading ? 'Loading...' : `${totalAgents || 0} results`}) showing {products.length > 0 ? `${(currentPage - 1) * 10 + 1}-${Math.min(currentPage * 10, totalAgents)}` : '0'}
                  </p>
                </div>

                {/* Pagination and Sort */}
                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '20px', flexWrap: 'wrap' }}>
                  {/* Pagination */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      style={{
                      border: 'none',
                      background: 'transparent',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                        color: currentPage === 1 ? '#CCCCCC' : '#232F3E',
                        fontSize: '18px',
                        opacity: currentPage === 1 ? 0.5 : 1
                      }}
                    >
                      ‹
                    </button>
                    {(() => {
                      const totalPages = Math.ceil(totalAgents / 10);
                      const pages = [];
                      const maxVisiblePages = 5;
                      
                      if (totalPages <= maxVisiblePages) {
                        for (let i = 1; i <= totalPages; i++) {
                          pages.push(i);
                        }
                      } else {
                        if (currentPage <= 3) {
                          for (let i = 1; i <= 4; i++) {
                            pages.push(i);
                          }
                          pages.push('...');
                          pages.push(totalPages);
                        } else if (currentPage >= totalPages - 2) {
                          pages.push(1);
                          pages.push('...');
                          for (let i = totalPages - 3; i <= totalPages; i++) {
                            pages.push(i);
                          }
                        } else {
                          pages.push(1);
                          pages.push('...');
                          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                            pages.push(i);
                          }
                          pages.push('...');
                          pages.push(totalPages);
                        }
                      }
                      
                      return pages.map((page, index) => {
                        if (page === '...') {
                          return (
                            <span key={`ellipsis-${index}`} style={{ color: '#565959', fontSize: '14px' }}>
                              ...
                            </span>
                          );
                        }
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            style={{
                      padding: '4px 10px',
                              backgroundColor: currentPage === page ? '#F0F2F2' : 'transparent',
                              border: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                              fontFamily: 'DM Sans, sans-serif',
                              cursor: 'pointer',
                              color: currentPage === page ? '#232F3E' : '#565959',
                              fontWeight: currentPage === page ? '600' : '400'
                            }}
                            onMouseEnter={(e) => {
                              if (currentPage !== page) {
                                e.target.style.backgroundColor = '#F7F8F8';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (currentPage !== page) {
                                e.target.style.backgroundColor = 'transparent';
                              }
                            }}
                          >
                            {page}
                          </button>
                        );
                      });
                    })()}
                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(Math.ceil(totalAgents / 10), prev + 1))}
                      disabled={currentPage >= Math.ceil(totalAgents / 10)}
                      style={{
                      border: 'none',
                      background: 'transparent',
                        cursor: currentPage >= Math.ceil(totalAgents / 10) ? 'not-allowed' : 'pointer',
                        color: currentPage >= Math.ceil(totalAgents / 10) ? '#CCCCCC' : '#232F3E',
                        fontSize: '18px',
                        opacity: currentPage >= Math.ceil(totalAgents / 10) ? 0.5 : 1
                      }}
                    >
                      ›
                    </button>
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
                  <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                    <img 
                      src="/assets/V Cloud Logo final-01.svg" 
                      alt="V Cloud" 
                      style={{
                        width: '150px', 
                        height: 'auto',
                        marginBottom: '30px',
                        animation: 'pulse 2s ease-in-out infinite'
                      }} 
                    />
                    <div style={{
                      width: '60px',
                      height: '60px',
                      border: '4px solid #f3f3f3',
                      borderTop: '4px solid #df2020',
                      borderRadius: '50%',
                      margin: '0 auto',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <style>
                      {`
                        @keyframes spin { 
                          0% { transform: rotate(0deg); } 
                          100% { transform: rotate(360deg); } 
                        }
                        @keyframes pulse {
                          0%, 100% { opacity: 1; }
                          50% { opacity: 0.6; }
                        }
                      `}
                    </style>
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
                          color: '#111A45',
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
                          e.target.style.color = '#111A45';
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
                        {expandedDescriptions.has(product.id) ? (
                          <>
                        {product.description}
                            {product.description && product.description.length > 120 && (
                                <button
                                  onClick={() => {
                                    const newExpanded = new Set(expandedDescriptions);
                                    newExpanded.delete(product.id);
                                    setExpandedDescriptions(newExpanded);
                                  }}
                                  style={{
                                    marginLeft: '4px',
                                    padding: 0,
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    color: '#111A45',
                                    cursor: 'pointer',
                                    fontSize: 'inherit',
                                    fontFamily: 'inherit',
                                    fontWeight: '500',
                                    textDecoration: 'underline'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.target.style.color = '#df2020';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.target.style.color = '#111A45';
                                  }}
                                >
                                  Show less
                                </button>
                            )}
                          </>
                        ) : (
                          <>
                            {product.description && product.description.length > 120 ? (
                              <>
                                <span style={{
                                  display: 'inline'
                                }}>
                                  {product.description.substring(0, 150)}...
                                </span>
                                <button
                                  onClick={() => {
                                    const newExpanded = new Set(expandedDescriptions);
                                    newExpanded.add(product.id);
                                    setExpandedDescriptions(newExpanded);
                                  }}
                                  style={{
                                    marginLeft: '4px',
                                    padding: 0,
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    color: '#111A45',
                                    cursor: 'pointer',
                                    fontSize: 'inherit',
                                    fontFamily: 'inherit',
                                    fontWeight: '500',
                                    textDecoration: 'underline',
                                    display: 'inline'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.target.style.color = '#df2020';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.target.style.color = '#111A45';
                                  }}
                                >
                                  See more
                                </button>
                              </>
                            ) : (
                              product.description
                            )}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Pagination */}
              {totalAgents > 10 && (
              <div style={{
                marginTop: '30px',
                paddingTop: '20px',
                borderTop: '1px solid #e7e7e7',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px'
              }}>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    style={{
                  border: 'none',
                  background: 'transparent',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      color: currentPage === 1 ? '#CCCCCC' : '#232F3E',
                      fontSize: '18px',
                      opacity: currentPage === 1 ? 0.5 : 1
                    }}
                  >
                  ‹
                </button>
                  {(() => {
                    const totalPages = Math.ceil(totalAgents / 10);
                    const pages = [];
                    const maxVisiblePages = 5;
                    
                    if (totalPages <= maxVisiblePages) {
                      for (let i = 1; i <= totalPages; i++) {
                        pages.push(i);
                      }
                    } else {
                      if (currentPage <= 3) {
                        for (let i = 1; i <= 4; i++) {
                          pages.push(i);
                        }
                        pages.push('...');
                        pages.push(totalPages);
                      } else if (currentPage >= totalPages - 2) {
                        pages.push(1);
                        pages.push('...');
                        for (let i = totalPages - 3; i <= totalPages; i++) {
                          pages.push(i);
                        }
                      } else {
                        pages.push(1);
                        pages.push('...');
                        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                          pages.push(i);
                        }
                        pages.push('...');
                        pages.push(totalPages);
                      }
                    }
                    
                    return pages.map((page, index) => {
                      if (page === '...') {
                        return (
                          <span key={`ellipsis-bottom-${index}`} style={{ color: '#565959', fontSize: '14px' }}>
                            ...
                          </span>
                        );
                      }
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          style={{
                  padding: '6px 12px',
                            backgroundColor: currentPage === page ? '#F0F2F2' : 'transparent',
                            border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'DM Sans, sans-serif',
                            cursor: 'pointer',
                            color: currentPage === page ? '#232F3E' : '#565959',
                            fontWeight: currentPage === page ? '600' : '400'
                          }}
                          onMouseEnter={(e) => {
                            if (currentPage !== page) {
                              e.target.style.backgroundColor = '#F7F8F8';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentPage !== page) {
                              e.target.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          {page}
                        </button>
                      );
                    });
                  })()}
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(Math.ceil(totalAgents / 10), prev + 1))}
                    disabled={currentPage >= Math.ceil(totalAgents / 10)}
                    style={{
                  border: 'none',
                  background: 'transparent',
                      cursor: currentPage >= Math.ceil(totalAgents / 10) ? 'not-allowed' : 'pointer',
                      color: currentPage >= Math.ceil(totalAgents / 10) ? '#CCCCCC' : '#232F3E',
                      fontSize: '18px',
                      opacity: currentPage >= Math.ceil(totalAgents / 10) ? 0.5 : 1
                    }}
                  >
                  ›
                </button>
              </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Marketplace;

