// Path: api/menu.service.ts
import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import { CategoryDisplayStatus, ProductStatus, ToppingStatus } from '@/types/enums';

const extractArray = (res: any): any[] => {
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.data?.items)) return res.data.items;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res)) return res;
  return [];
};

const extractObject = (res: any): any => {
  if (res?.data?.data !== undefined) return res.data.data;
  if (res?.data !== undefined) return res.data;
  return res;
};

export const menuService = {
  // 1. Categories
  getCategories: async (params?: { displayStatus?: CategoryDisplayStatus; search?: string }) => {
    const cleanParams: any = {};
    if (params?.displayStatus) cleanParams.displayStatus = params.displayStatus;
    if (params?.search?.trim()) cleanParams.search = params.search.trim();

    const res = await apiClient.get(ENDPOINTS.MENU.CATEGORIES.INDEX, {
      params: Object.keys(cleanParams).length > 0 ? cleanParams : undefined,
    });
    return extractArray(res);
  },

  getCategoryById: async (id: string | number) => {
    const res = await apiClient.get(ENDPOINTS.MENU.CATEGORIES.DETAIL(id));
    return extractObject(res);
  },

  createCategory: async (payload: { name: string; displayStatus?: CategoryDisplayStatus }) => {
    const res = await apiClient.post(ENDPOINTS.MENU.CATEGORIES.INDEX, payload);
    return extractObject(res);
  },

  updateCategory: async (id: string | number, payload: { name?: string; displayStatus?: CategoryDisplayStatus }) => {
    const res = await apiClient.put(ENDPOINTS.MENU.CATEGORIES.DETAIL(id), payload);
    return extractObject(res);
  },

  deleteCategory: async (id: string | number) => {
    const res = await apiClient.delete(ENDPOINTS.MENU.CATEGORIES.DETAIL(id));
    return extractObject(res);
  },

  // 2. Products
  getProducts: async (params?: { categoryId?: number; status?: ProductStatus; search?: string }) => {
    const cleanParams: any = {};
    if (params?.categoryId) cleanParams.categoryId = params.categoryId;
    if (params?.status) cleanParams.status = params.status;
    if (params?.search?.trim()) cleanParams.search = params.search.trim();

    const res = await apiClient.get(ENDPOINTS.MENU.PRODUCTS.INDEX, {
      params: Object.keys(cleanParams).length > 0 ? cleanParams : undefined,
    });
    return extractArray(res);
  },

  getProductById: async (id: string | number) => {
    const res = await apiClient.get(ENDPOINTS.MENU.PRODUCTS.DETAIL(id));
    return extractObject(res);
  },

  createProduct: async (payload: {
    categoryId: number;
    name: string;
    description?: string | null;
    image?: string | null;
    status?: ProductStatus;
    variants: Array<{ size: 'S' | 'M' | 'L' | 'XL'; price: number }>;
  }) => {
    const res = await apiClient.post(ENDPOINTS.MENU.PRODUCTS.INDEX, payload);
    return extractObject(res);
  },

  updateProduct: async (id: string | number, payload: {
    categoryId?: number;
    name?: string;
    description?: string | null;
    image?: string | null;
    status?: ProductStatus;
    variants?: Array<{ size: 'S' | 'M' | 'L' | 'XL'; price: number }>;
  }) => {
    const res = await apiClient.put(ENDPOINTS.MENU.PRODUCTS.DETAIL(id), payload);
    return extractObject(res);
  },

  deleteProduct: async (id: string | number) => {
    const res = await apiClient.delete(ENDPOINTS.MENU.PRODUCTS.DETAIL(id));
    return extractObject(res);
  },

  // 3. Toppings
  getToppings: async (params?: { status?: ToppingStatus; search?: string }) => {
    const cleanParams: any = {};
    if (params?.status) cleanParams.status = params.status;
    if (params?.search?.trim()) cleanParams.search = params.search.trim();

    const res = await apiClient.get(ENDPOINTS.MENU.TOPPINGS.INDEX, {
      params: Object.keys(cleanParams).length > 0 ? cleanParams : undefined,
    });
    return extractArray(res);
  },

  getToppingById: async (id: string | number) => {
    const res = await apiClient.get(ENDPOINTS.MENU.TOPPINGS.DETAIL(id));
    return extractObject(res);
  },

  createTopping: async (payload: { name: string; price: number; status?: ToppingStatus }) => {
    const res = await apiClient.post(ENDPOINTS.MENU.TOPPINGS.INDEX, payload);
    return extractObject(res);
  },

  updateTopping: async (id: string | number, payload: { name?: string; price?: number; status?: ToppingStatus }) => {
    const res = await apiClient.put(ENDPOINTS.MENU.TOPPINGS.DETAIL(id), payload);
    return extractObject(res);
  },

  deleteTopping: async (id: string | number) => {
    const res = await apiClient.delete(ENDPOINTS.MENU.TOPPINGS.DETAIL(id));
    return extractObject(res);
  },
};

export default menuService;