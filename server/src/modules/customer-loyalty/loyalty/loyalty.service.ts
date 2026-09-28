import { LoyaltyRepo } from './loyalty.repo'
import { AdjustPointsType, FilterLoyaltyHistoryQueryType } from './loyalty.schema'

export class LoyaltyService {
    private loyaltyRepo = new LoyaltyRepo()

    async getLoyaltyHistory(filter: FilterLoyaltyHistoryQueryType) {
        return await this.loyaltyRepo.getLoyaltyHistory(filter)
    }

    async adjustPoints(data: AdjustPointsType) {
        const result = await this.loyaltyRepo.processPointsTransaction(data)
        return {
            message: `${data.transactionType === 'EARN' ? 'Tích điểm' : 'Đổi điểm'} thành công`,
            data: result,
        }
    }
}