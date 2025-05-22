import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginMenu from './Pages/loginMenu/loginMenu';
import StudentDashboard from './Pages/dashboards/studentDashboard/studentDashboard';
import FacultyDashboard from './Pages/dashboards/facultyDashboard/facultyDashboard';
import AdminDashboard from './Pages/dashboards/adminDashboard/adminDashboard';
import PrivateRoute from './Component/PrivateRoute.jsx'; // Create this file
import ResetPassword from './Pages/loginMenu/ResetPassword/resetPassword';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginMenu />} />
      
      <Route
        path="/dashboard/student"
        element={
          <PrivateRoute allowedRoles={['student']}>
            <StudentDashboard />
          </PrivateRoute>
        }
      />
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
