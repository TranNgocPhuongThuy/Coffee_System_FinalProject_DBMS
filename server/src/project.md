# Project Dump

**Root:** `C:\Programing\hqtcsdl\Coffee_System_FinalProject_DBMS\server\src`

**Generated:** 2026-10-03 18:55:38.270256

**Files:** 86 | **Total size:** 202,670 bytes

---

# app.ts

| Property | Value |
|----------|-------|
| Path | `app.ts` |
| Size | 1,583 bytes |
| Extension | `.ts` |
| Modified | 2026-10-01 00:07:18.602920 |

```typescript
import express, { Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import pinoHttp from 'pino-http'
import { errorFilter } from './middlewares/error.filter'

// Import router của 6 phân hệ
import { posRouter } from './modules/pos-order/pos.routes'
import { menuRouter } from './modules/menu-catalog/menu.routes'
import { inventoryRouter } from './modules/inventory-bom/inventory.routes'
import { kdsRouter } from './modules/kds/kds.routes'
import { customerLoyaltyRouter } from './modules/customer-loyalty/customer-loyalty.routes'
import { reportRouter } from './modules/report/report.routes'
import { authRouter } from './modules/auth/auth.routes'

export const createApp = (): Express => {
  const app = express()

  // 1. Global Middlewares
  app.use(helmet())
  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(pinoHttp({ autoLogging: false }))

  // 2. Health check
  app.get('/api/health', (_, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date() })
  })

  // 3. Đăng ký các phân hệ (Prefix API v1)
  app.use('/api/v1/auth', authRouter)
  app.use('/api/v1/pos', posRouter)
  app.use('/api/v1/menu', menuRouter)
  app.use('/api/v1/inventory', inventoryRouter)
  app.use('/api/v1/kds', kdsRouter)
  app.use('/api/v1/loyalty', customerLoyaltyRouter)
  app.use('/api/v1/reports', reportRouter)

  // 4. Global Error Filter (Bắt lỗi T-SQL và runtime, luôn để cuối cùng)
  app.use(errorFilter)

  return app
}
```

# common\constants\index.ts

| Property | Value |
|----------|-------|
| Path | `common\constants\index.ts` |
| Size | 0 bytes |
| Extension | `.ts` |
| Modified | 2026-09-23 23:06:23.885847 |

```typescript

```

# common\errors\index.ts

| Property | Value |
|----------|-------|
| Path | `common\errors\index.ts` |
| Size | 0 bytes |
| Extension | `.ts` |
| Modified | 2026-09-23 23:06:23.881851 |

```typescript

```

# common\helpers\index.ts

| Property | Value |
|----------|-------|
| Path | `common\helpers\index.ts` |
| Size | 0 bytes |
| Extension | `.ts` |
| Modified | 2026-09-23 23:06:24.026300 |

```typescript

```

# config\database.ts

| Property | Value |
|----------|-------|
| Path | `config\database.ts` |
| Size | 1,212 bytes |
| Extension | `.ts` |
| Modified | 2026-09-23 23:11:32.583666 |

```typescript
import sql from 'mssql'
import { envConfig } from './env.config'

const sqlConfig: sql.config = {
  user: envConfig.DB_USER,
  password: envConfig.DB_PASSWORD,
  database: envConfig.DB_NAME,
  server: envConfig.DB_SERVER,
  port: envConfig.DB_PORT,
  pool: {
    max: 15,
    min: 2,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false, // Để false khi chạy SQL Server cục bộ không cài chứng chỉ SSL
    trustServerCertificate: true, // Tránh lỗi self-signed cert
  },
}

let pool: sql.ConnectionPool | null = null

export const getPool = async (): Promise<sql.ConnectionPool> => {
  if (pool && pool.connected) {
    return pool
  }
  try {
    pool = await new sql.ConnectionPool(sqlConfig).connect()
    console.log(`✅ Kết nối thành công tới Database [${envConfig.DB_NAME}] trên SQL Server!`)
    return pool
  } catch (error) {
    console.error('❌ Lỗi khi kết nối tới Microsoft SQL Server:', error)
    throw error
  }
}

export const closePool = async (): Promise<void> => {
  if (pool) {
    await pool.close()
    console.log('🔌 Đã ngắt kết nối SQL Server Connection Pool.')
  }
}

export { sql }
```

# config\env.config.ts

| Property | Value |
|----------|-------|
| Path | `config\env.config.ts` |
| Size | 944 bytes |
| Extension | `.ts` |
| Modified | 2026-10-01 00:07:18.605918 |

```typescript
import dotenv from 'dotenv'
import { z } from 'zod'
import type { StringValue } from 'ms'

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),

  DB_USER: z.string().min(1, 'Chưa cấu hình DB_USER'),
  DB_PASSWORD: z.string().min(1, 'Chưa cấu hình DB_PASSWORD'),
  DB_SERVER: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(1433),
  DB_NAME: z.string().min(1, 'Chưa cấu hình DB_NAME'),

  JWT_SECRET: z.string().min(1, 'Chưa cấu hình JWT_SECRET'),
  JWT_EXPIRES_IN: z.custom<StringValue>().default('1d'),
})

const parseResult = envSchema.safeParse(process.env)

if (!parseResult.success) {
  console.error('❌ Lỗi cấu hình file .env:')
  console.error(parseResult.error.flatten().fieldErrors)
  process.exit(1)
}

export const envConfig = parseResult.data
```

# middlewares\auth.guard.ts

| Property | Value |
|----------|-------|
| Path | `middlewares\auth.guard.ts` |
| Size | 3,688 bytes |
| Extension | `.ts` |
| Modified | 2026-10-01 00:07:18.607921 |

```typescript
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { envConfig } from "@/config/env.config";
import { getPool, sql } from "@/config/database";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username?: string;
        phoneNumber?: string;
        fullName: string;
        role:
          | "ADMIN"
          | "MANAGER"
          | "CASHIER"
          | "BARISTA"
          | "STOREKEEPER"
          | "CUSTOMER";
        userType: "EMPLOYEE" | "CUSTOMER";
      };
    }
  }
}

interface JwtPayload {
  id: number;
  role:
    | "ADMIN"
    | "MANAGER"
    | "CASHIER"
    | "BARISTA"
    | "STOREKEEPER"
    | "CUSTOMER";
  userType?: "EMPLOYEE" | "CUSTOMER";
}

export const authGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message:
          "Yêu cầu đăng nhập để truy cập tài nguyên này (Thiếu Bearer Token).",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, envConfig.JWT_SECRET) as JwtPayload;
    } catch (err: any) {
      res.status(401).json({
        success: false,
        message:
          err.name === "TokenExpiredError"
            ? "Phiên đăng nhập đã hết hạn."
            : "Token xác thực không hợp lệ.",
      });
      return;
    }

    const pool = await getPool();
    const dbReq = pool.request();
    dbReq.input("id", sql.Int, decoded.id);

    if (decoded.role === "CUSTOMER" || decoded.userType === "CUSTOMER") {
      const custRes = await pool.request().input("id", sql.Int, decoded.id)
        .query(`
      SELECT id, phoneNumber, fullName, membershipTier 
      FROM Customer 
      WHERE id = @id AND deletedAt IS NULL
    `);

      if (custRes.recordset.length === 0) {
        res
          .status(401)
          .json({
            success: false,
            message: "Tài khoản khách hàng không tồn tại hoặc đã bị khóa.",
          });
        return;
      }

      const cust = custRes.recordset[0];
      req.user = {
        id: cust.id,
        phoneNumber: cust.phoneNumber,
        fullName: cust.fullName,
        role: "CUSTOMER",
        userType: "CUSTOMER",
      };
      return next();
    }

    // 2. Nếu là Nhân viên nội bộ (Employee)
    const empRes = await pool.request().input("id", sql.Int, decoded.id).query(`
    SELECT id, username, fullName, role, status 
    FROM Employee 
    WHERE id = @id AND deletedAt IS NULL
  `);

    if (empRes.recordset.length === 0) {
      res
        .status(401)
        .json({
          success: false,
          message: "Tài khoản nhân viên không tồn tại hoặc đã bị xóa.",
        });
      return;
    }

    const employee = empRes.recordset[0];
    if (employee.status !== "ACTIVE") {
      res
        .status(403)
        .json({
          success: false,
          message: "Tài khoản nhân viên đã bị khóa hoặc ngừng hoạt động.",
        });
      return;
    }

    req.user = {
      id: employee.id,
      username: employee.username,
      fullName: employee.fullName,
      role: employee.role,
      userType: "EMPLOYEE",
    };

    next();
  } catch (error) {
    next(error);
  }
};

```

# middlewares\error.filter.ts

| Property | Value |
|----------|-------|
| Path | `middlewares\error.filter.ts` |
| Size | 282 bytes |
| Extension | `.ts` |
| Modified | 2026-09-27 21:08:02.916627 |

```typescript
import { Request, Response, NextFunction } from 'express'
export const errorFilter = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
};

```

# middlewares\index.ts

| Property | Value |
|----------|-------|
| Path | `middlewares\index.ts` |
| Size | 123 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 23:18:30.318218 |

```typescript
export * from './auth.guard'
export * from './role.guard'
export * from './validate.pipe'
export * from './error.filter'
```

# middlewares\role.guard.ts

| Property | Value |
|----------|-------|
| Path | `middlewares\role.guard.ts` |
| Size | 804 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 23:27:47.675254 |

```typescript
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
```

# middlewares\validate.pipe.ts

| Property | Value |
|----------|-------|
| Path | `middlewares\validate.pipe.ts` |
| Size | 1,171 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 23:18:07.163617 |

```typescript
import { Request, Response, NextFunction } from 'express'
import { ZodError, ZodSchema } from 'zod'

type RequestPart = 'body' | 'query' | 'params'

/**
 * Middleware validate request schema
 * @param schema Zod Schema cần kiểm tra
 * @param part Bộ phận request cần validate (mặc định là 'body')
 */
export const validatePipe = (schema: ZodSchema, part: RequestPart = 'body') => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate và gán lại dữ liệu đã qua tiền xử lý / ép kiểu của Zod
      req[part] = await schema.parseAsync(req[part])
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        // Gom các lỗi validate thành object chi tiết
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }))

        res.status(400).json({
          success: false,
          message: 'Dữ liệu yêu cầu không hợp lệ.',
          errors: formattedErrors,
        })
        return
      }

      next(error)
    }
  }
}
```

# modules\auth\auth.controller.ts

| Property | Value |
|----------|-------|
| Path | `modules\auth\auth.controller.ts` |
| Size | 3,343 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 18:43:15.413676 |

```typescript
import { Request, Response, NextFunction } from 'express'
import { AuthService } from './auth.service'
import { ChangePasswordBodySchema, LoginBodySchema, RegisterCustomerBodySchema, RegisterEmployeeBodySchema, SetupPasswordBodySchema } from './auth.schema'


export class AuthController {
  private authService = new AuthService()

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = RegisterCustomerBodySchema.parse(req.body)
      const result = await this.authService.registerCustomer(body)
      res.status(201).json({
        success: true,
        message: 'Đăng ký tài khoản thành công',
        data: result,
      })
    } catch (error: any) {
      res.status(error.statusCode || 400).json({
        success: false,
        message: error.message || 'Đăng ký thất bại',
      })
    }
  }

  registerEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = RegisterEmployeeBodySchema.parse(req.body)
      const result = await this.authService.registerEmployee(body)
      res.status(201).json({
        success: true,
        message: 'Tạo tài khoản nhân viên thành công',
        data: result,
      })
    } catch (error: any) {
      res.status(error.statusCode || 400).json({
        success: false,
        message: error.message || 'Tạo tài khoản nhân viên thất bại',
      })
    }
  }


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

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({ success: true, message: 'Đăng xuất thành công' })
    } catch (error) {
      next(error)
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

# modules\auth\auth.repo.ts

| Property | Value |
|----------|-------|
| Path | `modules\auth\auth.repo.ts` |
| Size | 5,148 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 18:43:15.414671 |

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

  async createCustomer(data: {
    fullName: string
    phoneNumber: string
    passwordHash: string
    address?: string
  }) {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('fullName', sql.NVarChar(100), data.fullName)
      .input('phoneNumber', sql.VarChar(20), data.phoneNumber)
      .input('password', sql.VarChar(255), data.passwordHash)
      .input('address', sql.NVarChar(255), data.address || null)
      .query(`
        INSERT INTO Customer (fullName, phoneNumber, password, address, rewardPoints, membershipTier, createdAt, updatedAt)
        OUTPUT INSERTED.id, INSERTED.fullName, INSERTED.phoneNumber, INSERTED.membershipTier, INSERTED.rewardPoints
        VALUES (@fullName, @phoneNumber, @password, @address, 0, 'STANDARD', SYSDATETIME(), SYSDATETIME())
      `)
    return result.recordset[0]
  }

  async activateCustomerWithPassword(id: number, data: { fullName: string; passwordHash: string; address?: string }) {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .input('fullName', sql.NVarChar(100), data.fullName)
      .input('password', sql.VarChar(255), data.passwordHash)
      .input('address', sql.NVarChar(255), data.address || null)
      .query(`
        UPDATE Customer 
        SET fullName = @fullName,
            password = @password,
            address = COALESCE(@address, address),
            updatedAt = SYSDATETIME()
        OUTPUT INSERTED.id, INSERTED.fullName, INSERTED.phoneNumber, INSERTED.membershipTier, INSERTED.rewardPoints
        WHERE id = @id AND deletedAt IS NULL
      `)
    return result.recordset[0]
  }

  async createEmployee(data: {

    fullName: string
    username: string
    passwordHash: string
    role: string
    phoneNumber?: string
  }) {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('fullName', sql.NVarChar(100), data.fullName)
      .input('username', sql.VarChar(100), data.username)
      .input('password', sql.VarChar(255), data.passwordHash)
      .input('role', sql.VarChar(50), data.role)
      .input('phoneNumber', sql.VarChar(20), data.phoneNumber || null)
      .query(`
        INSERT INTO Employee (fullName, username, password, role, phoneNumber, status, createdAt, updatedAt)
        OUTPUT INSERTED.id, INSERTED.fullName, INSERTED.username, INSERTED.role, INSERTED.status
        VALUES (@fullName, @username, @password, @role, @phoneNumber, 'ACTIVE', SYSDATETIME(), SYSDATETIME())
      `)
    return result.recordset[0]
  }
}

```

# modules\auth\auth.routes.ts

| Property | Value |
|----------|-------|
| Path | `modules\auth\auth.routes.ts` |
| Size | 1,068 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 18:43:15.415669 |

```typescript
import { Router } from 'express'
import { AuthController } from './auth.controller'
import { authGuard, validatePipe } from '@/middlewares'
import { ChangePasswordBodySchema, LoginBodySchema, RegisterCustomerBodySchema, RegisterEmployeeBodySchema, SetupPasswordBodySchema } from './auth.schema'

export const authRouter = Router()
const controller = new AuthController()

// Public
authRouter.post('/login', validatePipe(LoginBodySchema, 'body'), controller.login)
authRouter.post('/register', validatePipe(RegisterCustomerBodySchema, 'body'), controller.register)
authRouter.post('/register-employee', validatePipe(RegisterEmployeeBodySchema, 'body'), controller.registerEmployee)
authRouter.post('/setup-password', validatePipe(SetupPasswordBodySchema, 'body'), controller.setupPassword)


// Yêu cầu đăng nhập
authRouter.get('/me', authGuard, controller.getMe)
authRouter.post('/logout', authGuard, controller.logout)
authRouter.post('/change-password', authGuard, validatePipe(ChangePasswordBodySchema, 'body'), controller.changePassword)

```

# modules\auth\auth.schema.ts

| Property | Value |
|----------|-------|
| Path | `modules\auth\auth.schema.ts` |
| Size | 3,325 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 18:43:15.417057 |

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

export const RegisterCustomerBodySchema = z
  .object({
    phoneNumber: z
      .string()
      .regex(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/, 'Số điện thoại không hợp lệ'),
    fullName: z.string().trim().min(2, 'Họ và tên tối thiểu 2 ký tự').max(100),
    password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
    confirmPassword: z.string().min(6, 'Xác nhận mật khẩu tối thiểu 6 ký tự'),
    address: z.string().trim().max(255).optional(), // Phục vụ giao hàng online
  })
  .strict()
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu và xác nhận mật khẩu không khớp nhau',
        path: ['confirmPassword'],
      })
    }
  })

export const RegisterEmployeeBodySchema = z
  .object({
    fullName: z.string().trim().min(2, 'Họ và tên tối thiểu 2 ký tự').max(100),
    username: z.string().trim().min(3, 'Tên đăng nhập tối thiểu 3 ký tự').max(50),
    password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
    role: z.enum(['ADMIN', 'MANAGER', 'CASHIER', 'BARISTA', 'STOREKEEPER']),
    phoneNumber: z.string().optional(),
  })
  .strict()

export type RegisterCustomerBodyType = z.infer<typeof RegisterCustomerBodySchema>
export type RegisterEmployeeBodyType = z.infer<typeof RegisterEmployeeBodySchema>
export type LoginBodyType = z.infer<typeof LoginBodySchema>
export type SetupPasswordBodyType = z.infer<typeof SetupPasswordBodySchema>
export type ChangePasswordBodyType = z.infer<typeof ChangePasswordBodySchema>

```

# modules\auth\auth.service.ts

| Property | Value |
|----------|-------|
| Path | `modules\auth\auth.service.ts` |
| Size | 8,695 bytes |
| Extension | `.ts` |
| Modified | 2026-10-03 18:43:15.417581 |

```typescript
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { envConfig } from '@/config/env.config'
import { AuthRepo } from './auth.repo'
import { ChangePasswordBodyType, LoginBodyType, RegisterCustomerBodyType, RegisterEmployeeBodyType, SetupPasswordBodyType } from './auth.schema'


export class AuthService {
  private authRepo = new AuthRepo()

