import React, { useState } from 'react';

const ProductInquiryModal = ({ isOpen, onClose, productName }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    city: '',
    country: '',
    helpType: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
    alert('Thank you for your inquiry! We will contact you soon.');
    onClose();
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
          borderRadius: '0px',
          padding: '36px',
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
          marginBottom: '28px',
          fontSize: '26px',
          fontWeight: '600',
          color: '#111A45',
          fontFamily: 'Space Grotesk, sans-serif'
        }}>
          Product Inquiry
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '16px',
            marginBottom: '16px'
          }}>
            {/* First Name */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
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
            </div>

            {/* Last Name */}
            {/* <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
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

            {/* Email */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
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
                marginBottom: '8px',
                fontSize: '14px',
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
                  padding: '11px 14px',
                  border: '1.5px solid #e0e0e0',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'Space Grotesk, sans-serif',
                  outline: 'none',
                  backgroundColor: '#fafafa',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
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
            borderTop: '1px solid #e0e0e0',
            margin: '24px 0'
          }}></div>

          {/* How can we help */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
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
                padding: '11px 14px',
                border: '1.5px solid #e0e0e0',
                borderRadius: '4px',
                fontSize: '14px',
                fontFamily: 'Space Grotesk, sans-serif',
                outline: 'none',
                backgroundColor: '#fafafa',
                cursor: 'pointer',
                transition: 'all 0.2s'
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
            marginTop: '32px'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '11px 28px',
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
              style={{
                padding: '11px 28px',
              backgroundColor: '#df2020',
                border: 'none',
                borderRadius: '25px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'Space Grotesk, sans-serif',
              boxShadow: '0 2px 8px rgba(223, 32, 32, 0.2)'
              }}
              onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#c71b1b';
              e.target.style.boxShadow = '0 4px 12px rgba(223, 32, 32, 0.3)';
              }}
              onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#df2020';
              e.target.style.boxShadow = '0 2px 8px rgba(223, 32, 32, 0.2)';
              }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductInquiryModal;

