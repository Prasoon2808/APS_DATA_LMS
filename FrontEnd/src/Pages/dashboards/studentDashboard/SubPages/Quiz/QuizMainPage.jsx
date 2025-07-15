import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './QuizMainPage.css';
import config from '../../../../../config/config';

export default function QuizMainPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    axios.get(`${config.backendUrl}/api/quiz/${quizId}`).then(res => {
      setQuiz(res.data);
      setAnswers(Array(res.data.questions.length).fill(null));
      setTimeLeft(res.data.timeLimit * 60);
    });
  }, [quizId]);

  useEffect(() => {
    if (!quiz) return;

    const total = quiz.timeLimit * 60;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        const newTime = t - 1;
        const percent = Math.floor(((total - newTime) / total) * 100);
        setProgress(percent);

        if (newTime <= 0) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz]);

  const formatTime = () => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const selectOption = (optIdx) => {
    const updated = [...answers];
    updated[currentQ] = optIdx;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${config.backendUrl}/api/quiz/submit/${quizId}`, {
        answers,
        userId: localStorage.getItem('userId') || 'guest'
      });
      navigate(`/dashboard/student/quiz/${quizId}/result`);
    } catch (err) {
      alert('Error submitting quiz');
    }
  };

  if (!quiz) return <div className="quiz-page">Loading...</div>;

  const q = quiz.questions[currentQ];

  return (
    <div className="quiz-page">
      {/* Left Panel */}
      <div className="quiz-main">
        <h2 className="quiz-title">{quiz.title}</h2>
        <h3 className="quiz-question">{q.questionText}</h3>

        <div className="quiz-options">
          {q.options.map((opt, i) => (
            <button
              key={i}
              className={`quiz-option ${answers[currentQ] === i ? 'selected' : ''}`}
              onClick={() => selectOption(i)}
            >
              <span>{String.fromCharCode(65 + i)}.</span> {opt}
            </button>
          ))}
        </div>

        <div className="quiz-controls">
          <button
            onClick={() => currentQ > 0 && setCurrentQ(currentQ - 1)}
            disabled={currentQ === 0}
          >
            ← Previous
          </button>
          {currentQ < quiz.questions.length - 1 ? (
            <button onClick={() => setCurrentQ(currentQ + 1)}>Next →</button>
          ) : (
            <button className="submit-btn" onClick={handleSubmit}>Submit Quiz</button>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="quiz-sidebar">
        <div className="timer-box">
          <div className="circular-timer" style={{
            background: `conic-gradient(#a8cd3d ${progress * 3.6}deg, #eee 0deg)`
          }}>
            <div className="timer-inner">
              <span>{formatTime()}</span>
            </div>
          </div>
          <p className="timer-label">Time Remaining</p>
        </div>

        <div className="question-nav">
          <p className="nav-heading">Quiz Questions List</p>
          <ul>
            {quiz.questions.map((_, idx) => (
              <li
                key={idx}
                className={currentQ === idx ? 'active' : ''}
                onClick={() => setCurrentQ(idx)}
              >
                Question {idx + 1}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
