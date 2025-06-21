import React from 'react'
import './AdminSideBar.css';
import { assets } from '../../assets/assets';
import { NavLink, useLocation } from 'react-router-dom';

const menuItems = [
    { path: 'waitlist-approval', icon: assets.courseIcon, label: 'Approve Waitlist' },
    { path: 'course-creation', icon: assets.assignmentIcon, label: 'Course Creation' },
    { path: 'course-management', icon: assets.quizIcon, label: 'Course Management' },
    { path: 'user-management', icon: assets.searchIcon, label: 'User Management' },
    { path: 'sent-invites', icon: assets.sendInviteIcon, label: 'Send Invites' },

]

const AdminSideBar = ({onToggle}) => {
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const location = useLocation();

    const toggleSidebar = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        if (onToggle) onToggle(newState);
    };

    return (
        <div className={`adminSideBar ${isCollapsed ? 'collapsed' : ''}`}>
            <button className="toggleBtn" onClick={toggleSidebar}>
                {isCollapsed ? <img src={assets.arrowIcon} alt="" /> : <img src={assets.crossIcon} alt="" />}
            </button>
            <div className='adminSideBarMenu'>
                {menuItems.map(({ path, icon, label }) => {
                    const isActive = location.pathname.startsWith(`/dashboard/admin/${path}`);

                    return (
                        <NavLink
                            key={path}
                            to={path}
                            className={`adminSideBarMenuItem${isActive ? ' active' : ''}`}
                        >
                            <img src={icon} alt="icon" />
                            {!isCollapsed && <span>{label}</span>}
                        </NavLink>
                    );
                })}
            </div>
        </div>
    );
  
}

export default AdminSideBar