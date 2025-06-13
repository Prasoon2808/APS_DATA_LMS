import React from 'react';
import { NavLink } from 'react-router-dom';
import './MiniNavbar.css';
import { assets } from '../../assets/assets';


const navItems = [
  { name: 'Home', path: '/', icon: assets.homeIcon },
  { name: 'About', path: '/about', icon: assets.aboutIcon },
  { name: 'FAQs', path: '/faqs', icon: assets.faqIcon },
];

const MiniNavbar = () => {
  return (
    <div className="right-navbar">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
            `nav-link ${isActive ? 'active' : ''}`
          }
        >
          <img src={item.icon} alt={item.name} className="nav-icon" />
          <span className="nav-label">{item.name}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default MiniNavbar;
