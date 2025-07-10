import React, { useState } from 'react';
import axios from 'axios';
import './AddBlog.css';
import config from '../../../../../config/config';


const BlogForm = () => {
  const [name, setName] = useState('');
  const [subheading, setSubheading] = useState('');
  const [coverImage, setCoverImage] = useState('');

  const [sections, setSections] = useState([
    { title: '', description: '', image: '' }
  ]);

  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...sections];
    updatedSections[index][field] = value;
    setSections(updatedSections);
  };

  const addSection = () => {
    setSections([...sections, { title: '', description: '', image: '' }]);
  };

  const removeSection = (index) => {
    const updatedSections = [...sections];
    updatedSections.splice(index, 1);
    setSections(updatedSections);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${config.backendUrl}/api/blogs/add`, {
        name,
        subheading,
        coverImage,
        sections,
      });
      alert('Blog added successfully!');
      setName('');
      setSubheading('');
      setSections([{ title: '', description: '', image: '' }]);
    } catch (error) {
      console.error(error);
      alert('Error adding blog');
    }
  };

  return (
    <div className="blog-form-wrapper">
      <form className="blog-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Blog Name:</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="input-text"
            required
          />
        </div>

        <div className="form-group">
          <label>Subheading:</label>
          <input
            type="text"
            value={subheading}
            onChange={e => setSubheading(e.target.value)}
            className="input-text"
            required
          />
        </div>

        <div className="form-group">
            <label>Cover Image URL:</label>
            <input
                type="text"
                value={coverImage}
                onChange={e => setCoverImage(e.target.value)}
                className="input-text"
                required
            />
        </div>


        <h3>Sections:</h3>
        {sections.map((section, index) => (
          <div className="section-box" key={index}>
            <div className="form-group">
              <label>Section Title:</label>
              <input
                type="text"
                value={section.title}
                onChange={e => handleSectionChange(index, 'title', e.target.value)}
                className="input-text"
                required
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={section.description}
                onChange={e => handleSectionChange(index, 'description', e.target.value)}
                className="textarea"
                required
              />
            </div>
            <div className="form-group">
              <label>Image URL:</label>
              <input
                type="text"
                value={section.image}
                onChange={e => handleSectionChange(index, 'image', e.target.value)}
                className="input-text"
              />
            </div>
            {sections.length > 1 && (
              <button
                type="button"
                className="button-secondary"
                onClick={() => removeSection(index)}
              >
                Remove Section
              </button>
            )}
          </div>
        ))}

        <button type="button" className="button-secondary" onClick={addSection}>
          + Add Section
        </button>

        <button type="submit" className="button-primary">Submit Blog</button>
      </form>
    </div>
  );
};

export default BlogForm;
