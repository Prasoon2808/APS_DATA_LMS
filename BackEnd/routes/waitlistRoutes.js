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
async function sendWaitlistEmail(email) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: '"RatLab Team" <ratlab.edu@gmail.com>',
    to: email,
    subject: 'You Are on the Waitlist!',
    html: `
      <h3>Welcome to RatLab</h3>
      <p>You have been successfully added to our waitlist.</p>
      <p>Your ID and password will be sent to this email once the platform is launched.</p>
      <br/>
      <p>- RatLab Team</p>
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

    const existingUser = await UserData.findOne({ email: userEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User email already exists in waitlist' });
    }


    await UserData.create({ ...user, verified: true, role: 'waitlist' });
    await sendWaitlistEmail(userEmail);

    res.status(200).json({
      success: true,
      message: 'You have been added to our waitlist. Your ID and password will be emailed when we launch.'
    });

  } catch (err) {
    console.error('[WAITLIST SUBMIT ERROR]', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// Email function for approval
async function sendApprovalEmail(email, password) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: '"RatLab Team" <ratlab.edu@gmail.com>',
    to: email,
    subject: 'You Have Been Approved!',
    html: `
      <h3>Congratulations!</h3>
      <p>Your waitlist request has been approved.</p>
      <p><b>Login ID:</b> ${email}</p>
      <p><b>Password:</b> ${password}</p>
      <p>Please login to the platform using these credentials.</p>
      <br/>
      <p>– RatLab Team</p>
    `
  };

  await transporter.sendMail(mailOptions);
}

// Approve a waitlisted user
router.post('/waitlist/approve/:id', async (req, res) => {
  try {
    const waitlistUser = await UserData.findById(req.params.id);
    if (!waitlistUser) {
      return res.status(404).json({ message: 'User not found in waitlist' });
    }

    const password = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Copy all waitlist fields to AuthUser
    await AuthUser.create({
      email: waitlistUser.email,
      password: hashedPassword,
      role: 'student',

      name: waitlistUser.name,
      gender: waitlistUser.gender,
      country: waitlistUser.country,
      countryCode: waitlistUser.countryCode,
      affiliation: waitlistUser.affiliation,
      institution: waitlistUser.institution,
      verified: true,
    });

    await sendApprovalEmail(waitlistUser.email, password);
    await UserData.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User approved, credentials sent, and removed from waitlist.'
    });

  } catch (err) {
    console.error('[WAITLIST APPROVAL ERROR]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/waitlist/all', async (req, res) => {
  try {
    const users = await UserData.find({ role: 'waitlist' });
    res.status(200).json(users);
  } catch (err) {
    console.error('[GET WAITLIST]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;
