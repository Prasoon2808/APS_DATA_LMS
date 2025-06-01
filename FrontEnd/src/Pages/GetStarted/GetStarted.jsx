import React from 'react';
import './GetStarted.css';
import { assets } from '../../assets/assets';
import NavbarWhite from '../../Component/Navbar/NavbarWhite';
import { useNavigate } from 'react-router-dom';

const GetStarted = () => {

  const navigate = useNavigate();
  
  return (
    <div className='loginPage'>
      <NavbarWhite />

      <div className='main'>
        <img src={assets.APSbg} alt="" />
        <h1>Parameters.<br />Algorithms.<br />Logics</h1>
        <div className="glass-container" >
          <div className="glass-inner">
            {/* Front side: Login Form */}
            <form className="loginForm front" >
              <h2>WELCOME</h2>
              <button className='loginBtn' type="button" onClick={()=> navigate('/login')}>Login</button>
              <button className='loginBtn' type="button">Join The Waitlist</button>
            

              
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GetStarted;
