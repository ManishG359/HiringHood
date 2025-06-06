import styled from 'styled-components';
import {AppBar,Box,Toolbar,Typography,Button,Container,Card,CardContent,Stack,Link} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';

const PageBackground = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(120deg, #FAFFCA 0%, #B9D4AA 40%, #84AE92 100%);
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
`;

const StyledCard = styled(Card)`
  border-radius: 18px !important;
  box-shadow: 0 6px 24px 0 rgba(90, 130, 126, 0.12) !important;
  background: #FAFFCA !important;
`;

const StyledButton = styled(Button)`
  background: linear-gradient(90deg, #5A827E 60%, #84AE92 100%);
  color: #FAFFCA !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  padding: 8px 20px !important;
  margin: 0.5rem 0 !important;
  box-shadow: none !important;
  &:hover {
    background: linear-gradient(90deg, #84AE92 60%, #5A827E 100%);
    color: #5A827E !important;
    box-shadow: none !important;
  }
`;

const SectionTitle = styled(Typography)`
  color: #5A827E;
  font-weight: 700 !important;
  margin-bottom: 1.5rem !important;
  text-align: center;
`;

const FooterBackground = styled.div`
  background: linear-gradient(135deg, #5A827E 0%, #84AE92 100%);
  color: #FAFFCA;
  padding: 3rem 0 2rem 0;
`;

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
    <Box sx={{ minHeight: '100vh', bgcolor: '#B9D4AA', position: 'relative' }}>
      <PageBackground />
      <AppBar position="sticky" color="primary" elevation={3} sx={{ background: 'linear-gradient(135deg, #5A827E 0%, #84AE92 100%)', boxShadow: 'none' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#FAFFCA' }}>
            JobBoardX
          </Typography>
          <StyledButton onClick={() => navigate('/login')}>Login</StyledButton>
          <StyledButton onClick={() => navigate('/register')}>Register</StyledButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <StyledCard sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#5A827E' }}>
              Find the Perfect Job or Hire Top Talent
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, color: '#84AE92' }}>
              JobBoardX helps bridge the gap between passionate professionals and great companies.
            </Typography>
            <Grid container spacing={3}>
              <Grid sx={{xs:12,md:6}} >
                <Card variant="outlined" sx={{ background: '#FAFFCA', borderColor: '#84AE92' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: '#5A827E' }} gutterBottom>
                      I'm an Employer
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: '#84AE92' }}>
                      Find qualified candidates quickly and efficiently.
                    </Typography>
                    <StyledButton
                      onClick={() => navigate('/login')}
                    >
                      Go to Employer Dashboard
                    </StyledButton>
                  </CardContent>
                </Card>
              </Grid>
              <Grid sx={{xs:12,md:6,alignContent: 'center'}}>
                <Card variant="outlined" sx={{ background: '#FAFFCA', borderColor: '#84AE92' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: '#5A827E' }} gutterBottom>
                      I'm a Job Seeker
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: '#84AE92' }}>
                      Browse job listings and apply with ease.
                    </Typography>
                    <StyledButton
                      onClick={() => navigate('/login')}
                    >
                      Go to Seeker Dashboard
                    </StyledButton>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </StyledCard>

        <StyledCard sx={{ mb: 4 }}>
          <CardContent>
            <SectionTitle variant="h5" gutterBottom>
              Why Choose JobBoardX?
            </SectionTitle>
            <Typography variant="body2" sx={{ mb: 3, color: '#84AE92' }}>
              Powerful features tailored for seamless hiring and job seeking
            </Typography>
            <Grid container spacing={3}>
              {features.map((feature, idx) => (
                <Grid sx={{xs:12,md:4}} key={idx}>
                  <Card variant="outlined" sx={{ height: '100%', background: '#FAFFCA', borderColor: '#84AE92' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: '#5A827E' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#84AE92' }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </StyledCard>

        <StyledCard sx={{ mb: 4 }}>
          <CardContent>
            <SectionTitle variant="h5" gutterBottom>
              What Our Users Say
            </SectionTitle>
            <Grid container spacing={3}>
              {testimonials.map((t, idx) => (
                <Grid sx={{xs:12,md:4}} key={idx}>
                  <Card variant="outlined" sx={{ background: '#FAFFCA', borderColor: '#84AE92' }}>
                    <CardContent>
                      <Typography variant="body2" fontStyle="italic" sx={{ color: '#84AE92' }} gutterBottom>
                        "{t.quote}"
                      </Typography>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#5A827E' }}>
                        {t.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#B9D4AA' }}>
                        {t.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </StyledCard>

        <StyledCard sx={{ mb: 4, bgcolor: '#5A827E !important', color: '#FAFFCA !important', background: 'linear-gradient(90deg, #5A827E 60%, #84AE92 100%) !important' }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#FAFFCA' }}>
              Ready to Get Started?
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#FAFFCA' }}>
              Join JobBoardX today and take the next step in your career or hiring journey.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <StyledButton
                sx={{ background: 'linear-gradient(90deg, #84AE92 60%, #5A827E 100%) !important', color: '#FAFFCA !important' }}
                onClick={() => navigate('/register')}
              >
                Join as Employer
              </StyledButton>
              <StyledButton
                sx={{ background: 'linear-gradient(90deg, #84AE92 60%, #5A827E 100%) !important', color: '#FAFFCA !important' }}
                onClick={() => navigate('/register')}
              >
                Join as Job Seeker
              </StyledButton>
            </Stack>
          </CardContent>
        </StyledCard>
      </Container>

      <FooterBackground>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid sx={{xs:12,md:12}}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: '#FAFFCA' }}>
                About JobBoardX
              </Typography>
              <Typography variant="body2" sx={{ color: '#B9D4AA' }}>
                JobBoardX connects talent with top companies using smart technology.
              </Typography>
            </Grid>
            <Grid sx={{xs:12,md:4}}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: '#FAFFCA' }}>
                Quick Links
              </Typography>
              <Stack spacing={1}>
                <Link href="#" underline="hover" sx={{ color: '#FAFFCA' }}>Home</Link>
                <Link href="#" underline="hover" sx={{ color: '#FAFFCA' }}>Jobs</Link>
                <Link href="#" underline="hover" sx={{ color: '#FAFFCA' }}>Employers</Link>
                <Link href="#" underline="hover" sx={{ color: '#FAFFCA' }}>Contact</Link>
              </Stack>
            </Grid>
            <Grid sx={{xs:12,md:4}}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: '#FAFFCA' }}>
                Follow Us
              </Typography>
              <Stack direction="row" spacing={2}>
                <Link href="#" underline="hover" sx={{ color: '#FAFFCA' }}>Twitter</Link>
                <Link href="#" underline="hover" sx={{ color: '#FAFFCA' }}>LinkedIn</Link>
                <Link href="#" underline="hover" sx={{ color: '#FAFFCA' }}>Facebook</Link>
              </Stack>
            </Grid>
          </Grid>
          <Box mt={4} textAlign="center">
            <Typography variant="caption" sx={{ color: '#FAFFCA' }}>
              © {new Date().getFullYear()} JobBoardX. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </FooterBackground>
    </Box>
  );
}

export default LandingPage;