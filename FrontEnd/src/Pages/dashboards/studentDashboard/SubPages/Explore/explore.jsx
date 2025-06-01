// explore.jsx
import React from 'react';
import './explore.css';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Explore = () => {
  const location = useLocation();
  const nameMap = {
    attendence: 'Attendance',
    feedue: 'Fee Due',
    performance: 'Performance',
  };
  
  const current = location.pathname.split('/').pop().toLowerCase();
  const isSubPage = Object.keys(nameMap).includes(current);
  
  
  return (
    <>
      <div className="breadcrumb">
            {isSubPage ? (
            <>
                <Link to="/dashboard/student/explore">Home</Link>&nbsp;&nbsp;&gt;&nbsp;&nbsp;{nameMap[current]}
            </>
            ) : (
            <>Home</>
            )}
      </div>
      {!isSubPage && (
        <div className="explore">
          <div className="col-right">
            <div className="col-up">
              <Link to="attendence" className="attendance clickable-box">Attendance</Link>
              <Link to="feedue" className="feeDue clickable-box">Fee Due</Link>
            </div>
            <Link to="performance" className="performance clickable-box">Performance</Link>
          </div>
          <div className="calendar">Calendar Widget</div>
        </div>
      )}

      <div className="explore-subcontent">
        <Outlet />
      </div>
    </>
  );
};

export default Explore;
