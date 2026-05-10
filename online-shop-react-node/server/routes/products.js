const express = require('express');
const pool = require('../db');
const router = express.Router();

const buildFilter = (params) => {
  const filters = [];
  const values = [];
  if (params.category) {
    filters.push('p.product_cat = ?');
    values.push(params.category);
  }
  if (params.brand) {
    filters.push('p.product_brand = ?');
    values.push(params.brand);
  }
  if (params.search) {
    filters.push('(p.product_title LIKE ? OR p.product_desc LIKE ? OR p.product_keywords LIKE ?)');
    const keyword = `%${params.search}%`;
    values.push(keyword, keyword, keyword);
  }
  return { filters, values };
};

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 24;
  const offset = (page - 1) * limit;

  try {
    const { filters, values } = buildFilter(req.query);
    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const countQuery = `SELECT COUNT(*) AS total FROM products p ${whereClause}`;
    const [countRows] = await pool.query(countQuery, values);
    const total = countRows[0].total;

    const query = `
      SELECT p.product_id, p.product_title, p.product_price, p.product_desc, p.product_image, p.product_keywords,
             c.cat_id, c.cat_title, b.brand_id, b.brand_title
      FROM products p
      JOIN categories c ON p.product_cat = c.cat_id
      JOIN brands b ON p.product_brand = b.brand_id
      ${whereClause}
      ORDER BY p.product_id DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.query(query, [...values, limit, offset]);
    res.json({ data: rows, pagination: { page, limit, total } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load products' });
  }
});

router.get('/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    const [rows] = await pool.query(
      `SELECT p.product_id, p.product_title, p.product_price, p.product_desc, p.product_image, p.product_keywords,
              c.cat_id, c.cat_title, b.brand_id, b.brand_title,
              IFNULL(ROUND(AVG(r.rating), 1), 0) AS average_rating,
              COUNT(r.review_id) AS review_count
       FROM products p
       JOIN categories c ON p.product_cat = c.cat_id
       JOIN brands b ON p.product_brand = b.brand_id
       LEFT JOIN reviews r ON r.product_id = p.product_id
       WHERE p.product_id = ?
       GROUP BY p.product_id`,
      [productId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load product details' });
  }
});

module.exports = router;
