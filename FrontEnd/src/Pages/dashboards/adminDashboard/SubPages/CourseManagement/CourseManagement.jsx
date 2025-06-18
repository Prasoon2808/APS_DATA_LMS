import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditCourseForm from './EditCourseForm';
import './CourseManagement.css';
import config from '../../../../../config/config';
import { toast } from 'react-toastify';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = () => {
    axios.get(`${config.backendUrl}/api/courses`)
      .then(res => setCourses(res.data))
      .catch(err => console.error(err));
  };

  const toggleLock = (id) => {
    axios.patch(`${config.backendUrl}/api/courses/${id}/lock-toggle`)
      .then(() => fetchCourses())
      .catch(err => console.error('Lock toggle failed', err));
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this course?');
    if (!confirm) return;

    try {
      await axios.delete(`${config.backendUrl}/api/courses/${id}`);
      toast.success('✅ Course deleted');
      fetchCourses();
    } catch (err) {
      toast.error('❌ Could not delete course');
    }
  };

  return (
    <div style={{ padding: '20px', marginTop: '7vh' }}>
        <h2>Course Management</h2>
        <div className="mgnt">
            {courses.map(course => (
                <div key={course._id} className="course-card">
                <img src={course.coverImage} alt="cover" />
                <h3>{course.title}</h3>
                <p className='author'>By: {Array.isArray(course.authors) ? course.authors.map(a => a.name).join(', ') : 'Unknown'}</p>

                <button onClick={() => setEditId(course._id)}>✏️ Edit</button>
                <button onClick={() => toggleLock(course._id)}>
                    {course.locked ? '🔒 Unlock' : '🔓 Lock'}
                </button>
                <button onClick={() => handleDelete(course._id)} style={{ backgroundColor: '#dc3545', color: 'white' }}>
                    🗑️ Delete
                </button>
                
                </div>
            ))}

            {editId && (
                <div className="modal">
                <EditCourseForm courseId={editId} onClose={() => {
                    setEditId(null);
                    fetchCourses();
                }} />
                <button onClick={() => setEditId(null)}>Close</button>
                </div>
            )}
        </div>
    </div>
  );
};

export default CourseManagement;
