const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const User = require('../models/user'); // Adjust based on your User model

// ✅ Get all quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching quizzes.' });
  }
});

// ✅ Get single quiz
router.get('/:quizId', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching quiz.' });
  }
});

// ✅ Create quiz
router.post('/create', async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.json({ success: true, quiz });
  } catch (err) {
    res.status(400).json({ message: 'Failed to create quiz.', error: err });
  }
});

// ✅ Submit quiz + save attempt + calculate accuracy/completion
router.post('/submit/:quizId', async (req, res) => {
  try {
    const { answers, userId } = req.body;
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) score++;
    });

    const attempt = new QuizAttempt({
      quizId: quiz._id,
      userId,
      answers,
      score,
      total: quiz.questions.length
    });

    await attempt.save();

    // 🔄 Recalculate accuracy & completionRate
    const allAttempts = await QuizAttempt.find({ quizId: quiz._id });
    const totalUsers = await User.countDocuments(); // Adjust if using specific cohorts

    const avgScore = allAttempts.reduce((sum, a) => sum + (a.score / a.total), 0);
    const accuracy = (avgScore / allAttempts.length) * 100;

    const uniqueUsers = new Set(allAttempts.map(a => a.userId.toString()));
    const completionRate = (uniqueUsers.size / totalUsers) * 100;

    await Quiz.findByIdAndUpdate(quiz._id, {
      accuracy: accuracy.toFixed(1),
      completionRate: completionRate.toFixed(1)
    });

    res.json({ score, total: quiz.questions.length });
  } catch (err) {
    res.status(500).json({ message: 'Error evaluating quiz.', error: err });
  }
});

// ✅ Get all attempts by a user
router.get('/attempts/user/:userId', async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ userId: req.params.userId }).populate('quizId');
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching attempts.', error: err });
  }
});

module.exports = router;
