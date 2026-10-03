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
