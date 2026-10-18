-- ==============================================================
-- 1. TẠO CÁC DATABASE ROLES NẾU CHƯA TỒN TẠI
-- ==============================================================
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'CASHIER' AND type = 'R')
    CREATE ROLE CASHIER;
GO

IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'BARISTA' AND type = 'R')
    CREATE ROLE BARISTA;
GO

IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'STOREKEEPER' AND type = 'R')
    CREATE ROLE STOREKEEPER;
GO

IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'MANAGER' AND type = 'R')
    CREATE ROLE MANAGER;
GO

-- ==============================================================
-- 2. PHÂN QUYỀN CHO: CASHIER (CASHIER)
-- Phạm vi: Bán hàng tại quầy, tra cứu menu, khách hàng, thẻ rung.
-- Chặn tuyệt đối quyền DELETE để phục vụ kiểm toán tài chính.
-- ==============================================================
-- Quyền trên Bảng dữ liệu
GRANT SELECT, INSERT, UPDATE ON [Order] TO CASHIER;
GRANT SELECT, INSERT, UPDATE ON OrderDetail TO CASHIER;
GRANT SELECT, INSERT, UPDATE ON OrderDetailTopping TO CASHIER;
GRANT SELECT, INSERT, UPDATE ON Customer TO CASHIER;
GRANT SELECT, INSERT ON LoyaltyTransaction TO CASHIER;
GRANT SELECT, UPDATE ON PagerDevice TO CASHIER;
GRANT SELECT ON Category TO CASHIER;
GRANT SELECT ON Product TO CASHIER;
GRANT SELECT ON ProductVariant TO CASHIER;
GRANT SELECT ON Topping TO CASHIER;
GRANT SELECT ON Employee TO CASHIER;

-- Quyền thực thi Stored Procedures nghiệp vụ POS
GRANT EXECUTE ON sp_CreateCounterOrder TO CASHIER;
GRANT EXECUTE ON sp_CreateOrderWithPager TO CASHIER;
GRANT EXECUTE ON sp_CompleteOrderPayment TO CASHIER;
GRANT EXECUTE ON sp_CancelOrder TO CASHIER;
GRANT EXECUTE ON sp_ApplyLoyaltyPoints TO CASHIER;
GRANT EXECUTE ON sp_RemoveOrderItem TO CASHIER;
GRANT EXECUTE ON sp_UpsertCustomerMember TO CASHIER;

-- Quyền sử dụng Kiểu dữ liệu bảng (TVP) cho POS
GRANT EXECUTE ON TYPE::udt_OrderDetailList TO CASHIER;
GRANT EXECUTE ON TYPE::udt_OrderDetailToppingList TO CASHIER;

-- Quyền trên Views & Functions phục vụ POS
GRANT SELECT ON v_InvoiceDetails TO CASHIER;
GRANT SELECT ON v_ActivePagerDashboard TO CASHIER;
GRANT SELECT ON v_CustomerLoyaltySummary TO CASHIER;

-- Chặn quyền DELETE (Nguyên tắc kiểm toán)
DENY DELETE ON [Order] TO CASHIER;
DENY DELETE ON OrderDetail TO CASHIER;
DENY DELETE ON LoyaltyTransaction TO CASHIER;
DENY DELETE ON Customer TO CASHIER;
GO

-- ==============================================================
-- 3. PHÂN QUYỀN CHO: BARISTA (BARISTA)
-- Phạm vi: Xem màn hình KDS, tra cứu công thức, hoàn thành món.
-- Ngăn chặn can thiệp giá bán, doanh thu và xóa dữ liệu.
-- ==============================================================
GRANT SELECT, UPDATE (status, updatedAt) ON [Order] TO BARISTA;
GRANT SELECT, UPDATE (itemStatus, updatedAt) ON OrderDetail TO BARISTA;
GRANT SELECT ON OrderDetailTopping TO BARISTA;
GRANT SELECT ON RecipeBOM TO BARISTA;
GRANT SELECT ON ToppingBOM TO BARISTA;
GRANT SELECT ON Ingredient TO BARISTA;
GRANT SELECT, UPDATE (status) ON PagerDevice TO BARISTA;

GRANT SELECT ON v_ProductRecipeDetails TO BARISTA;
GRANT SELECT ON v_ActivePagerDashboard TO BARISTA;
GRANT EXECUTE ON dbo.sp_KDS_NotifyOrderReady TO BARISTA;


DENY INSERT, DELETE ON [Order] TO BARISTA;
DENY INSERT, DELETE ON OrderDetail TO BARISTA;
DENY UPDATE ([subTotal], [discountAmount], [totalAmount]) ON [Order] TO BARISTA;
GO

-- ==============================================================
-- 4. PHÂN QUYỀN CHO: STOREKEEPER (STOREKEEPER)
-- Phạm vi: Nhập kho nguyên liệu, kiểm kê cân kho, cảnh báo tồn.
-- Tách biệt hoàn toàn với hóa đơn bán hàng và doanh thu.
-- ==============================================================
GRANT SELECT, INSERT, UPDATE ON Ingredient TO STOREKEEPER;
GRANT SELECT, INSERT ON InventoryImport TO STOREKEEPER;
GRANT SELECT, INSERT ON InventoryImportDetail TO STOREKEEPER;
GRANT SELECT, INSERT ON InventoryAdjustment TO STOREKEEPER;

GRANT SELECT ON v_LowStockIngredients TO STOREKEEPER;
GRANT EXECUTE ON TYPE::udt_InventoryImportDetailList TO STOREKEEPER;
GRANT EXECUTE ON sp_DieuChinhTonKho TO STOREKEEPER;

-- Quyền thực thi Stored Procedure kho
GRANT EXECUTE ON sp_CreateInventoryImport TO STOREKEEPER;

DENY DELETE ON Ingredient TO STOREKEEPER;
DENY DELETE ON InventoryImport TO STOREKEEPER;
DENY DELETE ON InventoryAdjustment TO STOREKEEPER;
DENY SELECT ON [Order] TO STOREKEEPER;
GO

-- ==============================================================
-- 5. PHÂN QUYỀN CHO: MANAGER (MANAGER)
-- Phạm vi: Toàn quyền cấu hình thực đơn, BOM, xem báo cáo doanh thu.
-- ==============================================================
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

-- Xem tất cả Views báo cáo quản trị
GRANT SELECT ON v_DailyRevenue TO MANAGER;
GRANT SELECT ON v_TopSellingProducts TO MANAGER;
GRANT SELECT ON v_CustomerLoyaltySummary TO MANAGER;
GRANT SELECT ON v_LowStockIngredients TO MANAGER;
GRANT SELECT ON v_ProductRecipeDetails TO MANAGER;
GRANT SELECT ON v_InvoiceDetails TO MANAGER;

-- Thực thi toàn bộ Stored Procedures
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