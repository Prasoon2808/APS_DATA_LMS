const express = require('express');
const router = express.Router();
const QnA = require('../models/qna');
const mongoose = require('mongoose');

// GET: All questions & answers for a chapter
router.get('/:courseId/:chapterId', async (req, res) => {
  const { courseId, chapterId } = req.params;
  try {
    const questions = await QnA.find({ courseId, chapterId })
      .populate('userId', 'name') // get name of question poster
      .populate('answers.userId', 'name') // get name of each answer poster
      .populate('answers.replies.userId', 'name'); // get name of each reply poster

    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching QnA' });
  }
});


// POST: Add a new question
router.post('/', async (req, res) => {
  try {
    const { courseId, chapterId, userId, question } = req.body;
    const q = await QnA.create({ courseId, chapterId, userId, question, answers: [] });
    res.status(201).json(q);
  } catch (err) {
    res.status(500).json({ message: 'Error posting question' });
  }
});

// POST: Add an answer to a question
router.post('/answer', async (req, res) => {
  try {
    const { questionId, userId, answer } = req.body;
    const updated = await QnA.findByIdAndUpdate(
      questionId,
      { $push: { answers: { userId, answer } } },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error posting answer' });
  }
});

// Like/unlike a question
router.post('/like-question', async (req, res) => {
  const { questionId, userId } = req.body;
  const question = await QnA.findById(questionId);
  const index = question.likes.indexOf(userId);
  if (index === -1) {
    question.likes.push(userId);
  } else {
    question.likes.splice(index, 1);
  }
  await question.save();
  res.json({ likes: question.likes.length });
});

// Like/unlike an answer
router.post('/like-answer', async (req, res) => {
  const { questionId, answerId, userId } = req.body;
  const question = await QnA.findById(questionId);
  const answer = question.answers.id(answerId);
  const index = answer.likes.indexOf(userId);
  if (index === -1) {
    answer.likes.push(userId);
  } else {
    answer.likes.splice(index, 1);
  }
  await question.save();
  res.json({ likes: answer.likes.length });
});

// Reply to an answer
router.post('/reply', async (req, res) => {
  const { questionId, answerId, userId, reply } = req.body;
  const question = await QnA.findById(questionId);
  const answer = question.answers.id(answerId);
  answer.replies.push({ userId, reply });
  await question.save();
  res.json(answer.replies);
});


module.exports = router;
