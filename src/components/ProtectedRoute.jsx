import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Wraps routes that require authentication.
 * Redirects to /login if not logged in, preserving the intended URL for redirect after login.
 */
export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
