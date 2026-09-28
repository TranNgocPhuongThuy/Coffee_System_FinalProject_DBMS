import { ToppingRepository } from './topping.repo';
import { CreateToppingDto, UpdateToppingDto } from './topping.schema';

export class ToppingService {
  private toppingRepo = new ToppingRepository();

  async getAllToppings() {
    return await this.toppingRepo.findAll();
  }

  async getToppingById(id: string) {
    const topping = await this.toppingRepo.findById(id);
    if (!topping) throw new Error('Topping không tồn tại');
    return topping;
  }

  async createTopping(dto: CreateToppingDto) {
    return await this.toppingRepo.create({
      name: dto.name,
      price: dto.price,
      isAvailable: dto.isAvailable,
    });
  }

  async updateTopping(id: string, dto: UpdateToppingDto) {
    await this.getToppingById(id);
    return await this.toppingRepo.update(id, dto);
  }

  async deleteTopping(id: string) {
    await this.getToppingById(id);
    return await this.toppingRepo.delete(id);
  }
}