const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const courseController = require('../controllers/courseCreate');
const Course = require('../models/course');

// POST /api/courses/create
router.post('/create', courseController.createCourse);

router.get('/', async (req, res) => {
    try {
      const courses = await Course.find();
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch courses' });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) return res.status(404).json({ error: 'Course not found' });
      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  // PUT: Update full course
router.put('/:id', async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH: Toggle lock status
router.patch('/:id/lock-toggle', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    course.locked = !course.locked;
    await course.save();
    res.json({ locked: course.locked });
  } catch (err) {
    res.status(500).json({ error: 'Toggle failed' });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Course not found' });
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Deletion failed' });
  }
});

module.exports = router;
