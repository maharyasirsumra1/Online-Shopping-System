const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middleware/auth');

// Public admin login
router.post('/login', adminController.login);

// Protected admin routes
router.use(authenticate); // Should also check if req.user.isAdmin
router.get('/stats', adminController.getStats);
router.get('/users', adminController.getAllUsers);

module.exports = router;
