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

  /**
   * Lấy danh mục thực đơn đầy đủ từ View v_MenuProductCatalog
   */
  getCatalog = async (req: Request, res: Response) => {
    try {
      const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined
      const catalog = await this.productService.getMenuCatalog(categoryId)
      res.status(200).json({ success: true, data: catalog })
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Lỗi hệ thống khi tải thực đơn' })
    }
  }
}
