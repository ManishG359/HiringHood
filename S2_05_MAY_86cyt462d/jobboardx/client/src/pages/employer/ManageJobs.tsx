import { useEffect, useState } from 'react';
import { Typography, Box, Stack, CircularProgress, Snackbar } from '@mui/material';
import { fetchMyJobs, deleteJob } from '../../services/jobService'; 
import { useNavigate } from 'react-router-dom';
import BackToDashboardButton from '../../components/BackToEmployerDashboard';
import styled from 'styled-components';
import { Card, CardContent, Button, Container } from '@mui/material';


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
  max-width: 900px !important;
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
  padding: 8px 20px !important;
  margin: 0.25rem 0 !important;
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
  padding: 8px 20px !important;
  margin: 0.25rem 0 !important;
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

function ManageJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  useEffect(() => {
    const getJobs = async () => {
      try {
        const data = await fetchMyJobs();
        setJobs(data);
      } catch (error) {
        console.error('❌ Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    getJobs();
  }, []);

  const handleDelete = async (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await deleteJob(jobId);
        setJobs(prev => prev.filter(job => job._id !== jobId));
        setSnackbarOpen(true);
      } catch (error) {
        console.error('❌ Failed to delete job:', error);
      }
    }
  };

  if (loading) {
    return (
      <>
        <PageBackground />
        <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', py: 4, position: 'relative' }}>
      <PageBackground />
      <StyledContainer>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <BackToDashboardButton />
        </Box>
        <SectionTitle variant="h4" fontWeight="bold" mb={4}>
          Manage Your Jobs 🛠️
        </SectionTitle>

        <Stack spacing={3}>
          {jobs.length === 0 ? (
            <Typography variant="h6" color="text.secondary" textAlign="center">
              You haven't posted any jobs yet!
            </Typography>
          ) : (
            jobs.map((job) => (
              <StyledCard key={job._id} elevation={4}>
                <CardContent>
                  <Typography variant="h5" fontWeight="bold" color="#5A827E">
                    {job.title}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {job.company} • {job.location} • {job.role}
                  </Typography>

                  {job.salary && (
                    <Typography variant="body2" color="text.secondary">
                      Salary: {job.salary}
                    </Typography>
                  )}

                  {job.hiringTimeline && (
                    <Box mt={2} mb={2}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Hiring Timeline:</strong> {job.hiringTimeline.calculatedDays} days
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Dates:</strong> {job.hiringTimeline.calculatedDates?.join(', ') || 'N/A'}
                      </Typography>
                    </Box>
                  )}

                  <Box display="flex" gap={2} mt={2} mb={2} flexWrap="wrap">
                    <StyledButton
                      size="small"
                      onClick={() => navigate(`/employer/timeline/${job._id}`)}
                    >
                      Manage Timeline
                    </StyledButton>
                    <Box flexGrow={1} />
                    <OutlinedButton
                      size="small"
                      onClick={() => navigate(`/employer/edit-job/${job._id}`)}
                    >
                      Edit
                    </OutlinedButton>
                    <OutlinedButton
                      size="small"
                      sx={{ borderColor: '#d32f2f !important', color: '#d32f2f !important' }}
                      onClick={() => handleDelete(job._id)}
                    >
                      Delete
                    </OutlinedButton>
                    <StyledButton
                      size="small"
                      onClick={() => navigate(`/employer/view-applicants/${job._id}`)}
                    >
                      View Applicants
                    </StyledButton>
                  </Box>
                </CardContent>
              </StyledCard>
            ))
          )}
        </Stack>

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
            Job deleted successfully! 🎯
          </Box>
        </Snackbar>
      </StyledContainer>
    </Box>
  );
}

export default ManageJobs;