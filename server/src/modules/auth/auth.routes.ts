import { Router } from 'express'
import { AuthController } from './auth.controller'
import { authGuard, validatePipe } from '@/middlewares'
import { ChangePasswordBodySchema, LoginBodySchema, SetupPasswordBodySchema } from './auth.schema'
import { RegisterCustomerBodySchema } from './auth.schema'

export const authRouter = Router()
const controller = new AuthController()

// Public
authRouter.post('/login', validatePipe(LoginBodySchema, 'body'), controller.login)
authRouter.post('/register', validatePipe(RegisterCustomerBodySchema, 'body'), controller.register)
authRouter.post('/setup-password', validatePipe(SetupPasswordBodySchema, 'body'), controller.setupPassword)

// Yêu cầu đăng nhập
authRouter.get('/me', authGuard, controller.getMe)
authRouter.post('/change-password', authGuard, validatePipe(ChangePasswordBodySchema, 'body'), controller.changePassword)