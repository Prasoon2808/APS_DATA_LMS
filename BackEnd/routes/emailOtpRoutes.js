const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const emailOtpStore = {};

router.post('/send-email-otp', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  emailOtpStore[email] = otp;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    to: email,
    subject: 'Your OTP for Verification',
    html: `<h2>Your OTP is: ${otp}</h2>`
  });

  res.send({ sent: true });
});

router.post('/verify-email-otp', (req, res) => {
  const { email, otp } = req.body;
  if (emailOtpStore[email] == otp) {
    delete emailOtpStore[email];
    return res.send({ verified: true });
  }
  res.status(400).send({ verified: false });
});

module.exports = router;
