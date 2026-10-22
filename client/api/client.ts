// api/client.ts
import axios from 'axios';
import Cookies from 'js-cookie';
import { STORAGE_KEYS } from '@/constants/storage';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// 1. Gắn Token vào Request
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get(STORAGE_KEYS.ACCESS_TOKEN);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Xử lý Response & Chống lặp vô tận (Áp dụng từ project_example)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isLoginPage = typeof window !== 'undefined' && window.location.pathname.startsWith('/login');

    // Chỉ redirect nếu bị 401 VÀ KHÔNG PHẢI đang ở trang /login
    if (status === 401 && !isLoginPage && typeof window !== 'undefined') {
      Cookies.remove(STORAGE_KEYS.ACCESS_TOKEN, { path: '/' });
      Cookies.remove(STORAGE_KEYS.ROLE, { path: '/' });
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      window.location.href = '/login';
    }

    // Chuẩn hóa message lỗi từ Backend ném ra
    const message =
      error.response?.data?.message ||
      error.message ||
      'Đã có lỗi xảy ra, vui lòng thử lại sau';

    return Promise.reject({
      ...error,
      message,
      statusCode: status,
    });
  }
);

export default apiClient;