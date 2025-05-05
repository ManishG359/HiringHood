import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Card, CardContent, Button, CircularProgress } from '@mui/material';
import { fetchJobById } from '../../services/jobService';
import BackToDashboardButton from '../../components/BackToSeekerDashboard';
interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  role: string;
  salary: string;
  description: string;
}

function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getJob = async () => {
      try {
        if (id) {
          const data = await fetchJobById(id);
          setJob(data);
        }
      } catch (error) {
        console.error('❌ Failed to fetch job:', error);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    getJob();
  }, [id]);

  if (loading) {
    return (
      <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!job) {
    return (
      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <Typography variant="h5" color="error" textAlign="center">
          Job not found. 🙁
        </Typography>
        <Box textAlign="center" mt={2}>
          <Button variant="contained" onClick={() => navigate('/jobs')}>
            Back to Jobs
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
       <BackToDashboardButton />
      <Card elevation={6} sx={{ borderRadius: 4, p: 3 }}>
        <CardContent>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {job.title}
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {job.company} • {job.location}
          </Typography>
          <Typography variant="body1" mb={2}>
            {job.role} • {job.salary}
          </Typography>

          <Typography variant="h6" fontWeight="bold" mt={4} mb={1}>
            Job Description
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {job.description}
          </Typography>

          <Box mt={4} display="flex" justifyContent="center">
            <Button variant="contained" onClick={() => navigate(`/apply/${job._id}`)}>
                Apply Now
            </Button>
            </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default JobDetails;
