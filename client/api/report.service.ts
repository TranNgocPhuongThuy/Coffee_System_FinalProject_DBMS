import apiClient from './client';
import { ENDPOINTS } from './endpoints';

export const reportService = {
  getDailyRevenue: async (params?: any) => {
    return apiClient.get(ENDPOINTS.REPORTS.REVENUE, { params });
  },
};

export default reportService;

