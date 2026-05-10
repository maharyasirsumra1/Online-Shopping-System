const express = require('express');
const pool = require('../config/db');
const router = express.Router();

router.get('/product/:productId', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT review_id, product_id, name, email, review, datetime, rating FROM reviews WHERE product_id = ? ORDER BY datetime DESC', [req.params.productId]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load reviews' });
  }
});

router.post('/', async (req, res) => {
  const { productId, name, email, review, rating } = req.body;
  if (!productId || !name || !email || !review || rating == null) {
    return res.status(400).json({ error: 'Missing review fields' });
  }

  try {
    await pool.query(
      'INSERT INTO reviews (product_id, name, email, review, datetime, rating) VALUES (?, ?, ?, ?, NOW(), ?)',
      [productId, name, email, review, rating]
    );
    res.json({ message: 'Review submitted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

module.exports = router;
