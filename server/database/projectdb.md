# Project Dump

**Root:** `C:\Programing\hqtcsdl\Coffee_System_FinalProject_DBMS\server\database`

**Generated:** 2026-10-17 17:34:22.079486

**Files:** 10 | **Total size:** 85,996 bytes

---

# 01_schema_tables.sql

| Property | Value |
|----------|-------|
| Path | `01_schema_tables.sql` |
| Size | 6,065 bytes |
| Extension | `.sql` |
| Modified | 2026-10-16 23:23:56.819307 |

```sql
CREATE DATABASE COFFEE_SYSTEM
USE COFFEE_SYSTEM 

-- 1. CÁC BẢNG DANH MỤC CƠ BẢN
CREATE TABLE Category (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    name NVARCHAR(150) NOT NULL,
    displayStatus NVARCHAR(50) NOT NULL,
    createdAt DATETIME2(7) NOT NULL,
    updatedAt DATETIME2(7),
    deletedAt DATETIME2(7)
);
GO

CREATE TABLE Topping (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    name NVARCHAR(150) NOT NULL,
    price DECIMAL(18, 2) NOT NULL,
    status NVARCHAR(50) NOT NULL,
    createdAt DATETIME2(7),
    updatedAt DATETIME2(7),
    deletedAt DATETIME2(7)
);
GO

CREATE TABLE Ingredient (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    name NVARCHAR(150) NOT NULL,
    unit NVARCHAR(50) NOT NULL,
    stockQuantity DECIMAL(18, 3) NOT NULL,
    minimumThreshold DECIMAL(18, 3) NOT NULL,
    createdAt DATETIME2(7) NOT NULL,
    updatedAt DATETIME2(7),
    deletedAt DATETIME2(7)
);
GO

-- 2. ĐỐI TƯỢNG (NHÂN VIÊN, KHÁCH HÀNG, THIẾT BỊ)
CREATE TABLE Employee (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    fullName NVARCHAR(150) NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role NVARCHAR(50) NOT NULL,
    phoneNumber VARCHAR(20),
    status NVARCHAR(50) NOT NULL,
    createdAt DATETIME2(7),
    updatedAt DATETIME2(7),
    deletedAt DATETIME2(7)
);
GO

CREATE TABLE Customer (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    phoneNumber VARCHAR(20) NOT NULL,
    fullName NVARCHAR(150) NOT NULL,
    password VARCHAR(255),
    address NVARCHAR(255),
    rewardPoints INT NOT NULL,
    membershipTier NVARCHAR(50) NOT NULL,
    createdAt DATETIME2(7),
    updatedAt DATETIME2(7),
    deletedAt DATETIME2(7)
);
GO


CREATE TABLE PagerDevice (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    pagerCode VARCHAR(50) NOT NULL,
    status NVARCHAR(50) NOT NULL,
    batteryLevel INT NOT NULL,
    createdAt DATETIME2(7),
    updatedAt DATETIME2(7),
    deletedAt DATETIME2(7)
);
GO

-- 3. SẢN PHẨM & CÔNG THỨC BOM
CREATE TABLE Product (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    categoryId INT NOT NULL,
    name NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX),
    image NVARCHAR(500),
    status NVARCHAR(50) NOT NULL,
    createdAt DATETIME2(7),
    updatedAt DATETIME2(7),
    deletedAt DATETIME2(7)
);
GO

CREATE TABLE ProductVariant (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    productId INT NOT NULL,
    size NVARCHAR(20) NOT NULL,
    price DECIMAL(18, 2) NOT NULL,
    createdAt DATETIME2(7) NOT NULL,
    updatedAt DATETIME2(7),
    deletedAt DATETIME2(7)
);
GO

CREATE TABLE RecipeBOM (
    variantId INT NOT NULL,
    ingredientId INT NOT NULL,
    consumedQuantity DECIMAL(18, 4) NOT NULL,
    PRIMARY KEY (variantId, ingredientId)
);
GO

CREATE TABLE ToppingBOM (
    toppingId INT NOT NULL,
    ingredientId INT NOT NULL,
    consumedQuantity DECIMAL(18, 4) NOT NULL,
    PRIMARY KEY (toppingId, ingredientId)
);
GO

-- 4. NGHIỆP VỤ ĐƠN HÀNG & ĐIỂM THƯỞNG
CREATE TABLE [Order] (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    orderCode VARCHAR(64) NOT NULL,
    customerId INT,
    pagerId INT,
    employeeId INT,
    orderChannel NVARCHAR(50) NOT NULL,
    subTotal DECIMAL(18, 2) NOT NULL,
    discountAmount DECIMAL(18, 2) NOT NULL,
    totalAmount DECIMAL(18, 2) NOT NULL,
    paymentMethod NVARCHAR(50) NOT NULL,
    status NVARCHAR(50) NOT NULL,
    cancelReason NVARCHAR(500),
    paidAt DATETIME2(7),
    pickupAt DATETIME2(7),
    createdAt DATETIME2(7) NOT NULL,
    updatedAt DATETIME2(7),
    deletedAt DATETIME2(7)
);
GO

CREATE TABLE OrderDetail (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    orderId INT NOT NULL,
    variantId INT,
    quantity INT NOT NULL,
    note NVARCHAR(255),
    itemSnapshotName NVARCHAR(200) NOT NULL,
    sizeSnapshot NVARCHAR(50) NOT NULL,
    unitPrice DECIMAL(18, 2) NOT NULL,
    totalToppingPriceSnapshot DECIMAL(18, 2) NOT NULL,
    totalPrice DECIMAL(18, 2) NOT NULL,
    itemStatus NVARCHAR(50) NOT NULL,
    createdAt DATETIME2(7),
    updatedAt DATETIME2(7)
);
GO

CREATE TABLE OrderDetailTopping (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    orderDetailId INT NOT NULL,
    toppingId INT,
    toppingSnapshotName NVARCHAR(150) NOT NULL,
    toppingPrice DECIMAL(18, 2) NOT NULL,
    quantity INT NOT NULL
);
GO

CREATE TABLE LoyaltyTransaction (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    customerId INT NOT NULL,
    orderId INT,
    transactionType NVARCHAR(50) NOT NULL,
    points INT NOT NULL,
    balanceAfter INT NOT NULL,
    description NVARCHAR(500),
    createdAt DATETIME2(7) NOT NULL
);
GO

-- 5. NGHIỆP VỤ KHO
CREATE TABLE InventoryImport (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    employeeId INT NOT NULL,
    supplierName NVARCHAR(255) NOT NULL,
    totalAmount DECIMAL(18, 2) NOT NULL,
    importDate DATETIME2(7) NOT NULL,
    note NVARCHAR(MAX)
);
GO

CREATE TABLE InventoryImportDetail (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    importId INT NOT NULL,
    ingredientId INT NOT NULL,
    quantity DECIMAL(18, 3) NOT NULL,
    unitPrice DECIMAL(18, 2) NOT NULL,
    totalLineAmount DECIMAL(18, 2) NOT NULL
);
GO

CREATE TABLE InventoryAdjustment (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    ingredientId INT NOT NULL,
    employeeId INT NOT NULL,
    oldQuantity DECIMAL(18, 3) NOT NULL,
    newQuantity DECIMAL(18, 3) NOT NULL,
    difference DECIMAL(18, 3) NOT NULL,
    reason NVARCHAR(500) NOT NULL,
    adjustmentDate DATETIME2(7) NOT NULL
);
GO

-- 6. SYSTEM LOG
CREATE TABLE SystemLog (
    LogId INT IDENTITY(1,1) PRIMARY KEY,
    ActionType VARCHAR(50) NOT NULL,
    PerformedBy VARCHAR(50) DEFAULT SYSTEM_USER,
    TableName VARCHAR(50),
    Description NVARCHAR(255),
    ErrorMessage NVARCHAR(MAX),
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO
```

