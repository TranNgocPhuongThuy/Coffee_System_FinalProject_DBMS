import { Request, Response } from 'express';
import { ToppingService } from './topping.service';
import { createToppingSchema, updateToppingSchema } from './topping.schema';

export class ToppingController {
  private toppingService = new ToppingService();

  getAll = async (req: Request, res: Response) => {
    try {
      const data = await this.toppingService.getAllToppings();
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const data = await this.toppingService.getToppingById(req.params.id);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const validated = createToppingSchema.parse(req.body);
      const data = await this.toppingService.createTopping(validated);
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || error.errors });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const validated = updateToppingSchema.parse(req.body);
      const data = await this.toppingService.updateTopping(req.params.id, validated);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || error.errors });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.toppingService.deleteTopping(req.params.id);
      res.status(200).json({ success: true, message: 'Đã xóa topping thành công' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}