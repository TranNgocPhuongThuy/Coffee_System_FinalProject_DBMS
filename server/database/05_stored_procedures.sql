-- USE CoffeeShopDB;

-- ==============================================================
-- XÓA CÁC STORED PROCEDURE NẾU ĐÃ TỒN TẠI
-- ==============================================================

-- 1. Phân hệ Bán hàng & Thanh toán (POS)
IF OBJECT_ID('sp_CreateCounterOrder', 'P') IS NOT NULL 
    DROP PROCEDURE sp_CreateCounterOrder;
GO

IF OBJECT_ID('sp_CreateOrderWithPager', 'P') IS NOT NULL 
    DROP PROCEDURE sp_CreateOrderWithPager;
GO

IF OBJECT_ID('sp_CompleteOrderPayment', 'P') IS NOT NULL 
    DROP PROCEDURE sp_CompleteOrderPayment;
GO

IF OBJECT_ID('sp_CancelOrder', 'P') IS NOT NULL 
    DROP PROCEDURE sp_CancelOrder;
GO

IF OBJECT_ID('sp_RemoveOrderItem', 'P') IS NOT NULL 
    DROP PROCEDURE sp_RemoveOrderItem;
GO

-- 2. Phân hệ Khách hàng & Điểm thưởng (Loyalty)
IF OBJECT_ID('sp_ApplyLoyaltyPoints', 'P') IS NOT NULL 
    DROP PROCEDURE sp_ApplyLoyaltyPoints;
GO

IF OBJECT_ID('sp_UpsertCustomerMember', 'P') IS NOT NULL 
    DROP PROCEDURE sp_UpsertCustomerMember;
GO

-- 3. Phân hệ Kho & Định lượng (Inventory & BOM)
IF OBJECT_ID('sp_UpsertRecipeBOM', 'P') IS NOT NULL 
    DROP PROCEDURE sp_UpsertRecipeBOM;
GO

IF OBJECT_ID('sp_CreateInventoryImport', 'P') IS NOT NULL 
    DROP PROCEDURE sp_CreateInventoryImport;
GO

IF OBJECT_ID('sp_DieuChinhTonKho', 'P') IS NOT NULL 
    DROP PROCEDURE sp_DieuChinhTonKho;
GO

PRINT N'Đã xóa thành công các Stored Procedure cũ (nếu có). Bạn có thể tiến hành tạo lại SP mới!';


-- ============================================================================
-- 0. USER-DEFINED TABLE TYPES
-- ============================================================================

IF EXISTS (SELECT * FROM sys.types WHERE name = 'udt_OrderDetailList')
    DROP TYPE udt_OrderDetailList;
GO

-- Đơn vị danh sách món
CREATE TYPE udt_OrderDetailList AS TABLE (
    variantId INT NOT NULL,
    quantity INT NOT NULL,
    note NVARCHAR(255),
    itemSnapshotName NVARCHAR(200) NOT NULL,
    sizeSnapshot NVARCHAR(50) NOT NULL,
    unitPrice DECIMAL(18, 2) NOT NULL,
    totalToppingPriceSnapshot DECIMAL(18, 2) NOT NULL,
    totalPrice DECIMAL(18, 2) NOT NULL
);
GO

IF EXISTS (SELECT * FROM sys.types WHERE name = 'udt_InventoryImportDetailList')
    DROP TYPE udt_InventoryImportDetailList;
GO

-- Đơn vị danh sách nguyên liệu nhập
CREATE TYPE udt_InventoryImportDetailList AS TABLE (
    ingredientId INT NOT NULL,
    quantity DECIMAL(18, 3) NOT NULL,
    unitPrice DECIMAL(18, 2) NOT NULL,
    totalLineAmount DECIMAL(18, 2) NOT NULL
);
GO


-- ============================================================================
-- 1. POS & TRANSACTION MODULE
-- ============================================================================

-- 1.1. sp_CreateCounterOrder
IF OBJECT_ID('sp_CreateCounterOrder', 'P') IS NOT NULL DROP PROCEDURE sp_CreateCounterOrder;
GO

