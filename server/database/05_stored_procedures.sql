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
    itemIndex INT NOT NULL,
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

IF EXISTS (SELECT * FROM sys.types WHERE name = 'udt_OrderDetailToppingList')
    DROP TYPE udt_OrderDetailToppingList;
GO

CREATE TYPE udt_OrderDetailToppingList AS TABLE (
    itemIndex INT NOT NULL,       
    toppingId INT NULL,
    toppingSnapshotName NVARCHAR(150) NOT NULL,
    toppingPrice DECIMAL(18, 2) NOT NULL,
    quantity INT NOT NULL
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
CREATE OR ALTER PROCEDURE sp_CreateCounterOrder
    @OrderCode VARCHAR(64),
    @EmployeeId INT,
    @CustomerId INT = NULL,
    @PagerId INT = NULL,
    @OrderChannel NVARCHAR(50) = N'ORDER_AT_COUNTER',
    @SubTotal DECIMAL(18, 2),
    @DiscountAmount DECIMAL(18, 2) = 0,
    @TotalAmount DECIMAL(18, 2),
    @PaymentMethod NVARCHAR(50),
    @OrderDetails udt_OrderDetailList READONLY,
    @OrderToppings udt_OrderDetailToppingList READONLY, -- Tham số mới
    @NewOrderId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

    BEGIN TRY
        BEGIN TRANSACTION;

        INSERT INTO [Order] (
            orderCode, customerId, pagerId, employeeId, orderChannel,
            subTotal, discountAmount, totalAmount, paymentMethod,
            status, paidAt, createdAt
        )
        VALUES (
            @OrderCode, @CustomerId, @PagerId, @EmployeeId, ISNULL(@OrderChannel, N'ORDER_AT_COUNTER'),
            @SubTotal, @DiscountAmount, @TotalAmount, @PaymentMethod,
            N'PENDING_PREP', SYSDATETIME(), SYSDATETIME()
        );

        SET @NewOrderId = SCOPE_IDENTITY();

        -- Bảng tạm để bắt ID thực tế của từng món (tránh Map sai)
        DECLARE @InsertedDetails TABLE (
            itemIndex INT,
            detailId INT
        );

        -- Insert Món ăn và lấy ID thực tế
        MERGE OrderDetail AS target
        USING @OrderDetails AS source
        ON 1 = 0
        WHEN NOT MATCHED THEN
            INSERT (orderId, variantId, quantity, note, itemSnapshotName, sizeSnapshot, unitPrice, totalToppingPriceSnapshot, totalPrice, itemStatus, createdAt)
            VALUES (@NewOrderId, source.variantId, source.quantity, source.note, source.itemSnapshotName, source.sizeSnapshot, source.unitPrice, source.totalToppingPriceSnapshot, source.totalPrice, N'PENDING', SYSDATETIME())
        OUTPUT source.itemIndex, inserted.id INTO @InsertedDetails(itemIndex, detailId);

        -- Insert Topping chuẩn xác 100% dựa vào ID vừa lấy được
        INSERT INTO OrderDetailTopping (orderDetailId, toppingId, toppingSnapshotName, toppingPrice, quantity)
        SELECT id.detailId, ot.toppingId, ot.toppingSnapshotName, ot.toppingPrice, ot.quantity
        FROM @OrderToppings ot
        INNER JOIN @InsertedDetails id ON ot.itemIndex = id.itemIndex;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO


-- 1.2. sp_CompleteOrderPayment
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

        -- Đồng bộ các món chưa hoàn tất trong đơn sang 'DONE' (Kích hoạt trừ kho và đồng bộ trạng thái món)
        UPDATE OrderDetail
        SET itemStatus = N'DONE',
            updatedAt = SYSDATETIME()
        WHERE orderId = @OrderId 
          AND itemStatus NOT IN (N'DONE', N'CANCELLED');

        -- Tích điểm hội viên (10,000 VNĐ = 1 Điểm) nếu chưa từng tích điểm cho đơn này
        IF @CustomerId IS NOT NULL AND @TotalAmount >= 10000 
           AND NOT EXISTS (SELECT 1 FROM LoyaltyTransaction WHERE orderId = @OrderId AND transactionType = N'EARN')
        BEGIN
            DECLARE @PointsEarned INT = dbo.fnc_CalculateEarnedPoints(@TotalAmount);
            
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
GO


-- 1.3. sp_CancelOrder
CREATE OR ALTER PROCEDURE sp_CancelOrder
    @OrderId INT,
    @EmployeeId INT,
    @CancelReason NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @CurrentStatus NVARCHAR(50), 
                @CustomerId INT,
                @PointsRedeemed INT;

        -- 1. Khóa và kiểm tra thông tin đơn hàng
        SELECT 
            @CurrentStatus = status, 
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

        IF @CurrentStatus = N'COMPLETED'
        BEGIN
            RAISERROR(N'Không thể hủy đơn hàng đã hoàn tất!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        IF @CurrentStatus = N'CANCELLED'
        BEGIN
            RAISERROR(N'Đơn hàng này đã bị hủy trước đó!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- 2. Hủy các món chưa pha chế trong đơn
        UPDATE OrderDetail
        SET itemStatus = N'CANCELLED', updatedAt = SYSDATETIME()
        WHERE orderId = @OrderId AND itemStatus <> N'DONE';

        -- 3. Cập nhật trạng thái đơn hàng sang CANCELLED và giải phóng thẻ rung
        UPDATE [Order]
        SET status = N'CANCELLED',
            cancelReason = @CancelReason,
            pagerId = NULL,
            updatedAt = SYSDATETIME()
        WHERE id = @OrderId;

        -- 4. Xử lý điểm thưởng hội viên (nếu có khách hàng)
        IF @CustomerId IS NOT NULL
        BEGIN
            -- TH1: Hoàn lại điểm nếu khách từng đổi điểm (REDEEM) cho đơn này
            SELECT @PointsRedeemed = ABS(points) 
            FROM LoyaltyTransaction 
            WHERE orderId = @OrderId AND transactionType = N'REDEEM';

            IF @PointsRedeemed > 0
            BEGIN
                DECLARE @CurrentBalance INT;
                SELECT @CurrentBalance = rewardPoints FROM Customer WITH (UPDLOCK, ROWLOCK) WHERE id = @CustomerId;
                DECLARE @NewBalance INT = ISNULL(@CurrentBalance, 0) + @PointsRedeemed;

                INSERT INTO LoyaltyTransaction (customerId, orderId, transactionType, points, balanceAfter, description, createdAt)
                VALUES (@CustomerId, @OrderId, N'REDEEM', @PointsRedeemed, @NewBalance, N'Hoàn lại điểm do hủy đơn #' + CAST(@OrderId AS NVARCHAR(20)), SYSDATETIME());
            END

            -- TH2: Thu hồi lại điểm đã cộng (EARN) nếu đơn này từng được tích điểm
            DECLARE @PointsEarnedBefore INT = 0;
            SELECT @PointsEarnedBefore = SUM(points) 
            FROM LoyaltyTransaction 
            WHERE orderId = @OrderId AND transactionType = N'EARN' AND points > 0;

            IF @PointsEarnedBefore > 0
            BEGIN
                DECLARE @CurBal INT;
                SELECT @CurBal = rewardPoints FROM Customer WITH (UPDLOCK, ROWLOCK) WHERE id = @CustomerId;
                DECLARE @BalAfterRevoke INT = CASE WHEN ISNULL(@CurBal, 0) - @PointsEarnedBefore > 0 THEN ISNULL(@CurBal, 0) - @PointsEarnedBefore ELSE 0 END;

                INSERT INTO LoyaltyTransaction (customerId, orderId, transactionType, points, balanceAfter, description, createdAt)
                VALUES (@CustomerId, @OrderId, N'EARN', -@PointsEarnedBefore, @BalAfterRevoke, N'Thu hồi điểm tích lũy do hủy đơn hàng #' + CAST(@OrderId AS NVARCHAR(20)), SYSDATETIME());
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

-- 1.3b. sp_RemoveOrderItem: Tự động tính lại subTotal và totalAmount của Order sau khi xóa món
CREATE OR ALTER PROCEDURE sp_RemoveOrderItem
    @OrderDetailId INT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @ItemStatus NVARCHAR(50);
        DECLARE @OrderId INT;

        SELECT @OrderId = orderId, @ItemStatus = itemStatus 
        FROM OrderDetail 
        WHERE id = @OrderDetailId;

        IF @ItemStatus IS NULL
        BEGIN
            RAISERROR(N'Chi tiết món không tồn tại!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        IF @ItemStatus IN ('PREPARING', 'DONE', 'DELIVERED')
        BEGIN
            RAISERROR(N'Không thể xóa món đang hoặc đã pha chế xong để bảo toàn dữ liệu tồn kho!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        DELETE FROM OrderDetailTopping WHERE orderDetailId = @OrderDetailId;
        DELETE FROM OrderDetail WHERE id = @OrderDetailId;

        IF @OrderId IS NOT NULL
        BEGIN
            DECLARE @NewSubTotal DECIMAL(18, 2);
            SELECT @NewSubTotal = ISNULL(SUM(totalPrice), 0)
            FROM OrderDetail
            WHERE orderId = @OrderId AND itemStatus <> N'CANCELLED';

            UPDATE [Order]
            SET subTotal = @NewSubTotal,
                totalAmount = CASE WHEN @NewSubTotal - discountAmount > 0 THEN @NewSubTotal - discountAmount ELSE 0 END,
                updatedAt = SYSDATETIME()
            WHERE id = @OrderId;
        END

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        INSERT INTO SystemLog (ActionType, TableName, Description, ErrorMessage)
        VALUES ('ERROR', 'OrderDetail', 'Error in sp_RemoveOrderItem', ERROR_MESSAGE());
        THROW;
    END CATCH
END;
GO


-- 1.4. sp_ApplyLoyaltyPoints
CREATE OR ALTER PROCEDURE sp_ApplyLoyaltyPoints
    @OrderId INT,
    @CustomerId INT,
    @PointsToRedeem INT,
    @ConversionRate DECIMAL(18, 2) = 1000 -- 1 Point = 1,000 VND
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;

    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @CurrentPoints INT;
        SELECT @CurrentPoints = rewardPoints FROM Customer WITH (UPDLOCK) WHERE id = @CustomerId;

        IF @CurrentPoints IS NULL OR @CurrentPoints < @PointsToRedeem
        BEGIN
            RAISERROR(N'Số dư điểm tích lũy không đủ!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        DECLARE @SubTotal DECIMAL(18, 2);
        DECLARE @DiscountAmount DECIMAL(18, 2);
        
        -- Lấy thông tin giá trị đơn hàng
        SELECT @SubTotal = subTotal, @DiscountAmount = discountAmount 
        FROM [Order] 
        WHERE id = @OrderId;

        -- Tính số tiền tối đa còn có thể giảm
        DECLARE @MaxDiscount DECIMAL(18,2) = @SubTotal - @DiscountAmount;
        IF @MaxDiscount <= 0 
        BEGIN
            RAISERROR(N'Đơn hàng có giá trị 0đ, không thể áp dụng thêm điểm thưởng.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Tính số điểm tối đa được phép sử dụng cho đơn này
        DECLARE @MaxPoints INT = CEILING(@MaxDiscount / @ConversionRate);
        
        -- Nếu nhân viên nhập quá số điểm cần thiết -> Tự động ép về mức tối đa
        IF @PointsToRedeem > @MaxPoints
        BEGIN
            SET @PointsToRedeem = @MaxPoints;
        END

        DECLARE @ActualDiscount DECIMAL(18, 2) = dbo.fn_CalculateMemberDiscount(@PointsToRedeem);
        IF @ActualDiscount > @MaxDiscount
        BEGIN
            SET @ActualDiscount = @MaxDiscount;
        END

        -- Cập nhật hóa đơn
        UPDATE [Order]
        SET discountAmount = discountAmount + @ActualDiscount,
            totalAmount = subTotal - (discountAmount + @ActualDiscount),
            updatedAt = GETDATE()
        WHERE id = @OrderId;

        DECLARE @NewBalance INT = @CurrentPoints - @PointsToRedeem;

        -- Ghi sổ cái
        INSERT INTO LoyaltyTransaction (customerId, orderId, transactionType, points, balanceAfter, description, createdAt)
        VALUES (@CustomerId, @OrderId, N'REDEEM', -@PointsToRedeem, @NewBalance, N'Đổi điểm áp dụng cho hóa đơn #' + CAST(@OrderId AS NVARCHAR(20)), GETDATE());

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO


-- 1.5. sp_RemoveOrderItem
CREATE OR ALTER PROCEDURE sp_RemoveOrderItem
    @OrderDetailId INT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @ItemStatus NVARCHAR(50);
        DECLARE @OrderId INT;

        SELECT @OrderId = orderId, @ItemStatus = itemStatus 
        FROM OrderDetail 
        WHERE id = @OrderDetailId;

        IF @ItemStatus IS NULL
        BEGIN
            RAISERROR(N'Chi tiết món không tồn tại!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Chặn xóa món nếu đã bắt đầu pha chế
        IF @ItemStatus IN ('PREPARING', 'DONE', 'DELIVERED')
        BEGIN
            RAISERROR(N'Không thể xóa món đang hoặc đã pha chế xong để bảo toàn dữ liệu tồn kho!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

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
        INSERT INTO SystemLog (ActionType, TableName, Description, ErrorMessage)
        VALUES ('ERROR', 'OrderDetail', 'Error in sp_RemoveOrderItem', ERROR_MESSAGE());
        THROW;
    END CATCH
END;
GO


-- ============================================================================
-- 2. INVENTORY & BOM MODULE
-- ============================================================================

-- 2.1. sp_UpsertRecipeBOM
CREATE PROCEDURE sp_UpsertRecipeBOM
    @VariantId INT,
    @IngredientId INT,
    @ConsumedQuantity DECIMAL(18, 4)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        IF @ConsumedQuantity <= 0
        BEGIN
            RAISERROR(N'Consumed quantity must be greater than 0!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        IF NOT EXISTS (SELECT 1 FROM ProductVariant WHERE id = @VariantId AND deletedAt IS NULL)
        BEGIN
            RAISERROR(N'Product variant does not exist or has been deleted!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        IF NOT EXISTS (SELECT 1 FROM Ingredient WHERE id = @IngredientId AND deletedAt IS NULL)
        BEGIN
            RAISERROR(N'Ingredient does not exist or has been deleted!', 16, 1);
            ROLLBACK TRANSACTION;
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

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        INSERT INTO SystemLog (ActionType, TableName, Description, ErrorMessage)
        VALUES ('ERROR', 'RecipeBOM', 'Error in sp_UpsertRecipeBOM', ERROR_MESSAGE());
        THROW;
    END CATCH
END;
GO


-- 2.2. sp_CreateInventoryImport
CREATE PROCEDURE sp_CreateInventoryImport
    @SupplierName NVARCHAR(255),
    @EmployeeId INT,
    @Note NVARCHAR(MAX) = NULL,
    @ImportDetails udt_InventoryImportDetailList READONLY,
    @NewImportId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
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
        INSERT INTO SystemLog (ActionType, TableName, Description, ErrorMessage)
        VALUES ('ERROR', 'InventoryImport', 'Error in sp_CreateInventoryImport', ERROR_MESSAGE());
        THROW;
    END CATCH
END;
GO


-- ============================================================================
-- 3. PAGER DEVICE, COUNTER & MEMBER MODULE
-- ============================================================================

-- 3.1. sp_CreateOrderWithPager
CREATE OR ALTER PROCEDURE sp_CreateOrderWithPager
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
    SET XACT_ABORT ON;
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
    SET XACT_ABORT ON;
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

        COMMIT TRANSACTION
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- dieu chinh kho
CREATE PROCEDURE sp_DieuChinhTonKho
    @ingredientId INT,
    @employeeId INT,
    @newQuantity DECIMAL(18, 3),
    @reason NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
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
END
GO

CREATE OR ALTER PROCEDURE dbo.sp_KDS_NotifyOrderReady
    @OrderId INT,
    @PagerId INT OUTPUT,
    @PendingCount INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- 1. Kiểm tra đơn hàng tồn tại
        SELECT 
            @PagerId = pagerId
        FROM [Order] WITH (UPDLOCK, ROWLOCK)
        WHERE id = @OrderId AND deletedAt IS NULL;

        IF @PagerId IS NULL AND NOT EXISTS (SELECT 1 FROM [Order] WHERE id = @OrderId AND deletedAt IS NULL)
        BEGIN
            RAISERROR(N'Đơn hàng không tồn tại hoặc đã bị xóa!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- 2. Đếm số món chưa hoàn thành
        SELECT @PendingCount = COUNT(1)
        FROM OrderDetail
        WHERE orderId = @OrderId 
          AND itemStatus NOT IN (N'DONE', N'CANCELLED');

        -- 3. Cập nhật các món còn lại sang 'DONE' (Kích hoạt trg_OrderDetail_DeductInventory tự trừ kho)
        UPDATE OrderDetail
        SET itemStatus = N'DONE',
            updatedAt = SYSDATETIME()
        WHERE orderId = @OrderId 
          AND itemStatus NOT IN (N'DONE', N'CANCELLED');

        -- 4. Chuyển trạng thái Order sang READY_FOR_PICKUP
        UPDATE [Order]
        SET status = N'READY_FOR_PICKUP',
            updatedAt = SYSDATETIME()
        WHERE id = @OrderId;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO