-- ==============================================================
-- 1. TẠO & ĐỒNG BỘ LOGINS Ở CẤP SERVER (Chạy trên master)
-- ==============================================================
USE master;
GO

-- 1. Xử lý login_manager
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = 'login_manager')
BEGIN
    CREATE LOGIN login_manager WITH PASSWORD = N'Manager@123', CHECK_POLICY = OFF, CHECK_EXPIRATION = OFF;
END
ELSE
BEGIN
    ALTER LOGIN login_manager WITH PASSWORD = N'Manager@123', CHECK_POLICY = OFF, CHECK_EXPIRATION = OFF;
    ALTER LOGIN login_manager ENABLE;
END

-- 2. Xử lý login_cashier
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = 'login_cashier')
BEGIN
    CREATE LOGIN login_cashier WITH PASSWORD = N'Cashier@123', CHECK_POLICY = OFF, CHECK_EXPIRATION = OFF;
END
ELSE
BEGIN
    ALTER LOGIN login_cashier WITH PASSWORD = N'Cashier@123', CHECK_POLICY = OFF, CHECK_EXPIRATION = OFF;
    ALTER LOGIN login_cashier ENABLE;
END

-- 3. Xử lý login_barista
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = 'login_barista')
BEGIN
    CREATE LOGIN login_barista WITH PASSWORD = N'Barista@123', CHECK_POLICY = OFF, CHECK_EXPIRATION = OFF;
END
ELSE
BEGIN
    ALTER LOGIN login_barista WITH PASSWORD = N'Barista@123', CHECK_POLICY = OFF, CHECK_EXPIRATION = OFF;
    ALTER LOGIN login_barista ENABLE;
END

-- 4. Xử lý login_storekeeper
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = 'login_storekeeper')
BEGIN
    CREATE LOGIN login_storekeeper WITH PASSWORD = N'Storekeeper@123', CHECK_POLICY = OFF, CHECK_EXPIRATION = OFF;
END
ELSE
BEGIN
    ALTER LOGIN login_storekeeper WITH PASSWORD = N'Storekeeper@123', CHECK_POLICY = OFF, CHECK_EXPIRATION = OFF;
    ALTER LOGIN login_storekeeper ENABLE;
END

-- 5. Xử lý login_customer
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = 'login_customer')
BEGIN
    CREATE LOGIN login_customer WITH PASSWORD = N'Customer@123', CHECK_POLICY = OFF, CHECK_EXPIRATION = OFF;
END
ELSE
BEGIN
    ALTER LOGIN login_customer WITH PASSWORD = N'Customer@123', CHECK_POLICY = OFF, CHECK_EXPIRATION = OFF;
    ALTER LOGIN login_customer ENABLE;
END
GO

-- ==============================================================
-- 2. CHUYỂN NGỮ CẢNH VỀ DATABASE DỰ ÁN & TẠO DATABASE USERS
-- ==============================================================
USE coffee_ecom;
GO

IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'user_manager')
BEGIN
    CREATE USER user_manager FOR LOGIN login_manager;
END
ELSE
BEGIN
    ALTER USER user_manager WITH LOGIN = login_manager;
END

IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'user_cashier')
BEGIN
    CREATE USER user_cashier FOR LOGIN login_cashier;
END
ELSE
BEGIN
    ALTER USER user_cashier WITH LOGIN = login_cashier;
END

IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'user_barista')
BEGIN
    CREATE USER user_barista FOR LOGIN login_barista;
END
ELSE
BEGIN
    ALTER USER user_barista WITH LOGIN = login_barista;
END

IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'user_storekeeper')
BEGIN
    CREATE USER user_storekeeper FOR LOGIN login_storekeeper;
END
ELSE
BEGIN
    ALTER USER user_storekeeper WITH LOGIN = login_storekeeper;
END

IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'user_customer')
BEGIN
    CREATE USER user_customer FOR LOGIN login_customer;
END
ELSE
BEGIN
    ALTER USER user_customer WITH LOGIN = login_customer;
END
GO

