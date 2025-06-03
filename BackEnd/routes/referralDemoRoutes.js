const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/send-referral-demo', async (req, res) => {
  const { toEmail, referredBy } = req.body;

  if (!toEmail || !referredBy) {
    return res.status(400).json({ sent: false, message: 'Missing email or referrer name' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: `"RatLab Team" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `You've been referred by ${referredBy}`,
      html: `
        <p>Hello,</p>
        <p><strong>${referredBy}</strong> has entered your email as a referral while registering on RatLab.</p>
        <p>If this wasn't intended, you can ignore this email.</p>
        <p>Thank you,<br/>RatLab Team</p>
      `
    });

    return res.status(200).json({ sent: true });
  } catch (error) {
    console.error('Referral email failed:', error.message);
    return res.status(500).json({ sent: false });
  }
});

module.exports = router;
