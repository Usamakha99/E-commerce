import React, { useState, useEffect } from 'react';

const ApiStatus = () => {
  const [status, setStatus] = useState('checking');
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    checkApiStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkApiStatus = async () => {
    const url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    setApiUrl(url);
    
    try {
      // Simple fetch with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 seconds - fail fast
      
      const response = await fetch(`${url}/products`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        setStatus('connected');
      } else {
        setStatus('disconnected');
      }
    } catch (error) {
      // Any error means disconnected - this is safe, won't crash
      setStatus('disconnected');
    }
  };

  if (status === 'checking') {
    return (
      <div className="alert alert-info" role="alert">
        <strong>⏳ Checking API connection...</strong>
      </div>
    );
  }

  if (status === 'connected') {
    return (
      <div className="alert alert-success" role="alert">
        <strong>✅ API Connected!</strong> Loading data from: {apiUrl}
      </div>
    );
  }

  return (
    <div className="alert alert-warning" role="alert">
      <strong>⚠️ API Not Available</strong>
      <p className="mb-0">
        Backend API at <code>{apiUrl}</code> is not responding.
        <br />
        <small>Using demo data for display. Start your backend server to see live data.</small>
      </p>
    </div>
  );
};

export default ApiStatus;
