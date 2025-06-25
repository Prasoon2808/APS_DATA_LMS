const express = require('express');
const router = express.Router();
const EventRegistration = require('../models/EventRegistration');

router.post('/register', async (req, res) => {
  const { name, gender, email, country, phone, institution, refCode } = req.body.user;

  if (!name || !gender || !email || !country || !phone || !institution || !refCode) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // ✅ Check for existing email
    const existing = await EventRegistration.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'This email is already registered.' });
    }

    const newRegistration = new EventRegistration({ name, gender, email, country, phone, institution, refCode });
    await newRegistration.save();
    res.json({ success: true });
  } catch (err) {
    console.error('Event registration error:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const allRegs = await EventRegistration.find().sort({ createdAt: -1 });
    res.json(allRegs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching data' });
  }
});


module.exports = router;
