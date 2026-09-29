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