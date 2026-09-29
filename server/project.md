# Project Dump

**Root:** `C:\Programing\hqtcsdl\Coffee_System_FinalProject_DBMS\server`

**Generated:** 2026-09-29 23:25:48.185504

**Files:** 93 | **Total size:** 243,627 bytes

---

# database\01_schema_tables.sql

| Property | Value |
|----------|-------|
| Path | `database\01_schema_tables.sql` |
| Size | 5,607 bytes |
| Extension | `.sql` |
| Modified | 2026-09-29 23:02:53.860570 |

```sql

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
| Size | 10,040 bytes |
| Extension | `.sql` |
| Modified | 2026-09-29 23:07:35.796109 |

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

ALTER TABLE PagerDevice ADD CONSTRAINT DF_PagerDevice_status DEFAULT ('IDLE') FOR status;
ALTER TABLE PagerDevice ADD CONSTRAINT DF_PagerDevice_batteryLevel DEFAULT (100) FOR batteryLevel;

ALTER TABLE Product ADD CONSTRAINT DF_Product_status DEFAULT ('ACTIVE') FOR status;
ALTER TABLE ProductVariant ADD CONSTRAINT DF_ProductVariant_price DEFAULT (0.00) FOR price;
ALTER TABLE ProductVariant ADD CONSTRAINT DF_ProductVariant_createdAt DEFAULT (SYSDATETIME()) FOR createdAt;

ALTER TABLE [Order] ADD CONSTRAINT DF_Order_orderChannel DEFAULT ('POS') FOR orderChannel;
ALTER TABLE [Order] ADD CONSTRAINT DF_Order_subTotal DEFAULT (0.00) FOR subTotal;
ALTER TABLE [Order] ADD CONSTRAINT DF_Order_discountAmount DEFAULT (0.00) FOR discountAmount;
ALTER TABLE [Order] ADD CONSTRAINT DF_Order_totalAmount DEFAULT (0.00) FOR totalAmount;
ALTER TABLE [Order] ADD CONSTRAINT DF_Order_paymentMethod DEFAULT ('CASH') FOR paymentMethod;
ALTER TABLE [Order] ADD CONSTRAINT DF_Order_status DEFAULT ('PENDING') FOR status;
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
ALTER TABLE Customer ADD CONSTRAINT CK_Customer_tier CHECK (membershipTier IN ('STANDARD', 'SILVER', 'GOLD', 'DIAMOND', 'BRONZE'));
ALTER TABLE PagerDevice ADD CONSTRAINT CK_PagerDevice_status CHECK (status IN ('IDLE', 'IN_USE', 'CHARGING', 'MAINTENANCE', 'AVAILABLE'));
ALTER TABLE [Order] ADD CONSTRAINT CK_Order_channel CHECK (orderChannel IN ('POS', 'APP', 'DELIVERY', 'ORDER_AT_COUNTER'));
ALTER TABLE [Order] ADD CONSTRAINT CK_Order_payment CHECK (paymentMethod IN ('CASH', 'BANK_TRANSFER', 'E_WALLET'));
ALTER TABLE [Order] ADD CONSTRAINT CK_Order_status CHECK (status IN ('PENDING', 'PAID', 'READY', 'COMPLETED', 'CANCELLED', 'PENDING_PREP', 'READY_FOR_PICKUP'));
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
| Size | 0 bytes |
| Extension | `.sql` |
| Modified | 2026-09-23 23:06:23.809586 |

```sql

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
| Size | 0 bytes |
| Extension | `.sql` |
| Modified | 2026-09-23 23:06:23.822105 |

```sql

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
| Size | 7,844 bytes |
| Extension | `.sql` |
| Modified | 2026-09-29 23:23:59.403485 |

```sql


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
```

# database\seed_data.sql

| Property | Value |
|----------|-------|
| Path | `database\seed_data.sql` |
| Size | 12,411 bytes |
| Extension | `.sql` |
| Modified | 2026-09-29 23:02:13.230580 |

```sql

-- Tắt kiểm tra khóa ngoại tạm thời để dọn dẹp và nạp dữ liệu sạch
EXEC sp_MSforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT all";
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
INSERT INTO Customer (id, phoneNumber, fullName, password, rewardPoints, membershipTier, createdAt, updatedAt)
VALUES
(1, '0988111222', N'Nguyễn Văn An', '$2b$10$abcdefghijklmnopqrstuv', 150, 'SILVER', GETDATE(), GETDATE()),
(2, '0977222333', N'Lê Thị Mai', '$2b$10$abcdefghijklmnopqrstuv', 550, 'GOLD', GETDATE(), GETDATE()),
(3, '0966333444', N'Trần Tuấn Kiệt', '$2b$10$abcdefghijklmnopqrstuv', 20, 'BRONZE', GETDATE(), GETDATE()),
(4, '0911888999', N'Phạm Hoàng Nam', '$2b$10$abcdefghijklmnopqrstuv', 1250, 'DIAMOND', GETDATE(), GETDATE());
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
SET IDENTITY_INSERT LoyaltyTransaction ON;
INSERT INTO LoyaltyTransaction (id, customerId, orderId, transactionType, points, balanceAfter, description, createdAt)
VALUES
(1, 1, 1, 'EARN', 4, 150, N'Tích lũy điểm từ hóa đơn ORD260901', DATEADD(DAY, -1, GETDATE())),
(2, 2, 2, 'REDEEM', 10, 550, N'Đổi 10 điểm giảm 10.000 VNĐ cho đơn ORD260902', GETDATE());
SET IDENTITY_INSERT LoyaltyTransaction OFF;
GO

