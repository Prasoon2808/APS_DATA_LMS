import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AssignmentManager.css';
import config from '../../../../../config/config';

const AdminAssignmentPage = () => {
  const [formData, setFormData] = useState({
    code: '', title: '', brief: '', type: '',
    evaluation: '', allocatedIn: '', submissionType: '',
    output: '', generalNotes: ''
  });
  const [image, setImage] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showTasks, setShowTasks] = useState(false);
  const [assignments, setAssignments] = useState([]);

  const fetchAssignments = async () => {
    const res = await axios.get(`${config.backendUrl}/api/assignment/all`);
    setAssignments(res.data);
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTaskChange = (index, e) => {
    const updated = [...tasks];
    const name = e.target.name;
    updated[index][name] = name === 'hints' ? e.target.value.split('\n') : e.target.value;
    setTasks(updated);
  };

  const addTask = () => {
    setTasks([...tasks, { taskNumber: '', code: '', instructions: '', hints: [] }]);
  };

  const removeTask = (i) => {
    const copy = [...tasks];
    copy.splice(i, 1);
    setTasks(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      if (key === 'generalNotes') {
        data.append(key, JSON.stringify(formData[key].split('\n')));
      } else {
        data.append(key, formData[key]);
      }
    }
    data.append('tasks', JSON.stringify(tasks));
    if (image) data.append('image', image);

    try {
      await axios.post(`${config.backendUrl}/api/assignment/create`, data);
      alert('Assignment Created!');
      setFormData({ code: '', title: '', brief: '', type: '', evaluation: '', allocatedIn: '', submissionType: '', output: '', generalNotes: '' });
      setImage(null);
      setTasks([]);
      setShowTasks(false);
      fetchAssignments();
    } catch (err) {
      alert('Error creating assignment');
      console.error(err);
    }
  };

  const toggleLock = async (id) => {
    await axios.patch(`${config.backendUrl}/api/assignment/toggle-lock/${id}`);
    fetchAssignments();
  };

  return (
    <div className="assignment-form-container">
      <h2>Create New Assignment</h2>
      <form onSubmit={handleSubmit} className="assignment-form">
        <input type="text" name="code" placeholder="Assignment Code" value={formData.code} onChange={handleChange} required />
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
        <textarea name="brief" placeholder="Brief Description" value={formData.brief} onChange={handleChange} required />
        <input type="text" name="type" placeholder="Type" value={formData.type} onChange={handleChange} />
        <input type="text" name="evaluation" placeholder="Grades / Credits" value={formData.evaluation} onChange={handleChange} />
        <input type="text" name="allocatedIn" placeholder="Allocated In" value={formData.allocatedIn} onChange={handleChange} />
        <input type="text" name="submissionType" placeholder="Submission" value={formData.submissionType} onChange={handleChange} />
        <input type="text" name="output" placeholder="Output Format" value={formData.output} onChange={handleChange} />
        <textarea name="generalNotes" placeholder="General Notes (one per line)" value={formData.generalNotes} onChange={handleChange} />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />

        <button
            type="button"
            className="toggle-task-btn"
            onClick={() => {
                if (!showTasks && tasks.length === 0) {
                setTasks([{ taskNumber: '', code: '', instructions: '', hints: [] }]);
                }
                setShowTasks(!showTasks);
            }}
            >
            {showTasks ? 'Hide Tasks' : '+ Add Task'}
        </button>

        {showTasks && tasks.map((task, i) => (
          <div key={i} className="task-block">
            <input name="taskNumber" placeholder="Task Number" value={task.taskNumber} onChange={(e) => handleTaskChange(i, e)} />
            <input name="code" placeholder="Task Code" value={task.code} onChange={(e) => handleTaskChange(i, e)} />
            <textarea name="instructions" placeholder="Task Instructions" value={task.instructions} onChange={(e) => handleTaskChange(i, e)} />
            <textarea name="hints" placeholder="Hints (one per line)" value={task.hints.join('\n')} onChange={(e) => handleTaskChange(i, e)} />
            <button type="button" onClick={() => removeTask(i)}>Remove</button>
          </div>
        ))}

        {showTasks && <button type="button" onClick={addTask}>+ Add Another Task</button>}

        <button type="submit">Create Assignment</button>
      </form>

      <hr style={{ margin: '2rem 0' }} />
      <h2>Manage Assignments</h2>
    <div className="assignment-list">
        {assignments.map((a) => (
            <div className="assignment-card" key={a._id}>
            <div className="assignment-info">
                <h4>{a.code} - {a.title}</h4>
                <p><strong>Status:</strong> {a.isLocked ? '🔒 Locked' : '🔓 Unlocked'}</p>
                <p><strong>Type:</strong> {a.type}</p>
                <p><strong>Allocated In:</strong> {a.allocatedIn}</p>
                <p><strong>Submission Type:</strong> {a.submissionType}</p>
                <div className="assignment-controls">
                <button onClick={() => toggleLock(a._id)}>
                    {a.isLocked ? 'Unlock' : 'Lock'}
                </button>
                </div>
            </div>
            {a.image && (
                <div className="assignment-image">
                <img src={a.image} alt="Assignment" />
                </div>
            )}
            </div>
        ))}
    </div>

    </div>
  );
};

export default AdminAssignmentPage;
