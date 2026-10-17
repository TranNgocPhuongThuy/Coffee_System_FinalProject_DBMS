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

    let autoReadyNotified = false
    let alarmInfo: any = null

    // Nếu món chuyển sang DONE: Kiểm tra xem toàn bộ món trong đơn này đã hoàn thành chưa
    if (data.itemStatus === 'DONE') {
      const remainingCount = await this.kdsRepo.countRemainingItemsInOrder(item.orderId)
      if (remainingCount === 0) {
        try {
          alarmInfo = await this.notifyOrderReady(item.orderId)
          autoReadyNotified = true
        } catch (alarmErr) {
          console.error('Lỗi khi tự động kích hoạt rung chuông sau khi làm xong tất cả món:', alarmErr)
        }
      }
    }

    return {
      message: autoReadyNotified
        ? `Đã hoàn tất món cuối cùng! Đơn hàng #${item.orderId} đã tự động chuyển sang [SẴN SÀNG] và kích hoạt chuông báo thẻ rung.`
        : `Cập nhật trạng thái món sang [${data.itemStatus}] thành công. Kho nguyên liệu đã được đồng bộ tự động.`,
      data: {
        ...item,
        autoReadyNotified,
        alarmInfo,
      },
    }
  }

  async notifyOrderReady(orderId: number) {
    return await this.kdsRepo.triggerReadyAlarm(orderId)
  }
}