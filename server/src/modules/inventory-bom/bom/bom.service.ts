import { BOMRepo } from './bom.repo'
import { RecipeBOMType, ToppingBOMType } from './bom.schema'

export class BOMService {
  private bomRepo = new BOMRepo()

  async getRecipeDetails(variantId?: number) {
    return await this.bomRepo.getAllRecipeDetails(variantId)
  }

  async getToppingBOM(toppingId?: number) {
    return await this.bomRepo.getToppingBOM(toppingId)
  }

  async upsertRecipeBOM(data: RecipeBOMType) {
    await this.bomRepo.upsertRecipeBOM(data)
    return {
      message: 'Cập nhật định lượng công thức (BOM) món thành công',
      data,
    }
  }

  async upsertToppingBOM(data: ToppingBOMType) {
    await this.bomRepo.upsertToppingBOM(data)
    return {
      message: 'Cập nhật định lượng công thức (BOM) topping thành công',
      data,
    }
  }

  async deleteRecipeBOM(variantId: number, ingredientId: number) {
    const affected = await this.bomRepo.deleteRecipeBOM(variantId, ingredientId)
    if (affected === 0) {
      throw new Error('Không tìm thấy định lượng công thức cần xóa')
    }
    return {
      message: 'Xóa nguyên liệu khỏi định lượng thành công',
    }
  }
}