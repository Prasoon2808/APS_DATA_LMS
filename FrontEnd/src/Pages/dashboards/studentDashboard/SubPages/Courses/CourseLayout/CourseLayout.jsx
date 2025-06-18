import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../../../../../Component/Course/Sidebar/Sidebar';
import ContentViewer from '../../../../../../Component/Course/ContentViewer/ContentViewer';
import Details from '../../../../../../Component/Course/Details/Details';
import AISidebar from '../../../../../../Component/Course/AISidebar/AISidebar'
import './CourseLayout.css';
import config from '../../../../../../config/config';
import TabBar from '../../../../../../Component/Course/TabBar/TabBar';
import Summary from '../../../../../../Component/Course/Summary/Summary';
import { useAuth } from '../../../../../../context/AuthContext'
import Notebook from '../../../../../../Component/Course/Notebook/Notebook';
import ResourceList from '../../../../../../Component/Course/ResourceList/ResourceList';
import QnAForum from '../../../../../../Component/Course/QnA/QnA';

export default function CourseLayout() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const { user } = useAuth(); // ✅ this gives you user._id
  const { isSidebarCollapsed } = useOutletContext();





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
      {/* <Sidebar
        course={course}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        setSelectedChapter={setSelectedChapter}
        selectedChapter={selectedChapter}
        onToggle={setIsSidebarCollapsed}
      /> */}
      <div className="main-content">
        <ContentViewer chapter={selectedChapter} />
        <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === 'Overview' && (
          <Details chapter={selectedChapter} course={course} />
        )}
        {activeTab === 'Resources' && (
          <ResourceList resources={selectedChapter.resources} />
        )}
        {activeTab === 'Q & A' && (
          <QnAForum courseId={course._id} chapterId={`${course._id}-${selectedChapter.name.replace(/\s+/g, '_')}`} userId={user._id} />
        )}
        {activeTab === 'Notebook' && (
          <Notebook
            userId={user._id}
            courseId={course._id}
            chapterId={`${course._id}-${selectedChapter.name.replace(/\s+/g, '_')}`} // or use actual chapter ID if available
          />
        )}
        {activeTab === 'Summary' && (
          <Summary summary={selectedChapter.summary}/>
        )}
      </div>
      <div className="aiSidebar">
        <AISidebar />
      </div>
    </div>
  );
}
