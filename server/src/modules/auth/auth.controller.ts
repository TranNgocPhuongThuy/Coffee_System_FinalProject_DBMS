import { Request, Response, NextFunction } from 'express'
import { AuthService } from './auth.service'
import {
  ChangePasswordBodySchema,
  CreateEmployeeBodySchema,
  LoginBodySchema,
  RegisterBodySchema,
  UpdateEmployeeRoleBodySchema,
} from './auth.schema'

export class AuthController {
  private authService = new AuthService()

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = RegisterBodySchema.parse(req.body);
      const result = await this.authService.register(body);
      res.status(201).json({
        success: true,
        message: result.message,
        data: {
          accessToken: result.accessToken,
          user: result.user,
        },
      });
    } catch (error: any) {
      res.status(error.statusCode || 400).json({
        success: false,
        message: error.message || 'Đăng ký thất bại',
      });
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = LoginBodySchema.parse(req.body)
      const result = await this.authService.login(body)
      res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công',
        data: result,
      })
    } catch (error: any) {
      res.status(error.statusCode || 401).json({
        success: false,
        message: error.message || 'Xác thực thất bại',
      })
    }
  }

  createEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = CreateEmployeeBodySchema.parse(req.body)
      const result = await this.authService.createEmployee(body)
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

  setEmployeeRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id)
      const body = UpdateEmployeeRoleBodySchema.parse(req.body)
      const result = await this.authService.setEmployeeRole(id, body)
      res.status(200).json({
        success: true,
        message: 'Cập nhật quyền nhân viên thành công',
        data: result,
      })
    } catch (error: any) {
      res.status(error.statusCode || 400).json({
        success: false,
        message: error.message || 'Cập nhật quyền thất bại',
      })
    }
  }

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = ChangePasswordBodySchema.parse(req.body)
      const user = req.user!
      const result = await this.authService.changePassword(user.id, user.userType, body)
      res.status(200).json({ success: true, ...result })
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ success: false, message: error.message })
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

  logout = async (_req: Request, res: Response) => {
    res.status(200).json({ success: true, message: 'Đăng xuất thành công' })
  }
}