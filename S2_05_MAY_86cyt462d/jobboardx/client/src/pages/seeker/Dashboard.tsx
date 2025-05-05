import { useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Container,
  Card,
  CardContent,
  Stack,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  Link,
  CircularProgress
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { fetchMyProfile } from '../../services/profileService';
import { fetchRecentJobs } from '../../services/jobService';
import { fetchMyApplications } from '../../services/applicationService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Grid from '@mui/material/GridLegacy'

function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [p, a, j] = await Promise.all([
          fetchMyProfile(),
          fetchMyApplications(),
          fetchRecentJobs()
        ]);
        setProfile(p);
        setApplications(a);
        setRecentJobs(j);
      } catch (err) {
        console.error('❌ Dashboard load failed', err);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  const statusData = [
    { name: 'Submitted', value: applications.filter(a => a.status === 'Submitted').length },
    { name: 'Under Review', value: applications.filter(a => a.status === 'Under Review').length },
    { name: 'Shortlisted', value: applications.filter(a => a.status === 'Shortlisted').length },
    { name: 'Rejected', value: applications.filter(a => a.status === 'Rejected').length },
    { name: 'Hired', value: applications.filter(a => a.status === 'Hired').length },
  ];

  if (loading) {
    return (
      <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
     <AppBar position="static" color="primary">
  <Toolbar>
    <Typography variant="h6" sx={{ flexGrow: 1 }}>
      JobBoardX
    </Typography>
    <Button color="inherit" onClick={() => navigate('/jobs')}>
      Browse Jobs
    </Button>
    <Button color="inherit" onClick={() => navigate('/applications')}>
      My Applications
    </Button>
    
    <IconButton color="inherit" onClick={() => setShowProfile(true)}>
        <Avatar sx={{ bgcolor: 'secondary.main' }}>
          {profile?.name?.[0] || 'U'}
        </Avatar>
      </IconButton>

    <Button color="inherit" onClick={handleLogout}>
      Logout
    </Button>
  </Toolbar>
</AppBar>
      <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
  <Container maxWidth="lg">

        <Typography variant="h4" fontWeight="bold" mb={4}>
          Welcome back, {profile?.name?.split(' ')[0]} 👋
        </Typography>

        <Grid container spacing={4}>
          {/* Left Column - Recent Jobs */}
          <Grid item xs={12} md={4}>
  <Stack spacing={3}>
    {/* 📌 Recent Jobs Card */}
          <Card elevation={4}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                📌 Recent Jobs
              </Typography>
              <Stack spacing={2}>
                {recentJobs.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No recent jobs available.
                  </Typography>
                ) : (
                  recentJobs.slice(0, 6).map((job) => (
                    <Box
                      key={job._id}
                      sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: 2,
                        p: 1.5,
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: '#f9f9f9' }
                      }}
                      onClick={() => navigate(`/jobs/${job._id}`)}
                    >
                      <Typography fontWeight="medium">{job.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {job.company} • {job.location}
                      </Typography>
                    </Box>
                  ))
                )}
              </Stack>
            </CardContent>
          </Card>
          {/* 🔍 Browse Jobs CTA */}
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Ready for Your Next Role?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Find jobs tailored to your profile and preferences.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate('/jobs')}
              >
                🔍 Browse Jobs
              </Button>
            </CardContent>
          </Card>
        </Stack>
      </Grid>

          {/* Right Column - Cards */}
          <Grid item xs={12} md={8} >
            <Stack spacing={3}>
              {/* App Count + Browse Jobs */}
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Application Overview
                  </Typography>
                  <Typography variant="h3" color="primary" fontWeight="bold">
                    {applications.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total jobs you’ve applied to. Keep exploring and applying!
                  </Typography>
                  <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/applications')}
                >
                  📄 View Applications
                </Button>
                </CardContent>
              </Card>

              {/* Status Chart */}
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Status Breakdown
                  </Typography>
                  <Box height={200}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={statusData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#1976d2" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
              {/* Profile Snapshot */}
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    👤 Profile Snapshot
                  </Typography>
                  {profile?.profile ? (
                    <Stack spacing={1}>
                      <Typography variant="body2"><strong>Full Name:</strong> {profile.profile.fullName}</Typography>
                      <Typography variant="body2"><strong>Experience:</strong> {profile.profile.experience}</Typography>
                      <Typography variant="body2"><strong>Skills:</strong> {profile.profile.skills?.join(', ')}</Typography>
                      <Typography variant="body2"><strong>Bio:</strong> {profile.profile.bio}</Typography>
                      <Typography variant="body2">
                        <strong>Resume:</strong>{' '}
                        <Link href={profile.profile.resumeLink} target="_blank" rel="noopener noreferrer">
                          View
                        </Link>
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mt: 2, alignSelf: 'flex-start' }}
                        onClick={() => navigate('/profile')}
                      >
                        Update Profile
                      </Button>
                    </Stack>
                  ) : (
                    <>
                      <Typography variant="body2" color="text.secondary">
                        You haven't set up your profile yet.
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ mt: 2 }}
                        onClick={() => navigate('/profile')}
                      >
                        Create Profile
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>
      </Box>

      {/* Profile Avatar */}
      
      <Dialog open={showProfile} onClose={() => setShowProfile(false)} maxWidth="sm" fullWidth>
        <DialogTitle>My Profile</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography><strong>Name:</strong> {profile?.name}</Typography>
            <Typography><strong>Email:</strong> {profile?.email}</Typography>
            <Typography><strong>Role:</strong> {profile?.role}</Typography>
            <Typography><strong>Joined:</strong> {new Date(profile?.date).toLocaleDateString()}</Typography>
            {profile?.profile && (
              <>
                <Typography><strong>Full Name:</strong> {profile.profile.fullName}</Typography>
                <Typography><strong>Bio:</strong> {profile.profile.bio}</Typography>
                <Typography><strong>Experience:</strong> {profile.profile.experience}</Typography>
                <Typography><strong>Skills:</strong> {profile.profile.skills?.join(', ')}</Typography>
                <Typography>
                  <strong>Resume:</strong>{' '}
                  <Link href={profile.profile.resumeLink} target="_blank" rel="noopener noreferrer">
                    View Resume
                  </Link>
                </Typography>
              </>
            )}
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          mt: 8,
          py: 3,
          backgroundColor: '#f1f1f1',
          textAlign: 'center',
          borderTop: '1px solid #ccc',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} JobBoardX. All rights reserved.
        </Typography>
      </Box>
    </>
  );
}

export default Dashboard;
