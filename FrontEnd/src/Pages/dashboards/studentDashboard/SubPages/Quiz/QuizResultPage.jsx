import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './QuizResultPage.css';
import config from '../../../../../config/config';

export default function QuizResultPage() {
  const { quizId } = useParams();
  const [percentage, setPercentage] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId') || 'guest';

    axios.get(`${config.backendUrl}/api/quiz/attempts/user/${userId}`).then(res => {
      const quizAttempts = res.data
        .filter(a => a.quizId._id === quizId)
        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

      if (quizAttempts.length > 0) {
        const latest = quizAttempts[0];
        const percent = ((latest.score / latest.total) * 100).toFixed(0);
        setPercentage(parseInt(percent));
      }
    });
  }, [quizId]);

  if (percentage === null) return <div className="quiz-result-container">Loading...</div>;

  const isPass = percentage >= 60;

  let level = 'low';
  let levelColor = 'red';

  if (percentage >= 60 && percentage < 85) {
    level = 'medium';
    levelColor = 'orange';
  } else if (percentage >= 85) {
    level = 'high';
    levelColor = 'green';
  }

  return (
    <div className="quiz-result-container">
      <div className="quiz-result-card">
        <h2>Your Result is there</h2>
        <div className={`result-status ${isPass ? 'pass' : 'fail'}`}>
          {isPass ? '✅ You Passed!' : '❌ You Failed!'}
        </div>

        <p className="score-label">YOUR OVERALL SCORE</p>
        <div className="score-percent" style={{ color: levelColor }}>
          {percentage}%
        </div>

        <div className="score-bar-label" style={{ color: levelColor }}>
          {level}
        </div>

        <div className="score-indicators">
          <div><span className="dot red"></span>Low</div>
          <div><span className="dot orange"></span>Medium</div>
          <div><span className="dot green"></span>High</div>
        </div>
      </div>
    </div>
  );
}
