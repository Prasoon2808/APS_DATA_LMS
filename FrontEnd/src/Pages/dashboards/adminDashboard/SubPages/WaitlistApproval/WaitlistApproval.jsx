import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './WaitlistApproval.css';
import config from '../../../../../config/config';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

const WaitlistApproval = () => {
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const url = config.backendUrl;

  const fetchWaitlist = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${url}/api/waitlist/all`);
      setWaitlist(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching waitlist:', err);
      setLoading(false);
    }
  };

  const approveUser = async (id) => {
    if (!window.confirm("Are you sure you want to approve this user?")) return;
    try {
      const res = await axios.post(`${url}/api/waitlist/approve/${id}`);
      alert(res.data.message);
      fetchWaitlist(); // Refresh list
    } catch (err) {
      alert('Approval failed.');
      console.error(err);
    }
  };

  const downloadCSV = () => {
    const csv = Papa.unparse(waitlist.map(({ name, email, institution, country, phone, refCode }) => ({
      Name: name,
      Email: email,
      Institution: institution,
      Country: country,
      Phone: phone,
      "Ref. Code": refCode
    })));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'waitlist.csv');
  };

  useEffect(() => {
    fetchWaitlist(); // initial load
    const interval = setInterval(() => {
      fetchWaitlist(); // refresh every 10 seconds
    }, 10000);
    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <div className="waitlist-approval-container">
      <h2>Waitlist Approval Panel</h2>
      {loading ? (
        <p>Loading waitlist...</p>
      ) : waitlist.length === 0 ? (
        <p>No users in the waitlist.</p>
      ) : (
        <>
          <div style={{ textAlign: 'right', marginBottom: '10px' }}>
            <button className="approve-btn" onClick={downloadCSV}>Download CSV</button>
          </div>
          <div className="table-container">
            <table className="waitlist-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Institution</th>
                  <th>Country</th>
                  <th>Phone No.</th>
                  <th>Ref. Code</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {waitlist.map(user => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.institution}</td>
                    <td>{user.country}</td>
                    <td>{user.phone}</td>
                    <td>{user.refCode}</td>
                    <td>
                      <button className="approve-btn" onClick={() => approveUser(user._id)}>
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default WaitlistApproval;
