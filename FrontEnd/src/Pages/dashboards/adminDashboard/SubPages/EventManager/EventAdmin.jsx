import React, { useEffect, useState } from 'react';
import './EventAdmin.css';
import axios from 'axios';
import config from '../../../../../config/config';

const EventAdmin = () => {
  const url = config.backendUrl;
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const res = await axios.get(`${url}/api/event/all`);
        setRegistrations(res.data || []);
      } catch (err) {
        console.error('Error fetching registrations:', err);
      }
    };

    fetchRegistrations();
  }, []);

  const downloadCSV = () => {
    const header = [
      'Name',
      'Gender',
      'Email',
      'Phone',
      'Country',
      'Institution',
      'Referral Code',
      'Registered On'
    ];
    const rows = registrations.map(r => [
      r.name,
      r.gender,
      r.email,
      r.phone,
      r.country,
      r.institution,
      r.refCode,
      new Date(r.createdAt).toLocaleString()
    ]);

    const csvContent = [header, ...rows]
      .map(e => e.map(v => `"${(v || '').toString().replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.setAttribute('download', 'event_registrations.csv');
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="adminPanel">
      <div className="headerRow">
        <h2>Event Registrations</h2>
        <button onClick={downloadCSV}>Download CSV</button>
      </div>
      <div className="tableWrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Gender</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Country</th>
              <th>Institution</th>
              <th>Referral Code</th>
              <th>Registered On</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.gender}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.country}</td>
                <td>{user.institution}</td>
                <td>{user.refCode}</td>
                <td>{new Date(user.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventAdmin;
