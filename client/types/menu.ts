import { BaseEntity, SoftDeletableEntity } from './common';
import { CategoryDisplayStatus, ProductSize, ProductStatus, ToppingStatus } from './enums';

export type { ProductSize, CategoryDisplayStatus, ProductStatus, ToppingStatus };

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
    priceRange?: string;
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