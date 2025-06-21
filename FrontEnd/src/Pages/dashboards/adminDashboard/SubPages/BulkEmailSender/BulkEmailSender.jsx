import React, { useState } from 'react';
import Papa from 'papaparse';
import './BulkEmailSender.css';
import config from '../../../../../config/config';
import { toast } from 'react-toastify';

export default function BulkEmailSender() {
  const [emailList, setEmailList] = useState([]);
  const [status, setStatus] = useState('');

  const handleCSVUpload = (e) => {
    Papa.parse(e.target.files[0], {
      header: true,
      complete: (results) => setEmailList(results.data),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const res = await fetch(`${config.backendUrl}/api/send-bulk-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailList }),
      });
      const result = await res.json();
      setStatus(result.message || 'Emails sent!');
      toast.success('All Emails Sent Successfully.')
    } catch (err) {
      console.error(err);
      setStatus('Failed to send emails.');
    }
  };

  return (
    <div className="email-sender-container">
      <h2>Send Invites</h2>
      <form onSubmit={handleSubmit} className="email-form">
        <label>Upload CSV:</label>
        <input type="file" accept=".csv" onChange={handleCSVUpload} required />
        <button type="submit">Send Emails</button>
      </form>
      {status && <p className="status">{status}</p>}
    </div>
  );
}
