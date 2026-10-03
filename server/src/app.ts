import express, { Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import pinoHttp from 'pino-http'
import { errorFilter } from './middlewares/error.filter'

// Import router của 6 phân hệ
import { posRouter } from './modules/pos-order/pos.routes'
import { menuRouter } from './modules/menu-catalog/menu.routes'
import { inventoryRouter } from './modules/inventory-bom/inventory.routes'
import { kdsRouter } from './modules/kds/kds.routes'
import { customerLoyaltyRouter } from './modules/customer-loyalty/customer-loyalty.routes'
import { reportRouter } from './modules/report/report.routes'
import { authRouter } from './modules/auth/auth.routes'

export const createApp = (): Express => {
  const app = express()

  // 1. Global Middlewares
  app.use(helmet())
  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(pinoHttp({ autoLogging: false }))

  // 2. Health check
  app.get('/api/health', (_, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date() })
  })

  // 3. Đăng ký các phân hệ (Prefix API v1)
  app.use('/api/v1/auth', authRouter)
  app.use('/api/v1/pos', posRouter)
  app.use('/api/v1/menu', menuRouter)
  app.use('/api/v1/inventory', inventoryRouter)
  app.use('/api/v1/kds', kdsRouter)
  app.use('/api/v1/loyalty', customerLoyaltyRouter)
  app.use('/api/v1/reports', reportRouter)

  // 4. Global Error Filter (Bắt lỗi T-SQL và runtime, luôn để cuối cùng)
  app.use(errorFilter)

  return app
}