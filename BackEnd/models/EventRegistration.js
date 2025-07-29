const mongoose = require('mongoose');

const EventRegistrationSchema = new mongoose.Schema({
  eventId: { type: String, required: true }, // ✅ New field
  name: { type: String, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true },
  institution: { type: String, required: true },
  refCode: { type: String},
  pdfUrl: { type: String }, // store GCS link to uploaded PDF
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('EventRegistration', EventRegistrationSchema);
