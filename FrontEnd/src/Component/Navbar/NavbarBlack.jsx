import React from 'react'
import './NavbarBlack.css'
import { assets } from '../../assets/assets'

const NavbarBlack = () => {
  return (
    <>
        <div className="nav-black">
            <img src={assets.logo} className="logo" alt="logo" />
            <div className="leftBar">
                <img src={assets.bellIcon} className="bellIcon" alt="bellIcon" />
                <img src={assets.streakIcon} className="streakIcon" alt="streakIcon" />
                <img src={assets.profileIcon} className="profileIcon" alt="profileIcon" />
            </div>
        </div>
    </>
  )
}

export default NavbarBlack