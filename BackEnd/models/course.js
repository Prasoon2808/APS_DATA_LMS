const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema({
  name: String,
  linkedinId: String,
  profileImage: String
});

const ChapterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  content: String,
  resources: [String],
  summary: String // ✅ NEW FIELD
});

const SectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  chapters: [ChapterSchema]
});

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  coverImage: String,
  description: String,
  learningObjectives: [String],
  skillsCovered: [String],
  authors: [AuthorSchema],     // 🔄 updated here
  sections: [SectionSchema],
  locked: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
