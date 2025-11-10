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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      padding: '80px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0
      }}>
        {/* Floating Circles */}
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          top: '-200px',
          right: '-100px',
          animation: 'float 20s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          bottom: '-150px',
          left: '-80px',
          animation: 'float 15s ease-in-out infinite reverse'
        }} />
        <div style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(223, 32, 32, 0.15)',
          top: '50%',
          right: '10%',
          animation: 'pulse 8s ease-in-out infinite'
        }} />
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header with Animation */}
        <div style={{
          textAlign: 'center',
          marginBottom: '50px',
          animation: 'fadeInDown 0.8s ease'
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            borderRadius: '50px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            marginBottom: '20px',
            animation: 'slideInFromTop 1s ease'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
            <span style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>
              🔒 Secure Payment Gateway
            </span>
          </div>

          <h1 style={{
            fontSize: '3.2em',
            fontWeight: '900',
            color: 'white',
            marginBottom: '15px',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            letterSpacing: '-1px'
          }}>
            Complete Your Order
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '18px',
            fontWeight: '400',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            You're just one step away from your amazing products! 🎉
          </p>

          {/* Progress Steps */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '15px',
            marginTop: '40px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'rgba(76, 175, 80, 0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: '30px',
              border: '2px solid rgba(76, 175, 80, 0.4)'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#4caf50">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
              </svg>
              <span style={{ color: '#4caf50', fontSize: '13px', fontWeight: '600' }}>Cart</span>
            </div>
            <div style={{ width: '40px', height: '2px', background: 'rgba(255,255,255,0.3)' }} />
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(10px)',
              borderRadius: '30px',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 4px 15px rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'white',
                animation: 'pulse 2s ease-in-out infinite'
              }} />
              <span style={{ color: 'white', fontSize: '13px', fontWeight: '700' }}>Payment</span>
            </div>
            <div style={{ width: '40px', height: '2px', background: 'rgba(255,255,255,0.3)' }} />
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '30px',
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }}>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '600' }}>Confirmation</span>
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 420px',
          gap: '35px',
          alignItems: 'start'
        }}>
          {/* Payment Form */}
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '24px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            animation: 'slideInLeft 0.8s ease',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative Corner */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '150px',
              height: '150px',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, transparent 100%)',
              borderRadius: '0 0 0 100%'
            }} />

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '30px',
              paddingBottom: '25px',
              borderBottom: '3px solid #f0f0f0',
              position: 'relative'
            }}>
              <div style={{
                width: '55px',
                height: '55px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
                animation: 'scaleIn 0.6s ease',
                position: 'relative'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                  <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                </svg>
                {/* Sparkle Effect */}
                <div style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  width: '12px',
                  height: '12px',
                  background: '#ffd700',
                  borderRadius: '50%',
                  boxShadow: '0 0 10px #ffd700',
                  animation: 'pulse 2s ease-in-out infinite'
                }} />
              </div>
              <div>
                <h3 style={{
                  margin: 0,
                  fontSize: '1.5em',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Payment Details
                </h3>
                <p style={{
                  margin: '5px 0 0 0',
                  fontSize: '14px',
                  color: '#999',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#4caf50">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                  </svg>
                  Secured by Stripe • PCI DSS Compliant
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

            {/* Trust Badges */}
            <div style={{
              marginTop: '35px',
              paddingTop: '30px',
              borderTop: '2px solid #f5f5f5'
            }}>
              {/* Security Features */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '15px',
                marginBottom: '20px'
              }}>
                <div style={{
                  textAlign: 'center',
                  padding: '15px',
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                  borderRadius: '12px',
                  border: '1px solid #bae6fd'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#0284c7" style={{ margin: '0 auto 8px' }}>
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                  </svg>
                  <p style={{ margin: 0, fontSize: '11px', fontWeight: '600', color: '#0284c7' }}>
                    SSL Secure
                  </p>
                </div>
                <div style={{
                  textAlign: 'center',
                  padding: '15px',
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                  borderRadius: '12px',
                  border: '1px solid #bbf7d0'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#16a34a" style={{ margin: '0 auto 8px' }}>
                    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                  </svg>
                  <p style={{ margin: 0, fontSize: '11px', fontWeight: '600', color: '#16a34a' }}>
                    Verified
                  </p>
                </div>
                <div style={{
                  textAlign: 'center',
                  padding: '15px',
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                  borderRadius: '12px',
                  border: '1px solid #fde047'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#ca8a04" style={{ margin: '0 auto 8px' }}>
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                  <p style={{ margin: 0, fontSize: '11px', fontWeight: '600', color: '#ca8a04' }}>
                    Trusted
                  </p>
                </div>
              </div>

              {/* Payment Methods */}
              <div style={{
                textAlign: 'center',
                padding: '15px',
                background: '#fafafa',
                borderRadius: '10px'
              }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#999', fontWeight: '600' }}>
                  WE ACCEPT
                </p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '15px',
                  flexWrap: 'wrap'
                }}>
                  {['VISA', 'Mastercard', 'AMEX', 'Discover', 'Apple Pay', 'Google Pay'].map((card) => (
                    <div key={card} style={{
                      padding: '6px 12px',
                      background: 'white',
                      borderRadius: '6px',
                      border: '1px solid #e0e0e0',
                      fontSize: '10px',
                      fontWeight: '700',
                      color: '#666'
                    }}>
                      {card}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div style={{
            background: 'white',
            padding: '35px',
            borderRadius: '24px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            position: 'sticky',
            top: '20px',
            animation: 'slideInRight 0.8s ease',
            border: '2px solid #f0f0f0'
          }}>
            {/* Header with Icon */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '25px',
              paddingBottom: '20px',
              borderBottom: '3px solid #f5f5f5'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '45px',
                  height: '45px',
                  background: 'linear-gradient(135deg, #df2020 0%, #ff6b6b 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 15px rgba(223, 32, 32, 0.3)',
                  animation: 'float 3s ease-in-out infinite'
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                </div>
                <h4 style={{
                  margin: 0,
                  fontSize: '1.3em',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #df2020 0%, #111A45 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Order Summary
                </h4>
              </div>
              <div style={{
                padding: '6px 12px',
                background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '700',
                color: 'white',
                boxShadow: '0 3px 10px rgba(76, 175, 80, 0.3)'
              }}>
                {cart?.items?.length || 0} Items
              </div>
            </div>

            {/* Cart Items */}
            <div style={{
              maxHeight: '350px',
              overflowY: 'auto',
              marginBottom: '25px',
              paddingRight: '10px'
            }}>
              {cart.items.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '15px',
                    marginBottom: '18px',
                    paddingBottom: '18px',
                    borderBottom: '2px solid #f8f8f8',
                    animation: `fadeInUp 0.5s ease ${index * 0.1}s backwards`
                  }}
                >
                  <div style={{
                    width: '70px',
                    height: '70px',
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    border: '2px solid #e0e0e0',
                    borderRadius: '12px',
                    padding: '8px',
                    flexShrink: 0,
                    position: 'relative',
                    overflow: 'hidden'
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
                    {/* Quantity Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      width: '22px',
                      height: '22px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: '800',
                      color: 'white',
                      border: '2px solid white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}>
                      {item.quantity}
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h6 style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#111A45',
                      marginBottom: '8px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: '1.4'
                    }}>
                      {item.name}
                    </h6>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        fontSize: '12px',
                        color: '#999',
                        background: '#f5f5f5',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontWeight: '600'
                      }}>
                        ${item.price?.toFixed(2)} each
                      </span>
                      <span style={{
                        fontSize: '16px',
                        fontWeight: '800',
                        background: 'linear-gradient(135deg, #df2020 0%, #ff6b6b 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
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
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              padding: '20px',
              borderRadius: '16px',
              border: '2px solid #dee2e6'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '15px',
                padding: '12px',
                background: 'white',
                borderRadius: '10px'
              }}>
                <span style={{ fontSize: '14px', color: '#666', fontWeight: '600' }}>Subtotal</span>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#111A45' }}>
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '15px',
                padding: '12px',
                background: 'white',
                borderRadius: '10px'
              }}>
                <span style={{
                  fontSize: '14px',
                  color: '#666',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  Shipping
                  <span style={{
                    fontSize: '10px',
                    background: '#4caf50',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontWeight: '700'
                  }}>
                    FREE
                  </span>
                </span>
                <span style={{
                  fontSize: '15px',
                  fontWeight: '700',
                  color: '#4caf50'
                }}>
                  $0.00
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '20px',
                padding: '18px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.3)'
              }}>
                <span style={{
                  fontSize: '18px',
                  fontWeight: '800',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H3V6h18v12z"/>
                  </svg>
                  Total
                </span>
                <span style={{
                  fontSize: '28px',
                  fontWeight: '900',
                  color: 'white',
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}>
                  ${cartTotal.toFixed(2)}
                </span>
              </div>

              {/* Money Back Guarantee */}
              <div style={{
                marginTop: '20px',
                padding: '15px',
                background: 'white',
                borderRadius: '12px',
                textAlign: 'center',
                border: '2px dashed #4caf50'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="#4caf50" style={{ marginBottom: '8px' }}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <p style={{
                  margin: '5px 0 0 0',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#4caf50'
                }}>
                  30-Day Money Back Guarantee
                </p>
                <p style={{
                  margin: '5px 0 0 0',
                  fontSize: '11px',
                  color: '#999'
                }}>
                  Shop with confidence!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Cart Link */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button
            onClick={() => navigate('/cart')}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              padding: '12px 30px',
              borderRadius: '30px',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'white';
              e.target.style.color = '#667eea';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 20px rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.color = 'white';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Back to Cart
          </button>
        </div>
      </div>

      {/* Global Animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(20px, -20px) scale(1.05); }
          }

          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }

          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes scaleIn {
            from {
              transform: scale(0);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideInFromTop {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Custom Scrollbar */
          div::-webkit-scrollbar {
            width: 6px;
          }

          div::-webkit-scrollbar-track {
            background: #f1f1f1;
            borderRadius: 10px;
          }

          div::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            borderRadius: 10px;
          }

          div::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
          }
        `}
      </style>
    </div>
  );
};

export default Checkout;

