import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/seeker/Dashboard';
import Profile from './pages/seeker/Profile';
import PrivateRoute from './components/PrivateRoute';
import BrowseJobs from './pages/seeker/BrowseJobs';
import JobDetails from './pages/seeker/JobDetails';
import ApplyJob from './pages/seeker/ApplyJobs';
import MyApplications from './pages/seeker/MyApplications';
import DashboardEmployer  from '../src/pages/employer/DashboardEmployer';
import PostJob from './pages/employer/PostJob';
import ManageJobs from './pages/employer/ManageJobs';
import ViewApplicants from './pages/employer/ViewApplicants';
import EditJob from './pages/employer/EditJob';
import EmployerProfile from './pages/employer/EmployerProfile';
import EmployerApplicantsPage from './pages/employer/EmployerApplicantsPage';
import LandingPage from './pages/LandingPage';
import { AuthProvider } from './context/AuthContext';
import HRAnalyticsTab from './components/HRAnalytics/HRAnalyticsTab';
import SurveyManager from './components/HRAnalytics/SurveyManager';
import SurveyResponsePage from './components/HRAnalytics/SurveyResponsePage';
import SplitInterviews from './components/SplitInterviews';
import TimelineCalculator from './components/TimelineCalculator';
import { ProtectedRoute } from './components/ProtectedRoute';
import JobTimelineEditor from './components/JobTimelineEditor';



function App() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user?.role;
  return (
    <AuthProvider>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Seeker Routes */}
      <Route path="/seeker/dashboard" element={<PrivateRoute value={undefined}><Dashboard /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute value={undefined}><Profile /></PrivateRoute>} />
      <Route path="/jobs" element={<PrivateRoute value={undefined}><BrowseJobs /></PrivateRoute>} />
      <Route path="/jobs/:id" element={<PrivateRoute value={undefined}><JobDetails /></PrivateRoute>} />
      <Route path="/apply/:id" element={<PrivateRoute value={undefined}><ApplyJob /></PrivateRoute>} />
      <Route path="/applications" element={<PrivateRoute value={undefined}><MyApplications /></PrivateRoute>} />
      <Route path="/timeline" element={<TimelineCalculator />} />
    {/* Employer Routes */}
    <Route path="/employer/timeline/:jobId" element={<TimelineCalculator />} />
    <Route path="/employer/dashboard" element={<PrivateRoute value={undefined}><DashboardEmployer /></PrivateRoute>} />
    <Route path="/employer/post-job" element={<PrivateRoute value={undefined}><PostJob /></PrivateRoute>} />
    <Route path="/employer/manage-jobs" element={<PrivateRoute value={undefined}><ManageJobs /></PrivateRoute>} />
    <Route path="/employer/view-applicants/:jobId" element={<PrivateRoute value={undefined}><ViewApplicants /></PrivateRoute>} />
    <Route path="/employer/edit-job/:id" element={<PrivateRoute value={undefined}><EditJob /></PrivateRoute>} />
    <Route path="/employer/profile" element={<EmployerProfile />} />
    <Route path="/employer/applicants" element={<PrivateRoute value={undefined}><EmployerApplicantsPage /></PrivateRoute>} />
    <Route path="/dashboard/hr-analytics" element={<HRAnalyticsTab />} />
    <Route path="/employer/surveys" element={<PrivateRoute value={undefined}><SurveyManager /></PrivateRoute>} />
    <Route path="/survey" element={<PrivateRoute value={undefined}><SurveyResponsePage /></PrivateRoute>} />
    <Route path="/split" element={
      <ProtectedRoute role="employer" userRole={userRole} element={<SplitInterviews />} />
    }
  />
  <Route path="/employer/edit-timeline/:jobId" element={<PrivateRoute value={undefined}><JobTimelineEditor /></PrivateRoute>} />
  <Route path="/unauthorized" element={<div>403: Access Denied</div>} />
  </Routes>
  </AuthProvider>
  );
}

export default App;


