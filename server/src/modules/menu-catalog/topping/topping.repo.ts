import pool from '../../../config/database';

export class ToppingRepository {
  async findAll() {
    const { rows } = await pool.query(`SELECT * FROM topping_options ORDER BY name ASC`);
    return rows;
  }

  async findById(id: string) {
    const { rows } = await pool.query(`SELECT * FROM topping_options WHERE id = $1`, [id]);
    return rows[0] || null;
  }

  async create(data: { name: string; price: number; isAvailable?: boolean }) {
    const query = `
      INSERT INTO topping_options (name, price, is_available)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [data.name, data.price, data.isAvailable ?? true]);
    return rows[0];
  }

  async update(id: string, data: Partial<{ name: string; price: number; isAvailable: boolean }>) {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.name !== undefined) { fields.push(`name = $${idx++}`); values.push(data.name); }
    if (data.price !== undefined) { fields.push(`price = $${idx++}`); values.push(data.price); }
    if (data.isAvailable !== undefined) { fields.push(`is_available = $${idx++}`); values.push(data.isAvailable); }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const query = `UPDATE topping_options SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  }

  async delete(id: string) {
    const res = await pool.query(`DELETE FROM topping_options WHERE id = $1`, [id]);
    return (res.rowCount ?? 0) > 0;
  }
}