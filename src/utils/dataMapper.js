/**
 * Data Mapper - Maps external API data to internal format
 * Customize this file to match your backend's data structure
 */

/**
 * Maps external product data to internal format
 * @param {Object} externalProduct - Product from your API
 * @returns {Object} - Standardized product format
 */
export const mapProduct = (externalProduct) => {
  // Handle null/undefined
  if (!externalProduct) {
    return null;
  }
  
  // Extract brand name (it's nested as brand.title)
  const brandName = externalProduct.brand?.title || externalProduct.brand || 'Unknown';
  
  // Build image URL – same as ProductDetail page: use /uploads/products/ for filenames
  const placeholder = '/assets/V Cloud Logo final-01.svg';
  const uploadsPrefix = (import.meta.env.VITE_UPLOADS_PATH || 'uploads/products').replace(/^\/|\/$/g, '');
  const buildUpload = (path) => {
    if (!path || typeof path !== 'string') return null;
    const s = path.trim();
    if (!s) return null;
    if (s.startsWith('http://') || s.startsWith('https://')) return s;
    if (s.startsWith('/')) return s;
    const clean = s.replace(/^\/?uploads\/?/, '').replace(/^products\/?/, '');
    return `/${uploadsPrefix}/${clean}`;
  };
  let imageUrl = placeholder;

  // 🎯 1) mainImage from backend (aapke upload folder) – try as-is then under /uploads/products/
  if (externalProduct.mainImage) {
    const url = buildUpload(externalProduct.mainImage);
    if (url) imageUrl = url;
  }
  // 🎯 2) images array from API
  if (imageUrl === placeholder && externalProduct.images?.length > 0) {
    const first = externalProduct.images[0];
    const path = first?.url ?? first?.path ?? (typeof first === 'string' ? first : null);
    const url = buildUpload(path);
    if (url) imageUrl = url;
  }
  // 🎯 3) Gallery full URLs (Icecat CDN) only if no backend image
  if (imageUrl === placeholder && externalProduct.galleries?.length > 0) {
    const g = externalProduct.galleries[0];
    const raw = g.pic500x500 || g.highPic || g.originalUrl || g.url;
    if (typeof raw === 'string' && (raw.startsWith('http://') || raw.startsWith('https://'))) imageUrl = raw;
  }
  
  // Parse price (it's a string like "0.00")
  const productPrice = parseFloat(externalProduct.price) || 0;
  
  // Mapping for YOUR API structure - PRESERVING ALL EXACT FIELDS
  const mappedProduct = {
    // Basic Info
    id: externalProduct.id,
    sku: externalProduct.sku,
    mfr: externalProduct.mfr,
    techPartNo: externalProduct.techPartNo,
    
    // Descriptions
    shortDescp: externalProduct.shortDescp,
    longDescp: externalProduct.longDescp,
    title: externalProduct.title,
    metaTitle: externalProduct.metaTitle,
    metaDescp: externalProduct.metaDescp,
    
    // Media
    mainImage: externalProduct.mainImage,
    bulletsPoint: externalProduct.bulletsPoint,
    multimediaUrl: externalProduct.multimediaUrl,
    
    // Codes & IDs
    upcCode: externalProduct.upcCode,
    upc: externalProduct.upcCode, // Also add as 'upc' for compatibility
    productSource: externalProduct.productSource,
    userId: externalProduct.userId,
    
    // Price & Stock
    price: productPrice,
    quantity: externalProduct.quantity,
    
    // Relationships
    brandId: externalProduct.brandId,
    categoryId: externalProduct.categoryId,
    subCategoryId: externalProduct.subCategoryId,
    endOfLifeDate: externalProduct.endOfLifeDate,
    
    // Nested Objects (preserved)
    brand: externalProduct.brand,
    category: externalProduct.category,
    subCategory: externalProduct.subCategory,
    images: externalProduct.images,
    galleries: externalProduct.galleries,
    
    // Frontend convenience fields
    name: externalProduct.shortDescp || externalProduct.metaTitle || externalProduct.title || 'Untitled Product',
    image: imageUrl,
    stock: externalProduct.quantity || 0,
    description: externalProduct.shortDescp || externalProduct.longDescp || '',
    features: Array.isArray(externalProduct.bulletsPoint) 
      ? externalProduct.bulletsPoint 
      : (externalProduct.bulletsPoint && typeof externalProduct.bulletsPoint === 'string' 
        ? externalProduct.bulletsPoint.split(',').map(f => f.trim()) 
        : []),
    discount: 0,
    originalPrice: productPrice,
    rating: 5,
    reviews: 0,
  };
  
  return mappedProduct;
};

/**
 * Maps array of products
 * @param {Array} products - Array of products from API
 * @returns {Array} - Array of standardized products
 */
export const mapProducts = (products) => {
  if (!Array.isArray(products)) return [];
  return products.map(mapProduct).filter(p => p !== null);
};

/**
 * Maps external cart data to internal format
 * @param {Object} externalCart - Cart from your API
 * @returns {Object} - Standardized cart format
 */
export const mapCart = (externalCart) => {
  return {
    items: Array.isArray(externalCart.items) 
      ? externalCart.items.map(item => ({
          id: item.id || item._id,
          productId: item.productId || item.product_id,
          name: item.name || item.product_name,
          price: item.price || item.product_price,
          quantity: item.quantity || item.qty || 1,
          subtotal: item.subtotal || (item.price * item.quantity),
        }))
      : [],
    total: externalCart.total || externalCart.total_amount || 0,
    itemCount: externalCart.itemCount || externalCart.total_items || 0,
  };
};

/**
 * Example: Custom mapping for specific API structures
 * Uncomment and modify as needed
 */

// For APIs that return nested data:
// export const extractProductsFromResponse = (response) => {
//   return response?.data?.products || response?.products || response;
// };

// For APIs with different status codes:
// export const isSuccessResponse = (response) => {
//   return response?.status === 'success' || response?.code === 200;
// };

export default {
  mapProduct,
  mapProducts,
  mapCart,
};

