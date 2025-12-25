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
      console.error('Error fetching AI agents:', error);
      throw error;
    }
  },

  // Get single AI agent by ID
  getAgentById: async (id) => {
    try {
      return await apiService.get(API_ENDPOINTS.aiAgents.getById(id));
    } catch (error) {
      console.error(`Error fetching AI agent ${id}:`, error);
      throw error;
    }
  },

  // Create a new AI agent
  createAgent: async (agentData) => {
    try {
      return await apiService.post(API_ENDPOINTS.aiAgents.create, agentData);
    } catch (error) {
      console.error('Error creating AI agent:', error);
      throw error;
    }
  },

  // Update an existing AI agent
  updateAgent: async (id, agentData) => {
    try {
      return await apiService.put(API_ENDPOINTS.aiAgents.update(id), agentData);
    } catch (error) {
      console.error(`Error updating AI agent ${id}:`, error);
      throw error;
    }
  },

  // Delete an AI agent
  deleteAgent: async (id) => {
    try {
      return await apiService.delete(API_ENDPOINTS.aiAgents.delete(id));
    } catch (error) {
      console.error(`Error deleting AI agent ${id}:`, error);
      throw error;
    }
  },
};

export default aiAgentService;

