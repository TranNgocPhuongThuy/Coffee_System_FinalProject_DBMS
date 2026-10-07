# Báo Cáo Nâng Cấp và Chuẩn Hóa Cơ Sở Dữ Liệu

## 1. Khởi tạo Bảng lưu vết hệ thống (SystemLog)

Đoạn mã sau được bổ sung vào file `01_schema_tables.sql` nhằm tạo một bảng lưu trữ nhật ký lỗi và các sự kiện hệ thống quan trọng.

```sql
CREATE TABLE SystemLog (
    LogId INT IDENTITY(1,1) PRIMARY KEY,
    ActionType VARCHAR(50) NOT NULL,
    PerformedBy VARCHAR(50) DEFAULT SYSTEM_USER,
    TableName VARCHAR(50),
    Description NVARCHAR(255),
    ErrorMessage NVARCHAR(MAX),
    CreatedAt DATETIME DEFAULT GETDATE()
);
```

**Giải thích thực tế:**
- **`ActionType`**: Phân loại sự kiện (VD: `'ERROR'` cho lỗi Runtime, hoặc `'BACKUP'` cho sự kiện sao lưu thành công), giúp dễ dàng truy vấn và thống kê sự cố.
- **`ErrorMessage`**: Chứa nội dung chi tiết của lỗi được bắt từ hàm `ERROR_MESSAGE()` trong khối `CATCH`. Đây là thông tin cốt lõi giúp lập trình viên/quản trị viên xác định ngay nguyên nhân gây hỏng giao dịch mà không cần phải chạy lại code để dò lỗi.

---

## 2. Nâng cấp an toàn cho các Stored Procedure

Tất cả các Stored Procedure thao tác dữ liệu cốt lõi đã được nâng cấp. Dưới đây là ví dụ minh họa về cấu trúc chuẩn từ thủ tục `sp_UpsertRecipeBOM`:

```sql
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

        -- ... (Logic nghiệp vụ INSERT/UPDATE) ...

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        
        INSERT INTO SystemLog (ActionType, TableName, Description, ErrorMessage)
        VALUES ('ERROR', 'RecipeBOM', 'Error in sp_UpsertRecipeBOM', ERROR_MESSAGE());
        
        THROW;
    END CATCH
END;
```

**Giải thích ý nghĩa thực tế:**
- **`SET XACT_ABORT ON;`**: Bắt buộc SQL Server phải ngay lập tức hủy (abort) và rollback lại toàn bộ giao dịch nếu gặp bất kỳ một lỗi Runtime nào (VD: sai kiểu dữ liệu, lỗi khóa ngoại, v.v.). Tính năng này triệt tiêu hoàn toàn rủi ro xuất hiện các giao dịch bị "treo" lơ lửng (Orphaned Transaction) làm khóa (lock) cơ sở dữ liệu.
- **Khối `BEGIN TRY... BEGIN CATCH` kết hợp `ROLLBACK TRAN`**: Cô lập logic nghiệp vụ an toàn. Nếu xảy ra lỗi, điều khiển lập tức rẽ nhánh xuống khối CATCH. Lệnh `IF @@TRANCOUNT > 0` đảm bảo rollback trả dữ liệu về trạng thái ban đầu, sau đó lưu lại vết lỗi vào `SystemLog` và báo lỗi ra cho phần mềm Client bằng lệnh `THROW`.
- **`SET TRANSACTION ISOLATION LEVEL READ COMMITTED;`**: (Được bổ sung ở các thủ tục như `sp_RemoveOrderItem`). Mức cô lập này buộc giao dịch hiện tại chỉ được phép đọc những dữ liệu đã được chốt (Commit) thành công. Mục đích thực tế là để chặn triệt để hiện tượng Dirty Read (Đọc dữ liệu bẩn) khi có nhiều thu ngân thao tác chồng chéo lên nhau.

---

## 3. Script tự động hóa Backup (`09_backup_recovery.sql`)

Kịch bản chuyên biệt được tạo ra để đảm bảo khả năng phục hồi dữ liệu tối đa.

**Chuyển đổi sang chế độ RECOVERY FULL:**
```sql
USE master;
GO
ALTER DATABASE COFFEE_SYSTEM SET RECOVERY FULL;
GO
USE COFFEE_SYSTEM;
GO
```
*Giải thích:* Chế độ `FULL` bắt buộc hệ thống phải ghi chép lại mọi hành động thay đổi dữ liệu vào file Log. Đây là điều kiện tiên quyết duy nhất để có thể phục hồi dữ liệu lùi lại đến chính xác một thời điểm cụ thể trong quá khứ (Point-in-time recovery) khi có sự cố xóa nhầm.

**Các thủ tục sao lưu tự động:**
```sql
-- 1. Full Backup
BACKUP DATABASE COFFEE_SYSTEM TO DISK = @FileName WITH FORMAT, INIT, CHECKSUM;

-- 2. Differential Backup
BACKUP DATABASE COFFEE_SYSTEM TO DISK = @FileName WITH DIFFERENTIAL, NOINIT, CHECKSUM;

-- 3. Transaction Log Backup
BACKUP LOG COFFEE_SYSTEM TO DISK = @FileName WITH NOINIT, CHECKSUM;
```
**Giải thích thực tế:**
- **`sp_Backup_Full`**: Chụp lại toàn bộ cấu trúc và toàn bộ dữ liệu. Đây là nền tảng bắt buộc trước khi chạy các lệnh sao lưu khác.
- **`sp_Backup_Diff`** *(Differential)*: Bản sao lưu khác biệt, chỉ lưu lại những dữ liệu mới được thêm/sửa/xóa tính từ thời điểm Full Backup gần nhất. Mục đích là để tiết kiệm tối đa thời gian chạy và dung lượng đĩa cứng so với việc ngày nào cũng phải Full Backup.
- **`sp_Backup_Log`**: Sao lưu lại lịch sử các giao dịch. Đây là loại file cực kỳ quan trọng, quyết định việc bạn có thể lấy lại dữ liệu chi tiết đến từng phút trước khi Server bị sập nguồn hay không.