-- Bật lại kiểm tra toàn vẹn khóa ngoại
EXEC sp_MSforeachtable "ALTER TABLE ? WITH CHECK CHECK CONSTRAINT all";
GO
```

# package-lock.json

| Property | Value |
|----------|-------|
| Path | `package-lock.json` |
| Size | 99,481 bytes |
| Extension | `.json` |
| Modified | 2026-09-27 21:01:09.374100 |

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
        "bcrypt": "^6.0.0",
        "cors": "^2.8.5",
        "dotenv": "^17.2.1",
        "express": "^4.21.2",
        "helmet": "^8.1.0",
        "jsonwebtoken": "^9.0.2",
        "mssql": "^11.0.1",
        "pino": "^9.6.0",
        "pino-http": "^10.4.0",
        "zod": "^3.24.2"
      },
      "devDependencies": {
        "@types/bcrypt": "^6.0.0",
        "@types/cors": "^2.8.17",
        "@types/express": "^4.17.21",
        "@types/jsonwebtoken": "^9.0.8",
        "@types/mssql": "^9.0.6",
        "@types/node": "^24.3.0",
        "tsx": "^4.19.3",
        "typescript": "^5.9.2"
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
    "node_modules/agent-base": {
      "version": "7.1.4",
      "resolved": "https://registry.npmjs.org/agent-base/-/agent-base-7.1.4.tgz",
      "integrity": "sha512-MnA+YT8fwfJPgBx3m60MNqakm30XOkyIoH1y6huTQvC0PwZG7ki8NacLBcrPbNoo8vEZy7Jpuk7+jMO+CUovTQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 14"
      }
    },
    "node_modules/array-flatten": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/array-flatten/-/array-flatten-1.1.1.tgz",
      "integrity": "sha512-PCVAQswWemu6UdxsDFFX/+gVeYqKAod3D3UVm91jHwynguOwAvYPhx8nNlM++NqRcK6CxxpUafjmhIdKiHibqg==",
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
    "node_modules/commander": {
      "version": "11.1.0",
      "resolved": "https://registry.npmjs.org/commander/-/commander-11.1.0.tgz",
      "integrity": "sha512-yPVavfyCcRhmorC7rWlkHn15b4wDVgVmBA7kV4QVBsF7kv/9TKJAbAXVTxvTnwP8HHKjRCJDClKbciiYS7p0DQ==",
      "license": "MIT",
      "engines": {
        "node": ">=16"
      }
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
    "node_modules/debug": {
      "version": "2.6.9",
      "resolved": "https://registry.npmjs.org/debug/-/debug-2.6.9.tgz",
      "integrity": "sha512-bC7ElrdJaJnPbAP+1EotYvqZsb3ecl5wi6Bfi6BJTUcNowp6cvspg0jXznRTKDjm/E7AdgFBVeAPVMNcKGsHMA==",
      "license": "MIT",
      "dependencies": {
        "ms": "2.0.0"
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
    "node_modules/js-md4": {
      "version": "0.3.2",
      "resolved": "https://registry.npmjs.org/js-md4/-/js-md4-0.3.2.tgz",
      "integrity": "sha512-/GDnfQYsltsjRswQhN9fhv3EMw2sCpUdrdxyWDOUK7eyD++r3gRhzgiQgc/x4MAv2i1iuQ4lxO5mvqM3vj4bwA==",
      "license": "MIT"
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
    "node_modules/lodash.once": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/lodash.once/-/lodash.once-4.1.1.tgz",
      "integrity": "sha512-Sb487aTOCr9drQVL8pIxOzVhafOjZN9UU54hiN8PU3uAiSV7lx1yYNpbNmex2PK6dSJoNTSJUUswT651yww3Mg==",
      "license": "MIT"
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
    "node_modules/parseurl": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/parseurl/-/parseurl-1.3.3.tgz",
      "integrity": "sha512-CiyeOxFT/JZyN5m0z9PfXw4SCBJ6Sygz1Dpl0wqjlhDEGGBP1GnsUVEL0p63hoG1fcj3fHynXi9NYO4nWOL+qQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
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
| Size | 854 bytes |
| Extension | `.json` |
| Modified | 2026-09-23 23:14:23.623756 |

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
    "bcrypt": "^6.0.0",
    "cors": "^2.8.5",
    "dotenv": "^17.2.1",
    "express": "^4.21.2",
    "helmet": "^8.1.0",
    "jsonwebtoken": "^9.0.2",
    "mssql": "^11.0.1",
    "pino": "^9.6.0",
    "pino-http": "^10.4.0",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/bcrypt": "^6.0.0",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.8",
    "@types/mssql": "^9.0.6",
    "@types/node": "^24.3.0",
    "tsx": "^4.19.3",
    "typescript": "^5.9.2"
  }
}
```

# src\app.ts

| Property | Value |
|----------|-------|
| Path | `src\app.ts` |
| Size | 1,487 bytes |
| Extension | `.ts` |
| Modified | 2026-09-23 23:11:40.976274 |

```typescript
import express, { Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import pinoHttp from 'pino-http'
import { errorFilter } from './middlewares/error.filter'

// Import router của 6 phân hệ
import { posRouter } from './modules/pos-order/pos.routes'
import { menuRouter } from './modules/menu-catalog/menu.routes'
import { inventoryRouter } from './modules/inventory-bom/inventory.routes'
import { kdsRouter } from './modules/kds/kds.routes'
import { customerLoyaltyRouter } from './modules/customer-loyalty/customer-loyalty.routes'
import { reportRouter } from './modules/report/report.routes'

export const createApp = (): Express => {
  const app = express()

  // 1. Global Middlewares
  app.use(helmet())
  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(pinoHttp({ autoLogging: false }))

  // 2. Health check
  app.get('/api/health', (_, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date() })
  })

  // 3. Đăng ký các phân hệ (Prefix API v1)
  app.use('/api/v1/pos', posRouter)
  app.use('/api/v1/menu', menuRouter)
  app.use('/api/v1/inventory', inventoryRouter)
  app.use('/api/v1/kds', kdsRouter)
  app.use('/api/v1/loyalty', customerLoyaltyRouter)
  app.use('/api/v1/reports', reportRouter)

  // 4. Global Error Filter (Bắt lỗi T-SQL và runtime, luôn để cuối cùng)
  app.use(errorFilter)

  return app
}
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
| Size | 892 bytes |
| Extension | `.ts` |
| Modified | 2026-09-23 23:11:24.181327 |

```typescript
import dotenv from 'dotenv'
import { z } from 'zod'

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
  JWT_EXPIRES_IN: z.string().default('1d'),
})

const parseResult = envSchema.safeParse(process.env)

if (!parseResult.success) {
  console.error('❌ Lỗi cấu hình file .env:')
  console.error(parseResult.error.flatten().fieldErrors)
  process.exit(1)
}

export const envConfig = parseResult.data
```

# src\middlewares\auth.guard.ts

| Property | Value |
|----------|-------|
| Path | `src\middlewares\auth.guard.ts` |
| Size | 2,721 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 23:17:24.990902 |

```typescript
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { envConfig } from '@/config/env.config'
import { getPool, sql } from '@/config/database'

// Mở rộng kiểu dữ liệu của Express Request để chứa thông tin User đăng nhập
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number
        username: string
        fullName: string
        role: 'ADMIN' | 'MANAGER' | 'CASHIER' | 'BARISTA' | 'STOREKEEPER'
      }
    }
  }
}

interface JwtPayload {
  id: number
  username: string
  role: 'ADMIN' | 'MANAGER' | 'CASHIER' | 'BARISTA' | 'STOREKEEPER'
}

export const authGuard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Yêu cầu đăng nhập để truy cập tài nguyên này (Thiếu Bearer Token).',
      })
      return
    }

    const token = authHeader.split(' ')[1]

    // 1. Xác thực tính hợp lệ của Token
    let decoded: JwtPayload
    try {
      decoded = jwt.verify(token, envConfig.JWT_SECRET) as JwtPayload
    } catch (err: any) {
      res.status(401).json({
        success: false,
        message: err.name === 'TokenExpiredError' ? 'Phiên đăng nhập đã hết hạn.' : 'Token xác thực không hợp lệ.',
      })
      return
    }

    // 2. Kiểm tra tài khoản nhân viên trực tiếp dưới SQL Server (Chống dùng token khi đã bị deactive)
    const pool = await getPool()
    const dbReq = pool.request()
    dbReq.input('id', sql.Int, decoded.id)

    const result = await dbReq.query(`
      SELECT id, username, fullName, role, status 
      FROM Employee 
      WHERE id = @id AND deletedAt IS NULL
    `)

    if (result.recordset.length === 0) {
      res.status(401).json({
        success: false,
        message: 'Tài khoản nhân viên không tồn tại hoặc đã bị xóa.',
      })
      return
    }

    const employee = result.recordset[0]

    if (employee.status !== 'ACTIVE') {
      res.status(403).json({
        success: false,
        message: 'Tài khoản nhân viên đã bị khóa hoặc ngừng hoạt động.',
      })
      return
    }

    // Gắn thông tin tài khoản đã xác thực vào request
    req.user = {
      id: employee.id,
      username: employee.username,
      fullName: employee.fullName,
      role: employee.role,
    }

    next()
  } catch (error) {
    next(error)
  }
}
```

# src\middlewares\error.filter.ts

| Property | Value |
|----------|-------|
| Path | `src\middlewares\error.filter.ts` |
| Size | 282 bytes |
| Extension | `.ts` |
| Modified | 2026-09-27 21:08:02.916627 |

```typescript
import { Request, Response, NextFunction } from 'express'
export const errorFilter = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
};

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
| Size | 1,209 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 23:17:59.888469 |

