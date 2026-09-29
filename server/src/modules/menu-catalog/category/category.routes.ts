import { Router } from 'express';
import { CategoryController } from './category.controller';

export const categoryRouter = Router(); // Đổi từ const router sang export const categoryRouter
const controller = new CategoryController();

categoryRouter.get('/', controller.getAll);
categoryRouter.get('/:id', controller.getById);
categoryRouter.post('/', controller.create);
categoryRouter.put('/:id', controller.update);
categoryRouter.delete('/:id', controller.delete);

// Xóa bỏ hoặc thay thế dòng "export default router;"