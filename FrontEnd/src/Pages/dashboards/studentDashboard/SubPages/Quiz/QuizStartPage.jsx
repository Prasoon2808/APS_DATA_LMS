import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './QuizStartPage.css';
import config from '../../../../../config/config';

export default function QuizStartPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    axios.get(`${config.backendUrl}/api/quiz/${quizId}`).then(res => setQuiz(res.data));
  }, [quizId]);

  if (!quiz) return <div className="quiz-start-wrapper">Loading...</div>;

  return (
    <div className="quiz-start-wrapper">
      <div className="quiz-start-card">
        <h2>{quiz.title}</h2>
        <p className="desc">{quiz.description}</p>

        <ul className="rules-list">
          <li>⏱ You will have <strong>{quiz.timeLimit} minutes</strong> to complete the quiz.</li>
          <li>📋 Total <strong>{quiz.questions.length} questions</strong>, single correct option.</li>
          <li>🚫 You cannot go back after starting.</li>
          <li>📶 Do not refresh or close the tab during the quiz.</li>
        </ul>

        <button className="start-btn" onClick={() => navigate(`/dashboard/student/quiz/${quizId}`)}>
          Start Quiz
        </button>
      </div>
    </div>
  );
}
