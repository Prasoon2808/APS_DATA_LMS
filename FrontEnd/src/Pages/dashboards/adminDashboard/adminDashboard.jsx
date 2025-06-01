import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import LogoutBtn from "../../../Component/logoutbtn"

const adminDashboard = () => {
  const [course, setCourse] = useState({
    title: '',
    description: '',
    learningObjectives: [],
    skillsCovered: [],
    coverImage: null,
    defaultThumbnail: null,
    author: {
      name: '',
      linkedinId: '',
      profileImage: null
    },
    sections: []
  });

  const handleChange = (e) => {
    const { name, files, value } = e.target;
    if (files?.[0]) {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        alert(`${name} must be an image`);
        return;
      }
      setCourse({ ...course, [name]: file });
    } else {
      setCourse({ ...course, [name]: value });
    }
  };
  
  const handleAuthorChange = (e) => {
    const { name, files, value } = e.target;
    if (files?.[0]) {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        alert("Profile image must be an image file");
        return;
      }
      setCourse({
        ...course,
        author: { ...course.author, [name]: file }
      });
    } else {
      setCourse({
        ...course,
        author: { ...course.author, [name]: value }
      });
    }
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
      content: null,
      resources: []
    });
    setCourse({ ...course, sections: updatedSections });
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

  const handleFileChange = (e, sectionIdx, chapterIdx, type) => {
    const file = e.target.files[0];
    const updatedSections = [...course.sections];
    if (type === 'content') {
      updatedSections[sectionIdx].chapters[chapterIdx].content = file;
    } else {
      updatedSections[sectionIdx].chapters[chapterIdx].resources.push(file);
    }
    setCourse({ ...course, sections: updatedSections });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
  
    formData.append('coverImage', course.coverImage);
    formData.append('defaultThumbnail', course.defaultThumbnail);
    formData.append('profileImage', course.author.profileImage);
  
    const courseCopy = { ...course };
    courseCopy.coverImage = undefined;
    courseCopy.defaultThumbnail = undefined;
    courseCopy.author = { ...course.author, profileImage: undefined };
  
    courseCopy.sections.forEach((section, sIdx) => {
      section.chapters.forEach((chapter, cIdx) => {
        if (chapter.content) {
          formData.append(`sections[${sIdx}].chapters[${cIdx}].content`, chapter.content);
        }
        chapter.resources.forEach(file => {
          formData.append(`sections[${sIdx}].chapters[${cIdx}].resources`, file);
        });
        delete chapter.content;
        delete chapter.resources;
      });
    });
    courseCopy.skillsCovered = course.skillsCovered.filter(skill => skill.trim() !== '');
    courseCopy.learningObjectives = course.learningObjectives.filter(obj => obj.trim() !== '');

    
  
    formData.append('course', JSON.stringify(courseCopy));
  
    try {
      const res = await axios.post('http://localhost:5000/api/courses/create', formData);
      alert('Course created!');
    } catch (error) {
      console.error(error);
      alert('Failed to create course.');
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
        <div className="form-group" key={idx}>
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
        </div>
      ))}

      <button
        type="button"
        className="add-btn"
        onClick={() =>
          setCourse({ ...course, skillsCovered: [...course.skillsCovered, ''] })
        }
      >
        + Add Skill
      </button>

      <h3>Cover Image</h3>
      <div className="form-group">
        <input type="file" name="coverImage" accept="image/*" onChange={handleChange} required />
      </div>
      <h3>Default Thumbnail</h3>
      <div className="form-group">
        <input type="file" name="defaultThumbnail" accept="image/*" onChange={handleChange} required />
      </div>

      <div className="form-group">
        <textarea name="description" placeholder="Course Description" onChange={handleChange} required></textarea>
      </div>
      <h3>Learning Objectives</h3>
      {course.learningObjectives.map((objective, idx) => (
        <div className="form-group" key={idx}>
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
        </div>
      ))}

      <button
        type="button"
        className="add-btn"
        onClick={() =>
          setCourse({ ...course, learningObjectives: [...course.learningObjectives, ''] })
        }
      >
        + Add Objective
      </button>


      <h3>Author Info</h3>
      <div className="form-group">
        <input type="text" name="name" placeholder="Author Name" onChange={handleAuthorChange} required />
      </div>
      <div className="form-group">
        <input type="text" name="linkedinId" placeholder="LinkedIn ID" onChange={handleAuthorChange} />
      </div>
      <div className="form-group">
        <input type="file" name="profileImage" accept="image/*" onChange={handleAuthorChange} required />
      </div>

      <h3>Sections</h3>
      {course.sections.map((section, sIdx) => (
        <div className="section-block" key={sIdx}>
          <input type="text" placeholder="Section Name"
            value={section.name}
            onChange={(e) => handleSectionName(sIdx, e.target.value)} />

          <h4>Chapters</h4>
          {section.chapters.map((chapter, cIdx) => (
            <div className="chapter-block" key={cIdx}>
              <input type="text" placeholder="Chapter Name"
                onChange={(e) => handleChapterChange(sIdx, cIdx, 'name', e.target.value)} />
              <textarea placeholder="Chapter Description"
                onChange={(e) => handleChapterChange(sIdx, cIdx, 'description', e.target.value)}></textarea>

              <label>Content File:
                <input type="file" onChange={(e) => handleFileChange(e, sIdx, cIdx, 'content')} />
              </label>

              <label>Resource Files:
                <input type="file" multiple onChange={(e) => {
                  const files = Array.from(e.target.files);
                  files.forEach(file => handleFileChange({ target: { files: [file] } }, sIdx, cIdx, 'resources'));
                }} />
              </label>
            </div>
          ))}
          <button type="button" className="add-btn" onClick={() => addChapter(sIdx)}>+ Add Chapter</button>
        </div>
      ))}

      <button type="button" className="add-btn" onClick={addSection}>+ Add Section</button>

      <button type="submit" className="submit-btn">Create Course</button>
      <LogoutBtn />
    </form>
  );
}

export default adminDashboard