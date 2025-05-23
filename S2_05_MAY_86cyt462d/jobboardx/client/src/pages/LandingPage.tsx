import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button,
    Container,
    Card,
    CardContent,
    Stack,
    Link,
  } from '@mui/material';
  import { useNavigate } from 'react-router-dom';
  import Grid from '@mui/material/GridLegacy';
  function LandingPage() {
    const navigate = useNavigate();
  
    const features = [
      { title: 'Smart Matching', description: 'Our algorithms match the best candidates with your job listings.' },
      { title: 'Real-Time Alerts', description: 'Stay updated with notifications on new jobs or applicants.' },
      { title: 'Detailed Analytics', description: 'Track performance and engagement with built-in analytics.' },
    ];
  
    const testimonials = [
      { name: 'Alice Johnson', quote: 'JobBoardX helped me land my dream job within a week!', title: 'Software Engineer' },
      { name: 'Mike Smith', quote: 'The hiring process became so much faster and easier.', title: 'HR Manager' },
      { name: 'Sarah Lee', quote: 'Intuitive design and great features. Highly recommended!', title: 'Marketing Director' },
    ];
  
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
        {/* Navbar */}
        <AppBar position="sticky" color="primary" elevation={3}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              JobBoardX
            </Typography>
            <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
            <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
          </Toolbar>
        </AppBar>
  
        <Container maxWidth="lg" sx={{ py: 6 }}>
          {/* Hero Section */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Find the Perfect Job or Hire Top Talent
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                JobBoardX helps bridge the gap between passionate professionals and great companies.
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                        I'm an Employer
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Find qualified candidates quickly and efficiently.
                      </Typography>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => {
                          const user = JSON.parse(localStorage.getItem('user') || '{}');
                          if (user?.role === 'employer') {
                            navigate('/employer/dashboard');
                          } else if (user?.role === 'seeker') {
                            alert('You are a Job Seeker. Please use the Job Seeker Dashboard.');
                            navigate('/seeker/dashboard');
                          } else {
                            navigate('/login');
                          }
                        }}
                      >
                        Go to Employer Dashboard
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" color="success.main" gutterBottom>
                        I'm a Job Seeker
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Browse job listings and apply with ease.
                      </Typography>
                      <Button
                    fullWidth
                    variant="contained"
                    onClick={() => {
                      const user = JSON.parse(localStorage.getItem('user') || '{}');
                      if (user?.role === 'employer') {
                        navigate('/employer/dashboard');
                      } else if (user?.role === 'seeker') {
                        alert('You are a Job Seeker. Please use the Job Seeker Dashboard.');
                        navigate('/seeker/dashboard');
                      } else {
                        navigate('/login');
                      }
                    }}
                  >
                    Go to Employer Dashboard
                  </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
  
          {/* Features Section */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                Why Choose JobBoardX?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Powerful features tailored for seamless hiring and job seeking
              </Typography>
              <Grid container spacing={3}>
                {features.map((feature, idx) => (
                  <Grid item xs={12} md={4} key={idx}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
  
          {/* Testimonials Section */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                What Our Users Say
              </Typography>
              <Grid container spacing={3}>
                {testimonials.map((t, idx) => (
                  <Grid item xs={12} md={4} key={idx}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="body2" fontStyle="italic" color="text.secondary" gutterBottom>
                          "{t.quote}"
                        </Typography>
                        <Typography variant="subtitle1" fontWeight="bold" color="primary">
                          {t.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t.title}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
  
          {/* Call to Action */}
          <Card sx={{ mb: 4, bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Ready to Get Started?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Join JobBoardX today and take the next step in your career or hiring journey.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button variant="contained" sx={{ bgcolor: 'white', color: 'primary.main' }} onClick={() => navigate('/register')}>
                  Join as Employer
                </Button>
                <Button variant="contained" sx={{ bgcolor: 'white', color: 'primary.main' }} onClick={() => navigate('/register')}>
                  Join as Job Seeker
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Container>
  
        {/* Footer */}
        <Box sx={{ bgcolor: '#0d47a1', color: 'white', py: 4 }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  About JobBoardX
                </Typography>
                <Typography variant="body2">
                  JobBoardX connects talent with top companies using smart technology.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Quick Links
                </Typography>
                <Stack spacing={1}>
                  <Link href="#" underline="hover" color="inherit">Home</Link>
                  <Link href="#" underline="hover" color="inherit">Jobs</Link>
                  <Link href="#" underline="hover" color="inherit">Employers</Link>
                  <Link href="#" underline="hover" color="inherit">Contact</Link>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Follow Us
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Link href="#" underline="hover" color="inherit">Twitter</Link>
                  <Link href="#" underline="hover" color="inherit">LinkedIn</Link>
                  <Link href="#" underline="hover" color="inherit">Facebook</Link>
                </Stack>
              </Grid>
            </Grid>
            <Box mt={4} textAlign="center">
              <Typography variant="caption">
                © {new Date().getFullYear()} JobBoardX. All rights reserved.
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
    );
  }
  
  export default LandingPage;
  