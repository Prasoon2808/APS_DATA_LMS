import React from 'react';
import './courses.css';
import CourseHeader from '../../../../../Component/CourseHeader/courseHeader';
import CoursePageSidebar from '../../../../../Component/CoursePageSidebar/coursePageSidebar';
import { Outlet } from 'react-router-dom';
import PageTitle from '../../../../../PageTitle';

const Courses = () => {
  return (
    <div className='courses'>
      <PageTitle title='Courses' />
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
