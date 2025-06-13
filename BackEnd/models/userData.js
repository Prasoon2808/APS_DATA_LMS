const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  gender: String,
  email: { type: String },
  country: String,
  phone: Number,
  institution: String,
  verified: Boolean,
  refCode: String,
  role: { type: String, default: 'waitlist' },
}, { timestamps: true });

module.exports = mongoose.model('User Data', userSchema);
