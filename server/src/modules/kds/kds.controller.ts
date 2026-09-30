import { Request, Response, NextFunction } from 'express'
import { KDSService } from './kds.service'
import {
  KdsParamSchema,
  NotifyOrderReadySchema,
  QueryKdsQueueSchema,
  UpdateItemStatusSchema,
} from './kds.schema'

export class KDSController {
  private kdsService = new KDSService()

  getQueue = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = QueryKdsQueueSchema.parse(req.query)
      const data = await this.kdsService.getQueue(query)
      res.status(200).json({ success: true, count: data.length, data })
    } catch (error) {
      next(error)
    }
  }

  updateItemStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderDetailId } = KdsParamSchema.parse(req.params)
      const body = UpdateItemStatusSchema.parse(req.body)
      const result = await this.kdsService.updateItemStatus(orderDetailId, body)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  notifyReady = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = NotifyOrderReadySchema.parse(req.params)
      const result = await this.kdsService.notifyOrderReady(orderId)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }
}