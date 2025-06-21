import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CourseCard from '../../../../../../Component/CourseCard/CourseCard';
import './InProgress.css';
import config from '../../../../../../config/config';

const InProgress = () => {
  const [courses, setCourses] = useState([]);
  const [isListView, setIsListView] = useState(false);

  useEffect(() => {
    axios.get(`${config.backendUrl}/api/courses`)
      .then(res => setCourses(res.data))
      .catch(err => console.error(err));
  }, []);

  const toggleView = () => {
    setIsListView(prev => !prev);
  };

  return (
    <div>
      <div className="view-toggle-bar">
        <button onClick={toggleView}>
          {isListView ? 'Switch to Grid View' : 'Switch to List View'}
        </button>
      </div>

      <div className={`course-list ${isListView ? 'list-view' : ''}`}>
        {courses.map(course => (
          <CourseCard key={course._id} course={course} isListView={isListView} />
        ))}
      </div>
    </div>
  );
};

export default InProgress;