```typescript
import { Request, Response, NextFunction } from 'express'

type EmployeeRole = 'ADMIN' | 'MANAGER' | 'CASHIER' | 'BARISTA' | 'STOREKEEPER'

/**
 * Middleware kiểm tra quyền (RBAC)
 * @param allowedRoles Danh sách các role được phép gọi API
 * Ví dụ: roleGuard('MANAGER', 'CASHIER')
 */
export const roleGuard = (...allowedRoles: EmployeeRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Luôn kiểm tra authGuard trước đó
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Chưa xác thực người dùng.',
      })
      return
    }

    const userRole = req.user.role

    // Role ADMIN luôn có quyền tối cao truy cập tất cả tài nguyên
    if (userRole === 'ADMIN') {
      next()
      return
    }

    // Kiểm tra role hiện tại có nằm trong danh sách cho phép không
    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({
        success: false,
        message: `Truy cập bị từ chối: Vai trò [${userRole}] không có quyền thực hiện nghiệp vụ này.`,
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

# src\modules\customer-loyalty\customer\customer.controller.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\customer-loyalty\customer\customer.controller.ts` |
| Size | 1,879 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.190008 |

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
}
```

# src\modules\customer-loyalty\customer\customer.repo.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\customer-loyalty\customer\customer.repo.ts` |
| Size | 5,549 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.191005 |

```typescript
import { getPool, sql } from '@/config/database'
import { CreateCustomerType, FilterCustomerQueryType, UpdateCustomerType } from './customer.schema'

export class CustomerRepo {
    async getCustomers(filter: FilterCustomerQueryType) {
        const pool = await getPool()
        const request = pool.request()

        const { search, membershipTier, page = 1, limit = 20 } = filter
        const offset = (page - 1) * limit
        const conditions: string[] = ['deletedAt IS NULL']

        if (membershipTier) {
            request.input('membershipTier', sql.NVarChar(50), membershipTier)
            conditions.push('membershipTier = @membershipTier')
        }

        if (search) {
            request.input('search', sql.NVarChar(150), `%${search}%`)
            conditions.push('(fullName LIKE @search OR phoneNumber LIKE @search)')
        }

        const whereClause = `WHERE ${conditions.join(' AND ')}`

        // Đếm tổng số bản ghi
        const countQuery = `SELECT COUNT(1) AS total FROM Customer ${whereClause}`
        const countResult = await request.query(countQuery)
        const totalItems = countResult.recordset[0]?.total || 0

        // Truy vấn danh sách có phân trang chuẩn SQL Server
        request.input('offset', sql.Int, offset)
        request.input('limit', sql.Int, limit)

        const listQuery = `
      SELECT 
        id, 
        phoneNumber, 
        fullName, 
        rewardPoints, 
        membershipTier, 
        createdAt, 
        updatedAt
      FROM Customer
      ${whereClause}
      ORDER BY createdAt DESC
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
        id, 
        phoneNumber, 
        fullName, 
        rewardPoints, 
        membershipTier, 
        createdAt, 
        updatedAt
      FROM Customer 
      WHERE id = @id AND deletedAt IS NULL
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
      INSERT INTO Customer (fullName, phoneNumber, password)
      OUTPUT 
        INSERTED.id, 
        INSERTED.fullName, 
        INSERTED.phoneNumber, 
        INSERTED.rewardPoints, 
        INSERTED.membershipTier, 
        INSERTED.createdAt
      VALUES (@fullName, @phoneNumber, @password)
    `
        const result = await request.query(query)
        return result.recordset[0]
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
        const result = await request.query(query)
        return result.recordset[0] || null
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
| Size | 549 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.193004 |

```typescript
import { Router } from 'express'
export const customerRouter = Router()
import { CustomerController } from './customer.controller'

const controller = new CustomerController()

// GET /api/v1/customer-loyalty/customers
customerRouter.get('/', controller.list)

// GET /api/v1/customer-loyalty/customers/:id
customerRouter.get('/:id', controller.detail)

// POST /api/v1/customer-loyalty/customers
customerRouter.post('/', controller.create)

// PUT /api/v1/customer-loyalty/customers/:id
customerRouter.put('/:id', controller.update)
```

# src\modules\customer-loyalty\customer\customer.schema.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\customer-loyalty\customer\customer.schema.ts` |
| Size | 1,169 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.194005 |

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
    membershipTier: z.enum(['STANDARD', 'SILVER', 'GOLD', 'DIAMOND', 'BRONZE']).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(20),
})

export type CreateCustomerType = z.infer<typeof CreateCustomerSchema>
export type UpdateCustomerType = z.infer<typeof UpdateCustomerSchema>
export type FilterCustomerQueryType = z.infer<typeof FilterCustomerQuerySchema>
```

# src\modules\customer-loyalty\customer\customer.service.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\customer-loyalty\customer\customer.service.ts` |
| Size | 1,847 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.196006 |

```typescript
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
            throw new Error('Khách hàng không tồn tại hoặc đã bị xóa')
        }
        return customer
    }

    async createCustomer(data: CreateCustomerType) {
        const existing = await this.customerRepo.getCustomerByPhone(data.phoneNumber)
        if (existing) {
            throw new Error('Số điện thoại khách hàng đã tồn tại trên hệ thống')
        }

        const customer = await this.customerRepo.createCustomer(data)
        return {
            message: 'Tạo thông tin khách hàng thành công',
            data: customer,
        }
    }

    async updateCustomer(id: number, data: UpdateCustomerType) {
        if (data.phoneNumber) {
            const existing = await this.customerRepo.getCustomerByPhone(data.phoneNumber)
            if (existing && existing.id !== id) {
                throw new Error('Số điện thoại này đã được sử dụng bởi khách hàng khác')
            }
        }

        const updated = await this.customerRepo.updateCustomer(id, data)
        if (!updated) {
            throw new Error('Cập nhật thất bại hoặc không tìm thấy khách hàng')
        }

        return {
            message: 'Cập nhật thông tin khách hàng thành công',
            data: updated,
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
| Size | 6,168 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.198003 |

```typescript
import { getPool, sql } from '@/config/database'
import { AdjustPointsType, FilterLoyaltyHistoryQueryType } from './loyalty.schema'

export class LoyaltyRepo {
    async getLoyaltyHistory(filter: FilterLoyaltyHistoryQueryType) {
        const pool = await getPool()
        const request = pool.request()

        const { customerId, orderId, transactionType, fromDate, toDate, page = 1, limit = 20 } = filter
        const offset = (page - 1) * limit
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
            request.input('fromDate', sql.DateTime2, new Date(fromDate))
            conditions.push('lt.createdAt >= @fromDate')
        }

