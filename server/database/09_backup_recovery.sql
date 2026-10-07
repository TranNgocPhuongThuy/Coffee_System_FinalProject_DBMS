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
