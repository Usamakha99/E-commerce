import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="card-grid-style-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Discount Badge */}
      {product.discount && (
        <span className="label">
          -{product.discount}%
        </span>
      )}

      {/* Action Buttons */}
      <div className={`tools ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <button className="btn-tooltip" title="Trend">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </button>
        <button className="btn-tooltip" title="Add to Wishlist">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        <button className="btn-tooltip" title="Compare">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>
        <button className="btn-tooltip" title="Quick View">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </div>

      {/* Product Image */}
      <div className="image-box">
        <Link to="/product">
          <img 
            src={product.image} 
            alt={product.name}
          />
        </Link>
      </div>

      {/* Product Info */}
      <div className="info-right">
        {/* Brand */}
        <div className="font-xs color-gray-500">{product.brand}</div>
        
        {/* Product Name */}
        <h3 className="font-sm color-gray-1000">
          <Link to="/product">{product.name}</Link>
        </h3>

        

        {/* Price */}
        <div className="price-info">
          <span className="price-main">${product.price}</span>
          {product.originalPrice && (
            <span className="price-line">${product.originalPrice}</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <div className="box-btn-cart">
          <button className="btn btn-cart">Add To Cart</button>
        </div>

        {/* Features List */}
        <ul className="list-features">
          {product.features?.slice(0, 3).map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductCard;
