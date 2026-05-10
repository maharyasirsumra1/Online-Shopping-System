const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const { category, brand, search, page = 1, limit = 24 } = req.query;
    const offset = (page - 1) * limit;

    const { data, total } = await Product.findAll({
      category,
      brand,
      search,
      limit,
      offset
    });

    res.json({
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load products' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load product details' });
  }
};

// Admin CRUD
exports.createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };
    if (productData.name) {
      productData.title = productData.name;
      delete productData.name;
    }
    if (req.file) {
      productData.image = req.file.filename;
    }
    const productId = await Product.create(productData);
    res.status(201).json({ message: 'Product created', productId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productData = { ...req.body };
    if (productData.name) {
      productData.title = productData.name;
      delete productData.name;
    }
    if (req.file) {
      productData.image = req.file.filename;
    }
    await Product.update(req.params.id, productData);
    res.json({ message: 'Product updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.delete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
