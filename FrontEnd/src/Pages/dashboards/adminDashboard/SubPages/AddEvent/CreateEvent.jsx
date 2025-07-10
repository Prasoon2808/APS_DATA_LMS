import React, { useState } from 'react';
import axios from 'axios';
import './CreateEvent.css';
import config from '../../../../../config/config'; // Adjust path

const fieldOptions = [
  'name',
  'email',
  'phone',
  'gender',
  'country',
  'institution',
  'refCode'
];

const CreateEvent = () => {
  const url = config.backendUrl;
  const [eventData, setEventData] = useState({
    eventId: '',
    eventName: '',
    posterUrl: '',
    inputFields: []
  });
  const [message, setMessage] = useState('');

  const handleCheckboxChange = (field) => {
    setEventData(prev => {
      const exists = prev.inputFields.includes(field);
      const newFields = exists
        ? prev.inputFields.filter(f => f !== field)
        : [...prev.inputFields, field];
      return { ...prev, inputFields: newFields };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Submitting...');
    try {
      const res = await axios.post(`${url}/api/event-meta/create`, eventData);
      setMessage(res.data.message || 'Success');
      setEventData({ eventId: '', eventName: '', posterUrl: '', inputFields: [] });
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div className="createEventContainer">
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit} className="addEventForm">
        <label>Event ID*</label>
        <input type="text" value={eventData.eventId} onChange={e => setEventData({ ...eventData, eventId: e.target.value })} required />

        <label>Event Name*</label>
        <input type="text" value={eventData.eventName} onChange={e => setEventData({ ...eventData, eventName: e.target.value })} required />

        <label>Poster URL*</label>
        <input type="url" value={eventData.posterUrl} onChange={e => setEventData({ ...eventData, posterUrl: e.target.value })} required />

        <label>Input Fields*</label>
        <div className="checkboxGroup">
          {fieldOptions.map(field => (
            <label key={field} className="checkboxItem">
              <input
                type="checkbox"
                checked={eventData.inputFields.includes(field)}
                onChange={() => handleCheckboxChange(field)}
              />
              {field}
            </label>
          ))}
        </div>

        <button type="submit">Create Event</button>
        {message && <p className="statusMsg">{message}</p>}
      </form>
    </div>
  );
};

export default CreateEvent;
