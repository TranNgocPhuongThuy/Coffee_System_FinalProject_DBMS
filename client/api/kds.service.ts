import apiClient from './client';
import { ENDPOINTS } from './endpoints';

export const kdsService = {
  getQueue: async () => {
    return apiClient.get(ENDPOINTS.KDS.QUEUE);
  },
  updateItemStatus: async (itemId: string | number, status: string) => {
    return apiClient.patch(ENDPOINTS.KDS.UPDATE_ITEM_STATUS(itemId), { status });
  },
};

export default kdsService;

