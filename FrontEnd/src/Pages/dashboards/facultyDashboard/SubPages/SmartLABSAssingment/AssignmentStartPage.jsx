import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../../../../config/config';
import './AssignmentStartPage.css';
import { useAuth } from '../../../../../context/AuthContext';
import BackButton from '../../../../../Component/BackBtn/BackButton';

const AssignmentStartPage = () => {
  const {user} = useAuth();
  const userId = user?._id;
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  axios.get(`${config.backendUrl}/api/smartlabs/assignment/${assignmentId}/overview`)
    .then(res => setAssignment(res.data))
    .catch(err => console.error("Error fetching assignment overview:", err));
    }, [assignmentId]);


  const handleStart = () => {
  navigate(`/dashboard/smartLABS/assignment/${assignmentId}/tasks`);
};


  if (!assignment) return <p>Loading...</p>;

  return (
    <div className="assignment-start-page">
        <BackButton />
        <h1>{assignment.code}</h1>
      <img src={assignment.image} alt={assignment.title} />
      <h1>{assignment.title}</h1>
      <div className="brief">
        <p>{assignment.brief}</p>
      </div>

      <div className="meta">
        <p><strong>Type:</strong> {assignment.type}</p>
        <p><strong>Grading / Credits:</strong> {assignment.evaluation}</p>
        <p><strong>Allocated In:</strong> {assignment.allocatedIn}</p>
        <p><strong>Submission Type:</strong> {assignment.submissionType}</p>
        <p><strong>Output:</strong> {assignment.output}</p>
      </div>


      <div className="notes">
        <h3>General Notes</h3>
        <ul>
          {(assignment.generalNotes || []).map((note, idx) => (
            <li key={idx}>{note}</li>
          ))}
        </ul>
      </div>

      <button onClick={handleStart}>Start Assignment</button>
    </div>
  );
};

export default AssignmentStartPage;
