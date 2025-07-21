const { google } = require('googleapis');
const YoutubeToken = require('../models/YoutubeToken');

module.exports = async function getEmbedHtml(videoId, userId) {
  console.log('🎯 Called getEmbedHtml with videoId:', videoId, 'userId:', userId);

  const creds = await YoutubeToken.findOne({ userId });
  if (!creds) {
    console.error('❌ No token found for userId:', userId);
    return null;
  }

  console.log('🔑 Using access token:', creds.accessToken.slice(0, 20), '...');

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: creds.accessToken,
    refresh_token: creds.refreshToken
  });

  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

  try {
    const { data } = await youtube.videos.list({
      part: 'player',
      id: videoId
    });

    const item = data?.items?.[0];
    if (!item) {
      console.error('❌ No video found for ID:', videoId);
      return null;
    }

    const embedHtml = item.player.embedHtml;
    console.log('✅ Embed HTML found.');
    const match = embedHtml.match(/src="([^"]+)"/);
    return match ? match[1] : null;
  } catch (err) {
    console.error('❌ YouTube API error:', err.response?.data || err.message);
    return null;
  }
};
