import React, { useState } from 'react';
import './WaitList.css';
import { assets } from '../../assets/assets';
import NavbarWhite from '../../Component/Navbar/NavbarWhite';
import axios from 'axios';

const Waitlist = () => {
  const [stage, setStage] = useState('waitlist');
  const url = 'https://aps-data-lms-backend.onrender.com';
  const [currentReferralIndex, setCurrentReferralIndex] = useState(0);


  const [formData, setFormData] = useState({
    name: '', gender: '', email: '', country: '', countryCode: '+91', affiliation: '', institution: ''
  });

  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpInput, setEmailOtpInput] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);

  const [referrals, setReferrals] = useState([
    { name: '', gender: '', email: '', country: '', countryCode: '+91', affiliation: '', institution: '', verified: false }
  ]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReferralChange = (index, field, value) => {
    const updated = [...referrals];
    updated[index][field] = value;
    setReferrals(updated);
  };

  const sendEmailOtp = async () => {
    try {
      const res = await axios.post(`${url}/api/send-email-otp`, { email: formData.email });
      if (res.data.sent) {
        setEmailOtpSent(true);
        alert('Email OTP sent successfully');
      } else {
        alert('Failed to send OTP');
      }
    } catch (error) {
      alert('Error sending OTP');
    }
  };

  const verifyEmailOtp = async () => {
    try {
      const res = await axios.post(`${url}/api/verify-email-otp`, { email: formData.email, otp: emailOtpInput });
      if (res.data.verified) {
        setEmailVerified(true);
        alert('Email verified successfully');
      } else {
        alert('Invalid OTP');
      }
    } catch (error) {
      alert('Error verifying OTP');
    }
  };

  const verifyReferralEmail = async (index) => {
    const referral = referrals[index];
    try {
      const res = await axios.post(`${url}/api/send-referral-demo`, {
        toEmail: referral.email,
        referredBy: formData.name
      });
      if (res.data.sent) {
        const updated = [...referrals];
        updated[index].verified = true;
        setReferrals(updated);
        alert('Referral email verified');
      } else {
        alert('Invalid or undeliverable email');
      }
    } catch {
      alert('Failed to verify referral email');
    }
  };

  const handleNext = () => {
    if (!emailVerified) {
      return alert("Please verify your email before proceeding.");
    }
    setStage('referral');
  };

  const addReferral = () => {
  if (!referrals[currentReferralIndex].verified) {
    return alert('Please verify this referral email before adding another.');
  }

  if (referrals.length < 5) {
    setReferrals([
      ...referrals,
      {
        name: '', gender: '', email: '', country: '', countryCode: '+91',
        affiliation: '', institution: '', verified: false
      }
    ]);
    setCurrentReferralIndex(currentReferralIndex + 1);
  }
};



  const handleSubmit = async () => {
    if (referrals.length !== 5 || referrals.some(r => !r.verified)) {
      return alert('Please verify all 5 referrals before submitting.');
    }
    try {
        console.log('Submitting with:', { user: formData, referrals });
      const res = await axios.post(`${url}/api/submit`, { user: formData, referrals });
      if (res.data.success) {
        alert('Submitted successfully');
        window.location.href = '/thank-you';
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert('Submission failed');
    }
  };

  return (
    <div className='loginPage'>
      <NavbarWhite />
      <div className='waitList'>
        <img src={assets.APSbg} alt="" />
        <h1>JOIN THE WAITLIST</h1>
        <div className={`glass-container ${stage === 'referral' ? 'flip' : ''}`}>
          <div className="glass-inner">
            {stage === 'waitlist' ? (
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
                  <button type='button' className='loginBtn' onClick={sendEmailOtp}>Send OTP</button>
                </div>
                {emailOtpSent && (
                  <div className="horzBlock">
                    <div className="gender">
                      <label>Enter Email OTP</label>
                      <input value={emailOtpInput} onChange={(e) => setEmailOtpInput(e.target.value)} />
                    </div>
                    <button type='button' className='loginBtn' onClick={verifyEmailOtp}>Verify</button>
                  </div>
                )}
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
                <button type='button' className='loginBtn' onClick={handleNext}>Next</button>
              </form>
            ) : (
              <form className="loginForm back">
                <p>Refer 5 Friends to complete your registration.</p>
                {referrals.map((r, i) =>  i === currentReferralIndex && (
                  <div key={i} className="referral-entry">
                    <p>Referral {i+1}</p>
                    <div className="horzBlock">
                        <div className="gender">
                            <label>Referral Name*</label>
                            <input placeholder="Referral Name" value={r.name} onChange={e => handleReferralChange(i, 'name', e.target.value)} />
                        </div>
                        <div className="gender">
                            <label>Gender*</label>
                            <select value={r.gender} onChange={e => handleReferralChange(i, 'gender', e.target.value)}>
                                <option value="">Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div className="horzBlock">
                        <div className="gender">
                            <label>Email*</label>
                            <input type="email" placeholder="Email" value={r.email} onChange={e => handleReferralChange(i, 'email', e.target.value)} required />
                        </div>
                        <button type='button' className='loginBtn' onClick={() => verifyReferralEmail(i)}>{r.verified ? 'Verified' : 'Verify Email'}</button>
                    </div>
                    <div className="horzBlock">
                        <div className="gender">
                            <label>Country*</label>
                            <input placeholder="Country" value={r.country} onChange={e => handleReferralChange(i, 'country', e.target.value)} />
                        </div>
                        <div className="gender">
                            <label>Affiliation*</label>
                            <select value={r.affiliation} onChange={e => handleReferralChange(i, 'affiliation', e.target.value)}>
                                <option value="">Affiliation</option>
                                <option value="college">College</option>
                                <option value="organization">Organization</option>
                            </select>
                        </div>
                    </div>
                    {r.affiliation && (
                        <div className="gender">
                            <label>{r.affiliation === 'college' ? 'College' : 'Organization'}*</label>
                            <input type='text' placeholder={r.affiliation === 'college' ? 'College' : 'Organization'} value={r.institution} onChange={e => handleReferralChange(i, 'institution', e.target.value)} />
                        </div>
                    )}
                  </div>
                ))}
                <div className="horzBlock">
                    {currentReferralIndex === 0 && (
                        <button type='button' className='loginBtn' onClick={() => setStage('waitlist')}>
                            Back
                        </button>
                    )}
                    {currentReferralIndex > 0 && (
                        <button
                            type="button"
                            className="loginBtn"
                            onClick={() => setCurrentReferralIndex(currentReferralIndex - 1)}
                        >
                            Previous Referral
                        </button>
                    )}
                    {currentReferralIndex < referrals.length - 1 && (
                        <button
                        type="button"
                        className="loginBtn"
                        onClick={() => setCurrentReferralIndex(currentReferralIndex + 1)}
                        >
                            Next Referral
                        </button>
                    )}
                    {referrals.length < 5 && (
                    <button type='button' className='loginBtn' onClick={addReferral}>Add Referral</button>
                    )}
                    {referrals.length === 5 && (
                    <button type='button' className='loginBtn' onClick={handleSubmit}>Submit</button>
                    )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Waitlist;
