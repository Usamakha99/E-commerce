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
  
  // Build image URL from mainImage
  // Your API provides: "mainImage": "icecat_HS8D6PE_main_1759430466447.jpg"
  // Backend serves from: http://localhost:5000/uploads/
  const imageUrl = externalProduct.mainImage 
    ? `http://localhost:5000/uploads/products/${externalProduct.mainImage}`
    : '/src/assets/imgs/page/homepage1/imgsp1.png'; // Fallback if no image
  
  // Parse price (it's a string like "0.00")
  const productPrice = parseFloat(externalProduct.price) || 0;
  
  // Mapping for YOUR API structure - PRESERVING ALL EXACT FIELDS
  return {
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
    
    // Frontend convenience fields
    name: externalProduct.shortDescp || externalProduct.metaTitle || externalProduct.title || 'Untitled Product',
    image: imageUrl,
    stock: externalProduct.quantity || 0,
    description: externalProduct.shortDescp || externalProduct.longDescp || '',
    features: externalProduct.bulletsPoint ? externalProduct.bulletsPoint.split(',') : [],
    discount: 0,
    originalPrice: productPrice,
    rating: 5,
    reviews: 0,
  };
};

/**
 * Maps array of products
 * @param {Array} products - Array of products from API
 * @returns {Array} - Array of standardized products
 */
export const mapProducts = (products) => {
  if (!Array.isArray(products)) {
    console.warn('Expected array of products, got:', typeof products);
    return [];
  }
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

