// Path: types/pos.ts
import { OrderChannel, OrderStatus, PaymentMethod } from './enums';

export interface OrderItemToppingPayload {
  toppingId?: number | null;
  toppingSnapshotName: string;
  toppingPrice: number;
  quantity?: number;
}

export interface OrderItemPayload {
  variantId: number;
  quantity: number;
  note?: string | null;
  itemSnapshotName: string;
  sizeSnapshot: string;
  unitPrice: number;
  totalToppingPriceSnapshot?: number;
  totalPrice: number;
  toppings?: OrderItemToppingPayload[];
}

export interface CreateOrderPayload {
  orderCode?: string;
  employeeId: number;
  customerId?: number | null;
  pagerId?: number | null;
  pagerCode?: string | null;
  orderChannel?: OrderChannel;
  subTotal: number;
  discountAmount?: number;
  totalAmount: number;
  paymentMethod?: PaymentMethod;
  items: OrderItemPayload[];
}

export interface FilterOrderParams {
  search?: string;
  status?: OrderStatus;
  paymentMethod?: string;
  orderChannel?: string;
  employeeId?: number;
  customerId?: number;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export interface OrderDetailItem {
  id: number;
  orderId: number;
  variantId: number;
  quantity: number;
  note?: string;
  itemSnapshotName: string;
  sizeSnapshot: string;
  unitPrice: number;
  totalToppingPriceSnapshot: number;
  totalPrice: number;
  itemStatus: string;
  createdAt: string;
  toppings?: {
    id: number;
    toppingSnapshotName: string;
    toppingPrice: number;
    quantity: number;
  }[];
}

export interface OrderItemResponse {
  id: number;
  orderCode: string;
  orderChannel: string;
  status: OrderStatus;
  paymentMethod: string;
  subTotal: number;
  discountAmount: number;
  totalAmount: number;
  paidAt?: string;
  pickupAt?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt?: string;
  employeeId?: number;
  employeeName?: string;
  customerId?: number;
  customerName?: string;
  customerPhone?: string;
  customerTier?: string;
  customerPoints?: number;
  pagerId?: number;
  pagerCode?: string;
  pagerStatus?: string;
  items?: OrderDetailItem[];
}