// api/pager.service.ts
import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import { PagerStatus } from '@/types/enums';
import { ActivePagerDashboardItem, CreatePagerPayload, PagerDevice } from '@/types';

export const pagerService = {
  // 1. Lấy danh sách thẻ rung có phân trang & bộ lọc
  getPagers: async (params?: { search?: string; status?: PagerStatus; minBattery?: number; page?: number; limit?: number }) => {
    const res = await apiClient.get(ENDPOINTS.POS.PAGERS.INDEX, { params });
    return res.data;
  },

  // 2. Lấy danh sách thẻ rung sẵn sàng cấp phát (AVAILABLE và Pin >= 15%)
  getAvailablePagers: async (): Promise<PagerDevice[]> => {
    const res = await apiClient.get(ENDPOINTS.POS.PAGERS.AVAILABLE);
    return res.data?.data || res.data || [];
  },

  // 3. Màn hình Dashboard theo dõi thời gian chờ của khách theo thẻ rung
  getDashboard: async (): Promise<ActivePagerDashboardItem[]> => {
    const res = await apiClient.get(ENDPOINTS.POS.PAGERS.DASHBOARD);
    return res.data?.data || res.data || [];
  },

  // 4. Xem chi tiết thẻ rung theo ID
  getPagerById: async (id: number | string): Promise<PagerDevice> => {
    const res = await apiClient.get(ENDPOINTS.POS.PAGERS.DETAIL(id));
    return res.data?.data || res.data;
  },

  // 5. Thêm mới thiết bị thẻ rung
  createPager: async (payload: CreatePagerPayload) => {
    const res = await apiClient.post(ENDPOINTS.POS.PAGERS.INDEX, payload);
    return res.data;
  },

  // 6. Cập nhật thông tin thẻ rung
  updatePager: async (id: number | string, payload: Partial<CreatePagerPayload>) => {
    const res = await apiClient.put(ENDPOINTS.POS.PAGERS.DETAIL(id), payload);
    return res.data;
  },

  // 7. Cập nhật trạng thái thẻ rung (AVAILABLE, IN_USE, CHARGING, MAINTENANCE)
  updateStatus: async (id: number | string, status: PagerStatus) => {
    const res = await apiClient.patch(ENDPOINTS.POS.PAGERS.UPDATE_STATUS(id), { status });
    return res.data;
  },

  // 8. Cập nhật mức Pin của thẻ rung
  updateBattery: async (id: number | string, batteryLevel: number) => {
    const res = await apiClient.patch(ENDPOINTS.POS.PAGERS.UPDATE_BATTERY(id), { batteryLevel });
    return res.data;
  },

  // 9. Thu hồi thẻ rung khi khách trả lại (chuyển về AVAILABLE)
  releasePager: async (id: number | string) => {
    const res = await apiClient.post(ENDPOINTS.POS.PAGERS.RELEASE(id));
    return res.data;
  },

  // 10. Xóa mềm thiết bị thẻ rung (Chặn nếu thẻ đang IN_USE)
  deletePager: async (id: number | string) => {
    const res = await apiClient.delete(ENDPOINTS.POS.PAGERS.DETAIL(id));
    return res.data;
  },
};

export default pagerService;