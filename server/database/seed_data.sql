
-- Tắt kiểm tra khóa ngoại tạm thời để dọn dẹp và nạp dữ liệu sạch
EXEC sp_MSforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT all";
GO
-- Tắt tạm thời trigger chặn sửa/xóa điểm
ALTER TABLE LoyaltyTransaction DISABLE TRIGGER trg_LoyaltyTransaction_AppendOnly;
GO

DELETE FROM OrderDetailTopping;
DELETE FROM OrderDetail;
DELETE FROM LoyaltyTransaction;
DELETE FROM [Order];
DELETE FROM RecipeBOM;
DELETE FROM ToppingBOM;
DELETE FROM InventoryAdjustment;
DELETE FROM InventoryImportDetail;
DELETE FROM InventoryImport;
DELETE FROM Ingredient;
DELETE FROM Topping;
DELETE FROM ProductVariant;
DELETE FROM Product;
DELETE FROM Category;
DELETE FROM PagerDevice;
DELETE FROM Customer;
DELETE FROM Employee;
GO

-- ==============================================================
-- 1. BẢNG NHÂN VIÊN (Employee) - 4 Role chính
-- ==============================================================
SET IDENTITY_INSERT Employee ON;
INSERT INTO Employee (id, fullName, username, password, role, phoneNumber, status, createdAt, updatedAt)
VALUES
(1, N'Đinh Đức Khang', 'manager01', '$2b$10$abcdefghijklmnopqrstuv', 'MANAGER', '0901111222', 'ACTIVE', GETDATE(), GETDATE()),
(2, N'Võ Thị Hồng Gấm', 'cashier01', '$2b$10$abcdefghijklmnopqrstuv', 'CASHIER', '0902222333', 'ACTIVE', GETDATE(), GETDATE()),
(3, N'Hồ Công Phong', 'barista01', '$2b$10$abcdefghijklmnopqrstuv', 'BARISTA', '0903333444', 'ACTIVE', GETDATE(), GETDATE()),
(4, N'Trần Ngọc Phương Thùy', 'storekeeper01', '$2b$10$abcdefghijklmnopqrstuv', 'STOREKEEPER', '0904444555', 'ACTIVE', GETDATE(), GETDATE());
SET IDENTITY_INSERT Employee OFF;
GO

-- ==============================================================
-- 2. BẢNG KHÁCH HÀNG (Customer) - Các phân hạng
-- ==============================================================
SET IDENTITY_INSERT Customer ON;
INSERT INTO Customer (id, phoneNumber, fullName, password, rewardPoints, membershipTier, createdAt, updatedAt)
VALUES
(1, '0988111222', N'Nguyễn Văn An', '$2b$10$abcdefghijklmnopqrstuv', 150, 'SILVER', GETDATE(), GETDATE()),
(2, '0977222333', N'Lê Thị Mai', '$2b$10$abcdefghijklmnopqrstuv', 550, 'GOLD', GETDATE(), GETDATE()),
(3, '0966333444', N'Trần Tuấn Kiệt', '$2b$10$abcdefghijklmnopqrstuv', 20, 'BRONZE', GETDATE(), GETDATE()),
(4, '0911888999', N'Phạm Hoàng Nam', '$2b$10$abcdefghijklmnopqrstuv', 1250, 'DIAMOND', GETDATE(), GETDATE());
SET IDENTITY_INSERT Customer OFF;
GO

-- ==============================================================
-- 3. BẢNG THIẾT BỊ THẺ RUNG (PagerDevice)
-- ==============================================================
SET IDENTITY_INSERT PagerDevice ON;
INSERT INTO PagerDevice (id, pagerCode, status, batteryLevel, createdAt, updatedAt)
VALUES
(1, 'P01', 'AVAILABLE', 95, GETDATE(), GETDATE()),
(2, 'P02', 'AVAILABLE', 80, GETDATE(), GETDATE()),
(3, 'P03', 'IN_USE', 60, GETDATE(), GETDATE()),
(4, 'P04', 'AVAILABLE', 100, GETDATE(), GETDATE()),
(5, 'P05', 'MAINTENANCE', 10, GETDATE(), GETDATE());
SET IDENTITY_INSERT PagerDevice OFF;
GO

