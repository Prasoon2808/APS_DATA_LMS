import React, { useState } from 'react';
import './Sidebar.css';
import { assets } from '../../../assets/assets';

export default function Sidebar({ course, activeSection, setActiveSection, setSelectedChapter, selectedChapter, onToggle }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSection = (index) => {
    setActiveSection(activeSection === index ? null : index);
  };

  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (onToggle) onToggle(newState);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="toggleSidebarBtn" onClick={handleToggle}>
        {isCollapsed ? <img src={assets.arrowIcon} alt="" /> : <img src={assets.crossIcon} alt="" />}
      </button>
      {!isCollapsed && <h3>Content</h3>}
      {course.sections.map((section, sIdx) => (
        <div key={sIdx}>
          <div className="section-title" onClick={() => toggleSection(sIdx)}>
            ▶ {section.name}
          </div>
          {activeSection === sIdx && (
            <ul className="chapter-list">
              {section.chapters.map((chapter, cIdx) => (
                <li
                  key={cIdx}
                  className={selectedChapter === chapter ? 'active' : 'chapter-item'}
                  onClick={() => setSelectedChapter(chapter)}
                >
                  📘 {chapter.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
