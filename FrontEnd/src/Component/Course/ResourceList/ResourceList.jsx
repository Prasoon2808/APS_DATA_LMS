import React from 'react';
import './ResourceList.css';

const ResourceList = ({ resources = [] }) => {
  if (!resources.length) {
    return <p className="no-resources">No resources available for this chapter.</p>;
  }

  return (
    <div className="resources-list">
      <h3>Downloadable Resources</h3>
      {resources.map((url, i) => {
        const fileName = url.split('/').pop();
        return (
          <div key={i} className="resource-item">
            <p className="file-name">Resource {i+1}</p>
            <a href={url} download target="_blank" rel="noopener noreferrer">
              <button className="download-btn">Download</button>
            </a>
          </div>
        );
      })}
    </div>
  );
};

export default ResourceList;
