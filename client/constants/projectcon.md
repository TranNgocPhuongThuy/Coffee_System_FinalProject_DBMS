# Project Dump

**Root:** `C:\Programing\hqtcsdl\Coffee_System_FinalProject_DBMS\client\constants`

**Generated:** 2026-10-18 01:03:29.243296

**Files:** 5 | **Total size:** 19,547 bytes

---

# bocute.webp

| Property | Value |
|----------|-------|
| Path | `bocute.webp` |
| Size | 16,776 bytes |
| Extension | `.webp` |
| Modified | 2026-10-17 21:23:55.034131 |

> **File nhị phân** (đã bỏ qua nội dung)

# index.ts

| Property | Value |
|----------|-------|
| Path | `index.ts` |
| Size | 0 bytes |
| Extension | `.ts` |
| Modified | 2026-10-17 21:23:55.035129 |

```typescript

```

# roles.ts

| Property | Value |
|----------|-------|
| Path | `roles.ts` |
| Size | 2,612 bytes |
| Extension | `.ts` |
| Modified | 2026-10-17 22:07:16.449358 |

```typescript
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
  { path: '/dashboard/inventory/boms', allowedRoles: ['MANAGER', 'BARISTA', 'ADMIN'] },
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
```

# routes.ts

| Property | Value |
|----------|-------|
| Path | `routes.ts` |
| Size | 0 bytes |
| Extension | `.ts` |
| Modified | 2026-10-17 21:23:55.037131 |

```typescript

```

# storage.ts

| Property | Value |
|----------|-------|
| Path | `storage.ts` |
| Size | 159 bytes |
| Extension | `.ts` |
| Modified | 2026-10-17 21:23:55.038130 |

```typescript
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  ROLE: 'user_role',
} as const;
```

