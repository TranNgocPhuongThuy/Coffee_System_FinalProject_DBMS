import { ProductRepository } from './product.repo';
import { CreateProductDto } from './product.schema';

export class ProductService {
  private productRepo = new ProductRepository();

  async getProducts(categoryId?: string, isAvailable?: boolean) {
    return await this.productRepo.findAll(categoryId, isAvailable);
  }

  async getProductById(id: string) {
    const product = await this.productRepo.findById(id);
    if (!product) throw new Error('Sản phẩm không tồn tại');
    return product;
  }

  async createProduct(dto: CreateProductDto) {
    const existing = await this.productRepo.findByCode(dto.code);
    if (existing) throw new Error('Mã sản phẩm đã bị trùng lặp');
    return await this.productRepo.createWithDetails(dto);
  }

  async toggleAvailability(id: string, isAvailable: boolean) {
    await this.getProductById(id);
    return await this.productRepo.updateAvailability(id, isAvailable);
  }

  async deleteProduct(id: string) {
    await this.getProductById(id);
    return await this.productRepo.softDelete(id);
  }
}