import apiClient from './api.service';

/**
 * Payment Service
 * Handles all payment-related API calls
 */
const paymentService = {
  /**
   * Create a payment intent
   * @param {Object} paymentData - Payment information
   * @param {number} paymentData.amount - Amount in cents
   * @param {string} paymentData.currency - Currency code (e.g., 'usd')
   * @param {Array} paymentData.items - Cart items
   * @param {Object} paymentData.metadata - Additional metadata
   * @returns {Promise} Payment intent response
   */
  createPaymentIntent: async (paymentData) => {
    try {
      const response = await apiClient.post('/payments/create-intent', paymentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Confirm a payment
   * @param {string} paymentIntentId - Payment intent ID
   * @returns {Promise} Payment confirmation response
   */
  confirmPayment: async (paymentIntentId) => {
    try {
      const response = await apiClient.post(`/payments/confirm/${paymentIntentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get payment status
   * @param {string} paymentIntentId - Payment intent ID
   * @returns {Promise} Payment status response
   */
  getPaymentStatus: async (paymentIntentId) => {
    try {
      const response = await apiClient.get(`/payments/status/${paymentIntentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create an order after successful payment
   * @param {Object} orderData - Order information
   * @returns {Promise} Order creation response
   */
  createOrder: async (orderData) => {
    try {
      const response = await apiClient.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default paymentService;

