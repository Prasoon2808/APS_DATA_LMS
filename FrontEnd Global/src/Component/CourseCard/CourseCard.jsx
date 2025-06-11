// CourseCard.jsx
import React from 'react'
import './CourseCard.css'
import { useNavigate } from 'react-router-dom';
import config from '../../config/config';

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const url = config.backendUrl;

  const handleClick = () => {
    if (course.locked) {
      alert('🔒 This course is locked. You cannot access its content.');
      return;
    }
    navigate(`/dashboard/student/courses/${course._id}`);
  };

  return (
    <div className="course-card" onClick={handleClick}>
      <img src={`${url}${course.coverImage}`} alt="Course Cover" />
      <h3>{course.title}</h3>
      <p>{course.skillsCovered?.join(', ')}</p>
      <p>By: {course.author?.name}</p>
      {course.locked && <p style={{ color: 'red', fontWeight: 'bold' }}>🔒 Locked</p>}
    </div>
  );
};


export default CourseCard
