import { Router } from 'express'
import { PagerController } from './pager.controller'

export const pagerRouter = Router()
const controller = new PagerController()

// 1. Lấy danh sách thẻ rung (Phân trang, lọc theo trạng thái, mức pin, tìm kiếm mã)
// GET /api/v1/pos/pagers
pagerRouter.get('/', controller.list)

// 2. Danh sách thẻ rung sẵn sàng cấp cho khách (AVAILABLE & Pin >= 15%)
// GET /api/v1/pos/pagers/available
pagerRouter.get('/available', controller.available)

// 3. Dashboard điều phối theo dõi thời gian chờ của khách theo View v_ActivePagerDashboard
// GET /api/v1/pos/pagers/dashboard
pagerRouter.get('/dashboard', controller.dashboard)

// 4. Lấy thông tin chi tiết 1 thẻ rung
// GET /api/v1/pos/pagers/:id
pagerRouter.get('/:id', controller.detail)

// 5. Thêm mới thiết bị thẻ rung
// POST /api/v1/pos/pagers
pagerRouter.post('/', controller.create)

// 6. Cập nhật thông tin thẻ rung
// PUT /api/v1/pos/pagers/:id
pagerRouter.put('/:id', controller.update)

// 7. Cập nhật trạng thái thẻ rung (AVAILABLE, IN_USE, CHARGING, MAINTENANCE)
// PATCH /api/v1/pos/pagers/:id/status
pagerRouter.patch('/:id/status', controller.updateStatus)

// 8. Cập nhật mức pin thiết bị thẻ rung
// PATCH /api/v1/pos/pagers/:id/battery
pagerRouter.patch('/:id/battery', controller.updateBattery)

// 9. Thu hồi thẻ rung khi khách trả thẻ
// POST /api/v1/pos/pagers/:id/release
pagerRouter.post('/:id/release', controller.release)

// 10. Xóa mềm thiết bị thẻ rung
// DELETE /api/v1/pos/pagers/:id
pagerRouter.delete('/:id', controller.delete)
