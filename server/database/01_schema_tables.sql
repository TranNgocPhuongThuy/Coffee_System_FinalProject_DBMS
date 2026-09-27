USE CoffeeShopDB;
GO

-- 1. CÁC BẢNG DANH MỤC CƠ BẢN
CREATE TABLE Category (
    categoryId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    name NVARCHAR(150) NOT NULL,
    displayStatus BIT NOT NULL,
    createdAt DATETIME2(7) NOT NULL
);
GO

CREATE TABLE Topping (
    toppingId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    name NVARCHAR(150) NOT NULL,
    price DECIMAL(18, 2) NOT NULL,
    status NVARCHAR(50) NOT NULL
);
GO

CREATE TABLE Ingredient (
    ingredientId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    name NVARCHAR(150) NOT NULL,
    unit NVARCHAR(50) NOT NULL,
    stockQuantity DECIMAL(18, 3) NOT NULL,
    minimumThreshold DECIMAL(18, 3) NOT NULL,
    createdAt DATETIME2(7) NOT NULL
);
GO

-- 2. ĐỐI TƯỢNG (NHÂN VIÊN, KHÁCH HÀNG, THIẾT BỊ)
CREATE TABLE Employee (
    employeeId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    fullName NVARCHAR(150) NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role NVARCHAR(50) NOT NULL,
    phoneNumber VARCHAR(20),
    status NVARCHAR(50) NOT NULL
);
GO

CREATE TABLE Customer (
    customerId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    phoneNumber VARCHAR(20) NOT NULL,
    fullName NVARCHAR(150) NOT NULL,
    password VARCHAR(255),
    rewardPoints INT NOT NULL,
    membershipTier NVARCHAR(50) NOT NULL
);
GO

CREATE TABLE PagerDevice (
    pagerDeviceId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    pagerCode VARCHAR(50) NOT NULL,
    status NVARCHAR(50) NOT NULL,
    batteryLevel INT NOT NULL
);
GO

-- 3. SẢN PHẨM & CÔNG THỨC BOM
CREATE TABLE Product (
    productId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    categoryId INT NOT NULL,
    name NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX),
    image NVARCHAR(500),
    status NVARCHAR(50) NOT NULL
);
GO

CREATE TABLE ProductVariant (
    variantId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    productId INT NOT NULL,
    size NVARCHAR(20) NOT NULL,
    price DECIMAL(18, 2) NOT NULL,
    createdAt DATETIME2(7) NOT NULL
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
    orderId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    orderCode VARCHAR(64) NOT NULL,
    customerId INT,
    pagerDeviceId INT,
    employeeId INT,
    orderChannel NVARCHAR(50) NOT NULL,
    subTotal DECIMAL(18, 2) NOT NULL,
    discountAmount DECIMAL(18, 2) NOT NULL,
    totalAmount DECIMAL(18, 2) NOT NULL,
    paymentMethod NVARCHAR(50) NOT NULL,
    status NVARCHAR(50) NOT NULL,
    cancelReason NVARCHAR(500),
    orderDate DATETIME2(7) NOT NULL,
    paidAt DATETIME2(7),
    pickupAt DATETIME2(7)
);
GO

CREATE TABLE OrderDetail (
    orderDetailId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    orderId INT NOT NULL,
    variantId INT,
    quantity INT NOT NULL,
    note NVARCHAR(255),
    itemSnapshotName NVARCHAR(200) NOT NULL,
    sizeSnapshot NVARCHAR(50) NOT NULL,
    unitPrice DECIMAL(18, 2) NOT NULL,
    totalToppingPriceSnapshot DECIMAL(18, 2) NOT NULL,
    totalPrice DECIMAL(18, 2) NOT NULL,
    itemStatus NVARCHAR(50) NOT NULL
);
GO

CREATE TABLE OrderDetailTopping (
    orderDetailToppingId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    orderDetailId INT NOT NULL,
    toppingId INT,
    toppingSnapshotName NVARCHAR(150) NOT NULL,
    toppingPrice DECIMAL(18, 2) NOT NULL,
    quantity INT NOT NULL
);
GO

CREATE TABLE LoyaltyTransaction (
    loyTranId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
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
    importId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    employeeId INT NOT NULL,
    supplierName NVARCHAR(255) NOT NULL,
    totalAmount DECIMAL(18, 2) NOT NULL,
    importDate DATETIME2(7) NOT NULL,
    note NVARCHAR(MAX)
);
GO

CREATE TABLE InventoryImportDetail (
    importDetailId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    importId INT NOT NULL,
    ingredientId INT NOT NULL,
    quantity DECIMAL(18, 3) NOT NULL,
    unitPrice DECIMAL(18, 2) NOT NULL,
    totalLineAmount DECIMAL(18, 2) NOT NULL
);
GO

CREATE TABLE InventoryAdjustment (
    invAdjId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    ingredientId INT NOT NULL,
    employeeId INT NOT NULL,
    oldQuantity DECIMAL(18, 3) NOT NULL,
    newQuantity DECIMAL(18, 3) NOT NULL,
    difference AS (newQuantity - oldQuantity) PERSISTED,
    reason NVARCHAR(500) NOT NULL,
    adjustmentDate DATETIME2(7) NOT NULL
);
GO