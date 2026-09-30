-- USE CoffeeShopDB;

-- ============================================================================
-- 1. INVENTORY & INGREDIENT TRIGGERS
-- ============================================================================

-- 1.1. Tự động trừ tồn kho khi Barista hoàn thành món
IF OBJECT_ID('trg_OrderDetail_DeductInventory', 'TR') IS NOT NULL DROP TRIGGER trg_OrderDetail_DeductInventory;
GO
CREATE TRIGGER trg_OrderDetail_DeductInventory
ON OrderDetail AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Chỉ kích hoạt khi itemStatus được update thành 'DONE'
    IF UPDATE(itemStatus)
    BEGIN
        UPDATE i
        SET i.stockQuantity = i.stockQuantity - consumed.TotalConsumed
        FROM Ingredient i
        INNER JOIN (
            SELECT rb.ingredientId, SUM(rb.consumedQuantity * ins.quantity) AS TotalConsumed
            FROM inserted ins
            INNER JOIN deleted del ON ins.id = del.id
            INNER JOIN RecipeBOM rb ON ins.variantId = rb.variantId
            WHERE ins.itemStatus = N'DONE' AND del.itemStatus <> N'DONE'
            GROUP BY rb.ingredientId
        ) consumed ON i.id = consumed.ingredientId;
    END
END;
GO

-- 1.2. Tự động cộng dồn tồn kho khi nhập hàng
IF OBJECT_ID('trg_InventoryImportDetail_AddInventory', 'TR') IS NOT NULL DROP TRIGGER trg_InventoryImportDetail_AddInventory;
GO
CREATE TRIGGER trg_InventoryImportDetail_AddInventory
ON InventoryImportDetail AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE i
    SET i.stockQuantity = i.stockQuantity + incoming.TotalAdded
    FROM Ingredient i
    INNER JOIN (
        SELECT ingredientId, SUM(quantity) AS TotalAdded
        FROM inserted
        GROUP BY ingredientId
    ) incoming ON i.id = incoming.ingredientId;
END;
GO

-- 1.3. Chặn đặt món nếu nguyên liệu trong kho không đủ định mức BOM
IF OBJECT_ID('trg_OrderDetail_CheckInventory', 'TR') IS NOT NULL 
    DROP TRIGGER trg_OrderDetail_CheckInventory;
GO

