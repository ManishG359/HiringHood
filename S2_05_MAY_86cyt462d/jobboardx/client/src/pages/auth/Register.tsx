import { Button, TextField, Typography, Container, Box, MenuItem, Card, CardContent, IconButton, InputAdornment } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { register } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';


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
  background: linear-gradient(135deg, #FAFFCA 0%, #B9D4AA 100%);
`;

const StyledButton = styled(Button)`
  background: linear-gradient(90deg, #5A827E 60%, #84AE92 100%);
  color: #fff !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  padding: 10px 24px !important;
  margin: 0.5rem 0 !important;
  box-shadow: none !important;
  &:hover {
    background: linear-gradient(90deg, #84AE92 60%, #5A827E 100%);
    color: #fff !important;
    box-shadow: none !important;
  }
`;

const NavText = styled.span`
  cursor: pointer;
  font-weight: 600;
  font-size: 1.08rem;
  margin-left: 1.5rem;
  color: #5A827E;
  transition: color 0.2s, text-decoration 0.2s;
  &:hover {
    text-decoration: underline;
    color: #1976D2;
  }
`;

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Minimum 6 characters').required('Required'),
  role: Yup.string().oneOf(['seeker', 'employer']).required('Required'),
  companyName: Yup.string().when('role', {
    is: 'employer',
    then: schema => schema.required('Company name is required for employers'),
    otherwise: schema => schema.notRequired()
  })
});

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (values: { name: string; email: string; password: string; role: string; companyName: string }) => {
    try {
      const data = await register(values.name, values.email, values.password, values.role);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (error: any) {
      console.error('❌ Register failed:', error.response?.data?.error || error.message);
      alert('Register failed: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ position: 'relative' }}
    >
      <PageBackground />
      <Container maxWidth="xs">
        <StyledCard elevation={6}>
          <CardContent>
            <Typography variant="h4" align="center" gutterBottom fontWeight="bold" fontSize={24} color="#5A827E">
              Create Account
            </Typography>
            <Typography variant="subtitle1" align="center" gutterBottom color="text.secondary">
              Join JobBoardX Today
            </Typography>

            <Formik
              initialValues={{ name: '', email: '', password: '', role: '', companyName: '' }}
              validationSchema={RegisterSchema}
              onSubmit={handleRegister}
            >
              {({ values, errors, touched }) => (
                <Form>
                  <Box mb={2}>
                    <Field
                      as={TextField}
                      name="name"
                      label="Full Name"
                      fullWidth
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                    />
                  </Box>

                  <Box mb={2}>
                    <Field
                      as={TextField}
                      name="email"
                      label="Email"
                      fullWidth
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />
                  </Box>

                  <Box mb={2}>
                    <Field
                      as={TextField}
                      name="password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={showPassword ? "Hide password" : "Show password"}
                              onClick={() => setShowPassword((show) => !show)}
                              edge="end"
                              tabIndex={-1}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Box>

                  <Box mb={2}>
                    <Field
                      as={TextField}
                      select
                      name="role"
                      label="Role"
                      fullWidth
                      error={touched.role && Boolean(errors.role)}
                      helperText={touched.role && errors.role}
                    >
                      <MenuItem value="seeker">Job Seeker</MenuItem>
                      <MenuItem value="employer">Employer</MenuItem>
                    </Field>
                  </Box>
                  {values.role === 'employer' && (
                    <Box mb={2}>
                      <Field
                        as={TextField}
                        name="companyName"
                        label="Company Name"
                        fullWidth
                        error={touched.companyName && Boolean(errors.companyName)}
                        helperText={touched.companyName && errors.companyName}
                      />
                    </Box>
                  )}

                  <StyledButton type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
                    Register
                  </StyledButton>
                </Form>
              )}
            </Formik>
            <Box mt={2} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <NavText onClick={() => navigate('/login')}>
                  Login
                </NavText>
              </Typography>
            </Box>
          </CardContent>
        </StyledCard>
      </Container>
    </Box>
  );
}

export default Register;