import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../hooks/useCart';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, loading, error, updateCartItem, removeFromCart, refetch } = useCart();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    refetch(); // Refresh cart data on page load
  }, []);

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (err) {
      console.error('Failed to update quantity:', err);
      alert('Failed to update quantity. Please try again.');
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (window.confirm('Are you sure you want to remove this item from cart?')) {
      try {
        await removeFromCart(itemId);
      } catch (err) {
        console.error('Failed to remove item:', err);
        alert('Failed to remove item. Please try again.');
      }
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

  return (
    <>
      <Helmet>
        <title>Shopping Cart - V Cloud Tech</title>
        <meta name="description" content="View your shopping cart and proceed to checkout" />
      </Helmet>

      <main className="main" style={{ paddingTop: '80px', minHeight: '100vh' }}>
        <div className="container">
          <div className="pt-30 pb-50">
            {/* Page Header */}
            <div className="mb-40">
              <h2 className="color-brand-3" style={{ fontSize: '2em', fontWeight: '600' }}>Shopping Cart</h2>
              <p className="color-gray-500">
                <Link to="/" style={{ color: '#666', textDecoration: 'none' }}>Home</Link>
                <span style={{ margin: '0 8px' }}>/</span>
                <span>Cart</span>
              </p>
            </div>

            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading your cart...</p>
              </div>
            )}

            {error && (
              <div className="alert alert-warning" role="alert">
                Error loading cart: {error}
              </div>
            )}

            {!loading && cart?.items?.length === 0 && (
              <div className="text-center py-5">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 20px', opacity: 0.3 }}>
                  <path d="M9 2L7.17 4H4C2.9 4 2 4.9 2 6V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V6C22 4.9 21.1 4 20 4H16.83L15 2H9ZM4 6H20V19H4V6ZM12 7C9.24 7 7 9.24 7 12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12C17 9.24 14.76 7 12 7Z" fill="currentColor" />
                </svg>
                <h4 className="color-brand-3 mb-20">Your cart is empty</h4>
                <p className="mb-30 color-gray-500">Add some products to get started!</p>
                <Link to="/shop" className="btn btn-buy" style={{ backgroundColor: '#df2020', color: 'white', padding: '12px 30px', borderRadius: '25px', textDecoration: 'none' }}>
                  Continue Shopping
                </Link>
              </div>
            )}

            {!loading && cart?.items?.length > 0 && (
              <div className="row">
                {/* Cart Items */}
                <div className="col-lg-8">
                  <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
                    <h5 className="mb-20" style={{ fontSize: '1.2em', fontWeight: '600', color: '#000' }}>
                      Cart Items ({cart.items.length})
                    </h5>

                    {cart.items.map((item) => (
                      <div 
                        key={item.id || item.productId}
                        style={{
                          display: 'flex',
                          gap: '20px',
                          padding: '20px',
                          borderBottom: '1px solid #f0f0f0',
                          marginBottom: '15px'
                        }}
                      >
                        {/* Product Image */}
                        <div style={{ flexShrink: 0 }}>
                          <img
                            src={item.image || item.product?.image || '/src/assets/imgs/page/product/img-gallery-1.jpg'}
                            alt={item.name || item.product?.name || 'Product'}
                            style={{
                              width: '100px',
                              height: '100px',
                              objectFit: 'contain',
                              borderRadius: '8px',
                              border: '1px solid #e0e0e0'
                            }}
                            onError={(e) => { e.target.src = '/src/assets/imgs/page/product/img-gallery-1.jpg' }}
                          />
                        </div>

                        {/* Product Details */}
                        <div style={{ flex: 1 }}>
                          <h6 style={{ fontSize: '1em', fontWeight: '600', marginBottom: '8px', color: '#000' }}>
                            {item.name || item.product?.name || 'Product'}
                          </h6>
                          <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '10px' }}>
                            SKU: {item.sku || item.product?.sku || 'N/A'}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            {/* Quantity Controls */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                disabled={loading || item.quantity <= 1}
                                style={{
                                  width: '30px',
                                  height: '30px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  backgroundColor: 'white',
                                  cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                                  fontSize: '16px',
                                  fontWeight: 'bold'
                                }}
                              >
                                -
                              </button>
                              <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: '600' }}>
                                {item.quantity || 1}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                disabled={loading}
                                style={{
                                  width: '30px',
                                  height: '30px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  backgroundColor: 'white',
                                  cursor: 'pointer',
                                  fontSize: '16px',
                                  fontWeight: 'bold'
                                }}
                              >
                                +
                              </button>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={loading}
                              style={{
                                color: '#df2020',
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                                textDecoration: 'underline'
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div style={{ textAlign: 'right', minWidth: '100px' }}>
                          <div style={{ fontSize: '1.2em', fontWeight: '700', color: '#df2020' }}>
                            ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                          </div>
                          <div style={{ fontSize: '0.85em', color: '#666', marginTop: '5px' }}>
                            ${(item.price || 0).toFixed(2)} each
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

