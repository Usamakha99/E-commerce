import React, { useEffect, useState } from 'react';

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div id="preloader-active">
      <div className="preloader d-flex align-items-center justify-content-center">
        <div className="preloader-inner position-relative">
          <div className="text-center">
            <img className="mb-10" src="/src/assets/V Cloud Logo final-01.svg" alt="V Cloud" style={{width: '200px', height: 'auto'}} />
            <div className="mt-15" style={{display: 'flex', justifyContent: 'center', gap: '8px'}}>
              <div className="dot" style={{
                width: '12px',
                height: '12px',
                backgroundColor: '#e32726',
                borderRadius: '50%',
                animation: 'bounce 1.4s ease-in-out infinite both',
                animationDelay: '0s'
              }}></div>
              <div className="dot" style={{
                width: '12px',
                height: '12px',
                backgroundColor: '#141b44',
                borderRadius: '50%',
                animation: 'bounce 1.4s ease-in-out infinite both',
                animationDelay: '0.2s'
              }}></div>
              <div className="dot" style={{
                width: '12px',
                height: '12px',
                backgroundColor: '#e32726',
                borderRadius: '50%',
                animation: 'bounce 1.4s ease-in-out infinite both',
                animationDelay: '0.4s'
              }}></div>
              <div className="dot" style={{
                width: '12px',
                height: '12px',
                backgroundColor: '#141b44',
                borderRadius: '50%',
                animation: 'bounce 1.4s ease-in-out infinite both',
                animationDelay: '0.6s'
              }}></div>
              <div className="dot" style={{
                width: '12px',
                height: '12px',
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

export default Preloader;
