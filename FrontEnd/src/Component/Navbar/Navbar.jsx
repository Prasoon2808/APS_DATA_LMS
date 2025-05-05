import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'

const Navbar = () => {
  return (
    <>
        <div className="nav">
            <img src={assets.logo} className="logo" alt="logo" />
            
        </div>
    </>
  )
}

export default Navbar