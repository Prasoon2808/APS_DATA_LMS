const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// POST: Create a new blog
router.post('/add', async (req, res) => {
  try {
    const { name, subheading, sections } = req.body;

    const newBlog = new Blog({ name, subheading, sections });
    await newBlog.save();

    res.status(201).json({ message: 'Blog created', blog: newBlog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Get all blogs
router.get('/all', async (req, res) => {
  const blogs = await Blog.find();
  res.json(blogs);
});

module.exports = router;
