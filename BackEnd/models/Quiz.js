const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [String],
  correctAnswer: Number,
  explanation: String,
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  coverImage: String,         // ✅ added
  timeLimit: Number,
  questions: [questionSchema],
  accuracy: { type: Number, default: 0 },        // ✅ added
  completionRate: { type: Number, default: 0 },  // ✅ added
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Quiz', quizSchema);