# 02_constraints.sql

| Property | Value |
|----------|-------|
| Path | `02_constraints.sql` |
| Size | 10,068 bytes |
| Extension | `.sql` |
| Modified | 2026-10-16 23:23:56.821737 |

```sql

-- =========================================================
-- 1. UNIQUE CONSTRAINTS
-- =========================================================
ALTER TABLE Employee ADD CONSTRAINT UQ_Employee_username UNIQUE (username);
ALTER TABLE Customer ADD CONSTRAINT UQ_Customer_phoneNumber UNIQUE (phoneNumber);
ALTER TABLE PagerDevice ADD CONSTRAINT UQ_PagerDevice_pagerCode UNIQUE (pagerCode);
ALTER TABLE [Order] ADD CONSTRAINT UQ_Order_orderCode UNIQUE (orderCode);
GO

-- =========================================================
-- 2. DEFAULT CONSTRAINTS
-- =========================================================
ALTER TABLE Category ADD CONSTRAINT DF_Category_displayStatus DEFAULT ('SHOW') FOR displayStatus;
ALTER TABLE Category ADD CONSTRAINT DF_Category_createdAt DEFAULT (SYSDATETIME()) FOR createdAt;

ALTER TABLE Topping ADD CONSTRAINT DF_Topping_price DEFAULT (0.00) FOR price;
ALTER TABLE Topping ADD CONSTRAINT DF_Topping_status DEFAULT ('AVAILABLE') FOR status;

ALTER TABLE Ingredient ADD CONSTRAINT DF_Ingredient_stockQuantity DEFAULT (0.000) FOR stockQuantity;
ALTER TABLE Ingredient ADD CONSTRAINT DF_Ingredient_minimumThreshold DEFAULT (0.000) FOR minimumThreshold;
ALTER TABLE Ingredient ADD CONSTRAINT DF_Ingredient_createdAt DEFAULT (SYSDATETIME()) FOR createdAt;

ALTER TABLE Employee ADD CONSTRAINT DF_Employee_status DEFAULT ('ACTIVE') FOR status;

ALTER TABLE Customer ADD CONSTRAINT DF_Customer_rewardPoints DEFAULT (0) FOR rewardPoints;
ALTER TABLE Customer ADD CONSTRAINT DF_Customer_membershipTier DEFAULT ('STANDARD') FOR membershipTier;

ALTER TABLE PagerDevice ADD CONSTRAINT DF_PagerDevice_status DEFAULT ('AVAILABLE') FOR status;
ALTER TABLE PagerDevice ADD CONSTRAINT DF_PagerDevice_batteryLevel DEFAULT (100) FOR batteryLevel;

ALTER TABLE Product ADD CONSTRAINT DF_Product_status DEFAULT ('ACTIVE') FOR status;
ALTER TABLE ProductVariant ADD CONSTRAINT DF_ProductVariant_price DEFAULT (0.00) FOR price;
ALTER TABLE ProductVariant ADD CONSTRAINT DF_ProductVariant_createdAt DEFAULT (SYSDATETIME()) FOR createdAt;

ALTER TABLE [Order] ADD CONSTRAINT DF_Order_orderChannel DEFAULT ('POS') FOR orderChannel;
ALTER TABLE [Order] ADD CONSTRAINT DF_Order_subTotal DEFAULT (0.00) FOR subTotal;
ALTER TABLE [Order] ADD CONSTRAINT DF_Order_discountAmount DEFAULT (0.00) FOR discountAmount;
ALTER TABLE [Order] ADD CONSTRAINT DF_Order_totalAmount DEFAULT (0.00) FOR totalAmount;
ALTER TABLE [Order] ADD CONSTRAINT DF_Order_paymentMethod DEFAULT ('CASH') FOR paymentMethod;
ALTER TABLE [Order] ADD CONSTRAINT DF_Order_status DEFAULT ('PENDING_PREP') FOR status;
ALTER TABLE [Order] ADD CONSTRAINT DF_Order_createdAt DEFAULT (SYSDATETIME()) FOR createdAt;

ALTER TABLE OrderDetail ADD CONSTRAINT DF_OrderDetail_quantity DEFAULT (1) FOR quantity;
ALTER TABLE OrderDetail ADD CONSTRAINT DF_OrderDetail_toppingPrice DEFAULT (0.00) FOR totalToppingPriceSnapshot;
ALTER TABLE OrderDetail ADD CONSTRAINT DF_OrderDetail_status DEFAULT ('PENDING') FOR itemStatus;

ALTER TABLE OrderDetailTopping ADD CONSTRAINT DF_OrderDetailTopping_quantity DEFAULT (1) FOR quantity;
ALTER TABLE LoyaltyTransaction ADD CONSTRAINT DF_LoyaltyTransaction_createdAt DEFAULT (SYSDATETIME()) FOR createdAt;

ALTER TABLE InventoryImport ADD CONSTRAINT DF_InventoryImport_totalAmount DEFAULT (0.00) FOR totalAmount;
ALTER TABLE InventoryImport ADD CONSTRAINT DF_InventoryImport_importDate DEFAULT (SYSDATETIME()) FOR importDate;
ALTER TABLE InventoryAdjustment ADD CONSTRAINT DF_InventoryAdjustment_date DEFAULT (SYSDATETIME()) FOR adjustmentDate;
GO

-- =========================================================
-- 3. CHECK CONSTRAINTS (MÔ PHỎNG ENUM TỪ TYPESCRIPT & RÀNG BUỘC SỐ LƯỢNG)
-- =========================================================
-- Enum Checks
ALTER TABLE Product ADD CONSTRAINT CK_Product_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK'));
ALTER TABLE ProductVariant ADD CONSTRAINT CK_ProductVariant_size CHECK (size IN ('S', 'M', 'L', 'XL'));
ALTER TABLE Topping ADD CONSTRAINT CK_Topping_status CHECK (status IN ('AVAILABLE', 'UNAVAILABLE', 'ACTIVE'));
ALTER TABLE Employee ADD CONSTRAINT CK_Employee_role CHECK (role IN ('ADMIN', 'MANAGER', 'CASHIER', 'BARISTA', 'STOREKEEPER'));
ALTER TABLE Employee ADD CONSTRAINT CK_Employee_status CHECK (status IN ('ACTIVE', 'INACTIVE'));
ALTER TABLE Customer ADD CONSTRAINT CK_Customer_tier CHECK (membershipTier IN ('STANDARD', 'SILVER', 'GOLD', 'DIAMOND'));
ALTER TABLE PagerDevice ADD CONSTRAINT CK_PagerDevice_status CHECK (status IN ('IDLE', 'IN_USE', 'CHARGING', 'MAINTENANCE', 'AVAILABLE'));
ALTER TABLE [Order] ADD CONSTRAINT CK_Order_channel CHECK (orderChannel IN ('POS', 'APP', 'DELIVERY', 'ORDER_AT_COUNTER'));
ALTER TABLE [Order] ADD CONSTRAINT CK_Order_payment CHECK (paymentMethod IN ('CASH', 'BANK_TRANSFER', 'CARD', 'MOMO', 'VNPAY', 'POINT_EXCHANGE', 'E_WALLET'));
ALTER TABLE [Order] ADD CONSTRAINT CK_Order_status CHECK (status IN ('PENDING_PREP', 'PREPARING', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED'));
ALTER TABLE OrderDetail ADD CONSTRAINT CK_OrderDetail_itemStatus CHECK (itemStatus IN ('PENDING', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED', 'DONE'));
ALTER TABLE LoyaltyTransaction ADD CONSTRAINT CK_LoyaltyTransaction_type CHECK (transactionType IN ('EARN', 'REDEEM'));

-- Value Checks
ALTER TABLE Topping ADD CONSTRAINT CK_Topping_price CHECK (price >= 0);
ALTER TABLE Ingredient ADD CONSTRAINT CK_Ingredient_stock CHECK (stockQuantity >= 0);
ALTER TABLE Ingredient ADD CONSTRAINT CK_Ingredient_threshold CHECK (minimumThreshold >= 0);
ALTER TABLE Customer ADD CONSTRAINT CK_Customer_rewardPoints CHECK (rewardPoints >= 0);
ALTER TABLE PagerDevice ADD CONSTRAINT CK_PagerDevice_battery CHECK (batteryLevel BETWEEN 0 AND 100);
ALTER TABLE ProductVariant ADD CONSTRAINT CK_ProductVariant_price CHECK (price >= 0);
ALTER TABLE RecipeBOM ADD CONSTRAINT CK_RecipeBOM_consumedQuantity CHECK (consumedQuantity > 0);
ALTER TABLE ToppingBOM ADD CONSTRAINT CK_ToppingBOM_consumedQuantity CHECK (consumedQuantity > 0);
ALTER TABLE [Order] ADD CONSTRAINT CK_Order_totalAmount CHECK (totalAmount >= 0);
ALTER TABLE [Order] ADD CONSTRAINT CK_Order_discountAmount CHECK (discountAmount >= 0);
ALTER TABLE [Order] ADD CONSTRAINT CK_Order_subTotal CHECK (subTotal >= 0);
ALTER TABLE OrderDetail ADD CONSTRAINT CK_OrderDetail_quantity CHECK (quantity > 0);
ALTER TABLE OrderDetail ADD CONSTRAINT CK_OrderDetail_totalPrice CHECK (totalPrice >= 0);
ALTER TABLE OrderDetailTopping ADD CONSTRAINT CK_OrderDetailTopping_quantity CHECK (quantity > 0);
ALTER TABLE OrderDetailTopping ADD CONSTRAINT CK_OrderDetailTopping_price CHECK (toppingPrice >= 0);
ALTER TABLE LoyaltyTransaction ADD CONSTRAINT CK_LoyaltyTransaction_balance CHECK (balanceAfter >= 0);
ALTER TABLE InventoryImport ADD CONSTRAINT CK_InventoryImport_totalAmount CHECK (totalAmount >= 0);
ALTER TABLE InventoryImportDetail ADD CONSTRAINT CK_InventoryImportDetail_quantity CHECK (quantity > 0);
ALTER TABLE InventoryImportDetail ADD CONSTRAINT CK_InventoryImportDetail_unitPrice CHECK (unitPrice >= 0);
ALTER TABLE InventoryImportDetail ADD CONSTRAINT CK_InventoryImportDetail_totalLine CHECK (totalLineAmount >= 0);
ALTER TABLE InventoryAdjustment ADD CONSTRAINT CK_InventoryAdjustment_newQty CHECK (newQuantity >= 0);
GO

-- =========================================================
-- 4. FOREIGN KEY CONSTRAINTS
-- =========================================================
ALTER TABLE Product ADD CONSTRAINT FK_Product_Category FOREIGN KEY (categoryId) REFERENCES Category(id);

ALTER TABLE ProductVariant ADD CONSTRAINT FK_ProductVariant_Product FOREIGN KEY (productId) REFERENCES Product(id) ON DELETE CASCADE;

ALTER TABLE RecipeBOM ADD CONSTRAINT FK_RecipeBOM_Variant FOREIGN KEY (variantId) REFERENCES ProductVariant(id) ON DELETE CASCADE;
ALTER TABLE RecipeBOM ADD CONSTRAINT FK_RecipeBOM_Ingredient FOREIGN KEY (ingredientId) REFERENCES Ingredient(id);

ALTER TABLE ToppingBOM ADD CONSTRAINT FK_ToppingBOM_Topping FOREIGN KEY (toppingId) REFERENCES Topping(id) ON DELETE CASCADE;
ALTER TABLE ToppingBOM ADD CONSTRAINT FK_ToppingBOM_Ingredient FOREIGN KEY (ingredientId) REFERENCES Ingredient(id);

ALTER TABLE [Order] ADD CONSTRAINT FK_Order_Customer FOREIGN KEY (customerId) REFERENCES Customer(id);
ALTER TABLE [Order] ADD CONSTRAINT FK_Order_PagerDevice FOREIGN KEY (pagerId) REFERENCES PagerDevice(id);
ALTER TABLE [Order] ADD CONSTRAINT FK_Order_Employee FOREIGN KEY (employeeId) REFERENCES Employee(id);

ALTER TABLE OrderDetail ADD CONSTRAINT FK_OrderDetail_Order FOREIGN KEY (orderId) REFERENCES [Order](id) ON DELETE CASCADE;
ALTER TABLE OrderDetail ADD CONSTRAINT FK_OrderDetail_ProductVariant FOREIGN KEY (variantId) REFERENCES ProductVariant(id);

ALTER TABLE OrderDetailTopping ADD CONSTRAINT FK_OrderDetailTopping_OrderDetail FOREIGN KEY (orderDetailId) REFERENCES OrderDetail(id) ON DELETE CASCADE;
ALTER TABLE OrderDetailTopping ADD CONSTRAINT FK_OrderDetailTopping_Topping FOREIGN KEY (toppingId) REFERENCES Topping(id);

ALTER TABLE LoyaltyTransaction ADD CONSTRAINT FK_LoyaltyTransaction_Customer FOREIGN KEY (customerId) REFERENCES Customer(id);
ALTER TABLE LoyaltyTransaction ADD CONSTRAINT FK_LoyaltyTransaction_Order FOREIGN KEY (orderId) REFERENCES [Order](id);

ALTER TABLE InventoryImport ADD CONSTRAINT FK_InventoryImport_Employee FOREIGN KEY (employeeId) REFERENCES Employee(id);
ALTER TABLE InventoryImportDetail ADD CONSTRAINT FK_InventoryImportDetail_Import FOREIGN KEY (importId) REFERENCES InventoryImport(id) ON DELETE CASCADE;
ALTER TABLE InventoryImportDetail ADD CONSTRAINT FK_InventoryImportDetail_Ingredient FOREIGN KEY (ingredientId) REFERENCES Ingredient(id);

ALTER TABLE InventoryAdjustment ADD CONSTRAINT FK_InventoryAdjustment_Ingredient FOREIGN KEY (ingredientId) REFERENCES Ingredient(id);
ALTER TABLE InventoryAdjustment ADD CONSTRAINT FK_InventoryAdjustment_Employee FOREIGN KEY (employeeId) REFERENCES Employee(id);
GO
```

