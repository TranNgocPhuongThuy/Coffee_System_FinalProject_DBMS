
-- ==============================================================
-- 1. TẠO CÁC DATABASE ROLES NẾU CHƯA TỒN TẠI
-- ==============================================================
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'CASHIER' AND type = 'R')
    CREATE ROLE CASHIER;
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'BARISTA' AND type = 'R')
    CREATE ROLE BARISTA;
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'STOREKEEPER' AND type = 'R')
    CREATE ROLE STOREKEEPER;
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'MANAGER' AND type = 'R')
    CREATE ROLE MANAGER;
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'CUSTOMER' AND type = 'R')
    CREATE ROLE CUSTOMER;
GO

-- ==============================================================
-- 2. PHÂN QUYỀN: CASHIER (THU NGÂN)
-- ==============================================================
-- Quyền trên Bảng
GRANT SELECT, INSERT, UPDATE ON [Order] TO CASHIER;
GRANT SELECT, INSERT, UPDATE, DELETE ON OrderDetail TO CASHIER; -- Cần DELETE cho sp_RemoveOrderItem
GRANT SELECT, INSERT, UPDATE, DELETE ON OrderDetailTopping TO CASHIER;
GRANT SELECT, INSERT, UPDATE ON Customer TO CASHIER;
GRANT SELECT, INSERT ON LoyaltyTransaction TO CASHIER;
GRANT SELECT, UPDATE (status, batteryLevel, updatedAt) ON PagerDevice TO CASHIER;

GRANT SELECT ON Category TO CASHIER;
GRANT SELECT ON Product TO CASHIER;
GRANT SELECT ON ProductVariant TO CASHIER;
GRANT SELECT ON Topping TO CASHIER;
GRANT SELECT ON Employee TO CASHIER;
GRANT SELECT ON Ingredient TO CASHIER; -- Để check kho
GRANT SELECT ON RecipeBOM TO CASHIER;
GRANT SELECT ON ToppingBOM TO CASHIER;

-- Quyền đặc biệt: Để Trigger trừ kho hoạt động khi Cashier bấm thanh toán & hoàn tất đơn
GRANT UPDATE (stockQuantity, updatedAt) ON Ingredient TO CASHIER;
GRANT INSERT ON SystemLog TO CASHIER;

-- Quyền Stored Procedures & TVPs
GRANT EXECUTE ON sp_CreateCounterOrder TO CASHIER;
GRANT EXECUTE ON sp_CreateOrderWithPager TO CASHIER;
GRANT EXECUTE ON sp_CompleteOrderPayment TO CASHIER;
GRANT EXECUTE ON sp_CancelOrder TO CASHIER;
GRANT EXECUTE ON sp_ApplyLoyaltyPoints TO CASHIER;
GRANT EXECUTE ON sp_RemoveOrderItem TO CASHIER;
GRANT EXECUTE ON sp_UpsertCustomerMember TO CASHIER;

GRANT EXECUTE ON TYPE::udt_OrderDetailList TO CASHIER;
GRANT EXECUTE ON TYPE::udt_OrderDetailToppingList TO CASHIER;

-- Quyền Views & Functions
GRANT SELECT ON v_InvoiceDetails TO CASHIER;
GRANT SELECT ON v_ActivePagerDashboard TO CASHIER;
GRANT SELECT ON v_CustomerLoyaltySummary TO CASHIER;
GRANT SELECT ON dbo.fn_GetMemberLoyaltyHistory TO CASHIER;

GRANT EXECUTE ON dbo.fn_IsPagerAvailable TO CASHIER;
GRANT EXECUTE ON dbo.fnc_CalculateItemTotalPrice TO CASHIER;
GRANT EXECUTE ON dbo.fnc_CalculateEarnedPoints TO CASHIER;
GRANT EXECUTE ON dbo.fn_CalculateMemberDiscount TO CASHIER;

-- CHẶN QUYỀN (Nguyên tắc kiểm toán)
DENY DELETE ON [Order] TO CASHIER;
DENY DELETE ON Customer TO CASHIER;
DENY DELETE ON LoyaltyTransaction TO CASHIER;
GO

-- ==============================================================
-- 3. PHÂN QUYỀN: BARISTA (BẾP / PHA CHẾ)
-- ==============================================================
-- Quyền trên Bảng
GRANT SELECT, UPDATE (status, updatedAt) ON [Order] TO BARISTA;
GRANT SELECT, UPDATE (itemStatus, updatedAt) ON OrderDetail TO BARISTA;
GRANT SELECT, UPDATE (status, updatedAt) ON PagerDevice TO BARISTA;

