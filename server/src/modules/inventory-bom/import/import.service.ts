import { ImportRepo } from './import.repo'
import { CreateImportTicketType, QueryImportTicketType } from './import.schema'

export class ImportService {
  private importRepo = new ImportRepo()

  async getImportTickets(query: QueryImportTicketType) {
    return await this.importRepo.findAll(query)
  }

  async getImportDetailById(importId: number) {
    const importTicket = await this.importRepo.findById(importId)
    if (!importTicket) {
      throw new Error(`Không tìm thấy phiếu nhập kho với mã #${importId}`)
    }
    const details = await this.importRepo.findDetailsByImportId(importId)
    return {
      ...importTicket,
      details,
    }
  }

  async createImportTicket(data: CreateImportTicketType) {
    // Tự động tính tổng tiền phiếu nhập từ danh sách chi tiết dòng
    const calculatedTotalAmount = data.details.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    )

    // Gọi Repo để thực thi Stored Procedure sp_LapPhieuNhapKho
    const result = await this.importRepo.createImportTicketWithProcedure({
      ...data,
      totalAmount: calculatedTotalAmount,
    })

    return {
      message: 'Lập phiếu nhập kho thành công. Tồn kho đã được tự động cập nhật.',
      data: result,
    }
  }
}