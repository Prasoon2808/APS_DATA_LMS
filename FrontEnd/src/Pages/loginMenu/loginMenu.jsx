import React, { useState, useEffect } from 'react';
import './loginMenu.css';
import { assets } from '../../assets/assets';
import NavbarWhite from '../../Component/Navbar/NavbarWhite';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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
  useEffect(() => {
    if (user) {
      navigate(`/dashboard/${user.role}`);
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
        role: selectedOption,
        remember: isChecked,
      });

      login(res.data, isChecked); // pass remember flag
      navigate(`/dashboard/${res.data.user.role}`);
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.msg || "Server error"));
    }
  };


  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email: forgotEmail,
      });
  
      alert(res.data.msg); // ✅ Show in alert
      setShowForgot(false); // ✅ Flip back to login
      setForgotEmail("");   // ✅ Optional: reset input
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to send reset email.");
    }
  };


  return (
    <div className='loginPage'>
      <NavbarWhite />

      <div className='main'>
        <img src={assets.APSbg} alt="" />
        <h1>Parameters.<br />Algorithms.<br />Logics</h1>
        <div className={`glass-container ${showForgot ? 'flip' : ''}`}>
          <div className="glass-inner">
            {/* Front side: Login Form */}
            <form className="loginForm front" onSubmit={handleLogin}>
              <h2>Login</h2>

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
                <img src={assets.mailIcon} alt="mail" />
              </div>

              <div className="line">
                <input type={showPassword ? "text" : "password"} placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                <img src={assets.lockIcon} alt="lock" />
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
                <img src={assets.mailIcon} alt="mail" />
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
