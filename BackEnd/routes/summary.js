const express = require('express');
const router = express.Router();
const SessionSummary = require('../models/SessionSummary');
const getEmbedHtml = require('../utils/getEmbedHtml');

router.get('/', async (req, res) => {
  const sessions = await SessionSummary.find().sort({ sessionDate: -1 });
  res.json(sessions);
});

router.get('/:id', async (req, res) => {
  const session = await SessionSummary.findById(req.params.id);
  res.json(session);
});

router.post('/', async (req, res) => {
  try {
    console.log('🟡 Incoming summary POST:', req.body);

    const userId = req.body.userId;
    if (!userId) throw new Error('Missing userId');

    const body = { ...req.body };

    if (body.recordingLink && body.recordingLink.length < 20) {
      console.log('🔵 Fetching embed for video ID:', body.recordingLink);
      const embed = await getEmbedHtml(body.recordingLink, userId);
      if (embed) {
        body.recordingLink = embed;
        console.log('🟢 Embed URL:', embed);
      } else {
        throw new Error('Failed to generate YouTube embed (maybe token missing?)');
      }
    }

    const summary = new SessionSummary(body);
    await summary.save();
    console.log('✅ Summary saved!');
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error in POST /session-summary:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  await SessionSummary.findByIdAndUpdate(req.params.id, req.body);
  res.json({ success: true });
});

module.exports = router;
