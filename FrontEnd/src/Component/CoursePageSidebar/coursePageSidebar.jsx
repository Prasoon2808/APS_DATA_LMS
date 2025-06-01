import React from 'react';
import { NavLink } from 'react-router-dom';
import './coursePageSidebar.css';

const CoursePageSidebar = () => {
  return (
    <div className='coursePageSidebar'>
      <NavLink
        to="inprogress"
        className={({ isActive }) => isActive ? "sidebarOption active" : "sidebarOption"}
      >
        In progress
      </NavLink>
      <NavLink
        to="saved"
        className={({ isActive }) => isActive ? "sidebarOption active" : "sidebarOption"}
      >
        Saved
      </NavLink>
      <NavLink
        to="mycollection"
        className={({ isActive }) => isActive ? "sidebarOption active" : "sidebarOption"}
      >
        My collection
      </NavLink>
      <NavLink
        to="learninghistory"
        className={({ isActive }) => isActive ? "sidebarOption active" : "sidebarOption"}
      >
        Learning History
      </NavLink>
    </div>
  );
};

export default CoursePageSidebar;
