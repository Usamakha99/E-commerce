import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

export const aiAgentService = {
  // Get all AI agents with pagination and filtering
  getAllAgents: async (params = {}) => {
    try {
      // Default pagination params
      const {
        page = 1,
        limit = 20,
        categoryId = null,
        ...otherParams
      } = params;

      // Build query string
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (categoryId) {
        queryParams.append('categoryId', categoryId.toString());
      }

      // Add any other query parameters
      Object.keys(otherParams).forEach((key) => {
        if (otherParams[key] !== null && otherParams[key] !== undefined) {
          queryParams.append(key, otherParams[key].toString());
        }
      });

      const url = `${API_ENDPOINTS.aiAgents.getAll}?${queryParams.toString()}`;
      return await apiService.get(url);
    } catch (error) {
      throw error;
    }
  },

  // Get single AI agent by ID
  getAgentById: async (id) => {
    try {
      return await apiService.get(API_ENDPOINTS.aiAgents.getById(id));
    } catch (error) {
      throw error;
    }
  },

  // Create a new AI agent
  createAgent: async (agentData) => {
    try {
      return await apiService.post(API_ENDPOINTS.aiAgents.create, agentData);
    } catch (error) {
      throw error;
    }
  },

  // Update an existing AI agent
  updateAgent: async (id, agentData) => {
    try {
      return await apiService.put(API_ENDPOINTS.aiAgents.update(id), agentData);
    } catch (error) {
      throw error;
    }
  },

  // Delete an AI agent
  deleteAgent: async (id) => {
    try {
      return await apiService.delete(API_ENDPOINTS.aiAgents.delete(id));
    } catch (error) {
      throw error;
    }
  },

  // Get categories with counts
  getCategoriesWithCounts: async () => {
    try {
      return await apiService.get(API_ENDPOINTS.aiAgents.categoriesWithCounts);
    } catch (error) {
      throw error;
    }
  },
};

export default aiAgentService;

