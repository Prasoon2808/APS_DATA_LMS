import React, { useState, useEffect } from 'react';
import './GetStarted.css';
import { assets } from '../../assets/assets';
import NavbarWhite from '../../Component/Navbar/NavbarWhite';
import { useNavigate } from 'react-router-dom';

const GetStarted = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(true); // popup initially visible

  const handleChoice = (isIndian) => {
    setShowPopup(false);
    if (isIndian) {
      setShowPopup(false); // update with actual Indian student route
    } else {
      navigate('/international'); // update with actual non-Indian route
    }
  };

  return (
    <div className='loginPage'>
      <NavbarWhite />

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>Welcome to Edu<span>[LAB]</span> !</h2>
            <img src={assets.greetingAnimation} alt="" />
            <p>Please select your profile to continue:</p>
            <h3>Are you an Indian student or an international student?</h3>
            <div className="popup-buttons">
              <button onClick={() => handleChoice(true)}>I’m an Indian Student</button>
              <button onClick={() => handleChoice(false)}> I’m an International Student</button>
            </div>
          </div>
        </div>
      )}

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
