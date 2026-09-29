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