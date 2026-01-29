import { useState, useEffect } from 'react';

/**
 * Custom hook to track authentication state
 * Listens to localStorage changes and window focus events
 */
export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const checkAuth = () => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    setIsLoggedIn(!!token);
    
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (_error) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    // Initial check
    checkAuth();

    // Listen for storage changes (works across tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'authToken' || e.key === 'user') {
        checkAuth();
      }
    };

    // Listen for custom auth event (for same-tab updates)
    const handleAuthChange = () => {
      checkAuth();
    };

    // Listen for window focus (refresh auth when user returns to tab)
    const handleFocus = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return { isLoggedIn, user, refreshAuth: checkAuth };
};

// Helper function to trigger auth change event
export const triggerAuthChange = () => {
  window.dispatchEvent(new Event('authChange'));
};

