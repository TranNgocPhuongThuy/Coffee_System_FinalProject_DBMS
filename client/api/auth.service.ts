import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import {
  AuthResponseData,
  ChangePasswordPayload,
  CreateEmployeePayload,
  LoginPayload,
  RegisterPayload,
  UserProfile,
} from '@/types/auth';

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponseData> => {
    const res = await apiClient.post(ENDPOINTS.AUTH.LOGIN, payload);
    return res.data?.data || res.data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponseData> => {
    const res = await apiClient.post(ENDPOINTS.AUTH.REGISTER, payload);
    return res.data?.data || res.data;
  },

  changePassword: async (payload: ChangePasswordPayload) => {
    const res = await apiClient.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, payload);
    return res.data;
  },

  getMe: async (): Promise<UserProfile> => {
    const res = await apiClient.get(ENDPOINTS.AUTH.ME);
    return res.data?.data || res.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const res = await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
    return res.data;
  },

  // Quản lý tạo nhân viên mới
  createEmployee: async (payload: CreateEmployeePayload) => {
    const res = await apiClient.post(ENDPOINTS.AUTH.EMPLOYEES, payload);
    return res.data;
  },

  // Quản lý cập nhật quyền nhân viên
  updateEmployeeRole: async (id: number, role: string) => {
    const res = await apiClient.patch(ENDPOINTS.AUTH.UPDATE_EMPLOYEE_ROLE(id), { role });
    return res.data;
  },

  setupPassword: async (payload: { phoneNumber: string; newPassword: string; confirmPassword: string }) => {
    const res = await apiClient.post(ENDPOINTS.AUTH.REGISTER, {
      fullName: 'Khách hàng',
      phoneNumber: payload.phoneNumber,
      password: payload.newPassword,
      confirmPassword: payload.confirmPassword,
    });
    return res.data?.data || res.data;
  },
};

export default authService;