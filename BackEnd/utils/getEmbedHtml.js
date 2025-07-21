const { google } = require('googleapis');
const YoutubeToken = require('../models/YoutubeToken');

module.exports = async function getEmbedHtml(videoId, userId) {
  const creds = await YoutubeToken.findOne({ userId });
  if (!creds) return null;

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: creds.accessToken,
    refresh_token: creds.refreshToken
  });

  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

  const { data } = await youtube.videos.list({
    part: 'player',
    id: videoId
  });

  const item = data.items[0];
  const match = item?.player?.embedHtml?.match(/src="([^"]+)"/);
  return match ? match[1] : null;
};
