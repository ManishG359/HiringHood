import { Container, Typography, Box, Card, CardContent, Button, TextField, MenuItem, CircularProgress, Snackbar, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { SetStateAction, useState } from 'react';
import { postJob, optimizeJobDescription } from '../../services/jobService'; 
import { useNavigate } from 'react-router-dom'; 

import BackToDashboardButton from '../../components/BackToEmployerDashboard';

type JobPostOptimizerProps = {
  initialDescription: string;
  companyId: string;
  onOptimized: (text: string | null) => void; // Ensure this matches the usage in PostJob.tsx
};

const JobPostOptimizer: React.FC<JobPostOptimizerProps> = ({ initialDescription, companyId, onOptimized }) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOptimization = async () => {
    try {
      setIsOptimizing(true);
      setError(null);
      
      if (!initialDescription.trim()) {
        throw new Error("Please provide a job description to optimize");
      }
      
      if (!companyId) {
        throw new Error("Company information is missing");
      }
      
      // Call the API endpoint for job description optimization
      const result = await optimizeJobDescription(initialDescription, companyId);
      
      // Extract the optimized description from the response
      if (result && result.optimizedDescription) {
        onOptimized(result.optimizedDescription);
      } else {
        throw new Error("No optimization result received");
      }
    } catch (err) {
      // Handle different types of errors
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'object' && err !== null && 'response' in err) {
        // Axios error handling
        const axiosError = err as any;
        const errorMessage = axiosError.response?.data?.message || 
                            axiosError.response?.data?.error || 
                            'Failed to optimize description';
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Optimization error:", err);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <Box>
      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleOptimization}
        startIcon={<span role="img" aria-label="magic">✨</span>}
        disabled={isOptimizing}
      >
        {isOptimizing ? (
          <>
            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
            Optimizing...
          </>
        ) : (
          "Generate Optimized Description"
        )}
      </Button>
    </Box>
  );
};

function PostJob() {
  const [loading, setLoading] = useState<boolean>(false);
  const [successOpen, setSuccessOpen] = useState<boolean>(false);
  const [optimizedDescription, setOptimizedDescription] = useState<string | null>(null);
  const [showOptimizer, setShowOptimizer] = useState(false);
  const navigate = useNavigate(); 
  const initialValues = {
    title: '',
    company: '',
    location: '',
    role: '',
    description: '',
    salary: '',
  };
  const user = JSON.parse(localStorage.getItem('user') || '{}');
 
  const validationSchema = Yup.object({
    title: Yup.string().required('Job title is required'),
    company: Yup.string().required('Company name is required'),
    location: Yup.string().required('Location is required'),
    role: Yup.string().required('Role is required'),
    description: Yup.string().required('Job description is required'),
    salary: Yup.number()
      .typeError('Salary must be a number')
      .positive('Salary must be a positive number')
      .integer('Salary must be an integer')
      .nullable(), 
  });

  const handleSubmit = async (values: typeof initialValues) => {
    setLoading(true);
    try {
      await postJob(values);
      setSuccessOpen(true);
      setTimeout(() => {
        setSuccessOpen(false);
        navigate('/employer/dashboard');
      }, 3000);
    } catch (error) {
      console.error('❌ Failed to post job:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <BackToDashboardButton />

      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <Card elevation={6} sx={{ borderRadius: 4, p: 3 }}>
          <CardContent>
            <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
              Post a New Job 🚀
            </Typography>

            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
              {({ touched, errors, values, setFieldValue }) => (
                <Form>
                  <Box display="flex" flexDirection="column" gap={3}>
                    <Field
                      as={TextField}
                      label="Job Title"
                      name="title"
                      fullWidth
                      error={touched.title && Boolean(errors.title)}
                      helperText={touched.title && errors.title}
                    />

                    <Field
                      as={TextField}
                      label="Company Name"
                      name="company"
                      fullWidth
                      error={touched.company && Boolean(errors.company)}
                      helperText={touched.company && errors.company}
                    />

                    <Field
                      as={TextField}
                      label="Location"
                      name="location"
                      fullWidth
                      error={touched.location && Boolean(errors.location)}
                      helperText={touched.location && errors.location}
                    />

                    <Field
                      as={TextField}
                      label="Role"
                      name="role"
                      fullWidth
                      select
                      error={touched.role && Boolean(errors.role)}
                      helperText={touched.role && errors.role}
                    >
                      <MenuItem value="Full-time">Full-time</MenuItem>
                      <MenuItem value="Part-time">Part-time</MenuItem>
                      <MenuItem value="Contract">Contract</MenuItem>
                      <MenuItem value="Internship">Internship</MenuItem>
                    </Field>

                    <Field
                      as={TextField}
                      label="Job Description"
                      name="description"
                      multiline
                      rows={4}
                      fullWidth
                      error={touched.description && Boolean(errors.description)}
                      helperText={touched.description && errors.description}
                    />

                    <Box sx={{ mt: 1, mb: 1 }}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          if (values.description.trim()) setShowOptimizer(!showOptimizer);
                        }}
                        disabled={!values.description.trim()}
                        endIcon={showOptimizer ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        fullWidth
                      >
                        {showOptimizer ? 'Hide' : 'Show'} AI Powered Job Description
                      </Button>
                    </Box>

                    <Collapse in={showOptimizer}>
                      <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, mb: 2 }}>
                        {!optimizedDescription ? (
                          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                            <Typography variant="body1" gutterBottom>
                              Let AI help you create a more effective job description based on company feedback and best practices
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                              Our AI will analyze your job description and suggest improvements to attract better candidates
                            </Typography>
                            <JobPostOptimizer
                              initialDescription={values.description}
                              companyId={user.companyId}
                              onOptimized={(text: SetStateAction<string | null>) => setOptimizedDescription(text)}
                            />
                          </Box>
                        ) : (
                          <Box mt={2}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                              <span role="img" aria-label="sparkles" style={{ marginRight: '8px' }}>✨</span>
                              AI Suggested Job Description:
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              This optimized description is tailored based on best practices and your company's feedback
                            </Typography>
                            <TextField
                              multiline
                              rows={4}
                              fullWidth
                              value={optimizedDescription}
                              sx={{ mb: 2 }}
                              inputProps={{ readOnly: true }}
                            />
                            <Box display="flex" gap={2}>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                  setFieldValue('description', optimizedDescription);
                                  setShowOptimizer(false);
                                }}
                              >
                                Apply
                              </Button>
                              <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => {
                                  setOptimizedDescription(null);
                                  // Optional: track rejection for analytics
                                  console.log('User rejected AI suggestion');
                                }}
                              >
                                Reject
                              </Button>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Collapse>

                    <Field
                      as={TextField}
                      label="Salary (optional)"
                      name="salary"
                      fullWidth
                    />

                    <Button type="submit" variant="contained" fullWidth disabled={loading}>
                      {loading ? <CircularProgress size={24} /> : 'Post Job'}
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
            Job posted successfully! 🎉
          </Box>
        </Snackbar>
      </Container>
    </Container>
  );
}

export default PostJob;
