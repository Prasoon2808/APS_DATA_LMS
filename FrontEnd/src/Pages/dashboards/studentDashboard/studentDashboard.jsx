// studentDashboard.jsx
import React, { useState } from 'react';
import NavbarBlack from '../../../Component/Navbar/NavbarBlack';
import SideBar from '../../../Component/SideBar/sideBar';
import { Outlet } from 'react-router-dom';
import './studentDashboard.css';
import PageTitle from '../../../PageTitle';

const StudentDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className='studentDashboard'>
      <PageTitle title='Student Dashboard' />
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
