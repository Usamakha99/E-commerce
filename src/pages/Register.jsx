import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeTerms: false
  });

  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password strength calculator
  const calculatePasswordStrength = (password) => {
    if (!password) return { strength: 0, text: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 15;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 15;

    if (strength <= 30) return { strength, text: 'Weak', color: '#df2020' };
    if (strength <= 60) return { strength, text: 'Fair', color: '#ff9800' };
    if (strength <= 80) return { strength, text: 'Good', color: '#4caf50' };
    return { strength, text: 'Strong', color: '#2196f3' };
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  // Real-time validation
  const validateField = (name, value) => {
    const errors = {};

    switch (name) {
      case 'name':
        if (!value.trim()) {
          errors.name = 'Name is required';
        } else if (value.trim().length < 3) {
          errors.name = 'Name must be at least 3 characters';
        }
        break;

      case 'email':
        if (!value) {
          errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errors.email = 'Email is invalid';
        }
        break;

      case 'username':
        if (!value.trim()) {
          errors.username = 'Username is required';
        } else if (value.trim().length < 3) {
          errors.username = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          errors.username = 'Username can only contain letters, numbers, and underscores';
        }
        break;

      case 'password':
        if (!value) {
          errors.password = 'Password is required';
        } else if (value.length < 8) {
          errors.password = 'Password must be at least 8 characters';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          errors.confirmPassword = 'Please confirm your password';
        } else if (value !== formData.password) {
          errors.confirmPassword = 'Passwords do not match';
        }
        break;

      case 'phone':
        if (value && !/^\+?[\d\s-()]+$/.test(value)) {
          errors.phone = 'Phone number is invalid';
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
      if (key !== 'agreeTerms' && key !== 'phone') {
        const fieldErrors = validateField(key, formData[key]);
        if (fieldErrors[key]) {
          errors[key] = fieldErrors[key];
        }
      }
    });

    // Check terms agreement
    if (!formData.agreeTerms) {
      errors.agreeTerms = 'You must agree to the terms and conditions';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data for API
      const registrationData = {
        name: formData.name,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        ...(formData.phone && { phone: formData.phone })
      };

      const response = await authService.register(registrationData);
      
      // Check if email verification is required
      if (response.requiresVerification || response.message?.includes('verification')) {
        setSuccessMessage('Registration successful! Check your email for verification code.');
        
        // Redirect to verification page after 2 seconds
        setTimeout(() => {
          navigate('/verify-email', { 
            state: { email: formData.email } 
          });
        }, 2000);
      } else {
        // Direct registration (no verification required)
        setSuccessMessage('Registration successful! Redirecting...');
        
        setTimeout(() => {
          if (authService.isAuthenticated()) {
            navigate('/');
          } else {
            navigate('/login');
          }
        }, 2000);
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle different error responses
      if (error.response) {
        const errorData = error.response.data;
        const errorMessage = errorData?.message || 
                           errorData?.error || 
                           'Registration failed. Please try again.';
        
        // Check if it's email sending error (500 with email message)
        if (error.response.status === 500 && 
            (errorMessage.includes('email') || errorMessage.includes('verification'))) {
          
          // User was created but email failed - still redirect to verification
          console.log('ℹ️ User created but email failed. Redirecting to verify page.');
          console.log('ℹ️ User can request resend or contact admin.');
          
          setSuccessMessage('Registration successful! Redirecting to verification...');
          
          setTimeout(() => {
            navigate('/verify-email', { 
              state: { 
                email: formData.email,
                emailFailed: true 
              } 
            });
          }, 2000);
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
        maxWidth: '900px',
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
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <span style={{ color: 'white', fontSize: '13px', fontWeight: '700', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
              Join VCloud Tech
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
            Create Your Account
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '16px',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            Start your journey with us today! Access all features for free.
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
            {/* Form Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '20px'
            }}>
              {/* Full Name */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#111A45'
                }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: `2px solid ${formErrors.name ? '#df2020' : '#e0e0e0'}`,
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
                    if (formErrors.name) {
                      e.target.style.borderColor = '#df2020';
                    } else {
                      e.target.style.borderColor = '#e0e0e0';
                    }
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {formErrors.name && (
                  <span style={{
                    display: 'block',
                    marginTop: '6px',
                    fontSize: '13px',
                    color: '#df2020',
                    fontWeight: '500'
                  }}>
                    {formErrors.name}
                  </span>
                )}
              </div>

              {/* Username */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#111A45'
                }}>
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="johndoe123"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: `2px solid ${formErrors.username ? '#df2020' : '#e0e0e0'}`,
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
                    if (formErrors.username) {
                      e.target.style.borderColor = '#df2020';
                    } else {
                      e.target.style.borderColor = '#e0e0e0';
                    }
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {formErrors.username && (
                  <span style={{
                    display: 'block',
                    marginTop: '6px',
                    fontSize: '13px',
                    color: '#df2020',
                    fontWeight: '500'
                  }}>
                    {formErrors.username}
                  </span>
                )}
              </div>
            </div>

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

            {/* Phone (Optional) */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '700',
                color: '#111A45'
              }}>
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (123) 456-7890"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: `2px solid ${formErrors.phone ? '#df2020' : '#e0e0e0'}`,
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
                  if (formErrors.phone) {
                    e.target.style.borderColor = '#df2020';
                  } else {
                    e.target.style.borderColor = '#e0e0e0';
                  }
                  e.target.style.boxShadow = 'none';
                }}
              />
              {formErrors.phone && (
                <span style={{
                  display: 'block',
                  marginTop: '6px',
                  fontSize: '13px',
                  color: '#df2020',
                  fontWeight: '500'
                }}>
                  {formErrors.phone}
                </span>
              )}
            </div>

            {/* Password Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '20px'
            }}>
              {/* Password */}
              <div>
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
                {/* Password Strength Meter */}
                {formData.password && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{
                      height: '4px',
                      background: '#e0e0e0',
                      borderRadius: '10px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${passwordStrength.strength}%`,
                        background: passwordStrength.color,
                        transition: 'all 0.3s ease'
                      }} />
                    </div>
                    <span style={{
                      display: 'block',
                      marginTop: '4px',
                      fontSize: '12px',
                      color: passwordStrength.color,
                      fontWeight: '600'
                    }}>
                      {passwordStrength.text}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#111A45'
                }}>
                  Confirm Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '14px 45px 14px 16px',
                      border: `2px solid ${formErrors.confirmPassword ? '#df2020' : '#e0e0e0'}`,
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
                      if (formErrors.confirmPassword) {
                        e.target.style.borderColor = '#df2020';
                      } else {
                        e.target.style.borderColor = '#e0e0e0';
                      }
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <span style={{
                    display: 'block',
                    marginTop: '6px',
                    fontSize: '13px',
                    color: '#df2020',
                    fontWeight: '500'
                  }}>
                    {formErrors.confirmPassword}
                  </span>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  style={{
                    marginTop: '3px',
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer'
                  }}
                />
                <span style={{
                  fontSize: '14px',
                  color: '#666',
                  lineHeight: '1.5'
                }}>
                  I agree to the{' '}
                  <Link to="/terms" style={{ color: '#df2020', textDecoration: 'none', fontWeight: '600' }}>
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" style={{ color: '#111A45', textDecoration: 'none', fontWeight: '600' }}>
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {formErrors.agreeTerms && (
                <span style={{
                  display: 'block',
                  marginTop: '6px',
                  marginLeft: '28px',
                  fontSize: '13px',
                  color: '#df2020',
                  fontWeight: '500'
                }}>
                  {formErrors.agreeTerms}
                </span>
              )}
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
                  Creating Account...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  Create Account
                </>
              )}
            </button>

            {/* Login Link */}
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '14px', color: '#666' }}>
                Already have an account?{' '}
                <Link
                  to="/login"
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
                  Sign In
                </Link>
              </span>
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

export default Register;