CREATE PROCEDURE sp_CreateCounterOrder
    @OrderCode VARCHAR(64),
    @EmployeeId INT,
    @CustomerId INT = NULL,
    @PagerId INT = NULL,
    @SubTotal DECIMAL(18, 2),
    @DiscountAmount DECIMAL(18, 2) = 0,
    @TotalAmount DECIMAL(18, 2),
    @PaymentMethod NVARCHAR(50),
    @OrderDetails udt_OrderDetailList READONLY,
    @NewOrderId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

    BEGIN TRY
        BEGIN TRANSACTION;

        INSERT INTO [Order] (
            orderCode, customerId, pagerId, employeeId, orderChannel,
            subTotal, discountAmount, totalAmount, paymentMethod,
            status, createdAt
        )
        VALUES (
            @OrderCode, @CustomerId, @PagerId, @EmployeeId, N'ORDER_AT_COUNTER',
            @SubTotal, @DiscountAmount, @TotalAmount, @PaymentMethod,
            N'PENDING_PREP', GETDATE()
        );

        SET @NewOrderId = SCOPE_IDENTITY();

        INSERT INTO OrderDetail (
            orderId, variantId, quantity, note, itemSnapshotName,
            sizeSnapshot, unitPrice, totalToppingPriceSnapshot,
            totalPrice, itemStatus, createdAt
        )
        SELECT 
            @NewOrderId, variantId, quantity, note, itemSnapshotName,
            sizeSnapshot, unitPrice, totalToppingPriceSnapshot,
            totalPrice, N'PENDING', GETDATE()
        FROM @OrderDetails;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO


-- 1.2. sp_CompleteOrderPayment
IF OBJECT_ID('sp_CompleteOrderPayment', 'P') IS NOT NULL DROP PROCEDURE sp_CompleteOrderPayment;
GO

