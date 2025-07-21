const mongoose = require('mongoose');

const YoutubeTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  accessToken: String,
  refreshToken: String,
  expiryDate: Date
});

module.exports = mongoose.model('YoutubeToken', YoutubeTokenSchema);
