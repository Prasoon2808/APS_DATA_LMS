import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './customCalender.css';
import { useAuth } from '../../context/AuthContext'; // adjust if needed
import config from '../../config/config'; // backend URL config

const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (month, year) => {
  return new Date(year, month, 1).getDay(); // 0 = Sunday
};

const CustomCalendar = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [loginDates, setLoginDates] = useState([]);
  const { user } = useAuth();
  const url = config.backendUrl;

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const res = await axios.get(`${url}/api/auth/streak-dates`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setLoginDates(res.data.streakDates);
      } catch (err) {
        console.error("Failed to fetch streak dates", err);
      }
    };

    fetchStreak();
  }, [user]);

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const renderCalendarDays = () => {
    const days = [];

    // Empty slots for alignment
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
    }

    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(currentYear, currentMonth, d);
      const dateStr = dateObj.toISOString().split('T')[0];
      const isPast = dateObj < today;
      const isLogged = loginDates.includes(dateStr);

      let className = "calendar-day";
      let content;

      if (isLogged) {
        className += " logged";
        content = <div className="tick-only">✔</div>;
      } else if (isPast) {
        className += " missed";
        content = (
          <div className="dot-under-date">
            <span>{d}</span>
            <span className="dot" />
          </div>
        );
      } else {
        content = <span>{d}</span>;
      }

      days.push(
        <div key={d} className={className}>
          {content}
        </div>
      );
    }

    return days;
  };

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  return (
    <div className="custom-calendar-container">
      <div className="calendar-header">
        <button onClick={goToPrevMonth}>←</button>
        <h3>
          {new Date(currentYear, currentMonth).toLocaleString('default', {
            month: 'long',
          })}{' '}
          {currentYear}
        </h3>
        <button onClick={goToNextMonth}>→</button>
      </div>

      <div className="calendar-weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>

      <div className="calendar-grid">{renderCalendarDays()}</div>
    </div>
  );
};

export default CustomCalendar;
