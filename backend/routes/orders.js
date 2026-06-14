const express = require('express');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth(), async (req, res) => {
  try {
    const { items, totalAmount, location, notes, customerName, paymentMethod } = req.body;

    console.log('Received payment method:', paymentMethod);

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    const order = await Order.create({
      user: req.user.id,
      customerName,
      items,
      totalAmount,
      location,
      notes,
      paymentMethod: paymentMethod || 'cash',
    });

    console.log('Saved order with payment method:', order.paymentMethod);

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
    const { page = 1, limit = 15, date, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // Build filter query
    const filter = {};
    
    // Date filter - if date is provided, filter orders for that specific date
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      filter.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination, filtering, and sorting
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalOrders: total,
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
      },
    });
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
