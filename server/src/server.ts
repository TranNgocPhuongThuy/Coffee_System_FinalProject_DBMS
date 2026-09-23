import { createServer } from 'http'
import { createApp } from './app'
import { envConfig } from './config/env.config'
import { getPool, closePool } from './config/database'

async function bootstrap() {
  // 1. Đảm bảo kết nối SQL Server sẵn sàng trước khi lắng nghe request
  await getPool()

  const app = createApp()
  const server = createServer(app)

  server.listen(envConfig.PORT, () => {
    console.log(`🚀 CoffeeShop Backend Server đang chạy tại: http://localhost:${envConfig.PORT}`)
  })

  // 2. Xử lý tắt server sạch sẽ khi nhấn Ctrl + C
  const handleShutdown = async (signal: string) => {
    console.log(`\nNhận tín hiệu ${signal}. Đang đóng ứng dụng...`)
    server.close(async () => {
      console.log('HTTP Server đã đóng tiếp nhận request mới.')
      await closePool()
      process.exit(0)
    })
  }

  process.on('SIGINT', () => handleShutdown('SIGINT'))
  process.on('SIGTERM', () => handleShutdown('SIGTERM'))
}

bootstrap().catch((err) => {
  console.error('Không thể khởi chạy Server:', err)
  process.exit(1)
})