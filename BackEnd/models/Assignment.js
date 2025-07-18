const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  code: String,
  title: String,
  brief: String,
  type: String,
  evaluation: String,
  allocatedIn: String,
  submissionType: String,
  output: String,
  image: String, // GCS public URL for assignment image
  generalNotes: [String],
  isLocked: { type: Boolean, default: false },

  tasks: [{
    taskNumber: Number,
    code: String,
    instructions: String,
    hints: [String]
  }]
});

module.exports = mongoose.model('Assignment', assignmentSchema);
