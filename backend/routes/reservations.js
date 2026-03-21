const express = require('express');
const Reservation = require('../models/Reservation');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth(), async (req, res) => {
  try {
    const data = {
      ...req.body,
      user: req.user.id,
    };
    const reservation = await Reservation.create(data);
    res.status(201).json(reservation);
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Failed to create reservation', error: err.message });
  }
});

router.get('/mine', auth(), async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(reservations);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to load reservations', error: err.message });
  }
});

router.get('/', auth('admin'), async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to load all reservations', error: err.message });
  }
});

router.patch('/:id/status', auth('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.json(reservation);
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Failed to update reservation', error: err.message });
  }
});

module.exports = router;

