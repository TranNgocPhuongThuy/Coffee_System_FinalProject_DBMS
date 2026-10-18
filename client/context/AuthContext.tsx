'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { authService } from '@/api/auth.service';
import { STORAGE_KEYS } from '@/constants/storage';
import { ROLE_DEFAULT_ROUTES } from '@/constants/roles';
import { AuthResponseData, LoginPayload, UserProfile, UserRole } from '@/types/auth';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (payload: LoginPayload, redirectUrl?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // 1. Khai báo logout TRƯỚC useEffect và bọc useCallback để tránh lỗi TDZ
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Bỏ qua lỗi nếu token đã hết hạn hoặc ngắt kết nối mạng
    } finally {
      Cookies.remove(STORAGE_KEYS.ACCESS_TOKEN, { path: '/' });
      Cookies.remove(STORAGE_KEYS.ROLE, { path: '/' });
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      setToken(null);
      setUser(null);
      router.push('/login');
    }
  }, [router]);

  // 2. Khôi phục phiên đăng nhập khi F5 lại trang
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

        // Gọi Backend xác thực lại tính hợp lệ của token
        try {
          const profile = await authService.getMe();
          setUser(profile);
          localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(profile));
          Cookies.set(STORAGE_KEYS.ROLE, profile.role, { expires: 7, path: '/' });
        } catch {
          // Token hết hạn hoặc không hợp lệ -> Xóa phiên sạch sẽ
          await logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [logout]);

  const login = async (payload: LoginPayload, redirectUrl?: string) => {
    const data: AuthResponseData = await authService.login(payload);

    // 1. Lưu Cookie để middleware.ts đọc được ở Server-side (path: '/')
    Cookies.set(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken, { expires: 7, path: '/' });
    Cookies.set(STORAGE_KEYS.ROLE, data.user.role, { expires: 7, path: '/' });

    // 2. Lưu LocalStorage & State ở Client-side
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data.user));
    setToken(data.accessToken);
    setUser(data.user);

    // 3. Tự động chuyển hướng về callbackUrl hoặc trang mặc định theo Role
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const callbackUrl = redirectUrl || urlParams?.get('callbackUrl') || urlParams?.get('redirect');
    if (callbackUrl && callbackUrl.startsWith('/') && !callbackUrl.startsWith('//')) {
      router.push(callbackUrl);
    } else {
      const targetRoute = ROLE_DEFAULT_ROUTES[data.user.role] || '/dashboard';
      router.push(targetRoute);
    }
  };

  const refreshUser = async () => {
    try {
      const profile = await authService.getMe();
      setUser(profile);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(profile));
      Cookies.set(STORAGE_KEYS.ROLE, profile.role, { expires: 7, path: '/' });
    } catch {
      await logout();
    }
  };

  // Helper hàm cho các thành viên kiểm tra quyền trên giao diện
  const hasRole = (...roles: UserRole[]): boolean => {
    if (!user) return false;
    if (user.role === 'ADMIN') return true;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        refreshUser,
        hasRole,
      }}
    >
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