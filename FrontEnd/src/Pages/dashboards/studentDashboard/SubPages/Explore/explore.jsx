// explore.jsx
import React from 'react';
import './explore.css';
import { Link, Outlet, useLocation } from 'react-router-dom';
import CustomCalendar from '../../../../../Component/CustomCalender/CustomCalender';
import ProgressChart from '../../../../../Component/progressChart';
import PerformanceGraph from '../../../../../Component/PerformanceGraph';

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
              <Link to="attendence" className="attendance clickable-box"><ProgressChart/></Link>
              <Link to="feedue" className="feeDue clickable-box">Fee Due</Link>
            </div>
            <Link to="performance" className="performance clickable-box"><PerformanceGraph /></Link>
          </div>
        
          <CustomCalendar />
          
        </div>
      )}

      <div className="explore-subcontent">
        <Outlet />
      </div>
    </>
  );
};

export default Explore;