  async registerEmployee(data: RegisterEmployeeBodyType) {
    const existingEmp = await this.authRepo.findEmployeeByUsername(data.username)
    if (existingEmp) {
      const err: any = new Error('Tên đăng nhập này đã được sử dụng')
      err.statusCode = 409
      throw err
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)
    const employee = await this.authRepo.createEmployee({
      fullName: data.fullName,
      username: data.username,
      passwordHash: hashedPassword,
      role: data.role,
      phoneNumber: data.phoneNumber,
    })

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

  async registerCustomer(data: RegisterCustomerBodyType) {

    const existingCustomer = await this.authRepo.findCustomerByPhone(data.phoneNumber)

    // Trường hợp 1: SĐT đã có tài khoản và đã có mật khẩu
    if (existingCustomer && existingCustomer.password) {
      const err: any = new Error('Số điện thoại này đã được đăng ký tài khoản. Vui lòng đăng nhập.')
      err.statusCode = 409
      throw err
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)
    let customer: any

    // Trường hợp 2: Khách đã từng mua tích điểm tại quầy (chưa có pass), giờ đăng ký online
    if (existingCustomer && !existingCustomer.password) {
      customer = await this.authRepo.activateCustomerWithPassword(existingCustomer.id, {
        fullName: data.fullName,
        passwordHash: hashedPassword,
        address: data.address,
      })
    } else {
      // Trường hợp 3: Khách hàng mới hoàn toàn
      customer = await this.authRepo.createCustomer({
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        passwordHash: hashedPassword,
        address: data.address,
      })
    }

    // Tự động cấp token đăng nhập ngay sau khi tạo tài khoản thành công
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

# modules\customer-loyalty\customer\customer.controller.ts

| Property | Value |
|----------|-------|
| Path | `modules\customer-loyalty\customer\customer.controller.ts` |
| Size | 2,247 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:17:55.052888 |

```typescript
import { Request, Response, NextFunction } from 'express'
import { CustomerService } from './customer.service'
import {
    CreateCustomerSchema,
    CustomerParamSchema,
    FilterCustomerQuerySchema,
    UpdateCustomerSchema,
} from './customer.schema'

export class CustomerController {
    private customerService = new CustomerService()

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = FilterCustomerQuerySchema.parse(req.query)
            const data = await this.customerService.getCustomers(query)
            res.status(200).json({ success: true, ...data })
        } catch (error) {
            next(error)
        }
    }

    detail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = CustomerParamSchema.parse(req.params)
            const data = await this.customerService.getCustomerById(id)
            res.status(200).json({ success: true, data })
        } catch (error) {
            next(error)
        }
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = CreateCustomerSchema.parse(req.body)
            const result = await this.customerService.createCustomer(body)
            res.status(201).json({ success: true, ...result })
        } catch (error) {
            next(error)
        }
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = CustomerParamSchema.parse(req.params)
            const body = UpdateCustomerSchema.parse(req.body)
            const result = await this.customerService.updateCustomer(id, body)
            res.status(200).json({ success: true, ...result })
        } catch (error) {
            next(error)
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = CustomerParamSchema.parse(req.params)
            const result = await this.customerService.deleteCustomer(id)
            res.status(200).json({ success: true, ...result })
        } catch (error) {
            next(error)
        }
    }
}

```

# modules\customer-loyalty\customer\customer.repo.ts

| Property | Value |
|----------|-------|
| Path | `modules\customer-loyalty\customer\customer.repo.ts` |
| Size | 6,660 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 23:06:19.694288 |

```typescript
import { getPool, sql } from '@/config/database'
import { CreateCustomerType, FilterCustomerQueryType, UpdateCustomerType } from './customer.schema'

export class CustomerRepo {
    async getCustomers(filter: FilterCustomerQueryType) {
        const pool = await getPool()
        const request = pool.request()

        const { search, membershipTier, page = 1, limit = 20 } = filter
        const offset = (page - 1) * limit
        const conditions: string[] = ['c.deletedAt IS NULL']

        if (membershipTier) {
            request.input('membershipTier', sql.NVarChar(50), membershipTier)
            conditions.push('c.membershipTier = @membershipTier')
        }

        if (search) {
            request.input('search', sql.NVarChar(150), `%${search}%`)
            conditions.push('(c.fullName LIKE @search OR c.phoneNumber LIKE @search)')
        }

        const whereClause = `WHERE ${conditions.join(' AND ')}`

        // Đếm tổng số bản ghi
        const countQuery = `SELECT COUNT(1) AS total FROM Customer c ${whereClause}`
        const countResult = await request.query(countQuery)
        const totalItems = countResult.recordset[0]?.total || 0

        // Truy vấn danh sách có phân trang chuẩn SQL Server
        request.input('offset', sql.Int, offset)
        request.input('limit', sql.Int, limit)

        const listQuery = `
      SELECT 
        c.id, 
        c.phoneNumber, 
        c.fullName, 
        c.rewardPoints, 
        c.membershipTier, 
        c.createdAt, 
        c.updatedAt,
        cls.totalPointsEarned,
        cls.totalPointsRedeemed
      FROM Customer c
      LEFT JOIN v_CustomerLoyaltySummary cls ON c.id = cls.customerId
      ${whereClause}
      ORDER BY c.createdAt DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `
        const listResult = await request.query(listQuery)

        return {
            items: listResult.recordset,
            meta: {
                page,
                limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            },
        }
    }

    async getCustomerById(id: number) {
        const pool = await getPool()
        const request = pool.request()

        request.input('id', sql.Int, id)
        const query = `
      SELECT 
        c.id, 
        c.phoneNumber, 
        c.fullName, 
        c.rewardPoints, 
        c.membershipTier, 
        c.createdAt, 
        c.updatedAt,
        cls.totalPointsEarned,
        cls.totalPointsRedeemed
      FROM Customer c
      LEFT JOIN v_CustomerLoyaltySummary cls ON c.id = cls.customerId
      WHERE c.id = @id AND c.deletedAt IS NULL
    `
        const result = await request.query(query)
        return result.recordset[0] || null
    }

    async getCustomerByPhone(phoneNumber: string) {
        const pool = await getPool()
        const request = pool.request()

        request.input('phoneNumber', sql.VarChar(20), phoneNumber)
        const query = `
      SELECT id, fullName, phoneNumber 
      FROM Customer 
      WHERE phoneNumber = @phoneNumber AND deletedAt IS NULL
    `
        const result = await request.query(query)
        return result.recordset[0] || null
    }

    async createCustomer(data: CreateCustomerType) {
        const pool = await getPool()
        const request = pool.request()

        request.input('fullName', sql.NVarChar(150), data.fullName)
        request.input('phoneNumber', sql.VarChar(20), data.phoneNumber)
        request.input('password', sql.VarChar(255), data.password || null)

        const query = `
      INSERT INTO Customer (fullName, phoneNumber, password, rewardPoints, membershipTier, createdAt)
      OUTPUT 
        INSERTED.id, 
        INSERTED.fullName, 
        INSERTED.phoneNumber, 
        INSERTED.rewardPoints, 
        INSERTED.membershipTier, 
        INSERTED.createdAt
      VALUES (@fullName, @phoneNumber, @password, 0, 'STANDARD', SYSDATETIME())
    `
        try {
            const result = await request.query(query)
            return result.recordset[0]
        } catch (error: any) {
            if (error.number === 2627 || error.number === 2601) {
                const err = new Error('Số điện thoại khách hàng đã tồn tại trên hệ thống')
                ;(err as any).status = 409
                throw err
            }
            throw error
        }
    }

    async updateCustomer(id: number, data: UpdateCustomerType) {
        const pool = await getPool()
        const request = pool.request()

        const updateFields: string[] = []

        request.input('id', sql.Int, id)

        if (data.fullName !== undefined) {
            request.input('fullName', sql.NVarChar(150), data.fullName)
            updateFields.push('fullName = @fullName')
        }

        if (data.phoneNumber !== undefined) {
            request.input('phoneNumber', sql.VarChar(20), data.phoneNumber)
            updateFields.push('phoneNumber = @phoneNumber')
        }

        if (data.password !== undefined) {
            request.input('password', sql.VarChar(255), data.password)
            updateFields.push('password = @password')
        }

        if (updateFields.length === 0) return null

        updateFields.push('updatedAt = SYSDATETIME()')

        const query = `
      UPDATE Customer 
      SET ${updateFields.join(', ')}
      OUTPUT 
        INSERTED.id, 
        INSERTED.fullName, 
        INSERTED.phoneNumber, 
        INSERTED.rewardPoints, 
        INSERTED.membershipTier, 
        INSERTED.updatedAt
      WHERE id = @id AND deletedAt IS NULL
    `
        try {
            const result = await request.query(query)
            return result.recordset[0] || null
        } catch (error: any) {
            if (error.number === 2627 || error.number === 2601) {
                const err = new Error('Số điện thoại này đã được sử dụng bởi khách hàng khác')
                ;(err as any).status = 409
                throw err
            }
            throw error
        }
    }

    async softDeleteCustomer(id: number) {
        const pool = await getPool()
        const request = pool.request()

        request.input('id', sql.Int, id)
        const query = `
      UPDATE Customer
      SET deletedAt = SYSDATETIME()
      WHERE id = @id AND deletedAt IS NULL
    `
        const result = await request.query(query)
        return result.rowsAffected[0] > 0
    }
}
```

# modules\customer-loyalty\customer\customer.routes.ts

| Property | Value |
|----------|-------|
| Path | `modules\customer-loyalty\customer\customer.routes.ts` |
| Size | 679 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:17:55.055790 |

```typescript
import { Router } from 'express'
import { CustomerController } from './customer.controller'

export const customerRouter = Router()
const controller = new CustomerController()

// GET /api/v1/customer-loyalty/customers
customerRouter.get('/', controller.list)

// GET /api/v1/customer-loyalty/customers/:id
customerRouter.get('/:id', controller.detail)

// POST /api/v1/customer-loyalty/customers
customerRouter.post('/', controller.create)

// PUT /api/v1/customer-loyalty/customers/:id
customerRouter.put('/:id', controller.update)

// DELETE /api/v1/customer-loyalty/customers/:id (Xóa mềm khách hàng)
customerRouter.delete('/:id', controller.delete)

```

# modules\customer-loyalty\customer\customer.schema.ts

| Property | Value |
|----------|-------|
| Path | `modules\customer-loyalty\customer\customer.schema.ts` |
| Size | 1,170 bytes |
| Extension | `.ts` |
| Modified | 2026-10-01 00:07:18.618048 |

```typescript
import { z } from 'zod'

export const CreateCustomerSchema = z.object({
    fullName: z.string().min(2, 'Tên khách hàng tối thiểu 2 ký tự').max(150),
    phoneNumber: z
        .string()
        .regex(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/, 'Số điện thoại không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự').optional().nullable(),
})

export const UpdateCustomerSchema = CreateCustomerSchema.partial()

export const CustomerParamSchema = z.object({
    id: z.coerce.number().int().positive('ID khách hàng không hợp lệ'),
})

export const FilterCustomerQuerySchema = z.object({
    search: z.string().optional(), // Tìm theo fullName hoặc phoneNumber
    membershipTier: z.enum(['STANDARD', 'SILVER', 'GOLD', 'DIAMOND']).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
})

export type CreateCustomerType = z.infer<typeof CreateCustomerSchema>
export type UpdateCustomerType = z.infer<typeof UpdateCustomerSchema>
export type FilterCustomerQueryType = z.infer<typeof FilterCustomerQuerySchema>

```

# modules\customer-loyalty\customer\customer.service.ts

| Property | Value |
|----------|-------|
| Path | `modules\customer-loyalty\customer\customer.service.ts` |
| Size | 2,887 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:17:55.058180 |

```typescript
import bcrypt from 'bcrypt'
import { CustomerRepo } from './customer.repo'
import { CreateCustomerType, FilterCustomerQueryType, UpdateCustomerType } from './customer.schema'

export class CustomerService {
    private customerRepo = new CustomerRepo()

    async getCustomers(filter: FilterCustomerQueryType) {
        return await this.customerRepo.getCustomers(filter)
    }

    async getCustomerById(id: number) {
        const customer = await this.customerRepo.getCustomerById(id)
        if (!customer) {
            const err = new Error('Khách hàng không tồn tại hoặc đã bị xóa')
            ;(err as any).status = 404
            throw err
        }
        return customer
    }

    async createCustomer(data: CreateCustomerType) {
        const existing = await this.customerRepo.getCustomerByPhone(data.phoneNumber)
        if (existing) {
            const err = new Error('Số điện thoại khách hàng đã tồn tại trên hệ thống')
            ;(err as any).status = 409
            throw err
        }

        const payload = { ...data }
        if (payload.password) {
            payload.password = await bcrypt.hash(payload.password, 10)
        }

        const customer = await this.customerRepo.createCustomer(payload)
        return {
            message: 'Tạo thông tin khách hàng thành công',
            data: customer,
        }
    }

    async updateCustomer(id: number, data: UpdateCustomerType) {
        if (data.phoneNumber) {
            const existing = await this.customerRepo.getCustomerByPhone(data.phoneNumber)
            if (existing && existing.id !== id) {
                const err = new Error('Số điện thoại này đã được sử dụng bởi khách hàng khác')
                ;(err as any).status = 409
                throw err
            }
        }

        const payload = { ...data }
        if (payload.password) {
            payload.password = await bcrypt.hash(payload.password, 10)
        }

        const updated = await this.customerRepo.updateCustomer(id, payload)
        if (!updated) {
            const err = new Error('Cập nhật thất bại hoặc không tìm thấy khách hàng')
            ;(err as any).status = 404
            throw err
        }

        return {
            message: 'Cập nhật thông tin khách hàng thành công',
            data: updated,
        }
    }

    async deleteCustomer(id: number) {
        const success = await this.customerRepo.softDeleteCustomer(id)
        if (!success) {
            const err = new Error('Xóa thất bại hoặc không tìm thấy khách hàng')
            ;(err as any).status = 404
            throw err
        }
        return {
            message: 'Xóa thông tin khách hàng thành công',
        }
    }
}
```

# modules\customer-loyalty\customer-loyalty.routes.ts

| Property | Value |
|----------|-------|
| Path | `modules\customer-loyalty\customer-loyalty.routes.ts` |
| Size | 316 bytes |
| Extension | `.ts` |
| Modified | 2026-09-23 23:13:11.490149 |

```typescript
import { Router } from 'express'
import { customerRouter } from './customer/customer.routes'
import { loyaltyRouter } from './loyalty/loyalty.routes'

export const customerLoyaltyRouter = Router()
customerLoyaltyRouter.use('/customers', customerRouter)
customerLoyaltyRouter.use('/transactions', loyaltyRouter)
```

# modules\customer-loyalty\loyalty\loyalty.controller.ts

| Property | Value |
|----------|-------|
| Path | `modules\customer-loyalty\loyalty\loyalty.controller.ts` |
| Size | 1,034 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.197006 |

```typescript
import { Request, Response, NextFunction } from 'express'
import { LoyaltyService } from './loyalty.service'
import { AdjustPointsSchema, FilterLoyaltyHistoryQuerySchema } from './loyalty.schema'

export class LoyaltyController {
    private loyaltyService = new LoyaltyService()

    getHistory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = FilterLoyaltyHistoryQuerySchema.parse(req.query)
            const data = await this.loyaltyService.getLoyaltyHistory(query)
            res.status(200).json({ success: true, ...data })
        } catch (error) {
            next(error)
        }
    }

    adjustPoints = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = AdjustPointsSchema.parse(req.body)
            const result = await this.loyaltyService.adjustPoints(body)
            res.status(200).json({ success: true, ...result })
        } catch (error) {
            next(error)
        }
    }
}
```

# modules\customer-loyalty\loyalty\loyalty.repo.ts

| Property | Value |
|----------|-------|
| Path | `modules\customer-loyalty\loyalty\loyalty.repo.ts` |
| Size | 10,568 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 23:05:56.112387 |

```typescript
import { getPool, sql } from '@/config/database'
import { AdjustPointsType, FilterLoyaltyHistoryQueryType } from './loyalty.schema'

export class LoyaltyRepo {
    async getLoyaltyHistory(filter: FilterLoyaltyHistoryQueryType) {
        const pool = await getPool()
        const request = pool.request()

        const { customerId, orderId, transactionType, fromDate, toDate, page = 1, limit = 20 } = filter
        const offset = (page - 1) * limit

        // Nếu có customerId, fromDate, toDate và không có orderId / transactionType: tận dụng Function fn_GetMemberLoyaltyHistory
        if (customerId && fromDate && toDate && !orderId && !transactionType) {
            request.input('customerId', sql.Int, customerId)
            request.input('fromDate', sql.DateTime2, fromDate)
            const endDate = new Date(toDate)
            endDate.setDate(endDate.getDate() + 1)
            request.input('toDate', sql.DateTime2, endDate)
            request.input('offset', sql.Int, offset)
            request.input('limit', sql.Int, limit)

            const countRes = await request.query(`
                SELECT COUNT(1) AS total
                FROM dbo.fn_GetMemberLoyaltyHistory(@customerId, @fromDate, @toDate)
            `)
            const totalItems = countRes.recordset[0]?.total || 0

            const listQuery = `
                SELECT 
                    h.transactionId AS id,
                    h.customerId,
                    c.fullName AS customerName,
                    c.phoneNumber AS customerPhone,
                    h.orderId,
                    h.transactionType,
                    h.points,
                    h.balanceAfter,
                    h.description,
                    h.transactionTime AS createdAt
                FROM dbo.fn_GetMemberLoyaltyHistory(@customerId, @fromDate, @toDate) h
                JOIN Customer c ON h.customerId = c.id
                ORDER BY h.transactionTime DESC, h.transactionId DESC
                OFFSET @offset ROWS
                FETCH NEXT @limit ROWS ONLY
            `
            const listRes = await request.query(listQuery)

            return {
                items: listRes.recordset,
                meta: {
                    page,
                    limit,
                    totalItems,
                    totalPages: Math.ceil(totalItems / limit),
                },
            }
        }

        const conditions: string[] = ['1=1']

        if (customerId) {
            request.input('customerId', sql.Int, customerId)
            conditions.push('lt.customerId = @customerId')
        }

        if (orderId) {
            request.input('orderId', sql.Int, orderId)
            conditions.push('lt.orderId = @orderId')
        }

        if (transactionType) {
            request.input('transactionType', sql.NVarChar(50), transactionType)
            conditions.push('lt.transactionType = @transactionType')
        }

        if (fromDate) {
            request.input('fromDate', sql.DateTime2, fromDate)
            conditions.push('lt.createdAt >= @fromDate')
        }

        if (toDate) {
            const endDate = new Date(toDate)
            endDate.setDate(endDate.getDate() + 1)
            request.input('toDate', sql.DateTime2, endDate)
            conditions.push('lt.createdAt < @toDate')
        }

        const whereClause = `WHERE ${conditions.join(' AND ')}`

        const countRes = await request.query(`SELECT COUNT(1) AS total FROM LoyaltyTransaction lt ${whereClause}`)
        const totalItems = countRes.recordset[0]?.total || 0

        request.input('offset', sql.Int, offset)
        request.input('limit', sql.Int, limit)

        const listQuery = `
      SELECT 
        lt.id,
        lt.customerId,
        c.fullName AS customerName,
        c.phoneNumber AS customerPhone,
        lt.orderId,
        lt.transactionType,
        lt.points,
        lt.balanceAfter,
        lt.description,
        lt.createdAt
      FROM LoyaltyTransaction lt
      JOIN Customer c ON lt.customerId = c.id
      ${whereClause}
      ORDER BY lt.createdAt DESC, lt.id DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `
        const listRes = await request.query(listQuery)

        return {
            items: listRes.recordset,
            meta: {
                page,
                limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            },
        }
    }

    // Thực hiện giao dịch điểm dùng TRANSACTION & khóa bản ghi (UPDLOCK) để chống Race Condition
    async processPointsTransaction(data: AdjustPointsType) {
        const pool = await getPool()
        const transaction = new sql.Transaction(pool)

        await transaction.begin()

        try {
            const lockReq = new sql.Request(transaction)
            lockReq.input('customerId', sql.Int, data.customerId)

            // Kiểm tra và khóa dòng dữ liệu của Customer
            const customerRes = await lockReq.query(`
        SELECT rewardPoints, membershipTier 
        FROM Customer WITH (UPDLOCK, ROWLOCK)
        WHERE id = @customerId AND deletedAt IS NULL
      `)

            if (customerRes.recordset.length === 0) {
                throw new Error('Khách hàng không tồn tại hoặc đã bị xóa')
            }

            // Nếu truyền orderId, validate đơn hàng & kiểm tra thuộc về customerId
            if (data.orderId) {
                const orderReq = new sql.Request(transaction)
                orderReq.input('orderId', sql.Int, data.orderId)
                const orderRes = await orderReq.query(`
          SELECT id, customerId 
          FROM [Order] 
          WHERE id = @orderId AND deletedAt IS NULL
        `)

                if (orderRes.recordset.length === 0) {
                    throw new Error('Đơn hàng không tồn tại')
                }

                const order = orderRes.recordset[0]
                if (order.customerId && order.customerId !== data.customerId) {
                    throw new Error('Đơn hàng không thuộc về khách hàng này')
                }

                // Chống EARN trùng order nếu mỗi order chỉ được cộng điểm một lần
                if (data.transactionType === 'EARN') {
                    const dupReq = new sql.Request(transaction)
                    dupReq.input('orderId', sql.Int, data.orderId)
                    const dupRes = await dupReq.query(`
            SELECT TOP 1 id FROM LoyaltyTransaction 
            WHERE orderId = @orderId AND transactionType = 'EARN'
          `)

                    if (dupRes.recordset.length > 0) {
                        throw new Error('Đơn hàng này đã được cộng điểm thưởng trước đó')
                    }
                }
            }

            const currentPoints: number = customerRes.recordset[0].rewardPoints
            let newBalance = currentPoints

            if (data.transactionType === 'EARN') {
                newBalance += data.points
            } else if (data.transactionType === 'REDEEM') {
                if (currentPoints < data.points) {
                    throw new Error(`Điểm thưởng không đủ (Hiện có: ${currentPoints}, cần đổi: ${data.points})`)
                }
                newBalance -= data.points
            }

            // Tính tổng điểm tích lũy lifetime (Lifetime Earned Points) để xét hạng membershipTier
            const lifetimeReq = new sql.Request(transaction)
            lifetimeReq.input('customerId', sql.Int, data.customerId)
            const lifetimeRes = await lifetimeReq.query(`
        SELECT ISNULL(SUM(points), 0) AS totalEarned
        FROM LoyaltyTransaction
        WHERE customerId = @customerId AND transactionType = 'EARN'
      `)

            let lifetimePoints = Number(lifetimeRes.recordset[0]?.totalEarned || 0)
            if (data.transactionType === 'EARN') {
                lifetimePoints += data.points
            }

            // Xác định hạng thành viên theo Lifetime Points để không bị tụt hạng khi đổi điểm (REDEEM)
            let newTier = 'STANDARD'
            if (lifetimePoints >= 1000) newTier = 'DIAMOND'
            else if (lifetimePoints >= 500) newTier = 'GOLD'
            else if (lifetimePoints >= 200) newTier = 'SILVER'

            // Cập nhật Customer
            const updateReq = new sql.Request(transaction)
            updateReq.input('customerId', sql.Int, data.customerId)
            updateReq.input('newBalance', sql.Int, newBalance)
            updateReq.input('newTier', sql.NVarChar(50), newTier)

            await updateReq.query(`
        UPDATE Customer 
        SET rewardPoints = @newBalance, 
            membershipTier = @newTier, 
            updatedAt = SYSDATETIME()
        WHERE id = @customerId
      `)

            // Ghi log vào bảng LoyaltyTransaction
            const logReq = new sql.Request(transaction)
            logReq.input('customerId', sql.Int, data.customerId)
            logReq.input('orderId', sql.Int, data.orderId || null)
            logReq.input('transactionType', sql.NVarChar(50), data.transactionType)
            logReq.input('points', sql.Int, data.points)
            logReq.input('balanceAfter', sql.Int, newBalance)
            logReq.input('description', sql.NVarChar(500), data.description || null)

            const logRes = await logReq.query(`
        INSERT INTO LoyaltyTransaction (customerId, orderId, transactionType, points, balanceAfter, description)
        OUTPUT 
          INSERTED.id, 
          INSERTED.customerId, 
          INSERTED.orderId, 
          INSERTED.transactionType, 
          INSERTED.points, 
          INSERTED.balanceAfter, 
          INSERTED.description, 
          INSERTED.createdAt
        VALUES (@customerId, @orderId, @transactionType, @points, @balanceAfter, @description)
      `)

            await transaction.commit()
            return {
                transaction: logRes.recordset[0],
                newTier,
                balanceAfter: newBalance,
            }
        } catch (error) {
            await transaction.rollback()
            throw error
        }
    }
}
```

# modules\customer-loyalty\loyalty\loyalty.routes.ts

| Property | Value |
|----------|-------|
| Path | `modules\customer-loyalty\loyalty\loyalty.routes.ts` |
| Size | 797 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 23:31:02.823797 |

```typescript
import { Router } from 'express'
import { LoyaltyController } from './loyalty.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import {
  AdjustPointsSchema,
  FilterLoyaltyHistoryQuerySchema,
} from './loyalty.schema'

export const loyaltyRouter = Router()
const controller = new LoyaltyController()

loyaltyRouter.use(authGuard)

// Tra cứu lịch sử biến động điểm
loyaltyRouter.get(
  '/history',
  roleGuard('CUSTOMER', 'CASHIER', 'MANAGER'),
  validatePipe(FilterLoyaltyHistoryQuerySchema, 'query'),
  controller.getHistory
)

// Điều chỉnh tăng/giảm điểm thủ công: Chỉ MANAGER
loyaltyRouter.post(
  '/adjust',
  roleGuard('MANAGER'),
  validatePipe(AdjustPointsSchema, 'body'),
  controller.adjustPoints
)
```

# modules\customer-loyalty\loyalty\loyalty.schema.ts

| Property | Value |
|----------|-------|
| Path | `modules\customer-loyalty\loyalty\loyalty.schema.ts` |
| Size | 1,613 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:17:55.060298 |

```typescript
import { z } from 'zod'

export const AdjustPointsSchema = z.object({
    customerId: z.coerce.number().int().positive('customerId không hợp lệ'),
    orderId: z.coerce.number().int().positive('orderId không hợp lệ').optional().nullable(),
    transactionType: z.enum(['EARN', 'REDEEM'], {
        errorMap: () => ({ message: 'transactionType phải là EARN hoặc REDEEM' }),
    }),
    points: z.coerce.number().int().positive('Số điểm thay đổi phải lớn hơn 0'),
    description: z.string().max(500).optional().nullable(),
})

export const FilterLoyaltyHistoryQuerySchema = z
    .object({
        customerId: z.coerce.number().int().positive().optional(),
        orderId: z.coerce.number().int().positive().optional(),
        transactionType: z.enum(['EARN', 'REDEEM']).optional(),
        fromDate: z.coerce.date().optional(),
        toDate: z.coerce.date().optional(),
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce
            .number()
            .int()
            .positive()
            .max(100)
            .default(20),
    })
    .refine(
        data => {
            if (data.fromDate && data.toDate) {
                return data.fromDate <= data.toDate
            }
            return true
        },
        {
            message: 'fromDate must be less than or equal to toDate',
            path: ['toDate'],
        },
    )

export type AdjustPointsType = z.infer<typeof AdjustPointsSchema>
export type FilterLoyaltyHistoryQueryType = z.infer<typeof FilterLoyaltyHistoryQuerySchema>
```

# modules\customer-loyalty\loyalty\loyalty.service.ts

| Property | Value |
|----------|-------|
| Path | `modules\customer-loyalty\loyalty\loyalty.service.ts` |
| Size | 656 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.201005 |

```typescript
import { LoyaltyRepo } from './loyalty.repo'
import { AdjustPointsType, FilterLoyaltyHistoryQueryType } from './loyalty.schema'

export class LoyaltyService {
    private loyaltyRepo = new LoyaltyRepo()

    async getLoyaltyHistory(filter: FilterLoyaltyHistoryQueryType) {
        return await this.loyaltyRepo.getLoyaltyHistory(filter)
    }

    async adjustPoints(data: AdjustPointsType) {
        const result = await this.loyaltyRepo.processPointsTransaction(data)
        return {
            message: `${data.transactionType === 'EARN' ? 'Tích điểm' : 'Đổi điểm'} thành công`,
            data: result,
        }
    }
}
```

# modules\inventory-bom\adjustment\adjustment.controller.ts

| Property | Value |
|----------|-------|
| Path | `modules\inventory-bom\adjustment\adjustment.controller.ts` |
| Size | 962 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.203007 |

```typescript
import { Request, Response, NextFunction } from 'express'
import { AdjustmentService } from './adjustment.service'
import { CreateAdjustmentSchema, FilterAdjustmentQuerySchema } from './adjustment.schema'

export class AdjustmentController {
  private adjustmentService = new AdjustmentService()

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = FilterAdjustmentQuerySchema.parse(req.query)
      const data = await this.adjustmentService.getAdjustments(query)
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = CreateAdjustmentSchema.parse(req.body)
      const result = await this.adjustmentService.createAdjustment(body)
      res.status(201).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }
}
```

# modules\inventory-bom\adjustment\adjustment.repo.ts

| Property | Value |
|----------|-------|
| Path | `modules\inventory-bom\adjustment\adjustment.repo.ts` |
| Size | 1,453 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:51:25.479671 |

```typescript
import { getPool, sql } from '@/config/database'
import { CreateAdjustmentType, FilterAdjustmentQueryType } from './adjustment.schema'

export class AdjustmentRepo {
  async getAdjustments(filter: FilterAdjustmentQueryType) {
    const pool = await getPool()
    const req = pool.request()
    let query = `
      SELECT 
        ia.id, ia.ingredientId, i.name AS ingredientName, i.unit,
        ia.employeeId, e.fullName AS employeeName,
        ia.oldQuantity, ia.newQuantity, ia.difference, ia.reason, ia.adjustmentDate
      FROM InventoryAdjustment ia
      JOIN Ingredient i ON ia.ingredientId = i.id
      JOIN Employee e ON ia.employeeId = e.id
      WHERE 1=1
    `
    if (filter.ingredientId) {
      req.input('ingredientId', sql.Int, filter.ingredientId)
      query += ' AND ia.ingredientId = @ingredientId'
    }
    query += ' ORDER BY ia.adjustmentDate DESC'
    const result = await req.query(query)
    return result.recordset
  }

  async createAdjustmentWithTransaction(data: CreateAdjustmentType) {
    const pool = await getPool()
    const req = pool.request()
    req.input('ingredientId', sql.Int, data.ingredientId)
    req.input('employeeId', sql.Int, data.employeeId)
    req.input('newQuantity', sql.Decimal(18, 3), data.newQuantity)
    req.input('reason', sql.NVarChar(500), data.reason)

    const result = await req.execute('sp_DieuChinhTonKho')
    return result.recordset[0]
  }
}
```

# modules\inventory-bom\adjustment\adjustment.routes.ts

| Property | Value |
|----------|-------|
| Path | `modules\inventory-bom\adjustment\adjustment.routes.ts` |
| Size | 798 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 23:30:19.738399 |

```typescript
import { Router } from 'express'
import { AdjustmentController } from './adjustment.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import {
  CreateAdjustmentSchema,
  FilterAdjustmentQuerySchema,
} from './adjustment.schema'

export const adjustmentRouter = Router()
const controller = new AdjustmentController()

adjustmentRouter.use(authGuard, roleGuard('STOREKEEPER', 'MANAGER'))

// GET /api/v1/inventory/adjustments - Xem lịch sử điều chỉnh cân kho
adjustmentRouter.get(
  '/',
  validatePipe(FilterAdjustmentQuerySchema, 'query'),
  controller.list
)

// POST /api/v1/inventory/adjustments - Lập phiếu cân kho hao hụt
adjustmentRouter.post(
  '/',
  validatePipe(CreateAdjustmentSchema, 'body'),
  controller.create
)
```

# modules\inventory-bom\adjustment\adjustment.schema.ts

| Property | Value |
|----------|-------|
| Path | `modules\inventory-bom\adjustment\adjustment.schema.ts` |
| Size | 786 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.205006 |

```typescript
import { z } from 'zod'

export const CreateAdjustmentSchema = z.object({
  ingredientId: z.coerce.number().int().positive('ingredientId không hợp lệ'),
  employeeId: z.coerce.number().int().positive('employeeId không hợp lệ'),
  newQuantity: z.coerce.number().min(0, 'Số lượng kiểm kê thực tế phải >= 0'),
  reason: z.string().min(3, 'Lý do điều chỉnh tối thiểu 3 ký tự').max(255),
})

export const FilterAdjustmentQuerySchema = z.object({
  ingredientId: z.coerce.number().int().positive().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
})

export type CreateAdjustmentType = z.infer<typeof CreateAdjustmentSchema>
export type FilterAdjustmentQueryType = z.infer<typeof FilterAdjustmentQuerySchema>
```

# modules\inventory-bom\adjustment\adjustment.service.ts

| Property | Value |
|----------|-------|
| Path | `modules\inventory-bom\adjustment\adjustment.service.ts` |
| Size | 614 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.207007 |

```typescript
import { AdjustmentRepo } from './adjustment.repo'
import { CreateAdjustmentType, FilterAdjustmentQueryType } from './adjustment.schema'

export class AdjustmentService {
  private adjustmentRepo = new AdjustmentRepo()

  async getAdjustments(filter: FilterAdjustmentQueryType) {
    return await this.adjustmentRepo.getAdjustments(filter)
  }

  async createAdjustment(data: CreateAdjustmentType) {
    const result = await this.adjustmentRepo.createAdjustmentWithTransaction(data)
    return {
      message: 'Cân đo và điều chỉnh tồn kho thành công',
      data: result,
    }
  }
}
```

# modules\inventory-bom\bom\bom.controller.ts

| Property | Value |
|----------|-------|
| Path | `modules\inventory-bom\bom\bom.controller.ts` |
| Size | 1,976 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.208008 |

```typescript
import { Request, Response, NextFunction } from 'express'
import { BOMService } from './bom.service'
import { RecipeBOMSchema, ToppingBOMSchema, GetVariantBOMQuerySchema } from './bom.schema'

export class BOMController {
  private bomService = new BOMService()

  getRecipes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = GetVariantBOMQuerySchema.parse(req.query)
      const data = await this.bomService.getRecipeDetails(query.variantId)
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  getToppingBOM = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const toppingId = Number(req.params.toppingId)
      const data = await this.bomService.getToppingBOM(toppingId)
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  upsertRecipe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = RecipeBOMSchema.parse(req.body)
      const result = await this.bomService.upsertRecipeBOM(body)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  upsertTopping = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = ToppingBOMSchema.parse(req.body)
      const result = await this.bomService.upsertToppingBOM(body)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  deleteRecipe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const variantId = Number(req.params.variantId)
      const ingredientId = Number(req.params.ingredientId)
      const result = await this.bomService.deleteRecipeBOM(variantId, ingredientId)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }
}
```

# modules\inventory-bom\bom\bom.repo.ts

| Property | Value |
|----------|-------|
| Path | `modules\inventory-bom\bom\bom.repo.ts` |
| Size | 2,983 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:50:29.603734 |

```typescript
import { getPool, sql } from '@/config/database'
import { RecipeBOMType, ToppingBOMType } from './bom.schema'

export class BOMRepo {
  async getAllRecipeDetails(variantId?: number) {
    const pool = await getPool()
    const req = pool.request()
    let query = 'SELECT * FROM v_ProductRecipeDetails'
    if (variantId) {
      req.input('variantId', sql.Int, variantId)
      query = `
        SELECT 
          p.name AS productName, pv.size AS productSize,
          i.name AS ingredientName, rb.consumedQuantity, i.unit AS ingredientUnit
        FROM RecipeBOM rb
        JOIN ProductVariant pv ON rb.variantId = pv.id
        JOIN Product p ON pv.productId = p.id
        JOIN Ingredient i ON rb.ingredientId = i.id
        WHERE rb.variantId = @variantId
      `
    }
    const result = await req.query(query)
    return result.recordset
  }

  async getToppingBOM(toppingId: number) {
    const pool = await getPool()
    const req = pool.request()
    req.input('toppingId', sql.Int, toppingId)
    const query = `
      SELECT t.name AS toppingName, i.name AS ingredientName, tb.consumedQuantity, i.unit
      FROM ToppingBOM tb
      JOIN Topping t ON tb.toppingId = t.id
      JOIN Ingredient i ON tb.ingredientId = i.id
      WHERE tb.toppingId = @toppingId
    `
    const result = await req.query(query)
    return result.recordset
  }

  async upsertRecipeBOM(data: RecipeBOMType) {
    const pool = await getPool()
    const req = pool.request()
    req.input('variantId', sql.Int, data.variantId)
    req.input('ingredientId', sql.Int, data.ingredientId)
    req.input('consumedQuantity', sql.Decimal(18, 4), data.consumedQuantity)
    return await req.execute('sp_CauHinhDinhLuongBOM')
  }

  async upsertToppingBOM(data: ToppingBOMType) {
    const pool = await getPool()
    const req = pool.request()
    req.input('toppingId', sql.Int, data.toppingId)
    req.input('ingredientId', sql.Int, data.ingredientId)
    req.input('consumedQuantity', sql.Decimal(18, 4), data.consumedQuantity)

    const query = `
      MERGE INTO ToppingBOM AS target
      USING (SELECT @toppingId AS toppingId, @ingredientId AS ingredientId) AS src
      ON (target.toppingId = src.toppingId AND target.ingredientId = src.ingredientId)
      WHEN MATCHED THEN
        UPDATE SET target.consumedQuantity = @consumedQuantity
      WHEN NOT MATCHED THEN
        INSERT (toppingId, ingredientId, consumedQuantity) VALUES (@toppingId, @ingredientId, @consumedQuantity);
    `
    return await req.query(query)
  }

  async deleteRecipeBOM(variantId: number, ingredientId: number) {
    const pool = await getPool()
    const req = pool.request()
    req.input('variantId', sql.Int, variantId)
    req.input('ingredientId', sql.Int, ingredientId)
    const result = await req.query('DELETE FROM RecipeBOM WHERE variantId = @variantId AND ingredientId = @ingredientId')
    return result.rowsAffected[0]
  }
}
```

# modules\inventory-bom\bom\bom.routes.ts

| Property | Value |
|----------|-------|
| Path | `modules\inventory-bom\bom\bom.routes.ts` |
| Size | 1,082 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 23:30:32.499211 |

```typescript
import { Router } from 'express'
import { BOMController } from './bom.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import {
  GetVariantBOMQuerySchema,
  RecipeBOMSchema,
  ToppingBOMSchema,
} from './bom.schema'

export const bomRouter = Router()
const controller = new BOMController()

bomRouter.use(authGuard)

// Xem định lượng món và topping
bomRouter.get(
  '/recipes',
  roleGuard('BARISTA', 'MANAGER'),
  validatePipe(GetVariantBOMQuerySchema, 'query'),
  controller.getRecipes
)

bomRouter.get(
  '/toppings/:toppingId',
  roleGuard('BARISTA', 'MANAGER'),
  controller.getToppingBOM
)

// Cấu hình định mức tiêu hao
bomRouter.post(
  '/recipes',
  roleGuard('MANAGER'),
  validatePipe(RecipeBOMSchema, 'body'),
  controller.upsertRecipe
)

bomRouter.post(
  '/toppings',
  roleGuard('MANAGER'),
  validatePipe(ToppingBOMSchema, 'body'),
  controller.upsertTopping
)

bomRouter.delete(
  '/recipes/:variantId/:ingredientId',
  roleGuard('MANAGER'),
  controller.deleteRecipe
)
```

# modules\inventory-bom\bom\bom.schema.ts

| Property | Value |
|----------|-------|
| Path | `modules\inventory-bom\bom\bom.schema.ts` |
| Size | 1,049 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.211004 |

```typescript
import { z } from 'zod'

// Schema cho RecipeBOM (Biến thể sản phẩm)
export const RecipeBOMSchema = z.object({
  variantId: z.coerce.number().int().positive('variantId phải là số nguyên dương'),
  ingredientId: z.coerce.number().int().positive('ingredientId phải là số nguyên dương'),
  consumedQuantity: z.coerce.number().positive('Định mức tiêu hao phải > 0'),
})

// Schema cho ToppingBOM (Topping)
export const ToppingBOMSchema = z.object({
  toppingId: z.coerce.number().int().positive('toppingId phải là số nguyên dương'),
  ingredientId: z.coerce.number().int().positive('ingredientId phải là số nguyên dương'),
  consumedQuantity: z.coerce.number().positive('Định mức tiêu hao phải > 0'),
})

// Query lấy BOM theo variantId
export const GetVariantBOMQuerySchema = z.object({
  variantId: z.coerce.number().int().positive().optional(),
})

export type RecipeBOMType = z.infer<typeof RecipeBOMSchema>
export type ToppingBOMType = z.infer<typeof ToppingBOMSchema>
```

# modules\inventory-bom\bom\bom.service.ts

| Property | Value |
|----------|-------|
| Path | `modules\inventory-bom\bom\bom.service.ts` |
| Size | 1,211 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.212004 |

```typescript
import { BOMRepo } from './bom.repo'
import { RecipeBOMType, ToppingBOMType } from './bom.schema'

export class BOMService {
  private bomRepo = new BOMRepo()

  async getRecipeDetails(variantId?: number) {
    return await this.bomRepo.getAllRecipeDetails(variantId)
  }

  async getToppingBOM(toppingId: number) {
    return await this.bomRepo.getToppingBOM(toppingId)
  }

  async upsertRecipeBOM(data: RecipeBOMType) {
    await this.bomRepo.upsertRecipeBOM(data)
    return {
      message: 'Cập nhật định lượng công thức (BOM) món thành công',
      data,
    }
  }

  async upsertToppingBOM(data: ToppingBOMType) {
    await this.bomRepo.upsertToppingBOM(data)
    return {
      message: 'Cập nhật định lượng công thức (BOM) topping thành công',
      data,
    }
  }

  async deleteRecipeBOM(variantId: number, ingredientId: number) {
    const affected = await this.bomRepo.deleteRecipeBOM(variantId, ingredientId)
    if (affected === 0) {
      throw new Error('Không tìm thấy định lượng công thức cần xóa')
    }
    return {
      message: 'Xóa nguyên liệu khỏi định lượng thành công',
    }
  }
}
```

# modules\inventory-bom\import\import.controller.ts

| Property | Value |
|----------|-------|
| Path | `modules\inventory-bom\import\import.controller.ts` |
| Size | 1,369 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.213005 |

```typescript
import { Request, Response, NextFunction } from 'express'
import { ImportService } from './import.service'
import {
  CreateImportTicketSchema,
  ImportTicketParamsSchema,
  QueryImportTicketSchema,
} from './import.schema'

export class ImportController {
  private importService = new ImportService()

  getImportTickets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = QueryImportTicketSchema.parse(req.query)
      const data = await this.importService.getImportTickets(query)
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  getImportDetailById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { importId } = ImportTicketParamsSchema.parse(req.params)
      const data = await this.importService.getImportDetailById(importId)
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  createImportTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = CreateImportTicketSchema.parse(req.body)
      const result = await this.importService.createImportTicket(body)
      res.status(201).json({
        success: true,
        ...result,
      })
    } catch (error) {
      next(error)
    }
  }
}
```

# modules\inventory-bom\import\import.repo.ts

| Property | Value |
|----------|-------|
| Path | `modules\inventory-bom\import\import.repo.ts` |
| Size | 3,308 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:51:41.030498 |

```typescript
import { getPool, sql } from '@/config/database'
import { QueryImportTicketType } from './import.schema'

export class ImportRepo {
  async findAll(query: QueryImportTicketType) {
    const pool = await getPool()
    const req = pool.request()
    let sqlStr = `
      SELECT ii.*, e.fullName AS employeeName 
      FROM InventoryImport ii
      JOIN Employee e ON ii.employeeId = e.id
      WHERE 1=1
    `
    if (query.supplierName) {
      req.input('supplierName', sql.NVarChar(255), `%${query.supplierName}%`)
      sqlStr += ' AND ii.supplierName LIKE @supplierName'
    }
    sqlStr += ' ORDER BY ii.importDate DESC'
    const result = await req.query(sqlStr)
    return result.recordset
  }

  async findById(id: number) {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)
    const result = await req.query('SELECT * FROM InventoryImport WHERE id = @id')
    return result.recordset[0] || null
  }

  async findDetailsByImportId(importId: number) {
    const pool = await getPool()
    const req = pool.request()
    req.input('importId', sql.Int, importId)
    const query = `
      SELECT iid.*, i.name AS ingredientName, i.unit
      FROM InventoryImportDetail iid
      JOIN Ingredient i ON iid.ingredientId = i.id
      WHERE iid.importId = @importId
    `
    const result = await req.query(query)
    return result.recordset
  }

  async createImportTicketWithProcedure(data: any) {
    const pool = await getPool()
    const transaction = new sql.Transaction(pool)
    await transaction.begin()
    try {
      const headerReq = new sql.Request(transaction)
      headerReq.input('employeeId', sql.Int, data.employeeId)
      headerReq.input('supplierName', sql.NVarChar(255), data.supplierName)
      headerReq.input('totalAmount', sql.Decimal(18, 2), data.totalAmount)
      headerReq.input('note', sql.NVarChar(sql.MAX), data.note || null)

      const headerRes = await headerReq.query(`
        INSERT INTO InventoryImport (employeeId, supplierName, totalAmount, importDate, note)
        OUTPUT INSERTED.id
        VALUES (@employeeId, @supplierName, @totalAmount, SYSDATETIME(), @note)
      `)
      const importId = headerRes.recordset[0].id

      for (const item of data.details) {
        const detailReq = new sql.Request(transaction)
        const lineTotal = item.quantity * item.unitPrice
        detailReq.input('importId', sql.Int, importId)
        detailReq.input('ingredientId', sql.Int, item.ingredientId)
        detailReq.input('quantity', sql.Decimal(18, 3), item.quantity)
        detailReq.input('unitPrice', sql.Decimal(18, 2), item.unitPrice)
        detailReq.input('totalLineAmount', sql.Decimal(18, 2), lineTotal)

        // Trigger trg_Ingredient_CongKho_KhiNhapHang sẽ tự động cộng dồn kho sau câu lệnh INSERT này
        await detailReq.query(`
          INSERT INTO InventoryImportDetail (importId, ingredientId, quantity, unitPrice, totalLineAmount)
          VALUES (@importId, @ingredientId, @quantity, @unitPrice, @totalLineAmount)
        `)
      }

      await transaction.commit()
      return { importId, ...data }
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}
```

# modules\inventory-bom\import\import.routes.ts

| Property | Value |
|----------|-------|
| Path | `modules\inventory-bom\import\import.routes.ts` |
| Size | 1,000 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 23:30:02.629013 |

```typescript
import { Router } from 'express'
import { ImportController } from './import.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import {
  CreateImportTicketSchema,
  ImportTicketParamsSchema,
  QueryImportTicketSchema,
} from './import.schema'

export const importRouter = Router()
const controller = new ImportController()

importRouter.use(authGuard, roleGuard('STOREKEEPER', 'MANAGER'))

// GET /api/v1/inventory/imports - Lấy danh sách phiếu nhập
importRouter.get(
  '/',
  validatePipe(QueryImportTicketSchema, 'query'),
  controller.getImportTickets
)

// GET /api/v1/inventory/imports/:importId - Xem chi tiết phiếu nhập
importRouter.get(
  '/:importId',
  validatePipe(ImportTicketParamsSchema, 'params'),
  controller.getImportDetailById
)

// POST /api/v1/inventory/imports - Tạo phiếu nhập kho mới
importRouter.post(
  '/',
  validatePipe(CreateImportTicketSchema, 'body'),
  controller.createImportTicket
)
```

# modules\inventory-bom\import\import.schema.ts

| Property | Value |
|----------|-------|
| Path | `modules\inventory-bom\import\import.schema.ts` |
| Size | 1,385 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.215005 |

```typescript
import { z } from 'zod'

export const ImportDetailItemSchema = z.object({
  ingredientId: z.coerce.number().int().positive('Mã nguyên liệu không hợp lệ'),
  quantity: z.coerce.number().positive('Số lượng nhập phải lớn hơn 0'),
  unitPrice: z.coerce.number().min(0, 'Đơn giá nhập phải >= 0'),
})

export const CreateImportTicketSchema = z.object({
  supplierName: z.string().min(2, 'Tên nhà cung cấp tối thiểu 2 ký tự').max(150),
  employeeId: z.coerce.number().int().positive('Mã nhân viên thủ kho không hợp lệ'),
  note: z.string().max(255).optional(),
  details: z
    .array(ImportDetailItemSchema)
    .min(1, 'Phiếu nhập kho phải chứa ít nhất một mặt hàng nguyên liệu'),
})

export const ImportTicketParamsSchema = z.object({
  importId: z.coerce.number().int().positive('Mã phiếu nhập không hợp lệ'),
})

export const QueryImportTicketSchema = z.object({
  supplierName: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
})

export type ImportDetailItemType = z.infer<typeof ImportDetailItemSchema>
export type CreateImportTicketType = z.infer<typeof CreateImportTicketSchema>
export type ImportTicketParamsType = z.infer<typeof ImportTicketParamsSchema>
export type QueryImportTicketType = z.infer<typeof QueryImportTicketSchema>
```

# modules\inventory-bom\import\import.service.ts

| Property | Value |
|----------|-------|
| Path | `modules\inventory-bom\import\import.service.ts` |
| Size | 1,351 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.217005 |

```typescript
import { ImportRepo } from './import.repo'
import { CreateImportTicketType, QueryImportTicketType } from './import.schema'

export class ImportService {
  private importRepo = new ImportRepo()

  async getImportTickets(query: QueryImportTicketType) {
    return await this.importRepo.findAll(query)
  }

  async getImportDetailById(importId: number) {
    const importTicket = await this.importRepo.findById(importId)
    if (!importTicket) {
      throw new Error(`Không tìm thấy phiếu nhập kho với mã #${importId}`)
    }
    const details = await this.importRepo.findDetailsByImportId(importId)
    return {
      ...importTicket,
      details,
    }
  }