# 03_triggers.sql

| Property | Value |
|----------|-------|
| Path | `03_triggers.sql` |
| Size | 8,396 bytes |
| Extension | `.sql` |
| Modified | 2026-10-03 19:03:43.623499 |

```sql
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
IF OBJECT_ID('trg_OrderDetail_CheckInventory', 'TR') IS NOT NULL 
    DROP TRIGGER trg_OrderDetail_CheckInventory;
GO

CREATE OR ALTER TRIGGER trg_OrderDetail_CheckInventory
ON OrderDetail 
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF (EXISTS (SELECT 1 FROM deleted)) 
       AND (NOT UPDATE(variantId) AND NOT UPDATE(quantity) AND NOT UPDATE(itemStatus))
    BEGIN
        RETURN;
    END

    -- Chỉ kiểm tra những món chưa hoàn thành và chưa bị hủy
    ;WITH RequiredList AS (
        -- Tiêu hao từ ly nước
        SELECT 
            rb.ingredientId,
            SUM(rb.consumedQuantity * ins.quantity) AS requiredQty
        FROM inserted ins
        INNER JOIN RecipeBOM rb ON ins.variantId = rb.variantId
        WHERE ins.itemStatus NOT IN (N'DONE', N'CANCELLED')
        GROUP BY rb.ingredientId

        UNION ALL

        -- Tiêu hao từ Topping (nếu có cập nhật/thêm)
        SELECT 
            tb.ingredientId,
            SUM(tb.consumedQuantity * odt.quantity * ins.quantity) AS requiredQty
        FROM inserted ins
        INNER JOIN OrderDetailTopping odt ON ins.id = odt.orderDetailId
        INNER JOIN ToppingBOM tb ON odt.toppingId = tb.toppingId
        WHERE ins.itemStatus NOT IN (N'DONE', N'CANCELLED')
        GROUP BY tb.ingredientId
    ),
    TotalRequirement AS (
        SELECT ingredientId, SUM(requiredQty) AS totalRequired
        FROM RequiredList
        GROUP BY ingredientId
    )
    SELECT TOP 1 1
    FROM TotalRequirement tr
    INNER JOIN Ingredient ig ON tr.ingredientId = ig.id
    WHERE ig.stockQuantity < tr.totalRequired;

    IF @@ROWCOUNT > 0
    BEGIN
        RAISERROR(N'Tồn kho nguyên liệu (bao gồm cả topping) không đủ để đáp ứng yêu cầu!', 16, 1);
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
```

