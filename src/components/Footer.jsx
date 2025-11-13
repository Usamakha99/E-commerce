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
                backgroundColor: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                color: 'rgba(255, 255, 255, 0.9)',
                transition: 'all 0.3s ease',
                fontSize: '16px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'white';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
              }}
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              
              {/* X (Twitter) */}
              <a href="#" style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                color: 'rgba(255, 255, 255, 0.9)',
                transition: 'all 0.3s ease',
                fontSize: '16px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'white';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
              }}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              
              {/* Instagram */}
              <a href="#" style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                color: 'rgba(255, 255, 255, 0.9)',
                transition: 'all 0.3s ease',
                fontSize: '16px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'white';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
              }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" fill="none"/>
                  <circle cx="12" cy="12" r="4" stroke="currentColor" fill="none"/>
                  <circle cx="17.5" cy="6.5" r="1.5" stroke="currentColor" fill="none"/>
                </svg>
              </a>
              
              {/* YouTube */}
              <a href="#" style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                color: 'rgba(255, 255, 255, 0.9)',
                transition: 'all 0.3s ease',
                fontSize: '16px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'white';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
              }}
              >
                <svg width="20" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="6" width="20" height="12" rx="2" ry="2" stroke="currentColor" fill="none"/>
                  <path d="m10 9 6 3-6 3V9z" stroke="currentColor" fill="none" strokeLinejoin="round" strokeLinecap="round"/>
                </svg>
              </a>
              
              {/* LinkedIn */}
              <a href="#" style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                color: 'rgba(255, 255, 255, 0.9)',
                transition: 'all 0.3s ease',
                fontSize: '16px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'white';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
              }}
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="4" ry="4" fill="currentColor"/>
                  <text x="12" y="15.5" textAnchor="middle" fontSize="9" fill="rgb(17, 26, 69)" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing="0.5px">in</text>
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
