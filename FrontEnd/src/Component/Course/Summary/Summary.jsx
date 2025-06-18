import React from 'react';
import './Summary.css';

export default function Summary({ summary }) {
  if (!summary) {
    return <div className="summary-container">No summary provided for this chapter.</div>;
  }

  return (
    <div className="summary-container">
      <h2>Chapter Summary</h2>
      <p>{summary}</p>
    </div>
  );
}
