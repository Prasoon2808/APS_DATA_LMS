import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Notebook.css';
import config from '../../../config/config';
import { assets } from '../../../assets/assets';

export default function Notebook({ userId, courseId, chapterId }) {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [currentNote, setCurrentNote] = useState({ title: '', content: '', tags: [], _id: null });
  const [tagInput, setTagInput] = useState('');
  const [expandedNoteId, setExpandedNoteId] = useState(null);

  useEffect(() => {
    if (userId && courseId && chapterId) fetchNotes();
  }, [userId, courseId, chapterId]);

  const fetchNotes = async () => {
    const res = await axios.get(`${config.backendUrl}/api/notebook/${userId}/${courseId}/${chapterId}`);
    setNotes(res.data || []);
  };

  const handleChange = (field, value) => {
    setCurrentNote({ ...currentNote, [field]: value });
  };

  const handleSave = async () => {
    const { _id, title, content, tags } = currentNote;
    if (!title.trim() && !content.trim()) return;

    await axios.post(`${config.backendUrl}/api/notebook`, {
      userId, courseId, chapterId, noteId: _id, title, content, tags
    });

    setCurrentNote({ title: '', content: '', tags: [], _id: null });
    setTagInput('');
    fetchNotes();
  };

  const handleDelete = async (noteId) => {
    await axios.delete(`${config.backendUrl}/api/notebook/${noteId}`);
    fetchNotes();
  };

  const handleEdit = (note) => {
    setCurrentNote({ ...note, tags: Array.isArray(note.tags) ? note.tags : [] });
    setTagInput('');
  };

  const handleTagAdd = (e) => {
    e.preventDefault();
    const tag = tagInput.trim();
    if (!tag) return;
    setCurrentNote(prev => (
      prev.tags.includes(tag) ? prev : { ...prev, tags: [...prev.tags, tag] }
    ));
    setTagInput('');
  };

  const handleTagRemove = (tag) => {
    setCurrentNote(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const filteredNotes = notes.filter(note =>
    note.title?.toLowerCase().includes(search.toLowerCase()) ||
    note.content?.toLowerCase().includes(search.toLowerCase()) ||
    note.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
    <div className="notebook-box">
      <input
        type="text"
        className="search-bar"
        placeholder="Search Bar"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <h2>Add New Note</h2>
      <div className="note-form">
        <input
          type="text"
          placeholder="Note title"
          value={currentNote.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
        <textarea
          placeholder="Write your note..."
          value={currentNote.content}
          onChange={(e) => handleChange('content', e.target.value)}
        />

        <div className="tag-input">
          {currentNote.tags.map((tag, i) => (
            <span className="tag" key={i}>
              {tag}
              <button onClick={() => handleTagRemove(tag)}>×</button>
            </span>
          ))}
          <form onSubmit={handleTagAdd} className="tag-form">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add tag"
            />
            <button type="submit" className="add-tag-btn">Add Tag</button>
          </form>
        </div>

        <button onClick={handleSave}>
          {currentNote._id ? 'Update Note' : 'Save Note'}
        </button>
      </div>
    </div>
    <div className="notebook-box">
      <div className="recent-notes">
        <h2>Recent Notes</h2>
        {filteredNotes.length === 0 && <p>No notes found.</p>}
        {filteredNotes.map(note => {
          const isExpanded = expandedNoteId === note._id;
          return (
            <div key={note._id} className={`note-card-expanded ${isExpanded ? 'expanded' : ''}`}>
              <h4 onClick={() => setExpandedNoteId(isExpanded ? null : note._id)} className="note-clickable">
                {note.title || '(Untitled)'}
              </h4>

              {isExpanded && (
                <>
                  <p>{note.content}</p>
                  {note.tags?.length > 0 && (
                    <div className="note-tags">
                      {note.tags.map((tag, i) => (
                        <span key={i} className="small-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                  <div className="note-actions">
                    <button onClick={() => handleEdit(note)}><img src={assets.editIcon2} /> Edit</button>
                    <button onClick={() => handleDelete(note._id)}><img src={assets.deleteIconred} />Delete</button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
    
    </>
  );
}
