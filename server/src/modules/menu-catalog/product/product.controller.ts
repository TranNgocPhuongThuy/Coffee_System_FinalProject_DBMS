import { Request, Response } from 'express'
import { ProductService } from './product.service'

export class ProductController {
  private productService = new ProductService()

  getAll = async (req: Request, res: Response) => {
    try {
      // req.query đã được validatePipe(FilterProductQuerySchema, 'query') xử lý
      const products = await this.productService.getProducts(req.query as any)
      res.status(200).json({ success: true, data: products })
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message })
    }
  }

  getById = async (req: Request, res: Response) => {
    try {
      const product = await this.productService.getProductById(Number(req.params.id))
      res.status(200).json({ success: true, data: product })
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message })
    }
  }

  create = async (req: Request, res: Response) => {
    try {
      // req.body đã được validatePipe(CreateProductSchema, 'body') xử lý
      const product = await this.productService.createProduct(req.body)
      res.status(201).json({ success: true, data: product })
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || error.errors })
    }
  }

  update = async (req: Request, res: Response) => {
    try {
      // req.body đã được validatePipe(UpdateProductSchema, 'body') xử lý
      const updated = await this.productService.updateProduct(Number(req.params.id), req.body)
      res.status(200).json({ success: true, data: updated })
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || error.errors })
    }
  }

  delete = async (req: Request, res: Response) => {
    try {
      await this.productService.deleteProduct(Number(req.params.id))
      res.status(200).json({ success: true, message: 'Đã xóa sản phẩm thành công' })
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message })
    }
  }
}