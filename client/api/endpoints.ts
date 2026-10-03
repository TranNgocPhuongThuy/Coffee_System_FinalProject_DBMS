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
      INDEX: '/customer-loyalty/customers',
      DETAIL: (id: string | number) => `/customer-loyalty/customers/${id}`,
    },
    TRANSACTIONS: {
      HISTORY: '/customer-loyalty/transactions/history',
      ADJUST: '/customer-loyalty/transactions/adjust',
    },
  },

  // REPORTS
  REPORTS: {
    REVENUE: '/reports/revenue',
    TOP_PRODUCTS: '/reports/top-products',
    LOW_STOCK: '/reports/low-stock',
  },
} as const;