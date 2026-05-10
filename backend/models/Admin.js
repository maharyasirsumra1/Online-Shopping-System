const pool = require('../config/db');
const bcrypt = require('bcrypt');

class Admin {
  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM admin_info WHERE admin_email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM admin_info WHERE admin_id = ?', [id]);
    return rows[0];
  }

  // Admin login using legacy MD5 check (optional) or just use bcrypt for new ones.
  // For this exercise, I'll assume we want to support the legacy admin but ideally upgrade it.
}

module.exports = Admin;
