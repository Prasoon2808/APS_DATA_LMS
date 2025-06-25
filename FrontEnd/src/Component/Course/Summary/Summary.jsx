import React from 'react';
import './Summary.css';
import { assets } from '../../../assets/assets';

export default function Summary({ summary }) {
  if (!summary) {
    return <div className="summary-container">No summary provided for this chapter.</div>;
  }

  return (
    <div className="summary">
      <div className="header">
        <h2>LAB SUMMARY</h2>
        <div className="stamp">
          <p>Powered By:</p>
          <img src={assets.labratStamp} alt="" />
        </div>
      </div>
      <div className="summary-container">
        <p>{summary}</p>
      </div>
    </div>
  );
}
