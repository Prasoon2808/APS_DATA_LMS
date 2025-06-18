// studentDashboard.jsx
import React, { useState } from 'react';
import NavbarBlack from '../../../Component/Navbar/NavbarBlack';
import SideBar from '../../../Component/SideBar/sideBar';
import { Outlet } from 'react-router-dom';
import './studentDashboard.css';

const StudentDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className='studentDashboard'>
      <NavbarBlack />
      <div className={`flex ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <SideBar onToggle={setIsSidebarCollapsed} />
        <div className="subPage">
          <Outlet context={{ isSidebarCollapsed }} />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
