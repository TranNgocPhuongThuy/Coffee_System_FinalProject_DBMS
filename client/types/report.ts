import { OrderChannel, OrderDetailItemStatus, OrderStatus } from './enums';

export interface RevenueOverviewReport {
  totalOrders: number;
  totalSubTotal: number;
  totalDiscount: number;
  netRevenue: number;
}

export interface DailyRevenueReport {
  revenueDate: string;
  totalOrders: number;
  totalOriginalAmount: number;
  totalDiscountAmount: number;
  totalNetRevenue: number;
}

export interface TopProductReport {
  productId?: number;
  productName: string;
  totalQuantitySold: number;
  totalRevenue: number;
}

export interface LowStockIngredientReport {
  id: number;
  name: string;
  unit: string;
  stockQuantity: number;
  minimumThreshold: number;
  shortageAmount: number;
}

export interface ProductRecipeDetailReport {
  productName: string;
  productSize: string;
  ingredientName: string;
  consumedQuantity: number;
  ingredientUnit: string;
}

export interface InvoiceDetailReport {
  orderId: number;
  orderCode: string;
  orderChannel: OrderChannel;
  orderStatus: OrderStatus;
  paymentMethod: string;
  subTotal: number;
  discountAmount: number;
  totalAmount: number;
  paidAt?: string | null;
  orderCreatedAt: string;
  employeeName?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  orderDetailId: number;
  itemSnapshotName: string;
  sizeSnapshot: string;
  quantity: number;
  unitPrice: number;
  totalToppingPriceSnapshot: number;
  lineTotalPrice: number;
  itemStatus: OrderDetailItemStatus;
  itemNote?: string | null;
}