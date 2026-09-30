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
  variants: ProductVariantRow[]
}

export class ProductRepository {
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

    if (filter.search) {
      req.input('search', sql.NVarChar(200), `%${filter.search}%`)
      conditions.push('p.name LIKE @search')
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`

    // 1. Lấy danh sách sản phẩm
    const productQuery = `
      SELECT 
        p.id, 
        p.categoryId, 
        c.name AS categoryName, 
        p.name, 
        p.description, 
        p.image, 
        p.status, 
        p.createdAt, 
        p.updatedAt
      FROM Product p
      JOIN Category c ON p.categoryId = c.id
      ${whereClause}
      ORDER BY p.id DESC
    `
    const productsRes = await req.query<any>(productQuery)
    const products = productsRes.recordset

    if (products.length === 0) return []

    // 2. Lấy các biến thể kích cỡ của các sản phẩm trên
    const productIds = products.map((p) => p.id)
    const variantsRes = await pool.request().query<ProductVariantRow>(`
      SELECT id, productId, size, price, createdAt, updatedAt
      FROM ProductVariant
      WHERE productId IN (${productIds.join(',')}) AND deletedAt IS NULL
      ORDER BY price ASC
    `)

    const variantsByProductId = variantsRes.recordset.reduce((acc: Record<number, ProductVariantRow[]>, v) => {
      if (!acc[v.productId]) acc[v.productId] = []
      acc[v.productId].push(v)
      return acc
    }, {})

    return products.map((p) => ({
      ...p,
      variants: variantsByProductId[p.id] || [],
    }))
  }

  async findById(id: number): Promise<ProductDetail | null> {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)

    const productRes = await req.query<any>(`
      SELECT 
        p.id, 
        p.categoryId, 
        c.name AS categoryName, 
        p.name, 
        p.description, 
        p.image, 
        p.status, 
        p.createdAt, 
        p.updatedAt
      FROM Product p
      JOIN Category c ON p.categoryId = c.id
      WHERE p.id = @id AND p.deletedAt IS NULL
    `)

    if (productRes.recordset.length === 0) return null
    const product = productRes.recordset[0]

    const variantsRes = await pool.request().input('productId', sql.Int, id).query<ProductVariantRow>(`
      SELECT id, productId, size, price, createdAt, updatedAt
      FROM ProductVariant
      WHERE productId = @productId AND deletedAt IS NULL
      ORDER BY price ASC
    `)

    return {
      ...product,
      variants: variantsRes.recordset,
    }
  }

  async findByName(name: string): Promise<any | null> {
    const pool = await getPool()
    const req = pool.request()
    req.input('name', sql.NVarChar(200), name)
    const result = await req.query(`
      SELECT id FROM Product WHERE name = @name AND deletedAt IS NULL
    `)
    return result.recordset[0] || null
  }

  async createWithVariants(data: CreateProductType): Promise<ProductDetail> {
    const pool = await getPool()
    const transaction = new sql.Transaction(pool)
    await transaction.begin()

    try {
      const productReq = new sql.Request(transaction)
      productReq.input('categoryId', sql.Int, data.categoryId)
      productReq.input('name', sql.NVarChar(200), data.name)
      productReq.input('description', sql.NVarChar(sql.MAX), data.description || null)
      productReq.input('image', sql.NVarChar(500), data.image || null)
      productReq.input('status', sql.NVarChar(50), data.status || 'ACTIVE')

      const productRes = await productReq.query(`
        INSERT INTO Product (categoryId, name, description, image, status, createdAt)
        OUTPUT INSERTED.id, INSERTED.categoryId, INSERTED.name, INSERTED.description, INSERTED.image, INSERTED.status, INSERTED.createdAt
        VALUES (@categoryId, @name, @description, @image, @status, SYSDATETIME())
      `)
      const newProduct = productRes.recordset[0]
      const createdVariants: ProductVariantRow[] = []

      for (const v of data.variants) {
        const variantReq = new sql.Request(transaction)
        variantReq.input('productId', sql.Int, newProduct.id)
        variantReq.input('size', sql.NVarChar(20), v.size)
        variantReq.input('price', sql.Decimal(18, 2), v.price)

        const variantRes = await variantReq.query<ProductVariantRow>(`
          INSERT INTO ProductVariant (productId, size, price, createdAt)
          OUTPUT INSERTED.id, INSERTED.productId, INSERTED.size, INSERTED.price, INSERTED.createdAt, INSERTED.updatedAt
          VALUES (@productId, @size, @price, SYSDATETIME())
        `)
        createdVariants.push(variantRes.recordset[0])
      }

      await transaction.commit()

      return {
        ...newProduct,
        variants: createdVariants,
      }
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

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

      await updateReq.query(`
        UPDATE Product
        SET ${updateClauses.join(', ')}
        WHERE id = @id AND deletedAt IS NULL
      `)

      // Nếu có cập nhật biến thể size
      if (data.variants && data.variants.length > 0) {
        const delVarReq = new sql.Request(transaction)
        delVarReq.input('productId', sql.Int, id)
        await delVarReq.query(`DELETE FROM ProductVariant WHERE productId = @productId`)

        for (const v of data.variants) {
          const addVarReq = new sql.Request(transaction)
          addVarReq.input('productId', sql.Int, id)
          addVarReq.input('size', sql.NVarChar(20), v.size)
          addVarReq.input('price', sql.Decimal(18, 2), v.price)
          await addVarReq.query(`
            INSERT INTO ProductVariant (productId, size, price, createdAt)
            VALUES (@productId, @size, @price, SYSDATETIME())
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

  async softDelete(id: number): Promise<boolean> {
    const pool = await getPool()
    const req = pool.request()
    req.input('id', sql.Int, id)

    const result = await req.query(`
      UPDATE Product
      SET deletedAt = SYSDATETIME(), updatedAt = SYSDATETIME()
      WHERE id = @id AND deletedAt IS NULL;

      UPDATE ProductVariant
      SET deletedAt = SYSDATETIME(), updatedAt = SYSDATETIME()
      WHERE productId = @id AND deletedAt IS NULL;
    `)

    return (result.rowsAffected[0] ?? 0) > 0
  }
}