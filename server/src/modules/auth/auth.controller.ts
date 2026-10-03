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