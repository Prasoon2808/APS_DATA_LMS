const express = require('express');
const router = express.Router();
const SessionSummary = require('../models/SessionSummary');

router.get('/', async (req, res) => {
  const sessions = await SessionSummary.find().sort({ sessionDate: -1 });
  res.json(sessions);
});

router.get('/:id', async (req, res) => {
  const session = await SessionSummary.findById(req.params.id);
  res.json(session);
});

router.post('/', async (req, res) => {
  const summary = new SessionSummary(req.body);
  await summary.save();
  res.json({ success: true });
});

router.put('/:id', async (req, res) => {
  await SessionSummary.findByIdAndUpdate(req.params.id, req.body);
  res.json({ success: true });
});

module.exports = router;
