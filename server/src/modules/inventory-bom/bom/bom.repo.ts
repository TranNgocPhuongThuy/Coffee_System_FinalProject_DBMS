import { getPool, sql } from '@/config/database'
import { RecipeBOMType, ToppingBOMType } from './bom.schema'

export class BOMRepo {
  async getAllRecipeDetails(variantId?: number) {
    const pool = await getPool()
    const req = pool.request()
    let query = 'SELECT * FROM v_ProductRecipeDetails'
    if (variantId) {
      req.input('variantId', sql.Int, variantId)
      query = `SELECT * FROM v_ProductRecipeDetails WHERE variantId = @variantId`
    }
    const result = await req.query(query)
    return result.recordset
  }

  async getToppingBOM(toppingId?: number) {
    const pool = await getPool()
    const req = pool.request()
    let query = `
      SELECT tb.toppingId, t.name AS toppingName, tb.ingredientId, i.name AS ingredientName, tb.consumedQuantity, i.unit
      FROM ToppingBOM tb
      JOIN Topping t ON tb.toppingId = t.id
      JOIN Ingredient i ON tb.ingredientId = i.id
    `
    if (toppingId) {
      req.input('toppingId', sql.Int, toppingId)
      query += ` WHERE tb.toppingId = @toppingId`
    }
    const result = await req.query(query)
    return result.recordset
  }

  async upsertRecipeBOM(data: RecipeBOMType) {
    const pool = await getPool()
    const req = pool.request()
    req.input('variantId', sql.Int, data.variantId)
    req.input('ingredientId', sql.Int, data.ingredientId)
    req.input('consumedQuantity', sql.Decimal(18, 4), data.consumedQuantity)
    return await req.execute('sp_UpsertRecipeBOM')
  }

  async upsertToppingBOM(data: ToppingBOMType) {
    const pool = await getPool()
    const req = pool.request()
    req.input('toppingId', sql.Int, data.toppingId)
    req.input('ingredientId', sql.Int, data.ingredientId)
    req.input('consumedQuantity', sql.Decimal(18, 4), data.consumedQuantity)

    const query = `
      MERGE INTO ToppingBOM AS target
      USING (SELECT @toppingId AS toppingId, @ingredientId AS ingredientId) AS src
      ON (target.toppingId = src.toppingId AND target.ingredientId = src.ingredientId)
      WHEN MATCHED THEN
        UPDATE SET target.consumedQuantity = @consumedQuantity
      WHEN NOT MATCHED THEN
        INSERT (toppingId, ingredientId, consumedQuantity) VALUES (@toppingId, @ingredientId, @consumedQuantity);
    `
    return await req.query(query)
  }

  async deleteRecipeBOM(variantId: number, ingredientId: number) {
    const pool = await getPool()
    const req = pool.request()
    req.input('variantId', sql.Int, variantId)
    req.input('ingredientId', sql.Int, ingredientId)
    const result = await req.query('DELETE FROM RecipeBOM WHERE variantId = @variantId AND ingredientId = @ingredientId')
    return result.rowsAffected[0]
  }
}