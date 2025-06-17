import React, { useState, useEffect } from 'react';
import './loginMenu.css';
import { assets } from '../../assets/assets';
import NavbarWhite from '../../Component/Navbar/NavbarWhite';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import config from '../../config/config';
import { toast } from 'react-toastify';
import MiniNavbar from '../../Component/Navbar/MiniNavbar'

const LoginMenu = () => {
  const [selectedOption, setSelectedOption] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");

  const navigate = useNavigate();
  const {  user, login } = useAuth();
  const url = config.backendUrl;
  useEffect(() => {
    if (user) {
      navigate(`/dashboard/${user.role}`);
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/api/auth/login`, {
        email,
        password,
        role: selectedOption,
        remember: isChecked,
      });

      login(res.data, isChecked); // pass remember flag
      navigate(`/dashboard/${res.data.user.role}`);

    } catch (err) {
      toast.error("Login failed: " + (err.response?.data?.msg || "Server error"));
    }
  };
  const handlecrossIconClick = () => {
    navigate("/");
  };


  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/api/auth/forgot-password`, {
        email: forgotEmail,
      });
  
      toast.error(res.data.msg); // ✅ Show in alert
      setShowForgot(false); // ✅ Flip back to login
      setForgotEmail("");   // ✅ Optional: reset input
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to send reset email.");
    }
  };


  return (
    <div className='loginPage'>
      <NavbarWhite />
      <MiniNavbar />
      

      <div className='main'>
        <img className='coverImage' src={assets.APSbg} alt=""/>
        <h1>Generations.<br />Parameters.<br />Algorithms</h1>
        <div className={`glass-container ${showForgot ? 'flip' : ''}`}>
          <div className="glass-inner">
            {/* Front side: Login Form */}
            <form className="loginForm front" onSubmit={handleLogin}>
              <h2>Login</h2>
              <img className='crossIcon' src={assets.crossIconWhite} alt="" onClick={handlecrossIconClick} />
              <div className="radioRole">
                {['student', 'faculty', 'admin'].map((role) => (
                  <label key={role}>
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={selectedOption === role}
                      onChange={(e) => setSelectedOption(e.target.value)}
                    />
                    <p>{role.charAt(0).toUpperCase() + role.slice(1)}</p>
                  </label>
                ))}
              </div>

              <div className="line">
                <input type="email" placeholder='Email ID' value={email} onChange={(e) => setEmail(e.target.value)} required />
                <img className='inputIcon' src={assets.mailIcon} alt="mail" />
              </div>

              <div className="line">
                <input type={showPassword ? "text" : "password"} placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                <img className='inputIcon' src={assets.lockIcon} alt="lock" />
              </div>

              <div className="horzCont">
                <label className='check'>
                  <input type="checkbox" checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} />
                  <p className='rememberMe'>Remember Me</p>
                </label>
                <span onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "Hide Password" : "Show Password"}
                </span>
              </div>

              <button className='loginBtn' type="submit">Login</button>
              <a href="#" className='forgetPass' onClick={(e) => { e.preventDefault(); setShowForgot(true); }}>
                Forget Password?
              </a>
            </form>

            {/* Back side: Forgot Password Form */}
            <form className="forgotForm back" onSubmit={handleForgotSubmit}>
              <h2>Forgot Password</h2>
              <div className="line">
                <input type="email" placeholder='Enter your registered email' value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required />
                <img className='inputIcon' src={assets.mailIcon} alt="mail" />
              </div>
              <button className='loginBtn' type="submit">Send Recovery Email</button>
              <a href="#" className='forgetPass' onClick={(e) => { e.preventDefault(); setShowForgot(false); }}>Back to Login</a>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginMenu;
