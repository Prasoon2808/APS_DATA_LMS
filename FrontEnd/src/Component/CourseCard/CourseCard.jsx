// CourseCard.jsx
import React from 'react'
import './CourseCard.css'
import { useNavigate } from 'react-router-dom';

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const url = 'http://localhost:5000';

  return (
    <div className="course-card" onClick={() => navigate(`/dashboard/student/courses/${course._id}`)}>
      <img
        src={`${url}${course.coverImage}`}
        alt="Course Cover"
      />
      <h3>{course.title}</h3>
      <p>{course.skillsCovered.join(', ')}</p>
      <p>By: {course.author.name}</p>
    </div>
  );
};


export default CourseCard
