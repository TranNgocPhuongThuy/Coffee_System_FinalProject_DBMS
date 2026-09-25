USE CoffeeShopDB;
GO
--1. Tính thành tiền của 1 ly nước, dùng gán cho Computed Column
CREATE OR ALTER FUNCTION fnc_TinhTongTienLy (
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
CREATE OR ALTER FUNCTION fnc_TinhDiemTichLuy (
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
CREATE OR ALTER FUNCTION fn_TinhTongDoanhThu (
    @TuNgay DATETIME,
    @DenNgay DATETIME
)
RETURNS DECIMAL(18, 2)
AS
BEGIN
    DECLARE @TongDoanhThu DECIMAL(18, 2);

    SELECT @TongDoanhThu = SUM(totalAmount)
    FROM [Order]
    WHERE status = 'COMPLETED'
      AND deletedAt IS NULL
      AND ISNULL(paidAt, createdAt) BETWEEN @TuNgay AND @DenNgay;

    RETURN ISNULL(@TongDoanhThu, 0);
END;
GO
--4. Tính chiết khấu hội viên, quy đổi số điểm hội viên muốn dùng thành số tiền giảm giá
CREATE OR ALTER FUNCTION fn_TinhChietKhauHoiVien (
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
CREATE OR ALTER FUNCTION fn_KiemTraTheRungKhaDung (
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
CREATE OR ALTER FUNCTION fn_TopSanPhamBanChay (
    @TopN INT,
    @TuNgay DATETIME,
    @DenNgay DATETIME
)
RETURNS TABLE
AS
RETURN (
    SELECT TOP (@TopN)
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
      AND ISNULL(o.paidAt, o.createdAt) BETWEEN @TuNgay AND @DenNgay
    GROUP BY p.id, p.name
    ORDER BY totalQuantitySold DESC
);
GO
--7. Lấy danh sách lịch sử tích/ đổi điểm của một hội viên theo thời gian
CREATE OR ALTER FUNCTION fn_LichSuGiaoDichHoiVien (
    @customerId INT,
    @TuNgay DATETIME,
    @DenNgay DATETIME
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
      AND lt.createdAt BETWEEN @TuNgay AND @DenNgay
);
GO
