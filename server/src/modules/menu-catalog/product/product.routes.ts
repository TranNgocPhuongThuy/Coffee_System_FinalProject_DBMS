import { Router } from 'express';
import { ProductController } from './product.controller';

export const productRouter = Router(); // Đổi từ const router sang export const productRouter
const controller = new ProductController();

productRouter.get('/', controller.getAll);
productRouter.get('/:id', controller.getById);
productRouter.post('/', controller.create);
productRouter.patch('/:id/availability', controller.toggleAvailability);
productRouter.delete('/:id', controller.delete);

// Xóa bỏ hoặc thay thế dòng "export default router;"