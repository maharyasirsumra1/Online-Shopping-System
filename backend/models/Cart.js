const pool = require('../config/db');

class Cart {
  static async getByUserId(userId) {
    const query = `
      SELECT c.id as cart_id, c.qty, p.id as product_id, p.title as product_title, p.price as product_price, p.image as product_image
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `;
    const [rows] = await pool.query(query, [userId]);
    return rows;
  }

  static async addToCart(userId, productId, qty = 1) {
    const [existing] = await pool.query('SELECT * FROM cart WHERE user_id = ? AND product_id = ?', [userId, productId]);
    if (existing.length > 0) {
      await pool.query('UPDATE cart SET qty = qty + ? WHERE user_id = ? AND product_id = ?', [qty, userId, productId]);
    } else {
      await pool.query('INSERT INTO cart (user_id, product_id, qty) VALUES (?, ?, ?)', [userId, productId, qty]);
    }
  }

  static async updateQty(userId, productId, qty) {
    await pool.query('UPDATE cart SET qty = ? WHERE user_id = ? AND product_id = ?', [qty, userId, productId]);
  }

  static async removeFromCart(userId, productId) {
    await pool.query('DELETE FROM cart WHERE user_id = ? AND product_id = ?', [userId, productId]);
  }

  static async clearCart(userId) {
    await pool.query('DELETE FROM cart WHERE user_id = ?', [userId]);
  }
}

module.exports = Cart;
