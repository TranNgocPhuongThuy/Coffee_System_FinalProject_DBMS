
-- ==============================================================
-- BƯỚC 0: DỌN DẸP DỮ LIỆU SẠCH SẼ (VÔ HIỆU HÓA RÀNG BUỘC & TRIGGER)
-- ==============================================================

-- 1. Tắt tạm thời kiểm tra khóa ngoại
EXEC sp_MSforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT all";
GO

-- 2. Tắt toàn bộ các Trigger INSTEAD OF DELETE và Trigger nghiệp vụ để xóa sạch bản ghi cũ
IF OBJECT_ID('trg_Customer_SoftDelete', 'TR') IS NOT NULL 
    ALTER TABLE Customer DISABLE TRIGGER trg_Customer_SoftDelete;
IF OBJECT_ID('trg_PagerDevice_SoftDelete', 'TR') IS NOT NULL 
    ALTER TABLE PagerDevice DISABLE TRIGGER trg_PagerDevice_SoftDelete;
IF OBJECT_ID('trg_LoyaltyTransaction_AppendOnly', 'TR') IS NOT NULL 
    ALTER TABLE LoyaltyTransaction DISABLE TRIGGER trg_LoyaltyTransaction_AppendOnly;
IF OBJECT_ID('trg_LoyaltyTransaction_SyncPoints', 'TR') IS NOT NULL 
    ALTER TABLE LoyaltyTransaction DISABLE TRIGGER trg_LoyaltyTransaction_SyncPoints;
IF OBJECT_ID('trg_OrderDetail_CheckInventory', 'TR') IS NOT NULL 
    ALTER TABLE OrderDetail DISABLE TRIGGER trg_OrderDetail_CheckInventory;
IF OBJECT_ID('trg_OrderDetail_DeductInventory', 'TR') IS NOT NULL 
    ALTER TABLE OrderDetail DISABLE TRIGGER trg_OrderDetail_DeductInventory;
IF OBJECT_ID('trg_InventoryImportDetail_AddInventory', 'TR') IS NOT NULL 
    ALTER TABLE InventoryImportDetail DISABLE TRIGGER trg_InventoryImportDetail_AddInventory;
GO

-- 3. Đảm bảo tắt mọi cờ IDENTITY_INSERT đang bị treo từ phiên trước
SET IDENTITY_INSERT Employee OFF;
SET IDENTITY_INSERT Customer OFF;
SET IDENTITY_INSERT PagerDevice OFF;
SET IDENTITY_INSERT Category OFF;
SET IDENTITY_INSERT Product OFF;
SET IDENTITY_INSERT ProductVariant OFF;
SET IDENTITY_INSERT Topping OFF;
SET IDENTITY_INSERT Ingredient OFF;
SET IDENTITY_INSERT InventoryImport OFF;
SET IDENTITY_INSERT InventoryImportDetail OFF;
SET IDENTITY_INSERT InventoryAdjustment OFF;
SET IDENTITY_INSERT [Order] OFF;
SET IDENTITY_INSERT OrderDetail OFF;
SET IDENTITY_INSERT OrderDetailTopping OFF;
SET IDENTITY_INSERT LoyaltyTransaction OFF;
GO

-- 4. Xóa sạch dữ liệu cũ
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
-- 1. BẢNG NHÂN VIÊN (Employee) - 4 Role
-- ==============================================================
SET IDENTITY_INSERT Employee ON;
INSERT INTO Employee (id, fullName, username, password, role, phoneNumber, status, createdAt, updatedAt)
VALUES
(1, N'Đinh Đức Khang', 'manager01', '$2b$10$N74QV.3xVyajn.V6so9uS.3f4ahiPitcAqC.nPV4sepOL2nOL5lpW', 'MANAGER', '0901111222', 'ACTIVE', GETDATE(), GETDATE()),
(2, N'Võ Thị Hồng Gấm', 'cashier01', '$2b$10$N74QV.3xVyajn.V6so9uS.3f4ahiPitcAqC.nPV4sepOL2nOL5lpW', 'CASHIER', '0902222333', 'ACTIVE', GETDATE(), GETDATE()),
(3, N'Hồ Công Phong', 'barista01', '$2b$10$N74QV.3xVyajn.V6so9uS.3f4ahiPitcAqC.nPV4sepOL2nOL5lpW', 'BARISTA', '0903333444', 'ACTIVE', GETDATE(), GETDATE()),
(4, N'Trần Ngọc Phương Thùy', 'storekeeper01', '$2b$10$N74QV.3xVyajn.V6so9uS.3f4ahiPitcAqC.nPV4sepOL2nOL5lpW', 'STOREKEEPER', '0904444555', 'ACTIVE', GETDATE(), GETDATE());
SET IDENTITY_INSERT Employee OFF;
GO

