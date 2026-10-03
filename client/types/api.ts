import { OrderChannel, PaymentMethod } from './enums';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
  errors?: Record<string, string[]>;
}

// Map chính xác udt_OrderDetailList trong SQL
export interface CreateOrderDetailDto {
  variantId: number;
  quantity: number;
  note?: string;
  itemSnapshotName: string;
  sizeSnapshot: string;
  unitPrice: number;
  totalToppingPriceSnapshot: number;
  totalPrice: number;
  toppingIds?: number[];
}

// Tham số đầu vào cho sp_CreateOrderWithPager
export interface CreateOrderWithPagerDto {
  orderCode: string;
  orderChannel: OrderChannel;
  pagerCode: string;
  employeeId: number;
  customerId?: number | null;
  subTotal: number;
  discountAmount?: number;
  paymentMethod: PaymentMethod;
  orderDetails: CreateOrderDetailDto[];
}

// Tham số đầu vào cho sp_CreateCounterOrder
export interface CreateCounterOrderDto {
  orderCode: string;
  employeeId: number;
  customerId?: number | null;
  pagerId?: number | null;
  subTotal: number;
  discountAmount?: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  orderDetails: CreateOrderDetailDto[];
}

// Map chính xác udt_InventoryImportDetailList trong SQL
export interface CreateInventoryImportDetailDto {
  ingredientId: number;
  quantity: number;
  unitPrice: number;
  totalLineAmount: number;
}

// Tham số đầu vào cho sp_CreateInventoryImport
export interface CreateInventoryImportDto {
  supplierName: string;
  employeeId: number;
  note?: string;
  importDetails: CreateInventoryImportDetailDto[];
}

// Tham số đầu vào cho sp_DieuChinhTonKho
export interface AdjustStockDto {
  ingredientId: number;
  employeeId: number;
  newQuantity: number;
  reason: string;
}