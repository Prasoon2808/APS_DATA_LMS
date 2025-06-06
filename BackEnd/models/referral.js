const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  name: String,
  gender: String,
  email: { type: String, required: true, unique: true },
  country: String,
  affiliation: String,
  institution: String,
  verified: { type: Boolean, default: false },
  referrerEmail: { type: String, required: true } // links to user.email
}, { timestamps: true });

module.exports = mongoose.model('Referral', referralSchema);
