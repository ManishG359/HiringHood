import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Card, CardContent, Button, TextField, CircularProgress, Snackbar } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { applyToJob } from '../../services/applicationService';
import { useState } from 'react';
import TimelineSummary from './TimelineSummary';



function ApplyJobs() {
  const { id: jobId } = useParams<{ id: string }>();
  const [job] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [successOpen, setSuccessOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const initialValues = {
    resumeLink: '',
    coverLetter: '',
  };
  
  const validationSchema = Yup.object().shape({
    resumeLink: Yup.string().url('Enter a valid URL').required('Resume link is required'),
    coverLetter: Yup.string(),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    setLoading(true);
    try {
      if (jobId) {
        await applyToJob({ jobId, ...values });
        setSuccessOpen(true);
        setTimeout(() => {
          navigate('/jobs');
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Failed to apply:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!jobId) {
    return (
      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <Typography variant="h5" color="error" textAlign="center">
          Invalid Job ID.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Card elevation={6} sx={{ borderRadius: 4, p: 3 }}>
        <CardContent>
          <TimelineSummary
              startDate={job?.hiringTimeline?.startDate}
              calculatedDays={job?.hiringTimeline?.calculatedDays}
              calculatedDates={job?.hiringTimeline?.calculatedDates}
              candidates={job?.hiringTimeline?.candidates}
            />
          <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">
            Apply to Job
          </Typography>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ touched, errors }) => (
              <Form>
                <Box display="flex" flexDirection="column" gap={3}>
                  <Field
                    as={TextField}
                    name="resumeLink"
                    label="Resume Link"
                    fullWidth
                    error={touched.resumeLink && Boolean(errors.resumeLink)}
                    helperText={touched.resumeLink && errors.resumeLink}
                  />

                  <Field
                    as={TextField}
                    name="coverLetter"
                    label="Cover Letter (optional)"
                    multiline
                    rows={4}
                    fullWidth
                  />

                  <Button type="submit" variant="contained" fullWidth disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Submit Application'}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>

      <Snackbar
  open={successOpen}
  autoHideDuration={3000}
  onClose={() => setSuccessOpen(false)}
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
    🎉 Application submitted successfully!
  </Box>
</Snackbar>
    </Container>
  );
}

export default ApplyJobs;
