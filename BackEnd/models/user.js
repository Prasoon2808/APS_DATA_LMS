const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "faculty", "admin"], required: true },
  resetTokenUsed: { type: Boolean, default: false },
  streakDates: {
    type: [String],
    default: []
  },

  // Extra fields from waitlist:
  name: String,
  gender: String,
  country: String,
  countryCode: String,
  affiliation: String,
  institution: String,
  verified: Boolean
});

module.exports = mongoose.model("User", userSchema);
