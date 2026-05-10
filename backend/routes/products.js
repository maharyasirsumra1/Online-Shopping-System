const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
// const { authenticate, isAdmin } = require('../middleware/auth'); // Add admin check later

const upload = require('../middleware/upload');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Admin routes (should be protected)
router.post('/', upload.single('thumbnail'), productController.createProduct);
router.put('/:id', upload.single('thumbnail'), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
