const express = require('express');
const router = express.Router();
const Forum = require('../models/forum');
const { multerMid, uploadToGCS } = require('../middleware/uploadToGCS');

// GET all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Forum.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name avatar')
      .populate('answers.userId', 'name avatar')
      .populate('answers.replies.userId', 'name avatar');

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching forum posts' });
  }
});

router.post('/upload', multerMid.single('file'), uploadToGCS, (req, res) => {
  if (!req.file || !req.file.cloudStoragePublicUrl) {
    return res.status(400).json({ error: 'Upload failed' });
  }
  res.json({ url: req.file.cloudStoragePublicUrl });
});


// POST a new post
router.post('/', async (req, res) => {
  try {
    const { userId, question, category, mediaUrl } = req.body;
    const newPost = await Forum.create({ userId, question, category, mediaUrl, answers: [] });

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: 'Error creating post' });
  }
});

// POST an answer
router.post('/answer', async (req, res) => {
  try {
    const { questionId, userId, answer } = req.body;
    const updated = await Forum.findByIdAndUpdate(
      questionId,
      { $push: { answers: { userId, answer } } },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error posting answer' });
  }
});

// Like/unlike a post
router.post('/like-question', async (req, res) => {
  const { questionId, userId } = req.body;
  const post = await Forum.findById(questionId);
  const index = post.likes.indexOf(userId);
  if (index === -1) post.likes.push(userId);
  else post.likes.splice(index, 1);
  await post.save();
  res.json({ likes: post.likes.length });
});

// POST: Add a comment to General, Idea, Feedback
router.post('/comment', async (req, res) => {
  const { questionId, userId, comment } = req.body;
  const updated = await Forum.findByIdAndUpdate(
    questionId,
    { $push: { answers: { userId, answer: comment } } },  // stored as normal answer object
    { new: true }
  );
  res.json(updated);
});


// Like/unlike an answer
router.post('/like-answer', async (req, res) => {
  const { questionId, answerId, userId } = req.body;
  const post = await Forum.findById(questionId);
  const answer = post.answers.id(answerId);
  const index = answer.likes.indexOf(userId);
  if (index === -1) answer.likes.push(userId);
  else answer.likes.splice(index, 1);
  await post.save();
  res.json({ likes: answer.likes.length });
});

// POST: Reply to an answer OR comment
router.post('/reply', async (req, res) => {
  const { questionId, answerId, userId, reply } = req.body;

  try {
    const post = await Forum.findById(questionId);
    const answer = post.answers.id(answerId);

    if (!answer) return res.status(404).json({ message: 'Answer/Comment not found' });

    answer.replies.push({ userId, reply });
    await post.save();

    res.json(answer.replies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error posting reply' });
  }
});


module.exports = router;
