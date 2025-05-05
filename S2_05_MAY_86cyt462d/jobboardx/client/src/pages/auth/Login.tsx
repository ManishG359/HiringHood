import { Button, TextField, Typography, Container, Box , Card, CardContent  } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { login } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required')
});

function Login() {
  const navigate = useNavigate();
  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const data = await login(values.email, values.password);
      console.log('✅ Login success:', data);
  
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
  
      //  Redirection based on Role
      if (data.user.role === 'seeker') {
        navigate('/seeker/dashboard');
      } else if (data.user.role === 'employer') {
        navigate('/employer/dashboard');
      } else {
        navigate('/'); 
      }
  
    } catch (error: any) {
      console.error('❌ Login failed:', error.response?.data?.error || error.message);
      alert('Login failed: ' + (error.response?.data?.error || error.message));
    }
  };
  


  return (
    <Box
    minHeight="100vh"
    display="flex"
    justifyContent="center"
    alignItems="center"
    sx={{ backgroundColor: '#f5f7fa' }}
  >
    <Container maxWidth="xs">
      <Card elevation={6} sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom fontWeight="bold" fontSize={24}>
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
                    type="password"
                    fullWidth
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                  />
                </Box>

                <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
                  Login
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Container>
  </Box>
);
}

export default Login;