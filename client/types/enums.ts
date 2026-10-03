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