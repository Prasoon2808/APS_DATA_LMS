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
    
    <!-- Header / Logo -->
    <tr>
      <td style="padding:20px; text-align:center;">
        <img src="https://yourdomain.com/logo.png" alt="EDU[LAB]INDIA Logo"
             width="160" style="display:block; margin:0 auto;">
      </td>
    </tr>
    <!-- Hero -->
    <tr>
      <td class="hero">
        <h1>Learn Design, Zero Fees.</h1>
        <p>Your code to free, self-paced, open-source design education is here.</p> <br>
        <p>Hello <strong>${referredBy}</strong>, <strong>${referredBy}</strong> has entered your email as a referral while registering on EDU[LAB].</p>
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
        <div class="referral-code">${referralCode}</div>
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

    return res.status(200).json({ sent: true });
  } catch (error) {
    console.error('Referral email failed:', error.message);
    return res.status(500).json({ sent: false });
  }
});

module.exports = router;
