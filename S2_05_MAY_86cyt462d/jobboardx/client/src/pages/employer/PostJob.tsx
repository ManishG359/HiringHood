import { Container, Typography, Box, Card, CardContent, Button, TextField, MenuItem, CircularProgress, Snackbar } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { postJob } from '../../services/jobService'; 
import { useNavigate } from 'react-router-dom'; 


function PostJob() {
  const [loading, setLoading] = useState<boolean>(false);
  const [successOpen, setSuccessOpen] = useState<boolean>(false);
  const navigate = useNavigate(); 
  const initialValues = {
    title: '',
    company: '',
    location: '',
    role: '',
    description: '',
    salary: '',
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Job title is required'),
    company: Yup.string().required('Company name is required'),
    location: Yup.string().required('Location is required'),
    role: Yup.string().required('Role is required'),
    description: Yup.string().required('Job description is required'),
    salary: Yup.number()
        .typeError('Salary must be a number') // Custom error message for non-numeric input
        .positive('Salary must be a positive number') // Ensure salary is positive
        .integer('Salary must be an integer') // Ensure salary is an integer
        .nullable(), 
  });

  const handleSubmit = async (values: typeof initialValues) => {
    setLoading(true);
    try {
      await postJob(values);
      setSuccessOpen(true);
      setTimeout(() => {
        setSuccessOpen(false);
        navigate('/employer/dashboard'); // Redirect to dashboard after posting
      }, 3000);
    } catch (error) {
      console.error('❌ Failed to post job:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      
      <Card elevation={6} sx={{ borderRadius: 4, p: 3 }}>
        <CardContent>
          <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
            Post a New Job 🚀
          </Typography>

          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ touched, errors }) => (
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

      {/* Success Snackbar */}
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
  );
}

export default PostJob;
