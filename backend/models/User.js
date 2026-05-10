const pool = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(userData) {
    const { first_name, last_name, email, password, phone, address, city, zip, role = 'user' } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (first_name, last_name, email, password, phone, address, city, zip, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email, hashedPassword, phone, address, city, zip, role]
    );
    return result.insertId;
  }

  static async update(id, userData) {
    const { first_name, last_name, phone, address, city, zip } = userData;
    await pool.query(
      'UPDATE users SET first_name = ?, last_name = ?, phone = ?, address = ?, city = ?, zip = ? WHERE id = ?',
      [first_name, last_name, phone, address, city, zip, id]
    );
  }
}

module.exports = User;
