import React, { useState } from 'react';
import { productInquiryService } from '../services/productInquiry.service';

const ProductInquiryModal = ({ isOpen, onClose, productName, productId }) => {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    city: '',
    country: '',
    helpType: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Prepare inquiry data according to backend API format
      // Backend expects: username, firstName, lastName, email, country, helpType (required)
      // Optional: companyName, city, productId, productName, message
      const inquiryData = {
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        country: formData.country,
        helpType: formData.helpType,
        // Optional fields - only include if they have values
        ...(productId && { productId: productId }),
        ...(productName && { productName: productName }),
        ...(formData.companyName && { companyName: formData.companyName }),
        ...(formData.city && { city: formData.city }),
      };

      // Send to API
      await productInquiryService.createInquiry(inquiryData);

      // Success
      setSuccess(true);

      // Reset form
      setFormData({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        companyName: '',
        city: '',
        country: '',
        helpType: ''
      });

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);

    } catch (err) {
      // Better error messages based on status code
      let errorMessage = 'Failed to submit inquiry. Please try again.';

      if (err?.response?.status === 404) {
        errorMessage = `API endpoint not found (404). The backend route 'POST /api/productinquiries' does not exist. Please check:
1. Backend server is running on http://localhost:5000
2. Backend route is properly configured: POST /api/productinquiries
3. Backend route name matches exactly (check for typos or different naming like /product-inquiries)`;
      } else if (err?.response?.status === 400) {
        errorMessage = err?.response?.data?.message || 'Invalid data. Please check all fields and try again.';
      } else if (err?.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '28px',
          width: '100%',
          maxWidth: '580px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#f5f5f5',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#e0e0e0';
            e.target.style.color = '#333';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#f5f5f5';
            e.target.style.color = '#666';
          }}
        >
          ×
        </button>

        {/* Title */}
        <h2 style={{
          marginTop: 0,
          marginBottom: '20px',
          fontSize: '24px',
          fontWeight: '600',
          color: '#111A45',
          fontFamily: 'Space Grotesk, sans-serif'
        }}>
          Product Inquiry
        </h2>

        {/* Success Message */}
        {success && (
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '4px',
            color: '#155724',
            marginBottom: '20px',
            fontSize: '14px',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            ✓ Thank you for your inquiry! A confirmation email has been sent to {formData.email || 'your email address'}. We will contact you soon.
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            color: '#721c24',
            marginBottom: '20px',
            fontSize: '14px',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '14px',
            marginBottom: '14px'
          }}>
            {/* First Name and Last Name - One Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              {/* First Name */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#333',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  First Name <span style={{ color: '#ff4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1.5px solid #e0e0e0',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontFamily: 'Space Grotesk, sans-serif',
                    outline: 'none',
                    transition: 'all 0.2s',
                    backgroundColor: '#fafafa',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#111A45';
                    e.target.style.backgroundColor = '#fff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e0e0e0';
                    e.target.style.backgroundColor = '#fafafa';
                  }}
                />
              </div>

              {/* Last Name */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#333',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  Last Name <span style={{ color: '#ff4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1.5px solid #e0e0e0',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontFamily: 'Space Grotesk, sans-serif',
                    outline: 'none',
                    transition: 'all 0.2s',
                    backgroundColor: '#fafafa',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#111A45';
                    e.target.style.backgroundColor = '#fff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e0e0e0';
                    e.target.style.backgroundColor = '#fafafa';
                  }}
                />
              </div>
            </div>

            {/* Username and Email - One Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              {/* Username */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#333',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  Username <span style={{ color: '#ff4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1.5px solid #e0e0e0',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontFamily: 'Space Grotesk, sans-serif',
                    outline: 'none',
                    transition: 'all 0.2s',
                    backgroundColor: '#fafafa',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#111A45';
                    e.target.style.backgroundColor = '#fff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e0e0e0';
                    e.target.style.backgroundColor = '#fafafa';
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#333',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  Email <span style={{ color: '#ff4444' }}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1.5px solid #e0e0e0',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontFamily: 'Space Grotesk, sans-serif',
                    outline: 'none',
                    transition: 'all 0.2s',
                    backgroundColor: '#fafafa',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#111A45';
                    e.target.style.backgroundColor = '#fff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e0e0e0';
                    e.target.style.backgroundColor = '#fafafa';
                  }}
                />
              </div>
            </div>

            {/* Company Name */}
            {/* <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#333',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Company Name <span style={{ color: '#ff4444' }}>*</span>
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  border: '1.5px solid #e0e0e0',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'Space Grotesk, sans-serif',
                  outline: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: '#fafafa'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#111A45';
                  e.target.style.backgroundColor = '#fff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.backgroundColor = '#fafafa';
                }}
              />
            </div> */}

            {/* City */}
            {/* <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#333',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                City <span style={{ color: '#ff4444' }}>*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  border: '1.5px solid #e0e0e0',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'Space Grotesk, sans-serif',
                  outline: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: '#fafafa'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#111A45';
                  e.target.style.backgroundColor = '#fff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.backgroundColor = '#fafafa';
                }}
              />
            </div> */}

            {/* Country */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '13px',
                fontWeight: '500',
                color: '#333',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Country <span style={{ color: '#ff4444' }}>*</span>
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1.5px solid #e0e0e0',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'Space Grotesk, sans-serif',
                  outline: 'none',
                  backgroundColor: '#fafafa',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#111A45';
                  e.target.style.backgroundColor = '#fff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.backgroundColor = '#fafafa';
                }}
              >
                <option value="">Select Country</option>
                <option value="usa">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="canada">Canada</option>
                <option value="australia">Australia</option>
                <option value="pakistan">Pakistan</option>
                <option value="india">India</option>
                <option value="uae">UAE</option>
              </select>
            </div>
          </div>

          {/* Divider */}
          <div style={{
            borderTop: '1px solidrgb(78, 78, 78)',
            margin: '18px 0'
          }}></div>

          {/* How can we help */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '13px',
              fontWeight: '500',
              color: '#333',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              How can we help? <span style={{ color: '#ff4444' }}>*</span>
            </label>
            <select
              name="helpType"
              value={formData.helpType}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1.5px solid #e0e0e0',
                borderRadius: '4px',
                fontSize: '14px',
                fontFamily: 'Space Grotesk, sans-serif',
                outline: 'none',
                backgroundColor: '#fafafa',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#111A45';
                e.target.style.backgroundColor = '#fff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e0e0e0';
                e.target.style.backgroundColor = '#fafafa';
              }}
            >
              <option value="">Please select...</option>
              <option value="pricing">Volume Pricing</option>
              <option value="shipping">Shipping Options</option>
              <option value="specs">Product Specifications</option>
              <option value="availability">Product Availability</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '20px'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 24px',
                backgroundColor: 'white',
                border: '1.5px solid #111A45',
                borderRadius: '25px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#111A45',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'Space Grotesk, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f5f5f5';
                e.target.style.borderColor = '#1c1463';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.borderColor = '#111A45';
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 24px',
                backgroundColor: loading ? '#ccc' : '#df2020',
                border: 'none',
                borderRadius: '25px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'Space Grotesk, sans-serif',
                boxShadow: loading ? 'none' : '0 2px 8px rgba(223, 32, 32, 0.2)',
                opacity: loading ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#c71b1b';
                  e.target.style.boxShadow = '0 4px 12px rgba(223, 32, 32, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#df2020';
                  e.target.style.boxShadow = '0 2px 8px rgba(223, 32, 32, 0.2)';
                }
              }}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductInquiryModal;

