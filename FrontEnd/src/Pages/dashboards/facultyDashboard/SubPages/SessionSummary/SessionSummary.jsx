import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './SessionSummary.css';
import config from '../../../../../config/config';
import { assets } from '../../../../../assets/assets';

export default function SummaryPage() {
  const { id } = useParams();
  const [session, setSession] = useState(null);

  useEffect(() => {
    axios.get(`${config.backendUrl}/api/smartlabs/session-summary/${id}`).then(res => setSession(res.data));
  }, [id]);

  if (!session) return <p>Loading...</p>;

  return (
    <div className="summary-page">
      <Link to="/dashboard/smartLABS/summaries">← Back</Link>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
            <h2>{session.sessionTitle}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <p>{new Date(session.sessionDate).toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'})}</p>
                <p className='tag'>{session.tag}</p>
            </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{fontSize: '0.8rem', marginBottom: '0.2rem'}}>Powered by</p>
            <img className='stamp' src={assets.labratStamp} alt="" />
        </div>
      </div>
      <h3>Session Summary</h3>
      <div className="summary-text">
        {session.summaryText.map((section, index) => (
          <div className="summary-section" key={index}>
            <h4>{section.heading}</h4>
            <p>{section.description}</p>
          </div>
        ))}
      </div>

      <h3>Session Recording</h3>
      <div className="summary-text">
        <div className="video-container">
            <iframe src={session.recordingLink} onContextMenu={(e)=>e.preventDefault()} allowFullScreen title="Recording" />
        </div>
      </div>
    </div>
  );
}
