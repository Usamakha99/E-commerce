import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Sidebar from '../components/Sidebar';
import ApiStatus from '../components/ApiStatus';
import { useProducts } from '../hooks/useProducts';

const ShopGrid = () => {
  const [viewType, setViewType] = useState('grid');
  const [sortBy, setSortBy] = useState('latest');
  const [showPerPage, setShowPerPage] = useState(20); // 20 products per page
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBrands, setSelectedBrands] = useState([]);

  // Fetch ALL products from API once
  const { products: allProducts, loading, error, fetchProducts } = useProducts({
    filters: { 
      sort: sortBy 
    },
    autoFetch: true,
  });

  // CLIENT-SIDE FILTERING AND PAGINATION: Filter by brands then paginate
  const filteredProducts = allProducts ? allProducts.filter(product => {
    if (selectedBrands.length === 0) return true;
    const productBrand = product.brand?.title || 'Unknown';
    return selectedBrands.includes(productBrand);
  }) : [];

  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / showPerPage);
  const startIndex = (currentPage - 1) * showPerPage;
  const endIndex = startIndex + showPerPage;
  const products = filteredProducts.slice(startIndex, endIndex);

  // Refetch when sort changes
  useEffect(() => {
    if (allProducts && allProducts.length > 0 && !error) {
      fetchProducts({ sort: sortBy });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  // Reset to page 1 when changing items per page
  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [showPerPage]);

  // Reset to page 1 when brand filter changes
  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedBrands]);

  // Handler for changing products per page
  const handleShowPerPage = (count) => {
    setShowPerPage(count);
    setCurrentPage(1);
  };

  // Handler for page navigation
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler for brand filter changes
  const handleBrandFilter = (brands) => {
    setSelectedBrands(brands);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <main className="main">
      {/* Breadcrumb */}
      <div className="section-box">
        <div className="breadcrumbs-div">
          <div className="container">
                 <ul className="breadcrumb">
                   <li><Link className="font-xs color-gray-1000" to="/">Home</Link></li>
                   <li><Link className="font-xs color-gray-500" to="/shop">Electronics</Link></li>
                   <li><Link className="font-xs color-gray-500" to="/shop">Cell phone</Link></li>
                   <li><Link className="font-xs color-gray-500" to="/shop">Accessories</Link></li>
                 </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="section-box shop-template mt-30">
        <div className="container">
          {/* API Status Indicator */}
          <div className="row mb-3">
            <div className="col-12">
              <ApiStatus />
              </div>
          </div>
          
          <div className="row">
            <div className="col-lg-9 order-first order-lg-last">
            {/* Filters and Sort */}
              <div className="box-filters mt-0 pb-5 border-bottom">
                <div className="row">
                  <div className="col-xl-2 col-lg-3 mb-10 text-lg-start text-center">
                    <a className="btn btn-filter font-sm color-brand-3 font-medium" href="#ModalFiltersForm" data-bs-toggle="modal">
                      All Filters
                    </a>
                  </div>
                  <div className="col-xl-10 col-lg-9 mb-10 text-lg-end text-center">
                    <span className="font-sm color-gray-900 font-medium border-1-right span">
                      Showing {startIndex + 1}-{Math.min(endIndex, totalProducts)} of {totalProducts} results
                      {selectedBrands.length > 0 && (
                        <span className="text-muted"> (filtered by {selectedBrands.length} brand{selectedBrands.length > 1 ? 's' : ''})</span>
                      )}
                    </span>
                    <div className="d-inline-block">
                      <span className="font-sm color-gray-500 font-medium">Sort by:</span>
                      <div className="dropdown dropdown-sort border-1-right">
                        <button className="btn dropdown-toggle font-sm color-gray-900 font-medium" id="dropdownSort" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                          Latest products
                  </button>
                        <ul className="dropdown-menu dropdown-menu-light" aria-labelledby="dropdownSort">
                          <li><a className="dropdown-item active" href="#">Latest products</a></li>
                          <li><a className="dropdown-item" href="#">Oldest products</a></li>
                          <li><a className="dropdown-item" href="#">Comments products</a></li>
                        </ul>
                      </div>
                </div>
                    <div className="d-inline-block">
                      <span className="font-sm color-gray-500 font-medium">Show</span>
                      <div className="dropdown dropdown-sort border-1-right">
                        <button className="btn dropdown-toggle font-sm color-gray-900 font-medium" id="dropdownSort2" type="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-display="static">
                          <span>{showPerPage} items</span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-light" aria-labelledby="dropdownSort2">
                          <li><a className={`dropdown-item ${showPerPage === 20 ? 'active' : ''}`} href="#" onClick={(e) => {e.preventDefault(); handleShowPerPage(20);}}>20 items</a></li>
                          <li><a className={`dropdown-item ${showPerPage === 30 ? 'active' : ''}`} href="#" onClick={(e) => {e.preventDefault(); handleShowPerPage(30);}}>30 items</a></li>
                          <li><a className={`dropdown-item ${showPerPage === 50 ? 'active' : ''}`} href="#" onClick={(e) => {e.preventDefault(); handleShowPerPage(50);}}>50 items</a></li>
                          <li><a className={`dropdown-item ${showPerPage === 100 ? 'active' : ''}`} href="#" onClick={(e) => {e.preventDefault(); handleShowPerPage(100);}}>100 items</a></li>
                        </ul>
                  </div>
                  </div>
                    <div className="d-inline-block">
                      <a className={`view-type-grid mr-5 ${viewType === 'grid' ? 'active' : ''}`} href="#" onClick={(e) => {e.preventDefault(); setViewType('grid');}}></a>
                      <a className={`view-type-list ${viewType === 'list' ? 'active' : ''}`} href="#" onClick={(e) => {e.preventDefault(); setViewType('list');}}></a>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
              <div className={`row mt-20 ${viewType === 'list' ? 'list-view' : 'grid-view'}`}>
              {loading && (
                <div className="col-12 text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                    <p className="mt-3">Loading products from API...</p>
                </div>
              )}
              
                {!loading && (!products || products.length === 0) && (
                  <div className="col-12 text-center py-5">
                    <div className="alert alert-info" role="alert">
                      <h4 className="alert-heading">No Products Available</h4>
                      <p className="mb-0">
                        {error ? (
                          <>
                            <strong>API Error:</strong> {error}
                            <br />
                            <small>Please make sure your backend API is running on http://localhost:5000</small>
                          </>
                        ) : (
                          <>
                            No products found in the database.
                    <br />
                            <small>Check your backend API to ensure products are available.</small>
                          </>
                        )}
                      </p>
                    </div>
                </div>
              )}
              
                {!loading && products && products.map((product) => (
                  <div key={product.id} className={viewType === 'list' ? 'col-12' : 'col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12'}>
                    <div className={`card-grid-style-3 ${viewType === 'list' ? 'list-style' : ''}`}>
                      <div className={`card-grid-inner ${viewType === 'list' ? 'd-flex align-items-center' : ''}`}>
                        <div className="tools">
                          <a className="btn btn-trend btn-tooltip mb-10" href="#" aria-label="Trend" data-bs-placement="left"></a>
                          <a className="btn btn-wishlist btn-tooltip mb-10" href="/wishlist" aria-label="Add To Wishlist"></a>
                          <a className="btn btn-compare btn-tooltip mb-10" href="/compare" aria-label="Compare"></a>
                          <a className="btn btn-quickview btn-tooltip" aria-label="Quick view" href="#ModalQuickview" data-bs-toggle="modal"></a>
                        </div>
                        <div className="image-box">
                          {product.discount > 0 && (
                          <span className="label bg-brand-2">-{product.discount}%</span>
                          )}
                          <a href={`/product/${product.id}`}>
                            <img src={product.image} alt={product.name} onError={(e) => {e.target.src='/src/assets/imgs/page/homepage1/imgsp1.png'}} />
                          </a>
                        </div>
                        <div className="info-right">
                          <a className="font-xs color-gray-500" href="/vendor">{product.brand?.title || 'N/A'}</a><br />
                          <a className="color-brand-3 font-sm-bold" href={`/product/${product.id}`} style={{ 
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            minHeight: '40px'
                          }}>{product.shortDescp || product.name}</a>
                          
                          <div className="price-info">
                            <strong className="font-lg-bold color-brand-3 price-main">${product.price > 0 ? product.price.toFixed(2) : '0.00'}</strong>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="color-gray-500 price-line">${product.originalPrice.toFixed(2)}</span>
                            )}
                          </div>
                          <div className="mt-20 box-btn-cart">
                            <a className="btn btn-cart" href="/cart">Add To Cart</a>
                          </div>
                          {product.features && product.features.length > 0 && (
                          <ul className="list-features">
                            {product.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
              ))}
            </div>

            {/* Pagination */}
              {totalPages > 1 && (
              <nav>
                <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <a 
                        className="page-link page-prev" 
                        href="#" 
                        onClick={(e) => {e.preventDefault(); if(currentPage > 1) handlePageChange(currentPage - 1);}}
                        aria-label="Previous"
                      ></a>
                  </li>
                    
                    {getPageNumbers().map(pageNum => (
                      <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                        <a 
                          className="page-link" 
                          href="#" 
                          onClick={(e) => {e.preventDefault(); handlePageChange(pageNum);}}
                          style={currentPage === pageNum ? { backgroundColor: '#df2020', borderColor: '#df2020', color: '#fff' } : {}}
                        >
                          {pageNum}
                        </a>
                  </li>
                    ))}
                    
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <a 
                        className="page-link page-next" 
                        href="#" 
                        onClick={(e) => {e.preventDefault(); if(currentPage < totalPages) handlePageChange(currentPage + 1);}}
                        aria-label="Next"
                      ></a>
                  </li>
                </ul>
              </nav>
              )}
            </div>
            
            {/* Sidebar */}
            <Sidebar 
              onBrandFilter={handleBrandFilter}
              selectedBrands={selectedBrands}
            />
          </div>
        </div>
      </div>

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
              <h3 className="color-white">Subscribe & Get <span className="color-warning">10%</span> Discount</h3>
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
    </main>
  );
};

export default ShopGrid;
