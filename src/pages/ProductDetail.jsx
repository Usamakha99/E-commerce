import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SocialShare from '../components/SocialShare';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../hooks/useCart';

const ProductDetail = () => {
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
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
    reviews: 2,
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
                <div className="col-xl-6 col-lg-7 col-md-8 col-sm-7 text-center text-sm-start mb-mobile">
                  <span className="color-gray-900 font-xs font-medium">Brand:</span>
                  <a className="color-gray-500  font-medium" href="/vendor"> {typeof product.brand === 'object' ? product.brand?.title : product.brand || 'N/A'}</a>
                  
                  <div className="sku-product d-inline-block" style={{marginLeft: '16px'}}>
                    <span className="font-sm color-brand-3 font-medium">SKU:</span>
                    <span className="font-sm color-gray-500"> {product.sku || 'N/A'}</span>
                  </div>
                  {product.upc && (
                    <div className="upc-product d-inline-block" style={{marginLeft: '20px'}}>
                      <span className="font-sm color-brand-3 font-medium">UPC:</span>
                      <span className="font-sm color-gray-500"> {product.upc}</span>
                    </div>
                  )}
                </div>
                <div className="col-xl-6 col-lg-5 col-md-4 col-sm-5 text-center text-sm-end">
                  <div className="d-inline-block">
                    <div className="mb-20">
                      <a className="mr-20" href="/wishlist">
                        <span className="btn btn-wishlist mr-5 opacity-100 transform-none"></span>
                        <span className="font-md color-gray-900">Add to Wish list</span>
                      </a>
                      <a href="/compare">
                        <span className="btn btn-compare mr-5 opacity-100 transform-none"></span>
                        <span className="font-md color-gray-900">Add to Compare</span>
                      </a>
                    </div>
                    <div className="d-inline-block align-middle">
                      <SocialShare 
                        productTitle={product.name || product.title}
                        productUrl={window.location.href}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-bottom pt-10 mb-20"></div>
            </div>

            {/* Product Image Gallery */}
            <div className="col-lg-5">
              <div className="gallery-image">
                <div className="galleries">
                  <div className="detail-gallery">
                    {product.discount > 0 && (
                      <label className="label">-{product.discount}%</label>
                    )}
                    <div className="product-image-slider">
                      <figure>
                        <img src={product.image || '/src/assets/imgs/page/product/img-gallery-1.jpg'} alt={product.name || 'product image'} />
                      </figure>
                      {product.images && Array.isArray(product.images) && product.images.length > 0 && product.images.slice(0, 6).map((img, index) => (
                        <figure key={index}>
                          <img 
                            src={img.url || img.imageUrl || (typeof img === 'string' ? `http://localhost:5000/uploads/products/${img}` : '/src/assets/imgs/page/product/img-gallery-1.jpg')} 
                            alt={`${product.name} - ${index + 1}`} 
                          />
                        </figure>
                      ))}
                    </div>
                  </div>
                  <div className="slider-nav-thumbnails">
                    <div>
                      <div className="item-thumb">
                        <img src={product.image || '/src/assets/imgs/page/product/img-gallery-1.jpg'} alt={product.name || 'product image'} />
                      </div>
                    </div>
                    {product.images && Array.isArray(product.images) && product.images.length > 0 && product.images.slice(0, 6).map((img, index) => (
                      <div key={index}>
                        <div className="item-thumb">
                          <img 
                            src={img.url || img.imageUrl || (typeof img === 'string' ? `http://localhost:5000/uploads/products/${img}` : '/src/assets/imgs/page/product/img-gallery-1.jpg')} 
                            alt={`thumbnail ${index + 1}`} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="box-tags mt-15 mb-30">
                {product.category && (
                  <div className="d-inline-block mr-25">
                    <span className="font-sm font-medium color-gray-900">Category:</span>
                    <a className="link" href="#">{typeof product.category === 'object' ? product.category.title : product.category}</a>
                  </div>
                )}
                {product.subCategory && (
                  <div className="d-inline-block">
                    <span className="font-sm font-medium color-gray-900">Sub Category:</span>
                    <a className="link" href="#">{typeof product.subCategory === 'object' ? product.subCategory.title : product.subCategory}</a>
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="col-lg-7">
              <div className="row">
                <div className="col-lg-7 col-md-7 mb-30">
                  <div className="box-product-price">
                    <h3 className="color-brand-3 price-main d-inline-block mr-10">${product.price?.toFixed(2) || '0.00'}</h3>
                    {product.originalPrice && product.originalPrice !== product.price && (
                      <span className="color-gray-500 price-line font-xl line-througt">${product.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  
                  {/* Stock Status */}
                  {product.stock !== undefined && (
                    <div className="box-progress-product mt-15 mb-20">
                      <span className={`font-sm ${product.stock > 0 ? 'color-success' : 'color-danger'}`}>
                        {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                      </span>
                    </div>
                  )}

                  {/* Bullet Points from API */}
                  {product.bulletsPoint && product.bulletsPoint.trim() && (
                    <div className="product-description color-gray-900 mb-30">
                      <h6 className="color-brand-3 mb-15">Key Features:</h6>
                      <ul className="list-dot">
                        {product.bulletsPoint.split(',').map((bullet, index) => (
                          <li key={index}>{bullet.trim()}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Fallback to features array if no bulletsPoint */}
                  {(!product.bulletsPoint || !product.bulletsPoint.trim()) && product.features && product.features.length > 0 && (
                    <div className="product-description color-gray-900 mb-30">
                      <ul className="list-dot">
                        {product.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Short Description */}
                  {product.shortDescp && (
                    <div className="mb-20">
                      <p className="font-sm color-gray-900">{product.shortDescp}</p>
                    </div>
                  )}

                  <div className="box-product-color">
                    <p className="font-sm color-gray-900">Brand:  <span className="color-brand-2 nameColor">{typeof product.brand === 'object' ? product.brand.title : product.brand || 'N/A'}</span></p>
                  </div>
                  <div className="box-product-style-size mt-30">
                    <div className="row">
                      <div className="col-lg-12 mb-20">
                        <p className="font-sm color-gray-900">Style:<span className="color-brand-2 nameStyle">S22</span></p>
                        <ul className="list-styles">
                          <li className="disabled" title="S22 Ultra">S22 Ultra</li>
                          <li className="active" title="S22">S22</li>
                          <li title="S22 + Standing Cover">S22 + Standing Cover</li>
                        </ul>
                      </div>
                      <div className="col-lg-12 mb-10">
                        <p className="font-sm color-gray-900">Size:<span className="color-brand-2 nameSize">512GB</span></p>
                        <ul className="list-sizes">
                          <li className="disabled" title="1GB">1GB</li>
                          <li className="active" title="512 GB">512 GB</li>
                          <li title="256 GB">256 GB</li>
                          <li className="disabled" title="64GB">64GB</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="buy-product mt-25">
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
                  </div>
                </div>
                <div className="col-lg-5 col-md-5">
                  <div className="pl-30 pl-mb-0">
                    <div className="box-featured-product">
                      <div className="item-featured">
                        <div className="featured-icon">
                          <img src="/src/assets/imgs/page/product/delivery.svg" alt="Ecom" />
                        </div>
                        <div className="featured-info">
                          <span className="font-sm-bold color-gray-1000">Free Delivery</span>
                          <p className="font-sm color-gray-500 font-medium">From all orders over $10</p>
                        </div>
                      </div>
                      <div className="item-featured">
                        <div className="featured-icon">
                          <img src="/src/assets/imgs/page/product/support.svg" alt="Ecom" />
                        </div>
                        <div className="featured-info">
                          <span className="font-sm-bold color-gray-1000">Support 24/7</span>
                          <p className="font-sm color-gray-500 font-medium">Shop with an expert</p>
                        </div>
                      </div>
                      <div className="item-featured">
                        <div className="featured-icon">
                          <img src="/src/assets/imgs/page/product/return.svg" alt="Ecom" />
                        </div>
                        <div className="featured-info">
                          <span className="font-sm-bold color-gray-1000">Return & Refund</span>
                          <p className="font-sm color-gray-500 font-medium">Free return over $200</p>
                        </div>
                      </div>
                      <div className="item-featured">
                        <div className="featured-icon">
                          <img src="/src/assets/imgs/page/product/payment.svg" alt="Ecom" />
                        </div>
                        <div className="featured-info">
                          <span className="font-sm-bold color-gray-1000">Secure payment</span>
                          <p className="font-sm color-gray-500 font-medium">100% Protected</p>
                        </div>
                      </div>
                    </div>
                    <div className="box-sidebar-product">
                      <div className="banner-right h-500 text-center mb-30 banner-right-product">
                        <span className="text-no font-11">No.9</span>
                        <h5 className="font-md-bold mt-10">Sensitive Touch<br className="d-none d-lg-block" />without fingerprint</h5>
                        <p className="text-desc font-xs mt-10">Smooth handle and accurate click</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-bottom pt-30 mb-40"></div>

          {/* Frequently Bought Together */}
          <h4 className="color-brand-3 mb-20">Frequently Bought Together</h4>
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
          </label>
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
                  onClick={(e) => {e.preventDefault(); setActiveTab('description');}}
                  role="tab"
                >
                  Description
                </a>
              </li>
              <li>
                <a 
                  className={activeTab === 'specification' ? 'active' : ''} 
                  href="#tab-specification" 
                  onClick={(e) => {e.preventDefault(); setActiveTab('specification');}}
                  role="tab"
                >
                  Specification
                </a>
              </li>
              <li>
                <a 
                  className={activeTab === 'additional' ? 'active' : ''} 
                  href="#tab-additional" 
                  onClick={(e) => {e.preventDefault(); setActiveTab('additional');}}
                  role="tab"
                >
                  Additional information
                </a>
              </li>
              <li>
                <a 
                  className={activeTab === 'reviews' ? 'active' : ''} 
                  href="#tab-reviews" 
                  onClick={(e) => {e.preventDefault(); setActiveTab('reviews');}}
                  role="tab"
                >
                  Reviews (2)
                </a>
              </li>
              <li>
                <a 
                  className={activeTab === 'vendor' ? 'active' : ''} 
                  href="#tab-vendor" 
                  onClick={(e) => {e.preventDefault(); setActiveTab('vendor');}}
                  role="tab"
                >
                  Vendor
                </a>
              </li>
            </ul>
            <div className="tab-content">
              {activeTab === 'description' && (
                <div className="tab-pane fade active show" id="tab-description" role="tabpanel">
                  <div className="display-text-short">
                    {/* Long Description from API */}
                    {product.longDescp && (
                      <div className="mb-30">
                        <h5 className="mb-20">Product Description</h5>
                        <p className="font-md color-gray-900">{product.longDescp}</p>
                      </div>
                    )}

                    {/* Short Description if no long description */}
                    {!product.longDescp && product.shortDescp && (
                      <div className="mb-30">
                        <h5 className="mb-20">Product Description</h5>
                        <p className="font-md color-gray-900">{product.shortDescp}</p>
                      </div>
                    )}

                    {/* Bullet Points from API */}
                    {product.bulletsPoint && product.bulletsPoint.trim() && (
                      <div className="mb-30">
                        <h5 className="mb-20">Key Features</h5>
                        <ul className="list-dot">
                          {product.bulletsPoint.split(',').map((bullet, index) => (
                            <li key={index} className="font-md color-gray-900">{bullet.trim()}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Meta Description */}
                    {product.metaDescp && product.metaDescp !== product.shortDescp && (
                      <div className="mb-30">
                        <p className="font-sm color-gray-700">{product.metaDescp}</p>
                      </div>
                    )}

                    {/* Fallback if no description */}
                    {!product.longDescp && !product.shortDescp && !product.bulletsPoint && (
                      <p className="font-md color-gray-500">No description available for this product.</p>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'specification' && (
                <div className="tab-pane fade active show" id="tab-specification" role="tabpanel">
                  <h5 className="mb-25">Product Specification</h5>
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <tbody>
                        {product.sku && (
                          <tr>
                            <td className="font-sm-bold color-gray-900">SKU</td>
                            <td className="font-sm color-gray-700">{product.sku}</td>
                          </tr>
                        )}
                        {product.brand && (
                          <tr>
                            <td className="font-sm-bold color-gray-900">Brand</td>
                            <td className="font-sm color-gray-700">{typeof product.brand === 'object' ? product.brand.title : product.brand}</td>
                          </tr>
                        )}
                        {product.mfr && (
                          <tr>
                            <td className="font-sm-bold color-gray-900">Manufacturer</td>
                            <td className="font-sm color-gray-700">{product.mfr}</td>
                          </tr>
                        )}
                        {product.techPartNo && (
                          <tr>
                            <td className="font-sm-bold color-gray-900">Part Number</td>
                            <td className="font-sm color-gray-700">{product.techPartNo}</td>
                          </tr>
                        )}
                        {product.upcCode && (
                          <tr>
                            <td className="font-sm-bold color-gray-900">UPC Code</td>
                            <td className="font-sm color-gray-700">{product.upcCode}</td>
                          </tr>
                        )}
                        {product.category && (
                          <tr>
                            <td className="font-sm-bold color-gray-900">Category</td>
                            <td className="font-sm color-gray-700">{typeof product.category === 'object' ? product.category.title : product.category}</td>
                          </tr>
                        )}
                        {product.subCategory && (
                          <tr>
                            <td className="font-sm-bold color-gray-900">Sub Category</td>
                            <td className="font-sm color-gray-700">{typeof product.subCategory === 'object' ? product.subCategory.title : product.subCategory}</td>
                          </tr>
                        )}
                        {product.productSource && (
                          <tr>
                            <td className="font-sm-bold color-gray-900">Product Source</td>
                            <td className="font-sm color-gray-700">{product.productSource}</td>
                          </tr>
                        )}
                        {product.endOfLifeDate && (
                          <tr>
                            <td className="font-sm-bold color-gray-900">End of Life Date</td>
                            <td className="font-sm color-gray-700">{product.endOfLifeDate}</td>
                          </tr>
                        )}
                        {product.quantity !== undefined && (
                          <tr>
                            <td className="font-sm-bold color-gray-900">Available Quantity</td>
                            <td className="font-sm color-gray-700">{product.quantity}</td>
                          </tr>
                        )}
                        {/* Fallback message */}
                        {!product.sku && !product.brand && !product.mfr && !product.techPartNo && (
                          <tr>
                            <td colSpan="2" className="text-center font-sm color-gray-500">
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
                      <h6 className="mb-15">Additional Resources</h6>
                      <a href={product.multimediaUrl} target="_blank" rel="noopener noreferrer" className="btn btn-border font-sm">
                        View Multimedia Content
                      </a>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'additional' && (
                <div className="tab-pane fade active show" id="tab-additional" role="tabpanel">
                  <h5 className="mb-25">Additional information</h5>
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

              {activeTab === 'reviews' && (
                <div className="tab-pane fade active show" id="tab-reviews" role="tabpanel">
                  <div className="comments-area">
                    <div className="row">
                      <div className="col-lg-8">
                        <h4 className="mb-30 title-question">Customer questions & answers</h4>
                        <div className="comment-list">
                          <div className="single-comment justify-content-between d-flex mb-30 hover-up">
                            <div className="user justify-content-between d-flex">
                              <div className="thumb text-center">
                                <img src="/src/assets/imgs/page/product/author-2.png" alt="Ecom" />
                                <a className="font-heading text-brand" href="#">Sienna</a>
                              </div>
                              <div className="desc">
                                <div className="d-flex justify-content-between mb-10">
                                  <div className="d-flex align-items-center">
                                    <span className="font-xs color-gray-700">December 4, 2022 at 3:12 pm</span>
                                  </div>
                                  <div className="product-rate d-inline-block">
                                    <div className="product-rating" style={{width: '100%'}}></div>
                                  </div>
                                </div>
                                <p className="mb-10 font-sm color-gray-900">
                                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus, suscipit exercitationem accusantium obcaecati quos voluptate nesciunt facilis itaque modi commodi dignissimos sequi repudiandae minus ab deleniti totam officia id incidunt?
                                  <a className="reply" href="#"> Reply</a>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <h4 className="mb-30 title-question">Customer reviews</h4>
                        <div className="d-flex mb-30">
                          <div className="product-rate d-inline-block mr-15">
                            <div className="product-rating" style={{width: '90%'}}></div>
                          </div>
                          <h6>4.8 out of 5</h6>
                        </div>
                        <div className="progress">
                          <span>5 star</span>
                          <div className="progress-bar" role="progressbar" style={{width: '50%'}} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">50%</div>
                        </div>
                        <div className="progress">
                          <span>4 star</span>
                          <div className="progress-bar" role="progressbar" style={{width: '25%'}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div>
                        </div>
                        <div className="progress">
                          <span>3 star</span>
                          <div className="progress-bar" role="progressbar" style={{width: '45%'}} aria-valuenow="45" aria-valuemin="0" aria-valuemax="100">45%</div>
                        </div>
                        <div className="progress">
                          <span>2 star</span>
                          <div className="progress-bar" role="progressbar" style={{width: '65%'}} aria-valuenow="65" aria-valuemin="0" aria-valuemax="100">65%</div>
                        </div>
                        <div className="progress mb-30">
                          <span>1 star</span>
                          <div className="progress-bar" role="progressbar" style={{width: '85%'}} aria-valuenow="85" aria-valuemin="0" aria-valuemax="100">85%</div>
                        </div>
                        <a className="font-xs text-muted" href="#">How are ratings calculated?</a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'vendor' && (
                <div className="tab-pane fade active show" id="tab-vendor" role="tabpanel">
                  <div className="vendor-logo d-flex mb-30">
                    <img src="/src/assets/imgs/page/product/futur.png" alt="" />
                    <div className="vendor-name ml-15">
                      <h6><a href="/vendor">Futur Tech.</a></h6>
                      <div className="product-rate-cover text-end">
                        <div className="product-rate d-inline-block">
                          <div className="product-rating" style={{width: '90%'}}></div>
                        </div>
                        <span className="font-small ml-5 text-muted"> (32 reviews)</span>
                      </div>
                    </div>
                  </div>
                  <ul className="contact-infor mb-50">
                    <li>
                      <img src="/src/assets/imgs/page/product/icon-location.svg" alt="" />
                      <strong>Address:</strong>
                      <span> 5171 W Campbell Ave undefined Kent, Utah 53127 United States</span>
                    </li>
                    <li>
                      <img src="/src/assets/imgs/page/product/icon-contact.svg" alt="" />
                      <strong>Contact Seller:</strong>
                      <span> (+91) - 540-025-553</span>
                    </li>
                  </ul>
                  <div className="d-flex mb-25">
                    <div className="mr-30">
                      <p className="color-brand-1 font-xs">Rating</p>
                      <h4 className="mb-0">92%</h4>
                    </div>
                    <div className="mr-30">
                      <p className="color-brand-1 font-xs">Ship on time</p>
                      <h4 className="mb-0">100%</h4>
                    </div>
                    <div>
                      <p className="color-brand-1 font-xs">Chat response</p>
                      <h4 className="mb-0">89%</h4>
                    </div>
                  </div>
                  <p className="font-sm color-gray-500 mb-15">
                    Noodles & Company is an American fast-casual restaurant that offers international and American noodle dishes and pasta in addition to soups and salads. Noodles & Company was founded in 1995 by Aaron Kennedy and is headquartered in Broomfield, Colorado. The company went public in 2013 and recorded a $457 million revenue in 2017.In late 2018, there were 460 Noodles & Company locations across 29 states and Washington, D.C.
                  </p>
                  <p className="font-sm color-gray-500">
                    Proin congue dapibus rhoncus. Curabitur ipsum orci, malesuada in porttitor a, porttitor quis diam. Nunc at arcu ut turpis facilisis volutpat. Proin tristique, mauris non gravida dignissim, purus mauris malesuada tellus, in tincidunt orci enim eget ligula. Quisque bibendum, ipsum id malesuada placerat, purus felis vehicula risus, vel fringilla justo erat ullamcorper ligula. Fusce congue ullamcorper ligula, at commodo turpis molestie vel.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="section-box shop-template">
        <div className="container">
          <div className="border-bottom pt-30 mb-50"></div>
          <h4 className="color-brand-3">Related Products</h4>
          <div className="list-products-5 mt-20">
            {/* Related products will be rendered here */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-box mt-90 mb-50">
        <div className="container">
          <ul className="list-col-5">
            <li>
              <div className="item-list">
                <div className="icon-left">
                  <img src="/src/assets/imgs/template/delivery.svg" alt="Ecom" />
                </div>
                <div className="info-right">
                  <h5 className="font-lg-bold color-gray-100">Free Delivery</h5>
                  <p className="font-sm color-gray-500">From all orders over $10</p>
                </div>
              </div>
            </li>
            <li>
              <div className="item-list">
                <div className="icon-left">
                  <img src="/src/assets/imgs/template/support.svg" alt="Ecom" />
                </div>
                <div className="info-right">
                  <h5 className="font-lg-bold color-gray-100">Support 24/7</h5>
                  <p className="font-sm color-gray-500">Shop with an expert</p>
                </div>
              </div>
            </li>
            <li>
              <div className="item-list">
                <div className="icon-left">
                  <img src="/src/assets/imgs/template/voucher.svg" alt="Ecom" />
                </div>
                <div className="info-right">
                  <h5 className="font-lg-bold color-gray-100">Gift voucher</h5>
                  <p className="font-sm color-gray-500">Refer a friend</p>
                </div>
              </div>
            </li>
            <li>
              <div className="item-list">
                <div className="icon-left">
                  <img src="/src/assets/imgs/template/return.svg" alt="Ecom" />
                </div>
                <div className="info-right">
                  <h5 className="font-lg-bold color-gray-100">Return & Refund</h5>
                  <p className="font-sm color-gray-500">Free return over $200</p>
                </div>
              </div>
            </li>
            <li>
              <div className="item-list">
                <div className="icon-left">
                  <img src="/src/assets/imgs/template/secure.svg" alt="Ecom" />
                </div>
                <div className="info-right">
                  <h5 className="font-lg-bold color-gray-100">Secure payment</h5>
                  <p className="font-sm color-gray-500">100% Protected</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-box box-newsletter">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-7 col-sm-12">
              <h3 className="color-white">Subscrible & Get <span className="color-warning">10%</span> Discount</h3>
              <p className="font-lg color-white">Get E-mail updates about our latest shop and <span className="font-lg-bold">special offers.</span></p>
            </div>
            <div className="col-lg-4 col-md-5 col-sm-12">
              <div className="box-form-newsletter mt-15">
                <form className="form-newsletter">
                  <input className="input-newsletter font-xs" defaultValue="" placeholder="Your email Address" />
                  <button className="btn btn-brand-2">Sign Up</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
        </>
      )}
    </main>
  );
};

export default ProductDetail;
