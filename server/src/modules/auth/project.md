# Project Dump

**Root:** `C:\Programing\hqtcsdl\Coffee_System_FinalProject_DBMS\server\src\modules\auth`

**Generated:** 2026-10-01 18:08:49.979914

**Files:** 5 | **Total size:** 12,531 bytes

---

# auth.controller.ts

| Property | Value |
|----------|-------|
| Path | `auth.controller.ts` |
| Size | 1,919 bytes |
| Extension | `.ts` |
| Modified | 2026-10-01 00:07:18.609926 |

```typescript
import { Request, Response, NextFunction } from 'express'
import { AuthService } from './auth.service'
import { ChangePasswordBodySchema, LoginBodySchema, SetupPasswordBodySchema } from './auth.schema'

export class AuthController {
  private authService = new AuthService()

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = LoginBodySchema.parse(req.body)
      const result = await this.authService.login(body)
      res.status(200).json({ success: true, message: 'Đăng nhập thành công', data: result })
    } catch (error: any) {
      res.status(error.statusCode || 401).json({
        success: false,
        code: error.code,
        message: error.message || 'Xác thực thất bại',
      })
    }
  }

  setupPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = SetupPasswordBodySchema.parse(req.body)
      const result = await this.authService.setupPassword(body)
      res.status(200).json({ success: true, ...result })
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message })
    }
  }

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = ChangePasswordBodySchema.parse(req.body)
      const user = req.user!
      const result = await this.authService.changePassword(user.id, user.userType, body)
      res.status(200).json({ success: true, ...result })
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message })
    }
  }

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user!
      const data = await this.authService.getMe(user.id, user.userType)
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }
}
```

# auth.repo.ts

| Property | Value |
|----------|-------|
| Path | `auth.repo.ts` |
| Size | 2,494 bytes |
| Extension | `.ts` |
| Modified | 2026-10-01 00:07:18.613053 |

```typescript
import { getPool, sql } from '@/config/database'

export class AuthRepo {
  async findEmployeeByUsername(username: string) {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('username', sql.VarChar(100), username)
      .query(`
        SELECT id, fullName, username, password, role, status
        FROM Employee
        WHERE username = @username AND deletedAt IS NULL
      `)
    return result.recordset[0] || null
  }

  async findCustomerByPhone(phoneNumber: string) {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('phoneNumber', sql.VarChar(20), phoneNumber)
      .query(`
        SELECT id, fullName, phoneNumber, password, rewardPoints, membershipTier
        FROM Customer
        WHERE phoneNumber = @phoneNumber AND deletedAt IS NULL
      `)
    return result.recordset[0] || null
  }

  async findEmployeeById(id: number) {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query(`
        SELECT id, fullName, username, role, phoneNumber, status, createdAt
        FROM Employee
        WHERE id = @id AND deletedAt IS NULL
      `)
    return result.recordset[0] || null
  }

  async findCustomerById(id: number) {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query(`
        SELECT id, fullName, phoneNumber, rewardPoints, membershipTier, createdAt
        FROM Customer
        WHERE id = @id AND deletedAt IS NULL
      `)
    return result.recordset[0] || null
  }

  async updateCustomerPassword(customerId: number, passwordHash: string) {
    const pool = await getPool()
    await pool
      .request()
      .input('id', sql.Int, customerId)
      .input('password', sql.VarChar(255), passwordHash)
      .query(`
        UPDATE Customer 
        SET password = @password, updatedAt = SYSDATETIME() 
        WHERE id = @id AND deletedAt IS NULL
      `)
  }

  async updateEmployeePassword(employeeId: number, passwordHash: string) {
    const pool = await getPool()
    await pool
      .request()
      .input('id', sql.Int, employeeId)
      .input('password', sql.VarChar(255), passwordHash)
      .query(`
        UPDATE Employee 
        SET password = @password, updatedAt = SYSDATETIME() 
        WHERE id = @id AND deletedAt IS NULL
      `)
  }
}
```

# auth.routes.ts

| Property | Value |
|----------|-------|
| Path | `auth.routes.ts` |
| Size | 732 bytes |
| Extension | `.ts` |
| Modified | 2026-10-01 00:07:18.614045 |

