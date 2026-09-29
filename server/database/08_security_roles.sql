

-- ==============================================================
-- 1. TẠO CÁC DATABASE ROLES
-- ==============================================================
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'role_ThuNgan' AND type = 'R')
    CREATE ROLE role_ThuNgan;
GO

IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'role_PhaChe' AND type = 'R')
    CREATE ROLE role_PhaChe;
GO

IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'role_Kho' AND type = 'R')
    CREATE ROLE role_Kho;
GO

IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'role_QuanLy' AND type = 'R')
    CREATE ROLE role_QuanLy;
GO

-- ==============================================================
-- 2. PHÂN QUYỀN CHO: role_ThuNgan (CASHIER)
-- Bán hàng tại quầy, tra cứu menu, khách hàng, thẻ rung.
-- Chặn tuyệt đối quyền DELETE để phục vụ kiểm toán tài chính.
-- ==============================================================
-- Cấp quyền thao tác bảng
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

-- Cấp quyền trên Views & Functions phục vụ POS
GRANT SELECT ON v_InvoiceDetails TO role_ThuNgan;
GRANT SELECT ON v_ActivePagerDashboard TO role_ThuNgan;
GRANT SELECT ON v_CustomerLoyaltySummary TO role_ThuNgan;

-- Chặn quyền DELETE (Nguyên tắc kiểm toán)
DENY DELETE ON [Order] TO role_ThuNgan;
DENY DELETE ON OrderDetail TO role_ThuNgan;
DENY DELETE ON LoyaltyTransaction TO role_ThuNgan;
DENY DELETE ON Customer TO role_ThuNgan;

-- Cấp quyền Stored Procedures bán hàng
GRANT EXECUTE ON sp_TaoDonHangTaiQuay TO role_ThuNgan;
GRANT EXECUTE ON sp_ChotThanhToan TO role_ThuNgan;
GRANT EXECUTE ON sp_HuyDonHang TO role_ThuNgan;
GRANT EXECUTE ON sp_ApDungDoiDiem TO role_ThuNgan;
GRANT EXECUTE ON sp_XoaMonKhoiDon TO role_ThuNgan;
GO

-- ==============================================================
-- 3. PHÂN QUYỀN CHO: role_PhaChe (BARISTA)
-- Xem màn hình KDS, tra cứu công thức, hoàn thành món.
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

-- Chặn quyền tài chính & xóa dữ liệu
DENY INSERT, DELETE ON [Order] TO role_PhaChe;
DENY INSERT, DELETE ON OrderDetail TO role_PhaChe;
DENY UPDATE ([subTotal], [discountAmount], [totalAmount]) ON [Order] TO role_PhaChe;
GO

-- ==============================================================
-- 4. PHÂN QUYỀN CHO: role_Kho (STOREKEEPER)
-- Nhập kho nguyên liệu, kiểm kê cân kho, cảnh báo tồn.
-- Tách biệt hoàn toàn với hóa đơn bán hàng và doanh thu.
-- ==============================================================
GRANT SELECT, INSERT, UPDATE ON Ingredient TO role_Kho;
GRANT SELECT, INSERT ON InventoryImport TO role_Kho;
GRANT SELECT, INSERT ON InventoryImportDetail TO role_Kho;
GRANT SELECT, INSERT ON InventoryAdjustment TO role_Kho;

GRANT SELECT ON v_LowStockIngredients TO role_Kho;

-- Quyền thủ tục kho
GRANT EXECUTE ON sp_DieuChinhTonKho TO role_Kho;
GRANT EXECUTE ON sp_LapPhieuNhapKho TO role_Kho;

-- Chặn can thiệp đơn bán hàng
DENY DELETE ON Ingredient TO role_Kho;
DENY DELETE ON InventoryImport TO role_Kho;
DENY DELETE ON InventoryAdjustment TO role_Kho;
DENY SELECT ON [Order] TO role_Kho;
GO

-- ==============================================================
-- 5. PHÂN QUYỀN CHO: role_QuanLy (MANAGER)
-- Toàn quyền cấu hình thực đơn, BOM, xem báo cáo doanh thu.
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

-- Xem tất cả Views báo cáo
GRANT SELECT ON v_DailyRevenue TO role_QuanLy;
GRANT SELECT ON v_TopSellingProducts TO role_QuanLy;
GRANT SELECT ON v_CustomerLoyaltySummary TO role_QuanLy;
GRANT SELECT ON v_LowStockIngredients TO role_QuanLy;
GRANT SELECT ON v_ProductRecipeDetails TO role_QuanLy;
GRANT SELECT ON v_InvoiceDetails TO role_QuanLy;

-- Thực thi toàn bộ Stored Procedures
GRANT EXECUTE ON sp_CauHinhDinhLuongBOM TO role_QuanLy;
GRANT EXECUTE ON sp_DieuChinhTonKho TO role_QuanLy;
GRANT EXECUTE ON sp_LapPhieuNhapKho TO role_QuanLy;
GRANT EXECUTE ON sp_TaoDanhMuc TO role_QuanLy;
GRANT EXECUTE ON sp_TaoTopping TO role_QuanLy;
GRANT EXECUTE ON sp_TaoSanPhamVaBienThe TO role_QuanLy;
GO

-- ==============================================================
-- 6. TẠO 4 SERVER LOGINS & DATABASE USERS MINH HỌA (ĐÁP ỨNG RUBRIC)
-- ==============================================================
-- 1. Quản lý
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = 'login_manager')
    CREATE LOGIN login_manager WITH PASSWORD = 'Password@123', CHECK_POLICY = OFF;
GO
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'user_manager')
    CREATE USER user_manager FOR LOGIN login_manager;
GO
ALTER ROLE role_QuanLy ADD MEMBER user_manager;
GO

-- 2. Thu ngân
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = 'login_cashier')
    CREATE LOGIN login_cashier WITH PASSWORD = 'Password@123', CHECK_POLICY = OFF;
GO
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'user_cashier')
    CREATE USER user_cashier FOR LOGIN login_cashier;
GO
ALTER ROLE role_ThuNgan ADD MEMBER user_cashier;
GO

-- 3. Pha chế
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = 'login_barista')
    CREATE LOGIN login_barista WITH PASSWORD = 'Password@123', CHECK_POLICY = OFF;
GO
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'user_barista')
    CREATE USER user_barista FOR LOGIN login_barista;
GO
ALTER ROLE role_PhaChe ADD MEMBER user_barista;
GO

-- 4. Thủ kho
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = 'login_storekeeper')
    CREATE LOGIN login_storekeeper WITH PASSWORD = 'Password@123', CHECK_POLICY = OFF;
GO
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'user_storekeeper')
    CREATE USER user_storekeeper FOR LOGIN login_storekeeper;
GO
ALTER ROLE role_Kho ADD MEMBER user_storekeeper;
GO