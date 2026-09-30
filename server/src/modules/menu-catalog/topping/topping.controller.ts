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