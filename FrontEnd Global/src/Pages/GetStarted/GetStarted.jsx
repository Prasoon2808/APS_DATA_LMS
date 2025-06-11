import React, { useState, useEffect } from 'react';
import './GetStarted.css';
import { assets } from '../../assets/assets';
import NavbarWhite from '../../Component/Navbar/NavbarWhite';
import { useNavigate } from 'react-router-dom';

const GetStarted = () => {
  const navigate = useNavigate();

  return (
    <div className='loginPage'>
      <NavbarWhite />
      <div className='getStarted'>
        <img src={assets.APSbg} alt="" />
        <h1>Parameters.<br />Algorithms.<br />Logics</h1>
        <div className="glass-container">
          <div className="glass-inner">
            <form className="loginForm front">
              <h2>WELCOME</h2>
              <h3>TO THE FUTURE OF LEARNING!</h3>
              <button className='loginBtn' type="button" onClick={() => navigate('/login')}>Login</button>
              <button className='waitlistBtn' type="button" onClick={() => navigate('/waitlist')}>Join The Waitlist</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