# 04_views.sql

| Property | Value |
|----------|-------|
| Path | `04_views.sql` |
| Size | 4,002 bytes |
| Extension | `.sql` |
| Modified | 2026-09-27 20:58:16.108057 |

```sql
--1. Cảnh báo nhanh các nguyên liệu sắp hết 
CREATE OR ALTER VIEW v_LowStockIngredients AS
SELECT 
    id, 
    name, 
    unit, 
    stockQuantity, 
    minimumThreshold,
    (stockQuantity - minimumThreshold) AS chenhLech
FROM Ingredient
WHERE deletedAt IS NULL 
  AND stockQuantity <= minimumThreshold;
GO
--2. Hiển thị công thức định lượng của từng size sp 
CREATE OR ALTER VIEW v_ProductRecipeDetails AS
SELECT 
    p.name AS productName,
    pv.size AS productSize,
    i.name AS ingredientName,
    rb.consumedQuantity AS consumedQuantity,
    i.unit AS ingredientUnit
FROM RecipeBOM rb
JOIN ProductVariant pv ON rb.variantId = pv.id
JOIN Product p ON pv.productId = p.id
JOIN Ingredient i ON rb.ingredientId = i.id
WHERE p.deletedAt IS NULL 
  AND pv.deletedAt IS NULL 
  AND i.deletedAt IS NULL;
GO
--3. Phục vụ pos & in hóa đơn, sử dụng dữ liệu Snapshot 
CREATE OR ALTER VIEW v_InvoiceDetails AS
SELECT 
    o.id AS orderId,
    o.orderCode,
    o.orderChannel,
    o.status AS orderStatus,
    o.paymentMethod,
    o.subTotal,
    o.discountAmount,
    o.totalAmount,
    o.paidAt,
    o.createdAt AS orderCreatedAt,
    e.fullName AS employeeName,
    c.fullName AS customerName,
    c.phoneNumber AS customerPhone,
    od.id AS orderDetailId,
    od.itemSnapshotName,
    od.sizeSnapshot,
    od.quantity,
    od.unitPrice,
    od.totalToppingPriceSnapshot,
    od.totalPrice AS lineTotalPrice,
    od.itemStatus,
    od.note AS itemNote
FROM [Order] o
LEFT JOIN Employee e ON o.employeeId = e.id
LEFT JOIN Customer c ON o.customerId = c.id
JOIN OrderDetail od ON o.id = od.orderId
WHERE o.deletedAt IS NULL;
GO
--4. Thống kê tổng doanh thu thực thu theo từng ngày 
CREATE OR ALTER VIEW v_DailyRevenue AS
SELECT 
    CAST(ISNULL(paidAt, createdAt) AS DATE) AS revenueDate,
    COUNT(id) AS totalOrders,
    SUM(subTotal) AS totalOriginalAmount,
    SUM(discountAmount) AS totalDiscountAmount,
    SUM(totalAmount) AS totalNetRevenue
FROM [Order]
WHERE status = 'COMPLETED' 
  AND deletedAt IS NULL
GROUP BY CAST(ISNULL(paidAt, createdAt) AS DATE);
GO
--5. Tổng hợp số lượng doanh thu theo từng sản phẩm 
CREATE OR ALTER VIEW v_TopSellingProducts AS
SELECT 
    p.id AS productId,
    p.name AS productName,
    SUM(od.quantity) AS totalQuantitySold,
    SUM(od.totalPrice) AS totalRevenue
FROM OrderDetail od
JOIN [Order] o ON od.orderId = o.id
JOIN ProductVariant pv ON od.variantId = pv.id
JOIN Product p ON pv.productId = p.id
WHERE o.status = 'COMPLETED' 
  AND o.deletedAt IS NULL
  AND p.deletedAt IS NULL
GROUP BY p.id, p.name;
GO
--6. Hiển thị bản điều phối thẻ rung và theo dõi thời gian chờ của khách
CREATE OR ALTER VIEW v_ActivePagerDashboard AS
SELECT 
    p.pagerCode,
    p.status AS pagerStatus,
    p.batteryLevel,
    o.id AS orderId,
    o.orderCode,
    c.fullName AS customerName,
    c.phoneNumber AS customerPhone,
    DATEDIFF(MINUTE, o.paidAt, GETDATE()) AS waitingMinutes
FROM PagerDevice p
JOIN [Order] o ON p.id = o.pagerId
LEFT JOIN Customer c ON o.customerId = c.id
WHERE o.status IN ('PENDING_PREP', 'READY_FOR_PICKUP')
  AND p.deletedAt IS NULL
  AND o.deletedAt IS NULL;
GO
--7. Tổng hợp lịch sử tích/ đổi điểm và đối soát số dư từng hội viên
CREATE OR ALTER VIEW v_CustomerLoyaltySummary AS
SELECT 
    c.id AS customerId,
    c.fullName,
    c.phoneNumber,
    c.membershipTier,
    c.rewardPoints AS currentRewardPoints,
    ISNULL(SUM(CASE WHEN lt.transactionType = 'EARN' THEN lt.points ELSE 0 END), 0) AS totalPointsEarned,
    ISNULL(SUM(CASE WHEN lt.transactionType = 'REDEEM' THEN lt.points ELSE 0 END), 0) AS totalPointsRedeemed
FROM Customer c
LEFT JOIN LoyaltyTransaction lt ON c.id = lt.customerId
WHERE c.deletedAt IS NULL
GROUP BY c.id, c.fullName, c.phoneNumber, c.membershipTier, c.rewardPoints;
GO

```

# 05_stored_procedures.sql

| Property | Value |
|----------|-------|
| Path | `05_stored_procedures.sql` |
| Size | 29,015 bytes |
| Extension | `.sql` |
| Modified | 2026-10-16 23:23:56.824750 |

