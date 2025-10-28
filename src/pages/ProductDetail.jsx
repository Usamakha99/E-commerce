import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SocialShare from '../components/SocialShare';
import ProductInquiryModal from '../components/ProductInquiryModal';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../hooks/useCart';

const ProductDetail = () => {
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const { id } = useParams();
  
  // Fetch product from API
  const { product: apiProduct, loading, error } = useProduct(id, !!id); // Only fetch if id exists
  const { addToCart, loading: cartLoading } = useCart();

  // Fallback product data (used if API fails)
  const fallbackProduct = {
    id: 1,
    name: 'Samsung Galaxy S22 Ultra 5G 128/256GB SM-S906U1 Unlocked Cell Phones All Colors - Good Condition',
    brand: 'Samsung',
    price: 2856.3,
    originalPrice: 3225.6,
    discount: 17,
    sku: 'EcomTech13689',
    upc: '123456789012',
    rating: 5,
    description: 'High-quality smartphone with amazing features',
    features: [
      '8k super steady video',
      'Nightography plus portait mode',
      '50mp photo resolution plus bright display',
      'Adaptive color contrast',
      'premium design & craftmanship',
      'Long lasting battery plus fast charging',
    ],
  };

  // Use API product if available, otherwise use fallback
  const product = apiProduct || fallbackProduct;

  // Scroll to top when component mounts or product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, product]);

  // Debug: Check bulletsPoint data
  useEffect(() => {
    if (product) {
      console.log('📌 Bullet Points Data:', {
        bulletsPoint: product.bulletsPoint,
        type: typeof product.bulletsPoint,
        isArray: Array.isArray(product.bulletsPoint),
        isString: typeof product.bulletsPoint === 'string',
        length: Array.isArray(product.bulletsPoint) ? product.bulletsPoint.length : product.bulletsPoint?.length
      });
    }
  }, [product]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity);
      alert('Product added to cart!');
    } catch (err) {
      console.error('Failed to add to cart:', err);
      alert('Failed to add to cart. Please try again.');
    }
  };

  return (
    <>
      {/* SEO Meta Tags for Google Search - Only show when API data is loaded */}
      {!loading && apiProduct && (
        <Helmet>
          <title>{apiProduct.name || apiProduct.title || 'Product'} - V Cloud Tech</title>
          <meta name="description" content={apiProduct.shortDescp || apiProduct.metaDescp || apiProduct.description || `Buy ${apiProduct.name || apiProduct.title || 'Product'} online. High-quality products at competitive prices.`} />
          <meta name="keywords" content={`${apiProduct.name || apiProduct.title || ''}, ${typeof apiProduct.brand === 'object' ? apiProduct.brand.title : apiProduct.brand || ''}, ${typeof apiProduct.category === 'object' ? apiProduct.category.title : apiProduct.category || ''}, ${typeof apiProduct.subCategory === 'object' ? apiProduct.subCategory.title : apiProduct.subCategory || ''}, electronics, technology, V Cloud Tech`} />
          
          {/* Open Graph Meta Tags for Social Media */}
          <meta property="og:title" content={`${apiProduct.name || apiProduct.title || 'Product'} - V Cloud Tech`} />
          <meta property="og:description" content={apiProduct.shortDescp || apiProduct.metaDescp || apiProduct.description || `Buy ${apiProduct.name || apiProduct.title || 'Product'} online. High-quality products at competitive prices.`} />
          <meta property="og:image" content={apiProduct.image || '/src/assets/V Cloud Logo final-01.svg'} />
          <meta property="og:url" content={`${window.location.origin}/product/${apiProduct.id}`} />
          <meta property="og:type" content="product" />
          <meta property="og:site_name" content="V Cloud Tech" />
          
          {/* Product Specific Meta Tags */}
          <meta property="product:price:amount" content={apiProduct.price || '0'} />
          <meta property="product:price:currency" content="USD" />
          <meta property="product:availability" content={apiProduct.stock > 0 ? 'in stock' : 'out of stock'} />
          <meta property="product:brand" content={typeof apiProduct.brand === 'object' ? apiProduct.brand.title : apiProduct.brand || ''} />
          <meta property="product:category" content={typeof apiProduct.category === 'object' ? apiProduct.category.title : apiProduct.category || ''} />
          
          {/* Twitter Card Meta Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`${apiProduct.name || apiProduct.title || 'Product'} - V Cloud Tech`} />
          <meta name="twitter:description" content={apiProduct.shortDescp || apiProduct.metaDescp || apiProduct.description || `Buy ${apiProduct.name || apiProduct.title || 'Product'} online.`} />
          <meta name="twitter:image" content={apiProduct.image || '/src/assets/V Cloud Logo final-01.svg'} />
          
          {/* Additional SEO Meta Tags */}
          <meta name="robots" content="index, follow" />
          <meta name="author" content="V Cloud Tech" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          
          {/* Canonical URL */}
          <link rel="canonical" href={`${window.location.origin}/product/${apiProduct.id}`} />
          
          {/* JSON-LD Structured Data for Google */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": apiProduct.name || apiProduct.title || 'Product',
              "description": apiProduct.shortDescp || apiProduct.metaDescp || apiProduct.description || '',
              "image": apiProduct.image || '/src/assets/V Cloud Logo final-01.svg',
              "brand": {
                "@type": "Brand",
                "name": typeof apiProduct.brand === 'object' ? apiProduct.brand.title : apiProduct.brand || 'V Cloud Tech'
              },
              "category": typeof apiProduct.category === 'object' ? apiProduct.category.title : apiProduct.category || '',
              "offers": {
                "@type": "Offer",
                "price": apiProduct.price || '0',
                "priceCurrency": "USD",
                "availability": apiProduct.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                "seller": {
                  "@type": "Organization",
                  "name": "V Cloud Tech"
                }
              },
              "sku": apiProduct.sku || apiProduct.id || '',
              "mpn": apiProduct.sku || apiProduct.id || '',
              "gtin": apiProduct.upc || apiProduct.upcCode || ''
            })}
          </script>
        </Helmet>
      )}

      <main className="main">
      {loading && (
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading product...</p>
        </div>
      )}

      {error && !loading && (
        <div className="container">
          <div className="alert alert-warning mt-4" role="alert">
            <strong>Note:</strong> Using demo data. Connect to your backend API to load real product details.
            <br />
            <small>Error: {error}</small>
          </div>
        </div>
      )}

      {!loading && (
        <>
      {/* Breadcrumb */}
      <div className="section-box">
        <div className="breadcrumbs-div">
          <div className="container">
            <ul className="breadcrumb">
              <li><a className="font-xs color-gray-1000" href="/">Home</a></li>
              <li><a className="font-xs color-gray-500" href="/shop">Electronics</a></li>
              <li><a className="font-xs color-gray-500" href="/shop">Cell phone</a></li>
              <li><a className="font-xs color-gray-500" href="/shop">Accessories</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Product Detail Section */}
      <section className="section-box shop-template">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h3 className="color-brand-3 mb-5 mw-80">{product.name || product.title}</h3>
              <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 text-center text-sm-start mb-mobile">
                      <div className="d-inline-block">
                        <span className="font-sm color-brand-3 font-medium">Brand:</span>
                        <a className="font-sm color-brand-3 font-medium" href="/vendor"> {typeof product.brand === 'object' ? product.brand?.title : product.brand || 'N/A'}</a>
                      </div>

                      <span className="d-inline-block" style={{ margin: '0 10px', color: '#666' }}>|</span>

                      <div className="sku-product d-inline-block">
                        <span className="font-sm color-brand-3 font-medium">SKU:</span>
                        <span className="font-sm color-brand-3 font-medium"> {product.sku || 'N/A'}</span>
                      </div>

                      {product.upc && (
                        <>
                          <span className="d-inline-block" style={{ margin: '0 10px', color: '#666' }}>|</span>
                          <div className="upc-product d-inline-block">
                            <span className="font-sm color-brand-3 font-medium">UPC:</span>
                            <span className="font-sm color-brand-3 font-medium"> {product.upc}</span>
                          </div>
                        </>
                      )}

                      {product.category && (
                        <>
                          <span className="d-inline-block" style={{ margin: '0 10px', color: '#666' }}>|</span>
                          <div className="d-inline-block">
                            <span className="font-sm color-brand-3 font-medium">Category: </span>
                            <a 
                              className="font-sm color-brand-3 font-medium" 
                              href={`/shop?category=${typeof product.category === 'object' ? product.category.id : product.category}`}
                              style={{ 
                                textDecoration: 'none', 
                                cursor: 'pointer',
                                transition: 'color 0.3s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.setProperty('color', '#df2020', 'important');
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.removeProperty('color');
                              }}
                            > 
                              {typeof product.category === 'object' ? product.category.title : product.category}
                            </a>
                          </div>
                        </>
                      )}

                      {product.subCategory && (
                        <>
                          <span className="d-inline-block" style={{ margin: '0 10px', color: '#666' }}>|</span>
                          <div className="d-inline-block">
                            <span className="font-sm color-brand-3 font-medium">Sub Category: </span>
                            <a 
                              className="font-sm color-brand-3 font-medium" 
                              href={`/shop?category=${typeof product.subCategory === 'object' ? product.subCategory.id : product.subCategory}`}
                              style={{ 
                                textDecoration: 'none', 
                                cursor: 'pointer',
                                transition: 'color 0.3s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.setProperty('color', '#df2020', 'important');
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.removeProperty('color');
                              }}
                            > 
                              {typeof product.subCategory === 'object' ? product.subCategory.title : product.subCategory}
                            </a>
                          </div>
                        </>
                      )}
                    </div>

                  </div>
                  <div className="border-bottom pt-20 mb-30"></div>
            </div>

                {/* Product Image Gallery - Clean Design */}
            <div className="col-lg-5">
                  <div style={{
                    backgroundColor: '#fff',
                    padding: '20px',
                    borderRadius: '8px'
                  }}>
                    {/* Main Product Image */}
                    <div style={{
                      textAlign: 'center',
                      marginBottom: '20px',
                      position: 'relative'
                    }}>
                      {product.discount > 0 && (
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          backgroundColor: '#ff4444',
                          color: 'white',
                          padding: '5px 10px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          zIndex: 10
                        }}>
                          -{product.discount}%
                    </div>
                      )}

                      {/* Previous Arrow Button */}
                      {((product.galleries && product.galleries.length > 0) || (product.images && product.images.length > 0)) && (
                        <button
                          onClick={() => {
                            const allImages = [
                              product.image,
                              ...(product.galleries || []).map(g => g.pic500x500 || g.highPic || g.originalUrl || (typeof g.url === 'string' ? `http://localhost:5000/uploads/products/${g.url}` : '')),
                              ...((!product.galleries || product.galleries.length === 0) && product.images ? product.images.map(img => img.url || img.imageUrl || (typeof img === 'string' ? `http://localhost:5000/uploads/products/${img}` : '')) : [])
                            ].filter(Boolean);
                            const currentIndex = selectedImage ? allImages.indexOf(selectedImage) : 0;
                            const prevIndex = currentIndex > 0 ? currentIndex - 1 : allImages.length - 1;
                            setSelectedImage(prevIndex === 0 ? null : allImages[prevIndex]);
                          }}
                          style={{
                            position: 'absolute',
                            left: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            cursor: 'pointer',
                            fontSize: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 20,
                            transition: 'background-color 0.3s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.8)'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.5)'}
                        >
                          ‹
                        </button>
                      )}

                      <img
                        src={selectedImage || product.image || '/src/assets/imgs/page/product/img-gallery-1.jpg'}
                        alt={product.name || 'product image'}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '500px',
                          objectFit: 'contain',
                          borderRadius: '4px'
                        }}
                        onError={(e) => { e.target.src = '/src/assets/imgs/page/product/img-gallery-1.jpg' }}
                      />

                      {/* Next Arrow Button */}
                      {((product.galleries && product.galleries.length > 0) || (product.images && product.images.length > 0)) && (
                        <button
                          onClick={() => {
                            const allImages = [
                              product.image,
                              ...(product.galleries || []).map(g => g.pic500x500 || g.highPic || g.originalUrl || (typeof g.url === 'string' ? `http://localhost:5000/uploads/products/${g.url}` : '')),
                              ...((!product.galleries || product.galleries.length === 0) && product.images ? product.images.map(img => img.url || img.imageUrl || (typeof img === 'string' ? `http://localhost:5000/uploads/products/${img}` : '')) : [])
                            ].filter(Boolean);
                            const currentIndex = selectedImage ? allImages.indexOf(selectedImage) : 0;
                            const nextIndex = currentIndex < allImages.length - 1 ? currentIndex + 1 : 0;
                            setSelectedImage(nextIndex === 0 ? null : allImages[nextIndex]);
                          }}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            cursor: 'pointer',
                            fontSize: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 20,
                            transition: 'background-color 0.3s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.8)'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.5)'}
                        >
                          ›
                        </button>
                      )}
                  </div>

                    {/* Thumbnail Images */}
                    <div style={{
                      display: 'flex',
                      gap: '10px',
                      justifyContent: 'center',
                      flexWrap: 'wrap'
                    }}>
                      {/* Main Image Thumbnail */}
                      <div
                        onClick={() => setSelectedImage(null)}
                        style={{
                          width: '60px',
                          height: '60px',
                          border: selectedImage === null ? '2px solid #df2020' : '1px solid #ddd',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <img
                          src={product.image || '/src/assets/imgs/page/product/img-gallery-1.jpg'}
                          alt="Main image"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>

                      {/* Gallery Images */}
                      {product.galleries && Array.isArray(product.galleries) && product.galleries.length > 0 && product.galleries.slice(0, 4).map((gallery, index) => {
                        const imageUrl = gallery.pic500x500 || gallery.highPic || gallery.originalUrl || (typeof gallery.url === 'string' ? `http://localhost:5000/uploads/products/${gallery.url}` : '/src/assets/imgs/page/product/img-gallery-1.jpg');
                        return (
                          <div
                            key={index}
                            onClick={() => setSelectedImage(imageUrl)}
                            style={{
                              width: '60px',
                              height: '60px',
                              border: selectedImage === imageUrl ? '2px solid #df2020' : '1px solid #ddd',
                              borderRadius: '6px',
                              overflow: 'hidden',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <img
                              src={imageUrl}
                              alt={`Gallery ${index + 1}`}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                              onError={(e) => { e.target.src = '/src/assets/imgs/page/product/img-gallery-1.jpg' }}
                            />
                    </div>
                        );
                      })}

                      {/* Fallback Images */}
                      {(!product.galleries || product.galleries.length === 0) && product.images && Array.isArray(product.images) && product.images.length > 0 && product.images.slice(0, 4).map((img, index) => {
                        const imageUrl = img.url || img.imageUrl || (typeof img === 'string' ? `http://localhost:5000/uploads/products/${img}` : '/src/assets/imgs/page/product/img-gallery-1.jpg');
                        return (
                          <div
                            key={index}
                            onClick={() => setSelectedImage(imageUrl)}
                            style={{
                              width: '60px',
                              height: '60px',
                              border: selectedImage === imageUrl ? '2px solid #df2020' : '1px solid #ddd',
                              borderRadius: '6px',
                              overflow: 'hidden',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <img
                              src={imageUrl}
                              alt={`Image ${index + 1}`}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                              onError={(e) => { e.target.src = '/src/assets/imgs/page/product/img-gallery-1.jpg' }}
                            />
                      </div>
                        );
                      })}
                    </div>
                      </div>

            </div>

            {/* Product Info */}
            <div className="col-lg-7">
              <div className="row">
                <div className="col-lg-7 col-md-7 mb-30">
                  {/* <div className="box-product-price">
                        <h3 className="color-brand-3 price-main d-inline-block mr-10">${product.price?.toFixed(2) || '0.00'}</h3>
                        {product.originalPrice && product.originalPrice !== product.price && (
                          <span className="color-gray-500 price-line font-xl line-througt">${product.originalPrice.toFixed(2)}</span>
                    )}
                  </div> */}

                      {/* Stock Status */}
                      {/* {product.stock !== undefined && (
                  <div className="box-progress-product mt-15 mb-20">
                          <span className={`font-sm ${product.stock > 0 ? 'color-success' : 'color-danger'}`}>
                            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                          </span>
                    </div>
                      )} */}

                      {/* Bullet Points from API - Display right below price */}
                      {((Array.isArray(product.bulletsPoint) && product.bulletsPoint.length > 0) ||
                        (typeof product.bulletsPoint === 'string' && product.bulletsPoint.trim()) ||
                        (product.features && product.features.length > 0)) && (
                          <div className="product-description color-gray-900 mb-30" style={{ marginTop: '30px', marginLeft: '80px' }}>
                            <h6 className="color-brand-3 mb-15">Key Features:</h6>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                              {Array.isArray(product.bulletsPoint) && product.bulletsPoint.length > 0 ? (
                                // If bulletsPoint is an array
                                product.bulletsPoint.map((bullet, index) => (
                                  <li key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px' }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', marginTop: '4px', flexShrink: 0 }}>
                                      <path d="M 20.292969 5.2929688 L 9 16.585938 L 4.7070312 12.292969 L 3.2929688 13.707031 L 9 19.414062 L 21.707031 6.7070312 L 20.292969 5.2929688 z" fill="#10b981"/>
                                    </svg>
                                    <span style={{ fontWeight: '500', lineHeight: '1.5', color: '#000', fontSize: '12px', fontFamily: 'DM Sans, sans-serif' }}>{bullet}</span>
                                  </li>
                                ))
                              ) : typeof product.bulletsPoint === 'string' && product.bulletsPoint.trim() ? (
                                // If bulletsPoint is a comma-separated string
                                product.bulletsPoint.split(',').map((bullet, index) => (
                                  <li key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px' }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', marginTop: '4px', flexShrink: 0 }}>
                                      <path d="M 20.292969 5.2929688 L 9 16.585938 L 4.7070312 12.292969 L 3.2929688 13.707031 L 9 19.414062 L 21.707031 6.7070312 L 20.292969 5.2929688 z" fill="#10b981"/>
                                    </svg>
                                    <span style={{ fontWeight: '500', lineHeight: '1.5', color: '#000', fontSize: '12px', fontFamily: 'DM Sans, sans-serif' }}>{bullet.trim()}</span>
                                  </li>
                                ))
                              ) : product.features && product.features.length > 0 ? (
                                // Fallback to features array
                                product.features.map((feature, index) => (
                                  <li key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px' }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', marginTop: '4px', flexShrink: 0 }}>
                                      <path d="M 20.292969 5.2929688 L 9 16.585938 L 4.7070312 12.292969 L 3.2929688 13.707031 L 9 19.414062 L 21.707031 6.7070312 L 20.292969 5.2929688 z" fill="#10b981"/>
                                    </svg>
                                    <span style={{ fontWeight: '500', lineHeight: '1.5', color: '#000', fontSize: '12px', fontFamily: 'DM Sans, sans-serif' }}>{feature}</span>
                                  </li>
                                ))
                              ) : null}
                        </ul>
                      </div>
                        )}

                      {/* Short Description */}
                      {/* {product.shortDescp && (
                    <div className="mb-20">
                      <p className="font-sm color-gray-900">{product.shortDescp}</p>
                      </div>
                  )} */}


                  {/* <div className="buy-product mt-25">
                    <div className="font-sm text-quantity mb-10">Quantity</div>
                    <div className="box-quantity">
                      <div className="input-quantity">
                        <input type="text" defaultValue="1" />
                        <span className="minus-cart"></span>
                        <span className="plus-cart"></span>
                      </div>
                      <div className="button-buy button-buy-full">
                        <a className="btn btn-buy" href="/checkout">Buy now</a>
                      </div>
                    </div>
                  </div> */}
                </div>
                <div className="col-lg-5 col-md-5">
                  <div className="pl-30 pl-mb-0">
                        {/* Right Side Pricing & Contact Section */}
                        <div className="pricing-contact-section mb-30">
                          {/* Sign In to see pricing box */}
                          <div className="pricing-box" style={{
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            borderRadius: '0px',
                            padding: '20px',
                            marginBottom: '20px',
                            textAlign: 'center'
                          }}>
                            <div style={{ textAlign: 'center' }}>
                              <a href="/login" style={{
                                fontSize: '14px',
                                color: '#1c1463',
                                textDecoration: 'underline',
                                fontWeight: 'bold'
                              }}>Sign In to see pricing</a>
                              <div style={{
                                marginTop: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <span style={{ fontSize: '12px', color: '#666', marginRight: '5px' }}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="23 4 23 10 17 10"></polyline>
                                    <polyline points="1 20 1 14 7 14"></polyline>
                                    <path d="m3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                  </svg>
                                </span>
                                <span style={{ fontSize: '14px', color: '#000', fontWeight: '600' }}>
                                  {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                                </span>
                        </div>
                        </div>
                      </div>

                          {/* Contact Sales Team box */}
                          <div className="contact-box" style={{
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            borderRadius: '0px',
                            padding: '20px',
                            marginBottom: '20px',
                            textAlign: 'center'
                          }}>
                            <p style={{
                              fontSize: '14px',
                              color: '#000',
                              marginBottom: '12px',
                              lineHeight: '1.3',
                              fontWeight: '600',
                              textAlign: 'center'
                            }}>
                              Questions regarding this product, volume pricing, or shipping options?
                            </p>
                            <button 
                              onClick={() => setShowInquiryModal(true)}
                              style={{
                                backgroundColor: '#df2020',
                                color: 'white',
                                border: 'none',
                                borderRadius: '25px',
                                padding: '8px 16px',
                                width: 'auto',
                                fontSize: '12px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                display: 'block',
                                margin: '0 auto'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#c41a1a';
                                e.target.style.textDecoration = 'underline';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#df2020';
                                e.target.style.textDecoration = 'none';
                              }}
                            >
                              Contact our sales team
                            </button>
                        </div>
                        </div>

                      </div>
                        </div>
              </div>
            </div>
          </div>
          {/* <div className="border-bottom pt-30 mb-40"></div> */}

          {/* Frequently Bought Together */}
              {/* <h4 className="color-brand-3 mb-20">Frequently Bought Together</h4>
          <div className="box-bought-together">
            <div className="box-product-bought box-product-bought-2">
              <div className="product-bought">
                <img src="/src/assets/imgs/page/product/sp1.png" alt="Ecom" />
              </div>
              <div className="product-bought">
                <img src="/src/assets/imgs/page/product/sp2.png" alt="Ecom" />
              </div>
              <div className="product-bought">
                <img src="/src/assets/imgs/page/product/sp3.png" alt="Ecom" />
              </div>
            </div>
            <div className="price-bought">
              <h3 className="color-brand-3 mr-10">$2856.3</h3>
              <span className="font-lg color-gray-900">(3 items)</span>
              <div className="box-btn-add-cart">
                <a className="btn btn-cart" href="/cart">Add To Cart</a>
              </div>
            </div>
          </div>
          <label className="cb-container-2">
            <input type="checkbox" defaultChecked />
            <span className="font-md color-brand-3">
              <strong>This item:</strong>iPhone 12 Pro Max 128GB Pacific Blue - $1,099.00
            </span>
            <span className="checkmark"></span>
          </label>
          <label className="cb-container-2">
            <input type="checkbox" defaultChecked />
            <span className="font-md color-brand-3">Apple AirPods Pro, Active Noise Cancellation, Custom Fit - $197.00</span>
            <span className="checkmark"></span>
          </label>
          <label className="cb-container-2">
            <input type="checkbox" defaultChecked />
            <span className="font-md color-brand-3">Apple iMac 24" All-In-One Computer, Apple M1, 8GB RAM, 512GB SSD, macOS Big Sur, Green, MGPJ3LL/A - $1,599.00</span>
            <span className="checkmark"></span>
          </label> */}
        </div>
      </section>

      {/* Product Tabs */}
      <section className="section-box shop-template">
        <div className="container">
          <div className="pt-30 mb-10">
            <ul className="nav nav-tabs nav-tabs-product" role="tablist">
              <li>
                <a 
                  className={activeTab === 'description' ? 'active' : ''} 
                  href="#tab-description" 
                      onClick={(e) => { e.preventDefault(); setActiveTab('description'); }}
                  role="tab"
                  style={{ 
                    color: '#000', 
                    fontSize: '14px',
                    borderBottom: activeTab === 'description' ? '3px solid #df2020' : 'none',
                    padding: '8px 12px',
                    paddingBottom: '8px',
                    opacity: activeTab === 'description' ? '1' : '0.6',
                    transition: 'all 0.3s ease'
                  }}
                >
                      <span style={{ marginRight: '8px' }}>📝</span>Description
                </a>
              </li>
              <li>
                <a 
                  className={activeTab === 'specification' ? 'active' : ''} 
                  href="#tab-specification" 
                      onClick={(e) => { e.preventDefault(); setActiveTab('specification'); }}
                  role="tab"
                  style={{ 
                    color: '#000', 
                    fontSize: '14px',
                    borderBottom: activeTab === 'specification' ? '3px solid #df2020' : 'none',
                    padding: '8px 12px',
                    paddingBottom: '8px',
                    opacity: activeTab === 'specification' ? '1' : '0.6',
                    transition: 'all 0.3s ease'
                  }}
                >
                      <span style={{ marginRight: '8px' }}>⚙️</span>Specification
                </a>
              </li>
              <li>
                <a 
                  className={activeTab === 'additional' ? 'active' : ''} 
                  href="#tab-additional" 
                      onClick={(e) => { e.preventDefault(); setActiveTab('additional'); }}
                  role="tab"
                  style={{ 
                    color: '#000', 
                    fontSize: '14px',
                    borderBottom: activeTab === 'additional' ? '3px solid #df2020' : 'none',
                    padding: '8px 12px',
                    paddingBottom: '8px',
                    opacity: activeTab === 'additional' ? '1' : '0.6',
                    transition: 'all 0.3s ease'
                  }}
                >
                      <span style={{ marginRight: '8px' }}>ℹ️</span>Additional information
                </a>
              </li>
            </ul>
            <div className="tab-content">
              {activeTab === 'description' && (
                <div className="tab-pane fade active show" id="tab-description" role="tabpanel">
                  <div className="display-text-short">
                        {/* Long Description from API */}
                        {product.longDescp && (
                          <div className="mb-15">
                            <h5 className="mb-15" style={{ color: '#000', fontSize: '14px' }}>Product Description</h5>
                            {/* <p className="font-md ">{product.longDescp}</p> */}
                  </div>
                        )}

                        {/* Short Description if no long description */}
                        {!product.longDescp && product.shortDescp && (
                          <div className="mb-15">
                            <h5 className="mb-15" style={{ color: '#000', fontSize: '14px' }}>Product Description</h5>
                            <p className="font-md " style={{ color: '#000' }}>{product.shortDescp}</p>
                          </div>
                        )}
                        {/* Meta Description */}
                        {product.metaDescp && product.metaDescp !== product.shortDescp && (
                          <div className="mb-30">
                            <p className="font-sm 0" style={{ color: '#000' }}>{product.metaDescp}</p>
                          </div>
                        )}

                        {/* Fallback if no description */}
                        {!product.longDescp && !product.shortDescp && !product.bulletsPoint && (
                          <p className="font-md 0" style={{ color: '#000' }}>No description available for this product.</p>
                        )}
                  </div>
                </div>
              )}
              
              {activeTab === 'specification' && (
                <div className="tab-pane fade active show" id="tab-specification" role="tabpanel">
                      <h5 className="mb-25" style={{ color: '#000',fontSize: '14px' }}>Product Specification</h5>
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <tbody>
                            {product.sku && (
                        <tr>
                                <td className="font-sm-bold ">SKU</td>
                                <td className="font-sm ">{product.sku}</td>
                        </tr>
                            )}
                            {product.brand && (
                        <tr>
                                <td className="font-sm-bold ">Brand</td>
                                <td className="font-sm ">{typeof product.brand === 'object' ? product.brand.title : product.brand}</td>
                        </tr>
                            )}
                            {product.mfr && (
                        <tr>
                                <td className="font-sm-bold ">Manufacturer</td>
                                <td className="font-sm ">{product.mfr}</td>
                        </tr>
                            )}
                            {product.techPartNo && (
                        <tr>
                                <td className="font-sm-bold ">Part Number</td>
                                <td className="font-sm ">{product.techPartNo}</td>
                        </tr>
                            )}
                            {product.upcCode && (
                        <tr>
                                <td className="font-sm-bold ">UPC Code</td>
                                <td className="font-sm ">{product.upcCode}</td>
                        </tr>
                            )}
                            {product.category && (
                        <tr>
                                <td className="font-sm-bold ">Category</td>
                                <td className="font-sm ">{typeof product.category === 'object' ? product.category.title : product.category}</td>
                        </tr>
                            )}
                            {product.subCategory && (
                        <tr>
                                <td className="font-sm-bold ">Sub Category</td>
                                <td className="font-sm ">{typeof product.subCategory === 'object' ? product.subCategory.title : product.subCategory}</td>
                        </tr>
                            )}
                            {product.productSource && (
                        <tr>
                                <td className="font-sm-bold ">Product Source</td>
                                <td className="font-sm ">{product.productSource}</td>
                        </tr>
                            )}
                            {product.endOfLifeDate && (
                              <tr>
                                <td className="font-sm-bold ">End of Life Date</td>
                                <td className="font-sm ">{product.endOfLifeDate}</td>
                              </tr>
                            )}
                            {product.quantity !== undefined && (
                              <tr>
                                <td className="font-sm-bold ">Available Quantity</td>
                                <td className="font-sm ">{product.quantity}</td>
                              </tr>
                            )}
                            {/* Fallback message */}
                            {!product.sku && !product.brand && !product.mfr && !product.techPartNo && (
                              <tr>
                                <td colSpan="2" className="text-center font-sm ">
                                  No specifications available for this product.
                                </td>
                              </tr>
                            )}
                      </tbody>
                    </table>
                  </div>

                      {/* Multimedia URL Link */}
                      {product.multimediaUrl && (
                        <div className="mt-30">
                          <h6 className="mb-15" style={{ color: '#000' }}>Additional Resources</h6>
                          <a href={product.multimediaUrl} target="_blank" rel="noopener noreferrer" className="btn btn-border font-sm">
                            View Multimedia Content
                          </a>
                        </div>
                      )}
                </div>
              )}

              {activeTab === 'additional' && (
                <div className="tab-pane fade active show" id="tab-additional" role="tabpanel">
                  <h5 className="mb-15" style={{ color: '#000',fontSize: '14px' }}>Additional information</h5>
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <tbody>
                        <tr>
                          <td>Weight</td>
                          <td><p>0.240 kg</p></td>
                        </tr>
                        <tr>
                          <td>Dimensions</td>
                          <td><p>0.74 x 7.64 x 16.08 cm</p></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>
        </>
      )}

      {/* Product Inquiry Modal */}
      <ProductInquiryModal 
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        productName={product.name}
      />
    </main>
    </>
  );
};

export default ProductDetail;
