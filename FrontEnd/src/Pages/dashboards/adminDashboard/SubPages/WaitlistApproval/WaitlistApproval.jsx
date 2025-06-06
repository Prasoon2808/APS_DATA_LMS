import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './WaitlistApproval.css';
import config from '../../../../../config/config';

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

  useEffect(() => {
    fetchWaitlist();
  }, []);

  return (
    <div className="waitlist-approval-container">
      <h2>Waitlist Approval Panel</h2>
      {loading ? (
        <p>Loading waitlist...</p>
      ) : waitlist.length === 0 ? (
        <p>No users in the waitlist.</p>
      ) : (
        <div className="table-container">
          <table className="waitlist-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Institution</th>
                <th>Country</th>
                <th>Affiliation</th>
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
                  <td>{user.affiliation}</td>
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
      )}
    </div>
  );
};

export default WaitlistApproval;
