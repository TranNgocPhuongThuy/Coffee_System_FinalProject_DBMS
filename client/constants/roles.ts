import { UserRole } from '@/types/auth';

export const ROLE_DEFAULT_ROUTES: Record<UserRole, string> = {
    ADMIN: '/dashboard',
    MANAGER: '/dashboard',
    CASHIER: '/pos/terminal',
    BARISTA: '/kds/queue',
    STOREKEEPER: '/dashboard/inventory/ingredients',
    CUSTOMER: '/dashboard/customers',
};

export const ROLE_ROUTE_PERMISSIONS: Record<UserRole, string[]> = {
    ADMIN: ['/dashboard', '/pos', '/kds'],
    MANAGER: ['/dashboard', '/pos', '/kds'],
    CASHIER: ['/pos', '/dashboard/customers'],
    BARISTA: ['/kds', '/pos/pagers'],
    STOREKEEPER: ['/dashboard/inventory'],
    CUSTOMER: ['/dashboard/customers'],
};