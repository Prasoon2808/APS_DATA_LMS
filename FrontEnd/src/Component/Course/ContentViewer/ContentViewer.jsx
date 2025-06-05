import React from 'react';
import './ContentViewer.css'; // Assuming you have some styles for the content viewer
import config from '../../../config/config';

export default function ContentViewer({ chapter }) {
  const content = chapter.content;

  if (!content || !content.fileUrl) {
    return <p>No content available.</p>;
  }

  const fileUrl = `${config.backendUrl}${content.fileUrl}`;

  if (content.fileType.startsWith("video")) {
    return <div className="content"><video src={fileUrl} controls/></div> ;
  }

  if (content.fileType.startsWith("image")) {
    return <div className="content-scroll"><img src={fileUrl} alt="chapter image" /></div>;
  }

  if (content.fileType === "application/pdf") {
    return <div className="content"><a href={fileUrl} target="_blank" rel="noreferrer">View PDF</a></div> ;
  }

  if (content.fileType.startsWith("audio")) {
    return <div className="content"><audio src={fileUrl} controls /></div> ;
  }

  if (content.fileType === "text/plain") {
    return <div className="content"><a href={fileUrl} target="_blank" rel="noreferrer">Read Article</a></div> ;
  }

  return <p>Unsupported file type</p>;
}