-- ==============================================================
-- 3. TẠO CÁC DATABASE ROLES & ÁNH XẠ THÀNH VIÊN
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

-- Gán User vào Role một cách an toàn (tránh lỗi 15410 nếu đã là thành viên)
IF IS_ROLEMEMBER('MANAGER', 'user_manager') = 0
    ALTER ROLE MANAGER ADD MEMBER user_manager;

IF IS_ROLEMEMBER('CASHIER', 'user_cashier') = 0
    ALTER ROLE CASHIER ADD MEMBER user_cashier;

IF IS_ROLEMEMBER('BARISTA', 'user_barista') = 0
    ALTER ROLE BARISTA ADD MEMBER user_barista;

IF IS_ROLEMEMBER('STOREKEEPER', 'user_storekeeper') = 0
    ALTER ROLE STOREKEEPER ADD MEMBER user_storekeeper;

IF IS_ROLEMEMBER('CUSTOMER', 'user_customer') = 0
    ALTER ROLE CUSTOMER ADD MEMBER user_customer;
GO

-- ==============================================================
-- 4. PHÂN QUYỀN: CASHIER (THU NGÂN)
-- ==============================================================
-- Quyền trên Bảng
GRANT SELECT, INSERT, UPDATE ON dbo.[Order] TO CASHIER;
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.OrderDetail TO CASHIER;
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.OrderDetailTopping TO CASHIER;
GRANT SELECT, INSERT, UPDATE ON dbo.Customer TO CASHIER;
GRANT SELECT, INSERT ON dbo.LoyaltyTransaction TO CASHIER;
GRANT SELECT, UPDATE (status, batteryLevel, updatedAt) ON dbo.PagerDevice TO CASHIER;

GRANT SELECT ON dbo.Category TO CASHIER;
GRANT SELECT ON dbo.Product TO CASHIER;
GRANT SELECT ON dbo.ProductVariant TO CASHIER;
GRANT SELECT ON dbo.Topping TO CASHIER;
GRANT SELECT ON dbo.Employee TO CASHIER;
GRANT SELECT ON dbo.Ingredient TO CASHIER;
GRANT SELECT ON dbo.RecipeBOM TO CASHIER;
GRANT SELECT ON dbo.ToppingBOM TO CASHIER;

-- Quyền Trigger & Log
GRANT UPDATE (stockQuantity, updatedAt) ON dbo.Ingredient TO CASHIER;
GRANT INSERT ON dbo.SystemLog TO CASHIER;

-- Quyền Stored Procedures & TVPs
GRANT EXECUTE ON dbo.sp_CreateCounterOrder TO CASHIER;
GRANT EXECUTE ON dbo.sp_CreateOrderWithPager TO CASHIER;
GRANT EXECUTE ON dbo.sp_CompleteOrderPayment TO CASHIER;
GRANT EXECUTE ON dbo.sp_CancelOrder TO CASHIER;
GRANT EXECUTE ON dbo.sp_ApplyLoyaltyPoints TO CASHIER;
GRANT EXECUTE ON dbo.sp_RemoveOrderItem TO CASHIER;
GRANT EXECUTE ON dbo.sp_UpsertCustomerMember TO CASHIER;

GRANT EXECUTE ON TYPE::dbo.udt_OrderDetailList TO CASHIER;
GRANT EXECUTE ON TYPE::dbo.udt_OrderDetailToppingList TO CASHIER;

-- Quyền Views & Functions
GRANT SELECT ON dbo.v_InvoiceDetails TO CASHIER;
GRANT SELECT ON dbo.v_ActivePagerDashboard TO CASHIER;
GRANT SELECT ON dbo.v_CustomerLoyaltySummary TO CASHIER;
GRANT SELECT ON dbo.fn_GetMemberLoyaltyHistory TO CASHIER;

GRANT EXECUTE ON dbo.fn_IsPagerAvailable TO CASHIER;
GRANT EXECUTE ON dbo.fnc_CalculateItemTotalPrice TO CASHIER;
GRANT EXECUTE ON dbo.fnc_CalculateEarnedPoints TO CASHIER;
GRANT EXECUTE ON dbo.fn_CalculateMemberDiscount TO CASHIER;

