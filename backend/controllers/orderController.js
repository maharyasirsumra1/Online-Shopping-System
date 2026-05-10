const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await Cart.getByUserId(userId);
    if (items.length === 0) return res.status(400).json({ error: 'Cart is empty' });

    const total_amt = items.reduce((sum, item) => sum + item.product_price * item.qty, 0);

    const orderId = await Order.createOrder({
      ...req.body,
      user_id: userId,
      total_amt
    }, items);

    await Cart.clearCart(userId);

    res.status(201).json({ message: 'Order placed successfully', orderId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to place order' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.getByUserId(req.user.id);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get orders' });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.getOrderDetails(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Check if order belongs to user (or is admin)
    if (order.user_id !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get order details' });
  }
};
