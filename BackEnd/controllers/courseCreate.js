const Course = require('../models/course');

exports.createCourse = async (req, res) => {
  try {
    const courseData = req.body;
    const course = new Course(courseData);
    await course.save();
    res.status(201).json({ message: 'Course created successfully', course });
  } catch (err) {
    console.error('🔥 ERROR in createCourse:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
};
