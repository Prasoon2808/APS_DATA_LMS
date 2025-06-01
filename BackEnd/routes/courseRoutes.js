const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const courseController = require('../controllers/courseCreate');
const Course = require('../models/course');

// POST /api/courses/create
router.post(
    '/create',
    upload.any(),
    courseController.createCourse
  );
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
module.exports = router;
