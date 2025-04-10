import { AppBar, Toolbar, Typography, Button, IconButton, Stack, Drawer, List, ListItem, ListItemText, Container } from '@mui/material';
import { Route, Routes, Link as RouterLink } from 'react-router-dom';
import Home from './pages/Home';
import AddTransaction from './pages/AddTransaction';
import { Brightness4, Brightness7, Menu as MenuIcon } from '@mui/icons-material';
import { useState } from 'react';

type AppProps = {
  toggleMode: () => void;
  mode: 'light' | 'dark';
};

function App({ toggleMode, mode }: AppProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <>
      {/* AppBar is now outside Container, so it stretches full width */}
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
          {/* App title */}
          <Typography variant="h6" component="div" sx={{ flexGrow: { xs: 1, sm: 0 } }}>
            Finance Tracker
          </Typography>

          {/* Desktop Navigation */}
          <Stack direction="row" spacing={2} sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
            <Button color="inherit" component={RouterLink} to="/">
              Home
            </Button>
            <Button color="inherit" component={RouterLink} to="/add">
              Add Transaction
            </Button>
            <IconButton color="inherit" onClick={toggleMode}>
              {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
            </IconButton>
          </Stack>

          {/* Mobile Menu Icon */}
          <IconButton
            color="inherit"
            sx={{ display: { xs: 'block', sm: 'none' } }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
  <List sx={{ width: 250, p: 2 }}>
    {/* Mobile Menu Items */}
    <ListItem
      button
      component={RouterLink}
      to="/"
      onClick={toggleDrawer(false)}
      sx={{
        mb: 1,
        borderRadius: 2,
        bgcolor: 'background.paper',
        '&:hover': {
          bgcolor: 'primary.main',
          color: 'white',
        },
        transition: 'all 0.3s',
      }}
    >
      <ListItemText primary="Home" primaryTypographyProps={{ fontWeight: 'bold' }} />
    </ListItem>

    <ListItem
      button
      component={RouterLink}
      to="/add"
      onClick={toggleDrawer(false)}
      sx={{
        mb: 1,
        borderRadius: 2,
        bgcolor: 'background.paper',
        '&:hover': {
          bgcolor: 'primary.main',
          color: 'white',
        },
        transition: 'all 0.3s',
      }}
    >
      <ListItemText primary="Add Transaction" primaryTypographyProps={{ fontWeight: 'bold' }} />
    </ListItem>

    <ListItem
      button
      onClick={() => {
        toggleMode();
        setDrawerOpen(false);
      }}
      sx={{
        borderRadius: 2,
        bgcolor: 'background.paper',
        '&:hover': {
          bgcolor: 'primary.main',
          color: 'white',
        },
        transition: 'all 0.3s',
      }}
    >
      <ListItemText
        primary={mode === 'light' ? 'Dark Mode' : 'Light Mode'}
        primaryTypographyProps={{ fontWeight: 'bold' }}
      />
    </ListItem>
  </List>
</Drawer>


      {/* Main Content inside Container */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddTransaction />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
