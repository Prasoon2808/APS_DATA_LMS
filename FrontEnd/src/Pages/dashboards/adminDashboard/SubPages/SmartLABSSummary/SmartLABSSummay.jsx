import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './SmartLABSSummary.css';
import config from '../../../../../config/config';
import { useAuth } from '../../../../../context/AuthContext';

export default function AdminSummaryForm({ mode = 'add' }) {
  const { user } = useAuth();
  const userId = user?._id;
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sessionTitle: '',
    sessionDate: '',
    coverImage: '',
    recordingLink: '',
    tag: '',
    summaryText: [{ heading: '', description: '' }]
  });

  useEffect(() => {
    if (mode === 'edit') {
      axios.get(`${config.backendUrl}/api/smartlabs/session-summary/${id}`).then(res => {
        const d = res.data;
        setFormData({
          sessionTitle: d.sessionTitle,
          sessionDate: d.sessionDate.split('T')[0],
          coverImage: d.coverImage,
          recordingLink: d.recordingLink,
            tag: d.tag,
          summaryText: d.summaryText
        });
      });
    }
  }, [mode, id]);

  const handleOAuth = () => {
    if (!user || !userId) return alert("User not logged in");
    const redirectURL = `https://api.edu-lab.in/api/oauth2/youtube?userId=${userId}`;
    window.location.href = redirectURL;
  };
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSectionChange = (index, field, value) => {
    const updated = [...formData.summaryText];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, summaryText: updated }));
  };

  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      summaryText: [...prev.summaryText, { heading: '', description: '' }]
    }));
  };

  const removeSection = index => {
    const updated = formData.summaryText.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, summaryText: updated }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (mode === 'edit') {
      await axios.put(`${config.backendUrl}/api/smartlabs/session-summary/${id}`, formData);
      alert('Updated!');
    } else {
      await axios.post(`${config.backendUrl}/api/smartlabs/session-summary`, formData);
      alert('Added!');
    }
  };

  return (
    <div className="admin-form">
      <h2>{mode === 'edit' ? 'Edit' : 'Add'} Summary</h2>
      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
    <button
      style={{
        backgroundColor: '#a8cd3d',
        color: 'white',
        padding: '0.6rem 1.2rem',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        cursor: 'pointer'
      }}
      onClick={handleOAuth}
    >
      🔗 Connect YouTube Account
    </button>
  </div>
      <form onSubmit={handleSubmit}>
        <input name="sessionTitle" placeholder="Title" value={formData.sessionTitle} onChange={handleChange} required />
        <input name="sessionDate" type="date" value={formData.sessionDate} onChange={handleChange} required />
        <input type="text" name='tag' placeholder='Tag' value={formData.tag} onChange={handleChange} required />
        <input name="recordingLink" placeholder="Recording Link" value={formData.recordingLink} onChange={handleChange} required />

        {formData.summaryText.map((section, index) => (
          <div key={index} className="section-block">
            <input
              type="text"
              placeholder="Section Heading"
              value={section.heading}
              onChange={e => handleSectionChange(index, 'heading', e.target.value)}
              required
            />
            <textarea
              placeholder="Section Description"
              rows={4}
              value={section.description}
              onChange={e => handleSectionChange(index, 'description', e.target.value)}
              required
            />
            {formData.summaryText.length > 1 && (
              <button type="button" onClick={() => removeSection(index)}>Remove</button>
            )}
          </div>
        ))}
        <button type="button" onClick={addSection}>+ Add Section</button>
        <button type="submit">{mode === 'edit' ? 'Update' : 'Add'} Summary</button>
      </form>
    </div>
  );
}