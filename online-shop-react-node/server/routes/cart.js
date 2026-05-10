const express = require('express');
const pool = require('../db');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.id, c.qty, p.product_id, p.product_title, p.product_price, p.product_desc, p.product_image
       FROM cart c
       JOIN products p ON p.product_id = c.p_id
       WHERE c.user_id = ?`,
      [req.user.user_id]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load cart items' });
  }
});

router.post('/', authenticate, async (req, res) => {
  const { productId, qty } = req.body;
  if (!productId || qty == null) {
    return res.status(400).json({ error: 'Product ID and quantity are required' });
  }

  try {
    const [existing] = await pool.query('SELECT id, qty FROM cart WHERE p_id = ? AND user_id = ?', [productId, req.user.user_id]);
    if (existing.length > 0) {
      const newQty = existing[0].qty + parseInt(qty, 10);
      await pool.query('UPDATE cart SET qty = ? WHERE id = ?', [newQty, existing[0].id]);
      return res.json({ message: 'Quantity updated', quantity: newQty });
    }

    await pool.query('INSERT INTO cart (p_id, user_id, qty, ip_add) VALUES (?, ?, ?, ?)', [productId, req.user.user_id, qty, '']);
    res.json({ message: 'Item added to cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

router.put('/:productId', authenticate, async (req, res) => {
  const productId = req.params.productId;
  const { qty } = req.body;
  if (qty == null) {
    return res.status(400).json({ error: 'Quantity is required' });
  }

  try {
    await pool.query('UPDATE cart SET qty = ? WHERE p_id = ? AND user_id = ?', [qty, productId, req.user.user_id]);
    res.json({ message: 'Cart updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

router.delete('/:productId', authenticate, async (req, res) => {
  try {
    await pool.query('DELETE FROM cart WHERE p_id = ? AND user_id = ?', [req.params.productId, req.user.user_id]);
    res.json({ message: 'Item removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

module.exports = router;
