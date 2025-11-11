import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Real-time validation
  const validateField = (name, value) => {
    const errors = {};

    switch (name) {
      case 'email':
        if (!value) {
          errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errors.email = 'Email is invalid';
        }
        break;

      case 'password':
        if (!value) {
          errors.password = 'Password is required';
        } else if (value.length < 6) {
          errors.password = 'Password must be at least 6 characters';
        }
        break;

      default:
        break;
    }

    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear API error when user starts typing
    if (apiError) setApiError('');
    
    // Validate field
    if (type !== 'checkbox') {
      const fieldErrors = validateField(name, newValue);
      setFormErrors(prev => ({
        ...prev,
        ...fieldErrors,
        [name]: fieldErrors[name] || ''
    }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setApiError('');
    setSuccessMessage('');
    
    // Validate all fields
    const errors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'rememberMe') {
        const fieldErrors = validateField(key, formData[key]);
        if (fieldErrors[key]) {
          errors[key] = fieldErrors[key];
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.login(formData.email, formData.password);
      
      setSuccessMessage('Login successful! Redirecting...');
      
      // Redirect to home after 1 second
      setTimeout(() => {
        navigate('/');
      }, 1000);
      
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different error responses
      if (error.response) {
        const errorData = error.response.data;
        const errorMessage = errorData?.message || 
                           errorData?.error || 
                           'Login failed. Please check your credentials.';
        
        // Check if user needs to verify email first
        if (errorMessage.includes('verify') || errorMessage.includes('verification')) {
          setApiError('⚠️ Please verify your email before logging in.');
          
          // Show option to go to verification page
          setTimeout(() => {
            const goToVerify = window.confirm('Go to email verification page?');
            if (goToVerify) {
              navigate('/verify-email', { 
                state: { 
                  email: formData.email,
                  fromLogin: true 
                } 
              });
            }
          }, 1000);
        } else {
          setApiError(errorMessage);
        }
        
        // Handle field-specific errors
        if (errorData?.errors) {
          setFormErrors(errorData.errors);
        }
      } else if (error.request) {
        setApiError('Unable to connect to server. Please check your connection.');
      } else {
        setApiError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
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
        <div style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 107, 107, 0.12) 0%, transparent 70%)',
          top: '40%',
          left: '10%',
          animation: 'float 18s ease-in-out infinite'
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
              background: 'linear-gradient(135deg, #df2020 0%, #ff6b6b 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(223, 32, 32, 0.4)'
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
            </div>
            <span style={{ color: 'white', fontSize: '13px', fontWeight: '700', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
              Welcome Back
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
            Sign In
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '16px',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            Login to access your account and continue shopping!
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

                  <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '700',
                color: '#111A45'
              }}>
                Email Address *
              </label>
                      <input 
                type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                placeholder="john@example.com"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: `2px solid ${formErrors.email ? '#df2020' : '#e0e0e0'}`,
                  borderRadius: '12px',
                  fontSize: '15px',
                  color: '#111A45',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  opacity: isLoading ? 0.6 : 1
                }}
                onFocus={(e) => {
                  if (!isLoading) {
                    e.target.style.borderColor = '#df2020';
                    e.target.style.boxShadow = '0 0 0 4px rgba(223, 32, 32, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  if (formErrors.email) {
                    e.target.style.borderColor = '#df2020';
                  } else {
                    e.target.style.borderColor = '#e0e0e0';
                  }
                  e.target.style.boxShadow = 'none';
                }}
              />
              {formErrors.email && (
                <span style={{
                  display: 'block',
                  marginTop: '6px',
                  fontSize: '13px',
                  color: '#df2020',
                  fontWeight: '500'
                }}>
                  {formErrors.email}
                </span>
              )}
          </div>

            {/* Password */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '700',
                color: '#111A45'
              }}>
                Password *
              </label>
              <div style={{ position: 'relative' }}>
                      <input 
                  type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                  placeholder="••••••••"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '14px 45px 14px 16px',
                    border: `2px solid ${formErrors.password ? '#df2020' : '#e0e0e0'}`,
                    borderRadius: '12px',
                    fontSize: '15px',
                    color: '#111A45',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    opacity: isLoading ? 0.6 : 1
                  }}
                  onFocus={(e) => {
                    if (!isLoading) {
                      e.target.style.borderColor = '#df2020';
                      e.target.style.boxShadow = '0 0 0 4px rgba(223, 32, 32, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    if (formErrors.password) {
                      e.target.style.borderColor = '#df2020';
                    } else {
                      e.target.style.borderColor = '#e0e0e0';
                    }
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '5px',
                    color: '#999'
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {formErrors.password && (
                <span style={{
                  display: 'block',
                  marginTop: '6px',
                  fontSize: '13px',
                  color: '#df2020',
                  fontWeight: '500'
                }}>
                  {formErrors.password}
                </span>
              )}
        </div>

            {/* Remember Me & Forgot Password */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '25px'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}>
                            <input 
                              type="checkbox" 
                              name="rememberMe"
                              checked={formData.rememberMe}
                              onChange={handleInputChange}
                  disabled={isLoading}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer'
                  }}
                />
                <span style={{
                  fontSize: '14px',
                  color: '#666'
                }}>
                            Remember me
                </span>
                          </label>
              <Link
                to="/forgot-password"
                style={{
                  fontSize: '14px',
                  color: '#df2020',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#111A45';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#df2020';
                }}
              >
                Forgot Password?
                          </Link>
              </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '16px',
                background: isLoading ? '#ccc' : 'linear-gradient(135deg, #df2020 0%, #111A45 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: isLoading ? 'none' : '0 6px 20px rgba(223, 32, 32, 0.4)',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
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
                  Signing In...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M10 17l5-5-5-5v10z"/>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  </svg>
                  Sign In
                </>
              )}
            </button>

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '20px'
            }}>
              <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
              <span style={{ fontSize: '13px', color: '#999', fontWeight: '600' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
            </div>

            {/* Social Login Buttons */}
            <div style={{ marginBottom: '20px' }}>
              <button
                type="button"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'white',
                  border: '2px solid #e0e0e0',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  marginBottom: '10px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#df2020';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
                    </div>

            {/* Register Link */}
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '14px', color: '#666' }}>
                Don't have an account?{' '}
                <Link
                  to="/register"
                  style={{
                    color: '#df2020',
                    textDecoration: 'none',
                    fontWeight: '700',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#111A45';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#df2020';
                  }}
                >
                        Sign Up
                      </Link>
              </span>
                    </div>
                  </form>
                </div>

        {/* Security Badge */}
        <div style={{
          marginTop: '30px',
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255, 255, 255, 0.8)">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
          </svg>
          <span>Secure login powered by V Cloud Tech</span>
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

export default Login;
