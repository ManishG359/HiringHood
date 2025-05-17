import { Box, Typography, IconButton } from '@mui/material';
import { GitHub, LinkedIn, Email } from '@mui/icons-material';
import styled from 'styled-components';



const FooterContainer = styled(Box)<{ component?: React.ElementType }>`
  padding: 1rem 0;
  text-align: center;
  background-color: ${({ theme }) => theme.palette.background.default};
  color: ${({ theme }) => theme.palette.text.primary};
`;

const Footer = () => {
 


  return (
    <FooterContainer component="footer">
      <Typography variant="body2" sx={{ mb: 1 }}>
        © {new Date().getFullYear()} Frontend Showcase. Built with ❤️ using React + MUI.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1 }}>
        <IconButton color="inherit" href="https://github.com/ManishG359/HiringHood/tree/main" target="_blank" aria-label="GitHub">
          <GitHub />
        </IconButton>
        <IconButton color="inherit" href="https://www.linkedin.com/in/manish-chandra-guturu/" target="_blank" aria-label="LinkedIn">
          <LinkedIn />
        </IconButton>
        <IconButton color="inherit" href="mailto:manish.guturu@hiringhood.com" aria-label="Email">
          <Email />
        </IconButton>
       
      </Box>
    </FooterContainer>
  );
};

export default Footer;
