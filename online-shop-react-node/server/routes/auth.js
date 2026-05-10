const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const dotenv = require('dotenv');

dotenv.config();
const router = express.Router();

const generateToken = (user) => {
  return jwt.sign({ user_id: user.user_id, email: user.email }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '7d',
  });
};

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, mobile, address1, address2 } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [exists] = await pool.query('SELECT user_id FROM user_info WHERE email = ?', [email]);
    if (exists.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO user_info (first_name, last_name, email, password, mobile, address1, address2) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [firstName, lastName, email, hashedPassword, mobile || '', address1 || '', address2 || '']
    );

    const user = {
      user_id: result.insertId,
      first_name: firstName,
      last_name: lastName,
      email,
    };

    res.json({ user, token: generateToken(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM user_info WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    const passwordMatches = await bcrypt.compare(password, user.password);
    const plainMatch = password === user.password;
    if (!passwordMatches && !plainMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      user: {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        mobile: user.mobile,
        address1: user.address1,
        address2: user.address2,
      },
      token: generateToken(user),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

const { authenticate } = require('../middleware/auth');

router.get('/me', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT user_id, first_name, last_name, email, mobile, address1, address2 FROM user_info WHERE user_id = ?', [req.user.user_id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load user' });
  }
});

module.exports = router;
