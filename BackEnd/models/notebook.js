const mongoose = require('mongoose');
const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, required: true },
  chapterId: { type: String, required: true },
  title: String,
  content: String,
  tags: [String] // ✅ NEW
}, { timestamps: true });

module.exports = mongoose.model('Notebook', noteSchema);
