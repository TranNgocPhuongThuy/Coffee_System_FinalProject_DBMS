import { Request, Response, NextFunction } from 'express'
import { CustomerService } from './customer.service'
import {
    CreateCustomerSchema,
    CustomerParamSchema,
    FilterCustomerQuerySchema,
    UpdateCustomerSchema,
} from './customer.schema'

export class CustomerController {
    private customerService = new CustomerService()

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = FilterCustomerQuerySchema.parse(req.query)
            const data = await this.customerService.getCustomers(query)
            res.status(200).json({ success: true, ...data })
        } catch (error) {
            next(error)
        }
    }

    detail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = CustomerParamSchema.parse(req.params)
            const data = await this.customerService.getCustomerById(id)
            res.status(200).json({ success: true, data })
        } catch (error) {
            next(error)
        }
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = CreateCustomerSchema.parse(req.body)
            const result = await this.customerService.createCustomer(body)
            res.status(201).json({ success: true, ...result })
        } catch (error) {
            next(error)
        }
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = CustomerParamSchema.parse(req.params)
            const body = UpdateCustomerSchema.parse(req.body)
            const result = await this.customerService.updateCustomer(id, body)
            res.status(200).json({ success: true, ...result })
        } catch (error) {
            next(error)
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = CustomerParamSchema.parse(req.params)
            const result = await this.customerService.deleteCustomer(id)
            res.status(200).json({ success: true, ...result })
        } catch (error) {
            next(error)
        }
    }
}
