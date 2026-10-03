import apiClient from './client';
import { ENDPOINTS } from './endpoints';

export const reportService = {
  getDailyRevenue: async (params?: any) => {
    const res = await apiClient.get(ENDPOINTS.REPORTS.REVENUE, { params });
    return res.data?.data || res.data || [];
  },
  getTopProducts: async (params?: any) => {
    const res = await apiClient.get(ENDPOINTS.REPORTS.TOP_PRODUCTS, { params });
    return res.data?.data || res.data || [];
  },
  getLowStockAlert: async () => {
    const res = await apiClient.get(ENDPOINTS.REPORTS.LOW_STOCK);
    return res.data?.data || res.data || [];
  },
};

export default reportService;


