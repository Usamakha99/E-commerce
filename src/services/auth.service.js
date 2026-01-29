import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

export const authService = {
  // Login
  login: async (email, password) => {
    try {
      const response = await apiService.post(API_ENDPOINTS.users.login, {
        email,
        password,
      });
      
      // Handle nested response structure from backend
      // Backend sends: { data: { accessToken, user } }
      const token = response.data?.accessToken || response.accessToken || response.token;
      const user = response.data?.user || response.user;
      
      // Store token if login successful
      if (token) {
        localStorage.setItem('authToken', token);
        
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        // ✅ Trigger auth change event
        window.dispatchEvent(new Event('authChange'));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Register (Initiate - sends verification email)
  register: async (userData) => {
    try {
      const response = await apiService.post(API_ENDPOINTS.users.register, userData);
      
      // Handle nested response structure
      const token = response.data?.accessToken || response.accessToken || response.token;
      const user = response.data?.user || response.user;
      
      // Note: Token may not be provided until email is verified
      // Only store token if backend sends it immediately
      if (token) {
        localStorage.setItem('authToken', token);
        
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        // ✅ Trigger auth change event
        window.dispatchEvent(new Event('authChange'));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Verify Email
  verifyEmail: async (email, code, token = null) => {
    try {
      const requestData = {
        email: email,
        verificationCode: code,
        code: code, // Alias in case backend expects 'code'
      };
      
      // Add token in multiple formats (backend might use different field name)
      if (token) {
        requestData.token = token;
        requestData.verificationToken = token;
      }
      
      const response = await apiService.post('/users/verify-email', requestData);
      
      // Handle nested response structure
      const authToken = response.data?.accessToken || response.accessToken || response.token;
      const userData = response.data?.user || response.user;
      
      // Store token after successful verification
      if (authToken) {
        localStorage.setItem('authToken', authToken);
        
        if (userData) {
          localStorage.setItem('user', JSON.stringify(userData));
        }
        
        // ✅ Trigger auth change event
        window.dispatchEvent(new Event('authChange'));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Resend Verification Code
  resendVerificationCode: async (email) => {
    try {
      const response = await apiService.post('/users/resend-verification', {
        email,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // ✅ Trigger auth change event
    window.dispatchEvent(new Event('authChange'));
    
    window.location.href = '/';
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Get user profile
  getProfile: async () => {
    try {
      return await apiService.get(API_ENDPOINTS.users.profile);
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      return await apiService.put(API_ENDPOINTS.users.updateProfile, userData);
    } catch (error) {
      throw error;
    }
  },
};

export default authService;


