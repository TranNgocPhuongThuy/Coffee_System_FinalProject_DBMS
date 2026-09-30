import { CategoryRepository } from './category.repo'
import { CreateCategoryType, UpdateCategoryType } from './category.schema'

export class CategoryService {
  private categoryRepo = new CategoryRepository()

  async getAllCategories() {
    return await this.categoryRepo.findAll()
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
    return await this.categoryRepo.update(id, dto)
  }

  async deleteCategory(id: number) {
    await this.getCategoryById(id)
    return await this.categoryRepo.delete(id)
  }
}