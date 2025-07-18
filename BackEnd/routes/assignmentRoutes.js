const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const { multerMid, uploadToGCS } = require('../middleware/uploadAssignment'); // use your file

// Create new assignment
router.post(
  '/create',
  multerMid.single('image'),
  uploadToGCS,
  async (req, res) => {
    try {
      const {
        code, title, brief, type, evaluation,
        allocatedIn, submissionType, output,
        generalNotes, tasks
        } = req.body;

        const newAssignment = new Assignment({
        code,
        title,
        brief,
        type,
        evaluation,
        allocatedIn,
        submissionType,
        output,
        image: req.file?.cloudStoragePublicUrl || '',
        generalNotes: JSON.parse(generalNotes),
        tasks: JSON.parse(tasks || '[]')  // parse if tasks exist
        });


      await newAssignment.save();
      res.json({ success: true, assignment: newAssignment });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// Fetch all assignments for admin
router.get('/all', async (req, res) => {
  const assignments = await Assignment.find();
  res.json(assignments);
});

// Lock/unlock
router.patch('/toggle-lock/:id', async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);
  assignment.isLocked = !assignment.isLocked;
  await assignment.save();
  res.json({ locked: assignment.isLocked });
});

module.exports = router;