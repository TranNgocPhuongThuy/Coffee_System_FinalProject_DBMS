import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

export const reportService = {
  getDailyRevenue: async (params?: any) => {
    return apiClient.get(API_ENDPOINTS.REPORTS, { params });
  },
};

export default reportService;
