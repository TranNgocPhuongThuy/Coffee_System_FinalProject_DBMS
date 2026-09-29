import { Request, Response } from 'express';
import { ProductService } from './product.service';
import { createProductSchema } from './product.schema';

export class ProductController {
  private productService = new ProductService();

  getAll = async (req: Request, res: Response) => {
    try {
      const categoryId = req.query.categoryId as string;
      const isAvailable = req.query.isAvailable !== undefined ? req.query.isAvailable === 'true' : undefined;
      const products = await this.productService.getProducts(categoryId, isAvailable);
      res.status(200).json({ success: true, data: products });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const product = await this.productService.getProductById(req.params.id);
      res.status(200).json({ success: true, data: product });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const validated = createProductSchema.parse(req.body);
      const product = await this.productService.createProduct(validated);
      res.status(201).json({ success: true, data: product });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || error.errors });
    }
  };

  toggleAvailability = async (req: Request, res: Response) => {
    try {
      const { isAvailable } = req.body;
      const updated = await this.productService.toggleAvailability(req.params.id, Boolean(isAvailable));
      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.productService.deleteProduct(req.params.id);
      res.status(200).json({ success: true, message: 'Đã xóa sản phẩm' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}