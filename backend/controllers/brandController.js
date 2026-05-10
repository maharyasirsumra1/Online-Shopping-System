const Brand = require('../models/Brand');

exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load brands' });
  }
};
