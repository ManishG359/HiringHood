import { useEffect, useState } from 'react';
import { Container, Typography, Box, CardContent, Stack, CircularProgress, Link, Snackbar, Chip } from '@mui/material';
import BackToDashboardButton from '../../components/BackToSeekerDashboard';
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

const StyledCard = styled.div`
  border-radius: 18px;
  box-shadow: 0 6px 24px 0 rgba(90, 130, 126, 0.12);
  background: linear-gradient(135deg, #FAFFCA 0%, #B9D4AA 100%);
  min-height: 180px;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: box-shadow 0.2s;
  padding: 0;
`;


const OutlinedButton = styled.button`
  border: 2px solid #5A827E;
  color: #5A827E;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 6px 16px;
  margin: 0.5rem 0;
  background: #fff;
  min-height: 36px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #e6f2ee;
    border-color: #1976d2;
    color: #1976d2;
  }
`;

interface Application {
  _id: string;
  job: {
    company: string;
    _id: string;
    title: string;
    companyName: string;
    location?: string;
    type?: string;
  };
  status: string;
  resumeLink: string;
  createdAt: string;
}

function MyApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  const handleWithdraw = async (id: string) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      try {
        const { withdrawApplication } = await import('../../services/applicationService');
        await withdrawApplication(id);
        setApplications(prev => prev.filter(app => app._id !== id)); 
        setSnackbarOpen(true); 
      } catch (error) {
        console.error('❌ Failed to withdraw application:', error);
      }
    }
  };

  useEffect(() => {
    const getApplications = async () => {
      try {
        const { fetchMyApplications } = await import('../../services/applicationService');
        const data = await fetchMyApplications();
        setApplications(data);
      } catch (error) {
        console.error('❌ Failed to fetch applications', error);
      } finally {
        setLoading(false);
      }
    };

    getApplications();
  }, []);

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
      <Container maxWidth="md" sx={{ mt: 6, position: 'relative', zIndex: 1 }}>
        <BackToDashboardButton />
        <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center" sx={{ color: '#5A827E' }}>
          My Applications 
        </Typography>

        <Stack spacing={3}>
          {applications.length === 0 ? (
            <Typography variant="h6" color="text.secondary" textAlign="center">
              You haven't applied to any jobs yet!
            </Typography>
          ) : (
            applications.map((app) => (
              <StyledCard key={app._id}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#5A827E' }}>
                    {app.job?.title || 'Job Title Unavailable'}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {app.job?.company || 'Company Unavailable'}
                  </Typography>
                  <Box mt={1}>
                    <Chip
                      label={app.status}
                      color={
                        app.status === 'Under Review'
                          ? 'info'
                          : app.status === 'Shortlisted'
                          ? 'success'
                          : app.status === 'Rejected'
                          ? 'error'
                          : app.status === 'Hired'
                          ? 'secondary'
                          : 'default'
                      }
                      variant="filled"
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Applied on: {new Date(app.createdAt).toLocaleDateString()}
                  </Typography>

                  <Box mt={2}>
                    <Link
                      href={app.resumeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                      sx={{ color: '#5A827E', fontWeight: 500 }}
                    >
                      View Resume
                    </Link>
                  </Box>

                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <OutlinedButton
                      onClick={() => handleWithdraw(app._id)}
                      style={{ fontSize: '0.9rem', padding: '4px 14px' }}
                    >
                      Withdraw
                    </OutlinedButton>
                  </Box>
                </CardContent>
              </StyledCard>
            ))
          )}
        </Stack>

        {/* Success Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Box
            sx={{
              backgroundColor: '#4caf50',
              color: '#fff',
              padding: '16px',
              borderRadius: '8px',
              fontSize: '1.2rem',
              textAlign: 'center',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
            }}
          >
            ✅ Application withdrawn successfully!
          </Box>
        </Snackbar>
      </Container>
    </>
  );
}

export default MyApplications;