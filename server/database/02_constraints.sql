
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
ALTER TABLE Customer ADD CONSTRAINT CK_Customer_tier CHECK (membershipTier IN ('STANDARD', 'SILVER', 'GOLD', 'DIAMOND'));
ALTER TABLE PagerDevice ADD CONSTRAINT CK_PagerDevice_status CHECK (status IN ('IDLE', 'IN_USE', 'CHARGING', 'MAINTENANCE', 'AVAILABLE'));
ALTER TABLE [Order] ADD CONSTRAINT CK_Order_channel CHECK (orderChannel IN ('POS', 'APP', 'DELIVERY', 'ORDER_AT_COUNTER'));
ALTER TABLE [Order] ADD CONSTRAINT CK_Order_payment CHECK (paymentMethod IN ('CASH', 'BANK_TRANSFER', 'CARD', 'MOMO', 'VNPAY', 'POINT_EXCHANGE'));
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