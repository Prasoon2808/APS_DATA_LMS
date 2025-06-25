import React, { useState } from 'react';
import './Events.css'; // custom but based on WaitList
import { assets } from '../../assets/assets';
import NavbarWhite from '../../Component/Navbar/NavbarWhite';
import axios from 'axios';
import config from '../../config/config';
import { toast } from 'react-toastify';
import MiniNavbar from '../../Component/Navbar/MiniNavbar';

const EventRegister = () => {
  const url = config.backendUrl;
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: '', gender: '', email: '', country: 'India', phone: '', institution: '', refCode: 'EXCL100IND'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { name, gender, email, country, phone, institution, refCode } = formData;
    if (!name || !gender || !email || !country || !phone || !institution || !refCode) {
      return toast.error('Please fill all required fields.');
    }

    try {
      const res = await axios.post(`${url}/api/event/register`, { user: formData });
      if (res.data.success) {
        setSubmitted(true);
      } else {
        toast.error('Registration failed.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div className='eventPage'>
      <NavbarWhite />
      <MiniNavbar />
      <div className='eventWrapper'>
        <img className='coverImg' src={assets.APSbg} alt="bg" />
        <h1>Register Here For The <span>Free Computational Design Workshop</span></h1>

        <div className="glass-container event-glass">
          <div className="event-layout">
            <div className="event-left">
              <img src={assets.event} alt="poster" className='eventPoster' />
            </div>

            <div className="event-right">
              {!submitted ? (
                <form className="eventForm">
                  <p>Be Part Of The <span>'Parametric Handshake'</span>, An Exclusively <span>FREE</span> Design Event For Computational Design Enthusiasts, Powered By <span>smartLABS</span></p>

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

                  <div className="gender">
                    <label>Email ID*</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                  </div>

                  <div className="horzBlock">
                    <div className="gender">
                      <label>Current Country*</label>
                      <input type='text' name="country" value={formData.country} readOnly />
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
                  <button type='button' className='loginBtn' onClick={handleSubmit}>Register Now</button>
                  <div className='empty'>&nbsp;</div>
                </form>
              ) : (
                <div className="successMessage">
                  <img src={assets.thankuhAnimation} alt="Success" />
                  <h2>You're Registered!</h2>
                  <p>We'll email you the Zoom details for the event One day prior to the scheduled date. For Early Access to More such events in future, Join our free waitlist!</p>
                  <div className="horzBtn">
                    <button type="button" className='loginBtn' onClick={()=>navigate('/waitlist')}>Join The Waitlist</button>
                    <button type="button" className='joinbtn' onClick={()=>window.location.reload()}>Register Friend</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegister;
