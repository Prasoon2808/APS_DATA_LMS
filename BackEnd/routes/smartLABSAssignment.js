const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Submission = require('../models/AssignmentSubmissions');

const { multerMid } = require('../middleware/uploadAssignment');
const path = require('path');
const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  keyFilename: path.join(__dirname, '../gcs-key.json'),
});
const bucket = storage.bucket('edu-lab-assignment'); // your bucket name

router.post('/submit/:submissionId/:taskNumber', multerMid.array('files', 10), async (req, res) => {
  try {
    const { submissionId, taskNumber } = req.params;
    const { uploadToDrive } = req.body;

    if (uploadToDrive !== 'true') {
      return res.status(400).json({ error: 'UploadToDrive checkbox must be selected' });
    }

    if (!req.files || req.files.length < 5) {
      return res.status(400).json({ error: 'At least 5 files required' });
    }

    const gcsLinks = await Promise.all(
      req.files.map(file => {
        return new Promise((resolve, reject) => {
          const blob = bucket.file(Date.now() + '-' + file.originalname);
          const blobStream = blob.createWriteStream({ resumable: false });

          blobStream.on('error', reject);
          blobStream.on('finish', () => {
            resolve(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
          });

          blobStream.end(file.buffer);
        });
      })
    );

    const submission = await Submission.findById(submissionId);
    const task = submission.taskProgress.find(t => t.taskNumber == taskNumber);
    task.isComplete = true;
    task.gcsLinks = gcsLinks;
    await submission.save();

    res.json({ success: true, message: 'Task submitted', gcsLinks });
  } catch (err) {
    console.error('[TASK SUBMIT ERROR]', err);
    res.status(500).json({ error: 'Failed to upload task', message: err.message });
  }
});



// Get all assignments for student
router.get('/all', async (req, res) => {
  const { userId } = req.query;

  const assignments = await Assignment.find({}, '_id code title image isLocked tasks');
  const results = [];

  for (const assignment of assignments) {
    const submission = await Submission.findOne({
      assignmentId: assignment._id,
      userId
    });

    const totalTasks = assignment.tasks.length;
    const completedTasks = submission
      ? submission.taskProgress.filter(t => t.isComplete).length
      : 0;

    results.push({
      _id: assignment._id,
      code: assignment.code,
      title: assignment.title,
      image: assignment.image,
      isLocked: assignment.isLocked,
      totalTasks,
      completedTasks
    });
  }

  res.json(results);
});


// Start assignment
router.post('/start/:assignmentId', async (req, res) => {
  try {
    const { userId } = req.body;
    const assignmentId = req.params.assignmentId;

    console.log('[START REQUEST]', { assignmentId, userId });

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });

    let existing = await Submission.findOne({ assignmentId, userId });
    if (existing) return res.json(existing);

    const taskProgress = assignment.tasks.map(task => ({
      taskNumber: task.taskNumber,
      isComplete: false,
      gcsLinks: []
    }));

    const submission = await Submission.create({
      assignmentId,
      userId,
      startedAt: new Date(),
      taskProgress
    });

    res.json(submission);
  } catch (err) {
    console.error('[START ERROR]', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});


router.get('/submission/:assignmentId', async (req, res) => {
  try {
    const { userId } = req.query;

    const submission = await Submission.findOne({
      assignmentId: req.params.assignmentId,
      userId
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const assignment = await Assignment.findById(req.params.assignmentId);

    res.json({
      _id: submission._id, // ✅ fix: send submission ID
      assignmentTitle: assignment.title,
      tasks: assignment.tasks,
      taskProgress: submission.taskProgress
    });
  } catch (err) {
    console.error('[TASK LIST ERROR]', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});


// Get assignment overview
router.get('/:assignmentId/overview', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });

    res.json(assignment);
  } catch (err) {
    console.error('[OVERVIEW ERROR]', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

module.exports = router;
