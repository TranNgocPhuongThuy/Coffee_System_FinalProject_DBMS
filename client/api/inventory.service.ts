import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import {
  CreateAdjustmentPayload,
  CreateImportTicketPayload,
  CreateIngredientPayload,
  IngredientItem,
  RecipeBOMPayload,
  ToppingBOMPayload,
  UpdateIngredientPayload,
} from '@/types/inventory';

export const inventoryService = {
  // 1. Ingredients
  getIngredients: async (params?: { name?: string; isLowStock?: boolean }): Promise<IngredientItem[]> => {
    const res = await apiClient.get(ENDPOINTS.INVENTORY.INGREDIENTS.INDEX, { params });
    return res.data?.data || res.data?.items || res.data || [];
  },

  getIngredientById: async (id: string | number): Promise<IngredientItem> => {
    const res = await apiClient.get(ENDPOINTS.INVENTORY.INGREDIENTS.DETAIL(id));
    return res.data?.data || res.data;
  },

  createIngredient: async (payload: CreateIngredientPayload) => {
    const res = await apiClient.post(ENDPOINTS.INVENTORY.INGREDIENTS.INDEX, payload);
    return res.data;
  },

  updateIngredient: async (id: string | number, payload: UpdateIngredientPayload) => {
    const res = await apiClient.put(ENDPOINTS.INVENTORY.INGREDIENTS.DETAIL(id), payload);
    return res.data;
  },

  deleteIngredient: async (id: string | number) => {
    const res = await apiClient.delete(ENDPOINTS.INVENTORY.INGREDIENTS.DETAIL(id));
    return res.data;
  },

  // 2. BOMs
  getRecipeBOMs: async (params?: { variantId?: number }) => {
    const res = await apiClient.get(ENDPOINTS.INVENTORY.BOMS.RECIPES, { params });
    return res.data?.data || res.data?.items || res.data || [];
  },

  getToppingBOMs: async (toppingId: string | number) => {
    const res = await apiClient.get(ENDPOINTS.INVENTORY.BOMS.TOPPING_DETAIL(toppingId));
    return res.data?.data || res.data?.items || res.data || [];
  },

  addRecipeBOMItem: async (payload: RecipeBOMPayload) => {
    const res = await apiClient.post(ENDPOINTS.INVENTORY.BOMS.RECIPES, payload);
    return res.data;
  },

  addToppingBOMItem: async (payload: ToppingBOMPayload) => {
    const res = await apiClient.post(ENDPOINTS.INVENTORY.BOMS.TOPPINGS, payload);
    return res.data;
  },

  deleteRecipeBOMItem: async (variantId: string | number, ingredientId: string | number) => {
    const res = await apiClient.delete(ENDPOINTS.INVENTORY.BOMS.DELETE_RECIPE(variantId, ingredientId));
    return res.data;
  },

  // 3. Imports
  getImports: async (params?: { supplierName?: string; fromDate?: string; toDate?: string }) => {
    const res = await apiClient.get(ENDPOINTS.INVENTORY.IMPORTS.INDEX, { params });
    return res.data?.data || res.data?.items || res.data || [];
  },

  getImportDetail: async (importId: string | number) => {
    const res = await apiClient.get(ENDPOINTS.INVENTORY.IMPORTS.DETAIL(importId));
    return res.data?.data || res.data;
  },

  createImportTicket: async (payload: CreateImportTicketPayload) => {
    const res = await apiClient.post(ENDPOINTS.INVENTORY.IMPORTS.INDEX, payload);
    return res.data;
  },

  // 4. Adjustments
  getAdjustments: async (params?: { ingredientId?: number; fromDate?: string; toDate?: string }) => {
    const res = await apiClient.get(ENDPOINTS.INVENTORY.ADJUSTMENTS.INDEX, { params });
    return res.data?.data || res.data?.items || res.data || [];
  },

  createAdjustment: async (payload: CreateAdjustmentPayload) => {
    const res = await apiClient.post(ENDPOINTS.INVENTORY.ADJUSTMENTS.INDEX, payload);
    return res.data;
  },
};

export default inventoryService;