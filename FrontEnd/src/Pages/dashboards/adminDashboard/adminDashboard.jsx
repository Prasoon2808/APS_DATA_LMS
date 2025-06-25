import React from 'react'
import NavbarBlack from '../../../Component/Navbar/NavbarBlack'
import { Outlet } from 'react-router-dom'
import AdminSideBar from '../../../Component/AdminSideBar/AdminSideBar'
import PageTitle from '../../../PageTitle'

const adminDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)
  return (
    <div className='adminDashboard'>
      <PageTitle title='Admin Dashboard' />
      <NavbarBlack />
      <div className={`flex ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <AdminSideBar onToggle={setIsSidebarCollapsed} />
        <div className="subPage">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default adminDashboard