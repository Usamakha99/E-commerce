import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Sidebar from '../components/Sidebar';

const ShopGrid = () => {
  const [viewType, setViewType] = useState('grid');
  const [sortBy, setSortBy] = useState('latest');
  const [showPerPage, setShowPerPage] = useState(30);

  // Sample product data with actual images from assets
  const products = [
    {
      id: 1,
      name: 'Dell Optiplex 9020 Small Form Business Desktop',
      brand: 'Apple',
      price: 2856.3,
      originalPrice: 3225.6,
      discount: 17,
      image: '/src/assets/imgs/page/homepage1/imgsp3.png',
      rating: 5,
      reviews: 65,
      features: [
        '27-inch (diagonal) Retina 5K display',
        '3.1GHz 6-core 10th-generation Intel Core i5',
        'AMD Radeon Pro 5300 graphics'
      ]
    },
    {
      id: 2,
      name: 'HP 24 All-in-One PC, Intel Core i3-1115G4',
      brand: 'Apple',
      price: 2856.3,
      originalPrice: 3225.6,
      discount: 17,
      image: '/src/assets/imgs/page/homepage1/imgsp4.png',
      rating: 5,
      reviews: 65,
      features: [
        '27-inch (diagonal) Retina 5K display',
        '3.1GHz 6-core 10th-generation Intel Core i5',
        'AMD Radeon Pro 5300 graphics'
      ]
    },
    {
      id: 3,
      name: 'Gateway 23.8" All-in-one Desktop, Fully Adjustable',
      brand: 'Apple',
      price: 2856.3,
      originalPrice: 3225.6,
      discount: 17,
      image: '/src/assets/imgs/page/homepage1/imgsp5.png',
      rating: 5,
      reviews: 65,
      features: [
        '27-inch (diagonal) Retina 5K display',
        '3.1GHz 6-core 10th-generation Intel Core i5',
        'AMD Radeon Pro 5300 graphics'
      ]
    },
    {
      id: 4,
      name: 'HP 22 All-in-One PC, Intel Pentium Silver J5040',
      brand: 'Apple',
      price: 2856.3,
      originalPrice: 3225.6,
      discount: 17,
      image: '/src/assets/imgs/page/homepage1/imgsp6.png',
      rating: 5,
      reviews: 65,
      features: [
        '27-inch (diagonal) Retina 5K display',
        '3.1GHz 6-core 10th-generation Intel Core i5',
        'AMD Radeon Pro 5300 graphics'
      ]
    },
    {
      id: 5,
      name: 'HP Slim Desktop, Intel Celeron J4025, 4GB RAM',
      brand: 'Apple',
      price: 2856.3,
      originalPrice: 3225.6,
      discount: 17,
      image: '/src/assets/imgs/page/homepage1/imgsp7.png',
      rating: 5,
      reviews: 65,
      features: [
        '27-inch (diagonal) Retina 5K display',
        '3.1GHz 6-core 10th-generation Intel Core i5',
        'AMD Radeon Pro 5300 graphics'
      ]
    },
    {
      id: 6,
      name: 'Class 4K UHD (2160P) LED Roku Smart TV HDR',
      brand: 'Apple',
      price: 2856.3,
      originalPrice: 3225.6,
      discount: 17,
      image: '/src/assets/imgs/page/homepage1/imgsp1.png',
      rating: 5,
      reviews: 65,
      features: [
        '27-inch (diagonal) Retina 5K display',
        '3.1GHz 6-core 10th-generation Intel Core i5',
        'AMD Radeon Pro 5300 graphics'
      ]
    },
    {
      id: 7,
      name: 'Galaxy Tab S7 Plus 12.4" 128GB Mystic Black',
      brand: 'Apple',
      price: 2856.3,
      originalPrice: 3225.6,
      discount: 17,
      image: '/src/assets/imgs/page/homepage1/imgsp2.png',
      rating: 5,
      reviews: 65,
      features: [
        '27-inch (diagonal) Retina 5K display',
        '3.1GHz 6-core 10th-generation Intel Core i5',
        'AMD Radeon Pro 5300 graphics'
      ]
    },
    {
      id: 8,
      name: 'HP 11.6" Chromebook, AMD A4, 4GB RAM, 32GB Storage',
      brand: 'Apple',
      price: 2856.3,
      originalPrice: 3225.6,
      discount: 17,
      image: '/src/assets/imgs/page/homepage1/imgsp3.png',
      rating: 5,
      reviews: 65,
      features: [
        '27-inch (diagonal) Retina 5K display',
        '3.1GHz 6-core 10th-generation Intel Core i5',
        'AMD Radeon Pro 5300 graphics'
      ]
    },
    {
      id: 9,
      name: 'MSI Optix G272 27" Full HD LED Gaming LCD Monitor',
      brand: 'Apple',
      price: 2856.3,
      originalPrice: 3225.6,
      discount: 17,
      image: '/src/assets/imgs/page/homepage1/imgsp4.png',
      rating: 5,
      reviews: 65,
      features: [
        '27-inch (diagonal) Retina 5K display',
        '3.1GHz 6-core 10th-generation Intel Core i5',
        'AMD Radeon Pro 5300 graphics'
      ]
    },
    {
      id: 10,
      name: 'RCA 43" Class 4K Ultra HD (2160P) HDR Roku Smart',
      brand: 'Apple',
      price: 2856.3,
      originalPrice: 3225.6,
      discount: 17,
      image: '/src/assets/imgs/page/homepage1/imgsp5.png',
      rating: 5,
      reviews: 65,
      features: [
        '27-inch (diagonal) Retina 5K display',
        '3.1GHz 6-core 10th-generation Intel Core i5',
        'AMD Radeon Pro 5300 graphics'
      ]
    },
    {
      id: 11,
      name: 'Bose Sport Earbuds True Wireless Headphones',
      brand: 'Apple',
      price: 2856.3,
      originalPrice: 3225.6,
      discount: 17,
      image: '/src/assets/imgs/page/homepage1/imgsp6.png',
      rating: 5,
      reviews: 65,
      features: [
        '27-inch (diagonal) Retina 5K display',
        '3.1GHz 6-core 10th-generation Intel Core i5',
        'AMD Radeon Pro 5300 graphics'
      ]
    },
    {
      id: 12,
      name: 'ASUS VivoBook 15.6" 1080p PC Laptops, Intel Core i3',
      brand: 'Apple',
      price: 2856.3,
      originalPrice: 3225.6,
      discount: 17,
      image: '/src/assets/imgs/page/homepage1/imgsp7.png',
      rating: 5,
      reviews: 65,
      features: [
        '27-inch (diagonal) Retina 5K display',
        '3.1GHz 6-core 10th-generation Intel Core i5',
        'AMD Radeon Pro 5300 graphics'
      ]
    },
    {
      id: 9,
      name: 'MSI Optix G272 27" Full HD LED Gaming LCD Monitor',
      brand: 'Apple',
      price: 2856.3,
      originalPrice: 3225.6,
      discount: 17,
      image: '/src/assets/imgs/page/homepage1/imgsp4.png',
      rating: 5,
      reviews: 65,
      features: [
        '27-inch (diagonal) Retina 5K display',
        '3.1GHz 6-core 10th-generation Intel Core i5',
        'AMD Radeon Pro 5300 graphics'
      ]
    },
    {
      id: 10,
      name: 'RCA 43" Class 4K Ultra HD (2160P) HDR Roku Smart',
      brand: 'Apple',
      price: 2856.3,
      originalPrice: 3225.6,
      discount: 17,
      image: '/src/assets/imgs/page/homepage1/imgsp5.png',
      rating: 5,
      reviews: 65,
      features: [
        '27-inch (diagonal) Retina 5K display',
        '3.1GHz 6-core 10th-generation Intel Core i5',
        'AMD Radeon Pro 5300 graphics'
      ]
    },
    {
      id: 11,
      name: 'Bose Sport Earbuds True Wireless Headphones',
      brand: 'Apple',
      price: 2856.3,
      originalPrice: 3225.6,
      discount: 17,
      image: '/src/assets/imgs/page/homepage1/imgsp6.png',
      rating: 5,
      reviews: 65,
      features: [
        '27-inch (diagonal) Retina 5K display',
        '3.1GHz 6-core 10th-generation Intel Core i5',
        'AMD Radeon Pro 5300 graphics'
      ]
    },
    {
      id: 12,
      name: 'ASUS VivoBook 15.6" 1080p PC Laptops, Intel Core i3',
      brand: 'Apple',
      price: 2856.3,
      originalPrice: 3225.6,
      discount: 17,
      image: '/src/assets/imgs/page/homepage1/imgsp7.png',
      rating: 5,
      reviews: 65,
      features: [
        '27-inch (diagonal) Retina 5K display',
        '3.1GHz 6-core 10th-generation Intel Core i5',
        'AMD Radeon Pro 5300 graphics'
      ]
    },
    {
      id: 9,
      name: 'MSI Optix G272 27" Full HD LED Gaming LCD Monitor',
      brand: 'Apple',
      price: 2856.3,
      originalPrice: 3225.6,
      discount: 17,
      image: '/src/assets/imgs/page/homepage1/imgsp4.png',
      rating: 5,
      reviews: 65,
      features: [
        '27-inch (diagonal) Retina 5K display',
        '3.1GHz 6-core 10th-generation Intel Core i5',
        'AMD Radeon Pro 5300 graphics'
      ]
    },
    {
      id: 10,
      name: 'RCA 43" Class 4K Ultra HD (2160P) HDR Roku Smart',
      brand: 'Apple',
      price: 2856.3,
      originalPrice: 3225.6,
      discount: 17,
      image: '/src/assets/imgs/page/homepage1/imgsp5.png',
      rating: 5,
      reviews: 65,
      features: [
        '27-inch (diagonal) Retina 5K display',
        '3.1GHz 6-core 10th-generation Intel Core i5',
        'AMD Radeon Pro 5300 graphics'
      ]
    },
    {
      id: 11,
      name: 'Bose Sport Earbuds True Wireless Headphones',
      brand: 'Apple',
      price: 2856.3,
      originalPrice: 3225.6,
      discount: 17,
      image: '/src/assets/imgs/page/homepage1/imgsp6.png',
      rating: 5,
      reviews: 65,
      features: [
        '27-inch (diagonal) Retina 5K display',
        '3.1GHz 6-core 10th-generation Intel Core i5',
        'AMD Radeon Pro 5300 graphics'
      ]
    },
    {
      id: 12,
      name: 'ASUS VivoBook 15.6" 1080p PC Laptops, Intel Core i3',
      brand: 'Apple',
      price: 2856.3,
      originalPrice: 3225.6,
      discount: 17,
      image: '/src/assets/imgs/page/homepage1/imgsp7.png',
      rating: 5,
      reviews: 65,
      features: [
        '27-inch (diagonal) Retina 5K display',
        '3.1GHz 6-core 10th-generation Intel Core i5',
        'AMD Radeon Pro 5300 graphics'
      ]
    }
  ];

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

      {/* Featured Products Slider */}
      <div className="section-box shop-template mt-30">
        <div className="container">
          <div className="box-swiper slider-shop-2">
            <div className="swiper-container swiper-group-3">
              <div className="swiper-wrapper pt-5">
                <div className="swiper-slide">
                  <div className="card-grid-style-2">
                    <span className="label bg-brand-2">-12%</span>
                    <div className="image-box">
                      <a href="/product">
                        <img src="/src/assets/imgs/page/homepage2/cat-img-6.png" alt="Ecom" />
                      </a>
                    </div>
                    <div className="info-right">
                      <span className="font-xs color-gray-500">YSSOA Store</span><br />
                      <a className="color-brand-3 font-sm-bold" href="/product">Chair Mesh Ergonomic Adjustable Swivel Task Chair with Headrest</a>
                      
                      <div className="price-info">
                        <strong className="font-lg-bold color-brand-3 price-main">$2556.3</strong>
                        <span className="color-gray-500 price-line">$3225.6</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="card-grid-style-2">
                    <span className="label bg-brand-2">-17%</span>
                    <div className="image-box">
                      <a href="/product">
                        <img src="/src/assets/imgs/page/homepage2/cat-img-9.png" alt="Ecom" />
                      </a>
                    </div>
                    <div className="info-right">
                      <span className="font-xs color-gray-500">Apple</span><br />
                      <a className="color-brand-3 font-sm-bold" href="/product">Straight Talk Samsung Galaxy A03s, 32GB, Black</a>
                      
                      <div className="price-info">
                        <strong className="font-lg-bold color-brand-3 price-main">$2556.3</strong>
                        <span className="color-gray-500 price-line">$3225.6</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="card-grid-style-2">
                    <span className="label bg-brand-2">-20%</span>
                    <div className="image-box">
                      <a href="/product">
                        <img src="/src/assets/imgs/page/homepage2/cat-img-10.png" alt="Ecom" />
                      </a>
                    </div>
                    <div className="info-right">
                      <span className="font-xs color-gray-500">Apple</span><br />
                      <a className="color-brand-3 font-sm-bold" href="/product">iMac MNE92LL/A 27 Inch, 3.4 GHz Intel Core i5, 8GB RAM, 1TB Drive</a>
                      
                      <div className="price-info">
                        <strong className="font-lg-bold color-brand-3 price-main">$2556.3</strong>
                        <span className="color-gray-500 price-line">$3225.6</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="card-grid-style-2">
                    <span className="label bg-brand-2">-22%</span>
                    <div className="image-box">
                      <a href="/product">
                        <img src="/src/assets/imgs/page/homepage2/cat-img-16.png" alt="Ecom" />
                      </a>
                    </div>
                    <div className="info-right">
                      <span className="font-xs color-gray-500">Apple</span><br />
                      <a className="color-brand-3 font-sm-bold" href="/product">Apple Watch Series 8 [GPS 45mm] Smart Watch w/ Midnight Case</a>
                      
                      <div className="price-info">
                        <strong className="font-lg-bold color-brand-3 price-main">$2556.3</strong>
                        <span className="color-gray-500 price-line">$3225.6</span>
                      </div>
                </div>
                  </div>
                </div>
                </div>
              </div>
            <div className="swiper-button-next swiper-button-next-group-3"></div>
            <div className="swiper-button-prev swiper-button-prev-group-3"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="section-box shop-template mt-30">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <div className="sidebar-ads">
                <div className="bg-electronic">
                  <span className="big-deal mb-5">Big deal</span>
                  <h4 className="font-25">Electronic</h4>
                  <p className="font-16 color-brand-3">Hot devices, Latest trending</p>
                </div>
              </div>
            </div>
            <div className="col-lg-9">
              <div className="banner-top-gray-100">
                <div className="banner-ads-top mb-30">
                  <a href="#">
                    <img src="/src/assets/imgs/page/shop/grid-2/banner.png" alt="Ecom" />
                  </a>
                </div>
              </div>
          </div>
            </div>
          <div className="row">
            <div className="col-lg-9 order-first order-lg-last">
            {/* Filters and Sort */}
              <div className="box-filters mt-0 pb-5 border-bottom">
                <div className="row">
                  <div className="col-xl-2 col-lg-3 mb-10 text-lg-start text-center">
                    <a className="btn btn-filter font-sm color-brand-3 font-medium" href="#ModalFiltersForm" data-bs-toggle="modal">
                      All Fillters
                    </a>
                  </div>
                  <div className="col-xl-10 col-lg-9 mb-10 text-lg-end text-center">
                    <span className="font-sm color-gray-900 font-medium border-1-right span">Showing 1–16 of 17 results</span>
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
                          <span>30 items</span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-light" aria-labelledby="dropdownSort2">
                          <li><a className="dropdown-item active" href="#">30 items</a></li>
                          <li><a className="dropdown-item" href="#">50 items</a></li>
                          <li><a className="dropdown-item" href="#">100 items</a></li>
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
              {products.map((product) => (
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
                          <span className="label bg-brand-2">-{product.discount}%</span>
                          <a href="/product">
                            <img src={product.image} alt="Ecom" />
                          </a>
                        </div>
                        <div className="info-right">
                          <a className="font-xs color-gray-500" href="/vendor">{product.brand}</a><br />
                          <a className="color-brand-3 font-sm-bold" href="/product">{product.name}</a>
                          
                          <div className="price-info">
                            <strong className="font-lg-bold color-brand-3 price-main">${product.price}</strong>
                            <span className="color-gray-500 price-line">${product.originalPrice}</span>
                          </div>
                          <div className="mt-20 box-btn-cart">
                            <a className="btn btn-cart" href="/cart">Add To Cart</a>
                          </div>
                          <ul className="list-features">
                            {product.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
              ))}
            </div>

            {/* Pagination */}
              <nav>
                <ul className="pagination">
                  <li className="page-item">
                    <a className="page-link page-prev" href="#"></a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">1</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link active" href="#">2</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">3</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">4</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">5</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">6</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link page-next" href="#"></a>
                  </li>
                </ul>
              </nav>
            </div>
            
            {/* Sidebar */}
            <Sidebar />
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
              <h3 className="color-white">Subscrible & Get <span className="color-warning">10%</span> Discount</h3>
              <p className="font-lg color-white">Get E-mail updates about our latest shop and <span className="font-lg-bold">special offers.</span></p>
            </div>
            <div className="col-lg-4 col-md-5 col-sm-12">
              <div className="box-form-newsletter mt-15">
                <form className="form-newsletter">
                  <input className="input-newsletter font-xs" value="" placeholder="Your email Address" />
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
