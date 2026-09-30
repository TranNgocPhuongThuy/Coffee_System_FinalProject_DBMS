-- USE CoffeeShopDB;

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
    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @CustomerId INT, @TotalAmount DECIMAL(18, 2), @CurrentStatus NVARCHAR(50);

        SELECT @CustomerId = customerId, @TotalAmount = totalAmount, @CurrentStatus = status
        FROM [Order] WITH (UPDLOCK)
        WHERE id = @OrderId;

        IF @CurrentStatus = N'CANCELLED'
        BEGIN
            RAISERROR(N'Cannot complete payment for a cancelled order!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        UPDATE [Order]
        SET status = N'COMPLETED',
            paymentMethod = @PaymentMethod,
            paidAt = GETDATE(),
            updatedAt = GETDATE()
        WHERE id = @OrderId;

        -- Earn reward points (10,000 VND = 1 Point)
        IF @CustomerId IS NOT NULL AND @TotalAmount > 0
        BEGIN
            DECLARE @PointsEarned INT = FLOOR(@TotalAmount / 10000);
            IF @PointsEarned > 0
            BEGIN
                UPDATE Customer
                SET rewardPoints = rewardPoints + @PointsEarned,
                    updatedAt = GETDATE()
                WHERE id = @CustomerId;

                DECLARE @NewBalance INT;
                SELECT @NewBalance = rewardPoints FROM Customer WHERE id = @CustomerId;

                INSERT INTO LoyaltyTransaction (customerId, orderId, transactionType, points, balanceAfter, description, createdAt)
                VALUES (@CustomerId, @OrderId, N'EARN', @PointsEarned, @NewBalance, N'Points earned from order #' + CAST(@OrderId AS NVARCHAR(20)), GETDATE());
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
IF OBJECT_ID('sp_CancelOrder', 'P') IS NOT NULL DROP PROCEDURE sp_CancelOrder;
GO

CREATE PROCEDURE sp_CancelOrder
    @OrderId INT,
    @EmployeeId INT,
    @CancelReason NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @CurrentStatus NVARCHAR(50), @PaidAt DATETIME2(7);

        SELECT @CurrentStatus = status, @PaidAt = paidAt
        FROM [Order] WITH (UPDLOCK)
        WHERE id = @OrderId;

        IF @CurrentStatus = N'COMPLETED' OR @PaidAt IS NOT NULL
        BEGIN
            RAISERROR(N'Cannot cancel a completed or paid order!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        UPDATE [Order]
        SET status = N'CANCELLED',
            cancelReason = @CancelReason,
            updatedAt = GETDATE()
        WHERE id = @OrderId;

        -- Release associated pager device
        UPDATE PagerDevice
        SET status = N'AVAILABLE', updatedAt = GETDATE()
        WHERE id = (SELECT pagerId FROM [Order] WHERE id = @OrderId) AND status = N'IN_USE';

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
    @PhoneNumber VARCHAR(20),
    @FullName NVARCHAR(150),
    @PointsToAdd INT = 0,
    @CustomerId INT OUTPUT,
    @CurrentPoints INT OUTPUT,
    @CurrentTier NVARCHAR(50) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        SELECT @CustomerId = id, @CurrentPoints = rewardPoints, @CurrentTier = membershipTier
        FROM Customer WITH (UPDLOCK, ROWLOCK)
        WHERE phoneNumber = @PhoneNumber AND deletedAt IS NULL;

        IF @CustomerId IS NULL
        BEGIN
            INSERT INTO Customer (phoneNumber, fullName, rewardPoints, membershipTier, createdAt)
            VALUES (@PhoneNumber, @FullName, ISNULL(@PointsToAdd, 0), N'BRONZE', GETDATE());

            SET @CustomerId = SCOPE_IDENTITY();
            SET @CurrentPoints = ISNULL(@PointsToAdd, 0);
            SET @CurrentTier = N'BRONZE';

            IF @PointsToAdd > 0
            BEGIN
                INSERT INTO LoyaltyTransaction (customerId, transactionType, points, balanceAfter, description, createdAt)
                VALUES (@CustomerId, N'EARN', @PointsToAdd, @CurrentPoints, N'Initial loyalty points awarded', GETDATE());
            END
        END
        ELSE
        BEGIN
            IF @PointsToAdd <> 0
            BEGIN
                SET @CurrentPoints = @CurrentPoints + @PointsToAdd;

                IF @CurrentPoints >= 1000 SET @CurrentTier = N'DIAMOND';
                ELSE IF @CurrentPoints >= 500 SET @CurrentTier = N'GOLD';
                ELSE IF @CurrentPoints >= 200 SET @CurrentTier = N'SILVER';
                ELSE SET @CurrentTier = N'BRONZE';

                UPDATE Customer
                SET fullName = ISNULL(@FullName, fullName),
                    rewardPoints = @CurrentPoints,
                    membershipTier = @CurrentTier,
                    updatedAt = GETDATE()
                WHERE id = @CustomerId;

                INSERT INTO LoyaltyTransaction (customerId, transactionType, points, balanceAfter, description, createdAt)
                VALUES (@CustomerId, CASE WHEN @PointsToAdd > 0 THEN N'EARN' ELSE N'REDEEM' END, @PointsToAdd, @CurrentPoints, N'Loyalty points balance updated', GETDATE());
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