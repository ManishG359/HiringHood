import { useEffect, useState } from 'react';
import {AppBar,Box,Toolbar,Typography,Button,IconButton,Container,Card,CardContent,Stack,Avatar,Dialog,DialogTitle,DialogContent,Link,CircularProgress,Menu,MenuItem,useMediaQuery} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; 
import { useTheme } from '@mui/material/styles'; 
import { useNavigate } from 'react-router-dom';
import { fetchMyProfile } from '../../services/profileService';
import { fetchRecentJobs } from '../../services/jobService';
import { fetchMyApplications } from '../../services/applicationService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
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

const StyledContainer = styled(Container)`
  max-width: 1200px !important;
  margin-top: 2rem;
`;

const StyledCard = styled(Card)`
  border-radius: 18px !important;
  box-shadow: 0 6px 24px 0 rgba(90, 130, 126, 0.12) !important;
  background: linear-gradient(135deg, #FAFFCA 0%, #B9D4AA 100%);
`;

const StyledButton = styled(Button)`
  background: linear-gradient(90deg, #5A827E 60%, #84AE92 100%);
  color: #fff !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  padding: 10px 24px !important;
  margin: 0.5rem 0 !important;
  box-shadow: none !important;
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
  padding: 10px 24px !important;
  margin: 0.5rem 0 !important;
  background: #fff !important;
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


const FlexRow = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const FlexCol = styled.div`
  flex: 1 1 0;
  min-width: 280px;
  max-width: 100%;

  @media (max-width: 900px) {
    min-width: 0;
  }
`;


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
      <PageBackground />
      <AppBar position="sticky" color="primary" sx={{ borderRadius: 0, boxShadow: 'none', background: 'linear-gradient(135deg, #5A827E 0%, #84AE92 100%)' }}>
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
        background: 'transparent',
        minHeight: '100vh', 
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2, md: 3 }
      }}>
        <StyledContainer>
          <Box sx={{ padding: 4 }} />
          <SectionTitle 
            variant="h4"
            fontWeight="bold"
            mb={{ xs: 2, sm: 3, md: 4 }}
            sx={{ 
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            Welcome back, {user?.name || 'User'} 👋
          </SectionTitle>

          <FlexRow>
            <FlexCol>
              <Stack spacing={{ xs: 2, sm: 3 }}>
                <StyledCard elevation={3}>
                  <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <CardTitle variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box component="span" mr={1}>📌</Box> Recent Jobs
                    </CardTitle>
                    <Stack spacing={2} sx={{ maxHeight: 'none', overflow: 'visible' }}>
                      {recentJobs.length === 0 ? (
                        <CardDescription variant="body2" color="text.secondary">
                          No recent jobs available.
                        </CardDescription>
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
                </StyledCard>  
              </Stack>
            </FlexCol>

            <FlexCol>
             
              <Stack spacing={{ xs: 2, sm: 3 }}>
                <StyledCard elevation={3}>
                  <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <CardTitle variant="h6" gutterBottom>
                      Application Overview
                    </CardTitle>
                    <Typography 
                      variant="h3" 
                      color="primary" 
                      fontWeight="bold"
                      sx={{ my: 1 }}
                    >
                      {applications.length}
                    </Typography>
                    <CardDescription variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Total jobs you've applied to. Keep exploring and applying!
                    </CardDescription>
                    <StyledButton
                      fullWidth
                      sx={{ mt: 1 }}
                      onClick={() => navigate('/applications')}
                    >
                      📄 View Applications
                    </StyledButton>
                  </CardContent>
                </StyledCard>

                <StyledCard elevation={3}>
                  <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <CardTitle variant="h6" gutterBottom>
                      Ready for Your Next Role?
                    </CardTitle>
                    <CardDescription variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Find jobs tailored to your profile and preferences.
                    </CardDescription>
                    <StyledButton
                      fullWidth
                      sx={{ mt: 1 }}
                      onClick={() => navigate('/jobs')}
                    >
                      🔍 Browse Jobs
                    </StyledButton>
                  </CardContent>
                </StyledCard>

                <StyledCard elevation={3} sx={{ height: 180 }}>
                  <CardContent sx={{ p: 1.5 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Status Breakdown
                    </Typography>
                    <Box height={120} sx={{ mt: 0.5 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={statusData}
                          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                        >
                          <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                          <YAxis tick={{ fontSize: 9 }} />
                          <Tooltip />
                          <Bar dataKey="value" fill="#1976d2" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </StyledCard>
              </Stack>
            </FlexCol>
            <FlexCol>
              <Stack spacing={{ xs: 2, sm: 3 }}>
                <StyledCard elevation={3}>
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
                        <CardTitle variant="h6">
                          👤 Profile Snapshot
                        </CardTitle>
                        <CardDescription variant="body2" color="text.secondary">
                          Your professional overview
                        </CardDescription>
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
                          <OutlinedButton
                            size="small"
                            onClick={() => navigate('/profile')}
                            sx={{ borderRadius: 1.5, ml: 1 }}
                          >
                            Update Profile
                          </OutlinedButton>
                        </Box>
                      </Stack>
                    ) : (
                      <>
                        <CardDescription variant="body2" color="text.secondary" sx={{ my: 2 }}>
                          You haven't set up your profile yet. Complete your profile to stand out to employers.
                        </CardDescription>
                        <StyledButton
                          fullWidth
                          sx={{ mt: 1 }}
                          onClick={() => navigate('/profile')}
                        >
                          Create Profile
                        </StyledButton>
                      </>
                    )}
                  </CardContent>
                </StyledCard>
                
                <StyledCard elevation={3}>
                  <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <CardTitle variant="h6" gutterBottom>
                      Quick Actions
                    </CardTitle>
                    <Stack spacing={1.5} sx={{ mt: 2 }}>
                      <OutlinedButton 
                        fullWidth 
                        sx={{ justifyContent: 'flex-start', py: 1, borderRadius: 1.5 }}
                        onClick={() => navigate('/jobs/saved')}
                      >
                        ⭐ Saved Jobs
                      </OutlinedButton>
                      <OutlinedButton 
                        fullWidth 
                        sx={{ justifyContent: 'flex-start', py: 1, borderRadius: 1.5 }}
                        onClick={() => navigate('/profile/settings')}
                      >
                        ⚙️ Account Settings
                      </OutlinedButton>
                      <OutlinedButton 
                        fullWidth 
                        sx={{ justifyContent: 'flex-start', py: 1, borderRadius: 1.5 }}
                        onClick={() => navigate('/support')}
                      >
                        📞 Support
                      </OutlinedButton>
                    </Stack>
                  </CardContent>
                </StyledCard>
              </Stack>
            </FlexCol>
          </FlexRow>
        </StyledContainer>
      </Box>
      <Dialog open={showProfile} onClose={() => setShowProfile(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: 'black', backgroundColor: '#FAFFCA' }}>My Profile</DialogTitle>
        <DialogContent dividers sx={{ background: 'linear-gradient(120deg, #FAFFCA 0%, #B9D4AA 40%, #84AE92 100%)' }}>
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
