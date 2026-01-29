/**
 * Maps FTP API product data to internal format
 * @param {Object} ftpProduct - Product from FTP API
 * @returns {Object} - Standardized product format
 */
export const mapFtpProduct = (ftpProduct) => {
  if (!ftpProduct) {
    return null;
  }

  // Extract image from Icecat data if available
  let imageUrl = '/src/assets/imgs/page/homepage1/imgsp1.png'; // Default fallback
  
  if (ftpProduct.icecat?.images && ftpProduct.icecat.images.length > 0) {
    imageUrl = ftpProduct.icecat.images[0].url || imageUrl;
  }

  // Map FTP product to internal format
  const mappedProduct = {
    // Basic Info
    id: ftpProduct.id,
    sku: ftpProduct.internal_sku || ftpProduct.mfr_sku,
    mfr: ftpProduct.mfr_sku,
    vendor_name: ftpProduct.vendor_name,
    
    // Descriptions
    shortDescp: ftpProduct.description || '',
    longDescp: ftpProduct.description || '',
    name: ftpProduct.description || `Product ${ftpProduct.id}`,
    title: ftpProduct.description || `Product ${ftpProduct.id}`,
    
    // Media
    image: imageUrl,
    mainImage: imageUrl,
    
    // Codes & IDs
    upc: ftpProduct.upc,
    upcCode: ftpProduct.upc,
    internal_sku: ftpProduct.internal_sku,
    mfr_sku: ftpProduct.mfr_sku,
    
    // Price & Stock
    price: parseFloat(ftpProduct.msrp) || 0,
    cogs: parseFloat(ftpProduct.cogs) || 0,
    msrp: parseFloat(ftpProduct.msrp) || 0,
    stock: ftpProduct.stock || 0,
    quantity: ftpProduct.stock || 0,
    
    // Physical Properties
    weight: ftpProduct.weight || 0,
    
    // Distributor Info
    distributor: ftpProduct.distributor,
    table_name: ftpProduct.table_name,
    
    // Additional Data
    icecat: ftpProduct.icecat || null,
    productSource: 'ftp',
    
    // Timestamps
    createdAt: ftpProduct.created_at,
    updatedAt: ftpProduct.updated_at,
    
    // Frontend convenience fields
    brand: {
      title: ftpProduct.vendor_name || 'Unknown',
    },
    description: ftpProduct.description || '',
    features: [],
    discount: 0,
    originalPrice: parseFloat(ftpProduct.msrp) || 0,
    rating: 5,
    reviews: 0,
  };

  return mappedProduct;
};

/**
 * Maps array of FTP products
 * @param {Array} products - Array of products from FTP API
 * @returns {Array} - Array of standardized products
 */
export const mapFtpProducts = (products) => {
  if (!Array.isArray(products)) {
    console.warn('Expected array of FTP products, got:', typeof products);
    return [];
  }
  return products.map(mapFtpProduct).filter(p => p !== null);
};

export default {
  mapFtpProduct,
  mapFtpProducts,
};
