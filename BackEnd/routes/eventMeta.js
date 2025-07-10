const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Create new event
router.post('/create', async (req, res) => {
  const { eventId, eventName, posterUrl, inputFields } = req.body;

  if (!eventId || !eventName || !posterUrl || !Array.isArray(inputFields)) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const exists = await Event.findOne({ eventId });
    if (exists) {
      return res.status(409).json({ message: 'Event ID already exists.' });
    }

    const newEvent = new Event({ eventId, eventName, posterUrl, inputFields });
    await newEvent.save();
    res.json({ success: true, message: 'Event created successfully.' });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ message: 'Server error while creating event.' });
  }
});

// Get all events
router.get('/all', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events.' });
  }
});

module.exports = router;
