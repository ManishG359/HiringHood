import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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



function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/seeker/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/jobs" element={<PrivateRoute><BrowseJobs /></PrivateRoute>} />
      <Route path="/jobs/:id" element={<PrivateRoute><JobDetails /></PrivateRoute>} />
      <Route path="/apply/:id" element={<PrivateRoute><ApplyJob /></PrivateRoute>} />
      <Route path="/applications" element={<PrivateRoute><MyApplications /></PrivateRoute>} />
   
    {/* Employer Routes */}
    <Route path="/employer/dashboard" element={<PrivateRoute><DashboardEmployer /></PrivateRoute>} />
    <Route path="/employer/post-job" element={<PrivateRoute><PostJob /></PrivateRoute>} />
    <Route path="/employer/manage-jobs" element={<PrivateRoute><ManageJobs /></PrivateRoute>} />
    <Route path="/employer/view-applicants/:jobId" element={<PrivateRoute><ViewApplicants /></PrivateRoute>} />
    <Route path="/employer/edit-job/:id" element={<PrivateRoute><EditJob /></PrivateRoute>} />
    <Route path="/employer/profile" element={<EmployerProfile />} />
    <Route path="/employer/applicants" element={<PrivateRoute><EmployerApplicantsPage /></PrivateRoute>} />
  </Routes>
  );
}

export default App;


