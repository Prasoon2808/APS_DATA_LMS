import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReferralForm = () => {
  const navigate = useNavigate();
  const [referrals, setReferrals] = useState([{ name: '', gender: '', email: '', country: '', countryCode: '+91', affiliation: '', institution: '', verified: false }]);

  const handleChange = (index, field, value) => {
    const updated = [...referrals];
    updated[index][field] = value;
    setReferrals(updated);
  };

  const verifyEmail = async (index) => {
    const email = referrals[index].email;
    try {
      const send = await axios.post('/api/send-email-otp', { email });
      if (send.data.sent) {
        const otp = prompt('Enter the OTP sent to referral email');
        const verify = await axios.post('/api/verify-email-otp', { email, otp });
        if (verify.data.verified) {
          const updated = [...referrals];
          updated[index].verified = true;
          setReferrals(updated);
          alert('Referral email verified');
        } else {
          alert('Invalid OTP');
        }
      }
    } catch {
      alert('Error sending or verifying OTP');
    }
  };

  const addReferral = () => {
    if (referrals.length < 5) {
      setReferrals([...referrals, { name: '', gender: '', email: '', country: '', countryCode: '+91', affiliation: '', institution: '', verified: false }]);
    }
  };

  const handleSubmit = async () => {
    if (referrals.length !== 5 || referrals.some(r => !r.verified)) {
      return alert('Please verify all 5 referrals before submitting.');
    }
    const user = JSON.parse(localStorage.getItem('mainUser'));
    const res = await axios.post('/api/submit', { user, referrals });
    if (res.data.success) {
      alert('All data submitted successfully!');
      navigate('/thank-you');
    } else {
      alert(res.data.message);
    }
  };

  return (
    <div className="referral-form">
      <h2>Refer 5 Friends</h2>
      {referrals.map((r, i) => (
        <div key={i} className="referral-entry">
          <input placeholder="Full Name" value={r.name} onChange={e => handleChange(i, 'name', e.target.value)} required />
          <select value={r.gender} onChange={e => handleChange(i, 'gender', e.target.value)} required>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input type="email" placeholder="Email" value={r.email} onChange={e => handleChange(i, 'email', e.target.value)} required />
          <input placeholder="Country" value={r.country} onChange={e => handleChange(i, 'country', e.target.value)} required />
          <select value={r.affiliation} onChange={e => handleChange(i, 'affiliation', e.target.value)} required>
            <option value="">Affiliation</option>
            <option value="college">College</option>
            <option value="organization">Organization</option>
          </select>
          {r.affiliation && (
            <input placeholder={r.affiliation === 'college' ? 'College' : 'Organization'} value={r.institution} onChange={e => handleChange(i, 'institution', e.target.value)} required />
          )}
          <button type='button' onClick={() => verifyEmail(i)}>{r.verified ? 'Verified' : 'Verify Email'}</button>
        </div>
      ))}
      {referrals.length < 5 && (
        <button onClick={addReferral}>Add Referral</button>
      )}
      {referrals.length === 5 && (
        <button onClick={handleSubmit}>Submit</button>
      )}
    </div>
  );
};

export default ReferralForm;
