import { z } from 'zod'

export const LoginBodySchema = z
  .object({
    identifier: z.string().min(1, 'Vui lòng nhập tên đăng nhập hoặc số điện thoại'),
    password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
    userType: z.enum(['EMPLOYEE', 'CUSTOMER']).default('EMPLOYEE'),
  })
  .strict()

export const SetupPasswordBodySchema = z
  .object({
    phoneNumber: z
      .string()
      .regex(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/, 'Số điện thoại không hợp lệ'),
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

export type LoginBodyType = z.infer<typeof LoginBodySchema>
export type SetupPasswordBodyType = z.infer<typeof SetupPasswordBodySchema>
export type ChangePasswordBodyType = z.infer<typeof ChangePasswordBodySchema>