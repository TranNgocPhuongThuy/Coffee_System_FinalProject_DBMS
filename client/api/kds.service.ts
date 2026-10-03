import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import { KdsQueueItem, UpdateKdsItemStatusPayload } from '@/types/kds';

export const kdsService = {
  // Lấy hàng đợi các món chờ pha chế
  getQueue: async (params?: { status?: 'ALL' | 'PENDING' | 'PREPARING' }): Promise<KdsQueueItem[]> => {
    const res = await apiClient.get(ENDPOINTS.KDS.QUEUE, { params });
    return res.data?.data || res.data || [];
  },

  // SỬA: Gửi đúng trường { itemStatus } mà backend yêu cầu
  updateItemStatus: async (orderDetailId: string | number, payload: UpdateKdsItemStatusPayload) => {
    return apiClient.patch(ENDPOINTS.KDS.UPDATE_ITEM_STATUS(orderDetailId), payload);
  },

  // Rung chuông thẻ rung báo khách đến lấy đồ uống
  notifyOrderReady: async (orderId: string | number) => {
    return apiClient.post(ENDPOINTS.KDS.NOTIFY_ORDER_READY(orderId));
  },
};

export default kdsService;