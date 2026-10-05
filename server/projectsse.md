# Project Dump

**Root:** `C:\Programing\hqtcsdl\Coffee_System_FinalProject_DBMS\server`

**Generated:** 2026-10-04 18:48:13.801648

**Files:** 101 | **Total size:** 481,109 bytes

---

# database\01_schema_tables.sql

| Property | Value |
|----------|-------|
| Path | `database\01_schema_tables.sql` |
| Size | 5,688 bytes |
| Extension | `.sql` |
| Modified | 2026-10-03 23:37:49.319814 |

```sql
CREATE DATABASE COFFEE_SYSTEM
USE COFFEE_SYSTEM 

-- 1. CÁC BẢNG DANH MỤC CƠ BẢN
CREATE TABLE Category (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    name NVARCHAR(150) NOT NULL,
    displayStatus NVARCHAR(50) NOT NULL,
    createdAt DATETIME2(7) NOT NULL,
    updatedAt DATETIME2(7)
);
GO

CREATE TABLE Topping (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    name NVARCHAR(150) NOT NULL,
    price DECIMAL(18, 2) NOT NULL,
    status NVARCHAR(50) NOT NULL,
    createdAt DATETIME2(7),
    updatedAt DATETIME2(7)
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
```

# database\02_constraints.sql

| Property | Value |
|----------|-------|
| Path | `database\02_constraints.sql` |
| Size | 10,056 bytes |
| Extension | `.sql` |
| Modified | 2026-10-03 22:37:48.529308 |

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
ALTER TABLE [Order] ADD CONSTRAINT CK_Order_payment CHECK (paymentMethod IN ('CASH', 'BANK_TRANSFER', 'CARD', 'MOMO', 'VNPAY', 'POINT_EXCHANGE'));
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

# database\03_triggers.sql

| Property | Value |
|----------|-------|
| Path | `database\03_triggers.sql` |
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

# database\04_views.sql

| Property | Value |
|----------|-------|
| Path | `database\04_views.sql` |
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

# database\05_stored_procedures.sql

| Property | Value |
|----------|-------|
| Path | `database\05_stored_procedures.sql` |
| Size | 29,282 bytes |
| Extension | `.sql` |
| Modified | 2026-10-03 23:33:59.078419 |

```sql
-- USE CoffeeShopDB;

-- ==============================================================
-- XÓA CÁC STORED PROCEDURE NẾU ĐÃ TỒN TẠI
-- ==============================================================

-- 1. Phân hệ Bán hàng & Thanh toán (POS)
IF OBJECT_ID('sp_CreateCounterOrder', 'P') IS NOT NULL 
    DROP PROCEDURE sp_CreateCounterOrder;
GO

IF EXISTS (SELECT * FROM sys.types WHERE name = 'udt_OrderDetailList')
    DROP TYPE udt_OrderDetailList;
GO

IF EXISTS (SELECT * FROM sys.types WHERE name = 'udt_OrderDetailToppingList')
    DROP TYPE udt_OrderDetailToppingList;
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
CREATE OR ALTER PROCEDURE sp_CreateCounterOrder
    @OrderCode VARCHAR(64),
    @EmployeeId INT,
    @CustomerId INT = NULL,
    @PagerId INT = NULL,
    @SubTotal DECIMAL(18, 2),
    @DiscountAmount DECIMAL(18, 2) = 0,
    @TotalAmount DECIMAL(18, 2),
    @PaymentMethod NVARCHAR(50),
    @OrderDetails udt_OrderDetailList READONLY,
    @OrderToppings udt_OrderDetailToppingList READONLY,  -- Bổ sung TVP topping
    @NewOrderId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- 1. Tạo Header Order
        INSERT INTO [Order] (
            orderCode, customerId, pagerId, employeeId, orderChannel,
            subTotal, discountAmount, totalAmount, paymentMethod,
            status, createdAt
        )
        VALUES (
            @OrderCode, @CustomerId, @PagerId, @EmployeeId, N'ORDER_AT_COUNTER',
            @SubTotal, @DiscountAmount, @TotalAmount, @PaymentMethod,
            N'PENDING_PREP', SYSDATETIME()
        );

        SET @NewOrderId = SCOPE_IDENTITY();

        -- 2. Bảng tạm để lưu OrderDetailId sinh ra kèm itemIndex
        DECLARE @InsertedDetails TABLE (
            orderDetailId INT,
            itemIndex INT
        );

        -- 3. Insert chi tiết các ly nước và lấy ID sinh ra
        MERGE INTO OrderDetail AS target
        USING @OrderDetails AS src
        ON 1 = 0 -- Luôn thực hiện INSERT
        WHEN NOT MATCHED THEN
            INSERT (
                orderId, variantId, quantity, note, itemSnapshotName,
                sizeSnapshot, unitPrice, totalToppingPriceSnapshot,
                totalPrice, itemStatus, createdAt
            )
            VALUES (
                @NewOrderId, src.variantId, src.quantity, src.note, src.itemSnapshotName,
                src.sizeSnapshot, src.unitPrice, src.totalToppingPriceSnapshot,
                src.totalPrice, N'PENDING', SYSDATETIME()
            )
        OUTPUT inserted.id, src.itemIndex INTO @InsertedDetails(orderDetailId, itemIndex);

        -- 4. Insert toàn bộ Topping ghép qua itemIndex (chạy 1 lệnh duy nhất)
        INSERT INTO OrderDetailTopping (
            orderDetailId, toppingId, toppingSnapshotName, toppingPrice, quantity
        )
        SELECT 
            idmap.orderDetailId,
            topSrc.toppingId,
            topSrc.toppingSnapshotName,
            topSrc.toppingPrice,
            topSrc.quantity
        FROM @OrderToppings topSrc
        INNER JOIN @InsertedDetails idmap ON topSrc.itemIndex = idmap.itemIndex;

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

CREATE OR ALTER PROCEDURE sp_KDS_NotifyOrderReady
    @OrderId INT,
    @PagerId INT OUTPUT,
    @PendingCount INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
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

CREATE TYPE udt_OrderDetailToppingList AS TABLE (
    itemIndex INT NOT NULL,       
    toppingId INT NULL,
    toppingSnapshotName NVARCHAR(150) NOT NULL,
    toppingPrice DECIMAL(18, 2) NOT NULL,
    quantity INT NOT NULL
);


CREATE TYPE udt_OrderDetailList AS TABLE (
    itemIndex INT NOT NULL,               -- Định danh dòng: 0, 1, 2...
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
```

# database\06_functions.sql

| Property | Value |
|----------|-------|
| Path | `database\06_functions.sql` |
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

# database\07_indexes.sql

| Property | Value |
|----------|-------|
| Path | `database\07_indexes.sql` |
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

# database\08_security_roles.sql

| Property | Value |
|----------|-------|
| Path | `database\08_security_roles.sql` |
| Size | 6,804 bytes |
| Extension | `.sql` |
| Modified | 2026-10-03 22:54:44.387179 |

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
GRANT EXECUTE ON sp_KDS_NotifyOrderReady TO BARISTA;


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
GRANT EXECUTE ON sp_KDS_NotifyOrderReady TO MANAGER;

-- Quyền sử dụng các Kiểu dữ liệu bảng (TVP)
GRANT EXECUTE ON TYPE::udt_OrderDetailList TO MANAGER;
GRANT EXECUTE ON TYPE::udt_InventoryImportDetailList TO MANAGER;
GRANT EXECUTE ON TYPE::udt_OrderDetailToppingList TO MANAGER;
GO
```

# database\seed_data.sql

| Property | Value |
|----------|-------|
| Path | `database\seed_data.sql` |
| Size | 13,212 bytes |
| Extension | `.sql` |
| Modified | 2026-10-03 22:53:24.975161 |

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
(1, N'Đinh Đức Khang', 'manager01', '$2b$10$abcdefghijklmnopqrstuv', 'MANAGER', '0901111222', 'ACTIVE', GETDATE(), GETDATE()),
(2, N'Võ Thị Hồng Gấm', 'cashier01', '$2b$10$abcdefghijklmnopqrstuv', 'CASHIER', '0902222333', 'ACTIVE', GETDATE(), GETDATE()),
(3, N'Hồ Công Phong', 'barista01', '$2b$10$abcdefghijklmnopqrstuv', 'BARISTA', '0903333444', 'ACTIVE', GETDATE(), GETDATE()),
(4, N'Trần Ngọc Phương Thùy', 'storekeeper01', '$2b$10$abcdefghijklmnopqrstuv', 'STOREKEEPER', '0904444555', 'ACTIVE', GETDATE(), GETDATE());
SET IDENTITY_INSERT Employee OFF;
GO

-- ==============================================================
-- 2. BẢNG KHÁCH HÀNG (Customer) - Các phân hạng
-- ==============================================================

SET IDENTITY_INSERT Customer ON;
INSERT INTO Customer (id, phoneNumber, fullName, password, address, rewardPoints, membershipTier, createdAt, updatedAt)
VALUES
(1, '0988111222', N'Nguyễn Văn An', '$2b$10$abcdefghijklmnopqrstuv', N'Số 1 Võ Văn Ngân, TP. Thủ Đức', 150, 'SILVER', GETDATE(), GETDATE()),
(2, '0977222333', N'Lê Thị Mai', '$2b$10$abcdefghijklmnopqrstuv', N'123 Lê Văn Việt, TP. Thủ Đức', 550, 'GOLD', GETDATE(), GETDATE()),
(3, '0966333444', N'Trần Tuấn Kiệt', '$2b$10$abcdefghijklmnopqrstuv', N'45 Kha Vạn Cân, TP. Thủ Đức', 20, 'STANDARD', GETDATE(), GETDATE()),
(4, '0911888999', N'Phạm Hoàng Nam', '$2b$10$abcdefghijklmnopqrstuv', N'10 Đặng Văn Bi, TP. Thủ Đức', 1250, 'DIAMOND', GETDATE(), GETDATE());
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

# package-lock.json

| Property | Value |
|----------|-------|
| Path | `package-lock.json` |
| Size | 131,100 bytes |
| Extension | `.json` |
| Modified | 2026-10-04 17:52:21.770447 |

```json
{
  "name": "coffeeshop-dbms-backend",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "coffeeshop-dbms-backend",
      "version": "1.0.0",
      "dependencies": {
        "axios": "^1.20.0",
        "bcrypt": "^6.0.0",
        "cors": "^2.8.5",
        "dotenv": "^17.2.1",
        "express": "^4.21.2",
        "helmet": "^8.1.0",
        "jsonwebtoken": "^9.0.2",
        "mssql": "^11.0.1",
        "pino": "^9.6.0",
        "pino-http": "^10.4.0",
        "swagger-jsdoc": "^6.3.0",
        "swagger-ui-express": "^5.0.1",
        "zod": "^3.24.2"
      },
      "devDependencies": {
        "@types/bcrypt": "^6.0.0",
        "@types/cors": "^2.8.17",
        "@types/express": "^4.17.21",
        "@types/jsonwebtoken": "^9.0.8",
        "@types/mssql": "^9.0.6",
        "@types/node": "^24.3.0",
        "@types/swagger-jsdoc": "^6.0.4",
        "@types/swagger-ui-express": "^4.1.8",
        "swagger-autogen": "^2.23.7",
        "tsx": "^4.19.3",
        "typescript": "^5.9.2"
      }
    },
    "node_modules/@apidevtools/json-schema-ref-parser": {
      "version": "14.0.1",
      "resolved": "https://registry.npmjs.org/@apidevtools/json-schema-ref-parser/-/json-schema-ref-parser-14.0.1.tgz",
      "integrity": "sha512-Oc96zvmxx1fqoSEdUmfmvvb59/KDOnUoJ7s2t7bISyAn0XEz57LCCw8k2Y4Pf3mwKaZLMciESALORLgfe2frCw==",
      "license": "MIT",
      "dependencies": {
        "@types/json-schema": "^7.0.15",
        "js-yaml": "^4.1.0"
      },
      "engines": {
        "node": ">= 16"
      },
      "funding": {
        "url": "https://github.com/sponsors/philsturgeon"
      }
    },
    "node_modules/@apidevtools/openapi-schemas": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/@apidevtools/openapi-schemas/-/openapi-schemas-2.1.0.tgz",
      "integrity": "sha512-Zc1AlqrJlX3SlpupFGpiLi2EbteyP7fXmUOGup6/DnkRgjP9bgMM/ag+n91rsv0U1Gpz0H3VILA/o3bW7Ua6BQ==",
      "license": "MIT",
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/@apidevtools/swagger-methods": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/@apidevtools/swagger-methods/-/swagger-methods-3.0.2.tgz",
      "integrity": "sha512-QAkD5kK2b1WfjDS/UQn/qQkbwF31uqRjPTrsCs5ZG9BQGAkjwvqGFjjPqAuzac/IYzpPtRzjCP1WrTuAIjMrXg==",
      "license": "MIT"
    },
    "node_modules/@apidevtools/swagger-parser": {
      "version": "12.1.0",
      "resolved": "https://registry.npmjs.org/@apidevtools/swagger-parser/-/swagger-parser-12.1.0.tgz",
      "integrity": "sha512-e5mJoswsnAX0jG+J09xHFYQXb/bUc5S3pLpMxUuRUA2H8T2kni3yEoyz2R3Dltw5f4A6j6rPNMpWTK+iVDFlng==",
      "license": "MIT",
      "dependencies": {
        "@apidevtools/json-schema-ref-parser": "14.0.1",
        "@apidevtools/openapi-schemas": "^2.1.0",
        "@apidevtools/swagger-methods": "^3.0.2",
        "ajv": "^8.17.1",
        "ajv-draft-04": "^1.0.0",
        "call-me-maybe": "^1.0.2"
      },
      "peerDependencies": {
        "openapi-types": ">=7"
      }
    },
    "node_modules/@azure-rest/core-client": {
      "version": "2.7.0",
      "resolved": "https://registry.npmjs.org/@azure-rest/core-client/-/core-client-2.7.0.tgz",
      "integrity": "sha512-rL0lJqh1E8HLXNgjIw8cRyGAV/v+m6p1xRu/8OhsnmN8XHhwkyYJkAoGM+zrew96v7jZYPmVfy7pv7v4Iccfsg==",
      "license": "MIT",
      "dependencies": {
        "@azure/abort-controller": "^2.1.2",
        "@azure/core-auth": "^1.10.0",
        "@azure/core-rest-pipeline": "^1.24.0",
        "@azure/core-tracing": "^1.3.0",
        "@typespec/ts-http-runtime": "^0.3.0",
        "tslib": "^2.6.2"
      },
      "engines": {
        "node": ">=20.0.0"
      }
    },
    "node_modules/@azure/abort-controller": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/@azure/abort-controller/-/abort-controller-2.1.2.tgz",
      "integrity": "sha512-nBrLsEWm4J2u5LpAPjxADTlq3trDgVZZXHNKabeXZtpq3d3AbN/KGO82R87rdDz5/lYB024rtEf10/q0urNgsA==",
      "license": "MIT",
      "dependencies": {
        "tslib": "^2.6.2"
      },
      "engines": {
        "node": ">=18.0.0"
      }
    },
    "node_modules/@azure/core-auth": {
      "version": "1.10.1",
      "resolved": "https://registry.npmjs.org/@azure/core-auth/-/core-auth-1.10.1.tgz",
      "integrity": "sha512-ykRMW8PjVAn+RS6ww5cmK9U2CyH9p4Q88YJwvUslfuMmN98w/2rdGRLPqJYObapBCdzBVeDgYWdJnFPFb7qzpg==",
      "license": "MIT",
      "dependencies": {
        "@azure/abort-controller": "^2.1.2",
        "@azure/core-util": "^1.13.0",
        "tslib": "^2.6.2"
      },
      "engines": {
        "node": ">=20.0.0"
      }
    },
    "node_modules/@azure/core-client": {
      "version": "1.10.2",
      "resolved": "https://registry.npmjs.org/@azure/core-client/-/core-client-1.10.2.tgz",
      "integrity": "sha512-1D2LpsU7y9xrqKjdIbsB7PlrRePw0xsVV8p+AKTlzITrWmscajryfJCdDJB/oGwvDI5HmRo04eMMADB67uwAwQ==",
      "license": "MIT",
      "dependencies": {
        "@azure/abort-controller": "^2.1.2",
        "@azure/core-auth": "^1.10.0",
        "@azure/core-rest-pipeline": "^1.22.0",
        "@azure/core-tracing": "^1.3.0",
        "@azure/core-util": "^1.13.0",
        "@azure/logger": "^1.3.0",
        "tslib": "^2.6.2"
      },
      "engines": {
        "node": ">=20.0.0"
      }
    },
    "node_modules/@azure/core-lro": {
      "version": "2.7.2",
      "resolved": "https://registry.npmjs.org/@azure/core-lro/-/core-lro-2.7.2.tgz",
      "integrity": "sha512-0YIpccoX8m/k00O7mDDMdJpbr6mf1yWo2dfmxt5A8XVZVVMz2SSKaEbMCeJRvgQ0IaSlqhjT47p4hVIRRy90xw==",
      "license": "MIT",
      "dependencies": {
        "@azure/abort-controller": "^2.0.0",
        "@azure/core-util": "^1.2.0",
        "@azure/logger": "^1.0.0",
        "tslib": "^2.6.2"
      },
      "engines": {
        "node": ">=18.0.0"
      }
    },
    "node_modules/@azure/core-paging": {
      "version": "1.6.2",
      "resolved": "https://registry.npmjs.org/@azure/core-paging/-/core-paging-1.6.2.tgz",
      "integrity": "sha512-YKWi9YuCU04B55h25cnOYZHxXYtEvQEbKST5vqRga7hWY9ydd3FZHdeQF8pyh+acWZvppw13M/LMGx0LABUVMA==",
      "license": "MIT",
      "dependencies": {
        "tslib": "^2.6.2"
      },
      "engines": {
        "node": ">=18.0.0"
      }
    },
    "node_modules/@azure/core-rest-pipeline": {
      "version": "1.24.0",
      "resolved": "https://registry.npmjs.org/@azure/core-rest-pipeline/-/core-rest-pipeline-1.24.0.tgz",
      "integrity": "sha512-PpLsoDQ3AMmKZ0VU+0GrmqMxgp/sExjlVm4R+nLWngeoEGAzOIPVifaxKGU5gMv+nWELUoHfvrolWD+ZS/nFJg==",
      "license": "MIT",
      "dependencies": {
        "@azure/abort-controller": "^2.1.2",
        "@azure/core-auth": "^1.10.0",
        "@azure/core-tracing": "^1.3.0",
        "@azure/core-util": "^1.13.0",
        "@azure/logger": "^1.3.0",
        "@typespec/ts-http-runtime": "^0.3.4",
        "tslib": "^2.6.2"
      },
      "engines": {
        "node": ">=20.0.0"
      }
    },
    "node_modules/@azure/core-tracing": {
      "version": "1.3.1",
      "resolved": "https://registry.npmjs.org/@azure/core-tracing/-/core-tracing-1.3.1.tgz",
      "integrity": "sha512-9MWKevR7Hz8kNzzPLfX4EAtGM2b8mr50HPDBvio96bURP/9C+HjdH3sBlLSNNrvRAr5/k/svoH457gB5IKpmwQ==",
      "license": "MIT",
      "dependencies": {
        "tslib": "^2.6.2"
      },
      "engines": {
        "node": ">=20.0.0"
      }
    },
    "node_modules/@azure/core-util": {
      "version": "1.13.1",
      "resolved": "https://registry.npmjs.org/@azure/core-util/-/core-util-1.13.1.tgz",
      "integrity": "sha512-XPArKLzsvl0Hf0CaGyKHUyVgF7oDnhKoP85Xv6M4StF/1AhfORhZudHtOyf2s+FcbuQ9dPRAjB8J2KvRRMUK2A==",
      "license": "MIT",
      "dependencies": {
        "@azure/abort-controller": "^2.1.2",
        "@typespec/ts-http-runtime": "^0.3.0",
        "tslib": "^2.6.2"
      },
      "engines": {
        "node": ">=20.0.0"
      }
    },
    "node_modules/@azure/identity": {
      "version": "4.13.1",
      "resolved": "https://registry.npmjs.org/@azure/identity/-/identity-4.13.1.tgz",
      "integrity": "sha512-5C/2WD5Vb1lHnZS16dNQRPMjN6oV/Upba+C9nBIs15PmOi6A3ZGs4Lr2u60zw4S04gi+u3cEXiqTVP7M4Pz3kw==",
      "license": "MIT",
      "dependencies": {
        "@azure/abort-controller": "^2.0.0",
        "@azure/core-auth": "^1.9.0",
        "@azure/core-client": "^1.9.2",
        "@azure/core-rest-pipeline": "^1.17.0",
        "@azure/core-tracing": "^1.0.0",
        "@azure/core-util": "^1.11.0",
        "@azure/logger": "^1.0.0",
        "@azure/msal-browser": "^5.5.0",
        "@azure/msal-node": "^5.1.0",
        "open": "^10.1.0",
        "tslib": "^2.2.0"
      },
      "engines": {
        "node": ">=20.0.0"
      }
    },
    "node_modules/@azure/keyvault-common": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/@azure/keyvault-common/-/keyvault-common-2.1.0.tgz",
      "integrity": "sha512-aCDidWuKY06LWQ4x7/8TIXK6iRqTaRWRL3t7T+LC+j1b07HtoIsOxP/tU90G4jCSBn5TAyUTCtA4MS/y5Hudaw==",
      "license": "MIT",
      "dependencies": {
        "@azure-rest/core-client": "^2.3.3",
        "@azure/abort-controller": "^2.0.0",
        "@azure/core-auth": "^1.3.0",
        "@azure/core-rest-pipeline": "^1.8.0",
        "@azure/core-tracing": "^1.0.0",
        "@azure/core-util": "^1.10.0",
        "@azure/logger": "^1.1.4",
        "tslib": "^2.2.0"
      },
      "engines": {
        "node": ">=20.0.0"
      }
    },
    "node_modules/@azure/keyvault-keys": {
      "version": "4.10.2",
      "resolved": "https://registry.npmjs.org/@azure/keyvault-keys/-/keyvault-keys-4.10.2.tgz",
      "integrity": "sha512-VmUSLbXRAbSzDD8grXHGPaknYs0SKr3yuf6U+d4XMpX4XuVYskNqbTTwXce0zR1LyxfTZm9rWEBcvs3vdYwCmQ==",
      "license": "MIT",
      "dependencies": {
        "@azure-rest/core-client": "^2.3.3",
        "@azure/abort-controller": "^2.1.2",
        "@azure/core-auth": "^1.9.0",
        "@azure/core-lro": "^2.7.2",
        "@azure/core-paging": "^1.6.2",
        "@azure/core-rest-pipeline": "^1.19.0",
        "@azure/core-tracing": "^1.2.0",
        "@azure/core-util": "^1.11.0",
        "@azure/keyvault-common": "^2.1.0",
        "@azure/logger": "^1.1.4",
        "tslib": "^2.8.1"
      },
      "engines": {
        "node": ">=20.0.0"
      }
    },
    "node_modules/@azure/logger": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/@azure/logger/-/logger-1.3.0.tgz",
      "integrity": "sha512-fCqPIfOcLE+CGqGPd66c8bZpwAji98tZ4JI9i/mlTNTlsIWslCfpg48s/ypyLxZTump5sypjrKn2/kY7q8oAbA==",
      "license": "MIT",
      "dependencies": {
        "@typespec/ts-http-runtime": "^0.3.0",
        "tslib": "^2.6.2"
      },
      "engines": {
        "node": ">=20.0.0"
      }
    },
    "node_modules/@azure/msal-browser": {
      "version": "5.23.0",
      "resolved": "https://registry.npmjs.org/@azure/msal-browser/-/msal-browser-5.23.0.tgz",
      "integrity": "sha512-IRCwkRCK47hBXK+7bu67UZWY7HS0Jx1dZgi4C1HVbjlBum8Jy8fb2l87xFr6HxdQJWy951zRUHtwwDITHFAtaA==",
      "license": "MIT",
      "dependencies": {
        "@azure/msal-common": "16.14.1"
      },
      "engines": {
        "node": ">=0.8.0"
      }
    },
    "node_modules/@azure/msal-common": {
      "version": "16.14.1",
      "resolved": "https://registry.npmjs.org/@azure/msal-common/-/msal-common-16.14.1.tgz",
      "integrity": "sha512-Or6xhPNyi4zHW25158yxBoyxuCqNSPa5YBVqfF1J5Ks4MJWBo/USXdp05DQIPu1Zli00YZu6t0+h6KvHJealxQ==",
      "license": "MIT",
      "engines": {
        "node": ">=0.8.0"
      }
    },
    "node_modules/@azure/msal-node": {
      "version": "5.6.0",
      "resolved": "https://registry.npmjs.org/@azure/msal-node/-/msal-node-5.6.0.tgz",
      "integrity": "sha512-uFY9NxrWHw8PwZx7gAX6PDn+9vdfS05+levc/kwkx77IkjfaldnQbbcQzzDIZ5Hq5Zdr6/z92oAIoRWKp6MnOA==",
      "license": "MIT",
      "dependencies": {
        "@azure/msal-common": "16.13.0",
        "jsonwebtoken": "^9.0.0"
      },
      "engines": {
        "node": ">=20"
      }
    },
    "node_modules/@azure/msal-node/node_modules/@azure/msal-common": {
      "version": "16.13.0",
      "resolved": "https://registry.npmjs.org/@azure/msal-common/-/msal-common-16.13.0.tgz",
      "integrity": "sha512-rOAy0KUcyBbdwVJ+f3uPpthXatFLLZN+/KWAsTLzk1aB23Xl9DRmmXYwSvBFOZyXj4jUQQ5FKxxRkhAFW1fOow==",
      "license": "MIT",
      "engines": {
        "node": ">=0.8.0"
      }
    },
    "node_modules/@esbuild/aix-ppc64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/aix-ppc64/-/aix-ppc64-0.28.2.tgz",
      "integrity": "sha512-XExcO+dvLKvVtNTibSTBej1NCAbaGhWn9Ww1ZPx80qsahhPFe/8jgWP0IchNe0F3HwkU7n8ejhH8bjonqht8mQ==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "aix"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm/-/android-arm-0.28.2.tgz",
      "integrity": "sha512-kXXoiPVVGQcnIYGOeaovwOURpniDBpSq4A03qkQ+BMQqtGG6HYap3xne9C1O1yo4TR3qxlCX5IqqmX6fFo2Lqg==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm64/-/android-arm64-0.28.2.tgz",
      "integrity": "sha512-5YfKeeI8qWfBZIX+u2xZC3Zlb3Os/gLS2sbEKM+I4ZOcsWmHS2WLysCcQZDAFRslDUU5Oiq44gf6PYN1vGwG5A==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-x64/-/android-x64-0.28.2.tgz",
      "integrity": "sha512-O387ite7SzUyCcy3JQX4P4bLtEA7bLLkx+esve5JHnyYfNTxcVpXZo9jhdB0lTKN44gztELTdU7nS8Nr16Fs1Q==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.28.2.tgz",
      "integrity": "sha512-n4KqkOQrraxHJcgjM1RvwbigfQKIKJVpM7xp+KsxiyUSrRdIXnt73VhrPAx0fV44hgfmIVKjxMN9J1t5jySVkw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.28.2.tgz",
      "integrity": "sha512-uq6suIWYP37qzGddBKPw5QEQPi6HiLGsO7UmkpfyaYNQ3D+rN6w6WfwH+nuqcGXWvawGwxOEroO4YGnFh95azw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-arm64/-/freebsd-arm64-0.28.2.tgz",
      "integrity": "sha512-n+I0BTSRIoy+d6RPKnEVwql5UwBJolytvY4mAOIEJorKlqgPII8ix6slVVrfZ5Tnj7glIZvloylbB/EJPMWEXw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-x64/-/freebsd-x64-0.28.2.tgz",
      "integrity": "sha512-78XJTJkvPs0kz2w61301PJjXl4g7q3JqiYMZ/M/yVI73EHBrCRTgkhu9oqG7vPqq+a/yadEW8aD+agKlk5xrmg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm/-/linux-arm-0.28.2.tgz",
      "integrity": "sha512-XlDnu2q5yoqems+xay6wSAcg9DDD7K9RLKZEBOMZm3ckNpJBvOX20tSfby8KfrrhINDyv9V2YVZKY/SpoGJI8w==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm64/-/linux-arm64-0.28.2.tgz",
      "integrity": "sha512-pW4AC0P3it8c7do9MVM4p51FzHzdM/TZrerurgRcHJ2WTa1VQ1CIq18xncfpBJw4ojkiZZrKW2yIBWBP92j6Ug==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ia32": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ia32/-/linux-ia32-0.28.2.tgz",
      "integrity": "sha512-CYbnj78HsIeA+DhgUKgFCfvNsTHFhMMrinUrMZpDXJXKN8T3XViTZ/+wtHeVxEWY8ewSzTFN+nRmSwO2tZaLUQ==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-loong64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-loong64/-/linux-loong64-0.28.2.tgz",
      "integrity": "sha512-buwkd8nsph4R+ajRvw0qM5Hja/TXQow3ptzWO2EbG/cqcIkHloRrdlBtQlshyYGTNFvfkfJ5tpPLVkY4DtsPfQ==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-mips64el": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-mips64el/-/linux-mips64el-0.28.2.tgz",
      "integrity": "sha512-ZVykbDyk7519VwiNb9Lcj9m8XM6v5V9uKPvrEMkkEedVewf+0itkhahp4HDpgERXhwLRpWFypsGbG/J8s0QjJA==",
      "cpu": [
        "mips64el"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ppc64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ppc64/-/linux-ppc64-0.28.2.tgz",
      "integrity": "sha512-CAXl+Dtd9UUuJd8pKKdwh6MLm3MUMiqMPmhZ3tTSXPqfyQ3vDl6R5hZdZ/kYojK4ofXtdfSv1tFq8XzWx3heNQ==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-riscv64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-riscv64/-/linux-riscv64-0.28.2.tgz",
      "integrity": "sha512-GeXCej4IQtU1B+QlDV8W/RRvbzI3O/Stss+/bCXv4lZls5WGRtu2a+3JkA3i4qIUlMXpcHebWpF8AkJhATowuA==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-s390x": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-s390x/-/linux-s390x-0.28.2.tgz",
      "integrity": "sha512-3H1weTYZPxt/WOhByszQZybS9w5lKzUn1FDMsgEChbHWQwHYQQRfBxgCcZvPhjHfKyJjIievvMmEUawJrdY9Dg==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-x64/-/linux-x64-0.28.2.tgz",
      "integrity": "sha512-4xTZr1FUmSoQW4XIWmit3tzQrUTZM+N3P0XV8xROKYF50XfI7xeO90+1bZvNwxIufQ9hDQVRJH5YhgPVF8A/HQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-arm64/-/netbsd-arm64-0.28.2.tgz",
      "integrity": "sha512-sSATRjPeDBg3pdgHoQfoYBob11Kk1FGa9lui5RIHZCoCkJa9QKlvl3/vKz2usCmYYjs7ymJR/2Nnsqe+Hjt5nw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-x64/-/netbsd-x64-0.28.2.tgz",
      "integrity": "sha512-lqnzCV+mM0gIADaKihiCg6ifgfU2L3h5E33rNQBN1Y4MaVGnzryzmvvf7UHxprpQdE8hpqLolJ9Rl+SkIRDpyw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-arm64/-/openbsd-arm64-0.28.2.tgz",
      "integrity": "sha512-AL2qJILH7lNjrDmCQDvdxMfAUIv8KMNZOvrwAQ8i8//ntL9FflhOyMJ8OZSMBb8/AWXe3/5v5S20y3zCoZWKoQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-x64/-/openbsd-x64-0.28.2.tgz",
      "integrity": "sha512-QtiuPytchRyC4rwUKhexJdQKvDuZ6hWloi3igqPQNUJCS1/v9EiO3UTOXR6A3FoMo4fnAKbWJdqaIwhOzh8qEw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openharmony-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openharmony-arm64/-/openharmony-arm64-0.28.2.tgz",
      "integrity": "sha512-WkhYDmpTjLvGlScA1rwjRUmhl4k8oXR3cIbtqWmELgU/dFeHHlEllxDvdWcNJV9rbzCexB5vz8gtNewWLgCT7Q==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/sunos-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/sunos-x64/-/sunos-x64-0.28.2.tgz",
      "integrity": "sha512-GPMSkTOtMnv2U2F8gxe4Io6qmVs+YKyp832Etqqxr0hFngmXQ3rzwytelm3GIn7T4VviRUlf3sOgBOiTdvaf7g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "sunos"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-arm64/-/win32-arm64-0.28.2.tgz",
      "integrity": "sha512-PIhhEkE9uPBleRBrQEJpUn7MBnibZzbGzYWPmY3x+YoVg/95zbjB4CxPPOQ8l5tYYM4mMaCthF8/1DIfBQQyWQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-ia32": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-ia32/-/win32-ia32-0.28.2.tgz",
      "integrity": "sha512-YmJbfTlvU7Sdn9BB+4PRES4oB6pxgS37MAONj+hBr/cpXS1aBPKXxNnDbu+QCWPj0o9dgyxeq79g6c5P8KeuYA==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-x64/-/win32-x64-0.28.2.tgz",
      "integrity": "sha512-5ebpxr3nWMzrL/rnUI755Jkuee0bHL/Gq0WTF9lvcpv73wAp5eu8MfBUgWK9bhWvZjj7yX8etf/8tI8Ney695g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@isaacs/cliui": {
      "version": "9.0.0",
      "resolved": "https://registry.npmjs.org/@isaacs/cliui/-/cliui-9.0.0.tgz",
      "integrity": "sha512-AokJm4tuBHillT+FpMtxQ60n8ObyXBatq7jD2/JA9dxbDDokKQm8KMht5ibGzLVU9IJDIKK4TPKgMHEYMn3lMg==",
      "license": "BlueOak-1.0.0",
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@js-joda/core": {
      "version": "6.1.0",
      "resolved": "https://registry.npmjs.org/@js-joda/core/-/core-6.1.0.tgz",
      "integrity": "sha512-H8NTMRDJqad/leyv/D/A3kSOsf5/58Ydj4DJGDyaCWk9OU/zuZOLhndVffJgQjsgrn5GC0znHMHie7TfvPPG4w==",
      "dev": true,
      "license": "BSD-3-Clause"
    },
    "node_modules/@pinojs/redact": {
      "version": "0.4.0",
      "resolved": "https://registry.npmjs.org/@pinojs/redact/-/redact-0.4.0.tgz",
      "integrity": "sha512-k2ENnmBugE/rzQfEcdWHcCY+/FM3VLzH9cYEsbdsoqrvzAKRhUZeRNhAZvB8OitQJ1TBed3yqWtdjzS6wJKBwg==",
      "license": "MIT"
    },
    "node_modules/@scarf/scarf": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/@scarf/scarf/-/scarf-1.4.0.tgz",
      "integrity": "sha512-xxeapPiUXdZAE3che6f3xogoJPeZgig6omHEy1rIY5WVsB3H2BHNnZH+gHG6x91SCWyQCzWGsuL2Hh3ClO5/qQ==",
      "hasInstallScript": true,
      "license": "Apache-2.0"
    },
    "node_modules/@tediousjs/connection-string": {
      "version": "0.5.0",
      "resolved": "https://registry.npmjs.org/@tediousjs/connection-string/-/connection-string-0.5.0.tgz",
      "integrity": "sha512-7qSgZbincDDDFyRweCIEvZULFAw5iz/DeunhvuxpL31nfntX3P4Yd4HkHBRg9H8CdqY1e5WFN1PZIz/REL9MVQ==",
      "license": "MIT"
    },
    "node_modules/@types/bcrypt": {
      "version": "6.0.0",
      "resolved": "https://registry.npmjs.org/@types/bcrypt/-/bcrypt-6.0.0.tgz",
      "integrity": "sha512-/oJGukuH3D2+D+3H4JWLaAsJ/ji86dhRidzZ/Od7H/i8g+aCmvkeCc6Ni/f9uxGLSQVCRZkX2/lqEFG2BvWtlQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/body-parser": {
      "version": "1.19.6",
      "resolved": "https://registry.npmjs.org/@types/body-parser/-/body-parser-1.19.6.tgz",
      "integrity": "sha512-HLFeCYgz89uk22N5Qg3dvGvsv46B8GLvKKo1zKG4NybA8U2DiEO3w9lqGg29t/tfLRJpJ6iQxnVw4OnB7MoM9g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/connect": "*",
        "@types/node": "*"
      }
    },
    "node_modules/@types/connect": {
      "version": "3.4.38",
      "resolved": "https://registry.npmjs.org/@types/connect/-/connect-3.4.38.tgz",
      "integrity": "sha512-K6uROf1LD88uDQqJCktA4yzL1YYAK6NgfsI0v/mTgyPKWsX1CnJ0XPSDhViejru1GcRkLWb8RlzFYJRqGUbaug==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/cors": {
      "version": "2.8.19",
      "resolved": "https://registry.npmjs.org/@types/cors/-/cors-2.8.19.tgz",
      "integrity": "sha512-mFNylyeyqN93lfe/9CSxOGREz8cpzAhH+E93xJ4xWQf62V8sQ/24reV2nyzUWM6H6Xji+GGHpkbLe7pVoUEskg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/express": {
      "version": "4.17.25",
      "resolved": "https://registry.npmjs.org/@types/express/-/express-4.17.25.tgz",
      "integrity": "sha512-dVd04UKsfpINUnK0yBoYHDF3xu7xVH4BuDotC/xGuycx4CgbP48X/KF/586bcObxT0HENHXEU8Nqtu6NR+eKhw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/body-parser": "*",
        "@types/express-serve-static-core": "^4.17.33",
        "@types/qs": "*",
        "@types/serve-static": "^1"
      }
    },
    "node_modules/@types/express-serve-static-core": {
      "version": "4.19.9",
      "resolved": "https://registry.npmjs.org/@types/express-serve-static-core/-/express-serve-static-core-4.19.9.tgz",
      "integrity": "sha512-QP2ESEe/ImWY0HDwNAnK9PvEffUyhLTnWkk7KXzHfyeWAnlrDe1fN77bXl6ia8KT3wPlmA7t9/VPRpnf4Ex9sg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/node": "*",
        "@types/qs": "*",
        "@types/range-parser": "*",
        "@types/send": "*"
      }
    },
    "node_modules/@types/http-errors": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/@types/http-errors/-/http-errors-2.0.5.tgz",
      "integrity": "sha512-r8Tayk8HJnX0FztbZN7oVqGccWgw98T/0neJphO91KkmOzug1KkofZURD4UaD5uH8AqcFLfdPErnBod0u71/qg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/json-schema": {
      "version": "7.0.15",
      "resolved": "https://registry.npmjs.org/@types/json-schema/-/json-schema-7.0.15.tgz",
      "integrity": "sha512-5+fP8P8MFNC+AyZCDxrB2pkZFPGzqQWUzpSeuuVLvm8VMcorNYavBqoFcxK8bQz4Qsbn4oUEEem4wDLfcysGHA==",
      "license": "MIT"
    },
    "node_modules/@types/jsonwebtoken": {
      "version": "9.0.10",
      "resolved": "https://registry.npmjs.org/@types/jsonwebtoken/-/jsonwebtoken-9.0.10.tgz",
      "integrity": "sha512-asx5hIG9Qmf/1oStypjanR7iKTv0gXQ1Ov/jfrX6kS/EO0OFni8orbmGCn0672NHR3kXHwpAwR+B368ZGN/2rA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/ms": "*",
        "@types/node": "*"
      }
    },
    "node_modules/@types/mime": {
      "version": "1.3.5",
      "resolved": "https://registry.npmjs.org/@types/mime/-/mime-1.3.5.tgz",
      "integrity": "sha512-/pyBZWSLD2n0dcHE3hq8s8ZvcETHtEuF+3E7XVt0Ig2nvsVQXdghHVcEkIWjy9A0wKfTn97a/PSDYohKIlnP/w==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/ms": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/@types/ms/-/ms-2.1.0.tgz",
      "integrity": "sha512-GsCCIZDE/p3i96vtEqx+7dBUGXrc7zeSK3wwPHIaRThS+9OhWIXRqzs4d6k1SVU8g91DrNRWxWUGhp5KXQb2VA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/mssql": {
      "version": "9.1.11",
      "resolved": "https://registry.npmjs.org/@types/mssql/-/mssql-9.1.11.tgz",
      "integrity": "sha512-vcujgrDbDezCxNDO4KY6gjwduLYOKfrexpRUwhoysRvcXZ3+IgZ/PMYFDgh8c3cQIxZ6skAwYo+H6ibMrBWPjQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/node": "*",
        "tarn": "^3.0.1",
        "tedious": "*"
      }
    },
    "node_modules/@types/node": {
      "version": "24.19.0",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-24.19.0.tgz",
      "integrity": "sha512-zY+5tKxXdhGh1PYI0ac+7juvEu4OI6vWtVVoj5i2m42jxAY1U+zHGt6QCyOFwykdP62sM3MJ9stoYYUw5aCWew==",
      "license": "MIT",
      "dependencies": {
        "undici-types": ">=7.24.0 <7.24.7"
      }
    },
    "node_modules/@types/qs": {
      "version": "6.15.1",
      "resolved": "https://registry.npmjs.org/@types/qs/-/qs-6.15.1.tgz",
      "integrity": "sha512-GZHUBZR9hckSUhrxmp1nG6NwdpM9fCunJwyThLW1X3AyHgd9IlHb6VANpQQqDr2o/qQp6McZ3y/IA2rVzKzSbw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/range-parser": {
      "version": "1.2.7",
      "resolved": "https://registry.npmjs.org/@types/range-parser/-/range-parser-1.2.7.tgz",
      "integrity": "sha512-hKormJbkJqzQGhziax5PItDUTMAM9uE2XXQmM37dyd4hVM+5aVl7oVxMVUiVQn2oCQFN/LKCZdvSM0pFRqbSmQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/readable-stream": {
      "version": "4.0.24",
      "resolved": "https://registry.npmjs.org/@types/readable-stream/-/readable-stream-4.0.24.tgz",
      "integrity": "sha512-NRvUNC/JFGPJvqdAfEve8oginbM6V08u5NzLWpG8MwA2kTPOLnqk+wpwuPT+mp3aUsxyuT6m2gnrPuHYCruzEg==",
      "license": "MIT",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/send": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/@types/send/-/send-1.2.1.tgz",
      "integrity": "sha512-arsCikDvlU99zl1g69TcAB3mzZPpxgw0UQnaHeC1Nwb015xp8bknZv5rIfri9xTOcMuaVgvabfIRA7PSZVuZIQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/serve-static": {
      "version": "1.15.10",
      "resolved": "https://registry.npmjs.org/@types/serve-static/-/serve-static-1.15.10.tgz",
      "integrity": "sha512-tRs1dB+g8Itk72rlSI2ZrW6vZg0YrLI81iQSTkMmOqnqCaNr/8Ek4VwWcN5vZgCYWbg/JJSGBlUaYGAOP73qBw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/http-errors": "*",
        "@types/node": "*",
        "@types/send": "<1"
      }
    },
    "node_modules/@types/serve-static/node_modules/@types/send": {
      "version": "0.17.6",
      "resolved": "https://registry.npmjs.org/@types/send/-/send-0.17.6.tgz",
      "integrity": "sha512-Uqt8rPBE8SY0RK8JB1EzVOIZ32uqy8HwdxCnoCOsYrvnswqmFZ/k+9Ikidlk/ImhsdvBsloHbAlewb2IEBV/Og==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/mime": "^1",
        "@types/node": "*"
      }
    },
    "node_modules/@types/swagger-jsdoc": {
      "version": "6.0.4",
      "resolved": "https://registry.npmjs.org/@types/swagger-jsdoc/-/swagger-jsdoc-6.0.4.tgz",
      "integrity": "sha512-W+Xw5epcOZrF/AooUM/PccNMSAFOKWZA5dasNyMujTwsBkU74njSJBpvCCJhHAJ95XRMzQrrW844Btu0uoetwQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/swagger-ui-express": {
      "version": "4.1.8",
      "resolved": "https://registry.npmjs.org/@types/swagger-ui-express/-/swagger-ui-express-4.1.8.tgz",
      "integrity": "sha512-AhZV8/EIreHFmBV5wAs0gzJUNq9JbbSXgJLQubCC0jtIo6prnI9MIRRxnU4MZX9RB9yXxF1V4R7jtLl/Wcj31g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/express": "*",
        "@types/serve-static": "*"
      }
    },
    "node_modules/@typespec/ts-http-runtime": {
      "version": "0.3.6",
      "resolved": "https://registry.npmjs.org/@typespec/ts-http-runtime/-/ts-http-runtime-0.3.6.tgz",
      "integrity": "sha512-jIXhD0eWQ1JA6ln/5Dltyx22UxWNrw0hZmhy2rlv6m6KgF7kplHx3g0fzi09lNmTJQRR91OlemYp3xFnvDK9og==",
      "license": "MIT",
      "dependencies": {
        "http-proxy-agent": "^7.0.0",
        "https-proxy-agent": "^7.0.0",
        "tslib": "^2.6.2"
      },
      "engines": {
        "node": ">=20.0.0"
      }
    },
    "node_modules/abort-controller": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/abort-controller/-/abort-controller-3.0.0.tgz",
      "integrity": "sha512-h8lQ8tacZYnR3vNQTgibj+tODHI5/+l06Au2Pcriv/Gmet0eaj4TwWH41sO9wnHDiQsEj19q0drzdWdeAHtweg==",
      "license": "MIT",
      "dependencies": {
        "event-target-shim": "^5.0.0"
      },
      "engines": {
        "node": ">=6.5"
      }
    },
    "node_modules/accepts": {
      "version": "1.3.8",
      "resolved": "https://registry.npmjs.org/accepts/-/accepts-1.3.8.tgz",
      "integrity": "sha512-PYAthTa2m2VKxuvSD3DPC/Gy+U+sOA1LAuT8mkmRuvw+NACSaeXEQ+NHcVF7rONl6qcaxV3Uuemwawk+7+SJLw==",
      "license": "MIT",
      "dependencies": {
        "mime-types": "~2.1.34",
        "negotiator": "0.6.3"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/acorn": {
      "version": "7.4.1",
      "resolved": "https://registry.npmjs.org/acorn/-/acorn-7.4.1.tgz",
      "integrity": "sha512-nQyp0o1/mNdbTO1PO6kHkwSrmgZ0MT/jCCpNiwbUjGoRN4dlBhqJtoQuCnEOKzgTVwg0ZWiCoQy6SxMebQVh8A==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "acorn": "bin/acorn"
      },
      "engines": {
        "node": ">=0.4.0"
      }
    },
    "node_modules/agent-base": {
      "version": "7.1.4",
      "resolved": "https://registry.npmjs.org/agent-base/-/agent-base-7.1.4.tgz",
      "integrity": "sha512-MnA+YT8fwfJPgBx3m60MNqakm30XOkyIoH1y6huTQvC0PwZG7ki8NacLBcrPbNoo8vEZy7Jpuk7+jMO+CUovTQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 14"
      }
    },
    "node_modules/ajv": {
      "version": "8.20.0",
      "resolved": "https://registry.npmjs.org/ajv/-/ajv-8.20.0.tgz",
      "integrity": "sha512-Thbli+OlOj+iMPYFBVBfJ3OmCAnaSyNn4M1vz9T6Gka5Jt9ba/HIR56joy65tY6kx/FCF5VXNB819Y7/GUrBGA==",
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "fast-deep-equal": "^3.1.3",
        "fast-uri": "^3.0.1",
        "json-schema-traverse": "^1.0.0",
        "require-from-string": "^2.0.2"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/epoberezkin"
      }
    },
    "node_modules/ajv-draft-04": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/ajv-draft-04/-/ajv-draft-04-1.0.0.tgz",
      "integrity": "sha512-mv00Te6nmYbRp5DCwclxtt7yV/joXJPGS7nM+97GdxvuttCOfgI3K4U25zboyeX0O+myI8ERluxQe5wljMmVIw==",
      "license": "MIT",
      "peerDependencies": {
        "ajv": "^8.5.0"
      },
      "peerDependenciesMeta": {
        "ajv": {
          "optional": true
        }
      }
    },
    "node_modules/argparse": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/argparse/-/argparse-2.0.1.tgz",
      "integrity": "sha512-8+9WqebbFzpX9OR+Wa6O29asIogeRMzcGtAINdpMHHyAg10f05aSFVBbcEqGf/PXw1EjAZ+q2/bEBg3DvurK3Q==",
      "license": "Python-2.0"
    },
    "node_modules/array-flatten": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/array-flatten/-/array-flatten-1.1.1.tgz",
      "integrity": "sha512-PCVAQswWemu6UdxsDFFX/+gVeYqKAod3D3UVm91jHwynguOwAvYPhx8nNlM++NqRcK6CxxpUafjmhIdKiHibqg==",
      "license": "MIT"
    },
    "node_modules/asynckit": {
      "version": "0.4.0",
      "resolved": "https://registry.npmjs.org/asynckit/-/asynckit-0.4.0.tgz",
      "integrity": "sha512-Oei9OH4tRh0YqU3GxhX79dM/mwVgvbZJaSNaRk+bshkj0S5cfHcgYakreBjrHwatXKbz+IoIdYLxrKim2MjW0Q==",
      "license": "MIT"
    },
    "node_modules/atomic-sleep": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/atomic-sleep/-/atomic-sleep-1.0.0.tgz",
      "integrity": "sha512-kNOjDqAh7px0XWNI+4QbzoiR/nTkHAWNud2uvnJquD1/x5a7EQZMJT0AczqK0Qn67oY/TTQ1LbUKajZpp3I9tQ==",
      "license": "MIT",
      "engines": {
        "node": ">=8.0.0"
      }
    },
    "node_modules/axios": {
      "version": "1.20.0",
      "resolved": "https://registry.npmjs.org/axios/-/axios-1.20.0.tgz",
      "integrity": "sha512-r8aOh8j9cGKpgQAqpzrUHnSIc6a59Y3Xf/cv8sy1DrHCkZHzQGEuoq1tARk6qSyDdtQGSDgpb9kFlruzPvrgwg==",
      "license": "MIT",
      "dependencies": {
        "follow-redirects": "^1.16.0",
        "form-data": "^4.0.6",
        "https-proxy-agent": "^5.0.1",
        "proxy-from-env": "^2.1.0"
      }
    },
    "node_modules/axios/node_modules/agent-base": {
      "version": "6.0.2",
      "resolved": "https://registry.npmjs.org/agent-base/-/agent-base-6.0.2.tgz",
      "integrity": "sha512-RZNwNclF7+MS/8bDg70amg32dyeZGZxiDuQmZxKLAlQjr3jGyLx+4Kkk58UO7D2QdgFIQCovuSuZESne6RG6XQ==",
      "license": "MIT",
      "dependencies": {
        "debug": "4"
      },
      "engines": {
        "node": ">= 6.0.0"
      }
    },
    "node_modules/axios/node_modules/debug": {
      "version": "4.4.3",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
      "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/axios/node_modules/https-proxy-agent": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/https-proxy-agent/-/https-proxy-agent-5.0.1.tgz",
      "integrity": "sha512-dFcAjpTQFgoLMzC2VwU+C/CbS7uRL0lWmxDITmqm7C+7F0Odmj6s9l6alZc6AELXhrnggM2CeWSXHGOdX2YtwA==",
      "license": "MIT",
      "dependencies": {
        "agent-base": "6",
        "debug": "4"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/axios/node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "license": "MIT"
    },
    "node_modules/balanced-match": {
      "version": "4.0.4",
      "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-4.0.4.tgz",
      "integrity": "sha512-BLrgEcRTwX2o6gGxGOCNyMvGSp35YofuYzw9h1IMTRmKqttAZZVU67bdb9Pr2vUHA8+j3i2tJfjO6C6+4myGTA==",
      "license": "MIT",
      "engines": {
        "node": "18 || 20 || >=22"
      }
    },
    "node_modules/base64-js": {
      "version": "1.5.1",
      "resolved": "https://registry.npmjs.org/base64-js/-/base64-js-1.5.1.tgz",
      "integrity": "sha512-AKpaYlHn8t4SVbOHCy+b5+KKgvR4vrsD8vbvrbiQJps7fKDTkjkDry6ji0rUJjC0kzbNePLwzxq8iypo41qeWA==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT"
    },
    "node_modules/bcrypt": {
      "version": "6.0.0",
      "resolved": "https://registry.npmjs.org/bcrypt/-/bcrypt-6.0.0.tgz",
      "integrity": "sha512-cU8v/EGSrnH+HnxV2z0J7/blxH8gq7Xh2JFT6Aroax7UohdmiJJlxApMxtKfuI7z68NvvVcmR78k2LbT6efhRg==",
      "hasInstallScript": true,
      "license": "MIT",
      "dependencies": {
        "node-addon-api": "^8.3.0",
        "node-gyp-build": "^4.8.4"
      },
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/bl": {
      "version": "6.1.6",
      "resolved": "https://registry.npmjs.org/bl/-/bl-6.1.6.tgz",
      "integrity": "sha512-jLsPgN/YSvPUg9UX0Kd73CXpm2Psg9FxMeCSXnk3WBO3CMT10JMwijubhGfHCnFu6TPn1ei3b975dxv7K2pWVg==",
      "license": "MIT",
      "dependencies": {
        "@types/readable-stream": "^4.0.0",
        "buffer": "^6.0.3",
        "inherits": "^2.0.4",
        "readable-stream": "^4.2.0"
      }
    },
    "node_modules/body-parser": {
      "version": "1.20.8",
      "resolved": "https://registry.npmjs.org/body-parser/-/body-parser-1.20.8.tgz",
      "integrity": "sha512-JNcyFQ64OiijEkPzUBTCe+hyPXUD/3LEldGQ6iF5LR1w00mx9o7xtDWHXBY2iItjdCFGoilOLNQbH943ut7pHA==",
      "license": "MIT",
      "dependencies": {
        "bytes": "~3.1.2",
        "content-type": "~1.0.5",
        "debug": "2.6.9",
        "depd": "2.0.0",
        "destroy": "~1.2.0",
        "http-errors": "~2.0.1",
        "iconv-lite": "~0.4.24",
        "on-finished": "~2.4.1",
        "qs": "~6.16.0",
        "raw-body": "~2.5.3",
        "type-is": "~1.6.18",
        "unpipe": "~1.0.0"
      },
      "engines": {
        "node": ">= 0.8",
        "npm": "1.2.8000 || >= 1.4.16"
      }
    },
    "node_modules/brace-expansion": {
      "version": "5.0.12",
      "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-5.0.12.tgz",
      "integrity": "sha512-YovQ3rzhaLMIrDjNDMkNS01tea93qhEhG5xy8f6+R0l+dw3Ki+5sCoIoI942iuLZTHWogWktgwVDhU09iNEimQ==",
      "license": "MIT",
      "dependencies": {
        "balanced-match": "^4.0.2"
      },
      "engines": {
        "node": "20 || >=22"
      }
    },
    "node_modules/buffer": {
      "version": "6.0.3",
      "resolved": "https://registry.npmjs.org/buffer/-/buffer-6.0.3.tgz",
      "integrity": "sha512-FTiCpNxtwiZZHEZbcbTIcZjERVICn9yq/pDFkTl95/AxzD1naBctN7YO68riM/gLSDY7sdrMby8hofADYuuqOA==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "base64-js": "^1.3.1",
        "ieee754": "^1.2.1"
      }
    },
    "node_modules/buffer-equal-constant-time": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/buffer-equal-constant-time/-/buffer-equal-constant-time-1.0.1.tgz",
      "integrity": "sha512-zRpUiDwd/xk6ADqPMATG8vc9VPrkck7T07OIx0gnjmJAnHnTVXNQG3vfvWNuiZIkwu9KrKdA1iJKfsfTVxE6NA==",
      "license": "BSD-3-Clause"
    },
    "node_modules/bundle-name": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/bundle-name/-/bundle-name-4.1.1.tgz",
      "integrity": "sha512-DdH81/zPLVS11EUgWq3tEu/xn+EzljlMYooDNdzWEnFha3R3NBMpMV1UqYIpjYHV/SgpFKMIX1Oh7o06SjM/oA==",
      "license": "MIT",
      "dependencies": {
        "run-applescript": "^7.0.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/bytes": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/bytes/-/bytes-3.1.2.tgz",
      "integrity": "sha512-/Nf7TyzTx6S3yRJObOAV7956r8cr2+Oj8AC5dt8wSP3BQAoeX58NoHyCU8P8zGkNXStjTSi6fzO6F0pBdcYbEg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/call-bind-apply-helpers": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/call-bind-apply-helpers/-/call-bind-apply-helpers-1.0.2.tgz",
      "integrity": "sha512-Sp1ablJ0ivDkSzjcaJdxEunN5/XvksFJ2sMBFfq6x0ryhQV/2b/KwFe21cMpmHtPOSij8K99/wSfoEuTObmuMQ==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/call-bound": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/call-bound/-/call-bound-1.0.4.tgz",
      "integrity": "sha512-+ys997U96po4Kx/ABpBCqhA9EuxJaQWDQg7295H4hBphv3IZg0boBKuwYpt4YXp6MZ5AmZQnU/tyMTlRpaSejg==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "get-intrinsic": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/call-me-maybe": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/call-me-maybe/-/call-me-maybe-1.0.2.tgz",
      "integrity": "sha512-HpX65o1Hnr9HH25ojC1YGs7HCQLq0GCOibSaWER0eNpgJ/Z1MZv2mTc7+xh6WOPxbRVcmgbv4hGU+uSQ/2xFZQ==",
      "license": "MIT"
    },
    "node_modules/combined-stream": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/combined-stream/-/combined-stream-1.0.8.tgz",
      "integrity": "sha512-FQN4MRfuJeHf7cBbBMJFXhKSDq+2kAArBlmRBvcvFE5BB1HZKXtSFASDhdlz9zOYwxh8lDdnvmMOe/+5cdoEdg==",
      "license": "MIT",
      "dependencies": {
        "delayed-stream": "~1.0.0"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/commander": {
      "version": "11.1.0",
      "resolved": "https://registry.npmjs.org/commander/-/commander-11.1.0.tgz",
      "integrity": "sha512-yPVavfyCcRhmorC7rWlkHn15b4wDVgVmBA7kV4QVBsF7kv/9TKJAbAXVTxvTnwP8HHKjRCJDClKbciiYS7p0DQ==",
      "license": "MIT",
      "engines": {
        "node": ">=16"
      }
    },
    "node_modules/concat-map": {
      "version": "0.0.1",
      "resolved": "https://registry.npmjs.org/concat-map/-/concat-map-0.0.1.tgz",
      "integrity": "sha512-/Srv4dswyQNBfohGpz9o6Yb3Gz3SrUDqBH5rTuhGR7ahtlbYKnVxw2bCFMRljaA7EXHaXZ8wsHdodFvbkhKmqg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/content-disposition": {
      "version": "0.5.4",
      "resolved": "https://registry.npmjs.org/content-disposition/-/content-disposition-0.5.4.tgz",
      "integrity": "sha512-FveZTNuGw04cxlAiWbzi6zTAL/lhehaWbTtgluJh4/E95DqMwTmha3KZN1aAWA8cFIhHzMZUvLevkw5Rqk+tSQ==",
      "license": "MIT",
      "dependencies": {
        "safe-buffer": "5.2.1"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/content-type": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/content-type/-/content-type-1.0.5.tgz",
      "integrity": "sha512-nTjqfcBFEipKdXCv4YDQWCfmcLZKm81ldF0pAopTvyrFGVbcR6P/VAAd5G7N+0tTr8QqiU0tFadD6FK4NtJwOA==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/cookie": {
      "version": "0.7.2",
      "resolved": "https://registry.npmjs.org/cookie/-/cookie-0.7.2.tgz",
      "integrity": "sha512-yki5XnKuf750l50uGTllt6kKILY4nQ1eNIQatoXEByZ5dWgnKqbnqmTrBE5B4N7lrMJKQ2ytWMiTO2o0v6Ew/w==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/cookie-signature": {
      "version": "1.0.7",
      "resolved": "https://registry.npmjs.org/cookie-signature/-/cookie-signature-1.0.7.tgz",
      "integrity": "sha512-NXdYc3dLr47pBkpUCHtKSwIOQXLVn8dZEuywboCOJY/osA0wFSLlSawr3KN8qXJEyX66FcONTH8EIlVuK0yyFA==",
      "license": "MIT"
    },
    "node_modules/cors": {
      "version": "2.8.6",
      "resolved": "https://registry.npmjs.org/cors/-/cors-2.8.6.tgz",
      "integrity": "sha512-tJtZBBHA6vjIAaF6EnIaq6laBBP9aq/Y3ouVJjEfoHbRBcHBAHYcMh/w8LDrk2PvIMMq8gmopa5D4V8RmbrxGw==",
      "license": "MIT",
      "dependencies": {
        "object-assign": "^4",
        "vary": "^1"
      },
      "engines": {
        "node": ">= 0.10"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/cross-spawn": {
      "version": "7.0.6",
      "resolved": "https://registry.npmjs.org/cross-spawn/-/cross-spawn-7.0.6.tgz",
      "integrity": "sha512-uV2QOWP2nWzsy2aMp8aRibhi9dlzF5Hgh5SHaB9OiTGEyDTiJJyx0uy51QXdyWbtAHNua4XJzUKca3OzKUd3vA==",
      "license": "MIT",
      "dependencies": {
        "path-key": "^3.1.0",
        "shebang-command": "^2.0.0",
        "which": "^2.0.1"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/debug": {
      "version": "2.6.9",
      "resolved": "https://registry.npmjs.org/debug/-/debug-2.6.9.tgz",
      "integrity": "sha512-bC7ElrdJaJnPbAP+1EotYvqZsb3ecl5wi6Bfi6BJTUcNowp6cvspg0jXznRTKDjm/E7AdgFBVeAPVMNcKGsHMA==",
      "license": "MIT",
      "dependencies": {
        "ms": "2.0.0"
      }
    },
    "node_modules/deepmerge": {
      "version": "4.3.1",
      "resolved": "https://registry.npmjs.org/deepmerge/-/deepmerge-4.3.1.tgz",
      "integrity": "sha512-3sUqbMEc77XqpdNO7FRyRog+eW3ph+GYCbj+rK+uYyRMuwsVy0rMiVtPn+QJlKFvWP/1PYpapqYn0Me2knFn+A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/default-browser": {
      "version": "5.5.1",
      "resolved": "https://registry.npmjs.org/default-browser/-/default-browser-5.5.1.tgz",
      "integrity": "sha512-m1pAzaJgZ/gssEqlOhJkPJp8Xly7QyW6xcrkUa2KKcDeDSEMP7X8xipU3snUcfisTQx0w1AGae+9UtJSfVnXGw==",
      "license": "MIT",
      "dependencies": {
        "bundle-name": "^4.1.0",
        "default-browser-id": "^5.0.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/default-browser-id": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/default-browser-id/-/default-browser-id-5.0.1.tgz",
      "integrity": "sha512-x1VCxdX4t+8wVfd1so/9w+vQ4vx7lKd2Qp5tDRutErwmR85OgmfX7RlLRMWafRMY7hbEiXIbudNrjOAPa/hL8Q==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/define-lazy-prop": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/define-lazy-prop/-/define-lazy-prop-3.0.0.tgz",
      "integrity": "sha512-N+MeXYoqr3pOgn8xfyRPREN7gHakLYjhsHhWGT3fWAiL4IkAt0iDw14QiiEm2bE30c5XX5q0FtAA3CK5f9/BUg==",
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/delayed-stream": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/delayed-stream/-/delayed-stream-1.0.0.tgz",
      "integrity": "sha512-ZySD7Nf91aLB0RxL4KGrKHBXl7Eds1DAmEdcoVawXnLD7SDhpNgtuII2aAkg7a7QS41jxPSZ17p4VdGnMHk3MQ==",
      "license": "MIT",
      "engines": {
        "node": ">=0.4.0"
      }
    },
    "node_modules/depd": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/depd/-/depd-2.0.0.tgz",
      "integrity": "sha512-g7nH6P6dyDioJogAAGprGpCtVImJhpPk/roCzdb3fIh61/s/nPsfR6onyMwkCAR/OlC3yBC0lESvUoQEAssIrw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/destroy": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/destroy/-/destroy-1.2.0.tgz",
      "integrity": "sha512-2sJGJTaXIIaR1w4iJSNoN0hnMY7Gpc/n8D4qSCJw8QqFWXf7cuAgnEHxBpweaVcPevC2l3KpjYCx3NypQQgaJg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8",
        "npm": "1.2.8000 || >= 1.4.16"
      }
    },
    "node_modules/doctrine": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/doctrine/-/doctrine-3.0.0.tgz",
      "integrity": "sha512-yS+Q5i3hBf7GBkd4KG8a7eBNNWNGLTaEwwYWUijIYM7zrlYDM0BFXHjjPWlWZ1Rg7UaddZeIDmi9jF3HmqiQ2w==",
      "license": "Apache-2.0",
      "dependencies": {
        "esutils": "^2.0.2"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/dotenv": {
      "version": "17.4.2",
      "resolved": "https://registry.npmjs.org/dotenv/-/dotenv-17.4.2.tgz",
      "integrity": "sha512-nI4U3TottKAcAD9LLud4Cb7b2QztQMUEfHbvhTH09bqXTxnSie8WnjPALV/WMCrJZ6UV/qHJ6L03OqO3LcdYZw==",
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://dotenvx.com"
      }
    },
    "node_modules/dunder-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/dunder-proto/-/dunder-proto-1.0.1.tgz",
      "integrity": "sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.1",
        "es-errors": "^1.3.0",
        "gopd": "^1.2.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/ecdsa-sig-formatter": {
      "version": "1.0.11",
      "resolved": "https://registry.npmjs.org/ecdsa-sig-formatter/-/ecdsa-sig-formatter-1.0.11.tgz",
      "integrity": "sha512-nagl3RYrbNv6kQkeJIpt6NJZy8twLB/2vtz6yN9Z4vRKHN4/QZJIEbqohALSgwKdnksuY3k5Addp5lg8sVoVcQ==",
      "license": "Apache-2.0",
      "dependencies": {
        "safe-buffer": "^5.0.1"
      }
    },
    "node_modules/ee-first": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/ee-first/-/ee-first-1.1.1.tgz",
      "integrity": "sha512-WMwm9LhRUo+WUaRN+vRuETqG89IgZphVSNkdFgeb6sS/E4OrDIN7t48CAewSHXc6C8lefD8KKfr5vY61brQlow==",
      "license": "MIT"
    },
    "node_modules/encodeurl": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/encodeurl/-/encodeurl-2.0.0.tgz",
      "integrity": "sha512-Q0n9HRi4m6JuGIV1eFlmvJB7ZEVxu93IrMyiMsGC0lrMJMWzRgx6WGquyfQgZVb31vhGgXnfmPNNXmxnOkRBrg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/es-define-property": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/es-define-property/-/es-define-property-1.0.1.tgz",
      "integrity": "sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-errors": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/es-errors/-/es-errors-1.3.0.tgz",
      "integrity": "sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-object-atoms": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/es-object-atoms/-/es-object-atoms-1.1.2.tgz",
      "integrity": "sha512-HWcBoN6NileqtSydK2FqHbS/LoDd2pqrnQHLyJzBj4kOp/ky2MWMN694xOfkK8/SnUsW2DH7EfyVlydKCsm1Zw==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-set-tostringtag": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/es-set-tostringtag/-/es-set-tostringtag-2.1.0.tgz",
      "integrity": "sha512-j6vWzfrGVfyXxge+O0x5sh6cvxAog0a/4Rdd2K36zCMV5eJ+/+tOAngRO8cODMNWbVRdVlmGZQL2YS3yR8bIUA==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.6",
        "has-tostringtag": "^1.0.2",
        "hasown": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/esbuild": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/esbuild/-/esbuild-0.28.2.tgz",
      "integrity": "sha512-HKVLS8dvII+xoKW9kmqxbRKrnWEXfJJr/FZhhJmiqIB0e053QNYFqOBouTMO/k5sID4MvCiUCvv8b9M4h32wIA==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "bin": {
        "esbuild": "bin/esbuild"
      },
      "engines": {
        "node": ">=18"
      },
      "optionalDependencies": {
        "@esbuild/aix-ppc64": "0.28.2",
        "@esbuild/android-arm": "0.28.2",
        "@esbuild/android-arm64": "0.28.2",
        "@esbuild/android-x64": "0.28.2",
        "@esbuild/darwin-arm64": "0.28.2",
        "@esbuild/darwin-x64": "0.28.2",
        "@esbuild/freebsd-arm64": "0.28.2",
        "@esbuild/freebsd-x64": "0.28.2",
        "@esbuild/linux-arm": "0.28.2",
        "@esbuild/linux-arm64": "0.28.2",
        "@esbuild/linux-ia32": "0.28.2",
        "@esbuild/linux-loong64": "0.28.2",
        "@esbuild/linux-mips64el": "0.28.2",
        "@esbuild/linux-ppc64": "0.28.2",
        "@esbuild/linux-riscv64": "0.28.2",
        "@esbuild/linux-s390x": "0.28.2",
        "@esbuild/linux-x64": "0.28.2",
        "@esbuild/netbsd-arm64": "0.28.2",
        "@esbuild/netbsd-x64": "0.28.2",
        "@esbuild/openbsd-arm64": "0.28.2",
        "@esbuild/openbsd-x64": "0.28.2",
        "@esbuild/openharmony-arm64": "0.28.2",
        "@esbuild/sunos-x64": "0.28.2",
        "@esbuild/win32-arm64": "0.28.2",
        "@esbuild/win32-ia32": "0.28.2",
        "@esbuild/win32-x64": "0.28.2"
      }
    },
    "node_modules/escape-html": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/escape-html/-/escape-html-1.0.3.tgz",
      "integrity": "sha512-NiSupZ4OeuGwr68lGIeym/ksIZMJodUGOSCZ/FSnTxcrekbvqrgdUxlJOMpijaKZVjAJrWrGs/6Jy8OMuyj9ow==",
      "license": "MIT"
    },
    "node_modules/esutils": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/esutils/-/esutils-2.0.3.tgz",
      "integrity": "sha512-kVscqXk4OCp68SZ0dkgEKVi6/8ij300KBWTJq32P/dYeWTSwK41WyTxalN1eRmA5Z9UU/LX9D7FWSmV9SAYx6g==",
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/etag": {
      "version": "1.8.1",
      "resolved": "https://registry.npmjs.org/etag/-/etag-1.8.1.tgz",
      "integrity": "sha512-aIL5Fx7mawVa300al2BnEE4iNvo1qETxLrPI/o05L7z6go7fCw1J6EQmbK4FmJ2AS7kgVF/KEZWufBfdClMcPg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/event-target-shim": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/event-target-shim/-/event-target-shim-5.0.1.tgz",
      "integrity": "sha512-i/2XbnSz/uxRCU6+NdVJgKWDTM427+MqYbkQzD321DuCQJUqOuJKIA0IM2+W2xtYHdKOmZ4dR6fExsd4SXL+WQ==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/events": {
      "version": "3.3.0",
      "resolved": "https://registry.npmjs.org/events/-/events-3.3.0.tgz",
      "integrity": "sha512-mQw+2fkQbALzQ7V0MY0IqdnXNOeTtP4r0lN9z7AAawCXgqea7bDii20AYrIBrFd/Hx0M2Ocz6S111CaFkUcb0Q==",
      "license": "MIT",
      "engines": {
        "node": ">=0.8.x"
      }
    },
    "node_modules/express": {
      "version": "4.22.3",
      "resolved": "https://registry.npmjs.org/express/-/express-4.22.3.tgz",
      "integrity": "sha512-Bdcs4+3qlpVlx2NRn6fgX2Ue2/gGRaPeawebgclM0ERSCqDpA+owF1fdPwjJUTAJWMTuAaxjDf+hzb0/4eKvvw==",
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "accepts": "~1.3.8",
        "array-flatten": "1.1.1",
        "body-parser": "~1.20.5",
        "content-disposition": "~0.5.4",
        "content-type": "~1.0.4",
        "cookie": "~0.7.1",
        "cookie-signature": "~1.0.6",
        "debug": "2.6.9",
        "depd": "2.0.0",
        "encodeurl": "~2.0.0",
        "escape-html": "~1.0.3",
        "etag": "~1.8.1",
        "finalhandler": "~1.3.1",
        "fresh": "~0.5.2",
        "http-errors": "~2.0.0",
        "merge-descriptors": "1.0.3",
        "methods": "~1.1.2",
        "on-finished": "~2.4.1",
        "parseurl": "~1.3.3",
        "path-to-regexp": "~0.1.13",
        "proxy-addr": "~2.0.7",
        "qs": "~6.16.0",
        "range-parser": "~1.2.1",
        "safe-buffer": "5.2.1",
        "send": "~0.19.0",
        "serve-static": "~1.16.2",
        "setprototypeof": "1.2.0",
        "statuses": "~2.0.1",
        "type-is": "~1.6.18",
        "utils-merge": "1.0.1",
        "vary": "~1.1.2"
      },
      "engines": {
        "node": ">= 0.10.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/fast-deep-equal": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/fast-deep-equal/-/fast-deep-equal-3.1.3.tgz",
      "integrity": "sha512-f3qQ9oQy9j2AhBe/H9VC91wLmKBCCU/gDOnKNAYG5hswO7BLKj09Hc5HYNz9cGI++xlpDCIgDaitVs03ATR84Q==",
      "license": "MIT"
    },
    "node_modules/fast-uri": {
      "version": "3.1.8",
      "resolved": "https://registry.npmjs.org/fast-uri/-/fast-uri-3.1.8.tgz",
      "integrity": "sha512-GZMtZUTNRpOVIECoXwLNZS5xUGE+mVNbTB8h/7Rwh2TFWcBQiPzTgyZi05BF9UMZKkLJv8XBRJTlU7zg8+ZfMg==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/fastify"
        },
        {
          "type": "opencollective",
          "url": "https://opencollective.com/fastify"
        }
      ],
      "license": "BSD-3-Clause"
    },
    "node_modules/finalhandler": {
      "version": "1.3.2",
      "resolved": "https://registry.npmjs.org/finalhandler/-/finalhandler-1.3.2.tgz",
      "integrity": "sha512-aA4RyPcd3badbdABGDuTXCMTtOneUCAYH/gxoYRTZlIJdF0YPWuGqiAsIrhNnnqdXGswYk6dGujem4w80UJFhg==",
      "license": "MIT",
      "dependencies": {
        "debug": "2.6.9",
        "encodeurl": "~2.0.0",
        "escape-html": "~1.0.3",
        "on-finished": "~2.4.1",
        "parseurl": "~1.3.3",
        "statuses": "~2.0.2",
        "unpipe": "~1.0.0"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/follow-redirects": {
      "version": "1.16.1",
      "resolved": "https://registry.npmjs.org/follow-redirects/-/follow-redirects-1.16.1.tgz",
      "integrity": "sha512-FNvFGzoMLWmE6Yj9spb/zjd7yiNCHiAW9/Tg9CXrQ8wuu32HtlJOwWO11OJafl5FfY3DxTdQ0vj42zU1kvv5jg==",
      "funding": [
        {
          "type": "individual",
          "url": "https://github.com/sponsors/RubenVerborgh"
        }
      ],
      "license": "MIT",
      "engines": {
        "node": ">=4.0"
      },
      "peerDependenciesMeta": {
        "debug": {
          "optional": true
        }
      }
    },
    "node_modules/foreground-child": {
      "version": "3.3.1",
      "resolved": "https://registry.npmjs.org/foreground-child/-/foreground-child-3.3.1.tgz",
      "integrity": "sha512-gIXjKqtFuWEgzFRJA9WCQeSJLZDjgJUOMCMzxtvFq/37KojM1BFGufqsCy0r4qSQmYLsZYMeyRqzIWOMup03sw==",
      "license": "ISC",
      "dependencies": {
        "cross-spawn": "^7.0.6",
        "signal-exit": "^4.0.1"
      },
      "engines": {
        "node": ">=14"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/form-data": {
      "version": "4.0.6",
      "resolved": "https://registry.npmjs.org/form-data/-/form-data-4.0.6.tgz",
      "integrity": "sha512-vKatAh4SlVfgbv+YtmhiRjhEMJsYpsG1Y2rMQtR+SVSbytsSD1YGzDIcrAJmdFec88u/+VoGmxnl+80gL1tRCQ==",
      "license": "MIT",
      "dependencies": {
        "asynckit": "^0.4.0",
        "combined-stream": "^1.0.8",
        "es-set-tostringtag": "^2.1.0",
        "hasown": "^2.0.4",
        "mime-types": "^2.1.35"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/forwarded": {
      "version": "0.2.0",
      "resolved": "https://registry.npmjs.org/forwarded/-/forwarded-0.2.0.tgz",
      "integrity": "sha512-buRG0fpBtRHSTCOASe6hD258tEubFoRLb4ZNA6NxMVHNw2gOcwHo9wyablzMzOA5z9xA9L1KNjk/Nt6MT9aYow==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/fresh": {
      "version": "0.5.2",
      "resolved": "https://registry.npmjs.org/fresh/-/fresh-0.5.2.tgz",
      "integrity": "sha512-zJ2mQYM18rEFOudeV4GShTGIQ7RbzA7ozbU9I/XBpm7kqgMywgmylMwXHxZJmkVoYkna9d2pVXVXPdYTP9ej8Q==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/fs.realpath": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/fs.realpath/-/fs.realpath-1.0.0.tgz",
      "integrity": "sha512-OO0pH2lK6a0hZnAdau5ItzHPI6pUlvI7jMVnxUQRtw4owF2wk8lOSabtGDCTP4Ggrg2MbGnWO9X8K1t4+fGMDw==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/fsevents": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
      "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
      }
    },
    "node_modules/function-bind": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.2.tgz",
      "integrity": "sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-caller-file": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/get-caller-file/-/get-caller-file-2.0.5.tgz",
      "integrity": "sha512-DyFP3BM/3YHTQOCUL/w0OZHR0lpKeGrxotcHWcqNEdnltqFwXVfhEBQ94eIo34AfQpo0rGki4cyIiftY06h2Fg==",
      "license": "ISC",
      "engines": {
        "node": "6.* || 8.* || >= 10.*"
      }
    },
    "node_modules/get-intrinsic": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/get-intrinsic/-/get-intrinsic-1.3.0.tgz",
      "integrity": "sha512-9fSjSaos/fRIVIp+xSJlE6lfwhES7LNtKaCBIamHsjr2na1BiABJPo0mOjjz8GJDURarmCPGqaiVg5mfjb98CQ==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "es-define-property": "^1.0.1",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.1",
        "function-bind": "^1.1.2",
        "get-proto": "^1.0.1",
        "gopd": "^1.2.0",
        "has-symbols": "^1.1.0",
        "hasown": "^2.0.2",
        "math-intrinsics": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/get-proto/-/get-proto-1.0.1.tgz",
      "integrity": "sha512-sTSfBjoXBp89JvIKIefqw7U2CCebsc74kiY6awiGogKtoSGbgjYE/G/+l9sF3MWFPNc9IcoOC4ODfKHfxFmp0g==",
      "license": "MIT",
      "dependencies": {
        "dunder-proto": "^1.0.1",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/glob": {
      "version": "11.1.0",
      "resolved": "https://registry.npmjs.org/glob/-/glob-11.1.0.tgz",
      "integrity": "sha512-vuNwKSaKiqm7g0THUBu2x7ckSs3XJLXE+2ssL7/MfTGPLLcrJQ/4Uq1CjPTtO5cCIiRxqvN6Twy1qOwhL0Xjcw==",
      "deprecated": "Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
      "license": "BlueOak-1.0.0",
      "dependencies": {
        "foreground-child": "^3.3.1",
        "jackspeak": "^4.1.1",
        "minimatch": "^10.1.1",
        "minipass": "^7.1.2",
        "package-json-from-dist": "^1.0.0",
        "path-scurry": "^2.0.0"
      },
      "bin": {
        "glob": "dist/esm/bin.mjs"
      },
      "engines": {
        "node": "20 || >=22"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/gopd": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/gopd/-/gopd-1.2.0.tgz",
      "integrity": "sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-symbols": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/has-symbols/-/has-symbols-1.1.0.tgz",
      "integrity": "sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-tostringtag": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/has-tostringtag/-/has-tostringtag-1.0.2.tgz",
      "integrity": "sha512-NqADB8VjPFLM2V0VvHUewwwsw0ZWBaIdgo+ieHtK3hasLz4qeCRjYcqfB6AQrBggRKppKF8L52/VqdVsO47Dlw==",
      "license": "MIT",
      "dependencies": {
        "has-symbols": "^1.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/hasown": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/hasown/-/hasown-2.0.4.tgz",
      "integrity": "sha512-T2UbfbBEF32wiepXIsMlTW9+dDYC6wMh/t/vYA4tuOMKqWz/n3vr1NFSxQiyP+zk2mXsoMA/i/7qV6LKut1t1A==",
      "license": "MIT",
      "dependencies": {
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/helmet": {
      "version": "8.3.0",
      "resolved": "https://registry.npmjs.org/helmet/-/helmet-8.3.0.tgz",
      "integrity": "sha512-Qgpiaws3Sm30Av8Eah6sjMCZZwjlBu+E68rhpCWBshY1lb09HtLwj5GviX0OyQIn+ulUS0iX0AxN5n3tLZzz1w==",
      "license": "MIT",
      "engines": {
        "node": ">=18.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/EvanHahn"
      }
    },
    "node_modules/http-errors": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/http-errors/-/http-errors-2.0.1.tgz",
      "integrity": "sha512-4FbRdAX+bSdmo4AUFuS0WNiPz8NgFt+r8ThgNWmlrjQjt1Q7ZR9+zTlce2859x4KSXrwIsaeTqDoKQmtP8pLmQ==",
      "license": "MIT",
      "dependencies": {
        "depd": "~2.0.0",
        "inherits": "~2.0.4",
        "setprototypeof": "~1.2.0",
        "statuses": "~2.0.2",
        "toidentifier": "~1.0.1"
      },
      "engines": {
        "node": ">= 0.8"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/http-proxy-agent": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/http-proxy-agent/-/http-proxy-agent-7.0.2.tgz",
      "integrity": "sha512-T1gkAiYYDWYx3V5Bmyu7HcfcvL7mUrTWiM6yOfa3PIphViJ/gFPbvidQ+veqSOHci/PxBcDabeUNCzpOODJZig==",
      "license": "MIT",
      "dependencies": {
        "agent-base": "^7.1.0",
        "debug": "^4.3.4"
      },
      "engines": {
        "node": ">= 14"
      }
    },
    "node_modules/http-proxy-agent/node_modules/debug": {
      "version": "4.4.3",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
      "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/http-proxy-agent/node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "license": "MIT"
    },
    "node_modules/https-proxy-agent": {
      "version": "7.0.6",
      "resolved": "https://registry.npmjs.org/https-proxy-agent/-/https-proxy-agent-7.0.6.tgz",
      "integrity": "sha512-vK9P5/iUfdl95AI+JVyUuIcVtd4ofvtrOr3HNtM2yxC9bnMbEdp3x01OhQNnjb8IJYi38VlTE3mBXwcfvywuSw==",
      "license": "MIT",
      "dependencies": {
        "agent-base": "^7.1.2",
        "debug": "4"
      },
      "engines": {
        "node": ">= 14"
      }
    },
    "node_modules/https-proxy-agent/node_modules/debug": {
      "version": "4.4.3",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
      "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/https-proxy-agent/node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "license": "MIT"
    },
    "node_modules/iconv-lite": {
      "version": "0.4.24",
      "resolved": "https://registry.npmjs.org/iconv-lite/-/iconv-lite-0.4.24.tgz",
      "integrity": "sha512-v3MXnZAcvnywkTUEZomIActle7RXXeedOR31wwl7VlyoXO4Qi9arvSenNQWne1TcRwhCL1HwLI21bEqdpj8/rA==",
      "license": "MIT",
      "dependencies": {
        "safer-buffer": ">= 2.1.2 < 3"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/ieee754": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/ieee754/-/ieee754-1.2.1.tgz",
      "integrity": "sha512-dcyqhDvX1C46lXZcVqCpK+FtMRQVdIMN6/Df5js2zouUsqG7I6sFxitIC+7KYK29KdXOLHdu9zL4sFnoVQnqaA==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "BSD-3-Clause"
    },
    "node_modules/inflight": {
      "version": "1.0.6",
      "resolved": "https://registry.npmjs.org/inflight/-/inflight-1.0.6.tgz",
      "integrity": "sha512-k92I/b08q4wvFscXCLvqfsHCrjrF7yiXsQuIVvVE7N82W3+aqpzuUdBbfhWcy/FZR3/4IgflMgKLOsvPDrGCJA==",
      "deprecated": "This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "once": "^1.3.0",
        "wrappy": "1"
      }
    },
    "node_modules/inherits": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/inherits/-/inherits-2.0.4.tgz",
      "integrity": "sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ==",
      "license": "ISC"
    },
    "node_modules/ipaddr.js": {
      "version": "1.9.1",
      "resolved": "https://registry.npmjs.org/ipaddr.js/-/ipaddr.js-1.9.1.tgz",
      "integrity": "sha512-0KI/607xoxSToH7GjN1FfSbLoU0+btTicjsQSWQlh/hZykN8KpmMf7uYwPW3R+akZ6R/w18ZlXSHBYXiYUPO3g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/is-docker": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/is-docker/-/is-docker-3.0.0.tgz",
      "integrity": "sha512-eljcgEDlEns/7AXFosB5K/2nCM4P7FQPkGc/DWLy5rmFEWvZayGrik1d9/QIY5nJ4f9YsVvBkA6kJpHn9rISdQ==",
      "license": "MIT",
      "bin": {
        "is-docker": "cli.js"
      },
      "engines": {
        "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/is-inside-container": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/is-inside-container/-/is-inside-container-1.0.0.tgz",
      "integrity": "sha512-KIYLCCJghfHZxqjYBE7rEy0OBuTd5xCHS7tHVgvCLkx7StIoaxwNW3hCALgEUjFfeRk+MG/Qxmp/vtETEF3tRA==",
      "license": "MIT",
      "dependencies": {
        "is-docker": "^3.0.0"
      },
      "bin": {
        "is-inside-container": "cli.js"
      },
      "engines": {
        "node": ">=14.16"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/is-wsl": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/is-wsl/-/is-wsl-3.1.1.tgz",
      "integrity": "sha512-e6rvdUCiQCAuumZslxRJWR/Doq4VpPR82kqclvcS0efgt430SlGIk05vdCN58+VrzgtIcfNODjozVielycD4Sw==",
      "license": "MIT",
      "dependencies": {
        "is-inside-container": "^1.0.0"
      },
      "engines": {
        "node": ">=16"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/isexe": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/isexe/-/isexe-2.0.0.tgz",
      "integrity": "sha512-RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw==",
      "license": "ISC"
    },
    "node_modules/jackspeak": {
      "version": "4.2.3",
      "resolved": "https://registry.npmjs.org/jackspeak/-/jackspeak-4.2.3.tgz",
      "integrity": "sha512-ykkVRwrYvFm1nb2AJfKKYPr0emF6IiXDYUaFx4Zn9ZuIH7MrzEZ3sD5RlqGXNRpHtvUHJyOnCEFxOlNDtGo7wg==",
      "license": "BlueOak-1.0.0",
      "dependencies": {
        "@isaacs/cliui": "^9.0.0"
      },
      "engines": {
        "node": "20 || >=22"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/js-md4": {
      "version": "0.3.2",
      "resolved": "https://registry.npmjs.org/js-md4/-/js-md4-0.3.2.tgz",
      "integrity": "sha512-/GDnfQYsltsjRswQhN9fhv3EMw2sCpUdrdxyWDOUK7eyD++r3gRhzgiQgc/x4MAv2i1iuQ4lxO5mvqM3vj4bwA==",
      "license": "MIT"
    },
    "node_modules/js-yaml": {
      "version": "4.3.2",
      "resolved": "https://registry.npmjs.org/js-yaml/-/js-yaml-4.3.2.tgz",
      "integrity": "sha512-SFNOvSJ+Dgf/9An904Yx+CgSlIPCkIpao4qo51lpee25TIRejdH3rhR4EZMGoNx3/TP3O+wzWuiTFl4sqbltzA==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/puzrin"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/nodeca"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "argparse": "^2.0.1"
      },
      "bin": {
        "js-yaml": "bin/js-yaml.js"
      }
    },
    "node_modules/json-schema-traverse": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/json-schema-traverse/-/json-schema-traverse-1.0.0.tgz",
      "integrity": "sha512-NM8/P9n3XjXhIZn1lLhkFaACTOURQXjWhV4BA/RnOv8xvgqtqpAX9IO4mRQxSx1Rlo4tqzeqb0sOlruaOy3dug==",
      "license": "MIT"
    },
    "node_modules/json5": {
      "version": "2.2.3",
      "resolved": "https://registry.npmjs.org/json5/-/json5-2.2.3.tgz",
      "integrity": "sha512-XmOWe7eyHYH14cLdVPoyg+GOH3rYX++KpzrylJwSW98t3Nk+U8XOl8FWKOgwtzdb8lXGf6zYwDUzeHMWfxasyg==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "json5": "lib/cli.js"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/jsonwebtoken": {
      "version": "9.0.3",
      "resolved": "https://registry.npmjs.org/jsonwebtoken/-/jsonwebtoken-9.0.3.tgz",
      "integrity": "sha512-MT/xP0CrubFRNLNKvxJ2BYfy53Zkm++5bX9dtuPbqAeQpTVe0MQTFhao8+Cp//EmJp244xt6Drw/GVEGCUj40g==",
      "license": "MIT",
      "dependencies": {
        "jws": "^4.0.1",
        "lodash.includes": "^4.3.0",
        "lodash.isboolean": "^3.0.3",
        "lodash.isinteger": "^4.0.4",
        "lodash.isnumber": "^3.0.3",
        "lodash.isplainobject": "^4.0.6",
        "lodash.isstring": "^4.0.1",
        "lodash.once": "^4.0.0",
        "ms": "^2.1.1",
        "semver": "^7.5.4"
      },
      "engines": {
        "node": ">=12",
        "npm": ">=6"
      }
    },
    "node_modules/jsonwebtoken/node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "license": "MIT"
    },
    "node_modules/jwa": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/jwa/-/jwa-2.0.1.tgz",
      "integrity": "sha512-hRF04fqJIP8Abbkq5NKGN0Bbr3JxlQ+qhZufXVr0DvujKy93ZCbXZMHDL4EOtodSbCWxOqR8MS1tXA5hwqCXDg==",
      "license": "MIT",
      "dependencies": {
        "buffer-equal-constant-time": "^1.0.1",
        "ecdsa-sig-formatter": "1.0.11",
        "safe-buffer": "^5.0.1"
      }
    },
    "node_modules/jws": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/jws/-/jws-4.0.1.tgz",
      "integrity": "sha512-EKI/M/yqPncGUUh44xz0PxSidXFr/+r0pA70+gIYhjv+et7yxM+s29Y+VGDkovRofQem0fs7Uvf4+YmAdyRduA==",
      "license": "MIT",
      "dependencies": {
        "jwa": "^2.0.1",
        "safe-buffer": "^5.0.1"
      }
    },
    "node_modules/lodash.includes": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/lodash.includes/-/lodash.includes-4.3.0.tgz",
      "integrity": "sha512-W3Bx6mdkRTGtlJISOvVD/lbqjTlPPUDTMnlXZFnVwi9NKJ6tiAk6LVdlhZMm17VZisqhKcgzpO5Wz91PCt5b0w==",
      "license": "MIT"
    },
    "node_modules/lodash.isboolean": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/lodash.isboolean/-/lodash.isboolean-3.0.3.tgz",
      "integrity": "sha512-Bz5mupy2SVbPHURB98VAcw+aHh4vRV5IPNhILUCsOzRmsTmSQ17jIuqopAentWoehktxGd9e/hbIXq980/1QJg==",
      "license": "MIT"
    },
    "node_modules/lodash.isinteger": {
      "version": "4.0.4",
      "resolved": "https://registry.npmjs.org/lodash.isinteger/-/lodash.isinteger-4.0.4.tgz",
      "integrity": "sha512-DBwtEWN2caHQ9/imiNeEA5ys1JoRtRfY3d7V9wkqtbycnAmTvRRmbHKDV4a0EYc678/dia0jrte4tjYwVBaZUA==",
      "license": "MIT"
    },
    "node_modules/lodash.isnumber": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/lodash.isnumber/-/lodash.isnumber-3.0.3.tgz",
      "integrity": "sha512-QYqzpfwO3/CWf3XP+Z+tkQsfaLL/EnUlXWVkIk5FUPc4sBdTehEqZONuyRt2P67PXAk+NXmTBcc97zw9t1FQrw==",
      "license": "MIT"
    },
    "node_modules/lodash.isplainobject": {
      "version": "4.0.6",
      "resolved": "https://registry.npmjs.org/lodash.isplainobject/-/lodash.isplainobject-4.0.6.tgz",
      "integrity": "sha512-oSXzaWypCMHkPC3NvBEaPHf0KsA5mvPrOPgQWDsbg8n7orZ290M0BmC/jgRZ4vcJ6DTAhjrsSYgdsW/F+MFOBA==",
      "license": "MIT"
    },
    "node_modules/lodash.isstring": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/lodash.isstring/-/lodash.isstring-4.0.1.tgz",
      "integrity": "sha512-0wJxfxH1wgO3GrbuP+dTTk7op+6L41QCXbGINEmD+ny/G/eCqGzxyCsh7159S+mgDDcoarnBw6PC1PS5+wUGgw==",
      "license": "MIT"
    },
    "node_modules/lodash.mergewith": {
      "version": "4.6.2",
      "resolved": "https://registry.npmjs.org/lodash.mergewith/-/lodash.mergewith-4.6.2.tgz",
      "integrity": "sha512-GK3g5RPZWTRSeLSpgP8Xhra+pnjBC56q9FZYe1d5RN3TJ35dbkGy3YqBSMbyCrlbi+CM9Z3Jk5yTL7RCsqboyQ==",
      "license": "MIT"
    },
    "node_modules/lodash.once": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/lodash.once/-/lodash.once-4.1.1.tgz",
      "integrity": "sha512-Sb487aTOCr9drQVL8pIxOzVhafOjZN9UU54hiN8PU3uAiSV7lx1yYNpbNmex2PK6dSJoNTSJUUswT651yww3Mg==",
      "license": "MIT"
    },
    "node_modules/lru-cache": {
      "version": "11.5.3",
      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-11.5.3.tgz",
      "integrity": "sha512-U4N8FgzmWxc8k1VH8Kr6lQg18U7Fjvby6wXHVRX/ZZ7IwWbRMgrRbP0Wrb5q5NVinryp4SQampHKdvtecItxUg==",
      "license": "BlueOak-1.0.0",
      "engines": {
        "node": "20 || >=22"
      }
    },
    "node_modules/math-intrinsics": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/math-intrinsics/-/math-intrinsics-1.1.0.tgz",
      "integrity": "sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/media-typer": {
      "version": "0.3.0",
      "resolved": "https://registry.npmjs.org/media-typer/-/media-typer-0.3.0.tgz",
      "integrity": "sha512-dq+qelQ9akHpcOl/gUVRTxVIOkAJ1wR3QAvb4RsVjS8oVoFjDGTc679wJYmUmknUF5HwMLOgb5O+a3KxfWapPQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/merge-descriptors": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/merge-descriptors/-/merge-descriptors-1.0.3.tgz",
      "integrity": "sha512-gaNvAS7TZ897/rVaZ0nMtAyxNyi/pdbjbAwUpFQpN70GqnVfOiXpeUUMKRBmzXaSQ8DdTX4/0ms62r2K+hE6mQ==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/methods": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/methods/-/methods-1.1.2.tgz",
      "integrity": "sha512-iclAHeNqNm68zFtnZ0e+1L2yUIdvzNoauKU4WBA3VvH/vPFieF7qfRlwUZU+DA9P9bPXIS90ulxoUoCH23sV2w==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/mime": {
      "version": "1.6.0",
      "resolved": "https://registry.npmjs.org/mime/-/mime-1.6.0.tgz",
      "integrity": "sha512-x0Vn8spI+wuJ1O6S7gnbaQg8Pxh4NNHb7KSINmEWKiPE4RKOplvijn+NkmYmmRgP68mc70j2EbeTFRsrswaQeg==",
      "license": "MIT",
      "bin": {
        "mime": "cli.js"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/mime-db": {
      "version": "1.52.0",
      "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.52.0.tgz",
      "integrity": "sha512-sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/mime-types": {
      "version": "2.1.35",
      "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-2.1.35.tgz",
      "integrity": "sha512-ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw==",
      "license": "MIT",
      "dependencies": {
        "mime-db": "1.52.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/minimatch": {
      "version": "10.2.6",
      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-10.2.6.tgz",
      "integrity": "sha512-vpLQEs+VLCr1nU0BXS07maYoFwlDAH0gngQuuttxIwutDFEMHq2blX+8vpgxDdK3J1PwjCJiep77OitTZ4Ll1A==",
      "license": "BlueOak-1.0.0",
      "dependencies": {
        "brace-expansion": "^5.0.8"
      },
      "engines": {
        "node": "18 || 20 || >=22"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/minipass": {
      "version": "7.1.3",
      "resolved": "https://registry.npmjs.org/minipass/-/minipass-7.1.3.tgz",
      "integrity": "sha512-tEBHqDnIoM/1rXME1zgka9g6Q2lcoCkxHLuc7ODJ5BxbP5d4c2Z5cGgtXAku59200Cx7diuHTOYfSBD8n6mm8A==",
      "license": "BlueOak-1.0.0",
      "engines": {
        "node": ">=16 || 14 >=14.17"
      }
    },
    "node_modules/ms": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.0.0.tgz",
      "integrity": "sha512-Tpp60P6IUJDTuOq/5Z8cdskzJujfwqfOTkrwIwj7IRISpnkJnT6SyJ4PCPnGMoFjC9ddhal5KVIYtAt97ix05A==",
      "license": "MIT"
    },
    "node_modules/mssql": {
      "version": "11.0.2",
      "resolved": "https://registry.npmjs.org/mssql/-/mssql-11.0.2.tgz",
      "integrity": "sha512-x3Rdo3aR7/gQgpcVWA5EexMTd/BtHzdOkv94MTvV137UglFOZUJER6wRlq2Fl4R0F7JqBpDYyV4hX1kMTP0j7A==",
      "license": "MIT",
      "dependencies": {
        "@tediousjs/connection-string": "^0.5.0",
        "commander": "^11.0.0",
        "debug": "^4.3.3",
        "rfdc": "^1.3.0",
        "tarn": "^3.0.2",
        "tedious": "^18.2.1"
      },
      "bin": {
        "mssql": "bin/mssql"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/mssql/node_modules/@js-joda/core": {
      "version": "5.7.0",
      "resolved": "https://registry.npmjs.org/@js-joda/core/-/core-5.7.0.tgz",
      "integrity": "sha512-WBu4ULVVxySLLzK1Ppq+OdfP+adRS4ntmDQT915rzDJ++i95gc2jZkM5B6LWEAwN3lGXpfie3yPABozdD3K3Vg==",
      "license": "BSD-3-Clause"
    },
    "node_modules/mssql/node_modules/debug": {
      "version": "4.4.3",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
      "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/mssql/node_modules/iconv-lite": {
      "version": "0.6.3",
      "resolved": "https://registry.npmjs.org/iconv-lite/-/iconv-lite-0.6.3.tgz",
      "integrity": "sha512-4fCk79wshMdzMp2rH06qWrJE4iolqLhCUH+OiuIgU++RB0+94NlDL81atO7GX55uUKueo0txHNtvEyI6D7WdMw==",
      "license": "MIT",
      "dependencies": {
        "safer-buffer": ">= 2.1.2 < 3.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/mssql/node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "license": "MIT"
    },
    "node_modules/mssql/node_modules/tedious": {
      "version": "18.6.2",
      "resolved": "https://registry.npmjs.org/tedious/-/tedious-18.6.2.tgz",
      "integrity": "sha512-g7jC56o3MzLkE3lHkaFe2ZdOVFBahq5bsB60/M4NYUbocw/MCrS89IOEQUFr+ba6pb8ZHczZ/VqCyYeYq0xBAg==",
      "license": "MIT",
      "dependencies": {
        "@azure/core-auth": "^1.7.2",
        "@azure/identity": "^4.2.1",
        "@azure/keyvault-keys": "^4.4.0",
        "@js-joda/core": "^5.6.1",
        "@types/node": ">=18",
        "bl": "^6.0.11",
        "iconv-lite": "^0.6.3",
        "js-md4": "^0.3.2",
        "native-duplexpair": "^1.0.0",
        "sprintf-js": "^1.1.3"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/native-duplexpair": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/native-duplexpair/-/native-duplexpair-1.0.0.tgz",
      "integrity": "sha512-E7QQoM+3jvNtlmyfqRZ0/U75VFgCls+fSkbml2MpgWkWyz3ox8Y58gNhfuziuQYGNNQAbFZJQck55LHCnCK6CA==",
      "license": "MIT"
    },
    "node_modules/negotiator": {
      "version": "0.6.3",
      "resolved": "https://registry.npmjs.org/negotiator/-/negotiator-0.6.3.tgz",
      "integrity": "sha512-+EUsqGPLsM+j/zdChZjsnX51g4XrHFOIXwfnCVPGlQk/k5giakcKsuxCObBRu6DSm9opw/O6slWbJdghQM4bBg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/node-addon-api": {
      "version": "8.9.2",
      "resolved": "https://registry.npmjs.org/node-addon-api/-/node-addon-api-8.9.2.tgz",
      "integrity": "sha512-VijLXbi3UACN69I0JVXJsX4tjACjNoQDgv2gTF6sx2wWEi8tkSg2eX8p5gSIFi8z2+DL3oHmY6OyKce38SDolg==",
      "license": "MIT",
      "engines": {
        "node": "^18 || ^20 || >= 21"
      }
    },
    "node_modules/node-gyp-build": {
      "version": "4.8.4",
      "resolved": "https://registry.npmjs.org/node-gyp-build/-/node-gyp-build-4.8.4.tgz",
      "integrity": "sha512-LA4ZjwlnUblHVgq0oBF3Jl/6h/Nvs5fzBLwdEF4nuxnFdsfajde4WfxtJr3CaiH+F6ewcIB/q4jQ4UzPyid+CQ==",
      "license": "MIT",
      "bin": {
        "node-gyp-build": "bin.js",
        "node-gyp-build-optional": "optional.js",
        "node-gyp-build-test": "build-test.js"
      }
    },
    "node_modules/object-assign": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/object-assign/-/object-assign-4.1.1.tgz",
      "integrity": "sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/object-inspect": {
      "version": "1.13.4",
      "resolved": "https://registry.npmjs.org/object-inspect/-/object-inspect-1.13.4.tgz",
      "integrity": "sha512-W67iLl4J2EXEGTbfeHCffrjDfitvLANg0UlX3wFUUSTx92KXRFegMHUVgSqE+wvhAbi4WqjGg9czysTV2Epbew==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/on-exit-leak-free": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/on-exit-leak-free/-/on-exit-leak-free-2.1.2.tgz",
      "integrity": "sha512-0eJJY6hXLGf1udHwfNftBqH+g73EU4B504nZeKpz1sYRKafAghwxEJunB2O7rDZkL4PGfsMVnTXZ2EjibbqcsA==",
      "license": "MIT",
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/on-finished": {
      "version": "2.4.1",
      "resolved": "https://registry.npmjs.org/on-finished/-/on-finished-2.4.1.tgz",
      "integrity": "sha512-oVlzkg3ENAhCk2zdv7IJwd/QUD4z2RxRwpkcGY8psCVcCYZNq4wYnVWALHM+brtuJjePWiYF/ClmuDr8Ch5+kg==",
      "license": "MIT",
      "dependencies": {
        "ee-first": "1.1.1"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/once": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/once/-/once-1.4.0.tgz",
      "integrity": "sha512-lNaJgI+2Q5URQBkccEKHTQOPaXdUxnZZElQTZY0MFUAuaEqe1E+Nyvgdz/aIyNi6Z9MzO5dv1H8n58/GELp3+w==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "wrappy": "1"
      }
    },
    "node_modules/open": {
      "version": "10.2.0",
      "resolved": "https://registry.npmjs.org/open/-/open-10.2.0.tgz",
      "integrity": "sha512-YgBpdJHPyQ2UE5x+hlSXcnejzAvD0b22U2OuAP+8OnlJT+PjWPxtgmGqKKc+RgTM63U9gN0YzrYc71R2WT/hTA==",
      "license": "MIT",
      "dependencies": {
        "default-browser": "^5.2.1",
        "define-lazy-prop": "^3.0.0",
        "is-inside-container": "^1.0.0",
        "wsl-utils": "^0.1.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/openapi-types": {
      "version": "12.1.3",
      "resolved": "https://registry.npmjs.org/openapi-types/-/openapi-types-12.1.3.tgz",
      "integrity": "sha512-N4YtSYJqghVu4iek2ZUvcN/0aqH1kRDuNqzcycDxhOUpg7GdvLa2F3DgS6yBNhInhv2r/6I0Flkn7CqL8+nIcw==",
      "license": "MIT",
      "peer": true
    },
    "node_modules/package-json-from-dist": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/package-json-from-dist/-/package-json-from-dist-1.0.1.tgz",
      "integrity": "sha512-UEZIS3/by4OC8vL3P2dTXRETpebLI2NiI5vIrjaD/5UtrkFX/tNbwjTSRAGC/+7CAo2pIcBaRgWmcBBHcsaCIw==",
      "license": "BlueOak-1.0.0"
    },
    "node_modules/parseurl": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/parseurl/-/parseurl-1.3.3.tgz",
      "integrity": "sha512-CiyeOxFT/JZyN5m0z9PfXw4SCBJ6Sygz1Dpl0wqjlhDEGGBP1GnsUVEL0p63hoG1fcj3fHynXi9NYO4nWOL+qQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/path-is-absolute": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/path-is-absolute/-/path-is-absolute-1.0.1.tgz",
      "integrity": "sha512-AVbw3UJ2e9bq64vSaS9Am0fje1Pa8pbGqTTsmXfaIiMpnr5DlDhfJOuLj9Sf95ZPVDAUerDfEk88MPmPe7UCQg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/path-key": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/path-key/-/path-key-3.1.1.tgz",
      "integrity": "sha512-ojmeN0qd+y0jszEtoY48r0Peq5dwMEkIlCOu6Q5f41lfkswXuKtYrhgoTpLnyIcHm24Uhqx+5Tqm2InSwLhE6Q==",
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/path-scurry": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/path-scurry/-/path-scurry-2.0.2.tgz",
      "integrity": "sha512-3O/iVVsJAPsOnpwWIeD+d6z/7PmqApyQePUtCndjatj/9I5LylHvt5qluFaBT3I5h3r1ejfR056c+FCv+NnNXg==",
      "license": "BlueOak-1.0.0",
      "dependencies": {
        "lru-cache": "^11.0.0",
        "minipass": "^7.1.2"
      },
      "engines": {
        "node": "18 || 20 || >=22"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/path-to-regexp": {
      "version": "0.1.13",
      "resolved": "https://registry.npmjs.org/path-to-regexp/-/path-to-regexp-0.1.13.tgz",
      "integrity": "sha512-A/AGNMFN3c8bOlvV9RreMdrv7jsmF9XIfDeCd87+I8RNg6s78BhJxMu69NEMHBSJFxKidViTEdruRwEk/WIKqA==",
      "license": "MIT"
    },
    "node_modules/pino": {
      "version": "9.14.0",
      "resolved": "https://registry.npmjs.org/pino/-/pino-9.14.0.tgz",
      "integrity": "sha512-8OEwKp5juEvb/MjpIc4hjqfgCNysrS94RIOMXYvpYCdm/jglrKEiAYmiumbmGhCvs+IcInsphYDFwqrjr7398w==",
      "license": "MIT",
      "dependencies": {
        "@pinojs/redact": "^0.4.0",
        "atomic-sleep": "^1.0.0",
        "on-exit-leak-free": "^2.1.0",
        "pino-abstract-transport": "^2.0.0",
        "pino-std-serializers": "^7.0.0",
        "process-warning": "^5.0.0",
        "quick-format-unescaped": "^4.0.3",
        "real-require": "^0.2.0",
        "safe-stable-stringify": "^2.3.1",
        "sonic-boom": "^4.0.1",
        "thread-stream": "^3.0.0"
      },
      "bin": {
        "pino": "bin.js"
      }
    },
    "node_modules/pino-abstract-transport": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/pino-abstract-transport/-/pino-abstract-transport-2.0.0.tgz",
      "integrity": "sha512-F63x5tizV6WCh4R6RHyi2Ml+M70DNRXt/+HANowMflpgGFMAym/VKm6G7ZOQRjqN7XbGxK1Lg9t6ZrtzOaivMw==",
      "license": "MIT",
      "dependencies": {
        "split2": "^4.0.0"
      }
    },
    "node_modules/pino-http": {
      "version": "10.5.0",
      "resolved": "https://registry.npmjs.org/pino-http/-/pino-http-10.5.0.tgz",
      "integrity": "sha512-hD91XjgaKkSsdn8P7LaebrNzhGTdB086W3pyPihX0EzGPjq5uBJBXo4N5guqNaK6mUjg9aubMF7wDViYek9dRA==",
      "license": "MIT",
      "dependencies": {
        "get-caller-file": "^2.0.5",
        "pino": "^9.0.0",
        "pino-std-serializers": "^7.0.0",
        "process-warning": "^5.0.0"
      }
    },
    "node_modules/pino-std-serializers": {
      "version": "7.1.0",
      "resolved": "https://registry.npmjs.org/pino-std-serializers/-/pino-std-serializers-7.1.0.tgz",
      "integrity": "sha512-BndPH67/JxGExRgiX1dX0w1FvZck5Wa4aal9198SrRhZjH3GxKQUKIBnYJTdj2HDN3UQAS06HlfcSbQj2OHmaw==",
      "license": "MIT"
    },
    "node_modules/process": {
      "version": "0.11.10",
      "resolved": "https://registry.npmjs.org/process/-/process-0.11.10.tgz",
      "integrity": "sha512-cdGef/drWFoydD1JsMzuFf8100nZl+GT+yacc2bEced5f9Rjk4z+WtFUTBu9PhOi9j/jfmBPu0mMEY4wIdAF8A==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6.0"
      }
    },
    "node_modules/process-warning": {
      "version": "5.1.0",
      "resolved": "https://registry.npmjs.org/process-warning/-/process-warning-5.1.0.tgz",
      "integrity": "sha512-jQSaVHsPgtyw60e1rQ/A+/ArPEj/S8pS/vFnyGa/gYFXrKk/6RuDkoqVDQ5NI5MmS01698ltlAk0NoDBNLujRw==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/fastify"
        },
        {
          "type": "opencollective",
          "url": "https://opencollective.com/fastify"
        }
      ],
      "license": "MIT"
    },
    "node_modules/proxy-addr": {
      "version": "2.0.8",
      "resolved": "https://registry.npmjs.org/proxy-addr/-/proxy-addr-2.0.8.tgz",
      "integrity": "sha512-5nnx0yGyVUcY6t9RnWcARWtwT9F1D8O9rt08htPvnd49W1IgZtmLkhu9WfMzQj1cFxjHIO6connUNVW5k7AVyQ==",
      "license": "MIT",
      "dependencies": {
        "forwarded": "0.2.0",
        "ipaddr.js": "1.9.1"
      },
      "engines": {
        "node": ">= 0.10"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/proxy-from-env": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/proxy-from-env/-/proxy-from-env-2.1.0.tgz",
      "integrity": "sha512-cJ+oHTW1VAEa8cJslgmUZrc+sjRKgAKl3Zyse6+PV38hZe/V6Z14TbCuXcan9F9ghlz4QrFr2c92TNF82UkYHA==",
      "license": "MIT",
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/qs": {
      "version": "6.16.0",
      "resolved": "https://registry.npmjs.org/qs/-/qs-6.16.0.tgz",
      "integrity": "sha512-h6fhOIaRrID2CbEY2fqs+7t+UXZo+MLAnU5gRIq85uFtdiUPCdsApMlHhXogKVM4HM2DVbIjGNTTYH2OcmP1vA==",
      "license": "BSD-3-Clause",
      "dependencies": {
        "es-define-property": "^1.0.1",
        "side-channel": "^1.1.1"
      },
      "engines": {
        "node": ">=0.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/quick-format-unescaped": {
      "version": "4.0.4",
      "resolved": "https://registry.npmjs.org/quick-format-unescaped/-/quick-format-unescaped-4.0.4.tgz",
      "integrity": "sha512-tYC1Q1hgyRuHgloV/YXs2w15unPVh8qfu/qCTfhTYamaw7fyhumKa2yGpdSo87vY32rIclj+4fWYQXUMs9EHvg==",
      "license": "MIT"
    },
    "node_modules/range-parser": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/range-parser/-/range-parser-1.2.1.tgz",
      "integrity": "sha512-Hrgsx+orqoygnmhFbKaHE6c296J+HTAQXoxEF6gNupROmmGJRoyzfG3ccAveqCBrwr/2yxQ5BVd/GTl5agOwSg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/raw-body": {
      "version": "2.5.3",
      "resolved": "https://registry.npmjs.org/raw-body/-/raw-body-2.5.3.tgz",
      "integrity": "sha512-s4VSOf6yN0rvbRZGxs8Om5CWj6seneMwK3oDb4lWDH0UPhWcxwOWw5+qk24bxq87szX1ydrwylIOp2uG1ojUpA==",
      "license": "MIT",
      "dependencies": {
        "bytes": "~3.1.2",
        "http-errors": "~2.0.1",
        "iconv-lite": "~0.4.24",
        "unpipe": "~1.0.0"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/readable-stream": {
      "version": "4.7.0",
      "resolved": "https://registry.npmjs.org/readable-stream/-/readable-stream-4.7.0.tgz",
      "integrity": "sha512-oIGGmcpTLwPga8Bn6/Z75SVaH1z5dUut2ibSyAMVhmUggWpmDn2dapB0n7f8nwaSiRtepAsfJyfXIO5DCVAODg==",
      "license": "MIT",
      "dependencies": {
        "abort-controller": "^3.0.0",
        "buffer": "^6.0.3",
        "events": "^3.3.0",
        "process": "^0.11.10",
        "string_decoder": "^1.3.0"
      },
      "engines": {
        "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
      }
    },
    "node_modules/real-require": {
      "version": "0.2.0",
      "resolved": "https://registry.npmjs.org/real-require/-/real-require-0.2.0.tgz",
      "integrity": "sha512-57frrGM/OCTLqLOAh0mhVA9VBMHd+9U7Zb2THMGdBUoZVOtGbJzjxsYGDJ3A9AYYCP4hn6y1TVbaOfzWtm5GFg==",
      "license": "MIT",
      "engines": {
        "node": ">= 12.13.0"
      }
    },
    "node_modules/require-from-string": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/require-from-string/-/require-from-string-2.0.2.tgz",
      "integrity": "sha512-Xf0nWe6RseziFMu+Ap9biiUbmplq6S9/p+7w7YXP/JBHhrUDDUhwa+vANyubuqfZWTveU//DYVGsDG7RKL/vEw==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/rfdc": {
      "version": "1.4.1",
      "resolved": "https://registry.npmjs.org/rfdc/-/rfdc-1.4.1.tgz",
      "integrity": "sha512-q1b3N5QkRUWUl7iyylaaj3kOpIT0N2i9MqIEQXP73GVsN9cw3fdx8X63cEmWhJGi2PPCF23Ijp7ktmd39rawIA==",
      "license": "MIT"
    },
    "node_modules/run-applescript": {
      "version": "7.1.0",
      "resolved": "https://registry.npmjs.org/run-applescript/-/run-applescript-7.1.0.tgz",
      "integrity": "sha512-DPe5pVFaAsinSaV6QjQ6gdiedWDcRCbUuiQfQa2wmWV7+xC9bGulGI8+TdRmoFkAPaBXk8CrAbnlY2ISniJ47Q==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/safe-buffer": {
      "version": "5.2.1",
      "resolved": "https://registry.npmjs.org/safe-buffer/-/safe-buffer-5.2.1.tgz",
      "integrity": "sha512-rp3So07KcdmmKbGvgaNxQSJr7bGVSVk5S9Eq1F+ppbRo70+YeaDxkw5Dd8NPN+GD6bjnYm2VuPuCXmpuYvmCXQ==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT"
    },
    "node_modules/safe-stable-stringify": {
      "version": "2.5.0",
      "resolved": "https://registry.npmjs.org/safe-stable-stringify/-/safe-stable-stringify-2.5.0.tgz",
      "integrity": "sha512-b3rppTKm9T+PsVCBEOUR46GWI7fdOs00VKZ1+9c1EWDaDMvjQc6tUwuFyIprgGgTcWoVHSKrU8H31ZHA2e0RHA==",
      "license": "MIT",
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/safer-buffer": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/safer-buffer/-/safer-buffer-2.1.2.tgz",
      "integrity": "sha512-YZo3K82SD7Riyi0E1EQPojLz7kpepnSQI9IyPbHHg1XXXevb5dJI7tpyN2ADxGcQbHG7vcyRHk0cbwqcQriUtg==",
      "license": "MIT"
    },
    "node_modules/semver": {
      "version": "7.8.5",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.8.5.tgz",
      "integrity": "sha512-Y7/KDsb8LjooZpwaqGyulO6DQlksgCncchHGk+sZIY4SBvUocMBEFH5Ur1fI4dV+Jvl0w6cjvucaIi40puRioA==",
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/send": {
      "version": "0.19.2",
      "resolved": "https://registry.npmjs.org/send/-/send-0.19.2.tgz",
      "integrity": "sha512-VMbMxbDeehAxpOtWJXlcUS5E8iXh6QmN+BkRX1GARS3wRaXEEgzCcB10gTQazO42tpNIya8xIyNx8fll1OFPrg==",
      "license": "MIT",
      "dependencies": {
        "debug": "2.6.9",
        "depd": "2.0.0",
        "destroy": "1.2.0",
        "encodeurl": "~2.0.0",
        "escape-html": "~1.0.3",
        "etag": "~1.8.1",
        "fresh": "~0.5.2",
        "http-errors": "~2.0.1",
        "mime": "1.6.0",
        "ms": "2.1.3",
        "on-finished": "~2.4.1",
        "range-parser": "~1.2.1",
        "statuses": "~2.0.2"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/send/node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "license": "MIT"
    },
    "node_modules/serve-static": {
      "version": "1.16.3",
      "resolved": "https://registry.npmjs.org/serve-static/-/serve-static-1.16.3.tgz",
      "integrity": "sha512-x0RTqQel6g5SY7Lg6ZreMmsOzncHFU7nhnRWkKgWuMTu5NN0DR5oruckMqRvacAN9d5w6ARnRBXl9xhDCgfMeA==",
      "license": "MIT",
      "dependencies": {
        "encodeurl": "~2.0.0",
        "escape-html": "~1.0.3",
        "parseurl": "~1.3.3",
        "send": "~0.19.1"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/setprototypeof": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/setprototypeof/-/setprototypeof-1.2.0.tgz",
      "integrity": "sha512-E5LDX7Wrp85Kil5bhZv46j8jOeboKq5JMmYM3gVGdGH8xFpPWXUMsNrlODCrkoxMEeNi/XZIwuRvY4XNwYMJpw==",
      "license": "ISC"
    },
    "node_modules/shebang-command": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/shebang-command/-/shebang-command-2.0.0.tgz",
      "integrity": "sha512-kHxr2zZpYtdmrN1qDjrrX/Z1rR1kG8Dx+gkpK1G4eXmvXswmcE1hTWBWYUzlraYw1/yZp6YuDY77YtvbN0dmDA==",
      "license": "MIT",
      "dependencies": {
        "shebang-regex": "^3.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/shebang-regex": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/shebang-regex/-/shebang-regex-3.0.0.tgz",
      "integrity": "sha512-7++dFhtcx3353uBaq8DDR4NuxBetBzC7ZQOhmTQInHEd6bSrXdiEyzCvG07Z44UYdLShWUyXt5M/yhz8ekcb1A==",
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/side-channel": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/side-channel/-/side-channel-1.1.1.tgz",
      "integrity": "sha512-6x6dK6zJdpTzF4sQeNYxwtvBzf6Eg4GtlesS94HOvTudUeyK2WXAaIfmDgsyslYrRBeFIlsi54AYsFGUuhmvrQ==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "object-inspect": "^1.13.4",
        "side-channel-list": "^1.0.1",
        "side-channel-map": "^1.0.1",
        "side-channel-weakmap": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-list": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/side-channel-list/-/side-channel-list-1.0.1.tgz",
      "integrity": "sha512-mjn/0bi/oUURjc5Xl7IaWi/OJJJumuoJFQJfDDyO46+hBWsfaVM65TBHq2eoZBhzl9EchxOijpkbRC8SVBQU0w==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "object-inspect": "^1.13.4"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-map": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/side-channel-map/-/side-channel-map-1.0.1.tgz",
      "integrity": "sha512-VCjCNfgMsby3tTdo02nbjtM/ewra6jPHmpThenkTYh8pG9ucZ/1P8So4u4FGBek/BjpOVsDCMoLA/iuBKIFXRA==",
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.5",
        "object-inspect": "^1.13.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-weakmap": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/side-channel-weakmap/-/side-channel-weakmap-1.0.2.tgz",
      "integrity": "sha512-WPS/HvHQTYnHisLo9McqBHOJk2FkHO/tlpvldyrnem4aeQp4hai3gythswg6p01oSoTl58rcpiFAjF2br2Ak2A==",
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.5",
        "object-inspect": "^1.13.3",
        "side-channel-map": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/signal-exit": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/signal-exit/-/signal-exit-4.1.0.tgz",
      "integrity": "sha512-bzyZ1e88w9O1iNJbKnOlvYTrWPDl46O1bG0D3XInv+9tkPrxrN8jUUTiFlDkkmKWgn1M6CfIA13SuGqOa9Korw==",
      "license": "ISC",
      "engines": {
        "node": ">=14"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/sonic-boom": {
      "version": "4.2.1",
      "resolved": "https://registry.npmjs.org/sonic-boom/-/sonic-boom-4.2.1.tgz",
      "integrity": "sha512-w6AxtubXa2wTXAUsZMMWERrsIRAdrK0Sc+FUytWvYAhBJLyuI4llrMIC1DtlNSdI99EI86KZum2MMq3EAZlF9Q==",
      "license": "MIT",
      "dependencies": {
        "atomic-sleep": "^1.0.0"
      }
    },
    "node_modules/split2": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/split2/-/split2-4.2.0.tgz",
      "integrity": "sha512-UcjcJOWknrNkF6PLX83qcHM6KHgVKNkV62Y8a5uYDVv9ydGQVwAHMKqHdJje1VTWpljG0WYpCDhrCdAOYH4TWg==",
      "license": "ISC",
      "engines": {
        "node": ">= 10.x"
      }
    },
    "node_modules/sprintf-js": {
      "version": "1.1.3",
      "resolved": "https://registry.npmjs.org/sprintf-js/-/sprintf-js-1.1.3.tgz",
      "integrity": "sha512-Oo+0REFV59/rz3gfJNKQiBlwfHaSESl1pcGyABQsnnIfWOFt6JNj5gCog2U6MLZ//IGYD+nA8nI+mTShREReaA==",
      "license": "BSD-3-Clause"
    },
    "node_modules/statuses": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/statuses/-/statuses-2.0.2.tgz",
      "integrity": "sha512-DvEy55V3DB7uknRo+4iOGT5fP1slR8wQohVdknigZPMpMstaKJQWhwiYBACJE3Ul2pTnATihhBYnRhZQHGBiRw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/string_decoder": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/string_decoder/-/string_decoder-1.3.0.tgz",
      "integrity": "sha512-hkRX8U1WjJFd8LsDJ2yQ/wWWxaopEsABU1XfkM8A+j0+85JAGppt16cr1Whg6KIbb4okU6Mql6BOj+uup/wKeA==",
      "license": "MIT",
      "dependencies": {
        "safe-buffer": "~5.2.0"
      }
    },
    "node_modules/swagger-autogen": {
      "version": "2.23.7",
      "resolved": "https://registry.npmjs.org/swagger-autogen/-/swagger-autogen-2.23.7.tgz",
      "integrity": "sha512-vr7uRmuV0DCxWc0wokLJAwX3GwQFJ0jwN+AWk0hKxre2EZwusnkGSGdVFd82u7fQLgwSTnbWkxUL7HXuz5LTZQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "acorn": "^7.4.1",
        "deepmerge": "^4.2.2",
        "glob": "^7.1.7",
        "json5": "^2.2.3"
      }
    },
    "node_modules/swagger-autogen/node_modules/balanced-match": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-1.0.2.tgz",
      "integrity": "sha512-3oSeUO0TMV67hN1AmbXsK4yaqU7tjiHlbxRDZOpH0KW9+CeX4bRAaX0Anxt0tx2MrpRpWwQaPwIlISEJhYU5Pw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/swagger-autogen/node_modules/brace-expansion": {
      "version": "1.1.21",
      "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-1.1.21.tgz",
      "integrity": "sha512-9zeA+KLZNNzglF2TPKRQEDyx6Yby7daAkuy8MiPzpXPsYDWi/DRM8jmwUDxokQjYqBpv5DgPiwD4h4ZZSy1Ujw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "balanced-match": "^1.0.0",
        "concat-map": "0.0.1"
      }
    },
    "node_modules/swagger-autogen/node_modules/glob": {
      "version": "7.2.3",
      "resolved": "https://registry.npmjs.org/glob/-/glob-7.2.3.tgz",
      "integrity": "sha512-nFR0zLpU2YCaRxwoCJvL6UvCH2JFyFVIvwTLsIf21AuHlMskA1hhTdk+LlYJtOlYt9v6dvszD2BGRqBL+iQK9Q==",
      "deprecated": "Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "fs.realpath": "^1.0.0",
        "inflight": "^1.0.4",
        "inherits": "2",
        "minimatch": "^3.1.1",
        "once": "^1.3.0",
        "path-is-absolute": "^1.0.0"
      },
      "engines": {
        "node": "*"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/swagger-autogen/node_modules/minimatch": {
      "version": "3.1.5",
      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-3.1.5.tgz",
      "integrity": "sha512-VgjWUsnnT6n+NUk6eZq77zeFdpW2LWDzP6zFGrCbHXiYNul5Dzqk2HHQ5uFH2DNW5Xbp8+jVzaeNt94ssEEl4w==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "brace-expansion": "^1.1.7"
      },
      "engines": {
        "node": "*"
      }
    },
    "node_modules/swagger-jsdoc": {
      "version": "6.3.0",
      "resolved": "https://registry.npmjs.org/swagger-jsdoc/-/swagger-jsdoc-6.3.0.tgz",
      "integrity": "sha512-I+iQjVGV3t28pOkQUJv2MncthvOtkEactOn8R76SvSYhxgtIn7FoqfDHwQaN+GBnQdXQLrhgDXseKitmJcHMsA==",
      "license": "MIT",
      "dependencies": {
        "@apidevtools/swagger-parser": "^12.1.0",
        "commander": "6.2.0",
        "doctrine": "3.0.0",
        "glob": "11.1.0",
        "lodash.mergewith": "^4.6.2",
        "yaml": "2.0.0-1"
      },
      "bin": {
        "swagger-jsdoc": "bin/swagger-jsdoc.js"
      },
      "engines": {
        "node": ">=20.0.0"
      }
    },
    "node_modules/swagger-jsdoc/node_modules/commander": {
      "version": "6.2.0",
      "resolved": "https://registry.npmjs.org/commander/-/commander-6.2.0.tgz",
      "integrity": "sha512-zP4jEKbe8SHzKJYQmq8Y9gYjtO/POJLgIdKgV7B9qNmABVFVc+ctqSX6iXh4mCpJfRBOabiZ2YKPg8ciDw6C+Q==",
      "license": "MIT",
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/swagger-ui-dist": {
      "version": "5.33.1",
      "resolved": "https://registry.npmjs.org/swagger-ui-dist/-/swagger-ui-dist-5.33.1.tgz",
      "integrity": "sha512-H872wWkA53bFIsGgi7OWgmq+CRWw3nFQGdJWRqOB9wNwTm6e5ol34+qPDkV4AJlK+gglM2EsJiOOzsGsEGbluA==",
      "license": "Apache-2.0",
      "dependencies": {
        "@scarf/scarf": "=1.4.0"
      }
    },
    "node_modules/swagger-ui-express": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/swagger-ui-express/-/swagger-ui-express-5.0.1.tgz",
      "integrity": "sha512-SrNU3RiBGTLLmFU8GIJdOdanJTl4TOmT27tt3bWWHppqYmAZ6IDuEuBvMU6nZq0zLEe6b/1rACXCgLZqO6ZfrA==",
      "license": "MIT",
      "dependencies": {
        "swagger-ui-dist": ">=5.0.0"
      },
      "engines": {
        "node": ">= v0.10.32"
      },
      "peerDependencies": {
        "express": ">=4.0.0 || >=5.0.0-beta"
      }
    },
    "node_modules/tarn": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/tarn/-/tarn-3.1.2.tgz",
      "integrity": "sha512-3RTvqKZcK/17jnJ8rMKFXbyNogywTs1z0gVPPwFsJGX46rkmUHOdIaSQ/aVO1rS7nH+soiXiWk7rvUXxndm8Dg==",
      "license": "MIT",
      "engines": {
        "node": ">=8.0.0"
      }
    },
    "node_modules/tedious": {
      "version": "19.2.2",
      "resolved": "https://registry.npmjs.org/tedious/-/tedious-19.2.2.tgz",
      "integrity": "sha512-ITsLV/XXXAuJ/+pgnod4lcJH83WPK7+y2aqOwK/ERoC4zX73wfRIVc7BofuHCqDTqpd6j1RwTBtjKNuuOLEvfw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@azure/core-auth": "^1.7.2",
        "@azure/identity": "^4.2.1",
        "@azure/keyvault-keys": "^4.4.0",
        "@js-joda/core": "^6.0.1",
        "@types/node": ">=18",
        "bl": "^6.1.4",
        "iconv-lite": "^0.7.0",
        "js-md4": "^0.3.2",
        "native-duplexpair": "^1.0.0",
        "sprintf-js": "^1.1.3"
      },
      "engines": {
        "node": ">=18.17"
      }
    },
    "node_modules/tedious/node_modules/iconv-lite": {
      "version": "0.7.3",
      "resolved": "https://registry.npmjs.org/iconv-lite/-/iconv-lite-0.7.3.tgz",
      "integrity": "sha512-IKXpvIzjnC9XTAUbVBcMfGS0EPaIXtW6v+zr+RRp+hqULEpo0owZax6wyRwPOJbWbzjYspQwusTsfVr0ifh4uQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "safer-buffer": ">= 2.1.2 < 3.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/thread-stream": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/thread-stream/-/thread-stream-3.2.0.tgz",
      "integrity": "sha512-zLBvqpwr4Esa0kRjcrzGU6zL25lePWaCLMx0RQFrmteozIfeNdaMLpG5U7PeHzvlFkAWaRKA9/KVW4F60iB+qw==",
      "license": "MIT",
      "dependencies": {
        "real-require": "^0.2.0"
      }
    },
    "node_modules/toidentifier": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/toidentifier/-/toidentifier-1.0.1.tgz",
      "integrity": "sha512-o5sSPKEkg/DIQNmH43V0/uerLrpzVedkUh8tGNvaeXpfpuwjKenlSox/2O/BTlZUtEe+JG7s5YhEz608PlAHRA==",
      "license": "MIT",
      "engines": {
        "node": ">=0.6"
      }
    },
    "node_modules/tslib": {
      "version": "2.8.1",
      "resolved": "https://registry.npmjs.org/tslib/-/tslib-2.8.1.tgz",
      "integrity": "sha512-oJFu94HQb+KVduSUQL7wnpmqnfmLsOA/nAh6b6EH0wCEoK0/mPeXU6c3wKDV83MkOuHPRHtSXKKU99IBazS/2w==",
      "license": "0BSD"
    },
    "node_modules/tsx": {
      "version": "4.23.15",
      "resolved": "https://registry.npmjs.org/tsx/-/tsx-4.23.15.tgz",
      "integrity": "sha512-Yiex1Ovn8z2xPpOWckIiysV1SSyRMY9BkLF++q0yKiDxCqRhosKfMg3janKkiLBwZ5c/YryloKwGZcrEmtwxKw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "esbuild": "~0.28.0"
      },
      "bin": {
        "tsx": "dist/cli.mjs"
      },
      "engines": {
        "node": ">=18.0.0"
      },
      "optionalDependencies": {
        "fsevents": "~2.3.3"
      }
    },
    "node_modules/type-is": {
      "version": "1.6.18",
      "resolved": "https://registry.npmjs.org/type-is/-/type-is-1.6.18.tgz",
      "integrity": "sha512-TkRKr9sUTxEH8MdfuCSP7VizJyzRNMjj2J2do2Jr3Kym598JVdEksuzPQCnlFPW4ky9Q+iA+ma9BGm06XQBy8g==",
      "license": "MIT",
      "dependencies": {
        "media-typer": "0.3.0",
        "mime-types": "~2.1.24"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/typescript": {
      "version": "5.9.3",
      "resolved": "https://registry.npmjs.org/typescript/-/typescript-5.9.3.tgz",
      "integrity": "sha512-jl1vZzPDinLr9eUt3J/t7V6FgNEw9QjvBPdysz9KfQDD41fQrC2Y4vKQdiaUpFT4bXlb1RHhLpp8wtm6M5TgSw==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "tsc": "bin/tsc",
        "tsserver": "bin/tsserver"
      },
      "engines": {
        "node": ">=14.17"
      }
    },
    "node_modules/undici-types": {
      "version": "7.24.6",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-7.24.6.tgz",
      "integrity": "sha512-WRNW+sJgj5OBN4/0JpHFqtqzhpbnV0GuB+OozA9gCL7a993SmU+1JBZCzLNxYsbMfIeDL+lTsphD5jN5N+n0zg==",
      "license": "MIT"
    },
    "node_modules/unpipe": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/unpipe/-/unpipe-1.0.0.tgz",
      "integrity": "sha512-pjy2bYhSsufwWlKwPc+l3cN7+wuJlK6uz0YdJEOlQDbl6jo/YlPi4mb8agUkVC8BF7V8NuzeyPNqRksA3hztKQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/utils-merge": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/utils-merge/-/utils-merge-1.0.1.tgz",
      "integrity": "sha512-pMZTvIkT1d+TFGvDOqodOclx0QWkkgi6Tdoa8gC8ffGAAqz9pzPTZWAybbsHHoED/ztMtkv/VoYTYyShUn81hA==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4.0"
      }
    },
    "node_modules/vary": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/vary/-/vary-1.1.2.tgz",
      "integrity": "sha512-BNGbWLfd0eUPabhkXUVm0j8uuvREyTh5ovRa/dyow/BqAbZJyC+5fU+IzQOzmAKzYqYRAISoRhdQr3eIZ/PXqg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/which": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/which/-/which-2.0.2.tgz",
      "integrity": "sha512-BLI3Tl1TW3Pvl70l3yq3Y64i+awpwXqsGBYWkkqMtnbXgrMD+yj7rhW0kuEDxzJaYXGjEW5ogapKNMEKNMjibA==",
      "license": "ISC",
      "dependencies": {
        "isexe": "^2.0.0"
      },
      "bin": {
        "node-which": "bin/node-which"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/wrappy": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/wrappy/-/wrappy-1.0.2.tgz",
      "integrity": "sha512-l4Sp/DRseor9wL6EvV2+TuQn63dMkPjZ/sp9XkghTEbV9KlPS1xUsZ3u7/IQO4wxtcFB4bgpQPRcR3QCvezPcQ==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/wsl-utils": {
      "version": "0.1.0",
      "resolved": "https://registry.npmjs.org/wsl-utils/-/wsl-utils-0.1.0.tgz",
      "integrity": "sha512-h3Fbisa2nKGPxCpm89Hk33lBLsnaGBvctQopaBSOW/uIs6FTe1ATyAnKFJrzVs9vpGdsTe73WF3V4lIsk4Gacw==",
      "license": "MIT",
      "dependencies": {
        "is-wsl": "^3.1.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/yaml": {
      "version": "2.0.0-1",
      "resolved": "https://registry.npmjs.org/yaml/-/yaml-2.0.0-1.tgz",
      "integrity": "sha512-W7h5dEhywMKenDJh2iX/LABkbFnBxasD27oyXWDS/feDsxiw0dD5ncXdYXgkvAsXIY2MpW/ZKkr9IU30DBdMNQ==",
      "license": "ISC",
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/zod": {
      "version": "3.25.76",
      "resolved": "https://registry.npmjs.org/zod/-/zod-3.25.76.tgz",
      "integrity": "sha512-gzUt/qt81nXsFGKIFcC3YnfEAx5NkunCfnDlvuBSSFS02bcXu4Lmea0AFIUwbLWxWPx3d9p8S5QoaujKcNQxcQ==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/colinhacks"
      }
    }
  }
}

```

# package.json

| Property | Value |
|----------|-------|
| Path | `package.json` |
| Size | 1,068 bytes |
| Extension | `.json` |
| Modified | 2026-10-04 17:52:21.772061 |

```json
{
  "name": "coffeeshop-dbms-backend",
  "version": "1.0.0",
  "description": "Coffee Shop Management API with Raw SQL Server (DBMS330284)",
  "main": "dist/server.js",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "axios": "^1.20.0",
    "bcrypt": "^6.0.0",
    "cors": "^2.8.5",
    "dotenv": "^17.2.1",
    "express": "^4.21.2",
    "helmet": "^8.1.0",
    "jsonwebtoken": "^9.0.2",
    "mssql": "^11.0.1",
    "pino": "^9.6.0",
    "pino-http": "^10.4.0",
    "swagger-jsdoc": "^6.3.0",
    "swagger-ui-express": "^5.0.1",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/bcrypt": "^6.0.0",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.8",
    "@types/mssql": "^9.0.6",
    "@types/node": "^24.3.0",
    "@types/swagger-jsdoc": "^6.0.4",
    "@types/swagger-ui-express": "^4.1.8",
    "swagger-autogen": "^2.23.7",
    "tsx": "^4.19.3",
    "typescript": "^5.9.2"
  }
}

```

# src\app.ts

| Property | Value |
|----------|-------|
| Path | `src\app.ts` |
| Size | 2,084 bytes |
| Extension | `.ts` |
| Modified | 2026-10-04 17:52:21.775769 |

```typescript
// server/src/app.ts
import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import swaggerUi from "swagger-ui-express"; // <-- Thêm import
import { swaggerSpec } from "./config/swagger.config"; // <-- Thêm import
import { errorFilter } from "./middlewares/error.filter";
import swaggerDocument from './config/swagger.json';

// Import router của 6 phân hệ
import { posRouter } from "./modules/pos-order/pos.routes";
import { menuRouter } from "./modules/menu-catalog/menu.routes";
import { inventoryRouter } from "./modules/inventory-bom/inventory.routes";
import { kdsRouter } from "./modules/kds/kds.routes";
import { customerLoyaltyRouter } from "./modules/customer-loyalty/customer-loyalty.routes";
import { reportRouter } from "./modules/report/report.routes";
import { authRouter } from "./modules/auth/auth.routes";

export const createApp = (): Express => {
  const app = express();

  // 1. Global Middlewares
  app.use(helmet({ contentSecurityPolicy: false })); // Tắt CSP của helmet để giao diện Swagger UI không bị chặn css/js
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(pinoHttp({ autoLogging: false }));

  // 2. Health check
  app.get("/api/health", (_, res) => {
    res.status(200).json({ status: "healthy", timestamp: new Date() });
  });

  // 3. Swagger Documentation UI
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      customSiteTitle: "Coffee Management API Docs",
    }),
  );

  // 4. Đăng ký các phân hệ (Prefix API v1)
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/pos", posRouter);
  app.use("/api/v1/menu", menuRouter);
  app.use("/api/v1/inventory", inventoryRouter);
  app.use("/api/v1/kds", kdsRouter);
  app.use("/api/v1/loyalty", customerLoyaltyRouter);
  app.use("/api/v1/reports", reportRouter);

  // 5. Global Error Filter
  app.use(errorFilter);

  return app;
};

```

# src\common\constants\index.ts

| Property | Value |
|----------|-------|
| Path | `src\common\constants\index.ts` |
| Size | 0 bytes |
| Extension | `.ts` |
| Modified | 2026-09-23 23:06:23.885847 |

```typescript

```

# src\common\errors\index.ts

| Property | Value |
|----------|-------|
| Path | `src\common\errors\index.ts` |
| Size | 0 bytes |
| Extension | `.ts` |
| Modified | 2026-09-23 23:06:23.881851 |

```typescript

```

# src\common\helpers\index.ts

| Property | Value |
|----------|-------|
| Path | `src\common\helpers\index.ts` |
| Size | 0 bytes |
| Extension | `.ts` |
| Modified | 2026-09-23 23:06:24.026300 |

```typescript

```

# src\config\database.ts

| Property | Value |
|----------|-------|
| Path | `src\config\database.ts` |
| Size | 1,212 bytes |
| Extension | `.ts` |
| Modified | 2026-09-23 23:11:32.583666 |

```typescript
import sql from 'mssql'
import { envConfig } from './env.config'

const sqlConfig: sql.config = {
  user: envConfig.DB_USER,
  password: envConfig.DB_PASSWORD,
  database: envConfig.DB_NAME,
  server: envConfig.DB_SERVER,
  port: envConfig.DB_PORT,
  pool: {
    max: 15,
    min: 2,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false, // Để false khi chạy SQL Server cục bộ không cài chứng chỉ SSL
    trustServerCertificate: true, // Tránh lỗi self-signed cert
  },
}

let pool: sql.ConnectionPool | null = null

export const getPool = async (): Promise<sql.ConnectionPool> => {
  if (pool && pool.connected) {
    return pool
  }
  try {
    pool = await new sql.ConnectionPool(sqlConfig).connect()
    console.log(`✅ Kết nối thành công tới Database [${envConfig.DB_NAME}] trên SQL Server!`)
    return pool
  } catch (error) {
    console.error('❌ Lỗi khi kết nối tới Microsoft SQL Server:', error)
    throw error
  }
}

export const closePool = async (): Promise<void> => {
  if (pool) {
    await pool.close()
    console.log('🔌 Đã ngắt kết nối SQL Server Connection Pool.')
  }
}

export { sql }
```

# src\config\env.config.ts

| Property | Value |
|----------|-------|
| Path | `src\config\env.config.ts` |
| Size | 944 bytes |
| Extension | `.ts` |
| Modified | 2026-10-01 00:07:18.605918 |

```typescript
import dotenv from 'dotenv'
import { z } from 'zod'
import type { StringValue } from 'ms'

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),

  DB_USER: z.string().min(1, 'Chưa cấu hình DB_USER'),
  DB_PASSWORD: z.string().min(1, 'Chưa cấu hình DB_PASSWORD'),
  DB_SERVER: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(1433),
  DB_NAME: z.string().min(1, 'Chưa cấu hình DB_NAME'),

  JWT_SECRET: z.string().min(1, 'Chưa cấu hình JWT_SECRET'),
  JWT_EXPIRES_IN: z.custom<StringValue>().default('1d'),
})

const parseResult = envSchema.safeParse(process.env)

if (!parseResult.success) {
  console.error('❌ Lỗi cấu hình file .env:')
  console.error(parseResult.error.flatten().fieldErrors)
  process.exit(1)
}

export const envConfig = parseResult.data
```

# src\config\swagger.config.ts

| Property | Value |
|----------|-------|
| Path | `src\config\swagger.config.ts` |
| Size | 1,202 bytes |
| Extension | `.ts` |
| Modified | 2026-10-04 17:52:21.778130 |

```typescript
// server/src/config/swagger.config.ts
import swaggerJSDoc from 'swagger-jsdoc';
import { envConfig } from './env.config';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Coffee Management System API',
      version: '1.0.0',
      description: 'Tài liệu API cho Hệ thống Quản lý Chuỗi Cà phê (Coffee Shop DBMS Project)',
      contact: {
        name: 'Đội ngũ phát triển',
      },
    },
    servers: [
      {
        url: `http://localhost:${envConfig.PORT}/api/v1`,
        description: 'Local Development Server (v1)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Nhập access token nhận được sau khi đăng nhập (không cần gõ chữ Bearer)',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Quét toàn bộ file routes để đọc ghi chú Swagger JSDoc
  apis: ['./src/modules/**/*.routes.ts', './src/app.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
```

# src\config\swagger.json

| Property | Value |
|----------|-------|
| Path | `src\config\swagger.json` |
| Size | 57,455 bytes |
| Extension | `.json` |
| Modified | 2026-10-04 17:52:21.780441 |

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "Coffee Management System API",
    "version": "1.0.0",
    "description": "Hệ thống Quản lý Chuỗi Cà phê - Project DBMS (Microsoft SQL Server + Express TypeScript)"
  },
  "servers": [
    {
      "url": "http://localhost:5000",
      "description": "Local Development Server"
    }
  ],
  "components": {
    "securitySchemes": {
      "bearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT",
        "description": "Nhập JWT Access Token nhận được sau khi đăng nhập (không cần gõ chữ Bearer)"
      }
    }
  },
  "security": [
    {
      "bearerAuth": []
    }
  ],
  "paths": {
    "/api/health": {
      "get": {
        "tags": ["System Health"],
        "summary": "Kiểm tra trạng thái hoạt động của Server",
        "responses": {
          "200": {
            "description": "Server đang hoạt động bình thường"
          }
        }
      }
    },
    "/api/v1/auth/register": {
      "post": {
        "tags": ["1. Authentication"],
        "summary": "Đăng ký tài khoản khách hàng mới",
        "description": "Tạo tài khoản hội viên mới hoặc kích hoạt mật khẩu cho số điện thoại đã từng tích điểm tại quầy",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["phoneNumber", "fullName", "password", "confirmPassword"],
                "properties": {
                  "phoneNumber": { "type": "string", "example": "0988111222" },
                  "fullName": { "type": "string", "example": "Nguyễn Văn An" },
                  "password": { "type": "string", "example": "123456" },
                  "confirmPassword": { "type": "string", "example": "123456" },
                  "address": { "type": "string", "example": "Số 1 Võ Văn Ngân, TP. Thủ Đức" }
                }
              }
            }
          }
        },
        "responses": {
          "201": { "description": "Đăng ký tài khoản thành công" },
          "400": { "description": "Dữ liệu yêu cầu không hợp lệ" },
          "409": { "description": "Số điện thoại đã tồn tại trên hệ thống" }
        }
      }
    },
    "/api/v1/auth/login": {
      "post": {
        "tags": ["1. Authentication"],
        "summary": "Đăng nhập hệ thống",
        "description": "Tự động nhận diện tài khoản: kiểm tra bảng Employee trước, nếu không có sẽ kiểm tra bảng Customer",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["identifier", "password"],
                "properties": {
                  "identifier": { "type": "string", "example": "manager01", "description": "Username nhân viên hoặc SĐT khách hàng" },
                  "password": { "type": "string", "example": "123456" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Đăng nhập thành công, trả về Access Token và Profile" },
          "401": { "description": "Tài khoản hoặc mật khẩu không chính xác" },
          "403": { "description": "Tài khoản đã bị vô hiệu hóa hoặc chưa thiết lập mật khẩu" }
        }
      }
    },
    "/api/v1/auth/me": {
      "get": {
        "tags": ["1. Authentication"],
        "summary": "Lấy thông tin tài khoản đang đăng nhập",
        "security": [{ "bearerAuth": [] }],
        "responses": {
          "200": { "description": "Lấy thông tin người dùng thành công" },
          "401": { "description": "Chưa xác thực hoặc Token không hợp lệ" }
        }
      }
    },
    "/api/v1/auth/logout": {
      "post": {
        "tags": ["1. Authentication"],
        "summary": "Đăng xuất khỏi hệ thống",
        "security": [{ "bearerAuth": [] }],
        "responses": {
          "200": { "description": "Đăng xuất thành công" }
        }
      }
    },
    "/api/v1/auth/change-password": {
      "post": {
        "tags": ["1. Authentication"],
        "summary": "Đổi mật khẩu tài khoản",
        "security": [{ "bearerAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["oldPassword", "newPassword", "confirmPassword"],
                "properties": {
                  "oldPassword": { "type": "string", "example": "123456" },
                  "newPassword": { "type": "string", "example": "654321" },
                  "confirmPassword": { "type": "string", "example": "654321" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Đổi mật khẩu thành công" },
          "400": { "description": "Mật khẩu cũ không chính xác hoặc xác nhận mật khẩu không khớp" }
        }
      }
    },
    "/api/v1/auth/employees": {
      "post": {
        "tags": ["1. Authentication"],
        "summary": "Tạo tài khoản nhân viên nội bộ",
        "description": "Chỉ dành cho ADMIN hoặc MANAGER cấp quyền truy cập hệ thống",
        "security": [{ "bearerAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["fullName", "username", "password", "role"],
                "properties": {
                  "fullName": { "type": "string", "example": "Trần Ngọc Phương Thùy" },
                  "username": { "type": "string", "example": "storekeeper02" },
                  "password": { "type": "string", "example": "123456" },
                  "role": { "type": "string", "enum": ["ADMIN", "MANAGER", "CASHIER", "BARISTA", "STOREKEEPER"], "example": "STOREKEEPER" },
                  "phoneNumber": { "type": "string", "example": "0904444555" }
                }
              }
            }
          }
        },
        "responses": {
          "201": { "description": "Tạo tài khoản nhân viên thành công" },
          "409": { "description": "Tên đăng nhập đã tồn tại trên hệ thống" }
        }
      }
    },
    "/api/v1/auth/employees/{id}/role": {
      "patch": {
        "tags": ["1. Authentication"],
        "summary": "Cập nhật vai trò (Role) cho nhân viên",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" }, "description": "ID nhân viên" }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["role"],
                "properties": {
                  "role": { "type": "string", "enum": ["ADMIN", "MANAGER", "CASHIER", "BARISTA", "STOREKEEPER"], "example": "MANAGER" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Cập nhật vai trò thành công" },
          "404": { "description": "Không tìm thấy nhân viên" }
        }
      }
    },
    "/api/v1/pos/orders/": {
      "get": {
        "tags": ["2. POS & Pager Devices"],
        "summary": "Lấy danh sách đơn hàng POS có phân trang và bộ lọc",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "search", "in": "query", "schema": { "type": "string" }, "description": "Tìm theo mã đơn (#ORD), tên khách hoặc SĐT" },
          { "name": "status", "in": "query", "schema": { "type": "string", "enum": ["PENDING_PREP", "PREPARING", "READY_FOR_PICKUP", "COMPLETED", "CANCELLED"] } },
          { "name": "paymentMethod", "in": "query", "schema": { "type": "string" } },
          { "name": "orderChannel", "in": "query", "schema": { "type": "string" } },
          { "name": "fromDate", "in": "query", "schema": { "type": "string" }, "description": "Lọc từ ngày (YYYY-MM-DD)" },
          { "name": "toDate", "in": "query", "schema": { "type": "string" }, "description": "Lọc đến ngày (YYYY-MM-DD)" },
          { "name": "page", "in": "query", "schema": { "type": "integer", "default": 1 } },
          { "name": "limit", "in": "query", "schema": { "type": "integer", "default": 20 } }
        ],
        "responses": {
          "200": { "description": "Danh sách đơn hàng phân trang" }
        }
      },
      "post": {
        "tags": ["2. POS & Pager Devices"],
        "summary": "Tạo hóa đơn bán hàng tại quầy (Gọi Stored Procedure + TVP)",
        "security": [{ "bearerAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["employeeId", "subTotal", "totalAmount", "paymentMethod", "items"],
                "properties": {
                  "orderCode": { "type": "string", "example": "ORD-20261004-1001" },
                  "employeeId": { "type": "integer", "example": 2 },
                  "customerId": { "type": "integer", "example": 1 },
                  "pagerId": { "type": "integer", "example": 1 },
                  "pagerCode": { "type": "string", "example": "P01" },
                  "orderChannel": { "type": "string", "enum": ["ORDER_AT_COUNTER", "TAKE_AWAY", "DINE_IN"], "example": "ORDER_AT_COUNTER" },
                  "subTotal": { "type": "number", "example": 43000 },
                  "discountAmount": { "type": "number", "example": 0 },
                  "totalAmount": { "type": "number", "example": 43000 },
                  "paymentMethod": { "type": "string", "enum": ["CASH", "BANK_TRANSFER", "CARD", "MOMO", "VNPAY", "POINT_EXCHANGE"], "example": "CASH" },
                  "items": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "required": ["variantId", "quantity", "itemSnapshotName", "sizeSnapshot", "unitPrice", "totalPrice"],
                      "properties": {
                        "variantId": { "type": "integer", "example": 2 },
                        "quantity": { "type": "integer", "example": 1 },
                        "note": { "type": "string", "example": "Ít ngọt, nhiều đá" },
                        "itemSnapshotName": { "type": "string", "example": "Cà Phê Sữa Đá" },
                        "sizeSnapshot": { "type": "string", "example": "M" },
                        "unitPrice": { "type": "number", "example": 35000 },
                        "totalToppingPriceSnapshot": { "type": "number", "example": 8000 },
                        "totalPrice": { "type": "number", "example": 43000 },
                        "toppings": {
                          "type": "array",
                          "items": {
                            "type": "object",
                            "properties": {
                              "toppingId": { "type": "integer", "example": 1 },
                              "toppingSnapshotName": { "type": "string", "example": "Trân Châu Trắng" },
                              "toppingPrice": { "type": "number", "example": 8000 },
                              "quantity": { "type": "integer", "example": 1 }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": { "description": "Tạo đơn hàng thành công, kích hoạt cấp thẻ rung" },
          "400": { "description": "Dữ liệu giỏ hàng hoặc thẻ rung không hợp lệ" }
        }
      }
    },
    "/api/v1/pos/orders/items/{detailId}": {
      "delete": {
        "tags": ["2. POS & Pager Devices"],
        "summary": "Xóa một dòng món khỏi đơn hàng chưa chế biến",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "detailId", "in": "path", "required": true, "schema": { "type": "integer" }, "description": "Mã OrderDetail ID" }
        ],
        "responses": {
          "200": { "description": "Xóa món và dọn sạch topping liên quan thành công" }
        }
      }
    },
    "/api/v1/pos/orders/{id}": {
      "get": {
        "tags": ["2. POS & Pager Devices"],
        "summary": "Lấy chi tiết đơn hàng (Header, Item Details, Toppings)",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" }, "description": "Order ID" }
        ],
        "responses": {
          "200": { "description": "Chi tiết đơn hàng" },
          "404": { "description": "Không tìm thấy đơn hàng" }
        }
      }
    },
    "/api/v1/pos/orders/{id}/invoice": {
      "get": {
        "tags": ["2. POS & Pager Devices"],
        "summary": "Xuất hóa đơn chi tiết in ấn K80 (Truy vấn View v_InvoiceDetails)",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" }, "description": "Order ID" }
        ],
        "responses": {
          "200": { "description": "Dữ liệu hóa đơn in bill đóng băng theo Snapshot" },
          "404": { "description": "Không tìm thấy hóa đơn" }
        }
      }
    },
    "/api/v1/pos/orders/{id}/pay": {
      "patch": {
        "tags": ["2. POS & Pager Devices"],
        "summary": "Hoàn tất thanh toán hóa đơn & Tự động tích điểm hội viên",
        "description": "Gọi thủ tục sp_CompleteOrderPayment với mức cô lập REPEATABLE READ và khóa dòng",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" }, "description": "Order ID" }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["paymentMethod"],
                "properties": {
                  "paymentMethod": { "type": "string", "enum": ["CASH", "BANK_TRANSFER", "CARD", "MOMO", "VNPAY", "POINT_EXCHANGE"], "example": "CASH" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Thanh toán thành công và đã ghi sổ cái cộng điểm" },
          "400": { "description": "Đơn hàng đã thanh toán trước đó hoặc đã bị hủy" }
        }
      }
    },
    "/api/v1/pos/orders/{id}/cancel": {
      "patch": {
        "tags": ["2. POS & Pager Devices"],
        "summary": "Hủy đơn hàng chưa thanh toán",
        "description": "Gọi thủ tục sp_CancelOrder, hoàn lại điểm thưởng đã đổi và kích hoạt trigger giải phóng thẻ rung về AVAILABLE",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" }, "description": "Order ID" }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["employeeId", "cancelReason"],
                "properties": {
                  "employeeId": { "type": "integer", "example": 2 },
                  "cancelReason": { "type": "string", "example": "Khách đổi ý không muốn chờ pha chế" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Hủy đơn hàng thành công" },
          "400": { "description": "Không thể hủy đơn hàng đã thanh toán hoặc đã hoàn tất" }
        }
      }
    },
    "/api/v1/pos/orders/{id}/apply-points": {
      "post": {
        "tags": ["2. POS & Pager Devices"],
        "summary": "Áp dụng đổi điểm thưởng hội viên lấy chiết khấu giảm giá",
        "description": "Gọi thủ tục sp_ApplyLoyaltyPoints: khóa bản ghi Customer, khấu trừ số dư và trừ tiền trên hóa đơn",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" }, "description": "Order ID" }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["customerId", "pointsToRedeem"],
                "properties": {
                  "customerId": { "type": "integer", "example": 1 },
                  "pointsToRedeem": { "type": "integer", "example": 10 },
                  "conversionRate": { "type": "number", "example": 1000, "description": "1 điểm = 1.000 VNĐ" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Áp dụng đổi điểm giảm giá thành công" },
          "400": { "description": "Số dư điểm thưởng không đủ" }
        }
      }
    },
    "/api/v1/pos/pagers/": {
      "get": {
        "tags": ["2. POS & Pager Devices"],
        "summary": "Lấy danh sách thiết bị thẻ rung",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "search", "in": "query", "schema": { "type": "string" }, "description": "Tìm theo mã pagerCode" },
          { "name": "status", "in": "query", "schema": { "type": "string", "enum": ["AVAILABLE", "IN_USE", "CHARGING", "MAINTENANCE"] } },
          { "name": "minBattery", "in": "query", "schema": { "type": "integer" } },
          { "name": "page", "in": "query", "schema": { "type": "integer", "default": 1 } },
          { "name": "limit", "in": "query", "schema": { "type": "integer", "default": 20 } }
        ],
        "responses": {
          "200": { "description": "Danh sách thẻ rung phân trang" }
        }
      },
      "post": {
        "tags": ["2. POS & Pager Devices"],
        "summary": "Thêm thiết bị thẻ rung mới (MANAGER)",
        "security": [{ "bearerAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["pagerCode"],
                "properties": {
                  "pagerCode": { "type": "string", "example": "P06" },
                  "status": { "type": "string", "enum": ["AVAILABLE", "IN_USE", "CHARGING", "MAINTENANCE"], "example": "AVAILABLE" },
                  "batteryLevel": { "type": "integer", "example": 100 }
                }
              }
            }
          }
        },
        "responses": {
          "201": { "description": "Thêm thẻ rung mới thành công" },
          "409": { "description": "Mã thẻ rung đã tồn tại" }
        }
      }
    },
    "/api/v1/pos/pagers/available": {
      "get": {
        "tags": ["2. POS & Pager Devices"],
        "summary": "Lấy danh sách thẻ rung sẵn sàng cấp cho khách (status = AVAILABLE và pin >= 15%)",
        "security": [{ "bearerAuth": [] }],
        "responses": {
          "200": { "description": "Danh sách thẻ rung khả dụng" }
        }
      }
    },
    "/api/v1/pos/pagers/dashboard": {
      "get": {
        "tags": ["2. POS & Pager Devices"],
        "summary": "Bảng điều phối thẻ rung đang dùng & số phút khách chờ (View v_ActivePagerDashboard)",
        "security": [{ "bearerAuth": [] }],
        "responses": {
          "200": { "description": "Bảng điều phối thẻ rung" }
        }
      }
    },
    "/api/v1/pos/pagers/{id}": {
      "get": {
        "tags": ["2. POS & Pager Devices"],
        "summary": "Chi tiết thiết bị thẻ rung",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" } }
        ],
        "responses": {
          "200": { "description": "Chi tiết thiết bị" }
        }
      },
      "put": {
        "tags": ["2. POS & Pager Devices"],
        "summary": "Cập nhật toàn diện thông tin thẻ rung",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" } }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "pagerCode": { "type": "string", "example": "P01" },
                  "status": { "type": "string", "enum": ["AVAILABLE", "IN_USE", "CHARGING", "MAINTENANCE"], "example": "AVAILABLE" },
                  "batteryLevel": { "type": "integer", "example": 95 }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Cập nhật thành công" }
        }
      },
      "delete": {
        "tags": ["2. POS & Pager Devices"],
        "summary": "Xóa mềm thiết bị thẻ rung (Được bảo vệ bởi trigger trg_PagerDevice_SoftDelete)",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" } }
        ],
        "responses": {
          "200": { "description": "Đã xóa mềm thẻ rung thành công" },
          "400": { "description": "Thiết bị đang phục vụ đơn hàng, không thể xóa" }
        }
      }
    },
    "/api/v1/pos/pagers/{id}/release": {
      "post": {
        "tags": ["2. POS & Pager Devices"],
        "summary": "Thu hồi thẻ rung về khay sạc (Cập nhật status sang AVAILABLE)",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" } }
        ],
        "responses": {
          "200": { "description": "Thu hồi thẻ rung thành công" }
        }
      }
    },
    "/api/v1/pos/pagers/{id}/battery": {
      "patch": {
        "tags": ["2. POS & Pager Devices"],
        "summary": "Cập nhật mức pin của thẻ rung",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" } }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["batteryLevel"],
                "properties": {
                  "batteryLevel": { "type": "integer", "example": 85 }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Cập nhật mức pin thành công" }
        }
      }
    },
    "/api/v1/pos/pagers/{id}/status": {
      "patch": {
        "tags": ["2. POS & Pager Devices"],
        "summary": "Cập nhật nhanh trạng thái thẻ rung",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" } }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["status"],
                "properties": {
                  "status": { "type": "string", "enum": ["AVAILABLE", "IN_USE", "CHARGING", "MAINTENANCE"], "example": "CHARGING" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Cập nhật trạng thái thành công" }
        }
      }
    },
    "/api/v1/menu/categories/": {
      "get": {
        "tags": ["3. Menu Catalog"],
        "summary": "Lấy danh sách danh mục thực đơn",
        "parameters": [
          { "name": "displayStatus", "in": "query", "schema": { "type": "string", "enum": ["SHOW", "HIDE"] } },
          { "name": "search", "in": "query", "schema": { "type": "string" } }
        ],
        "responses": {
          "200": { "description": "Danh sách danh mục" }
        }
      },
      "post": {
        "tags": ["3. Menu Catalog"],
        "summary": "Tạo danh mục mới (MANAGER)",
        "security": [{ "bearerAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["name"],
                "properties": {
                  "name": { "type": "string", "example": "Cà Phê Cold Brew" },
                  "displayStatus": { "type": "string", "enum": ["SHOW", "HIDE"], "example": "SHOW" }
                }
              }
            }
          }
        },
        "responses": {
          "201": { "description": "Tạo danh mục thành công" },
          "409": { "description": "Tên danh mục đã tồn tại" }
        }
      }
    },
    "/api/v1/menu/categories/{id}": {
      "get": {
        "tags": ["3. Menu Catalog"],
        "summary": "Chi tiết danh mục theo ID",
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" } }
        ],
        "responses": {
          "200": { "description": "Chi tiết danh mục" },
          "404": { "description": "Không tìm thấy danh mục" }
        }
      },
      "put": {
        "tags": ["3. Menu Catalog"],
        "summary": "Cập nhật danh mục (MANAGER)",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" } }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": { "type": "string", "example": "Cà Phê Ủ Lạnh" },
                  "displayStatus": { "type": "string", "enum": ["SHOW", "HIDE"], "example": "SHOW" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Cập nhật danh mục thành công" }
        }
      },
      "delete": {
        "tags": ["3. Menu Catalog"],
        "summary": "Xóa mềm danh mục (MANAGER)",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" } }
        ],
        "responses": {
          "200": { "description": "Đã xóa mềm danh mục" },
          "409": { "description": "Không thể xóa danh mục đang có sản phẩm liên kết" }
        }
      }
    },
    "/api/v1/menu/products/": {
      "get": {
        "tags": ["3. Menu Catalog"],
        "summary": "Lấy danh sách sản phẩm kèm mảng biến thể Size (Tối ưu bằng FOR JSON PATH)",
        "parameters": [
          { "name": "categoryId", "in": "query", "schema": { "type": "integer" } },
          { "name": "status", "in": "query", "schema": { "type": "string", "enum": ["ACTIVE", "INACTIVE", "OUT_OF_STOCK"] } },
          { "name": "search", "in": "query", "schema": { "type": "string" } }
        ],
        "responses": {
          "200": { "description": "Danh sách sản phẩm" }
        }
      },
      "post": {
        "tags": ["3. Menu Catalog"],
        "summary": "Tạo sản phẩm mới kèm các biến thể Size (MANAGER)",
        "security": [{ "bearerAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["categoryId", "name", "variants"],
                "properties": {
                  "categoryId": { "type": "integer", "example": 1 },
                  "name": { "type": "string", "example": "Cà Phê Muối Biển" },
                  "description": { "type": "string", "example": "Cà phê Robusta kết hợp lớp kem béo mặn nhẹ" },
                  "image": { "type": "string", "example": "https://images.unsplash.com/photo-1541167760496-1628856ab772" },
                  "status": { "type": "string", "enum": ["ACTIVE", "INACTIVE", "OUT_OF_STOCK"], "example": "ACTIVE" },
                  "variants": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "required": ["size", "price"],
                      "properties": {
                        "size": { "type": "string", "enum": ["S", "M", "L", "XL"], "example": "M" },
                        "price": { "type": "number", "example": 39000 }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": { "description": "Tạo sản phẩm thành công" },
          "409": { "description": "Tên món đã tồn tại trong thực đơn" }
        }
      }
    },
    "/api/v1/menu/products/{id}": {
      "get": {
        "tags": ["3. Menu Catalog"],
        "summary": "Chi tiết sản phẩm theo ID",
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" } }
        ],
        "responses": {
          "200": { "description": "Chi tiết sản phẩm" }
        }
      },
      "put": {
        "tags": ["3. Menu Catalog"],
        "summary": "Cập nhật sản phẩm & Smart Upsert biến thể Size (MANAGER)",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" } }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": { "type": "string", "example": "Cà Phê Muối Đặc Biệt" },
                  "status": { "type": "string", "enum": ["ACTIVE", "INACTIVE", "OUT_OF_STOCK"], "example": "ACTIVE" },
                  "variants": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "size": { "type": "string", "enum": ["S", "M", "L", "XL"], "example": "L" },
                        "price": { "type": "number", "example": 45000 }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Cập nhật sản phẩm thành công" }
        }
      },
      "delete": {
        "tags": ["3. Menu Catalog"],
        "summary": "Xóa mềm sản phẩm và toàn bộ biến thể liên quan (MANAGER)",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" } }
        ],
        "responses": {
          "200": { "description": "Xóa mềm sản phẩm thành công" }
        }
      }
    },
    "/api/v1/menu/toppings/": {
      "get": {
        "tags": ["3. Menu Catalog"],
        "summary": "Lấy danh sách Topping khả dụng",
        "parameters": [
          { "name": "status", "in": "query", "schema": { "type": "string", "enum": ["AVAILABLE", "UNAVAILABLE", "ACTIVE"] } },
          { "name": "search", "in": "query", "schema": { "type": "string" } }
        ],
        "responses": {
          "200": { "description": "Danh sách topping" }
        }
      },
      "post": {
        "tags": ["3. Menu Catalog"],
        "summary": "Tạo Topping mới (MANAGER)",
        "security": [{ "bearerAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["name", "price"],
                "properties": {
                  "name": { "type": "string", "example": "Thạch Cà Phê" },
                  "price": { "type": "number", "example": 10000 },
                  "status": { "type": "string", "enum": ["AVAILABLE", "UNAVAILABLE", "ACTIVE"], "example": "AVAILABLE" }
                }
              }
            }
          }
        },
        "responses": {
          "201": { "description": "Tạo topping thành công" }
        }
      }
    },
    "/api/v1/menu/toppings/{id}": {
      "get": {
        "tags": ["3. Menu Catalog"],
        "summary": "Chi tiết Topping theo ID",
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" } }
        ],
        "responses": {
          "200": { "description": "Chi tiết topping" }
        }
      },
      "put": {
        "tags": ["3. Menu Catalog"],
        "summary": "Cập nhật thông tin Topping (MANAGER)",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" } }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": { "type": "string", "example": "Thạch Cà Phê Đậm Vị" },
                  "price": { "type": "number", "example": 12000 },
                  "status": { "type": "string", "enum": ["AVAILABLE", "UNAVAILABLE", "ACTIVE"], "example": "AVAILABLE" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Cập nhật topping thành công" }
        }
      },
      "delete": {
        "tags": ["3. Menu Catalog"],
        "summary": "Xóa mềm Topping (MANAGER)",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" } }
        ],
        "responses": {
          "200": { "description": "Xóa mềm topping thành công" }
        }
      }
    },
    "/api/v1/inventory/ingredients/": {
      "get": {
        "tags": ["4. Inventory & BOM"],
        "summary": "Lấy danh sách nguyên vật liệu kho",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "name", "in": "query", "schema": { "type": "string" } },
          { "name": "isLowStock", "in": "query", "schema": { "type": "boolean" }, "description": "Lọc nguyên liệu chạm hoặc dưới ngưỡng an toàn (View v_LowStockIngredients)" }
        ],
        "responses": {
          "200": { "description": "Danh sách nguyên liệu kho" }
        }
      },
      "post": {
        "tags": ["4. Inventory & BOM"],
        "summary": "Thêm mới nguyên liệu vào kho (STOREKEEPER / MANAGER)",
        "security": [{ "bearerAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["name", "unit"],
                "properties": {
                  "name": { "type": "string", "example": "Bột Trà Xanh Matcha" },
                  "unit": { "type": "string", "example": "kg" },
                  "stockQuantity": { "type": "number", "example": 5.0 },
                  "minimumThreshold": { "type": "number", "example": 1.5 }
                }
              }
            }
          }
        },
        "responses": {
          "201": { "description": "Thêm mới nguyên liệu thành công" }
        }
      }
    },
    "/api/v1/inventory/ingredients/{ingredientId}": {
      "get": {
        "tags": ["4. Inventory & BOM"],
        "summary": "Chi tiết nguyên liệu kho",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "ingredientId", "in": "path", "required": true, "schema": { "type": "integer" } }
        ],
        "responses": {
          "200": { "description": "Chi tiết nguyên liệu" }
        }
      },
      "put": {
        "tags": ["4. Inventory & BOM"],
        "summary": "Cập nhật thông tin nguyên liệu",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "ingredientId", "in": "path", "required": true, "schema": { "type": "integer" } }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": { "type": "string", "example": "Bột Matcha Uji" },
                  "minimumThreshold": { "type": "number", "example": 2.0 }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Cập nhật nguyên liệu thành công" }
        }
      },
      "delete": {
        "tags": ["4. Inventory & BOM"],
        "summary": "Xóa mềm nguyên liệu (MANAGER)",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "ingredientId", "in": "path", "required": true, "schema": { "type": "integer" } }
        ],
        "responses": {
          "200": { "description": "Đã xóa mềm nguyên liệu thành công" }
        }
      }
    },
    "/api/v1/inventory/boms/recipes": {
      "get": {
        "tags": ["4. Inventory & BOM"],
        "summary": "Xem bảng định lượng công thức pha chế (View v_ProductRecipeDetails)",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "variantId", "in": "query", "schema": { "type": "integer" }, "description": "Lọc định lượng theo mã biến thể món" }
        ],
        "responses": {
          "200": { "description": "Bảng định lượng món" }
        }
      },
      "post": {
        "tags": ["4. Inventory & BOM"],
        "summary": "Thiết lập định lượng tiêu hao nguyên liệu BOM (Gọi SP sp_UpsertRecipeBOM)",
        "security": [{ "bearerAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["variantId", "ingredientId", "consumedQuantity"],
                "properties": {
                  "variantId": { "type": "integer", "example": 2, "description": "ID biến thể Size M" },
                  "ingredientId": { "type": "integer", "example": 1, "description": "ID Hạt cà phê Robusta" },
                  "consumedQuantity": { "type": "number", "example": 0.025, "description": "Tiêu hao 0.025 kg" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Cập nhật định lượng công thức món thành công" }
        }
      }
    },
    "/api/v1/inventory/boms/toppings/{toppingId}": {
      "get": {
        "tags": ["4. Inventory & BOM"],
        "summary": "Xem định lượng tiêu hao của một loại Topping",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "toppingId", "in": "path", "required": true, "schema": { "type": "integer" } }
        ],
        "responses": {
          "200": { "description": "Định lượng Topping" }
        }
      }
    },
    "/api/v1/inventory/boms/toppings": {
      "post": {
        "tags": ["4. Inventory & BOM"],
        "summary": "Thiết lập định lượng tiêu hao cho Topping (MERGE ToppingBOM)",
        "security": [{ "bearerAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["toppingId", "ingredientId", "consumedQuantity"],
                "properties": {
                  "toppingId": { "type": "integer", "example": 2 },
                  "ingredientId": { "type": "integer", "example": 4 },
                  "consumedQuantity": { "type": "number", "example": 0.05 }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Cập nhật định lượng topping thành công" }
        }
      }
    },
    "/api/v1/inventory/boms/recipes/{variantId}/{ingredientId}": {
      "delete": {
        "tags": ["4. Inventory & BOM"],
        "summary": "Xóa nguyên liệu khỏi công thức pha chế (MANAGER)",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "variantId", "in": "path", "required": true, "schema": { "type": "integer" } },
          { "name": "ingredientId", "in": "path", "required": true, "schema": { "type": "integer" } }
        ],
        "responses": {
          "200": { "description": "Xóa thành công" }
        }
      }
    },
    "/api/v1/inventory/imports": {
      "get": {
        "tags": ["4. Inventory & BOM"],
        "summary": "Danh sách lịch sử phiếu nhập kho",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "supplierName", "in": "query", "schema": { "type": "string" } },
          { "name": "fromDate", "in": "query", "schema": { "type": "string" } },
          { "name": "toDate", "in": "query", "schema": { "type": "string" } }
        ],
        "responses": {
          "200": { "description": "Danh sách phiếu nhập" }
        }
      },
      "post": {
        "tags": ["4. Inventory & BOM"],
        "summary": "Lập phiếu nhập kho nguyên liệu (STOREKEEPER - SP sp_CreateInventoryImport + TVP)",
        "description": "Tự động kích hoạt trigger trg_InventoryImportDetail_AddInventory để cộng dồn tồn kho",
        "security": [{ "bearerAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["supplierName", "employeeId", "details"],
                "properties": {
                  "supplierName": { "type": "string", "example": "Công ty Cà phê Trung Nguyên" },
                  "employeeId": { "type": "integer", "example": 4 },
                  "note": { "type": "string", "example": "Nhập kho định kỳ đầu tháng" },
                  "details": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "required": ["ingredientId", "quantity", "unitPrice"],
                      "properties": {
                        "ingredientId": { "type": "integer", "example": 1 },
                        "quantity": { "type": "number", "example": 10.0 },
                        "unitPrice": { "type": "number", "example": 180000 }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": { "description": "Lập phiếu nhập kho thành công và đã tự động cộng tồn kho" }
        }
      }
    },
    "/api/v1/inventory/imports/{importId}": {
      "get": {
        "tags": ["4. Inventory & BOM"],
        "summary": "Chi tiết phiếu nhập kho theo ID",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "importId", "in": "path", "required": true, "schema": { "type": "integer" } }
        ],
        "responses": {
          "200": { "description": "Chi tiết phiếu nhập kho kèm danh sách mặt hàng" }
        }
      }
    },
    "/api/v1/inventory/adjustments/": {
      "get": {
        "tags": ["4. Inventory & BOM"],
        "summary": "Lịch sử kiểm kê cân kho hao hụt",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "ingredientId", "in": "query", "schema": { "type": "integer" } }
        ],
        "responses": {
          "200": { "description": "Lịch sử điều chỉnh" }
        }
      },
      "post": {
        "tags": ["4. Inventory & BOM"],
        "summary": "Lập phiếu cân kho hao hụt (Gọi SP sp_DieuChinhTonKho có khóa dòng)",
        "security": [{ "bearerAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["ingredientId", "employeeId", "newQuantity", "reason"],
                "properties": {
                  "ingredientId": { "type": "integer", "example": 4 },
                  "employeeId": { "type": "integer", "example": 4 },
                  "newQuantity": { "type": "number", "example": 18.0, "description": "Số lượng thực tế sau kiểm kê" },
                  "reason": { "type": "string", "example": "Hao hụt đổ tràn trong quá trình pha chế buổi sáng" }
                }
              }
            }
          }
        },
        "responses": {
          "201": { "description": "Ghi nhận điều chỉnh kho thành công" }
        }
      }
    },
    "/api/v1/kds/queue": {
      "get": {
        "tags": ["5. KDS (Bếp & Pha chế)"],
        "summary": "Lấy danh sách hàng đợi các món cần pha chế",
        "description": "Hiển thị món ăn kèm mã thẻ rung, size, topping và số phút khách đã chờ",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "status", "in": "query", "schema": { "type": "string", "enum": ["ALL", "PENDING", "PREPARING"], "default": "ALL" } }
        ],
        "responses": {
          "200": { "description": "Hàng đợi KDS" }
        }
      }
    },
    "/api/v1/kds/items/{orderDetailId}/status": {
      "patch": {
        "tags": ["5. KDS (Bếp & Pha chế)"],
        "summary": "Cập nhật trạng thái ly nước (Chuyển sang DONE sẽ kích hoạt trigger tự động trừ kho BOM)",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "orderDetailId", "in": "path", "required": true, "schema": { "type": "integer" } }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["itemStatus"],
                "properties": {
                  "itemStatus": { "type": "string", "enum": ["PREPARING", "DONE", "CANCELLED"], "example": "DONE" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Cập nhật trạng thái ly nước thành công và kho đã được trừ tự động" }
        }
      }
    },
    "/api/v1/kds/orders/{orderId}/notify-ready": {
      "post": {
        "tags": ["5. KDS (Bếp & Pha chế)"],
        "summary": "Rung chuông thẻ rung báo khách nhận nước (Gọi SP sp_KDS_NotifyOrderReady)",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "orderId", "in": "path", "required": true, "schema": { "type": "integer" } }
        ],
        "responses": {
          "200": { "description": "Đã kích hoạt rung chuông thẻ rung và chuyển trạng thái đơn sang READY_FOR_PICKUP" }
        }
      }
    },
    "/api/v1/loyalty/customers/": {
      "get": {
        "tags": ["6. Customer & Loyalty"],
        "summary": "Danh sách khách hàng hội viên có phân trang & lọc hạng thẻ",
        "parameters": [
          { "name": "search", "in": "query", "schema": { "type": "string" }, "description": "Tìm theo tên hoặc số điện thoại" },
          { "name": "membershipTier", "in": "query", "schema": { "type": "string", "enum": ["STANDARD", "SILVER", "GOLD", "DIAMOND"] } },
          { "name": "page", "in": "query", "schema": { "type": "integer", "default": 1 } },
          { "name": "limit", "in": "query", "schema": { "type": "integer", "default": 20 } }
        ],
        "responses": {
          "200": { "description": "Danh sách khách hàng" }
        }
      },
      "post": {
        "tags": ["6. Customer & Loyalty"],
        "summary": "Thêm mới hồ sơ khách hàng tại quầy POS",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["fullName", "phoneNumber"],
                "properties": {
                  "fullName": { "type": "string", "example": "Lê Thị Mai" },
                  "phoneNumber": { "type": "string", "example": "0977222333" },
                  "password": { "type": "string", "example": "123456", "description": "Để trống nếu khách tạo tại quầy chưa đặt mật khẩu" }
                }
              }
            }
          }
        },
        "responses": {
          "201": { "description": "Tạo khách hàng thành công" }
        }
      }
    },
    "/api/v1/loyalty/customers/{id}": {
      "get": {
        "tags": ["6. Customer & Loyalty"],
        "summary": "Xem hồ sơ chi tiết hội viên và tổng điểm đối soát (View v_CustomerLoyaltySummary)",
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" } }
        ],
        "responses": {
          "200": { "description": "Chi tiết hội viên" }
        }
      },
      "put": {
        "tags": ["6. Customer & Loyalty"],
        "summary": "Cập nhật thông tin hội viên",
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" } }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "fullName": { "type": "string", "example": "Lê Thị Mai Hương" },
                  "phoneNumber": { "type": "string", "example": "0977222333" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Cập nhật thành công" }
        }
      },
      "delete": {
        "tags": ["6. Customer & Loyalty"],
        "summary": "Xóa mềm khách hàng (Được bảo vệ bởi trigger trg_Customer_SoftDelete)",
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" } }
        ],
        "responses": {
          "200": { "description": "Xóa mềm thành công" }
        }
      }
    },
    "/api/v1/loyalty/transactions/history": {
      "get": {
        "tags": ["6. Customer & Loyalty"],
        "summary": "Tra cứu lịch sử biến động điểm thưởng hội viên (Tận dụng Function fn_GetMemberLoyaltyHistory)",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "customerId", "in": "query", "schema": { "type": "integer" } },
          { "name": "orderId", "in": "query", "schema": { "type": "integer" } },
          { "name": "transactionType", "in": "query", "schema": { "type": "string", "enum": ["EARN", "REDEEM"] } },
          { "name": "fromDate", "in": "query", "schema": { "type": "string" } },
          { "name": "toDate", "in": "query", "schema": { "type": "string" } },
          { "name": "page", "in": "query", "schema": { "type": "integer", "default": 1 } },
          { "name": "limit", "in": "query", "schema": { "type": "integer", "default": 20 } }
        ],
        "responses": {
          "200": { "description": "Lịch sử biến động điểm" }
        }
      }
    },
    "/api/v1/loyalty/transactions/adjust": {
      "post": {
        "tags": ["6. Customer & Loyalty"],
        "summary": "Cộng / trừ điểm hội viên có khóa giao dịch (MANAGER)",
        "description": "Bảo vệ bởi trigger trg_LoyaltyTransaction_AppendOnly và tự động đồng bộ rewardPoints qua trg_LoyaltyTransaction_SyncPoints",
        "security": [{ "bearerAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["customerId", "transactionType", "points"],
                "properties": {
                  "customerId": { "type": "integer", "example": 1 },
                  "orderId": { "type": "integer", "example": 1 },
                  "transactionType": { "type": "string", "enum": ["EARN", "REDEEM"], "example": "EARN" },
                  "points": { "type": "integer", "example": 50 },
                  "description": { "type": "string", "example": "Tặng điểm sinh nhật tri ân hội viên" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Giao dịch điểm thưởng thành công" },
          "400": { "description": "Số dư điểm không đủ để khấu trừ" }
        }
      }
    },
    "/api/v1/reports/revenue": {
      "get": {
        "tags": ["7. Reports & Analytics"],
        "summary": "Báo cáo tổng quan doanh thu (View v_DailyRevenue & Function fn_GetTotalRevenue)",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "fromDate", "in": "query", "schema": { "type": "string" }, "description": "Từ ngày (YYYY-MM-DD)" },
          { "name": "toDate", "in": "query", "schema": { "type": "string" }, "description": "Đến ngày (YYYY-MM-DD)" }
        ],
        "responses": {
          "200": { "description": "Tổng số đơn, tạm tính, tiền giảm giá và doanh thu thực thu" }
        }
      }
    },
    "/api/v1/reports/top-products": {
      "get": {
        "tags": ["7. Reports & Analytics"],
        "summary": "Báo cáo N món bán chạy nhất (Function fn_GetTopSellingProducts & View v_TopSellingProducts)",
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          { "name": "limit", "in": "query", "schema": { "type": "integer", "default": 5 }, "description": "Top N món" },
          { "name": "fromDate", "in": "query", "schema": { "type": "string" } },
          { "name": "toDate", "in": "query", "schema": { "type": "string" } }
        ],
        "responses": {
          "200": { "description": "Top sản phẩm bán chạy nhất" }
        }
      }
    },
    "/api/v1/reports/low-stock": {
      "get": {
        "tags": ["7. Reports & Analytics"],
        "summary": "Cảnh báo nguyên vật liệu sắp chạm hoặc dưới ngưỡng tối thiểu (View v_LowStockIngredients)",
        "security": [{ "bearerAuth": [] }],
        "responses": {
          "200": { "description": "Danh sách nguyên liệu thiếu hụt khẩn cấp" }
        }
      }
    }
  }
}
```

# src\middlewares\auth.guard.ts

| Property | Value |
|----------|-------|
| Path | `src\middlewares\auth.guard.ts` |
| Size | 3,922 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 22:41:06.304684 |

```typescript
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { envConfig } from "@/config/env.config";
import { getPool, sql } from "@/config/database";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        fullName: string;
        role:
          | "ADMIN"
          | "MANAGER"
          | "CASHIER"
          | "BARISTA"
          | "STOREKEEPER"
          | "CUSTOMER";
        userType: "EMPLOYEE" | "CUSTOMER";
        username?: string;
        phoneNumber?: string;
      };
    }
  }
}

interface JwtPayload {
  id: number;
  role:
    | "ADMIN"
    | "MANAGER"
    | "CASHIER"
    | "BARISTA"
    | "STOREKEEPER"
    | "CUSTOMER";
  userType: "EMPLOYEE" | "CUSTOMER";
}

export const authGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Yêu cầu đăng nhập để truy cập tài nguyên này (Thiếu Bearer Token).",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, envConfig.JWT_SECRET) as JwtPayload;
    } catch (err: any) {
      res.status(401).json({
        success: false,
        message:
          err.name === "TokenExpiredError"
            ? "Phiên đăng nhập đã hết hạn."
            : "Token xác thực không hợp lệ.",
      });
      return;
    }

    const pool = await getPool();

    // 1. Nhánh Khách hàng: Chỉ query bảng Customer
    if (decoded.userType === "CUSTOMER") {
      const custRes = await pool
        .request()
        .input("id", sql.Int, decoded.id)
        .query(`
          SELECT id, phoneNumber, fullName, membershipTier 
          FROM Customer 
          WHERE id = @id AND deletedAt IS NULL
        `);

      if (custRes.recordset.length === 0) {
        res.status(401).json({
          success: false,
          message: "Tài khoản khách hàng không tồn tại hoặc đã bị khóa.",
        });
        return;
      }

      const cust = custRes.recordset[0];
      req.user = {
        id: cust.id,
        fullName: cust.fullName,
        phoneNumber: cust.phoneNumber,
        role: "CUSTOMER",
        userType: "CUSTOMER",
      };
      return next();
    }

    // 2. Nhánh Nhân viên nội bộ: Chỉ query bảng Employee
    if (decoded.userType === "EMPLOYEE") {
      const empRes = await pool
        .request()
        .input("id", sql.Int, decoded.id)
        .query(`
          SELECT id, username, fullName, role, status, phoneNumber 
          FROM Employee 
          WHERE id = @id AND deletedAt IS NULL
        `);

      if (empRes.recordset.length === 0) {
        res.status(401).json({
          success: false,
          message: "Tài khoản nhân viên không tồn tại hoặc đã bị xóa.",
        });
        return;
      }

      const emp = empRes.recordset[0];
      if (emp.status !== "ACTIVE") {
        res.status(403).json({
          success: false,
          message: "Tài khoản nhân viên đã bị khóa hoặc ngừng hoạt động.",
        });
        return;
      }

      req.user = {
        id: emp.id,
        fullName: emp.fullName,
        username: emp.username,
        phoneNumber: emp.phoneNumber,
        role: emp.role,
        userType: "EMPLOYEE",
      };
      return next();
    }

    res.status(401).json({
      success: false,
      message: "Đối tượng người dùng không hợp lệ trong hệ thống.",
    });
  } catch (error) {
    next(error);
  }
};
```

# src\middlewares\error.filter.ts

| Property | Value |
|----------|-------|
| Path | `src\middlewares\error.filter.ts` |
| Size | 1,411 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 19:07:59.583281 |

```typescript
import { Request, Response, NextFunction } from 'express'

export const errorFilter = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ [Global Error Handler]:', err)

  // 1. Xử lý lỗi từ Microsoft SQL Server (mssql RequestError)
  if (err.number) {
    let statusCode = 400
    let customMessage = err.message

    // Lỗi vi phạm khóa chính hoặc Unique Constraint
    if (err.number === 2627 || err.number === 2601) {
      statusCode = 409
      customMessage = 'Dữ liệu đã tồn tại trên hệ thống (Trùng lặp khóa).'
    }
    // Lỗi vi phạm khóa ngoại (Foreign Key Constraint)
    else if (err.number === 547) {
      statusCode = 409
      customMessage = 'Không thể thực hiện thao tác do ràng buộc dữ liệu liên kết.'
    }
    // Lỗi nghiệp vụ do RAISERROR hoặc THROW từ Stored Procedure / Trigger
    else if (err.number >= 50000) {
      statusCode = 400
      customMessage = err.message
    }

    res.status(statusCode).json({
      success: false,
      code: `SQL_ERROR_${err.number}`,
      message: customMessage,
    })
    return
  }

  // 2. Xử lý lỗi runtime hoặc lỗi HTTP thông thường
  const status = err.status || err.statusCode || 500
  res.status(status).json({
    success: false,
    message: err.message || 'Lỗi máy chủ nội bộ (Internal Server Error)',
  })
}
```

# src\middlewares\index.ts

| Property | Value |
|----------|-------|
| Path | `src\middlewares\index.ts` |
| Size | 123 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 23:18:30.318218 |

```typescript
export * from './auth.guard'
export * from './role.guard'
export * from './validate.pipe'
export * from './error.filter'
```

# src\middlewares\role.guard.ts

| Property | Value |
|----------|-------|
| Path | `src\middlewares\role.guard.ts` |
| Size | 804 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 23:27:47.675254 |

```typescript
import { Request, Response, NextFunction } from 'express'

type RoleType = 'ADMIN' | 'MANAGER' | 'CASHIER' | 'BARISTA' | 'STOREKEEPER' | 'CUSTOMER'

export const roleGuard = (...allowedRoles: RoleType[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Chưa xác thực người dùng.' })
      return
    }

    const userRole = req.user.role

    if (userRole === 'ADMIN') {
      return next()
    }

    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({
        success: false,
        message: `Truy cập bị từ chối: Quyền [${userRole}] không được phép thực hiện hành động này.`,
      })
      return
    }

    next()
  }
}
```

# src\middlewares\validate.pipe.ts

| Property | Value |
|----------|-------|
| Path | `src\middlewares\validate.pipe.ts` |
| Size | 1,171 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 23:18:07.163617 |

```typescript
import { Request, Response, NextFunction } from 'express'
import { ZodError, ZodSchema } from 'zod'

type RequestPart = 'body' | 'query' | 'params'

/**
 * Middleware validate request schema
 * @param schema Zod Schema cần kiểm tra
 * @param part Bộ phận request cần validate (mặc định là 'body')
 */
export const validatePipe = (schema: ZodSchema, part: RequestPart = 'body') => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate và gán lại dữ liệu đã qua tiền xử lý / ép kiểu của Zod
      req[part] = await schema.parseAsync(req[part])
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        // Gom các lỗi validate thành object chi tiết
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }))

        res.status(400).json({
          success: false,
          message: 'Dữ liệu yêu cầu không hợp lệ.',
          errors: formattedErrors,
        })
        return
      }

      next(error)
    }
  }
}
```

# src\modules\auth\auth.controller.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\auth\auth.controller.ts` |
| Size | 3,570 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 22:34:03.080457 |

```typescript
import { Request, Response, NextFunction } from 'express'
import { AuthService } from './auth.service'
import {
  ChangePasswordBodySchema,
  CreateEmployeeBodySchema,
  LoginBodySchema,
  RegisterBodySchema,
  UpdateEmployeeRoleBodySchema,
} from './auth.schema'

export class AuthController {
  private authService = new AuthService()

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = RegisterBodySchema.parse(req.body);
      const result = await this.authService.register(body);
      res.status(201).json({
        success: true,
        message: result.message,
        data: {
          accessToken: result.accessToken,
          user: result.user,
        },
      });
    } catch (error: any) {
      res.status(error.statusCode || 400).json({
        success: false,
        message: error.message || 'Đăng ký thất bại',
      });
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = LoginBodySchema.parse(req.body)
      const result = await this.authService.login(body)
      res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công',
        data: result,
      })
    } catch (error: any) {
      res.status(error.statusCode || 401).json({
        success: false,
        message: error.message || 'Xác thực thất bại',
      })
    }
  }

  createEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = CreateEmployeeBodySchema.parse(req.body)
      const result = await this.authService.createEmployee(body)
      res.status(201).json({
        success: true,
        message: 'Tạo tài khoản nhân viên thành công',
        data: result,
      })
    } catch (error: any) {
      res.status(error.statusCode || 400).json({
        success: false,
        message: error.message || 'Tạo tài khoản nhân viên thất bại',
      })
    }
  }

  setEmployeeRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id)
      const body = UpdateEmployeeRoleBodySchema.parse(req.body)
      const result = await this.authService.setEmployeeRole(id, body)
      res.status(200).json({
        success: true,
        message: 'Cập nhật quyền nhân viên thành công',
        data: result,
      })
    } catch (error: any) {
      res.status(error.statusCode || 400).json({
        success: false,
        message: error.message || 'Cập nhật quyền thất bại',
      })
    }
  }

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = ChangePasswordBodySchema.parse(req.body)
      const user = req.user!
      const result = await this.authService.changePassword(user.id, user.userType, body)
      res.status(200).json({ success: true, ...result })
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ success: false, message: error.message })
    }
  }

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user!
      const data = await this.authService.getMe(user.id, user.userType)
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  logout = async (_req: Request, res: Response) => {
    res.status(200).json({ success: true, message: 'Đăng xuất thành công' })
  }
}
```

# src\modules\auth\auth.repo.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\auth\auth.repo.ts` |
| Size | 6,291 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 22:33:10.629094 |

```typescript
import { getPool, sql } from '@/config/database'
import { CreateEmployeeBodyType, RegisterBodyType } from './auth.schema'

export class AuthRepo {

  
  // Tìm nhân viên bằng username hoặc số điện thoại
  async findEmployeeByIdentifier(identifier: string) {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('identifier', sql.VarChar(100), identifier)
      .query(`
        SELECT id, fullName, username, password, role, phoneNumber, status
        FROM Employee
        WHERE (username = @identifier OR phoneNumber = @identifier)
          AND deletedAt IS NULL
      `)
    return result.recordset[0] || null
  }

  // Tìm khách hàng bằng số điện thoại
  async findCustomerByPhone(phoneNumber: string) {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('phoneNumber', sql.VarChar(20), phoneNumber)
      .query(`
        SELECT id, fullName, phoneNumber, password, rewardPoints, membershipTier
        FROM Customer
        WHERE phoneNumber = @phoneNumber 
          AND deletedAt IS NULL
      `)
    return result.recordset[0] || null
  }

  async findEmployeeById(id: number) {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query(`
        SELECT id, fullName, username, role, phoneNumber, status, createdAt
        FROM Employee
        WHERE id = @id AND deletedAt IS NULL
      `)
    return result.recordset[0] || null
  }

  async findCustomerById(id: number) {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query(`
        SELECT id, fullName, phoneNumber, rewardPoints, membershipTier, createdAt
        FROM Customer
        WHERE id = @id AND deletedAt IS NULL
      `)
    return result.recordset[0] || null
  }

  // Tạo tài khoản khách hàng mới (mặc định role = CUSTOMER)
  async createCustomer(data: { fullName: string; phoneNumber: string; passwordHash: string; address?: string }) {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('fullName', sql.NVarChar(100), data.fullName)
      .input('phoneNumber', sql.VarChar(20), data.phoneNumber)
      .input('password', sql.VarChar(255), data.passwordHash)
      .input('address', sql.NVarChar(255), data.address || null)
      .query(`
        INSERT INTO Customer (fullName, phoneNumber, password, address, rewardPoints, membershipTier, createdAt, updatedAt)
        OUTPUT INSERTED.id, INSERTED.fullName, INSERTED.phoneNumber, INSERTED.membershipTier, INSERTED.rewardPoints
        VALUES (@fullName, @phoneNumber, @password, @address, 0, 'STANDARD', SYSDATETIME(), SYSDATETIME())
      `)
    return result.recordset[0]
  }

  // Kích hoạt mật khẩu cho khách đã có thông tin tích điểm từ trước tại quầy
  async activateCustomerWithPassword(
    id: number,
    data: { fullName: string; passwordHash: string; address?: string }
  ) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .input('fullName', sql.NVarChar(100), data.fullName)
      .input('password', sql.VarChar(255), data.passwordHash)
      .input('address', sql.NVarChar(255), data.address || null)
      .query(`
        UPDATE Customer 
        SET fullName = @fullName,
            password = @password,
            address = COALESCE(@address, address),
            updatedAt = SYSDATETIME()
        OUTPUT 
          INSERTED.id, 
          INSERTED.fullName, 
          INSERTED.phoneNumber, 
          INSERTED.membershipTier, 
          INSERTED.rewardPoints,
          INSERTED.address
        WHERE id = @id AND deletedAt IS NULL
      `);
    return result.recordset[0];
  }

  // Tạo nhân viên nội bộ (Dành riêng cho Admin/Manager)
  async createEmployee(data: { fullName: string; username: string; passwordHash: string; role: string; phoneNumber?: string }) {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('fullName', sql.NVarChar(100), data.fullName)
      .input('username', sql.VarChar(100), data.username)
      .input('password', sql.VarChar(255), data.passwordHash)
      .input('role', sql.VarChar(50), data.role)
      .input('phoneNumber', sql.VarChar(20), data.phoneNumber || null)
      .query(`
        INSERT INTO Employee (fullName, username, password, role, phoneNumber, status, createdAt, updatedAt)
        OUTPUT INSERTED.id, INSERTED.fullName, INSERTED.username, INSERTED.role, INSERTED.status
        VALUES (@fullName, @username, @password, @role, @phoneNumber, 'ACTIVE', SYSDATETIME(), SYSDATETIME())
      `)
    return result.recordset[0]
  }

  // Cập nhật vai trò nhân viên
  async updateEmployeeRole(id: number, role: string) {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .input('role', sql.VarChar(50), role)
      .query(`
        UPDATE Employee 
        SET role = @role, updatedAt = SYSDATETIME()
        OUTPUT INSERTED.id, INSERTED.fullName, INSERTED.username, INSERTED.role, INSERTED.status
        WHERE id = @id AND deletedAt IS NULL
      `)
    return result.recordset[0] || null
  }

  async updateCustomerPassword(customerId: number, passwordHash: string) {
    const pool = await getPool()
    await pool
      .request()
      .input('id', sql.Int, customerId)
      .input('password', sql.VarChar(255), passwordHash)
      .query(`
        UPDATE Customer 
        SET password = @password, updatedAt = SYSDATETIME() 
        WHERE id = @id AND deletedAt IS NULL
      `)
  }

  async updateEmployeePassword(employeeId: number, passwordHash: string) {
    const pool = await getPool()
    await pool
      .request()
      .input('id', sql.Int, employeeId)
      .input('password', sql.VarChar(255), passwordHash)
      .query(`
        UPDATE Employee 
        SET password = @password, updatedAt = SYSDATETIME() 
        WHERE id = @id AND deletedAt IS NULL
      `)
  }

  
}
```

# src\modules\auth\auth.routes.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\auth\auth.routes.ts` |
| Size | 1,493 bytes |
| Extension | `.ts` |
| Modified | 2026-10-04 17:21:42.187968 |

```typescript
import { Router } from 'express'
import { AuthController } from './auth.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import {
  ChangePasswordBodySchema,
  CreateEmployeeBodySchema,
  LoginBodySchema,
  RegisterBodySchema,
  UpdateEmployeeRoleBodySchema,
} from './auth.schema'

export const authRouter = Router()
const controller = new AuthController()

// --- Public Endpoints ---
// 1. Đăng ký khách hàng duy nhất
authRouter.post('/register', validatePipe(RegisterBodySchema, 'body'), controller.register)

// 2. Đăng nhập chung không cần userType
authRouter.post('/login', validatePipe(LoginBodySchema, 'body'), controller.login)

// --- Authenticated Endpoints ---
authRouter.get('/me', authGuard, controller.getMe)
authRouter.post('/logout', authGuard, controller.logout)
authRouter.post('/change-password', authGuard, validatePipe(ChangePasswordBodySchema, 'body'), controller.changePassword)

// --- Dashboard Admin / Manager Management Endpoints ---
// 3. Quản lý tạo tài khoản nhân viên
authRouter.post(
  '/employees',
  authGuard,
  roleGuard('ADMIN', 'MANAGER'),
  validatePipe(CreateEmployeeBodySchema, 'body'),
  controller.createEmployee
)

// 4. Quản lý cập nhật vai trò (Role) cho nhân viên
authRouter.patch(
  '/employees/:id/role',
  authGuard,
  roleGuard('ADMIN', 'MANAGER'),
  validatePipe(UpdateEmployeeRoleBodySchema, 'body'),
  controller.setEmployeeRole
)
```

# src\modules\auth\auth.schema.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\auth\auth.schema.ts` |
| Size | 3,199 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 22:22:53.590556 |

```typescript
import { z } from 'zod'

// 1. Đăng ký tài khoản công khai: Mặc định là Khách hàng (Customer)
export const RegisterBodySchema = z
  .object({
    phoneNumber: z
      .string()
      .regex(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/, 'Số điện thoại không đúng định dạng'),
    fullName: z.string().trim().min(2, 'Họ và tên tối thiểu 2 ký tự').max(100),
    password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
    confirmPassword: z.string().min(6, 'Xác nhận mật khẩu tối thiểu 6 ký tự'),
    address: z.string().trim().max(255).optional(),
  })
  .strict()
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu và xác nhận mật khẩu không khớp nhau',
        path: ['confirmPassword'],
      })
    }
  })

// 2. Đăng nhập chung: Tự động nhận diện tài khoản, không cần userType
export const LoginBodySchema = z
  .object({
    identifier: z.string().trim().min(1, 'Vui lòng nhập tên đăng nhập hoặc số điện thoại'),
    password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
  })
  .strict()

// 3. Admin / Manager tạo tài khoản nhân viên
export const CreateEmployeeBodySchema = z
  .object({
    fullName: z.string().trim().min(2, 'Họ và tên tối thiểu 2 ký tự').max(100),
    username: z.string().trim().min(3, 'Tên đăng nhập tối thiểu 3 ký tự').max(50),
    password: z.string().min(6, 'Mật khẩu khởi tạo tối thiểu 6 ký tự'),
    role: z.enum(['ADMIN', 'MANAGER', 'CASHIER', 'BARISTA', 'STOREKEEPER'], {
      errorMap: () => ({ message: 'Vai trò nhân viên không hợp lệ' }),
    }),
    phoneNumber: z.string().regex(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/, 'Số điện thoại không hợp lệ').optional(),
  })
  .strict()

// 4. Admin / Manager phân quyền lại cho nhân viên
export const UpdateEmployeeRoleBodySchema = z
  .object({
    role: z.enum(['ADMIN', 'MANAGER', 'CASHIER', 'BARISTA', 'STOREKEEPER']),
  })
  .strict()

// 5. Đổi mật khẩu
export const ChangePasswordBodySchema = z
  .object({
    oldPassword: z.string().min(1, 'Vui lòng nhập mật khẩu cũ'),
    newPassword: z.string().min(6, 'Mật khẩu mới tối thiểu 6 ký tự'),
    confirmPassword: z.string().min(6, 'Xác nhận mật khẩu tối thiểu 6 ký tự'),
  })
  .strict()
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu mới và xác nhận mật khẩu không khớp nhau',
        path: ['confirmPassword'],
      })
    }
  })

export type RegisterBodyType = z.infer<typeof RegisterBodySchema>
export type LoginBodyType = z.infer<typeof LoginBodySchema>
export type CreateEmployeeBodyType = z.infer<typeof CreateEmployeeBodySchema>
export type UpdateEmployeeRoleBodyType = z.infer<typeof UpdateEmployeeRoleBodySchema>
export type ChangePasswordBodyType = z.infer<typeof ChangePasswordBodySchema>
```

# src\modules\auth\auth.service.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\auth\auth.service.ts` |
| Size | 8,355 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 22:33:49.008835 |

```typescript
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { envConfig } from '@/config/env.config'
import { AuthRepo } from './auth.repo'
import {
  ChangePasswordBodyType,
  CreateEmployeeBodyType,
  LoginBodyType,
  RegisterBodyType,
  UpdateEmployeeRoleBodyType,
} from './auth.schema'

export class AuthService {
  private authRepo = new AuthRepo()

  // 1. Đăng ký tài khoản (Mặc định là Khách hàng)
  async register(data: RegisterBodyType) {
    // 1. Kiểm tra SĐT đã tồn tại trong bảng Customer chưa
    const existingCustomer = await this.authRepo.findCustomerByPhone(data.phoneNumber);

    // TH1: Số điện thoại đã đăng ký và ĐÃ CÓ mật khẩu -> Chặn đăng ký trùng
    if (existingCustomer && existingCustomer.password) {
      const err: any = new Error(
        'Số điện thoại này đã được đăng ký tài khoản. Vui lòng đăng nhập.'
      );
      err.statusCode = 409;
      throw err;
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    let customer: any;
    let message = 'Đăng ký tài khoản thành công';

    // TH2: Khách đã từng tích điểm tại quầy (password đang NULL)
    // -> Kích hoạt tài khoản, giữ nguyên toàn bộ số điểm tích lũy và hạng thành viên
    if (existingCustomer && !existingCustomer.password) {
      customer = await this.authRepo.activateCustomerWithPassword(existingCustomer.id, {
        fullName: data.fullName,
        passwordHash: hashedPassword,
        address: data.address,
      });
      message = `Đăng ký thành công! Đã tự động liên kết và giữ nguyên ${customer.rewardPoints} điểm tích lũy từ các lần mua trước.`;
    } 
    // TH3: Khách hàng mới hoàn toàn
    else {
      customer = await this.authRepo.createCustomer({
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        passwordHash: hashedPassword,
        address: data.address,
      });
    }

    // 2. Tự động cấp Token đăng nhập ngay sau khi tạo/kích hoạt tài khoản
    const accessToken = jwt.sign(
      {
        id: customer.id,
        role: 'CUSTOMER',
        userType: 'CUSTOMER',
      },
      envConfig.JWT_SECRET,
      { expiresIn: envConfig.JWT_EXPIRES_IN }
    );

    return {
      message,
      accessToken,
      user: {
        id: customer.id,
        fullName: customer.fullName,
        phoneNumber: customer.phoneNumber,
        membershipTier: customer.membershipTier,
        rewardPoints: customer.rewardPoints,
        role: 'CUSTOMER',
        userType: 'CUSTOMER',
      },
    };
  }

  // 2. Đăng nhập chung: Tự nhận diện Employee hay Customer
  async login(data: LoginBodyType) {
    const { identifier, password } = data

    // Bước 1: Thử tìm trong bảng Employee trước
    const employee = await this.authRepo.findEmployeeByIdentifier(identifier)
    if (employee) {
      if (employee.status !== 'ACTIVE') {
        const err: any = new Error('Tài khoản nhân viên đã bị vô hiệu hóa')
        err.statusCode = 403
        throw err
      }

      const isMatch = await bcrypt.compare(password, employee.password)
      if (!isMatch) {
        const err: any = new Error('Tài khoản hoặc mật khẩu không chính xác')
        err.statusCode = 401
        throw err
      }

      const accessToken = jwt.sign(
        {
          id: employee.id,
          role: employee.role,
          userType: 'EMPLOYEE',
        },
        envConfig.JWT_SECRET,
        { expiresIn: envConfig.JWT_EXPIRES_IN }
      )

      return {
        accessToken,
        user: {
          id: employee.id,
          fullName: employee.fullName,
          username: employee.username,
          phoneNumber: employee.phoneNumber,
          role: employee.role,
          userType: 'EMPLOYEE',
        },
      }
    }

    // Bước 2: Nếu không phải nhân viên, kiểm tra bảng Customer
    const customer = await this.authRepo.findCustomerByPhone(identifier)
    if (!customer) {
      const err: any = new Error('Tài khoản hoặc mật khẩu không chính xác')
      err.statusCode = 401
      throw err
    }

    if (!customer.password) {
      const err: any = new Error(
        'Tài khoản tích điểm tại quầy chưa được thiết lập mật khẩu trực tuyến.'
      )
      err.statusCode = 403
      throw err
    }

    const isCustMatch = await bcrypt.compare(password, customer.password)
    if (!isCustMatch) {
      const err: any = new Error('Tài khoản hoặc mật khẩu không chính xác')
      err.statusCode = 401
      throw err
    }

    const accessToken = jwt.sign(
      {
        id: customer.id,
        role: 'CUSTOMER',
        userType: 'CUSTOMER',
      },
      envConfig.JWT_SECRET,
      { expiresIn: envConfig.JWT_EXPIRES_IN }
    )

    return {
      accessToken,
      user: {
        id: customer.id,
        fullName: customer.fullName,
        phoneNumber: customer.phoneNumber,
        membershipTier: customer.membershipTier,
        rewardPoints: customer.rewardPoints,
        role: 'CUSTOMER',
        userType: 'CUSTOMER',
      },
    }
  }

  // 3. Admin / Manager tạo tài khoản nhân viên
  async createEmployee(data: CreateEmployeeBodyType) {
    const existing = await this.authRepo.findEmployeeByIdentifier(data.username)
    if (existing) {
      const err: any = new Error('Tên đăng nhập này đã tồn tại trên hệ thống')
      err.statusCode = 409
      throw err
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)
    const employee = await this.authRepo.createEmployee({
      fullName: data.fullName,
      username: data.username,
      passwordHash: hashedPassword,
      role: data.role,
      phoneNumber: data.phoneNumber,
    })

    return employee
  }

  // 4. Admin / Manager gán Role mới cho nhân viên
  async setEmployeeRole(id: number, data: UpdateEmployeeRoleBodyType) {
    const emp = await this.authRepo.findEmployeeById(id)
    if (!emp) {
      const err: any = new Error('Không tìm thấy thông tin nhân viên')
      err.statusCode = 404
      throw err
    }

    return await this.authRepo.updateEmployeeRole(id, data.role)
  }

  // 5. Đổi mật khẩu
  async changePassword(userId: number, userType: 'EMPLOYEE' | 'CUSTOMER', data: ChangePasswordBodyType) {
    let currentHash = ''

    if (userType === 'EMPLOYEE') {
      const emp = await this.authRepo.findEmployeeById(userId)
      if (!emp) throw new Error('Không tìm thấy tài khoản')
      const fullEmp = await this.authRepo.findEmployeeByIdentifier(emp.username)
      currentHash = fullEmp.password
    } else {
      const cust = await this.authRepo.findCustomerById(userId)
      if (!cust) throw new Error('Không tìm thấy tài khoản')
      const fullCust = await this.authRepo.findCustomerByPhone(cust.phoneNumber)
      currentHash = fullCust.password
    }

    const isMatch = await bcrypt.compare(data.oldPassword, currentHash)
    if (!isMatch) {
      const err: any = new Error('Mật khẩu cũ không chính xác')
      err.statusCode = 400
      throw err
    }

    const newHashed = await bcrypt.hash(data.newPassword, 10)
    if (userType === 'EMPLOYEE') {
      await this.authRepo.updateEmployeePassword(userId, newHashed)
    } else {
      await this.authRepo.updateCustomerPassword(userId, newHashed)
    }

    return { message: 'Đổi mật khẩu thành công' }
  }

  // 6. Lấy thông tin tài khoản hiện tại
  async getMe(userId: number, userType: 'EMPLOYEE' | 'CUSTOMER') {
    if (userType === 'CUSTOMER') {
      const customer = await this.authRepo.findCustomerById(userId)
      if (!customer) throw new Error('Tài khoản không tồn tại')
      return { ...customer, role: 'CUSTOMER', userType: 'CUSTOMER' }
    }

    const employee = await this.authRepo.findEmployeeById(userId)
    if (!employee) throw new Error('Tài khoản không tồn tại')
    return { ...employee, userType: 'EMPLOYEE' }
  }
}
```

# src\modules\customer-loyalty\customer\customer.controller.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\customer-loyalty\customer\customer.controller.ts` |
| Size | 2,247 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:17:55.052888 |

```typescript
import { Request, Response, NextFunction } from 'express'
import { CustomerService } from './customer.service'
import {
    CreateCustomerSchema,
    CustomerParamSchema,
    FilterCustomerQuerySchema,
    UpdateCustomerSchema,
} from './customer.schema'

export class CustomerController {
    private customerService = new CustomerService()

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = FilterCustomerQuerySchema.parse(req.query)
            const data = await this.customerService.getCustomers(query)
            res.status(200).json({ success: true, ...data })
        } catch (error) {
            next(error)
        }
    }

    detail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = CustomerParamSchema.parse(req.params)
            const data = await this.customerService.getCustomerById(id)
            res.status(200).json({ success: true, data })
        } catch (error) {
            next(error)
        }
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = CreateCustomerSchema.parse(req.body)
            const result = await this.customerService.createCustomer(body)
            res.status(201).json({ success: true, ...result })
        } catch (error) {
            next(error)
        }
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = CustomerParamSchema.parse(req.params)
            const body = UpdateCustomerSchema.parse(req.body)
            const result = await this.customerService.updateCustomer(id, body)
            res.status(200).json({ success: true, ...result })
        } catch (error) {
            next(error)
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = CustomerParamSchema.parse(req.params)
            const result = await this.customerService.deleteCustomer(id)
            res.status(200).json({ success: true, ...result })
        } catch (error) {
            next(error)
        }
    }
}

```

# src\modules\customer-loyalty\customer\customer.repo.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\customer-loyalty\customer\customer.repo.ts` |
| Size | 6,660 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 23:06:19.694288 |

```typescript
import { getPool, sql } from '@/config/database'
import { CreateCustomerType, FilterCustomerQueryType, UpdateCustomerType } from './customer.schema'

export class CustomerRepo {
    async getCustomers(filter: FilterCustomerQueryType) {
        const pool = await getPool()
        const request = pool.request()

        const { search, membershipTier, page = 1, limit = 20 } = filter
        const offset = (page - 1) * limit
        const conditions: string[] = ['c.deletedAt IS NULL']

        if (membershipTier) {
            request.input('membershipTier', sql.NVarChar(50), membershipTier)
            conditions.push('c.membershipTier = @membershipTier')
        }

        if (search) {
            request.input('search', sql.NVarChar(150), `%${search}%`)
            conditions.push('(c.fullName LIKE @search OR c.phoneNumber LIKE @search)')
        }

        const whereClause = `WHERE ${conditions.join(' AND ')}`

        // Đếm tổng số bản ghi
        const countQuery = `SELECT COUNT(1) AS total FROM Customer c ${whereClause}`
        const countResult = await request.query(countQuery)
        const totalItems = countResult.recordset[0]?.total || 0

        // Truy vấn danh sách có phân trang chuẩn SQL Server
        request.input('offset', sql.Int, offset)
        request.input('limit', sql.Int, limit)

        const listQuery = `
      SELECT 
        c.id, 
        c.phoneNumber, 
        c.fullName, 
        c.rewardPoints, 
        c.membershipTier, 
        c.createdAt, 
        c.updatedAt,
        cls.totalPointsEarned,
        cls.totalPointsRedeemed
      FROM Customer c
      LEFT JOIN v_CustomerLoyaltySummary cls ON c.id = cls.customerId
      ${whereClause}
      ORDER BY c.createdAt DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `
        const listResult = await request.query(listQuery)

        return {
            items: listResult.recordset,
            meta: {
                page,
                limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            },
        }
    }

    async getCustomerById(id: number) {
        const pool = await getPool()
        const request = pool.request()

        request.input('id', sql.Int, id)
        const query = `
      SELECT 
        c.id, 
        c.phoneNumber, 
        c.fullName, 
        c.rewardPoints, 
        c.membershipTier, 
        c.createdAt, 
        c.updatedAt,
        cls.totalPointsEarned,
        cls.totalPointsRedeemed
      FROM Customer c
      LEFT JOIN v_CustomerLoyaltySummary cls ON c.id = cls.customerId
      WHERE c.id = @id AND c.deletedAt IS NULL
    `
        const result = await request.query(query)
        return result.recordset[0] || null
    }

    async getCustomerByPhone(phoneNumber: string) {
        const pool = await getPool()
        const request = pool.request()

        request.input('phoneNumber', sql.VarChar(20), phoneNumber)
        const query = `
      SELECT id, fullName, phoneNumber 
      FROM Customer 
      WHERE phoneNumber = @phoneNumber AND deletedAt IS NULL
    `
        const result = await request.query(query)
        return result.recordset[0] || null
    }

    async createCustomer(data: CreateCustomerType) {
        const pool = await getPool()
        const request = pool.request()

        request.input('fullName', sql.NVarChar(150), data.fullName)
        request.input('phoneNumber', sql.VarChar(20), data.phoneNumber)
        request.input('password', sql.VarChar(255), data.password || null)

        const query = `
      INSERT INTO Customer (fullName, phoneNumber, password, rewardPoints, membershipTier, createdAt)
      OUTPUT 
        INSERTED.id, 
        INSERTED.fullName, 
        INSERTED.phoneNumber, 
        INSERTED.rewardPoints, 
        INSERTED.membershipTier, 
        INSERTED.createdAt
      VALUES (@fullName, @phoneNumber, @password, 0, 'STANDARD', SYSDATETIME())
    `
        try {
            const result = await request.query(query)
            return result.recordset[0]
        } catch (error: any) {
            if (error.number === 2627 || error.number === 2601) {
                const err = new Error('Số điện thoại khách hàng đã tồn tại trên hệ thống')
                ;(err as any).status = 409
                throw err
            }
            throw error
        }
    }

    async updateCustomer(id: number, data: UpdateCustomerType) {
        const pool = await getPool()
        const request = pool.request()

        const updateFields: string[] = []

        request.input('id', sql.Int, id)

        if (data.fullName !== undefined) {
            request.input('fullName', sql.NVarChar(150), data.fullName)
            updateFields.push('fullName = @fullName')
        }

        if (data.phoneNumber !== undefined) {
            request.input('phoneNumber', sql.VarChar(20), data.phoneNumber)
            updateFields.push('phoneNumber = @phoneNumber')
        }

        if (data.password !== undefined) {
            request.input('password', sql.VarChar(255), data.password)
            updateFields.push('password = @password')
        }

        if (updateFields.length === 0) return null

        updateFields.push('updatedAt = SYSDATETIME()')

        const query = `
      UPDATE Customer 
      SET ${updateFields.join(', ')}
      OUTPUT 
        INSERTED.id, 
        INSERTED.fullName, 
        INSERTED.phoneNumber, 
        INSERTED.rewardPoints, 
        INSERTED.membershipTier, 
        INSERTED.updatedAt
      WHERE id = @id AND deletedAt IS NULL
    `
        try {
            const result = await request.query(query)
            return result.recordset[0] || null
        } catch (error: any) {
            if (error.number === 2627 || error.number === 2601) {
                const err = new Error('Số điện thoại này đã được sử dụng bởi khách hàng khác')
                ;(err as any).status = 409
                throw err
            }
            throw error
        }
    }

    async softDeleteCustomer(id: number) {
        const pool = await getPool()
        const request = pool.request()

        request.input('id', sql.Int, id)
        const query = `
      UPDATE Customer
      SET deletedAt = SYSDATETIME()
      WHERE id = @id AND deletedAt IS NULL
    `
        const result = await request.query(query)
        return result.rowsAffected[0] > 0
    }
}
```

# src\modules\customer-loyalty\customer\customer.routes.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\customer-loyalty\customer\customer.routes.ts` |
| Size | 679 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:17:55.055790 |

```typescript
import { Router } from 'express'
import { CustomerController } from './customer.controller'

export const customerRouter = Router()
const controller = new CustomerController()

// GET /api/v1/customer-loyalty/customers
customerRouter.get('/', controller.list)

// GET /api/v1/customer-loyalty/customers/:id
customerRouter.get('/:id', controller.detail)

// POST /api/v1/customer-loyalty/customers
customerRouter.post('/', controller.create)

// PUT /api/v1/customer-loyalty/customers/:id
customerRouter.put('/:id', controller.update)

// DELETE /api/v1/customer-loyalty/customers/:id (Xóa mềm khách hàng)
customerRouter.delete('/:id', controller.delete)

```

# src\modules\customer-loyalty\customer\customer.schema.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\customer-loyalty\customer\customer.schema.ts` |
| Size | 1,170 bytes |
| Extension | `.ts` |
| Modified | 2026-10-01 00:07:18.618048 |

```typescript
import { z } from 'zod'

export const CreateCustomerSchema = z.object({
    fullName: z.string().min(2, 'Tên khách hàng tối thiểu 2 ký tự').max(150),
    phoneNumber: z
        .string()
        .regex(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/, 'Số điện thoại không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự').optional().nullable(),
})

export const UpdateCustomerSchema = CreateCustomerSchema.partial()

export const CustomerParamSchema = z.object({
    id: z.coerce.number().int().positive('ID khách hàng không hợp lệ'),
})

export const FilterCustomerQuerySchema = z.object({
    search: z.string().optional(), // Tìm theo fullName hoặc phoneNumber
    membershipTier: z.enum(['STANDARD', 'SILVER', 'GOLD', 'DIAMOND']).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
})

export type CreateCustomerType = z.infer<typeof CreateCustomerSchema>
export type UpdateCustomerType = z.infer<typeof UpdateCustomerSchema>
export type FilterCustomerQueryType = z.infer<typeof FilterCustomerQuerySchema>

```

# src\modules\customer-loyalty\customer\customer.service.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\customer-loyalty\customer\customer.service.ts` |
| Size | 2,887 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:17:55.058180 |

```typescript
import bcrypt from 'bcrypt'
import { CustomerRepo } from './customer.repo'
import { CreateCustomerType, FilterCustomerQueryType, UpdateCustomerType } from './customer.schema'

export class CustomerService {
    private customerRepo = new CustomerRepo()

    async getCustomers(filter: FilterCustomerQueryType) {
        return await this.customerRepo.getCustomers(filter)
    }

    async getCustomerById(id: number) {
        const customer = await this.customerRepo.getCustomerById(id)
        if (!customer) {
            const err = new Error('Khách hàng không tồn tại hoặc đã bị xóa')
            ;(err as any).status = 404
            throw err
        }
        return customer
    }

    async createCustomer(data: CreateCustomerType) {
        const existing = await this.customerRepo.getCustomerByPhone(data.phoneNumber)
        if (existing) {
            const err = new Error('Số điện thoại khách hàng đã tồn tại trên hệ thống')
            ;(err as any).status = 409
            throw err
        }

        const payload = { ...data }
        if (payload.password) {
            payload.password = await bcrypt.hash(payload.password, 10)
        }

        const customer = await this.customerRepo.createCustomer(payload)
        return {
            message: 'Tạo thông tin khách hàng thành công',
            data: customer,
        }
    }

    async updateCustomer(id: number, data: UpdateCustomerType) {
        if (data.phoneNumber) {
            const existing = await this.customerRepo.getCustomerByPhone(data.phoneNumber)
            if (existing && existing.id !== id) {
                const err = new Error('Số điện thoại này đã được sử dụng bởi khách hàng khác')
                ;(err as any).status = 409
                throw err
            }
        }

        const payload = { ...data }
        if (payload.password) {
            payload.password = await bcrypt.hash(payload.password, 10)
        }

        const updated = await this.customerRepo.updateCustomer(id, payload)
        if (!updated) {
            const err = new Error('Cập nhật thất bại hoặc không tìm thấy khách hàng')
            ;(err as any).status = 404
            throw err
        }

        return {
            message: 'Cập nhật thông tin khách hàng thành công',
            data: updated,
        }
    }

    async deleteCustomer(id: number) {
        const success = await this.customerRepo.softDeleteCustomer(id)
        if (!success) {
            const err = new Error('Xóa thất bại hoặc không tìm thấy khách hàng')
            ;(err as any).status = 404
            throw err
        }
        return {
            message: 'Xóa thông tin khách hàng thành công',
        }
    }
}
```

# src\modules\customer-loyalty\customer-loyalty.routes.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\customer-loyalty\customer-loyalty.routes.ts` |
| Size | 316 bytes |
| Extension | `.ts` |
| Modified | 2026-09-23 23:13:11.490149 |

```typescript
import { Router } from 'express'
import { customerRouter } from './customer/customer.routes'
import { loyaltyRouter } from './loyalty/loyalty.routes'

export const customerLoyaltyRouter = Router()
customerLoyaltyRouter.use('/customers', customerRouter)
customerLoyaltyRouter.use('/transactions', loyaltyRouter)
```

# src\modules\customer-loyalty\loyalty\loyalty.controller.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\customer-loyalty\loyalty\loyalty.controller.ts` |
| Size | 1,034 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.197006 |

```typescript
import { Request, Response, NextFunction } from 'express'
import { LoyaltyService } from './loyalty.service'
import { AdjustPointsSchema, FilterLoyaltyHistoryQuerySchema } from './loyalty.schema'

export class LoyaltyController {
    private loyaltyService = new LoyaltyService()

    getHistory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = FilterLoyaltyHistoryQuerySchema.parse(req.query)
            const data = await this.loyaltyService.getLoyaltyHistory(query)
            res.status(200).json({ success: true, ...data })
        } catch (error) {
            next(error)
        }
    }

    adjustPoints = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = AdjustPointsSchema.parse(req.body)
            const result = await this.loyaltyService.adjustPoints(body)
            res.status(200).json({ success: true, ...result })
        } catch (error) {
            next(error)
        }
    }
}
```

# src\modules\customer-loyalty\loyalty\loyalty.repo.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\customer-loyalty\loyalty\loyalty.repo.ts` |
| Size | 10,867 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 19:04:42.518286 |

```typescript
import { getPool, sql } from '@/config/database'
import { AdjustPointsType, FilterLoyaltyHistoryQueryType } from './loyalty.schema'

export class LoyaltyRepo {
    async getLoyaltyHistory(filter: FilterLoyaltyHistoryQueryType) {
        const pool = await getPool()
        const request = pool.request()

        const { customerId, orderId, transactionType, fromDate, toDate, page = 1, limit = 20 } = filter
        const offset = (page - 1) * limit

        // Nếu có customerId, fromDate, toDate và không có orderId / transactionType: tận dụng Function fn_GetMemberLoyaltyHistory
        if (customerId && fromDate && toDate && !orderId && !transactionType) {
            request.input('customerId', sql.Int, customerId)
            request.input('fromDate', sql.DateTime2, fromDate)
            const endDate = new Date(toDate)
            endDate.setDate(endDate.getDate() + 1)
            request.input('toDate', sql.DateTime2, endDate)
            request.input('offset', sql.Int, offset)
            request.input('limit', sql.Int, limit)

            const countRes = await request.query(`
                SELECT COUNT(1) AS total
                FROM dbo.fn_GetMemberLoyaltyHistory(@customerId, @fromDate, @toDate)
            `)
            const totalItems = countRes.recordset[0]?.total || 0

            const listQuery = `
                SELECT 
                    h.transactionId AS id,
                    h.customerId,
                    c.fullName AS customerName,
                    c.phoneNumber AS customerPhone,
                    h.orderId,
                    h.transactionType,
                    h.points,
                    h.balanceAfter,
                    h.description,
                    h.transactionTime AS createdAt
                FROM dbo.fn_GetMemberLoyaltyHistory(@customerId, @fromDate, @toDate) h
                JOIN Customer c ON h.customerId = c.id
                ORDER BY h.transactionTime DESC, h.transactionId DESC
                OFFSET @offset ROWS
                FETCH NEXT @limit ROWS ONLY
            `
            const listRes = await request.query(listQuery)

            return {
                items: listRes.recordset,
                meta: {
                    page,
                    limit,
                    totalItems,
                    totalPages: Math.ceil(totalItems / limit),
                },
            }
        }

        const conditions: string[] = ['1=1']

        if (customerId) {
            request.input('customerId', sql.Int, customerId)
            conditions.push('lt.customerId = @customerId')
        }

        if (orderId) {
            request.input('orderId', sql.Int, orderId)
            conditions.push('lt.orderId = @orderId')
        }

        if (transactionType) {
            request.input('transactionType', sql.NVarChar(50), transactionType)
            conditions.push('lt.transactionType = @transactionType')
        }

        if (fromDate) {
            request.input('fromDate', sql.DateTime2, fromDate)
            conditions.push('lt.createdAt >= @fromDate')
        }

        if (toDate) {
            const endDate = new Date(toDate)
            endDate.setDate(endDate.getDate() + 1)
            request.input('toDate', sql.DateTime2, endDate)
            conditions.push('lt.createdAt < @toDate')
        }

        const whereClause = `WHERE ${conditions.join(' AND ')}`

        const countRes = await request.query(`SELECT COUNT(1) AS total FROM LoyaltyTransaction lt ${whereClause}`)
        const totalItems = countRes.recordset[0]?.total || 0

        request.input('offset', sql.Int, offset)
        request.input('limit', sql.Int, limit)

        const listQuery = `
      SELECT 
        lt.id,
        lt.customerId,
        c.fullName AS customerName,
        c.phoneNumber AS customerPhone,
        lt.orderId,
        lt.transactionType,
        lt.points,
        lt.balanceAfter,
        lt.description,
        lt.createdAt
      FROM LoyaltyTransaction lt
      JOIN Customer c ON lt.customerId = c.id
      ${whereClause}
      ORDER BY lt.createdAt DESC, lt.id DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `
        const listRes = await request.query(listQuery)

        return {
            items: listRes.recordset,
            meta: {
                page,
                limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            },
        }
    }

    // Thực hiện giao dịch điểm dùng TRANSACTION & khóa bản ghi (UPDLOCK) để chống Race Condition
    async processPointsTransaction(data: AdjustPointsType) {
        const pool = await getPool()
        const transaction = new sql.Transaction(pool)

        await transaction.begin()

        try {
            const lockReq = new sql.Request(transaction)
            lockReq.input('customerId', sql.Int, data.customerId)

            // 1. Khóa và lấy thông tin điểm hiện tại của Customer
            const customerRes = await lockReq.query(`
                SELECT rewardPoints, membershipTier 
                FROM Customer WITH (UPDLOCK, ROWLOCK)
                WHERE id = @customerId AND deletedAt IS NULL
            `)

            if (customerRes.recordset.length === 0) {
                throw new Error('Khách hàng không tồn tại hoặc đã bị xóa')
            }

            // 2. Validate Order nếu có truyền orderId
            if (data.orderId) {
                const orderReq = new sql.Request(transaction)
                orderReq.input('orderId', sql.Int, data.orderId)
                const orderRes = await orderReq.query(`
                    SELECT id, customerId 
                    FROM [Order] 
                    WHERE id = @orderId AND deletedAt IS NULL
                `)

                if (orderRes.recordset.length === 0) {
                    throw new Error('Đơn hàng không tồn tại')
                }

                const order = orderRes.recordset[0]
                if (order.customerId && order.customerId !== data.customerId) {
                    throw new Error('Đơn hàng không thuộc về khách hàng này')
                }

                if (data.transactionType === 'EARN') {
                    const dupReq = new sql.Request(transaction)
                    dupReq.input('orderId', sql.Int, data.orderId)
                    const dupRes = await dupReq.query(`
                        SELECT TOP 1 id FROM LoyaltyTransaction 
                        WHERE orderId = @orderId AND transactionType = 'EARN'
                    `)

                    if (dupRes.recordset.length > 0) {
                        throw new Error('Đơn hàng này đã được cộng điểm thưởng trước đó')
                    }
                }
            }

            const currentPoints: number = customerRes.recordset[0].rewardPoints

            // Xác định số điểm chèn vào sổ cái: EARN là số dương, REDEEM là số âm
            let pointsToRecord = data.points
            if (data.transactionType === 'REDEEM') {
                if (currentPoints < data.points) {
                    throw new Error(`Điểm thưởng không đủ (Hiện có: ${currentPoints}, cần đổi: ${data.points})`)
                }
                pointsToRecord = -Math.abs(data.points)
            } else {
                pointsToRecord = Math.abs(data.points)
            }

            const newBalance = currentPoints + pointsToRecord

            // 3. Tính điểm Lifetime Earned để xét thăng hạng
            const lifetimeReq = new sql.Request(transaction)
            lifetimeReq.input('customerId', sql.Int, data.customerId)
            const lifetimeRes = await lifetimeReq.query(`
                SELECT ISNULL(SUM(points), 0) AS totalEarned
                FROM LoyaltyTransaction
                WHERE customerId = @customerId AND transactionType = 'EARN'
            `)

            let lifetimePoints = Number(lifetimeRes.recordset[0]?.totalEarned || 0)
            if (data.transactionType === 'EARN') {
                lifetimePoints += data.points
            }

            let newTier = 'STANDARD'
            if (lifetimePoints >= 1000) newTier = 'DIAMOND'
            else if (lifetimePoints >= 500) newTier = 'GOLD'
            else if (lifetimePoints >= 200) newTier = 'SILVER'

            // Cập nhật hạng thành viên (chỉ cập nhật membershipTier, không can thiệp rewardPoints vì trigger DB sẽ làm)
            const updateTierReq = new sql.Request(transaction)
            updateTierReq.input('customerId', sql.Int, data.customerId)
            updateTierReq.input('newTier', sql.NVarChar(50), newTier)
            await updateTierReq.query(`
                UPDATE Customer 
                SET membershipTier = @newTier, 
                    updatedAt = SYSDATETIME()
                WHERE id = @customerId
            `)

            // 4. Ghi log vào LoyaltyTransaction.
            // Trigger trg_LoyaltyTransaction_SyncPoints trong DB sẽ tự động tính lại Customer.rewardPoints chuẩn xác!
            const logReq = new sql.Request(transaction)
            logReq.input('customerId', sql.Int, data.customerId)
            logReq.input('orderId', sql.Int, data.orderId || null)
            logReq.input('transactionType', sql.NVarChar(50), data.transactionType)
            logReq.input('points', sql.Int, pointsToRecord)
            logReq.input('balanceAfter', sql.Int, newBalance)
            logReq.input('description', sql.NVarChar(500), data.description || null)

            const logRes = await logReq.query(`
                INSERT INTO LoyaltyTransaction (customerId, orderId, transactionType, points, balanceAfter, description, createdAt)
                OUTPUT 
                  INSERTED.id, 
                  INSERTED.customerId, 
                  INSERTED.orderId, 
                  INSERTED.transactionType, 
                  INSERTED.points, 
                  INSERTED.balanceAfter, 
                  INSERTED.description, 
                  INSERTED.createdAt
                VALUES (@customerId, @orderId, @transactionType, @points, @balanceAfter, @description, SYSDATETIME())
            `)

            await transaction.commit()
            return {
                transaction: logRes.recordset[0],
                newTier,
                balanceAfter: newBalance,
            }
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }
}
```

# src\modules\customer-loyalty\loyalty\loyalty.routes.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\customer-loyalty\loyalty\loyalty.routes.ts` |
| Size | 797 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 23:31:02.823797 |

```typescript
import { Router } from 'express'
import { LoyaltyController } from './loyalty.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import {
  AdjustPointsSchema,
  FilterLoyaltyHistoryQuerySchema,
} from './loyalty.schema'

export const loyaltyRouter = Router()
const controller = new LoyaltyController()

loyaltyRouter.use(authGuard)

// Tra cứu lịch sử biến động điểm
loyaltyRouter.get(
  '/history',
  roleGuard('CUSTOMER', 'CASHIER', 'MANAGER'),
  validatePipe(FilterLoyaltyHistoryQuerySchema, 'query'),
  controller.getHistory
)

// Điều chỉnh tăng/giảm điểm thủ công: Chỉ MANAGER
loyaltyRouter.post(
  '/adjust',
  roleGuard('MANAGER'),
  validatePipe(AdjustPointsSchema, 'body'),
  controller.adjustPoints
)
```

# src\modules\customer-loyalty\loyalty\loyalty.schema.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\customer-loyalty\loyalty\loyalty.schema.ts` |
| Size | 1,613 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:17:55.060298 |

```typescript
import { z } from 'zod'

export const AdjustPointsSchema = z.object({
    customerId: z.coerce.number().int().positive('customerId không hợp lệ'),
    orderId: z.coerce.number().int().positive('orderId không hợp lệ').optional().nullable(),
    transactionType: z.enum(['EARN', 'REDEEM'], {
        errorMap: () => ({ message: 'transactionType phải là EARN hoặc REDEEM' }),
    }),
    points: z.coerce.number().int().positive('Số điểm thay đổi phải lớn hơn 0'),
    description: z.string().max(500).optional().nullable(),
})

export const FilterLoyaltyHistoryQuerySchema = z
    .object({
        customerId: z.coerce.number().int().positive().optional(),
        orderId: z.coerce.number().int().positive().optional(),
        transactionType: z.enum(['EARN', 'REDEEM']).optional(),
        fromDate: z.coerce.date().optional(),
        toDate: z.coerce.date().optional(),
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce
            .number()
            .int()
            .positive()
            .max(100)
            .default(20),
    })
    .refine(
        data => {
            if (data.fromDate && data.toDate) {
                return data.fromDate <= data.toDate
            }
            return true
        },
        {
            message: 'fromDate must be less than or equal to toDate',
            path: ['toDate'],
        },
    )

export type AdjustPointsType = z.infer<typeof AdjustPointsSchema>
export type FilterLoyaltyHistoryQueryType = z.infer<typeof FilterLoyaltyHistoryQuerySchema>
```

# src\modules\customer-loyalty\loyalty\loyalty.service.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\customer-loyalty\loyalty\loyalty.service.ts` |
| Size | 656 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.201005 |

```typescript
import { LoyaltyRepo } from './loyalty.repo'
import { AdjustPointsType, FilterLoyaltyHistoryQueryType } from './loyalty.schema'

export class LoyaltyService {
    private loyaltyRepo = new LoyaltyRepo()

    async getLoyaltyHistory(filter: FilterLoyaltyHistoryQueryType) {
        return await this.loyaltyRepo.getLoyaltyHistory(filter)
    }

    async adjustPoints(data: AdjustPointsType) {
        const result = await this.loyaltyRepo.processPointsTransaction(data)
        return {
            message: `${data.transactionType === 'EARN' ? 'Tích điểm' : 'Đổi điểm'} thành công`,
            data: result,
        }
    }
}
```

# src\modules\inventory-bom\adjustment\adjustment.controller.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\inventory-bom\adjustment\adjustment.controller.ts` |
| Size | 962 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.203007 |

```typescript
import { Request, Response, NextFunction } from 'express'
import { AdjustmentService } from './adjustment.service'
import { CreateAdjustmentSchema, FilterAdjustmentQuerySchema } from './adjustment.schema'

export class AdjustmentController {
  private adjustmentService = new AdjustmentService()

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = FilterAdjustmentQuerySchema.parse(req.query)
      const data = await this.adjustmentService.getAdjustments(query)
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = CreateAdjustmentSchema.parse(req.body)
      const result = await this.adjustmentService.createAdjustment(body)
      res.status(201).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }
}
```

# src\modules\inventory-bom\adjustment\adjustment.repo.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\inventory-bom\adjustment\adjustment.repo.ts` |
| Size | 1,453 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:51:25.479671 |

```typescript
import { getPool, sql } from '@/config/database'
import { CreateAdjustmentType, FilterAdjustmentQueryType } from './adjustment.schema'

export class AdjustmentRepo {
  async getAdjustments(filter: FilterAdjustmentQueryType) {
    const pool = await getPool()
    const req = pool.request()
    let query = `
      SELECT 
        ia.id, ia.ingredientId, i.name AS ingredientName, i.unit,
        ia.employeeId, e.fullName AS employeeName,
        ia.oldQuantity, ia.newQuantity, ia.difference, ia.reason, ia.adjustmentDate
      FROM InventoryAdjustment ia
      JOIN Ingredient i ON ia.ingredientId = i.id
      JOIN Employee e ON ia.employeeId = e.id
      WHERE 1=1
    `
    if (filter.ingredientId) {
      req.input('ingredientId', sql.Int, filter.ingredientId)
      query += ' AND ia.ingredientId = @ingredientId'
    }
    query += ' ORDER BY ia.adjustmentDate DESC'
    const result = await req.query(query)
    return result.recordset
  }

  async createAdjustmentWithTransaction(data: CreateAdjustmentType) {
    const pool = await getPool()
    const req = pool.request()
    req.input('ingredientId', sql.Int, data.ingredientId)
    req.input('employeeId', sql.Int, data.employeeId)
    req.input('newQuantity', sql.Decimal(18, 3), data.newQuantity)
    req.input('reason', sql.NVarChar(500), data.reason)

    const result = await req.execute('sp_DieuChinhTonKho')
    return result.recordset[0]
  }
}
```

# src\modules\inventory-bom\adjustment\adjustment.routes.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\inventory-bom\adjustment\adjustment.routes.ts` |
| Size | 798 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 23:30:19.738399 |

```typescript
import { Router } from 'express'
import { AdjustmentController } from './adjustment.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import {
  CreateAdjustmentSchema,
  FilterAdjustmentQuerySchema,
} from './adjustment.schema'

export const adjustmentRouter = Router()
const controller = new AdjustmentController()

adjustmentRouter.use(authGuard, roleGuard('STOREKEEPER', 'MANAGER'))

// GET /api/v1/inventory/adjustments - Xem lịch sử điều chỉnh cân kho
adjustmentRouter.get(
  '/',
  validatePipe(FilterAdjustmentQuerySchema, 'query'),
  controller.list
)

// POST /api/v1/inventory/adjustments - Lập phiếu cân kho hao hụt
adjustmentRouter.post(
  '/',
  validatePipe(CreateAdjustmentSchema, 'body'),
  controller.create
)
```

# src\modules\inventory-bom\adjustment\adjustment.schema.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\inventory-bom\adjustment\adjustment.schema.ts` |
| Size | 786 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.205006 |

```typescript
import { z } from 'zod'

export const CreateAdjustmentSchema = z.object({
  ingredientId: z.coerce.number().int().positive('ingredientId không hợp lệ'),
  employeeId: z.coerce.number().int().positive('employeeId không hợp lệ'),
  newQuantity: z.coerce.number().min(0, 'Số lượng kiểm kê thực tế phải >= 0'),
  reason: z.string().min(3, 'Lý do điều chỉnh tối thiểu 3 ký tự').max(255),
})

export const FilterAdjustmentQuerySchema = z.object({
  ingredientId: z.coerce.number().int().positive().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
})

export type CreateAdjustmentType = z.infer<typeof CreateAdjustmentSchema>
export type FilterAdjustmentQueryType = z.infer<typeof FilterAdjustmentQuerySchema>
```

# src\modules\inventory-bom\adjustment\adjustment.service.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\inventory-bom\adjustment\adjustment.service.ts` |
| Size | 614 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.207007 |

```typescript
import { AdjustmentRepo } from './adjustment.repo'
import { CreateAdjustmentType, FilterAdjustmentQueryType } from './adjustment.schema'

export class AdjustmentService {
  private adjustmentRepo = new AdjustmentRepo()

  async getAdjustments(filter: FilterAdjustmentQueryType) {
    return await this.adjustmentRepo.getAdjustments(filter)
  }

  async createAdjustment(data: CreateAdjustmentType) {
    const result = await this.adjustmentRepo.createAdjustmentWithTransaction(data)
    return {
      message: 'Cân đo và điều chỉnh tồn kho thành công',
      data: result,
    }
  }
}
```

# src\modules\inventory-bom\bom\bom.controller.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\inventory-bom\bom\bom.controller.ts` |
| Size | 1,976 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.208008 |

```typescript
import { Request, Response, NextFunction } from 'express'
import { BOMService } from './bom.service'
import { RecipeBOMSchema, ToppingBOMSchema, GetVariantBOMQuerySchema } from './bom.schema'

export class BOMController {
  private bomService = new BOMService()

  getRecipes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = GetVariantBOMQuerySchema.parse(req.query)
      const data = await this.bomService.getRecipeDetails(query.variantId)
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  getToppingBOM = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const toppingId = Number(req.params.toppingId)
      const data = await this.bomService.getToppingBOM(toppingId)
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  upsertRecipe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = RecipeBOMSchema.parse(req.body)
      const result = await this.bomService.upsertRecipeBOM(body)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  upsertTopping = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = ToppingBOMSchema.parse(req.body)
      const result = await this.bomService.upsertToppingBOM(body)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  deleteRecipe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const variantId = Number(req.params.variantId)
      const ingredientId = Number(req.params.ingredientId)
      const result = await this.bomService.deleteRecipeBOM(variantId, ingredientId)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }
}
```

# src\modules\inventory-bom\bom\bom.repo.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\inventory-bom\bom\bom.repo.ts` |
| Size | 2,979 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 22:48:51.600066 |

```typescript
import { getPool, sql } from '@/config/database'
import { RecipeBOMType, ToppingBOMType } from './bom.schema'

export class BOMRepo {
  async getAllRecipeDetails(variantId?: number) {
    const pool = await getPool()
    const req = pool.request()
    let query = 'SELECT * FROM v_ProductRecipeDetails'
    if (variantId) {
      req.input('variantId', sql.Int, variantId)
      query = `
        SELECT 
          p.name AS productName, pv.size AS productSize,
          i.name AS ingredientName, rb.consumedQuantity, i.unit AS ingredientUnit
        FROM RecipeBOM rb
        JOIN ProductVariant pv ON rb.variantId = pv.id
        JOIN Product p ON pv.productId = p.id
        JOIN Ingredient i ON rb.ingredientId = i.id
        WHERE rb.variantId = @variantId
      `
    }
    const result = await req.query(query)
    return result.recordset
  }

  async getToppingBOM(toppingId: number) {
    const pool = await getPool()
    const req = pool.request()
    req.input('toppingId', sql.Int, toppingId)
    const query = `
      SELECT t.name AS toppingName, i.name AS ingredientName, tb.consumedQuantity, i.unit
      FROM ToppingBOM tb
      JOIN Topping t ON tb.toppingId = t.id
      JOIN Ingredient i ON tb.ingredientId = i.id
      WHERE tb.toppingId = @toppingId
    `
    const result = await req.query(query)
    return result.recordset
  }

  async upsertRecipeBOM(data: RecipeBOMType) {
    const pool = await getPool()
    const req = pool.request()
    req.input('variantId', sql.Int, data.variantId)
    req.input('ingredientId', sql.Int, data.ingredientId)
    req.input('consumedQuantity', sql.Decimal(18, 4), data.consumedQuantity)
    return await req.execute('sp_UpsertRecipeBOM')
  }

  async upsertToppingBOM(data: ToppingBOMType) {
    const pool = await getPool()
    const req = pool.request()
    req.input('toppingId', sql.Int, data.toppingId)
    req.input('ingredientId', sql.Int, data.ingredientId)
    req.input('consumedQuantity', sql.Decimal(18, 4), data.consumedQuantity)

    const query = `
      MERGE INTO ToppingBOM AS target
      USING (SELECT @toppingId AS toppingId, @ingredientId AS ingredientId) AS src
      ON (target.toppingId = src.toppingId AND target.ingredientId = src.ingredientId)
      WHEN MATCHED THEN
        UPDATE SET target.consumedQuantity = @consumedQuantity
      WHEN NOT MATCHED THEN
        INSERT (toppingId, ingredientId, consumedQuantity) VALUES (@toppingId, @ingredientId, @consumedQuantity);
    `
    return await req.query(query)
  }

  async deleteRecipeBOM(variantId: number, ingredientId: number) {
    const pool = await getPool()
    const req = pool.request()
    req.input('variantId', sql.Int, variantId)
    req.input('ingredientId', sql.Int, ingredientId)
    const result = await req.query('DELETE FROM RecipeBOM WHERE variantId = @variantId AND ingredientId = @ingredientId')
    return result.rowsAffected[0]
  }
}
```

# src\modules\inventory-bom\bom\bom.routes.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\inventory-bom\bom\bom.routes.ts` |
| Size | 1,082 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 23:30:32.499211 |

```typescript
import { Router } from 'express'
import { BOMController } from './bom.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import {
  GetVariantBOMQuerySchema,
  RecipeBOMSchema,
  ToppingBOMSchema,
} from './bom.schema'

export const bomRouter = Router()
const controller = new BOMController()

bomRouter.use(authGuard)

// Xem định lượng món và topping
bomRouter.get(
  '/recipes',
  roleGuard('BARISTA', 'MANAGER'),
  validatePipe(GetVariantBOMQuerySchema, 'query'),
  controller.getRecipes
)

bomRouter.get(
  '/toppings/:toppingId',
  roleGuard('BARISTA', 'MANAGER'),
  controller.getToppingBOM
)

// Cấu hình định mức tiêu hao
bomRouter.post(
  '/recipes',
  roleGuard('MANAGER'),
  validatePipe(RecipeBOMSchema, 'body'),
  controller.upsertRecipe
)

bomRouter.post(
  '/toppings',
  roleGuard('MANAGER'),
  validatePipe(ToppingBOMSchema, 'body'),
  controller.upsertTopping
)

bomRouter.delete(
  '/recipes/:variantId/:ingredientId',
  roleGuard('MANAGER'),
  controller.deleteRecipe
)
```

# src\modules\inventory-bom\bom\bom.schema.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\inventory-bom\bom\bom.schema.ts` |
| Size | 1,049 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.211004 |

```typescript
import { z } from 'zod'

// Schema cho RecipeBOM (Biến thể sản phẩm)
export const RecipeBOMSchema = z.object({
  variantId: z.coerce.number().int().positive('variantId phải là số nguyên dương'),
  ingredientId: z.coerce.number().int().positive('ingredientId phải là số nguyên dương'),
  consumedQuantity: z.coerce.number().positive('Định mức tiêu hao phải > 0'),
})

// Schema cho ToppingBOM (Topping)
export const ToppingBOMSchema = z.object({
  toppingId: z.coerce.number().int().positive('toppingId phải là số nguyên dương'),
  ingredientId: z.coerce.number().int().positive('ingredientId phải là số nguyên dương'),
  consumedQuantity: z.coerce.number().positive('Định mức tiêu hao phải > 0'),
})

// Query lấy BOM theo variantId
export const GetVariantBOMQuerySchema = z.object({
  variantId: z.coerce.number().int().positive().optional(),
})

export type RecipeBOMType = z.infer<typeof RecipeBOMSchema>
export type ToppingBOMType = z.infer<typeof ToppingBOMSchema>
```

# src\modules\inventory-bom\bom\bom.service.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\inventory-bom\bom\bom.service.ts` |
| Size | 1,211 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.212004 |

```typescript
import { BOMRepo } from './bom.repo'
import { RecipeBOMType, ToppingBOMType } from './bom.schema'

export class BOMService {
  private bomRepo = new BOMRepo()

  async getRecipeDetails(variantId?: number) {
    return await this.bomRepo.getAllRecipeDetails(variantId)
  }

  async getToppingBOM(toppingId: number) {
    return await this.bomRepo.getToppingBOM(toppingId)
  }

  async upsertRecipeBOM(data: RecipeBOMType) {
    await this.bomRepo.upsertRecipeBOM(data)
    return {
      message: 'Cập nhật định lượng công thức (BOM) món thành công',
      data,
    }
  }

  async upsertToppingBOM(data: ToppingBOMType) {
    await this.bomRepo.upsertToppingBOM(data)
    return {
      message: 'Cập nhật định lượng công thức (BOM) topping thành công',
      data,
    }
  }

  async deleteRecipeBOM(variantId: number, ingredientId: number) {
    const affected = await this.bomRepo.deleteRecipeBOM(variantId, ingredientId)
    if (affected === 0) {
      throw new Error('Không tìm thấy định lượng công thức cần xóa')
    }
    return {
      message: 'Xóa nguyên liệu khỏi định lượng thành công',
    }
  }
}
```

# src\modules\inventory-bom\import\import.controller.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\inventory-bom\import\import.controller.ts` |
| Size | 1,369 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.213005 |

```typescript
import { Request, Response, NextFunction } from 'express'
import { ImportService } from './import.service'
import {
  CreateImportTicketSchema,
  ImportTicketParamsSchema,
  QueryImportTicketSchema,
} from './import.schema'

export class ImportController {
  private importService = new ImportService()

  getImportTickets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = QueryImportTicketSchema.parse(req.query)
      const data = await this.importService.getImportTickets(query)
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  getImportDetailById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { importId } = ImportTicketParamsSchema.parse(req.params)
      const data = await this.importService.getImportDetailById(importId)
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  createImportTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = CreateImportTicketSchema.parse(req.body)
      const result = await this.importService.createImportTicket(body)
      res.status(201).json({
        success: true,
        ...result,
      })
    } catch (error) {
      next(error)
    }
  }
}
```

# src\modules\inventory-bom\import\import.repo.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\inventory-bom\import\import.repo.ts` |
| Size | 2,736 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 22:48:00.289835 |

```typescript
import { getPool, sql } from '@/config/database'
import { QueryImportTicketType } from './import.schema'

export class ImportRepo {

   private buildImportDetailTVP(details: any[]): sql.Table {
    const tvp = new sql.Table('udt_InventoryImportDetailList')
    tvp.columns.add('ingredientId', sql.Int, { nullable: false })
    tvp.columns.add('quantity', sql.Decimal(18, 3), { nullable: false })
    tvp.columns.add('unitPrice', sql.Decimal(18, 2), { nullable: false })
    tvp.columns.add('totalLineAmount', sql.Decimal(18, 2), { nullable: false })

    for (const item of details) {
      const lineTotal = item.quantity * item.unitPrice
      tvp.rows.add(item.ingredientId, item.quantity, item.unitPrice, lineTotal)
    }
    return tvp
  }

  async findAll(query: QueryImportTicketType) {
    const pool = await getPool()
    const req = pool.request()
    let sqlStr = `
      SELECT ii.*, e.fullName AS employeeName 
      FROM InventoryImport ii
      JOIN Employee e ON ii.employeeId = e.id
      WHERE 1=1
    `
    if (query.supplierName) {
      req.input('supplierName', sql.NVarChar(255), `%${query.supplierName}%`)
      sqlStr += ' AND ii.supplierName LIKE @supplierName'
    }
    sqlStr += ' ORDER BY ii.importDate DESC'
    const result = await req.query(sqlStr)
    return result.recordset
  }

  async findById(id: number) {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)
    const result = await req.query('SELECT * FROM InventoryImport WHERE id = @id')
    return result.recordset[0] || null
  }

  async findDetailsByImportId(importId: number) {
    const pool = await getPool()
    const req = pool.request()
    req.input('importId', sql.Int, importId)
    const query = `
      SELECT iid.*, i.name AS ingredientName, i.unit
      FROM InventoryImportDetail iid
      JOIN Ingredient i ON iid.ingredientId = i.id
      WHERE iid.importId = @importId
    `
    const result = await req.query(query)
    return result.recordset
  }



  async createImportTicketWithProcedure(data: any) {
    const pool = await getPool()
    const req = pool.request()

    const tvp = this.buildImportDetailTVP(data.details)

    req.input('SupplierName', sql.NVarChar(255), data.supplierName)
    req.input('EmployeeId', sql.Int, data.employeeId)
    req.input('Note', sql.NVarChar(sql.MAX), data.note || null)
    req.input('ImportDetails', tvp)
    req.output('NewImportId', sql.Int)

    // Gọi trực tiếp Stored Procedure đúng chuẩn
    const result = await req.execute('sp_CreateInventoryImport')
    const importId = result.output.NewImportId

    return { importId, ...data }
  }
}
```

# src\modules\inventory-bom\import\import.routes.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\inventory-bom\import\import.routes.ts` |
| Size | 1,000 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 23:30:02.629013 |

```typescript
import { Router } from 'express'
import { ImportController } from './import.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import {
  CreateImportTicketSchema,
  ImportTicketParamsSchema,
  QueryImportTicketSchema,
} from './import.schema'

export const importRouter = Router()
const controller = new ImportController()

importRouter.use(authGuard, roleGuard('STOREKEEPER', 'MANAGER'))

// GET /api/v1/inventory/imports - Lấy danh sách phiếu nhập
importRouter.get(
  '/',
  validatePipe(QueryImportTicketSchema, 'query'),
  controller.getImportTickets
)

// GET /api/v1/inventory/imports/:importId - Xem chi tiết phiếu nhập
importRouter.get(
  '/:importId',
  validatePipe(ImportTicketParamsSchema, 'params'),
  controller.getImportDetailById
)

// POST /api/v1/inventory/imports - Tạo phiếu nhập kho mới
importRouter.post(
  '/',
  validatePipe(CreateImportTicketSchema, 'body'),
  controller.createImportTicket
)
```

# src\modules\inventory-bom\import\import.schema.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\inventory-bom\import\import.schema.ts` |
| Size | 1,385 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.215005 |

```typescript
import { z } from 'zod'

export const ImportDetailItemSchema = z.object({
  ingredientId: z.coerce.number().int().positive('Mã nguyên liệu không hợp lệ'),
  quantity: z.coerce.number().positive('Số lượng nhập phải lớn hơn 0'),
  unitPrice: z.coerce.number().min(0, 'Đơn giá nhập phải >= 0'),
})

export const CreateImportTicketSchema = z.object({
  supplierName: z.string().min(2, 'Tên nhà cung cấp tối thiểu 2 ký tự').max(150),
  employeeId: z.coerce.number().int().positive('Mã nhân viên thủ kho không hợp lệ'),
  note: z.string().max(255).optional(),
  details: z
    .array(ImportDetailItemSchema)
    .min(1, 'Phiếu nhập kho phải chứa ít nhất một mặt hàng nguyên liệu'),
})

export const ImportTicketParamsSchema = z.object({
  importId: z.coerce.number().int().positive('Mã phiếu nhập không hợp lệ'),
})

export const QueryImportTicketSchema = z.object({
  supplierName: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
})

export type ImportDetailItemType = z.infer<typeof ImportDetailItemSchema>
export type CreateImportTicketType = z.infer<typeof CreateImportTicketSchema>
export type ImportTicketParamsType = z.infer<typeof ImportTicketParamsSchema>
export type QueryImportTicketType = z.infer<typeof QueryImportTicketSchema>
```

# src\modules\inventory-bom\import\import.service.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\inventory-bom\import\import.service.ts` |
| Size | 1,351 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.217005 |

```typescript
import { ImportRepo } from './import.repo'
import { CreateImportTicketType, QueryImportTicketType } from './import.schema'

export class ImportService {
  private importRepo = new ImportRepo()

  async getImportTickets(query: QueryImportTicketType) {
    return await this.importRepo.findAll(query)
  }

  async getImportDetailById(importId: number) {
    const importTicket = await this.importRepo.findById(importId)
    if (!importTicket) {
      throw new Error(`Không tìm thấy phiếu nhập kho với mã #${importId}`)
    }
    const details = await this.importRepo.findDetailsByImportId(importId)
    return {
      ...importTicket,
      details,
    }
  }

  async createImportTicket(data: CreateImportTicketType) {
    // Tự động tính tổng tiền phiếu nhập từ danh sách chi tiết dòng
    const calculatedTotalAmount = data.details.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    )

    // Gọi Repo để thực thi Stored Procedure sp_LapPhieuNhapKho
    const result = await this.importRepo.createImportTicketWithProcedure({
      ...data,
      totalAmount: calculatedTotalAmount,
    })

    return {
      message: 'Lập phiếu nhập kho thành công. Tồn kho đã được tự động cập nhật.',
      data: result,
    }
  }
}
```

# src\modules\inventory-bom\ingredient\ingredient.controller.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\inventory-bom\ingredient\ingredient.controller.ts` |
| Size | 2,417 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.218005 |

```typescript
import { Request, Response, NextFunction } from 'express'
import { IngredientService } from './ingredient.service'
import {
  CreateIngredientSchema,
  IngredientParamsSchema,
  QueryIngredientSchema,
  UpdateIngredientSchema,
} from './ingredient.schema'

export class IngredientController {
  private ingredientService = new IngredientService()

  getIngredients = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = QueryIngredientSchema.parse(req.query)
      const data = await this.ingredientService.getIngredients(query)
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  getIngredientById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ingredientId } = IngredientParamsSchema.parse(req.params)
      const data = await this.ingredientService.getIngredientById(ingredientId)
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  createIngredient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = CreateIngredientSchema.parse(req.body)
      const data = await this.ingredientService.createIngredient(body)
      res.status(201).json({
        success: true,
        message: 'Thêm mới nguyên liệu thành công',
        data,
      })
    } catch (error) {
      next(error)
    }
  }

  updateIngredient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ingredientId } = IngredientParamsSchema.parse(req.params)
      const body = UpdateIngredientSchema.parse(req.body)
      const data = await this.ingredientService.updateIngredient(ingredientId, body)
      res.status(200).json({
        success: true,
        message: 'Cập nhật thông tin nguyên liệu thành công',
        data,
      })
    } catch (error) {
      next(error)
    }
  }

  deleteIngredient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ingredientId } = IngredientParamsSchema.parse(req.params)
      await this.ingredientService.deleteIngredient(ingredientId)
      res.status(200).json({
        success: true,
        message: 'Đã xóa nguyên liệu thành công (Soft Delete)',
      })
    } catch (error) {
      next(error)
    }
  }
}
```

# src\modules\inventory-bom\ingredient\ingredient.repo.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\inventory-bom\ingredient\ingredient.repo.ts` |
| Size | 3,440 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:51:16.082873 |

```typescript
import { getPool, sql } from '@/config/database'
import { CreateIngredientType, UpdateIngredientType } from './ingredient.schema'

export class IngredientRepo {
  async findAll(name?: string) {
    const pool = await getPool()
    const req = pool.request()
    let query = 'SELECT id, name, unit, stockQuantity, minimumThreshold, createdAt, updatedAt FROM Ingredient WHERE deletedAt IS NULL'
    if (name) {
      req.input('name', sql.NVarChar(150), `%${name}%`)
      query += ' AND name LIKE @name'
    }
    query += ' ORDER BY name ASC'
    const result = await req.query(query)
    return result.recordset
  }

  async findById(id: number) {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)
    const result = await req.query('SELECT * FROM Ingredient WHERE id = @id AND deletedAt IS NULL')
    return result.recordset[0] || null
  }

  async findByName(name: string) {
    const pool = await getPool()
    const req = pool.request()
    req.input('name', sql.NVarChar(150), name)
    const result = await req.query('SELECT id FROM Ingredient WHERE name = @name AND deletedAt IS NULL')
    return result.recordset[0] || null
  }

  async getLowStockIngredients() {
    const pool = await getPool()
    const result = await pool.request().query('SELECT * FROM v_LowStockIngredients')
    return result.recordset
  }

  async create(data: CreateIngredientType) {
    const pool = await getPool()
    const req = pool.request()
    req.input('name', sql.NVarChar(150), data.name)
    req.input('unit', sql.NVarChar(50), data.unit)
    req.input('stockQuantity', sql.Decimal(18, 3), data.stockQuantity)
    req.input('minimumThreshold', sql.Decimal(18, 3), data.minimumThreshold)

    const query = `
      INSERT INTO Ingredient (name, unit, stockQuantity, minimumThreshold, createdAt)
      OUTPUT INSERTED.*
      VALUES (@name, @unit, @stockQuantity, @minimumThreshold, SYSDATETIME())
    `
    const result = await req.query(query)
    return result.recordset[0]
  }

  async update(id: number, data: UpdateIngredientType) {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)

    const sets: string[] = ['updatedAt = SYSDATETIME()']
    if (data.name !== undefined) {
      req.input('name', sql.NVarChar(150), data.name)
      sets.push('name = @name')
    }
    if (data.unit !== undefined) {
      req.input('unit', sql.NVarChar(50), data.unit)
      sets.push('unit = @unit')
    }
    if (data.stockQuantity !== undefined) {
      req.input('stockQuantity', sql.Decimal(18, 3), data.stockQuantity)
      sets.push('stockQuantity = @stockQuantity')
    }
    if (data.minimumThreshold !== undefined) {
      req.input('minimumThreshold', sql.Decimal(18, 3), data.minimumThreshold)
      sets.push('minimumThreshold = @minimumThreshold')
    }

    const query = `UPDATE Ingredient SET ${sets.join(', ')} OUTPUT INSERTED.* WHERE id = @id AND deletedAt IS NULL`
    const result = await req.query(query)
    return result.recordset[0] || null
  }

  async softDelete(id: number) {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)
    const result = await req.query('UPDATE Ingredient SET deletedAt = SYSDATETIME() WHERE id = @id AND deletedAt IS NULL')
    return result.rowsAffected[0] > 0
  }
}
```

# src\modules\inventory-bom\ingredient\ingredient.routes.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\inventory-bom\ingredient\ingredient.routes.ts` |
| Size | 1,420 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 23:29:52.037301 |

```typescript
import { Router } from 'express'
import { IngredientController } from './ingredient.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import {
  CreateIngredientSchema,
  IngredientParamsSchema,
  QueryIngredientSchema,
  UpdateIngredientSchema,
} from './ingredient.schema'

export const ingredientRouter = Router()
const controller = new IngredientController()

ingredientRouter.use(authGuard)

// Xem nguyên liệu
ingredientRouter.get(
  '/',
  roleGuard('STOREKEEPER', 'MANAGER', 'BARISTA'),
  validatePipe(QueryIngredientSchema, 'query'),
  controller.getIngredients
)

ingredientRouter.get(
  '/:ingredientId',
  roleGuard('STOREKEEPER', 'MANAGER', 'BARISTA'),
  validatePipe(IngredientParamsSchema, 'params'),
  controller.getIngredientById
)

// Tạo mới & cập nhật nguyên liệu
ingredientRouter.post(
  '/',
  roleGuard('STOREKEEPER', 'MANAGER'),
  validatePipe(CreateIngredientSchema, 'body'),
  controller.createIngredient
)

ingredientRouter.put(
  '/:ingredientId',
  roleGuard('STOREKEEPER', 'MANAGER'),
  validatePipe(IngredientParamsSchema, 'params'),
  validatePipe(UpdateIngredientSchema, 'body'),
  controller.updateIngredient
)

// Xóa mềm nguyên liệu
ingredientRouter.delete(
  '/:ingredientId',
  roleGuard('MANAGER'),
  validatePipe(IngredientParamsSchema, 'params'),
  controller.deleteIngredient
)
```

# src\modules\inventory-bom\ingredient\ingredient.schema.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\inventory-bom\ingredient\ingredient.schema.ts` |
| Size | 1,178 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.221004 |

```typescript
import { z } from 'zod'

export const CreateIngredientSchema = z.object({
  name: z.string().min(2, 'Tên nguyên liệu tối thiểu 2 ký tự').max(100),
  unit: z.string().min(1, 'Đơn vị tính không được để trống').max(20),
  stockQuantity: z.coerce.number().min(0, 'Số lượng tồn kho ban đầu phải >= 0').default(0),
  minimumThreshold: z.coerce.number().min(0, 'Ngưỡng cảnh báo tối thiểu phải >= 0').default(5),
})

export const UpdateIngredientSchema = CreateIngredientSchema.partial()

export const IngredientParamsSchema = z.object({
  ingredientId: z.coerce.number().int().positive('Mã nguyên liệu không hợp lệ'),
})

export const QueryIngredientSchema = z.object({
  name: z.string().optional(),
  isLowStock: z
    .preprocess((val) => val === 'true' || val === true, z.boolean())
    .optional(),
})

export type CreateIngredientType = z.infer<typeof CreateIngredientSchema>
export type UpdateIngredientType = z.infer<typeof UpdateIngredientSchema>
export type IngredientParamsType = z.infer<typeof IngredientParamsSchema>
export type QueryIngredientType = z.infer<typeof QueryIngredientSchema>
```

# src\modules\inventory-bom\ingredient\ingredient.service.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\inventory-bom\ingredient\ingredient.service.ts` |
| Size | 1,696 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.222003 |

```typescript
import { IngredientRepo } from './ingredient.repo'
import {
  CreateIngredientType,
  QueryIngredientType,
  UpdateIngredientType,
} from './ingredient.schema'

export class IngredientService {
  private ingredientRepo = new IngredientRepo()

  async getIngredients(query: QueryIngredientType) {
    if (query.isLowStock) {
      // Truy vấn từ View v_LowStockIngredients trong CSDL
      return await this.ingredientRepo.getLowStockIngredients()
    }
    return await this.ingredientRepo.findAll(query.name)
  }

  async getIngredientById(id: number) {
    const ingredient = await this.ingredientRepo.findById(id)
    if (!ingredient) {
      throw new Error('Không tìm thấy thông tin nguyên liệu')
    }
    return ingredient
  }

  async createIngredient(data: CreateIngredientType) {
    const isExisted = await this.ingredientRepo.findByName(data.name)
    if (isExisted) {
      throw new Error(`Nguyên liệu "${data.name}" đã tồn tại trên hệ thống`)
    }
    return await this.ingredientRepo.create(data)
  }

  async updateIngredient(id: number, data: UpdateIngredientType) {
    const existed = await this.ingredientRepo.findById(id)
    if (!existed) {
      throw new Error('Không tìm thấy nguyên liệu để cập nhật')
    }
    return await this.ingredientRepo.update(id, data)
  }

  async deleteIngredient(id: number) {
    const existed = await this.ingredientRepo.findById(id)
    if (!existed) {
      throw new Error('Không tìm thấy nguyên liệu để xóa')
    }
    // Thực hiện xóa mềm theo quy định Soft Delete
    return await this.ingredientRepo.softDelete(id)
  }
}
```

# src\modules\inventory-bom\inventory.routes.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\inventory-bom\inventory.routes.ts` |
| Size | 508 bytes |
| Extension | `.ts` |
| Modified | 2026-09-23 23:13:04.153120 |

```typescript
import { Router } from 'express'
import { ingredientRouter } from './ingredient/ingredient.routes'
import { bomRouter } from './bom/bom.routes'
import { importRouter } from './import/import.routes'
import { adjustmentRouter } from './adjustment/adjustment.routes'

export const inventoryRouter = Router()
inventoryRouter.use('/ingredients', ingredientRouter)
inventoryRouter.use('/boms', bomRouter)
inventoryRouter.use('/imports', importRouter)
inventoryRouter.use('/adjustments', adjustmentRouter)
```

# src\modules\kds\kds.controller.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\kds\kds.controller.ts` |
| Size | 1,394 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 23:07:23.066945 |

```typescript
import { Request, Response, NextFunction } from 'express'
import { KDSService } from './kds.service'
import {
  KdsParamSchema,
  NotifyOrderReadySchema,
  QueryKdsQueueSchema,
  UpdateItemStatusSchema,
} from './kds.schema'

export class KDSController {
  private kdsService = new KDSService()

  getQueue = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = QueryKdsQueueSchema.parse(req.query)
      const data = await this.kdsService.getQueue(query)
      res.status(200).json({ success: true, count: data.length, data })
    } catch (error) {
      next(error)
    }
  }

  updateItemStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderDetailId } = KdsParamSchema.parse(req.params)
      const body = UpdateItemStatusSchema.parse(req.body)
      const result = await this.kdsService.updateItemStatus(orderDetailId, body)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  notifyReady = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = NotifyOrderReadySchema.parse(req.params)
      const result = await this.kdsService.notifyOrderReady(orderId)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }
}
```

# src\modules\kds\kds.repo.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\kds\kds.repo.ts` |
| Size | 4,411 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 22:55:04.047743 |

```typescript
import { getPool, sql } from "@/config/database";
import { QueryKdsQueueType, UpdateItemStatusType } from "./kds.schema";

export class KDSRepo {
  // 1. Lấy danh sách hàng đợi các món cần pha chế trên KDS (UC17)
  async getKdsQueue(query: QueryKdsQueueType) {
    const pool = await getPool();
    const req = pool.request();

    const conditions: string[] = [
      "o.status IN ('PENDING_PREP', 'READY_FOR_PICKUP')",
      "od.itemStatus NOT IN ('DONE', 'CANCELLED')",
      "o.deletedAt IS NULL",
    ];

    if (query.status !== "ALL") {
      req.input("itemStatus", sql.NVarChar(50), query.status);
      conditions.push("od.itemStatus = @itemStatus");
    }

    const sqlStr = `
      SELECT 
        o.id AS orderId,
        o.orderCode,
        o.orderChannel,
        p.pagerCode,
        p.batteryLevel,
        od.id AS orderDetailId,
        od.itemSnapshotName,
        od.sizeSnapshot,
        od.quantity,
        od.note,
        od.itemStatus,
        od.createdAt AS itemCreatedAt,
        DATEDIFF(MINUTE, od.createdAt, SYSDATETIME()) AS waitingMinutes
      FROM OrderDetail od
      JOIN [Order] o ON od.orderId = o.id
      LEFT JOIN PagerDevice p ON o.pagerId = p.id
      WHERE ${conditions.join(" AND ")}
      ORDER BY od.createdAt ASC
    `;
    const itemsResult = await req.query(sqlStr);

    // Nếu không có món nào
    if (itemsResult.recordset.length === 0) {
      return [];
    }

    // Lấy kèm topping cho từng ly
    const detailIds = itemsResult.recordset.map((item) => item.orderDetailId);
    let toppingsByDetailId: Record<number, any[]> = {};

    if (detailIds.length > 0) {
      const topReq = pool.request();
      const paramNames = detailIds.map((id, index) => {
        topReq.input(`id${index}`, sql.Int, id);
        return `@id${index}`;
      });

      const toppingResult = await topReq.query(`
    SELECT orderDetailId, toppingSnapshotName, quantity 
    FROM OrderDetailTopping
    WHERE orderDetailId IN (${paramNames.join(",")})
  `);

      toppingsByDetailId = toppingResult.recordset.reduce(
        (acc: any, top: any) => {
          if (!acc[top.orderDetailId]) acc[top.orderDetailId] = [];
          acc[top.orderDetailId].push({
            name: top.toppingSnapshotName,
            quantity: top.quantity,
          });
          return acc;
        },
        {},
      );
    }

    // Ghép topping vào từng dòng ly nước
    return itemsResult.recordset.map((item) => ({
      ...item,
      toppings: toppingsByDetailId[item.orderDetailId] || [],
    }));
  }

  // 2. Barista cập nhật trạng thái món -> Nếu chuyển sang 'DONE',
  // Trigger trg_Ingredient_TruKho_KhiHoanThanhMon dưới CSDL sẽ tự động trừ kho BOM!
  async updateItemStatus(orderDetailId: number, data: UpdateItemStatusType) {
    const pool = await getPool();
    const req = pool.request();

    req.input("orderDetailId", sql.Int, orderDetailId);
    req.input("itemStatus", sql.NVarChar(50), data.itemStatus);

    const result = await req.query(`
      UPDATE OrderDetail
      SET itemStatus = @itemStatus,
          updatedAt = SYSDATETIME()
      OUTPUT 
        INSERTED.id,
        INSERTED.orderId,
        INSERTED.itemSnapshotName,
        INSERTED.sizeSnapshot,
        INSERTED.itemStatus,
        INSERTED.updatedAt
      WHERE id = @orderDetailId
    `);

    return result.recordset[0] || null;
  }

  // 3. Rung chuông thẻ rung & Chuyển trạng thái Order sang READY_FOR_PICKUP (UC18, UC19)
 // modules/kds/kds.repo.ts

  async triggerReadyAlarm(orderId: number) {
    const pool = await getPool();
    const req = pool.request();

    req.input("OrderId", sql.Int, orderId);
    req.output("PagerId", sql.Int);
    req.output("PendingCount", sql.Int);

    // Gọi Stored Procedure đóng gói trọn vẹn nghiệp vụ
    const result = await req.execute("sp_KDS_NotifyOrderReady");

    const pagerId = result.output.PagerId;
    const pendingCount = result.output.PendingCount;

    return {
      orderId,
      status: "READY_FOR_PICKUP",
      pagerId,
      itemsCompleted: pendingCount,
      alarmTriggered: true,
      message: "Đã kích hoạt thẻ rung và cập nhật đơn hàng sẵn sàng nhận đồ uống.",
    };
  }
}

```

# src\modules\kds\kds.routes.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\kds\kds.routes.ts` |
| Size | 1,206 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 23:29:18.094657 |

```typescript
import { Router } from 'express'
import { KDSController } from './kds.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import {
  KdsParamSchema,
  NotifyOrderReadySchema,
  QueryKdsQueueSchema,
  UpdateItemStatusSchema,
} from './kds.schema'

export const kdsRouter = Router()
const controller = new KDSController()

// Chặn toàn bộ: Yêu cầu đăng nhập và chỉ cho phép BARISTA hoặc MANAGER
kdsRouter.use(authGuard, roleGuard('BARISTA', 'MANAGER'))

// GET /api/v1/kds/queue - Xem danh sách món đang chờ pha chế
kdsRouter.get(
  '/queue',
  validatePipe(QueryKdsQueueSchema, 'query'),
  controller.getQueue
)

// PATCH /api/v1/kds/items/:orderDetailId/status - Cập nhật trạng thái ly nước (DONE kích hoạt Trigger trừ kho)
kdsRouter.patch(
  '/items/:orderDetailId/status',
  validatePipe(KdsParamSchema, 'params'),
  validatePipe(UpdateItemStatusSchema, 'body'),
  controller.updateItemStatus
)

// POST /api/v1/kds/orders/:orderId/notify-ready - Kích hoạt rung chuông thẻ rung báo khách lấy nước
kdsRouter.post(
  '/orders/:orderId/notify-ready',
  validatePipe(NotifyOrderReadySchema, 'params'),
  controller.notifyReady
)
```

# src\modules\kds\kds.schema.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\kds\kds.schema.ts` |
| Size | 860 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 23:06:51.078593 |

```typescript
import { z } from 'zod'

// Query lọc màn hình KDS
export const QueryKdsQueueSchema = z.object({
  status: z.enum(['ALL', 'PENDING', 'PREPARING']).default('ALL'),
})

// Cập nhật trạng thái từng ly nước
export const UpdateItemStatusSchema = z.object({
  itemStatus: z.enum(['PREPARING', 'DONE', 'CANCELLED'], {
    errorMap: () => ({ message: 'Trạng thái món phải là PREPARING, DONE hoặc CANCELLED' }),
  }),
})

export const KdsParamSchema = z.object({
  orderDetailId: z.coerce.number().int().positive('orderDetailId không hợp lệ'),
})

export const NotifyOrderReadySchema = z.object({
  orderId: z.coerce.number().int().positive('orderId không hợp lệ'),
})

export type QueryKdsQueueType = z.infer<typeof QueryKdsQueueSchema>
export type UpdateItemStatusType = z.infer<typeof UpdateItemStatusSchema>
```

# src\modules\kds\kds.service.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\kds\kds.service.ts` |
| Size | 839 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 23:07:15.306226 |

```typescript
import { KDSRepo } from './kds.repo'
import { QueryKdsQueueType, UpdateItemStatusType } from './kds.schema'

export class KDSService {
  private kdsRepo = new KDSRepo()

  async getQueue(query: QueryKdsQueueType) {
    return await this.kdsRepo.getKdsQueue(query)
  }

  async updateItemStatus(orderDetailId: number, data: UpdateItemStatusType) {
    const item = await this.kdsRepo.updateItemStatus(orderDetailId, data)
    if (!item) {
      throw new Error('Không tìm thấy dòng món trong đơn hàng')
    }
    return {
      message: `Cập nhật trạng thái món sang [${data.itemStatus}] thành công. Kho nguyên liệu đã được đồng bộ tự động.`,
      data: item,
    }
  }

  async notifyOrderReady(orderId: number) {
    return await this.kdsRepo.triggerReadyAlarm(orderId)
  }
}
```

# src\modules\menu-catalog\category\category.controller.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\menu-catalog\category\category.controller.ts` |
| Size | 2,502 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:34:54.063253 |

```typescript
import { Request, Response } from 'express'
import { CategoryService } from './category.service'

export class CategoryController {
  private categoryService = new CategoryService()

  getAll = async (req: Request, res: Response) => {
    try {
      const categories = await this.categoryService.getAllCategories(req.query as any)
      res.status(200).json({ success: true, data: categories })
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Lỗi hệ thống' })
    }
  }

  getById = async (req: Request, res: Response) => {
    try {
      const category = await this.categoryService.getCategoryById(Number(req.params.id))
      res.status(200).json({ success: true, data: category })
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message || 'Danh mục không tồn tại' })
    }
  }

  create = async (req: Request, res: Response) => {
    try {
      const newCategory = await this.categoryService.createCategory(req.body)
      res.status(201).json({ success: true, data: newCategory })
    } catch (error: any) {
      const message = error.message || 'Lỗi tạo danh mục'
      const statusCode = message.includes('đã tồn tại') ? 409 : 400
      res.status(statusCode).json({ success: false, message })
    }
  }

  update = async (req: Request, res: Response) => {
    try {
      const updated = await this.categoryService.updateCategory(Number(req.params.id), req.body)
      res.status(200).json({ success: true, data: updated })
    } catch (error: any) {
      const message = error.message || 'Lỗi cập nhật danh mục'
      let statusCode = 400
      if (message.includes('không tồn tại')) statusCode = 404
      if (message.includes('đã tồn tại')) statusCode = 409

      res.status(statusCode).json({ success: false, message })
    }
  }

  delete = async (req: Request, res: Response) => {
    try {
      await this.categoryService.deleteCategory(Number(req.params.id))
      res.status(200).json({ success: true, message: 'Đã xóa danh mục thành công' })
    } catch (error: any) {
      const message = error.message || 'Lỗi xóa danh mục'
      let statusCode = 400
      if (message.includes('không tồn tại')) statusCode = 404
      if (message.includes('sản phẩm liên kết')) statusCode = 409

      res.status(statusCode).json({ success: false, message })
    }
  }
}
```

# src\modules\menu-catalog\category\category.repo.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\menu-catalog\category\category.repo.ts` |
| Size | 5,045 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:34:54.065461 |

```typescript
import { getPool, sql } from '@/config/database'
import {
  CreateCategoryType,
  FilterCategoryQueryType,
  UpdateCategoryType,
} from './category.schema'

export interface Category {
  id: number
  name: string
  displayStatus: 'SHOW' | 'HIDE'
  createdAt: Date
  updatedAt?: Date | null
  deletedAt?: Date | null
}

export class CategoryRepository {
  /**
   * Lấy danh sách danh mục (hỗ trợ lọc displayStatus & tìm kiếm name)
   */
  async findAll(filters?: FilterCategoryQueryType): Promise<Category[]> {
    const pool = await getPool()
    const req = pool.request()
    const conditions: string[] = ['deletedAt IS NULL']

    const displayStatus =
      typeof filters?.displayStatus === 'string' ? filters.displayStatus : undefined
    const search =
      typeof filters?.search === 'string' ? filters.search : undefined

    if (displayStatus) {
      req.input('displayStatus', sql.NVarChar(50), displayStatus)
      conditions.push('displayStatus = @displayStatus')
    }

    if (search) {
      req.input('search', sql.NVarChar(150), `%${search}%`)
      conditions.push('name LIKE @search')
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`
    const query = `
      SELECT id, name, displayStatus, createdAt, updatedAt
      FROM Category
      ${whereClause}
      ORDER BY id ASC
    `
    const result = await req.query<Category>(query)
    return result.recordset
  }

  /**
   * Lấy chi tiết danh mục theo ID
   */
  async findById(id: number): Promise<Category | null> {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)
    const result = await req.query<Category>(`
      SELECT id, name, displayStatus, createdAt, updatedAt
      FROM Category
      WHERE id = @id AND deletedAt IS NULL
    `)
    return result.recordset[0] || null
  }

  /**
   * Tìm danh mục theo tên (hỗ trợ loại trừ ID khi update)
   */
  async findByName(name: string, excludeId?: number): Promise<Category | null> {
    const pool = await getPool()
    const req = pool.request()
    req.input('name', sql.NVarChar(150), name)

    let query = `
      SELECT id, name, displayStatus, createdAt, updatedAt
      FROM Category
      WHERE name = @name AND deletedAt IS NULL
    `

    if (excludeId) {
      req.input('excludeId', sql.Int, excludeId)
      query += ` AND id <> @excludeId`
    }

    const result = await req.query<Category>(query)
    return result.recordset[0] || null
  }

  /**
   * Đếm số lượng sản phẩm thuộc danh mục
   */
  async countProductsByCategoryId(categoryId: number): Promise<number> {
    const pool = await getPool()
    const req = pool.request()
    req.input('categoryId', sql.Int, categoryId)
    const result = await req.query<{ count: number }>(`
      SELECT COUNT(1) AS count 
      FROM Product 
      WHERE categoryId = @categoryId AND deletedAt IS NULL
    `)
    return result.recordset[0]?.count || 0
  }

  /**
   * Tạo danh mục mới
   */
  async create(data: CreateCategoryType): Promise<Category> {
    const pool = await getPool()
    const req = pool.request()
    req.input('name', sql.NVarChar(150), data.name)
    req.input('displayStatus', sql.NVarChar(50), data.displayStatus || 'SHOW')

    const result = await req.query<Category>(`
      INSERT INTO Category (name, displayStatus, createdAt)
      OUTPUT INSERTED.id, INSERTED.name, INSERTED.displayStatus, INSERTED.createdAt, INSERTED.updatedAt
      VALUES (@name, @displayStatus, SYSDATETIME())
    `)
    return result.recordset[0]
  }

  /**
   * Cập nhật thông tin danh mục
   */
  async update(id: number, data: UpdateCategoryType): Promise<Category | null> {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)

    const setClauses: string[] = ['updatedAt = SYSDATETIME()']

    if (data.name !== undefined) {
      req.input('name', sql.NVarChar(150), data.name)
      setClauses.push('name = @name')
    }
    if (data.displayStatus !== undefined) {
      req.input('displayStatus', sql.NVarChar(50), data.displayStatus)
      setClauses.push('displayStatus = @displayStatus')
    }

    const query = `
      UPDATE Category
      SET ${setClauses.join(', ')}
      OUTPUT INSERTED.id, INSERTED.name, INSERTED.displayStatus, INSERTED.createdAt, INSERTED.updatedAt
      WHERE id = @id AND deletedAt IS NULL
    `
    const result = await req.query<Category>(query)
    return result.recordset[0] || null
  }

  /**
   * Xóa mềm danh mục
   */
  async delete(id: number): Promise<boolean> {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)
    const result = await req.query(`
      UPDATE Category 
      SET deletedAt = SYSDATETIME() 
      WHERE id = @id AND deletedAt IS NULL
    `)
    return (result.rowsAffected[0] ?? 0) > 0
  }
}
```

# src\modules\menu-catalog\category\category.routes.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\menu-catalog\category\category.routes.ts` |
| Size | 1,256 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:35:22.874179 |

```typescript
import { Router } from 'express'
import { CategoryController } from './category.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import {
  CategoryParamSchema,
  CreateCategorySchema,
  FilterCategoryQuerySchema,
  UpdateCategorySchema,
} from './category.schema'

export const categoryRouter = Router()
const controller = new CategoryController()

// Xem danh mục: Public cho Customer tra cứu menu và Cashier bán hàng
categoryRouter.get(
  '/',
  validatePipe(FilterCategoryQuerySchema, 'query'),
  controller.getAll
)

categoryRouter.get(
    '/:id',
    validatePipe(CategoryParamSchema, 'params'),
    controller.getById
)

// Quản lý danh mục: Yêu cầu quyền MANAGER
categoryRouter.post(
    '/',
    authGuard,
    roleGuard('MANAGER'),
    validatePipe(CreateCategorySchema, 'body'),
    controller.create
)

categoryRouter.put(
    '/:id',
    authGuard,
    roleGuard('MANAGER'),
    validatePipe(CategoryParamSchema, 'params'),
    validatePipe(UpdateCategorySchema, 'body'),
    controller.update
)

categoryRouter.delete(
    '/:id',
    authGuard,
    roleGuard('MANAGER'),
    validatePipe(CategoryParamSchema, 'params'),
    controller.delete
)
```

# src\modules\menu-catalog\category\category.schema.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\menu-catalog\category\category.schema.ts` |
| Size | 1,084 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:34:54.069941 |

```typescript
import { z } from 'zod'

export const CreateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Tên danh mục không được để trống')
    .max(150, 'Tên danh mục tối đa 150 ký tự'),
  displayStatus: z.enum(['SHOW', 'HIDE']).default('SHOW'),
})

export const UpdateCategorySchema = CreateCategorySchema.partial()

export const CategoryParamSchema = z.object({
  id: z.coerce.number().int().positive('ID danh mục không hợp lệ'),
})

export const FilterCategoryQuerySchema = z.object({
  displayStatus: z.enum(['SHOW', 'HIDE']).optional(),
  search: z.string().trim().optional(),
})

export type CreateCategoryType = z.infer<typeof CreateCategorySchema>
export type UpdateCategoryType = z.infer<typeof UpdateCategorySchema>
export type CategoryParamType = z.infer<typeof CategoryParamSchema>
export type FilterCategoryQueryType = z.infer<typeof FilterCategoryQuerySchema>

// DTO aliases for compatibility
export type CreateCategoryDto = CreateCategoryType
export type UpdateCategoryDto = UpdateCategoryType
```

# src\modules\menu-catalog\category\category.service.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\menu-catalog\category\category.service.ts` |
| Size | 1,631 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:34:54.071940 |

```typescript
import { CategoryRepository } from './category.repo'
import {
  CreateCategoryType,
  FilterCategoryQueryType,
  UpdateCategoryType,
} from './category.schema'

export class CategoryService {
  private categoryRepo = new CategoryRepository()

  async getAllCategories(filters?: FilterCategoryQueryType) {
    return await this.categoryRepo.findAll(filters)
  }

  async getCategoryById(id: number) {
    const category = await this.categoryRepo.findById(id)
    if (!category) {
      throw new Error('Danh mục không tồn tại')
    }
    return category
  }

  async createCategory(dto: CreateCategoryType) {
    const existing = await this.categoryRepo.findByName(dto.name)
    if (existing) {
      throw new Error('Tên danh mục đã tồn tại')
    }
    return await this.categoryRepo.create(dto)
  }

  async updateCategory(id: number, dto: UpdateCategoryType) {
    await this.getCategoryById(id)

    if (dto.name) {
      const existing = await this.categoryRepo.findByName(dto.name, id)
      if (existing) {
        throw new Error('Tên danh mục đã tồn tại')
      }
    }

    return await this.categoryRepo.update(id, dto)
  }

  async deleteCategory(id: number) {
    await this.getCategoryById(id)

    // Kiểm tra xem danh mục có đang chứa sản phẩm hay không
    const productCount = await this.categoryRepo.countProductsByCategoryId(id)
    if (productCount > 0) {
      throw new Error(`Không thể xóa danh mục đang có ${productCount} sản phẩm liên kết`)
    }

    return await this.categoryRepo.delete(id)
  }
}
```

# src\modules\menu-catalog\menu.routes.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\menu-catalog\menu.routes.ts` |
| Size | 382 bytes |
| Extension | `.ts` |
| Modified | 2026-09-23 23:12:55.530424 |

```typescript
import { Router } from 'express'
import { categoryRouter } from './category/category.routes'
import { productRouter } from './product/product.routes'
import { toppingRouter } from './topping/topping.routes'

export const menuRouter = Router()
menuRouter.use('/categories', categoryRouter)
menuRouter.use('/products', productRouter)
menuRouter.use('/toppings', toppingRouter)
```

# src\modules\menu-catalog\product\product.controller.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\menu-catalog\product\product.controller.ts` |
| Size | 2,651 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:34:54.074675 |

```typescript
import { Request, Response } from 'express'
import { ProductService } from './product.service'

export class ProductController {
  private productService = new ProductService()

  /**
   * Lấy danh sách sản phẩm (có lọc/tìm kiếm)
   */
  getAll = async (req: Request, res: Response) => {
    try {
      const products = await this.productService.getProducts(req.query as any)
      res.status(200).json({ success: true, data: products })
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Lỗi hệ thống' })
    }
  }

  /**
   * Lấy chi tiết sản phẩm theo ID
   */
  getById = async (req: Request, res: Response) => {
    try {
      const product = await this.productService.getProductById(Number(req.params.id))
      res.status(200).json({ success: true, data: product })
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message || 'Sản phẩm không tồn tại' })
    }
  }

  /**
   * Tạo sản phẩm mới
   */
  create = async (req: Request, res: Response) => {
    try {
      const product = await this.productService.createProduct(req.body)
      res.status(201).json({ success: true, data: product })
    } catch (error: any) {
      const message = error.message || 'Lỗi tạo sản phẩm'
      const statusCode = message.includes('đã tồn tại') ? 409 : 400
      res.status(statusCode).json({ success: false, message })
    }
  }

  /**
   * Cập nhật sản phẩm
   */
  update = async (req: Request, res: Response) => {
    try {
      const updated = await this.productService.updateProduct(Number(req.params.id), req.body)
      res.status(200).json({ success: true, data: updated })
    } catch (error: any) {
      const message = error.message || 'Lỗi cập nhật sản phẩm'
      let statusCode = 400
      if (message.includes('không tồn tại')) statusCode = 404
      if (message.includes('đã tồn tại')) statusCode = 409

      res.status(statusCode).json({ success: false, message })
    }
  }

  /**
   * Xóa mềm sản phẩm
   */
  delete = async (req: Request, res: Response) => {
    try {
      await this.productService.deleteProduct(Number(req.params.id))
      res.status(200).json({ success: true, message: 'Đã xóa sản phẩm thành công' })
    } catch (error: any) {
      const message = error.message || 'Lỗi xóa sản phẩm'
      const statusCode = message.includes('không tồn tại') ? 404 : 400
      res.status(statusCode).json({ success: false, message })
    }
  }
}
```

# src\modules\menu-catalog\product\product.repo.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\menu-catalog\product\product.repo.ts` |
| Size | 10,810 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:34:54.076688 |

```typescript
import { getPool, sql } from '@/config/database'
import {
  CreateProductType,
  FilterProductQueryType,
  UpdateProductType,
} from './product.schema'

export interface ProductVariantRow {
  id: number
  productId: number
  size: 'S' | 'M' | 'L' | 'XL'
  price: number
  createdAt: Date
  updatedAt?: Date | null
}

export interface ProductDetail {
  id: number
  categoryId: number
  categoryName?: string
  name: string
  description?: string | null
  image?: string | null
  status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK'
  createdAt: Date
  updatedAt?: Date | null
  variants: ProductVariantRow[]
}

export class ProductRepository {
  /**
   * Lấy danh sách sản phẩm kèm mảng biến thể (Dùng FOR JSON PATH - 1 query duy nhất)
   */
  async findAll(filter: FilterProductQueryType): Promise<ProductDetail[]> {
    const pool = await getPool()
    const req = pool.request()

    const conditions: string[] = ['p.deletedAt IS NULL']

    if (filter.categoryId) {
      req.input('categoryId', sql.Int, filter.categoryId)
      conditions.push('p.categoryId = @categoryId')
    }

    if (filter.status) {
      req.input('status', sql.NVarChar(50), filter.status)
      conditions.push('p.status = @status')
    }

    if (filter.search) {
      req.input('search', sql.NVarChar(200), `%${filter.search}%`)
      conditions.push('p.name LIKE @search')
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`

    const query = `
      SELECT 
        p.id, 
        p.categoryId, 
        c.name AS categoryName, 
        p.name, 
        p.description, 
        p.image, 
        p.status, 
        p.createdAt, 
        p.updatedAt,
        (
          SELECT id, productId, size, price, createdAt, updatedAt
          FROM ProductVariant pv
          WHERE pv.productId = p.id AND pv.deletedAt IS NULL
          ORDER BY pv.price ASC
          FOR JSON PATH
        ) AS variantsJson
      FROM Product p
      JOIN Category c ON p.categoryId = c.id
      ${whereClause}
      ORDER BY p.id DESC
    `

    const result = await req.query<any>(query)

    return result.recordset.map((row) => ({
      id: row.id,
      categoryId: row.categoryId,
      categoryName: row.categoryName,
      name: row.name,
      description: row.description,
      image: row.image,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      variants: row.variantsJson ? JSON.parse(row.variantsJson) : [],
    }))
  }

  /**
   * Lấy chi tiết sản phẩm theo ID
   */
  async findById(id: number): Promise<ProductDetail | null> {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)

    const query = `
      SELECT 
        p.id, 
        p.categoryId, 
        c.name AS categoryName, 
        p.name, 
        p.description, 
        p.image, 
        p.status, 
        p.createdAt, 
        p.updatedAt,
        (
          SELECT id, productId, size, price, createdAt, updatedAt
          FROM ProductVariant pv
          WHERE pv.productId = p.id AND pv.deletedAt IS NULL
          ORDER BY pv.price ASC
          FOR JSON PATH
        ) AS variantsJson
      FROM Product p
      JOIN Category c ON p.categoryId = c.id
      WHERE p.id = @id AND p.deletedAt IS NULL
    `

    const result = await req.query<any>(query)
    if (result.recordset.length === 0) return null

    const row = result.recordset[0]
    return {
      id: row.id,
      categoryId: row.categoryId,
      categoryName: row.categoryName,
      name: row.name,
      description: row.description,
      image: row.image,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      variants: row.variantsJson ? JSON.parse(row.variantsJson) : [],
    }
  }

  /**
   * Tìm sản phẩm theo tên (Phục vụ check trùng tên)
   */
  async findByName(name: string, excludeId?: number): Promise<any | null> {
    const pool = await getPool()
    const req = pool.request()
    req.input('name', sql.NVarChar(200), name)

    let query = `SELECT id FROM Product WHERE name = @name AND deletedAt IS NULL`
    if (excludeId) {
      req.input('excludeId', sql.Int, excludeId)
      query += ` AND id != @excludeId`
    }

    const result = await req.query(query)
    return result.recordset[0] || null
  }

  /**
   * Tạo món mới kèm các biến thể size
   */
  async createWithVariants(data: CreateProductType): Promise<ProductDetail> {
    const pool = await getPool()
    const transaction = new sql.Transaction(pool)
    await transaction.begin()

    try {
      const productReq = new sql.Request(transaction)
      productReq.input('categoryId', sql.Int, data.categoryId)
      productReq.input('name', sql.NVarChar(200), data.name)
      productReq.input('description', sql.NVarChar(sql.MAX), data.description || null)
      productReq.input('image', sql.NVarChar(500), data.image || null)
      productReq.input('status', sql.NVarChar(50), data.status || 'ACTIVE')

      const productRes = await productReq.query(`
        INSERT INTO Product (categoryId, name, description, image, status, createdAt)
        OUTPUT INSERTED.id, INSERTED.categoryId, INSERTED.name, INSERTED.description, INSERTED.image, INSERTED.status, INSERTED.createdAt
        VALUES (@categoryId, @name, @description, @image, @status, SYSDATETIME())
      `)
      const newProduct = productRes.recordset[0]

      for (const v of data.variants) {
        const variantReq = new sql.Request(transaction)
        variantReq.input('productId', sql.Int, newProduct.id)
        variantReq.input('size', sql.NVarChar(20), v.size)
        variantReq.input('price', sql.Decimal(18, 2), v.price)

        await variantReq.query(`
          INSERT INTO ProductVariant (productId, size, price, createdAt)
          VALUES (@productId, @size, @price, SYSDATETIME())
        `)
      }

      await transaction.commit()
      return (await this.findById(newProduct.id))!
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  /**
   * Cập nhật món dùng cơ chế Smart Upsert (An toàn tuyệt đối cho Khóa ngoại)
   */
  async update(id: number, data: UpdateProductType): Promise<ProductDetail | null> {
    const pool = await getPool()
    const transaction = new sql.Transaction(pool)
    await transaction.begin()

    try {
      const updateClauses: string[] = ['updatedAt = SYSDATETIME()']
      const updateReq = new sql.Request(transaction)
      updateReq.input('id', sql.Int, id)

      if (data.categoryId !== undefined) {
        updateReq.input('categoryId', sql.Int, data.categoryId)
        updateClauses.push('categoryId = @categoryId')
      }
      if (data.name !== undefined) {
        updateReq.input('name', sql.NVarChar(200), data.name)
        updateClauses.push('name = @name')
      }
      if (data.description !== undefined) {
        updateReq.input('description', sql.NVarChar(sql.MAX), data.description)
        updateClauses.push('description = @description')
      }
      if (data.image !== undefined) {
        updateReq.input('image', sql.NVarChar(500), data.image)
        updateClauses.push('image = @image')
      }
      if (data.status !== undefined) {
        updateReq.input('status', sql.NVarChar(50), data.status)
        updateClauses.push('status = @status')
      }

      const productUpdateResult = await updateReq.query(`
        UPDATE Product
        SET ${updateClauses.join(', ')}
        WHERE id = @id AND deletedAt IS NULL
      `)

      if (productUpdateResult.rowsAffected[0] === 0) {
        await transaction.rollback()
        return null
      }

      // Smart Upsert biến thể Size
      if (data.variants && data.variants.length > 0) {
        const incomingSizes = data.variants.map((v) => v.size)

        // 1. Xóa mềm các size không còn nằm trong danh sách mới
        const softDelReq = new sql.Request(transaction)
        softDelReq.input('productId', sql.Int, id)
        const sizeParams = incomingSizes.map((s, idx) => {
          softDelReq.input(`s${idx}`, sql.NVarChar(20), s)
          return `@s${idx}`
        })

        await softDelReq.query(`
          UPDATE ProductVariant
          SET deletedAt = SYSDATETIME(), updatedAt = SYSDATETIME()
          WHERE productId = @productId 
            AND deletedAt IS NULL 
            AND size NOT IN (${sizeParams.join(',')})
        `)

        // 2. Loop qua danh sách mới: Cập nhật nếu đã có, Thêm mới nếu chưa có
        for (const v of data.variants) {
          const upsertReq = new sql.Request(transaction)
          upsertReq.input('productId', sql.Int, id)
          upsertReq.input('size', sql.NVarChar(20), v.size)
          upsertReq.input('price', sql.Decimal(18, 2), v.price)

          await upsertReq.query(`
            IF EXISTS (SELECT 1 FROM ProductVariant WHERE productId = @productId AND size = @size AND deletedAt IS NULL)
            BEGIN
              UPDATE ProductVariant 
              SET price = @price, updatedAt = SYSDATETIME()
              WHERE productId = @productId AND size = @size AND deletedAt IS NULL
            END
            ELSE IF EXISTS (SELECT 1 FROM ProductVariant WHERE productId = @productId AND size = @size AND deletedAt IS NOT NULL)
            BEGIN
              UPDATE ProductVariant 
              SET price = @price, deletedAt = NULL, updatedAt = SYSDATETIME()
              WHERE productId = @productId AND size = @size
            END
            ELSE
            BEGIN
              INSERT INTO ProductVariant (productId, size, price, createdAt)
              VALUES (@productId, @size, @price, SYSDATETIME())
            END
          `)
        }
      }

      await transaction.commit()
      return await this.findById(id)
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  /**
   * Xóa mềm Sản phẩm và toàn bộ Biến thể liên quan
   */
  async softDelete(id: number): Promise<boolean> {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)

    const result = await req.query(`
      UPDATE Product
      SET deletedAt = SYSDATETIME(), updatedAt = SYSDATETIME()
      WHERE id = @id AND deletedAt IS NULL;

      UPDATE ProductVariant
      SET deletedAt = SYSDATETIME(), updatedAt = SYSDATETIME()
      WHERE productId = @id AND deletedAt IS NULL;
    `)

    return (result.rowsAffected[0] ?? 0) > 0
  }
}
```

# src\modules\menu-catalog\product\product.routes.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\menu-catalog\product\product.routes.ts` |
| Size | 1,770 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:35:12.799022 |

```typescript
import { Router } from 'express'
import { ProductController } from './product.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import {
    CreateProductSchema,
    FilterProductQuerySchema,
    ProductParamSchema,
    UpdateProductSchema,
} from './product.schema'

export const productRouter = Router()
const controller = new ProductController()

/**
 * @route   GET /api/v1/products
 * @desc    Tra cứu danh sách thực đơn (Public cho Customer & Cashier)
 */
productRouter.get(
    '/',
    validatePipe(FilterProductQuerySchema, 'query'),
    controller.getAll
)

/**
 * @route   GET /api/v1/products/:id
 * @desc    Xem chi tiết 1 sản phẩm theo ID (Public cho Customer & Cashier)
 */
productRouter.get(
    '/:id',
    validatePipe(ProductParamSchema, 'params'),
    controller.getById
)

/**
 * @route   POST /api/v1/products
 * @desc    Tạo món mới (Yêu cầu Đăng nhập & Quyền MANAGER)
 */
productRouter.post(
    '/',
    authGuard,
    roleGuard('MANAGER'),
    validatePipe(CreateProductSchema, 'body'),
    controller.create
)

/**
 * @route   PUT /api/v1/products/:id
 * @desc    Cập nhật món & biến thể Size/Giá (Yêu cầu Đăng nhập & Quyền MANAGER)
 */
productRouter.put(
    '/:id',
    authGuard,
    roleGuard('MANAGER'),
    validatePipe(ProductParamSchema, 'params'),
    validatePipe(UpdateProductSchema, 'body'),
    controller.update
)

/**
 * @route   DELETE /api/v1/products/:id
 * @desc    Xóa mềm món ăn (Yêu cầu Đăng nhập & Quyền MANAGER)
 */
productRouter.delete(
    '/:id',
    authGuard,
    roleGuard('MANAGER'),
    validatePipe(ProductParamSchema, 'params'),
    controller.delete
)
```

# src\modules\menu-catalog\product\product.schema.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\menu-catalog\product\product.schema.ts` |
| Size | 2,238 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:34:54.080687 |

```typescript
import { z } from 'zod'

export const VariantItemSchema = z.object({
  size: z.enum(['S', 'M', 'L', 'XL']),
  price: z.coerce.number().min(0, 'Giá biến thể phải lớn hơn hoặc bằng 0'),
})

export const CreateProductSchema = z.object({
  categoryId: z.coerce.number().int().positive('Mã danh mục không hợp lệ'),
  name: z.string().min(1, 'Tên món không được để trống').max(200),
  description: z.string().optional().nullable(),
  image: z.string().max(500).optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK']).default('ACTIVE'),
  variants: z.array(VariantItemSchema).min(1, 'Sản phẩm phải có ít nhất 1 kích thước/biến thể'),
})

export const UpdateProductSchema = z.object({
  categoryId: z.coerce.number().int().positive('Mã danh mục không hợp lệ').optional(),
  name: z.string().min(1, 'Tên món không được để trống').max(200, 'Tên món tối đa 200 ký tự').optional(),
  description: z.string().optional().nullable(),
  image: z.string().max(500, 'Đường dẫn hình ảnh quá dài').optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK']).optional(),
  variants: z
    .array(VariantItemSchema)
    .min(1, 'Nếu cập nhật biến thể, sản phẩm phải có ít nhất 1 kích thước/biến thể')
    .optional(),
})

export const ProductParamSchema = z.object({
  id: z.coerce.number().int().positive('ID sản phẩm không hợp lệ'),
})

export const FilterProductQuerySchema = z.object({
  categoryId: z.coerce.number().int().positive().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK']).optional(),
  search: z.string().optional(),
})

export type VariantItemType = z.infer<typeof VariantItemSchema>
export type CreateProductType = z.infer<typeof CreateProductSchema>
export type UpdateProductType = z.infer<typeof UpdateProductSchema>
export type ProductParamType = z.infer<typeof ProductParamSchema>
export type FilterProductQueryType = z.infer<typeof FilterProductQuerySchema>

// DTO aliases for backwards compatibility
export type CreateProductDto = CreateProductType
export type UpdateProductDto = UpdateProductType
```

# src\modules\menu-catalog\product\product.service.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\menu-catalog\product\product.service.ts` |
| Size | 1,096 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:34:54.082502 |

```typescript
import { ProductRepository } from './product.repo'
import {
  CreateProductType,
  FilterProductQueryType,
  UpdateProductType,
} from './product.schema'

export class ProductService {
  private productRepo = new ProductRepository()

  async getProducts(filter: FilterProductQueryType) {
    return await this.productRepo.findAll(filter)
  }

  async getProductById(id: number) {
    const product = await this.productRepo.findById(id)
    if (!product) throw new Error('Sản phẩm không tồn tại')
    return product
  }

  async createProduct(dto: CreateProductType) {
    const existing = await this.productRepo.findByName(dto.name)
    if (existing) throw new Error('Tên món đã tồn tại trong thực đơn')
    return await this.productRepo.createWithVariants(dto)
  }

  async updateProduct(id: number, dto: UpdateProductType) {
    await this.getProductById(id)
    return await this.productRepo.update(id, dto)
  }

  async deleteProduct(id: number) {
    await this.getProductById(id)
    return await this.productRepo.softDelete(id)
  }
}
```

# src\modules\menu-catalog\topping\topping.controller.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\menu-catalog\topping\topping.controller.ts` |
| Size | 2,644 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:34:54.084430 |

```typescript
import { Request, Response } from 'express'
import { ToppingService } from './topping.service'

export class ToppingController {
  private toppingService = new ToppingService()

  /**
   * Lấy danh sách topping (hỗ trợ lọc status & tìm kiếm search)
   */
  getAll = async (req: Request, res: Response) => {
    try {
      const toppings = await this.toppingService.getAllToppings(req.query as any)
      res.status(200).json({ success: true, data: toppings })
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Lỗi hệ thống' })
    }
  }

  /**
   * Xem chi tiết 1 topping theo ID
   */
  getById = async (req: Request, res: Response) => {
    try {
      const topping = await this.toppingService.getToppingById(Number(req.params.id))
      res.status(200).json({ success: true, data: topping })
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message || 'Topping không tồn tại' })
    }
  }

  /**
   * Tạo topping mới
   */
  create = async (req: Request, res: Response) => {
    try {
      const newTopping = await this.toppingService.createTopping(req.body)
      res.status(201).json({ success: true, data: newTopping })
    } catch (error: any) {
      const message = error.message || 'Lỗi tạo topping'
      const statusCode = message.includes('đã tồn tại') ? 409 : 400
      res.status(statusCode).json({ success: false, message })
    }
  }

  /**
   * Cập nhật thông tin topping
   */
  update = async (req: Request, res: Response) => {
    try {
      const updated = await this.toppingService.updateTopping(Number(req.params.id), req.body)
      res.status(200).json({ success: true, data: updated })
    } catch (error: any) {
      const message = error.message || 'Lỗi cập nhật topping'
      let statusCode = 400
      if (message.includes('không tồn tại')) statusCode = 404
      if (message.includes('đã tồn tại')) statusCode = 409

      res.status(statusCode).json({ success: false, message })
    }
  }

  /**
   * Xóa mềm topping
   */
  delete = async (req: Request, res: Response) => {
    try {
      await this.toppingService.deleteTopping(Number(req.params.id))
      res.status(200).json({ success: true, message: 'Đã xóa topping thành công' })
    } catch (error: any) {
      const message = error.message || 'Lỗi xóa topping'
      const statusCode = message.includes('không tồn tại') ? 404 : 400
      res.status(statusCode).json({ success: false, message })
    }
  }
}
```

# src\modules\menu-catalog\topping\topping.repo.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\menu-catalog\topping\topping.repo.ts` |
| Size | 4,706 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:34:54.085953 |

```typescript
import { getPool, sql } from '@/config/database'
import {
  CreateToppingType,
  FilterToppingQueryType,
  UpdateToppingType,
} from './topping.schema'

export interface Topping {
  id: number
  name: string
  price: number
  status: 'AVAILABLE' | 'UNAVAILABLE' | 'ACTIVE'
  createdAt?: Date
  updatedAt?: Date | null
  deletedAt?: Date | null
}

export class ToppingRepository {
  /**
   * Lấy danh sách topping (có lọc status và tìm kiếm name)
   */
  async findAll(filters?: FilterToppingQueryType): Promise<Topping[]> {
    const pool = await getPool()
    const req = pool.request()
    const conditions: string[] = ['deletedAt IS NULL']

    // Ép kiểu an toàn: Chỉ lấy khi đúng là chuỗi (string)
    const status = typeof filters?.status === 'string' ? filters.status : undefined
    const search = typeof filters?.search === 'string' ? filters.search : undefined

    if (status) {
      req.input('status', sql.NVarChar(50), status)
      conditions.push('status = @status')
    }

    if (search) {
      req.input('search', sql.NVarChar(150), `%${search}%`)
      conditions.push('name LIKE @search')
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`
    const query = `
    SELECT id, name, price, status, createdAt, updatedAt 
    FROM Topping 
    ${whereClause} 
    ORDER BY name ASC
  `
    const result = await req.query<Topping>(query)
    return result.recordset
  }

  /**
   * Lấy chi tiết topping theo ID
   */
  async findById(id: number): Promise<Topping | null> {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)
    const result = await req.query<Topping>(`
      SELECT id, name, price, status, createdAt, updatedAt 
      FROM Topping 
      WHERE id = @id AND deletedAt IS NULL
    `)
    return result.recordset[0] || null
  }

  /**
   * Tim topping theo tên (hỗ trợ loại trừ ID khi update)
   */
  async findByName(name: string, excludeId?: number): Promise<Topping | null> {
    const pool = await getPool()
    const req = pool.request()
    req.input('name', sql.NVarChar(150), name)

    let query = `
      SELECT id, name, price, status, createdAt, updatedAt 
      FROM Topping 
      WHERE name = @name AND deletedAt IS NULL
    `

    if (excludeId) {
      req.input('excludeId', sql.Int, excludeId)
      query += ` AND id <> @excludeId`
    }

    const result = await req.query<Topping>(query)
    return result.recordset[0] || null
  }

  /**
   * Tạo topping mới
   */
  async create(data: CreateToppingType): Promise<Topping> {
    const pool = await getPool()
    const req = pool.request()
    req.input('name', sql.NVarChar(150), data.name)
    req.input('price', sql.Decimal(18, 2), data.price)
    req.input('status', sql.NVarChar(50), data.status || 'AVAILABLE')

    const result = await req.query<Topping>(`
      INSERT INTO Topping (name, price, status, createdAt)
      OUTPUT INSERTED.id, INSERTED.name, INSERTED.price, INSERTED.status, INSERTED.createdAt, INSERTED.updatedAt
      VALUES (@name, @price, @status, SYSDATETIME())
    `)
    return result.recordset[0]
  }

  /**
   * Cập nhật thông tin topping
   */
  async update(id: number, data: UpdateToppingType): Promise<Topping | null> {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)

    const setClauses: string[] = ['updatedAt = SYSDATETIME()']

    if (data.name !== undefined) {
      req.input('name', sql.NVarChar(150), data.name)
      setClauses.push('name = @name')
    }
    if (data.price !== undefined) {
      req.input('price', sql.Decimal(18, 2), data.price)
      setClauses.push('price = @price')
    }
    if (data.status !== undefined) {
      req.input('status', sql.NVarChar(50), data.status)
      setClauses.push('status = @status')
    }

    const query = `
      UPDATE Topping
      SET ${setClauses.join(', ')}
      OUTPUT INSERTED.id, INSERTED.name, INSERTED.price, INSERTED.status, INSERTED.createdAt, INSERTED.updatedAt
      WHERE id = @id AND deletedAt IS NULL
    `
    const result = await req.query<Topping>(query)
    return result.recordset[0] || null
  }

  /**
   * Xóa mềm topping
   */
  async delete(id: number): Promise<boolean> {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)
    const result = await req.query(`
      UPDATE Topping 
      SET deletedAt = SYSDATETIME() 
      WHERE id = @id AND deletedAt IS NULL
    `)
    return (result.rowsAffected[0] ?? 0) > 0
  }
}
```

# src\modules\menu-catalog\topping\topping.routes.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\menu-catalog\topping\topping.routes.ts` |
| Size | 1,735 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:35:24.357715 |

```typescript
import { Router } from 'express'
import { ToppingController } from './topping.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import {
  CreateToppingSchema,
  FilterToppingQuerySchema,
  ToppingParamSchema,
  UpdateToppingSchema,
} from './topping.schema'

export const toppingRouter = Router()
const controller = new ToppingController()

/**
 * @route   GET /api/v1/menu/toppings
 * @desc    Xem danh sách topping (Public - hỗ trợ search & filter status)
 */
toppingRouter.get(
  '/',
  validatePipe(FilterToppingQuerySchema, 'query'),
  controller.getAll
)

/**
 * @route   GET /api/v1/menu/toppings/:id
 * @desc    Xem chi tiết 1 topping theo ID (Public)
 */
toppingRouter.get(
    '/:id',
    validatePipe(ToppingParamSchema, 'params'),
    controller.getById
)

/**
 * @route   POST /api/v1/menu/toppings
 * @desc    Tạo topping mới (Yêu cầu Đăng nhập & Quyền MANAGER)
 */
toppingRouter.post(
    '/',
    authGuard,
    roleGuard('MANAGER'),
    validatePipe(CreateToppingSchema, 'body'),
    controller.create
)

/**
 * @route   PUT /api/v1/menu/toppings/:id
 * @desc    Cập nhật topping (Yêu cầu Đăng nhập & Quyền MANAGER)
 */
toppingRouter.put(
    '/:id',
    authGuard,
    roleGuard('MANAGER'),
    validatePipe(ToppingParamSchema, 'params'),
    validatePipe(UpdateToppingSchema, 'body'),
    controller.update
)

/**
 * @route   DELETE /api/v1/menu/toppings/:id
 * @desc    Xóa mềm topping (Yêu cầu Đăng nhập & Quyền MANAGER)
 */
toppingRouter.delete(
    '/:id',
    authGuard,
    roleGuard('MANAGER'),
    validatePipe(ToppingParamSchema, 'params'),
    controller.delete
)
```

# src\modules\menu-catalog\topping\topping.schema.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\menu-catalog\topping\topping.schema.ts` |
| Size | 1,043 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:34:54.089948 |

```typescript
import { z } from 'zod'

export const CreateToppingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Tên topping không được để trống')
    .max(150, 'Tên topping tối đa 150 ký tự'),
  price: z.coerce.number().min(0, 'Giá topping phải lớn hơn hoặc bằng 0'),
  status: z.enum(['AVAILABLE', 'UNAVAILABLE', 'ACTIVE']).default('AVAILABLE'),
})

export const UpdateToppingSchema = CreateToppingSchema.partial()

export const ToppingParamSchema = z.object({
  id: z.coerce.number().int().positive('ID topping không hợp lệ'),
})

export const FilterToppingQuerySchema = z.object({
  status: z.enum(['AVAILABLE', 'UNAVAILABLE', 'ACTIVE']).optional(),
  search: z.string().trim().optional(),
})

export type CreateToppingType = z.infer<typeof CreateToppingSchema>
export type UpdateToppingType = z.infer<typeof UpdateToppingSchema>
export type ToppingParamType = z.infer<typeof ToppingParamSchema>
export type FilterToppingQueryType = z.infer<typeof FilterToppingQuerySchema>
```

# src\modules\menu-catalog\topping\topping.service.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\menu-catalog\topping\topping.service.ts` |
| Size | 1,291 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:34:54.091948 |

```typescript
import { ToppingRepository } from './topping.repo'
import {
  CreateToppingType,
  FilterToppingQueryType,
  UpdateToppingType,
} from './topping.schema'

export class ToppingService {
  private toppingRepo = new ToppingRepository()

  async getAllToppings(filters?: FilterToppingQueryType) {
    return await this.toppingRepo.findAll(filters)
  }

  async getToppingById(id: number) {
    const topping = await this.toppingRepo.findById(id)
    if (!topping) {
      throw new Error('Topping không tồn tại')
    }
    return topping
  }

  async createTopping(dto: CreateToppingType) {
    const existing = await this.toppingRepo.findByName(dto.name)
    if (existing) {
      throw new Error('Tên topping đã tồn tại')
    }
    return await this.toppingRepo.create(dto)
  }

  async updateTopping(id: number, dto: UpdateToppingType) {
    await this.getToppingById(id)

    if (dto.name) {
      const existing = await this.toppingRepo.findByName(dto.name, id)
      if (existing) {
        throw new Error('Tên topping đã tồn tại')
      }
    }

    return await this.toppingRepo.update(id, dto)
  }

  async deleteTopping(id: number) {
    await this.getToppingById(id)
    return await this.toppingRepo.delete(id)
  }
}
```

# src\modules\pos-order\order\order.controller.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\pos-order\order\order.controller.ts` |
| Size | 4,028 bytes |
| Extension | `.ts` |
| Modified | 2026-10-01 00:07:18.621152 |

```typescript
import { NextFunction, Request, Response } from "express";
import { OrderService } from "./order.service";
import {
  ApplyLoyaltyPointsSchema,
  CancelOrderSchema,
  CompletePaymentSchema,
  CreateOrderSchema,
  FilterOrderQuerySchema,
  OrderDetailParamSchema,
  OrderParamSchema,
} from "./order.schema";

export class OrderController {
  private orderService = new OrderService();

  /**
   * Lấy danh sách đơn hàng có phân trang & bộ lọc
   */
  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = FilterOrderQuerySchema.parse(req.query);
      const result = await this.orderService.getOrders(query);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Lấy thông tin chi tiết đơn hàng
   */
  detail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = OrderParamSchema.parse(req.params);
      const data = await this.orderService.getOrderById(id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Xuất hóa đơn chi tiết phục vụ in ấn từ View v_InvoiceDetails
   */
  invoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = OrderParamSchema.parse(req.params);
      const data = await this.orderService.getInvoice(id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Tạo đơn hàng mới tại quầy POS
   */
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = CreateOrderSchema.parse(req.body);
      const employeeId = req.user?.id || body.employeeId;
      const result = await this.orderService.createOrder({
        ...body,
        employeeId,
      });
      res.status(201).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Hoàn tất thanh toán đơn hàng & tích điểm
   */
  completePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = OrderParamSchema.parse(req.params);
      const body = CompletePaymentSchema.parse(req.body);
      const result = await this.orderService.completePayment(id, body);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Hủy đơn hàng & giải phóng thẻ rung
   */
  cancel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = OrderParamSchema.parse(req.params);
      const body = CancelOrderSchema.parse(req.body);
      const employeeId = req.user?.id || body.employeeId;
      const result = await this.orderService.cancelOrder(id, {
        ...body,
        employeeId,
      });
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Đổi điểm thưởng hội viên lấy chiết khấu giảm giá đơn hàng
   */
  applyPoints = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = OrderParamSchema.parse(req.params);
      const body = ApplyLoyaltyPointsSchema.parse(req.body);
      const result = await this.orderService.applyLoyaltyPoints(id, body);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Xóa một món khỏi đơn hàng chưa chế biến
   */
  removeItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { detailId } = OrderDetailParamSchema.parse(req.params);
      const result = await this.orderService.removeOrderItem(detailId);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };
}

```

# src\modules\pos-order\order\order.repo.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\pos-order\order\order.repo.ts` |
| Size | 13,611 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 23:36:47.612673 |

```typescript
// Path: src/modules/pos-order/order/order.repo.ts

import { getPool, sql } from '@/config/database'
import {
  CreateOrderType,
  FilterOrderQueryType,
  OrderItemType,
} from './order.schema'

export class OrderRepo {
  /**
   * Khởi tạo Table-Valued Parameter (TVP) udt_OrderDetailList theo đúng schema Database
   * Bổ sung cột itemIndex (0, 1, 2...) để định danh dòng cho các Topping đi kèm
   */
  private buildOrderDetailTVP(items: OrderItemType[]): sql.Table {
    const tvp = new sql.Table('udt_OrderDetailList')
    tvp.columns.add('itemIndex', sql.Int, { nullable: false })
    tvp.columns.add('variantId', sql.Int, { nullable: false })
    tvp.columns.add('quantity', sql.Int, { nullable: false })
    tvp.columns.add('note', sql.NVarChar(255), { nullable: true })
    tvp.columns.add('itemSnapshotName', sql.NVarChar(200), { nullable: false })
    tvp.columns.add('sizeSnapshot', sql.NVarChar(50), { nullable: false })
    tvp.columns.add('unitPrice', sql.Decimal(18, 2), { nullable: false })
    tvp.columns.add('totalToppingPriceSnapshot', sql.Decimal(18, 2), { nullable: false })
    tvp.columns.add('totalPrice', sql.Decimal(18, 2), { nullable: false })

    items.forEach((item, index) => {
      tvp.rows.add(
        index,
        item.variantId,
        item.quantity,
        item.note || null,
        item.itemSnapshotName,
        item.sizeSnapshot,
        item.unitPrice,
        item.totalToppingPriceSnapshot ?? 0,
        item.totalPrice
      )
    })
    return tvp
  }

  /**
   * Khởi tạo Table-Valued Parameter (TVP) udt_OrderDetailToppingList
   * Map với từng ly nước thông qua itemIndex
   */
  private buildOrderToppingTVP(items: OrderItemType[]): sql.Table {
    const tvp = new sql.Table('udt_OrderDetailToppingList')
    tvp.columns.add('itemIndex', sql.Int, { nullable: false })
    tvp.columns.add('toppingId', sql.Int, { nullable: true })
    tvp.columns.add('toppingSnapshotName', sql.NVarChar(150), { nullable: false })
    tvp.columns.add('toppingPrice', sql.Decimal(18, 2), { nullable: false })
    tvp.columns.add('quantity', sql.Int, { nullable: false })

    items.forEach((item, index) => {
      if (item.toppings && item.toppings.length > 0) {
        for (const topping of item.toppings) {
          tvp.rows.add(
            index,
            topping.toppingId || null,
            topping.toppingSnapshotName,
            topping.toppingPrice,
            topping.quantity || 1
          )
        }
      }
    })
    return tvp
  }

  /**
   * Tạo đơn hàng tại quầy thông qua Stored Procedure sp_CreateCounterOrder
   * Truyền đồng thời cả 2 TVP danh sách món và topping
   */
  async createCounterOrder(data: CreateOrderType): Promise<number> {
    const pool = await getPool()
    const request = pool.request()

    const detailsTVP = this.buildOrderDetailTVP(data.items)
    const toppingsTVP = this.buildOrderToppingTVP(data.items)

    request.input('OrderCode', sql.VarChar(64), data.orderCode)
    request.input('EmployeeId', sql.Int, data.employeeId)
    request.input('CustomerId', sql.Int, data.customerId || null)
    request.input('PagerId', sql.Int, data.pagerId || null)
    request.input('SubTotal', sql.Decimal(18, 2), data.subTotal)
    request.input('DiscountAmount', sql.Decimal(18, 2), data.discountAmount || 0)
    request.input('TotalAmount', sql.Decimal(18, 2), data.totalAmount)
    request.input('PaymentMethod', sql.NVarChar(50), data.paymentMethod)
    request.input('OrderDetails', detailsTVP)
    request.input('OrderToppings', toppingsTVP)
    request.output('NewOrderId', sql.Int)

    const result = await request.execute('sp_CreateCounterOrder')
    return result.output.NewOrderId
  }

  /**
   * Tạo đơn hàng kết hợp cấp phát thẻ rung qua Stored Procedure sp_CreateOrderWithPager
   */
  async createOrderWithPager(data: CreateOrderType): Promise<number> {
    const pool = await getPool()
    const request = pool.request()

    const detailsTVP = this.buildOrderDetailTVP(data.items)
    const toppingsTVP = this.buildOrderToppingTVP(data.items)

    request.input('OrderCode', sql.VarChar(64), data.orderCode)
    request.input('OrderChannel', sql.NVarChar(50), data.orderChannel)
    request.input('PagerCode', sql.VarChar(50), data.pagerCode)
    request.input('EmployeeId', sql.Int, data.employeeId)
    request.input('CustomerId', sql.Int, data.customerId || null)
    request.input('SubTotal', sql.Decimal(18, 2), data.subTotal)
    request.input('DiscountAmount', sql.Decimal(18, 2), data.discountAmount || 0)
    request.input('PaymentMethod', sql.NVarChar(50), data.paymentMethod)
    request.input('OrderDetails', detailsTVP)
    request.input('OrderToppings', toppingsTVP)
    request.output('NewOrderId', sql.Int)

    const result = await request.execute('sp_CreateOrderWithPager')
    return result.output.NewOrderId
  }

  /**
   * Hoàn tất thanh toán qua Stored Procedure sp_CompleteOrderPayment
   */
  async completeOrderPayment(orderId: number, paymentMethod: string): Promise<void> {
    const pool = await getPool()
    await pool
      .request()
      .input('OrderId', sql.Int, orderId)
      .input('PaymentMethod', sql.NVarChar(50), paymentMethod)
      .execute('sp_CompleteOrderPayment')
  }

  /**
   * Hủy đơn hàng và giải phóng thẻ rung qua Stored Procedure sp_CancelOrder
   */
  async cancelOrder(orderId: number, employeeId: number, cancelReason: string): Promise<void> {
    const pool = await getPool()
    await pool
      .request()
      .input('OrderId', sql.Int, orderId)
      .input('EmployeeId', sql.Int, employeeId)
      .input('CancelReason', sql.NVarChar(500), cancelReason)
      .execute('sp_CancelOrder')
  }

  /**
   * Áp dụng điểm thưởng hội viên để chiết khấu qua Stored Procedure sp_ApplyLoyaltyPoints
   */
  async applyLoyaltyPoints(
    orderId: number,
    customerId: number,
    pointsToRedeem: number,
    conversionRate: number = 1000
  ): Promise<void> {
    const pool = await getPool()
    await pool
      .request()
      .input('OrderId', sql.Int, orderId)
      .input('CustomerId', sql.Int, customerId)
      .input('PointsToRedeem', sql.Int, pointsToRedeem)
      .input('ConversionRate', sql.Decimal(18, 2), conversionRate)
      .execute('sp_ApplyLoyaltyPoints')
  }

  /**
   * Xóa món khỏi đơn hàng chưa chế biến qua Stored Procedure sp_RemoveOrderItem
   */
  async removeOrderItem(orderDetailId: number): Promise<void> {
    const pool = await getPool()
    await pool
      .request()
      .input('OrderDetailId', sql.Int, orderDetailId)
      .execute('sp_RemoveOrderItem')
  }

  /**
   * Kiểm tra tính khả dụng của thẻ rung thông qua Function fn_IsPagerAvailable
   */
  async isPagerAvailable(pagerId: number): Promise<boolean> {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('pagerId', sql.Int, pagerId)
      .query(`SELECT dbo.fn_IsPagerAvailable(@pagerId) AS isAvailable`)

    return result.recordset[0]?.isAvailable === true || result.recordset[0]?.isAvailable === 1
  }

  /**
   * Lấy danh sách đơn hàng có phân trang và bộ lọc
   */
  async getOrders(filter: FilterOrderQueryType) {
    const pool = await getPool()
    const request = pool.request()

    const {
      search,
      status,
      paymentMethod,
      orderChannel,
      employeeId,
      customerId,
      fromDate,
      toDate,
      page = 1,
      limit = 20,
    } = filter

    const offset = (page - 1) * limit
    const conditions: string[] = ['o.deletedAt IS NULL']

    if (search) {
      request.input('search', sql.NVarChar(150), `%${search}%`)
      conditions.push(
        '(o.orderCode LIKE @search OR c.fullName LIKE @search OR c.phoneNumber LIKE @search)'
      )
    }

    if (status) {
      request.input('status', sql.NVarChar(50), status)
      conditions.push('o.status = @status')
    }

    if (paymentMethod) {
      request.input('paymentMethod', sql.NVarChar(50), paymentMethod)
      conditions.push('o.paymentMethod = @paymentMethod')
    }

    if (orderChannel) {
      request.input('orderChannel', sql.NVarChar(50), orderChannel)
      conditions.push('o.orderChannel = @orderChannel')
    }

    if (employeeId) {
      request.input('employeeId', sql.Int, employeeId)
      conditions.push('o.employeeId = @employeeId')
    }

    if (customerId) {
      request.input('customerId', sql.Int, customerId)
      conditions.push('o.customerId = @customerId')
    }

    if (fromDate) {
      request.input('fromDate', sql.DateTime2, new Date(fromDate))
      conditions.push('o.createdAt >= @fromDate')
    }

    if (toDate) {
      request.input('toDate', sql.DateTime2, new Date(toDate))
      conditions.push('o.createdAt <= @toDate')
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`

    // Đếm tổng số bản ghi
    const countRes = await request.query(
      `SELECT COUNT(1) AS total 
       FROM [Order] o 
       LEFT JOIN Customer c ON o.customerId = c.id 
       ${whereClause}`
    )
    const totalItems = countRes.recordset[0]?.total || 0

    // Lấy dữ liệu phân trang
    request.input('offset', sql.Int, offset)
    request.input('limit', sql.Int, limit)

    const listQuery = `
      SELECT 
        o.id,
        o.orderCode,
        o.orderChannel,
        o.status,
        o.paymentMethod,
        o.subTotal,
        o.discountAmount,
        o.totalAmount,
        o.paidAt,
        o.pickupAt,
        o.cancelReason,
        o.createdAt,
        o.updatedAt,
        e.id AS employeeId,
        e.fullName AS employeeName,
        c.id AS customerId,
        c.fullName AS customerName,
        c.phoneNumber AS customerPhone,
        p.id AS pagerId,
        p.pagerCode
      FROM [Order] o
      LEFT JOIN Employee e ON o.employeeId = e.id
      LEFT JOIN Customer c ON o.customerId = c.id
      LEFT JOIN PagerDevice p ON o.pagerId = p.id
      ${whereClause}
      ORDER BY o.createdAt DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `

    const listRes = await request.query(listQuery)

    return {
      items: listRes.recordset,
      meta: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    }
  }

  /**
   * Lấy chi tiết đơn hàng (Header, Item Details, Toppings)
   */
  async getOrderById(id: number) {
    const pool = await getPool()
    const request = pool.request()
    request.input('id', sql.Int, id)

    // Lấy thông tin Header của Order
    const orderRes = await request.query(`
      SELECT 
        o.id,
        o.orderCode,
        o.orderChannel,
        o.status,
        o.paymentMethod,
        o.subTotal,
        o.discountAmount,
        o.totalAmount,
        o.paidAt,
        o.pickupAt,
        o.cancelReason,
        o.createdAt,
        o.updatedAt,
        e.id AS employeeId,
        e.fullName AS employeeName,
        c.id AS customerId,
        c.fullName AS customerName,
        c.phoneNumber AS customerPhone,
        c.membershipTier AS customerTier,
        c.rewardPoints AS customerPoints,
        p.id AS pagerId,
        p.pagerCode,
        p.status AS pagerStatus
      FROM [Order] o
      LEFT JOIN Employee e ON o.employeeId = e.id
      LEFT JOIN Customer c ON o.customerId = c.id
      LEFT JOIN PagerDevice p ON o.pagerId = p.id
      WHERE o.id = @id AND o.deletedAt IS NULL
    `)

    const order = orderRes.recordset[0]
    if (!order) return null

    // Lấy danh sách OrderDetail
    const itemsRes = await pool
      .request()
      .input('orderId', sql.Int, id)
      .query(`
        SELECT 
          od.id,
          od.variantId,
          od.quantity,
          od.note,
          od.itemSnapshotName,
          od.sizeSnapshot,
          od.unitPrice,
          od.totalToppingPriceSnapshot,
          od.totalPrice,
          od.itemStatus,
          od.createdAt
        FROM OrderDetail od
        WHERE od.orderId = @orderId
        ORDER BY od.id ASC
      `)

    const items = itemsRes.recordset

    // Lấy Topping cho từng item nếu có
    if (items.length > 0) {
      const detailIds = items.map((i: any) => i.id)
      const toppingsRes = await pool
        .request()
        .query(`
          SELECT 
            id,
            orderDetailId,
            toppingId,
            toppingSnapshotName,
            toppingPrice,
            quantity
          FROM OrderDetailTopping
          WHERE orderDetailId IN (${detailIds.join(',')})
        `)

      const toppings = toppingsRes.recordset
      for (const item of items) {
        item.toppings = toppings.filter((t: any) => t.orderDetailId === item.id)
      }
    }

    return {
      ...order,
      items,
    }
  }

  /**
   * Truy vấn thông tin chi tiết hóa đơn từ View v_InvoiceDetails
   */
  async getInvoiceDetails(orderId: number) {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('orderId', sql.Int, orderId)
      .query(`SELECT * FROM v_InvoiceDetails WHERE orderId = @orderId`)

    return result.recordset
  }
}
```

# src\modules\pos-order\order\order.routes.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\pos-order\order\order.routes.ts` |
| Size | 1,009 bytes |
| Extension | `.ts` |
| Modified | 2026-10-01 00:07:18.623155 |

```typescript
import { Router } from 'express'
import { OrderController } from './order.controller'
import { authGuard, roleGuard } from '@/middlewares'

export const orderRouter = Router()
const controller = new OrderController()

// Bắt buộc đăng nhập cho các thao tác POS bán hàng
orderRouter.use(authGuard)

orderRouter.get('/', roleGuard('CASHIER', 'MANAGER'), controller.list)
orderRouter.post('/', roleGuard('CASHIER', 'MANAGER'), controller.create)
orderRouter.delete('/items/:detailId', roleGuard('CASHIER', 'MANAGER'), controller.removeItem)
orderRouter.get('/:id', roleGuard('CASHIER', 'MANAGER', 'BARISTA'), controller.detail)
orderRouter.get('/:id/invoice', roleGuard('CASHIER', 'MANAGER'), controller.invoice)
orderRouter.patch('/:id/pay', roleGuard('CASHIER', 'MANAGER'), controller.completePayment)
orderRouter.patch('/:id/cancel', roleGuard('CASHIER', 'MANAGER'), controller.cancel)
orderRouter.post('/:id/apply-points', roleGuard('CASHIER', 'MANAGER'), controller.applyPoints)
```

# src\modules\pos-order\order\order.schema.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\pos-order\order\order.schema.ts` |
| Size | 4,726 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 23:26:01.258461 |

```typescript
import { z } from 'zod'

// 1. Schema cho Topping của món
export const OrderItemToppingSchema = z.object({
  toppingId: z.number().int().positive().optional().nullable(),
  toppingSnapshotName: z.string().min(1, 'Tên topping không được để trống').max(150),
  toppingPrice: z.number().nonnegative('Giá topping phải >= 0'),
  quantity: z.number().int().positive('Số lượng topping phải >= 1').default(1),
})

// 2. Schema cho từng món trong đơn hàng
export const OrderItemSchema = z.object({
  variantId: z.number().int().positive('ID phân loại món không hợp lệ'),
  quantity: z.number().int().positive('Số lượng món phải >= 1'),
  note: z.string().max(255, 'Ghi chú tối đa 255 ký tự').optional().nullable(),
  itemSnapshotName: z.string().min(1, 'Tên món không được để trống').max(200),
  sizeSnapshot: z.string().min(1, 'Size không được để trống').max(50),
  unitPrice: z.number().nonnegative('Đơn giá phải >= 0'),
  totalToppingPriceSnapshot: z.number().nonnegative('Tổng tiền topping phải >= 0').default(0),
  totalPrice: z.number().nonnegative('Tổng tiền món phải >= 0'),
  toppings: z.array(OrderItemToppingSchema).optional().default([]),
})

// 3. Schema tạo đơn hàng tại quầy (POS Order)
export const CreateOrderSchema = z.object({
  orderCode: z.string().max(64).optional(),
  employeeId: z.number().int().positive('ID nhân viên không hợp lệ'),
  customerId: z.number().int().positive('ID khách hàng không hợp lệ').optional().nullable(),
  pagerId: z.number().int().positive('ID thẻ rung không hợp lệ').optional().nullable(),
  pagerCode: z.string().max(50).optional().nullable(), // Mã thẻ rung nếu gán bằng mã thẻ
  orderChannel: z.enum(['ORDER_AT_COUNTER', 'TAKE_AWAY', 'DINE_IN']).default('ORDER_AT_COUNTER'),
  subTotal: z.number().nonnegative('Tạm tính phải >= 0'),
  discountAmount: z.number().nonnegative('Tiền giảm giá phải >= 0').default(0),
  totalAmount: z.number().nonnegative('Tổng tiền thanh toán phải >= 0'),
  paymentMethod: z.enum(['CASH', 'BANK_TRANSFER', 'CARD', 'MOMO', 'VNPAY', 'POINT_EXCHANGE']).default('CASH'),
  items: z.array(OrderItemSchema).min(1, 'Đơn hàng phải có ít nhất 1 món'),
})

// 4. Schema hoàn tất thanh toán
export const CompletePaymentSchema = z.object({
  paymentMethod: z.enum(['CASH', 'BANKING', 'MOMO', 'VNPAY', 'CREDIT_CARD', 'POINT_EXCHANGE'], {
    required_error: 'Phương thức thanh toán là bắt buộc',
  }),
})

// 5. Schema hủy đơn hàng
export const CancelOrderSchema = z.object({
  employeeId: z.number().int().positive('ID nhân viên hủy đơn là bắt buộc'),
  cancelReason: z.string().min(1, 'Lý do hủy đơn không được để trống').max(500, 'Lý do tối đa 500 ký tự'),
})

// 6. Schema áp dụng điểm thưởng trừ tiền
export const ApplyLoyaltyPointsSchema = z.object({
  customerId: z.number().int().positive('ID khách hàng là bắt buộc'),
  pointsToRedeem: z.number().int().positive('Số điểm đổi phải lớn hơn 0'),
  conversionRate: z.number().positive().default(1000), // Mặc định 1 điểm = 1.000 VNĐ
})

// 7. Schema Params
export const OrderParamSchema = z.object({
  id: z.coerce.number().int().positive('ID đơn hàng không hợp lệ'),
})

export const OrderDetailParamSchema = z.object({
  detailId: z.coerce.number().int().positive('ID chi tiết đơn hàng không hợp lệ'),
})

// 8. Schema Filter Query
export const FilterOrderQuerySchema = z.object({
  search: z.string().optional(), // Tìm theo orderCode, customerName, customerPhone
  status: z.enum(['PENDING_PREP', 'PREPARING', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED']).optional(),
  paymentMethod: z.string().optional(),
  orderChannel: z.string().optional(),
  employeeId: z.coerce.number().int().positive().optional(),
  customerId: z.coerce.number().int().positive().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(20),
})

export type OrderItemToppingType = z.infer<typeof OrderItemToppingSchema>
export type OrderItemType = z.infer<typeof OrderItemSchema>
export type CreateOrderType = z.infer<typeof CreateOrderSchema>
export type CompletePaymentType = z.infer<typeof CompletePaymentSchema>
export type CancelOrderType = z.infer<typeof CancelOrderSchema>
export type ApplyLoyaltyPointsType = z.infer<typeof ApplyLoyaltyPointsSchema>
export type FilterOrderQueryType = z.infer<typeof FilterOrderQuerySchema>

```

# src\modules\pos-order\order\order.service.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\pos-order\order\order.service.ts` |
| Size | 6,090 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:35:12.807143 |

```typescript
import { OrderRepo } from './order.repo'
import {
  ApplyLoyaltyPointsType,
  CancelOrderType,
  CompletePaymentType,
  CreateOrderType,
  FilterOrderQueryType,
} from './order.schema'

export class OrderService {
  private orderRepo = new OrderRepo()

  /**
   * Sinh mã hóa đơn tự động chuẩn POS: ORD-YYYYMMDD-XXXX
   */
  private generateOrderCode(): string {
    const now = new Date()
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    return `ORD-${dateStr}-${randomSuffix}`
  }

  /**
   * Lấy danh sách đơn hàng có phân trang & lọc
   */
  async getOrders(filter: FilterOrderQueryType) {
    return await this.orderRepo.getOrders(filter)
  }

  /**
   * Lấy chi tiết đơn hàng theo ID
   */
  async getOrderById(id: number) {
    const order = await this.orderRepo.getOrderById(id)
    if (!order) {
      throw new Error(`Đơn hàng #${id} không tồn tại hoặc đã bị xóa`)
    }
    return order
  }

  /**
   * Lấy thông tin hóa đơn phục vụ in ấn từ View v_InvoiceDetails
   */
  async getInvoice(id: number) {
    const rows = await this.orderRepo.getInvoiceDetails(id)
    if (!rows || rows.length === 0) {
      throw new Error(`Không tìm thấy hóa đơn cho đơn hàng #${id}`)
    }

    const first = rows[0]
    return {
      orderId: first.orderId,
      orderCode: first.orderCode,
      orderChannel: first.orderChannel,
      orderStatus: first.orderStatus,
      paymentMethod: first.paymentMethod,
      subTotal: first.subTotal,
      discountAmount: first.discountAmount,
      totalAmount: first.totalAmount,
      paidAt: first.paidAt,
      orderCreatedAt: first.orderCreatedAt,
      employeeName: first.employeeName,
      customerName: first.customerName,
      customerPhone: first.customerPhone,
      items: rows.map((r: any) => ({
        orderDetailId: r.orderDetailId,
        itemSnapshotName: r.itemSnapshotName,
        sizeSnapshot: r.sizeSnapshot,
        quantity: r.quantity,
        unitPrice: r.unitPrice,
        totalToppingPriceSnapshot: r.totalToppingPriceSnapshot,
        lineTotalPrice: r.lineTotalPrice,
        itemStatus: r.itemStatus,
        itemNote: r.itemNote,
      })),
    }
  }

  /**
   * Tạo đơn hàng mới tại quầy POS
   */
  async createOrder(data: CreateOrderType) {
    // 1. Tự động sinh orderCode nếu chưa có
    if (!data.orderCode) {
      data.orderCode = this.generateOrderCode()
    }

    // 2. Kiểm tra tính khả dụng của thẻ rung nếu có gán pagerId
    if (data.pagerId) {
      const isAvailable = await this.orderRepo.isPagerAvailable(data.pagerId)
      if (!isAvailable) {
        throw new Error(`Thẻ rung #${data.pagerId} hiện không khả dụng hoặc pin < 15%`)
      }
    }

    // 3. Thực thi Stored Procedure tạo đơn
    let newOrderId: number
    if (data.pagerCode && data.pagerCode.trim().length > 0) {
      newOrderId = await this.orderRepo.createOrderWithPager(data)
    } else {
      newOrderId = await this.orderRepo.createCounterOrder(data)
    }

    // 4. Lấy lại dữ liệu đơn hàng hoàn chỉnh vừa tạo
    const createdOrder = await this.getOrderById(newOrderId)

    return {
      message: 'Tạo đơn hàng POS thành công',
      orderId: newOrderId,
      data: createdOrder,
    }
  }

  /**
   * Hoàn tất thanh toán đơn hàng & tự động tích điểm hội viên
   */
  async completePayment(orderId: number, body: CompletePaymentType) {
    const order = await this.getOrderById(orderId)
    if (order.status === 'CANCELLED') {
      throw new Error('Không thể thanh toán đơn hàng đã bị hủy')
    }
    if (order.status === 'COMPLETED' || order.paidAt) {
      throw new Error('Đơn hàng này đã được thanh toán trước đó')
    }

    await this.orderRepo.completeOrderPayment(orderId, body.paymentMethod)
    const updatedOrder = await this.getOrderById(orderId)

    return {
      message: 'Thanh toán đơn hàng thành công và đã cập nhật điểm thưởng hội viên',
      data: updatedOrder,
    }
  }

  /**
   * Hủy đơn hàng và tự động giải phóng thẻ rung
   */
  async cancelOrder(orderId: number, body: CancelOrderType) {
    const order = await this.getOrderById(orderId)
    if (order.status === 'COMPLETED' || order.paidAt) {
      throw new Error('Không thể hủy đơn hàng đã hoàn tất hoặc đã thanh toán')
    }
    if (order.status === 'CANCELLED') {
      throw new Error('Đơn hàng này đã bị hủy trước đó')
    }

    await this.orderRepo.cancelOrder(orderId, body.employeeId, body.cancelReason)
    const updatedOrder = await this.getOrderById(orderId)

    return {
      message: 'Hủy đơn hàng và giải phóng thẻ rung thành công',
      data: updatedOrder,
    }
  }

  /**
   * Áp dụng điểm thưởng hội viên để giảm giá đơn hàng
   */
  async applyLoyaltyPoints(orderId: number, body: ApplyLoyaltyPointsType) {
    const order = await this.getOrderById(orderId)
    if (order.status === 'COMPLETED' || order.status === 'CANCELLED') {
      throw new Error('Chỉ có thể áp dụng điểm thưởng cho đơn hàng đang xử lý')
    }

    await this.orderRepo.applyLoyaltyPoints(
      orderId,
      body.customerId,
      body.pointsToRedeem,
      body.conversionRate
    )

    const updatedOrder = await this.getOrderById(orderId)

    return {
      message: 'Áp dụng điểm thưởng đổi chiết khấu thành công',
      data: updatedOrder,
    }
  }

  /**
   * Xóa món khỏi đơn hàng chưa chế biến
   */
  async removeOrderItem(orderDetailId: number) {
    await this.orderRepo.removeOrderItem(orderDetailId)
    return {
      message: 'Xóa món khỏi đơn hàng thành công',
    }
  }
}

```

# src\modules\pos-order\pager\pager.controller.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\pos-order\pager\pager.controller.ts` |
| Size | 4,782 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:35:12.808091 |

```typescript
import { NextFunction, Request, Response } from 'express'
import { PagerService } from './pager.service'
import {
  CreatePagerSchema,
  FilterPagerQuerySchema,
  PagerParamSchema,
  UpdateBatterySchema,
  UpdatePagerStatusSchema,
  UpdatePagerSchema,
} from './pager.schema'

export class PagerController {
  private pagerService = new PagerService()

  /**
   * GET /api/v1/pos/pagers
   * Lấy danh sách thẻ rung có phân trang & bộ lọc
   */
  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = FilterPagerQuerySchema.parse(req.query)
      const result = await this.pagerService.getPagers(query)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/v1/pos/pagers/available
   * Danh sách các thẻ rung sẵn sàng phát cho khách (AVAILABLE & Pin >= 15%)
   */
  available = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.pagerService.getAvailablePagers()
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/v1/pos/pagers/dashboard
   * Dashboard điều phối và theo dõi thời gian chờ của khách theo View v_ActivePagerDashboard
   */
  dashboard = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.pagerService.getActiveDashboard()
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/v1/pos/pagers/:id
   * Chi tiết 1 thiết bị thẻ rung
   */
  detail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = PagerParamSchema.parse(req.params)
      const data = await this.pagerService.getPagerById(id)
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/v1/pos/pagers
   * Tạo mới thiết bị thẻ rung
   */
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = CreatePagerSchema.parse(req.body)
      const result = await this.pagerService.createPager(body)
      res.status(201).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  /**
   * PUT /api/v1/pos/pagers/:id
   * Cập nhật toàn diện thông tin thẻ rung
   */
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = PagerParamSchema.parse(req.params)
      const body = UpdatePagerSchema.parse(req.body)
      const result = await this.pagerService.updatePager(id, body)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  /**
   * PATCH /api/v1/pos/pagers/:id/status
   * Cập nhật trạng thái thẻ rung (AVAILABLE, IN_USE, CHARGING, MAINTENANCE)
   */
  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = PagerParamSchema.parse(req.params)
      const body = UpdatePagerStatusSchema.parse(req.body)
      const result = await this.pagerService.updateStatus(id, body)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  /**
   * PATCH /api/v1/pos/pagers/:id/battery
   * Cập nhật mức pin thiết bị thẻ rung
   */
  updateBattery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = PagerParamSchema.parse(req.params)
      const body = UpdateBatterySchema.parse(req.body)
      const result = await this.pagerService.updateBattery(id, body)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/v1/pos/pagers/:id/release
   * Thu hồi / chuyển trạng thái thẻ rung về AVAILABLE
   */
  release = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = PagerParamSchema.parse(req.params)
      const result = await this.pagerService.releasePager(id)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  /**
   * DELETE /api/v1/pos/pagers/:id
   * Xóa mềm thiết bị thẻ rung
   */
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = PagerParamSchema.parse(req.params)
      const result = await this.pagerService.deletePager(id)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }
}

```

# src\modules\pos-order\pager\pager.repo.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\pos-order\pager\pager.repo.ts` |
| Size | 8,761 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 22:39:53.477804 |

```typescript
import { getPool, sql } from '@/config/database'
import {
  CreatePagerType,
  FilterPagerQueryType,
  UpdatePagerType,
} from './pager.schema'

export class PagerRepo {
  /**
   * Lấy danh sách thẻ rung có phân trang và bộ lọc
   */
  async getPagers(filter: FilterPagerQueryType) {
    const pool = await getPool()
    const request = pool.request()

    const { search, status, minBattery, page = 1, limit = 20 } = filter
    const offset = (page - 1) * limit
    const conditions: string[] = ['deletedAt IS NULL']

    if (search) {
      request.input('search', sql.NVarChar(50), `%${search}%`)
      conditions.push('pagerCode LIKE @search')
    }

    if (status) {
      request.input('status', sql.NVarChar(50), status)
      conditions.push('status = @status')
    }

    if (minBattery !== undefined) {
      request.input('minBattery', sql.Int, minBattery)
      conditions.push('batteryLevel >= @minBattery')
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`

    // Đếm tổng số bản ghi
    const countRes = await request.query(
      `SELECT COUNT(1) AS total FROM PagerDevice ${whereClause}`
    )
    const totalItems = countRes.recordset[0]?.total || 0

    // Lấy dữ liệu phân trang
    request.input('offset', sql.Int, offset)
    request.input('limit', sql.Int, limit)

    const listQuery = `
      SELECT 
        id,
        pagerCode,
        status,
        batteryLevel,
        createdAt,
        updatedAt
      FROM PagerDevice
      ${whereClause}
      ORDER BY 
        CASE status 
          WHEN 'AVAILABLE' THEN 1 
          WHEN 'IN_USE' THEN 2 
          WHEN 'CHARGING' THEN 3 
          ELSE 4 
        END,
        pagerCode ASC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `

    const listRes = await request.query(listQuery)

    return {
      items: listRes.recordset,
      meta: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    }
  }

  /**
   * Lấy thông tin chi tiết thẻ rung theo ID
   */
  async getPagerById(id: number) {
    const pool = await getPool()
    const request = pool.request()

    request.input('id', sql.Int, id)
    const query = `
      SELECT 
        id,
        pagerCode,
        status,
        batteryLevel,
        createdAt,
        updatedAt
      FROM PagerDevice
      WHERE id = @id AND deletedAt IS NULL
    `
    const result = await request.query(query)
    return result.recordset[0] || null
  }

  /**
   * Tìm thẻ rung theo mã pagerCode
   */
  async getPagerByCode(pagerCode: string) {
    const pool = await getPool()
    const request = pool.request()

    request.input('pagerCode', sql.VarChar(50), pagerCode)
    const query = `
      SELECT 
        id,
        pagerCode,
        status,
        batteryLevel,
        createdAt,
        updatedAt
      FROM PagerDevice
      WHERE pagerCode = @pagerCode AND deletedAt IS NULL
    `
    const result = await request.query(query)
    return result.recordset[0] || null
  }

  /**
   * Lấy danh sách thẻ rung sẵn sàng cấp cho khách (AVAILABLE và pin >= 15%)
   */
  async getAvailablePagers() {
    const pool = await getPool()
    const query = `
      SELECT 
        id,
        pagerCode,
        status,
        batteryLevel,
        createdAt
      FROM PagerDevice
      WHERE status = 'AVAILABLE' 
        AND batteryLevel >= 15 
        AND deletedAt IS NULL
      ORDER BY batteryLevel DESC, pagerCode ASC
    `
    const result = await pool.request().query(query)
    return result.recordset
  }

  /**
   * Kiểm tra thẻ rung có khả dụng không qua Function fn_IsPagerAvailable
   */
  async isPagerAvailable(pagerId: number): Promise<boolean> {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('pagerId', sql.Int, pagerId)
      .query(`SELECT dbo.fn_IsPagerAvailable(@pagerId) AS isAvailable`)

    return result.recordset[0]?.isAvailable === true || result.recordset[0]?.isAvailable === 1
  }

  /**
   * Tạo mới thiết bị thẻ rung
   */
  async createPager(data: CreatePagerType) {
    const pool = await getPool()
    const request = pool.request()

    const status = data.status || 'AVAILABLE'
    const battery = Math.min(100, Math.max(0, Math.floor(Number(data.batteryLevel) || 100)))

    request.input('pagerCode', sql.VarChar(50), data.pagerCode)
    request.input('status', sql.NVarChar(50), status)
    request.input('batteryLevel', sql.Int, battery)

    const query = `
      INSERT INTO PagerDevice (pagerCode, status, batteryLevel, createdAt)
      OUTPUT 
        INSERTED.id,
        INSERTED.pagerCode,
        INSERTED.status,
        INSERTED.batteryLevel,
        INSERTED.createdAt
      VALUES (@pagerCode, @status, @batteryLevel, SYSDATETIME())
    `
    const result = await request.query(query)
    return result.recordset[0]
  }

  /**
   * Cập nhật thông tin thẻ rung
   */
  async updatePager(id: number, data: UpdatePagerType) {
    const pool = await getPool()
    const request = pool.request()
    const updateFields: string[] = []

    request.input('id', sql.Int, id)

    if (data.pagerCode !== undefined) {
      request.input('pagerCode', sql.VarChar(50), data.pagerCode)
      updateFields.push('pagerCode = @pagerCode')
    }

    if (data.status !== undefined) {
      request.input('status', sql.NVarChar(50), data.status)
      updateFields.push('status = @status')
    }

    if (data.batteryLevel !== undefined) {
      request.input('batteryLevel', sql.Int, data.batteryLevel)
      updateFields.push('batteryLevel = @batteryLevel')
    }

    if (updateFields.length === 0) return null

    updateFields.push('updatedAt = SYSDATETIME()')

    const query = `
      UPDATE PagerDevice
      SET ${updateFields.join(', ')}
      OUTPUT 
        INSERTED.id,
        INSERTED.pagerCode,
        INSERTED.status,
        INSERTED.batteryLevel,
        INSERTED.updatedAt
      WHERE id = @id AND deletedAt IS NULL
    `
    const result = await request.query(query)
    return result.recordset[0] || null
  }

  /**
   * Cập nhật trạng thái thẻ rung
   */
  async updateStatus(id: number, status: string) {
    const pool = await getPool()
    const request = pool.request()

    request.input('id', sql.Int, id)
    request.input('status', sql.NVarChar(50), status)

    const query = `
      UPDATE PagerDevice
      SET status = @status, updatedAt = SYSDATETIME()
      OUTPUT 
        INSERTED.id,
        INSERTED.pagerCode,
        INSERTED.status,
        INSERTED.batteryLevel,
        INSERTED.updatedAt
      WHERE id = @id AND deletedAt IS NULL
    `
    const result = await request.query(query)
    return result.recordset[0] || null
  }

  /**
   * Cập nhật mức pin của thẻ rung
   */
  async updateBattery(id: number, batteryLevel: number) {
    const pool = await getPool()
    const request = pool.request()

    request.input('id', sql.Int, id)
    request.input('batteryLevel', sql.Int, batteryLevel)

    const query = `
      UPDATE PagerDevice
      SET batteryLevel = @batteryLevel, updatedAt = SYSDATETIME()
      OUTPUT 
        INSERTED.id,
        INSERTED.pagerCode,
        INSERTED.status,
        INSERTED.batteryLevel,
        INSERTED.updatedAt
      WHERE id = @id AND deletedAt IS NULL
    `
    const result = await request.query(query)
    return result.recordset[0] || null
  }

  /**
   * Xóa mềm thiết bị thẻ rung
   */
  async softDeletePager(id: number): Promise<boolean> {
    const pool = await getPool()
    const request = pool.request()

    request.input('id', sql.Int, id)
    const query = `
      UPDATE PagerDevice
      SET deletedAt = SYSDATETIME()
      WHERE id = @id AND deletedAt IS NULL
    `
    const result = await request.query(query)
    return result.rowsAffected[0] > 0
  }

  /**
   * Bảng điều phối theo dõi thẻ rung đang cấp cho khách từ View v_ActivePagerDashboard
   */
  async getActivePagerDashboard() {
    const pool = await getPool()
    const query = `
      SELECT 
        pagerCode,
        pagerStatus,
        batteryLevel,
        orderId,
        orderCode,
        customerName,
        customerPhone,
        waitingMinutes
      FROM v_ActivePagerDashboard
      ORDER BY waitingMinutes DESC
    `
    const result = await pool.request().query(query)
    return result.recordset
  }
}

```

# src\modules\pos-order\pager\pager.routes.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\pos-order\pager\pager.routes.ts` |
| Size | 1,322 bytes |
| Extension | `.ts` |
| Modified | 2026-10-01 00:07:18.624157 |

```typescript
import { Router } from 'express'
import { PagerController } from './pager.controller'
import { authGuard, roleGuard } from '@/middlewares'

export const pagerRouter = Router()
const controller = new PagerController()

// Bắt buộc đăng nhập cho toàn bộ phân hệ Pager
pagerRouter.use(authGuard)

// Cashier và Manager được xem danh sách và dashboard
pagerRouter.get('/', roleGuard('CASHIER', 'MANAGER'), controller.list)
pagerRouter.get('/available', roleGuard('CASHIER', 'MANAGER'), controller.available)
pagerRouter.get('/dashboard', roleGuard('CASHIER', 'MANAGER', 'BARISTA'), controller.dashboard)
pagerRouter.get('/:id', roleGuard('CASHIER', 'MANAGER'), controller.detail)

// Thu hồi thẻ rung: Thu ngân hoặc Pha chế
pagerRouter.post('/:id/release', roleGuard('CASHIER', 'BARISTA', 'MANAGER'), controller.release)
pagerRouter.patch('/:id/battery', roleGuard('CASHIER', 'BARISTA', 'MANAGER'), controller.updateBattery)
pagerRouter.patch('/:id/status', roleGuard('CASHIER', 'MANAGER'), controller.updateStatus)

// Cấu hình thêm mới / xóa thẻ rung: Chỉ MANAGER
pagerRouter.post('/', roleGuard('MANAGER'), controller.create)
pagerRouter.put('/:id', roleGuard('MANAGER'), controller.update)
pagerRouter.delete('/:id', roleGuard('MANAGER'), controller.delete)
```

# src\modules\pos-order\pager\pager.schema.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\pos-order\pager\pager.schema.ts` |
| Size | 2,397 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:35:12.812675 |

```typescript
import { z } from 'zod'

// 1. Schema trạng thái thẻ rung
export const PagerStatusEnum = z.enum(['AVAILABLE', 'IN_USE', 'CHARGING', 'MAINTENANCE'])

// 2. Schema tạo mới thiết bị thẻ rung
export const CreatePagerSchema = z.object({
  pagerCode: z
    .string()
    .min(1, 'Mã thẻ rung không được để trống')
    .max(50, 'Mã thẻ rung tối đa 50 ký tự'),
  status: PagerStatusEnum.default('AVAILABLE'),
  batteryLevel: z
    .number()
    .int('Mức pin phải là số nguyên')
    .min(0, 'Mức pin tối thiểu 0%')
    .max(100, 'Mức pin tối đa 100%')
    .default(100),
})

// 3. Schema cập nhật thông tin thiết bị thẻ rung
export const UpdatePagerSchema = z.object({
  pagerCode: z.string().min(1, 'Mã thẻ rung không được để trống').max(50).optional(),
  status: PagerStatusEnum.optional(),
  batteryLevel: z
    .number()
    .int('Mức pin phải là số nguyên')
    .min(0, 'Mức pin tối thiểu 0%')
    .max(100, 'Mức pin tối đa 100%')
    .optional(),
})

// 4. Schema cập nhật nhanh trạng thái thẻ
export const UpdatePagerStatusSchema = z.object({
  status: PagerStatusEnum,
})

// 5. Schema cập nhật mức pin
export const UpdateBatterySchema = z.object({
  batteryLevel: z
    .number()
    .int('Mức pin phải là số nguyên')
    .min(0, 'Mức pin tối thiểu 0%')
    .max(100, 'Mức pin tối đa 100%'),
})

// 6. Schema Params
export const PagerParamSchema = z.object({
  id: z.coerce.number().int().positive('ID thẻ rung không hợp lệ'),
})

// 7. Schema Filter Query
export const FilterPagerQuerySchema = z.object({
  search: z.string().optional(), // Tìm theo pagerCode
  status: PagerStatusEnum.optional(),
  minBattery: z.coerce.number().int().min(0).max(100).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(20),
})

export type PagerStatusType = z.infer<typeof PagerStatusEnum>
export type CreatePagerType = z.infer<typeof CreatePagerSchema>
export type UpdatePagerType = z.infer<typeof UpdatePagerSchema>
export type UpdatePagerStatusType = z.infer<typeof UpdatePagerStatusSchema>
export type UpdateBatteryType = z.infer<typeof UpdateBatterySchema>
export type FilterPagerQueryType = z.infer<typeof FilterPagerQuerySchema>

```

# src\modules\pos-order\pager\pager.service.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\pos-order\pager\pager.service.ts` |
| Size | 4,040 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:35:12.814081 |

```typescript
import { PagerRepo } from './pager.repo'
import {
  CreatePagerType,
  FilterPagerQueryType,
  UpdateBatteryType,
  UpdatePagerStatusType,
  UpdatePagerType,
} from './pager.schema'

export class PagerService {
  private pagerRepo = new PagerRepo()

  /**
   * Lấy danh sách thẻ rung có phân trang & lọc
   */
  async getPagers(filter: FilterPagerQueryType) {
    return await this.pagerRepo.getPagers(filter)
  }

  /**
   * Lấy thông tin chi tiết thẻ rung theo ID
   */
  async getPagerById(id: number) {
    const pager = await this.pagerRepo.getPagerById(id)
    if (!pager) {
      throw new Error(`Thẻ rung #${id} không tồn tại hoặc đã bị xóa`)
    }
    return pager
  }

  /**
   * Lấy danh sách thẻ rung đang sẵn sàng phục vụ khách
   */
  async getAvailablePagers() {
    return await this.pagerRepo.getAvailablePagers()
  }

  /**
   * Bảng điều phối theo dõi thời gian chờ của các thẻ đang phát cho khách
   */
  async getActiveDashboard() {
    return await this.pagerRepo.getActivePagerDashboard()
  }

  /**
   * Tạo mới thiết bị thẻ rung
   */
  async createPager(data: CreatePagerType) {
    const existing = await this.pagerRepo.getPagerByCode(data.pagerCode)
    if (existing) {
      throw new Error(`Mã thẻ rung '${data.pagerCode}' đã tồn tại trên hệ thống`)
    }

    const created = await this.pagerRepo.createPager(data)
    return {
      message: 'Thêm thiết bị thẻ rung thành công',
      data: created,
    }
  }

  /**
   * Cập nhật thông tin thẻ rung
   */
  async updatePager(id: number, data: UpdatePagerType) {
    await this.getPagerById(id)

    if (data.pagerCode) {
      const existing = await this.pagerRepo.getPagerByCode(data.pagerCode)
      if (existing && existing.id !== id) {
        throw new Error(`Mã thẻ rung '${data.pagerCode}' đã được sử dụng cho thiết bị khác`)
      }
    }

    const updated = await this.pagerRepo.updatePager(id, data)
    return {
      message: 'Cập nhật thông tin thẻ rung thành công',
      data: updated,
    }
  }

  /**
   * Cập nhật trạng thái thẻ rung (AVAILABLE, IN_USE, CHARGING, MAINTENANCE)
   */
  async updateStatus(id: number, body: UpdatePagerStatusType) {
    await this.getPagerById(id)
    const updated = await this.pagerRepo.updateStatus(id, body.status)
    return {
      message: `Cập nhật trạng thái thẻ rung thành '${body.status}' thành công`,
      data: updated,
    }
  }

  /**
   * Cập nhật mức pin của thẻ rung
   */
  async updateBattery(id: number, body: UpdateBatteryType) {
    const pager = await this.getPagerById(id)

    // Nếu pin dưới 15% mà đang để AVAILABLE, có thể tự động cảnh báo
    const updated = await this.pagerRepo.updateBattery(id, body.batteryLevel)

    return {
      message: `Cập nhật mức pin (${body.batteryLevel}%) thành công`,
      data: updated,
    }
  }

  /**
   * Thu hồi / giải phóng thẻ rung về trạng thái AVAILABLE khi khách trả thẻ
   */
  async releasePager(id: number) {
    await this.getPagerById(id)
    const updated = await this.pagerRepo.updateStatus(id, 'AVAILABLE')
    return {
      message: 'Đã thu hồi và chuyển trạng thái thẻ rung về AVAILABLE',
      data: updated,
    }
  }

  /**
   * Xóa mềm thiết bị thẻ rung
   */
  async deletePager(id: number) {
    const pager = await this.getPagerById(id)

    if (pager.status === 'IN_USE') {
      throw new Error('Không thể xóa thẻ rung đang được gán cho đơn hàng chưa hoàn tất!')
    }

    const success = await this.pagerRepo.softDeletePager(id)
    if (!success) {
      throw new Error('Xóa thiết bị thẻ rung thất bại')
    }

    return {
      message: `Đã xóa thiết bị thẻ rung #${id} thành công`,
    }
  }
}

```

# src\modules\pos-order\pos.routes.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\pos-order\pos.routes.ts` |
| Size | 251 bytes |
| Extension | `.ts` |
| Modified | 2026-09-23 23:12:46.240593 |

```typescript
import { Router } from 'express'
import { orderRouter } from './order/order.routes'
import { pagerRouter } from './pager/pager.routes'

export const posRouter = Router()
posRouter.use('/orders', orderRouter)
posRouter.use('/pagers', pagerRouter)
```

# src\modules\report\report.controller.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\report\report.controller.ts` |
| Size | 1,316 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.254531 |

```typescript
import { Request, Response, NextFunction } from 'express'
import { ReportService } from './report.service'
import { DateRangeReportSchema, TopProductsQuerySchema } from './report.schema'

export class ReportController {
    private reportService = new ReportService()

    getRevenue = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = DateRangeReportSchema.parse(req.query)
            const data = await this.reportService.getRevenueOverview(query)
            res.status(200).json({ success: true, data })
        } catch (error) {
            next(error)
        }
    }

    getTopProducts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = TopProductsQuerySchema.parse(req.query)
            const data = await this.reportService.getTopSellingProducts(query)
            res.status(200).json({ success: true, data })
        } catch (error) {
            next(error)
        }
    }

    getLowStock = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.reportService.getLowStockAlert()
            res.status(200).json({ success: true, data })
        } catch (error) {
            next(error)
        }
    }
}
```

# src\modules\report\report.repo.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\report\report.repo.ts` |
| Size | 3,527 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 19:07:36.951843 |

```typescript
import { getPool, sql } from '@/config/database'
import { DateRangeReportType, TopProductsQueryType } from './report.schema'

export class ReportRepo {
  // Thống kê tổng quan: Doanh thu, số đơn, số tiền giảm giá
  // Sử dụng View v_DailyRevenue và Function fn_GetTotalRevenue
  async getOverviewRevenue(filter: DateRangeReportType) {
    const pool = await getPool()
    const request = pool.request()

    const conditions: string[] = ['1=1']

    if (filter.fromDate) {
      // Đặt về đầu ngày (00:00:00) theo giờ địa phương
      const startOfDay = new Date(filter.fromDate)
      startOfDay.setHours(0, 0, 0, 0)
      request.input('fromDate', sql.DateTime2, startOfDay)
      conditions.push('revenueDate >= CAST(@fromDate AS DATE)')
    }

    if (filter.toDate) {
      // Đặt về cuối ngày (23:59:59.999) để không bỏ sót các hóa đơn trong ngày
      const endOfDay = new Date(filter.toDate)
      endOfDay.setHours(23, 59, 59, 999)
      request.input('toDate', sql.DateTime2, endOfDay)
      conditions.push('revenueDate <= CAST(@toDate AS DATE)')
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`

    let netRevenueExpr = 'ISNULL(SUM(totalNetRevenue), 0)'
    if (filter.fromDate && filter.toDate) {
      netRevenueExpr = 'ISNULL(dbo.fn_GetTotalRevenue(@fromDate, @toDate), 0)'
    }

    const query = `
      SELECT
        ISNULL(SUM(totalOrders), 0) AS totalOrders,
        ISNULL(SUM(totalOriginalAmount), 0) AS totalSubTotal,
        ISNULL(SUM(totalDiscountAmount), 0) AS totalDiscount,
        ${netRevenueExpr} AS netRevenue
      FROM v_DailyRevenue
      ${whereClause}
    `

    const result = await request.query(query)
    return result.recordset[0]
  }

  // Top sản phẩm bán chạy nhất
  // Sử dụng Function fn_GetTopSellingProducts (nếu có từ ngày/đến ngày) hoặc View v_TopSellingProducts
  async getTopSellingProducts(filter: TopProductsQueryType) {
    const pool = await getPool()
    const request = pool.request()

    request.input('topLimit', sql.Int, filter.limit)

    let query: string

    if (filter.fromDate && filter.toDate) {
      request.input('fromDate', sql.DateTime2, filter.fromDate)
      request.input('toDate', sql.DateTime2, filter.toDate)

      query = `
        SELECT
          productName,
          totalQuantitySold,
          totalRevenue
        FROM dbo.fn_GetTopSellingProducts(@topLimit, @fromDate, @toDate)
        ORDER BY totalQuantitySold DESC, totalRevenue DESC
      `
    } else {
      query = `
        SELECT TOP (@topLimit)
          productName,
          totalQuantitySold,
          totalRevenue
        FROM v_TopSellingProducts
        ORDER BY totalQuantitySold DESC, totalRevenue DESC
      `
    }

    const result = await request.query(query)

    return result.recordset
  }

  // Cảnh báo nguyên vật liệu sắp chạm hoặc dưới ngưỡng tối thiểu
  // Sử dụng View v_LowStockIngredients
  async getLowStockIngredients() {
    const pool = await getPool()
    const request = pool.request()

    const query = `
      SELECT
        id,
        name,
        unit,
        stockQuantity,
        minimumThreshold,
        ABS(chenhLech) AS shortageAmount
      FROM v_LowStockIngredients
      ORDER BY stockQuantity ASC
    `

    const result = await request.query(query)

    return result.recordset
  }
}
```

# src\modules\report\report.routes.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\report\report.routes.ts` |
| Size | 961 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 23:29:27.378512 |

```typescript
import { Router } from 'express'
import { ReportController } from './report.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import { DateRangeReportSchema, TopProductsQuerySchema } from './report.schema'

export const reportRouter = Router()
const controller = new ReportController()

// Chặn toàn bộ: Chỉ MANAGER và ADMIN
reportRouter.use(authGuard, roleGuard('MANAGER'))

// GET /api/v1/reports/revenue - Thống kê doanh thu theo khoảng ngày
reportRouter.get(
  '/revenue',
  validatePipe(DateRangeReportSchema, 'query'),
  controller.getRevenue
)

// GET /api/v1/reports/top-products - Báo cáo top món bán chạy nhất
reportRouter.get(
  '/top-products',
  validatePipe(TopProductsQuerySchema, 'query'),
  controller.getTopProducts
)

// GET /api/v1/reports/low-stock - Cảnh báo nguyên liệu sắp hết trong kho
reportRouter.get(
  '/low-stock',
  controller.getLowStock
)
```

# src\modules\report\report.schema.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\report\report.schema.ts` |
| Size | 1,101 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:17:55.082006 |

```typescript
import { z } from 'zod'

const BaseDateRangeSchema = z.object({
    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional(),
})

export const DateRangeReportSchema = BaseDateRangeSchema.refine(
    data => {
        if (data.fromDate && data.toDate) {
            return data.fromDate <= data.toDate
        }

        return true
    },
    {
        message: 'fromDate must be less than or equal to toDate',
        path: ['toDate'],
    },
)

export const TopProductsQuerySchema = BaseDateRangeSchema.extend({
    limit: z.coerce
        .number()
        .int()
        .positive()
        .max(100)
        .default(5),
}).refine(
    data => {
        if (data.fromDate && data.toDate) {
            return data.fromDate <= data.toDate
        }

        return true
    },
    {
        message: 'fromDate must be less than or equal to toDate',
        path: ['toDate'],
    },
)

export type DateRangeReportType = z.infer<typeof DateRangeReportSchema>

export type TopProductsQueryType = z.infer<typeof TopProductsQuerySchema>

```

# src\modules\report\report.service.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\report\report.service.ts` |
| Size | 578 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.259532 |

```typescript
import { ReportRepo } from './report.repo'
import { DateRangeReportType, TopProductsQueryType } from './report.schema'

export class ReportService {
    private reportRepo = new ReportRepo()

    async getRevenueOverview(filter: DateRangeReportType) {
        return await this.reportRepo.getOverviewRevenue(filter)
    }

    async getTopSellingProducts(filter: TopProductsQueryType) {
        return await this.reportRepo.getTopSellingProducts(filter)
    }

    async getLowStockAlert() {
        return await this.reportRepo.getLowStockIngredients()
    }
}
```

# src\server.ts

| Property | Value |
|----------|-------|
| Path | `src\server.ts` |
| Size | 1,138 bytes |
| Extension | `.ts` |
| Modified | 2026-09-23 23:11:59.078225 |

```typescript
import { createServer } from 'http'
import { createApp } from './app'
import { envConfig } from './config/env.config'
import { getPool, closePool } from './config/database'

async function bootstrap() {
  // 1. Đảm bảo kết nối SQL Server sẵn sàng trước khi lắng nghe request
  await getPool()

  const app = createApp()
  const server = createServer(app)

  server.listen(envConfig.PORT, () => {
    console.log(`🚀 CoffeeShop Backend Server đang chạy tại: http://localhost:${envConfig.PORT}`)
  })

  // 2. Xử lý tắt server sạch sẽ khi nhấn Ctrl + C
  const handleShutdown = async (signal: string) => {
    console.log(`\nNhận tín hiệu ${signal}. Đang đóng ứng dụng...`)
    server.close(async () => {
      console.log('HTTP Server đã đóng tiếp nhận request mới.')
      await closePool()
      process.exit(0)
    })
  }

  process.on('SIGINT', () => handleShutdown('SIGINT'))
  process.on('SIGTERM', () => handleShutdown('SIGTERM'))
}

bootstrap().catch((err) => {
  console.error('Không thể khởi chạy Server:', err)
  process.exit(1)
})
```

# swagger-gen.js

| Property | Value |
|----------|-------|
| Path | `swagger-gen.js` |
| Size | 2,317 bytes |
| Extension | `.js` |
| Modified | 2026-10-04 17:52:21.781956 |

```javascript
// server/swagger-gen.cjs
const fs = require('fs');
const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
  info: {
    title: 'Coffee Management System API',
    version: '1.0.0',
    description: 'Hệ thống Quản lý Chuỗi Cà phê - Project DBMS',
  },
  servers: [
    {
      url: 'http://localhost:5000', // Giữ nguyên để khớp với đường dẫn /api/v1/...
      description: 'Local Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Dán Access Token (không cần chữ Bearer)',
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

const outputFile = './src/config/swagger.json';
const routes = ['./src/app.ts'];

// 1. Chạy sinh file swagger tự động
swaggerAutogen(outputFile, routes, doc).then(() => {
  // 2. Đọc lại file JSON vừa tạo và tự động phân nhóm Tags theo tiền tố Route
  const rawData = fs.readFileSync(outputFile, 'utf8');
  const swaggerData = JSON.parse(rawData);

  for (const path in swaggerData.paths) {
    let tag = 'General';

    // Phân loại nhóm theo tiền tố URL
    if (path.includes('/auth')) tag = '1. Authentication';
    else if (path.includes('/pos')) tag = '2. POS & Pager Devices';
    else if (path.includes('/menu')) tag = '3. Menu Catalog';
    else if (path.includes('/inventory')) tag = '4. Inventory & BOM';
    else if (path.includes('/kds')) tag = '5. KDS (Bếp & Pha chế)';
    else if (path.includes('/loyalty')) tag = '6. Customer & Loyalty';
    else if (path.includes('/reports')) tag = '7. Reports & Analytics';
    else if (path.includes('/health')) tag = 'System Health';

    const methods = swaggerData.paths[path];
    for (const method in methods) {
      if (methods[method] && typeof methods[method] === 'object') {
        methods[method].tags = [tag]; // Gán lại tag thay vì để 'default'
      }
    }
  }

  // 3. Ghi đè lại file swagger.json đã phân loại hoàn chỉnh
  fs.writeFileSync(outputFile, JSON.stringify(swaggerData, null, 2), 'utf8');
  console.log('✅ Đã tự động phân nhóm Tags (thư mục) theo route thành công!');
});
```

# tsconfig.json

| Property | Value |
|----------|-------|
| Path | `tsconfig.json` |
| Size | 509 bytes |
| Extension | `.json` |
| Modified | 2026-10-04 17:52:21.783255 |

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    },
    "resolveJsonModule": true,
  },
  "include": ["src/**/*", "swagger-gen.js"],
  "exclude": ["node_modules", "dist"]
}
```

