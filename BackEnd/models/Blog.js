const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
});

const BlogSchema = new mongoose.Schema({
  name: String,
  subheading: String,
  coverImage: String, // NEW
  sections: [SectionSchema],
  createdAt: {
    type: Date,
    default: Date.now, // NEW
  },
});

module.exports = mongoose.model('Blog', BlogSchema);
