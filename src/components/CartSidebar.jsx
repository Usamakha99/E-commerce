import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCart();

  // Calculate cart totals
  const cartItemCount = cart?.items?.length || 0;
  const cartTotal = cart?.items?.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0) || 0;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
          animation: 'fadeIn 0.3s ease'
        }}
      />

      {/* Cart Sidebar */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '25%',
        minWidth: '380px',
        maxWidth: '450px',
        height: '100vh',
        backgroundColor: 'white',
        zIndex: 9999,
        boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInRight 0.3s ease'
      }}>
        {/* Header */}
        <div style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          padding: '18px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e9ecef',
          overflow: 'hidden'
        }}>
          {/* Decorative corner accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, rgba(223, 32, 32, 0.08) 0%, transparent 100%)',
            borderRadius: '0 0 100% 0'
          }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 1 }}>
            <div style={{
              position: 'relative',
              width: '42px',
              height: '42px',
              background: 'linear-gradient(135deg, #df2020 0%, #ff6b6b 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(223, 32, 32, 0.25)',
              animation: 'float 3s ease-in-out infinite',
              transform: 'rotate(-5deg)'
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(5deg)' }}>
                <path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" 
                  fill="white"/>
              </svg>
              {cartItemCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: 'linear-gradient(135deg, #111A45 0%, #2d3561 100%)',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '3px 7px',
                  fontSize: '11px',
                  fontWeight: '700',
                  minWidth: '22px',
                  textAlign: 'center',
                  border: '3px solid white',
                  boxShadow: '0 3px 8px rgba(17, 26, 69, 0.3)',
                  animation: 'pulse 2s ease-in-out infinite'
                }}>
                  {cartItemCount}
                </span>
              )}
            </div>
            <div>
              <h4 style={{ 
                margin: 0, 
                fontSize: '1.1em', 
                fontWeight: '800', 
                background: 'linear-gradient(135deg, #111A45 0%, #df2020 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: '1.2',
                letterSpacing: '-0.3px'
              }}>
                My Cart
              </h4>
              <p style={{ 
                margin: '3px 0 0 0', 
                fontSize: '0.75em', 
                color: '#6c757d',
                fontWeight: '500'
              }}>
                {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} • ${cartTotal.toFixed(2)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="cart-close-btn"
            style={{
              position: 'relative',
              background: 'white',
              border: '2px solid #e9ecef',
              color: '#6c757d',
              fontSize: '18px',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              fontWeight: '400',
              zIndex: 1
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #df2020 0%, #ff6b6b 100%)';
              e.target.style.color = 'white';
              e.target.style.borderColor = '#df2020';
              e.target.style.transform = 'rotate(90deg) scale(1.1)';
              e.target.style.boxShadow = '0 4px 12px rgba(223, 32, 32, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'white';
              e.target.style.color = '#6c757d';
              e.target.style.borderColor = '#e9ecef';
              e.target.style.transform = 'rotate(0deg) scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            ×
          </button>
        </div>

        {/* Cart Items - Scrollable */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0'
        }}>
          {cart?.items?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 30px' }}>
              <div style={{
                width: '100px',
                height: '100px',
                margin: '0 auto 20px',
                background: '#f8f9fa',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" 
                    fill="#ccc"/>
                </svg>
              </div>
              <h5 style={{ color: '#111A45', fontSize: '1.1em', fontWeight: '600', marginBottom: '8px' }}>Your cart is empty</h5>
              <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>Add items to get started</p>
              <Link 
                to="/shop"
                onClick={onClose}
                style={{
                  display: 'inline-block',
                  padding: '12px 30px',
                  background: '#df2020',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#c41a1a';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#df2020';
                }}
              >
                Browse Products
              </Link>
            </div>
          ) : (
            cart.items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '15px',
                  padding: '20px 25px',
                  borderBottom: '1px solid #f0f0f0',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fafbfd';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                }}
              >
                {/* Product Image */}
                <div style={{ 
                  flexShrink: 0,
                  background: 'white',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  padding: '8px',
                  width: '80px',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img
                    src={item.image || '/src/assets/imgs/page/product/img-gallery-1.jpg'}
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                    onError={(e) => { e.target.src = '/src/assets/imgs/page/product/img-gallery-1.jpg' }}
                  />
                </div>

                {/* Product Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h6 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#111A45',
                    marginBottom: '6px',
                    lineHeight: '1.4',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {item.name}
                  </h6>
                  <div style={{
                    fontSize: '13px',
                    color: '#999',
                    marginBottom: '10px'
                  }}>
                    Qty: <span style={{ fontWeight: '600', color: '#666' }}>{item.quantity}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '17px',
                      fontWeight: '700',
                      color: '#df2020'
                    }}>
                      ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </span>
                    <button
                      onClick={async () => {
                        try {
                          await removeFromCart(item.id);
                        } catch (err) {
                          console.error('Failed to remove:', err);
                        }
                      }}
                      style={{
                        background: '#fff0f0',
                        border: '1px solid #ffe0e0',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        padding: '6px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#df2020';
                        e.currentTarget.style.borderColor = '#df2020';
                        e.currentTarget.querySelector('svg').style.fill = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fff0f0';
                        e.currentTarget.style.borderColor = '#ffe0e0';
                        e.currentTarget.querySelector('svg').style.fill = '#df2020';
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#df2020" xmlns="http://www.w3.org/2000/svg" style={{ transition: 'fill 0.2s ease' }}>
                        <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM8 9H16V19H8V9ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5Z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer - Total & Checkout */}
        {cart?.items?.length > 0 && (
          <div style={{
            borderTop: '1px solid #e8e8e8',
            padding: '15px 20px',
            background: 'white',
            boxShadow: '0 -3px 10px rgba(0,0,0,0.03)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#666' }}>Subtotal</span>
              <span style={{ fontSize: '20px', fontWeight: '700', color: '#111A45' }}>${cartTotal.toFixed(2)}</span>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link
                to="/cart"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'white',
                  color: '#111A45',
                  textAlign: 'center',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: '2px solid #111A45',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#111A45';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.color = '#111A45';
                }}
              >
                View Cart
              </Link>
              
              <button
                onClick={() => {
                  onClose();
                  navigate('/checkout');
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#df2020',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#c41a1a';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#df2020';
                }}
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Animation Styles */}
      <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes float {
            0%, 100% {
              transform: rotate(-5deg) translateY(0px);
            }
            50% {
              transform: rotate(-5deg) translateY(-5px);
            }
          }
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
          }
        `}
      </style>
    </>
  );
};

export default CartSidebar;

