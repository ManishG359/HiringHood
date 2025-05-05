import { Button, TextField, Typography, Container, Box, MenuItem , Card, CardContent} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { register } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Minimum 6 characters').required('Required'),
  role: Yup.string().oneOf(['seeker', 'employer']).required('Required')
});

function Register() {
  const navigate = useNavigate();
  const handleRegister = async (values: { name: string; email: string; password: string; role: string }) => {
    try {
        const data = await register(values.name, values.email, values.password, values.role);
        console.log('✅ Register success:', data);
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
    sx={{ backgroundColor: '#f5f7fa' }}
  >
    <Container maxWidth="xs">
      <Card elevation={6} sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
            Create Account
          </Typography>
          <Typography variant="subtitle1" align="center" gutterBottom color="text.secondary">
            Join JobBoardX Today
          </Typography>

          <Formik
            initialValues={{ name: '', email: '', password: '', role: '' }}
            validationSchema={RegisterSchema}
            onSubmit={handleRegister}
          >
            {({ errors, touched }) => (
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
                    type="password"
                    fullWidth
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
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

                <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
                  Register
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

export default Register;
