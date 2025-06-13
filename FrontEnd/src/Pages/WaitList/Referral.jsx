import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Referral.css';
import { assets } from '../../assets/assets';
import NavbarWhite from '../../Component/Navbar/NavbarWhite';
import config from '../../config/config';
import { toast } from 'react-toastify';
import { FaPlus, FaMinus } from 'react-icons/fa';

const ReferralForm = () => {
  const navigate = useNavigate();
  const [referrals, setReferrals] = useState(
    Array.from({ length: 5 }, () => ({ name: '', email: '' }))
  );
  const [openIndex, setOpenIndex] = useState(0); // First one open

  const handleChange = (index, field, value) => {
    const updated = [...referrals];
    updated[index][field] = value;
    setReferrals(updated);
  };

  const toggleReferral = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSubmit = async () => {
    if (referrals.some(r => !r.name || !r.email)) {
      return toast.error('Please fill in all 5 referrals before submitting.');
    }

    const user = JSON.parse(localStorage.getItem('mainUser'));
    try {
      const res = await axios.post(`${config.backendUrl}/api/referral/submit`, { user, referrals });
      if (res.data.success) {
        toast.success('Referrals submitted successfully!');
        navigate('/');
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      toast.error('Error submitting referrals. Try again.');
    }
  };

  return (
    <div className="loginPage">
      <NavbarWhite />
      <img className="coverImg" src={assets.APSbg} alt="background" />
      <div className="referral">
        <h1>Refer & Rise</h1>
        <div className="glass-container referral-scroll">
          <h2>Invite 5 Friends & Climb the Waitlist!</h2>
          <form className="loginForm">
            {referrals.map((r, i) => (
              <div key={i} className="referral-entry">
                <div className="referral-header" onClick={() => toggleReferral(i)}>
                  <p>Referral {i + 1}</p>
                  {openIndex === i ? <FaMinus /> : <FaPlus />}
                </div>
                {openIndex === i && (
                  <div className="referral-body">
                    <div className="gender">
                      <label>Full Name*</label>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={r.name}
                        onChange={e => handleChange(i, 'name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="gender">
                      <label>Email*</label>
                      <input
                        type="email"
                        placeholder="Email"
                        value={r.email}
                        onChange={e => handleChange(i, 'email', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button type="button" className="loginBtn" onClick={handleSubmit}>
              Submit Referrals
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReferralForm;
