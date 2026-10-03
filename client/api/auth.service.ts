import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import {
  AuthResponseData,
  LoginPayload,
  RegisterPayload,
  SetupPasswordPayload,
  UserProfile
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

  setupPassword: async (payload: SetupPasswordPayload): Promise<{ message: string }> => {
    const res = await apiClient.post(ENDPOINTS.AUTH.SETUP_PASSWORD, payload);
    return res.data;
  },

  changePassword: async (payload: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
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
};


export default authService;