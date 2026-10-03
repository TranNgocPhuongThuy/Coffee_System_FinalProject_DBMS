export interface IngredientItem {
  id: number;
  name: string;
  unit: string;
  stockQuantity: number;
  minimumThreshold: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateIngredientPayload {
  name: string;
  unit: string;
  stockQuantity?: number;
  minimumThreshold?: number;
}

export interface UpdateIngredientPayload extends Partial<CreateIngredientPayload> {}

export interface CreateAdjustmentPayload {
  ingredientId: number;
  employeeId: number;
  newQuantity: number; // Backend đòi hỏi newQuantity, không phải actualQuantity
  reason: string;
}

export interface CreateImportTicketPayload {
  supplierName: string;
  employeeId: number;
  note?: string;
  details: {
    ingredientId: number;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface RecipeBOMPayload {
  variantId: number;
  ingredientId: number;
  consumedQuantity: number;
}

export interface ToppingBOMPayload {
  toppingId: number;
  ingredientId: number;
  consumedQuantity: number;
}