  async createImportTicket(data: CreateImportTicketType) {
    // Tự động tính tổng tiền phiếu nhập từ danh sách chi tiết dòng
    const calculatedTotalAmount = data.details.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    )

    // Gọi Repo để thực thi Stored Procedure sp_LapPhieuNhapKho
    const result = await this.importRepo.createImportTicketWithProcedure({
      ...data,
      totalAmount: calculatedTotalAmount,
    })

    return {
      message: 'Lập phiếu nhập kho thành công. Tồn kho đã được tự động cập nhật.',
      data: result,
    }
  }
}
```

# modules\inventory-bom\ingredient\ingredient.controller.ts

| Property | Value |
|----------|-------|
| Path | `modules\inventory-bom\ingredient\ingredient.controller.ts` |
| Size | 2,417 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.218005 |

```typescript
import { Request, Response, NextFunction } from 'express'
import { IngredientService } from './ingredient.service'
import {
  CreateIngredientSchema,
  IngredientParamsSchema,
  QueryIngredientSchema,
  UpdateIngredientSchema,
} from './ingredient.schema'

export class IngredientController {
  private ingredientService = new IngredientService()

  getIngredients = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = QueryIngredientSchema.parse(req.query)
      const data = await this.ingredientService.getIngredients(query)
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  getIngredientById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ingredientId } = IngredientParamsSchema.parse(req.params)
      const data = await this.ingredientService.getIngredientById(ingredientId)
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  createIngredient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = CreateIngredientSchema.parse(req.body)
      const data = await this.ingredientService.createIngredient(body)
      res.status(201).json({
        success: true,
        message: 'Thêm mới nguyên liệu thành công',
        data,
      })
    } catch (error) {
      next(error)
    }
  }

  updateIngredient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ingredientId } = IngredientParamsSchema.parse(req.params)
      const body = UpdateIngredientSchema.parse(req.body)
      const data = await this.ingredientService.updateIngredient(ingredientId, body)
      res.status(200).json({
        success: true,
        message: 'Cập nhật thông tin nguyên liệu thành công',
        data,
      })
    } catch (error) {
      next(error)
    }
  }

  deleteIngredient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ingredientId } = IngredientParamsSchema.parse(req.params)
      await this.ingredientService.deleteIngredient(ingredientId)
      res.status(200).json({
        success: true,
        message: 'Đã xóa nguyên liệu thành công (Soft Delete)',
      })
    } catch (error) {
      next(error)
    }
  }
}
```

# modules\inventory-bom\ingredient\ingredient.repo.ts

| Property | Value |
|----------|-------|
| Path | `modules\inventory-bom\ingredient\ingredient.repo.ts` |
| Size | 3,440 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:51:16.082873 |

```typescript
import { getPool, sql } from '@/config/database'
import { CreateIngredientType, UpdateIngredientType } from './ingredient.schema'

export class IngredientRepo {
  async findAll(name?: string) {
    const pool = await getPool()
    const req = pool.request()
    let query = 'SELECT id, name, unit, stockQuantity, minimumThreshold, createdAt, updatedAt FROM Ingredient WHERE deletedAt IS NULL'
    if (name) {
      req.input('name', sql.NVarChar(150), `%${name}%`)
      query += ' AND name LIKE @name'
    }
    query += ' ORDER BY name ASC'
    const result = await req.query(query)
    return result.recordset
  }

