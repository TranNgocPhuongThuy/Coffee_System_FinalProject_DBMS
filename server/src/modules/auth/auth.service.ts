import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { envConfig } from '@/config/env.config'
import { AuthRepo } from './auth.repo'
import {
  ChangePasswordBodyType,
  CreateEmployeeBodyType,
  LoginBodyType,
  RegisterBodyType,
  UpdateEmployeeRoleBodyType,
} from './auth.schema'

export class AuthService {
  private authRepo = new AuthRepo()

  // 1. Đăng ký tài khoản (Mặc định là Khách hàng)
  async register(data: RegisterBodyType) {
    // 1. Kiểm tra SĐT đã tồn tại trong bảng Customer chưa
    const existingCustomer = await this.authRepo.findCustomerByPhone(data.phoneNumber);

    // TH1: Số điện thoại đã đăng ký và ĐÃ CÓ mật khẩu -> Chặn đăng ký trùng
    if (existingCustomer && existingCustomer.password) {
      const err: any = new Error(
        'Số điện thoại này đã được đăng ký tài khoản. Vui lòng đăng nhập.'
      );
      err.statusCode = 409;
      throw err;
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    let customer: any;
    let message = 'Đăng ký tài khoản thành công';

    // TH2: Khách đã từng tích điểm tại quầy (password đang NULL)
    // -> Kích hoạt tài khoản, giữ nguyên toàn bộ số điểm tích lũy và hạng thành viên
    if (existingCustomer && !existingCustomer.password) {
      customer = await this.authRepo.activateCustomerWithPassword(existingCustomer.id, {
        fullName: data.fullName,
        passwordHash: hashedPassword,
        address: data.address,
      });
      message = `Đăng ký thành công! Đã tự động liên kết và giữ nguyên ${customer.rewardPoints} điểm tích lũy từ các lần mua trước.`;
    } 
    // TH3: Khách hàng mới hoàn toàn
    else {
      customer = await this.authRepo.createCustomer({
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        passwordHash: hashedPassword,
        address: data.address,
      });
    }

    // 2. Tự động cấp Token đăng nhập ngay sau khi tạo/kích hoạt tài khoản
    const accessToken = jwt.sign(
      {
        id: customer.id,
        role: 'CUSTOMER',
        userType: 'CUSTOMER',
      },
      envConfig.JWT_SECRET,
      { expiresIn: envConfig.JWT_EXPIRES_IN }
    );

    return {
      message,
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
    };
  }

  // 2. Đăng nhập chung: Tự nhận diện Employee hay Customer
  async login(data: LoginBodyType) {
    const { identifier, password } = data

    // Bước 1: Thử tìm trong bảng Employee trước
    const employee = await this.authRepo.findEmployeeByIdentifier(identifier)
    if (employee) {
      if (employee.status !== 'ACTIVE') {
        const err: any = new Error('Tài khoản nhân viên đã bị vô hiệu hóa')
        err.statusCode = 403
        throw err
      }

      const isMatch = await bcrypt.compare(password, employee.password)
      if (!isMatch) {
        const err: any = new Error('Tài khoản hoặc mật khẩu không chính xác')
        err.statusCode = 401
        throw err
      }

      const accessToken = jwt.sign(
        {
          id: employee.id,
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
          phoneNumber: employee.phoneNumber,
          role: employee.role,
          userType: 'EMPLOYEE',
        },
      }
    }

    // Bước 2: Nếu không phải nhân viên, kiểm tra bảng Customer
    const customer = await this.authRepo.findCustomerByPhone(identifier)
    if (!customer) {
      const err: any = new Error('Tài khoản hoặc mật khẩu không chính xác')
      err.statusCode = 401
      throw err
    }

    if (!customer.password) {
      const err: any = new Error(
        'Tài khoản tích điểm tại quầy chưa được thiết lập mật khẩu trực tuyến.'
      )
      err.statusCode = 403
      throw err
    }

    const isCustMatch = await bcrypt.compare(password, customer.password)
    if (!isCustMatch) {
      const err: any = new Error('Tài khoản hoặc mật khẩu không chính xác')
      err.statusCode = 401
      throw err
    }

    const accessToken = jwt.sign(
      {
        id: customer.id,
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

  // 3. Admin / Manager tạo tài khoản nhân viên
  async createEmployee(data: CreateEmployeeBodyType) {
    const existing = await this.authRepo.findEmployeeByIdentifier(data.username)
    if (existing) {
      const err: any = new Error('Tên đăng nhập này đã tồn tại trên hệ thống')
      err.statusCode = 409
      throw err
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)
    const employee = await this.authRepo.createEmployee({
      fullName: data.fullName,
      username: data.username,
      passwordHash: hashedPassword,
      role: data.role,
      phoneNumber: data.phoneNumber,
    })

    return employee
  }

  // 4. Admin / Manager gán Role mới cho nhân viên
  async setEmployeeRole(id: number, data: UpdateEmployeeRoleBodyType) {
    const emp = await this.authRepo.findEmployeeById(id)
    if (!emp) {
      const err: any = new Error('Không tìm thấy thông tin nhân viên')
      err.statusCode = 404
      throw err
    }

    return await this.authRepo.updateEmployeeRole(id, data.role)
  }

  // 5. Đổi mật khẩu
  async changePassword(userId: number, userType: 'EMPLOYEE' | 'CUSTOMER', data: ChangePasswordBodyType) {
    let currentHash = ''

    if (userType === 'EMPLOYEE') {
      const emp = await this.authRepo.findEmployeeById(userId)
      if (!emp) throw new Error('Không tìm thấy tài khoản')
      const fullEmp = await this.authRepo.findEmployeeByIdentifier(emp.username)
      currentHash = fullEmp.password
    } else {
      const cust = await this.authRepo.findCustomerById(userId)
      if (!cust) throw new Error('Không tìm thấy tài khoản')
      const fullCust = await this.authRepo.findCustomerByPhone(cust.phoneNumber)
      currentHash = fullCust.password
    }

    const isMatch = await bcrypt.compare(data.oldPassword, currentHash)
    if (!isMatch) {
      const err: any = new Error('Mật khẩu cũ không chính xác')
      err.statusCode = 400
      throw err
    }

    const newHashed = await bcrypt.hash(data.newPassword, 10)
    if (userType === 'EMPLOYEE') {
      await this.authRepo.updateEmployeePassword(userId, newHashed)
    } else {
      await this.authRepo.updateCustomerPassword(userId, newHashed)
    }

    return { message: 'Đổi mật khẩu thành công' }
  }

  // 6. Lấy thông tin tài khoản hiện tại
  async getMe(userId: number, userType: 'EMPLOYEE' | 'CUSTOMER') {
    if (userType === 'CUSTOMER') {
      const customer = await this.authRepo.findCustomerById(userId)
      if (!customer) throw new Error('Tài khoản không tồn tại')
      return { ...customer, role: 'CUSTOMER', userType: 'CUSTOMER' }
    }

    const employee = await this.authRepo.findEmployeeById(userId)
    if (!employee) throw new Error('Tài khoản không tồn tại')
    return { ...employee, userType: 'EMPLOYEE' }
  }
}