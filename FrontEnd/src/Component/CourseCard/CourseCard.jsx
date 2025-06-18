// CourseCard.jsx
import React from 'react'
import './CourseCard.css'
import { useNavigate } from 'react-router-dom';
import config from '../../config/config';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const url = config.backendUrl;

  const handleClick = () => {
    if (course.locked) {
      toast.error('🔒 This course is locked. You cannot access its content.');
      return;
    }
    navigate(`/dashboard/student/courses/${course._id}`);
  };

  return (
    <div className="course-card" onClick={handleClick}>
      <img src={course.coverImage} alt="Course Cover" />
      <div className="card-info">
        <h3>{course.title}</h3>
        <p className='author'>By: {Array.isArray(course.authors) ? course.authors.map(a => a.name).join(', ') : 'Unknown'}</p>
        {course.skillsCovered && course.skillsCovered.length > 0 && (
          <div className='skills'>
            <ul>
              {course.skillsCovered.slice(0, 6).map((skill, idx) => (
                <li key={idx}>{skill}</li>
              ))}
            </ul>
          </div>
        )}
        {course.locked && 
          <div className='locked'>
            <img className='lockIcon' src={assets.greenlockIcon} alt="" />
          </div>
        }
      </div>
    </div>
  );
};


export default CourseCard
