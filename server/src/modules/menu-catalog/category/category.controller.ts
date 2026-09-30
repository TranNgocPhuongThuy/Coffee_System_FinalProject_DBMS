import { Request, Response } from 'express'
import { CategoryService } from './category.service'

export class CategoryController {
  private categoryService = new CategoryService()

  getAll = async (req: Request, res: Response) => {
    try {
      const categories = await this.categoryService.getAllCategories()
      res.status(200).json({ success: true, data: categories })
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message })
    }
  }

  getById = async (req: Request, res: Response) => {
    try {
      const category = await this.categoryService.getCategoryById(Number(req.params.id))
      res.status(200).json({ success: true, data: category })
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message })
    }
  }

  create = async (req: Request, res: Response) => {
    try {
      const newCategory = await this.categoryService.createCategory(req.body)
      res.status(201).json({ success: true, data: newCategory })
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || error.errors })
    }
  }

  update = async (req: Request, res: Response) => {
    try {
      const updated = await this.categoryService.updateCategory(Number(req.params.id), req.body)
      res.status(200).json({ success: true, data: updated })
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || error.errors })
    }
  }

  delete = async (req: Request, res: Response) => {
    try {
      await this.categoryService.deleteCategory(Number(req.params.id))
      res.status(200).json({ success: true, message: 'Xóa danh mục thành công' })
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message })
    }
  }
}