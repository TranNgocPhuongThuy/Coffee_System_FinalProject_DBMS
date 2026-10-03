// api/pager.service.ts
import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import { PagerStatus } from '@/types/enums';
import { ActivePagerDashboardItem, CreatePagerPayload, PagerDevice } from '@/types';

export const pagerService = {
  getPagers: async (params?: { search?: string; status?: PagerStatus; minBattery?: number; page?: number; limit?: number }) => {
    const res = await apiClient.get(ENDPOINTS.POS.PAGERS.INDEX, { params });
    return res.data;
  },

  getAvailablePagers: async (): Promise<PagerDevice[]> => {
    const res = await apiClient.get(ENDPOINTS.POS.PAGERS.AVAILABLE);
    return res.data?.data || res.data || [];
  },

  getDashboard: async (): Promise<ActivePagerDashboardItem[]> => {
    const res = await apiClient.get(ENDPOINTS.POS.PAGERS.DASHBOARD);
    return res.data?.data || res.data || [];
  },

  getPagerById: async (id: number | string): Promise<PagerDevice> => {
    const res = await apiClient.get(ENDPOINTS.POS.PAGERS.DETAIL(id));
    return res.data?.data || res.data;
  },

  createPager: async (payload: CreatePagerPayload) => {
    const res = await apiClient.post(ENDPOINTS.POS.PAGERS.INDEX, payload);
    return res.data;
  },

  updateStatus: async (id: number | string, status: PagerStatus) => {
    const res = await apiClient.patch(ENDPOINTS.POS.PAGERS.UPDATE_STATUS(id), { status });
    return res.data;
  },

  updateBattery: async (id: number | string, batteryLevel: number) => {
    const res = await apiClient.patch(ENDPOINTS.POS.PAGERS.UPDATE_BATTERY(id), { batteryLevel });
    return res.data;
  },

  releasePager: async (id: number | string) => {
    const res = await apiClient.post(ENDPOINTS.POS.PAGERS.RELEASE(id));
    return res.data;
  },
};

export default pagerService;