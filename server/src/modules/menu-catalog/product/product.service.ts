import { ProductRepository } from './product.repo'
import {
  CreateProductType,
  FilterProductQueryType,
  UpdateProductType,
} from './product.schema'

export class ProductService {
  private productRepo = new ProductRepository()

  async getProducts(filter: FilterProductQueryType) {
    return await this.productRepo.findAll(filter)
  }

  async getProductById(id: number) {
    const product = await this.productRepo.findById(id)
    if (!product) throw new Error('Sản phẩm không tồn tại')
    return product
  }

  async createProduct(dto: CreateProductType) {
    const existing = await this.productRepo.findByName(dto.name)
    if (existing) throw new Error('Tên món đã tồn tại trong thực đơn')
    return await this.productRepo.createWithVariants(dto)
  }

  async updateProduct(id: number, dto: UpdateProductType) {
    await this.getProductById(id)
    return await this.productRepo.update(id, dto)
  }

  async deleteProduct(id: number) {
    await this.getProductById(id)
    return await this.productRepo.softDelete(id)
  }
}