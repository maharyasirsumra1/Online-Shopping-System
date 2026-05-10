const pool = require('../config/db');

class Category {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM categories');
    return rows;
  }
}

module.exports = Category;
