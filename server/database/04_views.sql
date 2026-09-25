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
    p.name AS tenSanPham,
    pv.size AS size,
    i.name AS tenNguyenLieu,
    rb.consumedQuantity AS dinhLuong,
    i.unit AS donVi
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
    CAST(ISNULL(paidAt, createdAt) AS DATE) AS ngay,
    COUNT(id) AS tongSoDon,
    SUM(subTotal) AS tongThanhTienGoc,
    SUM(discountAmount) AS tongGiamGia,
    SUM(totalAmount) AS doanhThuThucThu
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
