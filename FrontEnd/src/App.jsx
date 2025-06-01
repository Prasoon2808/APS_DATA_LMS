import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginMenu from './Pages/loginMenu/loginMenu';
import StudentDashboard from './Pages/dashboards/studentDashboard/studentDashboard';
import FacultyDashboard from './Pages/dashboards/facultyDashboard/facultyDashboard';
import AdminDashboard from './Pages/dashboards/adminDashboard/adminDashboard';
import PrivateRoute from './Component/PrivateRoute.jsx';
import ResetPassword from './Pages/loginMenu/ResetPassword/resetPassword';
import Explore from './Pages/dashboards/studentDashboard/SubPages/Explore/explore';
import Courses from './Pages/dashboards/studentDashboard/SubPages/Courses/courses';
import Quiz from './Pages/dashboards/studentDashboard/SubPages/Quiz/quiz';
import Assignment from './Pages/dashboards/studentDashboard/SubPages/Assignment/assignment';
import Attendance from './Pages/dashboards/studentDashboard/SubPages/Explore/Attendance/attendance';
import FeeDue from './Pages/dashboards/studentDashboard/SubPages/Explore/FeeDue/feeDue';
import Performance from './Pages/dashboards/studentDashboard/SubPages/Explore/Performance/performance';
import InProgress from './Pages/dashboards/studentDashboard/SubPages/Courses/InProgress/InProgress';
import Saved from './Pages/dashboards/studentDashboard/SubPages/Courses/Saved/Saved';
import MyCollection from './Pages/dashboards/studentDashboard/SubPages/Courses/MyCollection/MyCollection';
import LearningHistory from './Pages/dashboards/studentDashboard/SubPages/Courses/LearningHistory/LearningHistory';
import { Navigate } from 'react-router-dom';
import CourseLayout from './Pages/dashboards/studentDashboard/SubPages/Courses/CourseLayout/CourseLayout';
import GetStarted from './Pages/GetStarted/GetStarted';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<GetStarted />} />
      <Route path="/login" element={<LoginMenu />} />
      
      <Route
        path="/dashboard/student"
        element={
          <PrivateRoute allowedRoles={['student']}>
            <StudentDashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="explore" replace />} />
        <Route path="explore" element={<Explore />}>
          <Route path="attendence" element={<Attendance />} />
          <Route path="feedue" element={<FeeDue />} />
          <Route path="performance" element={<Performance />} />
        </Route>
        <Route path="courses" element={<Courses />}>
          <Route index element={<Navigate to="inprogress" replace />} />
          <Route path="inprogress" element={<InProgress />} />
          <Route path="saved" element={<Saved />} />
          <Route path="mycollection" element={<MyCollection />} />
          <Route path="learninghistory" element={<LearningHistory />} />
        </Route>
        <Route path="quiz" element={<Quiz />} />
        <Route path="assignment" element={<Assignment />} />
        <Route path="courses/:id" element={<CourseLayout />} />
      </Route>

      <Route
        path="/dashboard/faculty"
        element={
          <PrivateRoute allowedRoles={['faculty']}>
            <FacultyDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard/admin"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />


      <Route path="/reset-password/:token" element={<ResetPassword />} />
    </Routes>
  );
};

export default App;
