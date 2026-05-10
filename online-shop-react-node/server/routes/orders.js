const express = require('express');
const pool = require('../db');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  const { items, billing, payment } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart items are required' });
  }
  if (!billing || !payment) {
    return res.status(400).json({ error: 'Billing and payment information are required' });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const trxId = `TRX-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const totalAmt = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
    const totalCount = items.reduce((sum, item) => sum + Number(item.quantity), 0);

    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, product_id, qty, trx_id, p_status) VALUES (?, ?, ?, ?, ?)',
      [req.user.user_id, items[0].productId, items[0].quantity, trxId, 'Pending']
    );

    const orderId = orderResult.insertId;
    const orderInsertPromises = items.slice(1).map((item) => {
      return connection.query('INSERT INTO orders (order_id, user_id, product_id, qty, trx_id, p_status) VALUES (?, ?, ?, ?, ?, ?)', [
        orderId,
        req.user.user_id,
        item.productId,
        item.quantity,
        trxId,
        'Pending',
      ]);
    });

    await Promise.all(orderInsertPromises);

    const detailPromises = items.map((item) => {
      return connection.query('INSERT INTO order_products (order_id, product_id, qty, amt) VALUES (?, ?, ?, ?)', [
        orderId,
        item.productId,
        item.quantity,
        item.price * item.quantity,
      ]);
    });

    await Promise.all(detailPromises);

    await connection.query(
      'INSERT INTO orders_info (order_id, user_id, f_name, email, address, city, state, zip, cardname, cardnumber, expdate, prod_count, total_amt, cvv) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        orderId,
        req.user.user_id,
        billing.firstName + ' ' + billing.lastName,
        billing.email,
        billing.address,
        billing.city,
        billing.state,
        billing.zip,
        payment.cardName,
        payment.cardNumber,
        payment.expDate,
        totalCount,
        totalAmt,
        payment.cvv,
      ]
    );

    await connection.commit();
    res.json({ orderId, trxId, totalAmt, totalCount });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    connection.release();
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.order_id, o.trx_id, o.p_status, oi.total_amt, oi.prod_count, oi.email, oi.address, oi.city, oi.state, oi.zip
       FROM orders o
       JOIN orders_info oi ON o.order_id = oi.order_id
       WHERE o.user_id = ?
       GROUP BY o.order_id
       ORDER BY o.order_id DESC`,
      [req.user.user_id]
    );
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load orders' });
  }
});

module.exports = router;
