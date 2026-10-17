# Project Dump

**Root:** `C:\Programing\hqtcsdl\Coffee_System_FinalProject_DBMS\client\types`

**Generated:** 2026-10-17 21:39:15.778394

**Files:** 13 | **Total size:** 16,651 bytes

---

# api.ts

| Property | Value |
|----------|-------|
| Path | `api.ts` |
| Size | 1,855 bytes |
| Extension | `.ts` |
| Modified | 2026-10-17 21:23:55.052737 |

```typescript
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
```

# auth.ts

| Property | Value |
|----------|-------|
| Path | `auth.ts` |
| Size | 1,359 bytes |
| Extension | `.ts` |
| Modified | 2026-10-17 21:23:55.054735 |

```typescript
// Path: types/auth.ts
import { UserType } from './enums';
export type { UserType };

export type UserRole = 'ADMIN' | 'MANAGER' | 'CASHIER' | 'BARISTA' | 'STOREKEEPER' | 'CUSTOMER';

// Đăng nhập chung chuẩn Backend (2 trường)
export interface LoginPayload {
  identifier: string; // Tên đăng nhập (nhân viên) hoặc SĐT (khách hàng)
  password: string;
}

// Đăng ký khách hàng
export interface RegisterPayload {
  fullName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  address?: string;
}

export interface SetupPasswordPayload {
  phoneNumber: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserProfile {
  id: number;
  fullName: string;
  role: UserRole;
  userType: UserType;
  username?: string;
  phoneNumber?: string;
  rewardPoints?: number;
  membershipTier?: 'STANDARD' | 'SILVER' | 'GOLD' | 'DIAMOND';
}

export interface AuthResponseData {
  accessToken: string;
  user: UserProfile;
}

export interface CreateEmployeePayload {
  fullName: string;
  username: string;
  password: string;
  role: 'ADMIN' | 'MANAGER' | 'CASHIER' | 'BARISTA' | 'STOREKEEPER';
  phoneNumber?: string;
}
```

# common.ts

| Property | Value |
|----------|-------|
| Path | `common.ts` |
| Size | 451 bytes |
| Extension | `.ts` |
| Modified | 2026-10-17 21:23:55.055738 |

```typescript
export interface BaseEntity {
    id: number;
    createdAt: string;
    updatedAt?: string | null;
}

export interface SoftDeletableEntity extends BaseEntity {
    deletedAt?: string | null;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
```

# customer.ts

| Property | Value |
|----------|-------|
| Path | `customer.ts` |
| Size | 962 bytes |
| Extension | `.ts` |
| Modified | 2026-10-17 21:23:55.056737 |

```typescript
import { BaseEntity, SoftDeletableEntity } from './common';
import { LoyaltyTransactionType, MembershipTier } from './enums';

export interface Customer extends SoftDeletableEntity {
    phoneNumber: string;
    fullName: string;
    rewardPoints: number;
    membershipTier: MembershipTier;
}

export interface LoyaltyTransaction extends BaseEntity {
    customerId: number;
    customerName?: string | null;
    customerPhone?: string | null;
    orderId?: number | null;
    orderCode?: string | null;
    transactionType: LoyaltyTransactionType;
    points: number;
    balanceAfter: number;
    description?: string | null;
}

// DTO phản hồi từ View v_CustomerLoyaltySummary
export interface CustomerSummaryView {
    customerId: number;
    fullName: string;
    phoneNumber: string;
    membershipTier: MembershipTier;
    currentRewardPoints: number;
    totalPointsEarned: number;
    totalPointsRedeemed: number;
}
```

# enums.ts

| Property | Value |
|----------|-------|
| Path | `enums.ts` |
| Size | 1,485 bytes |
| Extension | `.ts` |
| Modified | 2026-10-17 21:23:55.057737 |

```typescript
// Bảng Employee (CK_Employee_role, CK_Employee_status)
export type EmployeeRole = 'ADMIN' | 'MANAGER' | 'CASHIER' | 'BARISTA' | 'STOREKEEPER';
export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';

// Định danh User Type trên Client (Hỗ trợ xác thực phân hệ Client/POS/Staff)
export type UserType = 'EMPLOYEE' | 'CUSTOMER';

// Bảng Customer (CK_Customer_tier)
export type MembershipTier = 'STANDARD' | 'SILVER' | 'GOLD' | 'DIAMOND';

// Bảng PagerDevice (CK_PagerDevice_status)
export type PagerStatus = 'IDLE' | 'AVAILABLE' | 'IN_USE' | 'CHARGING' | 'MAINTENANCE';

// Bảng Category, Product & ProductVariant
export type CategoryDisplayStatus = 'SHOW' | 'HIDE';
export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';
export type ProductSize = 'S' | 'M' | 'L' | 'XL';
export type ToppingStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'ACTIVE';

// Bảng Order & OrderDetail (CK_Order_channel, CK_Order_payment, CK_Order_status, CK_OrderDetail_itemStatus)
export type OrderChannel = 'POS' | 'APP' | 'DELIVERY' | 'ORDER_AT_COUNTER';
export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'CARD' | 'MOMO' | 'VNPAY' | 'POINT_EXCHANGE';
export type OrderStatus = | 'PENDING' | 'PENDING_PREP' | 'PREPARING' | 'READY' | 'READY_FOR_PICKUP' | 'PAID' | 'COMPLETED' | 'CANCELLED';
export type OrderDetailItemStatus = 'PENDING' | 'PREPARING' | 'READY' | 'DONE' | 'DELIVERED' | 'CANCELLED';
export type LoyaltyTransactionType = 'EARN' | 'REDEEM';
```

