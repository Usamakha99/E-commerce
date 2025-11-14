import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import footerLogo from '../assets/footer logo.png';

const Footer = () => {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <footer style={{
      backgroundColor: 'rgb(17, 26, 69)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      marginTop: '10px',
      paddingTop: '20px'
    }}>
      {/* Main Footer Content */}
      <div style={{
        padding: isMobile ? '50px 20px' : '70px 40px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div className="row" style={{ margin: 0 }}>
          {/* Column 1: Company Information */}
          <div className="col-lg-3 col-md-6 mb-4" style={{ marginBottom: isMobile ? '40px' : '0' }}>
            {/* Logo */}
            <div style={{ marginBottom: '24px' }}>
              <Link to="/" style={{ 
                textDecoration: 'none', 
                display: 'inline-block',
                lineHeight: 0
              }}>
                <img 
                  alt="V Cloud Tech" 
                  src={footerLogo} 
                  style={{ 
                    height: 'auto', 
                    maxWidth: '200px',
                    display: 'block'
                  }}
                />
              </Link>
            </div>
            
            {/* Address */}
            <p style={{
              fontSize: '14px',
              color: 'white',
              lineHeight: '1.7',
              margin: 0,
              marginBottom: '20px',
              fontFamily: '"Space Grotesk", sans-serif'
            }}>
              609 Deep Valley Drive Suite 200,<br />
              Rolling Hills Estates, CA 90274
            </p>
            
            {/* Horizontal Line */}
            <div style={{
              width: '100%',
              height: '1px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              marginBottom: '20px'
            }} />
            
            {/* Contact Information */}
            <div style={{ marginBottom: '32px' }}>
              {/* Phone */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '12px',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  minWidth: '20px',
                  marginTop: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="white"/>
                  </svg>
                </div>
                <div>
                  <p style={{
                    fontSize: '14px',
                    color: 'white',
                    margin: 0,
                    marginBottom: '4px',
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: '600'
                  }}>
                    Talk to an Expert
                  </p>
                  <a 
                    href="tel:+18334825683"
                    style={{
                      fontSize: '14px',
                      color: '#E63946',
                      textDecoration: 'none',
                      fontFamily: '"Space Grotesk", sans-serif',
                      transition: 'color 0.2s',
                      display: 'block'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#FF6B7A'}
                    onMouseLeave={(e) => e.target.style.color = '#E63946'}
                  >
                    (833) 482-5683
                  </a>
                </div>
              </div>
              
              {/* Email */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '12px'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  minWidth: '20px',
                  marginTop: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 21l10-9 10 9V3H2v18z" fill="white"/>
                    <path d="M12 12l10-9H2l10 9z" fill="none" stroke="white" strokeWidth="1.5"/>
                  </svg>
                </div>
                <div>
                  <p style={{
                    fontSize: '14px',
                    color: 'white',
                    margin: 0,
                    marginBottom: '4px',
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: '600'
                  }}>
                    Have any Question
                  </p>
                  <a 
                    href="mailto:info@vcloudtech.com"
                    style={{
                      fontSize: '14px',
                      color: '#E63946',
                      textDecoration: 'none',
                      fontFamily: '"Space Grotesk", sans-serif',
                      transition: 'color 0.2s',
                      display: 'block'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#FF6B7A'}
                    onMouseLeave={(e) => e.target.style.color = '#E63946'}
                  >
                    info@vcloudtech.com
                  </a>
                </div>
              </div>
            </div>
            
            {/* Social Media Icons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
              {/* Facebook */}
              <a href="#" style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#1877F2',
                border: '1px solid #1877F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                color: 'white',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#166FE5';
                e.currentTarget.style.borderColor = '#166FE5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1877F2';
                e.currentTarget.style.borderColor = '#1877F2';
              }}
              >
                <svg width="18" height="18" fill="white" viewBox="0 0 24 24" shapeRendering="geometricPrecision" style={{ display: 'block' }}>
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              
              {/* X (Twitter) */}
              <a href="#" style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#000000',
                border: '1px solid #000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                color: 'white',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1a1a1a';
                e.currentTarget.style.borderColor = '#1a1a1a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#000000';
                e.currentTarget.style.borderColor = '#000000';
              }}
              >
                <svg width="18" height="18" fill="white" viewBox="0 0 24 24" shapeRendering="geometricPrecision" style={{ display: 'block' }}>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              
              {/* Instagram */}
              <a href="#" style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                border: '1px solid transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                color: 'white',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
              >
                <svg width="18" height="18" fill="white" viewBox="0 0 24 24" shapeRendering="geometricPrecision" style={{ display: 'block' }}>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              
              {/* YouTube */}
              <a href="#" style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#FF0000',
                border: '1px solid #FF0000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                color: 'white',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E60000';
                e.currentTarget.style.borderColor = '#E60000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FF0000';
                e.currentTarget.style.borderColor = '#FF0000';
              }}
              >
                <svg width="18" height="18" fill="white" viewBox="0 0 24 24" shapeRendering="geometricPrecision" style={{ display: 'block' }}>
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              
              {/* LinkedIn */}
              <a href="#" style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#0077B5',
                border: '1px solid #0077B5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                color: 'white',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#006399';
                e.currentTarget.style.borderColor = '#006399';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#0077B5';
                e.currentTarget.style.borderColor = '#0077B5';
              }}
              >
                <svg width="18" height="18" fill="white" viewBox="0 0 24 24" shapeRendering="geometricPrecision" style={{ display: 'block' }}>
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: SOLUTIONS */}
          <div className="col-lg-2 col-md-6 mb-4" style={{ marginBottom: isMobile ? '40px' : '0' }}>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '28px',
              fontFamily: '"Space Grotesk", sans-serif'
            }}>
              SOLUTIONS
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {[
                { label: 'CyberSecurity', href: '#' },
                { label: 'Digital Enterprise', href: '#' },
                { label: 'DevOps', href: '#' },
                { label: 'Hybrid IT', href: '#' },
                { label: 'Increase IT Agility', href: '#' },
                { label: 'Modernize Workplace', href: '#' },
                { label: 'Optimize Workplace', href: '#' },
                { label: 'Secure Workplace', href: '#' }
              ].map((item, index) => (
                <li key={index} style={{ marginBottom: '16px' }}>
                  <Link 
                    to={item.href}
                    style={{
                      fontSize: '14px',
                      color: 'white',
                      textDecoration: 'none',
                      fontFamily: '"Space Grotesk", sans-serif',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
                    onMouseLeave={(e) => e.target.style.color = 'white'}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: SOFTWARE */}
          <div className="col-lg-2 col-md-6 mb-4" style={{ marginBottom: isMobile ? '40px' : '0' }}>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '28px',
              fontFamily: '"Space Grotesk", sans-serif'
            }}>
              SOFTWARE
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {[
                { label: 'CyberSecurity', href: '#' },
                { label: 'Data Backup & DR', href: '#' },
                { label: 'DevOps', href: '#' },
                { label: 'Hybrid IT', href: '#' },
                { label: 'IoT', href: '#' },
                { label: 'ITSM', href: '#' },
                { label: 'Enterprise application', href: '#' }
              ].map((item, index) => (
                <li key={index} style={{ marginBottom: '16px' }}>
                  <Link 
                    to={item.href}
                    style={{
                      fontSize: '14px',
                      color: 'white',
                      textDecoration: 'none',
                      fontFamily: '"Space Grotesk", sans-serif',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
                    onMouseLeave={(e) => e.target.style.color = 'white'}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: SERVICES */}
          <div className="col-lg-2 col-md-6 mb-4" style={{ marginBottom: isMobile ? '40px' : '0' }}>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '28px',
              fontFamily: '"Space Grotesk", sans-serif'
            }}>
              SERVICES
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {[
                { label: 'AI (Artificial Intelligence)', href: '#' },
                { label: 'BI (Business Intelligence)', href: '#' },
                { label: 'Cloud Migration', href: '#' },
                { label: 'IoT (Internet of Thing)', href: '#' },
                { label: 'ITSM', href: '#' },
                { label: 'Licensing and Sam', href: '#' },
                { label: 'Managed Services', href: '#' },
                { label: 'Professional Services', href: '#' },
                { label: 'Financing', href: '#' },
                { label: 'Technology and Consulting', href: '#' }
              ].map((item, index) => (
                <li key={index} style={{ marginBottom: '16px' }}>
                  <Link 
                    to={item.href}
                    style={{
                      fontSize: '14px',
                      color: 'white',
                      textDecoration: 'none',
                      fontFamily: '"Space Grotesk", sans-serif',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
                    onMouseLeave={(e) => e.target.style.color = 'white'}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: GET IN TOUCH */}
          <div className="col-lg-3 col-md-6 mb-4" style={{ marginBottom: isMobile ? '40px' : '0' }}>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '28px',
              fontFamily: '"Space Grotesk", sans-serif'
            }}>
              GET IN TOUCH
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {[
                { label: 'Blogs', href: '/blog' },
                { label: 'Careers', href: '/careers' },
                { label: 'Contact Us', href: '/contact' },
                { label: 'Free Tools', href: '#' },
                { label: 'Government', href: '#' },
                { label: 'Contracts', href: '#' },
                { label: 'Partners', href: '#' },
                { label: 'Privacy Policy', href: '/terms' },
                { label: 'Resources', href: '#' },
                { label: 'Shop', href: '/shop' }
              ].map((item, index) => (
                <li key={index} style={{ marginBottom: '16px' }}>
                  <Link 
                    to={item.href}
                    style={{
                      fontSize: '14px',
                      color: 'white',
                      textDecoration: 'none',
                      fontFamily: '"Space Grotesk", sans-serif',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
                    onMouseLeave={(e) => e.target.style.color = 'white'}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: isMobile ? '24px 20px' : '24px 40px',
        backgroundColor: 'rgb(17, 26, 69)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '14px',
            color: 'white',
            fontFamily: '"Space Grotesk", sans-serif'
          }}>
            All rights reserved © 2025
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
