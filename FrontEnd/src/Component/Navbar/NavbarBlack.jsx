import React, { useState } from 'react';
import './NavbarBlack.css';
import { assets } from '../../assets/assets';
import LogoutButton from '../logoutbtn';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const avatarMap = import.meta.glob('../../assets/Avatar/*.jpg', {
  eager: true,
  import: 'default',
});

const NavbarBlack = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useAuth();

  const avatarSrc = avatarMap[`../../assets/Avatar/${user?.avatar}`];

  const handleProfileClick = () => {
    setShowDropdown(prev => !prev);
  };

  return (
    <div className="nav-black">
      <img src={assets.logo} className="logo" alt="logo" />

      <div className="leftBar">
        <span className="user-name">Hello, {user?.name || 'User'}</span>
        <img src={assets.bellIcon} className="bellIcon" alt="bell" />
        <img src={assets.streakIcon} className="streakIcon" alt="streak" />

        <div className="profile-container">
          <img
            src={avatarSrc}
            className="profileIcon"
            alt="avatar"
            onClick={handleProfileClick}
          />

          {showDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-item">
                <Link
                  to={`/dashboard/${user?.role}/profile`}
                  onClick={() => setShowDropdown(false)}
                >
                  Profile
                </Link>
              </div>
              <div className="dropdown-item">Settings</div>
              <div className="logout-btn-wrapper">
                <LogoutButton />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavbarBlack;
