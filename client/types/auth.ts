import { MembershipTier, UserType } from './enums';

export type UserRole = 'ADMIN' | 'MANAGER' | 'CASHIER' | 'BARISTA' | 'STOREKEEPER' | 'CUSTOMER';
export type { UserType, MembershipTier };



export interface LoginPayload {
    identifier: string;
    password: string;
    userType: UserType;
}

export interface RegisterPayload {
    phoneNumber: string;
    fullName: string;
    password: string;
    confirmPassword: string;
    address?: string;
}

export interface SetupPasswordPayload {
    phoneNumber: string;
    newPassword: string;
    confirmPassword: string;
}

export interface UserProfile {
    id: number;
    fullName: string;
    role: UserRole;
    userType: UserType;
    phoneNumber?: string;
    username?: string;
    rewardPoints?: number;
    membershipTier?: MembershipTier;
    createdAt?: string;
    status?: string;
}

export interface AuthResponseData {
    accessToken: string;
    user: UserProfile;
}