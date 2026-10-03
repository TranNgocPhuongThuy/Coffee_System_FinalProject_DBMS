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