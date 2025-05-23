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
  CircularProgress,
  Menu,
  MenuItem,
  useMediaQuery
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu'; 
import { useTheme } from '@mui/material/styles'; 
import { useNavigate } from 'react-router-dom';
import { fetchMyProfile } from '../../services/profileService';
import { fetchRecentJobs } from '../../services/jobService';
import { fetchMyApplications } from '../../services/applicationService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Grid from '@mui/material/Grid';

function Dashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 
  const [profile, setProfile] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    // Fetch the latest user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(storedUser);

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
          {isMobile ? (
            <>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => { handleMenuClose(); navigate('/jobs'); }}>
                  Browse Jobs
                </MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); navigate('/applications'); }}>
                  My Applications
                </MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); setShowProfile(true); }}>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
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
            </>
          )}
        </Toolbar>
      </AppBar>
      <Box sx={{ 
        backgroundColor: '#f5f5f5', 
        minHeight: '100vh', 
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2, md: 3 }
      }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            mb={{ xs: 2, sm: 3, md: 4 }}
            sx={{ 
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            Welcome back, {user?.fullName || 'User'} 👋
          </Typography>

          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {/* Left Column - Recent Jobs */}
            <Grid size={{xs:12,sm:6,md:4}}>
              <Stack spacing={{ xs: 2, sm: 3 }}>
                {/* 📌 Recent Jobs Card */}
                <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                  <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box component="span" mr={1}>📌</Box> Recent Jobs
                    </Typography>
                    <Stack spacing={2} sx={{ maxHeight: 'none', overflow: 'visible' }}>
                      {recentJobs.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                          No recent jobs available.
                        </Typography>
                      ) : (
                        recentJobs.slice(0, 7).map((job) => ( 
                          <Box
                            key={job._id}
                            sx={{
                              border: '1px solid #e0e0e0',
                              borderRadius: 2,
                              p: { xs: 1.5, md: 2 },
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              '&:hover': { 
                                backgroundColor: '#f9f9f9',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
                              }
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
              </Stack>
            </Grid>

            {/* Middle Column - Application Stats */}
            <Grid size={{xs:12,sm:6,md:4}}>
              <Stack spacing={{ xs: 2, sm: 3 }}>
                {/* App Count + View Applications */}
                <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                  <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Application Overview
                    </Typography>
                    <Typography 
                      variant="h3" 
                      color="primary" 
                      fontWeight="bold"
                      sx={{ my: 1 }}
                    >
                      {applications.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Total jobs you've applied to. Keep exploring and applying!
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ 
                        mt: 1, 
                        py: 1,
                        borderRadius: 1.5,
                        fontWeight: 'medium'
                      }}
                      onClick={() => navigate('/applications')}
                    >
                      📄 View Applications
                    </Button>
                  </CardContent>
                </Card>

                {/* 🔍 Browse Jobs CTA */}
                <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                  <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Ready for Your Next Role?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Find jobs tailored to your profile and preferences.
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ 
                        mt: 1, 
                        py: 1,
                        borderRadius: 1.5,
                        fontWeight: 'medium'
                      }}
                      onClick={() => navigate('/jobs')}
                    >
                      🔍 Browse Jobs
                    </Button>
                  </CardContent>
                </Card>

                {/* Status Chart */}
                <Card elevation={3} sx={{ height: 180, borderRadius: 2, overflow: 'hidden' }}>
                  <CardContent sx={{ p: 1.5 }}> {/* Smaller padding */}
                    <Typography variant="subtitle1" fontWeight="bold"> {/* Smaller text */}
                      Status Breakdown
                    </Typography>
                    <Box height={120} sx={{ mt: 0.5 }}> {/* Reduced height */}
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={statusData}
                          margin={{ top: 0, right: 0, bottom: 0, left: 0 }} // Remove extra margin
                        >
                          <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                          <YAxis tick={{ fontSize: 9 }} />
                          <Tooltip />
                          <Bar dataKey="value" fill="#1976d2" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
            
            {/* Right Column - Profile */}
            <Grid size={{xs:12,sm:6,md:4}}>
              <Stack spacing={{ xs: 2, sm: 3 }}>
                {/* Profile Snapshot Card */}
                <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                  <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        sx={{ 
                          width: 60, 
                          height: 60, 
                          bgcolor: 'primary.main',
                          mr: 2
                        }}
                      >
                        {user?.fullName?.[0] || 'U'}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          👤 Profile Snapshot
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Your professional overview
                        </Typography>
                      </Box>
                    </Box>
                    
                    {profile?.profile ? (
                      <Stack spacing={1.5}>
                        <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <strong>Full Name:</strong> 
                          <Box component="span" sx={{ maxWidth: '60%', textAlign: 'right' }}>{profile.profile.fullName}</Box>
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <strong>Experience:</strong> 
                          <Box component="span" sx={{ maxWidth: '60%', textAlign: 'right' }}>{profile.profile.experience}</Box>
                        </Typography>
                        <Typography variant="body2">
                          <strong>Skills:</strong>
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: 0.75,
                          mt: 0.5
                        }}>
                          {profile.profile.skills?.map((skill: string, index: number) => (
                            <Box 
                              key={index}
                              sx={{
                                bgcolor: 'rgba(25, 118, 210, 0.08)',
                                color: 'primary.main',
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                fontSize: '0.75rem',
                              }}
                            >
                              {skill}
                            </Box>
                          ))}
                        </Box>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Bio:</strong> 
                          <Box component="span" sx={{ 
                            display: 'block', 
                            mt: 0.5,
                            color: 'text.secondary',
                            fontSize: '0.875rem',
                            maxHeight: '4.5rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {profile.profile.bio}
                          </Box>
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center', 
                          mt: 1.5
                        }}>
                          <Link 
                            href={profile.profile.resumeLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              color: 'primary.main',
                              textDecoration: 'none',
                              '&:hover': { textDecoration: 'underline' }
                            }}
                          >
                            📄 View Resume
                          </Link>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => navigate('/profile')}
                            sx={{ borderRadius: 1.5 }}
                          >
                            Update Profile
                          </Button>
                        </Box>
                      </Stack>
                    ) : (
                      <>
                        <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
                          You haven't set up your profile yet. Complete your profile to stand out to employers.
                        </Typography>
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{ 
                            mt: 1, 
                            py: 1,
                            borderRadius: 1.5,
                            fontWeight: 'medium'
                          }}
                          onClick={() => navigate('/profile')}
                        >
                          Create Profile
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
                
                {/* Quick Links Card */}
                <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                  <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Quick Actions
                    </Typography>
                    <Stack spacing={1.5} sx={{ mt: 2 }}>
                      <Button 
                        variant="outlined" 
                        fullWidth 
                        sx={{ justifyContent: 'flex-start', py: 1, borderRadius: 1.5 }}
                        onClick={() => navigate('/jobs/saved')}
                      >
                        ⭐ Saved Jobs
                      </Button>
                      <Button 
                        variant="outlined" 
                        fullWidth 
                        sx={{ justifyContent: 'flex-start', py: 1, borderRadius: 1.5 }}
                        onClick={() => navigate('/profile/settings')}
                      >
                        ⚙️ Account Settings
                      </Button>
                      <Button 
                        variant="outlined" 
                        fullWidth 
                        sx={{ justifyContent: 'flex-start', py: 1, borderRadius: 1.5 }}
                        onClick={() => navigate('/support')}
                      >
                        📞 Support
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Profile Dialog */}
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
