const express = require('express');
const router = express.Router();
const Template = require('../models/EmailTemplate');
const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

// Utility: Sleep for a given time
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ------------------- Upload Template -------------------
router.post('/upload-template', async (req, res) => {
  const { name, subject, html } = req.body;
  if (!name || !subject || !html)
    return res.status(400).json({ message: 'All fields are required.' });

  try {
    const existing = await Template.findOne({ name });
    if (existing)
      return res.status(409).json({ message: 'Template already exists' });

    await new Template({ name, subject, html }).save();
    res.status(201).json({ message: 'Template uploaded successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to upload template.' });
  }
});

// ------------------- Get All Templates -------------------
router.get('/templates', async (req, res) => {
  try {
    const templates = await Template.find({}, 'name');
    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch templates' });
  }
});

// ------------------- Get Single Template -------------------
router.get('/templates/:name', async (req, res) => {
  try {
    const template = await Template.findOne({ name: req.params.name });
    if (!template)
      return res.status(404).json({ message: 'Template not found' });
    res.json(template);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch template' });
  }
});

// ------------------- Update Template -------------------
router.put('/templates/:name', async (req, res) => {
  const { name, subject, html } = req.body;
  if (!name || !subject || !html)
    return res.status(400).json({ message: 'All fields are required.' });

  try {
    const updated = await Template.findOneAndUpdate(
      { name: req.params.name },
      { name, subject, html },
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ message: 'Template not found' });
    res.json({ message: 'Template updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update template.' });
  }
});

// ------------------- Delete Template -------------------
router.delete('/templates/:name', async (req, res) => {
  try {
    const deleted = await Template.findOneAndDelete({ name: req.params.name });
    if (!deleted)
      return res.status(404).json({ message: 'Template not found' });
    res.json({ message: 'Template deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete template.' });
  }
});

// ------------------- Send Bulk Email -------------------
router.post('/send-bulk-email', async (req, res) => {
  const { emailList, templateName } = req.body;

  if (!emailList || !Array.isArray(emailList) || emailList.length === 0)
    return res.status(400).json({ message: 'Email list is required.' });

  const template = await Template.findOne({ name: templateName });
  if (!template)
    return res.status(400).json({ message: 'Invalid template selected.' });

  const failedList = [];
  const successList = [];

  for (let i = 0; i < emailList.length; i++) {
    const { Email, Name } = emailList[i];

    try {
      const { data, error } = await resend.emails.send({
        from: 'Team EDU[LAB] <hello@edu-lab.in>', // Change after domain verification
        to: [Email],
        subject: template.subject,
        html: template.html.replace(/{{name}}/g, Name || 'there')
      });

      if (error) {
        console.error(`❌ Failed for ${Email}`, error);
        failedList.push({ Email, error });
      } else {
        console.log(`✅ Sent to ${Email}`);
        successList.push({ Email });
      }
    } catch (err) {
      console.error(`❌ Unexpected error for ${Email}:`, err);
      failedList.push({ Email, error: 'Unexpected error' });
    }

    // 2-second delay between each mail
    if (i < emailList.length - 1) await sleep(2000);
  }

  res.json({
    message: 'Bulk email process completed.',
    successCount: successList.length,
    failureCount: failedList.length,
    failedList
  });
});

module.exports = router;
