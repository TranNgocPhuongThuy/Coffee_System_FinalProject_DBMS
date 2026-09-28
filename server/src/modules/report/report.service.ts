import { ReportRepo } from './report.repo'
import { DateRangeReportType, TopProductsQueryType } from './report.schema'

export class ReportService {
    private reportRepo = new ReportRepo()

    async getRevenueOverview(filter: DateRangeReportType) {
        return await this.reportRepo.getOverviewRevenue(filter)
    }

    async getTopSellingProducts(filter: TopProductsQueryType) {
        return await this.reportRepo.getTopSellingProducts(filter)
    }

    async getLowStockAlert() {
        return await this.reportRepo.getLowStockIngredients()
    }
}