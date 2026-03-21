const express = require('express');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth(), async (req, res) => {
  try {
    const { items, totalAmount, location, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount,
      location,
      notes,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: 'Failed to place order', error: err.message });
  }
});

router.get('/mine', auth(), async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load orders', error: err.message });
  }
});

router.get('/', auth('admin'), async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load all orders', error: err.message });
  }
});

router.patch('/:id/status', auth('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update status', error: err.message });
  }
});

module.exports = router;

