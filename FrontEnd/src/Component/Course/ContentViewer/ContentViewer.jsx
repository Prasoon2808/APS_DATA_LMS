import React from 'react';
import './ContentViewer.css';

export default function ContentViewer({ chapter }) {
  const content = chapter.content;

  if (!content || typeof content !== 'string') {
    return <p>No content available.</p>;
  }
  return (
    <div className="content">
      <iframe
        src={content}
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        allowFullScreen
      ></iframe>
    </div>
  );
}
