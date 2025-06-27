const express = require('express');
const router = express.Router();
const Template = require('../models/EmailTemplate');
const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

// Upload template
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

// Get all templates (only name for list)
router.get('/templates', async (req, res) => {
  try {
    const templates = await Template.find({}, 'name');
    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch templates' });
  }
});

// Get a single template by name
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

// Update a template by name
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

// Delete a template by name
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

// Send email using a saved template
router.post('/send-bulk-email', async (req, res) => {
  const { emailList, templateName } = req.body;
  const template = await Template.findOne({ name: templateName });

  if (!template)
    return res.status(400).json({ message: 'Invalid template selected' });

  const { Email, Name } = emailList[0]; // sending to 1 user per call

  try {
    const { data, error } = await resend.emails.send({
      from: 'Team EDU[LAB] <hello@edu-lab.in>', // change after domain verification
      to: [Email],
      subject: template.subject,
      html: template.html.replace(/{{name}}/g, Name || 'there')
    });

    if (error) {
      console.error(`❌ Failed for ${Email}`, error);
      return res.status(400).json({ message: `Failed for ${Email}`, error });
    }

    res.json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error('Resend error:', err);
    res.status(500).json({ message: 'Unexpected error occurred' });
  }
});

module.exports = router;
