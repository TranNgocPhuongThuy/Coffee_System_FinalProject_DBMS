import { getPool, sql } from '@/config/database'
import {
  CreateProductType,
  FilterProductQueryType,
  UpdateProductType,
} from './product.schema'

export interface ProductVariantRow {
  id: number
  productId: number
  size: 'S' | 'M' | 'L' | 'XL'
  price: number
  createdAt: Date
  updatedAt?: Date | null
}

export interface ProductDetail {
  id: number
  categoryId: number
  categoryName?: string
  name: string
  description?: string | null
  image?: string | null
  status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK'
  createdAt: Date
  updatedAt?: Date | null
  priceRange?: string | null
  variants: ProductVariantRow[]
}

export class ProductRepository {
  /**
   * Lấy danh sách sản phẩm kèm mảng biến thể (Dùng FOR JSON PATH - 1 query duy nhất)
   */
  async findAll(filter: FilterProductQueryType): Promise<ProductDetail[]> {
    const pool = await getPool()
    const req = pool.request()

    const conditions: string[] = ['p.deletedAt IS NULL']

    if (filter.categoryId) {
      req.input('categoryId', sql.Int, filter.categoryId)
      conditions.push('p.categoryId = @categoryId')
    }

    if (filter.status) {
      req.input('status', sql.NVarChar(50), filter.status)
      conditions.push('p.status = @status')
    }

    if (typeof filter?.search === 'string' && filter.search.trim() !== '') {
      req.input('search', sql.NVarChar(200), `%${filter.search.trim()}%`)
      conditions.push('p.name LIKE @search')
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`

    const query = `
      SELECT 
        p.id, 
        p.categoryId, 
        c.name AS categoryName, 
        p.name, 
        p.description, 
        p.image, 
        p.status, 
        p.createdAt, 
        p.updatedAt,
        dbo.fnc_GetProductPriceRange(p.id) AS priceRange,
        (
          SELECT id, productId, size, price, createdAt, updatedAt
          FROM ProductVariant pv
          WHERE pv.productId = p.id AND pv.deletedAt IS NULL
          ORDER BY pv.price ASC
          FOR JSON PATH
        ) AS variantsJson
      FROM Product p
      LEFT JOIN Category c ON p.categoryId = c.id
      ${whereClause}
      ORDER BY p.id DESC
    `

    const result = await req.query<any>(query)

    return result.recordset.map((row) => ({
      id: row.id,
      categoryId: row.categoryId,
      categoryName: row.categoryName,
      name: row.name,
      description: row.description,
      image: row.image,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      priceRange: row.priceRange,
      variants: row.variantsJson ? JSON.parse(row.variantsJson) : [],
    }))
  }

  /**
   * Lấy chi tiết sản phẩm theo ID
   */
  async findById(id: number): Promise<ProductDetail | null> {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)

    const query = `
      SELECT 
        p.id, 
        p.categoryId, 
        c.name AS categoryName, 
        p.name, 
        p.description, 
        p.image, 
        p.status, 
        p.createdAt, 
        p.updatedAt,
        dbo.fnc_GetProductPriceRange(p.id) AS priceRange,
        (
          SELECT id, productId, size, price, createdAt, updatedAt
          FROM ProductVariant pv
          WHERE pv.productId = p.id AND pv.deletedAt IS NULL
          ORDER BY pv.price ASC
          FOR JSON PATH
        ) AS variantsJson
      FROM Product p
      LEFT JOIN Category c ON p.categoryId = c.id
      WHERE p.id = @id AND p.deletedAt IS NULL
    `

    const result = await req.query<any>(query)
    if (result.recordset.length === 0) return null

    const row = result.recordset[0]
    return {
      id: row.id,
      categoryId: row.categoryId,
      categoryName: row.categoryName,
      name: row.name,
      description: row.description,
      image: row.image,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      priceRange: row.priceRange,
      variants: row.variantsJson ? JSON.parse(row.variantsJson) : [],
    }
  }

  /**
   * Tìm sản phẩm theo tên (Phục vụ check trùng tên)
   */
  async findByName(name: string, excludeId?: number): Promise<any | null> {
    const pool = await getPool()
    const req = pool.request()
    req.input('name', sql.NVarChar(200), name)

    let query = `SELECT id FROM Product WHERE name = @name AND deletedAt IS NULL`
    if (excludeId) {
      req.input('excludeId', sql.Int, excludeId)
      query += ` AND id != @excludeId`
    }

    const result = await req.query(query)
    return result.recordset[0] || null
  }

  /**
   * Tạo món mới kèm các biến thể size
   */
  async createWithVariants(data: CreateProductType): Promise<ProductDetail> {
    const pool = await getPool()
    const req = pool.request()

    req.input('categoryId', sql.Int, data.categoryId)
    req.input('name', sql.NVarChar(200), data.name)
    req.input('description', sql.NVarChar(sql.MAX), data.description || null)
    req.input('image', sql.NVarChar(500), data.image || null)
    req.input('variantsJson', sql.NVarChar(sql.MAX), JSON.stringify(data.variants))
    req.output('newProductId', sql.Int)

    const result = await req.execute('sp_CreateProductWithVariants')
    const newId = result.output.newProductId

    return (await this.findById(newId))!
  }

  /**
   * Cập nhật món dùng cơ chế Smart Upsert (An toàn tuyệt đối cho Khóa ngoại)
   */
  async update(id: number, data: UpdateProductType): Promise<ProductDetail | null> {
    const pool = await getPool()
    const transaction = new sql.Transaction(pool)
    await transaction.begin()

    try {
      const updateClauses: string[] = ['updatedAt = SYSDATETIME()']
      const updateReq = new sql.Request(transaction)
      updateReq.input('id', sql.Int, id)

      if (data.categoryId !== undefined) {
        updateReq.input('categoryId', sql.Int, data.categoryId)
        updateClauses.push('categoryId = @categoryId')
      }
      if (data.name !== undefined) {
        updateReq.input('name', sql.NVarChar(200), data.name)
        updateClauses.push('name = @name')
      }
      if (data.description !== undefined) {
        updateReq.input('description', sql.NVarChar(sql.MAX), data.description)
        updateClauses.push('description = @description')
      }
      if (data.image !== undefined) {
        updateReq.input('image', sql.NVarChar(500), data.image)
        updateClauses.push('image = @image')
      }
      if (data.status !== undefined) {
        updateReq.input('status', sql.NVarChar(50), data.status)
        updateClauses.push('status = @status')
      }

      const productUpdateResult = await updateReq.query(`
        UPDATE Product
        SET ${updateClauses.join(', ')}
        WHERE id = @id AND deletedAt IS NULL
      `)

      if (productUpdateResult.rowsAffected[0] === 0) {
        await transaction.rollback()
        return null
      }

      // Smart Upsert biến thể Size
      if (data.variants && data.variants.length > 0) {
        const incomingSizes = data.variants.map((v) => v.size)

        // 1. Xóa mềm các size không còn nằm trong danh sách mới
        const softDelReq = new sql.Request(transaction)
        softDelReq.input('productId', sql.Int, id)
        const sizeParams = incomingSizes.map((s, idx) => {
          softDelReq.input(`s${idx}`, sql.NVarChar(20), s)
          return `@s${idx}`
        })

        await softDelReq.query(`
          UPDATE ProductVariant
          SET deletedAt = SYSDATETIME(), updatedAt = SYSDATETIME()
          WHERE productId = @productId 
            AND deletedAt IS NULL 
            AND size NOT IN (${sizeParams.join(',')})
        `)

        // 2. Loop qua danh sách mới: Cập nhật nếu đã có, Thêm mới nếu chưa có
        for (const v of data.variants) {
          const upsertReq = new sql.Request(transaction)
          upsertReq.input('productId', sql.Int, id)
          upsertReq.input('size', sql.NVarChar(20), v.size)
          upsertReq.input('price', sql.Decimal(18, 2), v.price)

          await upsertReq.query(`
            IF EXISTS (SELECT 1 FROM ProductVariant WHERE productId = @productId AND size = @size AND deletedAt IS NULL)
            BEGIN
              UPDATE ProductVariant 
              SET price = @price, updatedAt = SYSDATETIME()
              WHERE productId = @productId AND size = @size AND deletedAt IS NULL
            END
            ELSE IF EXISTS (SELECT 1 FROM ProductVariant WHERE productId = @productId AND size = @size AND deletedAt IS NOT NULL)
            BEGIN
              UPDATE ProductVariant 
              SET price = @price, deletedAt = NULL, updatedAt = SYSDATETIME()
              WHERE productId = @productId AND size = @size
            END
            ELSE
            BEGIN
              INSERT INTO ProductVariant (productId, size, price, createdAt)
              VALUES (@productId, @size, @price, SYSDATETIME())
            END
          `)
        }
      }

      await transaction.commit()
      return await this.findById(id)
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  /**
   * Đếm số lượng đơn hàng đang chờ hoặc đang pha chế (PENDING, PREPARING) có chứa sản phẩm này
   */
  async countActiveOrdersByProductId(productId: number): Promise<number> {
    const pool = await getPool()
    const req = pool.request()
    req.input('productId', sql.Int, productId)
    const result = await req.query<{ count: number }>(`
      SELECT COUNT(1) AS count
      FROM OrderDetail od
      INNER JOIN ProductVariant pv ON od.variantId = pv.id
      WHERE pv.productId = @productId
        AND od.itemStatus IN ('PENDING', 'PREPARING')
    `)
    return result.recordset[0]?.count || 0
  }

  /**
   * Xóa mềm Sản phẩm và toàn bộ Biến thể liên quan (Đảm bảo tính nguyên tử)
   */
  async softDelete(id: number): Promise<boolean> {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)

    const result = await req.query(`
      SET XACT_ABORT ON;
      BEGIN TRANSACTION;

      UPDATE Product
      SET deletedAt = SYSDATETIME(), updatedAt = SYSDATETIME()
      WHERE id = @id AND deletedAt IS NULL;

      UPDATE ProductVariant
      SET deletedAt = SYSDATETIME(), updatedAt = SYSDATETIME()
      WHERE productId = @id AND deletedAt IS NULL;

      COMMIT TRANSACTION;
    `)

    return (result.rowsAffected[0] ?? 0) > 0
  }

  /**
   * Lấy danh sách thực đơn tổng hợp trực tiếp từ Khung nhìn v_MenuProductCatalog
   * kết hợp định dạng khoảng giá bằng Hàm fnc_GetProductPriceRange
   */
  async getCatalog(categoryId?: number): Promise<any[]> {
    const pool = await getPool()
    const req = pool.request()
    let query = `
      SELECT 
        productId, categoryId, categoryName, productName, 
        description, image, productStatus, totalVariants, 
        minPrice, maxPrice, availableSizes,
        dbo.fnc_GetProductPriceRange(productId) AS priceRange
      FROM v_MenuProductCatalog
    `

    if (categoryId) {
      req.input('categoryId', sql.Int, categoryId)
      query += ` WHERE categoryId = @categoryId`
    }

    query += ` ORDER BY categoryName ASC, productName ASC`
    const result = await req.query(query)
    return result.recordset
  }

  /**
   * Gọi trực tiếp Hàm vô hướng fnc_GetProductPriceRange
   */
  async getPriceRange(productId: number): Promise<string> {
    const pool = await getPool()
    const req = pool.request()
    req.input('productId', sql.Int, productId)
    const result = await req.query<{ priceRange: string }>(`
      SELECT dbo.fnc_GetProductPriceRange(@productId) AS priceRange
    `)
    return result.recordset[0]?.priceRange || 'Chưa có giá'
  }
}
