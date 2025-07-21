import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AllSessionSummary.css';
import config from '../../../../../config/config';

export default function AllSummaries() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    axios.get(`${config.backendUrl}/api/smartlabs/session-summary`).then(res => setSessions(res.data));
  }, []);

  return (
    <div className="all-summaries">
      <h1>Sessions - Summary & Recording</h1>
      <div className="summary-grid">
        {sessions.map(session => (
          <div className="summary-card" key={session._id}>
            <img src='https://storage.googleapis.com/edu-lab/reocrding%20and%20summary%20icon.png' alt="cover" />
            <h3>{session.sessionTitle}</h3>
            <p className='tag'>{session.tag}</p>
            <p>{new Date(session.sessionDate).toLocaleDateString()}</p>
            <Link to={`/dashboard/smartLABS/summary/${session._id}`}>View Session</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
