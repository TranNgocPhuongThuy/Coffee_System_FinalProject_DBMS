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