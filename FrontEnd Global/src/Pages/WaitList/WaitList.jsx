import React, { useState } from 'react';
import './WaitList.css';
import { assets } from '../../assets/assets';
import NavbarWhite from '../../Component/Navbar/NavbarWhite';
import axios from 'axios';
import config from '../../config/config';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const Waitlist = () => {
  const url = config.backendUrl;
  const [submitted, setSubmitted] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    name: '', gender: '', email: '', country: '', phone: '', institution: ''
  });

  const [emailVerified, setEmailVerified] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const verifyEmailWithWaitlistDemo = async () => {
    

    if (!formData.email || !formData.name) {
      return toast.error('Please enter your name and email first.');
    }
    setVerifyingEmail(true);
    try {
      const res = await axios.post(`${url}/api/send-waitlist-demo`, {
        toEmail: formData.email,
        name: formData.name
      });

      if (res.data.sent) {
        setEmailVerified(true);

        
      } else {
        toast.error('failed to send verification email.');
      }
    } catch (err) {
      toast.error('An error occurred while sending the verification email.');
    }
  };

  const handleSubmit = async () => {
    if (!emailVerified) return toast.error('Please verify your email first.');

    try {

      const res = await axios.post(`${url}/api/submit`, { user: formData });
      if (res.data.success) {
        setSubmitted(true);
      } else {
        toast.error('Failed to join the waitlist. Please try again later.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred.';
      toast.error(errorMessage);
      setEmailVerified(false);
      window.location.reload(); // Reload the page to reset the form
    }
  };

  return (
    <div className='loginPage'>
      <NavbarWhite />
      <div className='waitList'>
        <img className='coverImg' src={assets.APSbg} alt="" />
        <h1>Join Our <span>FREE</span> Eary-Access Waitlist!</h1>
        <div className="glass-container">
          <div className="glass-inner">
            {!submitted ? 
              (
                <form className="loginForm front">
                  <p>We are currently working on the platform. Please join the waitlist to get notified when we launch.</p>
                  <div className="horzBlock">
                    <div className="gender">
                      <label>Full Name*</label>
                      <input type="text" name='name' value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="gender">
                      <label>Gender*</label>
                      <select name="gender" value={formData.gender} onChange={handleChange} required>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="horzBlock">
                    <div className="gender">
                      <label>Email ID*</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <button
                      type='button'
                      className='loginBtn'
                      onClick={verifyEmailWithWaitlistDemo}
                      disabled={emailVerified}
                      style={{
                        cursor: emailVerified ? 'not-allowed' : 'pointer',
                        color: emailVerified ? '#000000' : '#ffffff',
                        backgroundColor: emailVerified ? '#ffffff' : '#a8cd3d',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      {emailVerified ? (
                        <img src={assets.tickAnimation} alt="Verified" style={{ width: '50px', height: '50px' }} />
                      ) : verifyingEmail ? (
                        <img src={assets.loadinganimation} alt="Loading" style={{ width: '100px', height: '100px' }} />
                      ) : (
                        'Verify Email'
                      )}
                    </button>

                  </div>
                  <div className="horzBlock">
                    <div className="gender">
                      <label>Current Country*</label>
                      <input type='text' name="country" value={formData.country} onChange={handleChange} />
                    </div>
                    <div className="gender">
                      <label>Phone No.*</label>
                      <input type='number' name="phone" value={formData.phone} onChange={handleChange} required />

                    </div>
                  </div>
                  <div className="gender">
                    <label>Enter your College*</label>
                    <input type='text' name="institution" value={formData.institution} onChange={handleChange} required />
                  </div>
                  
                  <button
                    type='button'
                    className='loginBtn'
                    onClick={handleSubmit}
                    disabled={!emailVerified}
                    style={{ opacity: emailVerified ? 1 : 0.6, cursor: emailVerified ? 'pointer' : 'not-allowed' }}
                  >
                    Join Waitlist
                  </button>
                </form>
              ) : (
                <div className="successMessage">
                  <img src={assets.thankuhAnimation} alt="Success" style={{width:'100px', height:'100px'}} />
                  <h2>Yay, You're on the Waitlist!</h2>
                  <p>We will notify you via email when we launch.</p>
                  <div className="horzBtn">
                    <button type="button" className='loginBtn' onClick={()=>navigate('/')}>Return to Home</button>
                    <button type="button" className='joinbtn' onClick={()=>{window.location.reload()}}>Add New Entry</button>
                  </div>
                </div>
              )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Waitlist;
