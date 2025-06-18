import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EditCourseForm.css';
import config from '../../../../../config/config';
import { toast } from 'react-toastify';

const EditCourseForm = ({ courseId, onClose }) => {
  const [course, setCourse] = useState(null);

  useEffect(() => {
    axios.get(`${config.backendUrl}/api/courses/${courseId}`)
      .then(res => setCourse(res.data))
      .catch(err => console.error('Error loading course:', err));
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  const handleAuthorChange = (index, field, value) => {
    const updated = [...course.authors];
    updated[index][field] = value;
    setCourse({ ...course, authors: updated });
  };

  const addAuthor = () => {
    setCourse({ ...course, authors: [...course.authors, { name: '', linkedinId: '', profileImage: '' }] });
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

  const handleResourceChange = (sIdx, cIdx, rIdx, value) => {
    const updated = [...course.sections];
    updated[sIdx].chapters[cIdx].resources[rIdx] = value;
    setCourse({ ...course, sections: updated });
  };

  const addResource = (sIdx, cIdx) => {
    const updated = [...course.sections];
    updated[sIdx].chapters[cIdx].resources.push('');
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
    updated[sIdx].chapters.push({
      name: '',
      description: '',
      content: '',
      summary: '',
      resources: []
    });
    setCourse({ ...course, sections: updated });
  };

  const deleteChapter = (sIdx, cIdx) => {
    const updated = [...course.sections];
    updated[sIdx].chapters.splice(cIdx, 1);
    setCourse({ ...course, sections: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${config.backendUrl}/api/courses/${courseId}`, course);
      toast.success('✅ Course updated!');
      onClose();
    } catch (err) {
      console.error('Update failed:', err);
      toast.error('❌ Failed to update course.');
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

      <h3>Cover Image URL</h3>
      <input type="text" name="coverImage" value={course.coverImage} onChange={handleChange} />

      <h3>Authors</h3>
      {course.authors.map((author, i) => (
        <div key={i}>
          <input type="text" placeholder="Author Name" value={author.name} onChange={e => handleAuthorChange(i, 'name', e.target.value)} />
          <input type="text" placeholder="LinkedIn ID" value={author.linkedinId} onChange={e => handleAuthorChange(i, 'linkedinId', e.target.value)} />
          <input type="text" placeholder="Profile Image URL" value={author.profileImage} onChange={e => handleAuthorChange(i, 'profileImage', e.target.value)} />
        </div>
      ))}
      <button type="button" className="add-btn" onClick={addAuthor}>+ Add Author</button>

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
              <textarea
                placeholder="Chapter Summary"
                value={ch.summary}
                onChange={(e) => handleChapterChange(sIdx, cIdx, 'summary', e.target.value)}
              />
              <input
                type="text"
                placeholder="Content Link"
                value={ch.content}
                onChange={(e) => handleChapterChange(sIdx, cIdx, 'content', e.target.value)}
              />
              {ch.resources.map((res, rIdx) => (
                <input
                  key={rIdx}
                  type="text"
                  placeholder={`Resource Link ${rIdx + 1}`}
                  value={res}
                  onChange={(e) => handleResourceChange(sIdx, cIdx, rIdx, e.target.value)}
                />
              ))}
              <button type="button" onClick={() => addResource(sIdx, cIdx)} className="add-btn">+ Add Resource</button>
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