  async findById(id: number) {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)
    const result = await req.query('SELECT * FROM Ingredient WHERE id = @id AND deletedAt IS NULL')
    return result.recordset[0] || null
  }

  async findByName(name: string) {
    const pool = await getPool()
    const req = pool.request()
    req.input('name', sql.NVarChar(150), name)
    const result = await req.query('SELECT id FROM Ingredient WHERE name = @name AND deletedAt IS NULL')
    return result.recordset[0] || null
  }

  async getLowStockIngredients() {
    const pool = await getPool()
    const result = await pool.request().query('SELECT * FROM v_LowStockIngredients')
    return result.recordset
  }

  async create(data: CreateIngredientType) {
    const pool = await getPool()
    const req = pool.request()
    req.input('name', sql.NVarChar(150), data.name)
    req.input('unit', sql.NVarChar(50), data.unit)
    req.input('stockQuantity', sql.Decimal(18, 3), data.stockQuantity)
    req.input('minimumThreshold', sql.Decimal(18, 3), data.minimumThreshold)

    const query = `
      INSERT INTO Ingredient (name, unit, stockQuantity, minimumThreshold, createdAt)
      OUTPUT INSERTED.*
      VALUES (@name, @unit, @stockQuantity, @minimumThreshold, SYSDATETIME())
    `
    const result = await req.query(query)
    return result.recordset[0]
  }

  async update(id: number, data: UpdateIngredientType) {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)

    const sets: string[] = ['updatedAt = SYSDATETIME()']
    if (data.name !== undefined) {
      req.input('name', sql.NVarChar(150), data.name)
      sets.push('name = @name')
    }
    if (data.unit !== undefined) {
      req.input('unit', sql.NVarChar(50), data.unit)
      sets.push('unit = @unit')
    }
    if (data.stockQuantity !== undefined) {
      req.input('stockQuantity', sql.Decimal(18, 3), data.stockQuantity)
      sets.push('stockQuantity = @stockQuantity')
    }
    if (data.minimumThreshold !== undefined) {
      req.input('minimumThreshold', sql.Decimal(18, 3), data.minimumThreshold)
      sets.push('minimumThreshold = @minimumThreshold')
    }

    const query = `UPDATE Ingredient SET ${sets.join(', ')} OUTPUT INSERTED.* WHERE id = @id AND deletedAt IS NULL`
    const result = await req.query(query)
    return result.recordset[0] || null
  }

  async softDelete(id: number) {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)
    const result = await req.query('UPDATE Ingredient SET deletedAt = SYSDATETIME() WHERE id = @id AND deletedAt IS NULL')
    return result.rowsAffected[0] > 0
  }
}
```

# modules\inventory-bom\ingredient\ingredient.routes.ts

| Property | Value |
|----------|-------|
| Path | `modules\inventory-bom\ingredient\ingredient.routes.ts` |
| Size | 1,420 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 23:29:52.037301 |

```typescript
import { Router } from 'express'
import { IngredientController } from './ingredient.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import {
  CreateIngredientSchema,
  IngredientParamsSchema,
  QueryIngredientSchema,
  UpdateIngredientSchema,
} from './ingredient.schema'

export const ingredientRouter = Router()
const controller = new IngredientController()

ingredientRouter.use(authGuard)

// Xem nguyên liệu
ingredientRouter.get(
  '/',
  roleGuard('STOREKEEPER', 'MANAGER', 'BARISTA'),
  validatePipe(QueryIngredientSchema, 'query'),
  controller.getIngredients
)

ingredientRouter.get(
  '/:ingredientId',
  roleGuard('STOREKEEPER', 'MANAGER', 'BARISTA'),
  validatePipe(IngredientParamsSchema, 'params'),
  controller.getIngredientById
)

// Tạo mới & cập nhật nguyên liệu
ingredientRouter.post(
  '/',
  roleGuard('STOREKEEPER', 'MANAGER'),
  validatePipe(CreateIngredientSchema, 'body'),
  controller.createIngredient
)

ingredientRouter.put(
  '/:ingredientId',
  roleGuard('STOREKEEPER', 'MANAGER'),
  validatePipe(IngredientParamsSchema, 'params'),
  validatePipe(UpdateIngredientSchema, 'body'),
  controller.updateIngredient
)

// Xóa mềm nguyên liệu
ingredientRouter.delete(
  '/:ingredientId',
  roleGuard('MANAGER'),
  validatePipe(IngredientParamsSchema, 'params'),
  controller.deleteIngredient
)
```

# modules\inventory-bom\ingredient\ingredient.schema.ts

| Property | Value |
|----------|-------|
| Path | `modules\inventory-bom\ingredient\ingredient.schema.ts` |
| Size | 1,178 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.221004 |

```typescript
import { z } from 'zod'

export const CreateIngredientSchema = z.object({
  name: z.string().min(2, 'Tên nguyên liệu tối thiểu 2 ký tự').max(100),
  unit: z.string().min(1, 'Đơn vị tính không được để trống').max(20),
  stockQuantity: z.coerce.number().min(0, 'Số lượng tồn kho ban đầu phải >= 0').default(0),
  minimumThreshold: z.coerce.number().min(0, 'Ngưỡng cảnh báo tối thiểu phải >= 0').default(5),
})

export const UpdateIngredientSchema = CreateIngredientSchema.partial()

export const IngredientParamsSchema = z.object({
  ingredientId: z.coerce.number().int().positive('Mã nguyên liệu không hợp lệ'),
})

export const QueryIngredientSchema = z.object({
  name: z.string().optional(),
  isLowStock: z
    .preprocess((val) => val === 'true' || val === true, z.boolean())
    .optional(),
})

export type CreateIngredientType = z.infer<typeof CreateIngredientSchema>
export type UpdateIngredientType = z.infer<typeof UpdateIngredientSchema>
export type IngredientParamsType = z.infer<typeof IngredientParamsSchema>
export type QueryIngredientType = z.infer<typeof QueryIngredientSchema>
```

# modules\inventory-bom\ingredient\ingredient.service.ts

| Property | Value |
|----------|-------|
| Path | `modules\inventory-bom\ingredient\ingredient.service.ts` |
| Size | 1,696 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.222003 |

```typescript
import { IngredientRepo } from './ingredient.repo'
import {
  CreateIngredientType,
  QueryIngredientType,
  UpdateIngredientType,
} from './ingredient.schema'

export class IngredientService {
  private ingredientRepo = new IngredientRepo()

  async getIngredients(query: QueryIngredientType) {
    if (query.isLowStock) {
      // Truy vấn từ View v_LowStockIngredients trong CSDL
      return await this.ingredientRepo.getLowStockIngredients()
    }
    return await this.ingredientRepo.findAll(query.name)
  }

  async getIngredientById(id: number) {
    const ingredient = await this.ingredientRepo.findById(id)
    if (!ingredient) {
      throw new Error('Không tìm thấy thông tin nguyên liệu')
    }
    return ingredient
  }

  async createIngredient(data: CreateIngredientType) {
    const isExisted = await this.ingredientRepo.findByName(data.name)
    if (isExisted) {
      throw new Error(`Nguyên liệu "${data.name}" đã tồn tại trên hệ thống`)
    }
    return await this.ingredientRepo.create(data)
  }

  async updateIngredient(id: number, data: UpdateIngredientType) {
    const existed = await this.ingredientRepo.findById(id)
    if (!existed) {
      throw new Error('Không tìm thấy nguyên liệu để cập nhật')
    }
    return await this.ingredientRepo.update(id, data)
  }

  async deleteIngredient(id: number) {
    const existed = await this.ingredientRepo.findById(id)
    if (!existed) {
      throw new Error('Không tìm thấy nguyên liệu để xóa')
    }
    // Thực hiện xóa mềm theo quy định Soft Delete
    return await this.ingredientRepo.softDelete(id)
  }
}
```

# modules\inventory-bom\inventory.routes.ts

| Property | Value |
|----------|-------|
| Path | `modules\inventory-bom\inventory.routes.ts` |
| Size | 508 bytes |
| Extension | `.ts` |
| Modified | 2026-09-23 23:13:04.153120 |

```typescript
import { Router } from 'express'
import { ingredientRouter } from './ingredient/ingredient.routes'
import { bomRouter } from './bom/bom.routes'
import { importRouter } from './import/import.routes'
import { adjustmentRouter } from './adjustment/adjustment.routes'

export const inventoryRouter = Router()
inventoryRouter.use('/ingredients', ingredientRouter)
inventoryRouter.use('/boms', bomRouter)
inventoryRouter.use('/imports', importRouter)
inventoryRouter.use('/adjustments', adjustmentRouter)
```

# modules\kds\kds.controller.ts

| Property | Value |
|----------|-------|
| Path | `modules\kds\kds.controller.ts` |
| Size | 1,394 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 23:07:23.066945 |

```typescript
import { Request, Response, NextFunction } from 'express'
import { KDSService } from './kds.service'
import {
  KdsParamSchema,
  NotifyOrderReadySchema,
  QueryKdsQueueSchema,
  UpdateItemStatusSchema,
} from './kds.schema'

export class KDSController {
  private kdsService = new KDSService()

  getQueue = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = QueryKdsQueueSchema.parse(req.query)
      const data = await this.kdsService.getQueue(query)
      res.status(200).json({ success: true, count: data.length, data })
    } catch (error) {
      next(error)
    }
  }

  updateItemStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderDetailId } = KdsParamSchema.parse(req.params)
      const body = UpdateItemStatusSchema.parse(req.body)
      const result = await this.kdsService.updateItemStatus(orderDetailId, body)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  notifyReady = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = NotifyOrderReadySchema.parse(req.params)
      const result = await this.kdsService.notifyOrderReady(orderId)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }
}
```

# modules\kds\kds.repo.ts

| Property | Value |
|----------|-------|
| Path | `modules\kds\kds.repo.ts` |
| Size | 5,023 bytes |
| Extension | `.ts` |
| Modified | 2026-10-01 00:07:18.620103 |

```typescript
import { getPool, sql } from "@/config/database";
import { QueryKdsQueueType, UpdateItemStatusType } from "./kds.schema";

export class KDSRepo {
  // 1. Lấy danh sách hàng đợi các món cần pha chế trên KDS (UC17)
  async getKdsQueue(query: QueryKdsQueueType) {
    const pool = await getPool();
    const req = pool.request();

    const conditions: string[] = [
      "o.status IN ('PENDING_PREP', 'READY_FOR_PICKUP')",
      "od.itemStatus NOT IN ('DONE', 'CANCELLED')",
      "o.deletedAt IS NULL",
    ];

    if (query.status !== "ALL") {
      req.input("itemStatus", sql.NVarChar(50), query.status);
      conditions.push("od.itemStatus = @itemStatus");
    }

    const sqlStr = `
      SELECT 
        o.id AS orderId,
        o.orderCode,
        o.orderChannel,
        p.pagerCode,
        p.batteryLevel,
        od.id AS orderDetailId,
        od.itemSnapshotName,
        od.sizeSnapshot,
        od.quantity,
        od.note,
        od.itemStatus,
        od.createdAt AS itemCreatedAt,
        DATEDIFF(MINUTE, od.createdAt, SYSDATETIME()) AS waitingMinutes
      FROM OrderDetail od
      JOIN [Order] o ON od.orderId = o.id
      LEFT JOIN PagerDevice p ON o.pagerId = p.id
      WHERE ${conditions.join(" AND ")}
      ORDER BY od.createdAt ASC
    `;
    const itemsResult = await req.query(sqlStr);

    // Nếu không có món nào
    if (itemsResult.recordset.length === 0) {
      return [];
    }

    // Lấy kèm topping cho từng ly
    const detailIds = itemsResult.recordset.map((item) => item.orderDetailId);
    let toppingsByDetailId: Record<number, any[]> = {};

    if (detailIds.length > 0) {
      const topReq = pool.request();
      const paramNames = detailIds.map((id, index) => {
        topReq.input(`id${index}`, sql.Int, id);
        return `@id${index}`;
      });

      const toppingResult = await topReq.query(`
    SELECT orderDetailId, toppingSnapshotName, quantity 
    FROM OrderDetailTopping
    WHERE orderDetailId IN (${paramNames.join(",")})
  `);

      toppingsByDetailId = toppingResult.recordset.reduce(
        (acc: any, top: any) => {
          if (!acc[top.orderDetailId]) acc[top.orderDetailId] = [];
          acc[top.orderDetailId].push({
            name: top.toppingSnapshotName,
            quantity: top.quantity,
          });
          return acc;
        },
        {},
      );
    }

    // Ghép topping vào từng dòng ly nước
    return itemsResult.recordset.map((item) => ({
      ...item,
      toppings: toppingsByDetailId[item.orderDetailId] || [],
    }));
  }

  // 2. Barista cập nhật trạng thái món -> Nếu chuyển sang 'DONE',
  // Trigger trg_Ingredient_TruKho_KhiHoanThanhMon dưới CSDL sẽ tự động trừ kho BOM!
  async updateItemStatus(orderDetailId: number, data: UpdateItemStatusType) {
    const pool = await getPool();
    const req = pool.request();

    req.input("orderDetailId", sql.Int, orderDetailId);
    req.input("itemStatus", sql.NVarChar(50), data.itemStatus);

    const result = await req.query(`
      UPDATE OrderDetail
      SET itemStatus = @itemStatus,
          updatedAt = SYSDATETIME()
      OUTPUT 
        INSERTED.id,
        INSERTED.orderId,
        INSERTED.itemSnapshotName,
        INSERTED.sizeSnapshot,
        INSERTED.itemStatus,
        INSERTED.updatedAt
      WHERE id = @orderDetailId
    `);

    return result.recordset[0] || null;
  }

  // 3. Rung chuông thẻ rung & Chuyển trạng thái Order sang READY_FOR_PICKUP (UC18, UC19)
  async triggerReadyAlarm(orderId: number) {
    const pool = await getPool();
    const req = pool.request();
    req.input("orderId", sql.Int, orderId);

    // Kiểm tra xem tất cả các ly trong đơn đã xong (DONE) chưa
    const checkResult = await req.query(`
      SELECT 
        COUNT(CASE WHEN itemStatus <> 'DONE' AND itemStatus <> 'CANCELLED' THEN 1 END) AS pendingCount,
        MAX(pagerId) AS pagerId
      FROM OrderDetail od
      JOIN [Order] o ON od.orderId = o.id
      WHERE o.id = @orderId
      GROUP BY o.id
    `);

    if (checkResult.recordset.length === 0) {
      throw new Error(`Đơn hàng #${orderId} không tồn tại`);
    }

    const { pendingCount, pagerId } = checkResult.recordset[0];
    if (pendingCount > 0) {
      throw new Error(
        `Đơn hàng vẫn còn ${pendingCount} món chưa pha chế xong, chưa thể rung chuông báo khách!`,
      );
    }

    // Cập nhật Order sang READY_FOR_PICKUP
    await req.query(`
      UPDATE [Order]
      SET status = 'READY_FOR_PICKUP',
          updatedAt = SYSDATETIME()
      WHERE id = @orderId
    `);

    return {
      orderId,
      status: "READY_FOR_PICKUP",
      pagerId,
      alarmTriggered: true,
      message:
        "Đã kích hoạt thẻ rung và thông báo đơn sẵn sàng để nhận đồ uống",
    };
  }
}

```

# modules\kds\kds.routes.ts

| Property | Value |
|----------|-------|
| Path | `modules\kds\kds.routes.ts` |
| Size | 1,206 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 23:29:18.094657 |

```typescript
import { Router } from 'express'
import { KDSController } from './kds.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import {
  KdsParamSchema,
  NotifyOrderReadySchema,
  QueryKdsQueueSchema,
  UpdateItemStatusSchema,
} from './kds.schema'

export const kdsRouter = Router()
const controller = new KDSController()

// Chặn toàn bộ: Yêu cầu đăng nhập và chỉ cho phép BARISTA hoặc MANAGER
kdsRouter.use(authGuard, roleGuard('BARISTA', 'MANAGER'))

// GET /api/v1/kds/queue - Xem danh sách món đang chờ pha chế
kdsRouter.get(
  '/queue',
  validatePipe(QueryKdsQueueSchema, 'query'),
  controller.getQueue
)

// PATCH /api/v1/kds/items/:orderDetailId/status - Cập nhật trạng thái ly nước (DONE kích hoạt Trigger trừ kho)
kdsRouter.patch(
  '/items/:orderDetailId/status',
  validatePipe(KdsParamSchema, 'params'),
  validatePipe(UpdateItemStatusSchema, 'body'),
  controller.updateItemStatus
)

// POST /api/v1/kds/orders/:orderId/notify-ready - Kích hoạt rung chuông thẻ rung báo khách lấy nước
kdsRouter.post(
  '/orders/:orderId/notify-ready',
  validatePipe(NotifyOrderReadySchema, 'params'),
  controller.notifyReady
)
```

# modules\kds\kds.schema.ts

| Property | Value |
|----------|-------|
| Path | `modules\kds\kds.schema.ts` |
| Size | 860 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 23:06:51.078593 |

```typescript
import { z } from 'zod'

// Query lọc màn hình KDS
export const QueryKdsQueueSchema = z.object({
  status: z.enum(['ALL', 'PENDING', 'PREPARING']).default('ALL'),
})

// Cập nhật trạng thái từng ly nước
export const UpdateItemStatusSchema = z.object({
  itemStatus: z.enum(['PREPARING', 'DONE', 'CANCELLED'], {
    errorMap: () => ({ message: 'Trạng thái món phải là PREPARING, DONE hoặc CANCELLED' }),
  }),
})

export const KdsParamSchema = z.object({
  orderDetailId: z.coerce.number().int().positive('orderDetailId không hợp lệ'),
})

export const NotifyOrderReadySchema = z.object({
  orderId: z.coerce.number().int().positive('orderId không hợp lệ'),
})

export type QueryKdsQueueType = z.infer<typeof QueryKdsQueueSchema>
export type UpdateItemStatusType = z.infer<typeof UpdateItemStatusSchema>
```

# modules\kds\kds.service.ts

| Property | Value |
|----------|-------|
| Path | `modules\kds\kds.service.ts` |
| Size | 839 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 23:07:15.306226 |

```typescript
import { KDSRepo } from './kds.repo'
import { QueryKdsQueueType, UpdateItemStatusType } from './kds.schema'

export class KDSService {
  private kdsRepo = new KDSRepo()

  async getQueue(query: QueryKdsQueueType) {
    return await this.kdsRepo.getKdsQueue(query)
  }

  async updateItemStatus(orderDetailId: number, data: UpdateItemStatusType) {
    const item = await this.kdsRepo.updateItemStatus(orderDetailId, data)
    if (!item) {
      throw new Error('Không tìm thấy dòng món trong đơn hàng')
    }
    return {
      message: `Cập nhật trạng thái món sang [${data.itemStatus}] thành công. Kho nguyên liệu đã được đồng bộ tự động.`,
      data: item,
    }
  }

  async notifyOrderReady(orderId: number) {
    return await this.kdsRepo.triggerReadyAlarm(orderId)
  }
}
```

# modules\menu-catalog\category\category.controller.ts

| Property | Value |
|----------|-------|
| Path | `modules\menu-catalog\category\category.controller.ts` |
| Size | 2,502 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:34:54.063253 |

```typescript
import { Request, Response } from 'express'
import { CategoryService } from './category.service'

export class CategoryController {
  private categoryService = new CategoryService()

  getAll = async (req: Request, res: Response) => {
    try {
      const categories = await this.categoryService.getAllCategories(req.query as any)
      res.status(200).json({ success: true, data: categories })
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Lỗi hệ thống' })
    }
  }

  getById = async (req: Request, res: Response) => {
    try {
      const category = await this.categoryService.getCategoryById(Number(req.params.id))
      res.status(200).json({ success: true, data: category })
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message || 'Danh mục không tồn tại' })
    }
  }

  create = async (req: Request, res: Response) => {
    try {
      const newCategory = await this.categoryService.createCategory(req.body)
      res.status(201).json({ success: true, data: newCategory })
    } catch (error: any) {
      const message = error.message || 'Lỗi tạo danh mục'
      const statusCode = message.includes('đã tồn tại') ? 409 : 400
      res.status(statusCode).json({ success: false, message })
    }
  }

  update = async (req: Request, res: Response) => {
    try {
      const updated = await this.categoryService.updateCategory(Number(req.params.id), req.body)
      res.status(200).json({ success: true, data: updated })
    } catch (error: any) {
      const message = error.message || 'Lỗi cập nhật danh mục'
      let statusCode = 400
      if (message.includes('không tồn tại')) statusCode = 404
      if (message.includes('đã tồn tại')) statusCode = 409

      res.status(statusCode).json({ success: false, message })
    }
  }

  delete = async (req: Request, res: Response) => {
    try {
      await this.categoryService.deleteCategory(Number(req.params.id))
      res.status(200).json({ success: true, message: 'Đã xóa danh mục thành công' })
    } catch (error: any) {
      const message = error.message || 'Lỗi xóa danh mục'
      let statusCode = 400
      if (message.includes('không tồn tại')) statusCode = 404
      if (message.includes('sản phẩm liên kết')) statusCode = 409

      res.status(statusCode).json({ success: false, message })
    }
  }
}
```

# modules\menu-catalog\category\category.repo.ts

| Property | Value |
|----------|-------|
| Path | `modules\menu-catalog\category\category.repo.ts` |
| Size | 5,045 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:34:54.065461 |

```typescript
import { getPool, sql } from '@/config/database'
import {
  CreateCategoryType,
  FilterCategoryQueryType,
  UpdateCategoryType,
} from './category.schema'

export interface Category {
  id: number
  name: string
  displayStatus: 'SHOW' | 'HIDE'
  createdAt: Date
  updatedAt?: Date | null
  deletedAt?: Date | null
}