-- CHẶN QUYỀN
DENY DELETE ON dbo.[Order] TO CASHIER;
DENY DELETE ON dbo.Customer TO CASHIER;
DENY DELETE ON dbo.LoyaltyTransaction TO CASHIER;
GO

-- ==============================================================
-- 5. PHÂN QUYỀN: BARISTA (BẾP / PHA CHẾ)
-- ==============================================================
-- Quyền trên Bảng
GRANT SELECT, UPDATE (status, updatedAt) ON dbo.[Order] TO BARISTA;
GRANT SELECT, UPDATE (itemStatus, updatedAt) ON dbo.OrderDetail TO BARISTA;
GRANT SELECT, UPDATE (status, updatedAt) ON dbo.PagerDevice TO BARISTA;

GRANT SELECT ON dbo.OrderDetailTopping TO BARISTA;
GRANT SELECT ON dbo.RecipeBOM TO BARISTA;
GRANT SELECT ON dbo.ToppingBOM TO BARISTA;
GRANT SELECT ON dbo.Ingredient TO BARISTA;
GRANT SELECT ON dbo.Category TO BARISTA;
GRANT SELECT ON dbo.Product TO BARISTA;
GRANT SELECT ON dbo.ProductVariant TO BARISTA;
GRANT SELECT ON dbo.Topping TO BARISTA;
GRANT SELECT ON dbo.Employee TO BARISTA;


-- Quyền Trigger & Log
GRANT UPDATE (stockQuantity, updatedAt) ON dbo.Ingredient TO BARISTA;
GRANT INSERT ON dbo.SystemLog TO BARISTA;

-- Quyền SPs, Views
GRANT EXECUTE ON sp_KDS_UpdateItemStatus TO BARISTA;
GRANT EXECUTE ON sp_KDS_UpdateItemStatus TO MANAGER;
GRANT EXECUTE ON dbo.sp_KDS_NotifyOrderReady TO BARISTA;
GRANT SELECT ON dbo.v_ProductRecipeDetails TO BARISTA;
GRANT SELECT ON dbo.v_ActivePagerDashboard TO BARISTA;

-- CHẶN QUYỀN
DENY INSERT, DELETE ON dbo.[Order] TO BARISTA;
DENY INSERT, DELETE ON dbo.OrderDetail TO BARISTA;
DENY UPDATE (subTotal, discountAmount, totalAmount) ON dbo.[Order] TO BARISTA;
GO

-- ==============================================================
-- 6. PHÂN QUYỀN: STOREKEEPER (THỦ KHO)
-- ==============================================================
-- Quyền trên Bảng
GRANT SELECT, INSERT, UPDATE ON dbo.Ingredient TO STOREKEEPER;
GRANT SELECT, INSERT ON dbo.InventoryImport TO STOREKEEPER;
GRANT SELECT, INSERT ON dbo.InventoryImportDetail TO STOREKEEPER;
GRANT SELECT, INSERT ON dbo.InventoryAdjustment TO STOREKEEPER;

GRANT SELECT ON dbo.Category TO STOREKEEPER;
GRANT SELECT ON dbo.Product TO STOREKEEPER;
GRANT SELECT ON dbo.ProductVariant TO STOREKEEPER;
GRANT SELECT ON dbo.Topping TO STOREKEEPER;
GRANT SELECT ON dbo.Employee TO STOREKEEPER;
GRANT SELECT ON dbo.RecipeBOM TO STOREKEEPER;
GRANT SELECT ON dbo.ToppingBOM TO STOREKEEPER;

GRANT INSERT ON dbo.SystemLog TO STOREKEEPER;

-- Quyền SPs, Views & TVPs
GRANT SELECT ON dbo.v_LowStockIngredients TO STOREKEEPER;
GRANT SELECT ON dbo.v_ProductRecipeDetails TO STOREKEEPER;

