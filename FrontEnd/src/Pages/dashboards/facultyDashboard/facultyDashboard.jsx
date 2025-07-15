import React from 'react'
import NavbarBlack from '../../../Component/Navbar/NavbarBlack'
import { Outlet } from 'react-router-dom'
import FacultySideBar from '../../../Component/FacultySideBar/FacultySideBar'
import PageTitle from '../../../PageTitle'
import './FacultyDashboard.css'
const FacultyDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)

  return (
    <div className='facultyDashboard'>
      <PageTitle title='smartLABS Dashboard' />
      <NavbarBlack />
      <div className={`flex ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <FacultySideBar onToggle={setIsSidebarCollapsed} />
        <div className="subPage">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
export default FacultyDashboard