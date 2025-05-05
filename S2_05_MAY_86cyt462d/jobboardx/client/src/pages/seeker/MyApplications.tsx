import { useEffect, useState } from 'react';
import { Container, Typography, Box, Card, CardContent, Button, Stack, CircularProgress, Link, Snackbar } from '@mui/material';
import { fetchMyApplications, withdrawApplication } from '../../services/applicationService';
import { Chip } from '@mui/material';
import BackToDashboardButton from '../../components/BackToSeekerDashboard';
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
        await withdrawApplication(id);
        setApplications(prev => prev.filter(app => app._id !== id)); // Remove from UI
        setSnackbarOpen(true); // Show success message
      } catch (error) {
        console.error('❌ Failed to withdraw application:', error);
      }
    }
  };

  useEffect(() => {
    const getApplications = async () => {
      try {
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
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <BackToDashboardButton />
      <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">
        My Applications 📄
      </Typography>

      <Stack spacing={3}>
        {applications.length === 0 ? (
          <Typography variant="h6" color="text.secondary" textAlign="center">
            You haven't applied to any jobs yet!
          </Typography>
        ) : (
          applications.map((app) => (
            

            <Card key={app._id} elevation={4} sx={{ borderRadius: 4 }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
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
                  <Link href={app.resumeLink} target="_blank" rel="noopener noreferrer" underline="hover">
                    View Resume
                  </Link>
                </Box>

                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleWithdraw(app._id)}
                  >
                    Withdraw
                  </Button>
                </Box>
              </CardContent>
            </Card>

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
  );
}

export default MyApplications;
