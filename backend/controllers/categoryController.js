const Category = require('../models/Category');

exports.getAllCategories = async (req, res) => {
  try {
    const cats = await Category.findAll();
    res.json(cats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load categories' });
  }
};
