const express = require('express');
const router = express.Router();
const Notebook = require('../models/notebook');

// ✅ GET all notes for a user in a chapter
router.get('/:userId/:courseId/:chapterId', async (req, res) => {
  try {
    const { userId, courseId, chapterId } = req.params;
    const notes = await Notebook.find({ userId, courseId, chapterId }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error('GET error in notebook:', err);
    res.status(500).json({ message: 'Server error while fetching notes' });
  }
});

// ✅ POST: create or update a note
router.post('/', async (req, res) => {
  try {
    const { userId, courseId, chapterId, noteId, title, content, tags } = req.body;

    let note;
    if (noteId) {
      // Update existing note
      note = await Notebook.findByIdAndUpdate(
        noteId,
        { title, content, tags },
        { new: true }
      );
    } else {
      // Create new note
      note = await Notebook.create({ userId, courseId, chapterId, title, content, tags });
    }

    res.json(note);
  } catch (err) {
    console.error('POST error in notebook:', err);
    res.status(500).json({ message: 'Server error while saving note' });
  }
});

// ✅ DELETE: delete a note by ID
router.delete('/:noteId', async (req, res) => {
  try {
    await Notebook.findByIdAndDelete(req.params.noteId);
    res.json({ message: 'Note deleted' });
  } catch (err) {
    console.error('DELETE error in notebook:', err);
    res.status(500).json({ message: 'Server error while deleting note' });
  }
});

module.exports = router;
