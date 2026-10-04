// Path: types/auth.ts
import { UserType } from './enums';
export type { UserType };

export type UserRole = 'ADMIN' | 'MANAGER' | 'CASHIER' | 'BARISTA' | 'STOREKEEPER' | 'CUSTOMER';

// Đăng nhập chung chuẩn Backend (2 trường)
export interface LoginPayload {
  identifier: string; // Tên đăng nhập (nhân viên) hoặc SĐT (khách hàng)
  password: string;
}

// Đăng ký khách hàng
export interface RegisterPayload {
  fullName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  address?: string;
}

export interface SetupPasswordPayload {
  phoneNumber: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserProfile {
  id: number;
  fullName: string;
  role: UserRole;
  userType: UserType;
  username?: string;
  phoneNumber?: string;
  rewardPoints?: number;
  membershipTier?: 'STANDARD' | 'SILVER' | 'GOLD' | 'DIAMOND';
}

export interface AuthResponseData {
  accessToken: string;
  user: UserProfile;
}

export interface CreateEmployeePayload {
  fullName: string;
  username: string;
  password: string;
  role: 'ADMIN' | 'MANAGER' | 'CASHIER' | 'BARISTA' | 'STOREKEEPER';
  phoneNumber?: string;
}