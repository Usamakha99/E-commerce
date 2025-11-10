import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/auth.service';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || '';
  const emailFailed = location.state?.emailFailed || false;
  
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState(emailFromState);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [showEmailWarning, setShowEmailWarning] = useState(emailFailed);

  // Focus first input on mount
  useEffect(() => {
    document.getElementById('code-0')?.focus();
  }, []);

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  const handleCodeChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    setApiError('');

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setVerificationCode(newCode);
    
    // Focus last filled input or first empty
    const nextEmptyIndex = newCode.findIndex(code => !code);
    if (nextEmptyIndex !== -1) {
      document.getElementById(`code-${nextEmptyIndex}`)?.focus();
    } else {
      document.getElementById('code-5')?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const code = verificationCode.join('');
    
    if (code.length !== 6) {
      setApiError('Please enter complete 6-digit code');
      return;
    }

    setIsLoading(true);
    setApiError('');

    try {
      const response = await authService.verifyEmail(email, code);
      
      setSuccessMessage('Email verified successfully! Redirecting...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error('Verification error:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                           error.response.data?.error || 
                           'Verification failed. Please check your code.';
        setApiError(errorMessage);
      } else if (error.request) {
        setApiError('Unable to connect to server. Please try again.');
      } else {
        setApiError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setResendSuccess(false);
    setApiError('');

    try {
      await authService.resendVerificationCode(email);
      setResendSuccess(true);
      
      setTimeout(() => {
        setResendSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Resend error:', error);
      setApiError('Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #df2020 0%, #c41a1a 25%, #111A45 75%, #0a0f2c 100%)',
      padding: '60px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0
      }}>
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(223, 32, 32, 0.15) 0%, rgba(223, 32, 32, 0.05) 70%, transparent 100%)',
          top: '-200px',
          right: '-100px',
          animation: 'float 20s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(17, 26, 69, 0.2) 0%, rgba(17, 26, 69, 0.08) 70%, transparent 100%)',
          bottom: '-150px',
          left: '-80px',
          animation: 'float 15s ease-in-out infinite reverse'
        }} />
      </div>

      <div style={{
        maxWidth: '500px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          marginTop: '40px',
          animation: 'fadeInDown 0.8s ease'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '50px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            marginBottom: '25px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(76, 175, 80, 0.4)'
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
              </svg>
            </div>
            <span style={{ color: 'white', fontSize: '13px', fontWeight: '700', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
              Email Verification
            </span>
          </div>

          <h1 style={{
            fontSize: '3em',
            fontWeight: '900',
            color: 'white',
            marginBottom: '10px',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            letterSpacing: '-1px'
          }}>
            Verify Your Email
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '16px',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            We've sent a verification code to<br />
            <strong>{email}</strong>
          </p>
        </div>

        {/* Main Card */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          padding: '50px',
          animation: 'slideInUp 0.8s ease'
        }}>
          {/* Success Message */}
          {successMessage && (
            <div style={{
              marginBottom: '25px',
              padding: '15px 20px',
              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
              borderRadius: '12px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              animation: 'slideInDown 0.5s ease'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span style={{ fontWeight: '600', fontSize: '15px' }}>{successMessage}</span>
            </div>
          )}

          {/* Resend Success */}
          {resendSuccess && (
            <div style={{
              marginBottom: '25px',
              padding: '15px 20px',
              background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
              borderRadius: '12px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              animation: 'slideInDown 0.5s ease'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <span style={{ fontWeight: '600', fontSize: '15px' }}>Verification code sent!</span>
            </div>
          )}

          {/* API Error Message */}
          {apiError && (
            <div style={{
              marginBottom: '25px',
              padding: '15px 20px',
              background: 'linear-gradient(135deg, #df2020 0%, #ff6b6b 100%)',
              borderRadius: '12px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              animation: 'shake 0.5s ease'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <span style={{ fontWeight: '600', fontSize: '15px' }}>{apiError}</span>
            </div>
          )}

          {/* Email Failed Warning */}
          {showEmailWarning && (
            <div style={{
              marginBottom: '20px',
              padding: '15px 20px',
              background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
              borderRadius: '12px',
              border: '2px solid #ffb74d',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#f57c00" style={{ flexShrink: 0 }}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#111A45', fontSize: '14px', fontWeight: '700' }}>
                  Email Service Temporarily Down
                </h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: '1.5' }}>
                  Your account was created but verification email couldn't be sent. 
                  Click "Resend Code" below to try again, or contact support.
                </p>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div style={{
            textAlign: 'center',
            marginBottom: '30px',
            padding: '20px',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            borderRadius: '16px',
            border: '2px solid #bae6fd'
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#0284c7" style={{ marginBottom: '10px' }}>
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            <h4 style={{ margin: '0 0 8px 0', color: '#111A45', fontSize: '16px', fontWeight: '700' }}>
              Check Your Email
            </h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
              Enter the 6-digit verification code we sent to your email address
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Verification Code Input */}
            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                marginBottom: '15px',
                fontSize: '14px',
                fontWeight: '700',
                color: '#111A45',
                textAlign: 'center'
              }}>
                Verification Code
              </label>
              
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                marginBottom: '15px'
              }}>
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    disabled={isLoading}
                    style={{
                      width: '55px',
                      height: '60px',
                      fontSize: '24px',
                      fontWeight: '700',
                      textAlign: 'center',
                      border: '2px solid #e0e0e0',
                      borderRadius: '12px',
                      color: '#111A45',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      background: digit ? '#f8f9fa' : 'white'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#df2020';
                      e.target.style.boxShadow = '0 0 0 4px rgba(223, 32, 32, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0e0e0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                ))}
              </div>

              <p style={{
                textAlign: 'center',
                fontSize: '13px',
                color: '#999',
                margin: 0
              }}>
                💡 You can paste the code directly
              </p>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isLoading || verificationCode.join('').length !== 6}
              style={{
                width: '100%',
                padding: '16px',
                background: isLoading || verificationCode.join('').length !== 6 
                  ? '#ccc' 
                  : 'linear-gradient(135deg, #df2020 0%, #111A45 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: isLoading || verificationCode.join('').length !== 6 ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: isLoading ? 'none' : '0 6px 20px rgba(223, 32, 32, 0.4)',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
              onMouseEnter={(e) => {
                if (!isLoading && verificationCode.join('').length === 6) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(223, 32, 32, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 6px 20px rgba(223, 32, 32, 0.4)';
                }
              }}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '3px solid white',
                    borderTop: '3px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Verifying...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Verify Email
                </>
              )}
            </button>

            {/* Resend Code */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                Didn't receive the code?
              </p>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendLoading}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#df2020',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: resendLoading ? 'not-allowed' : 'pointer',
                  textDecoration: 'underline',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!resendLoading) {
                    e.target.style.color = '#111A45';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!resendLoading) {
                    e.target.style.color = '#df2020';
                  }
                }}
              >
                {resendLoading ? 'Sending...' : 'Resend Code'}
              </button>
            </div>

            {/* Back to Register */}
            <div style={{ textAlign: 'center' }}>
              <Link
                to="/register"
                style={{
                  fontSize: '14px',
                  color: '#999',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#df2020';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#999';
                }}
              >
                ← Back to Register
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(20px, -20px) scale(1.05); }
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

          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(50px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideInDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default VerifyEmail;

