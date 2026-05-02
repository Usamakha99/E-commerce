import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { aiAgentService } from '../services/aiAgent.service';
import ProductInquiryModal from '../components/ProductInquiryModal';
import renderTextWithLinks from '../components/marketplace-product-detail/renderTextWithLinks';
import {
  getSectionShell,
  getHeroShell,
  getTabsStripInHero,
} from '../components/marketplace-product-detail/sectionShellStyles';
import {
  MarketplaceProductPinnedHero,
  MarketplaceOverviewSection,
  MarketplaceFeaturesSection,
  MarketplaceResourcesSection,
  MarketplaceSupportSection,
  MarketplaceProductComparisonSection,
  MarketplacePricingSection,
} from '../components/marketplace-product-detail';


const MarketplaceProductDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isShortDescriptionExpanded, setIsShortDescriptionExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(typeof window !== 'undefined' && window.innerWidth < 992);
  
  // API state
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  // Product Inquiry Modal state
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  /** AWS-style: compact fixed product bar (logo + title + CTA + tabs) after scrolling */
  const [productBarPinned, setProductBarPinned] = useState(false);

  /** Hero short description: show Show more only when text exceeds ~2 lines (not on 1–2 lines) */
  const heroShortDescriptionRef = useRef(null);
  const [heroShortDescriptionNeedsToggle, setHeroShortDescriptionNeedsToggle] = useState(false);

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
          throw new Error('No agent data received from API');
        }

        setAgent(agentData);
      } catch (err) {
        setError(err.message || 'Failed to fetch AI agent details');
        setAgent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [id]);

  // Fetch categories for filtering
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await aiAgentService.getCategoriesWithCounts();

        let categoriesList = [];
        if (Array.isArray(response)) {
          categoriesList = response;
        } else if (response.data && Array.isArray(response.data)) {
          categoriesList = response.data;
        } else if (response.success && Array.isArray(response.data)) {
          categoriesList = response.data;
        }

        setCategories(categoriesList);
      } catch (err) {
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

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
      seller: agent.provider || agent.seller || agent.vendor || agent.company || (agent.publisher && typeof agent.publisher === 'object' ? agent.publisher.name : agent.publisher) || 'Unknown Provider',
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
      // Product Comparison – API shape: products[], comparisonData[] (rows with category, feature, values), categoryDescriptions{}
      comparisonData: productComparisonContent,
      comparisonDataRows: (() => {
        const raw = productComparisonContent.comparisonData;
        if (!raw || !Array.isArray(raw)) return [];
        // Doc shape: each item is { id, category, feature, values: { thisProduct, product_<id>, ... } }
        return raw.filter((r) => r && (r.feature || r.category) && r.values && typeof r.values === 'object');
      })(),
      comparisonCategoryDescriptions: productComparisonContent.categoryDescriptions || productComparisonContent.category_descriptions || {},
      comparisonProducts: (() => {
        // Doc shape: productComparisonContent.products is top-level array of competitors (id, name, provider, icon, iconColor, logoUrl)
        if (Array.isArray(productComparisonContent.products) && productComparisonContent.products.length > 0) {
          return productComparisonContent.products;
        }
        // Legacy: comparisonData[0].product_comparison or comparisonData[0].products
        if (productComparisonContent.comparisonData && Array.isArray(productComparisonContent.comparisonData) && productComparisonContent.comparisonData.length > 0) {
          const first = productComparisonContent.comparisonData[0];
          if (first.product_comparison && Array.isArray(first.product_comparison)) return first.product_comparison;
          if (first.products && Array.isArray(first.products)) return first.products;
        }
        if (productComparisonContent.comparisonData && typeof productComparisonContent.comparisonData === 'object' && !Array.isArray(productComparisonContent.comparisonData)) {
          if (Array.isArray(productComparisonContent.comparisonData.products)) return productComparisonContent.comparisonData.products;
        }
        return productComparisonContent.comparisonProducts || agent.comparisonProducts || agent.comparison_products || agent.similarProducts || [];
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

  const measureHeroShortDescriptionClamp = useCallback(() => {
    const el = heroShortDescriptionRef.current;
    const text = product?.shortDescription?.trim();
    if (!el || !text) {
      setHeroShortDescriptionNeedsToggle(false);
      return;
    }
    if (isShortDescriptionExpanded) {
      return;
    }
    const tol = 2;
    setHeroShortDescriptionNeedsToggle(el.scrollHeight > el.clientHeight + tol);
  }, [product?.shortDescription, isShortDescriptionExpanded]);

  useEffect(() => {
    setIsShortDescriptionExpanded(false);
    setHeroShortDescriptionNeedsToggle(false);
  }, [id]);

  useLayoutEffect(() => {
    if (loading || isShortDescriptionExpanded) return;
    let cancelled = false;
    const run = () => {
      if (!cancelled) measureHeroShortDescriptionClamp();
    };
    requestAnimationFrame(() => requestAnimationFrame(run));
    return () => {
      cancelled = true;
    };
  }, [loading, product?.shortDescription, isShortDescriptionExpanded, isMobile, isTablet, measureHeroShortDescriptionClamp]);

  useEffect(() => {
    if (loading) return undefined;
    const el = heroShortDescriptionRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => {
      measureHeroShortDescriptionClamp();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [loading, measureHeroShortDescriptionClamp]);

  useEffect(() => {
    const onResize = () => measureHeroShortDescriptionClamp();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [measureHeroShortDescriptionClamp]);

  // Update document title when product loads
  useEffect(() => {
    if (product && product.name) {
      document.title = `${product.name} - AI Marketplace - VCloud Tech`;
    } else {
      document.title = 'AI Marketplace - VCloud Tech';
    }
  }, [product]);

  // Scroll: pin compact product header (AWS Marketplace-style) + scroll-spy tabs
  useEffect(() => {
    const PIN_SCROLL_Y = 88;

    const handleScroll = () => {
      setProductBarPinned(window.scrollY >= PIN_SCROLL_Y);

      const sections = tabs.map(tab => ({
        id: tab.toLowerCase().replace(/\s+/g, '-'),
        element: document.getElementById(tab.toLowerCase().replace(/\s+/g, '-'))
      }));

      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element && section.element.offsetTop <= scrollPosition) {
          setActiveTab(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle tab click - scroll to section (extra offset when AWS-style pinned bar is visible)
  const handleTabClick = (tab) => {
    const sectionId = tab.toLowerCase().replace(/\s+/g, '-');
    const element = document.getElementById(sectionId);

    if (element) {
      const anchorGap = productBarPinned ? 168 : 100;
      const offsetTop = element.offsetTop - anchorGap;
      window.scrollTo({
        top: Math.max(0, offsetTop),
        behavior: 'smooth',
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

  const renderMarketplaceTabs = (compact, centerTabs = false) => (
    <div
      style={{
        display: 'flex',
        gap: compact ? '6px' : '8px',
        flexWrap: isMobile && compact ? 'nowrap' : 'wrap',
        justifyContent: centerTabs ? 'center' : 'flex-start',
        width: '100%',
        overflowX: centerTabs && compact && isMobile ? 'auto' : undefined,
        scrollbarWidth: 'thin',
        WebkitOverflowScrolling: centerTabs && compact && isMobile ? 'touch' : undefined,
      }}
    >
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.toLowerCase().replace(/\s+/g, '-');
        return (
          <button
            key={index}
            type="button"
            onClick={() => handleTabClick(tab)}
            style={{
              padding: compact ? '8px 14px' : '10px 20px',
              border: 'none',
              backgroundColor: isActive ? '#df2020' : 'transparent',
              color: isActive ? 'white' : '#6B7280',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: compact ? '12px' : '13px',
              fontWeight: '700',
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
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: '#df2020', color: 'white', fontSize: '9px', padding: '3px 6px', borderRadius: '10px', fontWeight: '700', boxShadow: '0 2px 6px rgba(223, 32, 32, 0.4)' }}>NEW</span>
            )}
          </button>
        );
      })}
    </div>
  );


  /** Flush under fixed header: logo 30/50px + header padding 5+5 (Header.jsx) */
  const headerClearance = isMobile ? '40px' : '60px';

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} style={{ color: '#FFB800', fontSize: '14px' }}>★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} style={{ color: '#FFB800', fontSize: '14px' }}>⯨</span>);
      } else {
        stars.push(<span key={i} style={{ color: '#ddd', fontSize: '14px' }}>★</span>);
      }
    }
    return stars;
  };

  const sectionShell = getSectionShell(isMobile);
  const heroShell = getHeroShell(isMobile);
  const tabsStripInHero = getTabsStripInHero(isMobile);

  return (
    <main
      className="main marketplace-font-scope"
      style={{
        paddingTop: headerClearance,
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #eef2f7 0%, #f4f6fa 45%, #eef2f7 100%)',
      }}
    >
      <div className="container-fluid" style={{ padding: isMobile ? '0 15px' : '0 40px' }}>
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
              fontSize: '13px', 
              color: '#565959',
              margin: 0,
              fontFamily: 'inherit'
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
              fontSize: '13px', 
              color: '#dc2626',
              fontWeight: '600',
              margin: '0 0 10px 0',
              fontFamily: 'inherit'
            }}>
              Error loading agent details
            </p>
            <p style={{ 
              fontSize: '13px', 
              color: '#991b1b',
              margin: 0,
              fontFamily: 'inherit'
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
                fontSize: '13px',
                fontWeight: '600',
                fontFamily: 'inherit'
              }}
            >
              Back to Marketplace
            </Link>
          </div>
        )}

        {!loading && !error && agent && (
          <>
            <MarketplaceProductPinnedHero
              product={product}
              isMobile={isMobile}
              isTablet={isTablet}
              headerClearance={headerClearance}
              productBarPinned={productBarPinned}
              setShowInquiryModal={setShowInquiryModal}
              renderMarketplaceTabs={renderMarketplaceTabs}
              renderStars={renderStars}
              heroShortDescriptionRef={heroShortDescriptionRef}
              isShortDescriptionExpanded={isShortDescriptionExpanded}
              setIsShortDescriptionExpanded={setIsShortDescriptionExpanded}
              heroShortDescriptionNeedsToggle={heroShortDescriptionNeedsToggle}
              renderTextWithLinks={renderTextWithLinks}
              heroShell={heroShell}
              tabsStripInHero={tabsStripInHero}
            />
            <MarketplaceOverviewSection
              product={product}
              agent={agent}
              categories={categories}
              isMobile={isMobile}
              isTablet={isTablet}
              sectionShell={sectionShell}
              isDescriptionExpanded={isDescriptionExpanded}
              setIsDescriptionExpanded={setIsDescriptionExpanded}
              renderTextWithLinks={renderTextWithLinks}
            />
            <MarketplaceFeaturesSection
              product={product}
              agent={agent}
              isMobile={isMobile}
              sectionShell={sectionShell}
            />
            <MarketplaceResourcesSection
              product={product}
              isMobile={isMobile}
              sectionShell={sectionShell}
            />
            <MarketplaceSupportSection
              product={product}
              isMobile={isMobile}
              sectionShell={sectionShell}
            />
            <MarketplaceProductComparisonSection
              product={product}
              agent={agent}
              isMobile={isMobile}
              sectionShell={sectionShell}
            />
            <MarketplacePricingSection
              product={product}
              isMobile={isMobile}
              setShowInquiryModal={setShowInquiryModal}
              sectionShell={sectionShell}
            />
          </>
        )}
      </div>

      <ProductInquiryModal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        productName={product?.name || product?.title || 'AI Agent'}
        productId={product?.id || id}
      />
    </main>
  );
};

export default MarketplaceProductDetail;