```sql
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
    @NewOrderId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- 1. Tạo Header Order
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

 INSERT INTO OrderDetail (
            orderId, variantId, quantity, note, itemSnapshotName,
            sizeSnapshot, unitPrice, totalToppingPriceSnapshot,
            totalPrice, itemStatus, createdAt
        )
        SELECT 
            @NewOrderId, src.variantId, src.quantity, src.note, src.itemSnapshotName,
            src.sizeSnapshot, src.unitPrice, src.totalToppingPriceSnapshot,
            src.totalPrice, N'PENDING', SYSDATETIME()
        FROM @OrderDetails AS src;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO


-- 1.2. sp_CompleteOrderPayment
CREATE PROCEDURE sp_CompleteOrderPayment
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
CREATE PROCEDURE sp_CancelOrder
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
CREATE PROCEDURE sp_ApplyLoyaltyPoints
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
            RAISERROR(N'Insufficient loyalty points balance!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        DECLARE @DiscountAmount DECIMAL(18, 2) = @PointsToRedeem * @ConversionRate;

      

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
CREATE PROCEDURE sp_RemoveOrderItem
    @OrderDetailId INT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
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

        COMMIT TRANSACTION;
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
END;
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
```

# 06_functions.sql

| Property | Value |
|----------|-------|
| Path | `06_functions.sql` |
| Size | 3,623 bytes |
| Extension | `.sql` |
| Modified | 2026-09-29 23:02:21.139590 |

```sql

--1. Tính thành tiền của 1 ly nước, dùng gán cho Computed Column
CREATE OR ALTER FUNCTION fnc_CalculateItemTotalPrice (
    @quantity INT,
    @unitPrice DECIMAL(18, 2),
    @totalToppingPriceSnapshot DECIMAL(18, 2)
)
RETURNS DECIMAL(18, 2)
AS
BEGIN
    RETURN ISNULL(@quantity, 0) * (ISNULL(@unitPrice, 0) + ISNULL(@totalToppingPriceSnapshot, 0));
END;
GO
--2. Tự động tính điểm thưởng hội viên nhận dựa trên tổng tiền, quy tắc 10.000 = 1 điểm 
CREATE OR ALTER FUNCTION fnc_CalculateEarnedPoints (
    @totalAmount DECIMAL(18, 2)
)
RETURNS INT
AS
BEGIN
    IF @totalAmount IS NULL OR @totalAmount < 10000
        RETURN 0;

    RETURN FLOOR(@totalAmount / 10000.0);
END;
GO
--3. Trả về tổng doanh thu thực thu trong một khoảng thời gian 
CREATE OR ALTER FUNCTION fn_GetTotalRevenue (
    @fromDate DATETIME,
    @toDate DATETIME
)
RETURNS DECIMAL(18, 2)
AS
BEGIN
    DECLARE @totalRevenue DECIMAL(18, 2);

    SELECT @totalRevenue = SUM(totalAmount)
    FROM [Order]
    WHERE status = 'COMPLETED'
      AND deletedAt IS NULL
      AND ISNULL(paidAt, createdAt) BETWEEN @fromDate AND @toDate;

    RETURN ISNULL(@totalRevenue, 0);
END;
GO
--4. Tính chiết khấu hội viên, quy đổi số điểm hội viên muốn dùng thành số tiền giảm giá
CREATE OR ALTER FUNCTION fn_CalculateMemberDiscount (
    @points INT
)
RETURNS DECIMAL(18, 2)
AS
BEGIN
    IF @points IS NULL OR @points <= 0
        RETURN 0;

    RETURN CAST(@points AS DECIMAL(18, 2)) * 1000.0;
END;
GO
--5. Kiểm tra thẻ rung, kiểm tra thiết bị ở trạng thái nào, đủ điều kiện phát cho khách không
CREATE OR ALTER FUNCTION fn_IsPagerAvailable (
    @pagerId INT
)
RETURNS BIT
AS
BEGIN
    DECLARE @isAvailable BIT = 0;

    IF EXISTS (
        SELECT 1 
        FROM PagerDevice 
        WHERE id = @pagerId 
          AND status = 'AVAILABLE' 
          AND batteryLevel >= 15 
          AND deletedAt IS NULL
    )
    BEGIN
        SET @isAvailable = 1;
    END

    RETURN @isAvailable;
END;
GO
--6. Danh sách N món bán chạy nhất trong khoảng thời gian 
CREATE OR ALTER FUNCTION fn_GetTopSellingProducts (
    @topN INT,
    @fromDate DATETIME,
    @toDate DATETIME
)
RETURNS TABLE
AS
RETURN (
    SELECT TOP (@topN)
        p.id AS productId,
        p.name AS productName,
        SUM(od.quantity) AS totalQuantitySold,
        SUM(od.totalPrice) AS totalRevenue
    FROM OrderDetail od
    JOIN [Order] o ON od.orderId = o.id
    JOIN ProductVariant pv ON od.variantId = pv.id
    JOIN Product p ON pv.productId = p.id
    WHERE o.status = 'COMPLETED'
      AND o.deletedAt IS NULL
      AND p.deletedAt IS NULL
      AND ISNULL(o.paidAt, o.createdAt) BETWEEN @fromDate AND @toDate
    GROUP BY p.id, p.name
    ORDER BY totalQuantitySold DESC
);
GO
--7. Lấy danh sách lịch sử tích/ đổi điểm của một hội viên theo thời gian
CREATE OR ALTER FUNCTION fn_GetMemberLoyaltyHistory (
    @customerId INT,
    @fromDate DATETIME,
    @toDate DATETIME
)
RETURNS TABLE
AS
RETURN (
    SELECT 
        lt.id AS transactionId,
        lt.customerId,
        lt.orderId,
        o.orderCode,
        lt.transactionType,
        lt.points,
        lt.balanceAfter,
        lt.description,
        lt.createdAt AS transactionTime
    FROM LoyaltyTransaction lt
    LEFT JOIN [Order] o ON lt.orderId = o.id
    WHERE lt.customerId = @customerId
      AND lt.createdAt BETWEEN @fromDate AND @toDate
);
GO

```

# 07_indexes.sql

| Property | Value |
|----------|-------|
| Path | `07_indexes.sql` |
| Size | 1,248 bytes |
| Extension | `.sql` |
| Modified | 2026-09-29 23:02:07.822240 |

```sql

-- 1. Lọc đơn hàng cho bảng điều khiển (Dashboard / POS)
CREATE NONCLUSTERED INDEX IX_Order_createdAt_status 
ON [Order] (createdAt DESC, status) 
INCLUDE (totalAmount, customerId, paymentMethod);
GO

-- 2. Tối ưu khi join lịch sử mua hàng của Customer
CREATE NONCLUSTERED INDEX IX_Order_customerId 
ON [Order] (customerId) 
INCLUDE (orderCode, totalAmount, createdAt, status) 
WHERE customerId IS NOT NULL;
GO

-- 3. Tối ưu tra cứu OrderDetail theo Order
CREATE NONCLUSTERED INDEX IX_OrderDetail_orderId 
ON OrderDetail (orderId) 
INCLUDE (variantId, quantity, unitPrice, totalPrice, itemStatus);
GO

-- 4. Tối ưu báo cáo mức nguyên liệu (Cảnh báo KDS / Kho)
CREATE NONCLUSTERED INDEX IX_Ingredient_stock_threshold 
ON Ingredient (stockQuantity, minimumThreshold) 
INCLUDE (name, unit);
GO

-- 5. Lọc Menu Category lên POS / App
CREATE NONCLUSTERED INDEX IX_Product_categoryId_status 
ON Product (categoryId, status) 
INCLUDE (name, image);
GO

-- 6. Xem lịch sử tích điểm của khách
CREATE NONCLUSTERED INDEX IX_LoyaltyTransaction_customerId_createdAt 
ON LoyaltyTransaction (customerId, createdAt DESC) 
INCLUDE (transactionType, points, balanceAfter);
GO
```

