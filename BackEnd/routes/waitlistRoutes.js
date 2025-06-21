const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const UserData = require('../models/userData');
const AuthUser = require('../models/user');
const Referral = require('../models/referral');

// Utility: Generate random password
function generateRandomPassword(length = 10) {
  return crypto.randomBytes(length).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, length);
}

// Utility: Generate referral code
function generateReferralCode(referrer) {
  const year = new Date().getFullYear().toString().slice(-2);
  const country = (referrer.country || 'XXX').slice(0, 3).toUpperCase();

  const nameParts = referrer.name.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts[1] || '';
  let initials = lastName ? firstName[0] + lastName[0] : firstName.slice(0, 2);

  const random = Math.floor(10 + Math.random() * 90);
  return `${year}${country}${initials.toUpperCase()}${random}`;
}

// Utility: Send waitlist email
async function sendWaitlistEmail(email,userName) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: '"Team EDU[LAB]" <ratlab.edu@gmail.com>',
    to: email,
    subject: 'You Are on the Waitlist!',
    html: `
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>You Are on the Waitlist!</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    /* Reset & base */
    body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table { border-collapse:collapse!important; width:100%!important; }
    img { border:0; height:auto; line-height:100%; outline:none; text-decoration:none; }
    body { margin:0!important; padding:0!important; width:100%!important; font-family:Arial,sans-serif; background-color:#f9f9f9; }
    
    /* Container */
    .container { width:100%!important; max-width:600px; margin:0 auto; background-color:#ffffff; }
    
    /* Greeting */
    .greeting { padding:20px; font-size:14px; color:#333333; }
    
    /* Hero */
    .hero {
      background: linear-gradient(135deg, rgba(168,205,61,0.15) 0%, rgba(168,205,61,0) 100%);
      padding:40px 20px; text-align:center;
    }
    .hero h1 { margin:0; font-size:32px; color:#333333; }
    .hero p { margin:10px 0 0; color:#555555; font-size:16px; }
    
    /* Stats */
    .stats { width:100%; text-align:center; padding:20px 0; }
    .stats td { width:50%; }
    .stat-card {
      background-color:#fafafa; border:1px solid #eee;
      border-radius:4px; padding:20px; margin:5px 0;
    }
    .stat-card h2 { margin:0; font-size:28px; color:#a8cd3d; }
    .stat-card p { margin:5px 0 0; color:#333333; font-size:14px; }
    
    /* Why EDU[LAB]INDIA */
    .section-heading {
      text-align:center; font-size:22px; font-weight:bold;
      color:#333333; margin:20px 0 10px; position: relative;
      display:inline-block;
    }
    .section-heading:after {
      content:''; display:block; width:60px; height:3px;
      background-color:#a8cd3d; margin:8px auto 0;
    }
    .feature-table { width:100%; border-spacing:10px; padding:0 20px 20px; }
    .feature-table td {
      background-color:#fafafa; border:1px solid #eee;
      border-radius:4px; padding:15px; vertical-align:top;
    }
    .feature-table td strong {
      display:block; margin-bottom:6px; color:#a8cd3d; font-size:16px;
    }
    
    /* Footer */
    .footer {
      padding:20px; font-size:12px; color:#888888; text-align:center;
    }
    .footer a { color:#a8cd3d; text-decoration:none; }
    
    /* Responsive tweaks */
    @media screen and (max-width:600px) {
      .hero h1 { font-size:24px!important; }
      .stats td, .feature-table td { display:block!important; width:100%!important; box-sizing:border-box; }
    }
  </style>
</head>
<body>
  <table class="container" role="presentation">
      
    <!-- Hero / Waitlist Confirmation -->
    <tr>
      <td class="hero">
        <h1>Welcome to EDU[LAB], ${userName}</h1>
        <h2>You Are on the Waitlist!</h2>
        
        <p>Your ID and password will be sent to this email once the platform is launched.</p>
      </td>
    </tr>
    <!-- Stats (unchanged) -->
    <tr>
      <td>
        <table class="stats" role="presentation">
          <tr>
            <td>
              <div class="stat-card">
                <h2>₹0</h2>
                <p>Completely Free</p>
              </div>
            </td>
            <td>
              <div class="stat-card">
                <h2>100+</h2>
                <p>Workshops Delivered</p>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="stat-card">
                <h2>2000+</h2>
                <p>Students Trained</p>
              </div>
            </td>
            <td>
              <div class="stat-card">
                <h2>10+</h2>
                <p>Years of Pedagogy</p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- Why EDU[LAB]INDIA -->
    <tr>
      <td style="text-align: center;">
        <h3 class="section-heading">Why EDU[LAB]?</h3>
        <table class="feature-table" role="presentation">
          <tr>
            <td><strong>Interactive Labs</strong>Real projects you remix, share & showcase.</td>
            <td><strong>Global Community</strong>Forums, mentorship circles & live jams.</td>
          </tr>
          <tr>
            <td><strong>Open-Source Library</strong>Download, adapt & contribute back.</td>
            <td><strong>Earn & Showcase</strong>Collect badges & certificates and shine.</td>
          </tr>
          <tr>
            <td colspan="2" style="text-align:center;">
              <strong>LABrat.ai</strong>Available 24/7, your AI mentor for tailored guidance.
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td class="footer">
          <p>Powered by <a href="https://www.rat-lab.org/education">rat[LAB]EDUCATION</a> &amp; <a href="https://www.rat-lab.org/smartlabs">smartLABS</a></p>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  };

  await transporter.sendMail(mailOptions);
}

// Utility: Send approval email
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

// Utility: Send referral email with code
async function sendReferralDemoEmail(toEmail, referredTo, referredBy, refCode) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"Team EDU[LAB]" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `You've been referred by ${referredBy}`,
    html: `
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>EDU[LAB]INDIA Invitation</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    /* Reset & base */
    body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table { border-collapse:collapse!important; width:100%!important; }
    img { border:0; height:auto; line-height:100%; outline:none; text-decoration:none; }
    body { margin:0!important; padding:0!important; width:100%!important; font-family:Arial,sans-serif; background-color:#f9f9f9; }
    
    /* Container */
    .container { width:100%!important; max-width:600px; margin:0 auto; background-color:#ffffff; }
    
    /* Greeting */
    .greeting { padding:20px; font-size:14px; color:#333; }
    
    /* Hero */
    .hero {
      background: linear-gradient(135deg, rgba(168,205,61,0.15) 0%, rgba(168,205,61,0) 100%);
      padding:40px 20px; text-align:center;
    }
    .hero h1 { margin:0; font-size:32px; color:#333333; }
    .hero p { margin:10px 0 0; color:#555555; font-size:16px; }
    .btn {
      display:inline-block; margin-top:20px;
      background-color:#a8cd3d; color:#ffffff!important;
      padding:12px 24px; text-decoration:none;
      border-radius:4px; font-weight:bold;
    }
    
    /* Stats */
    .stats { width:100%; text-align:center; padding:20px 0; }
    .stats td { width:50%; }
    .stat-card {
      background-color:#fafafa; border:1px solid #eee;
      border-radius:4px; padding:20px; margin:5px 0;
    }
    .stat-card h2 { margin:0; font-size:28px; color:#a8cd3d; }
    .stat-card p { margin:5px 0 0; color:#333333; font-size:14px; }
    
    /* Referral */
    .referral {
      padding:20px; background-color:#f0f0f0; text-align:center;
    }
    .referral h3 { margin:0; font-size:20px; color:#333333; }
    .referral-code {
      display:inline-block; margin:10px 0;
      font-size:24px; font-weight:bold; color:#a8cd3d;
      background-color:#ffffff; padding:10px 20px;
      border-radius:4px; letter-spacing:2px;
    }
    
    /* Why EDU[LAB]INDIA */
    .section-heading {
      text-align:center;
      font-size:22px;
      font-weight:bold;
      color:#333333;
      margin:20px 0 10px;
      position: relative;
      display: inline-block;
    }
    .section-heading:after {
      content:'';
      display:block;
      width:60px;
      height:3px;
      background-color:#a8cd3d;
      margin:8px auto 0;
    }
    .feature-table { width:100%; border-spacing:10px; padding:0 20px 20px; }
    .feature-table td {
      background-color:#fafafa; border:1px solid #eee;
      border-radius:4px; padding:15px; vertical-align:top;
    }
    .feature-table td strong {
      display:block; margin-bottom:6px; color:#a8cd3d; font-size:16px;
    }
    
    /* Footer */
    .footer {
      padding:20px; font-size:12px; color:#888888; text-align:center;
    }
    .footer a { color:#a8cd3d; text-decoration:none; }
    
    /* Responsive tweaks */
    @media screen and (max-width:600px) {
      .hero h1 { font-size:24px!important; }
      .stats td { display:block!important; width:100%!important; }
      .feature-table td { display:block!important; width:100%!important; box-sizing:border-box; }
    }
  </style>
</head>
<body>
  <table class="container" role="presentation">
    <!-- Greeting -->
    <!-- Hero -->
    <tr>
      <td class="hero">
        <h1>Learn Design, Zero Fees.</h1>
        <p>Your code to free, self-paced, open-source design education is here.</p> <br>
        <p>Hello <strong>${referredTo}</strong>, <strong>${referredBy}</strong> has entered your email as a referral while registering on EDU[LAB].</p>
        <a href="https://edu-lab.in/waitlist" class="btn">Join the Waitlist</a>
      </td>
    </tr>
    <!-- Stats (unchanged) -->
    <tr>
      <td>
        <table class="stats" role="presentation">
          <tr>
            <td>
              <div class="stat-card">
                <h2>₹0</h2><p>Completely Free</p>
              </div>
            </td>
            <td>
              <div class="stat-card">
                <h2>100+</h2><p>Workshops Delivered</p>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="stat-card">
                <h2>2000+</h2><p>Students Trained</p>
              </div>
            </td>
            <td>
              <div class="stat-card">
                <h2>10+</h2><p>Years of Pedagogy</p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- Referral -->
    <tr>
      <td class="referral">
        <h3>Your unique referral code is:</h3>
        <div class="referral-code">${refCode}</div>
        <p>&amp; Invite <strong>5 Friends</strong> to unlock bonus modules and <strong>Move Up</strong> the waitlist!</p>
        
      </td>
    </tr>
    <!-- Why EDU[LAB]INDIA -->
    <tr>
      <td style="text-align: center;">
        <h3 class="section-heading" >Why EDU[LAB]?</h3>
        <table class="feature-table" role="presentation">
          <tr>
            <td><strong>Interactive Labs</strong>Real projects you remix, share & showcase in your portfolio.</td>
            <td><strong>Global Community</strong>Forums, mentorship circles & live jams with peers worldwide.</td>
          </tr>
          <tr>
            <td><strong>Open-Source Library</strong>Unlimited access—download, adapt & contribute back.</td>
            <td><strong>Earn &amp; Showcase</strong>Collect badges & certificates, build a profile that shines.</td>
          </tr>
          <tr>
            <td colspan="2" style="text-align:center;">
              <strong>LABrat.ai</strong>Available 24/7, our AI mentor tailors challenges & feedback just for you.
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td class="footer">
        <p>If you did not expect this invitation, simply ignore this email.</p>
        <p>Powered by <a href="https://www.rat-lab.org/education">rat[LAB]EDUCATION</a> &amp; <a href="https://www.rat-lab.org/smartlabs">smartLABS</a></p>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  });
}

// Waitlist form submission
router.post('/submit', async (req, res) => {
  const { user } = req.body;

  if (!user) {
    return res.status(400).json({ message: 'Incomplete form submission' });
  }

  try {
    const userEmail = user.email.toLowerCase().trim();

    const existingUser = await UserData.findOne({ email: userEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User email already exists in waitlist' });
    }

    await UserData.create({ ...user, verified: true, role: 'waitlist' });
    await sendWaitlistEmail(userEmail,user.name);

    res.status(200).json({
      success: true,
      message: 'You have been added to our waitlist. Your ID and password will be emailed when we launch.'
    });

  } catch (err) {
    console.error('[WAITLIST SUBMIT ERROR]', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// Referral form submission
router.post('/referral/submit', async (req, res) => {
  const { user, referrals } = req.body;

  if (!user || !referrals || !Array.isArray(referrals)) {
    return res.status(400).json({ message: 'Invalid referral data.' });
  }

  try {
    const duplicateEmails = [];

    for (const ref of referrals) {
      if (!ref.email || !ref.name) continue;

      const email = ref.email.toLowerCase();
      const alreadyExists = await Referral.findOne({ email });

      if (alreadyExists) {
        duplicateEmails.push(email);
        continue;
      }

      const referralCode = generateReferralCode(user);

      await Referral.create({
        name: ref.name,
        email,
        referrerEmail: user.email,
        referralCode
      });

      try {
        await sendReferralDemoEmail(email,ref.name, user.name || user.email, referralCode);
      } catch (emailErr) {
        console.error(`Failed to send referral email to ${email}:`, emailErr.message);
      }
    }

    if (duplicateEmails.length > 0) {
      return res.status(400).json({
        success: false,
        message: `The following emails have already been referred: ${duplicateEmails.join(', ')}`
      });
    }

    res.status(200).json({ success: true, message: 'Referrals submitted successfully.' });

  } catch (err) {
    console.error('[REFERRAL SUBMIT ERROR]', err);
    res.status(500).json({ message: 'Failed to submit referrals.', error: err.message });
  }
});

// Approve user from waitlist
router.post('/waitlist/approve/:id', async (req, res) => {
  try {
    const waitlistUser = await UserData.findById(req.params.id);
    if (!waitlistUser) {
      return res.status(404).json({ message: 'User not found in waitlist' });
    }

    const password = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    await AuthUser.create({
      email: waitlistUser.email,
      password: hashedPassword,
      role: 'student',
      name: waitlistUser.name,
      gender: waitlistUser.gender,
      country: waitlistUser.country,
      phone: waitlistUser.phone,
      countryCode: waitlistUser.countryCode,
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

// Get waitlist users
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
