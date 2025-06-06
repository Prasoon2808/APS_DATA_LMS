import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CourseCard from '../../../../../../Component/CourseCard/CourseCard';
import './InProgress.css';
import config from '../../../../../../config/config';

const InProgress = () => {
  const [courses, setCourses] = useState([]);
 
  useEffect(() => {
    axios.get(`${config.backendUrl}/api/courses`)
      .then(res => setCourses(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="course-list">
      {courses.map(course => (
        <CourseCard key={course._id} course={course} />
      ))}
    </div>
  );
};

export default InProgress;
