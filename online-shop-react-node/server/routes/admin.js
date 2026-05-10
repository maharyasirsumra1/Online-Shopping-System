const express = require('express');
const crypto = require('crypto');
const pool = require('../db');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM admin_info WHERE admin_email = ? OR admin_name = ?', [email, email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const admin = rows[0];
    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
    if (hashedPassword !== admin.admin_password) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const token = jwt.sign({ admin_id: admin.admin_id, email: admin.admin_email }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '7d',
    });

    res.json({ admin: { admin_id: admin.admin_id, admin_name: admin.admin_name, admin_email: admin.admin_email }, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Admin login failed' });
  }
});

module.exports = router;
