import { NextFunction, Request, Response } from 'express'
import { PagerService } from './pager.service'
import {
  CreatePagerSchema,
  FilterPagerQuerySchema,
  PagerParamSchema,
  UpdateBatterySchema,
  UpdatePagerStatusSchema,
  UpdatePagerSchema,
} from './pager.schema'

export class PagerController {
  private pagerService = new PagerService()

  /**
   * GET /api/v1/pos/pagers
   * Lấy danh sách thẻ rung có phân trang & bộ lọc
   */
  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = FilterPagerQuerySchema.parse(req.query)
      const result = await this.pagerService.getPagers(query)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/v1/pos/pagers/available
   * Danh sách các thẻ rung sẵn sàng phát cho khách (AVAILABLE & Pin >= 15%)
   */
  available = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.pagerService.getAvailablePagers()
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/v1/pos/pagers/dashboard
   * Dashboard điều phối và theo dõi thời gian chờ của khách theo View v_ActivePagerDashboard
   */
  dashboard = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.pagerService.getActiveDashboard()
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/v1/pos/pagers/:id
   * Chi tiết 1 thiết bị thẻ rung
   */
  detail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = PagerParamSchema.parse(req.params)
      const data = await this.pagerService.getPagerById(id)
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/v1/pos/pagers
   * Tạo mới thiết bị thẻ rung
   */
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = CreatePagerSchema.parse(req.body)
      const result = await this.pagerService.createPager(body)
      res.status(201).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  /**
   * PUT /api/v1/pos/pagers/:id
   * Cập nhật toàn diện thông tin thẻ rung
   */
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = PagerParamSchema.parse(req.params)
      const body = UpdatePagerSchema.parse(req.body)
      const result = await this.pagerService.updatePager(id, body)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  /**
   * PATCH /api/v1/pos/pagers/:id/status
   * Cập nhật trạng thái thẻ rung (AVAILABLE, IN_USE, CHARGING, MAINTENANCE)
   */
  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = PagerParamSchema.parse(req.params)
      const body = UpdatePagerStatusSchema.parse(req.body)
      const result = await this.pagerService.updateStatus(id, body)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  /**
   * PATCH /api/v1/pos/pagers/:id/battery
   * Cập nhật mức pin thiết bị thẻ rung
   */
  updateBattery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = PagerParamSchema.parse(req.params)
      const body = UpdateBatterySchema.parse(req.body)
      const result = await this.pagerService.updateBattery(id, body)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/v1/pos/pagers/:id/release
   * Thu hồi / chuyển trạng thái thẻ rung về AVAILABLE
   */
  release = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = PagerParamSchema.parse(req.params)
      const result = await this.pagerService.releasePager(id)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  /**
   * DELETE /api/v1/pos/pagers/:id
   * Xóa mềm thiết bị thẻ rung
   */
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = PagerParamSchema.parse(req.params)
      const result = await this.pagerService.deletePager(id)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }
}
