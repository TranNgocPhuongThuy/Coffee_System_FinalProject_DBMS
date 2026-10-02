export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    SETUP_PASSWORD: '/auth/setup-password',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  POS: {
    ORDERS: '/pos/orders',
    PAYMENT: '/pos/payment',
  },
  PAGERS: '/pagers',
  KDS: '/kds/queue',
  MENU: {
    CATEGORIES: '/menu/categories',
    PRODUCTS: '/menu/products',
    TOPPINGS: '/menu/toppings',
  },
  INVENTORY: {
    INGREDIENTS: '/inventory/ingredients',
    BOMS: '/inventory/boms',
    IMPORTS: '/inventory/imports',
    ADJUSTMENTS: '/inventory/adjustments',
  },
  CUSTOMERS: '/customers',
  REPORTS: '/reports',
} as const;

export default API_ENDPOINTS;
