import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { STRIPE_CONFIG } from '../config/stripe.config';
import paymentService from '../services/payment.service';

// Load Stripe
const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);

// Checkout Form Component
const CheckoutForm = ({ clientSecret, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message);
        setIsProcessing(false);
        onError(error);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
        navigate('/payment-success?payment_intent=' + paymentIntent.id);
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred.');
      setIsProcessing(false);
      onError(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
      <PaymentElement />
      
      {errorMessage && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#fff0f0',
          border: '1px solid #ffcdd2',
          borderRadius: '8px',
          color: '#c62828',
          fontSize: '14px'
        }}>
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        style={{
          width: '100%',
          marginTop: '30px',
          padding: '16px',
          background: isProcessing ? '#ccc' : 'linear-gradient(135deg, #df2020 0%, #111A45 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontSize: '16px',
          fontWeight: '700',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: isProcessing ? 'none' : '0 4px 15px rgba(223, 32, 32, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}
        onMouseEnter={(e) => {
          if (!isProcessing) {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(223, 32, 32, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isProcessing) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(223, 32, 32, 0.3)';
          }
        }}
      >
        {isProcessing ? (
          <>
            <div style={{
              width: '20px',
              height: '20px',
              border: '3px solid white',
              borderTop: '3px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            Processing...
          </>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="white"/>
            </svg>
            Pay Now
          </>
        )}
      </button>

      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </form>
  );
};

// Main Checkout Component
const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect if cart is empty
    if (!cart?.items?.length) {
      navigate('/cart');
      return;
    }

    // Create payment intent
    const createPaymentIntent = async () => {
      try {
        setLoading(true);
        const response = await paymentService.createPaymentIntent({
          amount: Math.round(cartTotal * 100), // Convert to cents
          currency: 'usd',
          items: cart.items.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          metadata: {
            orderId: `ORDER-${Date.now()}`,
          },
        });

        setClientSecret(response.clientSecret);
        setLoading(false);
      } catch (err) {
        console.error('Error creating payment intent:', err);
        setError('Failed to initialize checkout. Please try again.');
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [cart, cartTotal, navigate]);

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      // Create order after successful payment
      await paymentService.createOrder({
        paymentIntentId: paymentIntent.id,
        items: cart.items,
        total: cartTotal,
        status: 'completed',
      });

      // Clear cart
      await clearCart();
    } catch (err) {
      console.error('Error creating order:', err);
    }
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #df2020',
            borderRadius: '50%',
            margin: '0 auto 20px',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ color: '#666', fontSize: '16px' }}>Initializing secure checkout...</p>
        </div>
        <style>
          {`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          maxWidth: '500px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 20px',
            background: '#fff0f0',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#df2020">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
          <h3 style={{ color: '#111A45', marginBottom: '10px' }}>Checkout Error</h3>
          <p style={{ color: '#666', marginBottom: '30px' }}>{error}</p>
          <button
            onClick={() => navigate('/cart')}
            style={{
              padding: '12px 30px',
              background: '#df2020',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#c41a1a';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#df2020';
            }}
          >
            Return to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '60px 20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h1 style={{
            fontSize: '2.5em',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #111A45 0%, #df2020 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '10px'
          }}>
            Secure Checkout
          </h1>
          <p style={{ color: '#666', fontSize: '15px' }}>
            Complete your purchase securely with Stripe
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: '30px',
          alignItems: 'start'
        }}>
          {/* Payment Form */}
          <div style={{
            background: 'white',
            padding: '35px',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '25px',
              paddingBottom: '20px',
              borderBottom: '2px solid #f0f0f0'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #df2020 0%, #ff6b6b 100%)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(223, 32, 32, 0.25)'
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                </svg>
              </div>
              <div>
                <h3 style={{
                  margin: 0,
                  fontSize: '1.3em',
                  fontWeight: '700',
                  color: '#111A45'
                }}>
                  Payment Information
                </h3>
                <p style={{
                  margin: '3px 0 0 0',
                  fontSize: '13px',
                  color: '#999'
                }}>
                  Your payment is secured with Stripe
                </p>
              </div>
            </div>

            {clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret, ...STRIPE_CONFIG.options }}>
                <CheckoutForm
                  clientSecret={clientSecret}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </Elements>
            )}

            {/* Security Badges */}
            <div style={{
              marginTop: '30px',
              paddingTop: '25px',
              borderTop: '1px solid #f0f0f0',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              color: '#999',
              fontSize: '13px'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#4caf50">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
              </svg>
              <span>SSL Secured • PCI DSS Compliant • 256-bit Encryption</span>
            </div>
          </div>

          {/* Order Summary */}
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
            position: 'sticky',
            top: '20px'
          }}>
            <h4 style={{
              margin: '0 0 20px 0',
              fontSize: '1.2em',
              fontWeight: '700',
              color: '#111A45'
            }}>
              Order Summary
            </h4>

            {/* Cart Items */}
            <div style={{
              maxHeight: '300px',
              overflowY: 'auto',
              marginBottom: '20px'
            }}>
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '15px',
                    paddingBottom: '15px',
                    borderBottom: '1px solid #f5f5f5'
                  }}
                >
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'white',
                    border: '1px solid #e9ecef',
                    borderRadius: '8px',
                    padding: '5px',
                    flexShrink: 0
                  }}>
                    <img
                      src={item.image || '/src/assets/imgs/page/product/img-gallery-1.jpg'}
                      alt={item.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h6 style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#111A45',
                      marginBottom: '5px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {item.name}
                    </h6>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '12px', color: '#999' }}>
                        Qty: {item.quantity}
                      </span>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#df2020'
                      }}>
                        ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div style={{
              paddingTop: '20px',
              borderTop: '2px solid #f0f0f0'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <span style={{ fontSize: '14px', color: '#666' }}>Subtotal</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#111A45' }}>
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <span style={{ fontSize: '14px', color: '#666' }}>Shipping</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#4caf50' }}>
                  FREE
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '15px',
                paddingTop: '15px',
                borderTop: '2px solid #f0f0f0'
              }}>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#111A45' }}>
                  Total
                </span>
                <span style={{
                  fontSize: '22px',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #df2020 0%, #111A45 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Cart Link */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            onClick={() => navigate('/cart')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#df2020',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            ← Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

