import React, { useEffect, useState } from 'react';
import {Container,Typography,CardContent,CircularProgress,Avatar,Stack,Button,Dialog,DialogTitle,DialogContent,DialogActions,Snackbar,Alert,Box
} from '@mui/material';
import Grid from '@mui/material/Grid';
import BackToDashboardButton from '../../components/BackToEmployerDashboard';
import styled from 'styled-components';

interface Applicant {
  _id: string;
  fullName: string;
  email: string;
  resumeLink: string;
  jobTitle: string;
  jobId: string;
  coverLetter?: string;
}
const StyledCard = styled.div`
  border-radius: 18px;
  box-shadow: 0 6px 24px 0 rgba(90, 130, 126, 0.12);
  background: #FAFFCA;
  min-height: 240px;
  max-width: 340px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: box-shadow 0.2s;
  padding: 18px 16px 12px 16px;
`;

const StyledButton = styled(Button)`
  background: linear-gradient(90deg, #5A827E 60%, #84AE92 100%);
  color: #fff !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  font-size: 0.85rem !important;
  padding: 4px 10px !important;
  margin: 0.25rem 0 !important;
  box-shadow: none !important;
  min-height: 28px !important;
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
  font-size: 0.85rem !important;
  padding: 4px 10px !important;
  margin: 0.25rem 0 !important;
  background: #fff !important;
  min-height: 28px !important;
  &:hover {
    background: #e6f2ee !important;
    border-color: #1976d2 !important;
    color: #1976d2 !important;
  }
`;

const EmployerApplicantsPage: React.FC = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error' | 'info' | 'warning'>('info');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [openCoverLetterId, setOpenCoverLetterId] = useState<string | null>(null);

  useEffect(() => {
    const loadApplicants = async () => {
      try {
        // Replace with your actual fetch function
        const { fetchAllApplicantsForEmployer } = await import('../../services/applicationService');
        const data = await fetchAllApplicantsForEmployer();
        setApplicants(data);
      } catch (error) {
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
            <Grid sx ={{xs:12,sm:6,md:4}}  key={applicant._id}>
              <StyledCard>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <Typography variant="body2">
                      <strong>Cover Letter:</strong>
                    </Typography>
                    {applicant.coverLetter ? (
                      <OutlinedButton
                        size="small"
                        onClick={() =>
                          setOpenCoverLetterId(
                            openCoverLetterId === applicant._id ? null : applicant._id
                          )
                        }
                        sx={{ minWidth: 0, px: 1, fontSize: '0.85rem' }}
                      >
                        {openCoverLetterId === applicant._id ? 'Hide' : 'View'}
                      </OutlinedButton>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        NA
                      </Typography>
                    )}
                  </Stack>
                  {applicant.coverLetter && openCoverLetterId === applicant._id && (
                    <Box sx={{ mb: 1, background: '#fff', borderRadius: 1, p: 1, border: '1px solid #e0e0e0' }}>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                        {applicant.coverLetter}
                      </Typography>
                    </Box>
                  )}
                  <Stack direction="row" spacing={1} sx={{ mt: 'auto' }}>
                    {applicant.resumeLink ? (
                      <OutlinedButton
                        fullWidth
                        href={applicant.resumeLink}
                        
                        rel="noopener"
                      >
                        View Resume
                      </OutlinedButton>
                    ) : (
                      <OutlinedButton fullWidth disabled>
                        No CV
                      </OutlinedButton>
                    )}
                    <StyledButton
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        setSelectedApplicant(applicant);
                        setDialogOpen(true);
                      }}
                    >
                      View Details
                    </StyledButton>
                  </Stack>
                </CardContent>
              </StyledCard>
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
                {selectedApplicant.resumeLink ? (
                  <StyledButton
                    variant="contained"
                    href={selectedApplicant.resumeLink}
                    
                    rel="noopener noreferrer"
                  >
                    View Resume
                  </StyledButton>
                ) : (
                  <OutlinedButton disabled>No CV</OutlinedButton>
                )}
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <OutlinedButton onClick={() => setDialogOpen(false)}>
            Close
          </OutlinedButton>
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
