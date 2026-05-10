const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
  try {
    const items = await Cart.getByUserId(req.user.id);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get cart' });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    await Cart.addToCart(req.user.id, productId, qty);
    res.json({ message: 'Item added to cart' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

exports.updateCartQty = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    await Cart.updateQty(req.user.id, productId, qty);
    res.json({ message: 'Cart updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    await Cart.removeFromCart(req.user.id, productId);
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
};
