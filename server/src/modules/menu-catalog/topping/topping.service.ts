import { ToppingRepository } from './topping.repo'
import { CreateToppingType, UpdateToppingType } from './topping.schema'

export class ToppingService {
  private toppingRepo = new ToppingRepository()

  async getAllToppings(status?: string) {
    return await this.toppingRepo.findAll(status)
  }

  async getToppingById(id: number) {
    const topping = await this.toppingRepo.findById(id)
    if (!topping) {
      throw new Error('Topping không tồn tại')
    }
    return topping
  }

  async createTopping(dto: CreateToppingType) {
    const existing = await this.toppingRepo.findByName(dto.name)
    if (existing) {
      throw new Error('Tên topping đã tồn tại')
    }
    return await this.toppingRepo.create(dto)
  }

  async updateTopping(id: number, dto: UpdateToppingType) {
    await this.getToppingById(id)
    return await this.toppingRepo.update(id, dto)
  }

  async deleteTopping(id: number) {
    await this.getToppingById(id)
    return await this.toppingRepo.delete(id)
  }
}