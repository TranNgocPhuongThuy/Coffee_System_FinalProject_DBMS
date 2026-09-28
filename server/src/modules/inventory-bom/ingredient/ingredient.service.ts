import { IngredientRepo } from './ingredient.repo'
import {
  CreateIngredientType,
  QueryIngredientType,
  UpdateIngredientType,
} from './ingredient.schema'

export class IngredientService {
  private ingredientRepo = new IngredientRepo()

  async getIngredients(query: QueryIngredientType) {
    if (query.isLowStock) {
      // Truy vấn từ View v_LowStockIngredients trong CSDL
      return await this.ingredientRepo.getLowStockIngredients()
    }
    return await this.ingredientRepo.findAll(query.name)
  }

  async getIngredientById(id: number) {
    const ingredient = await this.ingredientRepo.findById(id)
    if (!ingredient) {
      throw new Error('Không tìm thấy thông tin nguyên liệu')
    }
    return ingredient
  }

  async createIngredient(data: CreateIngredientType) {
    const isExisted = await this.ingredientRepo.findByName(data.name)
    if (isExisted) {
      throw new Error(`Nguyên liệu "${data.name}" đã tồn tại trên hệ thống`)
    }
    return await this.ingredientRepo.create(data)
  }

  async updateIngredient(id: number, data: UpdateIngredientType) {
    const existed = await this.ingredientRepo.findById(id)
    if (!existed) {
      throw new Error('Không tìm thấy nguyên liệu để cập nhật')
    }
    return await this.ingredientRepo.update(id, data)
  }

  async deleteIngredient(id: number) {
    const existed = await this.ingredientRepo.findById(id)
    if (!existed) {
      throw new Error('Không tìm thấy nguyên liệu để xóa')
    }
    // Thực hiện xóa mềm theo quy định Soft Delete
    return await this.ingredientRepo.softDelete(id)
  }
}