import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

export const aiAgentService = {
  // Get all AI agents with pagination and filtering
  getAllAgents: async (params = {}) => {
    try {
      const {
        page = 1,
        limit = 20,
        categoryId = null,
        categoryName = null,
        deliveryMethods: deliveryMethodsParam = null,
        deliveryMethod = null,
        search: searchParam = null,
        q = null,
        searchTerm = null,
        ...otherParams
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      // Search: send multiple param names for backend compatibility
      const searchValue = searchParam ?? q ?? searchTerm;
      if (searchValue != null && String(searchValue).trim() !== '') {
        const s = String(searchValue).trim();
        queryParams.set('search', s);
        queryParams.set('q', s);
        queryParams.set('searchTerm', s);
      }

      // Send category in multiple param variants so backend can filter by id or name (AI Agents, Tools, etc.)
      if (categoryId != null && categoryId !== '') {
        const idStr = String(categoryId);
        queryParams.append('categoryId', idStr);
        queryParams.append('category_id', idStr);
      }
      if (categoryName != null && String(categoryName).trim() !== '') {
        queryParams.append('category', String(categoryName).trim());
        queryParams.append('categoryName', String(categoryName).trim());
      }

      // Delivery method filter: support array (deliveryMethods) or single (deliveryMethod). Send multiple param variants.
      const methods = Array.isArray(deliveryMethodsParam) && deliveryMethodsParam.length > 0
        ? deliveryMethodsParam
        : (deliveryMethod != null && deliveryMethod !== '') ? [deliveryMethod] : [];
      if (methods.length > 0) {
        methods.forEach((m) => {
          const s = String(m).trim();
          if (s) {
            queryParams.append('deliveryMethod', s);
            queryParams.append('delivery_method', s);
            queryParams.append('deliveryType', s);
          }
        });
        queryParams.set('deliveryMethods', methods.map((m) => String(m).trim()).filter(Boolean).join(','));
      }

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

