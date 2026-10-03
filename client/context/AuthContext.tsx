'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { authService } from '@/api/auth.service';
import { STORAGE_KEYS } from '@/constants/storage';
import { ROLE_DEFAULT_ROUTES } from '@/constants/roles';
import { AuthResponseData, LoginPayload, UserProfile } from '@/types/auth';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Khôi phục phiên đăng nhập khi F5 lại trang
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = Cookies.get(STORAGE_KEYS.ACCESS_TOKEN);
      const savedUserData = localStorage.getItem(STORAGE_KEYS.USER_DATA);

      if (savedToken) {
        setToken(savedToken);
        if (savedUserData) {
          try {
            setUser(JSON.parse(savedUserData));
          } catch {
            localStorage.removeItem(STORAGE_KEYS.USER_DATA);
          }
        }

        // Gọi BE xác thực lại tính hợp lệ của token
        try {
          const profile = await authService.getMe();
          setUser(profile);
          localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(profile));
          Cookies.set(STORAGE_KEYS.ROLE, profile.role, { expires: 7, path: '/' });
        } catch {
          // Token hết hạn hoặc không hợp lệ
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (payload: LoginPayload) => {
    const data: AuthResponseData = await authService.login(payload);

    // 1. Lưu Cookie để middleware.ts đọc được ở Server-side
    Cookies.set(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken, { expires: 7, path: '/' });
    Cookies.set(STORAGE_KEYS.ROLE, data.user.role, { expires: 7, path: '/' });

    // 2. Lưu LocalStorage & State ở Client-side
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data.user));
    setToken(data.accessToken);
    setUser(data.user);

    // 3. Tự động chuyển hướng về trang tương ứng với Role
    const targetRoute = ROLE_DEFAULT_ROUTES[data.user.role] || '/';
    router.push(targetRoute);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Bỏ qua lỗi nếu token đã hết hạn hoặc ngắt kết nối mạng
    } finally {
      Cookies.remove(STORAGE_KEYS.ACCESS_TOKEN);
      Cookies.remove(STORAGE_KEYS.ROLE);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      setToken(null);
      setUser(null);
      router.push('/login');
    }
  };


  const refreshUser = async () => {
    try {
      const profile = await authService.getMe();
      setUser(profile);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(profile));
    } catch {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};