import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';

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
  membershipTier: 'STANDARD' | 'SILVER' | 'GOLD' | 'DIAMOND';
  createdAt?: string;
  updatedAt?: string;
  totalPointsEarned?: number;
  totalPointsRedeemed?: number;
}

export const loyaltyService = {
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
    role: 'CASHIER' | 'BARISTA' | 'STOREKEEPER';
    phoneNumber?: string;
  }) => {
    const res = await apiClient.post('/auth/register-employee', payload);
    return res.data;
  },
};

export default loyaltyService;
