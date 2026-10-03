# Project Dump

**Root:** `C:\Programing\hqtcsdl\Coffee_System_FinalProject_DBMS\client`

**Generated:** 2026-10-03 18:47:07.561999

**Files:** 135 | **Total size:** 629,861 bytes

---

# api\auth.service.ts

| Property | Value |
|----------|-------|
| Path | `api\auth.service.ts` |
| Size | 1,382 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 18:43:15.288731 |

```typescript
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
```

# api\client.ts

| Property | Value |
|----------|-------|
| Path | `api\client.ts` |
| Size | 954 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 18:43:15.289724 |

```typescript
import axios from 'axios';
import Cookies from 'js-cookie';
import { STORAGE_KEYS } from '@/constants/storage';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = Cookies.get(STORAGE_KEYS.ACCESS_TOKEN);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      Cookies.remove(STORAGE_KEYS.ACCESS_TOKEN);
      Cookies.remove(STORAGE_KEYS.ROLE);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

# api\customer-loyalty\customer.service.ts

| Property | Value |
|----------|-------|
| Path | `api\customer-loyalty\customer.service.ts` |
| Size | 0 bytes |
| Extension | `.ts` |
| Modified | 2026-10-02 08:51:08.701681 |

```typescript

```

# api\customer-loyalty\loyalty.service.ts

| Property | Value |
|----------|-------|
| Path | `api\customer-loyalty\loyalty.service.ts` |
| Size | 1,899 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 18:43:15.290720 |

```typescript
import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';

export interface CustomerFilterParams {
  search?: string;
  membershipTier?: string;
  page?: number;
  limit?: number;
}

export interface CustomerItem {
  id: number;
  fullName: string;
  phoneNumber: string;
  rewardPoints: number;
  membershipTier: 'STANDARD' | 'SILVER' | 'GOLD' | 'DIAMOND';
  createdAt?: string;
  updatedAt?: string;
  totalPointsEarned?: number;
  totalPointsRedeemed?: number;
}

export const loyaltyService = {
  getCustomers: async (params?: CustomerFilterParams) => {
    const res = await apiClient.get(ENDPOINTS.CUSTOMER_LOYALTY.CUSTOMERS.INDEX, { params });
    return res.data;
  },

  getCustomerById: async (id: number | string) => {
    const res = await apiClient.get(ENDPOINTS.CUSTOMER_LOYALTY.CUSTOMERS.DETAIL(id));
    return res.data?.data || res.data;
  },

  createCustomer: async (payload: { fullName: string; phoneNumber: string; password?: string }) => {
    const res = await apiClient.post(ENDPOINTS.CUSTOMER_LOYALTY.CUSTOMERS.INDEX, payload);
    return res.data;
  },

  updateCustomer: async (id: number | string, payload: { fullName?: string; phoneNumber?: string; password?: string }) => {
    const res = await apiClient.put(ENDPOINTS.CUSTOMER_LOYALTY.CUSTOMERS.DETAIL(id), payload);
    return res.data;
  },

  deleteCustomer: async (id: number | string) => {
    const res = await apiClient.delete(ENDPOINTS.CUSTOMER_LOYALTY.CUSTOMERS.DETAIL(id));
    return res.data;
  },

  assignEmployeeRole: async (payload: {
    fullName: string;
    username: string;
    password: string;
    role: 'CASHIER' | 'BARISTA' | 'STOREKEEPER';
    phoneNumber?: string;
  }) => {
    const res = await apiClient.post('/auth/register-employee', payload);
    return res.data;
  },
};

export default loyaltyService;

```

# api\endpoints.ts

| Property | Value |
|----------|-------|
| Path | `api\endpoints.ts` |
| Size | 3,058 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 18:43:15.291721 |

```typescript
export const ENDPOINTS = {
  // AUTH
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    SETUP_PASSWORD: '/auth/setup-password',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
    CHANGE_PASSWORD: '/auth/change-password',
  },


  // POS
  POS: {
    ORDERS: {
      INDEX: '/pos/orders',
      DETAIL: (id: string | number) => `/pos/orders/${id}`,
      INVOICE: (id: string | number) => `/pos/orders/${id}/invoice`,
      PAY: (id: string | number) => `/pos/orders/${id}/pay`,
      CANCEL: (id: string | number) => `/pos/orders/${id}/cancel`,
      APPLY_POINTS: (id: string | number) => `/pos/orders/${id}/apply-points`,
      REMOVE_ITEM: (detailId: string | number) => `/pos/orders/items/${detailId}`,
    },
    PAGERS: {
      INDEX: '/pos/pagers',
      AVAILABLE: '/pos/pagers/available',
      DASHBOARD: '/pos/pagers/dashboard',
      DETAIL: (id: string | number) => `/pos/pagers/${id}`,
      RELEASE: (id: string | number) => `/pos/pagers/${id}/release`,
      UPDATE_BATTERY: (id: string | number) => `/pos/pagers/${id}/battery`,
      UPDATE_STATUS: (id: string | number) => `/pos/pagers/${id}/status`,
    },
  },

  // MENU
  MENU: {
    CATEGORIES: {
      INDEX: '/menu/categories',
      DETAIL: (id: string | number) => `/menu/categories/${id}`,
    },
    PRODUCTS: {
      INDEX: '/menu/products',
      DETAIL: (id: string | number) => `/menu/products/${id}`,
    },
    TOPPINGS: {
      INDEX: '/menu/toppings',
      DETAIL: (id: string | number) => `/menu/toppings/${id}`,
    },
  },

  // INVENTORY
  INVENTORY: {
    INGREDIENTS: {
      INDEX: '/inventory/ingredients',
      DETAIL: (id: string | number) => `/inventory/ingredients/${id}`,
    },
    BOMS: {
      RECIPES: '/inventory/boms/recipes',
      TOPPING: (toppingId: string | number) => `/inventory/boms/toppings/${toppingId}`,
      TOPPINGS: '/inventory/boms/toppings',
      DELETE_RECIPE: (variantId: string | number, ingredientId: string | number) =>
        `/inventory/boms/recipes/${variantId}/${ingredientId}`,
    },
    IMPORTS: {
      INDEX: '/inventory/imports',
      DETAIL: (importId: string | number) => `/inventory/imports/${importId}`,
    },
    ADJUSTMENTS: {
      INDEX: '/inventory/adjustments',
    },
  },

  // KDS
  KDS: {
    QUEUE: '/kds/queue',
    UPDATE_ITEM_STATUS: (orderDetailId: string | number) =>
      `/kds/items/${orderDetailId}/status`,
    NOTIFY_ORDER_READY: (orderId: string | number) =>
      `/kds/orders/${orderId}/notify-ready`,
  },

  // CUSTOMER & LOYALTY
  CUSTOMER_LOYALTY: {
    CUSTOMERS: {
      INDEX: '/loyalty/customers',
      DETAIL: (id: string | number) => `/loyalty/customers/${id}`,
    },
    TRANSACTIONS: {
      HISTORY: '/loyalty/transactions/history',
      ADJUST: '/loyalty/transactions/adjust',
    },
  },


  // REPORTS
  REPORTS: {
    REVENUE: '/reports/revenue',
    TOP_PRODUCTS: '/reports/top-products',
    LOW_STOCK: '/reports/low-stock',
  },
} as const;
```

# api\inventory\adjustment.service.ts

| Property | Value |
|----------|-------|
| Path | `api\inventory\adjustment.service.ts` |
| Size | 0 bytes |
| Extension | `.ts` |
| Modified | 2026-10-02 08:51:08.703693 |

```typescript

```

# api\inventory\bom.service.ts

| Property | Value |
|----------|-------|
| Path | `api\inventory\bom.service.ts` |
| Size | 0 bytes |
| Extension | `.ts` |
| Modified | 2026-10-02 08:51:08.704035 |

```typescript

```

# api\inventory\import.service.ts

| Property | Value |
|----------|-------|
| Path | `api\inventory\import.service.ts` |
| Size | 0 bytes |
| Extension | `.ts` |
| Modified | 2026-10-02 08:51:08.704700 |

```typescript

```

# api\inventory\ingredient.service.ts

| Property | Value |
|----------|-------|
| Path | `api\inventory\ingredient.service.ts` |
| Size | 0 bytes |
| Extension | `.ts` |
| Modified | 2026-10-02 08:51:08.705678 |

```typescript

```

# api\inventory.service.ts

| Property | Value |
|----------|-------|
| Path | `api\inventory.service.ts` |
| Size | 2,521 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 18:43:15.292721 |

```typescript
import apiClient from './client';
import { ENDPOINTS } from './endpoints';

export const inventoryService = {
  // Ingredients
  getIngredients: async () => {
    const res = await apiClient.get(ENDPOINTS.INVENTORY.INGREDIENTS.INDEX);
    return res.data?.items || res.data?.data || res.data || [];
  },
  createIngredient: async (payload: any) => {
    const res = await apiClient.post(ENDPOINTS.INVENTORY.INGREDIENTS.INDEX, payload);
    return res.data;
  },
  updateIngredient: async (id: string | number, payload: any) => {
    const res = await apiClient.put(ENDPOINTS.INVENTORY.INGREDIENTS.DETAIL(id), payload);
    return res.data;
  },
  deleteIngredient: async (id: string | number) => {
    const res = await apiClient.delete(ENDPOINTS.INVENTORY.INGREDIENTS.DETAIL(id));
    return res.data;
  },

  // BOMs
  getRecipeBOMs: async () => {
    const res = await apiClient.get(ENDPOINTS.INVENTORY.BOMS.RECIPES);
    return res.data?.items || res.data?.data || res.data || [];
  },
  getToppingBOMs: async () => {
    const res = await apiClient.get(ENDPOINTS.INVENTORY.BOMS.TOPPINGS);
    return res.data?.items || res.data?.data || res.data || [];
  },
  addRecipeBOMItem: async (payload: any) => {
    const res = await apiClient.post(ENDPOINTS.INVENTORY.BOMS.RECIPES, payload);
    return res.data;
  },
  deleteRecipeBOMItem: async (variantId: string | number, ingredientId: string | number) => {
    const res = await apiClient.delete(ENDPOINTS.INVENTORY.BOMS.DELETE_RECIPE(variantId, ingredientId));
    return res.data;
  },

  // Imports
  getImports: async () => {
    const res = await apiClient.get(ENDPOINTS.INVENTORY.IMPORTS.INDEX);
    return res.data?.items || res.data?.data || res.data || [];
  },
  getImportDetail: async (importId: string | number) => {
    const res = await apiClient.get(ENDPOINTS.INVENTORY.IMPORTS.DETAIL(importId));
    return res.data?.data || res.data;
  },
  createImportTicket: async (payload: any) => {
    const res = await apiClient.post(ENDPOINTS.INVENTORY.IMPORTS.INDEX, payload);
    return res.data;
  },

  // Adjustments
  getAdjustments: async () => {
    const res = await apiClient.get(ENDPOINTS.INVENTORY.ADJUSTMENTS.INDEX);
    return res.data?.items || res.data?.data || res.data || [];
  },
  createAdjustment: async (payload: any) => {
    const res = await apiClient.post(ENDPOINTS.INVENTORY.ADJUSTMENTS.INDEX, payload);
    return res.data;
  },
};

export default inventoryService;

```

# api\kds.service.ts

| Property | Value |
|----------|-------|
| Path | `api\kds.service.ts` |
| Size | 388 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 18:43:15.295728 |

```typescript
import apiClient from './client';
import { ENDPOINTS } from './endpoints';

export const kdsService = {
  getQueue: async () => {
    return apiClient.get(ENDPOINTS.KDS.QUEUE);
  },
  updateItemStatus: async (itemId: string | number, status: string) => {
    return apiClient.patch(ENDPOINTS.KDS.UPDATE_ITEM_STATUS(itemId), { status });
  },
};

export default kdsService;


```

# api\menu\category.service.ts

| Property | Value |
|----------|-------|
| Path | `api\menu\category.service.ts` |
| Size | 0 bytes |
| Extension | `.ts` |
| Modified | 2026-10-02 08:51:08.706679 |

```typescript

```

# api\menu\product.service.ts

| Property | Value |
|----------|-------|
| Path | `api\menu\product.service.ts` |
| Size | 0 bytes |
| Extension | `.ts` |
| Modified | 2026-10-02 08:51:08.709083 |

```typescript

```

# api\menu\topping.service.ts

| Property | Value |
|----------|-------|
| Path | `api\menu\topping.service.ts` |
| Size | 0 bytes |
| Extension | `.ts` |
| Modified | 2026-10-02 08:51:08.709680 |

```typescript

```

# api\menu.service.ts

| Property | Value |
|----------|-------|
| Path | `api\menu.service.ts` |
| Size | 2,562 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 18:43:15.297721 |

```typescript
import apiClient from './client';
import { ENDPOINTS } from './endpoints';

export const menuService = {
  // Categories
  getCategories: async () => {
    const res = await apiClient.get(ENDPOINTS.MENU.CATEGORIES.INDEX);
    return res.data?.items || res.data?.data || res.data || [];
  },
  createCategory: async (payload: { name: string; displayOrder?: number; status?: string }) => {
    const res = await apiClient.post(ENDPOINTS.MENU.CATEGORIES.INDEX, payload);
    return res.data;
  },
  updateCategory: async (id: string | number, payload: { name?: string; displayOrder?: number; status?: string }) => {
    const res = await apiClient.put(ENDPOINTS.MENU.CATEGORIES.DETAIL(id), payload);
    return res.data;
  },
  deleteCategory: async (id: string | number) => {
    const res = await apiClient.delete(ENDPOINTS.MENU.CATEGORIES.DETAIL(id));
    return res.data;
  },

  // Products
  getProducts: async (params?: any) => {
    const res = await apiClient.get(ENDPOINTS.MENU.PRODUCTS.INDEX, { params });
    return res.data?.items || res.data?.data || res.data || [];
  },
  getProductById: async (id: string | number) => {
    const res = await apiClient.get(ENDPOINTS.MENU.PRODUCTS.DETAIL(id));
    return res.data?.data || res.data;
  },
  createProduct: async (payload: any) => {
    const res = await apiClient.post(ENDPOINTS.MENU.PRODUCTS.INDEX, payload);
    return res.data;
  },
  updateProduct: async (id: string | number, payload: any) => {
    const res = await apiClient.put(ENDPOINTS.MENU.PRODUCTS.DETAIL(id), payload);
    return res.data;
  },
  deleteProduct: async (id: string | number) => {
    const res = await apiClient.delete(ENDPOINTS.MENU.PRODUCTS.DETAIL(id));
    return res.data;
  },

  // Toppings
  getToppings: async () => {
    const res = await apiClient.get(ENDPOINTS.MENU.TOPPINGS.INDEX);
    return res.data?.items || res.data?.data || res.data || [];
  },
  createTopping: async (payload: { name: string; price: number; status?: string }) => {
    const res = await apiClient.post(ENDPOINTS.MENU.TOPPINGS.INDEX, payload);
    return res.data;
  },
  updateTopping: async (id: string | number, payload: { name?: string; price?: number; status?: string }) => {
    const res = await apiClient.put(ENDPOINTS.MENU.TOPPINGS.DETAIL(id), payload);
    return res.data;
  },
  deleteTopping: async (id: string | number) => {
    const res = await apiClient.delete(ENDPOINTS.MENU.TOPPINGS.DETAIL(id));
    return res.data;
  },
};

export default menuService;

```

# api\pager.service.ts

| Property | Value |
|----------|-------|
| Path | `api\pager.service.ts` |
| Size | 138 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 18:43:15.298384 |

```typescript
import apiClient from './client';

export const pagerService = {
  // Pager Service API endpoints
};

export default pagerService;

```

# api\pos\order.service.ts

| Property | Value |
|----------|-------|
| Path | `api\pos\order.service.ts` |
| Size | 0 bytes |
| Extension | `.ts` |
| Modified | 2026-10-02 08:51:08.710682 |

```typescript

```

# api\pos\pager.service.ts

| Property | Value |
|----------|-------|
| Path | `api\pos\pager.service.ts` |
| Size | 0 bytes |
| Extension | `.ts` |
| Modified | 2026-10-02 08:51:08.711057 |

```typescript

```

# api\pos.service.ts

| Property | Value |
|----------|-------|
| Path | `api\pos.service.ts` |
| Size | 132 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 18:43:15.299426 |

```typescript
import apiClient from './client';

export const posService = {
  // POS Service API endpoints
};

export default posService;

```

# api\report.service.ts

| Property | Value |
|----------|-------|
| Path | `api\report.service.ts` |
| Size | 660 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 18:43:15.300397 |

```typescript
import apiClient from './client';
import { ENDPOINTS } from './endpoints';

export const reportService = {
  getDailyRevenue: async (params?: any) => {
    const res = await apiClient.get(ENDPOINTS.REPORTS.REVENUE, { params });
    return res.data?.data || res.data || [];
  },
  getTopProducts: async (params?: any) => {
    const res = await apiClient.get(ENDPOINTS.REPORTS.TOP_PRODUCTS, { params });
    return res.data?.data || res.data || [];
  },
  getLowStockAlert: async () => {
    const res = await apiClient.get(ENDPOINTS.REPORTS.LOW_STOCK);
    return res.data?.data || res.data || [];
  },
};

export default reportService;



```

# app\(auth)\change-password\page.tsx

| Property | Value |
|----------|-------|
| Path | `app\(auth)\change-password\page.tsx` |
| Size | 4,313 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.302394 |

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { KeyRound, CheckCircle2 } from 'lucide-react';
import { authService } from '@/api/auth.service';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    setLoading(true);

    try {
      await authService.changePassword({
        oldPassword,
        newPassword,
        confirmPassword,
      });
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Đổi mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-[#F5EBE6] flex items-center justify-center mb-3 text-[#6F4E37]">
          <KeyRound className="w-7 h-7" strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Đổi mật khẩu</h1>
        <p className="text-sm text-gray-500 mt-1">Cập nhật mật khẩu để bảo mật tài khoản</p>
      </div>

      {isSuccess ? (
        <div className="text-center py-4 space-y-4 animate-in fade-in">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Đổi mật khẩu thành công!</h3>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            Mật khẩu mới của bạn đã được cập nhật thành công trên hệ thống.
          </p>
          <div className="pt-2">
            <Link href="/login">
              <Button>Đăng nhập lại</Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium text-center animate-in fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Mật khẩu hiện tại"
              placeholder="Nhập mật khẩu hiện tại..."
              isPassword
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />

            <Input
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới..."
              isPassword
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <Input
              label="Xác nhận mật khẩu mới"
              placeholder="Nhập lại mật khẩu mới..."
              isPassword
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="pt-2">
              <Button type="submit" isLoading={loading}>
                Cập nhật mật khẩu
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 flex justify-center text-center text-xs">
            <Link href="/login" className="text-[#6F4E37] font-medium hover:underline">
              Quay lại đăng nhập
            </Link>
          </div>
        </>
      )}
    </>
  );
}

```

# app\(auth)\layout.tsx

| Property | Value |
|----------|-------|
| Path | `app\(auth)\layout.tsx` |
| Size | 368 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.303670 |

```tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen w-full bg-[#FAF6F0] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-[#F0E6DD] p-6 sm:p-8">
        {children}
      </div>
    </main>
  );
}


```

# app\(auth)\login\page.tsx

| Property | Value |
|----------|-------|
| Path | `app\(auth)\login\page.tsx` |
| Size | 4,206 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.304396 |

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Coffee, ShieldCheck, User } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { UserType } from '@/types/auth';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

export default function LoginPage() {
  const { login } = useAuthContext();
  const [userType, setUserType] = useState<UserType>('EMPLOYEE');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ identifier, password, userType });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-[#F5EBE6] flex items-center justify-center mb-3 text-[#6F4E37]">
          <Coffee className="w-7 h-7" strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Đăng nhập hệ thống</h1>
        <p className="text-sm text-gray-500 mt-1">Coffee Shop Management System</p>
      </div>

      {/* UserType Switcher */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-[#FAF6F0] rounded-xl mb-6">
        <button
          type="button"
          onClick={() => { setUserType('EMPLOYEE'); setError(null); }}
          className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            userType === 'EMPLOYEE' ? 'bg-white text-[#6F4E37] shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Nhân viên</span>
        </button>
        <button
          type="button"
          onClick={() => { setUserType('CUSTOMER'); setError(null); }}
          className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            userType === 'CUSTOMER' ? 'bg-white text-[#6F4E37] shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Khách hàng</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium text-center animate-in fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={userType === 'EMPLOYEE' ? 'Tên đăng nhập (Username)' : 'Số điện thoại'}
          placeholder={userType === 'EMPLOYEE' ? 'Nhập tên đăng nhập...' : 'Nhập số điện thoại...'}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />

        <Input
          label="Mật khẩu"
          placeholder="Nhập mật khẩu..."
          isPassword
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="pt-2">
          <Button type="submit" isLoading={loading}>
            Đăng nhập
          </Button>
        </div>
      </form>

      <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col items-center space-y-2 text-center text-xs">
        <Link href="/register" className="text-[#6F4E37] font-medium hover:underline">
          Khách hàng mới? Đăng ký tài khoản
        </Link>
        <Link href="/setup-password" className="text-[#6F4E37] font-medium hover:underline">
          Đã tích điểm tại quầy? Kích hoạt mật khẩu
        </Link>
      </div>
    </>
  );
}

```

# app\(auth)\register\page.tsx

| Property | Value |
|----------|-------|
| Path | `app\(auth)\register\page.tsx` |
| Size | 4,058 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.306409 |

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';
import { authService } from '@/api/auth.service';
import { useAuthContext } from '@/context/AuthContext';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

export default function RegisterPage() {
  const { login } = useAuthContext();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        fullName,
        phoneNumber,
        password,
        confirmPassword,
        address,
      });

      // Đăng nhập tự động sau khi đăng ký thành công
      await login({
        identifier: phoneNumber,
        password,
        userType: 'CUSTOMER',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-[#F5EBE6] flex items-center justify-center mb-3 text-[#6F4E37]">
          <UserPlus className="w-7 h-7" strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Đăng ký thành viên</h1>
        <p className="text-sm text-gray-500 mt-1">Trở thành hội viên để tích điểm & nhận ưu đãi</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium text-center animate-in fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          label="Họ và tên"
          placeholder="Nhập họ tên của bạn..."
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <Input
          label="Số điện thoại"
          type="tel"
          placeholder="Nhập số điện thoại..."
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />

        <Input
          label="Mật khẩu"
          placeholder="Nhập mật khẩu..."
          isPassword
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Input
          label="Xác nhận mật khẩu"
          placeholder="Nhập lại mật khẩu..."
          isPassword
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Input
          label="Địa chỉ (Không bắt buộc)"
          placeholder="Nhập địa chỉ của bạn..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <div className="pt-2">
          <Button type="submit" isLoading={loading}>
            Đăng ký tài khoản
          </Button>
        </div>
      </form>

      <div className="mt-6 pt-5 border-t border-gray-100 flex justify-center text-center text-xs">
        <Link href="/login" className="text-[#6F4E37] font-medium hover:underline">
          Đã có tài khoản? Đăng nhập ngay
        </Link>
      </div>
    </>
  );
}

```

# app\(auth)\setup-password\page.tsx

| Property | Value |
|----------|-------|
| Path | `app\(auth)\setup-password\page.tsx` |
| Size | 4,347 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.307895 |

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Key, CheckCircle2 } from 'lucide-react';
import { authService } from '@/api/auth.service';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

export default function SetupPasswordPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    setLoading(true);

    try {
      await authService.setupPassword({
        phoneNumber,
        newPassword,
        confirmPassword,
      });
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Kích hoạt mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-[#F5EBE6] flex items-center justify-center mb-3 text-[#6F4E37]">
          <Key className="w-7 h-7" strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Kích hoạt mật khẩu</h1>
        <p className="text-sm text-gray-500 mt-1">Dành cho khách hàng đã từng tích điểm tại quầy</p>
      </div>

      {isSuccess ? (
        <div className="text-center py-4 space-y-4 animate-in fade-in">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Kích hoạt thành công!</h3>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            Mật khẩu cho tài khoản của bạn đã được thiết lập thành công. Bây giờ bạn có thể đăng nhập.
          </p>
          <div className="pt-2">
            <Link href="/login">
              <Button>Đăng nhập ngay</Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium text-center animate-in fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Số điện thoại đã tích điểm"
              type="tel"
              placeholder="Nhập số điện thoại..."
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />

            <Input
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới..."
              isPassword
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <Input
              label="Xác nhận mật khẩu mới"
              placeholder="Nhập lại mật khẩu..."
              isPassword
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="pt-2">
              <Button type="submit" isLoading={loading}>
                Xác nhận kích hoạt
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 flex justify-center text-center text-xs">
            <Link href="/login" className="text-[#6F4E37] font-medium hover:underline">
              Quay lại đăng nhập
            </Link>
          </div>
        </>
      )}
    </>
  );
}

```

# app\dashboard\customers\[id]\page.tsx

| Property | Value |
|----------|-------|
| Path | `app\dashboard\customers\[id]\page.tsx` |
| Size | 213 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-02 08:51:08.721499 |

```tsx
export default function Page() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800">Hồ sơ khách hàng (Customer Detail)</h1>
        </div>
    );
}

```

# app\dashboard\customers\page.tsx

| Property | Value |
|----------|-------|
| Path | `app\dashboard\customers\page.tsx` |
| Size | 15,690 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.308769 |

```tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  UserCheck,
  Crown,
  Shield,
  Medal,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { loyaltyService, CustomerItem } from '@/api/customer-loyalty/loyalty.service';
import { CustomerFormModal } from '@/components/loyalty/CustomerFormModal';
import { AssignRoleModal } from '@/components/loyalty/AssignRoleModal';
import { ConfirmModal } from '@/components/common/ConfirmModal';

export default function CustomersPage() {
  const { user } = useAuthContext();
  const isManager = user?.role === 'MANAGER' || user?.role === 'ADMIN';

  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');

  // Modal states
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignCustomer, setAssignCustomer] = useState<CustomerItem | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteCustomerTarget, setDeleteCustomerTarget] = useState<CustomerItem | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await loyaltyService.getCustomers({
        search: searchQuery || undefined,
        membershipTier: selectedTier !== 'all' ? selectedTier : undefined,
      });
      setCustomers(res.items || res.data || []);
    } catch {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedTier]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleCreateCustomer = async (data: { fullName: string; phoneNumber: string; password?: string }) => {
    await loyaltyService.createCustomer(data);
    showToast('Tạo khách hàng mới thành công!');
    fetchCustomers();
  };

  const handleUpdateCustomer = async (data: { fullName: string; phoneNumber: string; password?: string }) => {
    if (!selectedCustomer) return;
    await loyaltyService.updateCustomer(selectedCustomer.id, data);
    showToast('Cập nhật thông tin khách hàng thành công!');
    fetchCustomers();
  };

  const handleDeleteCustomer = async () => {
    if (!deleteCustomerTarget) return;
    try {
      await loyaltyService.deleteCustomer(deleteCustomerTarget.id);
      showToast('Xóa khách hàng thành công!');
      fetchCustomers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Xóa thất bại');
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteCustomerTarget(null);
    }
  };

  const handleAssignRole = async (data: {
    fullName: string;
    username: string;
    password: string;
    role: 'CASHIER' | 'BARISTA' | 'STOREKEEPER';
    phoneNumber?: string;
  }) => {
    await loyaltyService.assignEmployeeRole(data);
    showToast(`Đã cấp quyền nhân viên ${data.role} cho ${data.fullName}!`);
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'DIAMOND':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Hạng Kim Cương
          </span>
        );
      case 'GOLD':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            Hạng Vàng
          </span>
        );
      case 'SILVER':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Shield className="w-3.5 h-3.5 text-slate-500" />
            Hạng Bạc
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-800 border border-orange-200">
            <Medal className="w-3.5 h-3.5 text-orange-600" />
            Hạng Chuẩn (Standard)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-semibold z-50 animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* Header Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý Khách hàng</h1>
          <p className="text-sm text-gray-500 mt-1">Danh sách hội viên, tích điểm và phân quyền</p>
        </div>

        {isManager && (
          <button
            type="button"
            onClick={() => {
              setSelectedCustomer(null);
              setIsAddEditModalOpen(true);
            }}
            className="flex items-center gap-2 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all cursor-pointer active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm khách hàng</span>
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên, số điện thoại..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 transition-all"
          />
        </div>

        <div className="relative">
          <Filter className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="pl-10 pr-8 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 cursor-pointer appearance-none"
          >
            <option value="all">Tất cả hạng thẻ</option>
            <option value="STANDARD">Standard</option>
            <option value="SILVER">Silver</option>
            <option value="GOLD">Gold</option>
            <option value="DIAMOND">Diamond</option>
          </select>
        </div>
      </div>

      {/* Customers Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0] border-b border-gray-100 text-xs font-bold text-gray-600 uppercase tracking-wider">
                <th className="py-3.5 px-5">Khách hàng</th>
                <th className="py-3.5 px-5">Số điện thoại</th>
                <th className="py-3.5 px-5">Điểm tích lũy</th>
                <th className="py-3.5 px-5">Hạng thẻ</th>
                <th className="py-3.5 px-5">Ngày tham gia</th>
                {isManager && <th className="py-3.5 px-5 text-right">Thao tác Quản lý</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={isManager ? 6 : 5} className="py-12 text-center text-gray-400 text-sm">
                    Đang tải danh sách khách hàng...
                  </td>
                </tr>
              ) : customers.length > 0 ? (
                customers.map((cust) => {
                  const initial = cust.fullName ? cust.fullName.charAt(0).toUpperCase() : 'K';
                  return (
                    <tr key={cust.id} className="hover:bg-gray-50/60 transition-colors group">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#F5EBE6] text-[#6F4E37] font-bold text-xs flex items-center justify-center shrink-0">
                            {initial}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900 group-hover:text-[#6F4E37] transition-colors block">
                              {cust.fullName}
                            </span>
                            <span className="text-xs text-gray-400 font-mono">ID: #{cust.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-5 font-mono text-gray-700 font-medium text-xs">
                        {cust.phoneNumber}
                      </td>

                      {/* Points */}
                      <td className="py-3.5 px-5">
                        <span className="font-bold text-[#6F4E37]">
                          {(cust.rewardPoints || 0).toLocaleString('vi-VN')}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">pts</span>
                      </td>

                      {/* Tier */}
                      <td className="py-3.5 px-5">{getTierBadge(cust.membershipTier)}</td>

                      {/* Created At */}
                      <td className="py-3.5 px-5 text-gray-500 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span>
                            {cust.createdAt
                              ? new Date(cust.createdAt).toLocaleDateString('vi-VN')
                              : 'N/A'}
                          </span>
                        </div>
                      </td>

                      {/* Manager Actions */}
                      {isManager && (
                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCustomer(cust);
                                setIsAddEditModalOpen(true);
                              }}
                              className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                              title="Sửa thông tin khách hàng"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            {/* Set Role Button (Manager only, restricted from setting Manager) */}
                            <button
                              type="button"
                              onClick={() => {
                                setAssignCustomer(cust);
                                setIsAssignModalOpen(true);
                              }}
                              className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                              title="Cấp quyền Nhân viên (Thu ngân, Pha chế, Thủ kho)"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setDeleteCustomerTarget(cust);
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Xóa khách hàng"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={isManager ? 6 : 5} className="py-12 text-center text-gray-400 text-sm">
                    Không tìm thấy khách hàng phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-white">
          <p>
            Hiển thị <span className="font-semibold text-gray-700">{customers.length}</span> khách hàng
          </p>
        </div>
      </div>

      {/* Add / Edit Customer Modal */}
      <CustomerFormModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setSelectedCustomer(null);
        }}
        onSubmit={selectedCustomer ? handleUpdateCustomer : handleCreateCustomer}
        customer={selectedCustomer}
      />

      {/* Assign Employee Role Modal */}
      <AssignRoleModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setAssignCustomer(null);
        }}
        onSubmit={handleAssignRole}
        customer={assignCustomer}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteCustomerTarget(null);
        }}
        onConfirm={handleDeleteCustomer}
        title="Xóa thông tin khách hàng"
        message={`Bạn có chắc chắn muốn xóa khách hàng "${deleteCustomerTarget?.fullName || ''}" khỏi hệ thống không?`}
      />
    </div>
  );
}

```

# app\dashboard\customers\transactions\page.tsx

| Property | Value |
|----------|-------|
| Path | `app\dashboard\customers\transactions\page.tsx` |
| Size | 222 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-02 08:51:08.723416 |

```tsx
export default function Page() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800">Lịch sử tích / tiêu điểm (Transactions)</h1>
        </div>
    );
}

```

# app\dashboard\inventory\adjustments\page.tsx

| Property | Value |
|----------|-------|
| Path | `app\dashboard\inventory\adjustments\page.tsx` |
| Size | 22,932 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.311871 |

```tsx
"use client";

import { useState, useEffect } from "react";
import {
  Scale,
  Plus,
  Search,
  X,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  History,
  ChevronDown,
  Loader2,
  RefreshCw,
} from "lucide-react";
import inventoryService from "@/api/inventory.service";

interface Ingredient {
  id: number;
  name: string;
  unit: string;
  stockQuantity: number;
}

interface AdjustmentRecord {
  id: number;
  ticketCode?: string;
  ingredientId: number;
  ingredientName?: string;
  unit?: string;
  staffName?: string;
  oldQuantity?: number;
  newQuantity?: number;
  difference?: number;
  reason?: string;
  adjustedAt?: string;
  createdAt?: string;
}

export default function InventoryAdjustmentsPage() {
  const [adjustments, setAdjustments] = useState<AdjustmentRecord[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "LOSS" | "SURPLUS">("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIngId, setSelectedIngId] = useState<number | "">("");
  const [inputNewQty, setInputNewQty] = useState<number>(0);
  const [inputReason, setInputReason] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [adjRes, ingsRes] = await Promise.all([
        inventoryService.getAdjustments().catch(() => []),
        inventoryService.getIngredients().catch(() => []),
      ]);
      setAdjustments(Array.isArray(adjRes) ? adjRes : []);
      setIngredients(Array.isArray(ingsRes) ? ingsRes : []);
    } catch (err) {
      console.error("Failed to load adjustments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentIngredient = ingredients.find((i) => i.id === selectedIngId) || ingredients[0];
  const calculatedDiff = currentIngredient
    ? Number((inputNewQty - Number(currentIngredient.stockQuantity)).toFixed(3))
    : 0;

  const filteredAdjustments = adjustments.filter((adj) => {
    const query = searchQuery.toLowerCase();
    const matchSearch =
      !searchQuery ||
      (adj.ingredientName || "").toLowerCase().includes(query) ||
      (adj.reason || "").toLowerCase().includes(query) ||
      adj.id.toString().includes(query);

    const diff = Number(adj.difference || 0);
    const matchType =
      filterType === "ALL" ||
      (filterType === "LOSS" && diff < 0) ||
      (filterType === "SURPLUS" && diff > 0);

    return matchSearch && matchType;
  });

  const totalAdjustments = adjustments.length;
  const lossCount = adjustments.filter((a) => Number(a.difference || 0) < 0).length;
  const surplusCount = adjustments.filter((a) => Number(a.difference || 0) > 0).length;

  const handleOpenModal = () => {
    if (ingredients.length > 0) {
      setSelectedIngId(ingredients[0].id);
      setInputNewQty(Number(ingredients[0].stockQuantity));
    } else {
      setSelectedIngId("");
      setInputNewQty(0);
    }
    setInputReason("");
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleIngredientChange = (id: number) => {
    setSelectedIngId(id);
    const ing = ingredients.find((i) => i.id === id);
    if (ing) {
      setInputNewQty(Number(ing.stockQuantity));
    }
  };

  const handleCreateAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIngId) {
      setErrorMsg("Vui lòng chọn nguyên liệu");
      return;
    }
    if (!inputReason.trim()) {
      setErrorMsg("Vui lòng nhập lý do điều chỉnh hao hụt / thừa kho");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      await inventoryService.createAdjustment({
        ingredientId: Number(selectedIngId),
        actualQuantity: Number(inputNewQty),
        reason: inputReason.trim(),
      });

      setIsModalOpen(false);
      showToast("Đã ghi nhận phiếu cân kho hao hụt!");
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Có lỗi xảy ra khi lập phiếu cân kho");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#6F4E37] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#F5EBE6] rounded-xl text-[#6F4E37]">
              <Scale className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Kiểm kê & Cân kho Hao hụt
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Ghi nhận chênh lệch thực tế, đối soát tồn kho định kỳ và hạch toán hao hụt nguyên vật liệu
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={handleOpenModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white rounded-xl font-semibold text-sm transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Lập phiếu cân kho hao hụt</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center font-bold">
            <History className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Tổng số lần cân kho</p>
            <p className="text-lg font-bold text-gray-900">
              {totalAdjustments} <span className="text-xs text-gray-500 font-normal">phiếu</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Lần hao hụt (Âm)</p>
            <p className="text-lg font-bold text-rose-600">
              {lossCount} <span className="text-xs text-gray-500 font-normal">lần</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Lần dư kho (Dương)</p>
            <p className="text-lg font-bold text-emerald-700">
              {surplusCount} <span className="text-xs text-gray-500 font-normal">lần</span>
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar: Search & Type Filter */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm theo tên nguyên liệu hoặc lý do..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4E37] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterType("ALL")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
              filterType === "ALL"
                ? "bg-[#6F4E37] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Tất cả ({adjustments.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("LOSS")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
              filterType === "LOSS"
                ? "bg-rose-600 text-white"
                : "bg-rose-50 text-rose-600 hover:bg-rose-100"
            }`}
          >
            Hao hụt âm ({lossCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("SURPLUS")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
              filterType === "SURPLUS"
                ? "bg-emerald-600 text-white"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            Thừa kho dương ({surplusCount})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0] text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                <th className="py-3.5 px-5">Mã phiếu</th>
                <th className="py-3.5 px-5">Tên nguyên liệu</th>
                <th className="py-3.5 px-4 text-center">Tồn cũ</th>
                <th className="py-3.5 px-4 text-center">Tồn thực tế</th>
                <th className="py-3.5 px-4 text-center">Chênh lệch</th>
                <th className="py-3.5 px-5">Lý do điều chỉnh</th>
                <th className="py-3.5 px-5 text-right">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#6F4E37]" />
                    Đang tải danh sách cân kho...
                  </td>
                </tr>
              ) : filteredAdjustments.length > 0 ? (
                filteredAdjustments.map((adj) => {
                  const diff = Number(adj.difference || 0);
                  const isNegative = diff < 0;
                  const isPositive = diff > 0;

                  return (
                    <tr key={adj.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-5">
                        <span className="font-mono font-bold text-[#6F4E37] bg-[#F5EBE6] px-2.5 py-1 rounded-lg text-xs">
                          #ADJ-{String(adj.id).padStart(3, "0")}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 font-semibold text-gray-900">
                        {adj.ingredientName || `Nguyên liệu #${adj.ingredientId}`}
                      </td>
                      <td className="py-3.5 px-4 text-center font-medium text-gray-600">
                        {adj.oldQuantity ?? "—"}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-gray-900">
                        {adj.newQuantity ?? "—"}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {isNegative && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg font-mono font-bold text-xs">
                            <TrendingDown className="w-3 h-3" />
                            {diff} {adj.unit || ""}
                          </span>
                        )}
                        {isPositive && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-mono font-bold text-xs">
                            <TrendingUp className="w-3 h-3" />
                            +{diff} {adj.unit || ""}
                          </span>
                        )}
                        {!isNegative && !isPositive && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs font-mono font-medium">
                            0
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-xs text-gray-700 max-w-xs">
                        <p className="line-clamp-2">{adj.reason || "—"}</p>
                      </td>
                      <td className="py-3.5 px-5 text-right text-xs text-gray-500 font-medium">
                        {adj.adjustedAt || adj.createdAt
                          ? new Date(adj.adjustedAt || adj.createdAt!).toLocaleString("vi-VN")
                          : "—"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    Chưa có lịch sử cân kho hao hụt.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Cân kho Hao hụt */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="p-5 bg-[#FAF6F0] border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white rounded-xl text-[#6F4E37] shadow-xs">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Lập phiếu cân kho & hao hụt</h3>
                  <p className="text-xs text-gray-500">
                    Cập nhật lại số tồn thực tế và hạch toán chênh lệch
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateAdjustment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                  1. Chọn nguyên liệu kiểm kê <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedIngId}
                    onChange={(e) => handleIngredientChange(Number(e.target.value))}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6F4E37] appearance-none cursor-pointer"
                  >
                    {ingredients.map((ing) => (
                      <option key={ing.id} value={ing.id}>
                        {ing.name} (Tồn hệ thống: {Number(ing.stockQuantity)} {ing.unit})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <span className="text-xs font-medium text-gray-500">Tồn cũ hệ thống:</span>
                  <div className="text-lg font-bold text-gray-800 mt-1">
                    {currentIngredient ? Number(currentIngredient.stockQuantity) : 0}{" "}
                    <span className="text-xs font-normal text-gray-500">
                      {currentIngredient?.unit}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Tồn thực tế kiểm kê <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      min="0"
                      required
                      value={inputNewQty}
                      onChange={(e) => setInputNewQty(parseFloat(e.target.value) || 0)}
                      className="w-full pl-3 pr-10 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium">
                      {currentIngredient?.unit}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                  calculatedDiff < 0
                    ? "bg-rose-50 border-rose-200 text-rose-800"
                    : calculatedDiff > 0
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-gray-100 border-gray-200 text-gray-700"
                }`}
              >
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {calculatedDiff < 0
                      ? "Phát hiện hao hụt (Thiếu kho):"
                      : calculatedDiff > 0
                      ? "Phát hiện dôi dư (Thừa kho):"
                      : "Không có chênh lệch:"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-mono font-bold">
                    {calculatedDiff > 0 ? `+${calculatedDiff}` : calculatedDiff}{" "}
                    {currentIngredient?.unit}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                  Lý do hao hụt / căn cứ điều chỉnh <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={inputReason}
                  onChange={(e) => setInputReason(e.target.value)}
                  placeholder="VD: Rơi vỡ trong ca, hao hụt bọt sữa, hỏng nguyên liệu khi pha chế..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white rounded-xl text-sm font-semibold transition-colors shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Xác nhận điều chỉnh</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

```

# app\dashboard\inventory\boms\page.tsx

| Property | Value |
|----------|-------|
| Path | `app\dashboard\inventory\boms\page.tsx` |
| Size | 26,933 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.314865 |

```tsx
"use client";

import { useState, useEffect } from "react";
import {
  FlaskConical,
  Plus,
  Trash2,
  Layers,
  Sparkles,
  Coffee,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Loader2,
  RefreshCw,
} from "lucide-react";
import inventoryService from "@/api/inventory.service";
import menuService from "@/api/menu.service";

type BomTab = "RECIPE_BOM" | "TOPPING_BOM";

interface Ingredient {
  id: number;
  name: string;
  unit: string;
  stockQuantity: number;
}

interface ProductVariant {
  id: number;
  size: string;
  price: number;
}

interface Product {
  id: number;
  name: string;
  categoryName?: string;
  variants: ProductVariant[];
}

interface Topping {
  id: number;
  name: string;
  price: number;
}

interface RecipeBOMDetail {
  variantId?: number;
  productName: string;
  productSize: string;
  ingredientId?: number;
  ingredientName: string;
  consumedQuantity: number;
  ingredientUnit: string;
}

interface ToppingBOMDetail {
  toppingId?: number;
  toppingName: string;
  ingredientId?: number;
  ingredientName: string;
  consumedQuantity: number;
  unit: string;
}

export default function BOMManagementPage() {
  const [activeTab, setActiveTab] = useState<BomTab>("RECIPE_BOM");
  const [loading, setLoading] = useState(true);

  // Data lists from API
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [recipeBoms, setRecipeBoms] = useState<RecipeBOMDetail[]>([]);
  const [toppingBoms, setToppingBoms] = useState<ToppingBOMDetail[]>([]);

  // Selected State
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [selectedToppingId, setSelectedToppingId] = useState<number | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formIngredientId, setFormIngredientId] = useState<number | "">("");
  const [formQty, setFormQty] = useState<number>(0.01);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [ingsData, prodsData, topsData, recipeData, toppingData] = await Promise.all([
        inventoryService.getIngredients().catch(() => []),
        menuService.getProducts().catch(() => []),
        menuService.getToppings().catch(() => []),
        inventoryService.getRecipeBOMs().catch(() => []),
        inventoryService.getToppingBOMs().catch(() => []),
      ]);

      setIngredients(Array.isArray(ingsData) ? ingsData : []);
      const prodList = Array.isArray(prodsData) ? prodsData : [];
      setProducts(prodList);
      const topList = Array.isArray(topsData) ? topsData : [];
      setToppings(topList);
      setRecipeBoms(Array.isArray(recipeData) ? recipeData : []);
      setToppingBoms(Array.isArray(toppingData) ? toppingData : []);

      if (prodList.length > 0 && selectedProductId === null) {
        setSelectedProductId(prodList[0].id);
        if (prodList[0].variants?.length > 0) {
          setSelectedVariantId(prodList[0].variants[0].id);
        }
      }
      if (topList.length > 0 && selectedToppingId === null) {
        setSelectedToppingId(topList[0].id);
      }
    } catch (err) {
      console.error("Error loading BOM data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const selectedVariant = selectedProduct?.variants?.find((v) => v.id === selectedVariantId) || selectedProduct?.variants?.[0];
  const selectedTopping = toppings.find((t) => t.id === selectedToppingId) || toppings[0];

  // Filter Recipe BOMs for current product & size
  const currentRecipeItems = recipeBoms.filter((rb) => {
    if (!selectedProduct) return false;
    const matchName = rb.productName === selectedProduct.name;
    const matchSize = selectedVariant ? rb.productSize === selectedVariant.size : true;
    return matchName && matchSize;
  });

  // Filter Topping BOMs for current topping
  const currentToppingItems = toppingBoms.filter((tb) => {
    if (!selectedTopping) return false;
    return tb.toppingName === selectedTopping.name;
  });

  const handleOpenAddModal = () => {
    if (ingredients.length > 0) {
      setFormIngredientId(ingredients[0].id);
    } else {
      setFormIngredientId("");
    }
    setFormQty(0.01);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formIngredientId) {
      setErrorMsg("Vui lòng chọn nguyên liệu");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");

    try {
      if (activeTab === "RECIPE_BOM") {
        if (!selectedVariantId) {
          setErrorMsg("Không tìm thấy thông tin biến thể size sản phẩm");
          setSubmitting(false);
          return;
        }
        await inventoryService.addRecipeBOMItem({
          variantId: Number(selectedVariantId),
          ingredientId: Number(formIngredientId),
          consumedQuantity: Number(formQty),
        });
        showToast("Đã lưu định lượng công thức!");
      } else {
        if (!selectedToppingId) {
          setErrorMsg("Không tìm thấy thông tin topping");
          setSubmitting(false);
          return;
        }
        showToast("Đã lưu định lượng Topping!");
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Có lỗi xảy ra khi lưu định lượng");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRecipeItem = async (ingredientId?: number) => {
    if (!selectedVariantId || !ingredientId) return;
    if (!confirm("Bạn có chắc chắn muốn xóa nguyên liệu này khỏi công thức?")) return;

    try {
      await inventoryService.deleteRecipeBOMItem(selectedVariantId, ingredientId);
      showToast("Đã xóa nguyên liệu khỏi công thức!");
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Không thể xóa nguyên liệu khỏi công thức");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#6F4E37] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#F5EBE6] rounded-xl text-[#6F4E37]">
              <FlaskConical className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Cấu hình Định lượng (BOM)
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Thiết lập định lượng nguyên vật liệu tiêu hao (Bill of Materials) để tự động trừ kho khi bán hàng
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-medium">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Độ chính xác định mức: 0.001</span>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab("RECIPE_BOM")}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm cursor-pointer ${
            activeTab === "RECIPE_BOM"
              ? "bg-[#6F4E37] text-white shadow-[#6F4E37]/20"
              : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200"
          }`}
        >
          <Coffee className="w-4 h-4" />
          <span>Định lượng Đồ uống (RecipeBOM)</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              activeTab === "RECIPE_BOM" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {products.length} sản phẩm
          </span>
        </button>

        <button
          onClick={() => setActiveTab("TOPPING_BOM")}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm cursor-pointer ${
            activeTab === "TOPPING_BOM"
              ? "bg-[#6F4E37] text-white shadow-[#6F4E37]/20"
              : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Định lượng Topping (ToppingBOM)</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              activeTab === "TOPPING_BOM" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {toppings.length} topping
          </span>
        </button>
      </div>

      {/* TAB 1: RECIPE BOM */}
      {activeTab === "RECIPE_BOM" && (
        <div className="space-y-6">
          {/* Controls Bar: Select Product & Select Size Variant */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 flex-1">
              {/* Product Selector */}
              <div className="flex-1 min-w-[260px]">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  1. Chọn Sản phẩm đồ uống
                </label>
                <div className="relative">
                  <select
                    value={selectedProductId || ""}
                    onChange={(e) => {
                      const prodId = Number(e.target.value);
                      setSelectedProductId(prodId);
                      const prod = products.find((p) => p.id === prodId);
                      if (prod && prod.variants?.length > 0) {
                        setSelectedVariantId(prod.variants[0].id);
                      } else {
                        setSelectedVariantId(null);
                      }
                    }}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-[#FAF6F0] border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6F4E37] appearance-none cursor-pointer"
                  >
                    {products.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.name} {prod.categoryName ? `(${prod.categoryName})` : ""}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Size Variant Selector */}
              <div className="w-full sm:w-[260px]">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  2. Chọn Biến thể Size
                </label>
                <div className="relative">
                  <select
                    value={selectedVariantId || ""}
                    onChange={(e) => setSelectedVariantId(Number(e.target.value))}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-[#FAF6F0] border border-gray-200 rounded-xl text-sm font-semibold text-[#6F4E37] focus:outline-none focus:ring-2 focus:ring-[#6F4E37] appearance-none cursor-pointer"
                  >
                    {selectedProduct?.variants?.map((variant) => (
                      <option key={variant.id} value={variant.id}>
                        Size {variant.size} ({Number(variant.price).toLocaleString("vi-VN")}đ)
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#6F4E37] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm nguyên liệu</span>
              </button>
            </div>
          </div>

          {/* Table: BOM Items */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  Bảng định mức: {selectedProduct?.name} -{" "}
                  <span className="text-[#6F4E37]">Size {selectedVariant?.size || "M"}</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Số lượng tiêu hao nguyên liệu khi chế biến 1 đơn vị sản phẩm
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg font-medium">
                {currentRecipeItems.length} thành phần
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF6F0] text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                    <th className="py-3.5 px-5">Tên nguyên liệu</th>
                    <th className="py-3.5 px-5 text-center">Định mức tiêu hao</th>
                    <th className="py-3.5 px-5">Đơn vị tính</th>
                    <th className="py-3.5 px-5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-gray-400">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#6F4E37]" />
                        Đang tải định lượng công thức...
                      </td>
                    </tr>
                  ) : currentRecipeItems.length > 0 ? (
                    currentRecipeItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3.5 px-5 font-semibold text-gray-900">
                          {item.ingredientName}
                        </td>
                        <td className="py-3.5 px-5 text-center">
                          <span className="inline-block px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg font-mono font-bold text-sm">
                            {Number(item.consumedQuantity).toFixed(3)}
                          </span>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                            {item.ingredientUnit}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteRecipeItem(item.ingredientId)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Xóa khỏi công thức"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-10 text-center text-gray-400">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        Chưa có nguyên liệu nào được cấu hình cho kích cỡ này.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TOPPING BOM */}
      {activeTab === "TOPPING_BOM" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="w-full sm:w-[320px]">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Chọn Topping
              </label>
              <div className="relative">
                <select
                  value={selectedToppingId || ""}
                  onChange={(e) => setSelectedToppingId(Number(e.target.value))}
                  className="w-full pl-3.5 pr-10 py-2.5 bg-[#FAF6F0] border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6F4E37] appearance-none cursor-pointer"
                >
                  {toppings.map((top) => (
                    <option key={top.id} value={top.id}>
                      {top.name} (+{Number(top.price).toLocaleString("vi-VN")}đ)
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm nguyên liệu Topping</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  Bảng định mức Topping: {selectedTopping?.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Định lượng nguyên liệu tiêu hao cho 1 suất topping
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg font-medium">
                {currentToppingItems.length} thành phần
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF6F0] text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                    <th className="py-3.5 px-5">Tên nguyên liệu</th>
                    <th className="py-3.5 px-5 text-center">Định mức tiêu hao</th>
                    <th className="py-3.5 px-5">Đơn vị tính</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="py-12 text-center text-gray-400">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#6F4E37]" />
                        Đang tải định lượng Topping...
                      </td>
                    </tr>
                  ) : currentToppingItems.length > 0 ? (
                    currentToppingItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3.5 px-5 font-semibold text-gray-900">
                          {item.ingredientName}
                        </td>
                        <td className="py-3.5 px-5 text-center">
                          <span className="inline-block px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg font-mono font-bold text-sm">
                            {Number(item.consumedQuantity).toFixed(3)}
                          </span>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                            {item.unit}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-10 text-center text-gray-400">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        Chưa có nguyên liệu nào được cấu hình cho topping này.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Thêm nguyên liệu vào định lượng */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-gray-900">
              Thêm nguyên liệu vào định lượng
            </h2>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Chọn nguyên liệu từ kho <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formIngredientId}
                  onChange={(e) => setFormIngredientId(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
                >
                  {ingredients.map((ing) => (
                    <option key={ing.id} value={ing.id}>
                      {ing.name} ({ing.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Định mức tiêu hao <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0.0001"
                  step="any"
                  required
                  value={formQty}
                  onChange={(e) => setFormQty(Number(e.target.value))}
                  placeholder="Ví dụ: 0.02"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 font-mono font-bold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#6F4E37] hover:bg-[#5A3F2C] rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Lưu định lượng</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

```

# app\dashboard\inventory\imports\[id]\page.tsx

| Property | Value |
|----------|-------|
| Path | `app\dashboard\inventory\imports\[id]\page.tsx` |
| Size | 219 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-02 08:51:08.729800 |

```tsx
export default function Page() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800">Chi tiết phiếu nhập kho (Import Detail)</h1>
        </div>
    );
}

```

# app\dashboard\inventory\imports\new\page.tsx

| Property | Value |
|----------|-------|
| Path | `app\dashboard\inventory\imports\new\page.tsx` |
| Size | 217 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-02 08:51:08.731327 |

```tsx
export default function Page() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800">Lập phiếu nhập kho mới (New Import)</h1>
        </div>
    );
}

```

# app\dashboard\inventory\imports\page.tsx

| Property | Value |
|----------|-------|
| Path | `app\dashboard\inventory\imports\page.tsx` |
| Size | 30,180 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.316118 |

```tsx
"use client";

import { useState, useEffect } from "react";
import {
  FileDown,
  Plus,
  Search,
  Eye,
  X,
  Trash2,
  CheckCircle2,
  PackagePlus,
  Printer,
  DollarSign,
  TrendingUp,
  Building2,
  FileText,
  Loader2,
  RefreshCw,
} from "lucide-react";
import inventoryService from "@/api/inventory.service";

interface ImportDetail {
  id?: number;
  ingredientId: number;
  ingredientName?: string;
  unit?: string;
  quantity: number;
  unitPrice: number;
  totalLineAmount?: number;
}

interface ImportTicket {
  id: number;
  supplierName?: string;
  createdByName?: string;
  importDate?: string;
  totalAmount: number;
  note?: string;
  details?: ImportDetail[];
}

interface Ingredient {
  id: number;
  name: string;
  unit: string;
}

export default function InventoryImportsPage() {
  const [tickets, setTickets] = useState<ImportTicket[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchSupplier, setSearchSupplier] = useState("");

  // Drawer Detail State
  const [selectedTicket, setSelectedTicket] = useState<ImportTicket | null>(null);
  const [drawerDetails, setDrawerDetails] = useState<ImportDetail[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Modal Create Ticket State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formSupplier, setFormSupplier] = useState("");
  const [formNote, setFormNote] = useState("");
  const [formLines, setFormLines] = useState<
    { id: string; ingredientId: number; quantity: number; unitPrice: number }[]
  >([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [importsRes, ingsRes] = await Promise.all([
        inventoryService.getImports().catch(() => []),
        inventoryService.getIngredients().catch(() => []),
      ]);
      setTickets(Array.isArray(importsRes) ? importsRes : []);
      setIngredients(Array.isArray(ingsRes) ? ingsRes : []);
    } catch (err) {
      console.error("Failed to load imports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTickets = tickets.filter((t) => {
    const query = searchSupplier.toLowerCase();
    const matchSupplier = (t.supplierName || "").toLowerCase().includes(query);
    const matchCode = (t.id ? `PNK-${t.id}` : "").toLowerCase().includes(query);
    return matchSupplier || matchCode;
  });

  const totalImportValue = tickets.reduce((sum, t) => sum + (Number(t.totalAmount) || 0), 0);
  const totalTicketsCount = tickets.length;

  const handleOpenDrawer = async (ticket: ImportTicket) => {
    setSelectedTicket(ticket);
    setIsDrawerOpen(true);
    setLoadingDetail(true);
    try {
      const res = await inventoryService.getImportDetail(ticket.id);
      setDrawerDetails(Array.isArray(res) ? res : res?.details || []);
    } catch (err) {
      console.error("Failed to load import detail:", err);
      setDrawerDetails(ticket.details || []);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleOpenCreateModal = () => {
    setFormSupplier("");
    setFormNote("");
    if (ingredients.length > 0) {
      setFormLines([
        {
          id: `line-${Date.now()}`,
          ingredientId: ingredients[0].id,
          quantity: 10,
          unitPrice: 50000,
        },
      ]);
    } else {
      setFormLines([]);
    }
    setErrorMsg("");
    setIsCreateModalOpen(true);
  };

  const handleAddLine = () => {
    if (ingredients.length === 0) return;
    setFormLines([
      ...formLines,
      {
        id: `line-${Date.now()}-${Math.random()}`,
        ingredientId: ingredients[0].id,
        quantity: 1,
        unitPrice: 10000,
      },
    ]);
  };

  const handleRemoveLine = (id: string) => {
    if (formLines.length === 1) {
      alert("Phiếu nhập cần ít nhất một mặt hàng!");
      return;
    }
    setFormLines(formLines.filter((l) => l.id !== id));
  };

  const handleUpdateLine = (id: string, field: string, value: number) => {
    setFormLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  const modalTotalAmount = formLines.reduce(
    (sum, l) => sum + (Number(l.quantity) || 0) * (Number(l.unitPrice) || 0),
    0
  );

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formLines.length === 0) {
      setErrorMsg("Vui lòng thêm ít nhất 1 mặt hàng");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");

    try {
      await inventoryService.createImportTicket({
        supplierName: formSupplier.trim() || undefined,
        note: formNote.trim() || undefined,
        details: formLines.map((l) => ({
          ingredientId: Number(l.ingredientId),
          quantity: Number(l.quantity),
          unitPrice: Number(l.unitPrice),
        })),
      });
      setIsCreateModalOpen(false);
      showToast("Đã tạo phiếu nhập kho thành công!");
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Có lỗi xảy ra khi tạo phiếu nhập kho");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#6F4E37] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#F5EBE6] rounded-xl text-[#6F4E37]">
              <PackagePlus className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Lịch sử & Quản lý Nhập kho
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi danh sách các phiếu nhập hàng từ nhà cung cấp, cập nhật giá vốn và tồn kho
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white rounded-xl font-semibold text-sm transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Lập phiếu nhập kho mới</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Tổng giá trị nhập kho</p>
            <p className="text-xl font-bold text-gray-900">
              {totalImportValue.toLocaleString("vi-VN")} <span className="text-sm font-normal text-gray-500">đ</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Tổng số phiếu nhập</p>
            <p className="text-xl font-bold text-gray-900">
              {totalTicketsCount} <span className="text-sm font-normal text-gray-500">phiếu</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Số loại nguyên liệu</p>
            <p className="text-xl font-bold text-amber-700">
              {ingredients.length} <span className="text-sm font-normal text-gray-500">mặt hàng</span>
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar: Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm theo tên nhà cung cấp hoặc mã phiếu (#PNK-...)"
            value={searchSupplier}
            onChange={(e) => setSearchSupplier(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4E37] focus:bg-white"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0] text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                <th className="py-3.5 px-5">Mã phiếu</th>
                <th className="py-3.5 px-5">Nhà cung cấp</th>
                <th className="py-3.5 px-5">Ngày giờ nhập</th>
                <th className="py-3.5 px-5">Tổng tiền</th>
                <th className="py-3.5 px-5">Ghi chú</th>
                <th className="py-3.5 px-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#6F4E37]" />
                    Đang tải phiếu nhập kho...
                  </td>
                </tr>
              ) : filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-5">
                      <span className="font-mono font-bold text-[#6F4E37] bg-[#F5EBE6] px-2.5 py-1 rounded-lg text-xs">
                        #PNK-{String(ticket.id).padStart(3, "0")}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        <span>{ticket.supplierName || "Nhà cung cấp tự do"}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-gray-600 text-xs">
                      {ticket.importDate ? new Date(ticket.importDate).toLocaleString("vi-VN") : "—"}
                    </td>
                    <td className="py-3.5 px-5 font-bold text-gray-900">
                      {Number(ticket.totalAmount).toLocaleString("vi-VN")}{" "}
                      <span className="text-xs text-gray-400 font-normal">đ</span>
                    </td>
                    <td className="py-3.5 px-5 text-xs text-gray-500 max-w-xs truncate">
                      {ticket.note || "—"}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenDrawer(ticket)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF6F0] hover:bg-[#F5EBE6] text-[#6F4E37] font-semibold text-xs rounded-lg transition-colors border border-[#6F4E37]/15 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem chi tiết</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    Chưa có phiếu nhập kho nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Lập Phiếu Nhập Kho Mới */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-[#FAF6F0] border-b border-gray-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white rounded-xl text-[#6F4E37] shadow-xs">
                  <PackagePlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Lập phiếu nhập kho nguyên liệu</h3>
                  <p className="text-xs text-gray-500">
                    Cập nhật số lượng tồn kho tự động
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                    Tên Nhà Cung Cấp
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Công ty Cà phê Việt"
                    value={formSupplier}
                    onChange={(e) => setFormSupplier(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                    Ghi chú
                  </label>
                  <input
                    type="text"
                    placeholder="Ghi chú phiếu nhập..."
                    value={formNote}
                    onChange={(e) => setFormNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Danh sách mặt hàng nhập ({formLines.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddLine}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF6F0] hover:bg-[#F5EBE6] text-[#6F4E37] text-xs font-semibold rounded-lg transition-colors border border-[#6F4E37]/20 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm mặt hàng</span>
                  </button>
                </div>

                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#FAF6F0] text-gray-600 font-semibold uppercase tracking-wider border-b border-gray-200">
                        <th className="py-2.5 px-3">Tên Nguyên liệu</th>
                        <th className="py-2.5 px-3 w-28 text-center">Số lượng</th>
                        <th className="py-2.5 px-3 w-36 text-right">Đơn giá nhập</th>
                        <th className="py-2.5 px-3 w-36 text-right">Thành tiền</th>
                        <th className="py-2.5 px-2 w-10 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {formLines.map((line) => {
                        const subtotal = (Number(line.quantity) || 0) * (Number(line.unitPrice) || 0);
                        return (
                          <tr key={line.id} className="hover:bg-gray-50">
                            <td className="py-2.5 px-3">
                              <select
                                value={line.ingredientId}
                                onChange={(e) =>
                                  handleUpdateLine(line.id, "ingredientId", Number(e.target.value))
                                }
                                className="w-full py-1.5 px-2 bg-white border border-gray-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#6F4E37]"
                              >
                                {ingredients.map((ing) => (
                                  <option key={ing.id} value={ing.id}>
                                    {ing.name} ({ing.unit})
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <input
                                type="number"
                                step="any"
                                min="0.01"
                                required
                                value={line.quantity}
                                onChange={(e) =>
                                  handleUpdateLine(line.id, "quantity", parseFloat(e.target.value) || 0)
                                }
                                className="w-full py-1.5 px-2 text-center font-bold bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6F4E37]"
                              />
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <input
                                type="number"
                                step="1000"
                                min="0"
                                required
                                value={line.unitPrice}
                                onChange={(e) =>
                                  handleUpdateLine(line.id, "unitPrice", parseFloat(e.target.value) || 0)
                                }
                                className="w-full py-1.5 px-2 text-right font-medium bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6F4E37]"
                              />
                            </td>
                            <td className="py-2.5 px-3 text-right font-bold text-gray-900">
                              {Math.round(subtotal).toLocaleString("vi-VN")} đ
                            </td>
                            <td className="py-2.5 px-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveLine(line.id)}
                                className="p-1 text-gray-400 hover:text-rose-600 rounded cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-4 bg-[#FAF6F0] rounded-xl border border-gray-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-gray-600 uppercase">Tổng tiền thanh toán:</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-[#6F4E37]">
                    {modalTotalAmount.toLocaleString("vi-VN")}{" "}
                    <span className="text-sm font-normal text-gray-600">VNĐ</span>
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white rounded-xl text-sm font-semibold transition-colors shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Hoàn tất & Nhập kho</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DRAWER: Xem Chi Tiết Phiếu Nhập */}
      {isDrawerOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xl bg-white shadow-2xl border-l border-gray-100 flex flex-col">
              <div className="p-6 bg-[#FAF6F0] border-b border-gray-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      Phiếu nhập #PNK-{String(selectedTicket.id).padStart(3, "0")}
                    </span>
                  </div>
                  {selectedTicket.importDate && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      Ngày nhập: {new Date(selectedTicket.importDate).toLocaleString("vi-VN")}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">Nhà cung cấp:</span>
                    <span className="font-bold text-gray-900">{selectedTicket.supplierName || "—"}</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-gray-500 text-xs">Ghi chú:</span>
                    <span className="text-gray-700 text-xs text-right max-w-xs">{selectedTicket.note || "—"}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-3">
                    Chi tiết danh sách hàng nhập
                  </h4>
                  {loadingDetail ? (
                    <div className="py-8 text-center text-gray-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#6F4E37]" />
                      Đang tải chi tiết phiếu nhập...
                    </div>
                  ) : drawerDetails.length > 0 ? (
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#FAF6F0] text-gray-600 font-semibold uppercase tracking-wider border-b border-gray-200">
                            <th className="py-2.5 px-3">Nguyên liệu</th>
                            <th className="py-2.5 px-3 text-center">Số lượng</th>
                            <th className="py-2.5 px-3 text-right">Đơn giá</th>
                            <th className="py-2.5 px-3 text-right">Thành tiền</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {drawerDetails.map((item, idx) => {
                            const qty = Number(item.quantity) || 0;
                            const price = Number(item.unitPrice) || 0;
                            const total = item.totalLineAmount || qty * price;
                            return (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="py-3 px-3">
                                  <div className="font-semibold text-gray-900">
                                    {item.ingredientName || `Nguyên liệu #${item.ingredientId}`}
                                  </div>
                                </td>
                                <td className="py-3 px-3 text-center font-bold text-gray-900">
                                  {qty} {item.unit || ""}
                                </td>
                                <td className="py-3 px-3 text-right text-gray-600">
                                  {price.toLocaleString("vi-VN")} đ
                                </td>
                                <td className="py-3 px-3 text-right font-bold text-[#6F4E37]">
                                  {total.toLocaleString("vi-VN")} đ
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">Không có chi tiết hàng nhập.</p>
                  )}
                </div>

                <div className="bg-[#FAF6F0] p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                  <span className="font-semibold text-gray-800 text-sm">Tổng cộng thanh toán:</span>
                  <span className="text-xl font-bold text-[#6F4E37]">
                    {Number(selectedTicket.totalAmount).toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

```

# app\dashboard\inventory\ingredients\page.tsx

| Property | Value |
|----------|-------|
| Path | `app\dashboard\inventory\ingredients\page.tsx` |
| Size | 19,466 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.317556 |

```tsx
"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  Coins,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import inventoryService from "@/api/inventory.service";

interface Ingredient {
  id: number;
  name: string;
  unit: string;
  stockQuantity: number;
  minimumThreshold: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Ingredient | null>(null);
  const [formName, setFormName] = useState("");
  const [formUnit, setFormUnit] = useState("kg");
  const [formStock, setFormStock] = useState<number>(0);
  const [formMinThreshold, setFormMinThreshold] = useState<number>(10);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchIngredients = async () => {
    setLoading(true);
    try {
      const data = await inventoryService.getIngredients();
      setIngredients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch ingredients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormName("");
    setFormUnit("kg");
    setFormStock(0);
    setFormMinThreshold(10);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: Ingredient) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormUnit(item.unit);
    setFormStock(item.stockQuantity);
    setFormMinThreshold(item.minimumThreshold);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setErrorMsg("Tên nguyên liệu không được để trống");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");

    try {
      if (editingItem) {
        await inventoryService.updateIngredient(editingItem.id, {
          name: formName.trim(),
          unit: formUnit.trim(),
          stockQuantity: Number(formStock),
          minimumThreshold: Number(formMinThreshold),
        });
      } else {
        await inventoryService.createIngredient({
          name: formName.trim(),
          unit: formUnit.trim(),
          stockQuantity: Number(formStock),
          minimumThreshold: Number(formMinThreshold),
        });
      }
      setIsModalOpen(false);
      await fetchIngredients();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Có lỗi xảy ra khi lưu nguyên liệu");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa nguyên liệu này?")) return;
    try {
      await inventoryService.deleteIngredient(id);
      await fetchIngredients();
    } catch (err: any) {
      alert(err.response?.data?.message || "Không thể xóa nguyên liệu");
    }
  };

  const getStatus = (stock: number, minStock: number) => {
    if (stock <= 0) return "out_of_stock";
    if (stock <= minStock) return "low_stock";
    return "in_stock";
  };

  const getStatusBadge = (status: "in_stock" | "low_stock" | "out_of_stock") => {
    switch (status) {
      case "in_stock":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Còn hàng
          </span>
        );
      case "low_stock":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/70">
            <AlertCircle className="w-3.5 h-3.5" />
            Sắp hết
          </span>
        );
      case "out_of_stock":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/70">
            <XCircle className="w-3.5 h-3.5" />
            Hết hàng
          </span>
        );
    }
  };

  const filteredIngredients = ingredients.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.id.toString().includes(query) ||
      item.unit.toLowerCase().includes(query)
    );
  });

  const warningCount = ingredients.filter(
    (item) => Number(item.stockQuantity) <= Number(item.minimumThreshold)
  ).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Kho nguyên liệu
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi số lượng tồn kho và định mức an toàn nguyên liệu
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchIngredients}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white font-medium text-sm shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.98] w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" strokeWidth={2.2} />
            <span>Thêm nguyên liệu</span>
          </button>
        </div>
      </div>

      {/* 3 Thẻ Card Thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {/* Card 1: Tổng số mặt hàng */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Tổng số mặt hàng
            </p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1.5">
              {ingredients.length}{" "}
              <span className="text-sm font-normal text-gray-500">nguyên liệu</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Phục vụ hoạt động pha chế & đóng gói
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center shrink-0">
            <Package className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Cảnh báo sắp hết / hết hàng */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Cảnh báo hết / sắp hết
            </p>
            <h3 className="text-2xl font-extrabold text-rose-600 mt-1.5">
              {warningCount} <span className="text-sm font-normal text-rose-500">mặt hàng</span>
            </h3>
            <p className="text-xs text-rose-500/80 font-medium mt-1">
              Dưới hoặc bằng định mức an toàn
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Số loại đơn vị tính */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Đơn vị quản lý
            </p>
            <h3 className="text-2xl font-extrabold text-[#6F4E37] mt-1.5">
              {Array.from(new Set(ingredients.map((i) => i.unit))).length}{" "}
              <span className="text-sm font-normal text-gray-500">đơn vị</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              (kg, lít, chai, cái, gói,...)
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Coins className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo tên hoặc mã nguyên liệu..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm transition-colors focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
          />
        </div>
      </div>

      {/* 3. Bảng dữ liệu */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <th scope="col" className="py-3.5 px-5">Mã & Tên nguyên liệu</th>
                <th scope="col" className="py-3.5 px-5">Đơn vị tính</th>
                <th scope="col" className="py-3.5 px-5">Số lượng tồn</th>
                <th scope="col" className="py-3.5 px-5">Định mức an toàn</th>
                <th scope="col" className="py-3.5 px-5">Trạng thái</th>
                <th scope="col" className="py-3.5 px-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#6F4E37]" />
                    Đang tải dữ liệu nguyên liệu...
                  </td>
                </tr>
              ) : filteredIngredients.length > 0 ? (
                filteredIngredients.map((item) => {
                  const status = getStatus(Number(item.stockQuantity), Number(item.minimumThreshold));
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/60 transition-colors group"
                    >
                      <td className="py-3.5 px-5">
                        <div>
                          <span className="font-semibold text-gray-900 group-hover:text-[#6F4E37] transition-colors block">
                            {item.name}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">
                            #NL{String(item.id).padStart(3, "0")}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-5">
                        <span className="px-2.5 py-1 rounded-md bg-gray-100 text-xs text-gray-600 font-semibold">
                          {item.unit}
                        </span>
                      </td>

                      <td className="py-3.5 px-5">
                        <span className="font-bold text-gray-900">
                          {Number(item.stockQuantity).toLocaleString("vi-VN")}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">
                          {item.unit}
                        </span>
                      </td>

                      <td className="py-3.5 px-5 font-medium text-gray-600">
                        {Number(item.minimumThreshold).toLocaleString("vi-VN")} {item.unit}
                      </td>

                      <td className="py-3.5 px-5">
                        {getStatusBadge(status)}
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(item)}
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Chỉnh sửa nguyên liệu"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Xóa nguyên liệu"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                    Không có nguyên liệu nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm/Sửa Nguyên Liệu */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-gray-900">
              {editingItem ? "Chỉnh sửa nguyên liệu" : "Thêm nguyên liệu mới"}
            </h2>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Tên nguyên liệu <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ví dụ: Hạt cà phê Robusta"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Đơn vị tính <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    placeholder="kg, lít, chai,..."
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Định mức an toàn
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={formMinThreshold}
                    onChange={(e) => setFormMinThreshold(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Số lượng tồn kho ban đầu
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={formStock}
                  onChange={(e) => setFormStock(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#6F4E37] hover:bg-[#5A3F2C] rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingItem ? "Cập nhật" : "Tạo mới"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


```

# app\dashboard\layout.tsx

| Property | Value |
|----------|-------|
| Path | `app\dashboard\layout.tsx` |
| Size | 571 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.318371 |

```tsx
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 ml-64 pt-20 sm:pt-22 px-6 sm:px-8 pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}

```

# app\dashboard\menu\categories\page.tsx

| Property | Value |
|----------|-------|
| Path | `app\dashboard\menu\categories\page.tsx` |
| Size | 11,262 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.319924 |

```tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Coffee,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { menuService } from '@/api/menu.service';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { ConfirmModal } from '@/components/common/ConfirmModal';

interface CategoryItem {
  id: number;
  name: string;
  displayOrder?: number;
  status?: string;
  productCount?: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [name, setName] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(0);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await menuService.getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName('');
    setDisplayOrder(categories.length + 1);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setName(cat.name || '');
    setDisplayOrder(cat.displayOrder || 0);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingCategory) {
        await menuService.updateCategory(editingCategory.id, { name, displayOrder });
      } else {
        await menuService.createCategory({ name, displayOrder });
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    try {
      await menuService.deleteCategory(deletingCategory.id);
      setIsDeleteModalOpen(false);
      setDeletingCategory(null);
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Xóa thất bại');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Danh mục thực đơn</h1>
          <p className="text-sm text-gray-500 mt-1">Phân loại các nhóm đồ uống và món ăn</p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white font-semibold text-sm shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" strokeWidth={2.2} />
          <span>Thêm danh mục</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm danh mục món..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
          />
        </div>

        <div className="text-xs text-gray-500 hidden sm:block">
          Hiển thị: <span className="font-semibold text-gray-800">{filteredCategories.length}</span> danh mục
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Tên danh mục</th>
                <th className="py-3.5 px-5">Thứ tự hiển thị</th>
                <th className="py-3.5 px-5">Số lượng món</th>
                <th className="py-3.5 px-5">Trạng thái</th>
                <th className="py-3.5 px-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 text-sm">
                    Đang tải danh mục...
                  </td>
                </tr>
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50/60 transition-colors group">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center shrink-0">
                          <Coffee className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900 group-hover:text-[#6F4E37] transition-colors block">
                            {cat.name}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">ID: #{cat.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-5 text-gray-700 font-medium text-xs">
                      {cat.displayOrder || 0}
                    </td>

                    <td className="py-3.5 px-5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 font-semibold text-gray-800 text-xs">
                        {cat.productCount || 0} món
                      </span>
                    </td>

                    <td className="py-3.5 px-5">
                      {cat.status === 'HIDE' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                          <XCircle className="w-3.5 h-3.5" />
                          Đã ẩn
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Đang hiển thị
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(cat)}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Sửa danh mục"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeletingCategory(cat);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Xóa danh mục"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 text-sm">
                    Chưa có danh mục nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Tên danh mục"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Cà phê, Trà hoa quả..."
            required
          />
          <Input
            label="Thứ tự hiển thị"
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
            placeholder="1, 2, 3..."
          />
          <div className="pt-2 flex gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" isLoading={submitting}>
              {editingCategory ? 'Lưu thay đổi' : 'Tạo danh mục'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Xóa danh mục"
        message={`Bạn có chắc chắn muốn xóa danh mục "${deletingCategory?.name || ''}" không?`}
      />
    </div>
  );
}

```

# app\dashboard\menu\products\[id]\page.tsx

| Property | Value |
|----------|-------|
| Path | `app\dashboard\menu\products\[id]\page.tsx` |
| Size | 207 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-02 08:51:08.739445 |

```tsx
export default function Page() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa món (Edit Product)</h1>
        </div>
    );
}

```

# app\dashboard\menu\products\new\page.tsx

| Property | Value |
|----------|-------|
| Path | `app\dashboard\menu\products\new\page.tsx` |
| Size | 204 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-02 08:51:08.741414 |

```tsx
export default function Page() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800">Tạo món mới (New Product)</h1>
        </div>
    );
}

```

# app\dashboard\menu\products\page.tsx

| Property | Value |
|----------|-------|
| Path | `app\dashboard\menu\products\page.tsx` |
| Size | 8,072 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.321467 |

```tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Coffee,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { menuService } from '@/api/menu.service';
import { ConfirmModal } from '@/components/common/ConfirmModal';

interface ProductItem {
  id: number;
  productName?: string;
  name?: string;
  categoryName?: string;
  basePrice?: number;
  price?: number;
  status?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<ProductItem | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await menuService.getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter((p) => {
    const name = p.productName || p.name || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatCurrency = (val?: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(val || 0);
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    try {
      await menuService.deleteProduct(deletingProduct.id);
      setIsDeleteModalOpen(false);
      setDeletingProduct(null);
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Xóa thất bại');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Danh sách Thực đơn</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý các món đồ uống, đồ ăn và trạng thái kinh doanh</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm tên món..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
          />
        </div>

        <div className="text-xs text-gray-500 hidden sm:block">
          Hiển thị: <span className="font-semibold text-gray-800">{filteredProducts.length}</span> món
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Món ăn / Đồ uống</th>
                <th className="py-3.5 px-5">Danh mục</th>
                <th className="py-3.5 px-5">Giá gốc</th>
                <th className="py-3.5 px-5">Trạng thái</th>
                <th className="py-3.5 px-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 text-sm">
                    Đang tải danh sách sản phẩm...
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors group">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center shrink-0">
                          <Coffee className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900 group-hover:text-[#6F4E37] transition-colors block">
                            {item.productName || item.name}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">ID: #{item.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-5 text-gray-600 font-medium">
                      {item.categoryName || 'Mặc định'}
                    </td>

                    <td className="py-3.5 px-5 font-bold text-[#6F4E37]">
                      {formatCurrency(item.basePrice || item.price)}
                    </td>

                    <td className="py-3.5 px-5">
                      {item.status === 'OUT_OF_STOCK' || item.status === 'INACTIVE' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/70">
                          <XCircle className="w-3.5 h-3.5" />
                          Hết hàng
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Đang bán
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setDeletingProduct(item);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Xóa món"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 text-sm">
                    Chưa có thực đơn nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Xóa món khỏi thực đơn"
        message={`Bạn có chắc chắn muốn xóa món "${deletingProduct?.productName || deletingProduct?.name || ''}" không?`}
      />
    </div>
  );
}

```

# app\dashboard\menu\toppings\page.tsx

| Property | Value |
|----------|-------|
| Path | `app\dashboard\menu\toppings\page.tsx` |
| Size | 10,916 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.322604 |

```tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Sparkles,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { menuService } from '@/api/menu.service';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { ConfirmModal } from '@/components/common/ConfirmModal';

interface ToppingItem {
  id: number;
  name: string;
  price: number;
  status?: string;
}

export default function ToppingsPage() {
  const [toppings, setToppings] = useState<ToppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopping, setEditingTopping] = useState<ToppingItem | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(10000);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTopping, setDeletingTopping] = useState<ToppingItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchToppings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await menuService.getToppings();
      setToppings(Array.isArray(data) ? data : []);
    } catch {
      setToppings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchToppings();
  }, [fetchToppings]);

  const filteredToppings = toppings.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(val);
  };

  const handleOpenCreate = () => {
    setEditingTopping(null);
    setName('');
    setPrice(10000);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: ToppingItem) => {
    setEditingTopping(t);
    setName(t.name || '');
    setPrice(t.price || 0);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingTopping) {
        await menuService.updateTopping(editingTopping.id, { name, price });
      } else {
        await menuService.createTopping({ name, price });
      }
      setIsModalOpen(false);
      fetchToppings();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingTopping) return;
    try {
      await menuService.deleteTopping(deletingTopping.id);
      setIsDeleteModalOpen(false);
      setDeletingTopping(null);
      fetchToppings();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Xóa thất bại');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý Topping & Món thêm</h1>
          <p className="text-sm text-gray-500 mt-1">Danh sách topping tùy chọn kèm theo đồ uống</p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white font-semibold text-sm shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" strokeWidth={2.2} />
          <span>Thêm topping mới</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm topping..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
          />
        </div>

        <div className="text-xs text-gray-500 hidden sm:block">
          Hiển thị: <span className="font-semibold text-gray-800">{filteredToppings.length}</span> topping
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Tên Topping</th>
                <th className="py-3.5 px-5">Giá cộng thêm</th>
                <th className="py-3.5 px-5">Trạng thái</th>
                <th className="py-3.5 px-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400 text-sm">
                    Đang tải danh sách topping...
                  </td>
                </tr>
              ) : filteredToppings.length > 0 ? (
                filteredToppings.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors group">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900 group-hover:text-[#6F4E37] transition-colors block">
                            {item.name}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">ID: #{item.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-5 font-bold text-[#6F4E37]">
                      +{formatCurrency(item.price)}
                    </td>

                    <td className="py-3.5 px-5">
                      {item.status === 'UNAVAILABLE' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/70">
                          <XCircle className="w-3.5 h-3.5" />
                          Tạm ngưng
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Đang phục vụ
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Sửa topping"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeletingTopping(item);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Xóa topping"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400 text-sm">
                    Chưa có topping nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTopping ? 'Chỉnh sửa topping' : 'Thêm topping mới'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Tên topping"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Trân châu hoàng kim, Kem Cheese..."
            required
          />
          <Input
            label="Giá cộng thêm (VNĐ)"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="10000..."
            required
          />
          <div className="pt-2 flex gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" isLoading={submitting}>
              {editingTopping ? 'Lưu thay đổi' : 'Tạo topping'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Xóa topping"
        message={`Bạn có chắc chắn muốn xóa topping "${deletingTopping?.name || ''}" không?`}
      />
    </div>
  );
}

```

# app\dashboard\page.tsx

| Property | Value |
|----------|-------|
| Path | `app\dashboard\page.tsx` |
| Size | 5,563 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.323375 |

```tsx
"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  Coffee,
  ArrowUpRight,
  Loader2,
  RefreshCw,
} from "lucide-react";
import reportService from "@/api/report.service";

export default function DashboardOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState(0);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);
  const [topProductName, setTopProductName] = useState("—");
  const [topProductQty, setTopProductQty] = useState(0);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const [revRes, topRes] = await Promise.all([
        reportService.getDailyRevenue().catch(() => []),
        reportService.getTopProducts().catch(() => []),
      ]);

      const revList = Array.isArray(revRes) ? revRes : [];
      const totalRev = revList.reduce((sum: number, item: any) => sum + (Number(item.revenue) || 0), 0);
      const totalOrders = revList.reduce((sum: number, item: any) => sum + (Number(item.orders) || 0), 0);
      setRevenue(totalRev);
      setTotalOrdersCount(totalOrders);

      const topList = Array.isArray(topRes) ? topRes : [];
      if (topList.length > 0) {
        setTopProductName(topList[0].productName || topList[0].name || "—");
        setTopProductQty(topList[0].totalQuantity || 0);
      }
    } catch (err) {
      console.error("Error fetching overview:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const stats = [
    {
      title: "Tổng doanh thu",
      value: `${revenue.toLocaleString("vi-VN")} đ`,
      change: "Thời gian thực",
      icon: DollarSign,
      color: "bg-emerald-100 text-emerald-800",
    },
    {
      title: "Đơn hàng đã ghi nhận",
      value: `${totalOrdersCount}`,
      change: "Qua hệ thống POS",
      icon: ShoppingBag,
      color: "bg-amber-100 text-amber-800",
    },
    {
      title: "Món bán chạy nhất",
      value: topProductName,
      change: `${topProductQty} ly`,
      icon: Coffee,
      color: "bg-[#F5EBE6] text-[#6F4E37]",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Tổng quan kinh doanh
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi doanh số và hoạt động của cửa hàng theo thời gian thực
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOverview}
          className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
          title="Làm mới"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start justify-between"
            >
              <div>
                <p className="text-xs font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-xl font-bold text-gray-900 mt-1">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin text-[#6F4E37]" /> : stat.value}
                </h3>
                <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{stat.change}</span>
                </div>
              </div>
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Access Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-base font-bold text-gray-900 mb-4">
          Lối tắt nhanh
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <a
            href="/dashboard/menu/products"
            className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-[#6F4E37]/30 hover:bg-[#FAF6F0] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#6F4E37]">
                  Quản lý Thực đơn
                </h4>
                <p className="text-xs text-gray-400">Xem và chỉnh sửa danh mục món</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#6F4E37]" />
          </a>
        </div>
      </div>
    </div>
  );
}

```

# app\dashboard\pagers\page.tsx

| Property | Value |
|----------|-------|
| Path | `app\dashboard\pagers\page.tsx` |
| Size | 50 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.324372 |

```tsx
export { default } from "../../pos/pagers/page";

```

# app\dashboard\reports\page.tsx

| Property | Value |
|----------|-------|
| Path | `app\dashboard\reports\page.tsx` |
| Size | 14,610 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.325373 |

```tsx
"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  Receipt,
  Coffee,
  AlertTriangle,
  Download,
  Sparkles,
  ChevronDown,
  Loader2,
  RefreshCw,
} from "lucide-react";
import reportService from "@/api/report.service";

interface TopProductItem {
  productName?: string;
  name?: string;
  categoryName?: string;
  totalQuantity?: number;
  totalRevenue?: number;
}

interface RevenueItem {
  date?: string;
  day?: string;
  revenue?: number;
  orders?: number;
}

export default function ReportsPage() {
  const [timeFilter, setTimeFilter] = useState("Tuần này");
  const [loading, setLoading] = useState(true);
  const [topProducts, setTopProducts] = useState<TopProductItem[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueItem[]>([]);
  const [lowStockCount, setLowStockCount] = useState(0);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const [topRes, revRes, lowStockRes] = await Promise.all([
        reportService.getTopProducts().catch(() => []),
        reportService.getDailyRevenue().catch(() => []),
        reportService.getLowStockAlert().catch(() => []),
      ]);

      setTopProducts(Array.isArray(topRes) ? topRes : []);
      setRevenueData(Array.isArray(revRes) ? revRes : []);
      setLowStockCount(Array.isArray(lowStockRes) ? lowStockRes.length : 0);
    } catch (err) {
      console.error("Failed to load report data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [timeFilter]);

  const totalRevenue = revenueData.reduce((sum, item) => sum + (Number(item.revenue) || 0), 0);
  const totalOrders = revenueData.reduce((sum, item) => sum + (Number(item.orders) || 0), 0);
  const topProduct = topProducts[0]?.productName || topProducts[0]?.name || "—";
  const topProductQty = topProducts[0]?.totalQuantity || 0;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  const maxRevenue = Math.max(...revenueData.map((r) => Number(r.revenue) || 1), 1);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Page Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Báo cáo doanh thu & Kinh doanh
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tổng hợp hiệu suất kinh doanh, số lượng đơn hàng và sản phẩm bán chạy từ hệ thống
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={fetchReportData}
            className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <div className="relative">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="pl-3.5 pr-8 py-2 rounded-xl border border-gray-200 bg-white text-gray-800 text-xs font-semibold shadow-2xs hover:bg-gray-50 transition-colors focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 cursor-pointer appearance-none"
            >
              <option value="Hôm nay">Hôm nay</option>
              <option value="Tuần này">Tuần này</option>
              <option value="Tháng này">Tháng này</option>
              <option value="Năm nay">Năm nay</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={() => alert("Đang xuất file Excel báo cáo...")}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-gray-500" />
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* 2. Quick Stat Cards (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Tổng doanh thu */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Tổng doanh thu
            </p>
            <h3 className="text-2xl font-extrabold text-[#6F4E37] mt-1.5">
              {formatCurrency(totalRevenue)}
            </h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1">Dữ liệu thời gian thực</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Tổng số đơn hàng */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Tổng đơn hàng
            </p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1.5">
              {totalOrders} <span className="text-sm font-normal text-gray-500">đơn</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">Ghi nhận qua POS</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Món bán chạy nhất */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Món bán chạy nhất
            </p>
            <h3 className="text-lg font-bold text-gray-900 mt-1.5 truncate max-w-[160px]">
              {topProduct}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Đã bán: <span className="font-semibold text-gray-700">{topProductQty} ly</span>
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center shrink-0">
            <Coffee className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Cảnh báo kho */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Cảnh báo kho
            </p>
            <h3 className="text-2xl font-extrabold text-rose-600 mt-1.5">
              {lowStockCount} <span className="text-sm font-normal text-rose-500">mặt hàng</span>
            </h3>
            <p className="text-xs text-rose-500/80 font-medium mt-1">Sắp hết hoặc cần nhập thêm</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Main Content: Chart (Left) + Top Products List (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột Trái: Biểu đồ doanh thu */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Biểu đồ doanh thu ({timeFilter})
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Thống kê doanh thu theo mốc thời gian
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#6F4E37] bg-[#F5EBE6] px-3 py-1 rounded-full w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              Tổng: {formatCurrency(totalRevenue)}
            </span>
          </div>

          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mb-2 text-[#6F4E37]" />
              Đang tải dữ liệu biểu đồ...
            </div>
          ) : revenueData.length > 0 ? (
            <div className="h-64 sm:h-72 w-full flex items-end justify-between gap-2 sm:gap-4 pt-8 pb-2 px-2 border-b border-gray-100">
              {revenueData.map((item, idx) => {
                const heightPercent = Math.round(((Number(item.revenue) || 0) / maxRevenue) * 100);
                const label = item.day || item.date || `T${idx + 1}`;
                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 mb-2 bg-gray-900 text-white text-[10px] font-medium py-1 px-2 rounded-md shadow-lg pointer-events-none whitespace-nowrap text-center">
                      <p className="font-bold">{formatCurrency(Number(item.revenue) || 0)}</p>
                      <p className="text-gray-300 text-[9px]">{item.orders || 0} đơn</p>
                    </div>

                    <div className="w-full max-w-[42px] bg-gray-100 rounded-t-xl overflow-hidden flex flex-col justify-end h-full">
                      <div
                        style={{ height: `${Math.max(heightPercent, 5)}%` }}
                        className="w-full rounded-t-xl bg-[#6F4E37] group-hover:bg-[#5A3F2C] transition-all duration-300"
                      />
                    </div>

                    <span className="text-[11px] mt-3 font-semibold text-gray-500 group-hover:text-gray-800 truncate max-w-[50px]">
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
              Chưa có dữ liệu doanh thu trong khoảng thời gian này.
            </div>
          )}
        </div>

        {/* Cột Phải: Top sản phẩm bán chạy */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900">
              Top sản phẩm bán chạy
            </h3>
            <span className="text-xs text-gray-400 font-medium">Số lượng ly</span>
          </div>

          <div className="flex-1 space-y-4">
            {loading ? (
              <div className="py-12 text-center text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#6F4E37]" />
                Đang tải danh sách...
              </div>
            ) : topProducts.length > 0 ? (
              topProducts.slice(0, 5).map((prod, idx) => {
                const name = prod.productName || prod.name || `Sản phẩm #${idx + 1}`;
                const qty = prod.totalQuantity || 0;
                const rev = prod.totalRevenue || 0;
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                            idx === 0
                              ? "bg-amber-100 text-amber-800"
                              : idx === 1
                              ? "bg-slate-200 text-slate-700"
                              : idx === 2
                              ? "bg-orange-100 text-orange-800"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-gray-800">{name}</span>
                      </div>
                      <span className="font-bold text-[#6F4E37]">{qty} ly</span>
                    </div>

                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        style={{
                          width: `${Math.min(
                            100,
                            (qty / (topProducts[0]?.totalQuantity || 1)) * 100
                          )}%`,
                        }}
                        className="h-full bg-[#6F4E37] rounded-full"
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-gray-400">
                      <span>{prod.categoryName || "Thực đơn"}</span>
                      <span className="font-medium text-gray-600">{formatCurrency(rev)}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-gray-400 text-center py-8">Chưa có dữ liệu bán chạy.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

```

# app\error.tsx

| Property | Value |
|----------|-------|
| Path | `app\error.tsx` |
| Size | 687 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-02 08:51:08.750272 |

```tsx
'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <h2 className="text-xl font-bold">Đã có lỗi xảy ra!</h2>
            <button
                onClick={() => reset()}
                className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                Thử lại
            </button>
        </div>
    );
}
```

# app\favicon.ico

| Property | Value |
|----------|-------|
| Path | `app\favicon.ico` |
| Size | 116 bytes |
| Extension | `.ico` |
| Modified | 2026-10-03 18:43:15.326372 |

> **File nhị phân** (đã bỏ qua nội dung)

# app\GlobalError.tsx

| Property | Value |
|----------|-------|
| Path | `app\GlobalError.tsx` |
| Size | 732 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-02 08:51:08.718403 |

```tsx
'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="vi">
            <body>
                <div className="flex min-h-screen flex-col items-center justify-center p-4">
                    <h2 className="text-xl font-bold">Lỗi hệ thống!</h2>
                    <button
                        onClick={() => reset()}
                        className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        Thử lại
                    </button>
                </div>
            </body>
        </html>
    );
}
```

# app\globals.css

| Property | Value |
|----------|-------|
| Path | `app\globals.css` |
| Size | 24 bytes |
| Extension | `.css` |
| Modified | 2026-10-02 08:51:08.751971 |

```css
@import "tailwindcss";

```

# app\kds\layout.tsx

| Property | Value |
|----------|-------|
| Path | `app\kds\layout.tsx` |
| Size | 142 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-02 08:51:08.753519 |

```tsx
export default function Layout({ children }: { children: React.ReactNode }) {
    return <div className="min-h-screen">{children}</div>;
}

```

# app\kds\queue\page.tsx

| Property | Value |
|----------|-------|
| Path | `app\kds\queue\page.tsx` |
| Size | 16,766 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.327776 |

```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChefHat,
  Clock,
  CheckCircle2,
  Play,
  ArrowLeft,
  Utensils,
  ShoppingBag,
  CheckCheck,
} from "lucide-react";

type OrderStatus = "pending" | "in_progress" | "completed";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  note?: string;
}

interface KDSOrder {
  id: string;
  orderNumber: string;
  table: string;
  orderType: "dine_in" | "take_away";
  createdAt: string;
  minutesAgo: number;
  status: OrderStatus;
  items: OrderItem[];
}

const INITIAL_ORDERS: KDSOrder[] = [
  {
    id: "ord-1",
    orderNumber: "#ORD-104",
    table: "Bàn 04",
    orderType: "dine_in",
    createdAt: "14:25",
    minutesAgo: 4,
    status: "pending",
    items: [
      { id: "i1", name: "Cà phê sữa đá", quantity: 2, note: "Ít đường, nhiều đá" },
      { id: "i2", name: "Bạc xỉu 3 tầng", quantity: 1, note: "Ít sữa đặc" },
      { id: "i3", name: "Bánh Tiramisu Espresso", quantity: 1 },
    ],
  },
  {
    id: "ord-2",
    orderNumber: "#ORD-105",
    table: "Mang về #12",
    orderType: "take_away",
    createdAt: "14:22",
    minutesAgo: 7,
    status: "in_progress",
    items: [
      { id: "i4", name: "Trà đào cam sả", quantity: 2, note: "70% đường, 100% đá" },
      { id: "i5", name: "Trà sen vàng macchiato", quantity: 1, note: "Thêm trân châu trắng" },
    ],
  },
  {
    id: "ord-3",
    orderNumber: "#ORD-106",
    table: "Bàn 02",
    orderType: "dine_in",
    createdAt: "14:18",
    minutesAgo: 11,
    status: "pending",
    items: [
      { id: "i6", name: "Cappuccino nóng", quantity: 1, note: "Tạo hình Latte Art" },
      { id: "i7", name: "Croissant bơ Pháp", quantity: 2, note: "Làm nóng bánh" },
    ],
  },
  {
    id: "ord-4",
    orderNumber: "#ORD-107",
    table: "Bàn 07",
    orderType: "dine_in",
    createdAt: "14:15",
    minutesAgo: 14,
    status: "in_progress",
    items: [
      { id: "i8", name: "Caramel Macchiato đá", quantity: 2 },
      { id: "i9", name: "Sinh tố xoài đá xay", quantity: 1, note: "Không lấy kem tươi" },
    ],
  },
  {
    id: "ord-5",
    orderNumber: "#ORD-103",
    table: "Bàn 01",
    orderType: "dine_in",
    createdAt: "14:05",
    minutesAgo: 24,
    status: "completed",
    items: [
      { id: "i10", name: "Cà phê đen đá", quantity: 2, note: "Đậm vị" },
      { id: "i11", name: "Trà vải hoa hồng", quantity: 1 },
    ],
  },
];

export default function KDSQueuePage() {
  const [orders, setOrders] = useState<KDSOrder[]>(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState<"all" | OrderStatus>("all");
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const advanceOrderStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        if (order.status === "pending") {
          return { ...order, status: "in_progress" };
        }
        if (order.status === "in_progress") {
          return { ...order, status: "completed" };
        }
        return order;
      })
    );
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    return order.status === activeTab;
  });

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const inProgressCount = orders.filter((o) => o.status === "in_progress").length;
  const completedCount = orders.filter((o) => o.status === "completed").length;

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-gray-800 flex flex-col font-sans antialiased">
      {/* ========================================================
          1. HEADER KDS MÀN HÌNH BẾP (Light Cream Theme)
          ======================================================== */}
      <header className="bg-white border-b border-gray-200/80 px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
        {/* Left: Brand Logo & Clock */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            title="Quay về Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center font-bold shadow-xs">
              <ChefHat className="w-6 h-6" strokeWidth={2.2} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none">
                Hàng đợi pha chế (KDS)
              </h1>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                Hệ thống thời gian thực • Quầy Bar
              </p>
            </div>
          </div>

          {/* Clock Widget */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FAF6F0] border border-[#F0E6DD] text-[#6F4E37] font-mono text-sm font-bold ml-3">
            <Clock className="w-4 h-4 text-[#6F4E37]/70" />
            <span>{currentTime || "14:30:00"}</span>
          </div>
        </div>

        {/* Right: Status Filters Horizontal Tabs */}
        <div className="flex items-center gap-1.5 bg-gray-100/80 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-[#6F4E37] text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900 hover:bg-white"
            }`}
          >
            Tất cả ({orders.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pending")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "pending"
                ? "bg-[#6F4E37] text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900 hover:bg-white"
            }`}
          >
            <span>Chờ làm</span>
            {pendingCount > 0 && (
              <span
                className={`w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center ${
                  activeTab === "pending"
                    ? "bg-[#F5EBE6] text-[#6F4E37]"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {pendingCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("in_progress")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "in_progress"
                ? "bg-[#6F4E37] text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900 hover:bg-white"
            }`}
          >
            <span>Đang làm</span>
            {inProgressCount > 0 && (
              <span
                className={`w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center ${
                  activeTab === "in_progress"
                    ? "bg-[#F5EBE6] text-[#6F4E37]"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {inProgressCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("completed")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "completed"
                ? "bg-[#6F4E37] text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900 hover:bg-white"
            }`}
          >
            <span>Xong</span>
            {completedCount > 0 && (
              <span
                className={`w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center ${
                  activeTab === "completed"
                    ? "bg-[#F5EBE6] text-[#6F4E37]"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {completedCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ========================================================
          2. LƯỚI THẺ ORDER (Grid Card - White Card on Cream Background)
          ======================================================== */}
      <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto">
        {filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOrders.map((order) => {
              const isUrgent = order.minutesAgo >= 10 && order.status !== "completed";

              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-2xl border flex flex-col justify-between overflow-hidden shadow-sm transition-all duration-200 ${
                    order.status === "in_progress"
                      ? "border-blue-400 ring-2 ring-blue-400/20"
                      : order.status === "completed"
                      ? "border-emerald-300 opacity-90"
                      : isUrgent
                      ? "border-rose-400 ring-2 ring-rose-400/20"
                      : "border-[#F0E6DD]"
                  }`}
                >
                  {/* Header Thẻ Order */}
                  <div className="p-4 border-b border-gray-100 bg-[#FAF6F0]/40 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-gray-900 tracking-tight">
                          {order.table}
                        </span>
                        <span className="text-xs font-mono text-gray-400 font-medium">
                          {order.orderNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{order.createdAt}</span>
                        <span>•</span>
                        <span
                          className={`font-semibold ${
                            isUrgent ? "text-rose-600" : "text-gray-600"
                          }`}
                        >
                          {order.minutesAgo} phút trước
                        </span>
                      </div>
                    </div>

                    {/* Loại hình phục vụ */}
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        order.orderType === "dine_in"
                          ? "bg-[#F5EBE6] text-[#6F4E37]"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {order.orderType === "dine_in" ? (
                        <>
                          <Utensils className="w-3 h-3" />
                          Tại quán
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3 h-3" />
                          Mang đi
                        </>
                      )}
                    </span>
                  </div>

                  {/* Thân Thẻ: Danh sách món */}
                  <div className="p-4 space-y-2.5 flex-1 overflow-y-auto bg-white">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-gray-50/80 border border-gray-100 flex items-start justify-between gap-3"
                      >
                        <div className="flex items-start gap-2.5 flex-1">
                          <span className="w-6 h-6 rounded-lg bg-[#6F4E37] text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {item.quantity}
                          </span>
                          <div>
                            <p className="font-semibold text-sm text-gray-900 leading-snug">
                              {item.name}
                            </p>
                            {item.note && (
                              <p className="text-xs font-medium text-amber-900 bg-amber-50 border border-amber-200/80 rounded-md px-2 py-0.5 mt-1 inline-block">
                                ⭐ {item.note}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer Thẻ: Nút chuyển trạng thái */}
                  <div className="p-4 border-t border-gray-100 bg-white">
                    {order.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => advanceOrderStatus(order.id)}
                        className="w-full py-3 px-4 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-[0.98]"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Bắt đầu pha chế</span>
                      </button>
                    )}

                    {order.status === "in_progress" && (
                      <button
                        type="button"
                        onClick={() => advanceOrderStatus(order.id)}
                        className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-[0.98]"
                      >
                        <CheckCheck className="w-5 h-5" />
                        <span>Hoàn thành món</span>
                      </button>
                    )}

                    {order.status === "completed" && (
                      <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 font-semibold text-xs flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Đã giao bàn / Hoàn tất</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-96 flex flex-col items-center justify-center text-center p-8 text-gray-400">
            <ChefHat className="w-16 h-16 mb-3 stroke-1 text-gray-300" />
            <p className="text-base font-semibold text-gray-700">
              Không có đơn hàng nào trong mục này
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Đơn hàng mới từ quầy POS sẽ tự động xuất hiện tại đây
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

```

# app\layout.tsx

| Property | Value |
|----------|-------|
| Path | `app\layout.tsx` |
| Size | 631 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.330362 |

```tsx
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
    title: 'Coffee Management System',
    description: 'Hệ thống quản lý chuỗi cà phê POS & Inventory',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="vi">
            <body className="antialiased text-gray-900 bg-white">
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}

```

# app\loading.tsx

| Property | Value |
|----------|-------|
| Path | `app\loading.tsx` |
| Size | 184 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-02 08:51:08.758585 |

```tsx
export default function Loading() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <p>Đang tải...</p>
        </div>
    );
}
```

# app\not-found.tsx

| Property | Value |
|----------|-------|
| Path | `app\not-found.tsx` |
| Size | 411 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-02 08:51:08.759853 |

```tsx
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <h2 className="text-2xl font-bold">404 - Không tìm thấy trang</h2>
            <Link href="/" className="mt-4 text-blue-600 hover:underline">
                Về trang chủ
            </Link>
        </div>
    );
}
```

# app\page.tsx

| Property | Value |
|----------|-------|
| Path | `app\page.tsx` |
| Size | 602 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-02 08:51:08.761015 |

```tsx
import Image from 'next/image';
import boCuteImg from '@/constants/bocute.webp';

export default function HomePage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50">
            <h1 className="text-4xl font-bold text-gray-800">
                Chào các bạn
            </h1>
            <Image
                src={boCuteImg}
                alt="Bo cute"
                className="w-48 h-48 rounded-full border-4 border-white shadow-lg object-cover"
                priority
            />
        </main>
    );
}
```

# app\pos\layout.tsx

| Property | Value |
|----------|-------|
| Path | `app\pos\layout.tsx` |
| Size | 142 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-02 08:51:08.762316 |

```tsx
export default function Layout({ children }: { children: React.ReactNode }) {
    return <div className="min-h-screen">{children}</div>;
}

```

# app\pos\orders\[id]\page.tsx

| Property | Value |
|----------|-------|
| Path | `app\pos\orders\[id]\page.tsx` |
| Size | 215 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-02 08:51:08.763935 |

```tsx
export default function Page() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800">Chi tiết đơn hàng (POS Order Detail)</h1>
        </div>
    );
}

```

# app\pos\orders\page.tsx

| Property | Value |
|----------|-------|
| Path | `app\pos\orders\page.tsx` |
| Size | 38,667 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.331769 |

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Eye,
  Printer,
  XCircle,
  Clock,
  ArrowLeft,
  User,
  CreditCard,
  Banknote,
  QrCode,
  X,
  AlertTriangle,
  RotateCcw,
  Utensils,
  ShoppingBag,
  BellRing,
  CheckCircle2,
} from "lucide-react";

type OrderStatus = "PENDING_PREP" | "READY_FOR_PICKUP" | "COMPLETED" | "CANCELLED";
type PaymentMethod = "CASH" | "CARD" | "QR_CODE";

interface OrderItemDetail {
  id: string;
  name: string;
  size: "M" | "L";
  quantity: number;
  price: number;
  toppings?: string[];
  note?: string;
  itemStatus: "WAITING" | "COOKING" | "READY";
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone?: string;
  cashierName: string;
  buzzerNumber: string;
  orderType: "DINE_IN" | "TAKE_AWAY";
  paymentMethod: PaymentMethod;
  paymentStatus: "PAID" | "UNPAID";
  status: OrderStatus;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  cancelReason?: string;
  items: OrderItemDetail[];
}

const MOCK_ORDERS: Order[] = [
  {
    id: "ord-001",
    orderNumber: "#ORD-2026-001",
    createdAt: "20:15 - 02/10/2026",
    customerName: "Nguyễn Văn An",
    customerPhone: "0901 234 567",
    cashierName: "Nguyễn Thu Ngân",
    buzzerNumber: "Thẻ rung #04",
    orderType: "DINE_IN",
    paymentMethod: "QR_CODE",
    paymentStatus: "PAID",
    status: "PENDING_PREP",
    subtotal: 78000,
    discount: 0,
    tax: 6240,
    total: 84240,
    items: [
      {
        id: "it-1",
        name: "Cà phê sữa đá",
        size: "L",
        quantity: 2,
        price: 34000,
        toppings: ["Trân châu hoàng kim (+10k)"],
        note: "Ít ngọt, nhiều đá",
        itemStatus: "COOKING",
      },
      {
        id: "it-2",
        name: "Bánh Tiramisu Espresso",
        size: "M",
        quantity: 1,
        price: 45000,
        itemStatus: "READY",
      },
    ],
  },
  {
    id: "ord-002",
    orderNumber: "#ORD-2026-002",
    createdAt: "19:42 - 02/10/2026",
    customerName: "Trần Thị Mai",
    customerPhone: "0912 345 678",
    cashierName: "Nguyễn Thu Ngân",
    buzzerNumber: "Thẻ rung #12",
    orderType: "TAKE_AWAY",
    paymentMethod: "CASH",
    paymentStatus: "PAID",
    status: "READY_FOR_PICKUP",
    subtotal: 109000,
    discount: 10000,
    tax: 7920,
    total: 106920,
    items: [
      {
        id: "it-3",
        name: "Trà đào cam sả",
        size: "L",
        quantity: 2,
        price: 39000,
        toppings: ["Thạch đào giòn (+10k)"],
        note: "70% đường, 100% đá",
        itemStatus: "READY",
      },
      {
        id: "it-4",
        name: "Trà sen vàng macchiato",
        size: "M",
        quantity: 1,
        price: 41000,
        toppings: ["Kem Cheese Macchiato (+12k)"],
        itemStatus: "READY",
      },
    ],
  },
  {
    id: "ord-003",
    orderNumber: "#ORD-2026-003",
    createdAt: "18:30 - 02/10/2026",
    customerName: "Khách vãng lai",
    cashierName: "Lê Quốc Bảo",
    buzzerNumber: "Bàn 02",
    orderType: "DINE_IN",
    paymentMethod: "CARD",
    paymentStatus: "PAID",
    status: "COMPLETED",
    subtotal: 125000,
    discount: 0,
    tax: 10000,
    total: 135000,
    items: [
      {
        id: "it-5",
        name: "Cappuccino nóng",
        size: "M",
        quantity: 2,
        price: 42000,
        note: "Latte Art hình hoa hồng",
        itemStatus: "READY",
      },
      {
        id: "it-6",
        name: "Croissant bơ Pháp",
        size: "M",
        quantity: 1,
        price: 32000,
        note: "Làm nóng bánh",
        itemStatus: "READY",
      },
    ],
  },
  {
    id: "ord-004",
    orderNumber: "#ORD-2026-004",
    createdAt: "17:15 - 02/10/2026",
    customerName: "Phạm Thùy Linh",
    customerPhone: "0977 123 456",
    cashierName: "Lê Quốc Bảo",
    buzzerNumber: "Mang về #08",
    orderType: "TAKE_AWAY",
    paymentMethod: "QR_CODE",
    paymentStatus: "UNPAID",
    status: "CANCELLED",
    cancelReason: "Khách có việc gấp không chờ lấy món được",
    subtotal: 64000,
    discount: 0,
    tax: 5120,
    total: 69120,
    items: [
      {
        id: "it-7",
        name: "Bạc xỉu 3 tầng",
        size: "M",
        quantity: 2,
        price: 32000,
        itemStatus: "WAITING",
      },
    ],
  },
];

export default function POSOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Modals & Drawer state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [printingOrder, setPrintingOrder] = useState<Order | null>(null);

  // Lọc đơn hàng
  const filteredOrders = orders.filter((ord) => {
    const matchSearch =
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ord.customerPhone && ord.customerPhone.includes(searchQuery)) ||
      ord.buzzerNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === "ALL" || ord.status === statusFilter;
    const matchPayment = paymentFilter === "ALL" || ord.paymentMethod === paymentFilter;

    return matchSearch && matchStatus && matchPayment;
  });

  const handleResetFilter = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setPaymentFilter("ALL");
    setFromDate("");
    setToDate("");
  };

  const handleOpenDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  const handleOpenCancel = (order: Order) => {
    setCancellingOrder(order);
    setCancelReason("");
  };

  const handleConfirmCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellingOrder) return;
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === cancellingOrder.id
          ? {
              ...ord,
              status: "CANCELLED",
              cancelReason: cancelReason || "Hủy theo yêu cầu của khách",
            }
          : ord
      )
    );
    setCancellingOrder(null);
  };

  const handlePayOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId ? { ...ord, paymentStatus: "PAID" } : ord
      )
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, paymentStatus: "PAID" });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "PENDING_PREP":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Chờ pha chế
          </span>
        );
      case "READY_FOR_PICKUP":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
            <BellRing className="w-3.5 h-3.5" />
            Chờ nhận món
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Hoàn thành
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
            <XCircle className="w-3.5 h-3.5" />
            Đã hủy
          </span>
        );
    }
  };

  const getPaymentMethodBadge = (method: PaymentMethod) => {
    switch (method) {
      case "CASH":
        return (
          <span className="inline-flex items-center gap-1 text-xs text-gray-700 font-medium">
            <Banknote className="w-3.5 h-3.5 text-emerald-600" />
            Tiền mặt
          </span>
        );
      case "CARD":
        return (
          <span className="inline-flex items-center gap-1 text-xs text-gray-700 font-medium">
            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
            Quẹt thẻ
          </span>
        );
      case "QR_CODE":
        return (
          <span className="inline-flex items-center gap-1 text-xs text-gray-700 font-medium">
            <QrCode className="w-3.5 h-3.5 text-[#6F4E37]" />
            Chuyển khoản QR
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-gray-800 font-sans antialiased pb-12">
      {/* 1. HEADER THANH ĐIỀU HƯỚNG */}
      <header className="bg-white border-b border-gray-200/80 px-6 py-4 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/pos/terminal"
              className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              title="Quay lại POS Terminal"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Lịch sử hóa đơn & Đơn hàng
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Tra cứu chi tiết hóa đơn, trạng thái pha chế và in lại hóa đơn POS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/pos/terminal"
              className="px-4 py-2 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Vào màn hình Bán hàng (POS)
            </Link>
          </div>
        </div>
      </header>

      {/* 2. BỘ LỌC CÔNG CỤ (Toolbar Filter) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-5">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo mã #ORD, tên khách, SĐT, thẻ rung..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 transition-colors focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-3 pr-7 py-2 text-xs font-medium rounded-xl border border-gray-200 bg-white text-gray-700 transition-colors focus:outline-none focus:border-[#6F4E37] cursor-pointer"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="PENDING_PREP">Chờ pha chế</option>
                <option value="READY_FOR_PICKUP">Chờ nhận món</option>
                <option value="COMPLETED">Hoàn thành</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>
            </div>

            <div className="relative">
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="pl-3 pr-7 py-2 text-xs font-medium rounded-xl border border-gray-200 bg-white text-gray-700 transition-colors focus:outline-none focus:border-[#6F4E37] cursor-pointer"
              >
                <option value="ALL">Tất cả thanh toán</option>
                <option value="CASH">Tiền mặt</option>
                <option value="CARD">Thẻ ngân hàng</option>
                <option value="QR_CODE">Chuyển khoản QR</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-[#6F4E37]"
                title="Từ ngày"
              />
              <span>-</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-[#6F4E37]"
                title="Đến ngày"
              />
            </div>

            <button
              type="button"
              onClick={handleResetFilter}
              className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
              title="Đặt lại bộ lọc"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3. BẢNG DỮ LIỆU ĐƠN HÀNG (Data Table) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  <th scope="col" className="py-3.5 px-5">
                    Mã HĐ & Ngày tạo
                  </th>
                  <th scope="col" className="py-3.5 px-5">
                    Khách hàng
                  </th>
                  <th scope="col" className="py-3.5 px-5">
                    Thẻ rung / Bàn
                  </th>
                  <th scope="col" className="py-3.5 px-5">
                    Thu ngân
                  </th>
                  <th scope="col" className="py-3.5 px-5">
                    Thanh toán
                  </th>
                  <th scope="col" className="py-3.5 px-5">
                    Tổng tiền
                  </th>
                  <th scope="col" className="py-3.5 px-5">
                    Trạng thái
                  </th>
                  <th scope="col" className="py-3.5 px-5 text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50/60 transition-colors group"
                    >
                      <td className="py-3.5 px-5">
                        <span className="font-bold text-gray-900 group-hover:text-[#6F4E37] transition-colors block">
                          {order.orderNumber}
                        </span>
                        <span className="text-xs text-gray-400 font-mono flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {order.createdAt}
                        </span>
                      </td>

                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#F5EBE6] text-[#6F4E37] text-xs font-bold flex items-center justify-center shrink-0">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800 text-xs block">
                              {order.customerName}
                            </span>
                            {order.customerPhone && (
                              <span className="text-[11px] text-gray-400 font-mono">
                                {order.customerPhone}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 text-xs font-semibold">
                          {order.orderType === "DINE_IN" ? (
                            <Utensils className="w-3 h-3 text-[#6F4E37]" />
                          ) : (
                            <ShoppingBag className="w-3 h-3 text-[#6F4E37]" />
                          )}
                          {order.buzzerNumber}
                        </span>
                      </td>

                      <td className="py-3.5 px-5 text-xs text-gray-600 font-medium">
                        {order.cashierName}
                      </td>

                      <td className="py-3.5 px-5">
                        {getPaymentMethodBadge(order.paymentMethod)}
                      </td>

                      <td className="py-3.5 px-5 font-bold text-[#6F4E37]">
                        {formatCurrency(order.total)}
                      </td>

                      <td className="py-3.5 px-5">
                        {getStatusBadge(order.status)}
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(order)}
                            className="p-1.5 rounded-lg text-gray-600 hover:text-[#6F4E37] hover:bg-[#F5EBE6] transition-colors cursor-pointer"
                            title="Xem chi tiết đơn"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setPrintingOrder(order)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="In hóa đơn K80"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {order.status !== "CANCELLED" && (
                            <button
                              type="button"
                              onClick={() => handleOpenCancel(order)}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Hủy đơn hàng"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-12 text-center text-gray-400 text-sm"
                    >
                      Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 bg-white">
            <p>
              Hiển thị{" "}
              <span className="font-semibold text-gray-800">
                {filteredOrders.length}
              </span>{" "}
              trên tổng số{" "}
              <span className="font-semibold text-gray-800">
                {orders.length}
              </span>{" "}
              đơn hàng
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-400 text-xs font-medium opacity-50 cursor-not-allowed"
              >
                Trước
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-medium cursor-pointer"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 4. ORDER DETAIL DRAWER */}
      {isDrawerOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-[#FAF6F0]/50">
              <div>
                <span className="text-xs font-mono text-gray-400">Chi tiết đơn hàng</span>
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-xl hover:bg-gray-200/60 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Thời gian tạo:</span>
                  <span className="font-semibold text-gray-800">{selectedOrder.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Khách hàng:</span>
                  <span className="font-semibold text-gray-800">
                    {selectedOrder.customerName} {selectedOrder.customerPhone ? `(${selectedOrder.customerPhone})` : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Vị trí / Thẻ rung:</span>
                  <span className="font-semibold text-gray-800">{selectedOrder.buzzerNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Thu ngân phụ trách:</span>
                  <span className="font-semibold text-gray-800">{selectedOrder.cashierName}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-gray-200/60">
                  <span className="text-gray-400">Trạng thái:</span>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                {selectedOrder.cancelReason && (
                  <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                    <strong>Lý do hủy:</strong> {selectedOrder.cancelReason}
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                  Danh sách món ({selectedOrder.items.length})
                </h4>
                <div className="space-y-2.5 divide-y divide-gray-100">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="pt-2.5 first:pt-0 space-y-1">
                      <div className="flex justify-between items-start text-xs">
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-md bg-[#6F4E37] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                            {item.quantity}
                          </span>
                          <div>
                            <p className="font-bold text-gray-900">
                              {item.name} <span className="text-gray-400 font-normal">({item.size})</span>
                            </p>
                            {item.toppings && item.toppings.length > 0 && (
                              <p className="text-[11px] text-[#6F4E37] font-medium">
                                + {item.toppings.join(", ")}
                              </p>
                            )}
                            {item.note && (
                              <p className="text-[11px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded inline-block mt-0.5">
                                💬 {item.note}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="font-semibold text-gray-800">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-2xs space-y-2 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Tạm tính</span>
                  <span className="font-medium text-gray-800">{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Giảm giá</span>
                  <span className="font-medium text-gray-800">{formatCurrency(selectedOrder.discount)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Thuế VAT (8%)</span>
                  <span className="font-medium text-gray-800">{formatCurrency(selectedOrder.tax)}</span>
                </div>
                <div className="pt-2 border-t border-gray-100 flex justify-between items-baseline">
                  <span className="font-bold text-gray-900 text-sm">Tổng cộng</span>
                  <span className="font-extrabold text-lg text-[#6F4E37]">
                    {formatCurrency(selectedOrder.total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-white flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setPrintingOrder(selectedOrder);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4 text-gray-500" />
                <span>In hóa đơn</span>
              </button>

              {selectedOrder.paymentStatus === "UNPAID" && selectedOrder.status !== "CANCELLED" && (
                <button
                  type="button"
                  onClick={() => handlePayOrder(selectedOrder.id)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Hoàn tất thanh toán</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. CANCEL ORDER MODAL */}
      {cancellingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Hủy đơn hàng {cancellingOrder.orderNumber}
                </h3>
                <p className="text-xs text-gray-500">
                  Thao tác này sẽ hoàn trả nguyên liệu vào kho
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmCancel} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Lý do hủy đơn <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Nhập lý do hủy (VD: Khách đổi ý, Hết nguyên liệu, Nhập sai đơn...)"
                  className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCancellingOrder(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Xác nhận hủy đơn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. INVOICE PRINT MODAL */}
      {printingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 flex flex-col space-y-4 max-h-[90vh]">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Xem trước Hóa đơn K80
              </span>
              <button
                type="button"
                onClick={() => setPrintingOrder(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-gray-50/80 rounded-xl border border-dashed border-gray-300 font-mono text-[11px] text-gray-800 space-y-3 overflow-y-auto flex-1">
              <div className="text-center space-y-0.5 border-b border-dashed border-gray-300 pb-3">
                <h4 className="font-extrabold text-sm text-gray-900 tracking-wider">
                  DINEDESK COFFEE
                </h4>
                <p className="text-[10px] text-gray-500">123 Đường Cà Phê, Quận 1, TP.HCM</p>
                <p className="text-[10px] text-gray-500">Hotline: 1900 6868 • WiFi: d製品desk</p>
              </div>

              <div className="space-y-1 border-b border-dashed border-gray-300 pb-2.5">
                <div className="flex justify-between">
                  <span>Hóa đơn:</span>
                  <span className="font-bold">{printingOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Thời gian:</span>
                  <span>{printingOrder.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span>Thu ngân:</span>
                  <span>{printingOrder.cashierName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Vị trí:</span>
                  <span className="font-bold">{printingOrder.buzzerNumber}</span>
                </div>
              </div>

              <div className="space-y-1.5 border-b border-dashed border-gray-300 pb-3">
                <div className="flex justify-between font-bold text-[10px] uppercase text-gray-400">
                  <span>Món</span>
                  <span>T.Tiền</span>
                </div>
                {printingOrder.items.map((it) => (
                  <div key={it.id} className="space-y-0.5">
                    <div className="flex justify-between">
                      <span className="font-semibold">
                        {it.quantity}x {it.name} ({it.size})
                      </span>
                      <span>{formatCurrency(it.price * it.quantity)}</span>
                    </div>
                    {it.toppings && (
                      <p className="text-[10px] text-gray-500 pl-3">
                        + {it.toppings.join(", ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-1 pt-1 border-b border-dashed border-gray-300 pb-3">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{formatCurrency(printingOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Giảm giá:</span>
                  <span>-{formatCurrency(printingOrder.discount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (8%):</span>
                  <span>{formatCurrency(printingOrder.tax)}</span>
                </div>
                <div className="flex justify-between font-extrabold text-xs text-gray-900 pt-1">
                  <span>TỔNG TIỀN:</span>
                  <span>{formatCurrency(printingOrder.total)}</span>
                </div>
              </div>

              <div className="text-center pt-2 space-y-1">
                <p className="font-bold text-[10px]">CẢMƠN QUÝ KHÁCH & HẸN GẶP LẠI!</p>
                <p className="text-[9px] text-gray-400">Powered by DineDesk POS</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPrintingOrder(null)}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  alert("Đã gửi lệnh in đến máy in nhiệt K80 thành công!");
                  setPrintingOrder(null);
                }}
                className="flex-1 py-2 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>In ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

```

# app\pos\pagers\page.tsx

| Property | Value |
|----------|-------|
| Path | `app\pos\pagers\page.tsx` |
| Size | 30,085 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.334192 |

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BellRing,
  BatteryLow,
  BatteryMedium,
  BatteryCharging,
  BatteryWarning,
  Clock,
  ArrowLeft,
  Search,
  Plus,
  CheckCircle2,
  X,
  Radio,
  SlidersHorizontal,
  Wrench,
  Zap,
} from "lucide-react";

type PagerStatus = "AVAILABLE" | "IN_USE" | "CHARGING" | "MAINTENANCE";

interface ActivePager {
  id: string;
  pagerCode: string;
  batteryLevel: number; // percentage
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  orderTime: string;
  waitingMinutes: number;
  orderStatus: "COOKING" | "READY";
}

interface PagerDevice {
  id: string;
  pagerCode: string;
  batteryLevel: number;
  status: PagerStatus;
  currentOrder?: string;
  chargingDock: string;
  lastMaintenance: string;
}

const MOCK_ACTIVE_PAGERS: ActivePager[] = [
  {
    id: "ap-1",
    pagerCode: "PAGER-04",
    batteryLevel: 85,
    orderNumber: "#ORD-2026-001",
    customerName: "Nguyễn Văn An",
    customerPhone: "0901 234 567",
    orderTime: "20:15",
    waitingMinutes: 6,
    orderStatus: "COOKING",
  },
  {
    id: "ap-2",
    pagerCode: "PAGER-12",
    batteryLevel: 12, // Pin yếu < 15%
    orderNumber: "#ORD-2026-002",
    customerName: "Trần Thị Mai",
    customerPhone: "0912 345 678",
    orderTime: "19:42",
    waitingMinutes: 18, // Chờ lâu > 15 phút
    orderStatus: "READY",
  },
  {
    id: "ap-3",
    pagerCode: "PAGER-08",
    batteryLevel: 64,
    orderNumber: "#ORD-2026-005",
    customerName: "Lê Hoàng Phúc",
    customerPhone: "0988 765 432",
    orderTime: "20:05",
    waitingMinutes: 16, // Chờ lâu > 15 phút
    orderStatus: "COOKING",
  },
  {
    id: "ap-4",
    pagerCode: "PAGER-02",
    batteryLevel: 95,
    orderNumber: "#ORD-2026-006",
    customerName: "Vũ Đức Thắng",
    customerPhone: "0933 888 999",
    orderTime: "20:18",
    waitingMinutes: 3,
    orderStatus: "COOKING",
  },
];

const MOCK_ALL_DEVICES: PagerDevice[] = [
  {
    id: "dev-1",
    pagerCode: "PAGER-01",
    batteryLevel: 100,
    status: "AVAILABLE",
    chargingDock: "Khay A - Vị trí 01",
    lastMaintenance: "20/09/2026",
  },
  {
    id: "dev-2",
    pagerCode: "PAGER-02",
    batteryLevel: 95,
    status: "IN_USE",
    currentOrder: "#ORD-2026-006",
    chargingDock: "Khay A - Vị trí 02",
    lastMaintenance: "20/09/2026",
  },
  {
    id: "dev-3",
    pagerCode: "PAGER-03",
    batteryLevel: 45,
    status: "CHARGING",
    chargingDock: "Khay A - Vị trí 03",
    lastMaintenance: "22/09/2026",
  },
  {
    id: "dev-4",
    pagerCode: "PAGER-04",
    batteryLevel: 85,
    status: "IN_USE",
    currentOrder: "#ORD-2026-001",
    chargingDock: "Khay A - Vị trí 04",
    lastMaintenance: "20/09/2026",
  },
  {
    id: "dev-5",
    pagerCode: "PAGER-08",
    batteryLevel: 64,
    status: "IN_USE",
    currentOrder: "#ORD-2026-005",
    chargingDock: "Khay B - Vị trí 01",
    lastMaintenance: "15/09/2026",
  },
  {
    id: "dev-6",
    pagerCode: "PAGER-12",
    batteryLevel: 12,
    status: "IN_USE",
    currentOrder: "#ORD-2026-002",
    chargingDock: "Khay B - Vị trí 05",
    lastMaintenance: "18/09/2026",
  },
  {
    id: "dev-7",
    pagerCode: "PAGER-15",
    batteryLevel: 0,
    status: "MAINTENANCE",
    chargingDock: "Khu kỹ thuật",
    lastMaintenance: "01/10/2026",
  },
];

export default function PagersManagementPage() {
  const [activeTab, setActiveTab] = useState<"active_dashboard" | "all_devices">("active_dashboard");
  const [activePagers, setActivePagers] = useState<ActivePager[]>(MOCK_ACTIVE_PAGERS);
  const [devices, setDevices] = useState<PagerDevice[]>(MOCK_ALL_DEVICES);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal Thêm Thẻ Mới
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPagerCode, setNewPagerCode] = useState("");
  const [newBatteryLevel, setNewBatteryLevel] = useState(100);
  const [newChargingDock, setNewChargingDock] = useState("Khay A");

  // Xử lý thu hồi thẻ (Release)
  const handleReleasePager = (pagerId: string, pagerCode: string) => {
    setActivePagers((prev) => prev.filter((p) => p.id !== pagerId));
    setDevices((prev) =>
      prev.map((d) =>
        d.pagerCode === pagerCode
          ? { ...d, status: "AVAILABLE", currentOrder: undefined }
          : d
      )
    );
  };

  // Xử lý rung chuông gọi khách
  const handleBuzzPager = (pagerCode: string) => {
    alert(`Đang gửi tín hiệu RUNG & PHÁT ÂM THANH đến thẻ ${pagerCode}!`);
  };

  // Thêm thẻ mới
  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPagerCode) return;
    const newDev: PagerDevice = {
      id: `dev-${Date.now()}`,
      pagerCode: newPagerCode.toUpperCase(),
      batteryLevel: Number(newBatteryLevel),
      status: "AVAILABLE",
      chargingDock: newChargingDock,
      lastMaintenance: new Date().toLocaleDateString("vi-VN"),
    };
    setDevices((prev) => [...prev, newDev]);
    setIsAddModalOpen(false);
    setNewPagerCode("");
    setNewBatteryLevel(100);
  };

  // Lọc danh sách theo search
  const filteredActivePagers = activePagers.filter(
    (p) =>
      p.pagerCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDevices = devices.filter(
    (d) =>
      d.pagerCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.chargingDock.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderBatteryIndicator = (battery: number) => {
    if (battery < 15) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/80">
          <BatteryWarning className="w-3.5 h-3.5 text-rose-600 animate-bounce" />
          {battery}% (Pin yếu)
        </span>
      );
    }
    if (battery < 50) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
          <BatteryLow className="w-3.5 h-3.5" />
          {battery}%
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
        <BatteryMedium className="w-3.5 h-3.5" />
        {battery}%
      </span>
    );
  };

  const getDeviceStatusBadge = (status: PagerStatus) => {
    switch (status) {
      case "AVAILABLE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Sẵn sàng
          </span>
        );
      case "IN_USE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F5EBE6] text-[#6F4E37] border border-[#E8D6CB]">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            Đang phát
          </span>
        );
      case "CHARGING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/70">
            <BatteryCharging className="w-3.5 h-3.5 text-blue-600" />
            Đang sạc
          </span>
        );
      case "MAINTENANCE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Wrench className="w-3.5 h-3.5 text-slate-500" />
            Bảo trì
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-gray-800 font-sans antialiased pb-12">
      {/* 1. HEADER */}
      <header className="bg-white border-b border-gray-200/80 px-6 py-4 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/pos/terminal"
              className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              title="Quay lại POS Terminal"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center font-bold">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Bảng điều phối & Thu hồi Thẻ rung
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Giám sát thẻ rung đang phục vụ, mức pin và quản lý thiết bị phần cứng
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/pos/terminal"
              className="px-4 py-2 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Về Thu ngân POS
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-5">
        {/* 2. THANH TAB CHUYỂN ĐỔI */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-200/80 shadow-2xs w-fit">
            <button
              type="button"
              onClick={() => setActiveTab("active_dashboard")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "active_dashboard"
                  ? "bg-[#6F4E37] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>Điều phối thẻ đang phát</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                  activeTab === "active_dashboard"
                    ? "bg-[#F5EBE6] text-[#6F4E37]"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {activePagers.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("all_devices")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "all_devices"
                  ? "bg-[#6F4E37] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Quản lý thiết bị phần cứng</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                  activeTab === "all_devices"
                    ? "bg-[#F5EBE6] text-[#6F4E37]"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {devices.length}
              </span>
            </button>
          </div>

          {/* Action button if tab 2 */}
          {activeTab === "all_devices" && (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm thẻ rung mới</span>
            </button>
          )}
        </div>

        {/* 3. TOOLBAR TÌM KIẾM */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo mã thẻ PAGER-..., mã đơn, tên khách..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 transition-colors focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
            />
          </div>

          <div className="text-xs text-gray-500 font-medium hidden sm:block">
            {activeTab === "active_dashboard"
              ? `Đang có ${filteredActivePagers.length} thẻ đang giao cho khách`
              : `Tổng ${filteredDevices.length} thiết bị trong hệ thống`}
          </div>
        </div>

        {/* ========================================================
            4. TAB 1: BẢNG ĐIỀU PHỐI (Active Pagers Dashboard)
            ======================================================== */}
        {activeTab === "active_dashboard" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    <th scope="col" className="py-3.5 px-5">
                      Mã Thẻ (Pager Code)
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Mức Pin
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Mã đơn liên kết
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Khách hàng & SĐT
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Thời gian chờ
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Trạng thái món
                    </th>
                    <th scope="col" className="py-3.5 px-5 text-right">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredActivePagers.length > 0 ? (
                    filteredActivePagers.map((pager) => {
                      const isOverdue = pager.waitingMinutes > 15;

                      return (
                        <tr
                          key={pager.id}
                          className="hover:bg-gray-50/60 transition-colors group"
                        >
                          {/* Mã Thẻ */}
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center font-bold text-xs shrink-0">
                                <Radio className="w-4 h-4" />
                              </div>
                              <span className="font-extrabold text-gray-900 group-hover:text-[#6F4E37] transition-colors">
                                {pager.pagerCode}
                              </span>
                            </div>
                          </td>

                          {/* Mức pin */}
                          <td className="py-3.5 px-5">
                            {renderBatteryIndicator(pager.batteryLevel)}
                          </td>

                          {/* Mã đơn liên kết */}
                          <td className="py-3.5 px-5">
                            <span className="font-semibold text-gray-800 text-xs font-mono">
                              {pager.orderNumber}
                            </span>
                          </td>

                          {/* Khách hàng & SĐT */}
                          <td className="py-3.5 px-5">
                            <div>
                              <span className="font-semibold text-gray-900 text-xs block">
                                {pager.customerName}
                              </span>
                              {pager.customerPhone && (
                                <span className="text-[11px] text-gray-400 font-mono">
                                  {pager.customerPhone}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Số phút đã chờ */}
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              <span
                                className={`text-xs font-bold ${
                                  isOverdue
                                    ? "text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200"
                                    : "text-gray-700"
                                }`}
                              >
                                {pager.waitingMinutes} phút
                              </span>
                            </div>
                          </td>

                          {/* Trạng thái món */}
                          <td className="py-3.5 px-5">
                            {pager.orderStatus === "READY" ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                                Món đã xong • Gọi khách
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                Đang pha chế
                              </span>
                            )}
                          </td>

                          {/* Thao tác */}
                          <td className="py-3.5 px-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Rung chuông */}
                              <button
                                type="button"
                                onClick={() => handleBuzzPager(pager.pagerCode)}
                                className="px-2.5 py-1.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                title="Rung chuông & Nhấp nháy gọi khách"
                              >
                                <Zap className="w-3.5 h-3.5 text-blue-600" />
                                <span>Rung chuông</span>
                              </button>

                              {/* Thu hồi thẻ */}
                              <button
                                type="button"
                                onClick={() => handleReleasePager(pager.id, pager.pagerCode)}
                                className="px-3 py-1.5 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                                title="Thu hồi thẻ về khay sạc"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Thu hồi</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-12 text-center text-gray-400 text-sm"
                      >
                        Không có thẻ rung nào đang được phát cho khách.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            5. TAB 2: QUẢN LÝ THIẾT BỊ PHẦN CỨNG (All Devices)
            ======================================================== */}
        {activeTab === "all_devices" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    <th scope="col" className="py-3.5 px-5">
                      Mã Thiết bị
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Mức Pin
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Trạng thái hoạt động
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Đơn hàng hiện tại
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Khay sạc / Vị trí
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Bảo dưỡng gần nhất
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredDevices.length > 0 ? (
                    filteredDevices.map((dev) => (
                      <tr
                        key={dev.id}
                        className="hover:bg-gray-50/60 transition-colors group"
                      >
                        <td className="py-3.5 px-5">
                          <span className="font-extrabold text-gray-900 group-hover:text-[#6F4E37] transition-colors">
                            {dev.pagerCode}
                          </span>
                        </td>

                        <td className="py-3.5 px-5">
                          {renderBatteryIndicator(dev.batteryLevel)}
                        </td>

                        <td className="py-3.5 px-5">
                          {getDeviceStatusBadge(dev.status)}
                        </td>

                        <td className="py-3.5 px-5 font-mono text-xs text-gray-700">
                          {dev.currentOrder ? (
                            <span className="font-bold text-[#6F4E37]">
                              {dev.currentOrder}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>

                        <td className="py-3.5 px-5 text-xs text-gray-600">
                          {dev.chargingDock}
                        </td>

                        <td className="py-3.5 px-5 text-xs text-gray-400 font-mono">
                          {dev.lastMaintenance}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-gray-400 text-sm"
                      >
                        Không tìm thấy thiết bị nào phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================
          6. MODAL THÊM THẺ RUNG MỚI
          ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  Thêm Thẻ rung mới
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDevice} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Mã thẻ rung (VD: PAGER-16) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newPagerCode}
                  onChange={(e) => setNewPagerCode(e.target.value)}
                  placeholder="Nhập mã thẻ rung..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Mức pin ban đầu (%)
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={newBatteryLevel}
                  onChange={(e) => setNewBatteryLevel(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Vị trí khay sạc
                </label>
                <input
                  type="text"
                  value={newChargingDock}
                  onChange={(e) => setNewChargingDock(e.target.value)}
                  placeholder="VD: Khay A - Vị trí 06"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Xác nhận thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

```

# app\pos\terminal\page.tsx

| Property | Value |
|----------|-------|
| Path | `app\pos\terminal\page.tsx` |
| Size | 22,696 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.336008 |

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Coffee,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  QrCode,
  ArrowLeft,
  Utensils,
  ShoppingBag,
  Sparkles,
  CupSoda,
  Cake,
  Flame,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  imageColor: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  note?: string;
}

const CATEGORIES = [
  { id: "all", name: "Tất cả", icon: Sparkles },
  { id: "coffee_phin", name: "Cà phê phin", icon: Coffee },
  { id: "coffee_machine", name: "Cà phê máy", icon: Flame },
  { id: "tea", name: "Trà trái cây", icon: CupSoda },
  { id: "cake", name: "Bánh ngọt", icon: Cake },
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Cà phê đen đá",
    category: "coffee_phin",
    price: 25000,
    imageColor: "bg-amber-100 text-amber-900",
  },
  {
    id: "p2",
    name: "Cà phê sữa đá",
    category: "coffee_phin",
    price: 29000,
    imageColor: "bg-[#F5EBE6] text-[#6F4E37]",
  },
  {
    id: "p3",
    name: "Bạc xỉu 3 tầng",
    category: "coffee_phin",
    price: 32000,
    imageColor: "bg-orange-100 text-orange-800",
  },
  {
    id: "p4",
    name: "Espresso Single",
    category: "coffee_machine",
    price: 30000,
    imageColor: "bg-stone-200 text-stone-800",
  },
  {
    id: "p5",
    name: "Cappuccino nóng",
    category: "coffee_machine",
    price: 42000,
    imageColor: "bg-amber-50 text-amber-800",
  },
  {
    id: "p6",
    name: "Caramel Macchiato",
    category: "coffee_machine",
    price: 45000,
    imageColor: "bg-yellow-100 text-yellow-800",
  },
  {
    id: "p7",
    name: "Trà đào cam sả",
    category: "tea",
    price: 35000,
    imageColor: "bg-emerald-100 text-emerald-800",
  },
  {
    id: "p8",
    name: "Trà vải hoa hồng",
    category: "tea",
    price: 38000,
    imageColor: "bg-rose-100 text-rose-800",
  },
  {
    id: "p9",
    name: "Trà sen vàng",
    category: "tea",
    price: 39000,
    imageColor: "bg-teal-100 text-teal-800",
  },
  {
    id: "p10",
    name: "Bánh Tiramisu",
    category: "cake",
    price: 45000,
    imageColor: "bg-stone-100 text-stone-700",
  },
  {
    id: "p11",
    name: "Croissant bơ Pháp",
    category: "cake",
    price: 32000,
    imageColor: "bg-amber-100 text-amber-700",
  },
  {
    id: "p12",
    name: "Cheesecake chanh dây",
    category: "cake",
    price: 42000,
    imageColor: "bg-yellow-100 text-yellow-700",
  },
];

export default function POSTerminalPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderType, setOrderType] = useState<"dine_in" | "take_away">("dine_in");
  const [selectedTable, setSelectedTable] = useState("Bàn 04");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "qr">("cash");

  // Giỏ hàng mẫu ban đầu
  const [cart, setCart] = useState<CartItem[]>([
    { product: MOCK_PRODUCTS[1], quantity: 2, note: "Ít ngọt, nhiều đá" },
    { product: MOCK_PRODUCTS[6], quantity: 1, note: "" },
    { product: MOCK_PRODUCTS[9], quantity: 1, note: "" },
  ]);

  // Lọc sản phẩm
  const filteredProducts = MOCK_PRODUCTS.filter((item) => {
    const matchCat =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Thêm vào giỏ
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  // Cập nhật số lượng
  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Xóa món khỏi giỏ
  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Tính toán chi phí
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discount = 0;
  const tax = Math.round(subtotal * 0.08); // VAT 8%
  const total = subtotal - discount + tax;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-white text-gray-800 antialiased font-sans">
      {/* ========================================================
          CỘT 1: DANH MỤC & TÌM KIẾM (w-64)
          ======================================================== */}
      <aside className="w-64 h-full bg-white border-r border-gray-100 flex flex-col shrink-0">
        {/* Top Header Logo */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center font-bold">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-base leading-none block">
                DineDesk
              </span>
              <span className="text-[11px] text-[#6F4E37] font-semibold">
                POS Terminal
              </span>
            </div>
          </div>

          <Link
            href="/dashboard"
            title="Về Trang quản trị"
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Ô tìm kiếm món */}
        <div className="p-3 border-b border-gray-100">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm món..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50/50 placeholder:text-gray-400 text-gray-900 transition-colors focus:outline-none focus:bg-white focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
            />
          </div>
        </div>

        {/* Danh sách danh mục */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
            Danh mục món
          </p>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#6F4E37] text-white shadow-sm"
                    : "text-gray-600 hover:bg-[#F5EBE6] hover:text-[#6F4E37]"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-white" : "text-gray-400"
                  }`}
                />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Footer nhân viên thu ngân */}
        <div className="p-3 border-t border-gray-100 bg-gray-50/50 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#6F4E37] text-white text-xs font-bold flex items-center justify-center">
            NV
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold text-gray-800 truncate">
              Nguyễn Thu Ngân
            </p>
            <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Ca sáng • Online
            </p>
          </div>
        </div>
      </aside>

      {/* ========================================================
          CỘT 2: KHU VỰC LƯỚI SẢN PHẨM (flex-1)
          ======================================================== */}
      <main className="flex-1 h-full bg-[#F8FAFC] flex flex-col overflow-hidden">
        {/* Header Cột 2: Chọn hình thức phục vụ & Thống kê */}
        <header className="h-16 px-6 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
          {/* Nút chọn loại phục vụ */}
          <div className="flex items-center gap-2 bg-gray-100/80 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setOrderType("dine_in")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                orderType === "dine_in"
                  ? "bg-white text-[#6F4E37] shadow-xs"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Dùng tại quán</span>
            </button>
            <button
              type="button"
              onClick={() => setOrderType("take_away")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                orderType === "take_away"
                  ? "bg-white text-[#6F4E37] shadow-xs"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Mang đi</span>
            </button>
          </div>

          <div className="text-xs text-gray-500">
            Hiển thị{" "}
            <span className="font-semibold text-gray-800">
              {filteredProducts.length}
            </span>{" "}
            sản phẩm
          </div>
        </header>

        {/* Lưới sản phẩm (Grid Card) */}
        <div className="flex-1 overflow-y-auto p-5">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-white rounded-2xl border border-gray-100 hover:border-[#6F4E37]/30 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col group active:scale-[0.98]"
                >
                  {/* Khung ảnh sản phẩm */}
                  <div
                    className={`h-28 flex items-center justify-center transition-transform group-hover:scale-105 duration-200 ${product.imageColor}`}
                  >
                    <Coffee className="w-9 h-9 opacity-80" strokeWidth={1.8} />
                  </div>

                  {/* Chi tiết sản phẩm */}
                  <div className="p-3.5 flex flex-col justify-between flex-1 gap-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-1 group-hover:text-[#6F4E37] transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-xs font-bold text-gray-700 mt-1">
                        {formatCurrency(product.price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-end pt-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6F4E37] bg-[#F5EBE6] group-hover:bg-[#6F4E37] group-hover:text-white px-2.5 py-1 rounded-lg transition-colors">
                        <Plus className="w-3 h-3" strokeWidth={2.5} />
                        Thêm
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400">
              <Coffee className="w-12 h-12 mb-3 stroke-1 text-gray-300" />
              <p className="text-sm font-medium">Không tìm thấy món phù hợp</p>
              <p className="text-xs text-gray-400 mt-1">
                Thử tìm với từ khóa khác hoặc chọn lại danh mục
              </p>
            </div>
          )}
        </div>
      </main>

      {/* ========================================================
          CỘT 3: GIỎ HÀNG & THANH TOÁN (w-[400px])
          ======================================================== */}
      <aside className="w-[400px] h-full bg-white flex flex-col shrink-0 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] border-l border-gray-100 z-10">
        {/* Header Giỏ hàng */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-base">
              Đơn hàng hiện tại
            </h3>
            <span className="text-xs text-gray-400">
              {cart.reduce((total, i) => total + i.quantity, 0)} món được chọn
            </span>
          </div>

          {/* Chọn bàn */}
          <div className="flex items-center gap-1.5">
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="text-xs font-semibold bg-[#F5EBE6] text-[#6F4E37] px-2.5 py-1.5 rounded-lg border-0 focus:ring-2 focus:ring-[#6F4E37] cursor-pointer"
            >
              <option value="Bàn 01">Bàn 01</option>
              <option value="Bàn 02">Bàn 02</option>
              <option value="Bàn 03">Bàn 03</option>
              <option value="Bàn 04">Bàn 04</option>
              <option value="Bàn 05">Bàn 05</option>
              <option value="Mang về">Mang về</option>
            </select>
          </div>
        </div>

        {/* Danh sách món trong giỏ (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-gray-50">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.product.id} className="pt-3 first:pt-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h5 className="text-sm font-semibold text-gray-900">
                      {item.product.name}
                    </h5>
                    <p className="text-xs font-medium text-[#6F4E37]">
                      {formatCurrency(item.product.price)}
                    </p>
                    {item.note && (
                      <span className="inline-block text-[11px] text-gray-400 italic mt-0.5">
                        {item.note}
                      </span>
                    )}
                  </div>

                  {/* Bộ đếm số lượng & Xóa */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50/50 p-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="w-6 h-6 flex items-center justify-center rounded text-gray-600 hover:bg-white hover:text-gray-900 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="w-6 h-6 flex items-center justify-center rounded text-gray-600 hover:bg-white hover:text-gray-900 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Xóa món"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
              <ShoppingBag className="w-10 h-10 mb-2 stroke-1 text-gray-300" />
              <p className="text-xs font-medium">Chưa có món nào trong đơn</p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Nhấn chọn món từ menu bên cạnh
              </p>
            </div>
          )}
        </div>

        {/* Tóm tắt chi phí & Thanh toán (Cố định dưới đáy) */}
        <div className="p-4 border-t border-gray-100 bg-white space-y-3.5">
          {/* Bảng kê chi phí */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-500">
              <span>Tạm tính</span>
              <span className="font-semibold text-gray-800">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Giảm giá</span>
              <span className="font-semibold text-gray-800">
                {formatCurrency(discount)}
              </span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Thuế (VAT 8%)</span>
              <span className="font-semibold text-gray-800">
                {formatCurrency(tax)}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-100 flex justify-between items-baseline">
              <span className="font-bold text-gray-900 text-sm">Tổng tiền</span>
              <span className="font-extrabold text-xl text-[#6F4E37]">
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          {/* 3 Nút Phương thức thanh toán */}
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Hình thức thanh toán
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("cash")}
                className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                  paymentMethod === "cash"
                    ? "border-[#6F4E37] bg-[#F5EBE6] text-[#6F4E37]"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span>Tiền mặt</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                  paymentMethod === "card"
                    ? "border-[#6F4E37] bg-[#F5EBE6] text-[#6F4E37]"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Thẻ</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("qr")}
                className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                  paymentMethod === "qr"
                    ? "border-[#6F4E37] bg-[#F5EBE6] text-[#6F4E37]"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>Chuyển khoản</span>
              </button>
            </div>
          </div>

          {/* Nút Submit Thanh toán */}
          <button
            type="button"
            disabled={cart.length === 0}
            className="w-full py-3.5 px-4 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md transition-all duration-200 cursor-pointer active:scale-[0.99]"
          >
            Thanh toán • {formatCurrency(total)}
          </button>
        </div>
      </aside>
    </div>
  );
}

```

# components\common\Badge.tsx

| Property | Value |
|----------|-------|
| Path | `components\common\Badge.tsx` |
| Size | 700 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.337547 |

```tsx
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default' }) => {
  const styles: Record<string, string> = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    default: 'bg-gray-100 text-gray-800',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
};

export default Badge;

```

# components\common\Button.tsx

| Property | Value |
|----------|-------|
| Path | `components\common\Button.tsx` |
| Size | 1,681 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.338569 |

```tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isLoading,
  variant = 'primary',
  fullWidth = true,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'py-3 px-4 rounded-xl font-semibold text-sm shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2';

  const variants = {
    primary: 'bg-[#6F4E37] hover:bg-[#5A3F2C] text-white disabled:bg-[#A89485]',
    secondary: 'bg-[#F5EBE6] hover:bg-[#EBDCD3] text-[#6F4E37] disabled:opacity-50',
    outline: 'border border-[#6F4E37] text-[#6F4E37] hover:bg-[#F5EBE6] disabled:opacity-50',
  };

  return (
    <button
      disabled={isLoading || disabled}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Đang xử lý...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;


```

# components\common\ConfirmModal.tsx

| Property | Value |
|----------|-------|
| Path | `components\common\ConfirmModal.tsx` |
| Size | 954 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.339329 |

```tsx
import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Hủy</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded">Xác nhận</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

```

# components\common\Drawer.tsx

| Property | Value |
|----------|-------|
| Path | `components\common\Drawer.tsx` |
| Size | 667 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.340425 |

```tsx
import React from 'react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="bg-white w-96 h-full p-6 shadow-xl">
        {title && <h3 className="text-lg font-bold mb-4">{title}</h3>}
        {children}
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded">Đóng</button>
      </div>
    </div>
  );
};

export default Drawer;

```

# components\common\EmptyState.tsx

| Property | Value |
|----------|-------|
| Path | `components\common\EmptyState.tsx` |
| Size | 0 bytes |
| Extension | `.tsx` |
| Modified | 2026-09-25 18:49:59.267965 |

```tsx

```

# components\common\ErrorState.tsx

| Property | Value |
|----------|-------|
| Path | `components\common\ErrorState.tsx` |
| Size | 0 bytes |
| Extension | `.tsx` |
| Modified | 2026-09-25 18:49:59.267965 |

```tsx

```

# components\common\Input.tsx

| Property | Value |
|----------|-------|
| Path | `components\common\Input.tsx` |
| Size | 1,906 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.341329 |

```tsx
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  isPassword,
  type = 'text',
  className = '',
  id,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const inputId = id || props.name;

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={inputType}
          className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm transition-colors focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 ${
            isPassword ? 'pr-11' : ''
          } ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6F4E37] transition-colors p-1 cursor-pointer"
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Input;


```

# components\common\Loading.tsx

| Property | Value |
|----------|-------|
| Path | `components\common\Loading.tsx` |
| Size | 0 bytes |
| Extension | `.tsx` |
| Modified | 2026-09-25 18:49:59.268964 |

```tsx

```

# components\common\Modal.tsx

| Property | Value |
|----------|-------|
| Path | `components\common\Modal.tsx` |
| Size | 684 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.342330 |

```tsx
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
        {children}
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded">Đóng</button>
      </div>
    </div>
  );
};

export default Modal;

```

# components\common\Table.tsx

| Property | Value |
|----------|-------|
| Path | `components\common\Table.tsx` |
| Size | 749 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.343329 |

```tsx
import React from 'react';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ headers, children }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
      </table>
    </div>
  );
};

export default Table;

```

# components\inventory\AddBOMIngredientModal.tsx

| Property | Value |
|----------|-------|
| Path | `components\inventory\AddBOMIngredientModal.tsx` |
| Size | 185 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.344967 |

```tsx
import React from 'react';

export const AddBOMIngredientModal: React.FC = () => {
  return <div>AddBOMIngredientModal Component</div>;
};

export default AddBOMIngredientModal;

```

# components\inventory\CreateImportTicketModal.tsx

| Property | Value |
|----------|-------|
| Path | `components\inventory\CreateImportTicketModal.tsx` |
| Size | 191 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.346038 |

```tsx
import React from 'react';

export const CreateImportTicketModal: React.FC = () => {
  return <div>CreateImportTicketModal Component</div>;
};

export default CreateImportTicketModal;

```

# components\inventory\ImportDetailDrawer.tsx

| Property | Value |
|----------|-------|
| Path | `components\inventory\ImportDetailDrawer.tsx` |
| Size | 176 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.347234 |

```tsx
import React from 'react';

export const ImportDetailDrawer: React.FC = () => {
  return <div>ImportDetailDrawer Component</div>;
};

export default ImportDetailDrawer;

```

# components\inventory\IngredientFormModal.tsx

| Property | Value |
|----------|-------|
| Path | `components\inventory\IngredientFormModal.tsx` |
| Size | 179 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.348140 |

```tsx
import React from 'react';

export const IngredientFormModal: React.FC = () => {
  return <div>IngredientFormModal Component</div>;
};

export default IngredientFormModal;

```

# components\inventory\InventoryAdjustmentModal.tsx

| Property | Value |
|----------|-------|
| Path | `components\inventory\InventoryAdjustmentModal.tsx` |
| Size | 194 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.349258 |

```tsx
import React from 'react';

export const InventoryAdjustmentModal: React.FC = () => {
  return <div>InventoryAdjustmentModal Component</div>;
};

export default InventoryAdjustmentModal;

```

# components\kds\KDSTicketCard.tsx

| Property | Value |
|----------|-------|
| Path | `components\kds\KDSTicketCard.tsx` |
| Size | 161 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.350939 |

```tsx
import React from 'react';

export const KDSTicketCard: React.FC = () => {
  return <div>KDSTicketCard Component</div>;
};

export default KDSTicketCard;

```

# components\kds\QuickRecipeModal.tsx

| Property | Value |
|----------|-------|
| Path | `components\kds\QuickRecipeModal.tsx` |
| Size | 170 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.351938 |

```tsx
import React from 'react';

export const QuickRecipeModal: React.FC = () => {
  return <div>QuickRecipeModal Component</div>;
};

export default QuickRecipeModal;

```

# components\layout\Header.tsx

| Property | Value |
|----------|-------|
| Path | `components\layout\Header.tsx` |
| Size | 4,111 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.352939 |

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, ChevronDown, KeyRound, LogOut, User as UserIcon } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';

interface HeaderProps {
  title?: string;
}

export default function Header({ title = 'Tổng quan' }: HeaderProps) {
  const { user, logout } = useAuthContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const initial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U';

  return (
    <header className="h-16 fixed top-0 right-0 left-64 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-30">
      {/* Left: Page Title */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800 tracking-tight">{title}</h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button
          type="button"
          aria-label="Thông báo"
          className="relative w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:text-[#6F4E37] hover:bg-[#F5EBE6] transition-colors cursor-pointer"
        >
          <Bell className="w-5 h-5" strokeWidth={1.9} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        <div className="h-6 w-px bg-gray-200" />

        {/* User Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#F5EBE6] flex items-center justify-center text-[#6F4E37] font-semibold text-sm shrink-0">
              {initial}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium text-gray-700 leading-tight">
                {user?.fullName || 'Người dùng'}
              </span>
              <span className="text-[11px] text-gray-400 font-medium">
                {user?.role || user?.userType || 'GUEST'}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-1" />
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-20 animate-in fade-in">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-800">{user?.fullName}</p>
                  <p className="text-[11px] text-gray-400">{user?.phoneNumber || user?.username}</p>
                </div>

                <Link
                  href="/change-password"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <KeyRound className="w-4 h-4 text-gray-500" />
                  <span>Đổi mật khẩu</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

```

# components\layout\KdsHeader.tsx

| Property | Value |
|----------|-------|
| Path | `components\layout\KdsHeader.tsx` |
| Size | 208 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.354213 |

```tsx
import React from 'react';

export const KdsHeader: React.FC = () => {
  return <header className="h-16 bg-gray-900 text-white flex items-center px-6">KdsHeader</header>;
};

export default KdsHeader;

```

# components\layout\PosHeader.tsx

| Property | Value |
|----------|-------|
| Path | `components\layout\PosHeader.tsx` |
| Size | 203 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.355272 |

```tsx
import React from 'react';

export const PosHeader: React.FC = () => {
  return <header className="h-16 bg-white border-b flex items-center px-6">PosHeader</header>;
};

export default PosHeader;

```

# components\layout\Sidebar.tsx

| Property | Value |
|----------|-------|
| Path | `components\layout\Sidebar.tsx` |
| Size | 3,835 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.356457 |

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Coffee,
  LayoutDashboard,
  MonitorSmartphone,
  CupSoda,
  Package,
  Users,
  PieChart,
  LogOut,
  CookingPot,
} from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { isRouteAllowed } from '@/constants/roles';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthContext();

  const allMenuItems = [
    {
      name: 'Tổng quan',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Bán hàng POS',
      path: '/pos/terminal',
      icon: MonitorSmartphone,
    },
    {
      name: 'Bếp / Pha chế',
      path: '/kds/queue',
      icon: CookingPot,
    },
    {
      name: 'Thực đơn',
      path: '/dashboard/menu/products',
      icon: CupSoda,
    },
    {
      name: 'Kho nguyên liệu',
      path: '/dashboard/inventory/ingredients',
      icon: Package,
    },
    {
      name: 'Khách hàng',
      path: '/dashboard/customers',
      icon: Users,
    },
    {
      name: 'Báo cáo',
      path: '/dashboard/reports',
      icon: PieChart,
    },
  ];

  // Lọc menu theo quyền của Role hiện tại
  const allowedMenuItems = user?.role
    ? allMenuItems.filter((item) => isRouteAllowed(item.path, user.role))
    : allMenuItems;

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-white border-r border-gray-100 flex flex-col z-40">
      {/* Header / Brand Logo */}
      <div className="h-20 flex items-center gap-3 px-6 border-b border-gray-100">
        <div className="w-10 h-10 rounded-full bg-[#F5EBE6] flex items-center justify-center text-[#6F4E37] shrink-0">
          <Coffee className="w-5 h-5" strokeWidth={2.2} />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold text-gray-900 tracking-tight leading-none">
            DineDesk
          </span>
          <span className="text-[11px] text-gray-400 font-medium mt-1">
            Coffee Management
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto">
        {allowedMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[#6F4E37] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-[#F5EBE6] hover:text-[#6F4E37]'
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 ${
                  isActive ? 'text-white' : 'text-gray-500 group-hover:text-[#6F4E37]'
                }`}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions: Logout */}
      <div className="p-3 border-t border-gray-100 mt-auto">
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5 shrink-0" strokeWidth={1.8} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
```

# components\loyalty\AdjustPointsModal.tsx

| Property | Value |
|----------|-------|
| Path | `components\loyalty\AdjustPointsModal.tsx` |
| Size | 173 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.358227 |

```tsx
import React from 'react';

export const AdjustPointsModal: React.FC = () => {
  return <div>AdjustPointsModal Component</div>;
};

export default AdjustPointsModal;

```

# components\loyalty\AssignRoleModal.tsx

| Property | Value |
|----------|-------|
| Path | `components\loyalty\AssignRoleModal.tsx` |
| Size | 3,998 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.358760 |

```tsx
import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { CustomerItem } from '@/api/customer-loyalty/loyalty.service';

interface AssignRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    fullName: string;
    username: string;
    password: string;
    role: 'CASHIER' | 'BARISTA' | 'STOREKEEPER';
    phoneNumber?: string;
  }) => Promise<void>;
  customer?: CustomerItem | null;
}

export const AssignRoleModal: React.FC<AssignRoleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  customer,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CASHIER' | 'BARISTA' | 'STOREKEEPER'>('CASHIER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customer) {
      setUsername(customer.phoneNumber ? `emp_${customer.phoneNumber}` : '');
      setPassword('');
      setRole('CASHIER');
    }
    setError(null);
  }, [customer, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;
    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        fullName: customer.fullName,
        username,
        password,
        role,
        phoneNumber: customer.phoneNumber,
      });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Cấp quyền thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Cấp quyền Nhân viên: ${customer?.fullName || ''}`}>
      <div className="mb-4 text-xs text-gray-500">
        Tạo tài khoản Nhân viên nội bộ dựa trên thông tin khách hàng.
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Tên đăng nhập (Username)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nhập tên đăng nhập..."
          required
        />
        <Input
          label="Mật khẩu khởi tạo"
          isPassword
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nhập mật khẩu..."
          required
        />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Vai trò Nhân viên</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
          >
            <option value="CASHIER">Thu ngân (CASHIER)</option>
            <option value="BARISTA">Pha chế (BARISTA)</option>
            <option value="STOREKEEPER">Thủ kho (STOREKEEPER)</option>
          </select>
          <p className="text-[11px] text-amber-600 font-medium">
            ⚠️ Lưu ý: Không được phép chọn quyền Manager cho tài khoản này.
          </p>
        </div>
        <div className="pt-2 flex gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" isLoading={loading}>
            Xác nhận cấp quyền
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AssignRoleModal;

```

# components\loyalty\CustomerFormModal.tsx

| Property | Value |
|----------|-------|
| Path | `components\loyalty\CustomerFormModal.tsx` |
| Size | 3,179 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.360264 |

```tsx
import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { CustomerItem } from '@/api/customer-loyalty/loyalty.service';

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { fullName: string; phoneNumber: string; password?: string }) => Promise<void>;
  customer?: CustomerItem | null;
}

export const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  customer,
}) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customer) {
      setFullName(customer.fullName || '');
      setPhoneNumber(customer.phoneNumber || '');
      setPassword('');
    } else {
      setFullName('');
      setPhoneNumber('');
      setPassword('');
    }
    setError(null);
  }, [customer, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit({ fullName, phoneNumber, password: password || undefined });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Thao tác thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={customer ? 'Chỉnh sửa thông tin khách hàng' : 'Thêm khách hàng mới'}
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Họ và tên"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Nhập họ tên..."
          required
        />
        <Input
          label="Số điện thoại"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Nhập số điện thoại..."
          required
        />
        {!customer && (
          <Input
            label="Mật khẩu (Tùy chọn)"
            isPassword
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Để trống nếu tạo tại quầy"
          />
        )}
        <div className="pt-2 flex gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" isLoading={loading}>
            {customer ? 'Lưu thay đổi' : 'Tạo khách hàng'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CustomerFormModal;

```

# components\loyalty\CustomerProfileDrawer.tsx

| Property | Value |
|----------|-------|
| Path | `components\loyalty\CustomerProfileDrawer.tsx` |
| Size | 185 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.361350 |

```tsx
import React from 'react';

export const CustomerProfileDrawer: React.FC = () => {
  return <div>CustomerProfileDrawer Component</div>;
};

export default CustomerProfileDrawer;

```

# components\loyalty\PagerFormModal.tsx

| Property | Value |
|----------|-------|
| Path | `components\loyalty\PagerFormModal.tsx` |
| Size | 164 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.362325 |

```tsx
import React from 'react';

export const PagerFormModal: React.FC = () => {
  return <div>PagerFormModal Component</div>;
};

export default PagerFormModal;

```

# components\menu\CategoryFormModal.tsx

| Property | Value |
|----------|-------|
| Path | `components\menu\CategoryFormModal.tsx` |
| Size | 173 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.363503 |

```tsx
import React from 'react';

export const CategoryFormModal: React.FC = () => {
  return <div>CategoryFormModal Component</div>;
};

export default CategoryFormModal;

```

# components\menu\ProductFormModal.tsx

| Property | Value |
|----------|-------|
| Path | `components\menu\ProductFormModal.tsx` |
| Size | 170 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.364482 |

```tsx
import React from 'react';

export const ProductFormModal: React.FC = () => {
  return <div>ProductFormModal Component</div>;
};

export default ProductFormModal;

```

# components\menu\ToppingFormModal.tsx

| Property | Value |
|----------|-------|
| Path | `components\menu\ToppingFormModal.tsx` |
| Size | 170 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.365480 |

```tsx
import React from 'react';

export const ToppingFormModal: React.FC = () => {
  return <div>ToppingFormModal Component</div>;
};

export default ToppingFormModal;

```

# components\pos\CancelOrderModal.tsx

| Property | Value |
|----------|-------|
| Path | `components\pos\CancelOrderModal.tsx` |
| Size | 170 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.367211 |

```tsx
import React from 'react';

export const CancelOrderModal: React.FC = () => {
  return <div>CancelOrderModal Component</div>;
};

export default CancelOrderModal;

```

# components\pos\CartSidebar.tsx

| Property | Value |
|----------|-------|
| Path | `components\pos\CartSidebar.tsx` |
| Size | 155 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.368044 |

```tsx
import React from 'react';

export const CartSidebar: React.FC = () => {
  return <div>CartSidebar Component</div>;
};

export default CartSidebar;

```

# components\pos\OrderDetailDrawer.tsx

| Property | Value |
|----------|-------|
| Path | `components\pos\OrderDetailDrawer.tsx` |
| Size | 173 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.368878 |

```tsx
import React from 'react';

export const OrderDetailDrawer: React.FC = () => {
  return <div>OrderDetailDrawer Component</div>;
};

export default OrderDetailDrawer;

```

# components\pos\PrintReceiptModal.tsx

| Property | Value |
|----------|-------|
| Path | `components\pos\PrintReceiptModal.tsx` |
| Size | 173 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.370322 |

```tsx
import React from 'react';

export const PrintReceiptModal: React.FC = () => {
  return <div>PrintReceiptModal Component</div>;
};

export default PrintReceiptModal;

```

# components\pos\ProductGrid.tsx

| Property | Value |
|----------|-------|
| Path | `components\pos\ProductGrid.tsx` |
| Size | 155 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.370879 |

```tsx
import React from 'react';

export const ProductGrid: React.FC = () => {
  return <div>ProductGrid Component</div>;
};

export default ProductGrid;

```

# components\pos\ProductOptionModal.tsx

| Property | Value |
|----------|-------|
| Path | `components\pos\ProductOptionModal.tsx` |
| Size | 176 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.372128 |

```tsx
import React from 'react';

export const ProductOptionModal: React.FC = () => {
  return <div>ProductOptionModal Component</div>;
};

export default ProductOptionModal;

```

# components\pos\QuickCreateCustomerModal.tsx

| Property | Value |
|----------|-------|
| Path | `components\pos\QuickCreateCustomerModal.tsx` |
| Size | 194 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.373031 |

```tsx
import React from 'react';

export const QuickCreateCustomerModal: React.FC = () => {
  return <div>QuickCreateCustomerModal Component</div>;
};

export default QuickCreateCustomerModal;

```

# components\reports\ExportReportModal.tsx

| Property | Value |
|----------|-------|
| Path | `components\reports\ExportReportModal.tsx` |
| Size | 173 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.374328 |

```tsx
import React from 'react';

export const ExportReportModal: React.FC = () => {
  return <div>ExportReportModal Component</div>;
};

export default ExportReportModal;

```

# components\reports\RevenueBarChart.tsx

| Property | Value |
|----------|-------|
| Path | `components\reports\RevenueBarChart.tsx` |
| Size | 167 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.374881 |

```tsx
import React from 'react';

export const RevenueBarChart: React.FC = () => {
  return <div>RevenueBarChart Component</div>;
};

export default RevenueBarChart;

```

# components\reports\RevenueSummaryCards.tsx

| Property | Value |
|----------|-------|
| Path | `components\reports\RevenueSummaryCards.tsx` |
| Size | 179 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.375879 |

```tsx
import React from 'react';

export const RevenueSummaryCards: React.FC = () => {
  return <div>RevenueSummaryCards Component</div>;
};

export default RevenueSummaryCards;

```

# constants\bocute.webp

| Property | Value |
|----------|-------|
| Path | `constants\bocute.webp` |
| Size | 16,776 bytes |
| Extension | `.webp` |
| Modified | 2026-09-25 18:49:59.275482 |

> **File nhị phân** (đã bỏ qua nội dung)

# constants\index.ts

| Property | Value |
|----------|-------|
| Path | `constants\index.ts` |
| Size | 0 bytes |
| Extension | `.ts` |
| Modified | 2026-09-25 18:49:59.276696 |

```typescript

```

# constants\roles.ts

| Property | Value |
|----------|-------|
| Path | `constants\roles.ts` |
| Size | 2,333 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 18:43:15.377479 |

```typescript
import { UserRole } from '@/types/auth';

export const ROLE_DEFAULT_ROUTES: Record<UserRole, string> = {
  ADMIN: '/dashboard',
  MANAGER: '/dashboard',
  CASHIER: '/pos/terminal',
  BARISTA: '/kds/queue',
  STOREKEEPER: '/dashboard/inventory/ingredients',
  CUSTOMER: '/dashboard/customers',
};

export interface RoutePermissionRule {
  path: string;
  exact?: boolean;
  allowedRoles: UserRole[];
}

export const ROUTE_PERMISSION_RULES: RoutePermissionRule[] = [
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
  { path: '/dashboard/customers', allowedRoles: ['MANAGER', 'CASHIER', 'CUSTOMER', 'ADMIN'] },
  { path: '/dashboard/reports', allowedRoles: ['MANAGER', 'ADMIN'] },
  { path: '/dashboard/pagers', allowedRoles: ['MANAGER', 'CASHIER', 'BARISTA', 'ADMIN'] },
  { path: '/dashboard', exact: true, allowedRoles: ['MANAGER', 'ADMIN'] },
];

export function isRouteAllowed(pathname: string, role: UserRole): boolean {
  if (pathname.startsWith('/change-password')) return true;

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

# constants\routes.ts

| Property | Value |
|----------|-------|
| Path | `constants\routes.ts` |
| Size | 0 bytes |
| Extension | `.ts` |
| Modified | 2026-09-25 18:49:59.277886 |

```typescript

```

# constants\storage.ts

| Property | Value |
|----------|-------|
| Path | `constants\storage.ts` |
| Size | 159 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 18:43:15.379066 |

```typescript
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  ROLE: 'user_role',
} as const;
```

# context\AuthContext.tsx

| Property | Value |
|----------|-------|
| Path | `context\AuthContext.tsx` |
| Size | 3,850 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.380436 |

```tsx
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
```

# context\CartContext.tsx

| Property | Value |
|----------|-------|
| Path | `context\CartContext.tsx` |
| Size | 920 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-03 18:43:15.381438 |

```tsx
'use client';

import React, { createContext, useContext, useState } from 'react';

interface CartContextType {
  items: any[];
  addItem: (item: any) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<any[]>([]);

  const addItem = (item: any) => {};
  const removeItem = (id: string) => {};
  const clearCart = () => {};

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within CartProvider');
  }
  return context;
};

```

# eslint.config.mjs

| Property | Value |
|----------|-------|
| Path | `eslint.config.mjs` |
| Size | 483 bytes |
| Extension | `.mjs` |
| Modified | 2026-09-25 18:49:59.278478 |

```mjs
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

```

# hooks\useAuth.ts

| Property | Value |
|----------|-------|
| Path | `hooks\useAuth.ts` |
| Size | 0 bytes |
| Extension | `.ts` |
| Modified | 2026-09-25 18:49:59.280967 |

```typescript

```

# hooks\useCart.ts

| Property | Value |
|----------|-------|
| Path | `hooks\useCart.ts` |
| Size | 150 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 18:43:15.382581 |

```typescript
import { useCartContext } from '@/context/CartContext';

export const useCart = () => {
  return useCartContext();
};

export default useCart;

```

# hooks\useDebounce.ts

| Property | Value |
|----------|-------|
| Path | `hooks\useDebounce.ts` |
| Size | 434 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 18:43:15.383278 |

```typescript
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;

```

# middleware.ts

| Property | Value |
|----------|-------|
| Path | `middleware.ts` |
| Size | 1,821 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 18:43:15.384335 |

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROLE_DEFAULT_ROUTES, isRouteAllowed } from '@/constants/roles';
import { STORAGE_KEYS } from '@/constants/storage';
import { UserRole } from '@/types/auth';

const PUBLIC_ROUTES = ['/login', '/register', '/setup-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(STORAGE_KEYS.ACCESS_TOKEN)?.value;
  const role = request.cookies.get(STORAGE_KEYS.ROLE)?.value as UserRole | undefined;

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  // 1. Chưa đăng nhập mà truy cập trang bảo vệ -> Redirect về /login
  if (!token) {
    if (!isPublicRoute) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2. Đã đăng nhập mà truy cập trang công khai (/login, /register, /setup-password) -> Redirect về trang mặc định theo Role
  if (isPublicRoute) {
    const defaultRoute = (role && ROLE_DEFAULT_ROUTES[role]) || '/login';
    return NextResponse.redirect(new URL(defaultRoute, request.url));
  }

  // 3. Kiểm tra phân quyền RBAC theo ma trận cho người dùng đã đăng nhập
  if (role) {
    const allowed = isRouteAllowed(pathname, role);
    if (!allowed) {
      const fallbackRoute = ROLE_DEFAULT_ROUTES[role] || '/login';
      return NextResponse.redirect(new URL(fallbackRoute, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|icons|.*\\..*).*)'],
};
```

# next.config.ts

| Property | Value |
|----------|-------|
| Path | `next.config.ts` |
| Size | 140 bytes |
| Extension | `.ts` |
| Modified | 2026-09-25 18:49:59.282539 |

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

```

# package-lock.json

| Property | Value |
|----------|-------|
| Path | `package-lock.json` |
| Size | 248,030 bytes |
| Extension | `.json` |
| Modified | 2026-10-03 18:45:51.394761 |

```json
{
  "name": "client",
  "version": "0.1.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "client",
      "version": "0.1.0",
      "dependencies": {
        "axios": "^1.20.0",
        "js-cookie": "^3.0.8",
        "lucide-react": "^1.49.0",
        "next": "16.3.6",
        "react": "19.2.8",
        "react-dom": "19.2.8"
      },
      "devDependencies": {
        "@tailwindcss/postcss": "^4",
        "@types/js-cookie": "^3.0.6",
        "@types/node": "^20.19.43",
        "@types/react": "^19.3.0",
        "@types/react-dom": "^19.3.0",
        "eslint": "^9",
        "eslint-config-next": "16.3.6",
        "tailwindcss": "^4",
        "typescript": "^5.9.3"
      }
    },
    "node_modules/@alloc/quick-lru": {
      "version": "5.3.0",
      "resolved": "https://registry.npmjs.org/@alloc/quick-lru/-/quick-lru-5.3.0.tgz",
      "integrity": "sha512-U4+70Pc5ZS9osnCBCE5Jha/ciHM+Yp+CNMNC/7HvYbNRk1Ldd+f7qO65W5qfhu/TCv+/ozljlXXe9Nj8419DMA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/@babel/code-frame": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.29.7.tgz",
      "integrity": "sha512-Aup7aUOfpbAUg2ROOJN6Iw5f9DMBlzu0mIkm/malLQFN/YQgO48wCj0Kxa3sEHJvPVFg7siR+qRInwXd2qhQKw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/helper-validator-identifier": "^7.29.7",
        "js-tokens": "^4.0.0",
        "picocolors": "^1.1.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/compat-data": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/compat-data/-/compat-data-7.29.7.tgz",
      "integrity": "sha512-locTkQyKvwIEgBzVrn8693ebc97F2U8ZHjbXwDXJ5Fn2TCpNwTlKcaKLkdHop5c/icOFE7qt7Q9JC5hnKNa6Gg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/core": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/core/-/core-7.29.7.tgz",
      "integrity": "sha512-RgHBCvtjbOK2gXSNBNIkNoEc9qoVEtau3hj8gEqKQuL3HZAibKarWFEI3Lfm6EYKkLalOh8eSrj9b+ch9H/VBA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/code-frame": "^7.29.7",
        "@babel/generator": "^7.29.7",
        "@babel/helper-compilation-targets": "^7.29.7",
        "@babel/helper-module-transforms": "^7.29.7",
        "@babel/helpers": "^7.29.7",
        "@babel/parser": "^7.29.7",
        "@babel/template": "^7.29.7",
        "@babel/traverse": "^7.29.7",
        "@babel/types": "^7.29.7",
        "@jridgewell/remapping": "^2.3.5",
        "convert-source-map": "^2.0.0",
        "debug": "^4.1.0",
        "gensync": "^1.0.0-beta.2",
        "json5": "^2.2.3",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/babel"
      }
    },
    "node_modules/@babel/generator": {
      "version": "7.29.8",
      "resolved": "https://registry.npmjs.org/@babel/generator/-/generator-7.29.8.tgz",
      "integrity": "sha512-gZbepsdh3WDtgZKWL+vTPh71LSBrm/Y4/QDZBVCcYfmeTEEuoOYwlSy+G1StfJg+/Zy550u/3TATbm7qDbbMtg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/parser": "^7.29.8",
        "@babel/types": "^7.29.8",
        "@jridgewell/gen-mapping": "^0.3.12",
        "@jridgewell/trace-mapping": "^0.3.28",
        "jsesc": "^3.0.2"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-compilation-targets": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-compilation-targets/-/helper-compilation-targets-7.29.7.tgz",
      "integrity": "sha512-wem6WaBj4NaVYVdNhLPPVacES6ZJ+KBBfSkTMD3YZxbP3rm3Di85tJU5ljaUNhaOynt+Aj0xruhYuzQBt8n71g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/compat-data": "^7.29.7",
        "@babel/helper-validator-option": "^7.29.7",
        "browserslist": "^4.24.0",
        "lru-cache": "^5.1.1",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-globals": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-globals/-/helper-globals-7.29.7.tgz",
      "integrity": "sha512-3nQVUAtvkKH9zahfWgw96Jc/uFOmjACE1kQz82E2lqWmHBgjzbNlsC22nuQTfahmWeQtTq5nQ/4Nnd2A1wj4zA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-module-imports": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-module-imports/-/helper-module-imports-7.29.7.tgz",
      "integrity": "sha512-ejHwrQQYcm9xnTivShn2IDOlIzInN34AXskvq9QicvCtEzq1Vzclu/tKF8Jq1Cg8JG2GL6/EmjgsCT7lXepE3g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/traverse": "^7.29.7",
        "@babel/types": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-module-transforms": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-module-transforms/-/helper-module-transforms-7.29.7.tgz",
      "integrity": "sha512-UPUVSyXbOh627KiCIGQSgwWzGeBKLkaJ9PJEdrngIwMSzxLR4jS4+f1f1jb7VzBbg8nFLaYotvVPFCTqdrmTAg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/helper-module-imports": "^7.29.7",
        "@babel/helper-validator-identifier": "^7.29.7",
        "@babel/traverse": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0"
      }
    },
    "node_modules/@babel/helper-string-parser": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-string-parser/-/helper-string-parser-7.29.7.tgz",
      "integrity": "sha512-Pb5ijPrZ89GDH8223L4UP8i6QApWxs04RbPQJTeWDV0/keR2E36MeKnyr6LYmUUvqRRI+Iv87SuF1W6ErINzYw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-validator-identifier": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-validator-identifier/-/helper-validator-identifier-7.29.7.tgz",
      "integrity": "sha512-qehxGkRj55h/ff8EMaJ+cYhyaKlHIxqYDn682wQD7RNp9UujOQsHog2uS0r2vzr4pW+sXf90NeeayjcNaX3fFg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-validator-option": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-validator-option/-/helper-validator-option-7.29.7.tgz",
      "integrity": "sha512-N9ZErrD+yW5geCDtBqnOoxmR8+tNKiGuxKlDpuJxfsqpa2dFcexaziGAE/qoHLiDDreVNMupxGmSoNlyvsA3gw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helpers": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helpers/-/helpers-7.29.7.tgz",
      "integrity": "sha512-1k2lAGRMfHTcwuNYcCNUmaUffmQv8KWMfh2iJUUeRlwlwH4FdNG7mfPI10NPfLHJFThE4Tyr4mv7kTNZOiPuBg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/template": "^7.29.7",
        "@babel/types": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/parser": {
      "version": "7.29.9",
      "resolved": "https://registry.npmjs.org/@babel/parser/-/parser-7.29.9.tgz",
      "integrity": "sha512-CjXrNHTnvqBVqHgdBysY3vk2T8tpJHb5/RMeHJBTyVa9xgugCB0CJTx/3oO8RV2QRQP391RWpB7D6hLjm8V9uA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/types": "^7.29.8"
      },
      "bin": {
        "parser": "bin/babel-parser.js"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@babel/template": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/template/-/template-7.29.7.tgz",
      "integrity": "sha512-puq+Gf35oI24FeN11LkoUQFqv9uwNeWpxXZi/Ji3rRIoKAzKnxRaZ+Gkj0vKS9ZCiTESfng1N9LyOyXvo+m+Gg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.29.7",
        "@babel/parser": "^7.29.7",
        "@babel/types": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/traverse": {
      "version": "7.29.8",
      "resolved": "https://registry.npmjs.org/@babel/traverse/-/traverse-7.29.8.tgz",
      "integrity": "sha512-I5z7H3bf/41ktsNVLtpN0wAa336HkqIHQ5BuPLEhTkt1jVSyZpeNKIzTgEWmlxjdg81R0IgUCcaE+Ok3NvrfZg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.29.7",
        "@babel/generator": "^7.29.8",
        "@babel/helper-globals": "^7.29.7",
        "@babel/parser": "^7.29.8",
        "@babel/template": "^7.29.7",
        "@babel/types": "^7.29.8",
        "debug": "^4.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/types": {
      "version": "7.29.8",
      "resolved": "https://registry.npmjs.org/@babel/types/-/types-7.29.8.tgz",
      "integrity": "sha512-Vj1jF3cPfxg7OAfoI7QnVKLoILlm2JF9pnVHrX8qx7AHMiYWT+NDAA7jChlNgRS4WTLc/fD1lXLmPixluj+3Gg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/helper-string-parser": "^7.29.7",
        "@babel/helper-validator-identifier": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@emnapi/wasi-threads": {
      "version": "1.2.3",
      "resolved": "https://registry.npmjs.org/@emnapi/wasi-threads/-/wasi-threads-1.2.3.tgz",
      "integrity": "sha512-ELEBe8PsLvvJ6QMr0zLt8ffvOHW/dc1m3CEzNMg7aJUv3bMaoDtw2TXyDAwkYBuroxxuHEwhRTLJSe5sya547g==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@eslint-community/eslint-utils": {
      "version": "4.10.1",
      "resolved": "https://registry.npmjs.org/@eslint-community/eslint-utils/-/eslint-utils-4.10.1.tgz",
      "integrity": "sha512-cuadcxVFE8sDK6iWJbs8Sn0av2Nrh2QSGQhVlBW9AaAHqHwjWsZHT8LJ4hFGPh7ASBV2deFdM7H/DPjulmh8rg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "eslint-visitor-keys": "^3.4.3"
      },
      "engines": {
        "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      },
      "peerDependencies": {
        "eslint": "^6.0.0 || ^7.0.0 || >=8.0.0"
      }
    },
    "node_modules/@eslint-community/eslint-utils/node_modules/eslint-visitor-keys": {
      "version": "3.4.3",
      "resolved": "https://registry.npmjs.org/eslint-visitor-keys/-/eslint-visitor-keys-3.4.3.tgz",
      "integrity": "sha512-wpc+LXeiyiisxPlEkUzU6svyS1frIO3Mgxj1fdy7Pm8Ygzguax2N3Fa/D/ag1WqbOprdI+uY6wMUl8/a2G+iag==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/@eslint-community/regexpp": {
      "version": "4.12.2",
      "resolved": "https://registry.npmjs.org/@eslint-community/regexpp/-/regexpp-4.12.2.tgz",
      "integrity": "sha512-EriSTlt5OC9/7SXkRSCAhfSxxoSUgBm33OH+IkwbdpgoqsSsUg7y3uh+IICI/Qg4BBWr3U2i39RpmycbxMq4ew==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^12.0.0 || ^14.0.0 || >=16.0.0"
      }
    },
    "node_modules/@eslint/config-array": {
      "version": "0.21.2",
      "resolved": "https://registry.npmjs.org/@eslint/config-array/-/config-array-0.21.2.tgz",
      "integrity": "sha512-nJl2KGTlrf9GjLimgIru+V/mzgSK0ABCDQRvxw5BjURL7WfH5uoWmizbH7QB6MmnMBd8cIC9uceWnezL1VZWWw==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@eslint/object-schema": "^2.1.7",
        "debug": "^4.3.1",
        "minimatch": "^3.1.5"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@eslint/config-helpers": {
      "version": "0.4.2",
      "resolved": "https://registry.npmjs.org/@eslint/config-helpers/-/config-helpers-0.4.2.tgz",
      "integrity": "sha512-gBrxN88gOIf3R7ja5K9slwNayVcZgK6SOUORm2uBzTeIEfeVaIhOpCtTox3P6R7o2jLFwLFTLnC7kU/RGcYEgw==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@eslint/core": "^0.17.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@eslint/core": {
      "version": "0.17.0",
      "resolved": "https://registry.npmjs.org/@eslint/core/-/core-0.17.0.tgz",
      "integrity": "sha512-yL/sLrpmtDaFEiUj1osRP4TI2MDz1AddJL+jZ7KSqvBuliN4xqYY54IfdN8qD8Toa6g1iloph1fxQNkjOxrrpQ==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@types/json-schema": "^7.0.15"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@eslint/eslintrc": {
      "version": "3.3.7",
      "resolved": "https://registry.npmjs.org/@eslint/eslintrc/-/eslintrc-3.3.7.tgz",
      "integrity": "sha512-F42g89Qd5oAWtp0k0nnSrjziAKza7w8SVT4mStc18LZMaRb4J1HQAHLCalEtDCxrTuksx7NU9qsmeLwpOfPqWw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ajv": "^6.14.0",
        "debug": "^4.3.2",
        "espree": "^10.0.1",
        "globals": "^14.0.0",
        "ignore": "^5.2.0",
        "import-fresh": "^3.2.1",
        "js-yaml": "^4.3.2",
        "minimatch": "^3.1.5",
        "strip-json-comments": "^3.1.1"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/@eslint/js": {
      "version": "9.39.5",
      "resolved": "https://registry.npmjs.org/@eslint/js/-/js-9.39.5.tgz",
      "integrity": "sha512-QywQuszQh77pIXCsq998c8hbhSTI/azTty1Z6N53dmAudKHhy573j3yvRLsX2BSp8YpLtoCEG8E9DJe+8zUh4A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://eslint.org/donate"
      }
    },
    "node_modules/@eslint/object-schema": {
      "version": "2.1.7",
      "resolved": "https://registry.npmjs.org/@eslint/object-schema/-/object-schema-2.1.7.tgz",
      "integrity": "sha512-VtAOaymWVfZcmZbp6E2mympDIHvyjXs/12LqWYjVw6qjrfF+VK+fyG33kChz3nnK+SU5/NeHOqrTEHS8sXO3OA==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@eslint/plugin-kit": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/@eslint/plugin-kit/-/plugin-kit-0.4.1.tgz",
      "integrity": "sha512-43/qtrDUokr7LJqoF2c3+RInu/t4zfrpYdoSDfYyhg52rwLV6TnOvdG4fXm7IkSB3wErkcmJS9iEhjVtOSEjjA==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@eslint/core": "^0.17.0",
        "levn": "^0.4.1"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@humanfs/core": {
      "version": "0.19.2",
      "resolved": "https://registry.npmjs.org/@humanfs/core/-/core-0.19.2.tgz",
      "integrity": "sha512-UhXNm+CFMWcbChXywFwkmhqjs3PRCmcSa/hfBgLIb7oQ5HNb1wS0icWsGtSAUNgefHeI+eBrA8I1fxmbHsGdvA==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@humanfs/types": "^0.15.0"
      },
      "engines": {
        "node": ">=18.18.0"
      }
    },
    "node_modules/@humanfs/node": {
      "version": "0.16.8",
      "resolved": "https://registry.npmjs.org/@humanfs/node/-/node-0.16.8.tgz",
      "integrity": "sha512-gE1eQNZ3R++kTzFUpdGlpmy8kDZD/MLyHqDwqjkVQI0JMdI1D51sy1H958PNXYkM2rAac7e5/CnIKZrHtPh3BQ==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@humanfs/core": "^0.19.2",
        "@humanfs/types": "^0.15.0",
        "@humanwhocodes/retry": "^0.4.0"
      },
      "engines": {
        "node": ">=18.18.0"
      }
    },
    "node_modules/@humanfs/types": {
      "version": "0.15.0",
      "resolved": "https://registry.npmjs.org/@humanfs/types/-/types-0.15.0.tgz",
      "integrity": "sha512-ZZ1w0aoQkwuUuC7Yf+7sdeaNfqQiiLcSRbfI08oAxqLtpXQr9AIVX7Ay7HLDuiLYAaFPu8oBYNq/QIi9URHJ3Q==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">=18.18.0"
      }
    },
    "node_modules/@humanwhocodes/module-importer": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/@humanwhocodes/module-importer/-/module-importer-1.0.1.tgz",
      "integrity": "sha512-bxveV4V8v5Yb4ncFTT3rPSgZBOpCkjfK0y4oVVVJwIuDVBRMDXrPyXRL988i5ap9m9bnyEEjWfm5WkBmtffLfA==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">=12.22"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/nzakas"
      }
    },
    "node_modules/@humanwhocodes/retry": {
      "version": "0.4.3",
      "resolved": "https://registry.npmjs.org/@humanwhocodes/retry/-/retry-0.4.3.tgz",
      "integrity": "sha512-bV0Tgo9K4hfPCek+aMAn81RppFKv2ySDQeMoSZuvTASywNTnVJCArCZE2FWqpvIatKu7VMRLWlR1EazvVhDyhQ==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">=18.18"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/nzakas"
      }
    },
    "node_modules/@img/colour": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@img/colour/-/colour-1.1.0.tgz",
      "integrity": "sha512-Td76q7j57o/tLVdgS746cYARfSyxk8iEfRxewL9h4OMzYhbW4TAcppl0mT4eyqXddh6L/jwoM75mo7ixa/pCeQ==",
      "license": "MIT",
      "optional": true,
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@img/sharp-darwin-arm64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-darwin-arm64/-/sharp-darwin-arm64-0.35.4.tgz",
      "integrity": "sha512-Uhfl4V4lhP2nbUVF9+hyH1+luj86f1gUFeo8ALYxFoULoU+G87D43BfeMP8XHsk9boxAnCY/bf2EHwhA7MuGsA==",
      "cpu": [
        "arm64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-darwin-arm64": "1.3.3"
      }
    },
    "node_modules/@img/sharp-darwin-x64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-darwin-x64/-/sharp-darwin-x64-0.35.4.tgz",
      "integrity": "sha512-hWniXY3bG5qKpkKrAwPe4y+VTPmf086YQAnkxWh7uA1YrlRouWGa0M0Mxj3ZjnXFkv7/TD1bTy9lGUK26vRvWw==",
      "cpu": [
        "x64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-darwin-x64": "1.3.3"
      }
    },
    "node_modules/@img/sharp-freebsd-wasm32": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-freebsd-wasm32/-/sharp-freebsd-wasm32-0.35.4.tgz",
      "integrity": "sha512-lIsKw/BU+kjB4eZjxrYrZmwOJYi3Ajrv66iAlBmUPyKc3HpnloevB1g3wxGD9P/5BbQ1brBGl65VRRrCvQDEqA==",
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "dependencies": {
        "@img/sharp-wasm32": "0.35.4"
      },
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-darwin-arm64": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-darwin-arm64/-/sharp-libvips-darwin-arm64-1.3.3.tgz",
      "integrity": "sha512-suTBPTDGrI9WodccaDdwZItTSaBYASlBk1NSfElSHrUfzu3szG6lvIF58+WiFvnfzuK8ZBFS5zE00PxqxnRiPg==",
      "cpu": [
        "arm64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "darwin"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-darwin-x64": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-darwin-x64/-/sharp-libvips-darwin-x64-1.3.3.tgz",
      "integrity": "sha512-FVJZ5mITMobmXIz/hPDTw0EintTW5H3WfrxwLqEqjiIihlu+hVRyGrFQ60xl0Lxn7Bt3zdpevPaQi0HEzqz9fw==",
      "cpu": [
        "x64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "darwin"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-arm": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-arm/-/sharp-libvips-linux-arm-1.3.3.tgz",
      "integrity": "sha512-3rbU4vqXXc3hY/OiXdl52xZvT0F1yEngWfvqudtPJg/KkyiaQw2DRsFrNzpmLvfavbwOq3qXn36GP8obHRULQA==",
      "cpu": [
        "arm"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-arm64": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-arm64/-/sharp-libvips-linux-arm64-1.3.3.tgz",
      "integrity": "sha512-0DaL0A6Xu6sQSQFwe4iVCrKWU2cCTItnRsYsCdxAMm9NF6twAA9BKnoqy4hqz4+azQ0JHuA26qiUKsf1XJ/v5A==",
      "cpu": [
        "arm64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-ppc64": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-ppc64/-/sharp-libvips-linux-ppc64-1.3.3.tgz",
      "integrity": "sha512-cdn1OvUBwsXhbC0zSzJnNzf5MZ/mTrobawDvNXBTxe8VtqKAm0sRuEY2Evzovb/w9JMk4TvRxqt1mekSuJz64w==",
      "cpu": [
        "ppc64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-riscv64": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-riscv64/-/sharp-libvips-linux-riscv64-1.3.3.tgz",
      "integrity": "sha512-HjPVx7yKz+0lqdhDlTw1tt90wamBoxhiXpvl1XZpJLiHH4RCJ5yDTqH+VlYPv2fwFs89JFw4c1IexYOcQUi4IQ==",
      "cpu": [
        "riscv64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-s390x": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-s390x/-/sharp-libvips-linux-s390x-1.3.3.tgz",
      "integrity": "sha512-neWLh+3yCNThxnfy3c4BbVBeGgt9aftno+XbT56iK28RgeDs3UOFWviLWlUu0bArYVYJaFDK+RRohbicUNCm8Q==",
      "cpu": [
        "s390x"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-x64": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-x64/-/sharp-libvips-linux-x64-1.3.3.tgz",
      "integrity": "sha512-4vKmvAst9nrowcqquKFAyZJUDolUaIp8uRiN0mWFguJ1IplC9/pitXtlnnlU4aa/eJw3J7i67V+pwUL+wZGdsA==",
      "cpu": [
        "x64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linuxmusl-arm64": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linuxmusl-arm64/-/sharp-libvips-linuxmusl-arm64-1.3.3.tgz",
      "integrity": "sha512-Y9kQaLMuNoB0bPYOOdcZMaseNrFpPodIWWMrx+CZyydf2xn68j9WYc6sWWRrDwNkzCQjKYfc68L7jKjGlHMibw==",
      "cpu": [
        "arm64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linuxmusl-x64": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linuxmusl-x64/-/sharp-libvips-linuxmusl-x64-1.3.3.tgz",
      "integrity": "sha512-fj8Mv0HHfD1Rr+4I68+3agJynxDWtBFgicTbSOb9Bke6pIwzGcJ+RX/yHjmiEGFMCavY/dxvem7MyNaJF+wDiw==",
      "cpu": [
        "x64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-linux-arm": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-arm/-/sharp-linux-arm-0.35.4.tgz",
      "integrity": "sha512-7OAS8gI0EReKGVN2HssHlM6umJgxF5VI3xN0p9FA91p/YO+ou5hiNghLdZ5BEHztwaaK5+bLKRf8x/o2L2nk9A==",
      "cpu": [
        "arm"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-arm": "1.3.3"
      }
    },
    "node_modules/@img/sharp-linux-arm64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-arm64/-/sharp-linux-arm64-0.35.4.tgz",
      "integrity": "sha512-De4jpEnAU8Hd5oT0j1G3uL4ZvTuipVMn7YC6vPaJhy6/7EwEae0SVAoBrUMYQbkLGDm85taVWwuPc1a44LTzCQ==",
      "cpu": [
        "arm64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-arm64": "1.3.3"
      }
    },
    "node_modules/@img/sharp-linux-ppc64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-ppc64/-/sharp-linux-ppc64-0.35.4.tgz",
      "integrity": "sha512-2oYZJeIl4kCcMGk4ouZVjnkCtFrpQFlNEtJ6GbxzhHQchwH0NH/qEb9ykmOl29dqwMq+JhFdZn+1ak2FKhI9fQ==",
      "cpu": [
        "ppc64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-ppc64": "1.3.3"
      }
    },
    "node_modules/@img/sharp-linux-riscv64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-riscv64/-/sharp-linux-riscv64-0.35.4.tgz",
      "integrity": "sha512-cPbNChoRURAWdebDIHSenxRpgEdy7JkPydSnUxRm9VvKD7m0/xVaR/8Fzlu81pk5nHEvHH87UZUA7cTtwnbJSA==",
      "cpu": [
        "riscv64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-riscv64": "1.3.3"
      }
    },
    "node_modules/@img/sharp-linux-s390x": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-s390x/-/sharp-linux-s390x-0.35.4.tgz",
      "integrity": "sha512-RY0JFY8Fd6RonCBtHz+DvadaPkXDSI1AUn6yWL9TipqkZ1vY8w8evqdgyDFnkm4/K1ve1TvZiaePP5oSd4+WVQ==",
      "cpu": [
        "s390x"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-s390x": "1.3.3"
      }
    },
    "node_modules/@img/sharp-linux-x64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-x64/-/sharp-linux-x64-0.35.4.tgz",
      "integrity": "sha512-9qvvEAuk8k89TfWUoX2htWjbAMX8p+NxCppjpcg5k6xMsjhBQPTsoIh36h9Qde4WRuGpJeYnOjdosDn/cnv+OA==",
      "cpu": [
        "x64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-x64": "1.3.3"
      }
    },
    "node_modules/@img/sharp-linuxmusl-arm64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-linuxmusl-arm64/-/sharp-linuxmusl-arm64-0.35.4.tgz",
      "integrity": "sha512-KB5jxpfWQTr0nc3xdHtWChdbifHrBGsd2SM62Eyxrl8afikm+f5qGBU75SJIZBT/S1MC8XyacdlXBMSWq6OURA==",
      "cpu": [
        "arm64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linuxmusl-arm64": "1.3.3"
      }
    },
    "node_modules/@img/sharp-linuxmusl-x64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-linuxmusl-x64/-/sharp-linuxmusl-x64-0.35.4.tgz",
      "integrity": "sha512-f+eZJZIQNEEd26RPSW+76chwOf1XtA2Y/O+5ocVyLliHkeih3e+jhLVBdNTd2rS3IbNXK8+ug93Vf5ZXtF5Lxg==",
      "cpu": [
        "x64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linuxmusl-x64": "1.3.3"
      }
    },
    "node_modules/@img/sharp-wasm32": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-wasm32/-/sharp-wasm32-0.35.4.tgz",
      "integrity": "sha512-zQnl4Kwp7Q6NHsENtU2T/00Zi+w3AQNwz3+UaTyVBy2FpXrzXzGjndpK61onhZjRtRpQXxCTeqw19bVyXOh7jA==",
      "license": "Apache-2.0 AND LGPL-3.0-or-later AND MIT",
      "optional": true,
      "dependencies": {
        "@emnapi/runtime": "^1.11.3"
      },
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-webcontainers-wasm32": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-webcontainers-wasm32/-/sharp-webcontainers-wasm32-0.35.4.tgz",
      "integrity": "sha512-ESfNkywmCfPNyaZjxooddJQiQ+l/nTpGEOGthxiLnIHXC/CmcBixnfwUleX9mCz9ovrUUvKMap/pm8RYbzfwaA==",
      "cpu": [
        "wasm32"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "dependencies": {
        "@img/sharp-wasm32": "0.35.4"
      },
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-win32-arm64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-win32-arm64/-/sharp-win32-arm64-0.35.4.tgz",
      "integrity": "sha512-iNdlBX9gLVvqe2I3uIJSIKTq6wckP/DYxZtcqxm09x5Gi24DnFBmPAWZmr60ZyYMG0xlzo6goG3670ar+RXvRw==",
      "cpu": [
        "arm64"
      ],
      "license": "Apache-2.0 AND LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-win32-ia32": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-win32-ia32/-/sharp-win32-ia32-0.35.4.tgz",
      "integrity": "sha512-kqRsbaa5CS6KHlpxnN7WhE6vAAugXyZButpRdvDWetlv6Qv4N9WTcrWzF7tXfB9T7MsoadqdI8hmwLq6UlLvtw==",
      "cpu": [
        "ia32"
      ],
      "license": "Apache-2.0 AND LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": "^20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-win32-x64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-win32-x64/-/sharp-win32-x64-0.35.4.tgz",
      "integrity": "sha512-XtmnYhBcrORsJ4XJngyzr/EWP0hRZLAZRFaApdKuviyqF78+ylxh2y06ZmtULAMOnObJ3ucpN0AcwSWnMowTRg==",
      "cpu": [
        "x64"
      ],
      "license": "Apache-2.0 AND LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@jridgewell/gen-mapping": {
      "version": "0.3.13",
      "resolved": "https://registry.npmjs.org/@jridgewell/gen-mapping/-/gen-mapping-0.3.13.tgz",
      "integrity": "sha512-2kkt/7niJ6MgEPxF0bYdQ6etZaA+fQvDcLKckhy1yIQOzaoKjBBjSj63/aLVjYE3qhRt5dvM+uUyfCg6UKCBbA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/sourcemap-codec": "^1.5.0",
        "@jridgewell/trace-mapping": "^0.3.24"
      }
    },
    "node_modules/@jridgewell/remapping": {
      "version": "2.3.5",
      "resolved": "https://registry.npmjs.org/@jridgewell/remapping/-/remapping-2.3.5.tgz",
      "integrity": "sha512-LI9u/+laYG4Ds1TDKSJW2YPrIlcVYOwi2fUC6xB43lueCjgxV4lffOCZCtYFiH6TNOX+tQKXx97T4IKHbhyHEQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/gen-mapping": "^0.3.5",
        "@jridgewell/trace-mapping": "^0.3.24"
      }
    },
    "node_modules/@jridgewell/resolve-uri": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/@jridgewell/resolve-uri/-/resolve-uri-3.1.2.tgz",
      "integrity": "sha512-bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@jridgewell/sourcemap-codec": {
      "version": "1.6.0",
      "resolved": "https://registry.npmjs.org/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.6.0.tgz",
      "integrity": "sha512-T7jf+5zgsZHwNJ4lvQ7/aezbyk0nNX+zJVWpmHA7VYsEx7a7qr5Rg5IbtJFqkgze5Y2sruq1RUY8Q837Od7iFw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@jridgewell/trace-mapping": {
      "version": "0.3.31",
      "resolved": "https://registry.npmjs.org/@jridgewell/trace-mapping/-/trace-mapping-0.3.31.tgz",
      "integrity": "sha512-zzNR+SdQSDJzc8joaeP8QQoCQr8NuYx2dIIytl1QeBEZHJ9uW6hebsrYgbz8hJwUQao3TWCMtmfV8Nu1twOLAw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/resolve-uri": "^3.1.0",
        "@jridgewell/sourcemap-codec": "^1.4.14"
      }
    },
    "node_modules/@napi-rs/wasm-runtime": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@napi-rs/wasm-runtime/-/wasm-runtime-1.2.4.tgz",
      "integrity": "sha512-AJxoUD2/15ESHbvpcyjU274nsAPLuOtPHCk0vKJM5pj//Fg/B1FXNWjPnXTT9PymCYYiHo4zPj0ZomXBKhoy7g==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@tybys/wasm-util": "^0.10.3"
      },
      "engines": {
        "node": "^20.19.0 || ^22.13.0 || >=23.5.0"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/Brooooooklyn"
      },
      "peerDependencies": {
        "@emnapi/core": "^1.7.1 || ^2.0.0-alpha.4",
        "@emnapi/runtime": "^1.7.1 || ^2.0.0-alpha.4"
      }
    },
    "node_modules/@next/env": {
      "version": "16.3.6",
      "resolved": "https://registry.npmjs.org/@next/env/-/env-16.3.6.tgz",
      "integrity": "sha512-x9Vblze1EbtltQYnNH38xCPWU3TVfBd1eXqA3+w9+BTpedkkdNpAaltXlGQ/nsc1+E0mVTNrtcbX3GoO09zeLQ==",
      "license": "MIT"
    },
    "node_modules/@next/eslint-plugin-next": {
      "version": "16.3.6",
      "resolved": "https://registry.npmjs.org/@next/eslint-plugin-next/-/eslint-plugin-next-16.3.6.tgz",
      "integrity": "sha512-jowwDX+7DOlDIjJLgTMxudw+k37QnWu1JkZLkSi9MaJBfDYcfhAPMKBhXL0idYzFN/AGg//axnOR4cLkHX/Rng==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@eslint-community/eslint-utils": "4.9.1",
        "fast-glob": "3.3.1"
      }
    },
    "node_modules/@next/eslint-plugin-next/node_modules/@eslint-community/eslint-utils": {
      "version": "4.9.1",
      "resolved": "https://registry.npmjs.org/@eslint-community/eslint-utils/-/eslint-utils-4.9.1.tgz",
      "integrity": "sha512-phrYmNiYppR7znFEdqgfWHXR6NCkZEK7hwWDHZUjit/2/U0r6XvkDl0SYnoM51Hq7FhCGdLDT6zxCCOY1hexsQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "eslint-visitor-keys": "^3.4.3"
      },
      "engines": {
        "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      },
      "peerDependencies": {
        "eslint": "^6.0.0 || ^7.0.0 || >=8.0.0"
      }
    },
    "node_modules/@next/eslint-plugin-next/node_modules/eslint-visitor-keys": {
      "version": "3.4.3",
      "resolved": "https://registry.npmjs.org/eslint-visitor-keys/-/eslint-visitor-keys-3.4.3.tgz",
      "integrity": "sha512-wpc+LXeiyiisxPlEkUzU6svyS1frIO3Mgxj1fdy7Pm8Ygzguax2N3Fa/D/ag1WqbOprdI+uY6wMUl8/a2G+iag==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/@next/swc-darwin-arm64": {
      "version": "16.3.6",
      "resolved": "https://registry.npmjs.org/@next/swc-darwin-arm64/-/swc-darwin-arm64-16.3.6.tgz",
      "integrity": "sha512-E/7GEqaUkt8mk/T8v9lAnrhzR06kdq1ZBkC12F8tAMkdIadwNp3H1KqHynDHrpcTlGCUdq/qu6vUL2aYVyYBdw==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-darwin-x64": {
      "version": "16.3.6",
      "resolved": "https://registry.npmjs.org/@next/swc-darwin-x64/-/swc-darwin-x64-16.3.6.tgz",
      "integrity": "sha512-yBE893/nDWTlaiBD1p+qgt7NUen4U5R6FXyH0s67Npq1S3E0cVSef1WIXC2xBRgQvwAvJq6DnS6Y6PrY0cy4Ew==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-arm64-gnu": {
      "version": "16.3.6",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-arm64-gnu/-/swc-linux-arm64-gnu-16.3.6.tgz",
      "integrity": "sha512-KJDpjBqBPYlvkivmyrp+Qys6k/7ksbqGQvRVc6ZEGfR+cjQxx+nUkJaWmNZJsmoOrqYNbaXByF8wa0lBwDhB3Q==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-arm64-musl": {
      "version": "16.3.6",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-arm64-musl/-/swc-linux-arm64-musl-16.3.6.tgz",
      "integrity": "sha512-mqNg2K+hvWskSRb/QM+Ix412DvBsuSF0XV+frTSw5vmoucNnIlynFwKYew8D01bfATErMOM7Bujrf0BA5DRKFA==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-x64-gnu": {
      "version": "16.3.6",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-x64-gnu/-/swc-linux-x64-gnu-16.3.6.tgz",
      "integrity": "sha512-nFncBNGAYouRHjRVaITs9beZRfhX4ssVwpnvPIAbkZVH6LtGoAVlH4bJ8Cnf9SOo9bsXgPFer/GdHtEE3JNOkw==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-x64-musl": {
      "version": "16.3.6",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-x64-musl/-/swc-linux-x64-musl-16.3.6.tgz",
      "integrity": "sha512-5Mf3cHDGR/Iz0ng2Bj3zUR3p5QS9YK3Hn2QiAfavFmyF48zwThAjpFoiTKNIcOHLYS4zEk+gzyJ/9deQ2ZB8yQ==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-win32-arm64-msvc": {
      "version": "16.3.6",
      "resolved": "https://registry.npmjs.org/@next/swc-win32-arm64-msvc/-/swc-win32-arm64-msvc-16.3.6.tgz",
      "integrity": "sha512-0jkJy0C2kbrJWTk4YLa3xk80pVBpx8FCHJym7CnUfDAXe/FWv5qT7SQJbR0KuemyxaEDlEx5WT4VQJoTW+/9Qw==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-win32-x64-msvc": {
      "version": "16.3.6",
      "resolved": "https://registry.npmjs.org/@next/swc-win32-x64-msvc/-/swc-win32-x64-msvc-16.3.6.tgz",
      "integrity": "sha512-/YXjI1e5OXcZ7YpxRwgP/1jAV/SBKTzeVKqN2mk7mLpcICsyn3Gl5+dIfDTJp70M0ccMhyMMRso4v6mPDCGepg==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@nodelib/fs.scandir": {
      "version": "2.1.5",
      "resolved": "https://registry.npmjs.org/@nodelib/fs.scandir/-/fs.scandir-2.1.5.tgz",
      "integrity": "sha512-vq24Bq3ym5HEQm2NKCr3yXDwjc7vTsEThRDnkp2DK9p1uqLR+DHurm/NOTo0KG7HYHU7eppKZj3MyqYuMBf62g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.stat": "2.0.5",
        "run-parallel": "^1.1.9"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/@nodelib/fs.stat": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/@nodelib/fs.stat/-/fs.stat-2.0.5.tgz",
      "integrity": "sha512-RkhPPp2zrqDAQA/2jNhnztcPAlv64XdhIp7a7454A5ovI7Bukxgt7MX7udwAu3zg1DcpPU0rz3VV1SeaqvY4+A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/@nodelib/fs.walk": {
      "version": "1.2.8",
      "resolved": "https://registry.npmjs.org/@nodelib/fs.walk/-/fs.walk-1.2.8.tgz",
      "integrity": "sha512-oGB+UxlgWcgQkgwo8GcEGwemoTFt3FIO9ababBmaGwXIoBKZ+GTy0pP185beGg7Llih/NSHSV2XAs1lnznocSg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.scandir": "2.1.5",
        "fastq": "^1.6.0"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/@nolyfill/is-core-module": {
      "version": "1.0.39",
      "resolved": "https://registry.npmjs.org/@nolyfill/is-core-module/-/is-core-module-1.0.39.tgz",
      "integrity": "sha512-nn5ozdjYQpUCZlWGuxcJY/KpxkWQs4DcbMCmKojjyrYDEAGy4Ce19NN4v5MduafTwJlbKc99UA8YhSVqq9yPZA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12.4.0"
      }
    },
    "node_modules/@rtsao/scc": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@rtsao/scc/-/scc-1.1.0.tgz",
      "integrity": "sha512-zt6OdqaDoOnJ1ZYsCYGt9YmWzDXl4vQdKTyJev62gFhRGKdx7mcT54V9KIjg+d2wi9EXsPvAPKe7i7WjfVWB8g==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@swc/helpers": {
      "version": "0.5.23",
      "resolved": "https://registry.npmjs.org/@swc/helpers/-/helpers-0.5.23.tgz",
      "integrity": "sha512-5lSsMOTXURePglDfvuAQUqkGek9Hg2kksOYay2m0+XR++b2NWYL/4sWyuvVBIs8oKnJaxkdi9whaL/sqN13afw==",
      "license": "Apache-2.0",
      "dependencies": {
        "tslib": "^2.8.0"
      }
    },
    "node_modules/@tailwindcss/node": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/node/-/node-4.3.3.tgz",
      "integrity": "sha512-/T8IKEsf9VTU6tLjgC7+sv2mOPtQxzE2jMw7u4Tt40Tx+QSZxpzh95/H6cMKoja9XuW7iMdLJYBB0o9G1CaAgg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/remapping": "^2.3.5",
        "enhanced-resolve": "^5.24.1",
        "jiti": "^2.7.0",
        "lightningcss": "1.32.0",
        "magic-string": "^0.30.21",
        "source-map-js": "^1.2.1",
        "tailwindcss": "4.3.3"
      }
    },
    "node_modules/@tailwindcss/oxide": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide/-/oxide-4.3.3.tgz",
      "integrity": "sha512-krXjAikiaFSPaK/FkAQT5UTx3VormQaiZ5hBFlJZ9UFQGB/rwg1MZIhHAG9smMQRTdyJxP6Qt5MwMtdyU5FWrA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 20"
      },
      "optionalDependencies": {
        "@tailwindcss/oxide-android-arm64": "4.3.3",
        "@tailwindcss/oxide-darwin-arm64": "4.3.3",
        "@tailwindcss/oxide-darwin-x64": "4.3.3",
        "@tailwindcss/oxide-freebsd-x64": "4.3.3",
        "@tailwindcss/oxide-linux-arm-gnueabihf": "4.3.3",
        "@tailwindcss/oxide-linux-arm64-gnu": "4.3.3",
        "@tailwindcss/oxide-linux-arm64-musl": "4.3.3",
        "@tailwindcss/oxide-linux-x64-gnu": "4.3.3",
        "@tailwindcss/oxide-linux-x64-musl": "4.3.3",
        "@tailwindcss/oxide-wasm32-wasi": "4.3.3",
        "@tailwindcss/oxide-win32-arm64-msvc": "4.3.3",
        "@tailwindcss/oxide-win32-x64-msvc": "4.3.3"
      }
    },
    "node_modules/@tailwindcss/oxide-android-arm64": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-android-arm64/-/oxide-android-arm64-4.3.3.tgz",
      "integrity": "sha512-Y85A2gmPSkl5Ve5qR86GL4HT509cFqQh1aes9p3sSkyTPwt0Pppf3GkwGe4JPACcRYjgJIEhQgM6dBClnr0NYw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-darwin-arm64": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-darwin-arm64/-/oxide-darwin-arm64-4.3.3.tgz",
      "integrity": "sha512-BiaWatpBcERQFDlOjRDpIVXuFK5PJez5SA4JMg6VYZdBYU+qKfV/vqjcIs+IYmtitf1xYQZTwXvU/8y4lfZUGw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-darwin-x64": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-darwin-x64/-/oxide-darwin-x64-4.3.3.tgz",
      "integrity": "sha512-fAeUqfV5ndhxRwai8cXGzdLvul9utWOmeTkv69unv4ZXixjn61Z+p9lCWdwOwA3TYboG3BwdVuN/RDjhBRl0mw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-freebsd-x64": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-freebsd-x64/-/oxide-freebsd-x64-4.3.3.tgz",
      "integrity": "sha512-iyf5bV6+wnAlflVeEy7R25dupxTNECZN5QMI0qNT6eT+EgaGdZcKhGkr5SdoaWiLJ3spLqIY9VCeSGrwmtg4kw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-linux-arm-gnueabihf": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-linux-arm-gnueabihf/-/oxide-linux-arm-gnueabihf-4.3.3.tgz",
      "integrity": "sha512-aAYUprJAJQWWbRrPvtjdroZ56Md+JM8pMiopS6xGEwDfLhqj+2ver2p4nU4Mb3CRqcMmNBjo8KkUgcxhkzVQGQ==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-linux-arm64-gnu": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-linux-arm64-gnu/-/oxide-linux-arm64-gnu-4.3.3.tgz",
      "integrity": "sha512-nDxldcEENOxZRzC2uu9jrutZdAAQtb+8WWDCSnWL1zvBk1+FN+x6MtDViPB5AJMfttVCUhehGWus3XBPgatM/w==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-linux-arm64-musl": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-linux-arm64-musl/-/oxide-linux-arm64-musl-4.3.3.tgz",
      "integrity": "sha512-Md44bD6veX/PC5iyF8cDVnw4HBIANZepRZZ7a8DQOvkfo5WUBwcp6iAuCUz23u+4SUkhJlD3eL7hNdW8ezd/kA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-linux-x64-gnu": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-linux-x64-gnu/-/oxide-linux-x64-gnu-4.3.3.tgz",
      "integrity": "sha512-tx7us1muwOKAKWao2v/GaafFeQboE6aj88vC6ziN2NCGcRm8gWUhwjzg+YdVB1e4boAtdtma4L43onunI6NS4w==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-linux-x64-musl": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-linux-x64-musl/-/oxide-linux-x64-musl-4.3.3.tgz",
      "integrity": "sha512-SJxX60smvHgasZoBy11dX6YRjXJFovwWBoedhbQPOBzgFWBHGB+TVPWB9BxzR7TTxU8FQZAI2AyiNCMzFm8Img==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-wasm32-wasi": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-wasm32-wasi/-/oxide-wasm32-wasi-4.3.3.tgz",
      "integrity": "sha512-jx1+rPhY/5Ympkktd656HBWEBLxP7dH06losBLjjf5vgCODXvi9KhtftWcMIwTFIDqBr7cRnQkdLnAG+IOlGvQ==",
      "bundleDependencies": [
        "@napi-rs/wasm-runtime",
        "@emnapi/core",
        "@emnapi/runtime",
        "@tybys/wasm-util",
        "@emnapi/wasi-threads",
        "tslib"
      ],
      "cpu": [
        "wasm32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@emnapi/core": "^1.11.1",
        "@emnapi/runtime": "^1.11.1",
        "@emnapi/wasi-threads": "^1.2.2",
        "@napi-rs/wasm-runtime": "^1.1.4",
        "@tybys/wasm-util": "^0.10.2",
        "tslib": "^2.8.1"
      },
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/@tailwindcss/oxide-win32-arm64-msvc": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-win32-arm64-msvc/-/oxide-win32-arm64-msvc-4.3.3.tgz",
      "integrity": "sha512-3rc292Ca2ceK6Ulcc/bAVnTs/3nDtoPhyEKlgPv+yQJQi/JS/AMJlqzxvlDacL1nekbrcf6bTqp/jV4qgnPxNQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-win32-x64-msvc": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-win32-x64-msvc/-/oxide-win32-x64-msvc-4.3.3.tgz",
      "integrity": "sha512-yJ0pwIVc/nYeGoV02WtsN8KYyLQv7kyI2wDnkezyJlGGjkd4QLwDGAwl47YpPJeuI0M0ObaXGSPjvWDPeTPggw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/postcss": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/postcss/-/postcss-4.3.3.tgz",
      "integrity": "sha512-JTSZZGQi1AyKirbLN3azmjVzef92tcX7h+iSqPdaeStyFpGpDlKvvpxeOE8njhbUanbRwr3z8DyzhICWnMtQeg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@alloc/quick-lru": "^5.2.0",
        "@tailwindcss/node": "4.3.3",
        "@tailwindcss/oxide": "4.3.3",
        "postcss": "^8.5.16",
        "tailwindcss": "4.3.3"
      }
    },
    "node_modules/@tybys/wasm-util": {
      "version": "0.10.4",
      "resolved": "https://registry.npmjs.org/@tybys/wasm-util/-/wasm-util-0.10.4.tgz",
      "integrity": "sha512-W3c4gRigFS0T/Ma4qIYF3GDAc5AQdHb1yL5znJT1Zv1YaD9Kitx656wBjvr19qbiosmZT8lWDM5BEMynUqX65A==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@types/estree": {
      "version": "1.0.9",
      "resolved": "https://registry.npmjs.org/@types/estree/-/estree-1.0.9.tgz",
      "integrity": "sha512-GhdPgy1el4/ImP05X05Uw4cw2/M93BCUmnEvWZNStlCzEKME4Fkk+YpoA5OiHNQmoS7Cafb8Xa3Pya8m1Qrzeg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/js-cookie": {
      "version": "3.0.6",
      "resolved": "https://registry.npmjs.org/@types/js-cookie/-/js-cookie-3.0.6.tgz",
      "integrity": "sha512-wkw9yd1kEXOPnvEeEV1Go1MmxtBJL0RR79aOTAApecWFVu7w0NNXNqhcWgvw2YgZDYadliXkl14pa3WXw5jlCQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/json-schema": {
      "version": "7.0.15",
      "resolved": "https://registry.npmjs.org/@types/json-schema/-/json-schema-7.0.15.tgz",
      "integrity": "sha512-5+fP8P8MFNC+AyZCDxrB2pkZFPGzqQWUzpSeuuVLvm8VMcorNYavBqoFcxK8bQz4Qsbn4oUEEem4wDLfcysGHA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/json5": {
      "version": "0.0.29",
      "resolved": "https://registry.npmjs.org/@types/json5/-/json5-0.0.29.tgz",
      "integrity": "sha512-dRLjCWHYg4oaA77cxO64oO+7JwCwnIzkZPdrrC71jQmQtlhM556pwKo5bUzqvZndkVbeFLIIi+9TC40JNF5hNQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/node": {
      "version": "20.19.43",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-20.19.43.tgz",
      "integrity": "sha512-6oYBAi5ikg4Pl+kGsoYtawUMBT2zZMCvPNF7pVLnHZfd1zf38DRiWn/gT01RYCdUqkv7Fhr+C9ot4/tb+2sVvA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "undici-types": "~6.21.0"
      }
    },
    "node_modules/@types/react": {
      "version": "19.3.0",
      "resolved": "https://registry.npmjs.org/@types/react/-/react-19.3.0.tgz",
      "integrity": "sha512-N0rFCuH9YoxG9/m61l9MfpJKfmLOVU0em7ipIz6TRgSSkvReLB9vL85GB+yr8Bs5leqpvg96JSwF4ZS1s4viQg==",
      "devOptional": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "csstype": "^3.2.2"
      }
    },
    "node_modules/@types/react-dom": {
      "version": "19.3.0",
      "resolved": "https://registry.npmjs.org/@types/react-dom/-/react-dom-19.3.0.tgz",
      "integrity": "sha512-ZI7bU42mZXXKHn/qNLEw2IrbiINU7X5+vfgdixBHkCNpYWXjKgfQ/P+uyGb5CjOLB9UcnTeg3rylQtV2hym44Q==",
      "dev": true,
      "license": "MIT",
      "peerDependencies": {
        "@types/react": "^19.3.0"
      }
    },
    "node_modules/@typescript-eslint/eslint-plugin": {
      "version": "8.70.1",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/eslint-plugin/-/eslint-plugin-8.70.1.tgz",
      "integrity": "sha512-nDNrUQ/4ruSNYbu749TRY7cfrzPtoLHEXSNBI8aaNY32LlZCajixqRf3FqcKC4p5Cam4VOHYx/t+i5+nKXvrqA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@eslint-community/regexpp": "^4.12.2",
        "@typescript-eslint/scope-manager": "8.70.1",
        "@typescript-eslint/type-utils": "8.70.1",
        "@typescript-eslint/utils": "8.70.1",
        "@typescript-eslint/visitor-keys": "8.70.1",
        "ignore": "^7.0.5",
        "natural-compare": "^1.4.0",
        "ts-api-utils": "^2.5.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "@typescript-eslint/parser": "^8.70.1",
        "eslint": "^8.57.0 || ^9.0.0 || ^10.0.0",
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/eslint-plugin/node_modules/ignore": {
      "version": "7.0.10",
      "resolved": "https://registry.npmjs.org/ignore/-/ignore-7.0.10.tgz",
      "integrity": "sha512-HpbUakT7xp5miBUywCHf36ZEuAJNklBJDDsGpUIjMzOSmM8ELSfA9Sa/QDPeNeqeoN31u+UTCkL4klCOVvRm4Q==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 4"
      }
    },
    "node_modules/@typescript-eslint/parser": {
      "version": "8.70.1",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/parser/-/parser-8.70.1.tgz",
      "integrity": "sha512-nO974WLllwhSFWQXnMLj6nDGa8f0khKEz1JzpPJ1u7Vm/4X1X6ZHajpoknU4bb41vJyMB0HHVyS2GqdhWfIXZw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@typescript-eslint/scope-manager": "8.70.1",
        "@typescript-eslint/types": "8.70.1",
        "@typescript-eslint/typescript-estree": "8.70.1",
        "@typescript-eslint/visitor-keys": "8.70.1",
        "debug": "^4.4.3"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "eslint": "^8.57.0 || ^9.0.0 || ^10.0.0",
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/project-service": {
      "version": "8.70.1",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/project-service/-/project-service-8.70.1.tgz",
      "integrity": "sha512-62xOgboPfwc3/IgPSX/W6oQR3ZbF04194FPGUGH8HL8iLFHbt/456/8Ph1wLNUgVF+s94FlHoipBsz+v7+LMnA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@typescript-eslint/tsconfig-utils": "^8.70.1",
        "@typescript-eslint/types": "^8.70.1",
        "debug": "^4.4.3"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/scope-manager": {
      "version": "8.70.1",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/scope-manager/-/scope-manager-8.70.1.tgz",
      "integrity": "sha512-Pa0EeSeAusQc1WbjQMac+YfenewYTBu0KjgYvkUKwhXaHUKbFog23Dm/rp0DX/6tyYOQ3Xl1a+3EcFNZynGHCw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@typescript-eslint/types": "8.70.1",
        "@typescript-eslint/visitor-keys": "8.70.1"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      }
    },
    "node_modules/@typescript-eslint/tsconfig-utils": {
      "version": "8.70.1",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/tsconfig-utils/-/tsconfig-utils-8.70.1.tgz",
      "integrity": "sha512-jumze1fPI+sDOaM2TWGQdn39PDxTr7TZGeuyLkAbNyx2vtMT3uRnVKChN0hfht5V2TugphJzF6bYXvBcE09qqg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/type-utils": {
      "version": "8.70.1",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/type-utils/-/type-utils-8.70.1.tgz",
      "integrity": "sha512-7zKTnyvaVWqzLZHPFQtX1hVHqgkMC+WebPWakNCSyrQVbIP1AM0L0TlBZtACldIRb6PptI8Odk+jyZ5kP3B1VA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@typescript-eslint/types": "8.70.1",
        "@typescript-eslint/typescript-estree": "8.70.1",
        "@typescript-eslint/utils": "8.70.1",
        "debug": "^4.4.3",
        "ts-api-utils": "^2.5.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "eslint": "^8.57.0 || ^9.0.0 || ^10.0.0",
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/types": {
      "version": "8.70.1",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/types/-/types-8.70.1.tgz",
      "integrity": "sha512-Dm1ypdhhrGCTyyehxElhgJ6kgk8MVCv5qXdoOVqPr1uqk42jX8KjrZqhROvdShczA8qrDoYiOWn1ykWlx2k81Q==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      }
    },
    "node_modules/@typescript-eslint/typescript-estree": {
      "version": "8.70.1",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/typescript-estree/-/typescript-estree-8.70.1.tgz",
      "integrity": "sha512-TU8PwyGN0PQJUcE96mw8eCQ44SmxGdQlJmlWakHaHQ15eIuuvye5yNtmh/i6oS88jzXVQB71xdNkbkB/fMwL0g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@typescript-eslint/project-service": "8.70.1",
        "@typescript-eslint/tsconfig-utils": "8.70.1",
        "@typescript-eslint/types": "8.70.1",
        "@typescript-eslint/visitor-keys": "8.70.1",
        "debug": "^4.4.3",
        "minimatch": "^10.2.2",
        "semver": "^7.7.3",
        "tinyglobby": "^0.2.15",
        "ts-api-utils": "^2.5.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/typescript-estree/node_modules/balanced-match": {
      "version": "4.0.4",
      "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-4.0.4.tgz",
      "integrity": "sha512-BLrgEcRTwX2o6gGxGOCNyMvGSp35YofuYzw9h1IMTRmKqttAZZVU67bdb9Pr2vUHA8+j3i2tJfjO6C6+4myGTA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "18 || 20 || >=22"
      }
    },
    "node_modules/@typescript-eslint/typescript-estree/node_modules/brace-expansion": {
      "version": "5.0.12",
      "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-5.0.12.tgz",
      "integrity": "sha512-YovQ3rzhaLMIrDjNDMkNS01tea93qhEhG5xy8f6+R0l+dw3Ki+5sCoIoI942iuLZTHWogWktgwVDhU09iNEimQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "balanced-match": "^4.0.2"
      },
      "engines": {
        "node": "20 || >=22"
      }
    },
    "node_modules/@typescript-eslint/typescript-estree/node_modules/minimatch": {
      "version": "10.2.6",
      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-10.2.6.tgz",
      "integrity": "sha512-vpLQEs+VLCr1nU0BXS07maYoFwlDAH0gngQuuttxIwutDFEMHq2blX+8vpgxDdK3J1PwjCJiep77OitTZ4Ll1A==",
      "dev": true,
      "license": "BlueOak-1.0.0",
      "dependencies": {
        "brace-expansion": "^5.0.8"
      },
      "engines": {
        "node": "18 || 20 || >=22"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/@typescript-eslint/typescript-estree/node_modules/semver": {
      "version": "7.8.5",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.8.5.tgz",
      "integrity": "sha512-Y7/KDsb8LjooZpwaqGyulO6DQlksgCncchHGk+sZIY4SBvUocMBEFH5Ur1fI4dV+Jvl0w6cjvucaIi40puRioA==",
      "dev": true,
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/@typescript-eslint/utils": {
      "version": "8.70.1",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/utils/-/utils-8.70.1.tgz",
      "integrity": "sha512-Esgul8MsnKnRLdYU2Eb2cRV9bS5HJYtKj1ByJnOzzG2M58DGdSUQ1jUuILxipqcpB2h9WLrbD5GijIWUjX/Tqw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@eslint-community/eslint-utils": "^4.9.1",
        "@typescript-eslint/scope-manager": "8.70.1",
        "@typescript-eslint/types": "8.70.1",
        "@typescript-eslint/typescript-estree": "8.70.1"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "eslint": "^8.57.0 || ^9.0.0 || ^10.0.0",
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/visitor-keys": {
      "version": "8.70.1",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/visitor-keys/-/visitor-keys-8.70.1.tgz",
      "integrity": "sha512-Vwj9lUIW5Xq3wQ9w6gv3R86g1hMK8f2zNOdGTAgeXUMMXFK78G9ruCjjqutHMNJc0+CH7LYRnHeUB9IT8wFmcw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@typescript-eslint/types": "8.70.1",
        "eslint-visitor-keys": "^5.0.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      }
    },
    "node_modules/@typescript-eslint/visitor-keys/node_modules/eslint-visitor-keys": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/eslint-visitor-keys/-/eslint-visitor-keys-5.0.1.tgz",
      "integrity": "sha512-tD40eHxA35h0PEIZNeIjkHoDR4YjjJp34biM0mDvplBe//mB+IHCqHDGV7pxF+7MklTvighcCPPZC7ynWyjdTA==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": "^20.19.0 || ^22.13.0 || >=24"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/@unrs/resolver-binding-android-arm-eabi": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-android-arm-eabi/-/resolver-binding-android-arm-eabi-1.12.2.tgz",
      "integrity": "sha512-g5T90pqg1bo/7mytQx6F4iBNC0Wsh9cu+z9veDbFjc7HjpesJFWD7QMS0NGStXM075+7dJPPVvBbpZlnrdpi/w==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ]
    },
    "node_modules/@unrs/resolver-binding-android-arm64": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-android-arm64/-/resolver-binding-android-arm64-1.12.2.tgz",
      "integrity": "sha512-YGCRZv/9GLhwmz6mYDeTsm/92BAyR28l6c2ReweVW5pWgfsitWLY8upvfRlGdoyD8HjeTHSYJWyZGD4KJA/nFQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ]
    },
    "node_modules/@unrs/resolver-binding-darwin-arm64": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-darwin-arm64/-/resolver-binding-darwin-arm64-1.12.2.tgz",
      "integrity": "sha512-u9DiNT1auQMO20A9SyTuG3wUgQWB9Z7KjAg0uFuCDR1FsAY8A0CG2S6JpHS1xwm/w1G08bjXZDcyOCjv1WAm2w==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@unrs/resolver-binding-darwin-x64": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-darwin-x64/-/resolver-binding-darwin-x64-1.12.2.tgz",
      "integrity": "sha512-f7rPLi/T1HVKZu/u6t87lroib16n8vrSzcyxI7lg4BGO9UF26KhQL44sd9eOUgrTYhvRXtWOIZT5PejdPyJfUA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@unrs/resolver-binding-freebsd-x64": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-freebsd-x64/-/resolver-binding-freebsd-x64-1.12.2.tgz",
      "integrity": "sha512-BpcOjWCJub6nRZUS2zA20pmLvjtqAtGejETaIyRLiZiQf++cbrjltLA5NN/xaXfqeOBOSlMFbemIl5/S5tljmg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-arm-gnueabihf": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-arm-gnueabihf/-/resolver-binding-linux-arm-gnueabihf-1.12.2.tgz",
      "integrity": "sha512-vZTDvdSISZjJx66OzJqtsOhzifbqRjbmI1Mnu49fQDwog5GtDI4QidRiEAYbZCRj9C8YZEW+3ZjqsyS9GR4k2A==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-arm-musleabihf": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-arm-musleabihf/-/resolver-binding-linux-arm-musleabihf-1.12.2.tgz",
      "integrity": "sha512-BiPI+IrIlwcW4nLLMM21+B1dFPzd55yAVgVGrdgDjNef+ch03GdxrcyaIz8X9SsQirh/kCQ7mviyWlMxdh2D7g==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-arm64-gnu": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-arm64-gnu/-/resolver-binding-linux-arm64-gnu-1.12.2.tgz",
      "integrity": "sha512-zJc0H99FEPoFfSrNpa91HYfxzfAJCr502oxNK1cfdC9hlaFI43RT+JFCann9JUgZmLzzntChHyn13Sgn9ljHNg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-arm64-musl": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-arm64-musl/-/resolver-binding-linux-arm64-musl-1.12.2.tgz",
      "integrity": "sha512-KQ3Lki6l+Pz1k/eBipN41ES+YUK30beLGb9YqcB1O542cyLCNE6GaxrfcY3T6EezmGGk84wb5XyO9loTM9tkcA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-loong64-gnu": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-loong64-gnu/-/resolver-binding-linux-loong64-gnu-1.12.2.tgz",
      "integrity": "sha512-3SJGEh1DborhG6pyxvhPzCT4bbSIVihsvgJc13P1bHG7KLdNDaF9T3gsTwFc7Jw/5Y5/iWOjkEx7Zy0NvCGX3Q==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-loong64-musl": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-loong64-musl/-/resolver-binding-linux-loong64-musl-1.12.2.tgz",
      "integrity": "sha512-jiuG/Obbel7uw1PwHNFfrkiKhLAF6mnyZ6aWlOAVN9WqKm8v0OFGnciJIHu8+CMvXLQ8AD51LPzAoUfT21D5Ew==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-ppc64-gnu": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-ppc64-gnu/-/resolver-binding-linux-ppc64-gnu-1.12.2.tgz",
      "integrity": "sha512-q7xRvVpmcfeL+LlZg8Pbbo6QaTZwDU5BaGZbwfhkEsXJn3Was8xYfE0RBH266xZt0rM6B7i8xAYIvjthuUIWHg==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-riscv64-gnu": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-riscv64-gnu/-/resolver-binding-linux-riscv64-gnu-1.12.2.tgz",
      "integrity": "sha512-0CVdx6lcnT3Q9inOH8tsMIOJ6ImndllMjqJHg8RLVdB7Vq4SfkEXl9mCSsVNuNA4MCYycRicCUxPCabVHJRr6A==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-riscv64-musl": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-riscv64-musl/-/resolver-binding-linux-riscv64-musl-1.12.2.tgz",
      "integrity": "sha512-iOwlRo9vnp6R6ohHQS11n0NnfdXx/omhkocmIfaPRpQhKZ+3BDMkkdRVh53qjkFkpPddf+FETA28NwGN7l5l+w==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-s390x-gnu": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-s390x-gnu/-/resolver-binding-linux-s390x-gnu-1.12.2.tgz",
      "integrity": "sha512-HYJtLfXq94q8iZNFT1lknx258wlkkWhZeUXJRqzKBBUJ00CvZ+N33zgbCqimLjsyw5Va6uUxhVa12mI+kaveEw==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-x64-gnu": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-x64-gnu/-/resolver-binding-linux-x64-gnu-1.12.2.tgz",
      "integrity": "sha512-mPsUhunKKDih5O96Y6enDQyHc1SqBPlY1E/SfMWDM3EdJ95Z9CArPeCVwCCqbP45ljvivdEk8Fxn+SIb1rDAJQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-x64-musl": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-x64-musl/-/resolver-binding-linux-x64-musl-1.12.2.tgz",
      "integrity": "sha512-azrt6+5ydLd8Vt210AAFis/lZevSfPw93EJRIJG+xPu4WCJ8K0kppCTpMyLPcKT7H15M4Jnt2tMp5bOvCkRC6A==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-openharmony-arm64": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-openharmony-arm64/-/resolver-binding-openharmony-arm64-1.12.2.tgz",
      "integrity": "sha512-YZ9hP4O0X9PQb8eO980qmLNGH4zT3I9+SZTdt0Pr0YyuGQhYKoOZkV02VzrzyOZJ5xIJ3UFIenKkUkGg8GjgWQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ]
    },
    "node_modules/@unrs/resolver-binding-wasm32-wasi": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-wasm32-wasi/-/resolver-binding-wasm32-wasi-1.12.2.tgz",
      "integrity": "sha512-tYFDIkMxSflfEc/h92ZWNsZlHSwgimbNHSO3PL2JWQHfCuC2q316jMyYU9TIWZsFK2bQwyK5VAdYgn8ygPj69A==",
      "cpu": [
        "wasm32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@emnapi/core": "1.10.0",
        "@emnapi/runtime": "1.10.0",
        "@napi-rs/wasm-runtime": "^1.1.4"
      },
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/@unrs/resolver-binding-wasm32-wasi/node_modules/@emnapi/core": {
      "version": "1.10.0",
      "resolved": "https://registry.npmjs.org/@emnapi/core/-/core-1.10.0.tgz",
      "integrity": "sha512-yq6OkJ4p82CAfPl0u9mQebQHKPJkY7WrIuk205cTYnYe+k2Z8YBh11FrbRG/H6ihirqcacOgl2BIO8oyMQLeXw==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@emnapi/wasi-threads": "1.2.1",
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@unrs/resolver-binding-wasm32-wasi/node_modules/@emnapi/runtime": {
      "version": "1.10.0",
      "resolved": "https://registry.npmjs.org/@emnapi/runtime/-/runtime-1.10.0.tgz",
      "integrity": "sha512-ewvYlk86xUoGI0zQRNq/mC+16R1QeDlKQy21Ki3oSYXNgLb45GV1P6A0M+/s6nyCuNDqe5VpaY84BzXGwVbwFA==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@unrs/resolver-binding-wasm32-wasi/node_modules/@emnapi/wasi-threads": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/@emnapi/wasi-threads/-/wasi-threads-1.2.1.tgz",
      "integrity": "sha512-uTII7OYF+/Mes/MrcIOYp5yOtSMLBWSIoLPpcgwipoiKbli6k322tcoFsxoIIxPDqW01SQGAgko4EzZi2BNv2w==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@unrs/resolver-binding-win32-arm64-msvc": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-win32-arm64-msvc/-/resolver-binding-win32-arm64-msvc-1.12.2.tgz",
      "integrity": "sha512-qzNyg3xL0VPQmCaUh+N5jSitce6k+uCBfMDesWRnlULOZaqUkaJ0ybdT+UqlAWJoQjuqfIU/0Ptx9bteN4D82g==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@unrs/resolver-binding-win32-ia32-msvc": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-win32-ia32-msvc/-/resolver-binding-win32-ia32-msvc-1.12.2.tgz",
      "integrity": "sha512-WD9sY00OfpHVGfsnHZoA8jVT+esS/Bg8z8jzxp5BnDCjjwsuKsPQrzswwpFy4J1AUJbXPRfkpcX0mXrzeXW79g==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@unrs/resolver-binding-win32-x64-msvc": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-win32-x64-msvc/-/resolver-binding-win32-x64-msvc-1.12.2.tgz",
      "integrity": "sha512-nAB74NfSNKknqQ1RrYj6uz8FcXEomu/MATJZxh/x+BArzN2U3JbOYC0APYzUIGhVY3m5hRxA8VPNdPBoG8txlA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/acorn": {
      "version": "8.18.0",
      "resolved": "https://registry.npmjs.org/acorn/-/acorn-8.18.0.tgz",
      "integrity": "sha512-lGq+9yr1/GuAWaVYIHRjvvySG5/4VfKIvC8EWxStPdcDh/Ka7FG3twP6v4d5BkravUilhIAsG4Qj83t02LWUPQ==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "bin": {
        "acorn": "bin/acorn"
      },
      "engines": {
        "node": ">=0.4.0"
      }
    },
    "node_modules/acorn-jsx": {
      "version": "5.3.2",
      "resolved": "https://registry.npmjs.org/acorn-jsx/-/acorn-jsx-5.3.2.tgz",
      "integrity": "sha512-rq9s+JNhf0IChjtDXxllJ7g41oZk5SlXtp0LHwyA5cejwn7vKmKp4pPri6YEePv2PU65sAsegbXtIinmDFDXgQ==",
      "dev": true,
      "license": "MIT",
      "peerDependencies": {
        "acorn": "^6.0.0 || ^7.0.0 || ^8.0.0"
      }
    },
    "node_modules/agent-base": {
      "version": "6.0.2",
      "resolved": "https://registry.npmjs.org/agent-base/-/agent-base-6.0.2.tgz",
      "integrity": "sha512-RZNwNclF7+MS/8bDg70amg32dyeZGZxiDuQmZxKLAlQjr3jGyLx+4Kkk58UO7D2QdgFIQCovuSuZESne6RG6XQ==",
      "license": "MIT",
      "dependencies": {
        "debug": "4"
      },
      "engines": {
        "node": ">= 6.0.0"
      }
    },
    "node_modules/ajv": {
      "version": "6.15.0",
      "resolved": "https://registry.npmjs.org/ajv/-/ajv-6.15.0.tgz",
      "integrity": "sha512-fgFx7Hfoq60ytK2c7DhnF8jIvzYgOMxfugjLOSMHjLIPgenqa7S7oaagATUq99mV6IYvN2tRmC0wnTYX6iPbMw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fast-deep-equal": "^3.1.1",
        "fast-json-stable-stringify": "^2.0.0",
        "json-schema-traverse": "^0.4.1",
        "uri-js": "^4.2.2"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/epoberezkin"
      }
    },
    "node_modules/ansi-styles": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-4.3.0.tgz",
      "integrity": "sha512-zbB9rCJAT1rbjiVDb2hqKFHNYLxgtk8NURxZ3IZwD3F6NtxbXZQCnnSi1Lkx+IDohdPlFp222wVALIheZJQSEg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "color-convert": "^2.0.1"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
      }
    },
    "node_modules/argparse": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/argparse/-/argparse-2.0.1.tgz",
      "integrity": "sha512-8+9WqebbFzpX9OR+Wa6O29asIogeRMzcGtAINdpMHHyAg10f05aSFVBbcEqGf/PXw1EjAZ+q2/bEBg3DvurK3Q==",
      "dev": true,
      "license": "Python-2.0"
    },
    "node_modules/aria-query": {
      "version": "5.3.2",
      "resolved": "https://registry.npmjs.org/aria-query/-/aria-query-5.3.2.tgz",
      "integrity": "sha512-COROpnaoap1E2F000S62r6A60uHZnmlvomhfyT2DlTcrY1OrBKn2UhH7qn5wTC9zMvD0AY7csdPSNwKP+7WiQw==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/array-buffer-byte-length": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/array-buffer-byte-length/-/array-buffer-byte-length-1.0.2.tgz",
      "integrity": "sha512-LHE+8BuR7RYGDKvnrmcuSq3tDcKv9OFEXQt/HpbZhY7V6h0zlUXutnAD82GiFx9rdieCMjkvtcsPqBwgUl1Iiw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "is-array-buffer": "^3.0.5"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/array-includes": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/array-includes/-/array-includes-3.2.0.tgz",
      "integrity": "sha512-VXY5eFRarnXcYxwBjJzPmEhH55+rmP79/+ueDhi0F+TuqfHCItagIHqxeUZrmgrOPa31QTh9H85DjX3FfJ0FTg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.9",
        "call-bound": "^1.0.4",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.24.2",
        "es-object-atoms": "^1.1.2",
        "es-shim-unscopables": "^1.1.0",
        "is-string": "^1.1.1",
        "math-intrinsics": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/array.prototype.findlast": {
      "version": "1.2.5",
      "resolved": "https://registry.npmjs.org/array.prototype.findlast/-/array.prototype.findlast-1.2.5.tgz",
      "integrity": "sha512-CVvd6FHg1Z3POpBLxO6E6zr+rSKEQ9L6rZHAaY7lLfhKsWYUBBOuMs0e9o24oopj6H+geRCX0YJ+TJLBK2eHyQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.7",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.2",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.0.0",
        "es-shim-unscopables": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/array.prototype.findlastindex": {
      "version": "1.2.6",
      "resolved": "https://registry.npmjs.org/array.prototype.findlastindex/-/array.prototype.findlastindex-1.2.6.tgz",
      "integrity": "sha512-F/TKATkzseUExPlfvmwQKGITM3DGTK+vkAsCZoDc5daVygbJBnjEUCbgkAvVFsgfXfX4YIqZ/27G3k3tdXrTxQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.4",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.9",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.1",
        "es-shim-unscopables": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/array.prototype.flat": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/array.prototype.flat/-/array.prototype.flat-1.3.3.tgz",
      "integrity": "sha512-rwG/ja1neyLqCuGZ5YYrznA62D4mZXg0i1cIskIUKSiqF3Cje9/wXAls9B9s1Wa2fomMsIv8czB8jZcPmxCXFg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.5",
        "es-shim-unscopables": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/array.prototype.flatmap": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/array.prototype.flatmap/-/array.prototype.flatmap-1.3.3.tgz",
      "integrity": "sha512-Y7Wt51eKJSyi80hFrJCePGGNo5ktJCslFuboqJsbf57CCPcm5zztluPlc4/aD8sWsKvlwatezpV4U1efk8kpjg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.5",
        "es-shim-unscopables": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/array.prototype.tosorted": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/array.prototype.tosorted/-/array.prototype.tosorted-1.1.4.tgz",
      "integrity": "sha512-p6Fx8B7b7ZhL/gmUsAy0D15WhvDccw3mnGNbZpi3pmeJdxtWsj2jEaI4Y6oo3XiHfzuSgPwKc04MYt6KgvC/wA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.7",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.3",
        "es-errors": "^1.3.0",
        "es-shim-unscopables": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/arraybuffer.prototype.slice": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/arraybuffer.prototype.slice/-/arraybuffer.prototype.slice-1.0.4.tgz",
      "integrity": "sha512-BNoCY6SXXPQ7gF2opIP4GBE+Xw7U+pHMYKuzjgCN3GwiaIR09UUeKfheyIry77QtrCBlC0KK0q5/TER/tYh3PQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "array-buffer-byte-length": "^1.0.1",
        "call-bind": "^1.0.8",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.5",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.6",
        "is-array-buffer": "^3.0.4"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/ast-types-flow": {
      "version": "0.0.8",
      "resolved": "https://registry.npmjs.org/ast-types-flow/-/ast-types-flow-0.0.8.tgz",
      "integrity": "sha512-OH/2E5Fg20h2aPrbe+QL8JZQFko0YZaF+j4mnQ7BGhfavO7OpSLa8a0y9sBwomHdSbkhTS8TQNayBfnW5DwbvQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/async-function": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/async-function/-/async-function-1.0.0.tgz",
      "integrity": "sha512-hsU18Ae8CDTR6Kgu9DYf0EbCr/a5iGL0rytQDobUcdpYOKokk8LEjVphnXkDkgpi0wYVsqrXuP0bZxJaTqdgoA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/asynckit": {
      "version": "0.4.0",
      "resolved": "https://registry.npmjs.org/asynckit/-/asynckit-0.4.0.tgz",
      "integrity": "sha512-Oei9OH4tRh0YqU3GxhX79dM/mwVgvbZJaSNaRk+bshkj0S5cfHcgYakreBjrHwatXKbz+IoIdYLxrKim2MjW0Q==",
      "license": "MIT"
    },
    "node_modules/available-typed-arrays": {
      "version": "1.0.7",
      "resolved": "https://registry.npmjs.org/available-typed-arrays/-/available-typed-arrays-1.0.7.tgz",
      "integrity": "sha512-wvUjBtSGN7+7SjNpq/9M2Tg350UZD3q62IFZLbRAR1bSMlCo1ZaeW+BJ+D090e4hIIZLBcTDWe4Mh4jvUDajzQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "possible-typed-array-names": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/axe-core": {
      "version": "4.13.0",
      "resolved": "https://registry.npmjs.org/axe-core/-/axe-core-4.13.0.tgz",
      "integrity": "sha512-UzGt8zg7Ny8djbYMhxl2zuEevVa7r2gJjYY5Lwr1xM7+XU2nd6CkIWFTVcCIbAP63vSz71NaVyyuSk9lHKcy0A==",
      "dev": true,
      "license": "MPL-2.0",
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/axios": {
      "version": "1.20.0",
      "resolved": "https://registry.npmjs.org/axios/-/axios-1.20.0.tgz",
      "integrity": "sha512-r8aOh8j9cGKpgQAqpzrUHnSIc6a59Y3Xf/cv8sy1DrHCkZHzQGEuoq1tARk6qSyDdtQGSDgpb9kFlruzPvrgwg==",
      "license": "MIT",
      "dependencies": {
        "follow-redirects": "^1.16.0",
        "form-data": "^4.0.6",
        "https-proxy-agent": "^5.0.1",
        "proxy-from-env": "^2.1.0"
      }
    },
    "node_modules/axobject-query": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/axobject-query/-/axobject-query-4.1.0.tgz",
      "integrity": "sha512-qIj0G9wZbMGNLjLmg1PT6v2mE9AH2zlnADJD/2tC6E00hgmhUOfEB6greHPAfLRSufHqROIUTkw6E+M3lH0PTQ==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/balanced-match": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-1.0.2.tgz",
      "integrity": "sha512-3oSeUO0TMV67hN1AmbXsK4yaqU7tjiHlbxRDZOpH0KW9+CeX4bRAaX0Anxt0tx2MrpRpWwQaPwIlISEJhYU5Pw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/baseline-browser-mapping": {
      "version": "2.11.25",
      "resolved": "https://registry.npmjs.org/baseline-browser-mapping/-/baseline-browser-mapping-2.11.25.tgz",
      "integrity": "sha512-gMmEShwwq7FJqMwvfRwvCl00v4kN+KOfJqXn+f4nrufak5gNHJOksd/60Dvjuz7sI8Y5WiSFBa8FEYr+zoyqCw==",
      "license": "Apache-2.0",
      "bin": {
        "baseline-browser-mapping": "dist/cli.cjs"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/brace-expansion": {
      "version": "1.1.21",
      "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-1.1.21.tgz",
      "integrity": "sha512-9zeA+KLZNNzglF2TPKRQEDyx6Yby7daAkuy8MiPzpXPsYDWi/DRM8jmwUDxokQjYqBpv5DgPiwD4h4ZZSy1Ujw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "balanced-match": "^1.0.0",
        "concat-map": "0.0.1"
      }
    },
    "node_modules/braces": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/braces/-/braces-3.0.3.tgz",
      "integrity": "sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fill-range": "^7.1.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/browserslist": {
      "version": "4.29.0",
      "resolved": "https://registry.npmjs.org/browserslist/-/browserslist-4.29.0.tgz",
      "integrity": "sha512-3GSvyjvDI4Dur1Meg2BekJquu5uF+9R9a1+5M1Mde192eZoXbeXjzgOsgqPS2V8D5wrrip0gR5Hf/GhWQ9ZzaA==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/browserslist"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "baseline-browser-mapping": "^2.11.23",
        "caniuse-lite": "^1.0.30001810",
        "electron-to-chromium": "^1.5.427",
        "node-releases": "^2.0.55",
        "update-browserslist-db": "^1.3.3"
      },
      "bin": {
        "browserslist": "cli.js"
      },
      "engines": {
        "node": "^6 || ^7 || ^8 || ^9 || ^10 || ^11 || ^12 || >=13.7"
      }
    },
    "node_modules/call-bind": {
      "version": "1.0.9",
      "resolved": "https://registry.npmjs.org/call-bind/-/call-bind-1.0.9.tgz",
      "integrity": "sha512-a/hy+pNsFUTR+Iz8TCJvXudKVLAnz/DyeSUo10I5yvFDQJBFU2s9uqQpoSrJlroHUKoKqzg+epxyP9lqFdzfBQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "es-define-property": "^1.0.1",
        "get-intrinsic": "^1.3.0",
        "set-function-length": "^1.2.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/call-bind-apply-helpers": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/call-bind-apply-helpers/-/call-bind-apply-helpers-1.0.2.tgz",
      "integrity": "sha512-Sp1ablJ0ivDkSzjcaJdxEunN5/XvksFJ2sMBFfq6x0ryhQV/2b/KwFe21cMpmHtPOSij8K99/wSfoEuTObmuMQ==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/call-bound": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/call-bound/-/call-bound-1.0.4.tgz",
      "integrity": "sha512-+ys997U96po4Kx/ABpBCqhA9EuxJaQWDQg7295H4hBphv3IZg0boBKuwYpt4YXp6MZ5AmZQnU/tyMTlRpaSejg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "get-intrinsic": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/callsites": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/callsites/-/callsites-3.1.0.tgz",
      "integrity": "sha512-P8BjAsXvZS+VIDUI11hHCQEv74YT67YUi5JJFNWIqL235sBmjX4+qx9Muvls5ivyNENctx46xQLQ3aTuE7ssaQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/caniuse-lite": {
      "version": "1.0.30001810",
      "resolved": "https://registry.npmjs.org/caniuse-lite/-/caniuse-lite-1.0.30001810.tgz",
      "integrity": "sha512-TITQPUkaz+aVk5GL6NhOdwk1aEaNTSDPsGFWrTuhKGtjTF70jL/Oht2W4c6rXUe5fu7Ie19VIahAXHIIiWWNeg==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/caniuse-lite"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "CC-BY-4.0"
    },
    "node_modules/chalk": {
      "version": "4.1.2",
      "resolved": "https://registry.npmjs.org/chalk/-/chalk-4.1.2.tgz",
      "integrity": "sha512-oKnbhFyRIXpUuez8iBMmyEa4nbj4IOQyuhc/wy9kY7/WVPcwIO9VA668Pu8RkO7+0G76SLROeyw9CpQ061i4mA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^4.1.0",
        "supports-color": "^7.1.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/chalk/chalk?sponsor=1"
      }
    },
    "node_modules/client-only": {
      "version": "0.0.1",
      "resolved": "https://registry.npmjs.org/client-only/-/client-only-0.0.1.tgz",
      "integrity": "sha512-IV3Ou0jSMzZrd3pZ48nLkT9DA7Ag1pnPzaiQhpW7c3RbcqqzvzzVu+L8gfqMp/8IM2MQtSiqaCxrrcfu8I8rMA==",
      "license": "MIT"
    },
    "node_modules/color-convert": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/color-convert/-/color-convert-2.0.1.tgz",
      "integrity": "sha512-RRECPsj7iu/xb5oKYcsFHSppFNnsj/52OVTRKb4zP5onXwVF3zVmmToNcOfGC+CRDpfK/U584fMg38ZHCaElKQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "color-name": "~1.1.4"
      },
      "engines": {
        "node": ">=7.0.0"
      }
    },
    "node_modules/color-name": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/color-name/-/color-name-1.1.4.tgz",
      "integrity": "sha512-dOy+3AuW3a2wNbZHIuMZpTcgjGuLU/uBL/ubcZF9OXbDo8ff4O8yVp5Bf0efS8uEoYo5q4Fx7dY9OgQGXgAsQA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/combined-stream": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/combined-stream/-/combined-stream-1.0.8.tgz",
      "integrity": "sha512-FQN4MRfuJeHf7cBbBMJFXhKSDq+2kAArBlmRBvcvFE5BB1HZKXtSFASDhdlz9zOYwxh8lDdnvmMOe/+5cdoEdg==",
      "license": "MIT",
      "dependencies": {
        "delayed-stream": "~1.0.0"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/concat-map": {
      "version": "0.0.1",
      "resolved": "https://registry.npmjs.org/concat-map/-/concat-map-0.0.1.tgz",
      "integrity": "sha512-/Srv4dswyQNBfohGpz9o6Yb3Gz3SrUDqBH5rTuhGR7ahtlbYKnVxw2bCFMRljaA7EXHaXZ8wsHdodFvbkhKmqg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/convert-source-map": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/convert-source-map/-/convert-source-map-2.0.0.tgz",
      "integrity": "sha512-Kvp459HrV2FEJ1CAsi1Ku+MY3kasH19TFykTz2xWmMeq6bk2NU3XXvfJ+Q61m0xktWwt+1HSYf3JZsTms3aRJg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/cross-spawn": {
      "version": "7.0.6",
      "resolved": "https://registry.npmjs.org/cross-spawn/-/cross-spawn-7.0.6.tgz",
      "integrity": "sha512-uV2QOWP2nWzsy2aMp8aRibhi9dlzF5Hgh5SHaB9OiTGEyDTiJJyx0uy51QXdyWbtAHNua4XJzUKca3OzKUd3vA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "path-key": "^3.1.0",
        "shebang-command": "^2.0.0",
        "which": "^2.0.1"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/csstype": {
      "version": "3.2.3",
      "resolved": "https://registry.npmjs.org/csstype/-/csstype-3.2.3.tgz",
      "integrity": "sha512-z1HGKcYy2xA8AGQfwrn0PAy+PB7X/GSj3UVJW9qKyn43xWa+gl5nXmU4qqLMRzWVLFC8KusUX8T/0kCiOYpAIQ==",
      "devOptional": true,
      "license": "MIT"
    },
    "node_modules/damerau-levenshtein": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/damerau-levenshtein/-/damerau-levenshtein-1.0.8.tgz",
      "integrity": "sha512-sdQSFB7+llfUcQHUQO3+B8ERRj0Oa4w9POWMI/puGtuf7gFywGmkaLCElnudfTiKZV+NvHqL0ifzdrI8Ro7ESA==",
      "dev": true,
      "license": "BSD-2-Clause"
    },
    "node_modules/data-view-buffer": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/data-view-buffer/-/data-view-buffer-1.0.2.tgz",
      "integrity": "sha512-EmKO5V3OLXh1rtK2wgXRansaK1/mtVdTUEiEI0W8RkvgT05kfxaH29PliLnpLP73yYO6142Q72QNa8Wx/A5CqQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "es-errors": "^1.3.0",
        "is-data-view": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/data-view-byte-length": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/data-view-byte-length/-/data-view-byte-length-1.0.2.tgz",
      "integrity": "sha512-tuhGbE6CfTM9+5ANGf+oQb72Ky/0+s3xKUpHvShfiz2RxMFgFPjsXuRLBVMtvMs15awe45SRb83D6wH4ew6wlQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "es-errors": "^1.3.0",
        "is-data-view": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/inspect-js"
      }
    },
    "node_modules/data-view-byte-offset": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/data-view-byte-offset/-/data-view-byte-offset-1.0.1.tgz",
      "integrity": "sha512-BS8PfmtDGnrgYdOonGZQdLZslWIeCGFP9tpan0hi1Co2Zr2NKADsvGYA8XxuG/4UWgJ6Cjtv+YJnB6MM69QGlQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "is-data-view": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/debug": {
      "version": "4.4.3",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
      "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/deep-is": {
      "version": "0.1.4",
      "resolved": "https://registry.npmjs.org/deep-is/-/deep-is-0.1.4.tgz",
      "integrity": "sha512-oIPzksmTg4/MriiaYGO+okXDT7ztn/w3Eptv/+gSIdMdKsJo0u4CfYNFJPy+4SKMuCqGw2wxnA+URMg3t8a/bQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/define-data-property": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/define-data-property/-/define-data-property-1.1.4.tgz",
      "integrity": "sha512-rBMvIzlpA8v6E+SJZoo++HAYqsLrkg7MSfIinMPFhmkorw7X+dOXVJQs+QT69zGkzMyfDnIMN2Wid1+NbL3T+A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-define-property": "^1.0.0",
        "es-errors": "^1.3.0",
        "gopd": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/define-properties": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/define-properties/-/define-properties-1.2.1.tgz",
      "integrity": "sha512-8QmQKqEASLd5nx0U1B1okLElbUuuttJ/AnYmRXbbbGDWh6uS208EjD4Xqq/I9wK7u0v6O08XhTWnt5XtEbR6Dg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "define-data-property": "^1.0.1",
        "has-property-descriptors": "^1.0.0",
        "object-keys": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/delayed-stream": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/delayed-stream/-/delayed-stream-1.0.0.tgz",
      "integrity": "sha512-ZySD7Nf91aLB0RxL4KGrKHBXl7Eds1DAmEdcoVawXnLD7SDhpNgtuII2aAkg7a7QS41jxPSZ17p4VdGnMHk3MQ==",
      "license": "MIT",
      "engines": {
        "node": ">=0.4.0"
      }
    },
    "node_modules/detect-libc": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/detect-libc/-/detect-libc-2.1.2.tgz",
      "integrity": "sha512-Btj2BOOO83o3WyH59e8MgXsxEQVcarkUOpEYrubB0urwnN10yQ364rsiByU11nZlqWYZm05i/of7io4mzihBtQ==",
      "devOptional": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/doctrine": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/doctrine/-/doctrine-2.1.0.tgz",
      "integrity": "sha512-35mSku4ZXK0vfCuHEDAwt55dg2jNajHZ1odvF+8SSr82EsZY4QmXfuWso8oEd8zRhVObSN18aM0CjSdoBX7zIw==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "esutils": "^2.0.2"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/dunder-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/dunder-proto/-/dunder-proto-1.0.1.tgz",
      "integrity": "sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.1",
        "es-errors": "^1.3.0",
        "gopd": "^1.2.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/electron-to-chromium": {
      "version": "1.5.438",
      "resolved": "https://registry.npmjs.org/electron-to-chromium/-/electron-to-chromium-1.5.438.tgz",
      "integrity": "sha512-AN9xMU1hJiT65LkCUPL1DZm5TCbOPb2Qsm5pYwFLEXp6/qj9SdT4yMiqs7Qqstwvkn1zF7l36SRGt+s6XcJ0FA==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/emoji-regex": {
      "version": "9.2.2",
      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-9.2.2.tgz",
      "integrity": "sha512-L18DaJsXSUk2+42pv8mLs5jJT2hqFkFE4j21wOmgbUqsZ2hL72NsUU785g9RXgo3s0ZNgVl42TiHp3ZtOv/Vyg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/enhanced-resolve": {
      "version": "5.25.1",
      "resolved": "https://registry.npmjs.org/enhanced-resolve/-/enhanced-resolve-5.25.1.tgz",
      "integrity": "sha512-nGXts5znJzmWPu+mIE9izCOzdg63oJca2mDzGWWTth7sr4aCToKcoyFVBQwN75Ij5Pf6p510EwkTqViTRzDV+w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "graceful-fs": "^4.2.4",
        "tapable": "^2.3.3"
      },
      "engines": {
        "node": ">=10.13.0"
      }
    },
    "node_modules/es-abstract": {
      "version": "1.24.2",
      "resolved": "https://registry.npmjs.org/es-abstract/-/es-abstract-1.24.2.tgz",
      "integrity": "sha512-2FpH9Q5i2RRwyEP1AylXe6nYLR5OhaJTZwmlcP0dL/+JCbgg7yyEo/sEK6HeGZRf3dFpWwThaRHVApXSkW3xeg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "array-buffer-byte-length": "^1.0.2",
        "arraybuffer.prototype.slice": "^1.0.4",
        "available-typed-arrays": "^1.0.7",
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.4",
        "data-view-buffer": "^1.0.2",
        "data-view-byte-length": "^1.0.2",
        "data-view-byte-offset": "^1.0.1",
        "es-define-property": "^1.0.1",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.1",
        "es-set-tostringtag": "^2.1.0",
        "es-to-primitive": "^1.3.0",
        "function.prototype.name": "^1.1.8",
        "get-intrinsic": "^1.3.0",
        "get-proto": "^1.0.1",
        "get-symbol-description": "^1.1.0",
        "globalthis": "^1.0.4",
        "gopd": "^1.2.0",
        "has-property-descriptors": "^1.0.2",
        "has-proto": "^1.2.0",
        "has-symbols": "^1.1.0",
        "hasown": "^2.0.2",
        "internal-slot": "^1.1.0",
        "is-array-buffer": "^3.0.5",
        "is-callable": "^1.2.7",
        "is-data-view": "^1.0.2",
        "is-negative-zero": "^2.0.3",
        "is-regex": "^1.2.1",
        "is-set": "^2.0.3",
        "is-shared-array-buffer": "^1.0.4",
        "is-string": "^1.1.1",
        "is-typed-array": "^1.1.15",
        "is-weakref": "^1.1.1",
        "math-intrinsics": "^1.1.0",
        "object-inspect": "^1.13.4",
        "object-keys": "^1.1.1",
        "object.assign": "^4.1.7",
        "own-keys": "^1.0.1",
        "regexp.prototype.flags": "^1.5.4",
        "safe-array-concat": "^1.1.3",
        "safe-push-apply": "^1.0.0",
        "safe-regex-test": "^1.1.0",
        "set-proto": "^1.0.0",
        "stop-iteration-iterator": "^1.1.0",
        "string.prototype.trim": "^1.2.10",
        "string.prototype.trimend": "^1.0.9",
        "string.prototype.trimstart": "^1.0.8",
        "typed-array-buffer": "^1.0.3",
        "typed-array-byte-length": "^1.0.3",
        "typed-array-byte-offset": "^1.0.4",
        "typed-array-length": "^1.0.7",
        "unbox-primitive": "^1.1.0",
        "which-typed-array": "^1.1.19"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/es-abstract-get": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/es-abstract-get/-/es-abstract-get-1.0.0.tgz",
      "integrity": "sha512-6PMWXpdhshVvFp+FoWYs1EvG1Nj0tvk0dZM+XcK0xMEM1czRVcP6ohqPWHy6qPagSpC8j4+p89WXlT+xXJs/fg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.2",
        "is-callable": "^1.2.7",
        "object-inspect": "^1.13.4"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/es-define-property": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/es-define-property/-/es-define-property-1.0.1.tgz",
      "integrity": "sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-errors": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/es-errors/-/es-errors-1.3.0.tgz",
      "integrity": "sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-iterator-helpers": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/es-iterator-helpers/-/es-iterator-helpers-1.4.0.tgz",
      "integrity": "sha512-c/A0P0oxkACDc+cKWw8evLXK83oBKgn0qPOqCYT4x9uolpCIJAcYvJC9QYKNDRPsTeGyCrQ326jrvgZWdCdK5Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.9",
        "call-bound": "^1.0.4",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.24.2",
        "es-errors": "^1.3.0",
        "es-set-tostringtag": "^2.1.0",
        "function-bind": "^1.1.2",
        "get-intrinsic": "^1.3.0",
        "globalthis": "^1.0.4",
        "gopd": "^1.2.0",
        "has-property-descriptors": "^1.0.2",
        "has-proto": "^1.2.0",
        "has-symbols": "^1.1.0",
        "internal-slot": "^1.1.0",
        "iterator.prototype": "^1.1.5",
        "math-intrinsics": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-object-atoms": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/es-object-atoms/-/es-object-atoms-1.1.2.tgz",
      "integrity": "sha512-HWcBoN6NileqtSydK2FqHbS/LoDd2pqrnQHLyJzBj4kOp/ky2MWMN694xOfkK8/SnUsW2DH7EfyVlydKCsm1Zw==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-set-tostringtag": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/es-set-tostringtag/-/es-set-tostringtag-2.1.0.tgz",
      "integrity": "sha512-j6vWzfrGVfyXxge+O0x5sh6cvxAog0a/4Rdd2K36zCMV5eJ+/+tOAngRO8cODMNWbVRdVlmGZQL2YS3yR8bIUA==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.6",
        "has-tostringtag": "^1.0.2",
        "hasown": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-shim-unscopables": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/es-shim-unscopables/-/es-shim-unscopables-1.1.0.tgz",
      "integrity": "sha512-d9T8ucsEhh8Bi1woXCf+TIKDIROLG5WCkxg8geBCbvk22kzwC5G2OnXVMO6FUsvQlgUUXQ2itephWDLqDzbeCw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "hasown": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-to-primitive": {
      "version": "1.3.4",
      "resolved": "https://registry.npmjs.org/es-to-primitive/-/es-to-primitive-1.3.4.tgz",
      "integrity": "sha512-yPDz7wqpg1/mmHLmS3tcfTfbw5f1eryXvyghYBffGdERwe+mV7ZcWzTR8LR17Kvqt3qfPurjlonmnq3MKXIOXw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-abstract-get": "^1.0.0",
        "es-define-property": "^1.0.1",
        "es-errors": "^1.3.0",
        "is-callable": "^1.2.7",
        "is-date-object": "^1.1.0",
        "is-symbol": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/escalade": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/escalade/-/escalade-3.2.0.tgz",
      "integrity": "sha512-WUj2qlxaQtO4g6Pq5c29GTcWGDyd8itL8zTlipgECz3JesAiiOKotd8JU6otB3PACgG6xkJUyVhboMS+bje/jA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/escape-string-regexp": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/escape-string-regexp/-/escape-string-regexp-4.0.0.tgz",
      "integrity": "sha512-TtpcNJ3XAzx3Gq8sWRzJaVajRs0uVxA2YAkdb1jm2YkPz4G6egUFAyA3n5vtEIZefPk5Wa4UXbKuS5fKkJWdgA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/eslint": {
      "version": "9.39.5",
      "resolved": "https://registry.npmjs.org/eslint/-/eslint-9.39.5.tgz",
      "integrity": "sha512-DgZS62aPLXKlnxILS/AYCoRvHaZeXceIzlXPkkGGzJWSow1aEk0lbTlxUSlyjC8jcaKxAdOnTDz+o1JFSBsyjw==",
      "deprecated": "This version is no longer supported. Please see https://eslint.org/version-support for other options.",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@eslint-community/eslint-utils": "^4.8.0",
        "@eslint-community/regexpp": "^4.12.1",
        "@eslint/config-array": "^0.21.2",
        "@eslint/config-helpers": "^0.4.2",
        "@eslint/core": "^0.17.0",
        "@eslint/eslintrc": "^3.3.6",
        "@eslint/js": "9.39.5",
        "@eslint/plugin-kit": "^0.4.1",
        "@humanfs/node": "^0.16.6",
        "@humanwhocodes/module-importer": "^1.0.1",
        "@humanwhocodes/retry": "^0.4.2",
        "@types/estree": "^1.0.6",
        "ajv": "^6.14.0",
        "chalk": "^4.0.0",
        "cross-spawn": "^7.0.6",
        "debug": "^4.3.2",
        "escape-string-regexp": "^4.0.0",
        "eslint-scope": "^8.4.0",
        "eslint-visitor-keys": "^4.2.1",
        "espree": "^10.4.0",
        "esquery": "^1.5.0",
        "esutils": "^2.0.2",
        "fast-deep-equal": "^3.1.3",
        "file-entry-cache": "^8.0.0",
        "find-up": "^5.0.0",
        "glob-parent": "^6.0.2",
        "ignore": "^5.2.0",
        "imurmurhash": "^0.1.4",
        "is-glob": "^4.0.0",
        "json-stable-stringify-without-jsonify": "^1.0.1",
        "lodash.merge": "^4.6.2",
        "minimatch": "^3.1.5",
        "natural-compare": "^1.4.0",
        "optionator": "^0.9.3"
      },
      "bin": {
        "eslint": "bin/eslint.js"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://eslint.org/donate"
      },
      "peerDependencies": {
        "jiti": "*"
      },
      "peerDependenciesMeta": {
        "jiti": {
          "optional": true
        }
      }
    },
    "node_modules/eslint-config-next": {
      "version": "16.3.6",
      "resolved": "https://registry.npmjs.org/eslint-config-next/-/eslint-config-next-16.3.6.tgz",
      "integrity": "sha512-1Upt3U7BDwU+ilpe2byZjAfts9oNq4d4fv/zXEvs8/4yS+cwOQW/WCxUNy8gCDquX67SzeehDvKblVC6ZBMocQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@next/eslint-plugin-next": "16.3.6",
        "eslint-import-resolver-node": "^0.3.6",
        "eslint-import-resolver-typescript": "^3.5.2",
        "eslint-plugin-import": "^2.32.0",
        "eslint-plugin-jsx-a11y": "^6.10.0",
        "eslint-plugin-react": "^7.37.0",
        "eslint-plugin-react-hooks": "^7.0.0",
        "globals": "16.4.0",
        "typescript-eslint": "^8.46.0"
      },
      "peerDependencies": {
        "eslint": ">=9.0.0",
        "typescript": ">=3.3.1"
      },
      "peerDependenciesMeta": {
        "typescript": {
          "optional": true
        }
      }
    },
    "node_modules/eslint-config-next/node_modules/globals": {
      "version": "16.4.0",
      "resolved": "https://registry.npmjs.org/globals/-/globals-16.4.0.tgz",
      "integrity": "sha512-ob/2LcVVaVGCYN+r14cnwnoDPUufjiYgSqRhiFD0Q1iI4Odora5RE8Iv1D24hAz5oMophRGkGz+yuvQmmUMnMw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/eslint-import-resolver-node": {
      "version": "0.3.10",
      "resolved": "https://registry.npmjs.org/eslint-import-resolver-node/-/eslint-import-resolver-node-0.3.10.tgz",
      "integrity": "sha512-tRrKqFyCaKict5hOd244sL6EQFNycnMQnBe+j8uqGNXYzsImGbGUU4ibtoaBmv5FLwJwcFJNeg1GeVjQfbMrDQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "debug": "^3.2.7",
        "is-core-module": "^2.16.1",
        "resolve": "^2.0.0-next.6"
      }
    },
    "node_modules/eslint-import-resolver-node/node_modules/debug": {
      "version": "3.2.7",
      "resolved": "https://registry.npmjs.org/debug/-/debug-3.2.7.tgz",
      "integrity": "sha512-CFjzYYAi4ThfiQvizrFQevTTXHtnCqWfe7x1AhgEscTz6ZbLbfoLRLPugTQyBth6f8ZERVUSyWHFD/7Wu4t1XQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.1"
      }
    },
    "node_modules/eslint-import-resolver-typescript": {
      "version": "3.10.1",
      "resolved": "https://registry.npmjs.org/eslint-import-resolver-typescript/-/eslint-import-resolver-typescript-3.10.1.tgz",
      "integrity": "sha512-A1rHYb06zjMGAxdLSkN2fXPBwuSaQ0iO5M/hdyS0Ajj1VBaRp0sPD3dn1FhME3c/JluGFbwSxyCfqdSbtQLAHQ==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "@nolyfill/is-core-module": "1.0.39",
        "debug": "^4.4.0",
        "get-tsconfig": "^4.10.0",
        "is-bun-module": "^2.0.0",
        "stable-hash": "^0.0.5",
        "tinyglobby": "^0.2.13",
        "unrs-resolver": "^1.6.2"
      },
      "engines": {
        "node": "^14.18.0 || >=16.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint-import-resolver-typescript"
      },
      "peerDependencies": {
        "eslint": "*",
        "eslint-plugin-import": "*",
        "eslint-plugin-import-x": "*"
      },
      "peerDependenciesMeta": {
        "eslint-plugin-import": {
          "optional": true
        },
        "eslint-plugin-import-x": {
          "optional": true
        }
      }
    },
    "node_modules/eslint-module-utils": {
      "version": "2.14.0",
      "resolved": "https://registry.npmjs.org/eslint-module-utils/-/eslint-module-utils-2.14.0.tgz",
      "integrity": "sha512-W2WCRZ9Dqntd+2u8jJcVMV2PKulc6RdLgUUoh/yQr3uB6lo/ZOeGx11sv60/8S4QFFKNslAlWhr9u0Ef7ZW6Ig==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "debug": "^3.2.7"
      },
      "engines": {
        "node": ">=4"
      },
      "peerDependenciesMeta": {
        "eslint": {
          "optional": true
        }
      }
    },
    "node_modules/eslint-module-utils/node_modules/debug": {
      "version": "3.2.7",
      "resolved": "https://registry.npmjs.org/debug/-/debug-3.2.7.tgz",
      "integrity": "sha512-CFjzYYAi4ThfiQvizrFQevTTXHtnCqWfe7x1AhgEscTz6ZbLbfoLRLPugTQyBth6f8ZERVUSyWHFD/7Wu4t1XQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.1"
      }
    },
    "node_modules/eslint-plugin-import": {
      "version": "2.32.0",
      "resolved": "https://registry.npmjs.org/eslint-plugin-import/-/eslint-plugin-import-2.32.0.tgz",
      "integrity": "sha512-whOE1HFo/qJDyX4SnXzP4N6zOWn79WhnCUY/iDR0mPfQZO8wcYE4JClzI2oZrhBnnMUCBCHZhO6VQyoBU95mZA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@rtsao/scc": "^1.1.0",
        "array-includes": "^3.1.9",
        "array.prototype.findlastindex": "^1.2.6",
        "array.prototype.flat": "^1.3.3",
        "array.prototype.flatmap": "^1.3.3",
        "debug": "^3.2.7",
        "doctrine": "^2.1.0",
        "eslint-import-resolver-node": "^0.3.9",
        "eslint-module-utils": "^2.12.1",
        "hasown": "^2.0.2",
        "is-core-module": "^2.16.1",
        "is-glob": "^4.0.3",
        "minimatch": "^3.1.2",
        "object.fromentries": "^2.0.8",
        "object.groupby": "^1.0.3",
        "object.values": "^1.2.1",
        "semver": "^6.3.1",
        "string.prototype.trimend": "^1.0.9",
        "tsconfig-paths": "^3.15.0"
      },
      "engines": {
        "node": ">=4"
      },
      "peerDependencies": {
        "eslint": "^2 || ^3 || ^4 || ^5 || ^6 || ^7.2.0 || ^8 || ^9"
      }
    },
    "node_modules/eslint-plugin-import/node_modules/debug": {
      "version": "3.2.7",
      "resolved": "https://registry.npmjs.org/debug/-/debug-3.2.7.tgz",
      "integrity": "sha512-CFjzYYAi4ThfiQvizrFQevTTXHtnCqWfe7x1AhgEscTz6ZbLbfoLRLPugTQyBth6f8ZERVUSyWHFD/7Wu4t1XQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.1"
      }
    },
    "node_modules/eslint-plugin-jsx-a11y": {
      "version": "6.10.2",
      "resolved": "https://registry.npmjs.org/eslint-plugin-jsx-a11y/-/eslint-plugin-jsx-a11y-6.10.2.tgz",
      "integrity": "sha512-scB3nz4WmG75pV8+3eRUQOHZlNSUhFNq37xnpgRkCCELU3XMvXAxLk1eqWWyE22Ki4Q01Fnsw9BA3cJHDPgn2Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "aria-query": "^5.3.2",
        "array-includes": "^3.1.8",
        "array.prototype.flatmap": "^1.3.2",
        "ast-types-flow": "^0.0.8",
        "axe-core": "^4.10.0",
        "axobject-query": "^4.1.0",
        "damerau-levenshtein": "^1.0.8",
        "emoji-regex": "^9.2.2",
        "hasown": "^2.0.2",
        "jsx-ast-utils": "^3.3.5",
        "language-tags": "^1.0.9",
        "minimatch": "^3.1.2",
        "object.fromentries": "^2.0.8",
        "safe-regex-test": "^1.0.3",
        "string.prototype.includes": "^2.0.1"
      },
      "engines": {
        "node": ">=4.0"
      },
      "peerDependencies": {
        "eslint": "^3 || ^4 || ^5 || ^6 || ^7 || ^8 || ^9"
      }
    },
    "node_modules/eslint-plugin-react": {
      "version": "7.37.5",
      "resolved": "https://registry.npmjs.org/eslint-plugin-react/-/eslint-plugin-react-7.37.5.tgz",
      "integrity": "sha512-Qteup0SqU15kdocexFNAJMvCJEfa2xUKNV4CC1xsVMrIIqEy3SQ/rqyxCWNzfrd3/ldy6HMlD2e0JDVpDg2qIA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "array-includes": "^3.1.8",
        "array.prototype.findlast": "^1.2.5",
        "array.prototype.flatmap": "^1.3.3",
        "array.prototype.tosorted": "^1.1.4",
        "doctrine": "^2.1.0",
        "es-iterator-helpers": "^1.2.1",
        "estraverse": "^5.3.0",
        "hasown": "^2.0.2",
        "jsx-ast-utils": "^2.4.1 || ^3.0.0",
        "minimatch": "^3.1.2",
        "object.entries": "^1.1.9",
        "object.fromentries": "^2.0.8",
        "object.values": "^1.2.1",
        "prop-types": "^15.8.1",
        "resolve": "^2.0.0-next.5",
        "semver": "^6.3.1",
        "string.prototype.matchall": "^4.0.12",
        "string.prototype.repeat": "^1.0.0"
      },
      "engines": {
        "node": ">=4"
      },
      "peerDependencies": {
        "eslint": "^3 || ^4 || ^5 || ^6 || ^7 || ^8 || ^9.7"
      }
    },
    "node_modules/eslint-plugin-react-hooks": {
      "version": "7.1.1",
      "resolved": "https://registry.npmjs.org/eslint-plugin-react-hooks/-/eslint-plugin-react-hooks-7.1.1.tgz",
      "integrity": "sha512-f2I7Gw6JbvCexzIInuSbZpfdQ44D7iqdWX01FKLvrPgqxoE7oMj8clOfto8U6vYiz4yd5oKu39rRSVOe1zRu0g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/core": "^7.24.4",
        "@babel/parser": "^7.24.4",
        "hermes-parser": "^0.25.1",
        "zod": "^3.25.0 || ^4.0.0",
        "zod-validation-error": "^3.5.0 || ^4.0.0"
      },
      "engines": {
        "node": ">=18"
      },
      "peerDependencies": {
        "eslint": "^3.0.0 || ^4.0.0 || ^5.0.0 || ^6.0.0 || ^7.0.0 || ^8.0.0-0 || ^9.0.0 || ^10.0.0"
      }
    },
    "node_modules/eslint-scope": {
      "version": "8.4.0",
      "resolved": "https://registry.npmjs.org/eslint-scope/-/eslint-scope-8.4.0.tgz",
      "integrity": "sha512-sNXOfKCn74rt8RICKMvJS7XKV/Xk9kA7DyJr8mJik3S7Cwgy3qlkkmyS2uQB3jiJg6VNdZd/pDBJu0nvG2NlTg==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "esrecurse": "^4.3.0",
        "estraverse": "^5.2.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/eslint-visitor-keys": {
      "version": "4.2.1",
      "resolved": "https://registry.npmjs.org/eslint-visitor-keys/-/eslint-visitor-keys-4.2.1.tgz",
      "integrity": "sha512-Uhdk5sfqcee/9H/rCOJikYz67o0a2Tw2hGRPOG2Y1R2dg7brRe1uG0yaNQDHu+TO/uQPF/5eCapvYSmHUjt7JQ==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/espree": {
      "version": "10.4.0",
      "resolved": "https://registry.npmjs.org/espree/-/espree-10.4.0.tgz",
      "integrity": "sha512-j6PAQ2uUr79PZhBjP5C5fhl8e39FmRnOjsD5lGnWrFU8i2G776tBK7+nP8KuQUTTyAZUwfQqXAgrVH5MbH9CYQ==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "acorn": "^8.15.0",
        "acorn-jsx": "^5.3.2",
        "eslint-visitor-keys": "^4.2.1"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/esquery": {
      "version": "1.7.0",
      "resolved": "https://registry.npmjs.org/esquery/-/esquery-1.7.0.tgz",
      "integrity": "sha512-Ap6G0WQwcU/LHsvLwON1fAQX9Zp0A2Y6Y/cJBl9r/JbW90Zyg4/zbG6zzKa2OTALELarYHmKu0GhpM5EO+7T0g==",
      "dev": true,
      "license": "BSD-3-Clause",
      "dependencies": {
        "estraverse": "^5.1.0"
      },
      "engines": {
        "node": ">=0.10"
      }
    },
    "node_modules/esrecurse": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/esrecurse/-/esrecurse-4.3.0.tgz",
      "integrity": "sha512-KmfKL3b6G+RXvP8N1vr3Tq1kL/oCFgn2NYXEtqP8/L3pKapUA4G8cFVaoF3SU323CD4XypR/ffioHmkti6/Tag==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "estraverse": "^5.2.0"
      },
      "engines": {
        "node": ">=4.0"
      }
    },
    "node_modules/estraverse": {
      "version": "5.3.0",
      "resolved": "https://registry.npmjs.org/estraverse/-/estraverse-5.3.0.tgz",
      "integrity": "sha512-MMdARuVEQziNTeJD8DgMqmhwR11BRQ/cBP+pLtYdSTnf3MIO8fFeiINEbX36ZdNlfU/7A9f3gUw49B3oQsvwBA==",
      "dev": true,
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">=4.0"
      }
    },
    "node_modules/esutils": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/esutils/-/esutils-2.0.3.tgz",
      "integrity": "sha512-kVscqXk4OCp68SZ0dkgEKVi6/8ij300KBWTJq32P/dYeWTSwK41WyTxalN1eRmA5Z9UU/LX9D7FWSmV9SAYx6g==",
      "dev": true,
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/fast-deep-equal": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/fast-deep-equal/-/fast-deep-equal-3.1.3.tgz",
      "integrity": "sha512-f3qQ9oQy9j2AhBe/H9VC91wLmKBCCU/gDOnKNAYG5hswO7BLKj09Hc5HYNz9cGI++xlpDCIgDaitVs03ATR84Q==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/fast-glob": {
      "version": "3.3.1",
      "resolved": "https://registry.npmjs.org/fast-glob/-/fast-glob-3.3.1.tgz",
      "integrity": "sha512-kNFPyjhh5cKjrUltxs+wFx+ZkbRaxxmZ+X0ZU31SOsxCEtP9VPgtq2teZw1DebupL5GmDaNQ6yKMMVcM41iqDg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.stat": "^2.0.2",
        "@nodelib/fs.walk": "^1.2.3",
        "glob-parent": "^5.1.2",
        "merge2": "^1.3.0",
        "micromatch": "^4.0.4"
      },
      "engines": {
        "node": ">=8.6.0"
      }
    },
    "node_modules/fast-glob/node_modules/glob-parent": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-5.1.2.tgz",
      "integrity": "sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "is-glob": "^4.0.1"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/fast-json-stable-stringify": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/fast-json-stable-stringify/-/fast-json-stable-stringify-2.1.0.tgz",
      "integrity": "sha512-lhd/wF+Lk98HZoTCtlVraHtfh5XYijIjalXck7saUtuanSDyLMxnHhSXEDJqHxD7msR8D0uCmqlkwjCV8xvwHw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/fast-levenshtein": {
      "version": "2.0.6",
      "resolved": "https://registry.npmjs.org/fast-levenshtein/-/fast-levenshtein-2.0.6.tgz",
      "integrity": "sha512-DCXu6Ifhqcks7TZKY3Hxp3y6qphY5SJZmrWMDrKcERSOXWQdMhU9Ig/PYrzyw/ul9jOIyh0N4M0tbC5hodg8dw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/fastq": {
      "version": "1.20.3",
      "resolved": "https://registry.npmjs.org/fastq/-/fastq-1.20.3.tgz",
      "integrity": "sha512-XKv5nnLs6nLF71NgiKJLIZFLkPyIEuOselLG7ujZnGrRfQK8HpvY+WqKhAJUAdLomwVHErVS4LfxFlPq0/FTAw==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "reusify": "^1.0.4"
      }
    },
    "node_modules/file-entry-cache": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/file-entry-cache/-/file-entry-cache-8.0.0.tgz",
      "integrity": "sha512-XXTUwCvisa5oacNGRP9SfNtYBNAMi+RPwBFmblZEF7N7swHYQS6/Zfk7SRwx4D5j3CH211YNRco1DEMNVfZCnQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "flat-cache": "^4.0.0"
      },
      "engines": {
        "node": ">=16.0.0"
      }
    },
    "node_modules/fill-range": {
      "version": "7.1.1",
      "resolved": "https://registry.npmjs.org/fill-range/-/fill-range-7.1.1.tgz",
      "integrity": "sha512-YsGpe3WHLK8ZYi4tWDg2Jy3ebRz2rXowDxnld4bkQB00cc/1Zw9AWnC0i9ztDJitivtQvaI9KaLyKrc+hBW0yg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "to-regex-range": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/find-up": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/find-up/-/find-up-5.0.0.tgz",
      "integrity": "sha512-78/PXT1wlLLDgTzDs7sjq9hzz0vXD+zn+7wypEe4fXQxCmdmqfGsEPQxmiCSQI3ajFV91bVSsvNtrJRiW6nGng==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "locate-path": "^6.0.0",
        "path-exists": "^4.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/flat-cache": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/flat-cache/-/flat-cache-4.0.1.tgz",
      "integrity": "sha512-f7ccFPK3SXFHpx15UIGyRJ/FJQctuKZ0zVuN3frBo4HnK3cay9VEW0R6yPYFHC0AgqhukPzKjq22t5DmAyqGyw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "flatted": "^3.2.9",
        "keyv": "^4.5.4"
      },
      "engines": {
        "node": ">=16"
      }
    },
    "node_modules/flatted": {
      "version": "3.4.4",
      "resolved": "https://registry.npmjs.org/flatted/-/flatted-3.4.4.tgz",
      "integrity": "sha512-5+ybhBZANEJxaH3X5evAFatUxLfEHSr7n6kYJ+1Qd0mUqr4eu9gIf6GDbWHf8RJijHrjjO8G+la14SlL2SeS1Q==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/follow-redirects": {
      "version": "1.16.1",
      "resolved": "https://registry.npmjs.org/follow-redirects/-/follow-redirects-1.16.1.tgz",
      "integrity": "sha512-FNvFGzoMLWmE6Yj9spb/zjd7yiNCHiAW9/Tg9CXrQ8wuu32HtlJOwWO11OJafl5FfY3DxTdQ0vj42zU1kvv5jg==",
      "funding": [
        {
          "type": "individual",
          "url": "https://github.com/sponsors/RubenVerborgh"
        }
      ],
      "license": "MIT",
      "engines": {
        "node": ">=4.0"
      },
      "peerDependenciesMeta": {
        "debug": {
          "optional": true
        }
      }
    },
    "node_modules/for-each": {
      "version": "0.3.5",
      "resolved": "https://registry.npmjs.org/for-each/-/for-each-0.3.5.tgz",
      "integrity": "sha512-dKx12eRCVIzqCxFGplyFKJMPvLEWgmNtUrpTiJIR5u97zEhRG8ySrtboPHZXx7daLxQVrl643cTzbab2tkQjxg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-callable": "^1.2.7"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/form-data": {
      "version": "4.0.6",
      "resolved": "https://registry.npmjs.org/form-data/-/form-data-4.0.6.tgz",
      "integrity": "sha512-vKatAh4SlVfgbv+YtmhiRjhEMJsYpsG1Y2rMQtR+SVSbytsSD1YGzDIcrAJmdFec88u/+VoGmxnl+80gL1tRCQ==",
      "license": "MIT",
      "dependencies": {
        "asynckit": "^0.4.0",
        "combined-stream": "^1.0.8",
        "es-set-tostringtag": "^2.1.0",
        "hasown": "^2.0.4",
        "mime-types": "^2.1.35"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/function-bind": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.2.tgz",
      "integrity": "sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/function.prototype.name": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/function.prototype.name/-/function.prototype.name-1.2.0.tgz",
      "integrity": "sha512-jObKIik1P2QjPHP5nz5BaOtUlfgS0fWo8IUByNXkM+o+02sJOi94em77GwJKQSJ3gfPHdgzLNrHc1uokV4P/ew==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.9",
        "call-bound": "^1.0.4",
        "es-define-property": "^1.0.1",
        "es-errors": "^1.3.0",
        "functions-have-names": "^1.2.3",
        "has-property-descriptors": "^1.0.2",
        "hasown": "^2.0.4",
        "is-callable": "^1.2.7",
        "is-document.all": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/functions-have-names": {
      "version": "1.2.3",
      "resolved": "https://registry.npmjs.org/functions-have-names/-/functions-have-names-1.2.3.tgz",
      "integrity": "sha512-xckBUXyTIqT97tq2x2AMb+g163b5JFysYk0x4qxNFwbfQkmNZoiRHb6sPzI9/QV33WeuvVYBUIiD4NzNIyqaRQ==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/generator-function": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/generator-function/-/generator-function-2.0.1.tgz",
      "integrity": "sha512-SFdFmIJi+ybC0vjlHN0ZGVGHc3lgE0DxPAT0djjVg+kjOnSqclqmj0KQ7ykTOLP6YxoqOvuAODGdcHJn+43q3g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/gensync": {
      "version": "1.0.0-beta.2",
      "resolved": "https://registry.npmjs.org/gensync/-/gensync-1.0.0-beta.2.tgz",
      "integrity": "sha512-3hN7NaskYvMDLQY55gnW3NQ+mesEAepTqlg+VEbj7zzqEMBVNhzcGYYeqFo/TlYz6eQiFcp1HcsCZO+nGgS8zg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/get-intrinsic": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/get-intrinsic/-/get-intrinsic-1.3.0.tgz",
      "integrity": "sha512-9fSjSaos/fRIVIp+xSJlE6lfwhES7LNtKaCBIamHsjr2na1BiABJPo0mOjjz8GJDURarmCPGqaiVg5mfjb98CQ==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "es-define-property": "^1.0.1",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.1",
        "function-bind": "^1.1.2",
        "get-proto": "^1.0.1",
        "gopd": "^1.2.0",
        "has-symbols": "^1.1.0",
        "hasown": "^2.0.2",
        "math-intrinsics": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/get-proto/-/get-proto-1.0.1.tgz",
      "integrity": "sha512-sTSfBjoXBp89JvIKIefqw7U2CCebsc74kiY6awiGogKtoSGbgjYE/G/+l9sF3MWFPNc9IcoOC4ODfKHfxFmp0g==",
      "license": "MIT",
      "dependencies": {
        "dunder-proto": "^1.0.1",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/get-symbol-description": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/get-symbol-description/-/get-symbol-description-1.1.0.tgz",
      "integrity": "sha512-w9UMqWwJxHNOvoNzSJ2oPF5wvYcvP7jUvYzhp67yEhTi17ZDBBC1z9pTdGuzjD+EFIqLSYRweZjqfiPzQ06Ebg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.6"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-tsconfig": {
      "version": "4.14.3",
      "resolved": "https://registry.npmjs.org/get-tsconfig/-/get-tsconfig-4.14.3.tgz",
      "integrity": "sha512-++QEw4DIY7WGoukz+/+A/8dGYPT9l9yIadnmSgZ8Rjr3YVSVDipQSO9CdnJo9ePqFqUUqh+wk9uIaoiAwsiPkA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "resolve-pkg-maps": "^1.0.0"
      },
      "funding": {
        "url": "https://github.com/privatenumber/get-tsconfig?sponsor=1"
      }
    },
    "node_modules/glob-parent": {
      "version": "6.0.2",
      "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-6.0.2.tgz",
      "integrity": "sha512-XxwI8EOhVQgWp6iDL+3b0r86f4d6AX6zSU55HfB4ydCEuXLXc5FcYeOu+nnGftS4TEju/11rt4KJPTMgbfmv4A==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "is-glob": "^4.0.3"
      },
      "engines": {
        "node": ">=10.13.0"
      }
    },
    "node_modules/globals": {
      "version": "14.0.0",
      "resolved": "https://registry.npmjs.org/globals/-/globals-14.0.0.tgz",
      "integrity": "sha512-oahGvuMGQlPw/ivIYBjVSrWAfWLBeku5tpPE2fOPLi+WHffIWbuh2tCjhyQhTBPMf5E9jDEH4FOmTYgYwbKwtQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/globalthis": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/globalthis/-/globalthis-1.0.4.tgz",
      "integrity": "sha512-DpLKbNU4WylpxJykQujfCcwYWiV/Jhm50Goo0wrVILAv5jOr9d+H+UR3PhSCD2rCCEIg0uc+G+muBTwD54JhDQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "define-properties": "^1.2.1",
        "gopd": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/gopd": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/gopd/-/gopd-1.2.0.tgz",
      "integrity": "sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/graceful-fs": {
      "version": "4.2.11",
      "resolved": "https://registry.npmjs.org/graceful-fs/-/graceful-fs-4.2.11.tgz",
      "integrity": "sha512-RbJ5/jmFcNNCcDV5o9eTnBLJ/HszWV0P73bc+Ff4nS/rJj+YaS6IGyiOL0VoBYX+l1Wrl3k63h/KrH+nhJ0XvQ==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/has-bigints": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/has-bigints/-/has-bigints-1.1.0.tgz",
      "integrity": "sha512-R3pbpkcIqv2Pm3dUwgjclDRVmWpTJW2DcMzcIhEXEx1oh/CEMObMm3KLmRJOdvhM7o4uQBnwr8pzRK2sJWIqfg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-flag": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/has-flag/-/has-flag-4.0.0.tgz",
      "integrity": "sha512-EykJT/Q1KjTWctppgIAgfSO0tKVuZUjhgMr17kqTumMl6Afv3EISleU7qZUzoXDFTAHTDC4NOoG/ZxU3EvlMPQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/has-property-descriptors": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/has-property-descriptors/-/has-property-descriptors-1.0.2.tgz",
      "integrity": "sha512-55JNKuIW+vq4Ke1BjOTjM2YctQIvCT7GFzHwmfZPGo5wnrgkid0YQtnAleFSqumZm4az3n2BS+erby5ipJdgrg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-define-property": "^1.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-proto": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/has-proto/-/has-proto-1.2.0.tgz",
      "integrity": "sha512-KIL7eQPfHQRC8+XluaIw7BHUwwqL19bQn4hzNgdr+1wXoU0KKj6rufu47lhY7KbJR2C6T6+PfyN0Ea7wkSS+qQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "dunder-proto": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-symbols": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/has-symbols/-/has-symbols-1.1.0.tgz",
      "integrity": "sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-tostringtag": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/has-tostringtag/-/has-tostringtag-1.0.2.tgz",
      "integrity": "sha512-NqADB8VjPFLM2V0VvHUewwwsw0ZWBaIdgo+ieHtK3hasLz4qeCRjYcqfB6AQrBggRKppKF8L52/VqdVsO47Dlw==",
      "license": "MIT",
      "dependencies": {
        "has-symbols": "^1.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/hasown": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/hasown/-/hasown-2.0.4.tgz",
      "integrity": "sha512-T2UbfbBEF32wiepXIsMlTW9+dDYC6wMh/t/vYA4tuOMKqWz/n3vr1NFSxQiyP+zk2mXsoMA/i/7qV6LKut1t1A==",
      "license": "MIT",
      "dependencies": {
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/hermes-estree": {
      "version": "0.25.1",
      "resolved": "https://registry.npmjs.org/hermes-estree/-/hermes-estree-0.25.1.tgz",
      "integrity": "sha512-0wUoCcLp+5Ev5pDW2OriHC2MJCbwLwuRx+gAqMTOkGKJJiBCLjtrvy4PWUGn6MIVefecRpzoOZ/UV6iGdOr+Cw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/hermes-parser": {
      "version": "0.25.1",
      "resolved": "https://registry.npmjs.org/hermes-parser/-/hermes-parser-0.25.1.tgz",
      "integrity": "sha512-6pEjquH3rqaI6cYAXYPcz9MS4rY6R4ngRgrgfDshRptUZIc3lw0MCIJIGDj9++mfySOuPTHB4nrSW99BCvOPIA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "hermes-estree": "0.25.1"
      }
    },
    "node_modules/https-proxy-agent": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/https-proxy-agent/-/https-proxy-agent-5.0.1.tgz",
      "integrity": "sha512-dFcAjpTQFgoLMzC2VwU+C/CbS7uRL0lWmxDITmqm7C+7F0Odmj6s9l6alZc6AELXhrnggM2CeWSXHGOdX2YtwA==",
      "license": "MIT",
      "dependencies": {
        "agent-base": "6",
        "debug": "4"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/ignore": {
      "version": "5.3.2",
      "resolved": "https://registry.npmjs.org/ignore/-/ignore-5.3.2.tgz",
      "integrity": "sha512-hsBTNUqQTDwkWtcdYI2i06Y/nUBEsNEDJKjWdigLvegy8kDuJAS8uRlpkkcQpyEXL0Z/pjDy5HBmMjRCJ2gq+g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 4"
      }
    },
    "node_modules/import-fresh": {
      "version": "3.3.1",
      "resolved": "https://registry.npmjs.org/import-fresh/-/import-fresh-3.3.1.tgz",
      "integrity": "sha512-TR3KfrTZTYLPB6jUjfx6MF9WcWrHL9su5TObK4ZkYgBdWKPOFoSoQIdEuTuR82pmtxH2spWG9h6etwfr1pLBqQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "parent-module": "^1.0.0",
        "resolve-from": "^4.0.0"
      },
      "engines": {
        "node": ">=6"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/imurmurhash": {
      "version": "0.1.4",
      "resolved": "https://registry.npmjs.org/imurmurhash/-/imurmurhash-0.1.4.tgz",
      "integrity": "sha512-JmXMZ6wuvDmLiHEml9ykzqO6lwFbof0GG4IkcGaENdCRDDmMVnny7s5HsIgHCbaq0w2MyPhDqkhTUgS2LU2PHA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.8.19"
      }
    },
    "node_modules/internal-slot": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/internal-slot/-/internal-slot-1.1.0.tgz",
      "integrity": "sha512-4gd7VpWNQNB4UKKCFFVcp1AVv+FMOgs9NKzjHKusc8jTMhd5eL1NqQqOpE0KzMds804/yHlglp3uxgluOqAPLw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "hasown": "^2.0.2",
        "side-channel": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/is-array-buffer": {
      "version": "3.0.5",
      "resolved": "https://registry.npmjs.org/is-array-buffer/-/is-array-buffer-3.0.5.tgz",
      "integrity": "sha512-DDfANUiiG2wC1qawP66qlTugJeL5HyzMpfr8lLK+jMQirGzNod0B12cFB/9q838Ru27sBwfw78/rdoU7RERz6A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.3",
        "get-intrinsic": "^1.2.6"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-async-function": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/is-async-function/-/is-async-function-2.1.1.tgz",
      "integrity": "sha512-9dgM/cZBnNvjzaMYHVoxxfPj2QXt22Ev7SuuPrs+xav0ukGB0S6d4ydZdEiM48kLx5kDV+QBPrpVnFyefL8kkQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "async-function": "^1.0.0",
        "call-bound": "^1.0.3",
        "get-proto": "^1.0.1",
        "has-tostringtag": "^1.0.2",
        "safe-regex-test": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-bigint": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/is-bigint/-/is-bigint-1.1.0.tgz",
      "integrity": "sha512-n4ZT37wG78iz03xPRKJrHTdZbe3IicyucEtdRsV5yglwc3GyUfbAfpSeD0FJ41NbUNSt5wbhqfp1fS+BgnvDFQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "has-bigints": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-boolean-object": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/is-boolean-object/-/is-boolean-object-1.2.2.tgz",
      "integrity": "sha512-wa56o2/ElJMYqjCjGkXri7it5FbebW5usLw/nPmCMs5DeZ7eziSYZhSmPRn0txqeW4LnAmQQU7FgqLpsEFKM4A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "has-tostringtag": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-bun-module": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/is-bun-module/-/is-bun-module-2.0.0.tgz",
      "integrity": "sha512-gNCGbnnnnFAUGKeZ9PdbyeGYJqewpmc2aKHUEMO5nQPWU9lOmv7jcmQIv+qHD8fXW6W7qfuCwX4rY9LNRjXrkQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "semver": "^7.7.1"
      }
    },
    "node_modules/is-bun-module/node_modules/semver": {
      "version": "7.8.5",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.8.5.tgz",
      "integrity": "sha512-Y7/KDsb8LjooZpwaqGyulO6DQlksgCncchHGk+sZIY4SBvUocMBEFH5Ur1fI4dV+Jvl0w6cjvucaIi40puRioA==",
      "dev": true,
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/is-callable": {
      "version": "1.2.7",
      "resolved": "https://registry.npmjs.org/is-callable/-/is-callable-1.2.7.tgz",
      "integrity": "sha512-1BC0BVFhS/p0qtw6enp8e+8OD0UrK0oFLztSjNzhcKA3WDuJxxAPXzPuPtKkjEY9UUoEWlX/8fgKeu2S8i9JTA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-core-module": {
      "version": "2.17.0",
      "resolved": "https://registry.npmjs.org/is-core-module/-/is-core-module-2.17.0.tgz",
      "integrity": "sha512-J/vG0zBCbIKOQFfufSwyXdMrsohyJIUNkrnmo6WZGzoM7tr/lsbfW5b2BvisL6zsyMzK9UxV9L6c7AoFbyXHOA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "hasown": "^2.0.4"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-data-view": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/is-data-view/-/is-data-view-1.0.2.tgz",
      "integrity": "sha512-RKtWF8pGmS87i2D6gqQu/l7EYRlVdfzemCJN/P3UOs//x1QE7mfhvzHIApBTRf7axvT6DMGwSwBXYCT0nfB9xw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "get-intrinsic": "^1.2.6",
        "is-typed-array": "^1.1.13"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-date-object": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/is-date-object/-/is-date-object-1.1.0.tgz",
      "integrity": "sha512-PwwhEakHVKTdRNVOw+/Gyh0+MzlCl4R6qKvkhuvLtPMggI1WAHt9sOwZxQLSGpUaDnrdyDsomoRgNnCfKNSXXg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "has-tostringtag": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-document.all": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/is-document.all/-/is-document.all-1.0.0.tgz",
      "integrity": "sha512-+XSoyS05OdBbhFuELhgTCpFNHkpBOJqtsZfUFFpe5QTw+9Sjbh8zitxhQkYAo6wV7e1Vb8cAPvpCk9jGam/82g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.4"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-extglob": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/is-extglob/-/is-extglob-2.1.1.tgz",
      "integrity": "sha512-SbKbANkN603Vi4jEZv49LeVJMn4yGwsbzZworEoyEiutsN3nJYdbO36zfhGJ6QEDpOZIFkDtnq5JRxmvl3jsoQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-finalizationregistry": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/is-finalizationregistry/-/is-finalizationregistry-1.1.1.tgz",
      "integrity": "sha512-1pC6N8qWJbWoPtEjgcL2xyhQOP491EQjeUo3qTKcmV8YSDDJrOepfG8pcC7h/QgnQHYSv0mJ3Z/ZWxmatVrysg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-generator-function": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/is-generator-function/-/is-generator-function-1.1.2.tgz",
      "integrity": "sha512-upqt1SkGkODW9tsGNG5mtXTXtECizwtS2kA161M+gJPc1xdb/Ax629af6YrTwcOeQHbewrPNlE5Dx7kzvXTizA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.4",
        "generator-function": "^2.0.0",
        "get-proto": "^1.0.1",
        "has-tostringtag": "^1.0.2",
        "safe-regex-test": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-glob": {
      "version": "4.0.3",
      "resolved": "https://registry.npmjs.org/is-glob/-/is-glob-4.0.3.tgz",
      "integrity": "sha512-xelSayHH36ZgE7ZWhli7pW34hNbNl8Ojv5KVmkJD4hBdD3th8Tfk9vYasLM+mXWOZhFkgZfxhLSnrwRr4elSSg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-extglob": "^2.1.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-map": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/is-map/-/is-map-2.0.3.tgz",
      "integrity": "sha512-1Qed0/Hr2m+YqxnM09CjA2d/i6YZNfF6R2oRAOj36eUdS6qIV/huPJNSEpKbupewFs+ZsJlxsjjPbc0/afW6Lw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-negative-zero": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/is-negative-zero/-/is-negative-zero-2.0.3.tgz",
      "integrity": "sha512-5KoIu2Ngpyek75jXodFvnafB6DJgr3u8uuK0LEZJjrU19DrMD3EVERaR8sjz8CCGgpZvxPl9SuE1GMVPFHx1mw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-number": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/is-number/-/is-number-7.0.0.tgz",
      "integrity": "sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.12.0"
      }
    },
    "node_modules/is-number-object": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/is-number-object/-/is-number-object-1.1.1.tgz",
      "integrity": "sha512-lZhclumE1G6VYD8VHe35wFaIif+CTy5SJIi5+3y4psDgWu4wPDoBhF8NxUOinEc7pHgiTsT6MaBb92rKhhD+Xw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "has-tostringtag": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-regex": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/is-regex/-/is-regex-1.2.1.tgz",
      "integrity": "sha512-MjYsKHO5O7mCsmRGxWcLWheFqN9DJ/2TmngvjKXihe6efViPqc274+Fx/4fYj/r03+ESvBdTXK0V6tA3rgez1g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "gopd": "^1.2.0",
        "has-tostringtag": "^1.0.2",
        "hasown": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-set": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/is-set/-/is-set-2.0.3.tgz",
      "integrity": "sha512-iPAjerrse27/ygGLxw+EBR9agv9Y6uLeYVJMu+QNCoouJ1/1ri0mGrcWpfCqFZuzzx3WjtwxG098X+n4OuRkPg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-shared-array-buffer": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/is-shared-array-buffer/-/is-shared-array-buffer-1.0.4.tgz",
      "integrity": "sha512-ISWac8drv4ZGfwKl5slpHG9OwPNty4jOWPRIhBpxOoD+hqITiwuipOQ2bNthAzwA3B4fIjO4Nln74N0S9byq8A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-string": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/is-string/-/is-string-1.1.1.tgz",
      "integrity": "sha512-BtEeSsoaQjlSPBemMQIrY1MY0uM6vnS1g5fmufYOtnxLGUZM2178PKbhsk7Ffv58IX+ZtcvoGwccYsh0PglkAA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "has-tostringtag": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-symbol": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/is-symbol/-/is-symbol-1.1.1.tgz",
      "integrity": "sha512-9gGx6GTtCQM73BgmHQXfDmLtfjjTUDSyoxTCbp5WtoixAhfgsDirWIcVQ/IHpvI5Vgd5i/J5F7B9cN/WlVbC/w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "has-symbols": "^1.1.0",
        "safe-regex-test": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-typed-array": {
      "version": "1.1.15",
      "resolved": "https://registry.npmjs.org/is-typed-array/-/is-typed-array-1.1.15.tgz",
      "integrity": "sha512-p3EcsicXjit7SaskXHs1hA91QxgTw46Fv6EFKKGS5DRFLD8yKnohjF3hxoju94b/OcMZoQukzpPpBE9uLVKzgQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "which-typed-array": "^1.1.16"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-weakmap": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/is-weakmap/-/is-weakmap-2.0.2.tgz",
      "integrity": "sha512-K5pXYOm9wqY1RgjpL3YTkF39tni1XajUIkawTLUo9EZEVUFga5gSQJF8nNS7ZwJQ02y+1YCNYcMh+HIf1ZqE+w==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-weakref": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/is-weakref/-/is-weakref-1.1.1.tgz",
      "integrity": "sha512-6i9mGWSlqzNMEqpCp93KwRS1uUOodk2OJ6b+sq7ZPDSy2WuI5NFIxp/254TytR8ftefexkWn5xNiHUNpPOfSew==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-weakset": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/is-weakset/-/is-weakset-2.0.4.tgz",
      "integrity": "sha512-mfcwb6IzQyOKTs84CQMrOwW4gQcaTOAWJ0zzJCl2WSPDrWk/OzDaImWFH3djXhb24g4eudZfLRozAvPGw4d9hQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "get-intrinsic": "^1.2.6"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/isarray": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/isarray/-/isarray-2.0.5.tgz",
      "integrity": "sha512-xHjhDr3cNBK0BzdUJSPXZntQUx/mwMS5Rw4A7lPJ90XGAO6ISP/ePDNuo0vhqOZU+UD5JoodwCAAoZQd3FeAKw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/isexe": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/isexe/-/isexe-2.0.0.tgz",
      "integrity": "sha512-RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/iterator.prototype": {
      "version": "1.1.5",
      "resolved": "https://registry.npmjs.org/iterator.prototype/-/iterator.prototype-1.1.5.tgz",
      "integrity": "sha512-H0dkQoCa3b2VEeKQBOxFph+JAbcrQdE7KC0UkqwpLmv2EC4P41QXP+rqo9wYodACiG5/WM5s9oDApTU8utwj9g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "define-data-property": "^1.1.4",
        "es-object-atoms": "^1.0.0",
        "get-intrinsic": "^1.2.6",
        "get-proto": "^1.0.0",
        "has-symbols": "^1.1.0",
        "set-function-name": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/jiti": {
      "version": "2.7.0",
      "resolved": "https://registry.npmjs.org/jiti/-/jiti-2.7.0.tgz",
      "integrity": "sha512-AC/7JofJvZGrrneWNaEnJeOLUx+JlGt7tNa0wZiRPT4MY1wmfKjt2+6O2p2uz2+skll8OZZmJMNqeke7kKbNgQ==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "jiti": "lib/jiti-cli.mjs"
      }
    },
    "node_modules/js-cookie": {
      "version": "3.0.8",
      "resolved": "https://registry.npmjs.org/js-cookie/-/js-cookie-3.0.8.tgz",
      "integrity": "sha512-yeJd4aNAdYZQjaon2bpD/Gb0B/omw7HQOsynXXcOiWVCacbBcPlgn8S/d1X6blFSaHao7ozqtW7NZW19xpCtIw==",
      "license": "MIT"
    },
    "node_modules/js-tokens": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/js-tokens/-/js-tokens-4.0.0.tgz",
      "integrity": "sha512-RdJUflcE3cUzKiMqQgsCu06FPu9UdIJO0beYbPhHN4k6apgJtifcoCtT9bcxOpYBtpD2kCM6Sbzg4CausW/PKQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/js-yaml": {
      "version": "4.3.2",
      "resolved": "https://registry.npmjs.org/js-yaml/-/js-yaml-4.3.2.tgz",
      "integrity": "sha512-SFNOvSJ+Dgf/9An904Yx+CgSlIPCkIpao4qo51lpee25TIRejdH3rhR4EZMGoNx3/TP3O+wzWuiTFl4sqbltzA==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/puzrin"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/nodeca"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "argparse": "^2.0.1"
      },
      "bin": {
        "js-yaml": "bin/js-yaml.js"
      }
    },
    "node_modules/jsesc": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/jsesc/-/jsesc-3.1.0.tgz",
      "integrity": "sha512-/sM3dO2FOzXjKQhJuo0Q173wf2KOo8t4I8vHy6lF9poUp7bKT0/NHE8fPX23PwfhnykfqnC2xRxOnVw5XuGIaA==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "jsesc": "bin/jsesc"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/json-buffer": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/json-buffer/-/json-buffer-3.0.1.tgz",
      "integrity": "sha512-4bV5BfR2mqfQTJm+V5tPPdf+ZpuhiIvTuAB5g8kcrXOZpTT/QwwVRWBywX1ozr6lEuPdbHxwaJlm9G6mI2sfSQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/json-schema-traverse": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/json-schema-traverse/-/json-schema-traverse-0.4.1.tgz",
      "integrity": "sha512-xbbCH5dCYU5T8LcEhhuh7HJ88HXuW3qsI3Y0zOZFKfZEHcpWiHU/Jxzk629Brsab/mMiHQti9wMP+845RPe3Vg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/json-stable-stringify-without-jsonify": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/json-stable-stringify-without-jsonify/-/json-stable-stringify-without-jsonify-1.0.1.tgz",
      "integrity": "sha512-Bdboy+l7tA3OGW6FjyFHWkP5LuByj1Tk33Ljyq0axyzdk9//JSi2u3fP1QSmd1KNwq6VOKYGlAu87CisVir6Pw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/json5": {
      "version": "2.2.3",
      "resolved": "https://registry.npmjs.org/json5/-/json5-2.2.3.tgz",
      "integrity": "sha512-XmOWe7eyHYH14cLdVPoyg+GOH3rYX++KpzrylJwSW98t3Nk+U8XOl8FWKOgwtzdb8lXGf6zYwDUzeHMWfxasyg==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "json5": "lib/cli.js"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/jsx-ast-utils": {
      "version": "3.3.5",
      "resolved": "https://registry.npmjs.org/jsx-ast-utils/-/jsx-ast-utils-3.3.5.tgz",
      "integrity": "sha512-ZZow9HBI5O6EPgSJLUb8n2NKgmVWTwCvHGwFuJlMjvLFqlGG6pjirPhtdsseaLZjSibD8eegzmYpUZwoIlj2cQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "array-includes": "^3.1.6",
        "array.prototype.flat": "^1.3.1",
        "object.assign": "^4.1.4",
        "object.values": "^1.1.6"
      },
      "engines": {
        "node": ">=4.0"
      }
    },
    "node_modules/keyv": {
      "version": "4.5.4",
      "resolved": "https://registry.npmjs.org/keyv/-/keyv-4.5.4.tgz",
      "integrity": "sha512-oxVHkHR/EJf2CNXnWxRLW6mg7JyCCUcG0DtEGmL2ctUo1PNTin1PUil+r/+4r5MpVgC/fn1kjsx7mjSujKqIpw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "json-buffer": "3.0.1"
      }
    },
    "node_modules/language-subtag-registry": {
      "version": "0.3.23",
      "resolved": "https://registry.npmjs.org/language-subtag-registry/-/language-subtag-registry-0.3.23.tgz",
      "integrity": "sha512-0K65Lea881pHotoGEa5gDlMxt3pctLi2RplBb7Ezh4rRdLEOtgi7n4EwK9lamnUCkKBqaeKRVebTq6BAxSkpXQ==",
      "dev": true,
      "license": "CC0-1.0"
    },
    "node_modules/language-tags": {
      "version": "1.0.9",
      "resolved": "https://registry.npmjs.org/language-tags/-/language-tags-1.0.9.tgz",
      "integrity": "sha512-MbjN408fEndfiQXbFQ1vnd+1NoLDsnQW41410oQBXiyXDMYH5z505juWa4KUE1LqxRC7DgOgZDbKLxHIwm27hA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "language-subtag-registry": "^0.3.20"
      },
      "engines": {
        "node": ">=0.10"
      }
    },
    "node_modules/levn": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/levn/-/levn-0.4.1.tgz",
      "integrity": "sha512-+bT2uH4E5LGE7h/n3evcS/sQlJXCpIp6ym8OWJ5eV6+67Dsql/LaaT7qJBAt2rzfoa/5QBGBhxDix1dMt2kQKQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "prelude-ls": "^1.2.1",
        "type-check": "~0.4.0"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/lightningcss": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss/-/lightningcss-1.32.0.tgz",
      "integrity": "sha512-NXYBzinNrblfraPGyrbPoD19C1h9lfI/1mzgWYvXUTe414Gz/X1FD2XBZSZM7rRTrMA8JL3OtAaGifrIKhQ5yQ==",
      "dev": true,
      "license": "MPL-2.0",
      "dependencies": {
        "detect-libc": "^2.0.3"
      },
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      },
      "optionalDependencies": {
        "lightningcss-android-arm64": "1.32.0",
        "lightningcss-darwin-arm64": "1.32.0",
        "lightningcss-darwin-x64": "1.32.0",
        "lightningcss-freebsd-x64": "1.32.0",
        "lightningcss-linux-arm-gnueabihf": "1.32.0",
        "lightningcss-linux-arm64-gnu": "1.32.0",
        "lightningcss-linux-arm64-musl": "1.32.0",
        "lightningcss-linux-x64-gnu": "1.32.0",
        "lightningcss-linux-x64-musl": "1.32.0",
        "lightningcss-win32-arm64-msvc": "1.32.0",
        "lightningcss-win32-x64-msvc": "1.32.0"
      }
    },
    "node_modules/lightningcss-android-arm64": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-android-arm64/-/lightningcss-android-arm64-1.32.0.tgz",
      "integrity": "sha512-YK7/ClTt4kAK0vo6w3X+Pnm0D2cf2vPHbhOXdoNti1Ga0al1P4TBZhwjATvjNwLEBCnKvjJc2jQgHXH0NEwlAg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-darwin-arm64": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-darwin-arm64/-/lightningcss-darwin-arm64-1.32.0.tgz",
      "integrity": "sha512-RzeG9Ju5bag2Bv1/lwlVJvBE3q6TtXskdZLLCyfg5pt+HLz9BqlICO7LZM7VHNTTn/5PRhHFBSjk5lc4cmscPQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-darwin-x64": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-darwin-x64/-/lightningcss-darwin-x64-1.32.0.tgz",
      "integrity": "sha512-U+QsBp2m/s2wqpUYT/6wnlagdZbtZdndSmut/NJqlCcMLTWp5muCrID+K5UJ6jqD2BFshejCYXniPDbNh73V8w==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-freebsd-x64": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-freebsd-x64/-/lightningcss-freebsd-x64-1.32.0.tgz",
      "integrity": "sha512-JCTigedEksZk3tHTTthnMdVfGf61Fky8Ji2E4YjUTEQX14xiy/lTzXnu1vwiZe3bYe0q+SpsSH/CTeDXK6WHig==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm-gnueabihf": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm-gnueabihf/-/lightningcss-linux-arm-gnueabihf-1.32.0.tgz",
      "integrity": "sha512-x6rnnpRa2GL0zQOkt6rts3YDPzduLpWvwAF6EMhXFVZXD4tPrBkEFqzGowzCsIWsPjqSK+tyNEODUBXeeVHSkw==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm64-gnu": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm64-gnu/-/lightningcss-linux-arm64-gnu-1.32.0.tgz",
      "integrity": "sha512-0nnMyoyOLRJXfbMOilaSRcLH3Jw5z9HDNGfT/gwCPgaDjnx0i8w7vBzFLFR1f6CMLKF8gVbebmkUN3fa/kQJpQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm64-musl": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm64-musl/-/lightningcss-linux-arm64-musl-1.32.0.tgz",
      "integrity": "sha512-UpQkoenr4UJEzgVIYpI80lDFvRmPVg6oqboNHfoH4CQIfNA+HOrZ7Mo7KZP02dC6LjghPQJeBsvXhJod/wnIBg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-x64-gnu": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-x64-gnu/-/lightningcss-linux-x64-gnu-1.32.0.tgz",
      "integrity": "sha512-V7Qr52IhZmdKPVr+Vtw8o+WLsQJYCTd8loIfpDaMRWGUZfBOYEJeyJIkqGIDMZPwPx24pUMfwSxxI8phr/MbOA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-x64-musl": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-x64-musl/-/lightningcss-linux-x64-musl-1.32.0.tgz",
      "integrity": "sha512-bYcLp+Vb0awsiXg/80uCRezCYHNg1/l3mt0gzHnWV9XP1W5sKa5/TCdGWaR/zBM2PeF/HbsQv/j2URNOiVuxWg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-win32-arm64-msvc": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-win32-arm64-msvc/-/lightningcss-win32-arm64-msvc-1.32.0.tgz",
      "integrity": "sha512-8SbC8BR40pS6baCM8sbtYDSwEVQd4JlFTOlaD3gWGHfThTcABnNDBda6eTZeqbofalIJhFx0qKzgHJmcPTnGdw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-win32-x64-msvc": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-win32-x64-msvc/-/lightningcss-win32-x64-msvc-1.32.0.tgz",
      "integrity": "sha512-Amq9B/SoZYdDi1kFrojnoqPLxYhQ4Wo5XiL8EVJrVsB8ARoC1PWW6VGtT0WKCemjy8aC+louJnjS7U18x3b06Q==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/locate-path": {
      "version": "6.0.0",
      "resolved": "https://registry.npmjs.org/locate-path/-/locate-path-6.0.0.tgz",
      "integrity": "sha512-iPZK6eYjbxRu3uB4/WZ3EsEIMJFMqAoopl3R+zuq0UjcAm/MO6KCweDgPfP3elTztoKP3KtnVHxTn2NHBSDVUw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "p-locate": "^5.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/lodash.merge": {
      "version": "4.6.2",
      "resolved": "https://registry.npmjs.org/lodash.merge/-/lodash.merge-4.6.2.tgz",
      "integrity": "sha512-0KpjqXRVvrYyCsX1swR/XTK0va6VQkQM6MNo7PqW77ByjAhoARA8EfrP1N4+KlKj8YS0ZUCtRT/YUuhyYDujIQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/loose-envify": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/loose-envify/-/loose-envify-1.4.0.tgz",
      "integrity": "sha512-lyuxPGr/Wfhrlem2CL/UcnUc1zcqKAImBDzukY7Y5F/yQiNdko6+fRLevlw1HgMySw7f611UIY408EtxRSoK3Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "js-tokens": "^3.0.0 || ^4.0.0"
      },
      "bin": {
        "loose-envify": "cli.js"
      }
    },
    "node_modules/lru-cache": {
      "version": "5.1.1",
      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-5.1.1.tgz",
      "integrity": "sha512-KpNARQA3Iwv+jTA0utUVVbrh+Jlrr1Fv0e56GGzAFOXN7dk/FviaDW8LHmK52DlcH4WP2n6gI8vN1aesBFgo9w==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "yallist": "^3.0.2"
      }
    },
    "node_modules/lucide-react": {
      "version": "1.49.0",
      "resolved": "https://registry.npmjs.org/lucide-react/-/lucide-react-1.49.0.tgz",
      "integrity": "sha512-ApfaNM4/7jBrVopqLJ84Jz8TMQ1Q1JeZ1PmKh25aeS3E1FTVcMkSh1bEQB7dfzdIrwXRP8p3z4AJjTIHHb5IIA==",
      "license": "ISC",
      "peerDependencies": {
        "@types/react": "*",
        "react": "^16.5.1 || ^17.0.0 || ^18.0.0 || ^19.0.0"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/magic-string": {
      "version": "0.30.21",
      "resolved": "https://registry.npmjs.org/magic-string/-/magic-string-0.30.21.tgz",
      "integrity": "sha512-vd2F4YUyEXKGcLHoq+TEyCjxueSeHnFxyyjNp80yg0XV4vUhnDer/lvvlqM/arB5bXQN5K2/3oinyCRyx8T2CQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/sourcemap-codec": "^1.5.5"
      }
    },
    "node_modules/math-intrinsics": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/math-intrinsics/-/math-intrinsics-1.1.0.tgz",
      "integrity": "sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/merge2": {
      "version": "1.4.1",
      "resolved": "https://registry.npmjs.org/merge2/-/merge2-1.4.1.tgz",
      "integrity": "sha512-8q7VEgMJW4J8tcfVPy8g09NcQwZdbwFEqhe/WZkoIzjn/3TGDwtOCYtXGxA3O8tPzpczCCDgv+P2P5y00ZJOOg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/micromatch": {
      "version": "4.0.8",
      "resolved": "https://registry.npmjs.org/micromatch/-/micromatch-4.0.8.tgz",
      "integrity": "sha512-PXwfBhYu0hBCPw8Dn0E+WDYb7af3dSLVWKi3HGv84IdF4TyFoC0ysxFd0Goxw7nSv4T/PzEJQxsYsEiFCKo2BA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "braces": "^3.0.3",
        "picomatch": "^2.3.1"
      },
      "engines": {
        "node": ">=8.6"
      }
    },
    "node_modules/mime-db": {
      "version": "1.52.0",
      "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.52.0.tgz",
      "integrity": "sha512-sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/mime-types": {
      "version": "2.1.35",
      "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-2.1.35.tgz",
      "integrity": "sha512-ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw==",
      "license": "MIT",
      "dependencies": {
        "mime-db": "1.52.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/minimatch": {
      "version": "3.1.5",
      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-3.1.5.tgz",
      "integrity": "sha512-VgjWUsnnT6n+NUk6eZq77zeFdpW2LWDzP6zFGrCbHXiYNul5Dzqk2HHQ5uFH2DNW5Xbp8+jVzaeNt94ssEEl4w==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "brace-expansion": "^1.1.7"
      },
      "engines": {
        "node": "*"
      }
    },
    "node_modules/minimist": {
      "version": "1.2.8",
      "resolved": "https://registry.npmjs.org/minimist/-/minimist-1.2.8.tgz",
      "integrity": "sha512-2yyAR8qBkN3YuheJanUpWC5U3bb5osDywNB8RzDVlDwDHbocAJveqqj1u8+SVD7jkWT4yvsHCpWqqWqAxb0zCA==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "license": "MIT"
    },
    "node_modules/nanoid": {
      "version": "3.3.19",
      "resolved": "https://registry.npmjs.org/nanoid/-/nanoid-3.3.19.tgz",
      "integrity": "sha512-Y2tUNy4ouw6tq5oDSKeQYGOyhkUBhNOcGV/02KC+6kd9eDGqdZd++mjMiIDilrBYvjEnCYvVtsuHCuP+okSfug==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "bin": {
        "nanoid": "bin/nanoid.cjs"
      },
      "engines": {
        "node": "^10 || ^12 || ^13.7 || ^14 || >=15.0.1"
      }
    },
    "node_modules/napi-postinstall": {
      "version": "0.3.4",
      "resolved": "https://registry.npmjs.org/napi-postinstall/-/napi-postinstall-0.3.4.tgz",
      "integrity": "sha512-PHI5f1O0EP5xJ9gQmFGMS6IZcrVvTjpXjz7Na41gTE7eE2hK11lg04CECCYEEjdc17EV4DO+fkGEtt7TpTaTiQ==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "napi-postinstall": "lib/cli.js"
      },
      "engines": {
        "node": "^12.20.0 || ^14.18.0 || >=16.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/napi-postinstall"
      }
    },
    "node_modules/natural-compare": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/natural-compare/-/natural-compare-1.4.0.tgz",
      "integrity": "sha512-OWND8ei3VtNC9h7V60qff3SVobHr996CTwgxubgyQYEpg290h9J0buyECNNJexkFm5sOajh5G116RYA1c8ZMSw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/next": {
      "version": "16.3.6",
      "resolved": "https://registry.npmjs.org/next/-/next-16.3.6.tgz",
      "integrity": "sha512-L+otWM/aQbYTx98aZhgEoMb4bZAXx1YVW4UMA/vuCyCoWG5HJyZUili8QAkqzrcC+5///tsz3s0M+SlyB5bLMw==",
      "license": "MIT",
      "dependencies": {
        "@next/env": "16.3.6",
        "@swc/helpers": "0.5.23",
        "baseline-browser-mapping": "^2.9.19",
        "caniuse-lite": "^1.0.30001579",
        "postcss": "8.5.23",
        "styled-jsx": "5.1.6"
      },
      "bin": {
        "next": "dist/bin/next"
      },
      "engines": {
        "node": ">=20.9.0"
      },
      "optionalDependencies": {
        "@next/swc-darwin-arm64": "16.3.6",
        "@next/swc-darwin-x64": "16.3.6",
        "@next/swc-linux-arm64-gnu": "16.3.6",
        "@next/swc-linux-arm64-musl": "16.3.6",
        "@next/swc-linux-x64-gnu": "16.3.6",
        "@next/swc-linux-x64-musl": "16.3.6",
        "@next/swc-win32-arm64-msvc": "16.3.6",
        "@next/swc-win32-x64-msvc": "16.3.6",
        "sharp": "^0.35.4"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.1.0",
        "@playwright/test": "^1.51.1",
        "babel-plugin-react-compiler": "*",
        "react": "^18.2.0 || 19.0.0-rc-de68d2f4-20241204 || ^19.0.0",
        "react-dom": "^18.2.0 || 19.0.0-rc-de68d2f4-20241204 || ^19.0.0",
        "sass": "^1.3.0"
      },
      "peerDependenciesMeta": {
        "@opentelemetry/api": {
          "optional": true
        },
        "@playwright/test": {
          "optional": true
        },
        "babel-plugin-react-compiler": {
          "optional": true
        },
        "sass": {
          "optional": true
        }
      }
    },
    "node_modules/next/node_modules/postcss": {
      "version": "8.5.23",
      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.23.tgz",
      "integrity": "sha512-g50586zr4bZmwFiTlflMu8E0bDTb5I5gertgwAKmsdUlTQIhZtunzUlD1WSzwcVWPoAVpsrA6vlfCD7oXvRwgg==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "nanoid": "^3.3.16",
        "picocolors": "^1.1.1",
        "source-map-js": "^1.2.1"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/node-exports-info": {
      "version": "1.6.2",
      "resolved": "https://registry.npmjs.org/node-exports-info/-/node-exports-info-1.6.2.tgz",
      "integrity": "sha512-kXs9Go0cah0qHVV2v389IXQLdLCeE1xfFtjOAF+iobu0OIoG1pje8At2vMHyaPMiPMnG/LWP50twML21eMcAag==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "array.prototype.flatmap": "^1.3.3",
        "es-errors": "^1.3.0",
        "object.entries": "^1.1.9",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/node-releases": {
      "version": "2.0.57",
      "resolved": "https://registry.npmjs.org/node-releases/-/node-releases-2.0.57.tgz",
      "integrity": "sha512-kQK9LGGFiHtrWiNhZtA7Qbw17AQz+dmsEKODRIVTXA9+e5MS/2gZEBhYJt13GrAz5/IOZKddH/0Z3TP/Zgo+yw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/object-assign": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/object-assign/-/object-assign-4.1.1.tgz",
      "integrity": "sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/object-inspect": {
      "version": "1.13.4",
      "resolved": "https://registry.npmjs.org/object-inspect/-/object-inspect-1.13.4.tgz",
      "integrity": "sha512-W67iLl4J2EXEGTbfeHCffrjDfitvLANg0UlX3wFUUSTx92KXRFegMHUVgSqE+wvhAbi4WqjGg9czysTV2Epbew==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/object-keys": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/object-keys/-/object-keys-1.1.1.tgz",
      "integrity": "sha512-NuAESUOUMrlIXOfHKzD6bpPu3tYt3xvjNdRIQ+FeT0lNb4K8WR70CaDxhuNguS2XG+GjkyMwOzsN5ZktImfhLA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/object.assign": {
      "version": "4.1.7",
      "resolved": "https://registry.npmjs.org/object.assign/-/object.assign-4.1.7.tgz",
      "integrity": "sha512-nK28WOo+QIjBkDduTINE4JkF/UJJKyf2EJxvJKfblDpyg0Q+pkOHNTL0Qwy6NP6FhE/EnzV73BxxqcJaXY9anw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.3",
        "define-properties": "^1.2.1",
        "es-object-atoms": "^1.0.0",
        "has-symbols": "^1.1.0",
        "object-keys": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/object.entries": {
      "version": "1.1.9",
      "resolved": "https://registry.npmjs.org/object.entries/-/object.entries-1.1.9.tgz",
      "integrity": "sha512-8u/hfXFRBD1O0hPUjioLhoWFHRmt6tKA4/vZPyckBr18l1KE9uHrFaFaUi8MDRTpi4uak2goyPTSNJLXX2k2Hw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.4",
        "define-properties": "^1.2.1",
        "es-object-atoms": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/object.fromentries": {
      "version": "2.0.8",
      "resolved": "https://registry.npmjs.org/object.fromentries/-/object.fromentries-2.0.8.tgz",
      "integrity": "sha512-k6E21FzySsSK5a21KRADBd/NGneRegFO5pLHfdQLpRDETUNJueLXs3WCzyQ3tFRDYgbq3KHGXfTbi2bs8WQ6rQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.7",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.2",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/object.groupby": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/object.groupby/-/object.groupby-1.0.3.tgz",
      "integrity": "sha512-+Lhy3TQTuzXI5hevh8sBGqbmurHbbIjAi0Z4S63nthVLmLxfbj4T54a4CfZrXIrt9iP4mVAPYMo/v99taj3wjQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.7",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/object.values": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/object.values/-/object.values-1.2.1.tgz",
      "integrity": "sha512-gXah6aZrcUxjWg2zR2MwouP2eHlCBzdV4pygudehaKXSGW4v2AsRQUK+lwwXhii6KFZcunEnmSUoYp5CXibxtA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.3",
        "define-properties": "^1.2.1",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/optionator": {
      "version": "0.9.4",
      "resolved": "https://registry.npmjs.org/optionator/-/optionator-0.9.4.tgz",
      "integrity": "sha512-6IpQ7mKUxRcZNLIObR0hz7lxsapSSIYNZJwXPGeF0mTVqGKFIXj1DQcMoT22S3ROcLyY/rz0PWaWZ9ayWmad9g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "deep-is": "^0.1.3",
        "fast-levenshtein": "^2.0.6",
        "levn": "^0.4.1",
        "prelude-ls": "^1.2.1",
        "type-check": "^0.4.0",
        "word-wrap": "^1.2.5"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/own-keys": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/own-keys/-/own-keys-1.0.2.tgz",
      "integrity": "sha512-19YVAg7T+WTrxggPukVq7DjTv6+PJ867TmhCvBsYwmbFCsZd344rq2Ld1p0wo8f8Qrrhgp82c6FJRqdXWtSEhg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.4",
        "get-intrinsic": "^1.3.0",
        "object-keys": "^1.1.1",
        "safe-push-apply": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/p-limit": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/p-limit/-/p-limit-3.1.0.tgz",
      "integrity": "sha512-TYOanM3wGwNGsZN2cVTYPArw454xnXj5qmWF1bEoAc4+cU/ol7GVh7odevjp1FNHduHc3KZMcFduxU5Xc6uJRQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "yocto-queue": "^0.1.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/p-locate": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/p-locate/-/p-locate-5.0.0.tgz",
      "integrity": "sha512-LaNjtRWUBY++zB5nE/NwcaoMylSPk+S+ZHNB1TzdbMJMny6dynpAGt7X/tl/QYq3TIeE6nxHppbo2LGymrG5Pw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "p-limit": "^3.0.2"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/parent-module": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/parent-module/-/parent-module-1.0.1.tgz",
      "integrity": "sha512-GQ2EWRpQV8/o+Aw8YqtfZZPfNRWZYkbidE9k5rpl/hC3vtHHBfGm2Ifi6qWV+coDGkrUKZAxE3Lot5kcsRlh+g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "callsites": "^3.0.0"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/path-exists": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/path-exists/-/path-exists-4.0.0.tgz",
      "integrity": "sha512-ak9Qy5Q7jYb2Wwcey5Fpvg2KoAc/ZIhLSLOSBmRmygPsGwkVVt0fZa0qrtMz+m6tJTAHfZQ8FnmB4MG4LWy7/w==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/path-key": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/path-key/-/path-key-3.1.1.tgz",
      "integrity": "sha512-ojmeN0qd+y0jszEtoY48r0Peq5dwMEkIlCOu6Q5f41lfkswXuKtYrhgoTpLnyIcHm24Uhqx+5Tqm2InSwLhE6Q==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/path-parse": {
      "version": "1.0.7",
      "resolved": "https://registry.npmjs.org/path-parse/-/path-parse-1.0.7.tgz",
      "integrity": "sha512-LDJzPVEEEPR+y48z93A0Ed0yXb8pAByGWo/k5YYdYgpY2/2EsOsksJrq7lOHxryrVOn1ejG6oAp8ahvOIQD8sw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/picocolors": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
      "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==",
      "license": "ISC"
    },
    "node_modules/picomatch": {
      "version": "2.3.2",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-2.3.2.tgz",
      "integrity": "sha512-V7+vQEJ06Z+c5tSye8S+nHUfI51xoXIXjHQ99cQtKUkQqqO1kO/KCJUfZXuB47h/YBlDhah2H3hdUGXn8ie0oA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/possible-typed-array-names": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/possible-typed-array-names/-/possible-typed-array-names-1.1.0.tgz",
      "integrity": "sha512-/+5VFTchJDoVj3bhoqi6UeymcD00DAwb1nJwamzPvHEszJ4FpF6SNNbUbOS8yI56qHzdV8eK0qEfOSiodkTdxg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/postcss": {
      "version": "8.5.28",
      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.28.tgz",
      "integrity": "sha512-RRuzqDtt5Y9h3quz5hWhK+TPnsmVs6WwSU6LkJMeY4HstUEDuYTG8UJSdawMRzmzAtV+KEoG8N3Qg2qLy5vM/A==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "nanoid": "^3.3.18",
        "picocolors": "^1.1.1",
        "source-map-js": "^1.2.1"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/prelude-ls": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/prelude-ls/-/prelude-ls-1.2.1.tgz",
      "integrity": "sha512-vkcDPrRZo1QZLbn5RLGPpg/WmIQ65qoWWhcGKf/b5eplkkarX0m9z8ppCat4mlOqUsWpyNuYgO3VRyrYHSzX5g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/prop-types": {
      "version": "15.8.1",
      "resolved": "https://registry.npmjs.org/prop-types/-/prop-types-15.8.1.tgz",
      "integrity": "sha512-oj87CgZICdulUohogVAR7AjlC0327U4el4L6eAvOqCeudMDVU0NThNaV+b9Df4dXgSP1gXMTnPdhfe/2qDH5cg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "loose-envify": "^1.4.0",
        "object-assign": "^4.1.1",
        "react-is": "^16.13.1"
      }
    },
    "node_modules/proxy-from-env": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/proxy-from-env/-/proxy-from-env-2.1.0.tgz",
      "integrity": "sha512-cJ+oHTW1VAEa8cJslgmUZrc+sjRKgAKl3Zyse6+PV38hZe/V6Z14TbCuXcan9F9ghlz4QrFr2c92TNF82UkYHA==",
      "license": "MIT",
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/punycode": {
      "version": "2.3.1",
      "resolved": "https://registry.npmjs.org/punycode/-/punycode-2.3.1.tgz",
      "integrity": "sha512-vYt7UD1U9Wg6138shLtLOvdAu+8DsC/ilFtEVHcH+wydcSpNE20AfSOduf6MkRFahL5FY7X1oU7nKVZFtfq8Fg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/queue-microtask": {
      "version": "1.2.3",
      "resolved": "https://registry.npmjs.org/queue-microtask/-/queue-microtask-1.2.3.tgz",
      "integrity": "sha512-NuaNSa6flKT5JaSYQzJok04JzTL1CA6aGhv5rfLW3PgqA+M2ChpZQnAC8h8i4ZFkBS8X5RqkDBHA7r4hej3K9A==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT"
    },
    "node_modules/react": {
      "version": "19.2.8",
      "resolved": "https://registry.npmjs.org/react/-/react-19.2.8.tgz",
      "integrity": "sha512-PWaYA1L/q9u2u7xYQi+Y3L3Yfnie7XyLeaJICV1MGD6LprsBxcAqGjYyr0eY3p+QdsA+x/Irkt4Qif8D63+Sbw==",
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/react-dom": {
      "version": "19.2.8",
      "resolved": "https://registry.npmjs.org/react-dom/-/react-dom-19.2.8.tgz",
      "integrity": "sha512-rVprimfGBG3DR+Tq0IQG2DT5PxKth1WIGDmj5yPmlzr4YBe7uyE+Du4oVqTDXZSHGGGXRtTJEGSSePyQCMBglQ==",
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "scheduler": "^0.27.0"
      },
      "peerDependencies": {
        "react": "^19.2.8"
      }
    },
    "node_modules/react-is": {
      "version": "16.13.1",
      "resolved": "https://registry.npmjs.org/react-is/-/react-is-16.13.1.tgz",
      "integrity": "sha512-24e6ynE2H+OKt4kqsOvNd8kBpV65zoxbA4BVsEOB3ARVWQki/DHzaUoC5KuON/BiccDaCCTZBuOcfZs70kR8bQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/reflect.getprototypeof": {
      "version": "1.0.10",
      "resolved": "https://registry.npmjs.org/reflect.getprototypeof/-/reflect.getprototypeof-1.0.10.tgz",
      "integrity": "sha512-00o4I+DVrefhv+nX0ulyi3biSHCPDe+yLv5o/p6d/UVlirijB8E16FtfwSAi4g3tcqrQ4lRAqQSoFEZJehYEcw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.9",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.0.0",
        "get-intrinsic": "^1.2.7",
        "get-proto": "^1.0.1",
        "which-builtin-type": "^1.2.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/regexp.prototype.flags": {
      "version": "1.5.4",
      "resolved": "https://registry.npmjs.org/regexp.prototype.flags/-/regexp.prototype.flags-1.5.4.tgz",
      "integrity": "sha512-dYqgNSZbDwkaJ2ceRd9ojCGjBq+mOm9LmtXnAnEGyHhN/5R7iDW2TRw3h+o/jCFxus3P2LfWIIiwowAjANm7IA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "define-properties": "^1.2.1",
        "es-errors": "^1.3.0",
        "get-proto": "^1.0.1",
        "gopd": "^1.2.0",
        "set-function-name": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/resolve": {
      "version": "2.0.0-next.7",
      "resolved": "https://registry.npmjs.org/resolve/-/resolve-2.0.0-next.7.tgz",
      "integrity": "sha512-tqt+NBWwyaMgw3zDsnygx4CByWjQEJHOPMdslYhppaQSJUtL/D4JO9CcBBlhPoI8lz9oJIDXkwXfhF4aWqP8xQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "is-core-module": "^2.16.2",
        "node-exports-info": "^1.6.0",
        "object-keys": "^1.1.1",
        "path-parse": "^1.0.7",
        "supports-preserve-symlinks-flag": "^1.0.0"
      },
      "bin": {
        "resolve": "bin/resolve"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/resolve-from": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/resolve-from/-/resolve-from-4.0.0.tgz",
      "integrity": "sha512-pb/MYmXstAkysRFx8piNI1tGFNQIFA3vkE3Gq4EuA1dF6gHp/+vgZqsCGJapvy8N3Q+4o7FwvquPJcnZ7RYy4g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/resolve-pkg-maps": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/resolve-pkg-maps/-/resolve-pkg-maps-1.0.0.tgz",
      "integrity": "sha512-seS2Tj26TBVOC2NIc2rOe2y2ZO7efxITtLZcGSOnHHNOQ7CkiUBfw0Iw2ck6xkIhPwLhKNLS8BO+hEpngQlqzw==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/privatenumber/resolve-pkg-maps?sponsor=1"
      }
    },
    "node_modules/reusify": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/reusify/-/reusify-1.1.0.tgz",
      "integrity": "sha512-g6QUff04oZpHs0eG5p83rFLhHeV00ug/Yf9nZM6fLeUrPguBTkTQOdpAWWspMh55TZfVQDPaN3NQJfbVRAxdIw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "iojs": ">=1.0.0",
        "node": ">=0.10.0"
      }
    },
    "node_modules/run-parallel": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/run-parallel/-/run-parallel-1.2.0.tgz",
      "integrity": "sha512-5l4VyZR86LZ/lDxZTR6jqL8AFE2S0IFLMP26AbjsLVADxHdhB/c0GUsH+y39UfCi3dzz8OlQuPmnaJOMoDHQBA==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "queue-microtask": "^1.2.2"
      }
    },
    "node_modules/safe-array-concat": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/safe-array-concat/-/safe-array-concat-1.1.4.tgz",
      "integrity": "sha512-wtZlHyOje6OZTGqAoaDKxFkgRtkF9CnHAVnCHKfuj200wAgL+bSJhdsCD2l0Qx/2ekEXjPWcyKkfGb5CPboslg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.9",
        "call-bound": "^1.0.4",
        "get-intrinsic": "^1.3.0",
        "has-symbols": "^1.1.0",
        "isarray": "^2.0.5"
      },
      "engines": {
        "node": ">=0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/safe-push-apply": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/safe-push-apply/-/safe-push-apply-1.0.0.tgz",
      "integrity": "sha512-iKE9w/Z7xCzUMIZqdBsp6pEQvwuEebH4vdpjcDWnyzaI6yl6O9FHvVpmGelvEHNsoY6wGblkxR6Zty/h00WiSA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "isarray": "^2.0.5"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/safe-regex-test": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/safe-regex-test/-/safe-regex-test-1.1.0.tgz",
      "integrity": "sha512-x/+Cz4YrimQxQccJf5mKEbIa1NzeCRNI5Ecl/ekmlYaampdNLPalVyIcCZNNH3MvmqBugV5TMYZXv0ljslUlaw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "is-regex": "^1.2.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/scheduler": {
      "version": "0.27.0",
      "resolved": "https://registry.npmjs.org/scheduler/-/scheduler-0.27.0.tgz",
      "integrity": "sha512-eNv+WrVbKu1f3vbYJT/xtiF5syA5HPIMtf9IgY/nKg0sWqzAUEvqY/xm7OcZc/qafLx/iO9FgOmeSAp4v5ti/Q==",
      "license": "MIT"
    },
    "node_modules/semver": {
      "version": "6.3.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
      "dev": true,
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      }
    },
    "node_modules/set-function-length": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/set-function-length/-/set-function-length-1.2.2.tgz",
      "integrity": "sha512-pgRc4hJ4/sNjWCSS9AmnS40x3bNMDTknHgL5UaMBTMyJnU90EgWh1Rz+MC9eFu4BuN/UwZjKQuY/1v3rM7HMfg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "define-data-property": "^1.1.4",
        "es-errors": "^1.3.0",
        "function-bind": "^1.1.2",
        "get-intrinsic": "^1.2.4",
        "gopd": "^1.0.1",
        "has-property-descriptors": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/set-function-name": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/set-function-name/-/set-function-name-2.0.2.tgz",
      "integrity": "sha512-7PGFlmtwsEADb0WYyvCMa1t+yke6daIG4Wirafur5kcf+MhUnPms1UeR0CKQdTZD81yESwMHbtn+TR+dMviakQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "define-data-property": "^1.1.4",
        "es-errors": "^1.3.0",
        "functions-have-names": "^1.2.3",
        "has-property-descriptors": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/set-proto": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/set-proto/-/set-proto-1.0.0.tgz",
      "integrity": "sha512-RJRdvCo6IAnPdsvP/7m6bsQqNnn1FCBX5ZNtFL98MmFF/4xAIJTIg1YbHW5DC2W5SKZanrC6i4HsJqlajw/dZw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "dunder-proto": "^1.0.1",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/sharp": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/sharp/-/sharp-0.35.4.tgz",
      "integrity": "sha512-n++8XWcj+jCOr2IOl7h8LbKnGBDY4aPbmprMONBNFdn0ImXqpGVv5zliDs0V9HbmbCQLpbuo2ej9rAoOQTvMDA==",
      "license": "Apache-2.0",
      "optional": true,
      "dependencies": {
        "@img/colour": "^1.1.0",
        "detect-libc": "^2.1.2",
        "semver": "^7.8.5"
      },
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-darwin-arm64": "0.35.4",
        "@img/sharp-darwin-x64": "0.35.4",
        "@img/sharp-freebsd-wasm32": "0.35.4",
        "@img/sharp-libvips-darwin-arm64": "1.3.3",
        "@img/sharp-libvips-darwin-x64": "1.3.3",
        "@img/sharp-libvips-linux-arm": "1.3.3",
        "@img/sharp-libvips-linux-arm64": "1.3.3",
        "@img/sharp-libvips-linux-ppc64": "1.3.3",
        "@img/sharp-libvips-linux-riscv64": "1.3.3",
        "@img/sharp-libvips-linux-s390x": "1.3.3",
        "@img/sharp-libvips-linux-x64": "1.3.3",
        "@img/sharp-libvips-linuxmusl-arm64": "1.3.3",
        "@img/sharp-libvips-linuxmusl-x64": "1.3.3",
        "@img/sharp-linux-arm": "0.35.4",
        "@img/sharp-linux-arm64": "0.35.4",
        "@img/sharp-linux-ppc64": "0.35.4",
        "@img/sharp-linux-riscv64": "0.35.4",
        "@img/sharp-linux-s390x": "0.35.4",
        "@img/sharp-linux-x64": "0.35.4",
        "@img/sharp-linuxmusl-arm64": "0.35.4",
        "@img/sharp-linuxmusl-x64": "0.35.4",
        "@img/sharp-webcontainers-wasm32": "0.35.4",
        "@img/sharp-win32-arm64": "0.35.4",
        "@img/sharp-win32-ia32": "0.35.4",
        "@img/sharp-win32-x64": "0.35.4"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/sharp/node_modules/semver": {
      "version": "7.8.5",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.8.5.tgz",
      "integrity": "sha512-Y7/KDsb8LjooZpwaqGyulO6DQlksgCncchHGk+sZIY4SBvUocMBEFH5Ur1fI4dV+Jvl0w6cjvucaIi40puRioA==",
      "license": "ISC",
      "optional": true,
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/shebang-command": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/shebang-command/-/shebang-command-2.0.0.tgz",
      "integrity": "sha512-kHxr2zZpYtdmrN1qDjrrX/Z1rR1kG8Dx+gkpK1G4eXmvXswmcE1hTWBWYUzlraYw1/yZp6YuDY77YtvbN0dmDA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "shebang-regex": "^3.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/shebang-regex": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/shebang-regex/-/shebang-regex-3.0.0.tgz",
      "integrity": "sha512-7++dFhtcx3353uBaq8DDR4NuxBetBzC7ZQOhmTQInHEd6bSrXdiEyzCvG07Z44UYdLShWUyXt5M/yhz8ekcb1A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/side-channel": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/side-channel/-/side-channel-1.1.1.tgz",
      "integrity": "sha512-6x6dK6zJdpTzF4sQeNYxwtvBzf6Eg4GtlesS94HOvTudUeyK2WXAaIfmDgsyslYrRBeFIlsi54AYsFGUuhmvrQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "object-inspect": "^1.13.4",
        "side-channel-list": "^1.0.1",
        "side-channel-map": "^1.0.1",
        "side-channel-weakmap": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-list": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/side-channel-list/-/side-channel-list-1.0.1.tgz",
      "integrity": "sha512-mjn/0bi/oUURjc5Xl7IaWi/OJJJumuoJFQJfDDyO46+hBWsfaVM65TBHq2eoZBhzl9EchxOijpkbRC8SVBQU0w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "object-inspect": "^1.13.4"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-map": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/side-channel-map/-/side-channel-map-1.0.1.tgz",
      "integrity": "sha512-VCjCNfgMsby3tTdo02nbjtM/ewra6jPHmpThenkTYh8pG9ucZ/1P8So4u4FGBek/BjpOVsDCMoLA/iuBKIFXRA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.5",
        "object-inspect": "^1.13.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-weakmap": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/side-channel-weakmap/-/side-channel-weakmap-1.0.2.tgz",
      "integrity": "sha512-WPS/HvHQTYnHisLo9McqBHOJk2FkHO/tlpvldyrnem4aeQp4hai3gythswg6p01oSoTl58rcpiFAjF2br2Ak2A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.5",
        "object-inspect": "^1.13.3",
        "side-channel-map": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/source-map-js": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.1.tgz",
      "integrity": "sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==",
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/stable-hash": {
      "version": "0.0.5",
      "resolved": "https://registry.npmjs.org/stable-hash/-/stable-hash-0.0.5.tgz",
      "integrity": "sha512-+L3ccpzibovGXFK+Ap/f8LOS0ahMrHTf3xu7mMLSpEGU0EO9ucaysSylKo9eRDFNhWve/y275iPmIZ4z39a9iA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/stop-iteration-iterator": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/stop-iteration-iterator/-/stop-iteration-iterator-1.1.0.tgz",
      "integrity": "sha512-eLoXW/DHyl62zxY4SCaIgnRhuMr6ri4juEYARS8E6sCEqzKpOiE521Ucofdx+KnDZl5xmvGYaaKCk5FEOxJCoQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "internal-slot": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/string.prototype.includes": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/string.prototype.includes/-/string.prototype.includes-2.0.1.tgz",
      "integrity": "sha512-o7+c9bW6zpAdJHTtujeePODAhkuicdAryFsfVKwA+wGw89wJ4GTY484WTucM9hLtDEOpOvI+aHnzqnC5lHp4Rg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.7",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.3"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/string.prototype.matchall": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/string.prototype.matchall/-/string.prototype.matchall-4.1.0.tgz",
      "integrity": "sha512-tHNHTxInrYLCga9O9YGxWA3G9/nnzQw8UGAyqGx3Ar1pSTTzIuM4woFSq4SowkXCjJIwq5sIiQvEfRI9tCH1qQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.9",
        "call-bound": "^1.0.4",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.24.2",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.2",
        "get-intrinsic": "^1.3.0",
        "gopd": "^1.2.0",
        "has-symbols": "^1.1.0",
        "internal-slot": "^1.1.0",
        "regexp.prototype.flags": "^1.5.4",
        "set-function-name": "^2.0.2",
        "side-channel": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/string.prototype.repeat": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/string.prototype.repeat/-/string.prototype.repeat-1.0.0.tgz",
      "integrity": "sha512-0u/TldDbKD8bFCQ/4f5+mNRrXwZ8hg2w7ZR8wa16e8z9XpePWl3eGEcUD0OXpEH/VJH/2G3gjUtR3ZOiBe2S/w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "define-properties": "^1.1.3",
        "es-abstract": "^1.17.5"
      }
    },
    "node_modules/string.prototype.trim": {
      "version": "1.2.11",
      "resolved": "https://registry.npmjs.org/string.prototype.trim/-/string.prototype.trim-1.2.11.tgz",
      "integrity": "sha512-PwvK7BU+CMTJGYQCTZb5RWXIML92lftJLhQz1tBzgKiqGxJaMlBAa48POXaNAC2s4y8jr3EFqrkF9+44neS46w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.9",
        "call-bound": "^1.0.4",
        "define-data-property": "^1.1.4",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.24.2",
        "es-object-atoms": "^1.1.2",
        "has-property-descriptors": "^1.0.2",
        "safe-regex-test": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/string.prototype.trimend": {
      "version": "1.0.10",
      "resolved": "https://registry.npmjs.org/string.prototype.trimend/-/string.prototype.trimend-1.0.10.tgz",
      "integrity": "sha512-2+3aDAOmPTmuFwjDnmJG2ctEkQKVki7vOSqaxkv42Mowj1V6PnvuwFCRrR5lChUux1TBskPjfkeTOhqczDMxTw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.9",
        "call-bound": "^1.0.4",
        "define-properties": "^1.2.1",
        "es-object-atoms": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/string.prototype.trimstart": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/string.prototype.trimstart/-/string.prototype.trimstart-1.0.8.tgz",
      "integrity": "sha512-UXSH262CSZY1tfu3G3Secr6uGLCFVPMhIqHjlgCUtCCcgihYc/xKs9djMTMUOb2j1mVSeU8EU6NWc/iQKU6Gfg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.7",
        "define-properties": "^1.2.1",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/strip-bom": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/strip-bom/-/strip-bom-3.0.0.tgz",
      "integrity": "sha512-vavAMRXOgBVNF6nyEEmL3DBK19iRpDcoIwW+swQ+CbGiu7lju6t+JklA1MHweoWtadgt4ISVUsXLyDq34ddcwA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/strip-json-comments": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/strip-json-comments/-/strip-json-comments-3.1.1.tgz",
      "integrity": "sha512-6fPc+R4ihwqP6N/aIv2f1gMH8lOVtWQHoqC4yK6oSDVVocumAsfCqjkXnqiYMhmMwS/mEHLp7Vehlt3ql6lEig==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/styled-jsx": {
      "version": "5.1.6",
      "resolved": "https://registry.npmjs.org/styled-jsx/-/styled-jsx-5.1.6.tgz",
      "integrity": "sha512-qSVyDTeMotdvQYoHWLNGwRFJHC+i+ZvdBRYosOFgC+Wg1vx4frN2/RG/NA7SYqqvKNLf39P2LSRA2pu6n0XYZA==",
      "license": "MIT",
      "dependencies": {
        "client-only": "0.0.1"
      },
      "engines": {
        "node": ">= 12.0.0"
      },
      "peerDependencies": {
        "react": ">= 16.8.0 || 17.x.x || ^18.0.0-0 || ^19.0.0-0"
      },
      "peerDependenciesMeta": {
        "@babel/core": {
          "optional": true
        },
        "babel-plugin-macros": {
          "optional": true
        }
      }
    },
    "node_modules/supports-color": {
      "version": "7.2.0",
      "resolved": "https://registry.npmjs.org/supports-color/-/supports-color-7.2.0.tgz",
      "integrity": "sha512-qpCAvRl9stuOHveKsn7HncJRvv501qIacKzQlO/+Lwxc9+0q2wLyv4Dfvt80/DPn2pqOBsJdDiogXGR9+OvwRw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "has-flag": "^4.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/supports-preserve-symlinks-flag": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/supports-preserve-symlinks-flag/-/supports-preserve-symlinks-flag-1.0.0.tgz",
      "integrity": "sha512-ot0WnXS9fgdkgIcePe6RHNk1WA8+muPa6cSjeR3V8K27q9BB1rTE3R1p7Hv0z1ZyAc8s6Vvv8DIyWf681MAt0w==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/tailwindcss": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/tailwindcss/-/tailwindcss-4.3.3.tgz",
      "integrity": "sha512-gOhV3P7ufE62QDGg1zVaTgCR+EtPv92k2nIhVcVKcLmxT1sUBsQGhnZj175j+MqRt4zLF7ic+sCYjfhxMxj7YQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/tapable": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/tapable/-/tapable-2.3.3.tgz",
      "integrity": "sha512-uxc/zpqFg6x7C8vOE7lh6Lbda8eEL9zmVm/PLeTPBRhh1xCgdWaQ+J1CUieGpIfm2HdtsUpRv+HshiasBMcc6A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/webpack"
      }
    },
    "node_modules/tinyglobby": {
      "version": "0.2.17",
      "resolved": "https://registry.npmjs.org/tinyglobby/-/tinyglobby-0.2.17.tgz",
      "integrity": "sha512-wXR/dYpcqKmfWpEdZjiKJOwCNFndD0DMnrW/cYjVGttEkBfVgcLFHoNrlj47mjOVic9yyNu65alsgF4NQyTa2g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fdir": "^6.5.0",
        "picomatch": "^4.0.4"
      },
      "engines": {
        "node": ">=12.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/SuperchupuDev"
      }
    },
    "node_modules/tinyglobby/node_modules/fdir": {
      "version": "6.5.0",
      "resolved": "https://registry.npmjs.org/fdir/-/fdir-6.5.0.tgz",
      "integrity": "sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12.0.0"
      },
      "peerDependencies": {
        "picomatch": "^3 || ^4"
      },
      "peerDependenciesMeta": {
        "picomatch": {
          "optional": true
        }
      }
    },
    "node_modules/tinyglobby/node_modules/picomatch": {
      "version": "4.0.7",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-4.0.7.tgz",
      "integrity": "sha512-qcJu88Q2IWqJsDD529JKMdwGm/dvInW4HvQnRwiH9JtihJvzGOscDtHE3x1pBKeUOTysQ8kVmLnJ2kJu7yhcGA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/to-regex-range": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/to-regex-range/-/to-regex-range-5.0.1.tgz",
      "integrity": "sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-number": "^7.0.0"
      },
      "engines": {
        "node": ">=8.0"
      }
    },
    "node_modules/ts-api-utils": {
      "version": "2.5.0",
      "resolved": "https://registry.npmjs.org/ts-api-utils/-/ts-api-utils-2.5.0.tgz",
      "integrity": "sha512-OJ/ibxhPlqrMM0UiNHJ/0CKQkoKF243/AEmplt3qpRgkW8VG7IfOS41h7V8TjITqdByHzrjcS/2si+y4lIh8NA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18.12"
      },
      "peerDependencies": {
        "typescript": ">=4.8.4"
      }
    },
    "node_modules/tsconfig-paths": {
      "version": "3.15.0",
      "resolved": "https://registry.npmjs.org/tsconfig-paths/-/tsconfig-paths-3.15.0.tgz",
      "integrity": "sha512-2Ac2RgzDe/cn48GvOe3M+o82pEFewD3UPbyoUHHdKasHwJKjds4fLXWf/Ux5kATBKN20oaFGu+jbElp1pos0mg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/json5": "^0.0.29",
        "json5": "^1.0.2",
        "minimist": "^1.2.6",
        "strip-bom": "^3.0.0"
      }
    },
    "node_modules/tsconfig-paths/node_modules/json5": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/json5/-/json5-1.0.2.tgz",
      "integrity": "sha512-g1MWMLBiz8FKi1e4w0UyVL3w+iJceWAFBAaBnnGKOpNa5f8TLktkbre1+s6oICydWAm+HRUGTmI+//xv2hvXYA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "minimist": "^1.2.0"
      },
      "bin": {
        "json5": "lib/cli.js"
      }
    },
    "node_modules/tslib": {
      "version": "2.8.1",
      "resolved": "https://registry.npmjs.org/tslib/-/tslib-2.8.1.tgz",
      "integrity": "sha512-oJFu94HQb+KVduSUQL7wnpmqnfmLsOA/nAh6b6EH0wCEoK0/mPeXU6c3wKDV83MkOuHPRHtSXKKU99IBazS/2w==",
      "license": "0BSD"
    },
    "node_modules/type-check": {
      "version": "0.4.0",
      "resolved": "https://registry.npmjs.org/type-check/-/type-check-0.4.0.tgz",
      "integrity": "sha512-XleUoc9uwGXqjWwXaUTZAmzMcFZ5858QA2vvx1Ur5xIcixXIP+8LnFDgRplU30us6teqdlskFfu+ae4K79Ooew==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "prelude-ls": "^1.2.1"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/typed-array-buffer": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/typed-array-buffer/-/typed-array-buffer-1.0.3.tgz",
      "integrity": "sha512-nAYYwfY3qnzX30IkA6AQZjVbtK6duGontcQm1WSG1MD94YLqK0515GNApXkoxKOWMusVssAHWLh9SeaoefYFGw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "es-errors": "^1.3.0",
        "is-typed-array": "^1.1.14"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/typed-array-byte-length": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/typed-array-byte-length/-/typed-array-byte-length-1.0.3.tgz",
      "integrity": "sha512-BaXgOuIxz8n8pIq3e7Atg/7s+DpiYrxn4vdot3w9KbnBhcRQq6o3xemQdIfynqSeXeDrF32x+WvfzmOjPiY9lg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "for-each": "^0.3.3",
        "gopd": "^1.2.0",
        "has-proto": "^1.2.0",
        "is-typed-array": "^1.1.14"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/typed-array-byte-offset": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/typed-array-byte-offset/-/typed-array-byte-offset-1.0.5.tgz",
      "integrity": "sha512-0FHJvLPqZ7KJzp17O13jfsAjsqazgrxBu2zEK95PmUz8lv2+GjRuxUInCr2Rk9Dms3ihN21zJ929ZO43yJ95QQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "available-typed-arrays": "^1.0.7",
        "call-bind": "^1.0.9",
        "for-each": "^0.3.5",
        "gopd": "^1.2.0",
        "is-typed-array": "^1.1.15",
        "reflect.getprototypeof": "^1.0.10"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/typed-array-length": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/typed-array-length/-/typed-array-length-1.0.8.tgz",
      "integrity": "sha512-phPGCwqr2+Qo0fwniCE8e4pKnGu/yFb5nD5Y8bf0EEeiI5GklnACYA9GFy/DrAeRrKHXvHn+1SUsOWgJp6RO+g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.9",
        "for-each": "^0.3.5",
        "gopd": "^1.2.0",
        "is-typed-array": "^1.1.15",
        "possible-typed-array-names": "^1.1.0",
        "reflect.getprototypeof": "^1.0.10"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/typescript": {
      "version": "5.9.3",
      "resolved": "https://registry.npmjs.org/typescript/-/typescript-5.9.3.tgz",
      "integrity": "sha512-jl1vZzPDinLr9eUt3J/t7V6FgNEw9QjvBPdysz9KfQDD41fQrC2Y4vKQdiaUpFT4bXlb1RHhLpp8wtm6M5TgSw==",
      "dev": true,
      "license": "Apache-2.0",
      "peer": true,
      "bin": {
        "tsc": "bin/tsc",
        "tsserver": "bin/tsserver"
      },
      "engines": {
        "node": ">=14.17"
      }
    },
    "node_modules/typescript-eslint": {
      "version": "8.70.1",
      "resolved": "https://registry.npmjs.org/typescript-eslint/-/typescript-eslint-8.70.1.tgz",
      "integrity": "sha512-AcWG7KDjZ2THNXsgwttMaGmzVi0VFRlFYfqFHYQRbDpF3owuYbuiL8c7UUrd2k8s3PoSfIQrWfrGXfcElrWLYA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@typescript-eslint/eslint-plugin": "8.70.1",
        "@typescript-eslint/parser": "8.70.1",
        "@typescript-eslint/typescript-estree": "8.70.1",
        "@typescript-eslint/utils": "8.70.1"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "eslint": "^8.57.0 || ^9.0.0 || ^10.0.0",
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/unbox-primitive": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/unbox-primitive/-/unbox-primitive-1.1.0.tgz",
      "integrity": "sha512-nWJ91DjeOkej/TA8pXQ3myruKpKEYgqvpw9lz4OPHj/NWFNluYrjbz9j01CJ8yKQd2g4jFoOkINCTW2I5LEEyw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "has-bigints": "^1.0.2",
        "has-symbols": "^1.1.0",
        "which-boxed-primitive": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/undici-types": {
      "version": "6.21.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.21.0.tgz",
      "integrity": "sha512-iwDZqg0QAGrg9Rav5H4n0M64c3mkR59cJ6wQp+7C4nI0gsmExaedaYLNO44eT4AtBBwjbTiGPMlt2Md0T9H9JQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/unrs-resolver": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/unrs-resolver/-/unrs-resolver-1.12.2.tgz",
      "integrity": "sha512-dmlRxBJJayXjqTwC+JtF1HhJmgf3ftQ3YejFcZrf4+KKtJv0qDsK1pjqaaVjG7wJ5NJ6UVP1OqRMQ71Z4C3rxQ==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "dependencies": {
        "napi-postinstall": "^0.3.4"
      },
      "funding": {
        "url": "https://opencollective.com/unrs-resolver"
      },
      "optionalDependencies": {
        "@unrs/resolver-binding-android-arm-eabi": "1.12.2",
        "@unrs/resolver-binding-android-arm64": "1.12.2",
        "@unrs/resolver-binding-darwin-arm64": "1.12.2",
        "@unrs/resolver-binding-darwin-x64": "1.12.2",
        "@unrs/resolver-binding-freebsd-x64": "1.12.2",
        "@unrs/resolver-binding-linux-arm-gnueabihf": "1.12.2",
        "@unrs/resolver-binding-linux-arm-musleabihf": "1.12.2",
        "@unrs/resolver-binding-linux-arm64-gnu": "1.12.2",
        "@unrs/resolver-binding-linux-arm64-musl": "1.12.2",
        "@unrs/resolver-binding-linux-loong64-gnu": "1.12.2",
        "@unrs/resolver-binding-linux-loong64-musl": "1.12.2",
        "@unrs/resolver-binding-linux-ppc64-gnu": "1.12.2",
        "@unrs/resolver-binding-linux-riscv64-gnu": "1.12.2",
        "@unrs/resolver-binding-linux-riscv64-musl": "1.12.2",
        "@unrs/resolver-binding-linux-s390x-gnu": "1.12.2",
        "@unrs/resolver-binding-linux-x64-gnu": "1.12.2",
        "@unrs/resolver-binding-linux-x64-musl": "1.12.2",
        "@unrs/resolver-binding-openharmony-arm64": "1.12.2",
        "@unrs/resolver-binding-wasm32-wasi": "1.12.2",
        "@unrs/resolver-binding-win32-arm64-msvc": "1.12.2",
        "@unrs/resolver-binding-win32-ia32-msvc": "1.12.2",
        "@unrs/resolver-binding-win32-x64-msvc": "1.12.2"
      }
    },
    "node_modules/update-browserslist-db": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/update-browserslist-db/-/update-browserslist-db-1.3.3.tgz",
      "integrity": "sha512-pJ2sYawQS0R/WI928Gj5GlPhTGzbMelq0+4INtSYNDV9ErKJcX6xjGWkoG/VnB3dpUm00zALaqkrUD77pO5TDQ==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/browserslist"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "escalade": "^3.2.0",
        "picocolors": "^1.1.1"
      },
      "bin": {
        "update-browserslist-db": "cli.js"
      },
      "peerDependencies": {
        "browserslist": ">= 4.21.0"
      }
    },
    "node_modules/uri-js": {
      "version": "4.4.1",
      "resolved": "https://registry.npmjs.org/uri-js/-/uri-js-4.4.1.tgz",
      "integrity": "sha512-7rKUyy33Q1yc98pQ1DAmLtwX109F7TIfWlW1Ydo8Wl1ii1SeHieeh0HHfPeL2fMXK6z0s8ecKs9frCuLJvndBg==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "punycode": "^2.1.0"
      }
    },
    "node_modules/which": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/which/-/which-2.0.2.tgz",
      "integrity": "sha512-BLI3Tl1TW3Pvl70l3yq3Y64i+awpwXqsGBYWkkqMtnbXgrMD+yj7rhW0kuEDxzJaYXGjEW5ogapKNMEKNMjibA==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "isexe": "^2.0.0"
      },
      "bin": {
        "node-which": "bin/node-which"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/which-boxed-primitive": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/which-boxed-primitive/-/which-boxed-primitive-1.1.1.tgz",
      "integrity": "sha512-TbX3mj8n0odCBFVlY8AxkqcHASw3L60jIuF8jFP78az3C2YhmGvqbHBpAjTRH2/xqYunrJ9g1jSyjCjpoWzIAA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-bigint": "^1.1.0",
        "is-boolean-object": "^1.2.1",
        "is-number-object": "^1.1.1",
        "is-string": "^1.1.1",
        "is-symbol": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/which-builtin-type": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/which-builtin-type/-/which-builtin-type-1.2.1.tgz",
      "integrity": "sha512-6iBczoX+kDQ7a3+YJBnh3T+KZRxM/iYNPXicqk66/Qfm1b93iu+yOImkg0zHbj5LNOcNv1TEADiZ0xa34B4q6Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "function.prototype.name": "^1.1.6",
        "has-tostringtag": "^1.0.2",
        "is-async-function": "^2.0.0",
        "is-date-object": "^1.1.0",
        "is-finalizationregistry": "^1.1.0",
        "is-generator-function": "^1.0.10",
        "is-regex": "^1.2.1",
        "is-weakref": "^1.0.2",
        "isarray": "^2.0.5",
        "which-boxed-primitive": "^1.1.0",
        "which-collection": "^1.0.2",
        "which-typed-array": "^1.1.16"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/which-collection": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/which-collection/-/which-collection-1.0.2.tgz",
      "integrity": "sha512-K4jVyjnBdgvc86Y6BkaLZEN933SwYOuBFkdmBu9ZfkcAbdVbpITnDmjvZ/aQjRXQrv5EPkTnD1s39GiiqbngCw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-map": "^2.0.3",
        "is-set": "^2.0.3",
        "is-weakmap": "^2.0.2",
        "is-weakset": "^2.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/which-typed-array": {
      "version": "1.1.24",
      "resolved": "https://registry.npmjs.org/which-typed-array/-/which-typed-array-1.1.24.tgz",
      "integrity": "sha512-wk4Mf4pR5mRP7eYuuTBCIQ9d0ud2Fv2jRLQpfgnRjbOxAFHmjKFValgTpitVKzJJS8ajnYQV2Du1SZ8j6b/EUQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "available-typed-arrays": "^1.0.7",
        "call-bind": "^1.0.9",
        "call-bound": "^1.0.4",
        "for-each": "^0.3.5",
        "get-proto": "^1.0.1",
        "gopd": "^1.2.0",
        "has-tostringtag": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/word-wrap": {
      "version": "1.2.5",
      "resolved": "https://registry.npmjs.org/word-wrap/-/word-wrap-1.2.5.tgz",
      "integrity": "sha512-BN22B5eaMMI9UMtjrGd5g5eCYPpCPDUy0FJXbYsaT5zYxjFOckS53SQDE3pWkVoWpHXVb3BrYcEN4Twa55B5cA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/yallist": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/yallist/-/yallist-3.1.1.tgz",
      "integrity": "sha512-a4UGQaWPH59mOXUYnAG2ewncQS4i4F43Tv3JoAM+s2VDAmS9NsK8GpDMLrCHPksFT7h3K6TOoUNn2pb7RoXx4g==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/yocto-queue": {
      "version": "0.1.0",
      "resolved": "https://registry.npmjs.org/yocto-queue/-/yocto-queue-0.1.0.tgz",
      "integrity": "sha512-rVksvsnNCdJ/ohGc6xgPwyN8eheCxsiLM8mxuE/t/mOVqJewPuO1miLpTHQiRgTKCLexL4MeAFVagts7HmNZ2Q==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/zod": {
      "version": "4.6.5",
      "resolved": "https://registry.npmjs.org/zod/-/zod-4.6.5.tgz",
      "integrity": "sha512-v5l/aFXZQeai4awLbOpSoHecE9UiMrnfx75tEXLjNonXVARxQ5mOeipTjROUchszUNCqnE+hqAMujRsRHsut2Q==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "funding": {
        "url": "https://github.com/sponsors/colinhacks"
      }
    },
    "node_modules/zod-validation-error": {
      "version": "4.0.2",
      "resolved": "https://registry.npmjs.org/zod-validation-error/-/zod-validation-error-4.0.2.tgz",
      "integrity": "sha512-Q6/nZLe6jxuU80qb/4uJ4t5v2VEZ44lzQjPDhYJNztRQ4wyWc6VF3D3Kb/fAuPetZQnhS3hnajCf9CsWesghLQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18.0.0"
      },
      "peerDependencies": {
        "zod": "^3.25.0 || ^4.0.0"
      }
    }
  }
}

```

# package.json

| Property | Value |
|----------|-------|
| Path | `package.json` |
| Size | 692 bytes |
| Extension | `.json` |
| Modified | 2026-10-03 18:43:15.388764 |

```json
{
  "name": "client",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "axios": "^1.20.0",
    "js-cookie": "^3.0.8",
    "lucide-react": "^1.49.0",
    "next": "16.3.6",
    "react": "19.2.8",
    "react-dom": "19.2.8"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/js-cookie": "^3.0.6",
    "@types/node": "^20.19.43",
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "eslint": "^9",
    "eslint-config-next": "16.3.6",
    "tailwindcss": "^4",
    "typescript": "^5.9.3"
  }
}

```

# postcss.config.mjs

| Property | Value |
|----------|-------|
| Path | `postcss.config.mjs` |
| Size | 101 bytes |
| Extension | `.mjs` |
| Modified | 2026-09-25 18:49:59.291013 |

```mjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;

```

# public\file.svg

| Property | Value |
|----------|-------|
| Path | `public\file.svg` |
| Size | 391 bytes |
| Extension | `.svg` |
| Modified | 2026-09-25 18:49:59.293399 |

> **File nhị phân** (đã bỏ qua nội dung)

# public\globe.svg

| Property | Value |
|----------|-------|
| Path | `public\globe.svg` |
| Size | 1,035 bytes |
| Extension | `.svg` |
| Modified | 2026-09-25 18:49:59.294410 |

> **File nhị phân** (đã bỏ qua nội dung)

# public\next.svg

| Property | Value |
|----------|-------|
| Path | `public\next.svg` |
| Size | 1,375 bytes |
| Extension | `.svg` |
| Modified | 2026-09-25 18:49:59.295408 |

> **File nhị phân** (đã bỏ qua nội dung)

# public\vercel.svg

| Property | Value |
|----------|-------|
| Path | `public\vercel.svg` |
| Size | 128 bytes |
| Extension | `.svg` |
| Modified | 2026-09-25 18:49:59.296410 |

> **File nhị phân** (đã bỏ qua nội dung)

# public\window.svg

| Property | Value |
|----------|-------|
| Path | `public\window.svg` |
| Size | 385 bytes |
| Extension | `.svg` |
| Modified | 2026-09-25 18:49:59.297409 |

> **File nhị phân** (đã bỏ qua nội dung)

# tailwind.config.ts

| Property | Value |
|----------|-------|
| Path | `tailwind.config.ts` |
| Size | 299 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 18:43:15.389679 |

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;

```

# tsconfig.json

| Property | Value |
|----------|-------|
| Path | `tsconfig.json` |
| Size | 700 bytes |
| Extension | `.json` |
| Modified | 2026-09-25 18:49:59.300409 |

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}

```

# types\api.ts

| Property | Value |
|----------|-------|
| Path | `types\api.ts` |
| Size | 1,855 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 18:43:15.390593 |

```typescript
import { OrderChannel, PaymentMethod } from './enums';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
  errors?: Record<string, string[]>;
}

// Map chính xác udt_OrderDetailList trong SQL
export interface CreateOrderDetailDto {
  variantId: number;
  quantity: number;
  note?: string;
  itemSnapshotName: string;
  sizeSnapshot: string;
  unitPrice: number;
  totalToppingPriceSnapshot: number;
  totalPrice: number;
  toppingIds?: number[];
}

// Tham số đầu vào cho sp_CreateOrderWithPager
export interface CreateOrderWithPagerDto {
  orderCode: string;
  orderChannel: OrderChannel;
  pagerCode: string;
  employeeId: number;
  customerId?: number | null;
  subTotal: number;
  discountAmount?: number;
  paymentMethod: PaymentMethod;
  orderDetails: CreateOrderDetailDto[];
}

// Tham số đầu vào cho sp_CreateCounterOrder
export interface CreateCounterOrderDto {
  orderCode: string;
  employeeId: number;
  customerId?: number | null;
  pagerId?: number | null;
  subTotal: number;
  discountAmount?: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  orderDetails: CreateOrderDetailDto[];
}

// Map chính xác udt_InventoryImportDetailList trong SQL
export interface CreateInventoryImportDetailDto {
  ingredientId: number;
  quantity: number;
  unitPrice: number;
  totalLineAmount: number;
}

// Tham số đầu vào cho sp_CreateInventoryImport
export interface CreateInventoryImportDto {
  supplierName: string;
  employeeId: number;
  note?: string;
  importDetails: CreateInventoryImportDetailDto[];
}

// Tham số đầu vào cho sp_DieuChinhTonKho
export interface AdjustStockDto {
  ingredientId: number;
  employeeId: number;
  newQuantity: number;
  reason: string;
}
```

# types\auth.ts

| Property | Value |
|----------|-------|
| Path | `types\auth.ts` |
| Size | 982 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 18:43:15.391474 |

```typescript
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
```

# types\common.ts

| Property | Value |
|----------|-------|
| Path | `types\common.ts` |
| Size | 451 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 18:43:15.391474 |

```typescript
export interface BaseEntity {
    id: number;
    createdAt: string;
    updatedAt?: string | null;
}

export interface SoftDeletableEntity extends BaseEntity {
    deletedAt?: string | null;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
```

# types\customer.ts

| Property | Value |
|----------|-------|
| Path | `types\customer.ts` |
| Size | 891 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 18:43:15.392475 |

```typescript
import { BaseEntity, SoftDeletableEntity } from './common';
import { LoyaltyTransactionType, MembershipTier } from './enums';

export interface Customer extends SoftDeletableEntity {
    phoneNumber: string;
    fullName: string;
    rewardPoints: number;
    membershipTier: MembershipTier;
}

export interface LoyaltyTransaction extends BaseEntity {
    customerId: number;
    orderId?: number | null;
    orderCode?: string | null;
    transactionType: LoyaltyTransactionType;
    points: number;
    balanceAfter: number;
    description?: string | null;
}

// DTO phản hồi từ View v_CustomerLoyaltySummary
export interface CustomerSummaryView {
    customerId: number;
    fullName: string;
    phoneNumber: string;
    membershipTier: MembershipTier;
    currentRewardPoints: number;
    totalPointsEarned: number;
    totalPointsRedeemed: number;
}
```

# types\enums.ts

| Property | Value |
|----------|-------|
| Path | `types\enums.ts` |
| Size | 1,485 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 18:43:15.394473 |

```typescript
// Bảng Employee (CK_Employee_role, CK_Employee_status)
export type EmployeeRole = 'ADMIN' | 'MANAGER' | 'CASHIER' | 'BARISTA' | 'STOREKEEPER';
export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';

// Định danh User Type trên Client (Hỗ trợ xác thực phân hệ Client/POS/Staff)
export type UserType = 'EMPLOYEE' | 'CUSTOMER';

// Bảng Customer (CK_Customer_tier)
export type MembershipTier = 'STANDARD' | 'SILVER' | 'GOLD' | 'DIAMOND';

// Bảng PagerDevice (CK_PagerDevice_status)
export type PagerStatus = 'IDLE' | 'AVAILABLE' | 'IN_USE' | 'CHARGING' | 'MAINTENANCE';

// Bảng Category, Product & ProductVariant
export type CategoryDisplayStatus = 'SHOW' | 'HIDE';
export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';
export type ProductSize = 'S' | 'M' | 'L' | 'XL';
export type ToppingStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'ACTIVE';

// Bảng Order & OrderDetail (CK_Order_channel, CK_Order_payment, CK_Order_status, CK_OrderDetail_itemStatus)
export type OrderChannel = 'POS' | 'APP' | 'DELIVERY' | 'ORDER_AT_COUNTER';
export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'CARD' | 'MOMO' | 'VNPAY' | 'POINT_EXCHANGE';
export type OrderStatus = | 'PENDING' | 'PENDING_PREP' | 'PREPARING' | 'READY' | 'READY_FOR_PICKUP' | 'PAID' | 'COMPLETED' | 'CANCELLED';
export type OrderDetailItemStatus = 'PENDING' | 'PREPARING' | 'READY' | 'DONE' | 'DELIVERED' | 'CANCELLED';
export type LoyaltyTransactionType = 'EARN' | 'REDEEM';
```

# types\index.ts

| Property | Value |
|----------|-------|
| Path | `types\index.ts` |
| Size | 263 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 18:43:15.395501 |

```typescript
export * from './enums';
export * from './common';
export * from './api';
export * from './auth';
export * from './menu';
export * from './order';
export * from './inventory';
export * from './customer';
export * from './pager';
export * from './report';
```

# types\inventory.ts

| Property | Value |
|----------|-------|
| Path | `types\inventory.ts` |
| Size | 1,043 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 18:43:15.396475 |

```typescript
import { BaseEntity, SoftDeletableEntity } from './common';

export interface Ingredient extends SoftDeletableEntity {
    name: string;
    unit: string;
    stockQuantity: number;
    minimumThreshold: number;
    isLowStock?: boolean;
}

export interface InventoryImportDetail {
    id: number;
    importId: number;
    ingredientId: number;
    ingredientName?: string;
    unit?: string;
    quantity: number;
    unitPrice: number;
    totalLineAmount: number;
}

export interface InventoryImport {
    id: number;
    employeeId: number;
    employeeName?: string;
    supplierName: string;
    totalAmount: number;
    importDate: string;
    note?: string | null;
    details?: InventoryImportDetail[];
}

export interface InventoryAdjustment {
    id: number;
    ingredientId: number;
    ingredientName?: string;
    employeeId: number;
    employeeName?: string;
    oldQuantity: number;
    newQuantity: number;
    difference: number;
    reason: string;
    adjustmentDate: string;
}
```

# types\menu.ts

| Property | Value |
|----------|-------|
| Path | `types\menu.ts` |
| Size | 1,134 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 18:43:15.397737 |

```typescript
import { BaseEntity, SoftDeletableEntity } from './common';
import { CategoryDisplayStatus, ProductSize, ProductStatus, ToppingStatus } from './enums';

export interface Category extends BaseEntity {
    name: string;
    displayStatus: CategoryDisplayStatus;
}

export interface ProductVariant extends SoftDeletableEntity {
    productId: number;
    size: ProductSize;
    price: number;
}

export interface Product extends SoftDeletableEntity {
    categoryId: number;
    name: string;
    description?: string | null;
    image?: string | null;
    status: ProductStatus;
    categoryName?: string;
    variants?: ProductVariant[];
}

export interface Topping extends BaseEntity {
    name: string;
    price: number;
    status: ToppingStatus;
}

export interface RecipeBOM {
    variantId: number;
    ingredientId: number;
    consumedQuantity: number;
    ingredientName?: string;
    ingredientUnit?: string;
}

export interface ToppingBOM {
    toppingId: number;
    ingredientId: number;
    consumedQuantity: number;
    ingredientName?: string;
    ingredientUnit?: string;
}
```

# types\order.ts

| Property | Value |
|----------|-------|
| Path | `types\order.ts` |
| Size | 1,832 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 18:43:15.398639 |

```typescript
import { BaseEntity, SoftDeletableEntity } from './common';
import { OrderChannel, OrderDetailItemStatus, OrderStatus, PaymentMethod, ProductSize } from './enums';
import { Topping } from './menu';

export interface OrderDetailTopping {
    id?: number;
    orderDetailId?: number;
    toppingId?: number | null;
    toppingSnapshotName: string;
    toppingPrice: number;
    quantity: number;
}

export interface OrderDetail extends BaseEntity {
    orderId: number;
    variantId?: number | null;
    quantity: number;
    note?: string | null;
    itemSnapshotName: string;
    sizeSnapshot: string;
    unitPrice: number;
    totalToppingPriceSnapshot: number;
    totalPrice: number;
    itemStatus: OrderDetailItemStatus;
    toppings?: OrderDetailTopping[];
}

export interface Order extends SoftDeletableEntity {
    orderCode: string;
    customerId?: number | null;
    customerName?: string | null;
    customerPhone?: string | null;
    pagerId?: number | null;
    pagerCode?: string | null;
    employeeId?: number | null;
    employeeName?: string | null;
    orderChannel: OrderChannel;
    subTotal: number;
    discountAmount: number;
    totalAmount: number;
    paymentMethod: PaymentMethod;
    status: OrderStatus;
    cancelReason?: string | null;
    paidAt?: string | null;
    pickupAt?: string | null;
    items?: OrderDetail[];
}

// Cấu trúc sản phẩm đang lưu trữ trong giỏ hàng POS (CartContext)
export interface CartItem {
    id: string; // Khóa tạm thời trên UI (uuid hoặc timestamp)
    productId: number;
    variantId: number;
    name: string;
    size: ProductSize;
    unitPrice: number;
    quantity: number;
    note?: string;
    toppings: Topping[];
    totalToppingPrice: number;
    totalPrice: number;
}
```

# types\pager.ts

| Property | Value |
|----------|-------|
| Path | `types\pager.ts` |
| Size | 530 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 18:43:15.398961 |

```typescript
import { SoftDeletableEntity } from './common';
import { PagerStatus } from './enums';

export interface PagerDevice extends SoftDeletableEntity {
  pagerCode: string;
  status: PagerStatus;
  batteryLevel: number;
}

// Phản hồi từ v_ActivePagerDashboard
export interface ActivePagerDashboardItem {
  pagerCode: string;
  pagerStatus: PagerStatus;
  batteryLevel: number;
  orderId: number;
  orderCode: string;
  customerName?: string | null;
  customerPhone?: string | null;
  waitingMinutes: number;
}
```

# types\report.ts

| Property | Value |
|----------|-------|
| Path | `types\report.ts` |
| Size | 1,238 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 18:43:15.400173 |

```typescript
import { OrderChannel, OrderDetailItemStatus, OrderStatus } from './enums';

export interface DailyRevenueReport {
  revenueDate: string;
  totalOrders: number;
  totalOriginalAmount: number;
  totalDiscountAmount: number;
  totalNetRevenue: number;
}

export interface TopProductReport {
  productId: number;
  productName: string;
  totalQuantitySold: number;
  totalRevenue: number;
}

export interface ProductRecipeDetailReport {
  productName: string;
  productSize: string;
  ingredientName: string;
  consumedQuantity: number;
  ingredientUnit: string;
}

export interface InvoiceDetailReport {
  orderId: number;
  orderCode: string;
  orderChannel: OrderChannel;
  orderStatus: OrderStatus;
  paymentMethod: string;
  subTotal: number;
  discountAmount: number;
  totalAmount: number;
  paidAt?: string | null;
  orderCreatedAt: string;
  employeeName?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  orderDetailId: number;
  itemSnapshotName: string;
  sizeSnapshot: string;
  quantity: number;
  unitPrice: number;
  totalToppingPriceSnapshot: number;
  lineTotalPrice: number;
  itemStatus: OrderDetailItemStatus;
  itemNote?: string | null;
}
```

# utils\format.ts

| Property | Value |
|----------|-------|
| Path | `utils\format.ts` |
| Size | 0 bytes |
| Extension | `.ts` |
| Modified | 2026-09-25 18:49:59.308726 |

```typescript

```

# utils\index.ts

| Property | Value |
|----------|-------|
| Path | `utils\index.ts` |
| Size | 0 bytes |
| Extension | `.ts` |
| Modified | 2026-09-25 18:49:59.309561 |

```typescript

```

# utils\storage.ts

| Property | Value |
|----------|-------|
| Path | `utils\storage.ts` |
| Size | 461 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 18:43:15.401274 |

```typescript
export const getStorageItem = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
};

export const setStorageItem = (key: string, value: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, value);
};

export const removeStorageItem = (key: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
};

```

# utils\validation.ts

| Property | Value |
|----------|-------|
| Path | `utils\validation.ts` |
| Size | 0 bytes |
| Extension | `.ts` |
| Modified | 2026-09-25 18:49:59.309561 |

```typescript

```

