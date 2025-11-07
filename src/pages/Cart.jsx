import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, loading, error, updateCartItem, removeFromCart, refetch } = useCart();
  const [removingItem, setRemovingItem] = useState(null);
  const [updatingItem, setUpdatingItem] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    refetch(); // Refresh cart data on page load
  }, []);

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdatingItem(itemId);
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (err) {
      console.error('Failed to update quantity:', err);
      alert('Failed to update quantity. Please try again.');
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    setRemovingItem(itemId);
    try {
      await removeFromCart(itemId);
    } catch (err) {
      console.error('Failed to remove item:', err);
      alert('Failed to remove item. Please try again.');
      setRemovingItem(null);
    }
  };

  const handleCheckout = () => {
    if (cart?.items?.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    // Navigate to checkout page
    navigate('/checkout');
  };

  // Calculate total
  const subtotal = cart?.items?.reduce((total, item) => {
    return total + (item.price || 0) * (item.quantity || 1);
  }, 0) || 0;

  const tax = subtotal * 0.1; // 10% tax
  const shipping = cart?.items?.length > 0 ? 10 : 0; // $10 flat shipping
  const total = subtotal + tax + shipping;
  
  const savings = cart?.items?.reduce((total, item) => {
    return total + ((item.originalPrice || item.price) - item.price) * item.quantity;
  }, 0) || 0;

  return (
    <>
      <Helmet>
        <title>Shopping Cart - V Cloud Tech</title>
        <meta name="description" content="View your shopping cart and proceed to checkout" />
      </Helmet>

      <main className="main" style={{ 
        paddingTop: '80px', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)'
      }}>
        <div className="container">
          <div className="pt-30 pb-50">
            {/* Modern Page Header */}
            <div style={{ 
              marginBottom: '40px',
              background: 'linear-gradient(135deg, #df2020 0%, #1c1463 100%)',
              borderRadius: '20px',
              padding: '30px 40px',
              boxShadow: '0 10px 30px rgba(223, 32, 32, 0.3)',
              color: 'white'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" 
                    fill="white"/>
                </svg>
                <h2 style={{ fontSize: '2.2em', fontWeight: '700', margin: 0 }}>My Shopping Cart</h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', opacity: 0.9 }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
                <span>›</span>
                <Link to="/shop" style={{ color: 'white', textDecoration: 'none' }}>Shop</Link>
                <span>›</span>
                <span style={{ fontWeight: '600' }}>Cart</span>
                {cart?.items?.length > 0 && (
                  <span style={{
                    marginLeft: '15px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {cart.items.length} {cart.items.length === 1 ? 'Item' : 'Items'}
                  </span>
                )}
              </div>
            </div>

            {loading && (
              <div style={{
                textAlign: 'center',
                padding: '80px 20px',
                background: 'white',
                borderRadius: '20px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #df2020',
                  borderRadius: '50%',
                  margin: '0 auto 30px',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <p style={{ fontSize: '18px', fontWeight: '500', color: '#df2020' }}>Loading your amazing cart...</p>
                <style>
                  {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
                </style>
              </div>
            )}

            {error && (
              <div style={{
                background: 'linear-gradient(135deg, #FFE5E5 0%, #FFD1D1 100%)',
                border: '2px solid #ff4444',
                borderRadius: '15px',
                padding: '25px 30px',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                boxShadow: '0 8px 25px rgba(255, 68, 68, 0.15)'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#ff4444"/>
                </svg>
                <div>
                  <p style={{ margin: 0, fontWeight: '600', color: '#ff4444' }}>Oops! Something went wrong</p>
                  <p style={{ margin: 0, fontSize: '14px', color: '#666', marginTop: '5px' }}>{error}</p>
                </div>
              </div>
            )}

            {!loading && cart?.items?.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '80px 20px',
                background: 'white',
                borderRadius: '20px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
              }}>
                <div style={{
                  width: '180px',
                  height: '180px',
                  margin: '0 auto 30px',
                  background: 'linear-gradient(135deg, #df2020 0%, #1c1463 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 15px 35px rgba(223, 32, 32, 0.3)',
                  position: 'relative',
                  animation: 'float 3s ease-in-out infinite'
                }}>
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" 
                      fill="white"/>
                  </svg>
                </div>
                <h4 style={{ fontSize: '28px', fontWeight: '700', color: '#111A45', marginBottom: '15px' }}>
                  Your Cart is Empty
                </h4>
                <p style={{ fontSize: '16px', color: '#666', marginBottom: '35px', maxWidth: '400px', margin: '0 auto 35px' }}>
                  Looks like you haven't added anything yet. Start shopping to fill your cart!
                </p>
                <Link 
                  to="/shop" 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'linear-gradient(135deg, #df2020 0%, #1c1463 100%)',
                    color: 'white',
                    padding: '15px 35px',
                    borderRadius: '50px',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    boxShadow: '0 10px 30px rgba(223, 32, 32, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 15px 40px rgba(223, 32, 32, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 10px 30px rgba(223, 32, 32, 0.3)';
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 12H5M5 12L12 5M5 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Start Shopping
                </Link>
                <style>
                  {`@keyframes float { 
                    0%, 100% { transform: translateY(0px); } 
                    50% { transform: translateY(-20px); } 
                  }`}
                </style>
              </div>
            )}

            {!loading && cart?.items?.length > 0 && (
              <div className="row">
                {/* Cart Items */}
                <div className="col-lg-8">
                  <div style={{ 
                    background: 'white', 
                    borderRadius: '20px', 
                    padding: '30px', 
                    marginBottom: '20px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '25px',
                      paddingBottom: '20px',
                      borderBottom: '2px solid #f0f0f0'
                    }}>
                      <h5 style={{ 
                        fontSize: '1.5em', 
                        fontWeight: '700', 
                        color: '#111A45',
                        margin: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <span style={{
                          width: '8px',
                          height: '8px',
                          background: 'linear-gradient(135deg, #df2020 0%, #1c1463 100%)',
                          borderRadius: '50%',
                          display: 'inline-block'
                        }}></span>
                        Your Items
                      </h5>
                      <span style={{
                        backgroundColor: '#df2020',
                        color: 'white',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        {cart.items.length} {cart.items.length === 1 ? 'Item' : 'Items'}
                      </span>
                    </div>

                    {cart.items.map((item, index) => (
                      <div 
                        key={item.id || item.productId}
                        style={{
                          display: 'flex',
                          gap: '20px',
                          padding: '25px',
                          borderRadius: '15px',
                          marginBottom: '15px',
                          background: 'linear-gradient(135deg, #fafbfd 0%, #f5f7fa 100%)',
                          border: '1px solid #e8ecf1',
                          transition: 'all 0.3s ease',
                          opacity: removingItem === item.id ? 0.5 : 1,
                          transform: removingItem === item.id ? 'scale(0.95)' : 'scale(1)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        {/* Product Image */}
                        <div style={{ 
                          flexShrink: 0,
                          position: 'relative',
                          background: 'white',
                          borderRadius: '12px',
                          padding: '10px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                        }}>
                          <img
                            src={item.image || item.product?.image || '/src/assets/imgs/page/product/img-gallery-1.jpg'}
                            alt={item.name || item.product?.name || 'Product'}
                            style={{
                              width: '110px',
                              height: '110px',
                              objectFit: 'contain',
                              borderRadius: '8px'
                            }}
                            onError={(e) => { e.target.src = '/src/assets/imgs/page/product/img-gallery-1.jpg' }}
                          />
                          {/* Item number badge */}
                          <div style={{
                            position: 'absolute',
                            top: '-5px',
                            left: '-5px',
                            background: 'linear-gradient(135deg, #df2020 0%, #1c1463 100%)',
                            color: 'white',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            boxShadow: '0 2px 8px rgba(223, 32, 32, 0.4)'
                          }}>
                            {index + 1}
                          </div>
                        </div>

                        {/* Product Details */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <h6 style={{ 
                              fontSize: '1.1em', 
                              fontWeight: '600', 
                              marginBottom: '8px', 
                              color: '#111A45',
                              lineHeight: '1.4'
                            }}>
                              {item.name || item.product?.name || 'Product'}
                            </h6>
                            <div style={{ display: 'flex', gap: '15px', marginBottom: '12px' }}>
                              <p style={{ fontSize: '0.85em', color: '#666', margin: 0 }}>
                                <span style={{ fontWeight: '600' }}>SKU:</span> {item.sku || item.product?.sku || 'N/A'}
                              </p>
                              {item.brand && (
                                <p style={{ fontSize: '0.85em', color: '#666', margin: 0 }}>
                                  <span style={{ fontWeight: '600' }}>Brand:</span> {item.brand}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                            {/* Quantity Controls */}
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0',
                              background: 'white',
                              borderRadius: '10px',
                              border: '2px solid #e0e0e0',
                              overflow: 'hidden'
                            }}>
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                disabled={updatingItem === item.id || item.quantity <= 1}
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  border: 'none',
                                  background: item.quantity <= 1 ? '#f5f5f5' : 'linear-gradient(135deg, #df2020 0%, #1c1463 100%)',
                                  color: item.quantity <= 1 ? '#ccc' : 'white',
                                  cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                                  fontSize: '18px',
                                  fontWeight: 'bold',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                −
                              </button>
                              <span style={{ 
                                minWidth: '45px', 
                                textAlign: 'center', 
                                fontWeight: '700',
                                fontSize: '16px',
                                color: '#111A45'
                              }}>
                                {updatingItem === item.id ? '...' : item.quantity || 1}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                disabled={updatingItem === item.id}
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  border: 'none',
                                  background: 'linear-gradient(135deg, #df2020 0%, #1c1463 100%)',
                                  color: 'white',
                                  cursor: 'pointer',
                                  fontSize: '18px',
                                  fontWeight: 'bold',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.background = 'linear-gradient(135deg, #1c1463 0%, #df2020 100%)';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.background = 'linear-gradient(135deg, #df2020 0%, #1c1463 100%)';
                                }}
                              >
                                +
                              </button>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={removingItem === item.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                color: '#ff4444',
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '600',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#fff0f0';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                              }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="currentColor"/>
                              </svg>
                              {removingItem === item.id ? 'Removing...' : 'Remove'}
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div style={{ 
                          textAlign: 'right', 
                          minWidth: '130px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'flex-end'
                        }}>
                          <div style={{
                            background: 'linear-gradient(135deg, rgba(223, 32, 32, 0.08) 0%, rgba(28, 20, 99, 0.08) 100%)',
                            padding: '12px 18px',
                            borderRadius: '12px',
                            textAlign: 'center',
                            minWidth: '110px'
                          }}>
                            <div style={{ 
                              fontSize: '1.3em', 
                              fontWeight: '700', 
                              background: 'linear-gradient(135deg, #df2020 0%, #1c1463 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text',
                              lineHeight: '1.3'
                            }}>
                              ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                            </div>
                            <div style={{ 
                              fontSize: '0.7em', 
                              color: '#666', 
                              marginTop: '4px',
                              fontWeight: '500'
                            }}>
                              ${(item.price || 0).toFixed(2)} × {item.quantity}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Continue Shopping */}
                    <div className="mt-30">
                      <Link 
                        to="/shop" 
                        style={{
                          color: '#111A45',
                          textDecoration: 'none',
                          fontSize: '14px',
                          fontWeight: '600',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Continue Shopping
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="col-lg-4">
                  <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '25px',
                    border: '1px solid #e0e0e0',
                    position: 'sticky',
                    top: '100px'
                  }}>
                    <h5 className="mb-25" style={{ fontSize: '1.2em', fontWeight: '600', color: '#000' }}>
                      Order Summary
                    </h5>

                    <div style={{ marginBottom: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ color: '#666' }}>Subtotal:</span>
                        <span style={{ fontWeight: '600', color: '#000' }}>${subtotal.toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ color: '#666' }}>Tax (10%):</span>
                        <span style={{ fontWeight: '600', color: '#000' }}>${tax.toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ color: '#666' }}>Shipping:</span>
                        <span style={{ fontWeight: '600', color: '#000' }}>${shipping.toFixed(2)}</span>
                      </div>
                      <div style={{ borderTop: '2px solid #e0e0e0', marginTop: '15px', paddingTop: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em' }}>
                          <span style={{ fontWeight: '700', color: '#000' }}>Total:</span>
                          <span style={{ fontWeight: '700', color: '#df2020' }}>${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleCheckout}
                      disabled={loading}
                      style={{
                        width: '100%',
                        backgroundColor: '#df2020',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        padding: '15px 30px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginTop: '20px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#c41a1a';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(223, 32, 32, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#df2020';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      {loading ? 'Processing...' : 'Proceed to Checkout'}
                    </button>

                    {/* Security Badge */}
                    <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '8px', color: '#10b981' }}>
                        <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        Secure checkout powered by V Cloud Tech
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Cart;

