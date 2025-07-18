import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import config from '../../config/config';
import './SettingsPage.css';
import { toast } from 'react-toastify';

export default function SettingsPage() {
  const { user, logout } = useAuth();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post(`${config.backendUrl}/api/auth/change-password`, {
        userId: user._id,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      toast.success("Password changed successfully!");
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      logout(); // Log out the user after password change

      // Optionally log out the user
      // logout();
    } catch (err) {
      toast.error("Error changing password: " + (err.response?.data?.msg || "Server error"));
    }
  };

  return (
    <div className="settings-page">
      <h2>Reset Password</h2>

      <form onSubmit={handleSubmit} className="password-form">
        <div>
          <label>Current Password</label>
          <input
            type="text"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
    
          />
        </div>

        <div>
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Re-enter New Password</label>
          <input
            type="text"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Change Password</button>
      </form>
    </div>
  );
}
