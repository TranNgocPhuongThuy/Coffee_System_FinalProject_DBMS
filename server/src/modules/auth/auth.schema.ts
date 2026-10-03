import { z } from 'zod'

// 1. Đăng ký tài khoản công khai: Mặc định là Khách hàng (Customer)
export const RegisterBodySchema = z
  .object({
    phoneNumber: z
      .string()
      .regex(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/, 'Số điện thoại không đúng định dạng'),
    fullName: z.string().trim().min(2, 'Họ và tên tối thiểu 2 ký tự').max(100),
    password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
    confirmPassword: z.string().min(6, 'Xác nhận mật khẩu tối thiểu 6 ký tự'),
    address: z.string().trim().max(255).optional(),
  })
  .strict()
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu và xác nhận mật khẩu không khớp nhau',
        path: ['confirmPassword'],
      })
    }
  })

// 2. Đăng nhập chung: Tự động nhận diện tài khoản, không cần userType
export const LoginBodySchema = z
  .object({
    identifier: z.string().trim().min(1, 'Vui lòng nhập tên đăng nhập hoặc số điện thoại'),
    password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
  })
  .strict()

// 3. Admin / Manager tạo tài khoản nhân viên
export const CreateEmployeeBodySchema = z
  .object({
    fullName: z.string().trim().min(2, 'Họ và tên tối thiểu 2 ký tự').max(100),
    username: z.string().trim().min(3, 'Tên đăng nhập tối thiểu 3 ký tự').max(50),
    password: z.string().min(6, 'Mật khẩu khởi tạo tối thiểu 6 ký tự'),
    role: z.enum(['ADMIN', 'MANAGER', 'CASHIER', 'BARISTA', 'STOREKEEPER'], {
      errorMap: () => ({ message: 'Vai trò nhân viên không hợp lệ' }),
    }),
    phoneNumber: z.string().regex(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/, 'Số điện thoại không hợp lệ').optional(),
  })
  .strict()

// 4. Admin / Manager phân quyền lại cho nhân viên
export const UpdateEmployeeRoleBodySchema = z
  .object({
    role: z.enum(['ADMIN', 'MANAGER', 'CASHIER', 'BARISTA', 'STOREKEEPER']),
  })
  .strict()

// 5. Đổi mật khẩu
export const ChangePasswordBodySchema = z
  .object({
    oldPassword: z.string().min(1, 'Vui lòng nhập mật khẩu cũ'),
    newPassword: z.string().min(6, 'Mật khẩu mới tối thiểu 6 ký tự'),
    confirmPassword: z.string().min(6, 'Xác nhận mật khẩu tối thiểu 6 ký tự'),
  })
  .strict()
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu mới và xác nhận mật khẩu không khớp nhau',
        path: ['confirmPassword'],
      })
    }
  })

export type RegisterBodyType = z.infer<typeof RegisterBodySchema>
export type LoginBodyType = z.infer<typeof LoginBodySchema>
export type CreateEmployeeBodyType = z.infer<typeof CreateEmployeeBodySchema>
export type UpdateEmployeeRoleBodyType = z.infer<typeof UpdateEmployeeRoleBodySchema>
export type ChangePasswordBodyType = z.infer<typeof ChangePasswordBodySchema>