export class CategoryRepository {
  /**
   * Lấy danh sách danh mục (hỗ trợ lọc displayStatus & tìm kiếm name)
   */
  async findAll(filters?: FilterCategoryQueryType): Promise<Category[]> {
    const pool = await getPool()
    const req = pool.request()
    const conditions: string[] = ['deletedAt IS NULL']

    const displayStatus =
      typeof filters?.displayStatus === 'string' ? filters.displayStatus : undefined
    const search =
      typeof filters?.search === 'string' ? filters.search : undefined

    if (displayStatus) {
      req.input('displayStatus', sql.NVarChar(50), displayStatus)
      conditions.push('displayStatus = @displayStatus')
    }

    if (search) {
      req.input('search', sql.NVarChar(150), `%${search}%`)
      conditions.push('name LIKE @search')
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`
    const query = `
      SELECT id, name, displayStatus, createdAt, updatedAt
      FROM Category
      ${whereClause}
      ORDER BY id ASC
    `
    const result = await req.query<Category>(query)
    return result.recordset
  }

  /**
   * Lấy chi tiết danh mục theo ID
   */
  async findById(id: number): Promise<Category | null> {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)
    const result = await req.query<Category>(`
      SELECT id, name, displayStatus, createdAt, updatedAt
      FROM Category
      WHERE id = @id AND deletedAt IS NULL
    `)
    return result.recordset[0] || null
  }

  /**
   * Tìm danh mục theo tên (hỗ trợ loại trừ ID khi update)
   */
  async findByName(name: string, excludeId?: number): Promise<Category | null> {
    const pool = await getPool()
    const req = pool.request()
    req.input('name', sql.NVarChar(150), name)

    let query = `
      SELECT id, name, displayStatus, createdAt, updatedAt
      FROM Category
      WHERE name = @name AND deletedAt IS NULL
    `

    if (excludeId) {
      req.input('excludeId', sql.Int, excludeId)
      query += ` AND id <> @excludeId`
    }

    const result = await req.query<Category>(query)
    return result.recordset[0] || null
  }

  /**
   * Đếm số lượng sản phẩm thuộc danh mục
   */
  async countProductsByCategoryId(categoryId: number): Promise<number> {
    const pool = await getPool()
    const req = pool.request()
    req.input('categoryId', sql.Int, categoryId)
    const result = await req.query<{ count: number }>(`
      SELECT COUNT(1) AS count 
      FROM Product 
      WHERE categoryId = @categoryId AND deletedAt IS NULL
    `)
    return result.recordset[0]?.count || 0
  }

  /**
   * Tạo danh mục mới
   */
  async create(data: CreateCategoryType): Promise<Category> {
    const pool = await getPool()
    const req = pool.request()
    req.input('name', sql.NVarChar(150), data.name)
    req.input('displayStatus', sql.NVarChar(50), data.displayStatus || 'SHOW')

    const result = await req.query<Category>(`
      INSERT INTO Category (name, displayStatus, createdAt)
      OUTPUT INSERTED.id, INSERTED.name, INSERTED.displayStatus, INSERTED.createdAt, INSERTED.updatedAt
      VALUES (@name, @displayStatus, SYSDATETIME())
    `)
    return result.recordset[0]
  }

  /**
   * Cập nhật thông tin danh mục
   */
  async update(id: number, data: UpdateCategoryType): Promise<Category | null> {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)

    const setClauses: string[] = ['updatedAt = SYSDATETIME()']

    if (data.name !== undefined) {
      req.input('name', sql.NVarChar(150), data.name)
      setClauses.push('name = @name')
    }
    if (data.displayStatus !== undefined) {
      req.input('displayStatus', sql.NVarChar(50), data.displayStatus)
      setClauses.push('displayStatus = @displayStatus')
    }

    const query = `
      UPDATE Category
      SET ${setClauses.join(', ')}
      OUTPUT INSERTED.id, INSERTED.name, INSERTED.displayStatus, INSERTED.createdAt, INSERTED.updatedAt
      WHERE id = @id AND deletedAt IS NULL
    `
    const result = await req.query<Category>(query)
    return result.recordset[0] || null
  }

  /**
   * Xóa mềm danh mục
   */
  async delete(id: number): Promise<boolean> {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)
    const result = await req.query(`
      UPDATE Category 
      SET deletedAt = SYSDATETIME() 
      WHERE id = @id AND deletedAt IS NULL
    `)
    return (result.rowsAffected[0] ?? 0) > 0
  }
}
```

# modules\menu-catalog\category\category.routes.ts

| Property | Value |
|----------|-------|
| Path | `modules\menu-catalog\category\category.routes.ts` |
| Size | 1,256 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:35:22.874179 |

```typescript
import { Router } from 'express'
import { CategoryController } from './category.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import {
  CategoryParamSchema,
  CreateCategorySchema,
  FilterCategoryQuerySchema,
  UpdateCategorySchema,
} from './category.schema'

export const categoryRouter = Router()
const controller = new CategoryController()

// Xem danh mục: Public cho Customer tra cứu menu và Cashier bán hàng
categoryRouter.get(
  '/',
  validatePipe(FilterCategoryQuerySchema, 'query'),
  controller.getAll
)

categoryRouter.get(
    '/:id',
    validatePipe(CategoryParamSchema, 'params'),
    controller.getById
)

// Quản lý danh mục: Yêu cầu quyền MANAGER
categoryRouter.post(
    '/',
    authGuard,
    roleGuard('MANAGER'),
    validatePipe(CreateCategorySchema, 'body'),
    controller.create
)

categoryRouter.put(
    '/:id',
    authGuard,
    roleGuard('MANAGER'),
    validatePipe(CategoryParamSchema, 'params'),
    validatePipe(UpdateCategorySchema, 'body'),
    controller.update
)

categoryRouter.delete(
    '/:id',
    authGuard,
    roleGuard('MANAGER'),
    validatePipe(CategoryParamSchema, 'params'),
    controller.delete
)
```

# modules\menu-catalog\category\category.schema.ts

| Property | Value |
|----------|-------|
| Path | `modules\menu-catalog\category\category.schema.ts` |
| Size | 1,084 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:34:54.069941 |

```typescript
import { z } from 'zod'

export const CreateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Tên danh mục không được để trống')
    .max(150, 'Tên danh mục tối đa 150 ký tự'),
  displayStatus: z.enum(['SHOW', 'HIDE']).default('SHOW'),
})

export const UpdateCategorySchema = CreateCategorySchema.partial()

export const CategoryParamSchema = z.object({
  id: z.coerce.number().int().positive('ID danh mục không hợp lệ'),
})

export const FilterCategoryQuerySchema = z.object({
  displayStatus: z.enum(['SHOW', 'HIDE']).optional(),
  search: z.string().trim().optional(),
})

export type CreateCategoryType = z.infer<typeof CreateCategorySchema>
export type UpdateCategoryType = z.infer<typeof UpdateCategorySchema>
export type CategoryParamType = z.infer<typeof CategoryParamSchema>
export type FilterCategoryQueryType = z.infer<typeof FilterCategoryQuerySchema>

// DTO aliases for compatibility
export type CreateCategoryDto = CreateCategoryType
export type UpdateCategoryDto = UpdateCategoryType
```

# modules\menu-catalog\category\category.service.ts

| Property | Value |
|----------|-------|
| Path | `modules\menu-catalog\category\category.service.ts` |
| Size | 1,631 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:34:54.071940 |

```typescript
import { CategoryRepository } from './category.repo'
import {
  CreateCategoryType,
  FilterCategoryQueryType,
  UpdateCategoryType,
} from './category.schema'

export class CategoryService {
  private categoryRepo = new CategoryRepository()

  async getAllCategories(filters?: FilterCategoryQueryType) {
    return await this.categoryRepo.findAll(filters)
  }

  async getCategoryById(id: number) {
    const category = await this.categoryRepo.findById(id)
    if (!category) {
      throw new Error('Danh mục không tồn tại')
    }
    return category
  }

  async createCategory(dto: CreateCategoryType) {
    const existing = await this.categoryRepo.findByName(dto.name)
    if (existing) {
      throw new Error('Tên danh mục đã tồn tại')
    }
    return await this.categoryRepo.create(dto)
  }

  async updateCategory(id: number, dto: UpdateCategoryType) {
    await this.getCategoryById(id)

    if (dto.name) {
      const existing = await this.categoryRepo.findByName(dto.name, id)
      if (existing) {
        throw new Error('Tên danh mục đã tồn tại')
      }
    }

    return await this.categoryRepo.update(id, dto)
  }

  async deleteCategory(id: number) {
    await this.getCategoryById(id)

    // Kiểm tra xem danh mục có đang chứa sản phẩm hay không
    const productCount = await this.categoryRepo.countProductsByCategoryId(id)
    if (productCount > 0) {
      throw new Error(`Không thể xóa danh mục đang có ${productCount} sản phẩm liên kết`)
    }

    return await this.categoryRepo.delete(id)
  }
}
```

# modules\menu-catalog\menu.routes.ts

| Property | Value |
|----------|-------|
| Path | `modules\menu-catalog\menu.routes.ts` |
| Size | 382 bytes |
| Extension | `.ts` |
| Modified | 2026-09-23 23:12:55.530424 |

```typescript
import { Router } from 'express'
import { categoryRouter } from './category/category.routes'
import { productRouter } from './product/product.routes'
import { toppingRouter } from './topping/topping.routes'

export const menuRouter = Router()
menuRouter.use('/categories', categoryRouter)
menuRouter.use('/products', productRouter)
menuRouter.use('/toppings', toppingRouter)
```

# modules\menu-catalog\product\product.controller.ts

| Property | Value |
|----------|-------|
| Path | `modules\menu-catalog\product\product.controller.ts` |
| Size | 2,651 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:34:54.074675 |

```typescript
import { Request, Response } from 'express'
import { ProductService } from './product.service'

export class ProductController {
  private productService = new ProductService()

  /**
   * Lấy danh sách sản phẩm (có lọc/tìm kiếm)
   */
  getAll = async (req: Request, res: Response) => {
    try {
      const products = await this.productService.getProducts(req.query as any)
      res.status(200).json({ success: true, data: products })
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Lỗi hệ thống' })
    }
  }

  /**
   * Lấy chi tiết sản phẩm theo ID
   */
  getById = async (req: Request, res: Response) => {
    try {
      const product = await this.productService.getProductById(Number(req.params.id))
      res.status(200).json({ success: true, data: product })
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message || 'Sản phẩm không tồn tại' })
    }
  }

  /**
   * Tạo sản phẩm mới
   */
  create = async (req: Request, res: Response) => {
    try {
      const product = await this.productService.createProduct(req.body)
      res.status(201).json({ success: true, data: product })
    } catch (error: any) {
      const message = error.message || 'Lỗi tạo sản phẩm'
      const statusCode = message.includes('đã tồn tại') ? 409 : 400
      res.status(statusCode).json({ success: false, message })
    }
  }

  /**
   * Cập nhật sản phẩm
   */
  update = async (req: Request, res: Response) => {
    try {
      const updated = await this.productService.updateProduct(Number(req.params.id), req.body)
      res.status(200).json({ success: true, data: updated })
    } catch (error: any) {
      const message = error.message || 'Lỗi cập nhật sản phẩm'
      let statusCode = 400
      if (message.includes('không tồn tại')) statusCode = 404
      if (message.includes('đã tồn tại')) statusCode = 409

      res.status(statusCode).json({ success: false, message })
    }
  }

  /**
   * Xóa mềm sản phẩm
   */
  delete = async (req: Request, res: Response) => {
    try {
      await this.productService.deleteProduct(Number(req.params.id))
      res.status(200).json({ success: true, message: 'Đã xóa sản phẩm thành công' })
    } catch (error: any) {
      const message = error.message || 'Lỗi xóa sản phẩm'
      const statusCode = message.includes('không tồn tại') ? 404 : 400
      res.status(statusCode).json({ success: false, message })
    }
  }
}
```

# modules\menu-catalog\product\product.repo.ts

| Property | Value |
|----------|-------|
| Path | `modules\menu-catalog\product\product.repo.ts` |
| Size | 10,810 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:34:54.076688 |

```typescript
import { getPool, sql } from '@/config/database'
import {
  CreateProductType,
  FilterProductQueryType,
  UpdateProductType,
} from './product.schema'

export interface ProductVariantRow {
  id: number
  productId: number
  size: 'S' | 'M' | 'L' | 'XL'
  price: number
  createdAt: Date
  updatedAt?: Date | null
}

export interface ProductDetail {
  id: number
  categoryId: number
  categoryName?: string
  name: string
  description?: string | null
  image?: string | null
  status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK'
  createdAt: Date
  updatedAt?: Date | null
  variants: ProductVariantRow[]
}

export class ProductRepository {
  /**
   * Lấy danh sách sản phẩm kèm mảng biến thể (Dùng FOR JSON PATH - 1 query duy nhất)
   */
  async findAll(filter: FilterProductQueryType): Promise<ProductDetail[]> {
    const pool = await getPool()
    const req = pool.request()

    const conditions: string[] = ['p.deletedAt IS NULL']

    if (filter.categoryId) {
      req.input('categoryId', sql.Int, filter.categoryId)
      conditions.push('p.categoryId = @categoryId')
    }

    if (filter.status) {
      req.input('status', sql.NVarChar(50), filter.status)
      conditions.push('p.status = @status')
    }

    if (filter.search) {
      req.input('search', sql.NVarChar(200), `%${filter.search}%`)
      conditions.push('p.name LIKE @search')
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`

    const query = `
      SELECT 
        p.id, 
        p.categoryId, 
        c.name AS categoryName, 
        p.name, 
        p.description, 
        p.image, 
        p.status, 
        p.createdAt, 
        p.updatedAt,
        (
          SELECT id, productId, size, price, createdAt, updatedAt
          FROM ProductVariant pv
          WHERE pv.productId = p.id AND pv.deletedAt IS NULL
          ORDER BY pv.price ASC
          FOR JSON PATH
        ) AS variantsJson
      FROM Product p
      JOIN Category c ON p.categoryId = c.id
      ${whereClause}
      ORDER BY p.id DESC
    `

    const result = await req.query<any>(query)

    return result.recordset.map((row) => ({
      id: row.id,
      categoryId: row.categoryId,
      categoryName: row.categoryName,
      name: row.name,
      description: row.description,
      image: row.image,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      variants: row.variantsJson ? JSON.parse(row.variantsJson) : [],
    }))
  }

  /**
   * Lấy chi tiết sản phẩm theo ID
   */
  async findById(id: number): Promise<ProductDetail | null> {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)

    const query = `
      SELECT 
        p.id, 
        p.categoryId, 
        c.name AS categoryName, 
        p.name, 
        p.description, 
        p.image, 
        p.status, 
        p.createdAt, 
        p.updatedAt,
        (
          SELECT id, productId, size, price, createdAt, updatedAt
          FROM ProductVariant pv
          WHERE pv.productId = p.id AND pv.deletedAt IS NULL
          ORDER BY pv.price ASC
          FOR JSON PATH
        ) AS variantsJson
      FROM Product p
      JOIN Category c ON p.categoryId = c.id
      WHERE p.id = @id AND p.deletedAt IS NULL
    `

    const result = await req.query<any>(query)
    if (result.recordset.length === 0) return null

    const row = result.recordset[0]
    return {
      id: row.id,
      categoryId: row.categoryId,
      categoryName: row.categoryName,
      name: row.name,
      description: row.description,
      image: row.image,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      variants: row.variantsJson ? JSON.parse(row.variantsJson) : [],
    }
  }

  /**
   * Tìm sản phẩm theo tên (Phục vụ check trùng tên)
   */
  async findByName(name: string, excludeId?: number): Promise<any | null> {
    const pool = await getPool()
    const req = pool.request()
    req.input('name', sql.NVarChar(200), name)

    let query = `SELECT id FROM Product WHERE name = @name AND deletedAt IS NULL`
    if (excludeId) {
      req.input('excludeId', sql.Int, excludeId)
      query += ` AND id != @excludeId`
    }

    const result = await req.query(query)
    return result.recordset[0] || null
  }

  /**
   * Tạo món mới kèm các biến thể size
   */
  async createWithVariants(data: CreateProductType): Promise<ProductDetail> {
    const pool = await getPool()
    const transaction = new sql.Transaction(pool)
    await transaction.begin()

    try {
      const productReq = new sql.Request(transaction)
      productReq.input('categoryId', sql.Int, data.categoryId)
      productReq.input('name', sql.NVarChar(200), data.name)
      productReq.input('description', sql.NVarChar(sql.MAX), data.description || null)
      productReq.input('image', sql.NVarChar(500), data.image || null)
      productReq.input('status', sql.NVarChar(50), data.status || 'ACTIVE')

      const productRes = await productReq.query(`
        INSERT INTO Product (categoryId, name, description, image, status, createdAt)
        OUTPUT INSERTED.id, INSERTED.categoryId, INSERTED.name, INSERTED.description, INSERTED.image, INSERTED.status, INSERTED.createdAt
        VALUES (@categoryId, @name, @description, @image, @status, SYSDATETIME())
      `)
      const newProduct = productRes.recordset[0]

      for (const v of data.variants) {
        const variantReq = new sql.Request(transaction)
        variantReq.input('productId', sql.Int, newProduct.id)
        variantReq.input('size', sql.NVarChar(20), v.size)
        variantReq.input('price', sql.Decimal(18, 2), v.price)

        await variantReq.query(`
          INSERT INTO ProductVariant (productId, size, price, createdAt)
          VALUES (@productId, @size, @price, SYSDATETIME())
        `)
      }

      await transaction.commit()
      return (await this.findById(newProduct.id))!
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  /**
   * Cập nhật món dùng cơ chế Smart Upsert (An toàn tuyệt đối cho Khóa ngoại)
   */
  async update(id: number, data: UpdateProductType): Promise<ProductDetail | null> {
    const pool = await getPool()
    const transaction = new sql.Transaction(pool)
    await transaction.begin()

    try {
      const updateClauses: string[] = ['updatedAt = SYSDATETIME()']
      const updateReq = new sql.Request(transaction)
      updateReq.input('id', sql.Int, id)

      if (data.categoryId !== undefined) {
        updateReq.input('categoryId', sql.Int, data.categoryId)
        updateClauses.push('categoryId = @categoryId')
      }
      if (data.name !== undefined) {
        updateReq.input('name', sql.NVarChar(200), data.name)
        updateClauses.push('name = @name')
      }
      if (data.description !== undefined) {
        updateReq.input('description', sql.NVarChar(sql.MAX), data.description)
        updateClauses.push('description = @description')
      }
      if (data.image !== undefined) {
        updateReq.input('image', sql.NVarChar(500), data.image)
        updateClauses.push('image = @image')
      }
      if (data.status !== undefined) {
        updateReq.input('status', sql.NVarChar(50), data.status)
        updateClauses.push('status = @status')
      }

      const productUpdateResult = await updateReq.query(`
        UPDATE Product
        SET ${updateClauses.join(', ')}
        WHERE id = @id AND deletedAt IS NULL
      `)

      if (productUpdateResult.rowsAffected[0] === 0) {
        await transaction.rollback()
        return null
      }

      // Smart Upsert biến thể Size
      if (data.variants && data.variants.length > 0) {
        const incomingSizes = data.variants.map((v) => v.size)

        // 1. Xóa mềm các size không còn nằm trong danh sách mới
        const softDelReq = new sql.Request(transaction)
        softDelReq.input('productId', sql.Int, id)
        const sizeParams = incomingSizes.map((s, idx) => {
          softDelReq.input(`s${idx}`, sql.NVarChar(20), s)
          return `@s${idx}`
        })

        await softDelReq.query(`
          UPDATE ProductVariant
          SET deletedAt = SYSDATETIME(), updatedAt = SYSDATETIME()
          WHERE productId = @productId 
            AND deletedAt IS NULL 
            AND size NOT IN (${sizeParams.join(',')})
        `)

        // 2. Loop qua danh sách mới: Cập nhật nếu đã có, Thêm mới nếu chưa có
        for (const v of data.variants) {
          const upsertReq = new sql.Request(transaction)
          upsertReq.input('productId', sql.Int, id)
          upsertReq.input('size', sql.NVarChar(20), v.size)
          upsertReq.input('price', sql.Decimal(18, 2), v.price)

          await upsertReq.query(`
            IF EXISTS (SELECT 1 FROM ProductVariant WHERE productId = @productId AND size = @size AND deletedAt IS NULL)
            BEGIN
              UPDATE ProductVariant 
              SET price = @price, updatedAt = SYSDATETIME()
              WHERE productId = @productId AND size = @size AND deletedAt IS NULL
            END
            ELSE IF EXISTS (SELECT 1 FROM ProductVariant WHERE productId = @productId AND size = @size AND deletedAt IS NOT NULL)
            BEGIN
              UPDATE ProductVariant 
              SET price = @price, deletedAt = NULL, updatedAt = SYSDATETIME()
              WHERE productId = @productId AND size = @size
            END
            ELSE
            BEGIN
              INSERT INTO ProductVariant (productId, size, price, createdAt)
              VALUES (@productId, @size, @price, SYSDATETIME())
            END
          `)
        }
      }

      await transaction.commit()
      return await this.findById(id)
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  /**
   * Xóa mềm Sản phẩm và toàn bộ Biến thể liên quan
   */
  async softDelete(id: number): Promise<boolean> {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)

    const result = await req.query(`
      UPDATE Product
      SET deletedAt = SYSDATETIME(), updatedAt = SYSDATETIME()
      WHERE id = @id AND deletedAt IS NULL;

      UPDATE ProductVariant
      SET deletedAt = SYSDATETIME(), updatedAt = SYSDATETIME()
      WHERE productId = @id AND deletedAt IS NULL;
    `)

    return (result.rowsAffected[0] ?? 0) > 0
  }
}
```

# modules\menu-catalog\product\product.routes.ts

| Property | Value |
|----------|-------|
| Path | `modules\menu-catalog\product\product.routes.ts` |
| Size | 1,770 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:35:12.799022 |

```typescript
import { Router } from 'express'
import { ProductController } from './product.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import {
    CreateProductSchema,
    FilterProductQuerySchema,
    ProductParamSchema,
    UpdateProductSchema,
} from './product.schema'

export const productRouter = Router()
const controller = new ProductController()

/**
 * @route   GET /api/v1/products
 * @desc    Tra cứu danh sách thực đơn (Public cho Customer & Cashier)
 */
productRouter.get(
    '/',
    validatePipe(FilterProductQuerySchema, 'query'),
    controller.getAll
)

/**
 * @route   GET /api/v1/products/:id
 * @desc    Xem chi tiết 1 sản phẩm theo ID (Public cho Customer & Cashier)
 */
productRouter.get(
    '/:id',
    validatePipe(ProductParamSchema, 'params'),
    controller.getById
)

/**
 * @route   POST /api/v1/products
 * @desc    Tạo món mới (Yêu cầu Đăng nhập & Quyền MANAGER)
 */
productRouter.post(
    '/',
    authGuard,
    roleGuard('MANAGER'),
    validatePipe(CreateProductSchema, 'body'),
    controller.create
)

/**
 * @route   PUT /api/v1/products/:id
 * @desc    Cập nhật món & biến thể Size/Giá (Yêu cầu Đăng nhập & Quyền MANAGER)
 */
productRouter.put(
    '/:id',
    authGuard,
    roleGuard('MANAGER'),
    validatePipe(ProductParamSchema, 'params'),
    validatePipe(UpdateProductSchema, 'body'),
    controller.update
)

/**
 * @route   DELETE /api/v1/products/:id
 * @desc    Xóa mềm món ăn (Yêu cầu Đăng nhập & Quyền MANAGER)
 */
productRouter.delete(
    '/:id',
    authGuard,
    roleGuard('MANAGER'),
    validatePipe(ProductParamSchema, 'params'),
    controller.delete
)
```

# modules\menu-catalog\product\product.schema.ts

| Property | Value |
|----------|-------|
| Path | `modules\menu-catalog\product\product.schema.ts` |
| Size | 2,238 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:34:54.080687 |

```typescript
import { z } from 'zod'

export const VariantItemSchema = z.object({
  size: z.enum(['S', 'M', 'L', 'XL']),
  price: z.coerce.number().min(0, 'Giá biến thể phải lớn hơn hoặc bằng 0'),
})

export const CreateProductSchema = z.object({
  categoryId: z.coerce.number().int().positive('Mã danh mục không hợp lệ'),
  name: z.string().min(1, 'Tên món không được để trống').max(200),
  description: z.string().optional().nullable(),
  image: z.string().max(500).optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK']).default('ACTIVE'),
  variants: z.array(VariantItemSchema).min(1, 'Sản phẩm phải có ít nhất 1 kích thước/biến thể'),
})

export const UpdateProductSchema = z.object({
  categoryId: z.coerce.number().int().positive('Mã danh mục không hợp lệ').optional(),
  name: z.string().min(1, 'Tên món không được để trống').max(200, 'Tên món tối đa 200 ký tự').optional(),
  description: z.string().optional().nullable(),
  image: z.string().max(500, 'Đường dẫn hình ảnh quá dài').optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK']).optional(),
  variants: z
    .array(VariantItemSchema)
    .min(1, 'Nếu cập nhật biến thể, sản phẩm phải có ít nhất 1 kích thước/biến thể')
    .optional(),
})

export const ProductParamSchema = z.object({
  id: z.coerce.number().int().positive('ID sản phẩm không hợp lệ'),
})

export const FilterProductQuerySchema = z.object({
  categoryId: z.coerce.number().int().positive().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK']).optional(),
  search: z.string().optional(),
})

export type VariantItemType = z.infer<typeof VariantItemSchema>
export type CreateProductType = z.infer<typeof CreateProductSchema>
export type UpdateProductType = z.infer<typeof UpdateProductSchema>
export type ProductParamType = z.infer<typeof ProductParamSchema>
export type FilterProductQueryType = z.infer<typeof FilterProductQuerySchema>

// DTO aliases for backwards compatibility
export type CreateProductDto = CreateProductType
export type UpdateProductDto = UpdateProductType
```

# modules\menu-catalog\product\product.service.ts

| Property | Value |
|----------|-------|
| Path | `modules\menu-catalog\product\product.service.ts` |
| Size | 1,096 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:34:54.082502 |

```typescript
import { ProductRepository } from './product.repo'
import {
  CreateProductType,
  FilterProductQueryType,
  UpdateProductType,
} from './product.schema'

export class ProductService {
  private productRepo = new ProductRepository()

  async getProducts(filter: FilterProductQueryType) {
    return await this.productRepo.findAll(filter)
  }

  async getProductById(id: number) {
    const product = await this.productRepo.findById(id)
    if (!product) throw new Error('Sản phẩm không tồn tại')
    return product
  }

  async createProduct(dto: CreateProductType) {
    const existing = await this.productRepo.findByName(dto.name)
    if (existing) throw new Error('Tên món đã tồn tại trong thực đơn')
    return await this.productRepo.createWithVariants(dto)
  }

  async updateProduct(id: number, dto: UpdateProductType) {
    await this.getProductById(id)
    return await this.productRepo.update(id, dto)
  }

  async deleteProduct(id: number) {
    await this.getProductById(id)
    return await this.productRepo.softDelete(id)
  }
}
```

# modules\menu-catalog\topping\topping.controller.ts

| Property | Value |
|----------|-------|
| Path | `modules\menu-catalog\topping\topping.controller.ts` |
| Size | 2,644 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:34:54.084430 |

```typescript
import { Request, Response } from 'express'
import { ToppingService } from './topping.service'

export class ToppingController {
  private toppingService = new ToppingService()

  /**
   * Lấy danh sách topping (hỗ trợ lọc status & tìm kiếm search)
   */
  getAll = async (req: Request, res: Response) => {
    try {
      const toppings = await this.toppingService.getAllToppings(req.query as any)
      res.status(200).json({ success: true, data: toppings })
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Lỗi hệ thống' })
    }
  }

  /**
   * Xem chi tiết 1 topping theo ID
   */
  getById = async (req: Request, res: Response) => {
    try {
      const topping = await this.toppingService.getToppingById(Number(req.params.id))
      res.status(200).json({ success: true, data: topping })
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message || 'Topping không tồn tại' })
    }
  }

