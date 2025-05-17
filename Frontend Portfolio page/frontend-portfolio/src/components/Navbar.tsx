import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import {
  Brightness4,
  Brightness7,
  GitHub,
  Email,
  LinkedIn,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useThemeMode } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const theme = useTheme();
  const { toggleTheme } = useThemeMode();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery('(max-width:600px)');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
  <Box
    component="img"
    src="/favicon.png"
    alt="App Icon"
    sx={{ width: 28, height: 28 }}
  />
  <Typography variant="h6" sx={{ fontWeight: 600 }}>
    Frontend Showcase
  </Typography>
</Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            display: { xs: 'none', sm: 'block' },
            color: theme.palette.text.primary,
          }}
        >
        </Typography>

        {isMobile ? (
          <>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: { backgroundColor: theme.palette.background.paper },
              }}
            >
              
              {/* Nav links */}
              <MenuItem onClick={() => handleNavigate('/')}>
                Projects
              </MenuItem>
              <MenuItem onClick={() => handleNavigate('/about')}>
                About
              </MenuItem>
              <MenuItem onClick={() => handleNavigate('/resume')}>
                Resume
              </MenuItem>

              {/* External links */}
              <MenuItem onClick={handleMenuClose}>
                <IconButton
                  color="inherit"
                  href="https://github.com/ManishG359/HiringHood/tree/main"
                  target="_blank"
                  aria-label="GitHub"
                >
                  <GitHub />
                </IconButton>
                GitHub
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <IconButton
                  color="inherit"
                  href="https://www.linkedin.com/in/manish-chandra-guturu/"
                  target="_blank"
                  aria-label="LinkedIn"
                >
                  <LinkedIn />
                </IconButton>
                LinkedIn
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <IconButton
                  color="inherit"
                  href="mailto:manish.guturu@hiringhood.com"
                  aria-label="Email"
                >
                  <Email />
                </IconButton>
                Email
              </MenuItem>

              {/* Theme toggle */}
              <MenuItem onClick={toggleTheme}>
                <IconButton color="inherit" aria-label="Toggle dark mode">
                  {isDark ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <motion.div whileHover={{ scale: 1.1 }}>
              <Button color="inherit" onClick={() => navigate('/')}>
                Projects
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }}>
              <Button color="inherit" onClick={() => navigate('/about')}>
                About
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }}>
              <Button color="inherit" onClick={() => navigate('/resume')}>
                Resume
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }}>
              <IconButton
                color="inherit"
                href="https://github.com/ManishG359/HiringHood/tree/main"
                target="_blank"
              >
                <GitHub />
              </IconButton>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }}>
              <IconButton
                color="inherit"
                href="https://www.linkedin.com/in/manish-chandra-guturu/"
                target="_blank"
              >
                <LinkedIn />
              </IconButton>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }}>
              <IconButton
                color="inherit"
                href="mailto:manish.guturu@hiringhood.com"
              >
                <Email />
              </IconButton>
            </motion.div>
            <motion.div whileHover={{ rotate: 20 }}>
              <IconButton color="inherit" onClick={toggleTheme}>
                {isDark ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </motion.div>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
