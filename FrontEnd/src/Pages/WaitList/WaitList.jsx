import React, { useState } from 'react';
import './WaitList.css';
import { assets } from '../../assets/assets';
import NavbarWhite from '../../Component/Navbar/NavbarWhite';
import axios from 'axios';
import config from '../../config/config';

const Waitlist = () => {
  const url = config.backendUrl;

  const [formData, setFormData] = useState({
    name: '', gender: '', email: '', country: '', affiliation: '', institution: ''
  });

  const [emailVerified, setEmailVerified] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(20);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const verifyEmailWithWaitlistDemo = async () => {
    if (cooldown) {
      alert(`Please wait ${cooldownTime}s before retrying.`);
      return;
    }

    if (!formData.email || !formData.name) {
      return alert('Please enter your name and email first.');
    }

    try {
      const res = await axios.post(`${url}/api/send-waitlist-demo`, {
        toEmail: formData.email,
        name: formData.name
      });

      if (res.data.sent) {
        setEmailVerified(true);
        alert('Verification email sent successfully.');

        setCooldown(true);
        let time = 20;
        const interval = setInterval(() => {
          time--;
          setCooldownTime(time);
          if (time <= 0) {
            clearInterval(interval);
            setCooldown(false);
            setCooldownTime(20);
          }
        }, 1000);
      } else {
        alert('Failed to send email.');
      }
    } catch (err) {
      alert('Verification failed.');
    }
  };

  const handleSubmit = async () => {
    if (!emailVerified) return alert('Please verify your email first.');

    try {
      const check = await axios.post(`${url}/api/check-email-exists`, { email: formData.email });
      if (check.data.exists) return alert('This email is already on the waitlist.');

      const res = await axios.post(`${url}/api/submit-waitlist`, { user: formData });
      if (res.data.success) {
        alert('Successfully added to waitlist!');
        window.location.href = '/thank-you';
      } else {
        alert('Submission failed.');
      }
    } catch (err) {
      alert('An error occurred.');
    }
  };

  return (
    <div className='loginPage'>
      <NavbarWhite />
      <div className='waitList'>
        <img src={assets.APSbg} alt="" />
        <h1>JOIN THE WAITLIST</h1>
        <div className="glass-container">
          <div className="glass-inner">
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
                  disabled={emailVerified || cooldown}
                  style={{ opacity: (emailVerified || cooldown) ? 0.6 : 1 }}
                >
                  {emailVerified ? 'Verified' : (cooldown ? `Wait ${cooldownTime}s` : 'Verify Email')}
                </button>
              </div>
              <div className="horzBlock">
                <div className="gender">
                  <label>Current Country*</label>
                  <input type='text' name="country" value={formData.country} onChange={handleChange} />
                </div>
                <div className="gender">
                  <label>Affiliation*</label>
                  <select name="affiliation" value={formData.affiliation} onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="college">College</option>
                    <option value="organization">Organization</option>
                  </select>
                </div>
              </div>
              {formData.affiliation && (
                <div className="gender">
                  <label>Enter your {formData.affiliation === 'college' ? 'College' : 'Organization'}</label>
                  <input name="institution" value={formData.institution} onChange={handleChange} required />
                </div>
              )}
              <button
                type='button'
                className='loginBtn'
                onClick={handleSubmit}
                disabled={!emailVerified}
                style={{ opacity: emailVerified ? 1 : 0.6, cursor: emailVerified ? 'pointer' : 'not-allowed' }}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Waitlist;
