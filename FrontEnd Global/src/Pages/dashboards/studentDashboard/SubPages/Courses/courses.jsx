import React from 'react';
import './courses.css';
import CourseHeader from '../../../../../Component/CourseHeader/courseHeader';
import CoursePageSidebar from '../../../../../Component/CoursePageSidebar/coursePageSidebar';
import { Outlet } from 'react-router-dom';

const Courses = () => {
  return (
    <div className='courses'>
      <CourseHeader />
      <section className="courseContent">
        <CoursePageSidebar />
        <div className="courseSubPage">
          <Outlet />
        </div>
      </section>
    </div>
  );
};

export default Courses;
