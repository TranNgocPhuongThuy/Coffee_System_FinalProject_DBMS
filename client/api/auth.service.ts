import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

export const authService = {
  login: async (payload: any) => {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, payload);
  },
  register: async (payload: any) => {
    return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, payload);
  },
  setupPassword: async (payload: any) => {
    return apiClient.post(API_ENDPOINTS.AUTH.SETUP_PASSWORD, payload);
  },
  changePassword: async (payload: any) => {
    return apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, payload);
  },
};

export default authService;
