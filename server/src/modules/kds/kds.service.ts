import { KDSRepo } from './kds.repo'
import { QueryKdsQueueType, UpdateItemStatusType } from './kds.schema'

export class KDSService {
  private kdsRepo = new KDSRepo()

  async getQueue(query: QueryKdsQueueType) {
    return await this.kdsRepo.getKdsQueue(query)
  }

  async updateItemStatus(orderDetailId: number, data: UpdateItemStatusType) {
    const item = await this.kdsRepo.updateItemStatus(orderDetailId, data)
    if (!item) {
      throw new Error('Không tìm thấy dòng món trong đơn hàng')
    }
    return {
      message: `Cập nhật trạng thái món sang [${data.itemStatus}] thành công. Kho nguyên liệu đã được đồng bộ tự động.`,
      data: item,
    }
  }

  async notifyOrderReady(orderId: number) {
    return await this.kdsRepo.triggerReadyAlarm(orderId)
  }
}