GRANT SELECT ON OrderDetailTopping TO BARISTA;
GRANT SELECT ON RecipeBOM TO BARISTA;
GRANT SELECT ON ToppingBOM TO BARISTA;
GRANT SELECT ON Ingredient TO BARISTA;
GRANT SELECT ON Category TO BARISTA;
GRANT SELECT ON Product TO BARISTA;
GRANT SELECT ON ProductVariant TO BARISTA;
GRANT SELECT ON Topping TO BARISTA;
GRANT SELECT ON Employee TO BARISTA;

-- Quyền đặc biệt: Để Trigger trừ kho hoạt động khi Barista hoàn tất món (DONE)
GRANT UPDATE (stockQuantity, updatedAt) ON Ingredient TO BARISTA;
GRANT INSERT ON SystemLog TO BARISTA;

-- Quyền SPs, Views
GRANT EXECUTE ON dbo.sp_KDS_NotifyOrderReady TO BARISTA;
GRANT SELECT ON v_ProductRecipeDetails TO BARISTA;
GRANT SELECT ON v_ActivePagerDashboard TO BARISTA;

-- CHẶN QUYỀN
DENY INSERT, DELETE ON [Order] TO BARISTA;
DENY INSERT, DELETE ON OrderDetail TO BARISTA;
DENY UPDATE (subTotal, discountAmount, totalAmount) ON [Order] TO BARISTA;
GO

-- ==============================================================
-- 4. PHÂN QUYỀN: STOREKEEPER (THỦ KHO)
-- ==============================================================
-- Quyền trên Bảng
GRANT SELECT, INSERT, UPDATE ON Ingredient TO STOREKEEPER;
GRANT SELECT, INSERT ON InventoryImport TO STOREKEEPER;
GRANT SELECT, INSERT ON InventoryImportDetail TO STOREKEEPER;
GRANT SELECT, INSERT ON InventoryAdjustment TO STOREKEEPER;

GRANT SELECT ON Category TO STOREKEEPER;
GRANT SELECT ON Product TO STOREKEEPER;
GRANT SELECT ON ProductVariant TO STOREKEEPER;
GRANT SELECT ON Topping TO STOREKEEPER;
GRANT SELECT ON Employee TO STOREKEEPER;
GRANT SELECT ON RecipeBOM TO STOREKEEPER;
GRANT SELECT ON ToppingBOM TO STOREKEEPER;

GRANT INSERT ON SystemLog TO STOREKEEPER;

-- Quyền SPs, Views & TVPs
GRANT SELECT ON v_LowStockIngredients TO STOREKEEPER;
GRANT SELECT ON v_ProductRecipeDetails TO STOREKEEPER;

GRANT EXECUTE ON sp_CreateInventoryImport TO STOREKEEPER;
GRANT EXECUTE ON sp_DieuChinhTonKho TO STOREKEEPER;
GRANT EXECUTE ON TYPE::udt_InventoryImportDetailList TO STOREKEEPER;

-- CHẶN QUYỀN (Không được xem dữ liệu bán hàng & khách hàng)
DENY DELETE ON Ingredient TO STOREKEEPER;
DENY DELETE ON InventoryImport TO STOREKEEPER;
DENY DELETE ON InventoryAdjustment TO STOREKEEPER;
DENY SELECT ON [Order] TO STOREKEEPER;
DENY SELECT ON OrderDetail TO STOREKEEPER;
DENY SELECT ON Customer TO STOREKEEPER;
DENY SELECT ON LoyaltyTransaction TO STOREKEEPER;
GO

-- ==============================================================
-- 5. PHÂN QUYỀN: CUSTOMER (KHÁCH HÀNG ONLINE / APP)
-- ==============================================================
-- Quyền xem Menu
GRANT SELECT ON Category TO CUSTOMER;
GRANT SELECT ON Product TO CUSTOMER;
GRANT SELECT ON ProductVariant TO CUSTOMER;
GRANT SELECT ON Topping TO CUSTOMER;

-- Quyền Đặt món
GRANT SELECT, INSERT ON [Order] TO CUSTOMER;
GRANT SELECT, INSERT ON OrderDetail TO CUSTOMER;
GRANT SELECT, INSERT ON OrderDetailTopping TO CUSTOMER;
GRANT SELECT ON Ingredient TO CUSTOMER; -- Phục vụ Trigger kiểm tra kho
GRANT SELECT ON RecipeBOM TO CUSTOMER;
GRANT SELECT ON ToppingBOM TO CUSTOMER;

