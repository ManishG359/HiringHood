import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Stack,
  CircularProgress,
  Link,
  Select,
  MenuItem,
} from '@mui/material';
import { fetchApplicantsByJobId, updateApplicationStatus } from '../../services/applicationService';

interface Applicant {
  _id: string;
  applicant: {
    name: string;
    email: string;
  };
  resumeLink: string;
  coverLetter: string;
  status: string;
  createdAt: string;
}

function ViewApplicants() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getApplicants = async () => {
      try {
        if (jobId) {
          const data = await fetchApplicantsByJobId(jobId);
          setApplicants(data);
        }
      } catch (error) {
        console.error('❌ Failed to fetch applicants:', error);
      } finally {
        setLoading(false);
      }
    };

    getApplicants();
  }, [jobId]);

  const handleStatusChange = async (appId: string, newStatus: string) => {
    try {
      await updateApplicationStatus(appId, newStatus);
      setApplicants((prev) =>
        prev.map((app) =>
          app._id === appId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      console.error('❌ Failed to update status', err);
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
    
      <Button variant="outlined" onClick={() => navigate('/employer/manage-jobs')} sx={{ mb: 4 }}>
        ← Back to Manage Jobs
      </Button>

      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
        Applicants 📄
      </Typography>

      <Stack spacing={3}>
        {applicants.length === 0 ? (
          <Typography variant="h6" color="text.secondary" textAlign="center">
            No applications received yet.
          </Typography>
        ) : (
          applicants.map((application) => (
            <Card key={application._id} elevation={4} sx={{ borderRadius: 4 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {application.applicant?.name || 'Unnamed'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {application.applicant?.email}
                </Typography>

                <Box mt={2}>
                  <Typography variant="body2" fontWeight="bold">Cover Letter:</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {application.coverLetter || 'No cover letter provided.'}
                  </Typography>
                </Box>

                <Box mt={2}>
                  <Link href={application.resumeLink} target="_blank" rel="noopener noreferrer">
                    View Resume
                  </Link>
                </Box>

                <Box mt={2}>
                  <Typography variant="body2" fontWeight="bold" gutterBottom>
                    Status:
                  </Typography>
                  <Select
                    size="small"
                    fullWidth
                    value={application.status}
                    onChange={(e) => handleStatusChange(application._id, e.target.value)}
                  >
                    <MenuItem value="Submitted">Submitted</MenuItem>
                    <MenuItem value="Under Review">Under Review</MenuItem>
                    <MenuItem value="Shortlisted">Shortlisted</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                    <MenuItem value="Hired">Hired</MenuItem>
                  </Select>
                </Box>

                <Typography variant="caption" color="text.secondary" display="block" mt={2}>
                  Applied on: {new Date(application.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>
    </Container>
  );
}

export default ViewApplicants;
