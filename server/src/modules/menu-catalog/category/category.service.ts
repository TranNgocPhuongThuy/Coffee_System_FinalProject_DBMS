import { CategoryRepository } from './category.repo';
import { CreateCategoryDto, UpdateCategoryDto } from './category.schema';

export class CategoryService {
  private categoryRepo = new CategoryRepository();

  async getAllCategories() {
    return await this.categoryRepo.findAll();
  }

  async getCategoryById(id: string) {
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new Error('Danh mục không tồn tại');
    }
    return category;
  }

  async createCategory(dto: CreateCategoryDto) {
    const existingSlug = await this.categoryRepo.findBySlug(dto.slug);
    if (existingSlug) {
      throw new Error('Slug danh mục đã tồn tại');
    }
    return await this.categoryRepo.create({
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      sort_order: dto.sortOrder,
      is_active: dto.isActive,
    });
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
    await this.getCategoryById(id);
    return await this.categoryRepo.update(id, {
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      sort_order: dto.sortOrder,
      is_active: dto.isActive,
    });
  }

  async deleteCategory(id: string) {
    await this.getCategoryById(id);
    return await this.categoryRepo.delete(id);
  }
}