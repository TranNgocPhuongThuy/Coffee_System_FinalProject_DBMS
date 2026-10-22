import sql from 'mssql'
import { AsyncLocalStorage } from 'async_hooks'
import { envConfig } from './env.config'
import { syncDatabaseObjects } from './dbInit'

// 1. Tạo Storage lưu Role của Request hiện tại (Không làm lẫn lộn giữa các Request đồng thời)
export const roleStorage = new AsyncLocalStorage<string>()

// 2. Cấu hình tài khoản đăng nhập tương ứng 5 Role trong SQL Server
const ROLE_CREDENTIALS: Record<string, { user: string; pass: string }> = {
  ADMIN: { user: 'login_manager', pass: 'Manager@123' },
  MANAGER: { user: 'login_manager', pass: 'Manager@123' },
  CASHIER: { user: 'login_cashier', pass: 'Cashier@123' },
  BARISTA: { user: 'login_barista', pass: 'Barista@123' },
  STOREKEEPER: { user: 'login_storekeeper', pass: 'Storekeeper@123' },
  CUSTOMER: { user: 'login_customer', pass: 'Customer@123' },
}

// 3. Quản lý danh sách các Pool đang chạy
const pools: Map<string, sql.ConnectionPool> = new Map()
let defaultPool: sql.ConnectionPool | null = null

const createConfig = (user: string, password: string): sql.config => ({
  user,
  password,
  database: envConfig.DB_NAME,
  server: envConfig.DB_SERVER,
  port: envConfig.DB_PORT,
  pool: {
    max: 10,
    min: 1,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
})

// 4. Hàm lấy Connection Pool thông minh theo Role
export const getPool = async (): Promise<sql.ConnectionPool> => {
  // Lấy Role từ ngữ cảnh của Request hiện tại
  const currentRole = roleStorage.getStore()

  // TH1: Request có xác thực Role (CASHIER, BARISTA, STOREKEEPER, MANAGER, CUSTOMER)
  if (currentRole && ROLE_CREDENTIALS[currentRole]) {
    const creds = ROLE_CREDENTIALS[currentRole]
    let rolePool = pools.get(currentRole)

    if (rolePool && rolePool.connected) {
      return rolePool
    }

    try {
      rolePool = await new sql.ConnectionPool(createConfig(creds.user, creds.pass)).connect()
      pools.set(currentRole, rolePool)
      return rolePool
    } catch (error) {
      console.error(`❌ Lỗi kết nối Pool cho Role [${currentRole}]:`, error)
      // Fallback về defaultPool nếu lỗi kết nối
    }
  }

  // TH2: Request Public (Chưa đăng nhập, gọi Sync DB, hoặc Fallback)
  if (defaultPool && defaultPool.connected) {
    return defaultPool
  }

  try {
    defaultPool = await new sql.ConnectionPool(
      createConfig(envConfig.DB_USER, envConfig.DB_PASSWORD)
    ).connect()
    console.log(`✅ Kết nối thành công tới Database [${envConfig.DB_NAME}] (Default Pool)!`)
    await syncDatabaseObjects(defaultPool)
    return defaultPool
  } catch (error) {
    console.error('❌ Lỗi kết nối Default Pool:', error)
    throw error
  }
}

// 5. Đóng toàn bộ Pool khi dừng Server
export const closePool = async (): Promise<void> => {
  for (const [role, p] of pools.entries()) {
    if (p.connected) {
      await p.close()
      console.log(`🔌 Đã đóng Pool của Role [${role}]`)
    }
  }
  if (defaultPool && defaultPool.connected) {
    await defaultPool.close()
    console.log('🔌 Đã đóng Default Pool.')
  }
}

export { sql }