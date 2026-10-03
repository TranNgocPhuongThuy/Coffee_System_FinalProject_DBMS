import bcrypt from 'bcrypt'
import { CustomerRepo } from './customer.repo'
import { CreateCustomerType, FilterCustomerQueryType, UpdateCustomerType } from './customer.schema'

export class CustomerService {
    private customerRepo = new CustomerRepo()

    async getCustomers(filter: FilterCustomerQueryType) {
        return await this.customerRepo.getCustomers(filter)
    }

    async getCustomerById(id: number) {
        const customer = await this.customerRepo.getCustomerById(id)
        if (!customer) {
            const err = new Error('Khách hàng không tồn tại hoặc đã bị xóa')
            ;(err as any).status = 404
            throw err
        }
        return customer
    }

    async createCustomer(data: CreateCustomerType) {
        const existing = await this.customerRepo.getCustomerByPhone(data.phoneNumber)
        if (existing) {
            const err = new Error('Số điện thoại khách hàng đã tồn tại trên hệ thống')
            ;(err as any).status = 409
            throw err
        }

        const payload = { ...data }
        if (payload.password) {
            payload.password = await bcrypt.hash(payload.password, 10)
        }

        const customer = await this.customerRepo.createCustomer(payload)
        return {
            message: 'Tạo thông tin khách hàng thành công',
            data: customer,
        }
    }

    async updateCustomer(id: number, data: UpdateCustomerType) {
        if (data.phoneNumber) {
            const existing = await this.customerRepo.getCustomerByPhone(data.phoneNumber)
            if (existing && existing.id !== id) {
                const err = new Error('Số điện thoại này đã được sử dụng bởi khách hàng khác')
                ;(err as any).status = 409
                throw err
            }
        }

        const payload = { ...data }
        if (payload.password) {
            payload.password = await bcrypt.hash(payload.password, 10)
        }

        const updated = await this.customerRepo.updateCustomer(id, payload)
        if (!updated) {
            const err = new Error('Cập nhật thất bại hoặc không tìm thấy khách hàng')
            ;(err as any).status = 404
            throw err
        }

        return {
            message: 'Cập nhật thông tin khách hàng thành công',
            data: updated,
        }
    }

    async deleteCustomer(id: number) {
        const success = await this.customerRepo.softDeleteCustomer(id)
        if (!success) {
            const err = new Error('Xóa thất bại hoặc không tìm thấy khách hàng')
            ;(err as any).status = 404
            throw err
        }
        return {
            message: 'Xóa thông tin khách hàng thành công',
        }
    }
}