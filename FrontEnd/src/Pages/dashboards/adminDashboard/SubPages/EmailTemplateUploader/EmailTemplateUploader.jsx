import React, { useState, useEffect } from 'react';
import config from '../../../../../config/config';
import './EmailTemplateUploader.css';
import { toast } from 'react-toastify';

export default function TemplateUploader() {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [html, setHtml] = useState('');
  const [templates, setTemplates] = useState([]);
  const [editing, setEditing] = useState(false);
  const [originalName, setOriginalName] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    const res = await fetch(`${config.backendUrl}/api/templates`);
    const data = await res.json();
    setTemplates(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !subject || !html) return toast.error('All fields are required.');

    const url = editing
      ? `${config.backendUrl}/api/templates/${originalName}`
      : `${config.backendUrl}/api/upload-template`;

    const method = editing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, subject, html }),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success(result.message);
        setName('');
        setSubject('');
        setHtml('');
        setEditing(false);
        setOriginalName('');
        fetchTemplates();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const handleEdit = async (name) => {
    const res = await fetch(`${config.backendUrl}/api/templates/${name}`);
    const data = await res.json();
    setName(data.name);
    setSubject(data.subject);
    setHtml(data.html);
    setEditing(true);
    setOriginalName(data.name);
  };

  const handleDelete = async (name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    const res = await fetch(`${config.backendUrl}/api/templates/${name}`, {
      method: 'DELETE',
    });

    const data = await res.json();
    if (res.ok) {
      toast.success(data.message);
      fetchTemplates();
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div className="template-layout">
      <div className="template-box">
        <h3>{editing ? 'Edit Email Template' : 'Upload New Email Template'}</h3>
        <form onSubmit={handleSubmit} className="email-form">
          <label>Template Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            disabled={editing}
          />

          <label>Email Subject</label>
          <input
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            required
          />

          <label>HTML Content</label>
          <textarea
            rows="8"
            value={html}
            onChange={e => setHtml(e.target.value)}
            required
          />
          <button type="submit">{editing ? 'Update Template' : 'Upload Template'}</button>
        </form>
      </div>

      <div className="template-list-box">
        <h4>Saved Templates</h4>
        <ul>
          {templates.map((t) => (
            <li key={t.name}>
              <span>{t.name}</span>
              <div>
                <button onClick={() => handleEdit(t.name)}>Edit</button>
                <button onClick={() => handleDelete(t.name)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
