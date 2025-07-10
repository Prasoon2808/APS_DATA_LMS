import React, { useEffect, useState } from 'react';
import './Events.css';
import { assets } from '../../assets/assets';
import NavbarWhite from '../../Component/Navbar/NavbarWhite';
import MiniNavbar from '../../Component/Navbar/MiniNavbar';
import PageTitle from '../../PageTitle';
import config from '../../config/config';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EventRegister = () => {
  const url = config.backendUrl;
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${url}/api/event-meta/all`);
        if (res.data?.length) {
          const latest = res.data[0]; // assuming sorted by latest
          setEvent(latest);

          // Init blank form fields
          const fields = {};
          latest.inputFields.forEach(field => {
            if (field === 'country') fields[field] = 'India';
            else if (field === 'refCode') fields[field] = 'EXCL100IND';
            else fields[field] = '';
          });
          setFormData(fields);
        }
      } catch (err) {
        toast.error('Failed to load event details.');
      }
    };
    fetchEvent();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async () => {
    if (!event) return;

    const isEmpty = event.inputFields.some(f => !formData[f]?.trim());
    if (isEmpty) return toast.error('Please fill all required fields.');

    try {
      const payload = { ...formData, eventId: event.eventId };
      const res = await axios.post(`${url}/api/event/register`, { user: payload });
      if (res.data.success) setSubmitted(true);
      else toast.error('Registration failed.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div className='eventPage'>
      <PageTitle title='Events' />
      <NavbarWhite />
      <MiniNavbar />
      <div className='eventWrapper'>
        <img className='coverImg' src={assets.APSbg} alt="bg" />
        <h1>Register For <span>{event?.eventName || 'Our Latest Event'}</span></h1>

        <div className="glass-container event-glass">
          <div className="event-layout">
            <div className="event-left">
              <img src={event?.posterUrl || assets.event} alt="poster" className='eventPoster' />
            </div>

            <div className="event-right">
              {!submitted ? (
                <form className="eventForm">
                  <p>You're invited to <span>{event?.eventName}</span>, an exclusive FREE event by <span>smartLABS</span>.</p>
                  <div className="horzBlock">
                    {event?.inputFields.includes('name') && (
                      <div className="gender">
                        <label>Full Name*</label>
                        <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required />
                      </div>
                    )}
                    {event?.inputFields.includes('gender') && (
                      <div className="gender">
                        <label>Gender*</label>
                        <select name="gender" value={formData.gender || ''} onChange={handleChange}>
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    )}
                  </div>
                  {event?.inputFields.includes('email') && (
                    <div className="gender">
                      <label>Email*</label>
                      <input type="email" name="email" value={formData.email || ''} onChange={handleChange} required />
                    </div>
                  )}
                  <div className="horzBlock">
                    {event?.inputFields.includes('country') && (
                      <div className="gender">
                        <label>Country*</label>
                        <input type="text" name="country" value={formData.country || ''} onChange={handleChange} />
                      </div>
                    )}
                    {event?.inputFields.includes('phone') && (
                      <div className="gender">
                        <label>Phone*</label>
                        <input type="number" name="phone" value={formData.phone || ''} onChange={handleChange} />
                      </div>
                    )}
                  </div>
                  {event?.inputFields.includes('institution') && (
                    <div className="gender">
                      <label>College or Organization*</label>
                      <input type="text" name="institution" value={formData.institution || ''} onChange={handleChange} />
                    </div>
                  )}


                  <button type="button" className='loginBtn' onClick={handleSubmit}>Register Now</button>
                  <div className="empty" />
                </form>
              ) : (
                <div className="successMessage">
                  <img src={assets.thankuhAnimation} alt="Success" />
                  <h2>You're Registered!</h2>
                  <p>Zoom link will be emailed 1 day before the event. Want early access? Join the waitlist.</p>
                  <div className="horzBtn">
                    <button type="button" className='loginBtn' onClick={() => navigate('/waitlist')}>Join Waitlist</button>
                    <button type="button" className='joinbtn' onClick={() => window.location.reload()}>Register Another</button>
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
