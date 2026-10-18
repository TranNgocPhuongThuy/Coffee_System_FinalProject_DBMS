import { UserRole } from '@/types/auth';

export const ROLE_DEFAULT_ROUTES: Record<UserRole, string> = {
  ADMIN: '/dashboard',
  MANAGER: '/dashboard',
  CASHIER: '/pos/terminal',
  BARISTA: '/kds/queue',
  STOREKEEPER: '/dashboard/inventory/ingredients',
  CUSTOMER: '/menu',
};

export interface RoutePermissionRule {
  path: string;
  exact?: boolean;
  allowedRoles: UserRole[];
}

export const ROUTE_PERMISSION_RULES: RoutePermissionRule[] = [
  // CUSTOMER STOREFRONT
  { path: '/menu', allowedRoles: ['CUSTOMER', 'CASHIER', 'BARISTA', 'STOREKEEPER', 'MANAGER', 'ADMIN'] },
  { path: '/customer', allowedRoles: ['CUSTOMER', 'CASHIER', 'MANAGER', 'ADMIN'] },

  // POS
  { path: '/pos/terminal', allowedRoles: ['MANAGER', 'CASHIER', 'ADMIN'] },
  { path: '/pos/orders', allowedRoles: ['MANAGER', 'CASHIER', 'ADMIN'] },
  { path: '/pos/pagers', allowedRoles: ['MANAGER', 'CASHIER', 'BARISTA', 'ADMIN'] },

  // KDS
  { path: '/kds/queue', allowedRoles: ['MANAGER', 'BARISTA', 'ADMIN'] },

  // DASHBOARD
  { path: '/dashboard/menu', allowedRoles: ['MANAGER', 'ADMIN'] },
  { path: '/dashboard/inventory/ingredients', allowedRoles: ['MANAGER', 'STOREKEEPER', 'ADMIN'] },
  { path: '/dashboard/inventory/boms', allowedRoles: ['MANAGER', 'BARISTA', 'STOREKEEPER', 'ADMIN'] },
  { path: '/dashboard/inventory/imports', allowedRoles: ['MANAGER', 'STOREKEEPER', 'ADMIN'] },
  { path: '/dashboard/inventory/adjustments', allowedRoles: ['MANAGER', 'STOREKEEPER', 'ADMIN'] },
  { path: '/dashboard/customers', allowedRoles: ['MANAGER', 'CASHIER', 'ADMIN'] },
  { path: '/dashboard/reports', allowedRoles: ['MANAGER', 'ADMIN'] },
  { path: '/dashboard/pagers', allowedRoles: ['MANAGER', 'CASHIER', 'BARISTA', 'ADMIN'] },
  { path: '/dashboard', exact: true, allowedRoles: ['MANAGER', 'ADMIN'] },
];

export function isRouteAllowed(pathname: string, role: UserRole): boolean {
  if (pathname.startsWith('/change-password')) return true;
  if (pathname.startsWith('/menu') || pathname.startsWith('/customer')) return true;

  const rule = ROUTE_PERMISSION_RULES.find((r) =>
    r.exact ? pathname === r.path : pathname.startsWith(r.path)
  );

  if (!rule) {
    if (pathname.startsWith('/dashboard')) {
      return role === 'MANAGER' || role === 'ADMIN';
    }
    if (pathname.startsWith('/pos')) {
      return role === 'MANAGER' || role === 'CASHIER' || role === 'ADMIN';
    }
    if (pathname.startsWith('/kds')) {
      return role === 'MANAGER' || role === 'BARISTA' || role === 'ADMIN';
    }
    return false;
  }

  return rule.allowedRoles.includes(role);
}