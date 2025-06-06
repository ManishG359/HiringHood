import { AppBar, Avatar, Box, Button, Card, CardContent, Container,
  Dialog, DialogContent, DialogTitle, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMyProfile } from '../../services/profileService';
import { fetchApplicantsByJobId } from '../../services/applicationService';
import axiosInstance from '../../services/axiosInstance';
import styled from 'styled-components';

const PageBackground = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(120deg, #FAFFCA 0%, #B9D4AA 40%, #84AE92 100%);
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
`;

const DialogBackground = styled(DialogContent)`
  background: linear-gradient(120deg, #FAFFCA 0%, #B9D4AA 40%, #84AE92 100%);
`;

const NavText = styled.span<{ red?: boolean }>`
  cursor: pointer;
  font-weight: 600;
  font-size: 1.08rem;
  margin-left: 1.5rem;
  color: ${({ red }) => (red ? '#d32f2f' : '#fff')};
  transition: color 0.2s, text-decoration 0.2s;
  &:hover {
    text-decoration: underline;
    color: ${({ red }) => (red ? '#b71c1c' : '#FFD600')};
  }
`;

const StyledContainer = styled(Container)`
  max-width: 1200px !important;
  margin-top: 2rem;
`;

const StyledCard = styled(Card)`
  border-radius: 18px !important;
  box-shadow: 0 6px 24px 0 rgba(90, 130, 126, 0.12) !important;
  background: #FAFFCA !important;
  transition: background 0.2s;
  &:hover {
    background: #fff !important;
  }
`;

const StyledButton = styled(Button)`
  background: linear-gradient(90deg, #5A827E 60%, #84AE92 100%);
  color: #fff !important;
  border-radius: 8px 
  font-weight: 600 
  font-size: 0.95rem 
  padding: 6px 16px 
  margin: 0.5rem 0 
  box-shadow: none
  min-height: 36px 
  width: 100% 
  &:hover {
    background: linear-gradient(90deg, #84AE92 60%, #5A827E 100%);
    color: #fff !important;
    box-shadow: none !important;
  
  }
`;

const OutlinedButton = styled(Button)`
  border: 2px solid #5A827E !important;
  color: #5A827E !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  font-size: 0.95rem !important;
  padding: 6px 16px !important;
  margin: 0.5rem 0 !important;
  background: #fff !important;
  min-height: 36px !important;
  &:hover {
    background: #e6f2ee !important;
    border-color: #1976d2 !important;
    color: #1976d2 !important;
  }
`;

const SectionTitle = styled(Typography)`
  color: #5A827E;
  font-weight: 700 !important;
  margin-bottom: 1.5rem !important;
  text-align: center;
`;

const CardTitle = styled(Typography)`
  color: #5A827E;
  font-weight: 700 !important;
  text-align: center;
`;

const CardDescription = styled(Typography)`
  color: #333;
  text-align: center;
  margin-bottom: 1rem !important;
`;

const StyledStack = styled(Stack)`
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

function EmployerDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  console.log('jobs', jobs);
  const [applicants, setApplicants] = useState<any[]>([]);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const profileData = await fetchMyProfile();
        setProfile(profileData);

        
        const jobResponse = await axiosInstance.get('/jobs/my');
        setJobs(jobResponse.data);

       
        let allApplicants: any[] = [];
        for (const job of jobResponse.data) {
          const appResponse = await fetchApplicantsByJobId(job._id);
          allApplicants = [...allApplicants, ...appResponse];
        }
        setApplicants(allApplicants);
      } catch (error) {
        console.error('❌ Failed to load employer dashboard data:', error);
      }
    };

    loadDashboard();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', py: 4, position: 'relative' }}>
      <PageBackground />
      <AppBar position="sticky" color="primary" sx={{ borderRadius: 0, boxShadow: 'none' , background: 'linear-gradient(135deg, #5A827E 0%, #84AE92 100%)'}}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            JobBoardX
          </Typography>
          <NavText onClick={() => navigate('/employer/post-job')}>
            Post Job
          </NavText>
          <NavText onClick={() => navigate('/employer/manage-jobs')}>
            Manage Jobs
          </NavText>
          <IconButton color="inherit" onClick={() => setShowProfile(true)}>
            <Avatar>{user.name?.[0] || 'E'}</Avatar>
          </IconButton>
          <NavText onClick={handleLogout}>
            Logout
          </NavText >
        </Toolbar>
      </AppBar>
      <SectionTitle variant="h4" mt={4} mb={2}>
        Employer Dashboard
      </SectionTitle>
      <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2} sx={{ color: '#5A827E' }}>
        Welcome, {user.name}!
      </Typography>

      <StyledContainer>
        <StyledStack direction="row" spacing={3} justifyContent="center">
          <StyledCard sx={{ flex: 1, minWidth: 250 }}>
            <CardContent>
              <CardTitle variant="h6">Hiring Optimization Tools</CardTitle>
              <CardDescription variant="body2">
                Use our tools to optimize your hiring process.
              </CardDescription>
              <StyledButton fullWidth onClick={() => navigate('/split')}>
                Open Interview Slot Optimizer
              </StyledButton>
              <OutlinedButton fullWidth onClick={() => navigate('/timeline')}>
                Hiring Timeline Calculator
              </OutlinedButton>
            </CardContent>
          </StyledCard>
          <StyledCard sx={{ flex: 1, minWidth: 250 }}>
            <CardContent>
              <CardTitle variant="h6">View Applicants</CardTitle>
              <CardDescription variant="body2">
                View all applicants for your job postings.
              </CardDescription>
              <StyledButton fullWidth onClick={() => navigate('/employer/applicants')}>
                View Applicants
              </StyledButton>
            </CardContent>
          </StyledCard>
        </StyledStack>

        <StyledStack direction="row" spacing={3} justifyContent="center" mt={3}>
          <StyledCard sx={{ flex: 1, minWidth: 250 }}>
            <CardContent>
              <CardTitle variant="h6">Post a Job</CardTitle>
              <CardDescription variant="body2">
                Create a new job listing.
              </CardDescription>
              <StyledButton fullWidth onClick={() => navigate('/employer/post-job')}>
                Post Job
              </StyledButton>
            </CardContent>
          </StyledCard>
          <StyledCard sx={{ flex: 1, minWidth: 250 }}>
            <CardContent>
              <CardTitle variant="h6">Manage Jobs</CardTitle>
              <CardDescription variant="body2">
                Edit or delete your job postings.
              </CardDescription>
              <StyledButton fullWidth onClick={() => navigate('/employer/manage-jobs')}>
                Manage Jobs
              </StyledButton>
            </CardContent>
          </StyledCard>
          <StyledCard sx={{ flex: 1, minWidth: 250 }}>
            <CardContent>
              <CardTitle variant="h6">HR Analytics</CardTitle>
              <CardDescription variant="body2">
                View employee feedback and optimize your posts.
              </CardDescription>
              <StyledButton fullWidth onClick={() => navigate('/dashboard/hr-analytics')}>
                Open Analytics
              </StyledButton>
            </CardContent>
          </StyledCard>
        </StyledStack>

        <StyledCard sx={{ mt: 4 }}>
          <CardContent>
            <CardTitle variant="h6">Recent Applicants 👥</CardTitle>
            <Stack spacing={2}>
              {applicants.length === 0 ? (
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  No applicants yet.
                </Typography>
              ) : (
                applicants.slice(0, 5).map((app, index) => (
                  <Box key={index} sx={{ border: '1px solid #ddd', p: 2, borderRadius: 2, background: '#fff' }}>
                    <Typography fontWeight="bold">{app.applicant?.name || 'Unknown'}</Typography>
                    <Typography variant="body2" color="text.secondary">{app.applicant?.email}</Typography>
                    <Typography variant="body2">Applied for: {app.job?.title}</Typography>
                    <Typography variant="caption" color="text.secondary">Status: {app.status}</Typography>
                  </Box>
                ))
              )}
            </Stack>
          </CardContent>
        </StyledCard>
      </StyledContainer>

      
      <Dialog open={showProfile} onClose={() => setShowProfile(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: 'black' ,backgroundColor: '#FAFFCA'}}>My Profile </DialogTitle>
        <DialogBackground dividers>
          <Stack spacing={2}>
            <Typography><strong>Name:</strong> {profile?.name || user.name}</Typography>
            <Typography><strong>Email:</strong> {profile?.email || user.email}</Typography>
            <Typography><strong>Role:</strong> {profile?.role || user.role}</Typography>
          </Stack>
        </DialogBackground>
      </Dialog>

      <Box
        component="footer"
        sx={{ mt: 6, py: 3, textAlign: 'center', backgroundColor: '#eee', borderTop: '1px solid #ccc' }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} JobBoardX • Empowering Recruiters Worldwide
        </Typography>
      </Box>
    </Box>
  );
}

export default EmployerDashboard;