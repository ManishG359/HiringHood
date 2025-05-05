import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Avatar,
  Stack,
  Button,Dialog, DialogTitle, DialogContent,
  DialogActions, Snackbar, Alert,Box
} from '@mui/material';
import { fetchAllApplicantsForEmployer } from '../../services/applicationService';
import Grid from '@mui/material/GridLegacy';
import BackToDashboardButton from '../../components/BackToEmployerDashboard';
interface Applicant {
  _id: string;
  fullName: string;
  email: string;
  resumeLink: string;
  jobTitle: string;
  jobId: string;
  coverLetter?: string;
}

const EmployerApplicantsPage: React.FC = () => {
const [applicants, setApplicants] = useState<Applicant[]>([]);
const [loading, setLoading] = useState(true);
const [snackbarOpen, setSnackbarOpen] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState('');
const [snackbarType, setSnackbarType] = useState<'success' | 'error' | 'info' | 'warning'>('info');

const [dialogOpen, setDialogOpen] = useState(false);
const [selectedApplicant, setSelectedApplicant] = useState<any>(null);



  useEffect(() => {
    const loadApplicants = async () => {
      try {
        const data = await fetchAllApplicantsForEmployer();
        console.log('Fetched applicants:', data);
        setApplicants(data);
      } catch (error) {
        console.error('Failed to fetch applicants:', error);
        setSnackbarMessage('Failed to load applicants.');
        setSnackbarType('error');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    loadApplicants();
    
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
        <BackToDashboardButton />
      <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
        👥 All Applicants
      </Typography>

      {loading ? (
        <Stack alignItems="center" mt={5}>
          <CircularProgress />
        </Stack>
      ) : applicants.length === 0 ? (
        <Typography textAlign="center" color="text.secondary" mt={4}>
          No applicants found yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {applicants.map((applicant) => (
            <Grid item xs={12} sm={6} md={4} key={applicant._id}>
              <Card elevation={4}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <Avatar>{applicant.fullName.charAt(0)}</Avatar>
                    <div>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {applicant.fullName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {applicant.email}
                      </Typography>
                    </div>
                  </Stack>
                  <Typography variant="body2" gutterBottom>
                    <strong>Job:</strong> {applicant.jobTitle}
                  </Typography>
                  {applicant.coverLetter && (
                    <Typography variant="body2" gutterBottom>
                      <strong>Cover Letter:</strong> {applicant.coverLetter.slice(0, 80)}...
                    </Typography>
                  )}
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                    href={applicant.resumeLink}
                    target="_blank"
                    rel="noopener"
                  >
                    View Resume
                  </Button>
                  <Button variant="text" onClick={() => {
                  setSelectedApplicant(applicant);
                  setDialogOpen(true);
                }}>
                  View Details
                </Button>
                
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
           <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>📄 Applicant Details</DialogTitle>
        <DialogContent dividers>
          {selectedApplicant && (
            <>
              <Typography variant="h6">{selectedApplicant.fullName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedApplicant.email}
              </Typography>
              <Box mt={2}>
                <Typography variant="subtitle2">Cover Letter:</Typography>
                <Typography variant="body2">
                  {selectedApplicant.coverLetter || 'No cover letter provided.'}
                </Typography>
              </Box>
              <Box mt={2}>
                <Button
                  variant="contained"
                  href={selectedApplicant.resumeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Resume
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarType}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar> 
    </Container>
    
  );
};

export default EmployerApplicantsPage;
