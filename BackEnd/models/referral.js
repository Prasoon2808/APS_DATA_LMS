const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  referralCode:{type: String},
  verified: { type: Boolean, default: false },
  referrerEmail: { type: String, required: true } // links to user.email
}, { timestamps: true });

module.exports = mongoose.model('Referral', referralSchema);
