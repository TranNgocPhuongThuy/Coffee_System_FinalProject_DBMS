import { Router } from 'express'
import { AuthController } from './auth.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import {
  ChangePasswordBodySchema,
  CreateEmployeeBodySchema,
  LoginBodySchema,
  RegisterBodySchema,
  UpdateEmployeeRoleBodySchema,
} from './auth.schema'

export const authRouter = Router()
const controller = new AuthController()

// --- Public Endpoints ---
// 1. Đăng ký khách hàng duy nhất
authRouter.post('/register', validatePipe(RegisterBodySchema, 'body'), controller.register)

// 2. Đăng nhập chung không cần userType
authRouter.post('/login', validatePipe(LoginBodySchema, 'body'), controller.login)

// --- Authenticated Endpoints ---
authRouter.get('/me', authGuard, controller.getMe)
authRouter.post('/logout', authGuard, controller.logout)
authRouter.post('/change-password', authGuard, validatePipe(ChangePasswordBodySchema, 'body'), controller.changePassword)

// --- Dashboard Admin / Manager Management Endpoints ---
// 3. Quản lý tạo tài khoản nhân viên
authRouter.post(
  '/employees',
  authGuard,
  roleGuard('ADMIN', 'MANAGER'),
  validatePipe(CreateEmployeeBodySchema, 'body'),
  controller.createEmployee
)

// 4. Quản lý cập nhật vai trò (Role) cho nhân viên
authRouter.patch(
  '/employees/:id/role',
  authGuard,
  roleGuard('ADMIN', 'MANAGER'),
  validatePipe(UpdateEmployeeRoleBodySchema, 'body'),
  controller.setEmployeeRole
)