  /**
   * Tạo topping mới
   */
  create = async (req: Request, res: Response) => {
    try {
      const newTopping = await this.toppingService.createTopping(req.body)
      res.status(201).json({ success: true, data: newTopping })
    } catch (error: any) {
      const message = error.message || 'Lỗi tạo topping'
      const statusCode = message.includes('đã tồn tại') ? 409 : 400
      res.status(statusCode).json({ success: false, message })
    }
  }

  /**
   * Cập nhật thông tin topping
   */
  update = async (req: Request, res: Response) => {
    try {
      const updated = await this.toppingService.updateTopping(Number(req.params.id), req.body)
      res.status(200).json({ success: true, data: updated })
    } catch (error: any) {
      const message = error.message || 'Lỗi cập nhật topping'
      let statusCode = 400
      if (message.includes('không tồn tại')) statusCode = 404
      if (message.includes('đã tồn tại')) statusCode = 409

      res.status(statusCode).json({ success: false, message })
    }
  }

  /**
   * Xóa mềm topping
   */
  delete = async (req: Request, res: Response) => {
    try {
      await this.toppingService.deleteTopping(Number(req.params.id))
      res.status(200).json({ success: true, message: 'Đã xóa topping thành công' })
    } catch (error: any) {
      const message = error.message || 'Lỗi xóa topping'
      const statusCode = message.includes('không tồn tại') ? 404 : 400
      res.status(statusCode).json({ success: false, message })
    }
  }
}
```

# modules\menu-catalog\topping\topping.repo.ts

| Property | Value |
|----------|-------|
| Path | `modules\menu-catalog\topping\topping.repo.ts` |
| Size | 4,706 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:34:54.085953 |

```typescript
import { getPool, sql } from '@/config/database'
import {
  CreateToppingType,
  FilterToppingQueryType,
  UpdateToppingType,
} from './topping.schema'

export interface Topping {
  id: number
  name: string
  price: number
  status: 'AVAILABLE' | 'UNAVAILABLE' | 'ACTIVE'
  createdAt?: Date
  updatedAt?: Date | null
  deletedAt?: Date | null
}

