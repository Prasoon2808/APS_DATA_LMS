// src/components/BackButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackButton.css';

const BackButton = ({pageBack}) => {
  const navigate = useNavigate();
  return (
    <button className="back-button" onClick={() => navigate(pageBack || -1)}>
      ← Back
    </button>
  );
};

export default BackButton;
