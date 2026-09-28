USE CoffeeShopDB;
GO

-- 1. Lọc đơn hàng cho bảng điều khiển (Dashboard / POS)
CREATE NONCLUSTERED INDEX IX_Order_createdAt_status 
ON [Order] (createdAt DESC, status) 
INCLUDE (totalAmount, customerId, paymentMethod);
GO

-- 2. Tối ưu khi join lịch sử mua hàng của Customer
CREATE NONCLUSTERED INDEX IX_Order_customerId 
ON [Order] (customerId) 
INCLUDE (orderCode, totalAmount, createdAt, status) 
WHERE customerId IS NOT NULL;
GO

-- 3. Tối ưu tra cứu OrderDetail theo Order
CREATE NONCLUSTERED INDEX IX_OrderDetail_orderId 
ON OrderDetail (orderId) 
INCLUDE (variantId, quantity, unitPrice, totalPrice, itemStatus);
GO

-- 4. Tối ưu báo cáo mức nguyên liệu (Cảnh báo KDS / Kho)
CREATE NONCLUSTERED INDEX IX_Ingredient_stock_threshold 
ON Ingredient (stockQuantity, minimumThreshold) 
INCLUDE (name, unit);
GO

-- 5. Lọc Menu Category lên POS / App
CREATE NONCLUSTERED INDEX IX_Product_categoryId_status 
ON Product (categoryId, status) 
INCLUDE (name, image);
GO

-- 6. Xem lịch sử tích điểm của khách
CREATE NONCLUSTERED INDEX IX_LoyaltyTransaction_customerId_createdAt 
ON LoyaltyTransaction (customerId, createdAt DESC) 
INCLUDE (transactionType, points, balanceAfter);
GO