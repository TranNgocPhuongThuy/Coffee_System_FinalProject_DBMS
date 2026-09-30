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