const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/send-waitlist-demo', async (req, res) => {
  const { toEmail, name } = req.body;

  if (!toEmail || !name) {
    return res.status(400).json({ sent: false, message: 'Missing email or name' });
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
      from: `"RatLab Waitlist" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `Verify your email for RatLab Waitlist`,
      html: `
        <p>Hi ${name},</p>
        <p>We're thrilled you're interested in joining RatLab.</p>
        <p>This email is to <strong>verify that your email address is valid</strong> before we add you to the waitlist.</p>
        <p>If you intended to join, no further action is needed. You're all set!</p>
        <p>If this wasn't you, feel free to ignore this message.</p>
        <p>– Team RatLab</p>
      `
    });

    return res.status(200).json({ sent: true });
  } catch (error) {
    console.error('Waitlist email failed:', error.message);
    return res.status(500).json({ sent: false });
  }
});

module.exports = router;
