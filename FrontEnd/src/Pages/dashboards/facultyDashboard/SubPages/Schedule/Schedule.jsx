import React from 'react';
import './Schedule.css';

const events = [
  {
    date: '2025-07-19',
    title: 'OS01',
    location: 'Online · Saturday · 4 Hours · 5 PM – 9 PM',
    tag: 'THEORY',
    zoomLink: 'https://us06web.zoom.us/j/85734480047?pwd=6klVgN6lQMmwI5OFVEqIlOUNYSPqE4.1',
    recLink: null,
  },
  {
    date: '2025-07-20',
    title: 'OS02',
    location: 'Online · Sunday · 8 Hours · 10 AM – 6 PM',
    tag: 'SOFTWARE',
    zoomLink: 'https://us06web.zoom.us/j/85734480047?pwd=6klVgN6lQMmwI5OFVEqIlOUNYSPqE4.1',
    recLink: null,
  },
  {
    date: '2025-07-26',
    title: 'OS03',
    location: 'Online · Saturday · 4 Hours · 10 AM – 2 PM',
    tag: 'SOFTWARE',
    zoomLink: 'https://us06web.zoom.us/j/85734480047?pwd=6klVgN6lQMmwI5OFVEqIlOUNYSPqE4.1',
    recLink: null,
  },
  {
    date: '2025-08-02',
    title: 'OS04',
    location: 'Online · Saturday · 2 Hours · 12 PM – 2 PM',
    tag: 'SOFTWARE',
    zoomLink: 'https://us06web.zoom.us/j/85734480047?pwd=6klVgN6lQMmwI5OFVEqIlOUNYSPqE4.1',
    recLink: null,
  },
  {
    date: '2025-08-03',
    title: 'OS05',
    location: 'Online · Sunday · 8 Hours · 10 AM – 6 PM',
    tag: 'SOFTWARE',
    zoomLink: 'https://us06web.zoom.us/j/85734480047?pwd=6klVgN6lQMmwI5OFVEqIlOUNYSPqE4.1',
    recLink: null,
  },
  {
    date: '2025-08-09',
    title: 'OS06',
    location: 'Online · Saturday · 8 Hours · 10 AM – 6 PM',
    tag: 'SOFTWARE + DESIGN STUDIO',
    zoomLink: 'https://us06web.zoom.us/j/85734480047?pwd=6klVgN6lQMmwI5OFVEqIlOUNYSPqE4.1',
    recLink: null,
  },
  {
    date: '2025-08-10',
    title: 'OS07',
    location: 'Online · Sunday · 4 Hours · 3 PM – 7 PM',
    tag: 'SOFTWARE',
    zoomLink: 'https://us06web.zoom.us/j/85734480047?pwd=6klVgN6lQMmwI5OFVEqIlOUNYSPqE4.1',
    recLink: null,
  },
  {
    date: '2025-08-13',
    title: 'OS08',
    location: 'Online · Wednesday · 2 Hours · 7:30 PM – 9:30 PM',
    tag: 'THEORY',
    zoomLink: 'https://us06web.zoom.us/j/85734480047?pwd=6klVgN6lQMmwI5OFVEqIlOUNYSPqE4.1',
    recLink: null,
  },
  {
    date: '2025-08-23',
    title: 'OS09',
    location: 'Online · Saturday · 8 Hours · 10 AM – 6 PM',
    tag: 'SOFTWARE + MENTORING',
    zoomLink: 'https://us06web.zoom.us/j/85734480047?pwd=6klVgN6lQMmwI5OFVEqIlOUNYSPqE4.1',
    recLink: null,
  },
  {
    date: '2025-08-30',
    title: 'SS01',
    location: 'New Delhi / Online · Saturday · 8 Hours · 10 AM – 6 PM',
    tag: 'SOFTWARE + DESIGN STUDIO',
    zoomLink: 'https://us06web.zoom.us/j/85734480047?pwd=6klVgN6lQMmwI5OFVEqIlOUNYSPqE4.1',
    recLink: null,
  },
  {
    date: '2025-08-31',
    title: 'SS01',
    location: 'New Delhi / Online · Saturday · 8 Hours · 10 AM – 6 PM',
    tag: 'SOFTWARE + DESIGN STUDIO',
    zoomLink: 'https://us06web.zoom.us/j/85734480047?pwd=6klVgN6lQMmwI5OFVEqIlOUNYSPqE4.1',
    recLink: null,
  },
  {
    date: '2025-09-06',
    title: 'OS10',
    location: 'Online · Saturday · 4 Hours · 3 PM – 7 PM',
    tag: 'SOFTWARE',
    zoomLink: 'https://us06web.zoom.us/j/85734480047?pwd=6klVgN6lQMmwI5OFVEqIlOUNYSPqE4.1',
    recLink: null,
  },
  {
    date: '2025-09-13',
    title: 'OS11',
    location: 'Online · Saturday · 4 Hours · 10 AM – 2 PM',
    tag: 'CRITICS',
    zoomLink: 'https://us06web.zoom.us/j/85734480047?pwd=6klVgN6lQMmwI5OFVEqIlOUNYSPqE4.1',
    recLink: null,
  },
  {
    date: '2025-09-14',
    title: 'OS12',
    location: 'Online · Sunday · 4 Hours · 3 PM – 7 PM',
    tag: 'SOFTWARE',
    zoomLink: 'https://us06web.zoom.us/j/85734480047?pwd=6klVgN6lQMmwI5OFVEqIlOUNYSPqE4.1',
    recLink: null,
  },
  {
    date: '2025-09-27',
    title: 'SS02',
    location: 'New Delhi / Online · Saturday · 8 Hours · 10 AM – 6 PM',
    tag: 'SOFTWARE + DESIGN STUDIO',
    zoomLink: 'https://us06web.zoom.us/j/85734480047?pwd=6klVgN6lQMmwI5OFVEqIlOUNYSPqE4.1',
    recLink: null,
  },
  {
    date: '2025-09-28',
    title: 'SS02',
    location: 'New Delhi / Online · Saturday · 8 Hours · 10 AM – 6 PM',
    tag: 'SOFTWARE + DESIGN STUDIO',
    zoomLink: 'https://us06web.zoom.us/j/85734480047?pwd=6klVgN6lQMmwI5OFVEqIlOUNYSPqE4.1',
    recLink: null,
  },
  {
    date: '2025-10-11',
    title: 'OS13',
    location: 'Online · Saturday · 2 Hours · 3 PM – 5 PM',
    tag: 'SOFTWARE',
    zoomLink: 'https://us06web.zoom.us/j/85734480047?pwd=6klVgN6lQMmwI5OFVEqIlOUNYSPqE4.1',
    recLink: null,
  },
  {
    date: '2025-10-18',
    title: 'OS14',
    location: 'Online · Saturday · 2 Hours · 3 PM – 5 PM',
    tag: 'SOFTWARE + DESIGN STUDIO',
    zoomLink: 'https://us06web.zoom.us/j/85734480047?pwd=6klVgN6lQMmwI5OFVEqIlOUNYSPqE4.1',
    recLink: null,
  },
  {
      date: '2025-10-24',
      title: 'UAE Study Tour (Optional)',
      location: 'Friday · Trip Begins',
      tag: 'Architectural Field Trip',
      zoomLink: null,
      recLink: null,
    },
    {
        date: '2025-10-25',
        title: 'UAE Study Tour',
        location: 'Saturday · Full Day Activities',
        tag: 'Architectural Field Trip',
        zoomLink: null,
        recLink: null,
    },
    {
        date: '2025-10-26',
        title: 'UAE Study Tour',
        location: 'Sunday · Full Day Activities',
        tag: 'Architectural Field Trip',
        zoomLink: null,
        recLink: null,
    },
    {
        date: '2025-10-29',
        title: 'UAE Study Tour (Optional)',
        location: 'Wednesday · Trip Culminates',
        tag: 'Architectural Field Trip',
        zoomLink: null,
        recLink: null,
    },
    {
      date: '2025-11-01',
      title: 'OS15',
      location: 'Online · Saturday · 4 Hours · 12 PM – 4 PM',
      tag: 'DESIGN STUDIO + CRITICS',
      zoomLink: 'https://us06web.zoom.us/j/85734480047?pwd=6klVgN6lQMmwI5OFVEqIlOUNYSPqE4.1',
      recLink: null,
    },
    {
      date: '2025-11-08',
      title: 'OS16',
      location: 'Online · Saturday · 6 Hours · 12 PM – 6 PM',
      tag: 'DESIGN STUDIO + CRITICS',
      zoomLink: 'https://us06web.zoom.us/j/85734480047?pwd=6klVgN6lQMmwI5OFVEqIlOUNYSPqE4.1',
      recLink: null,
    },
    {
      date: '2025-11-22',
      title: 'SS04',
      location: 'New Delhi / Online · Saturday · 8 Hours · 10 AM – 6 PM',
      tag: 'SOFTWARE + DESIGN STUDIO',
      zoomLink: 'https://us06web.zoom.us/j/85734480047?pwd=6klVgN6lQMmwI5OFVEqIlOUNYSPqE4.1',
      recLink: null,
    },
    {
      date: '2025-11-23',
      title: 'SS04',
      location: 'New Delhi / Online · Sunday · 8 Hours · 10 AM – 6 PM',
      tag: 'SOFTWARE + DESIGN STUDIO',
      zoomLink: 'https://us06web.zoom.us/j/85734480047?pwd=6klVgN6lQMmwI5OFVEqIlOUNYSPqE4.1',
      recLink: null,
    },
    {
      date: '2025-11-29',
      title: 'OS17',
      location: 'Online · Saturday · 2 Hours · 7:30 PM – 9:30 PM',
      tag: 'SOFTWARE',
      zoomLink: 'https://us06web.zoom.us/j/85734480047?pwd=6klVgN6lQMmwI5OFVEqIlOUNYSPqE4.1',
      recLink: null,
    },
    {
      date: '2025-11-30',
      title: 'OS18',
      location: 'Online · Sunday · 4 Hours · 2 PM – 6 PM',
      tag: 'CRITICS',
      zoomLink: 'https://us06web.zoom.us/j/85734480047?pwd=6klVgN6lQMmwI5OFVEqIlOUNYSPqE4.1',
      recLink: null,
    },
    
    {
      date: '2025-12-06',
      title: 'SS05',
      location: 'New Delhi / Online · Saturday · 8 Hours · 10 AM – 6 PM',
      tag: 'DESIGN STUDIO + CRITICS',
      zoomLink: 'https://us06web.zoom.us/j/85734480047?pwd=6klVgN6lQMmwI5OFVEqIlOUNYSPqE4.1',
      recLink: null,
    },
    {
      date: '2025-12-07',
      title: 'SS05',
      location: 'New Delhi / Online · Sunday · 8 Hours · 10 AM – 6 PM',
      tag: 'DESIGN STUDIO + CRITICS',
      zoomLink: 'https://us06web.zoom.us/j/85734480047?pwd=6klVgN6lQMmwI5OFVEqIlOUNYSPqE4.1',
      recLink: null,
    },
    {
      date: '2025-12-10',
      title: 'OS19',
      location: 'Online · Wednesday · 2 Hours · 7:30 PM – 9:30 PM',
      tag: 'CRITICS + MENTORING',
      zoomLink: 'https://us06web.zoom.us/j/85734480047?pwd=6klVgN6lQMmwI5OFVEqIlOUNYSPqE4.1',
      recLink: null,
    },
    {
      date: '2025-12-11',
      title: 'OS20',
      location: 'Online · Thursday · 2 Hours · 7:30 PM – 9:30 PM',
      tag: 'CRITICS + MENTORING',
      zoomLink: 'https://us06web.zoom.us/j/85734480047?pwd=6klVgN6lQMmwI5OFVEqIlOUNYSPqE4.1',
      recLink: null,
    },
    {
      date: '2025-12-18',
      title: 'SS06',
      location: 'New Delhi · Thursday · 8 Hours · 10 AM – 6 PM',
      tag: 'DESIGN STUDIO + EXHIBITION',
      zoomLink: null,
      recLink: null,
    },
    {
      date: '2025-12-19',
      title: 'SS06',
      location: 'New Delhi · Friday · 8 Hours · 10 AM – 6 PM',
      tag: 'DESIGN STUDIO + EXHIBITION',
      zoomLink: null,
      recLink: null,
    },
    {
      date: '2025-12-20',
      title: 'SS06',
      location: 'New Delhi · Saturday · 8 Hours · 10 AM – 6 PM',
      tag: 'DESIGN STUDIO + EXHIBITION',
      zoomLink: null,
      recLink: null,
    },
    {
      date: '2025-12-20',
      title: 'SL11 EXHIBITION & GRADUATION',
      location: 'New Delhi · Saturday · 8 Hours · 10 AM – 6 PM',
      tag: 'GRADUATION + EXHIBITION',
      zoomLink: null,
      recLink: null,
    },
    {
      date: '2025-12-21',
      title: 'SL11 EXHIBITION & GRADUATION',
      location: 'New Delhi · Sunday · 8 Hours · 10 AM – 6 PM',
      tag: 'EXHIBITION',
      zoomLink: null,
      recLink: null,
    },
    {
      date: '2025-12-27',
      title: 'SMART DESIGN CONFERENCE 2025 // EDU[LAB] Knowledge Forum',
      location: 'Saturday · TBD',
      tag: 'ONLINE GLOBAL SYMPOSIUM',
      zoomLink: null,
      recLink: null,
    },
    {
      date: '2025-12-28',
      title: 'SMART DESIGN CONFERENCE 2025 // EDU[LAB] Knowledge Forum',
      location: 'Sunday · TBD',
      tag: 'ONLINE GLOBAL SYMPOSIUM',
      zoomLink: null,
      recLink: null,
    },
  
];

