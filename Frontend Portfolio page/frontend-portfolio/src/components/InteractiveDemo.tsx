//optional
import { useState } from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const demoCode = `const [open, setOpen] = useState(false);

return (
  <>
    <Button onClick={() => setOpen(true)}>Open Modal</Button>
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box sx={{
        p: 3, backgroundColor: 'white', borderRadius: 2, maxWidth: 400, mx: 'auto', mt: '15%'
      }}>
        <Typography>This is a demo modal!</Typography>
      </Box>
    </Modal>
  </>
);`;

const InteractiveDemo = () => {
  const [open, setOpen] = useState(false);

  return (
    <Box
      sx={{
        mt: 6,
        p: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 2,
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        color: 'white',
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
        sx={{ mb: 3 }}
      >
        Interactive Demo
      </Typography>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{
            backgroundColor: '#1565c0',
            color: 'white',
            '&:hover': {
              backgroundColor: '#0d47a1',
            },
          }}
        >
          Open Demo Modal
        </Button>
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box
            sx={{
              p: 3,
              backgroundColor: 'white',
              borderRadius: 2,
              maxWidth: 400,
              mx: 'auto',
              mt: '15%',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              textAlign="center"
              gutterBottom
            >
              This is a demo modal!
            </Typography>
            <Typography variant="body2" textAlign="center">
              You can use this modal to showcase interactive features in your
              portfolio.
            </Typography>
          </Box>
        </Modal>
      </Box>
      <Typography
        variant="h6"
        fontWeight="bold"
        gutterBottom
        sx={{ mb: 2, textAlign: 'center' }}
      >
        Code Example:
      </Typography>
      <Box
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: 2,
          p: 2,
          overflowX: 'auto',
        }}
      >
        <SyntaxHighlighter language="tsx" style={materialDark}>
          {demoCode}
        </SyntaxHighlighter>
      </Box>
    </Box>
  );
};

export default InteractiveDemo;