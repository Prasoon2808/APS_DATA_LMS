// sideBar.jsx
import React, { useState } from 'react';
import './sideBar.css';
import { NavLink, useLocation } from 'react-router-dom';
import { assets } from '../../assets/assets';

const menuItems = [
  { path: 'explore', icon: assets.searchIcon, label: 'Explore' },
  { path: 'courses', icon: assets.courseIcon, label: 'Courses' },
  { path: 'quiz', icon: assets.quizIcon, label: 'Quiz' },
  { path: 'assignment', icon: assets.assignmentIcon, label: 'Assignment' },
];

const SideBar = ({ onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (onToggle) onToggle(newState);
  };

  return (
    <div className={`sideBar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="toggleBtn" onClick={toggleSidebar}>
        {isCollapsed ? <img src={assets.arrowIcon} alt="" /> : <img src={assets.crossIcon} alt="" />}
      </button>
      <div className='sideBarMenu'>
        {menuItems.map(({ path, icon, label }) => {
          const isActive = location.pathname.startsWith(`/dashboard/student/${path}`);

          return (
            <NavLink
              key={path}
              to={path}
              className={`sideBarMenuItem${isActive ? ' active' : ''}`}
            >
              <img src={icon} alt="icon" />
              {!isCollapsed && <span>{label}</span>}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default SideBar;
