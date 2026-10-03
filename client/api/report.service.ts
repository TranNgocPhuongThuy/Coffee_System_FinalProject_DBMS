// Path: api/report.service.ts
import apiClient from './client';
import { ENDPOINTS } from './endpoints';

export interface DateRangeReportParams {
  fromDate?: string;
  toDate?: string;
}

export const reportService = {
  // Trả về Object tổng quan doanh thu từ View v_DailyRevenue
  getRevenueOverview: async (params?: DateRangeReportParams) => {
    const res = await apiClient.get(ENDPOINTS.REPORTS.REVENUE, { params });
    return res.data?.data || res.data;
  },

  // Giữ alias getDailyRevenue để không làm gãy code của các page cũ
  getDailyRevenue: async (params?: DateRangeReportParams) => {
    const res = await apiClient.get(ENDPOINTS.REPORTS.REVENUE, { params });
    return res.data?.data || res.data;
  },

  getTopProducts: async (params?: { limit?: number; fromDate?: string; toDate?: string }) => {
    const res = await apiClient.get(ENDPOINTS.REPORTS.TOP_PRODUCTS, { params });
    return res.data?.data || res.data || [];
  },

  getLowStockAlert: async () => {
    const res = await apiClient.get(ENDPOINTS.REPORTS.LOW_STOCK);
    return res.data?.data || res.data || [];
  },
};

export default reportService;