-- ==============================================================
-- 4. BẢNG DANH MỤC (Category)
-- ==============================================================
SET IDENTITY_INSERT Category ON;
INSERT INTO Category (id, name, displayStatus, createdAt, updatedAt)
VALUES
(1, N'Cà Phê Truyền Thống', 'SHOW', GETDATE(), GETDATE()),
(2, N'Cà Phê Pha Máy (Espresso)', 'SHOW', GETDATE(), GETDATE()),
(3, N'Trà Sữa & Trà Trái Cây', 'SHOW', GETDATE(), GETDATE()),
(4, N'Đá Xay (Frappuccino)', 'SHOW', GETDATE(), GETDATE());
SET IDENTITY_INSERT Category OFF;
GO

-- ==============================================================
-- 5. BẢNG SẢN PHẨM (Product)
-- ==============================================================
SET IDENTITY_INSERT Product ON;
INSERT INTO Product (id, categoryId, name, description, image, status, createdAt, updatedAt)
VALUES
(1, 1, N'Cà Phê Sữa Đá', N'Hạt cà phê Robusta rang đậm phối hợp sữa đặc béo ngậy', 'https://images.unsplash.com/photo-1541167760496-1628856ab772', 'ACTIVE', GETDATE(), GETDATE()),
(2, 1, N'Bạc Xỉu', N'Nhiều sữa đặc, sữa tươi kết hợp một shot cà phê thơm dịu', 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38', 'ACTIVE', GETDATE(), GETDATE()),
(3, 2, N'Caramel Macchiato', N'Vani ngọt dịu kết hợp lớp foam sữa bồng bềnh và sốt caramel', 'https://images.unsplash.com/photo-1485808191679-5f86510681a2', 'ACTIVE', GETDATE(), GETDATE()),
(4, 3, N'Trà Đào Cam Sả', N'Trà đào thanh mát kết hợp tép cam vàng tươi mọng nước', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc', 'ACTIVE', GETDATE(), GETDATE());
SET IDENTITY_INSERT Product OFF;
GO

-- ==============================================================
-- 6. BẢNG BIẾN THỂ SIZE (ProductVariant)
-- ==============================================================
SET IDENTITY_INSERT ProductVariant ON;
INSERT INTO ProductVariant (id, productId, size, price, createdAt, updatedAt)
VALUES
(1, 1, 'S', 29000.00, GETDATE(), GETDATE()),
(2, 1, 'M', 35000.00, GETDATE(), GETDATE()),
(3, 1, 'L', 39000.00, GETDATE(), GETDATE()),
(4, 2, 'M', 35000.00, GETDATE(), GETDATE()),
(5, 2, 'L', 42000.00, GETDATE(), GETDATE()),
(6, 3, 'M', 49000.00, GETDATE(), GETDATE()),
(7, 3, 'L', 55000.00, GETDATE(), GETDATE()),
(8, 4, 'M', 45000.00, GETDATE(), GETDATE()),
(9, 4, 'L', 52000.00, GETDATE(), GETDATE());
SET IDENTITY_INSERT ProductVariant OFF;
GO

-- ==============================================================
-- 7. BẢNG TOPPING (Topping)
-- ==============================================================
SET IDENTITY_INSERT Topping ON;
INSERT INTO Topping (id, name, price, status, createdAt, updatedAt)
VALUES
(1, N'Trân Châu Trắng', 8000.00, 'ACTIVE', GETDATE(), GETDATE()),
(2, N'Kem Cheese Macchiato', 12000.00, 'ACTIVE', GETDATE(), GETDATE()),
(3, N'Shot Espresso Bổ Sung', 10000.00, 'ACTIVE', GETDATE(), GETDATE()),
(4, N'Đào Miếng Thêm (2 miếng)', 10000.00, 'ACTIVE', GETDATE(), GETDATE());
SET IDENTITY_INSERT Topping OFF;
GO

-- ==============================================================
-- 8. BẢNG NGUYÊN LIỆU KHO (Ingredient)
-- ==============================================================
SET IDENTITY_INSERT Ingredient ON;
INSERT INTO Ingredient (id, name, unit, stockQuantity, minimumThreshold, createdAt, updatedAt)
VALUES
(1, N'Hạt Cà Phê Robusta', 'kg', 12.500, 3.000, GETDATE(), GETDATE()),
(2, N'Hạt Cà Phê Arabica Cầu Đất', 'kg', 8.200, 2.000, GETDATE(), GETDATE()),
(3, N'Sữa Đặc Ngôi Sao Phương Nam', 'lon', 45.000, 10.000, GETDATE(), GETDATE()),
(4, N'Sữa Tươi Thanh Trùng DalatMilk', 'lit', 18.000, 5.000, GETDATE(), GETDATE()),
(5, N'Siro Đào Monin', 'chai', 4.000, 1.000, GETDATE(), GETDATE()),
(6, N'Trà Đen Phúc Long', 'kg', 5.000, 1.500, GETDATE(), GETDATE()),
(7, N'Bột Kem Phô Mai Cheese', 'kg', 1.200, 2.000, GETDATE(), GETDATE()); -- Cảnh báo sắp hết
SET IDENTITY_INSERT Ingredient OFF;
GO

-- ==============================================================
-- 9. BẢNG CÔNG THỨC MÓN (RecipeBOM)
-- ==============================================================
INSERT INTO RecipeBOM (variantId, ingredientId, consumedQuantity)
VALUES
-- Cà phê sữa đá Size S: 0.02kg cà phê + 0.08 lon sữa đặc
(1, 1, 0.020),
(1, 3, 0.080),
-- Cà phê sữa đá Size M: 0.025kg cà phê + 0.1 lon sữa đặc
(2, 1, 0.025),
(2, 3, 0.100),
-- Cà phê sữa đá Size L: 0.03kg cà phê + 0.12 lon sữa đặc
(3, 1, 0.030),
(3, 3, 0.120),
-- Bạc xỉu Size M: 0.015kg cà phê + 0.1 lon sữa đặc + 0.15 lit sữa tươi
(4, 1, 0.015),
(4, 3, 0.100),
(4, 4, 0.150),
-- Caramel Macchiato Size M: 0.02kg Arabica + 0.22 lit sữa tươi
(6, 2, 0.020),
(6, 4, 0.220),
-- Trà đào cam sả Size M: 0.015kg Trà đen + 0.03 chai siro đào
(8, 6, 0.015),
(8, 5, 0.030);
GO

-- ==============================================================
-- 10. BẢNG CÔNG THỨC TOPPING (ToppingBOM)
-- ==============================================================
INSERT INTO ToppingBOM (toppingId, ingredientId, consumedQuantity)
VALUES
(2, 7, 0.030), -- Kem Cheese tiêu hao 0.03kg bột kem phô mai
(2, 4, 0.050), -- Kem Cheese tiêu hao 0.05 lit sữa tươi
(3, 1, 0.018); -- Shot Espresso thêm tiêu hao 0.018kg cà phê Robusta
GO

-- ==============================================================
-- 11. NHẬP KHO NGUYÊN LIỆU (InventoryImport & Detail)
-- ==============================================================
SET IDENTITY_INSERT InventoryImport ON;
INSERT INTO InventoryImport (id, supplierName, employeeId, totalAmount, importDate, note)
VALUES
(1, N'Công ty Cổ Phần Cà Phê Trung Nguyên', 4, 2500000.00, DATEADD(DAY, -5, GETDATE()), N'Nhập định kỳ đầu tuần');
SET IDENTITY_INSERT InventoryImport OFF;

INSERT INTO InventoryImportDetail (importId, ingredientId, quantity, unitPrice, totalLineAmount)
VALUES
(1, 1, 10.000, 180000.00, 1800000.00),
(1, 3, 35.000, 20000.00, 700000.00);
GO

-- ==============================================================
-- 12. KIỂM KÊ / ĐIỀU CHỈNH KHO (InventoryAdjustment)
-- ==============================================================
SET IDENTITY_INSERT InventoryAdjustment ON;
INSERT INTO InventoryAdjustment (id, ingredientId, employeeId, oldQuantity, newQuantity, difference, reason, adjustmentDate)
VALUES
(1, 4, 4, 20.000, 18.000, -2.000, N'Hao hụt đổ tràn trong quá trình pha chế buổi sáng', DATEADD(DAY, -1, GETDATE()));
SET IDENTITY_INSERT InventoryAdjustment OFF;
GO

-- ==============================================================
-- 13. ĐƠN HÀNG (Order, OrderDetail, OrderDetailTopping)
-- ==============================================================
SET IDENTITY_INSERT [Order] ON;
INSERT INTO [Order] (
    id, orderCode, orderChannel, pagerId, employeeId, customerId, 
    subTotal, discountAmount, totalAmount, paymentMethod, status, 
    paidAt, createdAt, updatedAt
)
VALUES
-- Đơn 1: Đã thanh toán, hoàn tất hôm qua
(1, 'ORD260901', 'ORDER_AT_COUNTER', 1, 2, 1, 47000.00, 0.00, 47000.00, 'BANK_TRANSFER', 'COMPLETED', DATEADD(DAY, -1, GETDATE()), DATEADD(DAY, -1, GETDATE()), DATEADD(DAY, -1, GETDATE())),
-- Đơn 2: Đang chờ pha chế trên KDS
(2, 'ORD260902', 'ORDER_AT_COUNTER', 3, 2, 2, 84000.00, 10000.00, 74000.00, 'CASH', 'PENDING_PREP', GETDATE(), GETDATE(), GETDATE());
SET IDENTITY_INSERT [Order] OFF;
GO

SET IDENTITY_INSERT OrderDetail ON;
INSERT INTO OrderDetail (
    id, orderId, variantId, quantity, note, itemSnapshotName, sizeSnapshot, 
    unitPrice, totalToppingPriceSnapshot, totalPrice, itemStatus, createdAt, updatedAt
)
VALUES
-- Chi tiết Đơn 1: 1 Cà phê sữa M + Trân châu trắng (35k + 8k = 43k)
(1, 1, 2, 1, N'Ít ngọt, nhiều đá', N'Cà Phê Sữa Đá', 'M', 35000.00, 8000.00, 43000.00, 'DONE', DATEADD(DAY, -1, GETDATE()), DATEADD(DAY, -1, GETDATE())),
-- Chi tiết Đơn 2: 1 Caramel Macchiato L (55k) và 1 Bạc xỉu M (35k)
(2, 2, 7, 1, N'Nóng', N'Caramel Macchiato', 'L', 55000.00, 0.00, 55000.00, 'PENDING', GETDATE(), GETDATE()),
(3, 2, 4, 1, N'Bình thường', N'Bạc Xỉu', 'M', 35000.00, 0.00, 35000.00, 'PENDING', GETDATE(), GETDATE());
SET IDENTITY_INSERT OrderDetail OFF;
GO

INSERT INTO OrderDetailTopping (orderDetailId, toppingId, toppingSnapshotName, toppingPrice, quantity)
VALUES
(1, 1, N'Trân Châu Trắng', 8000.00, 1);
GO


-- ==============================================================
-- 14. LỊCH SỬ BIẾN ĐỘNG ĐIỂM (LoyaltyTransaction)
-- ==============================================================

-- 1. Tắt tạm thời trigger chặn xóa/sửa lịch sử điểm
ALTER TABLE LoyaltyTransaction DISABLE TRIGGER trg_LoyaltyTransaction_AppendOnly;
GO

-- 2. Xóa dữ liệu rác/dữ liệu do Trigger tự chèn trước đó
DELETE FROM LoyaltyTransaction;
GO

-- 3. Tiến hành chèn dữ liệu mẫu chuẩn
SET IDENTITY_INSERT LoyaltyTransaction ON;
INSERT INTO LoyaltyTransaction (id, customerId, orderId, transactionType, points, balanceAfter, description, createdAt)
VALUES
(1, 1, 1, 'EARN', 4, 150, N'Tích lũy điểm từ hóa đơn ORD260901', DATEADD(DAY, -1, GETDATE())),
(2, 2, 2, 'REDEEM', 10, 550, N'Đổi 10 điểm giảm 10.000 VNĐ cho đơn ORD260902', GETDATE());
SET IDENTITY_INSERT LoyaltyTransaction OFF;
GO

-- 4. Bật lại trigger bảo vệ sổ cái điểm
ALTER TABLE LoyaltyTransaction ENABLE TRIGGER trg_LoyaltyTransaction_AppendOnly;
GO

-- Bật lại kiểm tra toàn vẹn khóa ngoại
EXEC sp_MSforeachtable "ALTER TABLE ? WITH CHECK CHECK CONSTRAINT all";
GO