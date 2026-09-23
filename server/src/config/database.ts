import sql from 'mssql'
import { envConfig } from './env.config'

const sqlConfig: sql.config = {
  user: envConfig.DB_USER,
  password: envConfig.DB_PASSWORD,
  database: envConfig.DB_NAME,
  server: envConfig.DB_SERVER,
  port: envConfig.DB_PORT,
  pool: {
    max: 15,
    min: 2,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false, // Để false khi chạy SQL Server cục bộ không cài chứng chỉ SSL
    trustServerCertificate: true, // Tránh lỗi self-signed cert
  },
}

let pool: sql.ConnectionPool | null = null

export const getPool = async (): Promise<sql.ConnectionPool> => {
  if (pool && pool.connected) {
    return pool
  }
  try {
    pool = await new sql.ConnectionPool(sqlConfig).connect()
    console.log(`✅ Kết nối thành công tới Database [${envConfig.DB_NAME}] trên SQL Server!`)
    return pool
  } catch (error) {
    console.error('❌ Lỗi khi kết nối tới Microsoft SQL Server:', error)
    throw error
  }
}

export const closePool = async (): Promise<void> => {
  if (pool) {
    await pool.close()
    console.log('🔌 Đã ngắt kết nối SQL Server Connection Pool.')
  }
}

export { sql }