```typescript
import { Router } from 'express'
import { AuthController } from './auth.controller'
import { authGuard, validatePipe } from '@/middlewares'
import { ChangePasswordBodySchema, LoginBodySchema, SetupPasswordBodySchema } from './auth.schema'

export const authRouter = Router()
const controller = new AuthController()

// Public
authRouter.post('/login', validatePipe(LoginBodySchema, 'body'), controller.login)
authRouter.post('/setup-password', validatePipe(SetupPasswordBodySchema, 'body'), controller.setupPassword)

// Yêu cầu đăng nhập
authRouter.get('/me', authGuard, controller.getMe)
authRouter.post('/change-password', authGuard, validatePipe(ChangePasswordBodySchema, 'body'), controller.changePassword)
```

# auth.schema.ts

| Property | Value |
|----------|-------|
| Path | `auth.schema.ts` |
| Size | 1,857 bytes |
| Extension | `.ts` |
| Modified | 2026-10-01 00:07:18.616045 |

```typescript
import { z } from 'zod'

export const LoginBodySchema = z
  .object({
    identifier: z.string().min(1, 'Vui lòng nhập tên đăng nhập hoặc số điện thoại'),
    password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
    userType: z.enum(['EMPLOYEE', 'CUSTOMER']).default('EMPLOYEE'),
  })
  .strict()

export const SetupPasswordBodySchema = z
  .object({
    phoneNumber: z
      .string()
      .regex(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/, 'Số điện thoại không hợp lệ'),
    newPassword: z.string().min(6, 'Mật khẩu mới tối thiểu 6 ký tự'),
    confirmPassword: z.string().min(6, 'Xác nhận mật khẩu tối thiểu 6 ký tự'),
  })
  .strict()
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu mới và xác nhận mật khẩu không khớp nhau',
        path: ['confirmPassword'],
      })
    }
  })

export const ChangePasswordBodySchema = z
  .object({
    oldPassword: z.string().min(1, 'Vui lòng nhập mật khẩu cũ'),
    newPassword: z.string().min(6, 'Mật khẩu mới tối thiểu 6 ký tự'),
    confirmPassword: z.string().min(6, 'Xác nhận mật khẩu tối thiểu 6 ký tự'),
  })
  .strict()
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu mới và xác nhận mật khẩu không khớp nhau',
        path: ['confirmPassword'],
      })
    }
  })

export type LoginBodyType = z.infer<typeof LoginBodySchema>
export type SetupPasswordBodyType = z.infer<typeof SetupPasswordBodySchema>
export type ChangePasswordBodyType = z.infer<typeof ChangePasswordBodySchema>
```

# auth.service.ts

| Property | Value |
|----------|-------|
| Path | `auth.service.ts` |
| Size | 5,529 bytes |
| Extension | `.ts` |
| Modified | 2026-10-01 00:07:18.617086 |

