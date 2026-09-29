import { Request, Response } from 'express';
import { CategoryService } from './category.service';
import { createCategorySchema, updateCategorySchema } from './category.schema';

export class CategoryController {
  private categoryService = new CategoryService();

  getAll = async (req: Request, res: Response) => {
    try {
      const categories = await this.categoryService.getAllCategories();
      res.status(200).json({ success: true, data: categories });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const category = await this.categoryService.getCategoryById(req.params.id);
      res.status(200).json({ success: true, data: category });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const validated = createCategorySchema.parse(req.body);
      const newCategory = await this.categoryService.createCategory(validated);
      res.status(201).json({ success: true, data: newCategory });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || error.errors });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const validated = updateCategorySchema.parse(req.body);
      const updated = await this.categoryService.updateCategory(req.params.id, validated);
      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || error.errors });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.categoryService.deleteCategory(req.params.id);
      res.status(200).json({ success: true, message: 'Xóa danh mục thành công' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}