import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

export const kdsService = {
  getQueue: async () => {
    return apiClient.get(API_ENDPOINTS.KDS);
  },
  updateItemStatus: async (itemId: string, status: string) => {
    return apiClient.patch(`${API_ENDPOINTS.KDS}/${itemId}`, { status });
  },
};

export default kdsService;