-- ==============================================================
-- 2. BẢNG KHÁCH HÀNG (Customer) - Chuẩn hóa điểm & hạng thẻ
-- ==============================================================
SET IDENTITY_INSERT Customer ON;
INSERT INTO Customer (id, phoneNumber, fullName, password, address, rewardPoints, membershipTier, createdAt, updatedAt)
VALUES
(1, '0988111222', N'Nguyễn Văn An', '$2b$10$N74QV.3xVyajn.V6so9uS.3f4ahiPitcAqC.nPV4sepOL2nOL5lpW', N'Số 1 Võ Văn Ngân, TP. Thủ Đức', 250, 'SILVER', GETDATE(), GETDATE()),
(2, '0977222333', N'Lê Thị Mai', '$2b$10$N74QV.3xVyajn.V6so9uS.3f4ahiPitcAqC.nPV4sepOL2nOL5lpW', N'123 Lê Văn Việt, TP. Thủ Đức', 550, 'GOLD', GETDATE(), GETDATE()),
(3, '0966333444', N'Trần Tuấn Kiệt', '$2b$10$N74QV.3xVyajn.V6so9uS.3f4ahiPitcAqC.nPV4sepOL2nOL5lpW', N'45 Kha Vạn Cân, TP. Thủ Đức', 20, 'STANDARD', GETDATE(), GETDATE()),
(4, '0911888999', N'Phạm Hoàng Nam', '$2b$10$N74QV.3xVyajn.V6so9uS.3f4ahiPitcAqC.nPV4sepOL2nOL5lpW', N'10 Đặng Văn Bi, TP. Thủ Đức', 1250, 'DIAMOND', GETDATE(), GETDATE()),
(5, '0933555777', N'Hoàng Thu Trang', '$2b$10$N74QV.3xVyajn.V6so9uS.3f4ahiPitcAqC.nPV4sepOL2nOL5lpW', N'78 Tô Ngọc Vân, TP. Thủ Đức', 320, 'SILVER', GETDATE(), GETDATE());
SET IDENTITY_INSERT Customer OFF;
GO

-- ==============================================================
-- 3. BẢNG THIẾT BỊ THẺ RUNG (PagerDevice)
-- ==============================================================
SET IDENTITY_INSERT PagerDevice ON;
INSERT INTO PagerDevice (id, pagerCode, status, batteryLevel, createdAt, updatedAt)
VALUES
(1, 'P01', 'AVAILABLE', 100, GETDATE(), GETDATE()),
(2, 'P02', 'AVAILABLE', 90, GETDATE(), GETDATE()),
(3, 'P03', 'IN_USE', 65, GETDATE(), GETDATE()),
(4, 'P04', 'AVAILABLE', 85, GETDATE(), GETDATE()),
(5, 'P05', 'AVAILABLE', 95, GETDATE(), GETDATE()),
(6, 'P06', 'AVAILABLE', 100, GETDATE(), GETDATE()),
(7, 'P07', 'CHARGING', 25, GETDATE(), GETDATE()),
(8, 'P08', 'MAINTENANCE', 10, GETDATE(), GETDATE());
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
(4, N'Đá Xay & Sữa Chua (Specialty)', 'SHOW', GETDATE(), GETDATE());
SET IDENTITY_INSERT Category OFF;
GO

