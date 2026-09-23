import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),

  DB_USER: z.string().min(1, 'Chưa cấu hình DB_USER'),
  DB_PASSWORD: z.string().min(1, 'Chưa cấu hình DB_PASSWORD'),
  DB_SERVER: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(1433),
  DB_NAME: z.string().min(1, 'Chưa cấu hình DB_NAME'),

  JWT_SECRET: z.string().min(1, 'Chưa cấu hình JWT_SECRET'),
  JWT_EXPIRES_IN: z.string().default('1d'),
})

const parseResult = envSchema.safeParse(process.env)

if (!parseResult.success) {
  console.error('❌ Lỗi cấu hình file .env:')
  console.error(parseResult.error.flatten().fieldErrors)
  process.exit(1)
}

export const envConfig = parseResult.data