import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import {
  CreateOrderPayload,
  FilterOrderParams,
  OrderItemResponse,
} from '@/types/pos';

export const posService = {
  // Lấy danh sách đơn hàng có phân trang & lọc
  getOrders: async (params?: FilterOrderParams) => {
    const res = await apiClient.get(ENDPOINTS.POS.ORDERS.INDEX, {
      params: {
        ...params,
        _t: Date.now(), // Timestamp đảm bảo URL luôn luôn mới, ép kéo dữ liệu trực tiếp từ SQL Server
      },
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
    });
    return res.data;
  },

  // Chi tiết đơn hàng
  getOrderById: async (id: number | string): Promise<OrderItemResponse> => {
    const res = await apiClient.get(ENDPOINTS.POS.ORDERS.DETAIL(id));
    return res.data?.data || res.data;
  },

  // Chi tiết hóa đơn in ấn (Snapshot)
  getInvoice: async (id: number | string) => {
    const res = await apiClient.get(ENDPOINTS.POS.ORDERS.INVOICE(id));
    return res.data?.data || res.data;
  },

  // Tạo đơn hàng tại quầy POS
  createOrder: async (payload: CreateOrderPayload) => {
    const res = await apiClient.post(ENDPOINTS.POS.ORDERS.INDEX, payload);
    return res.data;
  },

  // Thanh toán đơn hàng
  completePayment: async (id: number | string, paymentMethod: string) => {
    const res = await apiClient.patch(ENDPOINTS.POS.ORDERS.PAY(id), { paymentMethod });
    return res.data;
  },

  // Hủy đơn hàng
  cancelOrder: async (id: number | string, cancelReason: string, employeeId: number) => {
    const res = await apiClient.patch(ENDPOINTS.POS.ORDERS.CANCEL(id), {
      cancelReason,
      employeeId,
    });
    return res.data;
  },

  // Đổi điểm giảm giá
  applyLoyaltyPoints: async (
    orderId: number | string,
    customerId: number,
    pointsToRedeem: number,
    conversionRate: number = 1000
  ) => {
    const res = await apiClient.post(ENDPOINTS.POS.ORDERS.APPLY_POINTS(orderId), {
      customerId,
      pointsToRedeem,
      conversionRate,
    });
    return res.data;
  },

  // Xóa một món khỏi đơn chưa hoàn tất
  removeOrderItem: async (detailId: number | string) => {
    const res = await apiClient.delete(ENDPOINTS.POS.ORDERS.REMOVE_ITEM(detailId));
    return res.data;
  },
};

export default posService;