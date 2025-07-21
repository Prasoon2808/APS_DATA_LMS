// sideBar.jsx
import React, { useState } from 'react';
import './FacultySideBar.css';
import { NavLink, useLocation } from 'react-router-dom';
import { assets } from '../../assets/assets';

const menuItems = [
  { path: 'network', icon: assets.networkIcon, label: 'Community' },
  { path: 'assignment', icon: assets.assignmentIcon, label: 'Assignment' },
  { path: 'schedule', icon: assets.courseIcon, label: 'Schedule' },
  { path: 'summaries', icon:'https://storage.googleapis.com/edu-lab/my%20sessions%20icon%20sidebar.png', label: 'Sessions' },
];

const FacultySideBar = ({ onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (onToggle) onToggle(newState);
  };

  return (
    <div className={`facultysideBar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="toggleBtn" onClick={toggleSidebar}>
        {isCollapsed ? <img src={assets.arrowIcon} alt="" /> : <img src={assets.crossIcon} alt="" />}
      </button>
      <div className='facultysideBarMenu'>
        {menuItems.map(({ path, icon, label }) => {
          const isActive = location.pathname.startsWith(`/dashboard/faculty/${path}`);

          return (
            <NavLink
              key={path}
              to={path}
              className={`facultysideBarMenuItem${isActive ? ' active' : ''}`}
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

export default FacultySideBar;
