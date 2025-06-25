const mongoose = require('mongoose');

const EventRegistrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // ✅ Unique
  country: { type: String, required: true },
  phone: { type: String, required: true },
  institution: { type: String, required: true },
  refCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EventRegistration', EventRegistrationSchema);
