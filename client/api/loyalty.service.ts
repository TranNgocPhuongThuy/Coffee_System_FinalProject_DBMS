// Path: api/customer-loyalty/loyalty.service.ts
import apiClient from "./client";
import { ENDPOINTS } from "./endpoints";

export interface CustomerFilterParams {
  search?: string;
  membershipTier?: string;
  page?: number;
  limit?: number;
}

export interface CustomerItem {
  id: number;
  fullName: string;
  phoneNumber: string;
  rewardPoints: number;
  membershipTier: "STANDARD" | "SILVER" | "GOLD" | "DIAMOND";
  createdAt?: string;
  updatedAt?: string;
  totalPointsEarned?: number;
  totalPointsRedeemed?: number;
}

export interface LoyaltyHistoryFilterParams {
  customerId?: number;
  orderId?: number;
  transactionType?: 'EARN' | 'REDEEM';
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export interface AdjustPointsPayload {
  customerId: number;
  orderId?: number | null;
  transactionType: 'EARN' | 'REDEEM';
  points: number;
  description?: string;
}

export const loyaltyService = {
  // 1. Quản lý Khách hàng
  getCustomers: async (params?: CustomerFilterParams) => {
    const res = await apiClient.get(ENDPOINTS.CUSTOMER_LOYALTY.CUSTOMERS.INDEX, { params });
    return res.data;
  },

  getCustomerById: async (id: number | string) => {
    const res = await apiClient.get(ENDPOINTS.CUSTOMER_LOYALTY.CUSTOMERS.DETAIL(id));
    return res.data?.data || res.data;
  },

  createCustomer: async (payload: { fullName: string; phoneNumber: string; password?: string }) => {
    const res = await apiClient.post(ENDPOINTS.CUSTOMER_LOYALTY.CUSTOMERS.INDEX, payload);
    return res.data;
  },

  updateCustomer: async (id: number | string, payload: { fullName?: string; phoneNumber?: string; password?: string }) => {
    const res = await apiClient.put(ENDPOINTS.CUSTOMER_LOYALTY.CUSTOMERS.DETAIL(id), payload);
    return res.data;
  },

  deleteCustomer: async (id: number | string) => {
    const res = await apiClient.delete(ENDPOINTS.CUSTOMER_LOYALTY.CUSTOMERS.DETAIL(id));
    return res.data;
  },

  assignEmployeeRole: async (payload: {
    fullName: string;
    username: string;
    password: string;
    role: "CASHIER" | "BARISTA" | "STOREKEEPER";
    phoneNumber?: string;
  }) => {
    const res = await apiClient.post(ENDPOINTS.AUTH.EMPLOYEES, payload);
    return res.data;
  },

  // 2. Nghiệp vụ Điểm thưởng (Bổ sung mới)
  getLoyaltyHistory: async (params?: LoyaltyHistoryFilterParams) => {
    const res = await apiClient.get(ENDPOINTS.CUSTOMER_LOYALTY.TRANSACTIONS.HISTORY, { params });
    return res.data?.data || res.data;
  },

  adjustPoints: async (payload: AdjustPointsPayload) => {
    const res = await apiClient.post(ENDPOINTS.CUSTOMER_LOYALTY.TRANSACTIONS.ADJUST, payload);
    return res.data;
  },
};

export default loyaltyService;