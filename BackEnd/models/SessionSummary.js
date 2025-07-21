const mongoose = require('mongoose');

const SessionSummarySchema = new mongoose.Schema({
  sessionTitle: String,
  sessionDate: Date,
  coverImage: String,
  recordingLink: String,
  tag: String,
  summaryText: [
    {
      heading: String,
      description: String
    }
  ]
});

module.exports = mongoose.model('SessionSummary', SessionSummarySchema);