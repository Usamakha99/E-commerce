import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Topbar */}
      <div className="topbar" style={{ backgroundColor: '#343d66' }}>
        <div className="container-topbar">
          <div className="menu-topbar-left d-none d-xl-block">
            <ul className="nav-small">
              <li><a className="font-xs" href="#about" style={{ color: 'white' }} onMouseEnter={(e) => e.target.style.color = '#df2020'} onMouseLeave={(e) => e.target.style.color = 'white'}>About Us</a></li>
              <li><a className="font-xs" href="#careers" style={{ color: 'white' }} onMouseEnter={(e) => e.target.style.color = '#df2020'} onMouseLeave={(e) => e.target.style.color = 'white'}>Careers</a></li>
              <li><a className="font-xs" href="#register" style={{ color: 'white' }} onMouseEnter={(e) => e.target.style.color = '#df2020'} onMouseLeave={(e) => e.target.style.color = 'white'}>Open a shop</a></li>
            </ul>
          </div>
          <div className="info-topbar text-center d-none d-xl-block">
            <span className="font-xs" style={{ color: 'white' }}>Free shipping for all orders over</span>
            <span className="font-sm-bold" style={{ color: '#4ade80' }}> $75.00</span>
          </div>
          <div className="menu-topbar-right">
            <span className="font-xs" style={{ color: 'white' }}>Need help? Call Us:</span>
            <span className="font-sm-bold" style={{ color: '#4ade80' }}> + 1800 900</span>
            <div className="dropdown dropdown-language">
              <button className="btn dropdown-toggle" id="dropdownPage" type="button" data-bs-toggle="dropdown" aria-expanded="true" data-bs-display="static">
                <span className="dropdown-right font-xs" style={{ color: 'white' }} onMouseEnter={(e) => e.target.style.color = '#df2020'} onMouseLeave={(e) => e.target.style.color = 'white'}>
                  <img src="/src/assets/imgs/template/en.svg" alt="Ecom" /> English
                </span>
              </button>
              <ul className="dropdown-menu dropdown-menu-light" aria-labelledby="dropdownPage" data-bs-popper="static">
                <li><a className="dropdown-item" href="#"><img src="/src/assets/imgs/template/flag-en.svg" alt="Ecom" /> English</a></li>
                <li><a className="dropdown-item" href="#"><img src="/src/assets/imgs/template/flag-fr.svg" alt="Ecom" /> Français</a></li>
                <li><a className="dropdown-item" href="#"><img src="/src/assets/imgs/template/flag-es.svg" alt="Ecom" /> Español</a></li>
                <li><a className="dropdown-item" href="#"><img src="/src/assets/imgs/template/flag-pt.svg" alt="Ecom" /> Português</a></li>
                <li><a className="dropdown-item" href="#"><img src="/src/assets/imgs/template/flag-cn.svg" alt="Ecom" /> 中国人</a></li>
              </ul>
            </div>
            <div className="dropdown dropdown-language">
              <button className="btn dropdown-toggle" id="dropdownPage2" type="button" data-bs-toggle="dropdown" aria-expanded="true" data-bs-display="static">
                <span className="dropdown-right font-xs" style={{ color: 'white' }} onMouseEnter={(e) => e.target.style.color = '#df2020'} onMouseLeave={(e) => e.target.style.color = 'white'}>USD</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-light dropdown-menu-end" aria-labelledby="dropdownPage2" data-bs-popper="static">
                <li><a className="dropdown-item active" href="#">USD</a></li>
                <li><a className="dropdown-item" href="#">EUR</a></li>
                <li><a className="dropdown-item" href="#">AUD</a></li>
                <li><a className="dropdown-item" href="#">SGP</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="header sticky-bar">
        <div className="container">
          <div className="main-header">
            <div className="header-left">
              <div className="header-logo" style={{marginRight: '20px' ,width: '300px', height: 'auto', maxWidth: '100%'}}>
                <Link className="d-flex" to="/">
                  <img alt="V Cloud" src="/src/assets/V Cloud Logo final-01.svg" style={{}} />
                </Link>
              </div>
              <div className="header-search" style={{marginLeft: '30px'}}>
                <div className="box-header-search">
                  <form className="form-search" method="post" action="#">
                    <div className="box-category">
                      <select className="select-active select2-hidden-accessible">
                        <option>All categories</option>
                        <option value="Computers Accessories">Computers Accessories</option>
                        <option value="Cell Phones">Cell Phones</option>
                        <option value="Gaming Gatgets">Gaming Gatgets</option>
                        <option value="Smart watches">Smart watches</option>
                        <option value="Wired Headphone">Wired Headphone</option>
                        <option value="Mouse &amp; Keyboard">Mouse Keyboard</option>
                        <option value="Headphone">Headphone</option>
                        <option value="Bluetooth devices">Bluetooth devices</option>
                        <option value="Cloud Software">Cloud Software</option>
                      </select>
            </div>
                    <div className="box-keysearch">
                      <input className="form-control font-xs" type="text" value="" placeholder="Search for items" />
                  </div>
                  </form>
                </div>
              </div>
              <div className="header-nav">
                <nav className="nav-main-menu d-none d-xl-block">
                  <ul className="main-menu">
                    {/* <li className="has-children">
                      <Link className="active" to="/">Home</Link>
                      <ul className="sub-menu two-col">
                        <li><Link to="/">Homepage - 1</Link></li>
                        <li><Link to="/">Homepage - 2</Link></li>
                        <li><Link to="/">Homepage - 3</Link></li>
                        <li><Link to="/">Homepage - 4</Link></li>
                        <li><Link to="/">Homepage - 5</Link></li>
                        <li><Link to="/">Homepage - 6</Link></li>
                        <li><Link to="/">Homepage - 7</Link></li>
                        <li><Link to="/">Homepage - 8</Link></li>
                        <li><Link to="/">Homepage - 9</Link></li>
                        <li><Link to="/">Homepage - 10</Link></li>
                      </ul>
                    </li> */}
                    <li className="has-children">
                      <Link to="/shop">Shop</Link>
                      <ul className="sub-menu two-col">
                        <li><Link to="/shop">Shop Grid</Link></li>
                        <li><Link to="/shop">Shop Grid 2</Link></li>
                        <li><Link to="/shop">Shop list - Left sidebar</Link></li>
                        <li><Link to="/shop">Shop list - Right sidebar</Link></li>
                        <li><Link to="/shop">Shop Fullwidth</Link></li>
                        <li><Link to="/product">Single Product</Link></li>
                        <li><Link to="/product">Single Product 2</Link></li>
                        <li><Link to="/product">Single Product 3</Link></li>
                        <li><Link to="/product">Single Product 4</Link></li>
                        <li><Link to="/cart">Shop Cart</Link></li>
                        <li><Link to="/checkout">Shop Checkout</Link></li>
                        <li><Link to="/compare">Shop Compare</Link></li>
                        <li><Link to="/wishlist">Shop Wishlist</Link></li>
                      </ul>
                    </li>
                    <li className="has-children">
                      <a href="/vendors">Vendors</a>
                      <ul className="sub-menu">
                        <li><a href="/vendors">Vendors Listing</a></li>
                        <li><a href="/vendor">Vendor Single</a></li>
                      </ul>
                    </li>
                    <li className="has-children">
                      <a href="#">Pages</a>
                      <ul className="sub-menu">
                        <li><a href="/about">About Us</a></li>
                        <li><a href="/careers">Careers</a></li>
                        <li><a href="/terms">Term and Condition</a></li>
                        <li><a href="/register">Register</a></li>
                        <li><a href="/login">Login</a></li>
                        <li><a href="/404">Error 404</a></li>
                      </ul>
                    </li>
                    <li>
                      <a href="https://blog.vcloudtech.com/">Blog</a>
                    </li>
                  </ul>
                </nav>
                <div className="burger-icon burger-icon-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                  <span className="burger-icon-top"></span>
                  <span className="burger-icon-mid"></span>
                  <span className="burger-icon-bottom"></span>
                </div>
                  </div>
              <div className="header-shop" style={{marginLeft: 'auto'}}>
                <div className="d-inline-block box-dropdown-cart">
                  <span className="font-lg icon-list icon-cart">
                    <span>Cart</span>
                    <span className="number-item font-xs">2</span>
                  </span>
                  <div className="dropdown-cart">
                    <div className="item-cart mb-20">
                      <div className="cart-image">
                        <img src="/src/assets/imgs/page/homepage1/imgsp5.png" alt="Ecom" />
                        </div>
                      <div className="cart-info">
                        <a className="font-sm-bold color-brand-3" href="/product">2022 Apple iMac with Retina 5K Display 8GB RAM, 256GB SSD</a>
                        <p><span className="color-brand-2 font-sm-bold">1 x $2856.4</span></p>
                      </div>
                    </div>
                    <div className="item-cart mb-20">
                      <div className="cart-image">
                        <img src="/src/assets/imgs/page/homepage1/imgsp4.png" alt="Ecom" />
                      </div>
                      <div className="cart-info">
                        <a className="font-sm-bold color-brand-3" href="/product">2022 Apple iMac with Retina 5K Display 8GB RAM, 256GB SSD</a>
                        <p><span className="color-brand-2 font-sm-bold">1 x $2856.4</span></p>
                      </div>
                    </div>
                    <div className="border-bottom pt-0 mb-15"></div>
                    <div className="cart-total">
                      <div className="row">
                        <div className="col-6 text-start">
                          <span className="font-md-bold color-brand-3">Total</span>
                        </div>
                        <div className="col-6">
                          <span className="font-md-bold color-brand-1">$2586.3</span>
                        </div>
                      </div>
                      <div className="row mt-15">
                        <div className="col-6 text-start">
                          <a className="btn btn-cart w-auto" href="/cart">View cart</a>
                        </div>
                        <div className="col-6">
                          <a className="btn btn-buy w-auto" href="/checkout">Checkout</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <div className={`mobile-header-active mobile-header-wrapper-style perfect-scrollbar ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-header-wrapper-inner">
          <div className="mobile-header-content-area">
            <div className="mobile-logo">
              <a className="d-flex" href="/">
                <img alt="V Cloud" src="/src/assets/V Cloud Logo final-01.svg" style={{width: '280px', height: 'auto', maxWidth: '100%'}} />
              </a>
            </div>
            <div className="perfect-scroll">
              <div className="mobile-menu-wrap mobile-header-border">
                <nav className="mt-15">
                  <ul className="mobile-menu font-heading">
                    <li className="has-children">
                      <a className="active" href="/">Home</a>
                      <ul className="sub-menu">
                        <li><a href="/">Homepage - 1</a></li>
                        <li><a href="/">Homepage - 2</a></li>
                        <li><a href="/">Homepage - 3</a></li>
                        <li><a href="/">Homepage - 4</a></li>
                        <li><a href="/">Homepage - 5</a></li>
                        <li><a href="/">Homepage - 6</a></li>
                        <li><a href="/">Homepage - 7</a></li>
                        <li><a href="/">Homepage - 8</a></li>
                        <li><a href="/">Homepage - 9</a></li>
                        <li><a href="/">Homepage - 10</a></li>
                      </ul>
                    </li>
                    <li className="has-children">
                      <a href="/shop">Shop</a>
                      <ul className="sub-menu">
                        <li><a href="/shop">Shop Grid</a></li>
                        <li><a href="/shop">Shop Grid 2</a></li>
                        <li><a href="/shop">Shop List</a></li>
                        <li><a href="/shop">Shop List 2</a></li>
                        <li><a href="/shop">Shop Fullwidth</a></li>
                        <li><a href="/product">Single Product</a></li>
                        <li><a href="/product">Single Product 2</a></li>
                        <li><a href="/product">Single Product 3</a></li>
                        <li><a href="/product">Single Product 4</a></li>
                        <li><a href="/cart">Shop Cart</a></li>
                        <li><a href="/checkout">Shop Checkout</a></li>
                        <li><a href="/compare">Shop Compare</a></li>
                        <li><a href="/wishlist">Shop Wishlist</a></li>
                      </ul>
                    </li>
                    <li className="has-children">
                      <a href="/vendors">Vendors</a>
                      <ul className="sub-menu">
                        <li><a href="/vendors">Vendors Listing</a></li>
                        <li><a href="/vendor">Vendor Single</a></li>
                      </ul>
                    </li>
                    <li className="has-children">
                      <a href="#">Pages</a>
                      <ul className="sub-menu">
                        <li><a href="/about">About Us</a></li>
                        <li><a href="/careers">Careers</a></li>
                        <li><a href="/terms">Term and Condition</a></li>
                        <li><a href="/register">Register</a></li>
                        <li><a href="/login">Login</a></li>
                        <li><a href="/404">Error 404</a></li>
                      </ul>
                    </li>
                    <li>
                      <a href="/blog">Blog</a>
                    </li>
                  </ul>
                </nav>
              </div>
              <div className="mobile-account">
                <div className="mobile-header-top">
                  <div className="user-account">
                    <a href="/account">
                      <img src="/src/assets/imgs/template/ava_1.png" alt="Ecom" />
                    </a>
                    <div className="content">
                      <h6 className="user-name">Hello<span className="text-brand"> Steven !</span></h6>
                      <p className="font-xs text-muted">You have 3 new messages</p>
                    </div>
                  </div>
                </div>
                <ul className="mobile-menu">
                  <li><a href="/account">My Account</a></li>
                  <li><a href="/orders">Order Tracking</a></li>
                  <li><a href="/orders">My Orders</a></li>
                  <li><a href="/wishlist">My Wishlist</a></li>
                  <li><a href="/settings">Setting</a></li>
                  <li><a href="/login">Sign out</a></li>
                </ul>
              </div>
              <div className="mobile-banner">
                <div className="bg-5 block-iphone">
                  <span className="color-brand-3 font-sm-lh32">Starting from $899</span>
                  <h3 className="font-xl mb-10">iPhone 12 Pro 128Gb</h3>
                  <p className="font-base color-brand-3 mb-10">Special Sale</p>
                  <a className="btn btn-arrow" href="/shop">learn more</a>
                </div>
              </div>
              <div className="site-copyright color-gray-400 mt-30">
                Copyright 2022 &copy; Ecom - Marketplace Template.<br />
                Designed by<a href="http://alithemes.com" target="_blank" rel="noopener noreferrer">&nbsp; AliThemes</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;