const pool = require('../config/db');

class Order {
  static async createOrder(orderData, items) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const { user_id, total_amt, shipping_address, city, postal_code, phone, payment_method } = orderData;

      const [orderResult] = await connection.query(
        `INSERT INTO orders (user_id, total_amount, shipping_address, city, postal_code, phone, payment_method) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user_id, total_amt, shipping_address, city, postal_code, phone, payment_method]
      );

      const orderId = orderResult.insertId;

      for (const item of items) {
        await connection.query(
          'INSERT INTO order_items (order_id, product_id, product_title, product_price, qty) VALUES (?, ?, ?, ?, ?)',
          [orderId, item.product_id, item.product_title, item.product_price, item.qty]
        );
      }

      await connection.commit();
      return orderId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getByUserId(userId) {
    const [rows] = await pool.query('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC', [userId]);
    return rows;
  }

  static async getOrderDetails(orderId) {
    const [order] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (order.length === 0) return null;

    const [items] = await pool.query(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [orderId]
    );

    return { ...order[0], items };
  }

  static async getAllOrders() {
    const [rows] = await pool.query(`
      SELECT o.*, u.first_name, u.last_name, u.email 
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      ORDER BY o.id DESC
    `);
    return rows;
  }

  static async updateStatus(id, status) {
    await pool.query('UPDATE orders SET order_status = ? WHERE id = ?', [status, id]);
  }
}

module.exports = Order;