export class ToppingRepository {
  /**
   * Lấy danh sách topping (có lọc status và tìm kiếm name)
   */
  async findAll(filters?: FilterToppingQueryType): Promise<Topping[]> {
    const pool = await getPool()
    const req = pool.request()
    const conditions: string[] = ['deletedAt IS NULL']

    // Ép kiểu an toàn: Chỉ lấy khi đúng là chuỗi (string)
    const status = typeof filters?.status === 'string' ? filters.status : undefined
    const search = typeof filters?.search === 'string' ? filters.search : undefined

    if (status) {
      req.input('status', sql.NVarChar(50), status)
      conditions.push('status = @status')
    }

    if (search) {
      req.input('search', sql.NVarChar(150), `%${search}%`)
      conditions.push('name LIKE @search')
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`
    const query = `
    SELECT id, name, price, status, createdAt, updatedAt 
    FROM Topping 
    ${whereClause} 
    ORDER BY name ASC
  `
    const result = await req.query<Topping>(query)
    return result.recordset
  }

  /**
   * Lấy chi tiết topping theo ID
   */
  async findById(id: number): Promise<Topping | null> {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)
    const result = await req.query<Topping>(`
      SELECT id, name, price, status, createdAt, updatedAt 
      FROM Topping 
      WHERE id = @id AND deletedAt IS NULL
    `)
    return result.recordset[0] || null
  }

  /**
   * Tim topping theo tên (hỗ trợ loại trừ ID khi update)
   */
  async findByName(name: string, excludeId?: number): Promise<Topping | null> {
    const pool = await getPool()
    const req = pool.request()
    req.input('name', sql.NVarChar(150), name)

    let query = `
      SELECT id, name, price, status, createdAt, updatedAt 
      FROM Topping 
      WHERE name = @name AND deletedAt IS NULL
    `

    if (excludeId) {
      req.input('excludeId', sql.Int, excludeId)
      query += ` AND id <> @excludeId`
    }

    const result = await req.query<Topping>(query)
    return result.recordset[0] || null
  }

  /**
   * Tạo topping mới
   */
  async create(data: CreateToppingType): Promise<Topping> {
    const pool = await getPool()
    const req = pool.request()
    req.input('name', sql.NVarChar(150), data.name)
    req.input('price', sql.Decimal(18, 2), data.price)
    req.input('status', sql.NVarChar(50), data.status || 'AVAILABLE')

    const result = await req.query<Topping>(`
      INSERT INTO Topping (name, price, status, createdAt)
      OUTPUT INSERTED.id, INSERTED.name, INSERTED.price, INSERTED.status, INSERTED.createdAt, INSERTED.updatedAt
      VALUES (@name, @price, @status, SYSDATETIME())
    `)
    return result.recordset[0]
  }

  /**
   * Cập nhật thông tin topping
   */
  async update(id: number, data: UpdateToppingType): Promise<Topping | null> {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)

    const setClauses: string[] = ['updatedAt = SYSDATETIME()']

    if (data.name !== undefined) {
      req.input('name', sql.NVarChar(150), data.name)
      setClauses.push('name = @name')
    }
    if (data.price !== undefined) {
      req.input('price', sql.Decimal(18, 2), data.price)
      setClauses.push('price = @price')
    }
    if (data.status !== undefined) {
      req.input('status', sql.NVarChar(50), data.status)
      setClauses.push('status = @status')
    }

    const query = `
      UPDATE Topping
      SET ${setClauses.join(', ')}
      OUTPUT INSERTED.id, INSERTED.name, INSERTED.price, INSERTED.status, INSERTED.createdAt, INSERTED.updatedAt
      WHERE id = @id AND deletedAt IS NULL
    `
    const result = await req.query<Topping>(query)
    return result.recordset[0] || null
  }

  /**
   * Xóa mềm topping
   */
  async delete(id: number): Promise<boolean> {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)
    const result = await req.query(`
      UPDATE Topping 
      SET deletedAt = SYSDATETIME() 
      WHERE id = @id AND deletedAt IS NULL
    `)
    return (result.rowsAffected[0] ?? 0) > 0
  }
}
```

# modules\menu-catalog\topping\topping.routes.ts

| Property | Value |
|----------|-------|
| Path | `modules\menu-catalog\topping\topping.routes.ts` |
| Size | 1,735 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:35:24.357715 |

```typescript
import { Router } from 'express'
import { ToppingController } from './topping.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import {
  CreateToppingSchema,
  FilterToppingQuerySchema,
  ToppingParamSchema,
  UpdateToppingSchema,
} from './topping.schema'

export const toppingRouter = Router()
const controller = new ToppingController()

/**
 * @route   GET /api/v1/menu/toppings
 * @desc    Xem danh sách topping (Public - hỗ trợ search & filter status)
 */
toppingRouter.get(
  '/',
  validatePipe(FilterToppingQuerySchema, 'query'),
  controller.getAll
)

/**
 * @route   GET /api/v1/menu/toppings/:id
 * @desc    Xem chi tiết 1 topping theo ID (Public)
 */
toppingRouter.get(
    '/:id',
    validatePipe(ToppingParamSchema, 'params'),
    controller.getById
)

/**
 * @route   POST /api/v1/menu/toppings
 * @desc    Tạo topping mới (Yêu cầu Đăng nhập & Quyền MANAGER)
 */
toppingRouter.post(
    '/',
    authGuard,
    roleGuard('MANAGER'),
    validatePipe(CreateToppingSchema, 'body'),
    controller.create
)

/**
 * @route   PUT /api/v1/menu/toppings/:id
 * @desc    Cập nhật topping (Yêu cầu Đăng nhập & Quyền MANAGER)
 */
toppingRouter.put(
    '/:id',
    authGuard,
    roleGuard('MANAGER'),
    validatePipe(ToppingParamSchema, 'params'),
    validatePipe(UpdateToppingSchema, 'body'),
    controller.update
)

/**
 * @route   DELETE /api/v1/menu/toppings/:id
 * @desc    Xóa mềm topping (Yêu cầu Đăng nhập & Quyền MANAGER)
 */
toppingRouter.delete(
    '/:id',
    authGuard,
    roleGuard('MANAGER'),
    validatePipe(ToppingParamSchema, 'params'),
    controller.delete
)
```

# modules\menu-catalog\topping\topping.schema.ts

| Property | Value |
|----------|-------|
| Path | `modules\menu-catalog\topping\topping.schema.ts` |
| Size | 1,043 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:34:54.089948 |

```typescript
import { z } from 'zod'

export const CreateToppingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Tên topping không được để trống')
    .max(150, 'Tên topping tối đa 150 ký tự'),
  price: z.coerce.number().min(0, 'Giá topping phải lớn hơn hoặc bằng 0'),
  status: z.enum(['AVAILABLE', 'UNAVAILABLE', 'ACTIVE']).default('AVAILABLE'),
})

export const UpdateToppingSchema = CreateToppingSchema.partial()

export const ToppingParamSchema = z.object({
  id: z.coerce.number().int().positive('ID topping không hợp lệ'),
})

export const FilterToppingQuerySchema = z.object({
  status: z.enum(['AVAILABLE', 'UNAVAILABLE', 'ACTIVE']).optional(),
  search: z.string().trim().optional(),
})

export type CreateToppingType = z.infer<typeof CreateToppingSchema>
export type UpdateToppingType = z.infer<typeof UpdateToppingSchema>
export type ToppingParamType = z.infer<typeof ToppingParamSchema>
export type FilterToppingQueryType = z.infer<typeof FilterToppingQuerySchema>
```

# modules\menu-catalog\topping\topping.service.ts

| Property | Value |
|----------|-------|
| Path | `modules\menu-catalog\topping\topping.service.ts` |
| Size | 1,291 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:34:54.091948 |

```typescript
import { ToppingRepository } from './topping.repo'
import {
  CreateToppingType,
  FilterToppingQueryType,
  UpdateToppingType,
} from './topping.schema'

export class ToppingService {
  private toppingRepo = new ToppingRepository()

  async getAllToppings(filters?: FilterToppingQueryType) {
    return await this.toppingRepo.findAll(filters)
  }

  async getToppingById(id: number) {
    const topping = await this.toppingRepo.findById(id)
    if (!topping) {
      throw new Error('Topping không tồn tại')
    }
    return topping
  }

  async createTopping(dto: CreateToppingType) {
    const existing = await this.toppingRepo.findByName(dto.name)
    if (existing) {
      throw new Error('Tên topping đã tồn tại')
    }
    return await this.toppingRepo.create(dto)
  }

  async updateTopping(id: number, dto: UpdateToppingType) {
    await this.getToppingById(id)

    if (dto.name) {
      const existing = await this.toppingRepo.findByName(dto.name, id)
      if (existing) {
        throw new Error('Tên topping đã tồn tại')
      }
    }

    return await this.toppingRepo.update(id, dto)
  }

  async deleteTopping(id: number) {
    await this.getToppingById(id)
    return await this.toppingRepo.delete(id)
  }
}
```

# modules\pos-order\order\order.controller.ts

| Property | Value |
|----------|-------|
| Path | `modules\pos-order\order\order.controller.ts` |
| Size | 4,028 bytes |
| Extension | `.ts` |
| Modified | 2026-10-01 00:07:18.621152 |

```typescript
import { NextFunction, Request, Response } from "express";
import { OrderService } from "./order.service";
import {
  ApplyLoyaltyPointsSchema,
  CancelOrderSchema,
  CompletePaymentSchema,
  CreateOrderSchema,
  FilterOrderQuerySchema,
  OrderDetailParamSchema,
  OrderParamSchema,
} from "./order.schema";

export class OrderController {
  private orderService = new OrderService();

  /**
   * Lấy danh sách đơn hàng có phân trang & bộ lọc
   */
  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = FilterOrderQuerySchema.parse(req.query);
      const result = await this.orderService.getOrders(query);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Lấy thông tin chi tiết đơn hàng
   */
  detail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = OrderParamSchema.parse(req.params);
      const data = await this.orderService.getOrderById(id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Xuất hóa đơn chi tiết phục vụ in ấn từ View v_InvoiceDetails
   */
  invoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = OrderParamSchema.parse(req.params);
      const data = await this.orderService.getInvoice(id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Tạo đơn hàng mới tại quầy POS
   */
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = CreateOrderSchema.parse(req.body);
      const employeeId = req.user?.id || body.employeeId;
      const result = await this.orderService.createOrder({
        ...body,
        employeeId,
      });
      res.status(201).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Hoàn tất thanh toán đơn hàng & tích điểm
   */
  completePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = OrderParamSchema.parse(req.params);
      const body = CompletePaymentSchema.parse(req.body);
      const result = await this.orderService.completePayment(id, body);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Hủy đơn hàng & giải phóng thẻ rung
   */
  cancel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = OrderParamSchema.parse(req.params);
      const body = CancelOrderSchema.parse(req.body);
      const employeeId = req.user?.id || body.employeeId;
      const result = await this.orderService.cancelOrder(id, {
        ...body,
        employeeId,
      });
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Đổi điểm thưởng hội viên lấy chiết khấu giảm giá đơn hàng
   */
  applyPoints = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = OrderParamSchema.parse(req.params);
      const body = ApplyLoyaltyPointsSchema.parse(req.body);
      const result = await this.orderService.applyLoyaltyPoints(id, body);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Xóa một món khỏi đơn hàng chưa chế biến
   */
  removeItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { detailId } = OrderDetailParamSchema.parse(req.params);
      const result = await this.orderService.removeOrderItem(detailId);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };
}

```

# modules\pos-order\order\order.repo.ts

| Property | Value |
|----------|-------|
| Path | `modules\pos-order\order\order.repo.ts` |
| Size | 13,908 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:35:12.803831 |

```typescript
import { getPool, sql } from '@/config/database'
import {
  CreateOrderType,
  FilterOrderQueryType,
  OrderItemType,
} from './order.schema'

export class OrderRepo {
  /**
   * Khởi tạo Table-Valued Parameter (TVP) udt_OrderDetailList theo đúng schema Database
   */
  private buildOrderDetailTVP(items: OrderItemType[]): sql.Table {
    const tvp = new sql.Table('udt_OrderDetailList')
    tvp.columns.add('variantId', sql.Int, { nullable: false })
    tvp.columns.add('quantity', sql.Int, { nullable: false })
    tvp.columns.add('note', sql.NVarChar(255), { nullable: true })
    tvp.columns.add('itemSnapshotName', sql.NVarChar(200), { nullable: false })
    tvp.columns.add('sizeSnapshot', sql.NVarChar(50), { nullable: false })
    tvp.columns.add('unitPrice', sql.Decimal(18, 2), { nullable: false })
    tvp.columns.add('totalToppingPriceSnapshot', sql.Decimal(18, 2), { nullable: false })
    tvp.columns.add('totalPrice', sql.Decimal(18, 2), { nullable: false })

    for (const item of items) {
      tvp.rows.add(
        item.variantId,
        item.quantity,
        item.note || null,
        item.itemSnapshotName,
        item.sizeSnapshot,
        item.unitPrice,
        item.totalToppingPriceSnapshot ?? 0,
        item.totalPrice
      )
    }
    return tvp
  }

  /**
   * Tạo đơn hàng tại quầy thông qua Stored Procedure sp_CreateCounterOrder
   */
  async createCounterOrder(data: CreateOrderType): Promise<number> {
    const pool = await getPool()
    const request = pool.request()

    const tvp = this.buildOrderDetailTVP(data.items)

    request.input('OrderCode', sql.VarChar(64), data.orderCode)
    request.input('EmployeeId', sql.Int, data.employeeId)
    request.input('CustomerId', sql.Int, data.customerId || null)
    request.input('PagerId', sql.Int, data.pagerId || null)
    request.input('SubTotal', sql.Decimal(18, 2), data.subTotal)
    request.input('DiscountAmount', sql.Decimal(18, 2), data.discountAmount || 0)
    request.input('TotalAmount', sql.Decimal(18, 2), data.totalAmount)
    request.input('PaymentMethod', sql.NVarChar(50), data.paymentMethod)
    request.input('OrderDetails', tvp)
    request.output('NewOrderId', sql.Int)

    const result = await request.execute('sp_CreateCounterOrder')
    const newOrderId: number = result.output.NewOrderId

    // Lưu chi tiết Topping (nếu có)
    await this.saveOrderToppings(newOrderId, data.items)

    return newOrderId
  }

  /**
   * Tạo đơn hàng kết hợp cấp phát thẻ rung qua Stored Procedure sp_CreateOrderWithPager
   */
  async createOrderWithPager(data: CreateOrderType): Promise<number> {
    const pool = await getPool()
    const request = pool.request()

    const tvp = this.buildOrderDetailTVP(data.items)

    request.input('OrderCode', sql.VarChar(64), data.orderCode)
    request.input('OrderChannel', sql.NVarChar(50), data.orderChannel)
    request.input('PagerCode', sql.VarChar(50), data.pagerCode)
    request.input('EmployeeId', sql.Int, data.employeeId)
    request.input('CustomerId', sql.Int, data.customerId || null)
    request.input('SubTotal', sql.Decimal(18, 2), data.subTotal)
    request.input('DiscountAmount', sql.Decimal(18, 2), data.discountAmount || 0)
    request.input('PaymentMethod', sql.NVarChar(50), data.paymentMethod)
    request.input('OrderDetails', tvp)
    request.output('NewOrderId', sql.Int)

    const result = await request.execute('sp_CreateOrderWithPager')
    const newOrderId: number = result.output.NewOrderId

    // Lưu chi tiết Topping (nếu có)
    await this.saveOrderToppings(newOrderId, data.items)

    return newOrderId
  }

  /**
   * Lưu thông tin Topping đính kèm cho từng OrderDetail
   */
  private async saveOrderToppings(orderId: number, items: OrderItemType[]): Promise<void> {
    const hasToppings = items.some((item) => item.toppings && item.toppings.length > 0)
    if (!hasToppings) return

    const pool = await getPool()

    // Lấy danh sách orderDetailId vừa tạo của order này theo thứ tự
    const detailsRes = await pool
      .request()
      .input('orderId', sql.Int, orderId)
      .query(`SELECT id, variantId FROM OrderDetail WHERE orderId = @orderId ORDER BY id ASC`)

    const details = detailsRes.recordset

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const detailRecord = details[i]
      if (detailRecord && item.toppings && item.toppings.length > 0) {
        for (const topping of item.toppings) {
          await pool
            .request()
            .input('orderDetailId', sql.Int, detailRecord.id)
            .input('toppingId', sql.Int, topping.toppingId || null)
            .input('toppingSnapshotName', sql.NVarChar(150), topping.toppingSnapshotName)
            .input('toppingPrice', sql.Decimal(18, 2), topping.toppingPrice)
            .input('quantity', sql.Int, topping.quantity || 1)
            .query(`
              INSERT INTO OrderDetailTopping (orderDetailId, toppingId, toppingSnapshotName, toppingPrice, quantity)
              VALUES (@orderDetailId, @toppingId, @toppingSnapshotName, @toppingPrice, @quantity)
            `)
        }
      }
    }
  }

  /**
   * Hoàn tất thanh toán qua Stored Procedure sp_CompleteOrderPayment
   */
  async completeOrderPayment(orderId: number, paymentMethod: string): Promise<void> {
    const pool = await getPool()
    await pool
      .request()
      .input('OrderId', sql.Int, orderId)
      .input('PaymentMethod', sql.NVarChar(50), paymentMethod)
      .execute('sp_CompleteOrderPayment')
  }

  /**
   * Hủy đơn hàng và giải phóng thẻ rung qua Stored Procedure sp_CancelOrder
   */
  async cancelOrder(orderId: number, employeeId: number, cancelReason: string): Promise<void> {
    const pool = await getPool()
    await pool
      .request()
      .input('OrderId', sql.Int, orderId)
      .input('EmployeeId', sql.Int, employeeId)
      .input('CancelReason', sql.NVarChar(500), cancelReason)
      .execute('sp_CancelOrder')
  }

  /**
   * Áp dụng điểm thưởng hội viên để chiết khấu qua Stored Procedure sp_ApplyLoyaltyPoints
   */
  async applyLoyaltyPoints(
    orderId: number,
    customerId: number,
    pointsToRedeem: number,
    conversionRate: number = 1000
  ): Promise<void> {
    const pool = await getPool()
    await pool
      .request()
      .input('OrderId', sql.Int, orderId)
      .input('CustomerId', sql.Int, customerId)
      .input('PointsToRedeem', sql.Int, pointsToRedeem)
      .input('ConversionRate', sql.Decimal(18, 2), conversionRate)
      .execute('sp_ApplyLoyaltyPoints')
  }

  /**
   * Xóa món khỏi đơn hàng chưa chế biến qua Stored Procedure sp_RemoveOrderItem
   */
  async removeOrderItem(orderDetailId: number): Promise<void> {
    const pool = await getPool()
    await pool
      .request()
      .input('OrderDetailId', sql.Int, orderDetailId)
      .execute('sp_RemoveOrderItem')
  }

  /**
   * Kiểm tra tính khả dụng của thẻ rung thông qua Function fn_IsPagerAvailable
   */
  async isPagerAvailable(pagerId: number): Promise<boolean> {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('pagerId', sql.Int, pagerId)
      .query(`SELECT dbo.fn_IsPagerAvailable(@pagerId) AS isAvailable`)

    return result.recordset[0]?.isAvailable === true || result.recordset[0]?.isAvailable === 1
  }

  /**
   * Lấy danh sách đơn hàng có phân trang và bộ lọc
   */
  async getOrders(filter: FilterOrderQueryType) {
    const pool = await getPool()
    const request = pool.request()

    const {
      search,
      status,
      paymentMethod,
      orderChannel,
      employeeId,
      customerId,
      fromDate,
      toDate,
      page = 1,
      limit = 20,
    } = filter

    const offset = (page - 1) * limit
    const conditions: string[] = ['o.deletedAt IS NULL']

    if (search) {
      request.input('search', sql.NVarChar(150), `%${search}%`)
      conditions.push(
        '(o.orderCode LIKE @search OR c.fullName LIKE @search OR c.phoneNumber LIKE @search)'
      )
    }

    if (status) {
      request.input('status', sql.NVarChar(50), status)
      conditions.push('o.status = @status')
    }

    if (paymentMethod) {
      request.input('paymentMethod', sql.NVarChar(50), paymentMethod)
      conditions.push('o.paymentMethod = @paymentMethod')
    }

    if (orderChannel) {
      request.input('orderChannel', sql.NVarChar(50), orderChannel)
      conditions.push('o.orderChannel = @orderChannel')
    }

    if (employeeId) {
      request.input('employeeId', sql.Int, employeeId)
      conditions.push('o.employeeId = @employeeId')
    }

    if (customerId) {
      request.input('customerId', sql.Int, customerId)
      conditions.push('o.customerId = @customerId')
    }

    if (fromDate) {
      request.input('fromDate', sql.DateTime2, new Date(fromDate))
      conditions.push('o.createdAt >= @fromDate')
    }

    if (toDate) {
      request.input('toDate', sql.DateTime2, new Date(toDate))
      conditions.push('o.createdAt <= @toDate')
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`

    // Đếm tổng số bản ghi
    const countRes = await request.query(
      `SELECT COUNT(1) AS total 
       FROM [Order] o 
       LEFT JOIN Customer c ON o.customerId = c.id 
       ${whereClause}`
    )
    const totalItems = countRes.recordset[0]?.total || 0

    // Lấy dữ liệu phân trang
    request.input('offset', sql.Int, offset)
    request.input('limit', sql.Int, limit)

    const listQuery = `
      SELECT 
        o.id,
        o.orderCode,
        o.orderChannel,
        o.status,
        o.paymentMethod,
        o.subTotal,
        o.discountAmount,
        o.totalAmount,
        o.paidAt,
        o.pickupAt,
        o.cancelReason,
        o.createdAt,
        o.updatedAt,
        e.id AS employeeId,
        e.fullName AS employeeName,
        c.id AS customerId,
        c.fullName AS customerName,
        c.phoneNumber AS customerPhone,
        p.id AS pagerId,
        p.pagerCode
      FROM [Order] o
      LEFT JOIN Employee e ON o.employeeId = e.id
      LEFT JOIN Customer c ON o.customerId = c.id
      LEFT JOIN PagerDevice p ON o.pagerId = p.id
      ${whereClause}
      ORDER BY o.createdAt DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `

    const listRes = await request.query(listQuery)

    return {
      items: listRes.recordset,
      meta: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    }
  }

  /**
   * Lấy chi tiết đơn hàng (Header, Item Details, Toppings)
   */
  async getOrderById(id: number) {
    const pool = await getPool()
    const request = pool.request()
    request.input('id', sql.Int, id)

    // Lấy thông tin Header của Order
    const orderRes = await request.query(`
      SELECT 
        o.id,
        o.orderCode,
        o.orderChannel,
        o.status,
        o.paymentMethod,
        o.subTotal,
        o.discountAmount,
        o.totalAmount,
        o.paidAt,
        o.pickupAt,
        o.cancelReason,
        o.createdAt,
        o.updatedAt,
        e.id AS employeeId,
        e.fullName AS employeeName,
        c.id AS customerId,
        c.fullName AS customerName,
        c.phoneNumber AS customerPhone,
        c.membershipTier AS customerTier,
        c.rewardPoints AS customerPoints,
        p.id AS pagerId,
        p.pagerCode,
        p.status AS pagerStatus
      FROM [Order] o
      LEFT JOIN Employee e ON o.employeeId = e.id
      LEFT JOIN Customer c ON o.customerId = c.id
      LEFT JOIN PagerDevice p ON o.pagerId = p.id
      WHERE o.id = @id AND o.deletedAt IS NULL
    `)

    const order = orderRes.recordset[0]
    if (!order) return null

    // Lấy danh sách OrderDetail
    const itemsRes = await pool
      .request()
      .input('orderId', sql.Int, id)
      .query(`
        SELECT 
          od.id,
          od.variantId,
          od.quantity,
          od.note,
          od.itemSnapshotName,
          od.sizeSnapshot,
          od.unitPrice,
          od.totalToppingPriceSnapshot,
          od.totalPrice,
          od.itemStatus,
          od.createdAt
        FROM OrderDetail od
        WHERE od.orderId = @orderId
        ORDER BY od.id ASC
      `)

    const items = itemsRes.recordset

    // Lấy Topping cho từng item nếu có
    if (items.length > 0) {
      const detailIds = items.map((i: any) => i.id)
      const toppingsRes = await pool
        .request()
        .query(`
          SELECT 
            id,
            orderDetailId,
            toppingId,
            toppingSnapshotName,
            toppingPrice,
            quantity
          FROM OrderDetailTopping
          WHERE orderDetailId IN (${detailIds.join(',')})
        `)

      const toppings = toppingsRes.recordset
      for (const item of items) {
        item.toppings = toppings.filter((t: any) => t.orderDetailId === item.id)
      }
    }

    return {
      ...order,
      items,
    }
  }

  /**
   * Truy vấn thông tin chi tiết hóa đơn từ View v_InvoiceDetails
   */
  async getInvoiceDetails(orderId: number) {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('orderId', sql.Int, orderId)
      .query(`SELECT * FROM v_InvoiceDetails WHERE orderId = @orderId`)

    return result.recordset
  }
}

```

# modules\pos-order\order\order.routes.ts

| Property | Value |
|----------|-------|
| Path | `modules\pos-order\order\order.routes.ts` |
| Size | 1,009 bytes |
| Extension | `.ts` |
| Modified | 2026-10-01 00:07:18.623155 |

```typescript
import { Router } from 'express'
import { OrderController } from './order.controller'
import { authGuard, roleGuard } from '@/middlewares'

export const orderRouter = Router()
const controller = new OrderController()

// Bắt buộc đăng nhập cho các thao tác POS bán hàng
orderRouter.use(authGuard)

orderRouter.get('/', roleGuard('CASHIER', 'MANAGER'), controller.list)
orderRouter.post('/', roleGuard('CASHIER', 'MANAGER'), controller.create)
orderRouter.delete('/items/:detailId', roleGuard('CASHIER', 'MANAGER'), controller.removeItem)
orderRouter.get('/:id', roleGuard('CASHIER', 'MANAGER', 'BARISTA'), controller.detail)
orderRouter.get('/:id/invoice', roleGuard('CASHIER', 'MANAGER'), controller.invoice)
orderRouter.patch('/:id/pay', roleGuard('CASHIER', 'MANAGER'), controller.completePayment)
orderRouter.patch('/:id/cancel', roleGuard('CASHIER', 'MANAGER'), controller.cancel)
orderRouter.post('/:id/apply-points', roleGuard('CASHIER', 'MANAGER'), controller.applyPoints)
```

# modules\pos-order\order\order.schema.ts

| Property | Value |
|----------|-------|
| Path | `modules\pos-order\order\order.schema.ts` |
| Size | 4,727 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:35:12.806026 |

```typescript
import { z } from 'zod'

// 1. Schema cho Topping của món
export const OrderItemToppingSchema = z.object({
  toppingId: z.number().int().positive().optional().nullable(),
  toppingSnapshotName: z.string().min(1, 'Tên topping không được để trống').max(150),
  toppingPrice: z.number().nonnegative('Giá topping phải >= 0'),
  quantity: z.number().int().positive('Số lượng topping phải >= 1').default(1),
})

// 2. Schema cho từng món trong đơn hàng
export const OrderItemSchema = z.object({
  variantId: z.number().int().positive('ID phân loại món không hợp lệ'),
  quantity: z.number().int().positive('Số lượng món phải >= 1'),
  note: z.string().max(255, 'Ghi chú tối đa 255 ký tự').optional().nullable(),
  itemSnapshotName: z.string().min(1, 'Tên món không được để trống').max(200),
  sizeSnapshot: z.string().min(1, 'Size không được để trống').max(50),
  unitPrice: z.number().nonnegative('Đơn giá phải >= 0'),
  totalToppingPriceSnapshot: z.number().nonnegative('Tổng tiền topping phải >= 0').default(0),
  totalPrice: z.number().nonnegative('Tổng tiền món phải >= 0'),
  toppings: z.array(OrderItemToppingSchema).optional().default([]),
})

// 3. Schema tạo đơn hàng tại quầy (POS Order)
export const CreateOrderSchema = z.object({
  orderCode: z.string().max(64).optional(),
  employeeId: z.number().int().positive('ID nhân viên không hợp lệ'),
  customerId: z.number().int().positive('ID khách hàng không hợp lệ').optional().nullable(),
  pagerId: z.number().int().positive('ID thẻ rung không hợp lệ').optional().nullable(),
  pagerCode: z.string().max(50).optional().nullable(), // Mã thẻ rung nếu gán bằng mã thẻ
  orderChannel: z.enum(['ORDER_AT_COUNTER', 'TAKE_AWAY', 'DINE_IN']).default('ORDER_AT_COUNTER'),
  subTotal: z.number().nonnegative('Tạm tính phải >= 0'),
  discountAmount: z.number().nonnegative('Tiền giảm giá phải >= 0').default(0),
  totalAmount: z.number().nonnegative('Tổng tiền thanh toán phải >= 0'),
  paymentMethod: z.enum(['CASH', 'BANKING', 'MOMO', 'VNPAY', 'CREDIT_CARD', 'POINT_EXCHANGE']).default('CASH'),
  items: z.array(OrderItemSchema).min(1, 'Đơn hàng phải có ít nhất 1 món'),
})

// 4. Schema hoàn tất thanh toán
export const CompletePaymentSchema = z.object({
  paymentMethod: z.enum(['CASH', 'BANKING', 'MOMO', 'VNPAY', 'CREDIT_CARD', 'POINT_EXCHANGE'], {
    required_error: 'Phương thức thanh toán là bắt buộc',
  }),
})

// 5. Schema hủy đơn hàng
export const CancelOrderSchema = z.object({
  employeeId: z.number().int().positive('ID nhân viên hủy đơn là bắt buộc'),
  cancelReason: z.string().min(1, 'Lý do hủy đơn không được để trống').max(500, 'Lý do tối đa 500 ký tự'),
})

// 6. Schema áp dụng điểm thưởng trừ tiền
export const ApplyLoyaltyPointsSchema = z.object({
  customerId: z.number().int().positive('ID khách hàng là bắt buộc'),
  pointsToRedeem: z.number().int().positive('Số điểm đổi phải lớn hơn 0'),
  conversionRate: z.number().positive().default(1000), // Mặc định 1 điểm = 1.000 VNĐ
})

// 7. Schema Params
export const OrderParamSchema = z.object({
  id: z.coerce.number().int().positive('ID đơn hàng không hợp lệ'),
})

export const OrderDetailParamSchema = z.object({
  detailId: z.coerce.number().int().positive('ID chi tiết đơn hàng không hợp lệ'),
})

// 8. Schema Filter Query
export const FilterOrderQuerySchema = z.object({
  search: z.string().optional(), // Tìm theo orderCode, customerName, customerPhone
  status: z.enum(['PENDING_PREP', 'PREPARING', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED']).optional(),
  paymentMethod: z.string().optional(),
  orderChannel: z.string().optional(),
  employeeId: z.coerce.number().int().positive().optional(),
  customerId: z.coerce.number().int().positive().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(20),
})

export type OrderItemToppingType = z.infer<typeof OrderItemToppingSchema>
export type OrderItemType = z.infer<typeof OrderItemSchema>
export type CreateOrderType = z.infer<typeof CreateOrderSchema>
export type CompletePaymentType = z.infer<typeof CompletePaymentSchema>
export type CancelOrderType = z.infer<typeof CancelOrderSchema>
export type ApplyLoyaltyPointsType = z.infer<typeof ApplyLoyaltyPointsSchema>
export type FilterOrderQueryType = z.infer<typeof FilterOrderQuerySchema>

```

# modules\pos-order\order\order.service.ts

| Property | Value |
|----------|-------|
| Path | `modules\pos-order\order\order.service.ts` |
| Size | 6,090 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:35:12.807143 |

```typescript
import { OrderRepo } from './order.repo'
import {
  ApplyLoyaltyPointsType,
  CancelOrderType,
  CompletePaymentType,
  CreateOrderType,
  FilterOrderQueryType,
} from './order.schema'

export class OrderService {
  private orderRepo = new OrderRepo()

  /**
   * Sinh mã hóa đơn tự động chuẩn POS: ORD-YYYYMMDD-XXXX
   */
  private generateOrderCode(): string {
    const now = new Date()
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    return `ORD-${dateStr}-${randomSuffix}`
  }

  /**
   * Lấy danh sách đơn hàng có phân trang & lọc
   */
  async getOrders(filter: FilterOrderQueryType) {
    return await this.orderRepo.getOrders(filter)
  }

  /**
   * Lấy chi tiết đơn hàng theo ID
   */
  async getOrderById(id: number) {
    const order = await this.orderRepo.getOrderById(id)
    if (!order) {
      throw new Error(`Đơn hàng #${id} không tồn tại hoặc đã bị xóa`)
    }
    return order
  }

  /**
   * Lấy thông tin hóa đơn phục vụ in ấn từ View v_InvoiceDetails
   */
  async getInvoice(id: number) {
    const rows = await this.orderRepo.getInvoiceDetails(id)
    if (!rows || rows.length === 0) {
      throw new Error(`Không tìm thấy hóa đơn cho đơn hàng #${id}`)
    }

    const first = rows[0]
    return {
      orderId: first.orderId,
      orderCode: first.orderCode,
      orderChannel: first.orderChannel,
      orderStatus: first.orderStatus,
      paymentMethod: first.paymentMethod,
      subTotal: first.subTotal,
      discountAmount: first.discountAmount,
      totalAmount: first.totalAmount,
      paidAt: first.paidAt,
      orderCreatedAt: first.orderCreatedAt,
      employeeName: first.employeeName,
      customerName: first.customerName,
      customerPhone: first.customerPhone,
      items: rows.map((r: any) => ({
        orderDetailId: r.orderDetailId,
        itemSnapshotName: r.itemSnapshotName,
        sizeSnapshot: r.sizeSnapshot,
        quantity: r.quantity,
        unitPrice: r.unitPrice,
        totalToppingPriceSnapshot: r.totalToppingPriceSnapshot,
        lineTotalPrice: r.lineTotalPrice,
        itemStatus: r.itemStatus,
        itemNote: r.itemNote,
      })),
    }
  }

  /**
   * Tạo đơn hàng mới tại quầy POS
   */
  async createOrder(data: CreateOrderType) {
    // 1. Tự động sinh orderCode nếu chưa có
    if (!data.orderCode) {
      data.orderCode = this.generateOrderCode()
    }

    // 2. Kiểm tra tính khả dụng của thẻ rung nếu có gán pagerId
    if (data.pagerId) {
      const isAvailable = await this.orderRepo.isPagerAvailable(data.pagerId)
      if (!isAvailable) {
        throw new Error(`Thẻ rung #${data.pagerId} hiện không khả dụng hoặc pin < 15%`)
      }
    }

    // 3. Thực thi Stored Procedure tạo đơn
    let newOrderId: number
    if (data.pagerCode && data.pagerCode.trim().length > 0) {
      newOrderId = await this.orderRepo.createOrderWithPager(data)
    } else {
      newOrderId = await this.orderRepo.createCounterOrder(data)
    }

    // 4. Lấy lại dữ liệu đơn hàng hoàn chỉnh vừa tạo
    const createdOrder = await this.getOrderById(newOrderId)

    return {
      message: 'Tạo đơn hàng POS thành công',
      orderId: newOrderId,
      data: createdOrder,
    }
  }

  /**
   * Hoàn tất thanh toán đơn hàng & tự động tích điểm hội viên
   */
  async completePayment(orderId: number, body: CompletePaymentType) {
    const order = await this.getOrderById(orderId)
    if (order.status === 'CANCELLED') {
      throw new Error('Không thể thanh toán đơn hàng đã bị hủy')
    }
    if (order.status === 'COMPLETED' || order.paidAt) {
      throw new Error('Đơn hàng này đã được thanh toán trước đó')
    }

    await this.orderRepo.completeOrderPayment(orderId, body.paymentMethod)
    const updatedOrder = await this.getOrderById(orderId)

    return {
      message: 'Thanh toán đơn hàng thành công và đã cập nhật điểm thưởng hội viên',
      data: updatedOrder,
    }
  }

  /**
   * Hủy đơn hàng và tự động giải phóng thẻ rung
   */
  async cancelOrder(orderId: number, body: CancelOrderType) {
    const order = await this.getOrderById(orderId)
    if (order.status === 'COMPLETED' || order.paidAt) {
      throw new Error('Không thể hủy đơn hàng đã hoàn tất hoặc đã thanh toán')
    }
    if (order.status === 'CANCELLED') {
      throw new Error('Đơn hàng này đã bị hủy trước đó')
    }

    await this.orderRepo.cancelOrder(orderId, body.employeeId, body.cancelReason)
    const updatedOrder = await this.getOrderById(orderId)

    return {
      message: 'Hủy đơn hàng và giải phóng thẻ rung thành công',
      data: updatedOrder,
    }
  }

  /**
   * Áp dụng điểm thưởng hội viên để giảm giá đơn hàng
   */
  async applyLoyaltyPoints(orderId: number, body: ApplyLoyaltyPointsType) {
    const order = await this.getOrderById(orderId)
    if (order.status === 'COMPLETED' || order.status === 'CANCELLED') {
      throw new Error('Chỉ có thể áp dụng điểm thưởng cho đơn hàng đang xử lý')
    }

    await this.orderRepo.applyLoyaltyPoints(
      orderId,
      body.customerId,
      body.pointsToRedeem,
      body.conversionRate
    )

    const updatedOrder = await this.getOrderById(orderId)

    return {
      message: 'Áp dụng điểm thưởng đổi chiết khấu thành công',
      data: updatedOrder,
    }
  }

  /**
   * Xóa món khỏi đơn hàng chưa chế biến
   */
  async removeOrderItem(orderDetailId: number) {
    await this.orderRepo.removeOrderItem(orderDetailId)
    return {
      message: 'Xóa món khỏi đơn hàng thành công',
    }
  }
}

```

# modules\pos-order\pager\pager.controller.ts

| Property | Value |
|----------|-------|
| Path | `modules\pos-order\pager\pager.controller.ts` |
| Size | 4,782 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:35:12.808091 |

```typescript
import { NextFunction, Request, Response } from 'express'
import { PagerService } from './pager.service'
import {
  CreatePagerSchema,
  FilterPagerQuerySchema,
  PagerParamSchema,
  UpdateBatterySchema,
  UpdatePagerStatusSchema,
  UpdatePagerSchema,
} from './pager.schema'

export class PagerController {
  private pagerService = new PagerService()

  /**
   * GET /api/v1/pos/pagers
   * Lấy danh sách thẻ rung có phân trang & bộ lọc
   */
  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = FilterPagerQuerySchema.parse(req.query)
      const result = await this.pagerService.getPagers(query)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/v1/pos/pagers/available
   * Danh sách các thẻ rung sẵn sàng phát cho khách (AVAILABLE & Pin >= 15%)
   */
  available = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.pagerService.getAvailablePagers()
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/v1/pos/pagers/dashboard
   * Dashboard điều phối và theo dõi thời gian chờ của khách theo View v_ActivePagerDashboard
   */
  dashboard = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.pagerService.getActiveDashboard()
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/v1/pos/pagers/:id
   * Chi tiết 1 thiết bị thẻ rung
   */
  detail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = PagerParamSchema.parse(req.params)
      const data = await this.pagerService.getPagerById(id)
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/v1/pos/pagers
   * Tạo mới thiết bị thẻ rung
   */
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = CreatePagerSchema.parse(req.body)
      const result = await this.pagerService.createPager(body)
      res.status(201).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  /**
   * PUT /api/v1/pos/pagers/:id
   * Cập nhật toàn diện thông tin thẻ rung
   */
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = PagerParamSchema.parse(req.params)
      const body = UpdatePagerSchema.parse(req.body)
      const result = await this.pagerService.updatePager(id, body)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  /**
   * PATCH /api/v1/pos/pagers/:id/status
   * Cập nhật trạng thái thẻ rung (AVAILABLE, IN_USE, CHARGING, MAINTENANCE)
   */
  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = PagerParamSchema.parse(req.params)
      const body = UpdatePagerStatusSchema.parse(req.body)
      const result = await this.pagerService.updateStatus(id, body)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  /**
   * PATCH /api/v1/pos/pagers/:id/battery
   * Cập nhật mức pin thiết bị thẻ rung
   */
  updateBattery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = PagerParamSchema.parse(req.params)
      const body = UpdateBatterySchema.parse(req.body)
      const result = await this.pagerService.updateBattery(id, body)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/v1/pos/pagers/:id/release
   * Thu hồi / chuyển trạng thái thẻ rung về AVAILABLE
   */
  release = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = PagerParamSchema.parse(req.params)
      const result = await this.pagerService.releasePager(id)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  /**
   * DELETE /api/v1/pos/pagers/:id
   * Xóa mềm thiết bị thẻ rung
   */
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = PagerParamSchema.parse(req.params)
      const result = await this.pagerService.deletePager(id)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }
}

```

# modules\pos-order\pager\pager.repo.ts

| Property | Value |
|----------|-------|
| Path | `modules\pos-order\pager\pager.repo.ts` |
| Size | 8,633 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:35:12.810029 |

```typescript
import { getPool, sql } from '@/config/database'
import {
  CreatePagerType,
  FilterPagerQueryType,
  UpdatePagerType,
} from './pager.schema'

export class PagerRepo {
  /**
   * Lấy danh sách thẻ rung có phân trang và bộ lọc
   */
  async getPagers(filter: FilterPagerQueryType) {
    const pool = await getPool()
    const request = pool.request()

    const { search, status, minBattery, page = 1, limit = 20 } = filter
    const offset = (page - 1) * limit
    const conditions: string[] = ['deletedAt IS NULL']

    if (search) {
      request.input('search', sql.NVarChar(50), `%${search}%`)
      conditions.push('pagerCode LIKE @search')
    }

    if (status) {
      request.input('status', sql.NVarChar(50), status)
      conditions.push('status = @status')
    }

    if (minBattery !== undefined) {
      request.input('minBattery', sql.Int, minBattery)
      conditions.push('batteryLevel >= @minBattery')
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`

    // Đếm tổng số bản ghi
    const countRes = await request.query(
      `SELECT COUNT(1) AS total FROM PagerDevice ${whereClause}`
    )
    const totalItems = countRes.recordset[0]?.total || 0

    // Lấy dữ liệu phân trang
    request.input('offset', sql.Int, offset)
    request.input('limit', sql.Int, limit)

    const listQuery = `
      SELECT 
        id,
        pagerCode,
        status,
        batteryLevel,
        createdAt,
        updatedAt
      FROM PagerDevice
      ${whereClause}
      ORDER BY 
        CASE status 
          WHEN 'AVAILABLE' THEN 1 
          WHEN 'IN_USE' THEN 2 
          WHEN 'CHARGING' THEN 3 
          ELSE 4 
        END,
        pagerCode ASC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `

    const listRes = await request.query(listQuery)

    return {
      items: listRes.recordset,
      meta: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    }
  }

  /**
   * Lấy thông tin chi tiết thẻ rung theo ID
   */
  async getPagerById(id: number) {
    const pool = await getPool()
    const request = pool.request()

    request.input('id', sql.Int, id)
    const query = `
      SELECT 
        id,
        pagerCode,
        status,
        batteryLevel,
        createdAt,
        updatedAt
      FROM PagerDevice
      WHERE id = @id AND deletedAt IS NULL
    `
    const result = await request.query(query)
    return result.recordset[0] || null
  }

  /**
   * Tìm thẻ rung theo mã pagerCode
   */
  async getPagerByCode(pagerCode: string) {
    const pool = await getPool()
    const request = pool.request()

    request.input('pagerCode', sql.VarChar(50), pagerCode)
    const query = `
      SELECT 
        id,
        pagerCode,
        status,
        batteryLevel,
        createdAt,
        updatedAt
      FROM PagerDevice
      WHERE pagerCode = @pagerCode AND deletedAt IS NULL
    `
    const result = await request.query(query)
    return result.recordset[0] || null
  }

  /**
   * Lấy danh sách thẻ rung sẵn sàng cấp cho khách (AVAILABLE và pin >= 15%)
   */
  async getAvailablePagers() {
    const pool = await getPool()
    const query = `
      SELECT 
        id,
        pagerCode,
        status,
        batteryLevel,
        createdAt
      FROM PagerDevice
      WHERE status = 'AVAILABLE' 
        AND batteryLevel >= 15 
        AND deletedAt IS NULL
      ORDER BY batteryLevel DESC, pagerCode ASC
    `
    const result = await pool.request().query(query)
    return result.recordset
  }

  /**
   * Kiểm tra thẻ rung có khả dụng không qua Function fn_IsPagerAvailable
   */
  async isPagerAvailable(pagerId: number): Promise<boolean> {
    const pool = await getPool()
    const result = await pool
      .request()
      .input('pagerId', sql.Int, pagerId)
      .query(`SELECT dbo.fn_IsPagerAvailable(@pagerId) AS isAvailable`)

    return result.recordset[0]?.isAvailable === true || result.recordset[0]?.isAvailable === 1
  }

  /**
   * Tạo mới thiết bị thẻ rung
   */
  async createPager(data: CreatePagerType) {
    const pool = await getPool()
    const request = pool.request()

    request.input('pagerCode', sql.VarChar(50), data.pagerCode)
    request.input('status', sql.NVarChar(50), data.status)
    request.input('batteryLevel', sql.Int, data.batteryLevel)

    const query = `
      INSERT INTO PagerDevice (pagerCode, status, batteryLevel, createdAt)
      OUTPUT 
        INSERTED.id,
        INSERTED.pagerCode,
        INSERTED.status,
        INSERTED.batteryLevel,
        INSERTED.createdAt
      VALUES (@pagerCode, @status, @batteryLevel, SYSDATETIME())
    `
    const result = await request.query(query)
    return result.recordset[0]
  }

  /**
   * Cập nhật thông tin thẻ rung
   */
  async updatePager(id: number, data: UpdatePagerType) {
    const pool = await getPool()
    const request = pool.request()
    const updateFields: string[] = []

    request.input('id', sql.Int, id)

    if (data.pagerCode !== undefined) {
      request.input('pagerCode', sql.VarChar(50), data.pagerCode)
      updateFields.push('pagerCode = @pagerCode')
    }

    if (data.status !== undefined) {
      request.input('status', sql.NVarChar(50), data.status)
      updateFields.push('status = @status')
    }

    if (data.batteryLevel !== undefined) {
      request.input('batteryLevel', sql.Int, data.batteryLevel)
      updateFields.push('batteryLevel = @batteryLevel')
    }

    if (updateFields.length === 0) return null

    updateFields.push('updatedAt = SYSDATETIME()')

    const query = `
      UPDATE PagerDevice
      SET ${updateFields.join(', ')}
      OUTPUT 
        INSERTED.id,
        INSERTED.pagerCode,
        INSERTED.status,
        INSERTED.batteryLevel,
        INSERTED.updatedAt
      WHERE id = @id AND deletedAt IS NULL
    `
    const result = await request.query(query)
    return result.recordset[0] || null
  }

  /**
   * Cập nhật trạng thái thẻ rung
   */
  async updateStatus(id: number, status: string) {
    const pool = await getPool()
    const request = pool.request()

    request.input('id', sql.Int, id)
    request.input('status', sql.NVarChar(50), status)

    const query = `
      UPDATE PagerDevice
      SET status = @status, updatedAt = SYSDATETIME()
      OUTPUT 
        INSERTED.id,
        INSERTED.pagerCode,
        INSERTED.status,
        INSERTED.batteryLevel,
        INSERTED.updatedAt
      WHERE id = @id AND deletedAt IS NULL
    `
    const result = await request.query(query)
    return result.recordset[0] || null
  }

  /**
   * Cập nhật mức pin của thẻ rung
   */
  async updateBattery(id: number, batteryLevel: number) {
    const pool = await getPool()
    const request = pool.request()

    request.input('id', sql.Int, id)
    request.input('batteryLevel', sql.Int, batteryLevel)

    const query = `
      UPDATE PagerDevice
      SET batteryLevel = @batteryLevel, updatedAt = SYSDATETIME()
      OUTPUT 
        INSERTED.id,
        INSERTED.pagerCode,
        INSERTED.status,
        INSERTED.batteryLevel,
        INSERTED.updatedAt
      WHERE id = @id AND deletedAt IS NULL
    `
    const result = await request.query(query)
    return result.recordset[0] || null
  }

  /**
   * Xóa mềm thiết bị thẻ rung
   */
  async softDeletePager(id: number): Promise<boolean> {
    const pool = await getPool()
    const request = pool.request()

    request.input('id', sql.Int, id)
    const query = `
      UPDATE PagerDevice
      SET deletedAt = SYSDATETIME()
      WHERE id = @id AND deletedAt IS NULL
    `
    const result = await request.query(query)
    return result.rowsAffected[0] > 0
  }

  /**
   * Bảng điều phối theo dõi thẻ rung đang cấp cho khách từ View v_ActivePagerDashboard
   */
  async getActivePagerDashboard() {
    const pool = await getPool()
    const query = `
      SELECT 
        pagerCode,
        pagerStatus,
        batteryLevel,
        orderId,
        orderCode,
        customerName,
        customerPhone,
        waitingMinutes
      FROM v_ActivePagerDashboard
      ORDER BY waitingMinutes DESC
    `
    const result = await pool.request().query(query)
    return result.recordset
  }
}

```

# modules\pos-order\pager\pager.routes.ts

| Property | Value |
|----------|-------|
| Path | `modules\pos-order\pager\pager.routes.ts` |
| Size | 1,322 bytes |
| Extension | `.ts` |
| Modified | 2026-10-01 00:07:18.624157 |

```typescript
import { Router } from 'express'
import { PagerController } from './pager.controller'
import { authGuard, roleGuard } from '@/middlewares'

export const pagerRouter = Router()
const controller = new PagerController()

// Bắt buộc đăng nhập cho toàn bộ phân hệ Pager
pagerRouter.use(authGuard)

// Cashier và Manager được xem danh sách và dashboard
pagerRouter.get('/', roleGuard('CASHIER', 'MANAGER'), controller.list)
pagerRouter.get('/available', roleGuard('CASHIER', 'MANAGER'), controller.available)
pagerRouter.get('/dashboard', roleGuard('CASHIER', 'MANAGER', 'BARISTA'), controller.dashboard)
pagerRouter.get('/:id', roleGuard('CASHIER', 'MANAGER'), controller.detail)

// Thu hồi thẻ rung: Thu ngân hoặc Pha chế
pagerRouter.post('/:id/release', roleGuard('CASHIER', 'BARISTA', 'MANAGER'), controller.release)
pagerRouter.patch('/:id/battery', roleGuard('CASHIER', 'BARISTA', 'MANAGER'), controller.updateBattery)
pagerRouter.patch('/:id/status', roleGuard('CASHIER', 'MANAGER'), controller.updateStatus)

// Cấu hình thêm mới / xóa thẻ rung: Chỉ MANAGER
pagerRouter.post('/', roleGuard('MANAGER'), controller.create)
pagerRouter.put('/:id', roleGuard('MANAGER'), controller.update)
pagerRouter.delete('/:id', roleGuard('MANAGER'), controller.delete)
```

# modules\pos-order\pager\pager.schema.ts

| Property | Value |
|----------|-------|
| Path | `modules\pos-order\pager\pager.schema.ts` |
| Size | 2,397 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:35:12.812675 |

```typescript
import { z } from 'zod'

// 1. Schema trạng thái thẻ rung
export const PagerStatusEnum = z.enum(['AVAILABLE', 'IN_USE', 'CHARGING', 'MAINTENANCE'])

// 2. Schema tạo mới thiết bị thẻ rung
export const CreatePagerSchema = z.object({
  pagerCode: z
    .string()
    .min(1, 'Mã thẻ rung không được để trống')
    .max(50, 'Mã thẻ rung tối đa 50 ký tự'),
  status: PagerStatusEnum.default('AVAILABLE'),
  batteryLevel: z
    .number()
    .int('Mức pin phải là số nguyên')
    .min(0, 'Mức pin tối thiểu 0%')
    .max(100, 'Mức pin tối đa 100%')
    .default(100),
})

// 3. Schema cập nhật thông tin thiết bị thẻ rung
export const UpdatePagerSchema = z.object({
  pagerCode: z.string().min(1, 'Mã thẻ rung không được để trống').max(50).optional(),
  status: PagerStatusEnum.optional(),
  batteryLevel: z
    .number()
    .int('Mức pin phải là số nguyên')
    .min(0, 'Mức pin tối thiểu 0%')
    .max(100, 'Mức pin tối đa 100%')
    .optional(),
})

// 4. Schema cập nhật nhanh trạng thái thẻ
export const UpdatePagerStatusSchema = z.object({
  status: PagerStatusEnum,
})

// 5. Schema cập nhật mức pin
export const UpdateBatterySchema = z.object({
  batteryLevel: z
    .number()
    .int('Mức pin phải là số nguyên')
    .min(0, 'Mức pin tối thiểu 0%')
    .max(100, 'Mức pin tối đa 100%'),
})

// 6. Schema Params
export const PagerParamSchema = z.object({
  id: z.coerce.number().int().positive('ID thẻ rung không hợp lệ'),
})

// 7. Schema Filter Query
export const FilterPagerQuerySchema = z.object({
  search: z.string().optional(), // Tìm theo pagerCode
  status: PagerStatusEnum.optional(),
  minBattery: z.coerce.number().int().min(0).max(100).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(20),
})

export type PagerStatusType = z.infer<typeof PagerStatusEnum>
export type CreatePagerType = z.infer<typeof CreatePagerSchema>
export type UpdatePagerType = z.infer<typeof UpdatePagerSchema>
export type UpdatePagerStatusType = z.infer<typeof UpdatePagerStatusSchema>
export type UpdateBatteryType = z.infer<typeof UpdateBatterySchema>
export type FilterPagerQueryType = z.infer<typeof FilterPagerQuerySchema>

```

# modules\pos-order\pager\pager.service.ts

| Property | Value |
|----------|-------|
| Path | `modules\pos-order\pager\pager.service.ts` |
| Size | 4,040 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:35:12.814081 |

```typescript
import { PagerRepo } from './pager.repo'
import {
  CreatePagerType,
  FilterPagerQueryType,
  UpdateBatteryType,
  UpdatePagerStatusType,
  UpdatePagerType,
} from './pager.schema'

export class PagerService {
  private pagerRepo = new PagerRepo()

  /**
   * Lấy danh sách thẻ rung có phân trang & lọc
   */
  async getPagers(filter: FilterPagerQueryType) {
    return await this.pagerRepo.getPagers(filter)
  }

  /**
   * Lấy thông tin chi tiết thẻ rung theo ID
   */
  async getPagerById(id: number) {
    const pager = await this.pagerRepo.getPagerById(id)
    if (!pager) {
      throw new Error(`Thẻ rung #${id} không tồn tại hoặc đã bị xóa`)
    }
    return pager
  }

  /**
   * Lấy danh sách thẻ rung đang sẵn sàng phục vụ khách
   */
  async getAvailablePagers() {
    return await this.pagerRepo.getAvailablePagers()
  }

  /**
   * Bảng điều phối theo dõi thời gian chờ của các thẻ đang phát cho khách
   */
  async getActiveDashboard() {
    return await this.pagerRepo.getActivePagerDashboard()
  }

  /**
   * Tạo mới thiết bị thẻ rung
   */
  async createPager(data: CreatePagerType) {
    const existing = await this.pagerRepo.getPagerByCode(data.pagerCode)
    if (existing) {
      throw new Error(`Mã thẻ rung '${data.pagerCode}' đã tồn tại trên hệ thống`)
    }

    const created = await this.pagerRepo.createPager(data)
    return {
      message: 'Thêm thiết bị thẻ rung thành công',
      data: created,
    }
  }

  /**
   * Cập nhật thông tin thẻ rung
   */
  async updatePager(id: number, data: UpdatePagerType) {
    await this.getPagerById(id)

    if (data.pagerCode) {
      const existing = await this.pagerRepo.getPagerByCode(data.pagerCode)
      if (existing && existing.id !== id) {
        throw new Error(`Mã thẻ rung '${data.pagerCode}' đã được sử dụng cho thiết bị khác`)
      }
    }

    const updated = await this.pagerRepo.updatePager(id, data)
    return {
      message: 'Cập nhật thông tin thẻ rung thành công',
      data: updated,
    }
  }

  /**
   * Cập nhật trạng thái thẻ rung (AVAILABLE, IN_USE, CHARGING, MAINTENANCE)
   */
  async updateStatus(id: number, body: UpdatePagerStatusType) {
    await this.getPagerById(id)
    const updated = await this.pagerRepo.updateStatus(id, body.status)
    return {
      message: `Cập nhật trạng thái thẻ rung thành '${body.status}' thành công`,
      data: updated,
    }
  }

  /**
   * Cập nhật mức pin của thẻ rung
   */
  async updateBattery(id: number, body: UpdateBatteryType) {
    const pager = await this.getPagerById(id)

    // Nếu pin dưới 15% mà đang để AVAILABLE, có thể tự động cảnh báo
    const updated = await this.pagerRepo.updateBattery(id, body.batteryLevel)

    return {
      message: `Cập nhật mức pin (${body.batteryLevel}%) thành công`,
      data: updated,
    }
  }

  /**
   * Thu hồi / giải phóng thẻ rung về trạng thái AVAILABLE khi khách trả thẻ
   */
  async releasePager(id: number) {
    await this.getPagerById(id)
    const updated = await this.pagerRepo.updateStatus(id, 'AVAILABLE')
    return {
      message: 'Đã thu hồi và chuyển trạng thái thẻ rung về AVAILABLE',
      data: updated,
    }
  }

  /**
   * Xóa mềm thiết bị thẻ rung
   */
  async deletePager(id: number) {
    const pager = await this.getPagerById(id)

    if (pager.status === 'IN_USE') {
      throw new Error('Không thể xóa thẻ rung đang được gán cho đơn hàng chưa hoàn tất!')
    }

    const success = await this.pagerRepo.softDeletePager(id)
    if (!success) {
      throw new Error('Xóa thiết bị thẻ rung thất bại')
    }

    return {
      message: `Đã xóa thiết bị thẻ rung #${id} thành công`,
    }
  }
}

```

# modules\pos-order\pos.routes.ts

| Property | Value |
|----------|-------|
| Path | `modules\pos-order\pos.routes.ts` |
| Size | 251 bytes |
| Extension | `.ts` |
| Modified | 2026-09-23 23:12:46.240593 |

```typescript
import { Router } from 'express'
import { orderRouter } from './order/order.routes'
import { pagerRouter } from './pager/pager.routes'

export const posRouter = Router()
posRouter.use('/orders', orderRouter)
posRouter.use('/pagers', pagerRouter)
```

# modules\report\report.controller.ts

| Property | Value |
|----------|-------|
| Path | `modules\report\report.controller.ts` |
| Size | 1,316 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.254531 |

```typescript
import { Request, Response, NextFunction } from 'express'
import { ReportService } from './report.service'
import { DateRangeReportSchema, TopProductsQuerySchema } from './report.schema'

export class ReportController {
    private reportService = new ReportService()

    getRevenue = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = DateRangeReportSchema.parse(req.query)
            const data = await this.reportService.getRevenueOverview(query)
            res.status(200).json({ success: true, data })
        } catch (error) {
            next(error)
        }
    }

