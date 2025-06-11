import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EditCourseForm.css';
import config from '../../../../../config/config';

const EditCourseForm = ({ courseId, onClose }) => {
  const [course, setCourse] = useState(null);

  useEffect(() => {
    axios.get(`${config.backendUrl}/api/courses/${courseId}`)
      .then(res => {
        const courseData = res.data;
        courseData.coverImage = '';
        courseData.defaultThumbnail = '';
        courseData.author.profileImage = '';
        courseData._id = res.data._id; // preserve course ID explicitly
        setCourse(courseData);
      })
      .catch(err => console.error('Error loading course:', err));
  }, [courseId]);

  const handleChange = (e) => {
    const { name, files, value } = e.target;
    if (files?.[0]) {
      setCourse({ ...course, [name]: files[0] });
    } else {
      setCourse({ ...course, [name]: value });
    }
  };

  const handleAuthorChange = (e) => {
    const { name, files, value } = e.target;
    const author = { ...course.author };
    author[name] = files?.[0] || value;
    setCourse({ ...course, author });
  };

  const handleSectionName = (sIdx, value) => {
    const updated = [...course.sections];
    updated[sIdx].name = value;
    setCourse({ ...course, sections: updated });
  };

  const handleChapterChange = (sIdx, cIdx, key, value) => {
    const updated = [...course.sections];
    updated[sIdx].chapters[cIdx][key] = value;
    setCourse({ ...course, sections: updated });
  };

  const handleFileChange = (e, sIdx, cIdx, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const updated = [...course.sections];
    if (type === 'content') updated[sIdx].chapters[cIdx].content = file;
    else updated[sIdx].chapters[cIdx].resources = [file];
    setCourse({ ...course, sections: updated });
  };

  const addSection = () => {
    setCourse({ ...course, sections: [...course.sections, { name: '', chapters: [] }] });
  };

  const deleteSection = (sIdx) => {
    const updated = [...course.sections];
    updated.splice(sIdx, 1);
    setCourse({ ...course, sections: updated });
  };

  const addChapter = (sIdx) => {
    const updated = [...course.sections];
    updated[sIdx].chapters.push({ name: '', description: '', content: null, resources: [] });
    setCourse({ ...course, sections: updated });
  };

  const deleteChapter = (sIdx, cIdx) => {
    const updated = [...course.sections];
    updated[sIdx].chapters.splice(cIdx, 1);
    setCourse({ ...course, sections: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (course.coverImage instanceof File) formData.append('coverImage', course.coverImage);
    if (course.defaultThumbnail instanceof File) formData.append('defaultThumbnail', course.defaultThumbnail);
    if (course.author.profileImage instanceof File) formData.append('profileImage', course.author.profileImage);

    const cleanCourse = { ...course };
    if (course.coverImage instanceof File) delete cleanCourse.coverImage;
    if (course.defaultThumbnail instanceof File) delete cleanCourse.defaultThumbnail;
    if (course.author.profileImage instanceof File) cleanCourse.author.profileImage = undefined;

    // Preserve course ID explicitly
    cleanCourse._id = courseId;

    formData.append('course', JSON.stringify(cleanCourse));

    try {
      await axios.put(`${config.backendUrl}/api/courses/${courseId}`, formData);
      alert('✅ Course updated!');
      onClose();
    } catch (err) {
      console.error('Update failed:', err);
      alert('❌ Failed to update course.');
    }
  };

  if (!course) return <p>Loading...</p>;

  return (
    <form className="edit-course-form" onSubmit={handleSubmit}>
      <h2>Edit Course</h2>
      <input type="text" name="title" value={course.title} onChange={handleChange} required />
      <textarea name="description" value={course.description} onChange={handleChange} required></textarea>

      <h3>Skills Covered</h3>
      {course.skillsCovered.map((skill, i) => (
        <input key={i} type="text" value={skill} onChange={e => {
          const updated = [...course.skillsCovered];
          updated[i] = e.target.value;
          setCourse({ ...course, skillsCovered: updated });
        }} />
      ))}
      <button type="button" className="add-btn" onClick={() => setCourse({ ...course, skillsCovered: [...course.skillsCovered, ''] })}>+ Add Skill</button>

      <h3>Learning Objectives</h3>
      {course.learningObjectives.map((obj, i) => (
        <input key={i} type="text" value={obj} onChange={e => {
          const updated = [...course.learningObjectives];
          updated[i] = e.target.value;
          setCourse({ ...course, learningObjectives: updated });
        }} />
      ))}
      <button type="button" className="add-btn" onClick={() => setCourse({ ...course, learningObjectives: [...course.learningObjectives, ''] })}>+ Add Objective</button>

      <h3>Cover Image</h3>
      <input type="file" name="coverImage" onChange={handleChange} />
      <h3>Thumbnail</h3>
      <input type="file" name="defaultThumbnail" onChange={handleChange} />

      <h3>Author</h3>
      <input type="text" name="name" value={course.author.name} onChange={handleAuthorChange} />
      <input type="text" name="linkedinId" value={course.author.linkedinId} onChange={handleAuthorChange} />
      <input type="file" name="profileImage" onChange={handleAuthorChange} />

      <h3>Sections & Chapters</h3>
      {course.sections.map((section, sIdx) => (
        <div className="section-block" key={sIdx}>
          <input type="text" value={section.name} onChange={(e) => handleSectionName(sIdx, e.target.value)} />
          <button type="button" onClick={() => deleteSection(sIdx)} style={{ background: 'crimson', color: 'white' }}>Delete Section</button>
          {section.chapters.map((ch, cIdx) => (
            <div className="chapter-block" key={cIdx}>
              <input
                type="text"
                placeholder="Chapter Name"
                value={ch.name}
                onChange={(e) => handleChapterChange(sIdx, cIdx, 'name', e.target.value)}
              />
              <textarea
                placeholder="Chapter Description"
                value={ch.description}
                onChange={(e) => handleChapterChange(sIdx, cIdx, 'description', e.target.value)}
              />
              <label>Content:
                <input type="file" onChange={(e) => handleFileChange(e, sIdx, cIdx, 'content')} />
              </label>
              <label>Resources:
                <input type="file" multiple onChange={(e) => handleFileChange(e, sIdx, cIdx, 'resources')} />
              </label>
              <button type="button" onClick={() => deleteChapter(sIdx, cIdx)} style={{ background: 'darkred', color: 'white' }}>Delete Chapter</button>
            </div>
          ))}
          <button type="button" className="add-btn" onClick={() => addChapter(sIdx)}>+ Add Chapter</button>
        </div>
      ))}

      <button type="button" className="add-btn" onClick={addSection}>+ Add Section</button>

      <button type="submit" className="submit-btn">Save Changes</button>
    </form>
  );
};

export default EditCourseForm;
