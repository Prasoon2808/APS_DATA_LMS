import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../../../../../Component/Course/Sidebar/Sidebar';
import ContentViewer from '../../../../../../Component/Course/ContentViewer/ContentViewer';
import Details from '../../../../../../Component/Course/Details/Details';
import AISidebar from '../../../../../../Component/Course/AISidebar/AISidebar'
import './CourseLayout.css';
import config from '../../../../../../config/config';

export default function CourseLayout() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    axios.get(`${config.backendUrl}/api/courses/${id}`)
      .then(res => {
        setCourse(res.data);
        if (res.data.sections?.[0]?.chapters?.[0]) {
          setActiveSection(0);
          setSelectedChapter(res.data.sections[0].chapters[0]);
        }
      });
  }, [id]);

  if (!course) return <p>Loading course...</p>;

const hasChapters = course.sections?.some(section => section.chapters?.length > 0);
if (!hasChapters) return <p>This course has no chapters available.</p>;

if (!selectedChapter) return <p>Please select a chapter to view.</p>;


  return (
    <div className={`courseLayout ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <Sidebar
        course={course}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        setSelectedChapter={setSelectedChapter}
        selectedChapter={selectedChapter}
        onToggle={setIsSidebarCollapsed}
      />
      <div className="main-content">
        <ContentViewer chapter={selectedChapter} />
        <Details chapter={selectedChapter} course={course} />
      </div>
      <div className="aiSidebar">
        <AISidebar />
      </div>
    </div>
  );
}