GRANT EXECUTE ON sp_CreateCounterOrder TO CUSTOMER;
GRANT EXECUTE ON TYPE::udt_OrderDetailList TO CUSTOMER;
GRANT EXECUTE ON TYPE::udt_OrderDetailToppingList TO CUSTOMER;

-- Quyền Quản lý tài khoản & Tích điểm cá nhân
GRANT SELECT, UPDATE (fullName, password, address, updatedAt) ON Customer TO CUSTOMER;
GRANT SELECT ON LoyaltyTransaction TO CUSTOMER;
GRANT SELECT ON dbo.fn_GetMemberLoyaltyHistory TO CUSTOMER;
GRANT EXECUTE ON sp_ApplyLoyaltyPoints TO CUSTOMER;

GRANT INSERT ON SystemLog TO CUSTOMER;

-- CHẶN QUYỀN TUYỆT ĐỐI
DENY DELETE ON [Order] TO CUSTOMER;
DENY DELETE ON OrderDetail TO CUSTOMER;
DENY DELETE ON Customer TO CUSTOMER;
DENY DELETE ON LoyaltyTransaction TO CUSTOMER;

DENY SELECT, INSERT, UPDATE, DELETE ON Employee TO CUSTOMER;
DENY SELECT, INSERT, UPDATE, DELETE ON InventoryImport TO CUSTOMER;
DENY SELECT, INSERT, UPDATE, DELETE ON InventoryImportDetail TO CUSTOMER;
DENY SELECT, INSERT, UPDATE, DELETE ON InventoryAdjustment TO CUSTOMER;
DENY SELECT, INSERT, UPDATE, DELETE ON PagerDevice TO CUSTOMER;

DENY SELECT ON SystemLog TO CUSTOMER;
DENY SELECT ON v_DailyRevenue TO CUSTOMER;
DENY SELECT ON v_LowStockIngredients TO CUSTOMER;
DENY SELECT ON v_ActivePagerDashboard TO CUSTOMER;
DENY SELECT ON v_InvoiceDetails TO CUSTOMER;
GO

-- ==============================================================
-- 6. PHÂN QUYỀN: MANAGER (QUẢN LÝ / ADMIN)
-- ==============================================================
-- Toàn quyền DML trên các bảng (trừ SystemLog chỉ Insert/Select)
GRANT SELECT, INSERT, UPDATE, DELETE ON Category TO MANAGER;
GRANT SELECT, INSERT, UPDATE, DELETE ON Product TO MANAGER;
GRANT SELECT, INSERT, UPDATE, DELETE ON ProductVariant TO MANAGER;
GRANT SELECT, INSERT, UPDATE, DELETE ON Topping TO MANAGER;
GRANT SELECT, INSERT, UPDATE, DELETE ON RecipeBOM TO MANAGER;
GRANT SELECT, INSERT, UPDATE, DELETE ON ToppingBOM TO MANAGER;
GRANT SELECT, INSERT, UPDATE, DELETE ON PagerDevice TO MANAGER;
GRANT SELECT, INSERT, UPDATE, DELETE ON Employee TO MANAGER;
GRANT SELECT, INSERT, UPDATE, DELETE ON Ingredient TO MANAGER;
GRANT SELECT, INSERT, UPDATE, DELETE ON [Order] TO MANAGER;
GRANT SELECT, INSERT, UPDATE, DELETE ON OrderDetail TO MANAGER;
GRANT SELECT, INSERT, UPDATE, DELETE ON OrderDetailTopping TO MANAGER;
GRANT SELECT, INSERT, UPDATE, DELETE ON Customer TO MANAGER;
GRANT SELECT, INSERT, UPDATE, DELETE ON LoyaltyTransaction TO MANAGER;
GRANT SELECT, INSERT, UPDATE, DELETE ON InventoryImport TO MANAGER;
GRANT SELECT, INSERT, UPDATE, DELETE ON InventoryImportDetail TO MANAGER;
GRANT SELECT, INSERT, UPDATE, DELETE ON InventoryAdjustment TO MANAGER;

GRANT SELECT, INSERT ON SystemLog TO MANAGER;

