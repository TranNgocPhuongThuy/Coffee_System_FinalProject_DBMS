import { Router } from 'express'
import { PagerController } from './pager.controller'
import { authGuard, roleGuard } from '@/middlewares'

export const pagerRouter = Router()
const controller = new PagerController()

// Bắt buộc đăng nhập cho toàn bộ phân hệ Pager
pagerRouter.use(authGuard)

// Cashier và Manager được xem danh sách và dashboard
pagerRouter.get('/', roleGuard('CASHIER', 'MANAGER'), controller.list)
pagerRouter.get('/available', roleGuard('CASHIER', 'MANAGER'), controller.available)
pagerRouter.get('/dashboard', roleGuard('CASHIER', 'MANAGER', 'BARISTA'), controller.dashboard)
pagerRouter.get('/:id', roleGuard('CASHIER', 'MANAGER'), controller.detail)

// Thu hồi thẻ rung: Thu ngân hoặc Pha chế
pagerRouter.post('/:id/release', roleGuard('CASHIER', 'BARISTA', 'MANAGER'), controller.release)
pagerRouter.patch('/:id/battery', roleGuard('CASHIER', 'BARISTA', 'MANAGER'), controller.updateBattery)
pagerRouter.patch('/:id/status', roleGuard('CASHIER', 'MANAGER'), controller.updateStatus)

// Cấu hình thêm mới / xóa thẻ rung: Chỉ MANAGER
pagerRouter.post('/', roleGuard('MANAGER'), controller.create)
pagerRouter.put('/:id', roleGuard('MANAGER'), controller.update)
pagerRouter.delete('/:id', roleGuard('MANAGER'), controller.delete)