import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Card, CardContent, Button, TextField,
  MenuItem, CircularProgress, Snackbar
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { fetchJobById, updateJob } from '../../services/jobService';

function EditJob() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [successOpen, setSuccessOpen] = useState(false);

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

  useEffect(() => {
    const getJobDetails = async () => {
      try {
        if (id) {
          const data = await fetchJobById(id);
          setInitialValues({
            title: data.title,
            company: data.company,
            location: data.location,
            role: data.role,
            description: data.description,
            salary: data.salary || '',
          });
        }
      } catch (error) {
        console.error('❌ Failed to fetch job:', error);
      } finally {
        setLoading(false);
      }
    };

    getJobDetails();
  }, [id]);

  const handleSubmit = async (values: any) => {
    try {
      if (id) {
        await updateJob(id, values);
        setSuccessOpen(true);
        setTimeout(() => {
          navigate('/employer/manage-jobs');
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Failed to update job:', error);
    }
  };

  if (loading || !initialValues) {
    return (
      <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Card elevation={6} sx={{ borderRadius: 4, p: 3 }}>
        <CardContent>
          <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
            Edit Job 🛠️
          </Typography>

          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
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
                  <Button type="submit" variant="contained" fullWidth>
                    Update Job
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
          Job updated successfully! 🎯
        </Box>
      </Snackbar>
    </Container>
  );
}

export default EditJob;
