import { ConnectionPool } from 'mssql'

const ddlStatements: { name: string; sql: string }[] = [
  {
    name: 'v_TopSellingProducts',
    sql: `
CREATE OR ALTER VIEW v_TopSellingProducts AS
SELECT 
    MAX(COALESCE(p.id, pv.productId, 0)) AS productId,
    COALESCE(p.name, od.itemSnapshotName) AS productName,
    SUM(od.quantity) AS totalQuantitySold,
    SUM(od.totalPrice) AS totalRevenue
FROM OrderDetail od
JOIN [Order] o ON od.orderId = o.id
LEFT JOIN ProductVariant pv ON od.variantId = pv.id
LEFT JOIN Product p ON pv.productId = p.id
WHERE o.status = 'COMPLETED' 
  AND o.deletedAt IS NULL
GROUP BY COALESCE(p.name, od.itemSnapshotName);
    `,
  },
  {
    name: 'fn_GetTopSellingProducts',
    sql: `
CREATE OR ALTER FUNCTION fn_GetTopSellingProducts (
    @topN INT,
    @fromDate DATETIME,
    @toDate DATETIME
)
RETURNS TABLE
AS
RETURN (
    SELECT TOP (@topN)
        MAX(COALESCE(p.id, pv.productId, 0)) AS productId,
        COALESCE(p.name, od.itemSnapshotName) AS productName,
        SUM(od.quantity) AS totalQuantitySold,
        SUM(od.totalPrice) AS totalRevenue
    FROM OrderDetail od
    JOIN [Order] o ON od.orderId = o.id
    LEFT JOIN ProductVariant pv ON od.variantId = pv.id
    LEFT JOIN Product p ON pv.productId = p.id
    WHERE o.status = 'COMPLETED'
      AND o.deletedAt IS NULL
      AND ISNULL(o.paidAt, o.createdAt) BETWEEN @fromDate AND @toDate
    GROUP BY COALESCE(p.name, od.itemSnapshotName)
    ORDER BY totalQuantitySold DESC, totalRevenue DESC
);
    `,
  },
  {
    name: 'trg_Product_SoftDeleteOnDelete',
    sql: `
CREATE OR ALTER TRIGGER trg_Product_SoftDeleteOnDelete
ON Product
INSTEAD OF DELETE
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE p
    SET p.deletedAt = SYSDATETIME(), p.updatedAt = SYSDATETIME()
    FROM Product p
    INNER JOIN deleted d ON p.id = d.id;

    UPDATE pv
    SET pv.deletedAt = SYSDATETIME(), pv.updatedAt = SYSDATETIME()
    FROM ProductVariant pv
    INNER JOIN deleted d ON pv.productId = d.id;
END;
    `,
  },
  {
    name: 'trg_ProductVariant_SoftDeleteOnDelete',
    sql: `
CREATE OR ALTER TRIGGER trg_ProductVariant_SoftDeleteOnDelete
ON ProductVariant
INSTEAD OF DELETE
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE pv
    SET pv.deletedAt = SYSDATETIME(), pv.updatedAt = SYSDATETIME()
    FROM ProductVariant pv
    INNER JOIN deleted d ON pv.id = d.id;
END;
    `,
  },
  {
    name: 'trg_Topping_SoftDeleteOnDelete',
    sql: `
CREATE OR ALTER TRIGGER trg_Topping_SoftDeleteOnDelete
ON Topping
INSTEAD OF DELETE
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE t
    SET t.deletedAt = SYSDATETIME(), t.updatedAt = SYSDATETIME()
    FROM Topping t
    INNER JOIN deleted d ON t.id = d.id;
END;
    `,
  },
  {
    name: 'trg_Category_SoftDeleteOnDelete',
    sql: `
CREATE OR ALTER TRIGGER trg_Category_SoftDeleteOnDelete
ON Category
INSTEAD OF DELETE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1 
        FROM Product p 
        INNER JOIN deleted d ON p.categoryId = d.id 
        WHERE p.deletedAt IS NULL
    )
    BEGIN
        RAISERROR(N'Không thể xóa danh mục đang có sản phẩm hoạt động liên kết!', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    UPDATE c
    SET c.deletedAt = SYSDATETIME(), c.updatedAt = SYSDATETIME()
    FROM Category c
    INNER JOIN deleted d ON c.id = d.id;
END;
    `,
  },
  {
    name: 'sp_CompleteOrderPayment',
    sql: `
CREATE OR ALTER PROCEDURE sp_CompleteOrderPayment
    @OrderId INT,
    @PaymentMethod NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;

    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @CustomerId INT, 
                @TotalAmount DECIMAL(18, 2), 
                @CurrentStatus NVARCHAR(50),
                @CurrentPoints INT,
                @ExistingPaidAt DATETIME2(7);

        SELECT 
            @CustomerId = customerId, 
            @TotalAmount = totalAmount, 
            @CurrentStatus = status,
            @ExistingPaidAt = paidAt
        FROM [Order] WITH (UPDLOCK)
        WHERE id = @OrderId;

        IF @CurrentStatus IS NULL
        BEGIN
            RAISERROR(N'Đơn hàng không tồn tại!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        IF @CurrentStatus = N'CANCELLED'
        BEGIN
            RAISERROR(N'Không thể hoàn tất đơn hàng đã bị hủy!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        IF @CurrentStatus = N'COMPLETED'
        BEGIN
            RAISERROR(N'Đơn hàng này đã hoàn tất trước đó!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Chuyển trạng thái sang COMPLETED, ghi nhận pickupAt, giữ nguyên paidAt cũ nếu có
        UPDATE [Order]
        SET status = N'COMPLETED',
            paymentMethod = ISNULL(@PaymentMethod, paymentMethod),
            paidAt = ISNULL(@ExistingPaidAt, SYSDATETIME()),
            pickupAt = SYSDATETIME(),
            pagerId = NULL,
            updatedAt = SYSDATETIME()
        WHERE id = @OrderId;

        -- Đồng bộ các món chưa hoàn tất trong đơn sang 'DONE'
        UPDATE OrderDetail
        SET itemStatus = N'DONE',
            updatedAt = SYSDATETIME()
        WHERE orderId = @OrderId 
          AND itemStatus NOT IN (N'DONE', N'CANCELLED');

        -- Tích điểm hội viên (10,000 VNĐ = 1 Điểm) nếu chưa từng tích điểm cho đơn này
        IF @CustomerId IS NOT NULL AND @TotalAmount >= 10000 
           AND NOT EXISTS (SELECT 1 FROM LoyaltyTransaction WHERE orderId = @OrderId AND transactionType = N'EARN')
        BEGIN
            DECLARE @PointsEarned INT = FLOOR(@TotalAmount / 10000.0);
            
            IF @PointsEarned > 0
            BEGIN
                SELECT @CurrentPoints = rewardPoints 
                FROM Customer WITH (UPDLOCK) 
                WHERE id = @CustomerId;

                DECLARE @NewBalance INT = ISNULL(@CurrentPoints, 0) + @PointsEarned;

                INSERT INTO LoyaltyTransaction (
                    customerId, orderId, transactionType, points, balanceAfter, description, createdAt
                )
                VALUES (
                    @CustomerId, @OrderId, N'EARN', @PointsEarned, @NewBalance, 
                    N'Tích điểm từ đơn hàng #' + CAST(@OrderId AS NVARCHAR(20)), 
                    SYSDATETIME()
                );
            END
        END

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
    `,
  },
]

export async function syncDatabaseObjects(pool: ConnectionPool): Promise<void> {
  console.log('🔄 Đang đồng bộ cấu trúc Database objects (Views, Functions, Triggers, SPs)...')
  for (const item of ddlStatements) {
    try {
      await pool.request().query(item.sql.trim())
      console.log(`  ✅ Đã đồng bộ [${item.name}] thành công.`)
    } catch (err: any) {
      console.error(`  ❌ Lỗi khi đồng bộ [${item.name}]:`, err?.message || err)
    }
  }
}
