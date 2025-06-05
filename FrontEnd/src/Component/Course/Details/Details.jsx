import React from 'react';
import './Details.css'; 
import config from '../../../config/config';

export default function Details({ course, chapter }) {
  const url = config.backendUrl;
  return (
    <div className='Details'>
      <div className="instructorContainer">
        <h3>Instructor</h3>
        <div className="instructorDetails">
          <img src={`${url}${course.author.profileImage}`} alt="Author"  />
          <div className="instructorInfo">
            <p>{course.author.name}</p>
            <a href={course.author.linkedinId}>Linkedin Profile</a>
          </div>
        </div>
      </div>
      <div className="chapterDetails">
        <h2>{chapter.name}</h2>
        <p>{chapter.description}</p>
      </div>
      <div className="courseDetails">
        <h1>ABOUT THE COURSE</h1>
        <h2>{course.title}</h2>
        <p>{course.description}</p>
      </div>
      {course.learningObjectives && (
        <div className='objectives'>
          <h3>Learning Objectives</h3>
          <ul>
            {course.learningObjectives.map((point, i) => (
              <li key={i}><span>&#10132;</span>&nbsp;&nbsp;&nbsp;{point}</li>
            ))}
          </ul>
        </div>
      )}
      {course.skillsCovered && course.skillsCovered.length > 0 && (
        <div className='skills'>
          <h3>Skills Covered</h3>
          <ul>
            {course.skillsCovered.map((skill, idx) => (
              <li key={idx}>{skill}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}
