import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../../../../config/config';
import { useNavigate } from 'react-router-dom';
import './SmartLABSAssignment.css';
import { useAuth } from '../../../../../context/AuthContext';

const StudentAssignments = () => {
  const {user} = useAuth();
    const userId = user?._id;
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();

 useEffect(() => {
  axios
    .get(`${config.backendUrl}/api/smartlabs/assignment/all?userId=${user?._id}`)
    .then((res) => {
      setAssignments(res.data);
    })
    .catch((err) => console.error("Error fetching assignments:", err));
}, [user]);


  const goToStartPage = (id) => {
    navigate(`/dashboard/smartLABS/assignment/${id}/start`);
  };

  const CircularProgress = ({ value, total }) => {
  const percentage = (value / total) * 100;
  const radius = 28;
  const stroke = 4;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2} className="circular-progress">
  <circle
    stroke="#eee"
    fill="transparent"
    strokeWidth={stroke}
    r={normalizedRadius}
    cx={radius}
    cy={radius}
  />
  <circle
    stroke="#8AB62F"
    fill="transparent"
    strokeWidth={stroke}
    strokeDasharray={circumference + ' ' + circumference}
    strokeDashoffset={strokeDashoffset}
    style={{ transition: 'stroke-dashoffset 0.35s', transform: 'rotate(-90deg)', transformOrigin: 'center' }}
    r={normalizedRadius}
    cx={radius}
    cy={radius}
  />
  <text
    x="50%"
    y="50%"
    dominantBaseline="middle"
    textAnchor="middle"
    fontSize="12"
    fill="#333"
  >
    {value}/{total}
  </text>
</svg>
  );
};

  return (
    <div className="student-assignment-list">
      <h2>All Assignments</h2>
      {assignments.map(a => (
        <div className="assignment-card" key={a._id}>
            <img src={a.image} alt={a.title} />
            <div className="assignment-info">
                <h4>{a.code}</h4>
                <p>{a.title}</p>
                {a.completedTasks === a.totalTasks ? (
                <button className="submitted-btn" disabled>Submitted</button>
                ) : (
                <button
                    disabled={a.isLocked}
                    onClick={() => goToStartPage(a._id)}
                >
                    {a.isLocked ? 'Locked' : 'Start'}
                </button>
                )}
            </div>
            <div className="assignment-progress">
                <CircularProgress value={a.completedTasks || 0} total={a.totalTasks || 6} />
            </div>
            </div>

      ))}
    </div>
  );
};

export default StudentAssignments;
