import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import './BulkEmailSender.css';
import config from '../../../../../config/config';
import { toast } from 'react-toastify';

export default function BulkEmailSender() {
  const [templateNames, setTemplateNames] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [templateHTML, setTemplateHTML] = useState('');
  const [emailList, setEmailList] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [sentCount, setSentCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${config.backendUrl}/api/templates`)
      .then(res => res.json())
      .then(data => {
        setTemplateNames(data.map(t => t.name));
        if (data[0]) setSelectedTemplate(data[0].name);
      });
  }, []);

  useEffect(() => {
    if (!selectedTemplate) return;
    fetch(`${config.backendUrl}/api/templates/${selectedTemplate}`)
      .then(res => res.json())
      .then(data => setTemplateHTML(data.html));
  }, [selectedTemplate]);

  const handleCSVUpload = (e) => {
    Papa.parse(e.target.files[0], {
      header: true,
      complete: (results) => {
        const filtered = results.data.filter(r => r.Email);
        setEmailList(filtered);
        setStatusMap({});
        setSentCount(0);
      },
    });
  };

  const sendEmail = async (recipient, index) => {
  try {
    const res = await fetch(`${config.backendUrl}/api/send-bulk-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailList: [recipient],
        templateName: selectedTemplate
      }),
    });

    const result = await res.json();

    if (res.ok && (!result.failedList || result.failedList.length === 0)) {
      setStatusMap(prev => ({ ...prev, [index]: 'success' }));
      setSentCount(prev => prev + 1);
    } else {
      setStatusMap(prev => ({ ...prev, [index]: 'error' }));
    }
  } catch (err) {
    console.error(err);
    setStatusMap(prev => ({ ...prev, [index]: 'error' }));
  }
};


  const handleSendAll = async () => {
    setLoading(true);
    for (let i = 0; i < emailList.length; i++) {
      await sendEmail(emailList[i], i);
    }
    toast.success('All emails processed!');
    setLoading(false);
  };

  return (
    <div className="email-sender-fullscreen">
      {/* LEFT PANEL */}
      <div className="left-panel">
        <div className="template-grid-section">
          <h3>Select Template</h3>
          <div className="template-grid compact">
            {templateNames.map((name, i) => (
              <div
                key={name}
                className={`template-card ${selectedTemplate === name ? 'selected' : ''}`}
                onClick={() => setSelectedTemplate(name)}
              >
                <div className="template-icon">@</div>
                <div className="template-name">{name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="csv-box">
          <h3>Upload CSV</h3>
          <input type="file" accept=".csv" onChange={handleCSVUpload} />
        </div>

        <div className="recipients-box">
          <h3>
            Recipient List{' '}
            <span style={{ fontSize: '0.85em', color: '#555' }}>
              ({sentCount} / {emailList.length})
            </span>
          </h3>
          <ul>
            {emailList.map((item, i) => (
              <li key={i}>
                {item.Name} ({item.Email})
                {statusMap[i] === 'success' && <span className="tick">✔</span>}
                {statusMap[i] === 'error' && <span className="cross">✖</span>}
              </li>
            ))}
          </ul>
        </div>

        <button
          className="send-button"
          onClick={handleSendAll}
          disabled={loading}
          style={{
            opacity: !loading ? 1 : 0.6,
            cursor: !loading ? 'pointer' : 'not-allowed',
          }}
        >
          {loading ? 'Sending...' : 'Send Emails'}
        </button>
      </div>

      {/* RIGHT PANEL */}
      <div className="preview-panel">
        <div className="preview-box">
          <div
            className="template-html-wrapper"
            dangerouslySetInnerHTML={{ __html: templateHTML }}
          />
        </div>
      </div>
    </div>
  );
}