        if (toDate) {
            request.input('toDate', sql.DateTime2, new Date(toDate))
            conditions.push('lt.createdAt <= @toDate')
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
      ORDER BY lt.createdAt DESC
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

            // Kiểm tra và khóa dòng dữ liệu của Customer
            const customerRes = await lockReq.query(`
        SELECT rewardPoints, membershipTier 
        FROM Customer WITH (UPDLOCK, ROWLOCK)
        WHERE id = @customerId AND deletedAt IS NULL
      `)

            if (customerRes.recordset.length === 0) {
                throw new Error('Khách hàng không tồn tại hoặc đã bị xóa')
            }

            const currentPoints: number = customerRes.recordset[0].rewardPoints
            let newBalance = currentPoints

            if (data.transactionType === 'EARN') {
                newBalance += data.points
            } else if (data.transactionType === 'REDEEM') {
                if (currentPoints < data.points) {
                    throw new Error(`Điểm thưởng không đủ (Hiện có: ${currentPoints}, cần đổi: ${data.points})`)
                }
                newBalance -= data.points
            }

            // Xác định hạng thành viên mới theo mốc điểm
            let newTier = 'STANDARD'
            if (newBalance >= 1000) newTier = 'DIAMOND'
            else if (newBalance >= 500) newTier = 'GOLD'
            else if (newBalance >= 200) newTier = 'SILVER'

            // Cập nhật Customer
            const updateReq = new sql.Request(transaction)
            updateReq.input('customerId', sql.Int, data.customerId)
            updateReq.input('newBalance', sql.Int, newBalance)
            updateReq.input('newTier', sql.NVarChar(50), newTier)

            await updateReq.query(`
        UPDATE Customer 
        SET rewardPoints = @newBalance, 
            membershipTier = @newTier, 
            updatedAt = SYSDATETIME()
        WHERE id = @customerId
      `)

            // Ghi log vào bảng LoyaltyTransaction
            const logReq = new sql.Request(transaction)
            logReq.input('customerId', sql.Int, data.customerId)
            logReq.input('orderId', sql.Int, data.orderId || null)
            logReq.input('transactionType', sql.NVarChar(50), data.transactionType)
            logReq.input('points', sql.Int, data.points)
            logReq.input('balanceAfter', sql.Int, newBalance)
            logReq.input('description', sql.NVarChar(500), data.description || null)

            const logRes = await logReq.query(`
        INSERT INTO LoyaltyTransaction (customerId, orderId, transactionType, points, balanceAfter, description)
        OUTPUT 
          INSERTED.id, 
          INSERTED.customerId, 
          INSERTED.orderId, 
          INSERTED.transactionType, 
          INSERTED.points, 
          INSERTED.balanceAfter, 
          INSERTED.description, 
          INSERTED.createdAt
        VALUES (@customerId, @orderId, @transactionType, @points, @balanceAfter, @description)
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
| Size | 421 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.199005 |

```typescript
import { Router } from 'express'
import { LoyaltyController } from './loyalty.controller'

export const loyaltyRouter = Router()
const controller = new LoyaltyController()

// GET /api/v1/customer-loyalty/loyalty/history
loyaltyRouter.get('/history', controller.getHistory)

// POST /api/v1/customer-loyalty/loyalty/adjust (Tích / Tiêu điểm thưởng)
loyaltyRouter.post('/adjust', controller.adjustPoints)
```

# src\modules\customer-loyalty\loyalty\loyalty.schema.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\customer-loyalty\loyalty\loyalty.schema.ts` |
| Size | 1,167 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.200006 |

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

export const FilterLoyaltyHistoryQuerySchema = z.object({
    customerId: z.coerce.number().int().positive().optional(),
    orderId: z.coerce.number().int().positive().optional(),
    transactionType: z.enum(['EARN', 'REDEEM']).optional(),
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(20),
})

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
| Size | 397 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.204004 |

```typescript
import { Router } from 'express'
import { AdjustmentController } from './adjustment.controller'

export const adjustmentRouter = Router()
const controller = new AdjustmentController()

// GET /api/v1/inventory/adjustments
adjustmentRouter.get('/', controller.list)

// POST /api/v1/inventory/adjustments (Cân kho, điều chỉnh hao hụt)
adjustmentRouter.post('/', controller.create)
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
| Size | 2,983 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:50:29.603734 |

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
    return await req.execute('sp_CauHinhDinhLuongBOM')
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
| Size | 797 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.210002 |

```typescript
import { Router } from 'express'
import { BOMController } from './bom.controller'

export const bomRouter = Router()
const controller = new BOMController()

// GET /api/v1/inventory/boms/recipes?variantId=1
bomRouter.get('/recipes', controller.getRecipes)

// GET /api/v1/inventory/boms/toppings/:toppingId
bomRouter.get('/toppings/:toppingId', controller.getToppingBOM)

// POST /api/v1/inventory/boms/recipes (Cấu hình định lượng món)
bomRouter.post('/recipes', controller.upsertRecipe)

// POST /api/v1/inventory/boms/toppings (Cấu hình định lượng topping)
bomRouter.post('/toppings', controller.upsertTopping)

// DELETE /api/v1/inventory/boms/recipes/:variantId/:ingredientId
bomRouter.delete('/recipes/:variantId/:ingredientId', controller.deleteRecipe)
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
| Size | 3,308 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:51:41.030498 |

```typescript
import { getPool, sql } from '@/config/database'
import { QueryImportTicketType } from './import.schema'

export class ImportRepo {
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
    const transaction = new sql.Transaction(pool)
    await transaction.begin()
    try {
      const headerReq = new sql.Request(transaction)
      headerReq.input('employeeId', sql.Int, data.employeeId)
      headerReq.input('supplierName', sql.NVarChar(255), data.supplierName)
      headerReq.input('totalAmount', sql.Decimal(18, 2), data.totalAmount)
      headerReq.input('note', sql.NVarChar(sql.MAX), data.note || null)

      const headerRes = await headerReq.query(`
        INSERT INTO InventoryImport (employeeId, supplierName, totalAmount, importDate, note)
        OUTPUT INSERTED.id
        VALUES (@employeeId, @supplierName, @totalAmount, SYSDATETIME(), @note)
      `)
      const importId = headerRes.recordset[0].id

      for (const item of data.details) {
        const detailReq = new sql.Request(transaction)
        const lineTotal = item.quantity * item.unitPrice
        detailReq.input('importId', sql.Int, importId)
        detailReq.input('ingredientId', sql.Int, item.ingredientId)
        detailReq.input('quantity', sql.Decimal(18, 3), item.quantity)
        detailReq.input('unitPrice', sql.Decimal(18, 2), item.unitPrice)
        detailReq.input('totalLineAmount', sql.Decimal(18, 2), lineTotal)

        // Trigger trg_Ingredient_CongKho_KhiNhapHang sẽ tự động cộng dồn kho sau câu lệnh INSERT này
        await detailReq.query(`
          INSERT INTO InventoryImportDetail (importId, ingredientId, quantity, unitPrice, totalLineAmount)
          VALUES (@importId, @ingredientId, @quantity, @unitPrice, @totalLineAmount)
        `)
      }

      await transaction.commit()
      return { importId, ...data }
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}
```

# src\modules\inventory-bom\import\import.routes.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\inventory-bom\import\import.routes.ts` |
| Size | 573 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.214002 |

```typescript
import { Router } from 'express'
import { ImportController } from './import.controller'

export const importRouter = Router()
const controller = new ImportController()

// GET /api/v1/inventory/imports (Danh sách phiếu nhập)
importRouter.get('/', controller.getImportTickets)

// GET /api/v1/inventory/imports/:importId (Chi tiết phiếu nhập kèm danh sách hàng hóa)
importRouter.get('/:importId', controller.getImportDetailById)

// POST /api/v1/inventory/imports (Tạo phiếu nhập mới)
importRouter.post('/', controller.createImportTicket)
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
| Size | 771 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.220005 |

```typescript
import { Router } from 'express'
import { IngredientController } from './ingredient.controller'

export const ingredientRouter = Router()
const controller = new IngredientController()

// GET /api/v1/inventory/ingredients?isLowStock=true
ingredientRouter.get('/', controller.getIngredients)

// GET /api/v1/inventory/ingredients/:ingredientId
ingredientRouter.get('/:ingredientId', controller.getIngredientById)

// POST /api/v1/inventory/ingredients
ingredientRouter.post('/', controller.createIngredient)

// PUT /api/v1/inventory/ingredients/:ingredientId
ingredientRouter.put('/:ingredientId', controller.updateIngredient)

// DELETE /api/v1/inventory/ingredients/:ingredientId
ingredientRouter.delete('/:ingredientId', controller.deleteIngredient)
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
| Size | 4,664 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 23:07:00.676929 |

```typescript
import { getPool, sql } from '@/config/database'
import { QueryKdsQueueType, UpdateItemStatusType } from './kds.schema'

export class KDSRepo {
  // 1. Lấy danh sách hàng đợi các món cần pha chế trên KDS (UC17)
  async getKdsQueue(query: QueryKdsQueueType) {
    const pool = await getPool()
    const req = pool.request()

    const conditions: string[] = [
      "o.status IN ('PENDING_PREP', 'READY_FOR_PICKUP')",
      "od.itemStatus NOT IN ('DONE', 'CANCELLED')",
      "o.deletedAt IS NULL"
    ]

    if (query.status !== 'ALL') {
      req.input('itemStatus', sql.NVarChar(50), query.status)
      conditions.push('od.itemStatus = @itemStatus')
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
      WHERE ${conditions.join(' AND ')}
      ORDER BY od.createdAt ASC
    `
    const itemsResult = await req.query(sqlStr)

    // Nếu không có món nào
    if (itemsResult.recordset.length === 0) {
      return []
    }

    // Lấy kèm topping cho từng ly
    const detailIds = itemsResult.recordset.map((item) => item.orderDetailId)
    const toppingResult = await pool.request().query(`
      SELECT 
        orderDetailId, 
        toppingSnapshotName, 
        quantity 
      FROM OrderDetailTopping
      WHERE orderDetailId IN (${detailIds.join(',')})
    `)

    const toppingsByDetailId = toppingResult.recordset.reduce((acc: any, top: any) => {
      if (!acc[top.orderDetailId]) acc[top.orderDetailId] = []
      acc[top.orderDetailId].push({
        name: top.toppingSnapshotName,
        quantity: top.quantity,
      })
      return acc
    }, {})

    // Ghép topping vào từng dòng ly nước
    return itemsResult.recordset.map((item) => ({
      ...item,
      toppings: toppingsByDetailId[item.orderDetailId] || [],
    }))
  }

  // 2. Barista cập nhật trạng thái món -> Nếu chuyển sang 'DONE', 
  // Trigger trg_Ingredient_TruKho_KhiHoanThanhMon dưới CSDL sẽ tự động trừ kho BOM!
  async updateItemStatus(orderDetailId: number, data: UpdateItemStatusType) {
    const pool = await getPool()
    const req = pool.request()

    req.input('orderDetailId', sql.Int, orderDetailId)
    req.input('itemStatus', sql.NVarChar(50), data.itemStatus)

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
    `)

    return result.recordset[0] || null
  }

  // 3. Rung chuông thẻ rung & Chuyển trạng thái Order sang READY_FOR_PICKUP (UC18, UC19)
  async triggerReadyAlarm(orderId: number) {
    const pool = await getPool()
    const req = pool.request()
    req.input('orderId', sql.Int, orderId)

    // Kiểm tra xem tất cả các ly trong đơn đã xong (DONE) chưa
    const checkResult = await req.query(`
      SELECT 
        COUNT(CASE WHEN itemStatus <> 'DONE' AND itemStatus <> 'CANCELLED' THEN 1 END) AS pendingCount,
        MAX(pagerId) AS pagerId
      FROM OrderDetail od
      JOIN [Order] o ON od.orderId = o.id
      WHERE o.id = @orderId
      GROUP BY o.id
    `)

    if (checkResult.recordset.length === 0) {
      throw new Error(`Đơn hàng #${orderId} không tồn tại`)
    }

    const { pendingCount, pagerId } = checkResult.recordset[0]
    if (pendingCount > 0) {
      throw new Error(`Đơn hàng vẫn còn ${pendingCount} món chưa pha chế xong, chưa thể rung chuông báo khách!`)
    }

    // Cập nhật Order sang READY_FOR_PICKUP
    await req.query(`
      UPDATE [Order]
      SET status = 'READY_FOR_PICKUP',
          updatedAt = SYSDATETIME()
      WHERE id = @orderId
    `)

    return {
      orderId,
      status: 'READY_FOR_PICKUP',
      pagerId,
      alarmTriggered: true,
      message: 'Đã kích hoạt thẻ rung và thông báo đơn sẵn sàng để nhận đồ uống',
    }
  }
}
```

# src\modules\kds\kds.routes.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\kds\kds.routes.ts` |
| Size | 641 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 23:07:30.664148 |

