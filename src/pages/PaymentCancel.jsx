import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
  const navigate = useNavigate();

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
        maxWidth: '550px',
        width: '100%',
        overflow: 'hidden'
      }}>
        {/* Cancel Header */}
        <div style={{
          background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
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

          {/* Cancel Icon */}
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
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#ff9800"/>
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
            Payment Cancelled
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: '16px',
            position: 'relative',
            zIndex: 1
          }}>
            Your payment was not completed
          </p>
        </div>

        {/* Cancel Details */}
        <div style={{ padding: '40px 35px' }}>
          {/* Information Message */}
          <div style={{
            background: '#fff3e0',
            border: '2px solid #ffe0b2',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px',
            display: 'flex',
            gap: '15px'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#ff9800" style={{ flexShrink: 0 }}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <div>
              <h4 style={{
                margin: '0 0 8px 0',
                color: '#111A45',
                fontSize: '15px',
                fontWeight: '700'
              }}>
                No Charges Made
              </h4>
              <p style={{
                margin: 0,
                color: '#666',
                fontSize: '14px',
                lineHeight: '1.6'
              }}>
                Don't worry! Your payment was not processed, and no charges were made to your account. Your items are still in your cart.
              </p>
            </div>
          </div>

          {/* What Happened */}
          <div style={{
            background: '#fafafa',
            borderRadius: '12px',
            padding: '25px',
            marginBottom: '30px'
          }}>
            <h3 style={{
              margin: '0 0 15px 0',
              color: '#111A45',
              fontSize: '1.1em',
              fontWeight: '700'
            }}>
              What Happened?
            </h3>
            <ul style={{
              margin: 0,
              padding: '0 0 0 20px',
              color: '#666',
              fontSize: '14px',
              lineHeight: '2'
            }}>
              <li>You cancelled the payment process</li>
              <li>The payment window was closed</li>
              <li>Your session timed out</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginBottom: '20px'
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
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: '700',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f5f5f5';
                e.target.style.borderColor = '#111A45';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
                e.target.style.borderColor = '#e0e0e0';
              }}
            >
              Continue Shopping
            </Link>

            <button
              onClick={() => navigate('/cart')}
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
              Return to Cart
            </button>
          </div>

          {/* Help Text */}
          <p style={{
            textAlign: 'center',
            marginTop: '20px',
            color: '#999',
            fontSize: '13px'
          }}>
            Having trouble? <Link to="/contact" style={{ color: '#df2020', textDecoration: 'none', fontWeight: '600' }}>Contact Support</Link>
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

export default PaymentCancel;

