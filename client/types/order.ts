import { BaseEntity, SoftDeletableEntity } from './common';
import { OrderChannel, OrderDetailItemStatus, OrderStatus, PaymentMethod, ProductSize } from './enums';
import { Topping } from './menu';

export interface OrderDetailTopping {
    id?: number;
    orderDetailId?: number;
    toppingId?: number | null;
    toppingSnapshotName: string;
    toppingPrice: number;
    quantity: number;
}

export interface OrderDetail extends BaseEntity {
    orderId: number;
    variantId?: number | null;
    quantity: number;
    note?: string | null;
    itemSnapshotName: string;
    sizeSnapshot: string;
    unitPrice: number;
    totalToppingPriceSnapshot: number;
    totalPrice: number;
    itemStatus: OrderDetailItemStatus;
    toppings?: OrderDetailTopping[];
}

export interface Order extends SoftDeletableEntity {
    orderCode: string;
    customerId?: number | null;
    customerName?: string | null;
    customerPhone?: string | null;
    pagerId?: number | null;
    pagerCode?: string | null;
    employeeId?: number | null;
    employeeName?: string | null;
    orderChannel: OrderChannel;
    subTotal: number;
    discountAmount: number;
    totalAmount: number;
    paymentMethod: PaymentMethod;
    status: OrderStatus;
    cancelReason?: string | null;
    paidAt?: string | null;
    pickupAt?: string | null;
    items?: OrderDetail[];
}

// Cấu trúc sản phẩm đang lưu trữ trong giỏ hàng POS (CartContext)
export interface CartItem {
    id: string; // Khóa tạm thời trên UI (uuid hoặc timestamp)
    productId: number;
    variantId: number;
    name: string;
    size: ProductSize;
    unitPrice: number;
    quantity: number;
    note?: string;
    toppings: Topping[];
    totalToppingPrice: number;
    totalPrice: number;
}