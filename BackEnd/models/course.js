const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  fileName: String,
  fileUrl: String,
  fileType: String,
  fileSize: Number,
});

const ChapterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  content: FileSchema,
  resources: [FileSchema],
});

const SectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  chapters: [ChapterSchema],
});

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  coverImage: String,
  description: String,
  learningObjectives: {
    type: [String], // ✅ Array of strings
    required: false
  },  
  skillsCovered: {
    type: [String],
    required: false
  },  
  defaultThumbnail: String,
  author: {
    name: String,
    linkedinId: String,
    profileImage: String,
  },
  sections: [SectionSchema],
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
