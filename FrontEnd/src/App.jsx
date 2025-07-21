import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginMenu from './Pages/loginMenu/loginMenu';
import StudentDashboard from './Pages/dashboards/studentDashboard/studentDashboard';
import FacultyDashboard from './Pages/dashboards/facultyDashboard/facultyDashboard.jsx';
import AdminDashboard from './Pages/dashboards/adminDashboard/adminDashboard';
import PrivateRoute from './Component/PrivateRoute.jsx';
import ResetPassword from './Pages/loginMenu/ResetPassword/resetPassword';
import Explore from './Pages/dashboards/studentDashboard/SubPages/Explore/explore';
import Courses from './Pages/dashboards/studentDashboard/SubPages/Courses/courses';
import Quiz from './Pages/dashboards/studentDashboard/SubPages/Quiz/AllQuizzes.jsx';
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
import Waitlist from './Pages/WaitList/WaitList.jsx';
import ReferralForm from './Pages/WaitList/Referral.jsx';
import CourseCreationForm from './Pages/dashboards/adminDashboard/SubPages/CourseCreationForm/CourseCreationForm.jsx';
import WaitlistApproval from './Pages/dashboards/adminDashboard/SubPages/WaitlistApproval/WaitlistApproval.jsx';
import CourseManagement from './Pages/dashboards/adminDashboard/SubPages/CourseManagement/CourseManagement.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import About from './Pages/About/About.jsx';
import FAQ from './Pages/FAQ/FAQ.jsx';
import BulkEmailSender from './Pages/dashboards/adminDashboard/SubPages/BulkEmailSender/BulkEmailSender.jsx';
import Events from './Pages/Events/Events.jsx';
import EventAdmin from './Pages/dashboards/adminDashboard/SubPages/EventManager/EventAdmin.jsx';
import EmailTemplateUploader from './Pages/dashboards/adminDashboard/SubPages/EmailTemplateUploader/EmailTemplateUploader.jsx'
import CreateEvent from './Pages/dashboards/adminDashboard/SubPages/AddEvent/CreateEvent.jsx';
import Blogs from './Pages/Blogs/Blogs.jsx';
import BlogForm from './Pages/dashboards/adminDashboard/SubPages/AddBlog/Addblog.jsx';
import BackReferralForm from './Pages/WaitList/BackReferral.jsx';
import QuizBuilder from './Pages/dashboards/adminDashboard/SubPages/QuizBuilder/QuizBuilder.jsx';
import QuizStartPage from './Pages/dashboards/studentDashboard/SubPages/Quiz/QuizStartPage.jsx';
import QuizMainPage from './Pages/dashboards/studentDashboard/SubPages/Quiz/QuizMainPage.jsx';
import QuizResultPage from './Pages/dashboards/studentDashboard/SubPages/Quiz/QuizResultPage.jsx';
import Forum from './Pages/dashboards/facultyDashboard/SubPages/ForumPage.jsx';
import ProfilePage from './Pages/Profile/ProfilePage.jsx';
import SettingsPage from './Pages/Settings/SettingsPage.jsx';
import AdminAssignmentPage from './Pages/dashboards/adminDashboard/SubPages/AssignmentManager/AssignmentManager.jsx';
import StudentAssignments from './Pages/dashboards/facultyDashboard/SubPages/SmartLABSAssingment/SmartLABSAssignment.jsx';
import AssignmentStartPage from './Pages/dashboards/facultyDashboard/SubPages/SmartLABSAssingment/AssignmentStartPage.jsx';
import AssignmentTaskListPage from './Pages/dashboards/facultyDashboard/SubPages/SmartLABSAssingment/AssignmentTaskListPage.jsx';
import AssignmentTaskPage from './Pages/dashboards/facultyDashboard/SubPages/SmartLABSAssingment/AssignmentTaskPage.jsx';
import Schedule from './Pages/dashboards/facultyDashboard/SubPages/Schedule/Schedule.jsx';
import AdminSummaryForm from './Pages/dashboards/adminDashboard/SubPages/SmartLABSSummary/SmartLABSSummay.jsx';
import SummaryPage from './Pages/dashboards/facultyDashboard/SubPages/SessionSummary/SessionSummary.jsx';
import AllSummaries from './Pages/dashboards/facultyDashboard/SubPages/SessionSummary/AllSessionSummary.jsx';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<GetStarted />} />
        <Route path="/login" element={<LoginMenu />} />
        <Route path='/waitlist' element={<Waitlist />} />
        <Route path='/waitlist/refer' element={<ReferralForm />} />
        <Route path='/refer' element={<BackReferralForm />} />
        <Route path='/about' element={<About/>} />
        <Route path='/faqs' element={<FAQ />} />
        <Route path='/events' element={<Events />} />
        <Route path='/blogs' element={<Blogs />} />
        
        
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
          <Route path="quizzes" element={<Quiz />} />
          <Route path="quiz/:quizId/start" element={<QuizStartPage />} />
          <Route path="quiz/:quizId" element={<QuizMainPage />} />
          <Route path='quiz/:quizId/result' element={<QuizResultPage />} />

          <Route path="assignment" element={<Assignment />} />
          <Route path="courses/:id" element={<CourseLayout />} />
          <Route path='profile' element={<ProfilePage />} />
          <Route path='settings' element={<SettingsPage/>} />
        </Route>

        <Route
          path="/dashboard/smartLABS"
          element={
            <PrivateRoute allowedRoles={['smartLABS']}>
              <FacultyDashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="network" replace />} />
          <Route path="network" element={<Forum />} />
          <Route path='assignment' element={<StudentAssignments />} />
          <Route path='assignment/:assignmentId/start' element={<AssignmentStartPage />} /> 
          <Route path="assignment/:assignmentId/tasks" element={<AssignmentTaskListPage />} />
          <Route path='assignment/:assignmentId/task/:taskNumber' element={<AssignmentTaskPage />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path='profile' element={<ProfilePage />} />
          <Route path='settings' element={<SettingsPage/>} />
          <Route path="summaries" element={<AllSummaries />} />
          <Route path="summary/:id" element={<SummaryPage />} />
        </Route>

        <Route
          path="/dashboard/admin"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="waitlist-approval" replace />} />
          <Route path="course-creation" element={<CourseCreationForm />} />
          <Route path="waitlist-approval" element={<WaitlistApproval />} />
          <Route path="course-management" element={<CourseManagement />} />
          <Route path="user-management" element={<div>User Management</div>} />
          <Route path="sent-invites" element={<BulkEmailSender />} />
          <Route path="event-registration" element={<EventAdmin />} />
          <Route path="email-template" element={<EmailTemplateUploader /> } />
          <Route path="event-creation" element={<CreateEvent />} />
          <Route path='blogs-creation' element={<BlogForm />} />
          <Route path='quiz-builder' element={<QuizBuilder />} />
          <Route path='assignment-manager' element={<AdminAssignmentPage />} />
          <Route path='profile' element={<ProfilePage />} />
          <Route path='settings' element={<SettingsPage/>} />
          <Route path="summary/add" element={<AdminSummaryForm mode="add" />} />
          <Route path="summary/edit/:id" element={<AdminSummaryForm mode="edit" />} />

          
        </Route>


        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
      <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
    </>
  );
};

export default App;
