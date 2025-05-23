
import {AppBar,Avatar,Box,Button,Card,CardContent,Container,
  Dialog,DialogContent,DialogTitle,IconButton,Stack,Toolbar,Typography
}from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMyProfile } from '../../services/profileService';
import { fetchApplicantsByJobId } from '../../services/applicationService';
import axiosInstance from '../../services/axiosInstance';
import Grid from '@mui/material/Grid';

function EmployerDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  console.log(profile);
  const [showProfile, setShowProfile] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  console.log(jobs);
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

        // Get only jobs created by this employer
        const jobResponse = await axiosInstance.get('/jobs/my');
        setJobs(jobResponse.data);

        // Get applicants for those jobs
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
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            JobBoardX
          </Typography>
          <Button color="inherit" onClick={() => navigate('/employer/post-job')}>
            Post Job
          </Button>
          <Button color="inherit" onClick={() => navigate('/employer/manage-jobs')}>
            Manage Jobs
          </Button>
          <IconButton color="inherit" onClick={() => setShowProfile(true)}>
            <Avatar>{user.name?.[0] || 'E'}</Avatar>
          </IconButton>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2} mt={4}>
          Welcome, {user.name}!
        </Typography>

      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
          Employer Dashboard 
        </Typography>
       

      
        <Grid container spacing={3} >
         <Grid size={{xs:12 ,md:4}}>
         <Card elevation={4}>
    <CardContent>
      <Typography variant="h6" fontWeight="bold" gutterBottom sx ={{textAlign: 'center'}}>
        View Applicants
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2} sx ={{textAlign: 'center'}}>
        View all applicants for your job postings.
      </Typography>
      <Button fullWidth variant="contained" onClick={() => navigate('/employer/applicants')}
      >
        View Applicants
      </Button>
    </CardContent>
  </Card>
    </Grid>
             {/* Main Dashboard Actions */}
          <Grid size={{xs:12, md:8}}>
            <Grid container spacing={3}>
              <Grid size={{xs:12, sm:6}}>
                <Card elevation={4}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx ={{textAlign: 'center'}}>
                      Post a Job
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx ={{textAlign: 'center'}}>
                      Create a new job listing.
                    </Typography>
                    <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/employer/post-job')}>
                      Post Job
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{xs:12, sm:6}}>
                <Card elevation={4}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx ={{textAlign: 'center'}}>
                      Manage Jobs
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx ={{textAlign: 'center'}}>
                      Edit or delete your job postings.
                    </Typography>
                    <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/employer/manage-jobs')}>
                      Manage Jobs
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Recent Applicants */}
          <Grid size={{xs:12}}>
            <Card elevation={4}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Recent Applicants 👥
                </Typography>
                <Stack spacing={2}>
                  {applicants.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">No applicants yet.</Typography>
                  ) : (
                    applicants.slice(0, 5).map((app, index) => (
                      <Box key={index} sx={{ border: '1px solid #ddd', p: 2, borderRadius: 2 }}>
                        <Typography fontWeight="bold">{app.applicant?.name || 'Unknown'}</Typography>
                        <Typography variant="body2" color="text.secondary">{app.applicant?.email}</Typography>
                        <Typography variant="body2">Applied for: {app.job?.title}</Typography>
                        <Typography variant="caption" color="text.secondary">Status: {app.status}</Typography>
                      </Box>
                    ))
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Dialog open={showProfile} onClose={() => setShowProfile(false)} maxWidth="sm" fullWidth>
        <DialogTitle>My Profile</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography><strong>Name:</strong> {user.name}</Typography>
            <Typography><strong>Email:</strong> {user.email}</Typography>
            <Typography><strong>Role:</strong> {user.role}</Typography>
          </Stack>
        </DialogContent>
      </Dialog>
              
        <Grid size={{xs:12,sm:6}}sx={{
            width: { xs: '100%', sm: '80%' },
            justifyContent: 'center',
            mx: 'auto',
          }}
        >
      <Card elevation={4} sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx ={{textAlign: 'center'}}>
            HR Analytics
          </Typography>
          <Typography variant="body2" color="text.secondary" sx ={{textAlign: 'center'}}>
            View employee feedback and optimize your job posts.
          </Typography>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => navigate('/dashboard/hr-analytics')}
          >
            Open Analytics
          </Button>
        </CardContent>
      </Card>
        </Grid>
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