CREATE PROCEDURE sp_CompleteOrderPayment
    @OrderId INT,
    @PaymentMethod NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;

    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @CustomerId INT, 
                @TotalAmount DECIMAL(18, 2), 
                @CurrentStatus NVARCHAR(50),
                @CurrentPoints INT;

        -- Khóa dòng Order để kiểm tra trạng thái
        SELECT @CustomerId = customerId, @TotalAmount = totalAmount, @CurrentStatus = status
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
            RAISERROR(N'Không thể hoàn tất thanh toán cho đơn hàng đã bị hủy!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        IF @CurrentStatus = N'COMPLETED'
        BEGIN
            RAISERROR(N'Đơn hàng này đã được thanh toán trước đó!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Cập nhật trạng thái đơn hàng sang COMPLETED
        UPDATE [Order]
        SET status = N'COMPLETED',
            paymentMethod = @PaymentMethod,
            paidAt = GETDATE(),
            updatedAt = GETDATE()
        WHERE id = @OrderId;

        -- Tích điểm hội viên (10,000 VNĐ = 1 Điểm)
        IF @CustomerId IS NOT NULL AND @TotalAmount >= 10000
        BEGIN
            DECLARE @PointsEarned INT = FLOOR(@TotalAmount / 10000.0);
            
            IF @PointsEarned > 0
            BEGIN
                -- Khóa dòng Customer và lấy số dư điểm hiện tại
                SELECT @CurrentPoints = rewardPoints 
                FROM Customer WITH (UPDLOCK) 
                WHERE id = @CustomerId;

                DECLARE @NewBalance INT = ISNULL(@CurrentPoints, 0) + @PointsEarned;

                -- Ghi vào sổ cái LoyaltyTransaction
                -- Trigger trg_LoyaltyTransaction_SyncPoints sẽ tự động đồng bộ sang Customer.rewardPoints
                INSERT INTO LoyaltyTransaction (
                    customerId, 
                    orderId, 
                    transactionType, 
                    points, 
                    balanceAfter, 
                    description, 
                    createdAt
                )
                VALUES (
                    @CustomerId, 
                    @OrderId, 
                    N'EARN', 
                    @PointsEarned, 
                    @NewBalance, 
                    N'Tích điểm từ đơn hàng #' + CAST(@OrderId AS NVARCHAR(20)), 
                    GETDATE()
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
GO


-- 1.3. sp_CancelOrder
IF OBJECT_ID('sp_CancelOrder', 'P') IS NOT NULL 
    DROP PROCEDURE sp_CancelOrder;
GO

CREATE PROCEDURE sp_CancelOrder
    @OrderId INT,
    @EmployeeId INT,
    @CancelReason NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @CurrentStatus NVARCHAR(50), 
                @PaidAt DATETIME2(7),
                @CustomerId INT,
                @PointsRedeemed INT;

        -- 1. Khóa và kiểm tra thông tin đơn hàng
        SELECT 
            @CurrentStatus = status, 
            @PaidAt = paidAt,
            @CustomerId = customerId
        FROM [Order] WITH (UPDLOCK, ROWLOCK)
        WHERE id = @OrderId AND deletedAt IS NULL;

        -- Kiểm tra đơn hàng có tồn tại không
        IF @CurrentStatus IS NULL
        BEGIN
            RAISERROR(N'Đơn hàng không tồn tại hoặc đã bị xóa!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Chặn hủy đơn đã thanh toán hoặc đã hoàn tất
        IF @CurrentStatus = N'COMPLETED' OR @PaidAt IS NOT NULL
        BEGIN
            RAISERROR(N'Không thể hủy đơn hàng đã hoàn tất hoặc đã thanh toán!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Chặn hủy lại đơn đã bị hủy trước đó
        IF @CurrentStatus = N'CANCELLED'
        BEGIN
            RAISERROR(N'Đơn hàng này đã bị hủy trước đó!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- 2. Cập nhật trạng thái đơn hàng sang CANCELLED và lưu vết nhân viên hủy
        -- Trigger trg_Order_SyncPagerStatus sẽ tự động giải phóng thẻ rung về AVAILABLE
        UPDATE [Order]
        SET status = N'CANCELLED',
            cancelReason = @CancelReason,
            updatedAt = GETDATE()
        WHERE id = @OrderId;

        -- 3. Hoàn trả điểm thưởng nếu khách hàng từng đổi điểm (REDEEM) cho đơn này
        IF @CustomerId IS NOT NULL
        BEGIN
            -- Tìm số điểm đã trừ trong đơn hàng
            SELECT @PointsRedeemed = ABS(points)
            FROM LoyaltyTransaction
            WHERE orderId = @OrderId AND transactionType = N'REDEEM';

            IF @PointsRedeemed > 0
            BEGIN
                DECLARE @CurrentBalance INT;
                SELECT @CurrentBalance = rewardPoints 
                FROM Customer WITH (UPDLOCK, ROWLOCK) 
                WHERE id = @CustomerId;

                DECLARE @NewBalance INT = ISNULL(@CurrentBalance, 0) + @PointsRedeemed;

                -- Ghi nhận giao dịch hoàn điểm vào sổ cái
                -- Trigger trg_LoyaltyTransaction_SyncPoints sẽ tự động cộng bù lại vào Customer.rewardPoints
                INSERT INTO LoyaltyTransaction (
                    customerId, 
                    orderId, 
                    transactionType, 
                    points, 
                    balanceAfter, 
                    description, 
                    createdAt
                )
                VALUES (
                    @CustomerId, 
                    @OrderId, 
                    N'EARN', 
                    @PointsRedeemed, 
                    @NewBalance, 
                    N'Hoàn lại điểm tích lũy do hủy đơn hàng #' + CAST(@OrderId AS NVARCHAR(20)), 
                    GETDATE()
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
GO


-- 1.4. sp_ApplyLoyaltyPoints
IF OBJECT_ID('sp_ApplyLoyaltyPoints', 'P') IS NOT NULL DROP PROCEDURE sp_ApplyLoyaltyPoints;
GO

CREATE PROCEDURE sp_ApplyLoyaltyPoints
    @OrderId INT,
    @CustomerId INT,
    @PointsToRedeem INT,
    @ConversionRate DECIMAL(18, 2) = 1000 -- 1 Point = 1,000 VND
AS
BEGIN
    SET NOCOUNT ON;
    SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;

    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @CurrentPoints INT;
        SELECT @CurrentPoints = rewardPoints FROM Customer WITH (UPDLOCK) WHERE id = @CustomerId;

        IF @CurrentPoints IS NULL OR @CurrentPoints < @PointsToRedeem
        BEGIN
            RAISERROR(N'Insufficient loyalty points balance!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        DECLARE @DiscountAmount DECIMAL(18, 2) = @PointsToRedeem * @ConversionRate;

        UPDATE Customer
        SET rewardPoints = rewardPoints - @PointsToRedeem,
            updatedAt = GETDATE()
        WHERE id = @CustomerId;

        UPDATE [Order]
        SET discountAmount = discountAmount + @DiscountAmount,
            totalAmount = CASE WHEN (subTotal - (discountAmount + @DiscountAmount)) < 0 THEN 0 ELSE subTotal - (discountAmount + @DiscountAmount) END,
            updatedAt = GETDATE()
        WHERE id = @OrderId;

        DECLARE @NewBalance INT;
        SELECT @NewBalance = rewardPoints FROM Customer WHERE id = @CustomerId;

        INSERT INTO LoyaltyTransaction (customerId, orderId, transactionType, points, balanceAfter, description, createdAt)
        VALUES (@CustomerId, @OrderId, N'REDEEM', -@PointsToRedeem, @NewBalance, N'Redeemed points for order #' + CAST(@OrderId AS NVARCHAR(20)), GETDATE());

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO


-- 1.5. sp_RemoveOrderItem
IF OBJECT_ID('sp_RemoveOrderItem', 'P') IS NOT NULL DROP PROCEDURE sp_RemoveOrderItem;
GO

CREATE PROCEDURE sp_RemoveOrderItem
    @OrderDetailId INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @OrderId INT;
        SELECT @OrderId = orderId FROM OrderDetail WHERE id = @OrderDetailId;

        DELETE FROM OrderDetailTopping WHERE orderDetailId = @OrderDetailId;
        DELETE FROM OrderDetail WHERE id = @OrderDetailId;

        IF @OrderId IS NOT NULL
        BEGIN
            UPDATE [Order] SET updatedAt = GETDATE() WHERE id = @OrderId;
        END

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO


-- ============================================================================
-- 2. INVENTORY & BOM MODULE
-- ============================================================================

-- 2.1. sp_UpsertRecipeBOM
IF OBJECT_ID('sp_UpsertRecipeBOM', 'P') IS NOT NULL DROP PROCEDURE sp_UpsertRecipeBOM;
GO

CREATE PROCEDURE sp_UpsertRecipeBOM
    @VariantId INT,
    @IngredientId INT,
    @ConsumedQuantity DECIMAL(18, 4)
AS
BEGIN
    SET NOCOUNT ON;
    IF @ConsumedQuantity <= 0
    BEGIN
        RAISERROR(N'Consumed quantity must be greater than 0!', 16, 1);
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM ProductVariant WHERE id = @VariantId AND deletedAt IS NULL)
    BEGIN
        RAISERROR(N'Product variant does not exist or has been deleted!', 16, 1);
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM Ingredient WHERE id = @IngredientId AND deletedAt IS NULL)
    BEGIN
        RAISERROR(N'Ingredient does not exist or has been deleted!', 16, 1);
        RETURN;
    END

    IF EXISTS (SELECT 1 FROM RecipeBOM WHERE variantId = @VariantId AND ingredientId = @IngredientId)
    BEGIN
        UPDATE RecipeBOM
        SET consumedQuantity = @ConsumedQuantity
        WHERE variantId = @VariantId AND ingredientId = @IngredientId;
    END
    ELSE
    BEGIN
        INSERT INTO RecipeBOM (variantId, ingredientId, consumedQuantity)
        VALUES (@VariantId, @IngredientId, @ConsumedQuantity);
    END
END;
GO


-- 2.2. sp_CreateInventoryImport
IF OBJECT_ID('sp_CreateInventoryImport', 'P') IS NOT NULL DROP PROCEDURE sp_CreateInventoryImport;
GO

CREATE PROCEDURE sp_CreateInventoryImport
    @SupplierName NVARCHAR(255),
    @EmployeeId INT,
    @Note NVARCHAR(MAX) = NULL,
    @ImportDetails udt_InventoryImportDetailList READONLY,
    @NewImportId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @TotalAmount DECIMAL(18, 2);
        SELECT @TotalAmount = SUM(totalLineAmount) FROM @ImportDetails;

        INSERT INTO InventoryImport (supplierName, employeeId, totalAmount, importDate, note)
        VALUES (@SupplierName, @EmployeeId, ISNULL(@TotalAmount, 0), GETDATE(), @Note);

        SET @NewImportId = SCOPE_IDENTITY();

        INSERT INTO InventoryImportDetail (importId, ingredientId, quantity, unitPrice, totalLineAmount)
        SELECT @NewImportId, ingredientId, quantity, unitPrice, totalLineAmount
        FROM @ImportDetails;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO


-- ============================================================================
-- 3. PAGER DEVICE, COUNTER & MEMBER MODULE
-- ============================================================================

-- 3.1. sp_CreateOrderWithPager
IF OBJECT_ID('sp_CreateOrderWithPager', 'P') IS NOT NULL DROP PROCEDURE sp_CreateOrderWithPager;
GO

CREATE PROCEDURE sp_CreateOrderWithPager
    @OrderCode VARCHAR(64),
    @OrderChannel NVARCHAR(50),
    @PagerCode VARCHAR(50),
    @EmployeeId INT,
    @CustomerId INT = NULL,
    @SubTotal DECIMAL(18, 2),
    @DiscountAmount DECIMAL(18, 2) = 0,
    @PaymentMethod NVARCHAR(50),
    @OrderDetails udt_OrderDetailList READONLY,
    @NewOrderId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @PagerId INT, @PagerStatus NVARCHAR(50);

        -- Row-level lock to prevent concurrent pager assignment race conditions
        SELECT @PagerId = id, @PagerStatus = status
        FROM PagerDevice WITH (UPDLOCK, ROWLOCK)
        WHERE pagerCode = @PagerCode AND deletedAt IS NULL;

        IF @PagerId IS NULL
        BEGIN
            RAISERROR(N'Pager device code does not exist!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        IF @PagerStatus <> N'AVAILABLE'
        BEGIN
            RAISERROR(N'Pager device is currently not available!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        DECLARE @TotalAmount DECIMAL(18, 2) = @SubTotal - @DiscountAmount;
        IF @TotalAmount < 0 SET @TotalAmount = 0;

        INSERT INTO [Order] (
            orderCode, customerId, pagerId, employeeId, orderChannel,
            subTotal, discountAmount, totalAmount, paymentMethod,
            status, paidAt, createdAt
        )
        VALUES (
            @OrderCode, @CustomerId, @PagerId, @EmployeeId, @OrderChannel,
            @SubTotal, @DiscountAmount, @TotalAmount, @PaymentMethod,
            N'PENDING_PREP', GETDATE(), GETDATE()
        );

        SET @NewOrderId = SCOPE_IDENTITY();

        INSERT INTO OrderDetail (
            orderId, variantId, quantity, note, itemSnapshotName,
            sizeSnapshot, unitPrice, totalToppingPriceSnapshot,
            totalPrice, itemStatus, createdAt
        )
        SELECT 
            @NewOrderId, variantId, quantity, note, itemSnapshotName,
            sizeSnapshot, unitPrice, totalToppingPriceSnapshot,
            totalPrice, N'PENDING', GETDATE()
        FROM @OrderDetails;

        UPDATE PagerDevice
        SET status = N'IN_USE', updatedAt = GETDATE()
        WHERE id = @PagerId;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO


-- 3.2. sp_UpsertCustomerMember
IF OBJECT_ID('sp_UpsertCustomerMember', 'P') IS NOT NULL DROP PROCEDURE sp_UpsertCustomerMember;
GO

CREATE PROCEDURE sp_UpsertCustomerMember
    @PhoneNumber   VARCHAR(20),
    @FullName      NVARCHAR(150),
    @PointsToAdd   INT = 0,
    @CustomerId    INT OUTPUT,
    @CurrentPoints INT OUTPUT,
    @CurrentTier   NVARCHAR(50) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- 1. Tra cứu và khóa dòng bản ghi Customer theo số điện thoại
        SELECT @CustomerId = id, 
               @CurrentPoints = rewardPoints, 
               @CurrentTier = membershipTier
        FROM Customer WITH (UPDLOCK, ROWLOCK)
        WHERE phoneNumber = @PhoneNumber AND deletedAt IS NULL;

        -- ====================================================================
        -- TRƯỜNG HỢP 1: KHÁCH HÀNG CHƯA TỒN TẠI -> TẠO MỚI HỘI VIÊN
        -- ====================================================================
        IF @CustomerId IS NULL
        BEGIN
            -- Chặn trường hợp khởi tạo khách hàng mới với số điểm âm
            IF @PointsToAdd < 0
            BEGIN
                RAISERROR(N'Số điểm thưởng khởi tạo không thể là số âm!', 16, 1);
                ROLLBACK TRANSACTION;
                RETURN;
            END

            SET @CurrentPoints = ISNULL(@PointsToAdd, 0);

            -- Xét hạng thành viên ban đầu
            IF @CurrentPoints >= 1000 SET @CurrentTier = N'DIAMOND';
            ELSE IF @CurrentPoints >= 500 SET @CurrentTier = N'GOLD';
            ELSE IF @CurrentPoints >= 200 SET @CurrentTier = N'SILVER';
            ELSE SET @CurrentTier = N'STANDARD';

            INSERT INTO Customer (phoneNumber, fullName, rewardPoints, membershipTier, createdAt)
            VALUES (@PhoneNumber, @FullName, @CurrentPoints, @CurrentTier, GETDATE());

            SET @CustomerId = SCOPE_IDENTITY();

            -- Nếu có điểm khởi tạo, ghi nhận vào sổ cái lịch sử
            IF @PointsToAdd > 0
            BEGIN
                INSERT INTO LoyaltyTransaction (customerId, transactionType, points, balanceAfter, description, createdAt)
                VALUES (@CustomerId, N'EARN', @PointsToAdd, @CurrentPoints, N'Khởi tạo điểm thưởng thành viên mới', GETDATE());
            END
        END
        -- ====================================================================
        -- TRƯỜNG HỢP 2: KHÁCH HÀNG ĐÃ TỒN TẠI -> CẬP NHẬT THÔNG TIN / TÍCH - ĐỔI ĐIỂM
        -- ====================================================================
        ELSE
        BEGIN
            -- Cập nhật lại họ tên nếu có thay đổi
            IF @FullName IS NOT NULL AND @FullName <> ''
            BEGIN
                UPDATE Customer
                SET fullName = @FullName,
                    updatedAt = GETDATE()
                WHERE id = @CustomerId;
            END

            -- Nếu có phát sinh thay đổi điểm tích lũy
            IF @PointsToAdd <> 0
            BEGIN
                -- Chặn đổi điểm vượt quá số dư hiện tại (chống âm điểm)
                IF @PointsToAdd < 0 AND (@CurrentPoints + @PointsToAdd) < 0
                BEGIN
                    RAISERROR(N'Số dư điểm tích lũy không đủ để thực hiện giao dịch khấu trừ!', 16, 1);
                    ROLLBACK TRANSACTION;
                    RETURN;
                END

                -- Tính số dư điểm mới
                SET @CurrentPoints = @CurrentPoints + @PointsToAdd;

                -- Xét lại hạng thành viên theo số dư mới
                IF @CurrentPoints >= 1000 SET @CurrentTier = N'DIAMOND';
                ELSE IF @CurrentPoints >= 500 SET @CurrentTier = N'GOLD';
                ELSE IF @CurrentPoints >= 200 SET @CurrentTier = N'SILVER';
                ELSE SET @CurrentTier = N'STANDARD';

                -- Cập nhật hạng thành viên mới
                UPDATE Customer
                SET membershipTier = @CurrentTier,
                    updatedAt = GETDATE()
                WHERE id = @CustomerId;

                -- Ghi vào sổ cái LoyaltyTransaction
                -- Trigger trg_LoyaltyTransaction_SyncPoints sẽ tự động cập nhật rewardPoints trên Customer
                INSERT INTO LoyaltyTransaction (customerId, transactionType, points, balanceAfter, description, createdAt)
                VALUES (
                    @CustomerId, 
                    CASE WHEN @PointsToAdd > 0 THEN N'EARN' ELSE N'REDEEM' END, 
                    @PointsToAdd, 
                    @CurrentPoints, 
                    CASE WHEN @PointsToAdd > 0 THEN N'Tích lũy điểm hội viên' ELSE N'Khấu trừ/Đổi điểm hội viên' END, 
                    GETDATE()
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
GO

-- dieu chinh kho
IF OBJECT_ID('sp_DieuChinhTonKho', 'P') IS NOT NULL DROP PROCEDURE sp_DieuChinhTonKho;
GO
CREATE PROCEDURE sp_DieuChinhTonKho
    @ingredientId INT,
    @employeeId INT,
    @newQuantity DECIMAL(18, 3),
    @reason NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;

    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @oldQuantity DECIMAL(18, 3);
        SELECT @oldQuantity = stockQuantity 
        FROM Ingredient WITH (UPDLOCK, ROWLOCK) 
        WHERE id = @ingredientId AND deletedAt IS NULL;

        IF @oldQuantity IS NULL
        BEGIN
            RAISERROR(N'Nguyên liệu không tồn tại hoặc đã bị xóa!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        DECLARE @difference DECIMAL(18, 3) = @newQuantity - @oldQuantity;

        UPDATE Ingredient 
        SET stockQuantity = @newQuantity, updatedAt = SYSDATETIME() 
        WHERE id = @ingredientId;

        INSERT INTO InventoryAdjustment (ingredientId, employeeId, oldQuantity, newQuantity, difference, reason, adjustmentDate)
        OUTPUT INSERTED.*
        VALUES (@ingredientId, @employeeId, @oldQuantity, @newQuantity, @difference, @reason, SYSDATETIME());

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO