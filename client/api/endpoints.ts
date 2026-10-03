export const ENDPOINTS = {
  // 1. AUTH
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
    CHANGE_PASSWORD: '/auth/change-password',
    EMPLOYEES: '/auth/employees',
    UPDATE_EMPLOYEE_ROLE: (id: string | number) => `/auth/employees/${id}/role`,
  },

  // 2. POS
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

  // 3. MENU
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

  // 4. INVENTORY & BOM
  INVENTORY: {
    INGREDIENTS: {
      INDEX: '/inventory/ingredients',
      DETAIL: (id: string | number) => `/inventory/ingredients/${id}`,
    },
    BOMS: {
      RECIPES: '/inventory/boms/recipes',
      TOPPINGS: '/inventory/boms/toppings',
      TOPPING_DETAIL: (toppingId: string | number) => `/inventory/boms/toppings/${toppingId}`,
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

  // 5. KDS
  KDS: {
    QUEUE: '/kds/queue',
    UPDATE_ITEM_STATUS: (orderDetailId: string | number) => `/kds/items/${orderDetailId}/status`,
    NOTIFY_ORDER_READY: (orderId: string | number) => `/kds/orders/${orderId}/notify-ready`,
  },

  // 6. CUSTOMER & LOYALTY
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

  // 7. REPORTS
  REPORTS: {
    REVENUE: '/reports/revenue',
    TOP_PRODUCTS: '/reports/top-products',
    LOW_STOCK: '/reports/low-stock',
  },
} as const;