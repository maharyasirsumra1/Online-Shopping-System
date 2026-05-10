const express = require('express');
const pool = require('../db');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT w.id, p.product_id, p.product_title, p.product_price, p.product_desc, p.product_image
       FROM wishlist w
       JOIN products p ON p.product_id = w.p_id
       WHERE w.user_id = ?`,
      [req.user.user_id]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load wishlist' });
  }
});

router.post('/', authenticate, async (req, res) => {
  const { productId } = req.body;
  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  try {
    const [existing] = await pool.query('SELECT id FROM wishlist WHERE p_id = ? AND user_id = ?', [productId, req.user.user_id]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Product already in wishlist' });
    }

    await pool.query('INSERT INTO wishlist (p_id, user_id, ip_add) VALUES (?, ?, ?)', [productId, req.user.user_id, '']);
    res.json({ message: 'Added to wishlist' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add wishlist item' });
  }
});

router.delete('/:productId', authenticate, async (req, res) => {
  try {
    await pool.query('DELETE FROM wishlist WHERE p_id = ? AND user_id = ?', [req.params.productId, req.user.user_id]);
    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove wishlist item' });
  }
});

module.exports = router;
