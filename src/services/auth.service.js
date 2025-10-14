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
      
      // Store token if login successful
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      }
      
      return response;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Register
  register: async (userData) => {
    try {
      const response = await apiService.post(API_ENDPOINTS.users.register, userData);
      
      // Store token if registration successful
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      }
      
      return response;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
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
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      return await apiService.put(API_ENDPOINTS.users.updateProfile, userData);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
};

export default authService;