# 08_security_roles.sql

| Property | Value |
|----------|-------|
| Path | `08_security_roles.sql` |
| Size | 6,808 bytes |
| Extension | `.sql` |
| Modified | 2026-10-16 23:23:56.826476 |

```sql
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
GRANT SELECT ON [Order] TO BARISTA;
GRANT SELECT, UPDATE (itemStatus) ON OrderDetail TO BARISTA;
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
```

# 09_backup_recovery.sql

| Property | Value |
|----------|-------|
| Path | `09_backup_recovery.sql` |
| Size | 3,311 bytes |
| Extension | `.sql` |
| Modified | 2026-10-16 23:23:56.826634 |

```sql
-- ============================================================================
-- KỊCH BẢN SAO LƯU TỰ ĐỘNG VÀ PHỤC HỒI (BACKUP & RECOVERY)
-- ============================================================================

-- 1. Chuyển CSDL sang chế độ RECOVERY FULL
USE master;
GO

ALTER DATABASE COFFEE_SYSTEM SET RECOVERY FULL;
GO

USE COFFEE_SYSTEM;
GO

-- ============================================================================
-- 2. TẠO CÁC THỦ TỤC SAO LƯU
-- ============================================================================

-- 2.1. Stored Procedure thực hiện Full Backup
CREATE OR ALTER PROCEDURE sp_Backup_Full
    @BackupFolder NVARCHAR(500) = N'D:\Backups\'
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @FileName NVARCHAR(600);
    DECLARE @DateStamp NVARCHAR(50) = CONVERT(NVARCHAR(20), GETDATE(), 112) + N'_' + REPLACE(CONVERT(NVARCHAR(20), GETDATE(), 108), ':', '');
    
    SET @FileName = @BackupFolder + N'COFFEE_SYSTEM_FULL_' + @DateStamp + N'.bak';

    PRINT N'Bắt đầu Full Backup: ' + @FileName;
    BACKUP DATABASE COFFEE_SYSTEM
    TO DISK = @FileName
    WITH FORMAT, INIT, CHECKSUM, 
         NAME = N'COFFEE_SYSTEM - Full Database Backup';
    
    INSERT INTO SystemLog (ActionType, TableName, Description)
    VALUES ('BACKUP', 'Database', 'Full Backup completed successfully: ' + @FileName);
    
    PRINT N'Full Backup hoàn tất thành công!';
END;
GO

-- 2.2. Stored Procedure thực hiện Differential Backup
CREATE OR ALTER PROCEDURE sp_Backup_Diff
    @BackupFolder NVARCHAR(500) = N'D:\Backups\'
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @FileName NVARCHAR(600);
    DECLARE @DateStamp NVARCHAR(50) = CONVERT(NVARCHAR(20), GETDATE(), 112) + N'_' + REPLACE(CONVERT(NVARCHAR(20), GETDATE(), 108), ':', '');
    
    SET @FileName = @BackupFolder + N'COFFEE_SYSTEM_DIFF_' + @DateStamp + N'.bak';

    PRINT N'Bắt đầu Differential Backup: ' + @FileName;
    BACKUP DATABASE COFFEE_SYSTEM
    TO DISK = @FileName
    WITH DIFFERENTIAL, NOINIT, CHECKSUM,
         NAME = N'COFFEE_SYSTEM - Differential Database Backup';

    INSERT INTO SystemLog (ActionType, TableName, Description)
    VALUES ('BACKUP', 'Database', 'Differential Backup completed successfully: ' + @FileName);

    PRINT N'Differential Backup hoàn tất thành công!';
END;
GO

-- 2.3. Stored Procedure thực hiện Transaction Log Backup
CREATE OR ALTER PROCEDURE sp_Backup_Log
    @BackupFolder NVARCHAR(500) = N'D:\Backups\'
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @FileName NVARCHAR(600);
    DECLARE @DateStamp NVARCHAR(50) = CONVERT(NVARCHAR(20), GETDATE(), 112) + N'_' + REPLACE(CONVERT(NVARCHAR(20), GETDATE(), 108), ':', '');
    
    SET @FileName = @BackupFolder + N'COFFEE_SYSTEM_LOG_' + @DateStamp + N'.trn';

    PRINT N'Bắt đầu Transaction Log Backup: ' + @FileName;
    BACKUP LOG COFFEE_SYSTEM
    TO DISK = @FileName
    WITH NOINIT, CHECKSUM,
         NAME = N'COFFEE_SYSTEM - Transaction Log Backup';

    INSERT INTO SystemLog (ActionType, TableName, Description)
    VALUES ('BACKUP', 'Database', 'Transaction Log Backup completed successfully: ' + @FileName);

    PRINT N'Transaction Log Backup hoàn tất thành công!';
END;
GO

```

# seed_data.sql

| Property | Value |
|----------|-------|
| Path | `seed_data.sql` |
| Size | 13,460 bytes |
| Extension | `.sql` |
| Modified | 2026-10-16 23:23:56.829372 |