```typescript
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { envConfig } from '@/config/env.config'
import { AuthRepo } from './auth.repo'
import { ChangePasswordBodyType, LoginBodyType, SetupPasswordBodyType } from './auth.schema'

export class AuthService {
  private authRepo = new AuthRepo()

  async login(data: LoginBodyType) {
    const { identifier, password, userType } = data

    // 1. Luồng Nhân viên (Employee: MANAGER, CASHIER, BARISTA, STOREKEEPER)
    if (userType === 'EMPLOYEE') {
      const employee = await this.authRepo.findEmployeeByUsername(identifier)
      if (!employee) {
        throw new Error('Tài khoản hoặc mật khẩu không chính xác')
      }

      if (employee.status !== 'ACTIVE') {
        throw new Error('Tài khoản nhân viên đã bị vô hiệu hóa')
      }

      const isMatch = await bcrypt.compare(password, employee.password)
      if (!isMatch) {
        throw new Error('Tài khoản hoặc mật khẩu không chính xác')
      }

      const accessToken = jwt.sign(
        {
          id: employee.id,
          username: employee.username,
          fullName: employee.fullName,
          role: employee.role,
          userType: 'EMPLOYEE',
        },
        envConfig.JWT_SECRET,
        { expiresIn: envConfig.JWT_EXPIRES_IN }
      )

      return {
        accessToken,
        user: {
          id: employee.id,
          fullName: employee.fullName,
          username: employee.username,
          role: employee.role,
          userType: 'EMPLOYEE',
        },
      }
    }

    // 2. Luồng Khách hàng (Customer đăng nhập bằng SĐT)
    const customer = await this.authRepo.findCustomerByPhone(identifier)
    if (!customer) {
      throw new Error('Số điện thoại chưa được đăng ký trong hệ thống')
    }

    // Xử lý trường hợp khách tích điểm tại quầy chưa có mật khẩu
    if (!customer.password) {
      const err: any = new Error(
        'Tài khoản của bạn được tạo tại quầy và chưa thiết lập mật khẩu đăng nhập. Vui lòng thiết lập mật khẩu để tiếp tục.'
      )
      err.statusCode = 403
      err.code = 'PASSWORD_NOT_SET'
      throw err
    }

    const isMatch = await bcrypt.compare(password, customer.password)
    if (!isMatch) {
      throw new Error('Mật khẩu không chính xác')
    }

    const accessToken = jwt.sign(
      {
        id: customer.id,
        phoneNumber: customer.phoneNumber,
        fullName: customer.fullName,
        role: 'CUSTOMER',
        userType: 'CUSTOMER',
      },
      envConfig.JWT_SECRET,
      { expiresIn: envConfig.JWT_EXPIRES_IN }
    )

    return {
      accessToken,
      user: {
        id: customer.id,
        fullName: customer.fullName,
        phoneNumber: customer.phoneNumber,
        membershipTier: customer.membershipTier,
        rewardPoints: customer.rewardPoints,
        role: 'CUSTOMER',
        userType: 'CUSTOMER',
      },
    }
  }

  async setupPassword(data: SetupPasswordBodyType) {
    const customer = await this.authRepo.findCustomerByPhone(data.phoneNumber)
    if (!customer) {
      throw new Error('Không tìm thấy thông tin khách hàng với số điện thoại này')
    }

    if (customer.password) {
      throw new Error('Tài khoản đã có mật khẩu. Vui lòng đăng nhập hoặc chọn Quên mật khẩu.')
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10)
    await this.authRepo.updateCustomerPassword(customer.id, hashedPassword)

    return {
      message: 'Thiết lập mật khẩu thành công. Bạn có thể đăng nhập ngay bây giờ.',
    }
  }

  async changePassword(userId: number, userType: 'EMPLOYEE' | 'CUSTOMER', data: ChangePasswordBodyType) {
    let currentHash = ''

    if (userType === 'EMPLOYEE') {
      const emp = await this.authRepo.findEmployeeById(userId)
      if (!emp) throw new Error('Không tìm thấy nhân viên')
      const fullEmp = await this.authRepo.findEmployeeByUsername(emp.username)
      currentHash = fullEmp.password
    } else {
      const cust = await this.authRepo.findCustomerById(userId)
      if (!cust) throw new Error('Không tìm thấy khách hàng')
      const fullCust = await this.authRepo.findCustomerByPhone(cust.phoneNumber)
      currentHash = fullCust.password
    }

    const isMatch = await bcrypt.compare(data.oldPassword, currentHash)
    if (!isMatch) {
      throw new Error('Mật khẩu cũ không chính xác')
    }

    const newHashed = await bcrypt.hash(data.newPassword, 10)
    if (userType === 'EMPLOYEE') {
      await this.authRepo.updateEmployeePassword(userId, newHashed)
    } else {
      await this.authRepo.updateCustomerPassword(userId, newHashed)
    }

    return { message: 'Đổi mật khẩu thành công' }
  }

  async getMe(userId: number, userType: 'EMPLOYEE' | 'CUSTOMER') {
    if (userType === 'CUSTOMER') {
      const customer = await this.authRepo.findCustomerById(userId)
      if (!customer) throw new Error('Không tìm thấy khách hàng')
      return { ...customer, role: 'CUSTOMER', userType: 'CUSTOMER' }
    }

    const employee = await this.authRepo.findEmployeeById(userId)
    if (!employee) throw new Error('Không tìm thấy nhân viên')
    return { ...employee, userType: 'EMPLOYEE' }
  }
}
```