// Group by Month-Year
const groupedByMonth = events.reduce((acc, event) => {
  const date = new Date(event.date);
  const monthKey = date.toLocaleString('default', { month: 'long', year: 'numeric' });
  if (!acc[monthKey]) acc[monthKey] = [];
  acc[monthKey].push(event);
  return acc;
}, {});

const Schedule = () => {
  return (
    <div className="schedule-container">
      <h1 className="schedule-title">
        SMART<green>LABS</green> <red>11.0</red><br />
        <span>Semester Schedule: July 2025 – Dec 2025</span>
      </h1>

      {Object.entries(groupedByMonth).map(([month, monthEvents]) => (
        <div key={month}>
          <div className="section-title">{month}</div>
          {monthEvents.map((event, index) => {
            const date = new Date(event.date);
            const day = String(date.getDate()).padStart(2, '0');
           const monthShort = date.toLocaleString('default', { month: 'short' });
            return (
              <div className="event-row" key={index}>
                <div className="event-date">
                  <div className="event-day">{day}</div>
                  <div className="event-month">{monthShort}</div>
                </div>
                <div className="event-info">
                  <h3>{event.title}</h3>
                  <span className={`event-tag ${event.tag.toLowerCase().replace(/[\s+]/g, '-').replace(/[^a-z0-9\-]/g, '')}`}>{event.tag}</span>
                  <p className="event-location">{event.location}</p>
                  {event.zoomLink &&(<p className='meeting-info'><span>Meeting ID:</span> 857 3448 0047<br/><span>Passcode:</span> 202511</p>)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', paddingRight: '20px' }}>
                  {event.zoomLink && (
                    <a
                      className="zoom-btn"
                      href={event.zoomLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Join Zoom Session
                    </a>
                  )}
                  {event.recLink && (
                    <a
                      className="rec-btn"
                      href={event.recLink}
                    >
                      View Summary & Recording
                    </a>
                  )}
                  </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Schedule;