```typescript
import { Router } from 'express'
import { KDSController } from './kds.controller'

export const kdsRouter = Router()
const controller = new KDSController()

// GET /api/v1/kds/queue?status=PENDING (Lấy hàng đợi KDS cho Barista)
kdsRouter.get('/queue', controller.getQueue)

// PATCH /api/v1/kds/items/:orderDetailId/status (Cập nhật hoàn thành món -> Kích hoạt Trigger trừ kho)
kdsRouter.patch('/items/:orderDetailId/status', controller.updateItemStatus)

// POST /api/v1/kds/orders/:orderId/notify-ready (Bấm chuông rung báo khách lấy nước)
kdsRouter.post('/orders/:orderId/notify-ready', controller.notifyReady)
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
| Size | 2,074 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:27.272442 |

```typescript
import { Request, Response } from 'express';
import { CategoryService } from './category.service';
import { createCategorySchema, updateCategorySchema } from './category.schema';

export class CategoryController {
  private categoryService = new CategoryService();

  getAll = async (req: Request, res: Response) => {
    try {
      const categories = await this.categoryService.getAllCategories();
      res.status(200).json({ success: true, data: categories });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const category = await this.categoryService.getCategoryById(req.params.id);
      res.status(200).json({ success: true, data: category });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const validated = createCategorySchema.parse(req.body);
      const newCategory = await this.categoryService.createCategory(validated);
      res.status(201).json({ success: true, data: newCategory });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || error.errors });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const validated = updateCategorySchema.parse(req.body);
      const updated = await this.categoryService.updateCategory(req.params.id, validated);
      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || error.errors });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.categoryService.deleteCategory(req.params.id);
      res.status(200).json({ success: true, message: 'Xóa danh mục thành công' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}
```

# src\modules\menu-catalog\category\category.repo.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\menu-catalog\category\category.repo.ts` |
| Size | 2,586 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:27.273442 |

```typescript
import pool from '../../../config/database';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at?: Date;
}

export class CategoryRepository {
  async findAll(): Promise<Category[]> {
    const query = `
      SELECT id, name, slug, description, sort_order, is_active 
      FROM categories 
      ORDER BY sort_order ASC, name ASC
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  async findById(id: string): Promise<Category | null> {
    const query = `SELECT * FROM categories WHERE id = $1`;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const query = `SELECT * FROM categories WHERE slug = $1`;
    const { rows } = await pool.query(query, [slug]);
    return rows[0] || null;
  }

  async create(data: Partial<Category>): Promise<Category> {
    const query = `
      INSERT INTO categories (name, slug, description, sort_order, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [data.name, data.slug, data.description || null, data.sort_order ?? 0, data.is_active ?? true];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async update(id: string, data: Partial<Category>): Promise<Category | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.name !== undefined) { fields.push(`name = $${idx++}`); values.push(data.name); }
    if (data.slug !== undefined) { fields.push(`slug = $${idx++}`); values.push(data.slug); }
    if (data.description !== undefined) { fields.push(`description = $${idx++}`); values.push(data.description); }
    if (data.sort_order !== undefined) { fields.push(`sort_order = $${idx++}`); values.push(data.sort_order); }
    if (data.is_active !== undefined) { fields.push(`is_active = $${idx++}`); values.push(data.is_active); }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const query = `
      UPDATE categories 
      SET ${fields.join(', ')} 
      WHERE id = $${idx} 
      RETURNING *
    `;
    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const query = `DELETE FROM categories WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
```

# src\modules\menu-catalog\category\category.routes.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\menu-catalog\category\category.routes.ts` |
| Size | 550 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 23:12:58.844942 |

```typescript
import { Router } from 'express';
import { CategoryController } from './category.controller';

export const categoryRouter = Router(); // Đổi từ const router sang export const categoryRouter
const controller = new CategoryController();

categoryRouter.get('/', controller.getAll);
categoryRouter.get('/:id', controller.getById);
categoryRouter.post('/', controller.create);
categoryRouter.put('/:id', controller.update);
categoryRouter.delete('/:id', controller.delete);

// Xóa bỏ hoặc thay thế dòng "export default router;"
```

# src\modules\menu-catalog\category\category.schema.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\menu-catalog\category\category.schema.ts` |
| Size | 613 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:27.275446 |

```typescript
import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Tên danh mục không được để trống').max(100),
  slug: z.string().min(1, 'Slug không được để trống').max(120),
  description: z.string().optional(),
  sortOrder: z.number().int().nonnegative().optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
```

# src\modules\menu-catalog\category\category.service.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\menu-catalog\category\category.service.ts` |
| Size | 1,382 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:27.276442 |

```typescript
import { CategoryRepository } from './category.repo';
import { CreateCategoryDto, UpdateCategoryDto } from './category.schema';

export class CategoryService {
  private categoryRepo = new CategoryRepository();

  async getAllCategories() {
    return await this.categoryRepo.findAll();
  }

  async getCategoryById(id: string) {
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new Error('Danh mục không tồn tại');
    }
    return category;
  }

  async createCategory(dto: CreateCategoryDto) {
    const existingSlug = await this.categoryRepo.findBySlug(dto.slug);
    if (existingSlug) {
      throw new Error('Slug danh mục đã tồn tại');
    }
    return await this.categoryRepo.create({
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      sort_order: dto.sortOrder,
      is_active: dto.isActive,
    });
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
    await this.getCategoryById(id);
    return await this.categoryRepo.update(id, {
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      sort_order: dto.sortOrder,
      is_active: dto.isActive,
    });
  }

  async deleteCategory(id: string) {
    await this.getCategoryById(id);
    return await this.categoryRepo.delete(id);
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
| Size | 2,192 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:27.278439 |

```typescript
import { Request, Response } from 'express';
import { ProductService } from './product.service';
import { createProductSchema } from './product.schema';

export class ProductController {
  private productService = new ProductService();

  getAll = async (req: Request, res: Response) => {
    try {
      const categoryId = req.query.categoryId as string;
      const isAvailable = req.query.isAvailable !== undefined ? req.query.isAvailable === 'true' : undefined;
      const products = await this.productService.getProducts(categoryId, isAvailable);
      res.status(200).json({ success: true, data: products });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const product = await this.productService.getProductById(req.params.id);
      res.status(200).json({ success: true, data: product });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const validated = createProductSchema.parse(req.body);
      const product = await this.productService.createProduct(validated);
      res.status(201).json({ success: true, data: product });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || error.errors });
    }
  };

  toggleAvailability = async (req: Request, res: Response) => {
    try {
      const { isAvailable } = req.body;
      const updated = await this.productService.toggleAvailability(req.params.id, Boolean(isAvailable));
      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.productService.deleteProduct(req.params.id);
      res.status(200).json({ success: true, message: 'Đã xóa sản phẩm' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}
```

# src\modules\menu-catalog\product\product.repo.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\menu-catalog\product\product.repo.ts` |
| Size | 3,607 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:27.279440 |

```typescript
import pool from '../../../config/database';

export class ProductRepository {
  async findAll(categoryId?: string, isAvailable?: boolean) {
    let query = `
      SELECT p.*, c.name as category_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
    `;
    const params: any[] = [];

    if (categoryId) {
      params.push(categoryId);
      query += ` AND p.category_id = $${params.length}`;
    }
    if (isAvailable !== undefined) {
      params.push(isAvailable);
      query += ` AND p.is_available = $${params.length}`;
    }

    query += ` ORDER BY p.created_at DESC`;
    const { rows } = await pool.query(query, params);
    return rows;
  }

  async findById(id: string) {
    const productQuery = `SELECT * FROM products WHERE id = $1 AND is_active = true`;
    const variantsQuery = `SELECT * FROM product_variants WHERE product_id = $1`;
    const toppingsQuery = `
      SELECT t.* 
      FROM topping_options t
      JOIN product_toppings pt ON t.id = pt.topping_id
      WHERE pt.product_id = $1 AND t.is_available = true
    `;

    const productRes = await pool.query(productQuery, [id]);
    if (productRes.rows.length === 0) return null;

    const variantsRes = await pool.query(variantsQuery, [id]);
    const toppingsRes = await pool.query(toppingsQuery, [id]);

    return {
      ...productRes.rows[0],
      variants: variantsRes.rows,
      toppings: toppingsRes.rows,
    };
  }

  async findByCode(code: string) {
    const query = `SELECT * FROM products WHERE code = $1`;
    const { rows } = await pool.query(query, [code]);
    return rows[0] || null;
  }

  async createWithDetails(data: any) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const productQuery = `
        INSERT INTO products (category_id, code, name, base_price, image_url, description, is_available)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      const productValues = [
        data.categoryId, data.code, data.name, data.basePrice,
        data.imageUrl || null, data.description || null, data.isAvailable ?? true
      ];
      const productRes = await client.query(productQuery, productValues);
      const product = productRes.rows[0];

      for (const v of data.variants) {
        await client.query(
          `INSERT INTO product_variants (product_id, size_name, price_adjustment, is_default)
           VALUES ($1, $2, $3, $4)`,
          [product.id, v.sizeName, v.priceAdjustment, v.isDefault ?? false]
        );
      }

      if (data.toppingIds && data.toppingIds.length > 0) {
        for (const toppingId of data.toppingIds) {
          await client.query(
            `INSERT INTO product_toppings (product_id, topping_id) VALUES ($1, $2)`,
            [product.id, toppingId]
          );
        }
      }

      await client.query('COMMIT');
      return product;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async updateAvailability(id: string, isAvailable: boolean) {
    const query = `UPDATE products SET is_available = $1 WHERE id = $2 RETURNING *`;
    const { rows } = await pool.query(query, [isAvailable, id]);
    return rows[0] || null;
  }

  async softDelete(id: string) {
    const query = `UPDATE products SET is_active = false WHERE id = $1`;
    const res = await pool.query(query, [id]);
    return (res.rowCount ?? 0) > 0;
  }
}
```

# src\modules\menu-catalog\product\product.routes.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\menu-catalog\product\product.routes.ts` |
| Size | 567 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 23:13:10.533446 |

```typescript
import { Router } from 'express';
import { ProductController } from './product.controller';

export const productRouter = Router(); // Đổi từ const router sang export const productRouter
const controller = new ProductController();

productRouter.get('/', controller.getAll);
productRouter.get('/:id', controller.getById);
productRouter.post('/', controller.create);
productRouter.patch('/:id/availability', controller.toggleAvailability);
productRouter.delete('/:id', controller.delete);

// Xóa bỏ hoặc thay thế dòng "export default router;"
```

# src\modules\menu-catalog\product\product.schema.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\menu-catalog\product\product.schema.ts` |
| Size | 1,071 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:27.281440 |

```typescript
import { z } from 'zod';

export const variantSchema = z.object({
  sizeName: z.string().min(1, 'Tên size không được để trống'),
  priceAdjustment: z.number().default(0),
  isDefault: z.boolean().optional().default(false),
});

export const createProductSchema = z.object({
  categoryId: z.string().uuid('ID danh mục không hợp lệ'),
  code: z.string().min(1, 'Mã sản phẩm không để trống'),
  name: z.string().min(1, 'Tên sản phẩm không để trống'),
  basePrice: z.number().positive('Giá gốc phải lớn hơn 0'),
  imageUrl: z.string().url().optional(),
  description: z.string().optional(),
  isAvailable: z.boolean().optional().default(true),
  variants: z.array(variantSchema).min(1, 'Sản phẩm phải có ít nhất 1 size'),
  toppingIds: z.array(z.string().uuid()).optional().default([]),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
```

# src\modules\menu-catalog\product\product.service.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\menu-catalog\product\product.service.ts` |
| Size | 1,099 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:27.282439 |

```typescript
import { ProductRepository } from './product.repo';
import { CreateProductDto } from './product.schema';

export class ProductService {
  private productRepo = new ProductRepository();

  async getProducts(categoryId?: string, isAvailable?: boolean) {
    return await this.productRepo.findAll(categoryId, isAvailable);
  }

  async getProductById(id: string) {
    const product = await this.productRepo.findById(id);
    if (!product) throw new Error('Sản phẩm không tồn tại');
    return product;
  }

  async createProduct(dto: CreateProductDto) {
    const existing = await this.productRepo.findByCode(dto.code);
    if (existing) throw new Error('Mã sản phẩm đã bị trùng lặp');
    return await this.productRepo.createWithDetails(dto);
  }

  async toggleAvailability(id: string, isAvailable: boolean) {
    await this.getProductById(id);
    return await this.productRepo.updateAvailability(id, isAvailable);
  }

  async deleteProduct(id: string) {
    await this.getProductById(id);
    return await this.productRepo.softDelete(id);
  }
}
```

# src\modules\menu-catalog\topping\topping.controller.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\menu-catalog\topping\topping.controller.ts` |
| Size | 1,991 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:27.283441 |

```typescript
import { Request, Response } from 'express';
import { ToppingService } from './topping.service';
import { createToppingSchema, updateToppingSchema } from './topping.schema';

export class ToppingController {
  private toppingService = new ToppingService();

  getAll = async (req: Request, res: Response) => {
    try {
      const data = await this.toppingService.getAllToppings();
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const data = await this.toppingService.getToppingById(req.params.id);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const validated = createToppingSchema.parse(req.body);
      const data = await this.toppingService.createTopping(validated);
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || error.errors });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const validated = updateToppingSchema.parse(req.body);
      const data = await this.toppingService.updateTopping(req.params.id, validated);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || error.errors });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.toppingService.deleteTopping(req.params.id);
      res.status(200).json({ success: true, message: 'Đã xóa topping thành công' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}
```

# src\modules\menu-catalog\topping\topping.repo.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\menu-catalog\topping\topping.repo.ts` |
| Size | 1,652 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:27.285448 |

```typescript
import pool from '../../../config/database';

export class ToppingRepository {
  async findAll() {
    const { rows } = await pool.query(`SELECT * FROM topping_options ORDER BY name ASC`);
    return rows;
  }

  async findById(id: string) {
    const { rows } = await pool.query(`SELECT * FROM topping_options WHERE id = $1`, [id]);
    return rows[0] || null;
  }

  async create(data: { name: string; price: number; isAvailable?: boolean }) {
    const query = `
      INSERT INTO topping_options (name, price, is_available)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [data.name, data.price, data.isAvailable ?? true]);
    return rows[0];
  }

  async update(id: string, data: Partial<{ name: string; price: number; isAvailable: boolean }>) {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.name !== undefined) { fields.push(`name = $${idx++}`); values.push(data.name); }
    if (data.price !== undefined) { fields.push(`price = $${idx++}`); values.push(data.price); }
    if (data.isAvailable !== undefined) { fields.push(`is_available = $${idx++}`); values.push(data.isAvailable); }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const query = `UPDATE topping_options SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  }

  async delete(id: string) {
    const res = await pool.query(`DELETE FROM topping_options WHERE id = $1`, [id]);
    return (res.rowCount ?? 0) > 0;
  }
}
```

# src\modules\menu-catalog\topping\topping.routes.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\menu-catalog\topping\topping.routes.ts` |
| Size | 540 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 23:13:18.987650 |

```typescript
import { Router } from 'express';
import { ToppingController } from './topping.controller';

export const toppingRouter = Router(); // Đổi từ const router sang export const toppingRouter
const controller = new ToppingController();

toppingRouter.get('/', controller.getAll);
toppingRouter.get('/:id', controller.getById);
toppingRouter.post('/', controller.create);
toppingRouter.put('/:id', controller.update);
toppingRouter.delete('/:id', controller.delete);

// Xóa bỏ hoặc thay thế dòng "export default router;"
```

# src\modules\menu-catalog\topping\topping.schema.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\menu-catalog\topping\topping.schema.ts` |
| Size | 485 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:27.287443 |

```typescript
import { z } from 'zod';

export const createToppingSchema = z.object({
  name: z.string().min(1, 'Tên topping không được để trống'),
  price: z.number().nonnegative('Giá topping không được âm'),
  isAvailable: z.boolean().optional().default(true),
});

export const updateToppingSchema = createToppingSchema.partial();

export type CreateToppingDto = z.infer<typeof createToppingSchema>;
export type UpdateToppingDto = z.infer<typeof updateToppingSchema>;
```

# src\modules\menu-catalog\topping\topping.service.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\menu-catalog\topping\topping.service.ts` |
| Size | 955 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:27.288443 |

```typescript
import { ToppingRepository } from './topping.repo';
import { CreateToppingDto, UpdateToppingDto } from './topping.schema';

export class ToppingService {
  private toppingRepo = new ToppingRepository();

  async getAllToppings() {
    return await this.toppingRepo.findAll();
  }

  async getToppingById(id: string) {
    const topping = await this.toppingRepo.findById(id);
    if (!topping) throw new Error('Topping không tồn tại');
    return topping;
  }

  async createTopping(dto: CreateToppingDto) {
    return await this.toppingRepo.create({
      name: dto.name,
      price: dto.price,
      isAvailable: dto.isAvailable,
    });
  }

  async updateTopping(id: string, dto: UpdateToppingDto) {
    await this.getToppingById(id);
    return await this.toppingRepo.update(id, dto);
  }

  async deleteTopping(id: string) {
    await this.getToppingById(id);
    return await this.toppingRepo.delete(id);
  }
}
```

# src\modules\pos-order\order\order.controller.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\pos-order\order\order.controller.ts` |
| Size | 0 bytes |
| Extension | `.ts` |
| Modified | 2026-09-23 23:09:32.656053 |

```typescript

```

# src\modules\pos-order\order\order.repo.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\pos-order\order\order.repo.ts` |
| Size | 0 bytes |
| Extension | `.ts` |
| Modified | 2026-09-23 23:09:32.668055 |

```typescript

```

# src\modules\pos-order\order\order.routes.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\pos-order\order\order.routes.ts` |
| Size | 141 bytes |
| Extension | `.ts` |
| Modified | 2026-09-27 21:08:02.871526 |

```typescript
import { Router } from 'express'
export const orderRouter = Router()
orderRouter.get('/',(_,res)=>{res.json({message:'orderRouter ready'})})

```

# src\modules\pos-order\order\order.schema.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\pos-order\order\order.schema.ts` |
| Size | 0 bytes |
| Extension | `.ts` |
| Modified | 2026-09-23 23:09:32.673052 |

```typescript

```

# src\modules\pos-order\order\order.service.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\pos-order\order\order.service.ts` |
| Size | 0 bytes |
| Extension | `.ts` |
| Modified | 2026-09-23 23:09:32.661054 |

```typescript

```

# src\modules\pos-order\pager\pager.controller.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\pos-order\pager\pager.controller.ts` |
| Size | 0 bytes |
| Extension | `.ts` |
| Modified | 2026-09-23 23:09:32.681054 |

```typescript

```

# src\modules\pos-order\pager\pager.repo.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\pos-order\pager\pager.repo.ts` |
| Size | 0 bytes |
| Extension | `.ts` |
| Modified | 2026-09-23 23:09:32.686053 |

```typescript

```

# src\modules\pos-order\pager\pager.routes.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\pos-order\pager\pager.routes.ts` |
| Size | 141 bytes |
| Extension | `.ts` |
| Modified | 2026-09-27 21:08:02.884606 |

```typescript
import { Router } from 'express'
export const pagerRouter = Router()
pagerRouter.get('/',(_,res)=>{res.json({message:'pagerRouter ready'})})

```

# src\modules\pos-order\pager\pager.schema.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\pos-order\pager\pager.schema.ts` |
| Size | 0 bytes |
| Extension | `.ts` |
| Modified | 2026-09-23 23:09:32.692052 |

```typescript

```

# src\modules\pos-order\pager\pager.service.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\pos-order\pager\pager.service.ts` |
| Size | 0 bytes |
| Extension | `.ts` |
| Modified | 2026-09-23 23:09:32.683053 |

```typescript

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
| Size | 3,283 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.255530 |

```typescript
import { getPool, sql } from '@/config/database'
import { DateRangeReportType, TopProductsQueryType } from './report.schema'

export class ReportRepo {
    // Thống kê tổng quan: Doanh thu, số đơn, số tiền giảm giá
    async getOverviewRevenue(filter: DateRangeReportType) {
        const pool = await getPool()
        const request = pool.request()

        const conditions: string[] = ["status IN ('PAID', 'COMPLETED')", 'deletedAt IS NULL']

        if (filter.fromDate) {
            request.input('fromDate', sql.DateTime2, new Date(filter.fromDate))
            conditions.push('createdAt >= @fromDate')
        }
        if (filter.toDate) {
            request.input('toDate', sql.DateTime2, new Date(filter.toDate))
            conditions.push('createdAt <= @toDate')
        }

        const whereClause = `WHERE ${conditions.join(' AND ')}`
        const query = `
      SELECT 
        COUNT(id) AS totalOrders,
        ISNULL(SUM(subTotal), 0) AS totalSubTotal,
        ISNULL(SUM(discountAmount), 0) AS totalDiscount,
        ISNULL(SUM(totalAmount), 0) AS netRevenue
      FROM [Order]
      ${whereClause}
    `
        const result = await request.query(query)
        return result.recordset[0]
    }

    // Top sản phẩm bán chạy nhất
    async getTopSellingProducts(filter: TopProductsQueryType) {
        const pool = await getPool()
        const request = pool.request()

        const conditions: string[] = [
            "o.status IN ('PAID', 'COMPLETED')",
            'o.deletedAt IS NULL',
            "od.itemStatus NOT IN ('CANCELLED')",
        ]

        if (filter.fromDate) {
            request.input('fromDate', sql.DateTime2, new Date(filter.fromDate))
            conditions.push('o.createdAt >= @fromDate')
        }
        if (filter.toDate) {
            request.input('toDate', sql.DateTime2, new Date(filter.toDate))
            conditions.push('o.createdAt <= @toDate')
        }

        request.input('topLimit', sql.Int, filter.limit || 5)

        const whereClause = `WHERE ${conditions.join(' AND ')}`
        const query = `
      SELECT TOP (@topLimit)
        od.itemSnapshotName AS productName,
        od.sizeSnapshot AS size,
        SUM(od.quantity) AS totalQuantitySold,
        SUM(od.totalPrice) AS totalRevenue
      FROM OrderDetail od
      JOIN [Order] o ON od.orderId = o.id
      ${whereClause}
      GROUP BY od.itemSnapshotName, od.sizeSnapshot
      ORDER BY totalQuantitySold DESC
    `
        const result = await request.query(query)
        return result.recordset
    }

    // Cảnh báo nguyên vật liệu sắp chạm hoặc dưới ngưỡng tối thiểu
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
        (minimumThreshold - stockQuantity) AS shortageAmount
      FROM Ingredient
      WHERE stockQuantity <= minimumThreshold AND deletedAt IS NULL
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
| Size | 554 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.256530 |

```typescript
import { Router } from 'express'
import { ReportController } from './report.controller'

export const reportRouter = Router()
const controller = new ReportController()

// GET /api/v1/report/revenue (Thống kê doanh thu theo mốc ngày)
reportRouter.get('/revenue', controller.getRevenue)

// GET /api/v1/report/top-products (Món bán chạy nhất)
reportRouter.get('/top-products', controller.getTopProducts)

// GET /api/v1/report/low-stock (Cảnh báo hết nguyên liệu kho)
reportRouter.get('/low-stock', controller.getLowStock)
```

# src\modules\report\report.schema.ts

| Property | Value |
|----------|-------|
| Path | `src\modules\report\report.schema.ts` |
| Size | 437 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.258532 |

```typescript
import { z } from 'zod'

export const DateRangeReportSchema = z.object({
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
})

export const TopProductsQuerySchema = DateRangeReportSchema.extend({
    limit: z.coerce.number().int().positive().default(5),
})

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

# tsconfig.json

| Property | Value |
|----------|-------|
| Path | `tsconfig.json` |
| Size | 458 bytes |
| Extension | `.json` |
| Modified | 2026-09-23 23:14:28.532263 |

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
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

