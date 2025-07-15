import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../config/config';
import { useAuth } from '../../context/AuthContext';

import './ProfilePage.css';
import { assets } from '../../assets/assets';

const avatarOptions = [
  { file: '1.jpg', src: assets.avatar1 },
  { file: '2.jpg', src: assets.avatar2 },
  { file: '3.jpg', src: assets.avatar3 },
  { file: '4.jpg', src: assets.avatar4 },
  { file: '5.jpg', src: assets.avatar5 },
];

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ ...user }); // Pre-fill form
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(`${config.backendUrl}/api/auth/update/${user._id}`, formData);
      login({ token: user.token, user: res.data.user }); // Update context
      setEditMode(false);
    } catch (err) {
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="profile-page">
      <h2>👤 My Profile</h2>

      {/* Large Avatar Preview */}
      <div className="avatar-preview">
        <img
          src={avatarOptions.find(a => a.file === formData.avatar)?.src || assets.avatar1}
          alt="User Avatar"
        />
      </div>

      {/* Avatar Selector - only when editing */}
      {editMode && (
        <div className="avatar-block">
          <h4>Select Avatar</h4>
          <div className="avatar-selector">
            {avatarOptions.map((a, idx) => (
              <img
                key={idx}
                src={a.src}
                alt={`Avatar ${idx + 1}`}
                className={formData.avatar === a.file ? 'selected' : ''}
                onClick={() => setFormData(prev => ({ ...prev, avatar: a.file }))}
              />
            ))}
          </div>
        </div>
      )}

      {/* Profile Form */}
      <div className="form-block">
        {['name', 'gender', 'country', 'institution', 'phone'].map((field, idx) => (
          <div className="form-row" key={idx}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type="text"
              name={field}
              value={formData[field] || ''}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>
        ))}

        <div className="form-row">
          <label>Email</label>
          <input type="email" value={formData.email || ''} disabled />
        </div>

        <div className="form-row">
          <label>Role</label>
          <input type="text" value={formData.role || ''} disabled />
        </div>
      </div>

      <div className="btn-row">
        {editMode ? (
          <>
            <button onClick={handleSave}>💾 Save</button>
            <button onClick={() => setEditMode(false)}>❌ Cancel</button>
          </>
        ) : (
          <button onClick={() => setEditMode(true)}>✏️ Edit Profile</button>
        )}
      </div>
    </div>
  );
}
