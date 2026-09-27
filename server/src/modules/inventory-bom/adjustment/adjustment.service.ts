import { AdjustmentRepo } from './adjustment.repo'
import { CreateAdjustmentType, FilterAdjustmentQueryType } from './adjustment.schema'

export class AdjustmentService {
  private adjustmentRepo = new AdjustmentRepo()

  async getAdjustments(filter: FilterAdjustmentQueryType) {
    return await this.adjustmentRepo.getAdjustments(filter)
  }

  async createAdjustment(data: CreateAdjustmentType) {
    const result = await this.adjustmentRepo.createAdjustmentWithTransaction(data)
    return {
      message: 'Cân đo và điều chỉnh tồn kho thành công',
      data: result,
    }
  }
}