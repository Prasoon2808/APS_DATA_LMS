const express = require('express');
const router = express.Router();
const EventRegistration = require('../models/EventRegistration');
const { multerMid, uploadToGCS } = require('../middleware/uploadEvent');

// Register user for event
router.post('/register', multerMid.single('pdfFile'), uploadToGCS, async (req, res) => {
  try {
    const { name, gender, email, country, phone, institution, refCode, eventId, category } = req.body;

    if (!eventId) return res.status(400).json({ message: 'Event ID is required.' });

    // Check duplicate
    const existing = await EventRegistration.findOne({ email, eventId });
    if (existing) return res.status(409).json({ message: 'Already registered for this event.' });

    const pdfUrl = req.file?.cloudStoragePublicUrl || null;

    const newReg = new EventRegistration({
      eventId,
      name,
      gender,
      email,
      country,
      phone,
      institution,
      refCode,
      category,
      pdfUrl
    });

    await newReg.save();
    res.json({ success: true, pdfUrl });
  } catch (err) {
    console.error('Error registering:', err);
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