# index.ts

| Property | Value |
|----------|-------|
| Path | `index.ts` |
| Size | 374 bytes |
| Extension | `.ts` |
| Modified | 2026-10-17 21:23:55.058737 |

```typescript
// Path: types/index.ts
export * from './enums';
export * from './common';
export * from './api';
export * from './auth';
export * from './menu';
export * from './order';
export * from './pos';       // BỔ SUNG
export * from './inventory';
export * from './customer';
export * from './pager';
export * from './kds';       // BỔ SUNG
export * from './report';
```

# inventory.ts

| Property | Value |
|----------|-------|
| Path | `inventory.ts` |
| Size | 1,093 bytes |
| Extension | `.ts` |
| Modified | 2026-10-17 21:23:55.060735 |

```typescript
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
  employeeId?: number;
  newQuantity: number; // Backend đòi hỏi newQuantity, không bắt buộc truyền employeeId từ client
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
```

# kds.ts

| Property | Value |
|----------|-------|
| Path | `kds.ts` |
| Size | 1,590 bytes |
| Extension | `.ts` |
| Modified | 2026-10-17 21:23:55.061738 |

```typescript

// 1. Trạng thái của từng ly nước trong hàng đợi pha chế
export type KdsItemStatus = 'PENDING' | 'PREPARING' | 'DONE' | 'CANCELLED';

// 2. Trạng thái lọc trên thanh công cụ KDS (Khớp với QueryKdsQueueSchema backend)
export type KdsQueueStatusFilter = 'ALL' | 'PENDING' | 'PREPARING';

// 3. Topping đi kèm của từng ly nước
export interface KdsItemTopping {
  name: string;
  quantity: number;
}

// 4. Chi tiết một món cần pha chế (Khớp 100% câu SELECT từ kds.repo.ts)
export interface KdsQueueItem {
  orderId: number;
  orderCode: string;
  orderChannel: string;
  pagerCode: string | null;       // Cho phép null khi đơn không gắn thẻ rung
  batteryLevel: number | null;    // Cho phép null
  orderDetailId: number;
  itemSnapshotName: string;
  sizeSnapshot: string;
  quantity: number;
  note: string | null;            // Cho phép null khi khách không ghi chú
  itemStatus: KdsItemStatus;
  itemCreatedAt: string;          // ISO Date string
  waitingMinutes: number;         // DATEDIFF tính từ DB
  toppings: KdsItemTopping[];
}

// 5. Payload khi Barista bấm chuyển trạng thái món (Khớp UpdateItemStatusSchema backend)
export interface UpdateKdsItemStatusPayload {
  itemStatus: 'PREPARING' | 'DONE' | 'CANCELLED';
}

// 6. Response trả về từ API chuông báo sẵn sàng
export interface KdsNotifyReadyResponse {
  orderId: number;
  status: string;
  pagerId: number | null;
  itemsCompleted?: number;
  alarmTriggered: boolean;
  message: string;
}
```

# menu.ts

| Property | Value |
|----------|-------|
| Path | `menu.ts` |
| Size | 1,219 bytes |
| Extension | `.ts` |
| Modified | 2026-10-17 21:23:55.062739 |

```typescript
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
```

# order.ts

| Property | Value |
|----------|-------|
| Path | `order.ts` |
| Size | 1,832 bytes |
| Extension | `.ts` |
| Modified | 2026-10-17 21:23:55.063738 |

```typescript
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
```

# pager.ts

| Property | Value |
|----------|-------|
| Path | `pager.ts` |
| Size | 648 bytes |
| Extension | `.ts` |
| Modified | 2026-10-17 21:23:55.064739 |

```typescript
import { SoftDeletableEntity } from './common';
import { PagerStatus } from './enums';

export interface CreatePagerPayload {
  pagerCode?: string;
  status?: PagerStatus;
  batteryLevel?: number;
}

export interface PagerDevice extends SoftDeletableEntity {
  pagerCode: string;
  status: PagerStatus;
  batteryLevel: number;
}

// Phản hồi từ v_ActivePagerDashboard
export interface ActivePagerDashboardItem {
  pagerCode: string;
  pagerStatus: PagerStatus;
  batteryLevel: number;
  orderId: number;
  orderCode: string;
  customerName?: string | null;
  customerPhone?: string | null;
  waitingMinutes: number;
}
```

# pos.ts

| Property | Value |
|----------|-------|
| Path | `pos.ts` |
| Size | 2,217 bytes |
| Extension | `.ts` |
| Modified | 2026-10-17 21:23:55.066735 |

```typescript
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
```

# report.ts

| Property | Value |
|----------|-------|
| Path | `report.ts` |
| Size | 1,566 bytes |
| Extension | `.ts` |
| Modified | 2026-10-17 21:23:55.067738 |

```typescript
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
```