GRANT EXECUTE ON dbo.sp_CreateInventoryImport TO STOREKEEPER;
GRANT EXECUTE ON dbo.sp_DieuChinhTonKho TO STOREKEEPER;
GRANT EXECUTE ON TYPE::dbo.udt_InventoryImportDetailList TO STOREKEEPER;

-- CHẶN QUYỀN
DENY DELETE ON dbo.Ingredient TO STOREKEEPER;
DENY DELETE ON dbo.InventoryImport TO STOREKEEPER;
DENY DELETE ON dbo.InventoryAdjustment TO STOREKEEPER;
DENY SELECT ON dbo.[Order] TO STOREKEEPER;
DENY SELECT ON dbo.OrderDetail TO STOREKEEPER;
DENY SELECT ON dbo.Customer TO STOREKEEPER;
DENY SELECT ON dbo.LoyaltyTransaction TO STOREKEEPER;
GO

-- ==============================================================
-- 7. PHÂN QUYỀN: CUSTOMER (KHÁCH HÀNG ONLINE / APP)
-- ==============================================================
-- Quyền xem Menu
GRANT SELECT ON dbo.Category TO CUSTOMER;
GRANT SELECT ON dbo.Product TO CUSTOMER;
GRANT SELECT ON dbo.ProductVariant TO CUSTOMER;
GRANT SELECT ON dbo.Topping TO CUSTOMER;

-- Quyền Đặt món
GRANT SELECT, INSERT ON dbo.[Order] TO CUSTOMER;
GRANT SELECT, INSERT ON dbo.OrderDetail TO CUSTOMER;
GRANT SELECT, INSERT ON dbo.OrderDetailTopping TO CUSTOMER;
GRANT SELECT ON dbo.Ingredient TO CUSTOMER;
GRANT SELECT ON dbo.RecipeBOM TO CUSTOMER;
GRANT SELECT ON dbo.ToppingBOM TO CUSTOMER;

GRANT EXECUTE ON dbo.sp_CreateCounterOrder TO CUSTOMER;
GRANT EXECUTE ON TYPE::dbo.udt_OrderDetailList TO CUSTOMER;
GRANT EXECUTE ON TYPE::dbo.udt_OrderDetailToppingList TO CUSTOMER;

-- Quyền Quản lý tài khoản & Tích điểm cá nhân
GRANT SELECT, UPDATE (fullName, password, address, updatedAt) ON dbo.Customer TO CUSTOMER;
GRANT SELECT ON dbo.LoyaltyTransaction TO CUSTOMER;
GRANT SELECT ON dbo.fn_GetMemberLoyaltyHistory TO CUSTOMER;
GRANT EXECUTE ON dbo.sp_ApplyLoyaltyPoints TO CUSTOMER;

GRANT INSERT ON dbo.SystemLog TO CUSTOMER;

-- CHẶN QUYỀN TUYỆT ĐỐI
DENY DELETE ON dbo.[Order] TO CUSTOMER;
DENY DELETE ON dbo.OrderDetail TO CUSTOMER;
DENY DELETE ON dbo.Customer TO CUSTOMER;
DENY DELETE ON dbo.LoyaltyTransaction TO CUSTOMER;

DENY SELECT, INSERT, UPDATE, DELETE ON dbo.Employee TO CUSTOMER;
DENY SELECT, INSERT, UPDATE, DELETE ON dbo.InventoryImport TO CUSTOMER;
DENY SELECT, INSERT, UPDATE, DELETE ON dbo.InventoryImportDetail TO CUSTOMER;
DENY SELECT, INSERT, UPDATE, DELETE ON dbo.InventoryAdjustment TO CUSTOMER;
DENY SELECT, INSERT, UPDATE, DELETE ON dbo.PagerDevice TO CUSTOMER;

DENY SELECT ON dbo.SystemLog TO CUSTOMER;
DENY SELECT ON dbo.v_DailyRevenue TO CUSTOMER;
DENY SELECT ON dbo.v_LowStockIngredients TO CUSTOMER;
DENY SELECT ON dbo.v_ActivePagerDashboard TO CUSTOMER;
DENY SELECT ON dbo.v_InvoiceDetails TO CUSTOMER;
GO

