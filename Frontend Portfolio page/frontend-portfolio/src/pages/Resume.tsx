import { Box, Button, Container, Typography } from '@mui/material';

const Resume = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography sx={{mb:4 }}variant="h4" fontWeight="bold" textAlign="center" gutterBottom >
        View My Resume to Know More About Me
      </Typography>
      <Box
        sx={{
          height: '80vh',
          border: '1px solid #ccc',
          boxShadow: 3,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <iframe
          src="/Manish_Guturu_9063669100.pdf"
          title="Manish Guturu Resume"
          width="100%"
          height="100%"
          style={{ border: 'none' }}
        />
      </Box>
      <Box sx={{ mt:2,display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          href="/Manish_Guturu_9063669100.pdf"
          download
        >
          Download Resume
        </Button>
      </Box>
    </Container>
  );
};

export default Resume;
