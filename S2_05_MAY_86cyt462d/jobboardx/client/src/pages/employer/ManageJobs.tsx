import { useEffect, useState } from 'react';
import { Container, Typography, Box, Card, CardContent, Button, Stack, CircularProgress, Snackbar } from '@mui/material';
import { fetchMyJobs, deleteJob } from '../../services/jobService'; 
import { useNavigate } from 'react-router-dom';
import BackToDashboardButton from '../../components/BackToEmployerDashboard';
interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  role: string;
  salary?: string;
}

function ManageJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
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
      <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <BackToDashboardButton />
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
        Manage Your Jobs 🛠️
      </Typography>

      <Stack spacing={3}>
        {jobs.length === 0 ? (
          <Typography variant="h6" color="text.secondary" textAlign="center">
            You haven't posted any jobs yet!
          </Typography>
        ) : (
          jobs.map((job) => (
            <Card key={job._id} elevation={4} sx={{ borderRadius: 4 }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold">
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

                <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
                  <Button variant="outlined" size="small" onClick={() => navigate(`/employer/edit-job/${job._id}`)}>
                    Edit
                  </Button>
                  <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(job._id)}>
                    Delete
                  </Button>
                  <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate(`/employer/view-applicants/${job._id}`)}
                >
                  View Applicants
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
    Job deleted successfully! 🎯
  </Box>
</Snackbar>
    </Container>
  );
}

export default ManageJobs;
