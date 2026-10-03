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