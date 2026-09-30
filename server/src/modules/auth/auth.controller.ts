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