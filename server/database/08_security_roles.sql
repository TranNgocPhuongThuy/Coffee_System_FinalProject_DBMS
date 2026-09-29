

-- ==============================================================
-- 1. TẠO CÁC DATABASE ROLES NẾU CHƯA TỒN TẠI
-- ==============================================================
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'CASHIER' AND type = 'R')
    CREATE ROLE role_ThuNgan;
GO

IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'BARISTA' AND type = 'R')
    CREATE ROLE role_PhaChe;
GO

IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'STOREKEEPER' AND type = 'R')
    CREATE ROLE role_Kho;
GO

IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'MANAGER' AND type = 'R')
    CREATE ROLE role_QuanLy;
GO

-- ==============================================================
-- 2. PHÂN QUYỀN CHO: role_ThuNgan (CASHIER)
-- Phạm vi: Bán hàng tại quầy, tra cứu menu, khách hàng, thẻ rung.
-- Chặn tuyệt đối quyền DELETE để phục vụ kiểm toán tài chính.
-- ==============================================================
-- Quyền trên Bảng dữ liệu
GRANT SELECT, INSERT, UPDATE ON [Order] TO role_ThuNgan;
GRANT SELECT, INSERT, UPDATE ON OrderDetail TO role_ThuNgan;
GRANT SELECT, INSERT, UPDATE ON OrderDetailTopping TO role_ThuNgan;
GRANT SELECT, INSERT, UPDATE ON Customer TO role_ThuNgan;
GRANT SELECT, INSERT ON LoyaltyTransaction TO role_ThuNgan;
GRANT SELECT, UPDATE ON PagerDevice TO role_ThuNgan;
GRANT SELECT ON Category TO role_ThuNgan;
GRANT SELECT ON Product TO role_ThuNgan;
GRANT SELECT ON ProductVariant TO role_ThuNgan;
GRANT SELECT ON Topping TO role_ThuNgan;
GRANT SELECT ON Employee TO role_ThuNgan;

-- Quyền trên Views & Functions phục vụ POS
GRANT SELECT ON v_InvoiceDetails TO role_ThuNgan;
GRANT SELECT ON v_ActivePagerDashboard TO role_ThuNgan;
GRANT SELECT ON v_CustomerLoyaltySummary TO role_ThuNgan;

-- Chặn quyền DELETE (Nguyên tắc kiểm toán)
DENY DELETE ON [Order] TO role_ThuNgan;
DENY DELETE ON OrderDetail TO role_ThuNgan;
DENY DELETE ON LoyaltyTransaction TO role_ThuNgan;
DENY DELETE ON Customer TO role_ThuNgan;
GO

-- ==============================================================
-- 3. PHÂN QUYỀN CHO: role_PhaChe (BARISTA)
-- Phạm vi: Xem màn hình KDS, tra cứu công thức, hoàn thành món.
-- Ngăn chặn can thiệp giá bán, doanh thu và xóa dữ liệu.
-- ==============================================================
GRANT SELECT ON [Order] TO role_PhaChe;
GRANT SELECT, UPDATE (itemStatus) ON OrderDetail TO role_PhaChe;
GRANT SELECT ON OrderDetailTopping TO role_PhaChe;
GRANT SELECT ON RecipeBOM TO role_PhaChe;
GRANT SELECT ON ToppingBOM TO role_PhaChe;
GRANT SELECT ON Ingredient TO role_PhaChe;
GRANT SELECT, UPDATE (status) ON PagerDevice TO role_PhaChe;

GRANT SELECT ON v_ProductRecipeDetails TO role_PhaChe;
GRANT SELECT ON v_ActivePagerDashboard TO role_PhaChe;

DENY INSERT, DELETE ON [Order] TO role_PhaChe;
DENY INSERT, DELETE ON OrderDetail TO role_PhaChe;
DENY UPDATE ([subTotal], [discountAmount], [totalAmount]) ON [Order] TO role_PhaChe;
GO

-- ==============================================================
-- 4. PHÂN QUYỀN CHO: role_Kho (STOREKEEPER)
-- Phạm vi: Nhập kho nguyên liệu, kiểm kê cân kho, cảnh báo tồn.
-- Tách biệt hoàn toàn với hóa đơn bán hàng và doanh thu.
-- ==============================================================
GRANT SELECT, INSERT, UPDATE ON Ingredient TO role_Kho;
GRANT SELECT, INSERT ON InventoryImport TO role_Kho;
GRANT SELECT, INSERT ON InventoryImportDetail TO role_Kho;
GRANT SELECT, INSERT ON InventoryAdjustment TO role_Kho;

GRANT SELECT ON v_LowStockIngredients TO role_Kho;

-- Quyền thực thi Stored Procedure kho
GRANT EXECUTE ON sp_DieuChinhTonKho TO role_Kho;

DENY DELETE ON Ingredient TO role_Kho;
DENY DELETE ON InventoryImport TO role_Kho;
DENY DELETE ON InventoryAdjustment TO role_Kho;
DENY SELECT ON [Order] TO role_Kho;
GO

-- ==============================================================
-- 5. PHÂN QUYỀN CHO: role_QuanLy (MANAGER)
-- Phạm vi: Toàn quyền cấu hình thực đơn, BOM, xem báo cáo doanh thu.
-- ==============================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON Category TO role_QuanLy;
GRANT SELECT, INSERT, UPDATE, DELETE ON Product TO role_QuanLy;
GRANT SELECT, INSERT, UPDATE, DELETE ON ProductVariant TO role_QuanLy;
GRANT SELECT, INSERT, UPDATE, DELETE ON Topping TO role_QuanLy;
GRANT SELECT, INSERT, UPDATE, DELETE ON RecipeBOM TO role_QuanLy;
GRANT SELECT, INSERT, UPDATE, DELETE ON ToppingBOM TO role_QuanLy;
GRANT SELECT, INSERT, UPDATE, DELETE ON PagerDevice TO role_QuanLy;
GRANT SELECT, INSERT, UPDATE, DELETE ON Employee TO role_QuanLy;
GRANT SELECT, INSERT, UPDATE, DELETE ON Ingredient TO role_QuanLy;
GRANT SELECT, INSERT, UPDATE, DELETE ON [Order] TO role_QuanLy;

-- Xem tất cả Views báo cáo quản trị
GRANT SELECT ON v_DailyRevenue TO role_QuanLy;
GRANT SELECT ON v_TopSellingProducts TO role_QuanLy;
GRANT SELECT ON v_CustomerLoyaltySummary TO role_QuanLy;
GRANT SELECT ON v_LowStockIngredients TO role_QuanLy;
GRANT SELECT ON v_ProductRecipeDetails TO role_QuanLy;
GRANT SELECT ON v_InvoiceDetails TO role_QuanLy;

-- Thực thi toàn bộ Stored Procedures
GRANT EXECUTE ON sp_CauHinhDinhLuongBOM TO role_QuanLy;
GRANT EXECUTE ON sp_DieuChinhTonKho TO role_QuanLy;
GO