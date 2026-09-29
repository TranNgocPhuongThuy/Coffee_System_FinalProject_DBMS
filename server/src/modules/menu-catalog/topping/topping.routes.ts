import { Router } from 'express';
import { ToppingController } from './topping.controller';

export const toppingRouter = Router(); // Đổi từ const router sang export const toppingRouter
const controller = new ToppingController();

toppingRouter.get('/', controller.getAll);
toppingRouter.get('/:id', controller.getById);
toppingRouter.post('/', controller.create);
toppingRouter.put('/:id', controller.update);
toppingRouter.delete('/:id', controller.delete);

// Xóa bỏ hoặc thay thế dòng "export default router;"