-- Toàn quyền trên View
GRANT SELECT ON v_DailyRevenue TO MANAGER;
GRANT SELECT ON v_TopSellingProducts TO MANAGER;
GRANT SELECT ON v_CustomerLoyaltySummary TO MANAGER;
GRANT SELECT ON v_LowStockIngredients TO MANAGER;
GRANT SELECT ON v_ProductRecipeDetails TO MANAGER;
GRANT SELECT ON v_InvoiceDetails TO MANAGER;
GRANT SELECT ON v_ActivePagerDashboard TO MANAGER;

-- Toàn quyền trên Functions
GRANT SELECT ON dbo.fn_GetTopSellingProducts TO MANAGER;
GRANT SELECT ON dbo.fn_GetMemberLoyaltyHistory TO MANAGER;
GRANT EXECUTE ON dbo.fn_GetTotalRevenue TO MANAGER;
GRANT EXECUTE ON dbo.fn_IsPagerAvailable TO MANAGER;
GRANT EXECUTE ON dbo.fnc_CalculateItemTotalPrice TO MANAGER;
GRANT EXECUTE ON dbo.fnc_CalculateEarnedPoints TO MANAGER;
GRANT EXECUTE ON dbo.fn_CalculateMemberDiscount TO MANAGER;

-- Toàn quyền trên Stored Procedures
GRANT EXECUTE ON sp_UpsertRecipeBOM TO MANAGER;
GRANT EXECUTE ON sp_CreateInventoryImport TO MANAGER;
GRANT EXECUTE ON sp_CreateCounterOrder TO MANAGER;
GRANT EXECUTE ON sp_CreateOrderWithPager TO MANAGER;
GRANT EXECUTE ON sp_CompleteOrderPayment TO MANAGER;
GRANT EXECUTE ON sp_CancelOrder TO MANAGER;
GRANT EXECUTE ON sp_ApplyLoyaltyPoints TO MANAGER;
GRANT EXECUTE ON sp_RemoveOrderItem TO MANAGER;
GRANT EXECUTE ON sp_UpsertCustomerMember TO MANAGER;
GRANT EXECUTE ON sp_DieuChinhTonKho TO MANAGER;
GRANT EXECUTE ON dbo.sp_KDS_NotifyOrderReady TO MANAGER;

-- Quyền sử dụng các Kiểu dữ liệu bảng (TVP)
GRANT EXECUTE ON TYPE::udt_OrderDetailList TO MANAGER;
GRANT EXECUTE ON TYPE::udt_InventoryImportDetailList TO MANAGER;
GRANT EXECUTE ON TYPE::udt_OrderDetailToppingList TO MANAGER;
GO

-- ==============================================================
-- 7. TẠO LOGINS, DATABASE USERS VÀ ÁNH XẠ ROLE
-- ==============================================================

USE master;
GO

-- Khởi tạo Logins (Mật khẩu cứng để dùng trong cấu hình môi trường Backend)
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = 'login_manager')
    CREATE LOGIN login_manager WITH PASSWORD = N'Manager@123', CHECK_POLICY = OFF;
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = 'login_cashier')
    CREATE LOGIN login_cashier WITH PASSWORD = N'Cashier@123', CHECK_POLICY = OFF;
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = 'login_barista')
    CREATE LOGIN login_barista WITH PASSWORD = N'Barista@123', CHECK_POLICY = OFF;
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = 'login_storekeeper')
    CREATE LOGIN login_storekeeper WITH PASSWORD = N'Storekeeper@123', CHECK_POLICY = OFF;
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = 'login_customer')
    CREATE LOGIN login_customer WITH PASSWORD = N'Customer@123', CHECK_POLICY = OFF;
GO

USE COFFEE_SYSTEM;
GO

-- Tạo DB Users tương ứng với Logins
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'user_manager')
    CREATE USER user_manager FOR LOGIN login_manager;
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'user_cashier')
    CREATE USER user_cashier FOR LOGIN login_cashier;
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'user_barista')
    CREATE USER user_barista FOR LOGIN login_barista;
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'user_storekeeper')
    CREATE USER user_storekeeper FOR LOGIN login_storekeeper;
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'user_customer')
    CREATE USER user_customer FOR LOGIN login_customer;
GO

-- Ánh xạ User vào các Database Roles
ALTER ROLE MANAGER ADD MEMBER user_manager;
ALTER ROLE CASHIER ADD MEMBER user_cashier;
ALTER ROLE BARISTA ADD MEMBER user_barista;
ALTER ROLE STOREKEEPER ADD MEMBER user_storekeeper;
ALTER ROLE CUSTOMER ADD MEMBER user_customer;
GO