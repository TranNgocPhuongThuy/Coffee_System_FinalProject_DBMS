import pool from '../../../config/database';

export class ProductRepository {
  async findAll(categoryId?: string, isAvailable?: boolean) {
    let query = `
      SELECT p.*, c.name as category_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
    `;
    const params: any[] = [];

    if (categoryId) {
      params.push(categoryId);
      query += ` AND p.category_id = $${params.length}`;
    }
    if (isAvailable !== undefined) {
      params.push(isAvailable);
      query += ` AND p.is_available = $${params.length}`;
    }

    query += ` ORDER BY p.created_at DESC`;
    const { rows } = await pool.query(query, params);
    return rows;
  }

  async findById(id: string) {
    const productQuery = `SELECT * FROM products WHERE id = $1 AND is_active = true`;
    const variantsQuery = `SELECT * FROM product_variants WHERE product_id = $1`;
    const toppingsQuery = `
      SELECT t.* 
      FROM topping_options t
      JOIN product_toppings pt ON t.id = pt.topping_id
      WHERE pt.product_id = $1 AND t.is_available = true
    `;

    const productRes = await pool.query(productQuery, [id]);
    if (productRes.rows.length === 0) return null;

    const variantsRes = await pool.query(variantsQuery, [id]);
    const toppingsRes = await pool.query(toppingsQuery, [id]);

    return {
      ...productRes.rows[0],
      variants: variantsRes.rows,
      toppings: toppingsRes.rows,
    };
  }

  async findByCode(code: string) {
    const query = `SELECT * FROM products WHERE code = $1`;
    const { rows } = await pool.query(query, [code]);
    return rows[0] || null;
  }

  async createWithDetails(data: any) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const productQuery = `
        INSERT INTO products (category_id, code, name, base_price, image_url, description, is_available)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      const productValues = [
        data.categoryId, data.code, data.name, data.basePrice,
        data.imageUrl || null, data.description || null, data.isAvailable ?? true
      ];
      const productRes = await client.query(productQuery, productValues);
      const product = productRes.rows[0];

      for (const v of data.variants) {
        await client.query(
          `INSERT INTO product_variants (product_id, size_name, price_adjustment, is_default)
           VALUES ($1, $2, $3, $4)`,
          [product.id, v.sizeName, v.priceAdjustment, v.isDefault ?? false]
        );
      }

      if (data.toppingIds && data.toppingIds.length > 0) {
        for (const toppingId of data.toppingIds) {
          await client.query(
            `INSERT INTO product_toppings (product_id, topping_id) VALUES ($1, $2)`,
            [product.id, toppingId]
          );
        }
      }

      await client.query('COMMIT');
      return product;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async updateAvailability(id: string, isAvailable: boolean) {
    const query = `UPDATE products SET is_available = $1 WHERE id = $2 RETURNING *`;
    const { rows } = await pool.query(query, [isAvailable, id]);
    return rows[0] || null;
  }

  async softDelete(id: string) {
    const query = `UPDATE products SET is_active = false WHERE id = $1`;
    const res = await pool.query(query, [id]);
    return (res.rowCount ?? 0) > 0;
  }
}