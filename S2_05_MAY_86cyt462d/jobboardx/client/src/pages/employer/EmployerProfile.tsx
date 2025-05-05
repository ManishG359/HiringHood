
import { useEffect, useState } from 'react';
import {
  Button,
  Box,
  Container,
  TextField,
  Typography,
  Paper,
  Stack,
  Snackbar
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { fetchMyProfile, updateProfile } from '../../services/profileService';
import { useNavigate } from 'react-router-dom';

const EmployerProfileSchema = Yup.object().shape({
  companyName: Yup.string().required('Company name is required'),
  about: Yup.string(),
  website: Yup.string().url('Invalid URL'),
  industry: Yup.string(),
  location: Yup.string()
});

function EmployerProfile() {
  const [initialValues, setInitialValues] = useState({
    companyName: '',
    about: '',
    website: '',
    industry: '',
    location: ''
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      const data = await fetchMyProfile();
      if (data && data.profile) {
        setInitialValues({
          companyName: data.profile.companyName || '',
          about: data.profile.about || '',
          website: data.profile.website || '',
          industry: data.profile.industry || '',
          location: data.profile.location || ''
        });
      }
    };

    loadProfile();
  }, []);

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await updateProfile(values);
      setSnackbarOpen(true);
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      console.error('❌ Failed to update employer profile:', err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Update Employer Profile 🏢
        </Typography>

        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={EmployerProfileSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <Stack spacing={3}>
                <Field
                  as={TextField}
                  name="companyName"
                  label="Company Name"
                  fullWidth
                  error={touched.companyName && !!errors.companyName}
                  helperText={touched.companyName && errors.companyName}
                />

                <Field
                  as={TextField}
                  name="about"
                  label="About the Company"
                  fullWidth
                  multiline
                  minRows={3}
                />

                <Field
                  as={TextField}
                  name="website"
                  label="Website"
                  fullWidth
                  error={touched.website && !!errors.website}
                  helperText={touched.website && errors.website}
                />

                <Field
                  as={TextField}
                  name="industry"
                  label="Industry"
                  fullWidth
                />

                <Field
                  as={TextField}
                  name="location"
                  label="Location"
                  fullWidth
                />

                <Button variant="contained" type="submit">
                  Save Profile
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Paper>
      <Snackbar
  open={snackbarOpen}
  autoHideDuration={3000}
  onClose={() => setSnackbarOpen(false)}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }} 
>
  <Box
    sx={{
      backgroundColor: '#4caf50', 
      color: '#fff',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '1.2rem', // Increase font size
      textAlign: 'center',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
    }}
  >
    ✅ Profile updated successfully!
  </Box>
</Snackbar>
    </Container>
  );
}

export default EmployerProfile;
