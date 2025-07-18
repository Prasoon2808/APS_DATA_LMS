import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../../../../config/config';
import { useAuth } from '../../../../../context/AuthContext';
import './AssignmentTaskListPage.css';
import BackButton from '../../../../../Component/BackBtn/BackButton';

const AssignmentTaskListPage = () => {
  const { assignmentId } = useParams();
  const { user } = useAuth();
  const userId = user?._id;
  const navigate = useNavigate();
  
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
  const fetchOrCreateSubmission = async () => {
    try {
      const res = await axios.get(`${config.backendUrl}/api/smartlabs/assignment/submission/${assignmentId}?userId=${userId}`);
      setTasks(res.data.tasks);
      setProgress(res.data.taskProgress);
    } catch (err) {
      // If submission not found, create one
      if (err.response?.status === 404) {
        await axios.post(`${config.backendUrl}/api/smartlabs/assignment/start/${assignmentId}`, { userId });
        window.location.reload(); // re-fetch with new submission
      } else {
        console.error("Task list load error:", err);
      }
    }
  };

  fetchOrCreateSubmission();
}, [assignmentId, userId]);


  const isUnlocked = (index) => {
    if (index === 0) return true;
    return progress[index - 1]?.isComplete;
  };

  const handleTaskClick = (taskNumber, index) => {
    const complete = progress[index]?.isComplete;
    if (isUnlocked(index) && !complete) {
        navigate(`/dashboard/smartLABS/assignment/${assignmentId}/task/${taskNumber}`);
    }
    };


  return (
    <div className="assignment-task-list">
        <BackButton pageBack={-2} />
      <h2>Assignment Tasks</h2>
      <ul>
        {tasks.map((task, index) => {
          const complete = progress[index]?.isComplete;
          const unlocked = isUnlocked(index);

          return (
            <li key={task.taskNumber} className={`task-row ${complete ? 'done' : unlocked ? 'unlocked' : 'locked'}`}
                onClick={() => handleTaskClick(task.taskNumber, index)}
            >
              <span className="task-code">{task.code}</span>
              <span className="task-status">
                {complete ? '✅ Completed' : unlocked ? '🟢 Available' : '🔒 Locked'}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AssignmentTaskListPage;
