const pool = require('../config/db');

class Brand {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM brands');
    return rows;
  }
}

module.exports = Brand;
