const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const UserData = require('../models/userData');
const AuthUser = require('../models/user');
const Referral = require('../models/referral');

// Utility: Random 10-character alphanumeric password
function generateRandomPassword(length = 10) {
  return crypto.randomBytes(length).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, length);
}

// Utility: Send email to user
async function sendWelcomeEmail(email, password) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,      // change
      pass: process.env.EMAIL_PASS,         // change
    },
  });

  const mailOptions = {
    from: '"RatLab Team" <ratlab.edu@gmail.com>',
    to: email,
    subject: 'Your Waitlist ID is Created',
    html: `
      <h3>Welcome to RatLab</h3>
      <p>Your account has been created successfully.</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Password:</b> ${password}</p>
      <p>You can now log in using these credentials.</p>
      <br/>
      <p>– RatLab Team</p>
    `
  };

  await transporter.sendMail(mailOptions);
}

// POST /api/waitlist/submit
router.post('/submit', async (req, res) => {
  const { user, referrals } = req.body;

  if (!user || !referrals || referrals.length !== 5) {
    return res.status(400).json({ message: 'Incomplete form submission' });
  }

  try {
    const userEmail = user.email.toLowerCase().trim();
    const referralEmails = referrals.map(r => r.email.toLowerCase().trim());

    // 1. Ensure user email is not already in auth table
    const existingAuth = await AuthUser.findOne({ email: userEmail });
    if (existingAuth) {
      return res.status(400).json({ message: 'User email already exists' });
    }

    // 2. Check for duplicate referral emails in input
    const hasDuplicates = new Set(referralEmails).size !== referralEmails.length;
    if (hasDuplicates) {
      return res.status(400).json({ message: 'Duplicate emails found in referral list' });
    }

    // 3. Check if any referral email equals user email
    if (referralEmails.includes(userEmail)) {
      return res.status(400).json({ message: 'Referral email cannot match user email' });
    }

    // 4. Check if referral emails already exist
    const usedReferrals = await Referral.find({ email: { $in: referralEmails } });
    if (usedReferrals.length > 0) {
      return res.status(400).json({
        message: 'Referral email(s) already registered: ' +
          usedReferrals.map(r => r.email).join(', ')
      });
    }

    // 5. Save userData to waitlist DB
    const newUserData = await UserData.create({ ...user, verified: true });

    // 6. Create auth user with password
    const randomPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    await AuthUser.create({
      email: userEmail,
      password: hashedPassword,
      role: 'student'
    });

    // 7. Save referrals with referrerEmail
    const referralsWithRef = referrals.map(r => ({
      ...r,
      referrerEmail: userEmail,
      verified: false
    }));
    await Referral.insertMany(referralsWithRef);

    // 8. Send welcome email
    await sendWelcomeEmail(userEmail, randomPassword);

    res.status(200).json({ success: true, message: 'Waitlist entry successful' });

  } catch (err) {
    console.error('[WAITLIST SUBMIT ERROR]', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

module.exports = router;
