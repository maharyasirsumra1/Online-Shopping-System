const pool = require('../config/db');

class Product {
  static async findAll({ category, search, limit = 24, offset = 0 }) {
    const filters = [];
    const values = [];

    if (category) {
      filters.push('p.category_id = ?');
      values.push(category);
    }
    if (search) {
      filters.push('(p.title LIKE ? OR p.description LIKE ?)');
      const keyword = `%${search}%`;
      values.push(keyword, keyword);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) AS total FROM products p ${whereClause}`;
    const [countRows] = await pool.query(countQuery, values);
    const total = countRows[0].total;

    const query = `
      SELECT p.*, p.title as name, p.image as thumbnail, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY p.id DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.query(query, [...values, parseInt(limit), parseInt(offset)]);
    return { data: rows, total };
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT p.*, p.title as name, p.image as thumbnail, c.name as category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async create(productData) {
    const { title, category_id, price, description, image, stock = 10 } = productData;
    const [result] = await pool.query(
      'INSERT INTO products (title, category_id, price, description, image, stock) VALUES (?, ?, ?, ?, ?, ?)',
      [title, category_id, price, description, image, stock]
    );
    return result.insertId;
  }

  static async update(id, productData) {
    const { title, category_id, price, description, image, stock } = productData;
    await pool.query(
      'UPDATE products SET title = ?, category_id = ?, price = ?, description = ?, image = ?, stock = ? WHERE id = ?',
      [title, category_id, price, description, image, stock, id]
    );
  }

  static async delete(id) {
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
  }
}

module.exports = Product;
