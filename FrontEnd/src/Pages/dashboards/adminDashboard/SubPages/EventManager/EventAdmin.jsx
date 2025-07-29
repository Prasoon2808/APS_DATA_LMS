import React, { useEffect, useState } from 'react';
import './EventAdmin.css';
import axios from 'axios';
import config from '../../../../../config/config';

const EventAdmin = () => {
  const url = config.backendUrl;
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${url}/api/event-meta/all`);
        setEvents(res.data || []);
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };
    fetchEvents();
  }, []);

  // Fetch registrations
  const fetchRegistrations = async () => {
    if (!selectedEventId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${url}/api/event/by-event/${selectedEventId}`);
      setRegistrations(res.data || []);
    } catch (err) {
      console.error('Error fetching registrations:', err);
    }
    setLoading(false);
  };

  // Auto refresh
  useEffect(() => {
    if (!selectedEventId) return;
    fetchRegistrations();
    const interval = setInterval(() => {
      if (!loading) fetchRegistrations();
    }, 10000);
    return () => clearInterval(interval);
  }, [selectedEventId]);

  // CSV Download
  const downloadCSV = () => {
    const header = ['Name', 'Gender', 'Email', 'Phone', 'Country', 'Institution', 'Referral Code', 'Registered On'];
    const rows = registrations.map(r => [
      r.name, r.gender, r.email, r.phone, r.country, r.institution, r.refCode, new Date(r.createdAt).toLocaleString()
    ]);
    const csvContent = [header, ...rows]
      .map(e => e.map(v => `"${(v || '').toString().replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.setAttribute('download', `${selectedEventId}_registrations.csv`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="adminPanel">
      <h2>Event Manager</h2>

      {/* Event Cards */}
      <div className="eventCards">
        {events.map(evt => (
          <div
            key={evt.eventId}
            className={`eventCard ${selectedEventId === evt.eventId ? 'active' : ''}`}
            onClick={() => setSelectedEventId(evt.eventId)}
          >
            <img src={evt.posterUrl} alt={evt.eventName} />
            <p>{evt.eventName}</p>
          </div>
        ))}
      </div>

      {/* Buttons */}
      {selectedEventId && (
        <div className="headerRow">
          <h3>Registrations for: {selectedEventId}</h3>
          <div className="btnGroup">
            <button onClick={fetchRegistrations}>{loading ? 'Refreshing...' : 'Refresh'}</button>
            <button onClick={downloadCSV}>Download CSV</button>
          </div>
        </div>
      )}

      {/* Table */}
      {selectedEventId && (
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
                <th>PDF</th> {/* 🔥 New column */}
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
                  <td>{user.refCode ? (user.refCode) : ('—')}</td>
                  <td>{new Date(user.createdAt).toLocaleString()}</td>
                  <td>
                    {user.pdfUrl ? (
                      <a href={user.pdfUrl} target="_blank" rel="noopener noreferrer" className="pdfDownloadBtn">
                        View PDF
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventAdmin;
