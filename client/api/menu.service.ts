// Path: api/menu.service.ts
import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import { CategoryDisplayStatus, ProductStatus, ToppingStatus } from '@/types/enums';

export const menuService = {
  // 1. Categories
  getCategories: async (params?: { displayStatus?: CategoryDisplayStatus; search?: string }) => {
    const res = await apiClient.get(ENDPOINTS.MENU.CATEGORIES.INDEX, { params });
    return res.data?.items || res.data?.data || res.data || [];
  },

  createCategory: async (payload: { name: string; displayStatus?: CategoryDisplayStatus }) => {
    const res = await apiClient.post(ENDPOINTS.MENU.CATEGORIES.INDEX, payload);
    return res.data;
  },

  updateCategory: async (id: string | number, payload: { name?: string; displayStatus?: CategoryDisplayStatus }) => {
    const res = await apiClient.put(ENDPOINTS.MENU.CATEGORIES.DETAIL(id), payload);
    return res.data;
  },

  deleteCategory: async (id: string | number) => {
    const res = await apiClient.delete(ENDPOINTS.MENU.CATEGORIES.DETAIL(id));
    return res.data;
  },

  // 2. Products
  getProducts: async (params?: { categoryId?: number; status?: ProductStatus; search?: string }) => {
    const res = await apiClient.get(ENDPOINTS.MENU.PRODUCTS.INDEX, { params });
    return res.data?.items || res.data?.data || res.data || [];
  },

  getProductById: async (id: string | number) => {
    const res = await apiClient.get(ENDPOINTS.MENU.PRODUCTS.DETAIL(id));
    return res.data?.data || res.data;
  },

  createProduct: async (payload: {
    categoryId: number;
    name: string;
    description?: string;
    image?: string;
    status?: ProductStatus;
    variants: Array<{ size: 'S' | 'M' | 'L' | 'XL'; price: number }>;
  }) => {
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

  // 3. Toppings
  getToppings: async (params?: { status?: ToppingStatus; search?: string }) => {
    const res = await apiClient.get(ENDPOINTS.MENU.TOPPINGS.INDEX, { params });
    return res.data?.items || res.data?.data || res.data || [];
  },

  createTopping: async (payload: { name: string; price: number; status?: ToppingStatus }) => {
    const res = await apiClient.post(ENDPOINTS.MENU.TOPPINGS.INDEX, payload);
    return res.data;
  },

  updateTopping: async (id: string | number, payload: { name?: string; price?: number; status?: ToppingStatus }) => {
    const res = await apiClient.put(ENDPOINTS.MENU.TOPPINGS.DETAIL(id), payload);
    return res.data;
  },

  deleteTopping: async (id: string | number) => {
    const res = await apiClient.delete(ENDPOINTS.MENU.TOPPINGS.DETAIL(id));
    return res.data;
  },
};

export default menuService;