CREATE TRIGGER trg_OrderDetail_CheckInventory
ON OrderDetail 
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Nếu là lệnh UPDATE nhưng không đổi variantId hay quantity thì bỏ qua kiểm tra kho
    IF (EXISTS (SELECT 1 FROM deleted)) AND (NOT UPDATE(variantId) AND NOT UPDATE(quantity))
    BEGIN
        RETURN;
    END

    ;WITH ConsumedOld AS (
        -- Lượng nguyên liệu tiêu hao của các dòng cũ (khi UPDATE)
        SELECT 
            rb.ingredientId,
            SUM(rb.consumedQuantity * d.quantity) AS oldConsumed
        FROM deleted d
        INNER JOIN RecipeBOM rb ON d.variantId = rb.variantId
        -- Chỉ tính nếu trước đó dòng món chưa hoàn thành (DONE) hoặc chưa hủy (CANCELLED)
        WHERE d.itemStatus NOT IN (N'DONE', N'CANCELLED')
        GROUP BY rb.ingredientId
    ),
    ConsumedNew AS (
        -- Lượng nguyên liệu tiêu hao của các dòng mới thêm hoặc sau khi sửa
        SELECT 
            rb.ingredientId,
            SUM(rb.consumedQuantity * i.quantity) AS newConsumed
        FROM inserted i
        INNER JOIN RecipeBOM rb ON i.variantId = rb.variantId
        WHERE i.itemStatus NOT IN (N'DONE', N'CANCELLED')
        GROUP BY rb.ingredientId
    ),
    DeltaRequirement AS (
        -- Tính lượng chênh lệch thực tế cần tiêu hao thêm (Net Delta)
        SELECT 
            COALESCE(cn.ingredientId, co.ingredientId) AS ingredientId,
            ISNULL(cn.newConsumed, 0) - ISNULL(co.oldConsumed, 0) AS additionalConsumed
        FROM ConsumedNew cn
        FULL OUTER JOIN ConsumedOld co ON cn.ingredientId = co.ingredientId
    )
    -- Kiểm tra: Nếu lượng tiêu hao tăng thêm vượt quá tồn kho thực tế hiện tại
    IF EXISTS (
        SELECT 1
        FROM DeltaRequirement dr
        INNER JOIN Ingredient ig ON dr.ingredientId = ig.id
        WHERE dr.additionalConsumed > 0 
          AND ig.stockQuantity < dr.additionalConsumed
    )
    BEGIN
        RAISERROR(N'Nguyên liệu trong kho không đủ để đáp ứng số lượng món yêu cầu!', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO

-- ============================================================================
-- 2. ORDER & PAGER DEVICE TRIGGERS
-- ============================================================================

-- 2.1. Đồng bộ trạng thái thẻ rung theo vòng đời hóa đơn
IF OBJECT_ID('trg_Order_SyncPagerStatus', 'TR') IS NOT NULL DROP TRIGGER trg_Order_SyncPagerStatus;
GO
CREATE TRIGGER trg_Order_SyncPagerStatus
ON [Order] AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Giải phóng thẻ (AVAILABLE) khi đơn hàng hoàn tất hoặc bị hủy
    IF UPDATE(status)
    BEGIN
        UPDATE p
        SET p.status = N'AVAILABLE', p.updatedAt = GETDATE()
        FROM PagerDevice p
        INNER JOIN inserted ins ON p.id = ins.pagerId
        INNER JOIN deleted del ON ins.id = del.id
        WHERE ins.status IN (N'COMPLETED', N'CANCELLED')
          AND del.status NOT IN (N'COMPLETED', N'CANCELLED');
    END

    -- Gán trạng thái sử dụng (IN_USE) khi có đơn hàng mới (Dự phòng nếu SP chưa cập nhật)
    UPDATE p
    SET p.status = N'IN_USE', p.updatedAt = GETDATE()
    FROM PagerDevice p
    INNER JOIN inserted ins ON p.id = ins.pagerId
    LEFT JOIN deleted del ON ins.id = del.id
    WHERE del.id IS NULL AND p.status = N'AVAILABLE';
END;
GO

-- ============================================================================
-- 3. SOFT DELETE & DATA INTEGRITY TRIGGERS
-- ============================================================================

-- 3.1. Cưỡng chế xóa mềm cho thẻ rung (Chặn xóa nếu đang sử dụng)
IF OBJECT_ID('trg_PagerDevice_SoftDelete', 'TR') IS NOT NULL DROP TRIGGER trg_PagerDevice_SoftDelete;
GO
CREATE TRIGGER trg_PagerDevice_SoftDelete
ON PagerDevice INSTEAD OF DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    IF EXISTS (SELECT 1 FROM deleted WHERE status = N'IN_USE')
    BEGIN
        RAISERROR(N'Thiết bị đang phục vụ đơn hàng, không thể thanh lý xóa mềm!', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    UPDATE p
    SET p.deletedAt = GETDATE(), p.updatedAt = GETDATE()
    FROM PagerDevice p
    INNER JOIN deleted d ON p.id = d.id;
END;
GO

-- 3.2. Cưỡng chế xóa mềm cho thông tin Hội viên
IF OBJECT_ID('trg_Customer_SoftDelete', 'TR') IS NOT NULL DROP TRIGGER trg_Customer_SoftDelete;
GO
CREATE TRIGGER trg_Customer_SoftDelete
ON Customer INSTEAD OF DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE c
    SET c.deletedAt = GETDATE(), c.updatedAt = GETDATE()
    FROM Customer c
    INNER JOIN deleted d ON c.id = d.id;
END;
GO

-- 3.3. Chặn thao tác chỉnh sửa/xóa điểm thưởng
IF OBJECT_ID('trg_LoyaltyTransaction_AppendOnly', 'TR') IS NOT NULL DROP TRIGGER trg_LoyaltyTransaction_AppendOnly;
GO
CREATE TRIGGER trg_LoyaltyTransaction_AppendOnly
ON LoyaltyTransaction INSTEAD OF UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    RAISERROR(N'Nghiêm cấm sửa đổi hoặc xóa dữ liệu sổ cái điểm thưởng!', 16, 1);
    ROLLBACK TRANSACTION;
END;
GO

-- 3.4. Tự động đồng bộ số dư điểm từ sổ cái vào bảng Customer khi có giao dịch mới
IF OBJECT_ID('trg_LoyaltyTransaction_SyncPoints', 'TR') IS NOT NULL DROP TRIGGER trg_LoyaltyTransaction_SyncPoints;
GO
CREATE TRIGGER trg_LoyaltyTransaction_SyncPoints
ON LoyaltyTransaction AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE c
    SET c.rewardPoints = (
        SELECT ISNULL(SUM(points), 0)
        FROM LoyaltyTransaction
        WHERE customerId = c.id
    ),
    c.updatedAt = GETDATE()
    FROM Customer c
    INNER JOIN inserted i ON c.id = i.customerId;
END;
GO