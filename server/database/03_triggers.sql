-- USE CoffeeShopDB;

-- ============================================================================
-- 1. INVENTORY & INGREDIENT TRIGGERS
-- ============================================================================

-- 1.1. Tự động trừ tồn kho khi Barista hoàn thành món
CREATE OR ALTER TRIGGER trg_OrderDetail_DeductInventory
ON OrderDetail AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Chỉ kích hoạt khi itemStatus được cập nhật sang 'DONE'
    IF UPDATE(itemStatus)
    BEGIN
        ;WITH DeductList AS (
            -- 1. Tiêu hao từ biến thể món (RecipeBOM)
            SELECT 
                rb.ingredientId, 
                SUM(rb.consumedQuantity * ins.quantity) AS TotalConsumed
            FROM inserted ins
            INNER JOIN deleted del ON ins.id = del.id
            INNER JOIN RecipeBOM rb ON ins.variantId = rb.variantId
            WHERE ins.itemStatus = N'DONE' AND del.itemStatus <> N'DONE'
            GROUP BY rb.ingredientId

            UNION ALL

            -- 2. Tiêu hao từ Topping đi kèm của ly đó (ToppingBOM)
            SELECT 
                tb.ingredientId,
                SUM(tb.consumedQuantity * odt.quantity * ins.quantity) AS TotalConsumed
            FROM inserted ins
            INNER JOIN deleted del ON ins.id = del.id
            INNER JOIN OrderDetailTopping odt ON ins.id = odt.orderDetailId
            INNER JOIN ToppingBOM tb ON odt.toppingId = tb.toppingId
            WHERE ins.itemStatus = N'DONE' AND del.itemStatus <> N'DONE'
            GROUP BY tb.ingredientId
        ),
        AggregatedDeduct AS (
            SELECT ingredientId, SUM(TotalConsumed) AS FinalConsumed
            FROM DeductList
            GROUP BY ingredientId
        )
        UPDATE i
        SET i.stockQuantity = i.stockQuantity - ad.FinalConsumed,
            i.updatedAt = SYSDATETIME()
        FROM Ingredient i
        INNER JOIN AggregatedDeduct ad ON i.id = ad.ingredientId;
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
CREATE OR ALTER TRIGGER trg_OrderDetail_CheckInventory
ON OrderDetail 
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Nếu là thao tác UPDATE nhưng KHÔNG đổi món (variantId) và KHÔNG đổi số lượng (quantity) -> BỎ QUA
    -- Giúp Barista cập nhật PREPARING / DONE mượt mà mà không bao giờ bị rollback vô lý
    IF (EXISTS (SELECT 1 FROM deleted)) 
       AND (NOT UPDATE(variantId) AND NOT UPDATE(quantity))
    BEGIN
        RETURN;
    END

    -- 2. Nếu tất cả các dòng được cập nhật đều là DONE hoặc CANCELLED -> BỎ QUA
    IF NOT EXISTS (
        SELECT 1 FROM inserted 
        WHERE itemStatus IN (N'PENDING', N'PREPARING')
    )
    BEGIN
        RETURN;
    END

    -- 3. Tính tổng lượng nguyên liệu ĐANG CHỜ (PENDING + PREPARING) của toàn hệ thống
    ;WITH PendingList AS (
        -- Lượng tiêu hao từ công thức món chính (RecipeBOM)
        SELECT 
            rb.ingredientId, 
            SUM(rb.consumedQuantity * od.quantity) AS pendingQty
        FROM OrderDetail od
        INNER JOIN RecipeBOM rb ON od.variantId = rb.variantId
        WHERE od.itemStatus IN (N'PENDING', N'PREPARING')
        GROUP BY rb.ingredientId

        UNION ALL

        -- Lượng tiêu hao từ Topping đi kèm (ToppingBOM)
        SELECT 
            tb.ingredientId,
            SUM(tb.consumedQuantity * odt.quantity * od.quantity) AS pendingQty
        FROM OrderDetail od
        INNER JOIN OrderDetailTopping odt ON od.id = odt.orderDetailId
        INNER JOIN ToppingBOM tb ON odt.toppingId = tb.toppingId
        WHERE od.itemStatus IN (N'PENDING', N'PREPARING')
        GROUP BY tb.ingredientId
    ),
    TotalPending AS (
        SELECT ingredientId, SUM(pendingQty) AS totalPending
        FROM PendingList
        GROUP BY ingredientId
    )
    -- So sánh trực tiếp Tổng cần chờ với Tồn kho thực tế
    SELECT TOP 1 1
    FROM TotalPending tp
    INNER JOIN Ingredient ig ON tp.ingredientId = ig.id
    WHERE ig.stockQuantity < tp.totalPending;

    IF @@ROWCOUNT > 0
    BEGIN
        RAISERROR(N'Tồn kho nguyên liệu không đủ để đáp ứng yêu cầu các đơn hàng đang chờ!', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO

-- 1.4. Chặn thêm Topping nếu tồn kho nguyên liệu không đủ
CREATE OR ALTER TRIGGER trg_OrderDetailTopping_CheckInventory
ON OrderDetailTopping
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    ;WITH PendingList AS (
        SELECT 
            rb.ingredientId, 
            SUM(rb.consumedQuantity * od.quantity) AS pendingQty
        FROM OrderDetail od
        INNER JOIN RecipeBOM rb ON od.variantId = rb.variantId
        WHERE od.itemStatus IN (N'PENDING', N'PREPARING')
        GROUP BY rb.ingredientId

        UNION ALL

        SELECT 
            tb.ingredientId,
            SUM(tb.consumedQuantity * odt.quantity * od.quantity) AS pendingQty
        FROM OrderDetail od
        INNER JOIN OrderDetailTopping odt ON od.id = odt.orderDetailId
        INNER JOIN ToppingBOM tb ON odt.toppingId = tb.toppingId
        WHERE od.itemStatus IN (N'PENDING', N'PREPARING')
        GROUP BY tb.ingredientId
    ),
    TotalPending AS (
        SELECT ingredientId, SUM(pendingQty) AS totalPending
        FROM PendingList
        GROUP BY ingredientId
    )
    SELECT TOP 1 1
    FROM TotalPending tp
    INNER JOIN Ingredient ig ON tp.ingredientId = ig.id
    WHERE ig.stockQuantity < tp.totalPending;

    IF @@ROWCOUNT > 0
    BEGIN
        RAISERROR(N'Tồn kho nguyên liệu không đủ để đáp ứng yêu cầu Topping của các đơn hàng đang chờ!', 16, 1);
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
        INNER JOIN (
            SELECT COALESCE(ins.pagerId, del.pagerId) AS pagerId
            FROM inserted ins
            INNER JOIN deleted del ON ins.id = del.id
            WHERE ins.status IN (N'COMPLETED', N'CANCELLED')
              AND del.status NOT IN (N'COMPLETED', N'CANCELLED')
        ) released ON p.id = released.pagerId
        WHERE released.pagerId IS NOT NULL;
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

-- 3.4. Tự động đồng bộ số dư điểm & nâng hạng thành viên từ sổ cái vào bảng Customer khi có giao dịch mới
IF OBJECT_ID('trg_LoyaltyTransaction_SyncPoints', 'TR') IS NOT NULL DROP TRIGGER trg_LoyaltyTransaction_SyncPoints;
GO
CREATE TRIGGER trg_LoyaltyTransaction_SyncPoints
ON LoyaltyTransaction AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    ;WITH CustomerPointStats AS (
        SELECT 
            c.id AS customerId,
            ISNULL(SUM(lt.points), 0) AS currentBalance,
            ISNULL(SUM(CASE WHEN lt.transactionType = N'EARN' THEN lt.points ELSE 0 END), 0) AS totalLifetimeEarned
        FROM Customer c
        INNER JOIN (SELECT DISTINCT customerId FROM inserted) i ON c.id = i.customerId
        LEFT JOIN LoyaltyTransaction lt ON c.id = lt.customerId
        GROUP BY c.id
    )
    UPDATE c
    SET c.rewardPoints = CASE WHEN cps.currentBalance < 0 THEN 0 ELSE cps.currentBalance END,
        c.membershipTier = CASE 
            WHEN cps.totalLifetimeEarned >= 1000 THEN N'DIAMOND'
            WHEN cps.totalLifetimeEarned >= 500 THEN N'GOLD'
            WHEN cps.totalLifetimeEarned >= 200 THEN N'SILVER'
            ELSE N'STANDARD'
        END,
        c.updatedAt = SYSDATETIME()
    FROM Customer c
    INNER JOIN CustomerPointStats cps ON c.id = cps.customerId
END;
GO