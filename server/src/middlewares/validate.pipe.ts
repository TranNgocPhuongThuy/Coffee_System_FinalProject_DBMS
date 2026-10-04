import { Request, Response, NextFunction } from 'express'
import { ZodError, ZodSchema } from 'zod'

type RequestPart = 'body' | 'query' | 'params'

/**
 * Middleware validate request schema
 * @param schema Zod Schema cần kiểm tra
 * @param part Bộ phận request cần validate (mặc định là 'body')
 */
export const validatePipe = (schema: ZodSchema, part: RequestPart = 'body') => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate và gán lại dữ liệu đã qua tiền xử lý / ép kiểu của Zod
      req[part] = await schema.parseAsync(req[part])
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        // Gom các lỗi validate thành object chi tiết
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }))

        console.log(formattedErrors)
        res.status(400).json({
          success: false,
          message: 'Dữ liệu yêu cầu không hợp lệ.',
          errors: formattedErrors,
        })
        return
      }

      next(error)
    }
  }
}