```sql

-- Tắt kiểm tra khóa ngoại tạm thời để dọn dẹp và nạp dữ liệu sạch
EXEC sp_MSforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT all";
GO
-- Tắt tạm thời trigger chặn sửa/xóa điểm
ALTER TABLE LoyaltyTransaction DISABLE TRIGGER trg_LoyaltyTransaction_AppendOnly;
GO

DELETE FROM OrderDetailTopping;
DELETE FROM OrderDetail;
DELETE FROM LoyaltyTransaction;
DELETE FROM [Order];
DELETE FROM RecipeBOM;
DELETE FROM ToppingBOM;
DELETE FROM InventoryAdjustment;
DELETE FROM InventoryImportDetail;
DELETE FROM InventoryImport;
DELETE FROM Ingredient;
DELETE FROM Topping;
DELETE FROM ProductVariant;
DELETE FROM Product;
DELETE FROM Category;
DELETE FROM PagerDevice;
DELETE FROM Customer;
DELETE FROM Employee;
GO

-- ==============================================================
-- 1. BẢNG NHÂN VIÊN (Employee) - 4 Role chính
-- ==============================================================
SET IDENTITY_INSERT Employee ON;
INSERT INTO Employee (id, fullName, username, password, role, phoneNumber, status, createdAt, updatedAt)
VALUES
(1, N'Đinh Đức Khang', 'manager01', '$2b$10$N74QV.3xVyajn.V6so9uS.3f4ahiPitcAqC.nPV4sepOL2nOL5lpW', 'MANAGER', '0901111222', 'ACTIVE', GETDATE(), GETDATE()),
(2, N'Võ Thị Hồng Gấm', 'cashier01', '$2b$10$N74QV.3xVyajn.V6so9uS.3f4ahiPitcAqC.nPV4sepOL2nOL5lpW', 'CASHIER', '0902222333', 'ACTIVE', GETDATE(), GETDATE()),
(3, N'Hồ Công Phong', 'barista01', '$2b$10$N74QV.3xVyajn.V6so9uS.3f4ahiPitcAqC.nPV4sepOL2nOL5lpW', 'BARISTA', '0903333444', 'ACTIVE', GETDATE(), GETDATE()),
(4, N'Trần Ngọc Phương Thùy', 'storekeeper01', '$2b$10$N74QV.3xVyajn.V6so9uS.3f4ahiPitcAqC.nPV4sepOL2nOL5lpW', 'STOREKEEPER', '0904444555', 'ACTIVE', GETDATE(), GETDATE());
SET IDENTITY_INSERT Employee OFF;
GO

-- ==============================================================
-- 2. BẢNG KHÁCH HÀNG (Customer) - Các phân hạng
-- ==============================================================

SET IDENTITY_INSERT Customer ON;
INSERT INTO Customer (id, phoneNumber, fullName, password, address, rewardPoints, membershipTier, createdAt, updatedAt)
VALUES
(1, '0988111222', N'Nguyễn Văn An', '$2b$10$N74QV.3xVyajn.V6so9uS.3f4ahiPitcAqC.nPV4sepOL2nOL5lpW', N'Số 1 Võ Văn Ngân, TP. Thủ Đức', 150, 'SILVER', GETDATE(), GETDATE()),
(2, '0977222333', N'Lê Thị Mai', '$2b$10$N74QV.3xVyajn.V6so9uS.3f4ahiPitcAqC.nPV4sepOL2nOL5lpW', N'123 Lê Văn Việt, TP. Thủ Đức', 550, 'GOLD', GETDATE(), GETDATE()),
(3, '0966333444', N'Trần Tuấn Kiệt', '$2b$10$N74QV.3xVyajn.V6so9uS.3f4ahiPitcAqC.nPV4sepOL2nOL5lpW', N'45 Kha Vạn Cân, TP. Thủ Đức', 20, 'STANDARD', GETDATE(), GETDATE()),
(4, '0911888999', N'Phạm Hoàng Nam', '$2b$10$N74QV.3xVyajn.V6so9uS.3f4ahiPitcAqC.nPV4sepOL2nOL5lpW', N'10 Đặng Văn Bi, TP. Thủ Đức', 1250, 'DIAMOND', GETDATE(), GETDATE());
SET IDENTITY_INSERT Customer OFF;
GO

-- ==============================================================
-- 3. BẢNG THIẾT BỊ THẺ RUNG (PagerDevice)
-- ==============================================================
SET IDENTITY_INSERT PagerDevice ON;
INSERT INTO PagerDevice (id, pagerCode, status, batteryLevel, createdAt, updatedAt)
VALUES
(1, 'P01', 'AVAILABLE', 95, GETDATE(), GETDATE()),
(2, 'P02', 'AVAILABLE', 80, GETDATE(), GETDATE()),
(3, 'P03', 'IN_USE', 60, GETDATE(), GETDATE()),
(4, 'P04', 'AVAILABLE', 100, GETDATE(), GETDATE()),
(5, 'P05', 'MAINTENANCE', 10, GETDATE(), GETDATE());
SET IDENTITY_INSERT PagerDevice OFF;
GO

-- ==============================================================
-- 4. BẢNG DANH MỤC (Category)
-- ==============================================================
SET IDENTITY_INSERT Category ON;
INSERT INTO Category (id, name, displayStatus, createdAt, updatedAt)
VALUES
(1, N'Cà Phê Truyền Thống', 'SHOW', GETDATE(), GETDATE()),
(2, N'Cà Phê Pha Máy (Espresso)', 'SHOW', GETDATE(), GETDATE()),
(3, N'Trà Sữa & Trà Trái Cây', 'SHOW', GETDATE(), GETDATE()),
(4, N'Đá Xay (Frappuccino)', 'SHOW', GETDATE(), GETDATE());
SET IDENTITY_INSERT Category OFF;
GO

-- ==============================================================
-- 5. BẢNG SẢN PHẨM (Product)
-- ==============================================================
SET IDENTITY_INSERT Product ON;
INSERT INTO Product (id, categoryId, name, description, image, status, createdAt, updatedAt)
VALUES
(1, 1, N'Cà Phê Sữa Đá', N'Hạt cà phê Robusta rang đậm phối hợp sữa đặc béo ngậy', 'https://images.unsplash.com/photo-1541167760496-1628856ab772', 'ACTIVE', GETDATE(), GETDATE()),
(2, 1, N'Bạc Xỉu', N'Nhiều sữa đặc, sữa tươi kết hợp một shot cà phê thơm dịu', 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38', 'ACTIVE', GETDATE(), GETDATE()),
(3, 2, N'Caramel Macchiato', N'Vani ngọt dịu kết hợp lớp foam sữa bồng bềnh và sốt caramel', 'https://images.unsplash.com/photo-1485808191679-5f86510681a2', 'ACTIVE', GETDATE(), GETDATE()),
(4, 3, N'Trà Đào Cam Sả', N'Trà đào thanh mát kết hợp tép cam vàng tươi mọng nước', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc', 'ACTIVE', GETDATE(), GETDATE());
SET IDENTITY_INSERT Product OFF;
GO

-- ==============================================================
-- 6. BẢNG BIẾN THỂ SIZE (ProductVariant)
-- ==============================================================
SET IDENTITY_INSERT ProductVariant ON;
INSERT INTO ProductVariant (id, productId, size, price, createdAt, updatedAt)
VALUES
(1, 1, 'S', 29000.00, GETDATE(), GETDATE()),
(2, 1, 'M', 35000.00, GETDATE(), GETDATE()),
(3, 1, 'L', 39000.00, GETDATE(), GETDATE()),
(4, 2, 'M', 35000.00, GETDATE(), GETDATE()),
(5, 2, 'L', 42000.00, GETDATE(), GETDATE()),
(6, 3, 'M', 49000.00, GETDATE(), GETDATE()),
(7, 3, 'L', 55000.00, GETDATE(), GETDATE()),
(8, 4, 'M', 45000.00, GETDATE(), GETDATE()),
(9, 4, 'L', 52000.00, GETDATE(), GETDATE());
SET IDENTITY_INSERT ProductVariant OFF;
GO

-- ==============================================================
-- 7. BẢNG TOPPING (Topping)
-- ==============================================================
SET IDENTITY_INSERT Topping ON;
INSERT INTO Topping (id, name, price, status, createdAt, updatedAt)
VALUES
(1, N'Trân Châu Trắng', 8000.00, 'ACTIVE', GETDATE(), GETDATE()),
(2, N'Kem Cheese Macchiato', 12000.00, 'ACTIVE', GETDATE(), GETDATE()),
(3, N'Shot Espresso Bổ Sung', 10000.00, 'ACTIVE', GETDATE(), GETDATE()),
(4, N'Đào Miếng Thêm (2 miếng)', 10000.00, 'ACTIVE', GETDATE(), GETDATE());
SET IDENTITY_INSERT Topping OFF;
GO

-- ==============================================================
-- 8. BẢNG NGUYÊN LIỆU KHO (Ingredient)
-- ==============================================================
SET IDENTITY_INSERT Ingredient ON;
INSERT INTO Ingredient (id, name, unit, stockQuantity, minimumThreshold, createdAt, updatedAt)
VALUES
(1, N'Hạt Cà Phê Robusta', 'kg', 12.500, 3.000, GETDATE(), GETDATE()),
(2, N'Hạt Cà Phê Arabica Cầu Đất', 'kg', 8.200, 2.000, GETDATE(), GETDATE()),
(3, N'Sữa Đặc Ngôi Sao Phương Nam', 'lon', 45.000, 10.000, GETDATE(), GETDATE()),
(4, N'Sữa Tươi Thanh Trùng DalatMilk', 'lit', 18.000, 5.000, GETDATE(), GETDATE()),
(5, N'Siro Đào Monin', 'chai', 4.000, 1.000, GETDATE(), GETDATE()),
(6, N'Trà Đen Phúc Long', 'kg', 5.000, 1.500, GETDATE(), GETDATE()),
(7, N'Bột Kem Phô Mai Cheese', 'kg', 1.200, 2.000, GETDATE(), GETDATE()); -- Cảnh báo sắp hết
SET IDENTITY_INSERT Ingredient OFF;
GO

-- ==============================================================
-- 9. BẢNG CÔNG THỨC MÓN (RecipeBOM)
-- ==============================================================
INSERT INTO RecipeBOM (variantId, ingredientId, consumedQuantity)
VALUES
-- Cà phê sữa đá Size S: 0.02kg cà phê + 0.08 lon sữa đặc
(1, 1, 0.020),
(1, 3, 0.080),
-- Cà phê sữa đá Size M: 0.025kg cà phê + 0.1 lon sữa đặc
(2, 1, 0.025),
(2, 3, 0.100),
-- Cà phê sữa đá Size L: 0.03kg cà phê + 0.12 lon sữa đặc
(3, 1, 0.030),
(3, 3, 0.120),
-- Bạc xỉu Size M: 0.015kg cà phê + 0.1 lon sữa đặc + 0.15 lit sữa tươi
(4, 1, 0.015),
(4, 3, 0.100),
(4, 4, 0.150),
-- Caramel Macchiato Size M: 0.02kg Arabica + 0.22 lit sữa tươi
(6, 2, 0.020),
(6, 4, 0.220),
-- Trà đào cam sả Size M: 0.015kg Trà đen + 0.03 chai siro đào
(8, 6, 0.015),
(8, 5, 0.030);
GO

-- ==============================================================
-- 10. BẢNG CÔNG THỨC TOPPING (ToppingBOM)
-- ==============================================================
INSERT INTO ToppingBOM (toppingId, ingredientId, consumedQuantity)
VALUES
(2, 7, 0.030), -- Kem Cheese tiêu hao 0.03kg bột kem phô mai
(2, 4, 0.050), -- Kem Cheese tiêu hao 0.05 lit sữa tươi
(3, 1, 0.018); -- Shot Espresso thêm tiêu hao 0.018kg cà phê Robusta
GO

-- ==============================================================
-- 11. NHẬP KHO NGUYÊN LIỆU (InventoryImport & Detail)
-- ==============================================================
SET IDENTITY_INSERT InventoryImport ON;
INSERT INTO InventoryImport (id, supplierName, employeeId, totalAmount, importDate, note)
VALUES
(1, N'Công ty Cổ Phần Cà Phê Trung Nguyên', 4, 2500000.00, DATEADD(DAY, -5, GETDATE()), N'Nhập định kỳ đầu tuần');
SET IDENTITY_INSERT InventoryImport OFF;

INSERT INTO InventoryImportDetail (importId, ingredientId, quantity, unitPrice, totalLineAmount)
VALUES
(1, 1, 10.000, 180000.00, 1800000.00),
(1, 3, 35.000, 20000.00, 700000.00);
GO

-- ==============================================================
-- 12. KIỂM KÊ / ĐIỀU CHỈNH KHO (InventoryAdjustment)
-- ==============================================================
SET IDENTITY_INSERT InventoryAdjustment ON;
INSERT INTO InventoryAdjustment (id, ingredientId, employeeId, oldQuantity, newQuantity, difference, reason, adjustmentDate)
VALUES
(1, 4, 4, 20.000, 18.000, -2.000, N'Hao hụt đổ tràn trong quá trình pha chế buổi sáng', DATEADD(DAY, -1, GETDATE()));
SET IDENTITY_INSERT InventoryAdjustment OFF;
GO

-- ==============================================================
-- 13. ĐƠN HÀNG (Order, OrderDetail, OrderDetailTopping)
-- ==============================================================
SET IDENTITY_INSERT [Order] ON;
INSERT INTO [Order] (
    id, orderCode, orderChannel, pagerId, employeeId, customerId, 
    subTotal, discountAmount, totalAmount, paymentMethod, status, 
    paidAt, createdAt, updatedAt
)
VALUES
-- Đơn 1: Đã thanh toán, hoàn tất hôm qua
(1, 'ORD260901', 'ORDER_AT_COUNTER', 1, 2, 1, 47000.00, 0.00, 47000.00, 'BANK_TRANSFER', 'COMPLETED', DATEADD(DAY, -1, GETDATE()), DATEADD(DAY, -1, GETDATE()), DATEADD(DAY, -1, GETDATE())),
-- Đơn 2: Đang chờ pha chế trên KDS
(2, 'ORD260902', 'ORDER_AT_COUNTER', 3, 2, 2, 84000.00, 10000.00, 74000.00, 'CASH', 'PENDING_PREP', GETDATE(), GETDATE(), GETDATE());
SET IDENTITY_INSERT [Order] OFF;
GO

SET IDENTITY_INSERT OrderDetail ON;
INSERT INTO OrderDetail (
    id, orderId, variantId, quantity, note, itemSnapshotName, sizeSnapshot, 
    unitPrice, totalToppingPriceSnapshot, totalPrice, itemStatus, createdAt, updatedAt
)
VALUES
-- Chi tiết Đơn 1: 1 Cà phê sữa M + Trân châu trắng (35k + 8k = 43k)
(1, 1, 2, 1, N'Ít ngọt, nhiều đá', N'Cà Phê Sữa Đá', 'M', 35000.00, 8000.00, 43000.00, 'DONE', DATEADD(DAY, -1, GETDATE()), DATEADD(DAY, -1, GETDATE())),
-- Chi tiết Đơn 2: 1 Caramel Macchiato L (55k) và 1 Bạc xỉu M (35k)
(2, 2, 7, 1, N'Nóng', N'Caramel Macchiato', 'L', 55000.00, 0.00, 55000.00, 'PENDING', GETDATE(), GETDATE()),
(3, 2, 4, 1, N'Bình thường', N'Bạc Xỉu', 'M', 35000.00, 0.00, 35000.00, 'PENDING', GETDATE(), GETDATE());
SET IDENTITY_INSERT OrderDetail OFF;
GO

INSERT INTO OrderDetailTopping (orderDetailId, toppingId, toppingSnapshotName, toppingPrice, quantity)
VALUES
(1, 1, N'Trân Châu Trắng', 8000.00, 1);
GO


-- ==============================================================
-- 14. LỊCH SỬ BIẾN ĐỘNG ĐIỂM (LoyaltyTransaction)
-- ==============================================================

-- 1. Tắt tạm thời trigger chặn xóa/sửa lịch sử điểm
ALTER TABLE LoyaltyTransaction DISABLE TRIGGER trg_LoyaltyTransaction_AppendOnly;
GO

-- 2. Xóa dữ liệu rác/dữ liệu do Trigger tự chèn trước đó
DELETE FROM LoyaltyTransaction;
GO

-- 3. Tiến hành chèn dữ liệu mẫu chuẩn
SET IDENTITY_INSERT LoyaltyTransaction ON;
INSERT INTO LoyaltyTransaction (id, customerId, orderId, transactionType, points, balanceAfter, description, createdAt)
VALUES
(1, 1, 1, 'EARN', 4, 150, N'Tích lũy điểm từ hóa đơn ORD260901', DATEADD(DAY, -1, GETDATE())),
(2, 2, 2, 'REDEEM', 10, 550, N'Đổi 10 điểm giảm 10.000 VNĐ cho đơn ORD260902', GETDATE());
SET IDENTITY_INSERT LoyaltyTransaction OFF;
GO

-- 4. Bật lại trigger bảo vệ sổ cái điểm
ALTER TABLE LoyaltyTransaction ENABLE TRIGGER trg_LoyaltyTransaction_AppendOnly;
GO

-- Bật lại kiểm tra toàn vẹn khóa ngoại
EXEC sp_MSforeachtable "ALTER TABLE ? WITH CHECK CHECK CONSTRAINT all";
GO
```

