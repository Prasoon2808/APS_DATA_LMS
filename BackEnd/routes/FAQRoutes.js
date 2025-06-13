const express = require('express');
const router = express.Router();
const FAQ = require('../models/FAQ');

// Create FAQ
router.post('/create', async (req, res) => {
  try {
    const { question, answer } = req.body;
    const newFAQ = new FAQ({ question, answer });
    await newFAQ.save();
    res.status(201).json({ message: 'FAQ created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all FAQs
router.get('/all', async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ createdAt: -1 });
    res.status(200).json(faqs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
