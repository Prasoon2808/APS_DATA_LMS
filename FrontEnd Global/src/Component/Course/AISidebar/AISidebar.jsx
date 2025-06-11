import React from 'react'
import './AISidebar.css'

const AISidebar = () => {
  return (
    <div className="ai-sidebar">
      <h3>AI Assistant</h3>
      <div className="ai-content">
        <p>Ask questions about the course content or get help with assignments.</p>
        <input type="text" placeholder="Type your question..." />
        <button>Ask AI</button>
      </div>
    </div>  
  )
}

export default AISidebar