-- ==============================================================
-- 5. BẢNG SẢN PHẨM (Product) - 22 Món đồ uống phong phú
-- ==============================================================
SET IDENTITY_INSERT Product ON;
INSERT INTO Product (id, categoryId, name, description, image, status, createdAt, updatedAt)
VALUES
-- Danh mục 1: Cà Phê Truyền Thống (6 món)
(1, 1, N'Cà Phê Đen Đá', N'Hạt cà phê Robusta nguyên chất rang mộc, đậm vị truyền thống phin Việt Nam', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600', 'ACTIVE', GETDATE(), GETDATE()),
(2, 1, N'Cà Phê Sữa Đá', N'Cà phê phin đậm đà kết hợp hoàn hảo cùng sữa đặc béo ngậy thơm ngon', 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600', 'ACTIVE', GETDATE(), GETDATE()),
(3, 1, N'Bạc Xỉu', N'Nhiều sữa đặc ngọt ngào và sữa tươi thanh trùng, điểm xuyết một shot cà phê thơm dịu', 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600', 'ACTIVE', GETDATE(), GETDATE()),
(4, 1, N'Cà Phê Muối Biển', N'Vị đắng thơm của Robusta hòa quyện cùng lớp kem muối béo mặn sánh mịn', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600', 'ACTIVE', GETDATE(), GETDATE()),
(5, 1, N'Cà Phê Trứng Hà Nội', N'Lớp kem trứng đánh bông mịn màng vàng óng phủ trên nền cà phê nóng thơm phức', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_qCZsP-fnMldkAEGcmt7nqjRU9MFvLBBVufkNCaxuca5EW7qfqOtLlzTR&s=10', 'ACTIVE', GETDATE(), GETDATE()),
(6, 1, N'Cà Phê Cốt Dừa Đá Xay', N'Cà phê đen truyền thống quyện cùng nước cốt dừa đá xay ngọt ngào, thơm nức mũi', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600', 'ACTIVE', GETDATE(), GETDATE()),

-- Danh mục 2: Cà Phê Pha Máy (Espresso) (5 món)
(7, 2, N'Espresso Đậm Vị', N'Một shot cà phê Arabica chiết xuất áp suất cao, lớp crema dày vàng ươm chuẩn Ý', 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600', 'ACTIVE', GETDATE(), GETDATE()),
(8, 2, N'Americano Đá', N'Cà phê Espresso pha loãng với nước tinh khiết, thanh dịu sảng khoái suốt ngày dài', 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=600', 'ACTIVE', GETDATE(), GETDATE()),
(9, 2, N'Caffe Latte', N'Sự kết hợp mượt mà giữa một shot espresso và lớp sữa tươi hấp mịn màng nghệ thuật', 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=600', 'ACTIVE', GETDATE(), GETDATE()),
(10, 2, N'Cappuccino', N'Hương vị espresso cân bằng cùng lớp bọt sữa dày bồng bềnh, rắc bột cacao thơm', 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600', 'ACTIVE', GETDATE(), GETDATE()),
(11, 2, N'Caramel Macchiato', N'Vị vani ngọt thanh kết hợp foam sữa tươi và vệt sốt caramel óng ánh quyến rũ', 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=600', 'ACTIVE', GETDATE(), GETDATE()),

-- Danh mục 3: Trà Sữa & Trà Trái Cây (6 món)
(12, 3, N'Trà Đào Cam Sả', N'Trà đen ủ lạnh thanh mát quyện cùng miếng đào ngâm giòn ngọt và tép cam vàng tươi', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600', 'ACTIVE', GETDATE(), GETDATE()),
(13, 3, N'Trà Vải Hoa Hồng', N'Hương hoa hồng dịu dàng kết hợp trà lài thanh tao và những quả vải mọng nước', 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=600', 'ACTIVE', GETDATE(), GETDATE()),
(14, 3, N'Trà Sữa Phúc Long Truyền Thống', N'Trà đen hảo hạng pha cùng sữa béo thơm lừng, đậm đà vị trà khó quên', 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=600', 'ACTIVE', GETDATE(), GETDATE()),
(15, 3, N'Trà Sữa Ô Long Nướng', N'Lá trà Ô Long sấy chậm mang hương khói nướng đặc trưng kết hợp sữa béo ngọt dịu', 'https://horecavn.com/wp-content/uploads/2024/05/tra-sua-oolong-kem-trung-nuong_20240527104523.jpg', 'ACTIVE', GETDATE(), GETDATE()),
(16, 3, N'Trà Mãng Cầu Tươi', N'Thịt mãng cầu xiêm chua ngọt tự nhiên dầm cùng trà lài ướp lạnh giải nhiệt cực đã', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600', 'ACTIVE', GETDATE(), GETDATE()),
(17, 3, N'Trà Ổi Hồng Muối Ớt', N'Trà lài thanh mát hòa quyện sốt ổi hồng thơm ngát và lớp bọt muối ớt cay nhẹ độc đáo', 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600', 'ACTIVE', GETDATE(), GETDATE()),

-- Danh mục 4: Đá Xay & Sữa Chua (Specialty) (5 món)
(18, 4, N'Matcha Đá Xay Kem Cheese', N'Bột trà xanh Matcha Uji thượng hạng xay cùng sữa béo, phủ lớp kem cheese mặn mòi', 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600', 'ACTIVE', GETDATE(), GETDATE()),
(19, 4, N'Mocha Frappuccino', N'Espresso đậm vị xay cùng sốt sô-cô-la đen nguyên chất và lớp kem tươi whipping cream', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600', 'ACTIVE', GETDATE(), GETDATE()),
(20, 4, N'Sữa Chua Trân Châu Đường Đen', N'Sữa chua lên men tự nhiên mát lạnh ăn kèm trân châu hoàng kim nấu đường nâu ấm dẻo', 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600', 'ACTIVE', GETDATE(), GETDATE()),
(21, 4, N'Chocolate Đá Xay Bánh Cookie', N'Vị cacao thơm béo xay nhuyễn cùng vụn bánh Oreo giòn rụm và sốt chocolate đậm đà', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600', 'ACTIVE', GETDATE(), GETDATE()),
(22, 4, N'Sinh Tố Bơ Dừa Thượng Hạng', N'Thịt bơ sáp Đắk Lắk dẻo quánh xay cùng nước cốt dừa béo thơm mát lịm ngày hè', 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600', 'ACTIVE', GETDATE(), GETDATE());
SET IDENTITY_INSERT Product OFF;
GO

-- ==============================================================
-- 6. BẢNG BIẾN THỂ SIZE (ProductVariant) - Đầy đủ Size S, M, L cho 22 món
-- ==============================================================
SET IDENTITY_INSERT ProductVariant ON;
INSERT INTO ProductVariant (id, productId, size, price, createdAt, updatedAt)
VALUES
-- Món 1: Cà Phê Đen Đá
(1, 1, 'S', 22000.00, GETDATE(), GETDATE()), (2, 1, 'M', 28000.00, GETDATE(), GETDATE()), (3, 1, 'L', 32000.00, GETDATE(), GETDATE()),
-- Món 2: Cà Phê Sữa Đá
(4, 2, 'S', 29000.00, GETDATE(), GETDATE()), (5, 2, 'M', 35000.00, GETDATE(), GETDATE()), (6, 2, 'L', 39000.00, GETDATE(), GETDATE()),
-- Món 3: Bạc Xỉu
(7, 3, 'M', 35000.00, GETDATE(), GETDATE()), (8, 3, 'L', 42000.00, GETDATE(), GETDATE()),
-- Món 4: Cà Phê Muối Biển
(9, 4, 'M', 39000.00, GETDATE(), GETDATE()), (10, 4, 'L', 45000.00, GETDATE(), GETDATE()),
-- Món 5: Cà Phê Trứng Hà Nội
(11, 5, 'M', 45000.00, GETDATE(), GETDATE()),
-- Món 6: Cà Phê Cốt Dừa Đá Xay
(12, 6, 'M', 45000.00, GETDATE(), GETDATE()), (13, 6, 'L', 52000.00, GETDATE(), GETDATE()),
-- Món 7: Espresso
(14, 7, 'S', 30000.00, GETDATE(), GETDATE()), (15, 7, 'M', 38000.00, GETDATE(), GETDATE()),
-- Món 8: Americano Đá
(16, 8, 'M', 35000.00, GETDATE(), GETDATE()), (17, 8, 'L', 42000.00, GETDATE(), GETDATE()),
-- Món 9: Caffe Latte
(18, 9, 'M', 45000.00, GETDATE(), GETDATE()), (19, 9, 'L', 52000.00, GETDATE(), GETDATE()),
-- Món 10: Cappuccino
(20, 10, 'M', 45000.00, GETDATE(), GETDATE()), (21, 10, 'L', 52000.00, GETDATE(), GETDATE()),
-- Món 11: Caramel Macchiato
(22, 11, 'M', 49000.00, GETDATE(), GETDATE()), (23, 11, 'L', 55000.00, GETDATE(), GETDATE()),
-- Món 12: Trà Đào Cam Sả
(24, 12, 'M', 45000.00, GETDATE(), GETDATE()), (25, 12, 'L', 52000.00, GETDATE(), GETDATE()),
-- Món 13: Trà Vải Hoa Hồng
(26, 13, 'M', 45000.00, GETDATE(), GETDATE()), (27, 13, 'L', 52000.00, GETDATE(), GETDATE()),
-- Món 14: Trà Sữa Phúc Long
(28, 14, 'M', 39000.00, GETDATE(), GETDATE()), (29, 14, 'L', 47000.00, GETDATE(), GETDATE()),
-- Món 15: Trà Sữa Ô Long Nướng
(30, 15, 'M', 42000.00, GETDATE(), GETDATE()), (31, 15, 'L', 49000.00, GETDATE(), GETDATE()),
-- Món 16: Trà Mãng Cầu Tươi
(32, 16, 'M', 45000.00, GETDATE(), GETDATE()), (33, 16, 'L', 52000.00, GETDATE(), GETDATE()),
-- Món 17: Trà Ổi Hồng Muối Ớt
(34, 17, 'M', 45000.00, GETDATE(), GETDATE()), (35, 17, 'L', 52000.00, GETDATE(), GETDATE()),
-- Món 18: Matcha Đá Xay Kem Cheese
(36, 18, 'M', 55000.00, GETDATE(), GETDATE()), (37, 18, 'L', 62000.00, GETDATE(), GETDATE()),
-- Món 19: Mocha Frappuccino
(38, 19, 'M', 55000.00, GETDATE(), GETDATE()), (39, 19, 'L', 62000.00, GETDATE(), GETDATE()),
-- Món 20: Sữa Chua Trân Châu Đường Đen
(40, 20, 'M', 39000.00, GETDATE(), GETDATE()), (41, 20, 'L', 45000.00, GETDATE(), GETDATE()),
-- Món 21: Chocolate Đá Xay Bánh Cookie
(42, 21, 'M', 52000.00, GETDATE(), GETDATE()), (43, 21, 'L', 59000.00, GETDATE(), GETDATE()),
-- Món 22: Sinh Tố Bơ Dừa Thượng Hạng
(44, 22, 'M', 55000.00, GETDATE(), GETDATE()), (45, 22, 'L', 65000.00, GETDATE(), GETDATE());
SET IDENTITY_INSERT ProductVariant OFF;
GO

-- ==============================================================
-- 7. BẢNG TOPPING (Topping)
-- ==============================================================
SET IDENTITY_INSERT Topping ON;
INSERT INTO Topping (id, name, price, status, createdAt, updatedAt)
VALUES
(1, N'Trân Châu Trắng', 8000.00, 'AVAILABLE', GETDATE(), GETDATE()),
(2, N'Kem Cheese Macchiato', 12000.00, 'AVAILABLE', GETDATE(), GETDATE()),
(3, N'Shot Espresso Bổ Sung', 10000.00, 'AVAILABLE', GETDATE(), GETDATE()),
(4, N'Đào Miếng Thêm (2 miếng)', 10000.00, 'AVAILABLE', GETDATE(), GETDATE()),
(5, N'Trân Châu Hoàng Kim', 10000.00, 'AVAILABLE', GETDATE(), GETDATE()),
(6, N'Thạch Cà Phê Pha Phin', 8000.00, 'AVAILABLE', GETDATE(), GETDATE());
SET IDENTITY_INSERT Topping OFF;
GO

-- ==============================================================
-- 8. BẢNG NGUYÊN LIỆU KHO (Ingredient) - Số lượng dồi dào
-- ==============================================================
SET IDENTITY_INSERT Ingredient ON;
INSERT INTO Ingredient (id, name, unit, stockQuantity, minimumThreshold, createdAt, updatedAt)
VALUES
(1, N'Hạt Cà Phê Robusta', 'kg', 50.000, 5.000, GETDATE(), GETDATE()),
(2, N'Hạt Cà Phê Arabica Cầu Đất', 'kg', 35.000, 3.000, GETDATE(), GETDATE()),
(3, N'Sữa Đặc Ngôi Sao Phương Nam', 'lon', 120.000, 15.000, GETDATE(), GETDATE()),
(4, N'Sữa Tươi Thanh Trùng DalatMilk', 'lit', 80.000, 10.000, GETDATE(), GETDATE()),
(5, N'Siro Đào Monin', 'chai', 15.000, 2.000, GETDATE(), GETDATE()),
(6, N'Trà Đen Phúc Long', 'kg', 25.000, 3.000, GETDATE(), GETDATE()),
(7, N'Bột Kem Phô Mai Cheese', 'kg', 12.000, 2.000, GETDATE(), GETDATE()),
(8, N'Bột Matcha Uji Nhật Bản', 'kg', 8.500, 1.500, GETDATE(), GETDATE()),
(9, N'Sốt Chocolate Hershey', 'chai', 10.000, 2.000, GETDATE(), GETDATE()),
(10, N'Trân Châu Sống', 'kg', 30.000, 5.000, GETDATE(), GETDATE()),
(11, N'Nước Cốt Dừa Tươi', 'lit', 20.000, 3.000, GETDATE(), GETDATE());
SET IDENTITY_INSERT Ingredient OFF;
GO

-- ==============================================================
-- 9. BẢNG CÔNG THỨC MÓN (RecipeBOM)
-- ==============================================================
INSERT INTO RecipeBOM (variantId, ingredientId, consumedQuantity)
VALUES
-- Món 1: Cà phê đen đá
(1, 1, 0.020), (2, 1, 0.025), (3, 1, 0.030),
-- Món 2: Cà phê sữa đá
(4, 1, 0.020), (4, 3, 0.080),
(5, 1, 0.025), (5, 3, 0.100),
(6, 1, 0.030), (6, 3, 0.120),
-- Món 3: Bạc xỉu
(7, 1, 0.015), (7, 3, 0.100), (7, 4, 0.150),
(8, 1, 0.020), (8, 3, 0.120), (8, 4, 0.180),
-- Món 4: Cà phê muối
(9, 1, 0.025), (9, 3, 0.080), (9, 7, 0.020),
(10, 1, 0.030), (10, 3, 0.100), (10, 7, 0.025),
-- Món 7: Espresso
(14, 2, 0.018), (15, 2, 0.036),
-- Món 8: Americano
(16, 2, 0.018), (17, 2, 0.025),
-- Món 9: Latte
(18, 2, 0.018), (18, 4, 0.200),
(19, 2, 0.025), (19, 4, 0.250),
-- Món 11: Caramel Macchiato
(22, 2, 0.020), (22, 4, 0.220),
(23, 2, 0.025), (23, 4, 0.260),
-- Món 12: Trà đào cam sả
(24, 6, 0.015), (24, 5, 0.030),
(25, 6, 0.020), (25, 5, 0.040),
-- Món 14: Trà sữa
(28, 6, 0.020), (28, 4, 0.150), (28, 3, 0.060),
(29, 6, 0.025), (29, 4, 0.180), (29, 3, 0.080),
-- Món 18: Matcha đá xay
(36, 8, 0.025), (36, 4, 0.150), (36, 7, 0.030),
(37, 8, 0.030), (37, 4, 0.180), (37, 7, 0.040),
-- Món 19: Mocha đá xay
(38, 2, 0.020), (38, 9, 0.030), (38, 4, 0.120),
(39, 2, 0.025), (39, 9, 0.040), (39, 4, 0.150);
GO

-- ==============================================================
-- 10. BẢNG CÔNG THỨC TOPPING (ToppingBOM)
-- ==============================================================
INSERT INTO ToppingBOM (toppingId, ingredientId, consumedQuantity)
VALUES
(1, 10, 0.040), -- Trân châu trắng tiêu hao 0.04kg trân châu
(2, 7, 0.030),  -- Kem Cheese tiêu hao 0.03kg bột kem phô mai
(2, 4, 0.050),  -- Kem Cheese tiêu hao 0.05 lit sữa tươi
(3, 1, 0.018),  -- Shot Espresso tiêu hao 0.018kg cà phê
(5, 10, 0.040); -- Trân châu hoàng kim tiêu hao 0.04kg trân châu
GO

-- ==============================================================
-- 11. NHẬP KHO NGUYÊN LIỆU (InventoryImport & Detail)
-- ==============================================================
SET IDENTITY_INSERT InventoryImport ON;
INSERT INTO InventoryImport (id, supplierName, employeeId, totalAmount, importDate, note)
VALUES
(1, N'Công ty Cổ Phần Cà Phê Trung Nguyên', 4, 5200000.00, DATEADD(DAY, -5, GETDATE()), N'Nhập hàng nguyên liệu đầu tuần');
SET IDENTITY_INSERT InventoryImport OFF;

INSERT INTO InventoryImportDetail (importId, ingredientId, quantity, unitPrice, totalLineAmount)
VALUES
(1, 1, 20.000, 180000.00, 3600000.00),
(1, 3, 50.000, 20000.00, 1000000.00),
(1, 4, 30.000, 20000.00, 600000.00);
GO

-- ==============================================================
-- 12. KIỂM KÊ / ĐIỀU CHỈNH KHO (InventoryAdjustment)
-- ==============================================================
SET IDENTITY_INSERT InventoryAdjustment ON;
INSERT INTO InventoryAdjustment (id, ingredientId, employeeId, oldQuantity, newQuantity, difference, reason, adjustmentDate)
VALUES
(1, 4, 4, 82.000, 80.000, -2.000, N'Hao hụt bọt sữa đổ tràn trong quá trình steam sữa buổi sáng', DATEADD(DAY, -1, GETDATE()));
SET IDENTITY_INSERT InventoryAdjustment OFF;
GO

-- ==============================================================
-- 13. ĐƠN HÀNG MẪU (Order, OrderDetail, OrderDetailTopping)
-- ==============================================================
SET IDENTITY_INSERT [Order] ON;
INSERT INTO [Order] (
    id, orderCode, orderChannel, pagerId, employeeId, customerId, 
    subTotal, discountAmount, totalAmount, paymentMethod, status, 
    paidAt, createdAt, updatedAt
)
VALUES
(1, 'ORD260901', 'ORDER_AT_COUNTER', NULL, 2, 1, 47000.00, 0.00, 47000.00, 'BANK_TRANSFER', 'COMPLETED', DATEADD(DAY, -1, GETDATE()), DATEADD(DAY, -1, GETDATE()), DATEADD(DAY, -1, GETDATE())),
(2, 'ORD260902', 'ORDER_AT_COUNTER', 3, 2, 2, 84000.00, 10000.00, 74000.00, 'CASH', 'PENDING_PREP', GETDATE(), GETDATE(), GETDATE());
SET IDENTITY_INSERT [Order] OFF;
GO

SET IDENTITY_INSERT OrderDetail ON;
INSERT INTO OrderDetail (
    id, orderId, variantId, quantity, note, itemSnapshotName, sizeSnapshot, 
    unitPrice, totalToppingPriceSnapshot, totalPrice, itemStatus, createdAt, updatedAt
)
VALUES
(1, 1, 5, 1, N'Ít ngọt, nhiều đá', N'Cà Phê Sữa Đá', 'M', 35000.00, 8000.00, 43000.00, 'DONE', DATEADD(DAY, -1, GETDATE()), DATEADD(DAY, -1, GETDATE())),
(2, 2, 23, 1, N'Nóng', N'Caramel Macchiato', 'L', 55000.00, 0.00, 55000.00, 'PENDING', GETDATE(), GETDATE()),
(3, 2, 7, 1, N'Bình thường', N'Bạc Xỉu', 'M', 35000.00, 0.00, 35000.00, 'PENDING', GETDATE(), GETDATE());
SET IDENTITY_INSERT OrderDetail OFF;
GO

INSERT INTO OrderDetailTopping (orderDetailId, toppingId, toppingSnapshotName, toppingPrice, quantity)
VALUES
(1, 1, N'Trân Châu Trắng', 8000.00, 1);
GO

-- ==============================================================
-- 14. LỊCH SỬ BIẾN ĐỘNG ĐIỂM (LoyaltyTransaction)
-- ==============================================================
SET IDENTITY_INSERT LoyaltyTransaction ON;
INSERT INTO LoyaltyTransaction (id, customerId, orderId, transactionType, points, balanceAfter, description, createdAt)
VALUES
(1, 1, 1, 'EARN', 4, 250, N'Tích lũy điểm từ hóa đơn ORD260901', DATEADD(DAY, -1, GETDATE())),
(2, 2, 2, 'REDEEM', -10, 550, N'Đổi 10 điểm giảm 10.000 VNĐ cho đơn ORD260902', GETDATE());
SET IDENTITY_INSERT LoyaltyTransaction OFF;
GO

-- ==============================================================
-- BƯỚC CUỐI: BẬT LẠI TOÀN BỘ TRIGGER VÀ RÀNG BUỘC TOÀN VẸN
-- ==============================================================
IF OBJECT_ID('trg_Customer_SoftDelete', 'TR') IS NOT NULL 
    ALTER TABLE Customer ENABLE TRIGGER trg_Customer_SoftDelete;
IF OBJECT_ID('trg_PagerDevice_SoftDelete', 'TR') IS NOT NULL 
    ALTER TABLE PagerDevice ENABLE TRIGGER trg_PagerDevice_SoftDelete;
IF OBJECT_ID('trg_LoyaltyTransaction_AppendOnly', 'TR') IS NOT NULL 
    ALTER TABLE LoyaltyTransaction ENABLE TRIGGER trg_LoyaltyTransaction_AppendOnly;
IF OBJECT_ID('trg_LoyaltyTransaction_SyncPoints', 'TR') IS NOT NULL 
    ALTER TABLE LoyaltyTransaction ENABLE TRIGGER trg_LoyaltyTransaction_SyncPoints;
IF OBJECT_ID('trg_OrderDetail_CheckInventory', 'TR') IS NOT NULL 
    ALTER TABLE OrderDetail ENABLE TRIGGER trg_OrderDetail_CheckInventory;
IF OBJECT_ID('trg_OrderDetail_DeductInventory', 'TR') IS NOT NULL 
    ALTER TABLE OrderDetail ENABLE TRIGGER trg_OrderDetail_DeductInventory;
IF OBJECT_ID('trg_InventoryImportDetail_AddInventory', 'TR') IS NOT NULL 
    ALTER TABLE InventoryImportDetail ENABLE TRIGGER trg_InventoryImportDetail_AddInventory;
GO

-- Bật lại kiểm tra toàn vẹn khóa ngoại
EXEC sp_MSforeachtable "ALTER TABLE ? WITH CHECK CHECK CONSTRAINT all";
GO