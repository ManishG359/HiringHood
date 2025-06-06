import { Container, Typography, Box, Card, CardContent, Button, TextField, MenuItem, CircularProgress, Snackbar, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { SetStateAction, useState } from 'react';
import { postJob, optimizeJobDescription } from '../../services/jobService'; 
import { useNavigate } from 'react-router-dom'; 
import BackToDashboardButton from '../../components/BackToEmployerDashboard';
import styled from 'styled-components';

type JobPostOptimizerProps = {
  initialDescription: string;
  companyId: string;
  onOptimized: (text: string | null) => void; 
};
const PageBackground = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(120deg, #FAFFCA 0%, #B9D4AA 40%, #84AE92 100%);
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
`;

const StyledCard = styled(Card)`
  border-radius: 18px !important;
  box-shadow: 0 6px 24px 0 rgba(90, 130, 126, 0.12) !important;
  background: #FAFFCA !important;
 `;

const StyledButton = styled(Button)`
  background: linear-gradient(90deg, #5A827E 60%, #84AE92 100%);
  color: #fff !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  font-size: 0.95rem !important;
  padding: 6px 16px !important;
  margin: 0.5rem 0 !important;
  box-shadow: none !important;
  min-height: 36px !important;
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
  font-size: 0.95rem !important;
  padding: 6px 16px !important;
  margin: 0.5rem 0 !important;
  background: #fff !important;
  min-height: 36px !important;
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
const StyledTextField = styled(TextField)`
  & .MuiInputBase-root {
    background: #FAFFCA;
    transition: background 0.2s;
  }
  & .MuiInputBase-root:hover,
  & .MuiInputBase-root.Mui-focused {
    background: #fff;
  }
`;
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
      const result = await optimizeJobDescription(initialDescription, companyId);
      
      if (result && result.optimizedDescription) {
        onOptimized(result.optimizedDescription);
      } else {
        throw new Error("No optimization result received");
      }
    } catch (err) {
      
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'object' && err !== null && 'response' in err) {
        
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
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
    <PageBackground />
    <Container maxWidth="lg" sx={{ pt: 8 }}>
      <BackToDashboardButton />

      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <StyledCard>
          <CardContent>
            <SectionTitle variant="h4" mb={4}>
              Post a New Job 🚀
            </SectionTitle>

            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
              {({ touched, errors, values, setFieldValue }) => (
                <Form>
                  <Box display="flex" flexDirection="column" gap={3}>
                    <StyledTextField
                      as={TextField}
                      label="Job Title"
                      name="title"
                      fullWidth
                      error={touched.title && Boolean(errors.title)}
                      helperText={touched.title && errors.title}
                    />

                    <StyledTextField
                      as={TextField}
                      label="Company Name"
                      name="company"
                      fullWidth
                      error={touched.company && Boolean(errors.company)}
                      helperText={touched.company && errors.company}
                    />

                    <StyledTextField
                      as={TextField}
                      label="Location"
                      name="location"
                      fullWidth
                      error={touched.location && Boolean(errors.location)}
                      helperText={touched.location && errors.location}
                    />

                    <StyledTextField
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
                    </StyledTextField>

                    <StyledTextField
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
                      <OutlinedButton
                        onClick={() => {
                          if (values.description.trim()) setShowOptimizer(!showOptimizer);
                        }}
                        disabled={!values.description.trim()}
                        endIcon={showOptimizer ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        fullWidth
                      >
                        {showOptimizer ? 'Hide' : 'Show'} AI Powered Job Description
                      </OutlinedButton>
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
                              <StyledButton
                                onClick={() => {
                                  setFieldValue('description', optimizedDescription);
                                  setShowOptimizer(false);
                                }}
                              >
                                Apply
                              </StyledButton>
                              <OutlinedButton
                                onClick={() => {
                                  setOptimizedDescription(null);
                                  // Optional: track rejection for analytics
                                  console.log('User rejected AI suggestion');
                                }}
                              >
                                Reject
                              </OutlinedButton>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Collapse>

                    <StyledTextField
                      as={TextField}
                      label="Salary (optional)"
                      name="salary"
                      fullWidth
                    />

                    <StyledButton type="submit" fullWidth disabled={loading}>
                      {loading ? <CircularProgress size={24} /> : 'Post Job'}
                    </StyledButton>
                  </Box>
                </Form>
              )}
            </Formik>
          </CardContent>
        </StyledCard>

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
  </Box>
  );
}

export default PostJob;
