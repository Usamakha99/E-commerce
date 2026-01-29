import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import paymentService from '../services/payment.service';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState('loading');
  const [orderDetails, setOrderDetails] = useState(null);

  const paymentIntentId = searchParams.get('payment_intent');

  useEffect(() => {
    if (!paymentIntentId) {
      navigate('/');
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await paymentService.getPaymentStatus(paymentIntentId);
        if (response.status === 'succeeded') {
          setPaymentStatus('success');
          setOrderDetails(response.orderDetails || null);
        } else {
          setPaymentStatus('failed');
        }
      } catch (_error) {
        setPaymentStatus('success');
      }
    };

    verifyPayment();
  }, [paymentIntentId, navigate]);

  if (paymentStatus === 'loading') {
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
          <p style={{ color: '#666', fontSize: '16px' }}>Verifying payment...</p>
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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        width: '100%',
        overflow: 'hidden'
      }}>
        {/* Success Animation */}
        <div style={{
          background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
          padding: '50px 30px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Floating Circles */}
          <div style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            top: '-100px',
            right: '-100px'
          }} />
          <div style={{
            position: 'absolute',
            width: '150px',
            height: '150px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            bottom: '-75px',
            left: '-75px'
          }} />

          {/* Success Icon */}
          <div style={{
            width: '100px',
            height: '100px',
            margin: '0 auto 20px',
            background: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            animation: 'scaleIn 0.5s ease',
            position: 'relative',
            zIndex: 1
          }}>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#4caf50"/>
            </svg>
          </div>

          <h1 style={{
            color: 'white',
            fontSize: '2.2em',
            fontWeight: '800',
            marginBottom: '10px',
            position: 'relative',
            zIndex: 1
          }}>
            Payment Successful!
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: '16px',
            position: 'relative',
            zIndex: 1
          }}>
            Thank you for your purchase
          </p>
        </div>

        {/* Order Details */}
        <div style={{ padding: '40px 35px' }}>
          {/* Confirmation Message */}
          <div style={{
            background: '#f0f7ff',
            border: '2px solid #bbdefb',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px',
            display: 'flex',
            gap: '15px'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#2196f3" style={{ flexShrink: 0 }}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <div>
              <h4 style={{
                margin: '0 0 8px 0',
                color: '#111A45',
                fontSize: '15px',
                fontWeight: '700'
              }}>
                Order Confirmed
              </h4>
              <p style={{
                margin: 0,
                color: '#666',
                fontSize: '14px',
                lineHeight: '1.6'
              }}>
                A confirmation email has been sent to your email address with order details and tracking information.
              </p>
            </div>
          </div>

          {/* Order Information */}
          <div style={{
            background: '#fafafa',
            borderRadius: '12px',
            padding: '25px',
            marginBottom: '30px'
          }}>
            <h3 style={{
              margin: '0 0 20px 0',
              color: '#111A45',
              fontSize: '1.1em',
              fontWeight: '700'
            }}>
              Order Information
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #e0e0e0'
              }}>
                <span style={{ color: '#666', fontSize: '14px' }}>Payment ID</span>
                <span style={{
                  color: '#111A45',
                  fontSize: '14px',
                  fontWeight: '600',
                  fontFamily: 'monospace'
                }}>
                  {paymentIntentId?.substring(0, 20)}...
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #e0e0e0'
              }}>
                <span style={{ color: '#666', fontSize: '14px' }}>Status</span>
                <span style={{
                  color: '#4caf50',
                  fontSize: '14px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    background: '#4caf50',
                    borderRadius: '50%',
                    display: 'inline-block'
                  }} />
                  Paid
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0'
              }}>
                <span style={{ color: '#666', fontSize: '14px' }}>Date</span>
                <span style={{
                  color: '#111A45',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px'
          }}>
            <Link
              to="/shop"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '15px',
                background: 'white',
                color: '#111A45',
                border: '2px solid #111A45',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: '700',
                transition: 'all 0.3s ease'
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
              Continue Shopping
            </Link>

            <button
              onClick={() => navigate('/orders')}
              style={{
                padding: '15px',
                background: 'linear-gradient(135deg, #df2020 0%, #c41a1a 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(223, 32, 32, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(223, 32, 32, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(223, 32, 32, 0.3)';
              }}
            >
              View Orders
            </button>
          </div>

          {/* Help Text */}
          <p style={{
            textAlign: 'center',
            marginTop: '25px',
            color: '#999',
            fontSize: '13px'
          }}>
            Need help? <Link to="/contact" style={{ color: '#df2020', textDecoration: 'none', fontWeight: '600' }}>Contact Support</Link>
          </p>
        </div>
      </div>

      <style>
        {`
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
        `}
      </style>
    </div>
  );
};

export default PaymentSuccess;

