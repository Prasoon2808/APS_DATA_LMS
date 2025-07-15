import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AllQuizzes.css';
import config from '../../../../../config/config';
import { useNavigate } from 'react-router-dom';

function CircularStat({ value, label, color = '#a8cd3d' }) {
  const percentage = Math.min(value || 0, 100);
  const circleStyle = {
    background: `conic-gradient(${color} ${percentage * 3.6}deg, #e0e0e0 0deg)`,
  };

  return (
    <div className="circular-wrapper">
      <div className="circular-chart" style={circleStyle}>
        <div className="circular-inner">
          <span>{percentage}%</span>
        </div>
      </div>
      <small>{label}</small>
    </div>
  );
}

export default function AllQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${config.backendUrl}/api/quiz`).then(res => setQuizzes(res.data));
  }, []);

  return (
    <div className="quiz-student-wrapper">
      <h2>All Quizzes</h2>
      <div className="quiz-grid">
        {quizzes.map((quiz, idx) => (
          <div key={idx} className="quiz-card">
            <div className="quiz-image">
              <img src={quiz.coverImage} alt="quiz" />
              <div className="enrolled-tag">
                {Math.floor(Math.random() * 20) + 1} Enrolled
              </div>
            </div>
            <div className="quiz-info">
              <h3>{quiz.title}</h3>
              <p>{quiz.description?.slice(0, 80)}...</p>
              <div className="quiz-meta-modern">
                <CircularStat value={quiz.accuracy} label="Accuracy" />
                <CircularStat value={quiz.completionRate} label="Completion" />
              </div>
              <div className="quiz-footer">
                <span>{quiz.questions?.length || 0} Questions</span>
                <button className="start-btn" onClick={() => navigate(`/dashboard/student/quiz/${quiz._id}/start`)}>
                  Start ➔
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
