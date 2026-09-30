import { CategoryRepository } from './category.repo'
import {
  CreateCategoryType,
  FilterCategoryQueryType,
  UpdateCategoryType,
} from './category.schema'

export class CategoryService {
  private categoryRepo = new CategoryRepository()

  async getAllCategories(filters?: FilterCategoryQueryType) {
    return await this.categoryRepo.findAll(filters)
  }

  async getCategoryById(id: number) {
    const category = await this.categoryRepo.findById(id)
    if (!category) {
      throw new Error('Danh mục không tồn tại')
    }
    return category
  }

  async createCategory(dto: CreateCategoryType) {
    const existing = await this.categoryRepo.findByName(dto.name)
    if (existing) {
      throw new Error('Tên danh mục đã tồn tại')
    }
    return await this.categoryRepo.create(dto)
  }

  async updateCategory(id: number, dto: UpdateCategoryType) {
    await this.getCategoryById(id)

    if (dto.name) {
      const existing = await this.categoryRepo.findByName(dto.name, id)
      if (existing) {
        throw new Error('Tên danh mục đã tồn tại')
      }
    }

    return await this.categoryRepo.update(id, dto)
  }

  async deleteCategory(id: number) {
    await this.getCategoryById(id)

    // Kiểm tra xem danh mục có đang chứa sản phẩm hay không
    const productCount = await this.categoryRepo.countProductsByCategoryId(id)
    if (productCount > 0) {
      throw new Error(`Không thể xóa danh mục đang có ${productCount} sản phẩm liên kết`)
    }

    return await this.categoryRepo.delete(id)
  }
}