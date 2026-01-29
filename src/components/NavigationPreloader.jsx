import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const NavigationPreloader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Show preloader when location changes
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Show for 1 second during navigation

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isLoading) return null;

  return (
    <div id="navigation-preloader" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="preloader d-flex align-items-center justify-content-center">
        <div className="preloader-inner position-relative">
          <div className="text-center">
            <img 
              className="mb-10" 
              src="/assets/V Cloud Logo final-01.svg" 
              alt="V Cloud" 
              style={{
                width: '150px', 
                height: 'auto',
                animation: 'pulse 2s ease-in-out infinite'
              }} 
            />
            <div className="mt-15" style={{display: 'flex', justifyContent: 'center', gap: '8px'}}>
              <div className="dot" style={{
                width: '10px',
                height: '10px',
                backgroundColor: '#e32726',
                borderRadius: '50%',
                animation: 'bounce 1.4s ease-in-out infinite both',
                animationDelay: '0s'
              }}></div>
              <div className="dot" style={{
                width: '10px',
                height: '10px',
                backgroundColor: '#141b44',
                borderRadius: '50%',
                animation: 'bounce 1.4s ease-in-out infinite both',
                animationDelay: '0.2s'
              }}></div>
              <div className="dot" style={{
                width: '10px',
                height: '10px',
                backgroundColor: '#e32726',
                borderRadius: '50%',
                animation: 'bounce 1.4s ease-in-out infinite both',
                animationDelay: '0.4s'
              }}></div>
              <div className="dot" style={{
                width: '10px',
                height: '10px',
                backgroundColor: '#141b44',
                borderRadius: '50%',
                animation: 'bounce 1.4s ease-in-out infinite both',
                animationDelay: '0.6s'
              }}></div>
              <div className="dot" style={{
                width: '10px',
                height: '10px',
                backgroundColor: '#e32726',
                borderRadius: '50%',
                animation: 'bounce 1.4s ease-in-out infinite both',
                animationDelay: '0.8s'
              }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationPreloader;
