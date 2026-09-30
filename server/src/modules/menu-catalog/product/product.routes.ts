import { Router } from 'express'
import { ProductController } from './product.controller'
import { authGuard, roleGuard, validatePipe } from '@/middlewares'
import {
  CreateProductSchema,
  FilterProductQuerySchema,
  ProductParamSchema,
  UpdateProductSchema,
} from './product.schema'

export const productRouter = Router()
const controller = new ProductController()

/**
 * @route   GET /api/v1/products
 * @desc    Tra cứu danh sách thực đơn (Public cho Customer & Cashier)
 */
productRouter.get(
  '/',
  validatePipe(FilterProductQuerySchema, 'query'),
  controller.getAll
)

/**
 * @route   GET /api/v1/products/:id
 * @desc    Xem chi tiết 1 sản phẩm theo ID (Public cho Customer & Cashier)
 */
productRouter.get(
  '/:id',
  validatePipe(ProductParamSchema, 'params'),
  controller.getById
)

/**
 * @route   POST /api/v1/products
 * @desc    Tạo món mới (Yêu cầu Đăng nhập & Quyền MANAGER)
 */
productRouter.post(
  '/',
  authGuard,
  roleGuard('MANAGER'),
  validatePipe(CreateProductSchema, 'body'),
  controller.create
)

/**
 * @route   PUT /api/v1/products/:id
 * @desc    Cập nhật món & biến thể Size/Giá (Yêu cầu Đăng nhập & Quyền MANAGER)
 */
productRouter.put(
  '/:id',
  authGuard,
  roleGuard('MANAGER'),
  validatePipe(ProductParamSchema, 'params'),
  validatePipe(UpdateProductSchema, 'body'),
  controller.update
)

/**
 * @route   DELETE /api/v1/products/:id
 * @desc    Xóa mềm món ăn (Yêu cầu Đăng nhập & Quyền MANAGER)
 */
productRouter.delete(
  '/:id',
  authGuard,
  roleGuard('MANAGER'),
  validatePipe(ProductParamSchema, 'params'),
  controller.delete
)