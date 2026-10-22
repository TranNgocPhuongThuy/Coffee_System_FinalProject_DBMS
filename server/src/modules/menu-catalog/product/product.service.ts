import { ProductRepository } from './product.repo'
import { CategoryRepository } from '../category/category.repo'
import {
  CreateProductType,
  FilterProductQueryType,
  UpdateProductType,
} from './product.schema'

export class ProductService {
  private productRepo = new ProductRepository()
  private categoryRepo = new CategoryRepository()

  async getProducts(filter: FilterProductQueryType) {
    return await this.productRepo.findAll(filter)
  }

  async getProductById(id: number) {
    const product = await this.productRepo.findById(id)
    if (!product) throw new Error('Sản phẩm không tồn tại')
    return product
  }

  async createProduct(dto: CreateProductType) {
    // 1. Kiểm tra danh mục liên kết có tồn tại và đang hoạt động không
    const category = await this.categoryRepo.findById(dto.categoryId)
    if (!category) throw new Error('Danh mục không tồn tại hoặc đã bị xóa')

    // 2. Kiểm tra trùng tên món
    const existing = await this.productRepo.findByName(dto.name)
    if (existing) throw new Error('Tên món đã tồn tại trong thực đơn')

    // 3. Kiểm tra các kích thước (size) gửi lên không được trùng nhau
    const sizes = dto.variants.map((v) => v.size)
    if (new Set(sizes).size !== sizes.length) {
      throw new Error('Các kích thước (size) của món không được trùng nhau')
    }

    return await this.productRepo.createWithVariants(dto)
  }

  async updateProduct(id: number, dto: UpdateProductType) {
    await this.getProductById(id)

    // 1. Nếu cập nhật danh mục, kiểm tra danh mục mới có hợp lệ không
    if (dto.categoryId !== undefined) {
      const category = await this.categoryRepo.findById(dto.categoryId)
      if (!category) throw new Error('Danh mục không tồn tại hoặc đã bị xóa')
    }

    // 2. Nếu đổi tên món, kiểm tra trùng tên với món khác
    if (dto.name) {
      const existing = await this.productRepo.findByName(dto.name, id)
      if (existing) throw new Error('Tên món đã tồn tại trong thực đơn')
    }

    // 3. Nếu cập nhật biến thể, kiểm tra trùng size
    if (dto.variants && dto.variants.length > 0) {
      const sizes = dto.variants.map((v) => v.size)
      if (new Set(sizes).size !== sizes.length) {
        throw new Error('Các kích thước (size) của món không được trùng nhau')
      }
    }

    return await this.productRepo.update(id, dto)
  }

  async deleteProduct(id: number) {
    await this.getProductById(id)
    return await this.productRepo.softDelete(id)
  }
}