    getTopProducts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = TopProductsQuerySchema.parse(req.query)
            const data = await this.reportService.getTopSellingProducts(query)
            res.status(200).json({ success: true, data })
        } catch (error) {
            next(error)
        }
    }

    getLowStock = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.reportService.getLowStockAlert()
            res.status(200).json({ success: true, data })
        } catch (error) {
            next(error)
        }
    }
}
```

# modules\report\report.repo.ts

| Property | Value |
|----------|-------|
| Path | `modules\report\report.repo.ts` |
| Size | 3,184 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 23:05:19.726075 |

```typescript
import { getPool, sql } from '@/config/database'
import { DateRangeReportType, TopProductsQueryType } from './report.schema'

export class ReportRepo {
  // Thống kê tổng quan: Doanh thu, số đơn, số tiền giảm giá
  // Sử dụng View v_DailyRevenue và Function fn_GetTotalRevenue
  async getOverviewRevenue(filter: DateRangeReportType) {
    const pool = await getPool()
    const request = pool.request()

    const conditions: string[] = ['1=1']

    if (filter.fromDate) {
      request.input('fromDate', sql.DateTime2, filter.fromDate)
      conditions.push('revenueDate >= CAST(@fromDate AS DATE)')
    }

    if (filter.toDate) {
      request.input('toDate', sql.DateTime2, filter.toDate)
      conditions.push('revenueDate <= CAST(@toDate AS DATE)')
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`

    let netRevenueExpr = 'ISNULL(SUM(totalNetRevenue), 0)'
    if (filter.fromDate && filter.toDate) {
      netRevenueExpr = 'ISNULL(dbo.fn_GetTotalRevenue(@fromDate, @toDate), 0)'
    }

    const query = `
      SELECT
        ISNULL(SUM(totalOrders), 0) AS totalOrders,
        ISNULL(SUM(totalOriginalAmount), 0) AS totalSubTotal,
        ISNULL(SUM(totalDiscountAmount), 0) AS totalDiscount,
        ${netRevenueExpr} AS netRevenue
      FROM v_DailyRevenue
      ${whereClause}
    `

    const result = await request.query(query)

    return result.recordset[0]
  }

  // Top sản phẩm bán chạy nhất
  // Sử dụng Function fn_GetTopSellingProducts (nếu có từ ngày/đến ngày) hoặc View v_TopSellingProducts
  async getTopSellingProducts(filter: TopProductsQueryType) {
    const pool = await getPool()
    const request = pool.request()

    request.input('topLimit', sql.Int, filter.limit)

    let query: string

    if (filter.fromDate && filter.toDate) {
      request.input('fromDate', sql.DateTime2, filter.fromDate)
      request.input('toDate', sql.DateTime2, filter.toDate)

      query = `
        SELECT
          productName,
          totalQuantitySold,
          totalRevenue
        FROM dbo.fn_GetTopSellingProducts(@topLimit, @fromDate, @toDate)
        ORDER BY totalQuantitySold DESC, totalRevenue DESC
      `
    } else {
      query = `
        SELECT TOP (@topLimit)
          productName,
          totalQuantitySold,
          totalRevenue
        FROM v_TopSellingProducts
        ORDER BY totalQuantitySold DESC, totalRevenue DESC
      `
    }

    const result = await request.query(query)

    return result.recordset
  }

  // Cảnh báo nguyên vật liệu sắp chạm hoặc dưới ngưỡng tối thiểu
  // Sử dụng View v_LowStockIngredients
  async getLowStockIngredients() {
    const pool = await getPool()
    const request = pool.request()

    const query = `
      SELECT
        id,
        name,
        unit,
        stockQuantity,
        minimumThreshold,
        ABS(chenhLech) AS shortageAmount
      FROM v_LowStockIngredients
      ORDER BY stockQuantity ASC
    `

    const result = await request.query(query)

    return result.recordset
  }
}
```

# modules\report\report.routes.ts

| Property | Value |
|----------|-------|
| Path | `modules\report\report.routes.ts` |
| Size | 961 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 23:29:27.378512 |

```typescript
import { Router } from 'express'
import { ReportController } from './report.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import { DateRangeReportSchema, TopProductsQuerySchema } from './report.schema'

export const reportRouter = Router()
const controller = new ReportController()

// Chặn toàn bộ: Chỉ MANAGER và ADMIN
reportRouter.use(authGuard, roleGuard('MANAGER'))

// GET /api/v1/reports/revenue - Thống kê doanh thu theo khoảng ngày
reportRouter.get(
  '/revenue',
  validatePipe(DateRangeReportSchema, 'query'),
  controller.getRevenue
)

// GET /api/v1/reports/top-products - Báo cáo top món bán chạy nhất
reportRouter.get(
  '/top-products',
  validatePipe(TopProductsQuerySchema, 'query'),
  controller.getTopProducts
)

// GET /api/v1/reports/low-stock - Cảnh báo nguyên liệu sắp hết trong kho
reportRouter.get(
  '/low-stock',
  controller.getLowStock
)
```

# modules\report\report.schema.ts

| Property | Value |
|----------|-------|
| Path | `modules\report\report.schema.ts` |
| Size | 1,101 bytes |
| Extension | `.ts` |
| Modified | 2026-09-30 19:17:55.082006 |

```typescript
import { z } from 'zod'

const BaseDateRangeSchema = z.object({
    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional(),
})

export const DateRangeReportSchema = BaseDateRangeSchema.refine(
    data => {
        if (data.fromDate && data.toDate) {
            return data.fromDate <= data.toDate
        }

        return true
    },
    {
        message: 'fromDate must be less than or equal to toDate',
        path: ['toDate'],
    },
)

export const TopProductsQuerySchema = BaseDateRangeSchema.extend({
    limit: z.coerce
        .number()
        .int()
        .positive()
        .max(100)
        .default(5),
}).refine(
    data => {
        if (data.fromDate && data.toDate) {
            return data.fromDate <= data.toDate
        }

        return true
    },
    {
        message: 'fromDate must be less than or equal to toDate',
        path: ['toDate'],
    },
)

export type DateRangeReportType = z.infer<typeof DateRangeReportSchema>

export type TopProductsQueryType = z.infer<typeof TopProductsQuerySchema>

```

# modules\report\report.service.ts

| Property | Value |
|----------|-------|
| Path | `modules\report\report.service.ts` |
| Size | 578 bytes |
| Extension | `.ts` |
| Modified | 2026-09-29 22:42:20.259532 |

```typescript
import { ReportRepo } from './report.repo'
import { DateRangeReportType, TopProductsQueryType } from './report.schema'

export class ReportService {
    private reportRepo = new ReportRepo()

    async getRevenueOverview(filter: DateRangeReportType) {
        return await this.reportRepo.getOverviewRevenue(filter)
    }

    async getTopSellingProducts(filter: TopProductsQueryType) {
        return await this.reportRepo.getTopSellingProducts(filter)
    }

    async getLowStockAlert() {
        return await this.reportRepo.getLowStockIngredients()
    }
}
```

# server.ts

| Property | Value |
|----------|-------|
| Path | `server.ts` |
| Size | 1,138 bytes |
| Extension | `.ts` |
| Modified | 2026-09-23 23:11:59.078225 |

```typescript
import { createServer } from 'http'
import { createApp } from './app'
import { envConfig } from './config/env.config'
import { getPool, closePool } from './config/database'

async function bootstrap() {
  // 1. Đảm bảo kết nối SQL Server sẵn sàng trước khi lắng nghe request
  await getPool()

  const app = createApp()
  const server = createServer(app)

  server.listen(envConfig.PORT, () => {
    console.log(`🚀 CoffeeShop Backend Server đang chạy tại: http://localhost:${envConfig.PORT}`)
  })

  // 2. Xử lý tắt server sạch sẽ khi nhấn Ctrl + C
  const handleShutdown = async (signal: string) => {
    console.log(`\nNhận tín hiệu ${signal}. Đang đóng ứng dụng...`)
    server.close(async () => {
      console.log('HTTP Server đã đóng tiếp nhận request mới.')
      await closePool()
      process.exit(0)
    })
  }

  process.on('SIGINT', () => handleShutdown('SIGINT'))
  process.on('SIGTERM', () => handleShutdown('SIGTERM'))
}

bootstrap().catch((err) => {
  console.error('Không thể khởi chạy Server:', err)
  process.exit(1)
})
```

