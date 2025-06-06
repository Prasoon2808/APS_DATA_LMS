const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  gender: String,
  email: { type: String },
  country: String,
  affiliation: String,
  institution: String,
  verified: Boolean,
  role: { type: String, default: 'waitlist' },
}, { timestamps: true });

module.exports = mongoose.model('User Data', userSchema);
