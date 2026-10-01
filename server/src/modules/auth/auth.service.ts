import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { envConfig } from '@/config/env.config'
import { AuthRepo } from './auth.repo'
import { ChangePasswordBodyType, LoginBodyType, RegisterCustomerBodyType, SetupPasswordBodyType } from './auth.schema'

export class AuthService {
  private authRepo = new AuthRepo()

  async registerCustomer(data: RegisterCustomerBodyType) {
    const existingCustomer = await this.authRepo.findCustomerByPhone(data.phoneNumber)

    // Trường hợp 1: SĐT đã có tài khoản và đã có mật khẩu
    if (existingCustomer && existingCustomer.password) {
      const err: any = new Error('Số điện thoại này đã được đăng ký tài khoản. Vui lòng đăng nhập.')
      err.statusCode = 409
      throw err
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)
    let customer: any

    // Trường hợp 2: Khách đã từng mua tích điểm tại quầy (chưa có pass), giờ đăng ký online
    if (existingCustomer && !existingCustomer.password) {
      customer = await this.authRepo.activateCustomerWithPassword(existingCustomer.id, {
        fullName: data.fullName,
        passwordHash: hashedPassword,
        address: data.address,
      })
    } else {
      // Trường hợp 3: Khách hàng mới hoàn toàn
      customer = await this.authRepo.createCustomer({
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        passwordHash: hashedPassword,
        address: data.address,
      })
    }

    // Tự động cấp token đăng nhập ngay sau khi tạo tài khoản thành công
    const accessToken = jwt.sign(
      {
        id: customer.id,
        phoneNumber: customer.phoneNumber,
        fullName: customer.fullName,
        role: 'CUSTOMER',
        userType: 'CUSTOMER',
      },
      envConfig.JWT_SECRET,
      { expiresIn: envConfig.JWT_EXPIRES_IN }
    )

    return {
      accessToken,
      user: {
        id: customer.id,
        fullName: customer.fullName,
        phoneNumber: customer.phoneNumber,
        membershipTier: customer.membershipTier,
        rewardPoints: customer.rewardPoints,
        role: 'CUSTOMER',
        userType: 'CUSTOMER',
      },
    }
  }

  async login(data: LoginBodyType) {
    const { identifier, password, userType } = data

    // 1. Luồng Nhân viên (Employee: MANAGER, CASHIER, BARISTA, STOREKEEPER)
    if (userType === 'EMPLOYEE') {
      const employee = await this.authRepo.findEmployeeByUsername(identifier)
      if (!employee) {
        throw new Error('Tài khoản hoặc mật khẩu không chính xác')
      }

      if (employee.status !== 'ACTIVE') {
        throw new Error('Tài khoản nhân viên đã bị vô hiệu hóa')
      }

      const isMatch = await bcrypt.compare(password, employee.password)
      if (!isMatch) {
        throw new Error('Tài khoản hoặc mật khẩu không chính xác')
      }

      const accessToken = jwt.sign(
        {
          id: employee.id,
          username: employee.username,
          fullName: employee.fullName,
          role: employee.role,
          userType: 'EMPLOYEE',
        },
        envConfig.JWT_SECRET,
        { expiresIn: envConfig.JWT_EXPIRES_IN }
      )

      return {
        accessToken,
        user: {
          id: employee.id,
          fullName: employee.fullName,
          username: employee.username,
          role: employee.role,
          userType: 'EMPLOYEE',
        },
      }
    }

    // 2. Luồng Khách hàng (Customer đăng nhập bằng SĐT)
    const customer = await this.authRepo.findCustomerByPhone(identifier)
    if (!customer) {
      throw new Error('Số điện thoại chưa được đăng ký trong hệ thống')
    }

    // Xử lý trường hợp khách tích điểm tại quầy chưa có mật khẩu
    if (!customer.password) {
      const err: any = new Error(
        'Tài khoản của bạn được tạo tại quầy và chưa thiết lập mật khẩu đăng nhập. Vui lòng thiết lập mật khẩu để tiếp tục.'
      )
      err.statusCode = 403
      err.code = 'PASSWORD_NOT_SET'
      throw err
    }

    const isMatch = await bcrypt.compare(password, customer.password)
    if (!isMatch) {
      throw new Error('Mật khẩu không chính xác')
    }

    const accessToken = jwt.sign(
      {
        id: customer.id,
        phoneNumber: customer.phoneNumber,
        fullName: customer.fullName,
        role: 'CUSTOMER',
        userType: 'CUSTOMER',
      },
      envConfig.JWT_SECRET,
      { expiresIn: envConfig.JWT_EXPIRES_IN }
    )

    return {
      accessToken,
      user: {
        id: customer.id,
        fullName: customer.fullName,
        phoneNumber: customer.phoneNumber,
        membershipTier: customer.membershipTier,
        rewardPoints: customer.rewardPoints,
        role: 'CUSTOMER',
        userType: 'CUSTOMER',
      },
    }
  }

  async setupPassword(data: SetupPasswordBodyType) {
    const customer = await this.authRepo.findCustomerByPhone(data.phoneNumber)
    if (!customer) {
      throw new Error('Không tìm thấy thông tin khách hàng với số điện thoại này')
    }

    if (customer.password) {
      throw new Error('Tài khoản đã có mật khẩu. Vui lòng đăng nhập hoặc chọn Quên mật khẩu.')
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10)
    await this.authRepo.updateCustomerPassword(customer.id, hashedPassword)

    return {
      message: 'Thiết lập mật khẩu thành công. Bạn có thể đăng nhập ngay bây giờ.',
    }
  }

  async changePassword(userId: number, userType: 'EMPLOYEE' | 'CUSTOMER', data: ChangePasswordBodyType) {
    let currentHash = ''

    if (userType === 'EMPLOYEE') {
      const emp = await this.authRepo.findEmployeeById(userId)
      if (!emp) throw new Error('Không tìm thấy nhân viên')
      const fullEmp = await this.authRepo.findEmployeeByUsername(emp.username)
      currentHash = fullEmp.password
    } else {
      const cust = await this.authRepo.findCustomerById(userId)
      if (!cust) throw new Error('Không tìm thấy khách hàng')
      const fullCust = await this.authRepo.findCustomerByPhone(cust.phoneNumber)
      currentHash = fullCust.password
    }

    const isMatch = await bcrypt.compare(data.oldPassword, currentHash)
    if (!isMatch) {
      throw new Error('Mật khẩu cũ không chính xác')
    }

    const newHashed = await bcrypt.hash(data.newPassword, 10)
    if (userType === 'EMPLOYEE') {
      await this.authRepo.updateEmployeePassword(userId, newHashed)
    } else {
      await this.authRepo.updateCustomerPassword(userId, newHashed)
    }

    return { message: 'Đổi mật khẩu thành công' }
  }

  async getMe(userId: number, userType: 'EMPLOYEE' | 'CUSTOMER') {
    if (userType === 'CUSTOMER') {
      const customer = await this.authRepo.findCustomerById(userId)
      if (!customer) throw new Error('Không tìm thấy khách hàng')
      return { ...customer, role: 'CUSTOMER', userType: 'CUSTOMER' }
    }

    const employee = await this.authRepo.findEmployeeById(userId)
    if (!employee) throw new Error('Không tìm thấy nhân viên')
    return { ...employee, userType: 'EMPLOYEE' }
  }
}