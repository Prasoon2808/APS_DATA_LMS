const express = require('express');
const router = express.Router();
const EventRegistration = require('../models/EventRegistration');

// Register user for event
router.post('/register', async (req, res) => {
  const {
    name,
    gender,
    email,
    country,
    phone,
    institution,
    refCode,
    eventId
  } = req.body.user;

  if (!name || !gender || !email || !country || !phone || !institution || !refCode || !eventId) {
    return res.status(400).json({ message: 'All fields including eventId are required.' });
  }

  try {
    // Check if email already registered for this event
    const existing = await EventRegistration.findOne({ email, eventId });
    if (existing) {
      return res.status(409).json({ message: 'This email is already registered for this event.' });
    }

    const newRegistration = new EventRegistration({
      eventId,
      name,
      gender,
      email,
      country,
      phone,
      institution,
      refCode
    });

    await newRegistration.save();
    res.json({ success: true });
  } catch (err) {
    console.error('Event registration error:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// Get all registrations (not filtered)
router.get('/all', async (req, res) => {
  try {
    const allRegs = await EventRegistration.find().sort({ createdAt: -1 });
    res.json(allRegs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching data' });
  }
});

// ✅ Filtered registrations by eventId
router.get('/by-event/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const regs = await EventRegistration.find({ eventId }).sort({ createdAt: -1 });
    res.json(regs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching registrations by event.' });
  }
});

module.exports = router;
