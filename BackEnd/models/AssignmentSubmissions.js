const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignmentId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  startedAt: Date,
  completedAt: Date,
  taskProgress: [{
    taskNumber: Number,
    isComplete: Boolean,
    gcsLinks: [String]
  }]
});

module.exports = mongoose.model('AssignmentSubmission', submissionSchema);