-- ==============================================================
-- 8. PHÂN QUYỀN: MANAGER (QUẢN LÝ / ADMIN)
-- ==============================================================
-- Toàn quyền DML trên các bảng
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.Category TO MANAGER;
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.Product TO MANAGER;
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.ProductVariant TO MANAGER;
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.Topping TO MANAGER;
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.RecipeBOM TO MANAGER;
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.ToppingBOM TO MANAGER;
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.PagerDevice TO MANAGER;
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.Employee TO MANAGER;
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.Ingredient TO MANAGER;
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.[Order] TO MANAGER;
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.OrderDetail TO MANAGER;
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.OrderDetailTopping TO MANAGER;
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.Customer TO MANAGER;
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.LoyaltyTransaction TO MANAGER;
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.InventoryImport TO MANAGER;
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.InventoryImportDetail TO MANAGER;
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.InventoryAdjustment TO MANAGER;

GRANT SELECT, INSERT ON dbo.SystemLog TO MANAGER;

-- Toàn quyền trên Views
GRANT SELECT ON dbo.v_DailyRevenue TO MANAGER;
GRANT SELECT ON dbo.v_TopSellingProducts TO MANAGER;
GRANT SELECT ON dbo.v_CustomerLoyaltySummary TO MANAGER;
GRANT SELECT ON dbo.v_LowStockIngredients TO MANAGER;
GRANT SELECT ON dbo.v_ProductRecipeDetails TO MANAGER;
GRANT SELECT ON dbo.v_InvoiceDetails TO MANAGER;
GRANT SELECT ON dbo.v_ActivePagerDashboard TO MANAGER;

-- Toàn quyền trên Functions
GRANT SELECT ON dbo.fn_GetTopSellingProducts TO MANAGER;
GRANT SELECT ON dbo.fn_GetMemberLoyaltyHistory TO MANAGER;
GRANT EXECUTE ON dbo.fn_GetTotalRevenue TO MANAGER;
GRANT EXECUTE ON dbo.fn_IsPagerAvailable TO MANAGER;
GRANT EXECUTE ON dbo.fnc_CalculateItemTotalPrice TO MANAGER;
GRANT EXECUTE ON dbo.fnc_CalculateEarnedPoints TO MANAGER;
GRANT EXECUTE ON dbo.fn_CalculateMemberDiscount TO MANAGER;

-- Toàn quyền trên Stored Procedures
GRANT EXECUTE ON dbo.sp_UpsertRecipeBOM TO MANAGER;
GRANT EXECUTE ON dbo.sp_CreateInventoryImport TO MANAGER;
GRANT EXECUTE ON dbo.sp_CreateCounterOrder TO MANAGER;
GRANT EXECUTE ON dbo.sp_CreateOrderWithPager TO MANAGER;
GRANT EXECUTE ON dbo.sp_CompleteOrderPayment TO MANAGER;
GRANT EXECUTE ON dbo.sp_CancelOrder TO MANAGER;
GRANT EXECUTE ON dbo.sp_ApplyLoyaltyPoints TO MANAGER;
GRANT EXECUTE ON dbo.sp_RemoveOrderItem TO MANAGER;
GRANT EXECUTE ON dbo.sp_UpsertCustomerMember TO MANAGER;
GRANT EXECUTE ON dbo.sp_DieuChinhTonKho TO MANAGER;
GRANT EXECUTE ON dbo.sp_KDS_NotifyOrderReady TO MANAGER;

-- Quyền TVPs
GRANT EXECUTE ON TYPE::dbo.udt_OrderDetailList TO MANAGER;
GRANT EXECUTE ON TYPE::dbo.udt_InventoryImportDetailList TO MANAGER;
GRANT EXECUTE ON TYPE::dbo.udt_OrderDetailToppingList TO MANAGER;
GO