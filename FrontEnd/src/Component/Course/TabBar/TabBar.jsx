import React from 'react';
import './TabBar.css';
import { assets } from '../../../assets/assets';

const TabBar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { name: 'Overview', icon: assets.overviewIcon },
    { name: 'Resources', icon: assets.resourcesIcon },
    { name: 'Q & A', icon: assets.qnaIcon },
    { name: 'Notebook', icon: assets.notebookIcon },
    { name: 'Summary', icon: assets.summaryIcon },
  ];

  return (
    <div className="tab-bar">
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`tab-button ${activeTab === tab.name ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.name)}
        >
          <img src={tab.icon} className="icon"/>
          <span>{tab.name}</span>
        </button>
      ))}
    </div>
  );
};

export default TabBar;
