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
            throw new Error('Khách hàng không tồn tại hoặc đã bị xóa')
        }
        return customer
    }

    async createCustomer(data: CreateCustomerType) {
        const existing = await this.customerRepo.getCustomerByPhone(data.phoneNumber)
        if (existing) {
            throw new Error('Số điện thoại khách hàng đã tồn tại trên hệ thống')
        }

        const customer = await this.customerRepo.createCustomer(data)
        return {
            message: 'Tạo thông tin khách hàng thành công',
            data: customer,
        }
    }

    async updateCustomer(id: number, data: UpdateCustomerType) {
        if (data.phoneNumber) {
            const existing = await this.customerRepo.getCustomerByPhone(data.phoneNumber)
            if (existing && existing.id !== id) {
                throw new Error('Số điện thoại này đã được sử dụng bởi khách hàng khác')
            }
        }

        const updated = await this.customerRepo.updateCustomer(id, data)
        if (!updated) {
            throw new Error('Cập nhật thất bại hoặc không tìm thấy khách hàng')
        }

        return {
            message: 'Cập nhật thông tin khách hàng thành công',
            data: updated,
        }
    }
}