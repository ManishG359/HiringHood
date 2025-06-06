import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Card, CardContent, Button, CircularProgress } from '@mui/material';
import styled from 'styled-components';
import BackToDashboardButton from '../../components/BackToSeekerDashboard';
import TimelineSummary from './TimelineSummary';
import { fetchJobById } from '../../services/jobService';

const PageBackground = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(120deg, #FAFFCA 0%, #B9D4AA 40%, #84AE92 100%);
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
`;

const TimelineSummaryWrapper = styled.div`
  background: #5A827E;
  border-radius: 12px;
  padding: 1.5rem 1.5rem;
  margin: 2rem 2 rem ;
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

const SectionTitle = styled(Typography)`
  color: #5A827E;
  font-weight: 700 !important;
  margin-bottom: 1.5rem !important;
  text-align: center;
`;

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  role: string;
  salary: string;
  description: string;
  hiringTimeline?: {
    startDate?: string;
    calculatedDays?: number;
    calculatedDates?: string[];
    candidates?: number;
  };
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
        setJob(null);
      } finally {
        setLoading(false);
      }
    };
    getJob();
  }, [id]);

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

  if (!job) {
    return (
      <>
        <PageBackground />
        <Container maxWidth="sm" sx={{ mt: 6 }}>
          <StyledCard elevation={6}>
            <CardContent>
              <Typography variant="h5" color="error" textAlign="center">
                Job not found.
              </Typography>
              <Box textAlign="center" mt={2}>
                <StyledButton variant="contained" onClick={() => navigate('/jobs')}>
                  Back to Jobs
                </StyledButton>
              </Box>
            </CardContent>
          </StyledCard>
        </Container>
      </>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', py: 4, position: 'relative' }}>
      <PageBackground />
      <Container maxWidth="md" sx={{ mt: 6 }}>
        <Box mb={2} display="flex">
          <BackToDashboardButton />
        </Box>
        <StyledCard elevation={6}>
          <CardContent>
            <SectionTitle variant="h4" gutterBottom>
              {job.title}
            </SectionTitle>
            <Typography variant="h6" color="text.secondary" gutterBottom align="center">
              {job.company} • {job.location}
            </Typography>
            <Typography variant="body1" mb={2} align="center">
              {job.role} • {job.salary}
            </Typography>
            <Typography variant="h6" fontWeight="bold" mt={4} mb={1}>
              Job Description
            </Typography>
            <Typography variant="body2" fontWeight="bold" color="text.secondary" mb={2}>
              {job.description}
            </Typography>
            <TimelineSummaryWrapper>
            <TimelineSummary
              startDate={job?.hiringTimeline?.startDate}
              calculatedDays={job?.hiringTimeline?.calculatedDays}
              calculatedDates={job?.hiringTimeline?.calculatedDates}
              candidates={job?.hiringTimeline?.candidates}
            />
            </TimelineSummaryWrapper>
            <Box mt={4} display="flex" justifyContent="center">
              <StyledButton variant="contained" onClick={() => navigate(`/apply/${job._id}`)}>
                Apply Now
              </StyledButton>
            </Box>
          </CardContent>
        </StyledCard>
      </Container>
    </Box>
  );
}

export default JobDetails;