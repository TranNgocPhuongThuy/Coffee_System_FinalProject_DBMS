import { Request, Response } from 'express'
import { ToppingService } from './topping.service'

export class ToppingController {
  private toppingService = new ToppingService()

  getAll = async (req: Request, res: Response) => {
    try {
      const status = req.query.status as string | undefined
      const toppings = await this.toppingService.getAllToppings(status)
      res.status(200).json({ success: true, data: toppings })
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message })
    }
  }

  getById = async (req: Request, res: Response) => {
    try {
      const topping = await this.toppingService.getToppingById(Number(req.params.id))
      res.status(200).json({ success: true, data: topping })
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message })
    }
  }

  create = async (req: Request, res: Response) => {
    try {
      const newTopping = await this.toppingService.createTopping(req.body)
      res.status(201).json({ success: true, data: newTopping })
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || error.errors })
    }
  }

  update = async (req: Request, res: Response) => {
    try {
      const updated = await this.toppingService.updateTopping(Number(req.params.id), req.body)
      res.status(200).json({ success: true, data: updated })
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || error.errors })
    }
  }

  delete = async (req: Request, res: Response) => {
    try {
      await this.toppingService.deleteTopping(Number(req.params.id))
      res.status(200).json({ success: true, message: 'Xóa topping thành công' })
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message })
    }
  }
}