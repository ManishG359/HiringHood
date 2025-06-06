import { Button, TextField, Typography, Container, Box, Card, CardContent, IconButton, InputAdornment } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { login } from '../../services/authService';
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

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required')
});

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const data = await login(values.email, values.password);
      localStorage.setItem('token', data.token);
      const userWithCompany = {
        ...data.user,
        companyId: data.user.companyId || data.user.company?._id
      };
      localStorage.setItem('user', JSON.stringify(userWithCompany));
      //  Redirection based on Role
      if (data.user.role === 'seeker') {
        navigate('/seeker/dashboard');
      } else if (data.user.role === 'employer') {
        navigate('/employer/dashboard');
      } else {
        navigate('/'); 
      }
    } catch (error: any) {
      alert('Login failed: ' + (error.response?.data?.error || error.message));
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
              Welcome Back to JobBoardX
            </Typography>
            <Typography variant="subtitle1" align="center" gutterBottom color="text.secondary">
              Login to your account
            </Typography>

            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={LoginSchema}
              onSubmit={handleLogin}
            >
              {({ errors, touched }) => (
                <Form>
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

                  <StyledButton type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
                    Login
                  </StyledButton>
                </Form>
              )}
            </Formik>
            <Box mt={2} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <NavText onClick={() => navigate('/register')}>
                  Sign Up
                </NavText>
              </Typography>
            </Box>
          </CardContent>
        </StyledCard>
      </Container>
    </Box>
  );
}

export default Login;