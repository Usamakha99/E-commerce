import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { aiAgentService } from '../services/aiAgent.service';

const MarketplaceProductDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isShortDescriptionExpanded, setIsShortDescriptionExpanded] = useState(false);
  const [isComparisonExpanded, setIsComparisonExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(typeof window !== 'undefined' && window.innerWidth < 992);
  
  // API state
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth < 992);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch agent data from API
  useEffect(() => {
    const fetchAgent = async () => {
      if (!id) {
        setError('Agent ID is required');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        // Make API call via service
        // This calls: GET http://localhost:5000/api/aiagents/:id
        const response = await aiAgentService.getAgentById(id);
        
        // Full API Response
        console.log(JSON.stringify(response, null, 2));
        
        // Extract agent data from API response
        // Handle different response formats: { success: true, data: {...} } or direct object
        let agentData = null;
        
        if (response && typeof response === 'object') {
          // Format 1: { success: true, data: {...} }
          if (response.success === true && response.data && typeof response.data === 'object') {
            agentData = response.data;
          } 
          // Format 2: { data: {...} }
          else if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
            agentData = response.data;
          } 
          // Format 3: Direct agent object { id, name, ... }
          else if (response.id || response.name) {
            agentData = response;
          }
        }
        
        if (!agentData) {
          console.error('❌ Could not extract agent data from response');
          throw new Error('No agent data received from API');
        }
        
        setAgent(agentData);
      } catch (err) {
        console.error('❌ Error fetching AI agent:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        setError(err.message || 'Failed to fetch AI agent details');
        setAgent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [id]);

  // Map API agent data to product structure for display
  // Comprehensive mapping to ensure all API fields are accessible
  const product = agent ? (() => {
    // Helper to safely get nested property
    const getCategoryName = (cat) => {
      if (!cat) return null;
      if (typeof cat === 'string') return cat;
      if (typeof cat === 'object') return cat.name || cat.title || cat.label || null;
      return null;
    };

    // Process highlights - handle string/array conversion
    let highlightsList = agent.highlights || agent.features || agent.keyFeatures || agent.key_features || agent.bulletPoints || agent.bullet_points || agent.bulletsPoint || [];
    if (typeof highlightsList === 'string') {
      try {
        highlightsList = JSON.parse(highlightsList);
      } catch {
        highlightsList = highlightsList.split(/\n|,|;/).filter(h => h.trim());
      }
    }
    if (!Array.isArray(highlightsList)) {
      highlightsList = [];
    }

    // Handle nested content objects from API
    const featuresContent = agent.featuresContent || agent.features_content || {};
    const resourcesContent = agent.resourcesContent || agent.resources_content || {};
    const supportContent = agent.supportContent || agent.support_content || {};
    const productComparisonContent = agent.productComparisonContent || agent.product_comparison_content || {};
    const pricingContent = agent.pricingContent || agent.pricing_content || {};
    const mapped = {
      id: agent.id,
      name: agent.name || agent.title || 'Unnamed Agent',
      logo: agent.logo || agent.image || agent.mainImage || agent.thumbnail || agent.logoUrl || '/src/assets/imgs/page/homepage1/imgsp1.png',
      seller: agent.provider || agent.seller || agent.vendor || agent.company || agent.publisher || 'Unknown Provider',
      rating: agent.rating || agent.averageRating || agent.avgRating || 0,
      awsReviews: agent.awsReviews || agent.aws_reviews || 0,
      externalReviews: agent.externalReviews || agent.external_reviews || agent.reviews || agent.totalReviews || 0,
      badges: agent.badges || agent.tags || (agent.freeTrial || agent.free_trial ? ['Free Trial'] : []),
      shortDescription: agent.shortDescription || agent.short_description || agent.description || agent.shortDescp || agent.summary || 'No description available.',
      videoThumbnail: agent.videoThumbnail || agent.video_thumbnail || agent.thumbnail || agent.image || agent.mainImage || agent.videoUrl || '/src/assets/imgs/page/homepage1/imgsp1.png',
      overview: agent.overview || agent.longDescription || agent.long_description || agent.description || agent.fullDescription || agent.full_description || agent.detailedDescription || agent.details || 'No overview available.',
      highlights: highlightsList,
      // Additional fields from API
      category: getCategoryName(agent.category) || agent.categoryName || agent.category_name || null,
      categoryId: agent.categoryId || agent.category_id || (agent.category && typeof agent.category === 'object' ? agent.category.id : null) || (agent.categoryIds && Array.isArray(agent.categoryIds) && agent.categoryIds.length > 0 ? agent.categoryIds[0] : null) || null,
      categoryIds: agent.categoryIds || agent.category_ids || (agent.categoryId ? [agent.categoryId] : []) || [],
      deliveryMethod: agent.deliveryMethod || agent.delivery_method || agent.deliveryType || agent.delivery_type || null,
      deliveryMethodId: agent.deliveryMethodId || agent.delivery_method_id || null,
      publisherId: agent.publisherId || agent.publisher_id || null,
      soldBy: agent.soldBy || agent.sold_by || agent.provider || null,
      deployedOnAWS: agent.deployedOnAWS || agent.deployed_on_aws || agent.awsDeployed || agent.aws_deployed || false,
      freeTrial: agent.freeTrial || agent.free_trial || false,
      pricing: agent.pricing || agent.price || agent.cost || null,
      supportUrl: (() => {
        // First check supportContent.vendorSupport.website, then other fields
        return supportContent?.vendorSupport?.website || 
               supportContent?.vendorSupport?.url || 
               supportContent?.vendorSupport?.supportUrl || 
               supportContent?.vendorSupport?.link || 
               supportContent?.url || 
               supportContent?.supportUrl || 
               supportContent?.support_url || 
               supportContent?.link || 
               supportContent?.supportLink || 
               supportContent?.support_link ||
               agent.supportUrl || 
               agent.support_url || 
               agent.support || 
               null;
      })(),
      documentationUrl: agent.documentationUrl || agent.documentation_url || agent.docs || agent.documentation || null,
      website: agent.website || agent.url || agent.homepage || agent.homePage || null,
      createdAt: agent.createdAt || agent.created_at || agent.createdDate || null,
      updatedAt: agent.updatedAt || agent.updated_at || agent.updatedDate || null,
      // Features & Programs - Extract ONLY from featuresContent, NOT from overview
      // DO NOT use agent.overview or agent.description here - those are for Overview tab
      features: (() => {
        // ONLY check featuresContent object fields, NOT agent overview/description
        let featuresList = featuresContent.features || 
                          featuresContent.featureList || 
                          featuresContent.list || 
                          featuresContent.items ||
                          featuresContent.featureItems ||
                          featuresContent.featuresList ||
                          featuresContent.data ||
                          featuresContent.programs ||
                          featuresContent.programsList ||
                          [];
        
        // Handle string format
        if (typeof featuresList === 'string') {
          try {
            featuresList = JSON.parse(featuresList);
          } catch {
            featuresList = featuresList.split(/\n|,|;/).filter(f => f.trim());
          }
        }
        
        // Handle if it's an object with nested arrays
        if (typeof featuresList === 'object' && !Array.isArray(featuresList)) {
          // Try to extract array from object
          if (featuresList.items) featuresList = featuresList.items;
          else if (featuresList.data) featuresList = featuresList.data;
          else if (featuresList.features) featuresList = featuresList.features;
          else featuresList = [];
        }
        
        // Ensure it's an array
        if (!Array.isArray(featuresList)) {
          featuresList = [];
        }
        
        return featuresList;
      })(),
      // Trust Center - Can be object with {title, description, buttonText, buttonLink} or just URL string
      trustCenter: (() => {
        const trustCenter = featuresContent.trustCenterUrl || featuresContent.trust_center_url || featuresContent.trustCenter || featuresContent.trustCenterURL || null;
        if (!trustCenter) return null;
        
        // If it's an object, return it as is
        if (typeof trustCenter === 'object') {
          return {
            title: trustCenter.title || 'Trust Center',
            description: trustCenter.description || 'Access real-time vendor security and compliance information through their Trust Center.',
            buttonText: trustCenter.buttonText || trustCenter.buttonText || 'View Trust Center',
            buttonLink: trustCenter.buttonLink || trustCenter.url || trustCenter.link || '#'
          };
        }
        
        // If it's a string URL, return as object
        if (typeof trustCenter === 'string') {
          return {
            title: 'Trust Center',
            description: 'Access real-time vendor security and compliance information through their Trust Center.',
            buttonText: 'View Trust Center',
            buttonLink: trustCenter
          };
        }
        
        return null;
      })(),
      trustCenterUrl: (() => {
        const trustCenter = featuresContent.trustCenterUrl || featuresContent.trust_center_url || featuresContent.trustCenter || featuresContent.trustCenterURL || null;
        if (!trustCenter) return null;
        // Return URL for backward compatibility
        return typeof trustCenter === 'object' ? (trustCenter.buttonLink || trustCenter.url || trustCenter.link || null) : trustCenter;
      })(),
      
      // Buyer Guide - Can be object with {title, description, buttonText, buttonLink} or just URL string
      buyerGuide: (() => {
        const buyerGuide = featuresContent.buyerGuideUrl || featuresContent.buyer_guide_url || featuresContent.buyerGuide || featuresContent.buyerGuideURL || null;
        if (!buyerGuide) return null;
        
        // If it's an object, return it as is
        if (typeof buyerGuide === 'object') {
          return {
            title: buyerGuide.title || 'Buyer Guide',
            description: buyerGuide.description || 'Gain valuable insights from real users who purchased this product.',
            buttonText: buyerGuide.buttonText || buyerGuide.button_text || 'Get the Buyer Guide',
            buttonLink: buyerGuide.buttonLink || buyerGuide.url || buyerGuide.link || '#'
          };
        }
        
        // If it's a string URL, return as object
        if (typeof buyerGuide === 'string') {
          return {
            title: 'Buyer Guide',
            description: 'Gain valuable insights from real users who purchased this product.',
            buttonText: 'Get the Buyer Guide',
            buttonLink: buyerGuide
          };
        }
        
        return null;
      })(),
      buyerGuideUrl: (() => {
        const buyerGuide = featuresContent.buyerGuideUrl || featuresContent.buyer_guide_url || featuresContent.buyerGuide || featuresContent.buyerGuideURL || null;
        if (!buyerGuide) return null;
        // Return URL for backward compatibility
        return typeof buyerGuide === 'object' ? (buyerGuide.buttonLink || buyerGuide.url || buyerGuide.link || null) : buyerGuide;
      })(),
      // Store ALL featuresContent data for comprehensive display
      featuresData: featuresContent,
      // Only use description if it's specifically in featuresContent and NOT the same as overview
      featuresDescription: (featuresContent.description && featuresContent.description !== agent.overview) 
        ? featuresContent.description 
        : (featuresContent.desc && featuresContent.desc !== agent.overview) 
          ? featuresContent.desc 
          : null,
      featuresTitle: featuresContent.title || featuresContent.name || null,
      featuresSections: featuresContent.sections || featuresContent.categories || null,
      // Programs data
      programs: featuresContent.programs || featuresContent.programsList || featuresContent.programList || [],
      // Resources - Extract ONLY from resourcesContent, NOT from agent overview/description
      resources: (() => {
        // Check vendorResources.links first, then other fields
        let resourcesList = resourcesContent.vendorResources?.links ||
                           resourcesContent.vendor_resources?.links ||
                           resourcesContent.resources || 
                           resourcesContent.resourceLinks || 
                           resourcesContent.links || 
                           resourcesContent.list ||
                           resourcesContent.items ||
                           resourcesContent.resourceList ||
                           resourcesContent.data ||
                           [];
        
        // Handle string format
        if (typeof resourcesList === 'string') {
          try {
            resourcesList = JSON.parse(resourcesList);
          } catch {
            resourcesList = resourcesList.split(/\n|,|;/).filter(r => r.trim());
          }
        }
        
        // Handle if it's an object with nested arrays
        if (typeof resourcesList === 'object' && !Array.isArray(resourcesList)) {
          if (resourcesList.items) resourcesList = resourcesList.items;
          else if (resourcesList.data) resourcesList = resourcesList.data;
          else if (resourcesList.resources) resourcesList = resourcesList.resources;
          else if (resourcesList.links) resourcesList = resourcesList.links;
          else resourcesList = [];
        }
        
        // Ensure it's an array
        if (!Array.isArray(resourcesList)) {
          resourcesList = [];
        }
        
        return resourcesList;
      })(),
      resourceLinks: (() => {
        // Extract links from resourcesContent - Check vendorResources.links first
        let links = resourcesContent.vendorResources?.links ||
                    resourcesContent.vendor_resources?.links ||
                    resourcesContent.resourceLinks || 
                    resourcesContent.links || 
                    resourcesContent.linkList ||
                    resourcesContent.resources || // Sometimes resources is the links array
                    [];
        
        // Handle string format
        if (typeof links === 'string') {
          try {
            links = JSON.parse(links);
          } catch {
            links = links.split(/\n|,|;/).filter(l => l.trim());
          }
        }
        
        // Handle if it's an object with nested arrays
        if (typeof links === 'object' && !Array.isArray(links)) {
          if (links.items) links = links.items;
          else if (links.data) links = links.data;
          else if (links.links) links = links.links;
          else links = [];
        }
        
        if (!Array.isArray(links)) {
          links = [];
        }
        
        return links;
      })(),
      resourceVideos: (() => {
        // Extract videos from resourcesContent
        let videos = resourcesContent.videos || 
                     resourcesContent.resourceVideos || 
                     resourcesContent.videoList ||
                     resourcesContent.videoLinks ||
                     [];
        
        // Handle string format
        if (typeof videos === 'string') {
          try {
            videos = JSON.parse(videos);
          } catch {
            videos = videos.split(/\n|,|;/).filter(v => v.trim());
          }
        }
        
        // Handle if it's an object with nested arrays
        if (typeof videos === 'object' && !Array.isArray(videos)) {
          if (videos.items) videos = videos.items;
          else if (videos.data) videos = videos.data;
          else if (videos.videos) videos = videos.videos;
          else videos = [];
        }
        
        if (!Array.isArray(videos)) {
          videos = [];
        }
        
        return videos;
      })(),
      resourcesData: resourcesContent, // Store full resourcesContent object
      resourcesDescription: resourcesContent.description || resourcesContent.desc || null,
      resourcesTitle: resourcesContent.title || resourcesContent.name || null,
      // Support - from supportContent object (vendorSupport and awsSupport nested structure)
      supportDescription: supportContent?.vendorSupport?.description || supportContent?.description || supportContent?.info || supportContent?.desc || agent.supportDescription || agent.support_description || agent.supportInfo || null,
      supportEmail: supportContent?.vendorSupport?.email || supportContent?.email || supportContent?.emailAddress || supportContent?.email_address || agent.supportEmail || agent.support_email || agent.email || null,
      supportPhone: supportContent?.vendorSupport?.phone || supportContent?.phone || supportContent?.phoneNumber || supportContent?.phone_number || supportContent?.tel || supportContent?.telephone || agent.supportPhone || agent.support_phone || agent.phone || null,
      supportTitle: supportContent?.vendorSupport?.title || 'Vendor support',
      // AWS Support - from awsSupport nested structure
      awsSupportDescription: supportContent?.awsSupport?.description || null,
      awsSupportTitle: supportContent?.awsSupport?.title || 'AWS infrastructure support',
      awsSupportButtonText: supportContent?.awsSupport?.buttonText || supportContent?.awsSupport?.button_text || 'Get support',
      awsSupportUrl: supportContent?.awsSupport?.buttonLink || supportContent?.awsSupport?.button_link || supportContent?.awsSupport?.url || supportContent?.awsSupportUrl || supportContent?.aws_support_url || supportContent?.awsUrl || supportContent?.aws_url || agent.awsSupportUrl || agent.aws_support_url || null,
      supportData: supportContent, // Store full supportContent object
      // Product Comparison - Extract from comparisonData array structure
      comparisonData: productComparisonContent, // Store full productComparisonContent object
      comparisonProducts: (() => {
        // Check if comparisonData array exists with products
        if (productComparisonContent.comparisonData && Array.isArray(productComparisonContent.comparisonData) && productComparisonContent.comparisonData.length > 0) {
          // Get products from first comparisonData item
          const firstComparison = productComparisonContent.comparisonData[0];
          if (firstComparison.products && Array.isArray(firstComparison.products)) {
            return firstComparison.products;
          }
        }
        // Fallback to other field names
        return productComparisonContent.products || 
               productComparisonContent.comparisonProducts || 
               agent.comparisonProducts || 
               agent.comparison_products || 
               agent.similarProducts || [];
      })(),
      comparisonTitle: (() => {
        // Get comparison title from comparisonData
        if (productComparisonContent.comparisonData && Array.isArray(productComparisonContent.comparisonData) && productComparisonContent.comparisonData.length > 0) {
          return productComparisonContent.comparisonData[0].comparison_title || null;
        }
        return productComparisonContent.title || productComparisonContent.comparisonTitle || null;
      })(),
      updatedWeekly: productComparisonContent.updatedWeekly || productComparisonContent.updated_weekly || false,
      accolades: productComparisonContent.accolades || agent.accolades || agent.awards || [],
      // Pricing & How to Buy - from pricingContent object or direct fields (but keep hardcoded for display)
      pricingPlans: pricingContent.plans || pricingContent.pricingPlans || agent.pricingPlans || agent.pricing_plans || agent.plans || [],
      pricingOptions: pricingContent.options || pricingContent.pricingOptions || agent.pricingOptions || agent.pricing_options || [],
      pricingDescription: pricingContent.description || agent.pricingDescription || agent.pricing_description || null,
      contractType: pricingContent.contractType || pricingContent.contract_type || agent.contractType || agent.contract_type || null,
      standardContract: pricingContent.standardContract || pricingContent.standard_contract || agent.standardContract || agent.standard_contract || false,
      pricingData: pricingContent, // Store full pricingContent object
      // Store original agent object for access to any other fields
      _original: agent,
      breadcrumbs: [
        { name: 'AWS Marketplace', url: '/marketplace' },
        { name: getCategoryName(agent.category) || agent.categoryName || agent.category_name || 'Category', url: '/marketplace' },
        { name: agent.name || agent.title || 'Agent', url: '#' }
      ]
    };
    
    return mapped;
  })() : {
    // Fallback structure when no data
    id: null,
    name: '',
    logo: '/src/assets/imgs/page/homepage1/imgsp1.png',
    seller: '',
    rating: 0,
    awsReviews: 0,
    externalReviews: 0,
    badges: [],
    shortDescription: '',
    videoThumbnail: '/src/assets/imgs/page/homepage1/imgsp1.png',
    overview: '',
    highlights: [],
    breadcrumbs: [
      { name: 'AWS Marketplace', url: '/marketplace' }
    ]
  };

  // Update document title when product loads
  useEffect(() => {
    if (product && product.name) {
      document.title = `${product.name} - AI Marketplace - VCloud Tech`;
    } else {
      document.title = 'AI Marketplace - VCloud Tech';
    }
  }, [product]);

  // Scroll Spy: Update active tab based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = tabs.map(tab => ({
        id: tab.toLowerCase().replace(/\s+/g, '-'),
        element: document.getElementById(tab.toLowerCase().replace(/\s+/g, '-'))
      }));

      const scrollPosition = window.scrollY + 200; // Offset for better detection

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element && section.element.offsetTop <= scrollPosition) {
          setActiveTab(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle tab click - scroll to section
  const handleTabClick = (tab) => {
    const sectionId = tab.toLowerCase().replace(/\s+/g, '-');
    const element = document.getElementById(sectionId);
    
    if (element) {
      const offsetTop = element.offsetTop - 100; // Offset for header
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    
    setActiveTab(sectionId);
  };

  const tabs = [
    'Overview',
    'Features',
    'Resources',
    'Support',
    'Product comparison',
    'How to buy'
  ];

  // Function to convert text URLs to clickable links with styled color
  const renderTextWithLinks = (text) => {
    if (!text) return text;
    
    // URL regex pattern
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'rgb(0, 113, 133)',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.target.style.textDecoration = 'underline';
              e.target.style.color = 'rgb(0, 95, 115)';
            }}
            onMouseLeave={(e) => {
              e.target.style.textDecoration = 'none';
              e.target.style.color = 'rgb(0, 113, 133)';
            }}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} style={{ color: '#FFB800', fontSize: '18px' }}>★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} style={{ color: '#FFB800', fontSize: '18px' }}>⯨</span>);
      } else {
        stars.push(<span key={i} style={{ color: '#ddd', fontSize: '18px' }}>★</span>);
      }
    }
    return stars;
  };

  return (
    <main className="main" style={{ paddingTop: '70px', backgroundColor: 'white' }}>
      <div className="container-fluid" style={{ padding: isMobile ? '0 15px' : '0 40px' }}>
        {/* Loading State */}
        {loading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            backgroundColor: 'white',
            borderRadius: '10px',
            marginBottom: '25px'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #111A45',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <p style={{ 
              fontSize: '16px', 
              color: '#565959',
              margin: 0,
              fontFamily: 'DM Sans, sans-serif'
            }}>
              Loading agent details...
            </p>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div style={{ 
            backgroundColor: '#fff5f5',
            border: '1px solid #fecaca',
            borderRadius: '10px',
            padding: '30px',
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            <p style={{ 
              fontSize: '18px', 
              color: '#dc2626',
              fontWeight: '600',
              margin: '0 0 10px 0',
              fontFamily: 'DM Sans, sans-serif'
            }}>
              Error loading agent details
            </p>
            <p style={{ 
              fontSize: '14px', 
              color: '#991b1b',
              margin: 0,
              fontFamily: 'DM Sans, sans-serif'
            }}>
              {error}
            </p>
            <Link 
              to="/marketplace"
              style={{
                display: 'inline-block',
                marginTop: '20px',
                padding: '10px 24px',
                backgroundColor: '#111A45',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: 'DM Sans, sans-serif'
              }}
            >
              Back to Marketplace
            </Link>
          </div>
        )}

        {/* Product Content - Only show if not loading and no error */}
        {!loading && !error && agent && (
          <>
        {/* Product Header - Design 1: Clean & Professional */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: isMobile ? '20px' : '35px',
          marginBottom: '25px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          border: '1px solid #E5E7EB'
        }}>
          <div className="row">
            {/* Left - Product Info */}
            <div className="col-lg-8">
              <div style={{ display: 'flex', gap: isMobile ? '15px' : '25px', alignItems: 'flex-start' }}>
                {/* Logo - Clean Gray Box */}
                <div style={{
                  width: isMobile ? '70px' : '95px',
                  height: isMobile ? '70px' : '95px',
                  flexShrink: 0,
                  backgroundColor: '#F3F4F6',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px',
                  border: '2px solid #E5E7EB'
                }}>
                  <img
                    src={product.logo}
                    alt={product.name}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </div>

                {/* Product Info */}
                <div style={{ flex: 1 }}>
                  {/* Title */}
                    <h1 style={{
                    fontSize: isMobile ? '22px' : '30px',
                    fontWeight: '700',
                    color: '#16191f',
                    margin: '0 0 16px 0',
                    fontFamily: 'inherit',
                    lineHeight: '1.2'
                    }}>
                      {product.name}
                    </h1>

                  {/* Badges - Soft Colors */}
                  {/* <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '6px 14px',
                      backgroundColor: '#FEF3F2',
                      border: '1px solid #FEE2E2',
                      borderRadius: '6px',
                      fontSize: '13px',
                      color: '#991B1B',
                      fontWeight: '600',
                      fontFamily: 'inherit'
                    }}>
                      ☁️ Deployed on AWS
                    </span>
                    <span style={{
                      padding: '6px 14px',
                      backgroundColor: '#F0FDF4',
                      border: '1px solid #DCFCE7',
                      borderRadius: '6px',
                      fontSize: '13px',
                      color: '#166534',
                      fontWeight: '600',
                      fontFamily: 'inherit'
                    }}>
                      🎁 Free Trial
                    </span>
                    <span style={{
                      padding: '6px 14px',
                      backgroundColor: '#FEF9C3',
                      border: '1px solid #FEF08A',
                      borderRadius: '6px',
                      fontSize: '13px',
                      color: '#854D0E',
                      fontWeight: '600',
                      fontFamily: 'inherit'
                    }}>
                      ⚡ AWS Free Tier
                    </span>
                  </div> */}

                  {/* Description */}
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '400',
                    color: '#000000',
                    lineHeight: '1.7',
                    margin: '0 0 14px 0',
                    fontFamily: 'inherit',
                    maxHeight: isShortDescriptionExpanded ? 'none' : '60px',
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease'
                  }}>
                    <p style={{ margin: 0 }}>
                      {renderTextWithLinks(product.shortDescription)}
                    </p>
                  </div>

                  {/* Show More/Less Button for Short Description */}
                  {product.shortDescription && product.shortDescription.length > 100 && (
                    <button
                      onClick={() => setIsShortDescriptionExpanded(!isShortDescriptionExpanded)}
                      style={{
                        fontSize: '14px',
                        fontWeight: '400',
                        color: 'rgb(0, 113, 133)',
                        backgroundColor: 'transparent',
                        border: 'none',
                        padding: '0',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        textDecoration: 'none',
                        marginTop: '8px',
                        marginBottom: '14px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
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
                      <svg 
                        width="16" 
                        height="16" 
                        viewBox="0 0 16 16" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ flexShrink: 0 }}
                      >
                        <rect 
                          width="16" 
                          height="16" 
                          rx="2" 
                          fill="rgb(0, 113, 133)"
                        />
                        {isShortDescriptionExpanded ? (
                          <line 
                            x1="4" 
                            y1="8" 
                            x2="12" 
                            y2="8" 
                            stroke="white" 
                            strokeWidth="2" 
                            strokeLinecap="round"
                          />
                        ) : (
                          <path 
                            d="M8 4V12M4 8H12" 
                            stroke="white" 
                            strokeWidth="2" 
                            strokeLinecap="round"
                          />
                        )}
                      </svg>
                      <span>{isShortDescriptionExpanded ? 'Show less' : 'Show more'}</span>
                    </button>
                  )}

                  {/* Rating */}
                  {/* <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '3px' }}>
                      {renderStars(product.rating)}
                    </div>
                    <span style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#16191f',
                      fontFamily: 'inherit'
                    }}>
                      {product.rating}
                    </span>
                    <span style={{
                      fontSize: '14px',
                      color: '#16191f',
                      fontFamily: 'inherit'
                    }}>
                      ({product.awsReviews + product.externalReviews} reviews)
                    </span>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Right - Action Buttons */}
            <div className="col-lg-4" style={{ marginTop: isTablet ? '25px' : '0' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <button style={{
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
                  boxShadow: '0 2px 8px rgba(17, 26, 69, 0.2)'
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
                >
                  View Purchase Options
                </button>

                <button style={{
                  padding: '14px 28px',
                  backgroundColor: 'white',
                  border: '2px solid #111A45',
                  borderRadius: '25px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#16191f',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s ease'
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
                >
                  Try for Free
                </button>

                <button style={{
                  padding: '14px 28px',
                  backgroundColor: 'white',
                  border: '2px solid #6B7280',
                  borderRadius: '25px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#16191f',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s ease'
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
                >
                  Request Demo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation - Button/Pills Style - STICKY */}
        <div style={{
          position: 'sticky',
          top: '70px',
          zIndex: 100,
          backgroundColor: '#F9FAFB',
          borderRadius: '12px',
          padding: '12px 20px',
          marginBottom: '25px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          overflowX: 'auto',
          scrollbarWidth: 'thin'
        }}>
          <div style={{
            display: 'flex',
            gap: '10px',
            flexWrap: isMobile ? 'nowrap' : 'wrap'
          }}>
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.toLowerCase().replace(/\s+/g, '-');
              return (
                <button
                  key={index}
                  onClick={() => handleTabClick(tab)}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    backgroundColor: isActive ? '#df2020' : 'white',
                    color: isActive ? 'white' : '#16191f',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: '600',
                    fontFamily: 'inherit',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.3s ease',
                    boxShadow: isActive ? '0 4px 12px rgba(223, 32, 32, 0.3)' : '0 1px 3px rgba(0,0,0,0.08)',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = '#E5E7EB';
                      e.target.style.color = '#16191f';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.color = '#16191f';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
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
                      boxShadow: '0 2px 6px rgba(223, 32, 32, 0.4)'
                    }}>
                      NEW
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Container - All Sections Visible for Scroll */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: isMobile ? '25px' : '35px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          border: '1px solid #E5E7EB'
        }}>
          {/* Overview Section */}
          <div id="overview" style={{ scrollMarginTop: '120px' }}>
              <h2 style={{
                fontSize: isMobile ? '20px' : '24px',
                fontWeight: '600',
                color: '#16191f',
                marginBottom: '20px',
                fontFamily: 'inherit'
              }}>
                Overview
              </h2>

              <div className="row" style={{ alignItems: isTablet ? 'flex-start' : 'stretch' }}>
                {/* Left Column - Video - COMMENTED OUT */}
                {/* <div className="col-lg-6" style={{ display: 'flex', flexDirection: 'column', marginBottom: isTablet ? '20px' : '0' }}>
                <div style={{
                  position: 'relative',
                  width: isMobile ? '100%' : '85%',
                  paddingBottom: isMobile ? '56%' : '48%',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  marginBottom: '12px',
                  cursor: 'pointer',
                  border: '2px solid #e0e0e0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  flex: isTablet ? 'none' : 1
                }}>
                  <img
                    src={product.videoThumbnail}
                    alt="Product Video"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => { e.target.src = '/src/assets/imgs/page/homepage1/imgsp1.png'; }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)'
                  }}></div>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90px',
                    height: '90px',
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '36px',
                    color: '#007185',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,1)';
                    e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.95)';
                    e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
                  }}
                  >
                    ▶
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: isMobile ? '16px' : '24px',
                    left: isMobile ? '16px' : '24px',
                    color: 'white',
                    fontSize: isMobile ? '18px' : '28px',
                    fontWeight: '700',
                    textShadow: '0 3px 6px rgba(0,0,0,0.6)',
                      fontFamily: 'inherit'
                  }}>
                    What is Okta?
                  </div>
                </div>
                <p style={{
                  fontSize: '14px',
                    color: '#16191f',
                  marginBottom: '0',
                    fontFamily: 'inherit',
                    fontWeight: '400',
                  fontStyle: 'italic'
                }}>
                  Product video
                </p>
                </div> */}

              {/* Highlights Column */}
              <div className="col-lg-6" style={{ marginBottom: isMobile ? '20px' : '0' }}>
                <div style={{
                  border: '1px solid #D5D9D9',
                  borderRadius: '8px',
                  padding: '24px',
                  backgroundColor: 'white',
                  height: '100%',
                  overflow: 'hidden'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#16191f',
                    marginBottom: '16px',
                    fontFamily: 'inherit'
                  }}>
                    ✨ Key Highlights
                  </h3>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                  }}>
                    {(() => {
                      // Handle highlights - convert string to array if needed
                      let highlightsList = product.highlights;
                      if (typeof highlightsList === 'string') {
                        // Try to parse if it's JSON string
                        try {
                          highlightsList = JSON.parse(highlightsList);
                        } catch {
                          // If not JSON, split by comma or newline
                          highlightsList = highlightsList.split(/\n|,|;/).filter(h => h.trim());
                        }
                      }
                      if (!Array.isArray(highlightsList)) {
                        highlightsList = [];
                      }
                      
                      return highlightsList.length > 0 ? (
                        highlightsList.map((highlight, index) => (
                      <li key={index} style={{
                        fontSize: '15px',
                        color: '#16191f',
                        lineHeight: '1.7',
                        marginBottom: '15px',
                        paddingLeft: '25px',
                        position: 'relative',
                        fontFamily: 'inherit'
                      }}>
                        <span style={{
                          position: 'absolute',
                          left: 0,
                          top: '8px',
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#111A45',
                          borderRadius: '50%'
                        }}></span>
                            {typeof highlight === 'string' ? highlight : (highlight.text || highlight.title || String(highlight))}
                      </li>
                        ))
                      ) : (
                        <li style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'inherit' }}>
                          No highlights available.
                        </li>
                      );
                    })()}
                  </ul>
                </div>
                </div>

              {/* Details Column */}
              <div className="col-lg-6">
                <div style={{
                  border: '1px solid #D5D9D9',
                  borderRadius: '8px',
                  padding: '24px',
                  backgroundColor: 'white',
                  height: '100%',
                  overflow: 'hidden'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#16191f',
                    marginBottom: '16px',
                    fontFamily: 'inherit'
                  }}>
                    Details
                  </h3>

                  {/* Row 1: Sold by & Categories */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
                    {/* Sold by */}
                    <div>
                      <div style={{
                        fontSize: '14px',
                        color: '#16191f',
                        fontFamily: 'inherit',
                        fontWeight: '600',
                        marginBottom: '8px'
                      }}>
                        Sold by
                      </div>
                      <div style={{
                        fontSize: '15px',
                        color: '#16191f',
                        fontFamily: 'inherit',
                        fontWeight: '600'
                      }}>
                        {product.seller}
                      </div>
                    </div>

                    {/* Categories */}
                    <div>
                      <div style={{
                        fontSize: '13px',
                        color: '#16191f',
                        marginBottom: '6px',
                        fontFamily: 'inherit',
                        fontWeight: '400'
                      }}>
                        Categories
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {product.category ? (
                          <a
                            href={`/marketplace?category=${product.categoryId || ''}`}
                            style={{
                              fontSize: '14px',
                              color: 'rgb(0, 113, 133)',
                              textDecoration: 'none',
                              fontFamily: 'inherit',
                              fontWeight: '400',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              width: 'fit-content'
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
                            {typeof product.category === 'string' ? product.category : (product.category.name || product.category.title || 'Category')}
                            <span style={{ fontSize: '11px' }}>🔗</span>
                          </a>
                        ) : (
                          <span style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'inherit' }}>Not specified</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Delivery method & Deployed on AWS */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {/* Delivery method */}
                    <div>
                      <div style={{
                        fontSize: '13px',
                        color: '#16191f',
                        fontFamily: 'inherit',
                        fontWeight: '400',
                        marginBottom: '6px'
                      }}>
                        Delivery method
                      </div>
                      <span style={{
                        fontSize: '14px',
                        color: '#16191f',
                        fontFamily: 'inherit',
                        fontWeight: '400',
                        borderBottom: '1px dotted #16191f',
                        display: 'inline-block'
                      }}>
                        {product.deliveryMethod || 'Not specified'}
                      </span>
                    </div>

                    {/* Deployed on AWS */}
                    <div>
                      <div style={{
                        fontSize: '13px',
                        color: '#16191f',
                        fontFamily: 'inherit',
                        fontWeight: '400',
                        marginBottom: '6px'
                      }}>
                        Deployed on AWS
                      </div>
                      <span style={{
                        fontSize: '14px',
                        color: '#16191f',
                        fontFamily: 'inherit',
                        fontWeight: '400',
                        borderBottom: '1px dotted #16191f',
                        display: 'inline-block'
                      }}>
                        {product.deployedOnAWS ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Width Description Section */}
            <div className="row mt-4">
              <div className="col-12">
                <div style={{
                  border: '1px solid #D5D9D9',
                  borderRadius: '8px',
                  padding: '24px',
                  backgroundColor: 'white',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    fontSize: '14px',
                    color: '#000000',
                    lineHeight: '1.8',
                    fontFamily: 'inherit',
                    maxHeight: isDescriptionExpanded ? 'none' : '120px',
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease'
                  }}>
                    <p style={{ margin: 0, fontSize: '14px', color: '#000000' }}>{renderTextWithLinks(product.overview)}</p>
                  </div>

                  {/* See More/Less Button - Modern & Spicy */}
                  {product.overview && product.overview.length > 200 && (
                    <div style={{
                      marginTop: '20px',
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      <button
                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                        style={{
                          fontSize: '15px',
                          fontWeight: '600',
                          color: '#007185',
                          backgroundColor: 'transparent',
                          border: '2px solid rgb(0, 113, 133)',
                          borderRadius: '25px',
                          padding: '12px 28px',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow: 'none',
                          minWidth: '150px',
                          whiteSpace: 'nowrap',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#E6F4F7';
                          e.currentTarget.style.color = '#007185';
                          e.currentTarget.style.borderColor = '#007185';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 113, 133, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#007185';
                          e.currentTarget.style.borderColor = '#007185';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <span style={{ position: 'relative', zIndex: 1 }}>
                          {isDescriptionExpanded ? 'Show less' : 'Show more'}
                        </span>
                        <svg 
                          width="18" 
                          height="18" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                          style={{
                            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: isDescriptionExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            position: 'relative',
                            zIndex: 1
                        }}
                      >
                        {isDescriptionExpanded ? (
                            <path 
                              d="M18 15L12 9L6 15" 
                              stroke="currentColor" 
                              strokeWidth="2.5" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            />
                          ) : (
                            <path 
                              d="M6 9L12 15L18 9" 
                              stroke="currentColor" 
                              strokeWidth="2.5" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            />
                          )}
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div id="features" style={{ scrollMarginTop: '120px', marginTop: '40px' }}>
              <h2 style={{
                fontSize: isMobile ? '20px' : '24px',
                fontWeight: '600',
                color: '#16191f',
                marginBottom: '30px',
                fontFamily: 'inherit'
              }}>
                ⚡ Features and Programs
              </h2>

              {/* Features Cards Grid */}
              <div className="row">
                {/* Features Description - Only show if it's NOT overview data */}
                {product.featuresDescription && 
                 product.featuresDescription !== product.overview && 
                 product.featuresDescription !== agent?.overview && (
                  <div className="col-12 mb-4">
                    <div style={{
                      border: '1px solid #D5D9D9',
                      borderRadius: '8px',
                      padding: '24px',
                      backgroundColor: 'white'
                    }}>
                      {product.featuresTitle && (
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#16191f',
                          marginBottom: '12px',
                          fontFamily: 'inherit'
                        }}>
                          {product.featuresTitle}
                        </h3>
                      )}
                      <p style={{
                        fontSize: '14px',
                        color: '#16191f',
                        lineHeight: '1.6',
                        fontFamily: 'inherit',
                        margin: 0
                      }}>
                        {product.featuresDescription}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Features List - Show if features array exists */}
                {product.features && Array.isArray(product.features) && product.features.length > 0 && (
                  <div className="col-12 mb-4">
                    <div style={{
                      border: '1px solid #D5D9D9',
                      borderRadius: '8px',
                      padding: '24px',
                      backgroundColor: 'white'
                    }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#16191f',
                        marginBottom: '16px',
                        fontFamily: 'inherit'
                      }}>
                        Features
                      </h3>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                      }}>
                        {product.features.map((feature, index) => (
                          <li key={index} style={{
                            padding: '8px 0',
                            borderBottom: index < product.features.length - 1 ? '1px solid #E5E7EB' : 'none',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px'
                          }}>
                            <span style={{
                              color: '#10b981',
                              fontSize: '16px',
                              fontWeight: 'bold',
                              marginTop: '2px'
                            }}>✓</span>
                            <span style={{
                              fontSize: '14px',
                              color: '#16191f',
                              fontFamily: 'inherit',
                              lineHeight: '1.6'
                            }}>
                              {typeof feature === 'string' ? feature : feature.name || feature.title || feature.description || feature.text || JSON.stringify(feature)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                {/* Programs List - Show if programs array exists */}
                {product.programs && Array.isArray(product.programs) && product.programs.length > 0 && (
                  <div className="col-12 mb-4">
                    <div style={{
                      border: '1px solid #D5D9D9',
                      borderRadius: '8px',
                      padding: '24px',
                      backgroundColor: 'white'
                    }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#16191f',
                        marginBottom: '16px',
                        fontFamily: 'inherit'
                      }}>
                        Programs
                      </h3>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                      }}>
                        {product.programs.map((program, index) => (
                          <li key={index} style={{
                            padding: '8px 0',
                            borderBottom: index < product.programs.length - 1 ? '1px solid #E5E7EB' : 'none',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px'
                          }}>
                            <span style={{
                              color: 'rgb(0, 113, 133)',
                              fontSize: '16px',
                              fontWeight: 'bold',
                              marginTop: '2px'
                            }}>📋</span>
                            <span style={{
                              fontSize: '14px',
                              color: '#16191f',
                              fontFamily: 'inherit',
                              lineHeight: '1.6'
                            }}>
                              {typeof program === 'string' ? program : program.name || program.title || program.description || program.text || JSON.stringify(program)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                {/* Trust Center Card - Only show if URL exists */}
                {product.trustCenterUrl && (
                <div className="col-lg-6 mb-4">
                  <div style={{
                    border: '1px solid #D5D9D9',
                    borderRadius: '8px',
                    padding: '24px',
                    height: '100%',
                    backgroundColor: 'white',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  >
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#16191f',
                      marginBottom: '16px',
                      fontFamily: 'inherit'
                    }}>
                      Trust Center
                    </h3>

                    <p style={{
                      fontSize: '14px',
                      color: '#16191f',
                      lineHeight: '1.6',
                      marginBottom: '16px',
                      fontFamily: 'inherit'
                    }}>
                      Access real-time vendor security and compliance information through their Trust Center. Review certifications and security standards before purchase.
                    </p>

                    {/* Button */}
                    <a
                      href={product.trustCenterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                      padding: '12px 24px',
                      backgroundColor: '#111A45',
                      border: 'none',
                      borderRadius: '25px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'white',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(17, 26, 69, 0.2)',
                        textDecoration: 'none',
                        display: 'inline-block',
                        textAlign: 'center',
                        width: 'fit-content'
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
                    >
                      View Trust Center →
                    </a>
                  </div>
                </div>
                )}

                {/* Buyer Guide Card - Show if buyerGuide object exists */}
                {product.buyerGuide && (
                <div className="col-lg-6 mb-4">
                  <div style={{
                    border: '1px solid #D5D9D9',
                    borderRadius: '8px',
                    padding: '24px',
                    height: '100%',
                    backgroundColor: 'white',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  >
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#16191f',
                      marginBottom: '16px',
                      fontFamily: 'inherit'
                    }}>
                      {product.buyerGuide.title || 'Buyer Guide'}
                    </h3>

                    {/* Description */}
                    <p style={{
                      fontSize: '15px',
                      color: '#16191f',
                      lineHeight: '1.7',
                      marginBottom: '20px',
                      fontFamily: 'inherit'
                    }}>
                      {product.buyerGuide.description || 'Gain valuable insights from real users who purchased this product.'}
                    </p>

                    {/* Button */}
                    <a
                      href={product.buyerGuide.buttonLink || product.buyerGuideUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                      padding: '12px 24px',
                      backgroundColor: 'white',
                      border: '2px solid #111A45',
                      borderRadius: '25px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#16191f',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                        transition: 'all 0.3s ease',
                        textDecoration: 'none',
                        display: 'inline-block',
                        textAlign: 'center',
                        width: 'fit-content'
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
                    >
                      {product.buyerGuide.buttonText || 'Get the Buyer Guide'} →
                    </a>
                  </div>
                </div>
                )}

                {/* Show message if no features available */}
                {!product.trustCenter && 
                 !product.buyerGuide && 
                 (!product.features || !Array.isArray(product.features) || product.features.length === 0) &&
                 (!product.programs || !Array.isArray(product.programs) || product.programs.length === 0) &&
                 (!product.featuresData || Object.keys(product.featuresData).length === 0) && (
                  <div className="col-12">
                    <p style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'inherit', textAlign: 'center', padding: '40px' }}>
                      No features and programs available at this time.
                    </p>
                  </div>
                )}
              </div>
            </div>

          {/* Resources Section */}
          <div id="resources" style={{ scrollMarginTop: '120px', marginTop: '40px' }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#16191f',
                marginBottom: '30px',
                fontFamily: 'inherit'
              }}>
                Resources
              </h2>

              {/* Vendor Resources Card */}
              <div style={{
                border: '1px solid #D5D9D9',
                borderRadius: '8px',
                backgroundColor: 'white',
                overflow: 'hidden'
              }}>
                {/* Card Title */}
                <div style={{
                  padding: '20px 24px',
                  borderBottom: '1px solid #D5D9D9'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#16191f',
                    margin: 0,
                    fontFamily: 'inherit'
                  }}>
                    Vendor resources
                  </h3>
                </div>

                {/* Tabs */}
                <div style={{
                  display: 'flex',
                  borderBottom: '1px solid #D5D9D9',
                  padding: '0 24px'
                }}>
                  <button
                    style={{
                      padding: '12px 0',
                      marginRight: '24px',
                      border: 'none',
                      backgroundColor: 'transparent',
                          borderBottom: '3px solid rgb(0, 113, 133)',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#007185',
                      fontFamily: 'inherit'
                    }}
                  >
                    Links
                  </button>
                  <span style={{
                    borderLeft: '1px solid #D5D9D9',
                    height: '40px',
                    alignSelf: 'center'
                  }}></span>
                  <button
                    style={{
                      padding: '12px 0',
                      marginLeft: '24px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      borderBottom: '3px solid transparent',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '400',
                      color: '#16191f',
                      fontFamily: 'inherit',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'rgb(0, 113, 133)'}
                    onMouseLeave={(e) => e.target.style.color = '#16191f'}
                  >
                    Videos
                  </button>
                </div>

                {/* Links Content */}
                <div style={{ padding: '24px' }}>
                  {(() => {
                    // Use properly extracted resourceLinks from resourcesContent
                    let resourceLinksList = product.resourceLinks || [];
                    
                    // If resourceLinks is empty, try resources array
                    if (!resourceLinksList || resourceLinksList.length === 0) {
                      resourceLinksList = product.resources || [];
                    }
                    
                    // Also check documentation URL from agent
                    if (product.documentationUrl && !resourceLinksList.find(r => (r.url || r.link || r.href) === product.documentationUrl)) {
                      resourceLinksList.push({ 
                        title: 'Documentation', 
                        url: product.documentationUrl,
                        name: 'Documentation',
                        link: product.documentationUrl
                      });
                    }
                    
                    // Also check website URL
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
                        // Handle both object and string formats
                        const resourceUrl = resource.url || resource.link || resource.href || (typeof resource === 'string' ? resource : '#');
                        const resourceTitle = resource.title || resource.name || resource.label || (typeof resource === 'string' ? resource : `Resource ${index + 1}`);
                        
                        return (
                          <div key={index} style={{ marginBottom: index < resourceLinksList.length - 1 ? '16px' : '0' }}>
                            <a
                              href={resourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                      style={{
                        fontSize: '14px',
                                color: 'rgb(0, 113, 133)',
                        textDecoration: 'none',
                        fontFamily: 'inherit',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
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
                              {resourceTitle}
                      <span style={{ fontSize: '12px' }}>🔗</span>
                    </a>
                          </div>
                        );
                      });
                    } else {
                      return (
                        <p style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'inherit', margin: 0 }}>
                          No resources available at this time.
                        </p>
                      );
                    }
                  })()}
                  </div>

                {/* Videos Content - Show if videos exist */}
                {product.resourceVideos && Array.isArray(product.resourceVideos) && product.resourceVideos.length > 0 && (
                  <div style={{ padding: '24px', borderTop: '1px solid #D5D9D9' }}>
                    {product.resourceVideos.map((video, index) => {
                      const videoUrl = video.url || video.link || video.href || (typeof video === 'string' ? video : '#');
                      const videoTitle = video.title || video.name || video.label || (typeof video === 'string' ? video : `Video ${index + 1}`);
                      const videoThumbnail = video.thumbnail || video.image || video.thumb || null;
                      
                      return (
                        <div key={index} style={{ marginBottom: index < product.resourceVideos.length - 1 ? '20px' : '0' }}>
                          <a
                            href={videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                      style={{
                              display: 'flex',
                        alignItems: 'center',
                              gap: '12px',
                              textDecoration: 'none',
                              color: 'rgb(0, 113, 133)',
                              fontFamily: 'inherit'
                      }}
                      onMouseEnter={(e) => {
                              e.currentTarget.style.opacity = '0.8';
                      }}
                      onMouseLeave={(e) => {
                              e.currentTarget.style.opacity = '1';
                            }}
                          >
                            {videoThumbnail ? (
                              <img 
                                src={videoThumbnail} 
                                alt={videoTitle}
                                style={{
                                  width: '120px',
                                  height: '68px',
                                  objectFit: 'cover',
                                  borderRadius: '4px',
                                  backgroundColor: '#f0f0f0'
                                }}
                              />
                            ) : (
                              <div style={{
                                width: '120px',
                                height: '68px',
                                backgroundColor: '#f0f0f0',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px',
                                color: '#007185'
                              }}>
                                ▶
                              </div>
                            )}
                            <div style={{ flex: 1 }}>
                              <div style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#16191f',
                                marginBottom: '4px',
                                fontFamily: 'inherit'
                              }}>
                                {videoTitle}
                              </div>
                              {video.description && (
                                <div style={{
                                  fontSize: '12px',
                                  color: '#6B7280',
                                  fontFamily: 'inherit'
                                }}>
                                  {video.description}
                                </div>
                              )}
                            </div>
                    </a>
                  </div>
                      );
                    })}
                </div>
                )}
              </div>
            </div>

          {/* Support Section */}
          <div id="support" style={{ scrollMarginTop: '120px', marginTop: '40px' }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#16191f',
                marginBottom: '30px',
                fontFamily: 'inherit'
              }}>
                Support
              </h2>

              <div className="row">
                {/* Vendor Support Card */}
                <div className="col-lg-6 mb-4">
                  <div style={{
                    border: '1px solid #D5D9D9',
                    borderRadius: '8px',
                    padding: '24px',
                    backgroundColor: 'white',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#16191f',
                      marginBottom: '16px',
                      fontFamily: 'inherit'
                    }}>
                      {product.supportTitle || 'Vendor support'}
                    </h3>

                    <p style={{
                      fontSize: '14px',
                      color: '#16191f',
                      lineHeight: '1.6',
                      marginBottom: '16px',
                      fontFamily: 'inherit'
                    }}>
                      {product.supportDescription || 'Contact the vendor for support inquiries and assistance.'}
                    </p>

                    <div style={{
                      fontSize: '14px',
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
                <div className="col-lg-6 mb-4">
                  <div style={{
                    border: '1px solid #D5D9D9',
                    borderRadius: '8px',
                    padding: '24px',
                    backgroundColor: 'white',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#16191f',
                      marginBottom: '16px',
                      fontFamily: 'inherit'
                    }}>
                      {product.awsSupportTitle || 'AWS infrastructure support'}
                    </h3>

                    <p style={{
                      fontSize: '14px',
                      color: '#16191f',
                      lineHeight: '1.6',
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
                      fontSize: '14px',
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
                          fontSize: '14px',
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
            </div>

          {/* Product Comparison Section */}
          <div id="product-comparison" style={{ scrollMarginTop: '120px', marginTop: '40px' }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'center',
                marginBottom: '30px',
                gap: isMobile ? '15px' : '0'
              }}>
                <div>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#16191f',
                    margin: '0 0 4px 0',
                    fontFamily: 'inherit'
                  }}>
                    Product comparison
                  </h2>
                  <p style={{
                    fontSize: '13px',
                    color: '#16191f',
                    margin: 0,
                    fontFamily: 'inherit'
                  }}>
                    {product.updatedWeekly ? 'Updated weekly' : product.comparisonTitle || 'Compare this product with similar alternatives'}
                  </p>
                </div>
                </div>

              {/* Show message if no comparison data available */}
              {(!product.comparisonProducts || product.comparisonProducts.length === 0) ? (
                <div style={{
                    border: '1px solid #D5D9D9',
                    borderRadius: '8px',
                  padding: '40px',
                    backgroundColor: 'white',
                  textAlign: 'center'
                }}>
                  <p style={{
                    fontSize: '14px',
                    color: '#6B7280',
                    fontFamily: 'inherit',
                    margin: 0
                  }}>
                    Product comparison data is not available at this time.
                  </p>
                </div>
              ) : (
              /* Comparison Table - Display actual products from API */
              <div style={{
                border: '1px solid #D5D9D9',
                borderRadius: '8px',
                backgroundColor: 'white',
                overflow: isMobile ? 'auto' : 'hidden'
              }}>
                {/* Product Headers */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile 
                    ? `150px repeat(${product.comparisonProducts.length}, 200px)` 
                    : `250px repeat(${product.comparisonProducts.length}, 1fr)`,
                  borderBottom: '2px solid rgb(0, 113, 133)',
                  backgroundColor: '#F7F8F8',
                  minWidth: isMobile ? `${150 + (product.comparisonProducts.length * 200)}px` : 'auto'
                }}>
                    <div style={{
                    padding: '20px',
                      display: 'flex',
                      alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '18px' }}>📊</span>
                    <span style={{ 
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#16191f',
                          fontFamily: 'inherit'
                    }}>Compare</span>
                        </div>
                  {/* Dynamic Product Headers from API */}
                  {product.comparisonProducts.map((compProduct, index) => {
                    const brandInitials = (compProduct.brand || compProduct.name || 'N/A').substring(0, 2).toUpperCase();
                    const brandColors = [
                      { bg: '#000', text: '#fff' },
                      { bg: '#4A90E2', text: '#fff' },
                      { bg: '#E53935', text: '#fff' },
                      { bg: '#10b981', text: '#fff' },
                      { bg: '#F59E0B', text: '#fff' },
                      { bg: '#8B5CF6', text: '#fff' },
                      { bg: '#EC4899', text: '#fff' }
                    ];
                    const brandColor = brandColors[index % brandColors.length];
                    
                    return (
                      <div key={index} style={{ 
                        padding: '20px', 
                        borderLeft: '1px solid #D5D9D9',
                        backgroundColor: index === 0 ? '#FFFFFF' : '#FAFAFA',
                        position: 'relative'
                      }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '8px'
                    }}>
                      <div style={{
                            width: '50px',
                            height: '50px',
                            backgroundColor: brandColor.bg,
                            borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                            fontSize: '14px',
                            color: brandColor.text,
                            fontWeight: 'bold',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            border: '2px solid #fff'
                          }}>
                            {brandInitials}
                      </div>
                          <div style={{ flex: 1 }}>
                        <div style={{
                              fontSize: '15px',
                              fontWeight: '700',
                          color: '#16191f',
                              fontFamily: 'inherit',
                              marginBottom: '4px'
                        }}>
                              {compProduct.model || compProduct.name || compProduct.title || `Product ${index + 1}`}
                        </div>
                        <div style={{
                          fontSize: '12px',
                              color: '#6B7280',
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
                  // Find best (lowest) price
                  const prices = product.comparisonProducts.map(p => p.price).filter(p => p != null && !isNaN(p));
                  const bestPrice = prices.length > 0 ? Math.min(...prices) : null;
                  
                  return (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile 
                        ? `150px repeat(${product.comparisonProducts.length}, 200px)` 
                        : `250px repeat(${product.comparisonProducts.length}, 1fr)`,
                      minWidth: isMobile ? `${150 + (product.comparisonProducts.length * 200)}px` : 'auto',
                      borderBottom: '1px solid #D5D9D9',
                      backgroundColor: '#FAFAFA'
                    }}>
                      <div style={{
                        padding: '16px 20px',
                        fontWeight: '600',
                        fontSize: '14px',
                        color: '#16191f',
                        fontFamily: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span style={{ fontSize: '16px' }}>💰</span>
                        <span>Price</span>
                      </div>
                      {product.comparisonProducts.map((compProduct, index) => {
                        const isBestPrice = bestPrice && compProduct.price === bestPrice;
                        return (
                          <div key={index} style={{ 
                            padding: '16px 20px', 
                            borderLeft: '1px solid #D5D9D9', 
                          fontSize: '14px',
                            fontFamily: 'inherit',
                            backgroundColor: isBestPrice ? '#F0FDF4' : 'white',
                            position: 'relative'
                          }}>
                        <div style={{
                              fontWeight: isBestPrice ? '700' : '500',
                              color: isBestPrice ? '#10b981' : '#16191f',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              {compProduct.price ? (
                                <>
                                  <span>{compProduct.currency || 'USD'} {compProduct.price}</span>
                                  {isBestPrice && (
                                    <span style={{
                                      fontSize: '10px',
                                      backgroundColor: '#10b981',
                                      color: 'white',
                                      padding: '2px 6px',
                                      borderRadius: '10px',
                                      fontWeight: '600'
                                    }}>Best</span>
                                  )}
                                </>
                              ) : (
                                <span style={{ color: '#9CA3AF' }}>N/A</span>
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
                  borderBottom: '1px solid #E5E7EB'
                }}>
                  <div style={{
                    padding: '16px 20px',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#16191f',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '16px' }}>🏷️</span>
                    <span>Brand</span>
                  </div>
                  {product.comparisonProducts.map((compProduct, index) => (
                    <div key={index} style={{ 
                      padding: '16px 20px', 
                      borderLeft: '1px solid #D5D9D9', 
                      fontSize: '14px', 
                      fontFamily: 'inherit',
                      backgroundColor: index % 2 === 0 ? 'white' : '#FAFAFA'
                    }}>
                      <span style={{
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        {compProduct.brand || 'N/A'}
                      </span>
                    </div>
                  ))}
                  </div>

                {/* Model Row */}
                    <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile 
                    ? `150px repeat(${product.comparisonProducts.length}, 200px)` 
                    : `250px repeat(${product.comparisonProducts.length}, 1fr)`,
                  minWidth: isMobile ? `${150 + (product.comparisonProducts.length * 200)}px` : 'auto',
                  borderBottom: '1px solid #E5E7EB'
                }}>
                    <div style={{
                    padding: '16px 20px',
                    fontWeight: '600',
                    fontSize: '14px',
                      color: '#16191f',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                    }}>
                    <span style={{ fontSize: '16px' }}>📱</span>
                    <span>Model</span>
                    </div>
                  {product.comparisonProducts.map((compProduct, index) => (
                    <div key={index} style={{ 
                      padding: '16px 20px', 
                      borderLeft: '1px solid #D5D9D9', 
                      fontSize: '14px', 
                      fontFamily: 'inherit',
                      backgroundColor: index % 2 === 0 ? 'white' : '#FAFAFA'
                    }}>
                      <span style={{
                        fontWeight: '600',
                        color: '#16191f'
                      }}>
                        {compProduct.model || compProduct.name || 'N/A'}
                      </span>
                  </div>
                  ))}
                </div>

                {/* Additional rows shown only when expanded */}
                {isComparisonExpanded && (
                <>
                {/* Display Row */}
                {product.comparisonProducts.some(p => p.display) && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile 
                    ? `150px repeat(${product.comparisonProducts.length}, 200px)` 
                    : `250px repeat(${product.comparisonProducts.length}, 1fr)`,
                  minWidth: isMobile ? `${150 + (product.comparisonProducts.length * 200)}px` : 'auto',
                  borderBottom: '1px solid #E5E7EB'
                }}>
                  <div style={{
                    padding: '16px 20px',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#16191f',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '16px' }}>📺</span>
                    <span>Display</span>
                  </div>
                  {product.comparisonProducts.map((compProduct, index) => (
                    <div key={index} style={{ 
                      padding: '16px 20px', 
                      borderLeft: '1px solid #D5D9D9', 
                      fontSize: '14px', 
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
                  borderBottom: '1px solid #E5E7EB'
                }}>
                  <div style={{
                    padding: '16px 20px',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#16191f',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '16px' }}>⚡</span>
                    <span>Processor</span>
                  </div>
                  {product.comparisonProducts.map((compProduct, index) => (
                    <div key={index} style={{ 
                      padding: '16px 20px', 
                      borderLeft: '1px solid #D5D9D9', 
                      fontSize: '14px', 
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
                  borderBottom: '1px solid #E5E7EB'
                }}>
                  <div style={{
                    padding: '16px 20px',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#16191f',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '16px' }}>💾</span>
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
                        borderLeft: '1px solid #D5D9D9', 
                        fontSize: '14px', 
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
                  borderBottom: '1px solid #E5E7EB'
                }}>
                  <div style={{
                    padding: '16px 20px',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#16191f',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '16px' }}>💿</span>
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
                        borderLeft: '1px solid #D5D9D9', 
                        fontSize: '14px', 
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
                  borderBottom: '1px solid #E5E7EB'
                }}>
                  <div style={{
                    padding: '16px 20px',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#16191f',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '16px' }}>🔋</span>
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
                        borderLeft: '1px solid #D5D9D9', 
                        fontSize: '14px', 
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
                  borderBottom: '1px solid #E5E7EB'
                }}>
                  <div style={{
                    padding: '16px 20px',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#16191f',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '16px' }}>📷</span>
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
                        borderLeft: '1px solid #D5D9D9', 
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
                          <span style={{ fontSize: '14px' }}>📸</span>
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
                  borderBottom: '1px solid #E5E7EB'
                }}>
                  <div style={{
                    padding: '16px 20px',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#16191f',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '16px' }}>🖥️</span>
                    <span>OS</span>
                  </div>
                  {product.comparisonProducts.map((compProduct, index) => (
                    <div key={index} style={{ 
                      padding: '16px 20px', 
                      borderLeft: '1px solid #D5D9D9', 
                      fontSize: '14px', 
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
                  borderBottom: '1px solid #E5E7EB'
                }}>
                  <div style={{
                    padding: '16px 20px',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#16191f',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '16px' }}>⭐</span>
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
                        borderLeft: '1px solid #D5D9D9', 
                        fontSize: '14px', 
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
                            fontSize: '18px',
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
                            fontSize: '16px'
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
                )}
              </div>
              )}

              {/* Show Less/More Button */}
              <div style={{ 
                marginTop: '24px', 
                textAlign: 'center',
                padding: '20px 0'
              }}>
                <button
                  onClick={() => setIsComparisonExpanded(!isComparisonExpanded)}
                  style={{
                    fontSize: '15px',
                    fontWeight: '600',
                  color: '#007185',
                    backgroundColor: 'transparent',
                    border: '2px solid #007185',
                    borderRadius: '25px',
                    padding: '12px 28px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: 'none',
                    minWidth: '150px',
                    whiteSpace: 'nowrap',
                    position: 'relative',
                    overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#E6F4F7';
                    e.currentTarget.style.color = '#007185';
                    e.currentTarget.style.borderColor = '#007185';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 113, 133, 0.15)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#007185';
                    e.currentTarget.style.borderColor = '#007185';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span style={{ position: 'relative', zIndex: 1 }}>
                    {isComparisonExpanded ? 'Show less' : 'Show more'}
                  </span>
                  <svg 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: isComparisonExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      position: 'relative',
                      zIndex: 1
                    }}
                  >
                    {isComparisonExpanded ? (
                      <path 
                        d="M18 15L12 9L6 15" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    ) : (
                      <path 
                        d="M6 9L12 15L18 9" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>

          {/* Pricing Section */}
          <div id="how-to-buy" style={{ scrollMarginTop: '120px', marginTop: '40px' }}>
              <h2 style={{
                fontSize: isMobile ? '20px' : '24px',
                fontWeight: '600',
                color: '#16191f',
                marginBottom: '30px',
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
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#16191f',
                    marginBottom: '8px',
                    fontFamily: 'inherit'
                  }}>
                    Free trial
                  </h3>
                  <p style={{
                    fontSize: '14px',
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
                  fontSize: '14px',
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
                padding: '24px',
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
                        fontSize: '20px',
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
                      fontSize: '14px',
                      color: '#16191f',
                      lineHeight: '1.6',
                      marginBottom: '12px',
                      fontFamily: 'inherit'
                    }}>
                      Pricing is based on the duration and terms of your contract with the vendor. This entitles you to a specified quantity of use for the contract duration. If you choose not to renew or replace your contract before it ends, access to these entitlements will expire.
                    </p>

                    <p style={{
                      fontSize: '14px',
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

                  <button style={{
                    padding: '10px 24px',
                    backgroundColor: 'white',
                    border: '1px solid #007185',
                    borderRadius: '25px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#007185',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'background-color 0.2s',
                    whiteSpace: 'nowrap',
                    marginLeft: '20px'
                  }}
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
                    fontSize: '16px',
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
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#16191f',
                  marginBottom: '12px',
                  fontFamily: 'inherit'
                }}>
                  Vendor Refund Policy
                </h3>
                <p style={{
                  fontSize: '14px',
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
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#16191f',
                    marginBottom: '8px',
                    fontFamily: 'inherit'
                  }}>
                    Custom Pricing Options
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#16191f',
                    margin: 0,
                    fontFamily: 'inherit'
                  }}>
                    Request a private offer to receive a custom quote.
                  </p>
                </div>
                <button style={{
                  padding: '10px 24px',
                  backgroundColor: 'white',
                  border: '1px solid #007185',
                  borderRadius: '25px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#007185',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'background-color 0.2s',
                  whiteSpace: 'nowrap',
                  marginLeft: '20px'
                }}
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
            </div>

          {/* Add more tab content as needed */}
        </div>
          </>
        )}
      </div>
    </main>
  );
};

export default MarketplaceProductDetail;


