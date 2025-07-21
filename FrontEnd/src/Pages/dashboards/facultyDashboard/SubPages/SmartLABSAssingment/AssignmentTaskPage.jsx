import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../../../../config/config';
import { useAuth } from '../../../../../context/AuthContext';
import './AssignmentTaskPage.css';
import BackButton from '../../../../../Component/BackBtn/BackButton';
import { toast } from 'react-toastify';

const AssignmentTaskPage = () => {
  const { user } = useAuth();
  const { assignmentId, taskNumber } = useParams();
  const userId = user?._id;
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [submissionId, setSubmissionId] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploadToDrive, setUploadToDrive] = useState(false);

  useEffect(() => {
  const fetchData = async () => {
    if (!userId || !assignmentId) {
      console.warn("User ID or assignment ID is missing.");
      toast.error("User ID or assignment ID is missing.");
      navigate('/dashboard/smartLABS/assignment');
      return;
    }

    try {
      const res = await axios.get(`${config.backendUrl}/api/smartlabs/assignment/submission/${assignmentId}?userId=${userId}`);
      console.log("[SUBMISSION RES]", res.data);
      setSubmissionId(res.data._id);

      const assignmentRes = await axios.get(`${config.backendUrl}/api/smartlabs/assignment/${assignmentId}/overview`);
      const taskMeta = assignmentRes.data.tasks.find(t => t.taskNumber == taskNumber);
      setTask(taskMeta);
    } catch (err) {
      console.error("Error fetching task:", err);
    }
  };

  fetchData();
}, [assignmentId, taskNumber, userId]);



  const handleSubmit = async () => {
  if (!uploadToDrive || files.length < 5) {
    toast.error("Upload at least 5 images and also upload them on onedrive to submit!");
    return;
  }

  try {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('uploadToDrive', 'true');

    if (!submissionId) {
      toast.error("Submission ID is missing. Please start the assignment first.");
  return;
}


    await axios.post(`${config.backendUrl}/api/smartlabs/assignment/submit/${submissionId}/${taskNumber}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    toast.success("Task submitted successfully!");
    navigate(`/dashboard/smartLABS/assignment/${assignmentId}/tasks`);
  } catch (err) {
    console.error("Upload error:", err);
    toast.error("Error submitting task: " + (err.response?.data?.msg || "Server error"));
  }
};

  if (!task) return <p>Loading...</p>;

  return (
    <div className="assignment-task-page">
        <BackButton/>
      <h2>{task.code}</h2>
      <p>{task.instructions}</p>

      <h4>Hints:</h4>
      <ul>{task.hints.map((h, i) => <li key={i}>{h}</li>)}</ul>

      <input type="file" multiple onChange={e => setFiles([...e.target.files])} />
      <div className="preview-box">
  {files.length > 0 && (
    <>
      <h5>Selected Files:</h5>
      <ul>
        {Array.from(files).map((file, idx) => (
          <li key={idx}>{file.name}</li>
        ))}
      </ul>
    </>
  )}
</div>

      <label>
        <input type="checkbox" onChange={e => setUploadToDrive(e.target.checked)} />
        Already Uploaded on Onedrive.
      </label>

      <button onClick={handleSubmit}>Submit Task</button>
    </div>
  );
};

export default AssignmentTaskPage;
