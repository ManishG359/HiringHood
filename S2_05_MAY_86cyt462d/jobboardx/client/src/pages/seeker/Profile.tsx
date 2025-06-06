import { useEffect, useState } from 'react';
import { Container, Box, Typography, TextField, Button, Chip, Card, CardContent, CircularProgress, Snackbar } from '@mui/material';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { fetchMyProfile, updateProfile } from '../../services/profileService';
import { useNavigate } from 'react-router-dom';
const ProfileSchema = Yup.object().shape({
  fullName: Yup.string().required('Full Name is required'),
  bio: Yup.string().required('Bio is required'),
  skills: Yup.array().of(Yup.string()).min(1, 'At least one skill is required'),
  resumeLink: Yup.string().url('Must be a valid URL'),
  experience: Yup.string().required('Experience is required')
});

function Profile() {
  const navigate = useNavigate(); 
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [successOpen, setSuccessOpen] = useState<boolean>(false);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const data = await fetchMyProfile();
        setProfile(data?.profile || {});
      } catch (error) {
        console.error('❌ Failed to fetch profile', error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      await updateProfile(values);
      
      const updatedUser = { ...JSON.parse(localStorage.getItem('user') || '{}'), fullName: values.fullName };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setSuccessOpen(true);
      setTimeout(() => {
        navigate('/seeker/dashboard'); 
      }, 3000);
    } catch (error) {
      console.error('❌ Failed to update profile', error);
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
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Card elevation={6} sx={{ borderRadius: 4, p: 3 }}>
        <CardContent>
          <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">
            Edit Your Profile ✨
          </Typography>

          <Formik
           initialValues={{
            fullName: profile.fullName || '',
            bio: profile.bio || '',
            skills: profile.skills || [],
            resumeLink: profile.resumeLink || '',
            experience: profile.experience || '',
          }}
          
            validationSchema={ProfileSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched }) => (
              <Form>
                <Box display="flex" flexDirection="column" gap={3}>
                  <Field
                    as={TextField}
                    name="fullName"
                    label="Full Name"
                    fullWidth
                    error={touched.fullName && Boolean(errors.fullName)}
                    helperText={touched.fullName && errors.fullName}
                  />

                  <Field
                    as={TextField}
                    name="bio"
                    label="Bio"
                    fullWidth
                    multiline
                    rows={3}
                    error={touched.bio && Boolean(errors.bio)}
                    helperText={touched.bio && errors.bio}
                  />

                  <Box>
                    <Typography variant="subtitle1" mb={1}>
                      Skills
                    </Typography>
                    <FieldArray name="skills">
                      {({ push, remove }) => (
                        <Box>
                          <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                            {values.skills.map((skill: string, index: number) => (
                              <Chip
                                key={index}
                                label={skill}
                                onDelete={() => remove(index)}
                                color="primary"
                              />
                            ))}
                          </Box>
                         <TextField
                            label="Add Skill"
                            size="small"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                e.preventDefault();
                                const inputValue = (e.target as HTMLInputElement).value.trim();
                                if (inputValue) {
                                    push(inputValue); 
                                    (e.target as HTMLInputElement).value = '';
                                }
                                }
                            }}
                            />
                            <Typography variant="caption" color="text.secondary" mt={1}>
                                Press Enter to store skills
                                </Typography>
                          {touched.skills && errors.skills && (
                            <Typography color="error" variant="caption">
                              {errors.skills as string}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </FieldArray>
                  </Box>

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
                    name="experience"
                    label="Experience"
                    fullWidth
                    error={touched.experience && Boolean(errors.experience)}
                    helperText={touched.experience && errors.experience}
                  />

                  <Button type="submit" variant="contained" size="large">
                    Save Changes
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>

      {/* Success Toast */}
      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} 
      >
        <Box
          sx={{
            backgroundColor: '#4caf50', 
            padding: '16px',
            borderRadius: '8px',
            fontSize: '1.2rem', 
            textAlign: 'center',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
          }}
        >
          🎉 Profile updated successfully!
        </Box>
      </Snackbar>
    </Container>
  );
}

export default Profile;
