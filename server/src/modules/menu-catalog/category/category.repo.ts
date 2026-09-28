import pool from '../../../config/database';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at?: Date;
}

export class CategoryRepository {
  async findAll(): Promise<Category[]> {
    const query = `
      SELECT id, name, slug, description, sort_order, is_active 
      FROM categories 
      ORDER BY sort_order ASC, name ASC
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  async findById(id: string): Promise<Category | null> {
    const query = `SELECT * FROM categories WHERE id = $1`;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const query = `SELECT * FROM categories WHERE slug = $1`;
    const { rows } = await pool.query(query, [slug]);
    return rows[0] || null;
  }

  async create(data: Partial<Category>): Promise<Category> {
    const query = `
      INSERT INTO categories (name, slug, description, sort_order, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [data.name, data.slug, data.description || null, data.sort_order ?? 0, data.is_active ?? true];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async update(id: string, data: Partial<Category>): Promise<Category | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.name !== undefined) { fields.push(`name = $${idx++}`); values.push(data.name); }
    if (data.slug !== undefined) { fields.push(`slug = $${idx++}`); values.push(data.slug); }
    if (data.description !== undefined) { fields.push(`description = $${idx++}`); values.push(data.description); }
    if (data.sort_order !== undefined) { fields.push(`sort_order = $${idx++}`); values.push(data.sort_order); }
    if (data.is_active !== undefined) { fields.push(`is_active = $${idx++}`); values.push(data.is_active); }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const query = `
      UPDATE categories 
      SET ${fields.join(', ')} 
      WHERE id = $${idx} 
      RETURNING *
    `;
    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const query = `DELETE FROM categories WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}