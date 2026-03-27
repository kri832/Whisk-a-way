const express = require('express');
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');

const router = express.Router();

// Public route to save contact responses
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const contact = await Contact.create({ name, email, phone, message });
    res.status(201).json(contact);
  } catch (err) {
    res.status(400).json({ message: 'Failed to send message', error: err.message });
  }
});

// Admin-only route to fetch all contact responses
router.get('/', auth('admin'), async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load contact responses', error: err.message });
  }
});

module.exports = router;
