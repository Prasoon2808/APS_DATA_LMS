import React, { useState } from 'react';
import axios from 'axios';
import LogoutBtn from '../../../../../Component/logoutbtn';
import './CourseCreationForm.css';
import config from '../../../../../config/config';
import { toast } from 'react-toastify';

const CourseCreationForm = () => {
  const [course, setCourse] = useState({
    title: '',
    description: '',
    learningObjectives: [],
    skillsCovered: [],
    coverImage: '',
    authors: [{ name: '', linkedinId: '', profileImage: '' }],
    sections: []
  });

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
    setCourse({
      ...course,
      authors: [...course.authors, { name: '', linkedinId: '', profileImage: '' }]
    });
  };

  const addSection = () => {
    setCourse({
      ...course,
      sections: [...course.sections, { name: '', chapters: [] }]
    });
  };

  const addChapter = (sectionIndex) => {
    const updatedSections = [...course.sections];
    updatedSections[sectionIndex].chapters.push({
      name: '',
      description: '',
      content: '',
      resources: [],
      summary: ''  // ✅ NEW FIELD
    });
    setCourse({ ...course, sections: updatedSections });
  };

  const deleteChapter = (sectionIdx, chapterIdx) => {
    const updatedSections = [...course.sections];
    updatedSections[sectionIdx].chapters.splice(chapterIdx, 1);
    setCourse({ ...course, sections: updatedSections });
  };

  const deleteSkill = (skillIdx) => {
    const updated = [...course.skillsCovered];
    updated.splice(skillIdx, 1);
    setCourse({ ...course, skillsCovered: updated });
  };

  const deleteObjective = (objectiveIdx) => {
    const updated = [...course.learningObjectives];
    updated.splice(objectiveIdx, 1);
    setCourse({ ...course, learningObjectives: updated });
  };

  const handleSectionName = (index, value) => {
    const updatedSections = [...course.sections];
    updatedSections[index].name = value;
    setCourse({ ...course, sections: updatedSections });
  };

  const handleChapterChange = (sectionIdx, chapterIdx, key, value) => {
    const updatedSections = [...course.sections];
    updatedSections[sectionIdx].chapters[chapterIdx][key] = value;
    setCourse({ ...course, sections: updatedSections });
  };

  const addResource = (sectionIdx, chapterIdx) => {
    const updatedSections = [...course.sections];
    updatedSections[sectionIdx].chapters[chapterIdx].resources.push('');
    setCourse({ ...course, sections: updatedSections });
  };

  const handleResourceChange = (sectionIdx, chapterIdx, resourceIdx, value) => {
    const updatedSections = [...course.sections];
    updatedSections[sectionIdx].chapters[chapterIdx].resources[resourceIdx] = value;
    setCourse({ ...course, sections: updatedSections });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedCourse = {
      ...course,
      skillsCovered: course.skillsCovered.filter(skill => skill.trim() !== ''),
      learningObjectives: course.learningObjectives.filter(obj => obj.trim() !== '')
    };

    try {
      await axios.post(`${config.backendUrl}/api/courses/create`, cleanedCourse);
      toast.success('✅ Course created!');
    } catch (error) {
      console.error('❌ Course creation failed:', error.response?.data || error.message);
      toast.error('❌ Failed to create course.');
    }
  };

  return (
    <form className="course-form" onSubmit={handleSubmit}>
      <h2>Create Course</h2>

      <div className="form-group">
        <input type="text" name="title" placeholder="Course Title" onChange={handleChange} required />
      </div>

      <h3>Skills Covered</h3>
      {course.skillsCovered.map((skill, idx) => (
        <div className="form-group skill-field" key={idx}>
          <input
            type="text"
            placeholder={`Skill ${idx + 1}`}
            value={skill}
            onChange={(e) => {
              const updated = [...course.skillsCovered];
              updated[idx] = e.target.value;
              setCourse({ ...course, skillsCovered: updated });
            }}
          />
          <button type="button" className="delete-btn" onClick={() => deleteSkill(idx)}>Delete</button>
        </div>
      ))}
      <button type="button" className="add-btn" onClick={() => setCourse({ ...course, skillsCovered: [...course.skillsCovered, ''] })}>
        + Add Skill
      </button>


      <h3>Cover Image URL</h3>
      <div className="form-group">
        <input type="text" name="coverImage" placeholder="Cover Image URL" onChange={handleChange} required />
      </div>

      <div className="form-group">
        <textarea name="description" placeholder="Course Description" onChange={handleChange} required></textarea>
      </div>

      <h3>Learning Objectives</h3>
      {course.learningObjectives.map((objective, idx) => (
        <div className="form-group skill-field" key={idx}>
          <input
            type="text"
            placeholder={`Objective ${idx + 1}`}
            value={objective}
            onChange={(e) => {
              const updated = [...course.learningObjectives];
              updated[idx] = e.target.value;
              setCourse({ ...course, learningObjectives: updated });
            }}
          />
          <button type="button" className="delete-btn" onClick={() => deleteObjective(idx)}>Delete</button>
        </div>
      ))}
      <button type="button" className="add-btn" onClick={() => setCourse({ ...course, learningObjectives: [...course.learningObjectives, ''] })}>
        + Add Objective
      </button>


      <h3>Author Info</h3>
      {course.authors.map((author, idx) => (
        <div className="form-group" key={idx}>
          <input
            type="text"
            placeholder="Author Name"
            value={author.name}
            onChange={(e) => handleAuthorChange(idx, 'name', e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="LinkedIn ID"
            value={author.linkedinId}
            onChange={(e) => handleAuthorChange(idx, 'linkedinId', e.target.value)}
          />
          <input
            type="text"
            placeholder="Profile Image URL"
            value={author.profileImage}
            onChange={(e) => handleAuthorChange(idx, 'profileImage', e.target.value)}
            required
          />
        </div>
      ))}
      <button type="button" className="add-btn" onClick={addAuthor}>
        + Add Author
      </button>

      <h3>Sections</h3>
      {course.sections.map((section, sIdx) => (
        <div className="section-block" key={sIdx}>
          <input
            type="text"
            placeholder="Section Name"
            value={section.name}
            onChange={(e) => handleSectionName(sIdx, e.target.value)}
          />

          <h4>Chapters</h4>
          {section.chapters.map((chapter, cIdx) => (
            <div className="chapter-block" key={cIdx}>
              <input
                type="text"
                placeholder="Chapter Name"
                value={chapter.name}
                onChange={(e) => handleChapterChange(sIdx, cIdx, 'name', e.target.value)}
              />
              <textarea
                placeholder="Chapter Description"
                value={chapter.description}
                onChange={(e) => handleChapterChange(sIdx, cIdx, 'description', e.target.value)}
              ></textarea>

              <textarea
                placeholder="Chapter Summary"
                value={chapter.summary}
                onChange={(e) => handleChapterChange(sIdx, cIdx, 'summary', e.target.value)}
              ></textarea>


              <input
                type="text"
                placeholder="Content URL (Video/Article)"
                value={chapter.content}
                onChange={(e) => handleChapterChange(sIdx, cIdx, 'content', e.target.value)}
              />

              {chapter.resources.map((res, rIdx) => (
                <input
                  key={rIdx}
                  type="text"
                  placeholder={`Resource Link ${rIdx + 1}`}
                  value={res}
                  onChange={(e) => handleResourceChange(sIdx, cIdx, rIdx, e.target.value)}
                />
              ))}
              <button type="button" className="add-btn" onClick={() => addResource(sIdx, cIdx)}>
                + Add Resource Link
              </button>
              <button type="button" className="delete-btn" onClick={() => deleteChapter(sIdx, cIdx)}>
                Delete Chapter
              </button>

            </div>
          ))}
          <button type="button" className="add-btn" onClick={() => addChapter(sIdx)}>
            + Add Chapter
          </button>
        </div>
      ))}

      <button type="button" className="add-btn" onClick={addSection}>
        + Add Section
      </button>

      <button type="submit" className="submit-btn">Create Course</button>
    </form>
  );
};

export default CourseCreationForm;
