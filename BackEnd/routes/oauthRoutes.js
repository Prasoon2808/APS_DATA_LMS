const express = require('express');
const { google } = require('googleapis');
const YoutubeToken = require('../models/YoutubeToken');

const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

// Step 1: Redirect to Google
router.get('/youtube', (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).send("Missing userId");

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/youtube.readonly'],
    state: userId // 👈 we’ll get this back in the callback
  });

  res.redirect(url);
});


// Step 2: Google returns token
router.get('/youtube/callback', async (req, res) => {
  const { tokens } = await oauth2Client.getToken(req.query.code);
  const userId = req.query.state; // 👈 returned from step 2

  await YoutubeToken.findOneAndUpdate(
    { userId },
    {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiryDate: tokens.expiry_date
    },
    { upsert: true }
  );

  res.redirect('/dashboard/admin'); // or wherever you want
});


module.exports = router;
