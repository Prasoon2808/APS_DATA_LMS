import React, { useState } from 'react';
import './NavbarBlack.css';
import { assets } from '../../assets/assets';
import LogoutButton from '../logoutbtn';
import { useAuth } from '../../context/AuthContext';

const NavbarBlack = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useAuth();

  const handleProfileClick = () => {
    setShowDropdown(prev => !prev);
  };

  return (
    <>
      <div className="nav-black">
        <img src={assets.logo} className="logo" alt="logo" />
        <div className="leftBar">
          <span className="user-name">Hello, {user?.name || 'User'}</span>
          <img src={assets.bellIcon} className="bellIcon" alt="bellIcon" />
          <img src={assets.streakIcon} className="streakIcon" alt="streakIcon" />
          <div className="profile-container">
            <img
              src={assets.profileIcon}
              className="profileIcon"
              alt="profileIcon"
              onClick={handleProfileClick}
            />
            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-item">Profile</div>
                <div className="dropdown-item">Settings</div>
                <div className="logout-btn-wrapper">
                  <LogoutButton />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarBlack;
